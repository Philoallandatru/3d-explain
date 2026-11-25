"""Cutaways on the population coordinates of the 990 PRO, in board millimetres.

Exposed internals are educational. The mounting outlines and all untouched
components retain their dimensions from the photographic reconstruction.
"""

from dataclasses import replace
import math

import cadquery as cq

from controller import phy_port
from geometry import Part, block, compound, frame, glyphs, post, ribbon, ring, rod, rounded, tile
from m2_card import ENDPOINTS, lane_pairs, pin_center_y
from physical import LOAD_SWITCHES


COIL = "T_B_inductor_08"
CAP = "T_B_mlcc_19"
CHIP_ZONES = {"U_CTRL":"ctrl", "U_DRAM":"dram", "U_PWR":"pmic", "U_N1":"nand_a", "U_N2":"nand_b"}
SOURCE_NOTE = "器件外形与安装位置来自拆解照片，窗口内使用放大的通用电路结构。"
NET_NOTE = "此线贴在真实 PCB 坐标上说明接口或供电关系。封装侧接点和线路为功能投影。"


def detail(id_, label, zone, mat, shape, desc=SOURCE_NOTE):
    return Part("on_"+id_, label, "on_"+zone, mat, shape, "mounted", desc=desc, zone=zone)


def insitu_base(physical, packages):
    result=[]
    for p in physical:
        if p.group in ("top_label","bottom_label") or p.id in (COIL,CAP,LOAD_SWITCHES[0],LOAD_SWITCHES[0]+"_mark"):
            continue
        key=next((k for k in CHIP_ZONES if p.id.startswith(k+"_")),None)
        zone=CHIP_ZONES.get(key,"")
        if key and p.id.endswith("_mark"):
            continue
        if key and p.id.endswith("_body"):
            chip=packages[key]
            x,y,w,d=[chip[a] for a in ("x","y","w","d")]
            rim=.48 if key=="U_PWR" else .58
            opening=rounded(x-w/2+rim,y-d/2+rim,.93,w-2*rim,d-2*rim,2.0,rim*.66)
            result.append(detail(key+"_rim",p.label+" · 保留的封装边缘",zone,p.material,p.shape.cut(opening)))
            continue
        if p.id.startswith(COIL+"_"):
            zone="coil"
        if p.id.startswith(CAP+"_"):
            zone="cap"
        if p.id.startswith(LOAD_SWITCHES[0]+"_"):
            zone="switch"
        result.append(replace(p,id="on_"+p.id,view="mounted",zone=zone,mesh_ref=p.id))
    return result


def controller_pose(p):
    scale=min((p["w"]-1.67)/16.7,(p["d"]-2.2)/10.8)
    return scale,(p["x"],p["y"]+.30,1.17-1.50*scale)


def controller_window(p, controller, sram):
    scale,offset=controller_pose(p)
    x,y,_=offset
    zbase=1.17
    def placed(shape):
        return shape.scale(scale).translate(offset)
    result=[]
    for old in controller:
        if old.group=="asic_pkg" or old.id=="asic_sram_detail":
            continue
        zone="phy" if old.id.startswith("asic_phy_") else "ctrl"
        result.append(replace(detail(old.id,old.label,zone,old.material,placed(old.shape),old.desc),
                              stage=old.stage))
    for old in sram:
        # The cell fits inside the SRAM macro, below its printed title.
        shape=old.shape.scale(.150).translate((-2.51,-2.72,2.094))
        result.append(detail(old.id,old.label,"sram",old.material,placed(shape),old.desc))
    # The dark under-die seat and exposed peripheral fan-out meet the die edge.
    result.append(detail("ctrl_support","Pascal · 裸片下方封装基板","ctrl","carrier",
                         tile(x,y,.956,16.7*scale,10.8*scale,zbase-.956)))
    tracks=[]
    for side in (-1,1):
        die_edge=y+side*5.4*scale
        for i in range(19):
            dx=(i-9)*scale*.79
            tx=x+dx*1.04
            tracks.extend([ribbon([(x+dx,die_edge),(x+dx,die_edge+side*.21),
                                   (tx,die_edge+side*.54),(tx,die_edge+side*.78)],.065,1.02,.040),
                           post(tx,die_edge+side*.78,1.02,.081,.041)])
    result.append(detail("ctrl_escape","Pascal 窗口 · 基板扇出与焊盘","ctrl","copper",compound(tracks),
                         "沿硅片边缘露出一排封装走线。线数和映射采用示意值。"))
    result.append(detail("ctrl_name","主控窗口 · PASCAL","ctrl","paper",
                         glyphs("PASCAL",x,p["y"]-p["d"]/2+1.00,1.02,.56,.024,bold=True)))
    return result


def dram_window(p):
    x,y,w,d=[p[k] for k in ("x","y","w","d")]
    dw,dd=w-1.54,d-1.54
    z=1.15
    result=[detail("dram_die","LPDDR4 · 阵列硅片","dram","silicon",
                   tile(x,y,.956,dw,dd,z-.956))]
    rows,cols,amps=[],[],[]
    bw=(dw-.99)/2
    bh=(dd-1.75)/2
    for a in (-1,1):
        for b in (-1,1):
            bx=x+a*(bw/2+.16)
            by=y-.42+b*(bh/2+.16)
            rows.extend(tile(bx,by+(i-4)*bh/10,z,bw,.052,.045) for i in range(9))
            cols.extend(tile(bx+(i-7)*bw/16,by,z+.061,.056,bh,.045) for i in range(15))
            amps.append(tile(bx,by-bh/2-.055,z,bw,.095,.13))
    result.extend([
        detail("dram_wl","LPDDR4 · 阵列字线","dram","teal",compound(rows),"字线开启一行存储单元的访问晶体管。示意图以四块阵列展示重复结构。"),
        detail("dram_bl","LPDDR4 · 位线","dram","blue_b",compound(cols),"与字线正交的位线接入感测放大器，两个方向在不同高度相交。"),
        detail("dram_amps","LPDDR4 · 感测放大器带","dram","orange",compound(amps),"外围感测电路检测很小的位线压差，并参与读后恢复。"),
        detail("dram_name","板载内存标记","dram","paper",glyphs("LPDDR4",x,y+dd/2-.40,z,.70,.023,bold=True))])
    return result


def switch_window(p):
    x,y=p["x"],p["y"]
    note="这颗 RB990 对应 TI TPS22990。内部结构按数据表的负载开关框图放大。该板所接电源轨与硅片版图未知。"
    z=.824
    border=frame(x,y,z,3.0,2,.13,.41)
    plate=tile(x,y,z,2.70,1.70,.10)
    z+=.10
    power=[tile(x-.52,y+.47,z,.88,.18,.075),tile(x-.52,y-.48,z,.88,.18,.075)]
    fingers=[tile(x-.89+i*.17,y+.04,z+.075,.08,.88,.05) for i in range(5)]
    return [detail("switch_rim","RB990 · WSON 开窗","switch","qfn",border,note),
            detail("switch_die","TPS22990 · 硅片示意","switch","silicon",plate,note),
            detail("switch_ports","VIN / VOUT · 功率端","switch","copper",compound(power),note),
            detail("switch_fet","串联功率 MOS · 示意指状区","switch","orange",compound(fingers),
                   "导通时 VIN 与 VOUT 经低导通电阻的内部功率管相连。关断时隔离负载。"),
            detail("switch_driver","使能与受控上升沿","switch","teal",tile(x+.60,y+.15,z,.68,.88,.14),
                   "ON 控制开关，CT 可调整输出上升时间、控制接入电容负载时的浪涌。实际 CT 接法未知。"),
            detail("switch_gate","驱动至 MOS 栅极","switch","yellow",
                   ribbon([(x+.28,y+.04),(x+.03,y+.04),(x-.12,y+.18),(x-.30,y+.18)],.085,z+.14,.040),note)]


def pmic_window(p):
    x,y=p["x"],p["y"]
    z=1.17
    result=[detail("pmic_die","供电区 IC · 电源级剖面","pmic","silicon",tile(x,y,.956,4.32,4.42,z-.956))]
    for key,offset,mat in (("hs",-.98,"rose"),("ls",.98,"blue")):
        xx=x+offset
        result.append(detail("pmic_"+key,("高侧" if key=="hs" else "低侧")+" MOS · 并联功率指","pmic",mat,
                             compound([tile(xx,y+.37,z,1.52,.19,.10)]+[
                                 tile(xx+(i-3)*.20,y+.94,z,.105,1.10,.10) for i in range(7)]),
                             "示例同步降压级的功率 MOS 用多指结构表示，高低侧交替导通。"))
    result.append(detail("pmic_pwm","误差放大器与 PWM 驱动区","pmic","violet",
                         tile(x-.53,y-1.01,z,2.29,.82,.14),
                         "输出反馈送入调节器。驱动器控制高侧、低侧开关的栅端。"))
    result.append(detail("pmic_gates","两路示意栅驱与 SW 汇合点","pmic","yellow",compound([
        ribbon([(x-.96,y-.60),(x-.96,y+.25)],.11,z+.115,.05),
        ribbon([(x+.36,y-.60),(x+1.0,y-.60),(x+1.0,y+.25)],.11,z+.115,.05),
        ribbon([(x-1.6,y+1.51),(x-1.6,y+1.75),(x+1.70,y+1.75),(x+1.70,y+.84),
                (x+2.14,y+.84)],.13,z+.115,.05)]),
        "驱动线示意栅端控制，功率开关的中点 SW 接输出电感。"))
    result.append(detail("pmic_name","供电控制区标记","pmic","paper",
                         glyphs("PWM",x-.53,y-1.04,z+.14,.40,.018,bold=True)))
    return result


def passive_windows(coil,cap):
    x,y,w,d,h=[coil[k] for k in ("x","y","w","d","h")]
    # The photographed part's long axis is Y; preserve its actual metal end caps.
    z=.824
    low,high=y-d*.31,y+d*.31
    cz=z+h*.48
    result=[detail("coil_core","磁性器件 · 剖开的磁芯","coil","ferrite",
                   tile(x,y,cz-.15,.46,high-low,.30),"照片确定器件外形，窗口内用绕线式电感示范储能原理。实物绕组形式和匝数未知。")]
    points=[]
    for i in range(65):
        f=i/64
        a=f*8*math.pi
        points.append((x+.39*math.cos(a),low+(high-low)*f,cz+.28*math.sin(a)))
    result.append(detail("coil_winding","电感绕组 · 连至两端电极","coil","copper",
                         compound(rod(a,b,.067) for a,b in zip(points,points[1:])),
                         "铜绕组位于这个真实安装位置的两枚金属端头之间。电流变化时，磁场储能或释能。"))
    x,y,w,d,h=[cap[k] for k in ("x","y","w","d","h")]
    # An oblique stepped cut exposes alternate electrode terminations in plan view.
    inner=d*.62
    result.append(detail("cap_floor","多层陶瓷电容 · 介质底层","cap","mlcc",tile(x,y,z,w,inner,.045)))
    plates=[[],[]]
    dielectric=[]
    for i in range(6):
        side=i%2
        ww=w*(.93-i*.088)
        left=x-w*.47
        y0=y-inner/2+(.11*inner if side else 0)
        zz=z+.045+i*.048
        plates[side].append(block(left,y0,zz,ww,inner*.89,.021))
        if i<5:
            dielectric.append(block(left,y-inner/2,zz+.021,ww-w*.045,inner,.027))
    result.extend([detail("cap_A","MLCC · 接 A 端的三层电极","cap","copper",compound(plates[0])),
                   detail("cap_B","MLCC · 接 B 端的三层电极","cap","solder",compound(plates[1])),
                   detail("cap_insulator","MLCC · 层间陶瓷","cap","mlcc",compound(dielectric),
                          "相邻电极交替接往两端，陶瓷将它们隔开。阶梯切面露出各层，层数与尺寸为原理值。")])
    return result


def nand_windows(a,b,flash):
    x,y,w,d=[a[k] for k in ("x","y","w","d")]
    z=.966
    result=[]
    for i in range(4):
        ww=w-2.26-i*.58
        dd=d-3.60-i*.94
        base=z+i*.147
        center=(x+i*.22,y+i*.29)
        result.append(detail("a_film_"+str(i),"NAND A · 裸片间黏合膜","nand_a","dielectric",
                             tile(*center,base,ww,dd,.035)))
        result.append(detail("a_die_"+str(i),"NAND A · 叠层裸片 "+str(i+1),"nand_a","silicon",
                             tile(*center,base+.035,ww,dd,.112),
                             "在第一枚实际 NAND 的封装窗口内，用四枚代表性裸片展示叠片方式。实际片数、厚度和排布未知。"))
    pattern=[]
    cx,cy=center
    for ix in (-1,1):
        for iy in (-1,1):
            xx,yy=cx+ix*ww*.245,cy+iy*dd*.214
            pattern.append(frame(xx,yy,base+.147,ww*.43,dd*.36,.065,.035))
            pattern.extend(tile(xx,yy+(j-4)*dd*.034,base+.147,ww*.38,.054,.034) for j in range(9))
    result.append(detail("a_array","NAND A · 裸片阵列区","nand_a","copper",compound(pattern)))
    # Each wire fan is a representative package interconnect on the revealed ledge.
    bonds=[]
    for row in range(12):
        xx=x-w*.29+row*.72
        p0=(xx,y-d*.395,1.03)
        p1=(xx+.16,y-d*.343,1.61)
        p2=(xx+.24,y-d*.194,base+.147)
        bonds.extend([rod(p0,p1,.038),rod(p1,p2,.038)])
    result.append(detail("a_bonds","NAND A · 边缘引线示例","nand_a","gold",compound(bonds),
                         "选取一组封装引线说明裸片和载板的连接；三星原件的键合图未公开。"))
    result.append(detail("a_name","第一枚 NAND 窗口标记","nand_a","paper",
                         glyphs("V-NAND  A",x,y-d/2+.98,1.01,.57,.025,bold=True)))
    x,y,w,d=[b[k] for k in ("x","y","w","d")]
    result.append(detail("b_slice","NAND B · 纵剖展示面","nand_b","deep",
                         tile(x,y,.956,w-1.55,d-1.55,.095)))
    # Lay the string's long axis along this die's length, so its layers are
    # readable while the entire card remains framed. The cut depth is compressed.
    ax=(w-2.65)/10.18
    ay=(d-3.97)/9.5
    matrix=cq.Matrix([[ax,0,0,x-5.30*ax],[0,ay,0,y-3.0*ay],[0,0,.118,1.31],[0,0,0,1]])
    for p in flash:
        if p.group=="flash_pkg" or p.id in ("flash_section_base","flash_wl_caption"):
            continue
        rotated=p.shape.rotate((0,0,0),(1,0,0),-69)
        result.append(detail("b_"+p.id,p.label,"nand_b",p.material,rotated.transformGeometry(matrix),p.desc))
    result.append(detail("b_name","第二枚 NAND 窗口标记","nand_b","paper",
                         glyphs("V-NAND  B",x,y-d/2+1.05,1.051,.61,.025,bold=True)))
    return result


def board_networks(chips,coil,cap):
    c=chips["U_CTRL"]
    cx,cy=c["x"],c["y"]
    ctrl_left=cx-c["w"]/2
    scale,die_offset=controller_pose(c)
    result=[]
    for lane in range(4):
        for bus,pin,direction in lane_pairs(lane):
            bundle=[]
            centre=(pin_center_y(pin)+pin_center_y(pin+2))/2
            for delta,pn in ((-.12,pin),(.12,pin+2)):
                orig=pin_center_y(pn)
                end=cy+(centre-8.55)*.68+delta
                yy=centre+delta
                entry=[(2.0,orig),(2.58,orig),(3.33,yy)]
                exit_path=[(4.28,yy),(7.10,end),(ctrl_left+.12,end)]
                if direction=="up":
                    # One AC coupling capacitor in series with each conductor of module TX.
                    bundle.extend([ribbon(entry+[(3.64,yy)],.102,.80,.029),
                                   ribbon([(4.00,yy)]+exit_path,.102,.80,.029)])
                    note=f"Lane {lane} 的 #{pn} 导体。发送端串联电容隔离直流，两端可建立各自偏置。器件尺寸与落点为原理投影。"
                    result.append(detail(f"ac_{pn}","SSD TX 交流耦合电容 · #"+str(pn),"pcie","mlcc",
                                         tile(3.82,yy,.829,.32,.17,.12),note))
                    result.append(detail(f"ac_{pn}_ends","交流耦合 · 两个独立电极","pcie","solder",
                                         compound(tile(xx,yy,.80,.10,.17,.149) for xx in (3.61,4.03)),note))
                else:
                    bundle.append(ribbon(entry+exit_path,.102,.80,.029))
            tail=cy+(centre-8.55)*.68
            path=[[.95,centre,.81],[2.58,centre,.84],[4.28,centre,.96],[7.1,tail,.85],[ctrl_left+.12,tail,.87]]
            chip_port=tuple(v*scale+b for v,b in zip(phy_port(lane,direction=="up"),die_offset))
            x1,y1,z1=chip_port
            deck=1.02 if direction=="up" else 1.24
            middle_x=ctrl_left+(.40 if direction=="up" else .58)
            interconnect=[]
            for sign in (-1,1):
                start=(ctrl_left+.12,tail+sign*.12,.822)
                neck=(middle_x,tail+sign*.12,deck)
                inside=(x1-.13,y1+sign*.085*scale,deck)
                stop=(x1,y1+sign*.085*scale,z1)
                interconnect.extend(rod(a,b,.021) for a,b in zip((start,neck,inside),(neck,inside,stop)))
            result.append(detail("package_"+bus+str(lane),f"封装引入 · {ENDPOINTS[direction]} · Lane {lane}",
                                 "pcie","copper",compound(interconnect),
                                 "这一段从板面进入主控封装，再接到原位 SerDes 的对应差分端。高度、球位和扇出是功能示意。"))
            path.extend([[middle_x,tail,deck],[x1-.13,y1,deck],list(chip_port)])
            title=f"Lane {lane} · {ENDPOINTS[direction]} · #{pin}/{pin+2}"
            result.append(replace(detail(bus+str(lane),title,"pcie","teal" if direction=="up" else "blue",
                                         compound(bundle),NET_NOTE+" PET/PER 取模块侧命名。"),
                                  link={"lane":lane,"direction":direction,"pins":[pin,pin+2],"path_mm":path}))
    clock=[]
    for pn,delta in ((53,-.16),(55,.16)):
        yy=pin_center_y(pn)
        clock.append(ribbon([(2,yy),(2.60,yy),(3.5,15+delta),(4.8,15+delta),
                             (6.75,16.12+delta),(ctrl_left+.11,16.12+delta)],.092,.80,.030))
    result.append(detail("refclk","100 MHz REFCLK−/+ · #53/55","pcie","teal_b",compound(clock),
                         "共同时钟示例中由主机送入 SSD。专用时钟对独立于八对数据线。"))
    for pin,key,mat,title in ((50,"perst","pink","PERST# · 基础复位"),(52,"clkreq","yellow","CLKREQ# · 开漏时钟请求")):
        yy=pin_center_y(pin)
        vx,vy=(4.88,yy+.40) if pin==50 else (5.34,yy+.67)
        # Bottom fingers on the real connector. Only the inferred route rises to the front.
        bottom=ribbon([(2.44,yy),(3.60,yy),(vx-.12,vy)],.10,-.035,.035)
        top=ribbon([(vx+.12,vy),(vx+.73,vy),(6.9,vy+.44),(ctrl_left+.12,vy+.44)],.095,.803,.026)
        result.append(detail(key,f"{title} · 背面 #{pin}","pcie",mat,
                             compound([bottom,ring(vx,vy,-.035,.34,.17,.864),top]),
                             "触点在背面。示意过孔将线路带到元件面，钻孔位置与三星内层布线未知。"))
    dram=chips["U_DRAM"]
    for key,caption,offs,count,mat in (("dq","DQ 数据",0,8,"violet"),("dqs","DQS 选通",1.2,2,"pink")):
        traces=[]
        for j in range(count):
            off=offs+(j-(count-1)/2)*.17
            ex=dram["x"]-dram["w"]/2+.18
            traces.append(ribbon([(cx+c["w"]/2-.13,cy+2.13+off),(ex-.84,cy+2.13+off),
                                  (ex-.30,dram["y"]-.38+off),(ex+.10,dram["y"]-.38+off)],
                                 .078,.81,.035))
        signal=detail("ddr_"+key,"主控至 LPDDR4 · "+caption,"memory",mat,compound(traces),NET_NOTE)
        result.append(replace(signal,link={"kind":"dram","path_mm":[[cx+c["w"]/2-.13,cy+2.13+offs,.86],
                                  [ex-.84,cy+2.13+offs,.86],[ex+.10,dram["y"]-.38+offs,.86]]}))
    for i,key in enumerate(("U_N1","U_N2")):
        n=chips[key]
        traces=[]
        for j in range(4):
            t=(j-1.5)*.16
            yy=1.05+i*.79+t
            traces.append(ribbon([(cx+c["w"]/2-.12,cy-2.4+i*.92+t),(25+i*.7,cy-2.4+i*.92+t),
                                  (31+i*.7,yy+1.42),(35+i*.7,yy),(n["x"]-3.3,yy),
                                  (n["x"]-2.1,yy+1.16),(n["x"]-2.1,3.29+i*.28+t)],
                                 .082,.811+i*.022,.019))
        signal=detail("nand_link_"+str(i),"主控至 NAND "+("A" if i==0 else "B")+" · 代表性数据线",
                      "memory","orange" if i==0 else "yellow",compound(traces),NET_NOTE)
        yy=1.05+i*.79
        result.append(replace(signal,link={"kind":"nand","path_mm":[[cx+c["w"]/2-.12,cy-2.4+i*.92,.87],
                           [25+i*.7,cy-2.4+i*.92,.87],[31+i*.7,yy+1.42,.86],[35+i*.7,yy,.86],
                           [n["x"]-3.3,yy,.86],[n["x"]-2.1,yy+1.16,.86],[n["x"]-2.1,3.29+i*.28,.88]]}))
    px,py=chips["U_PWR"]["x"],chips["U_PWR"]["y"]
    lx,ly,ld=coil["x"],coil["y"],coil["d"]
    kx,ky,kd=cap["x"],cap["y"],cap["d"]
    def trace(key,title,mat,points):
        result.append(detail("power_"+key,title,"supply",mat,ribbon(points,.15,.814,.024),NET_NOTE))
    trace("vin","3.3 V · 背面 #72 到供电区的正面投影","rose",[(2.60,pin_center_y(72)),(3.78,pin_center_y(72)),
          (4.65,18.54),(13.2,18.54),(17.3,21.03),(33.0,21.03),(34.32,19.71),(34.32,py+2.50)])
    trace("sw","SW · 开关节点至电感端头","yellow",[(px+2.62,py+.84),(lx-.55,py+.84),(lx,ly+ld*.43)])
    trace("out","VOUT · 电感至滤波电容","orange",[(lx,ly-ld*.43),(lx,ky+kd*.62),(kx,ky+kd*.43)])
    trace("load","稳压输出 · 至主控负载","orange",[(kx,ky+kd*.43),(kx+.82,ky+kd*.43),
          (kx+1.4,ky-.43),(kx+1.4,3.05),(40,2.93),(28.25,2.93),(25.45,3.94),(cx+3.3,3.94),(cx+2.91,4.55)])
    trace("fb","输出取样 · 反馈到控制区","teal_b",[(kx,ky+kd*.43),(kx-.61,ky+kd*.43),
          (kx-1.11,ky+1.10),(39.04,ky+1.10),(px+2.34,py-.80)])
    grounds=[[(kx,ky-kd*.43),(kx,ky-1.04),(kx+.52,ky-1.55)],
             [(px+.91,py-chips["U_PWR"]["d"]/2+.10),(px+.91,py-3.14),(px+.43,py-3.61)]]
    gnd=[]
    for points in grounds:
        vx,vy=points[-1]
        # Stop on the annulus to preserve a visible centre opening.
        tx,ty=points[-2]
        dist=math.hypot(tx-vx,ty-vy)
        stop=(vx+(tx-vx)*.13/dist,vy+(ty-vy)*.13/dist)
        gnd.extend([ribbon(points[:-1]+[stop],.13,.814,.023),ring(vx,vy,.814,.42,.21,.028)])
    result.append(detail("power_gnd","电容与低侧开关 · 地参考回路","supply","ground",compound(gnd),
                         "另一组电容内电极经端头回到地。两枚示意孔环表示电容和低侧开关分别接入下方同一参考面。"))
    return result


def build_mounted(layout,physical,controller,sram,flash):
    pk={p["id"]:p for p in layout["packages"]}
    sm={p["id"]:p for p in layout["smd"]}
    coil,cap=sm[COIL],sm[CAP]
    return (insitu_base(physical,pk)+controller_window(pk["U_CTRL"],controller,sram)+
            dram_window(pk["U_DRAM"])+switch_window(sm[LOAD_SWITCHES[0]])+pmic_window(pk["U_PWR"])+passive_windows(coil,cap)+
            nand_windows(pk["U_N1"],pk["U_N2"],flash)+board_networks(pk,coil,cap))
