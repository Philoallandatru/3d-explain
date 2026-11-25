"""Exploded electrical study. Only the connector pin numbers and package locations
are registered to hardware. Layer heights, BGA fan-out and routes are didactic."""

import math
from geometry import Part, block, compound, frame, glyphs, post, ribbon, ring, rod, rounded, tile
from m2_card import ENDPOINTS, lane_pairs, pin_center_y


def build_pcb_circuits(layout):
    parts = []

    def add(id_, label, group, mat, shapes, desc):
        shape = compound(shapes) if isinstance(shapes, list) else shapes
        parts.append(Part("pcb_"+id_, label, group, mat, shape, "pcb", "", desc))

    table = {p["id"]: p for p in layout["packages"]}
    ctrl, dram = table["U_CTRL"], table["U_DRAM"]
    cx,cy=ctrl["x"],ctrl["y"]
    px,py=table["U_PWR"]["x"],table["U_PWR"]["y"]
    ref_z, supply_z, bus_z, signal_z, land_z = .72, 2.15, 3.45, 4.55, 5.85
    floor = rounded(.2,.12,.0,79.6,21.76,.28,.48)
    notch = post(80,11,-.20,1.76,1)
    add("section_base","功能剖面底板","pcb_stack","deep",floor.cut(notch),
        "四个可见高度分开参考铜面、供电、存储总线与高速差分线，层距为观察而放大。")
    plane = rounded(1.05,.83,ref_z,76.4,20.3,.13,.40)
    add("ground","GND · 信号参考铜面","pcb_stack","ground",plane,
        "参考平面为高速电流提供连续回流路径。模型将其降低，便于观察走线与接地过孔。")
    tabs = []
    for i,z in enumerate([.28,ref_z+.13,supply_z+.12,bus_z+.10]):
        top = [ref_z,supply_z,bus_z,signal_z][i]
        tabs.append(block(64+i*.55,19.7+i*.18,z,10-i*1.1,1.35-i*.20,top-z))
    add("dielectric_section","板边局部介质剖切","pcb_stack","dielectric",tabs,
        "只保留一小段介质剖面以显露铜层。高度、介质厚度和层数均为讲解取值。")
    names={"U_CTRL":"PASCAL","U_DRAM":"LPDDR4","U_PWR":"POWER","U_N1":"NAND A","U_N2":"NAND B"}
    for key,p in table.items():
        x,y,w,d=(p[k] for k in ("x","y","w","d"))
        add("land_"+key,names[key]+" · 器件投影","pcb_stack","frame",
            frame(x,y,land_z,w,d,.16,.13),
            "轮廓由拆解照片的封装位置投影得到；电路终端落点为解释接口的示意焊盘。")
        add("legend_"+key,names[key]+" · 投影标注","pcb_stack","paper",
            glyphs(names[key],x,y+d*.35,land_z+.15,min(1.15,w/6.8),.045,bold=True),
            "可将该器件与实物视图同名封装对照。")

    # PCIe TX/RX signal names follow the M.2 pin-assignment table. ± positions on
    # the edge are real. The first segment fans 0.50 mm pad pitch into a pair.
    for lane in range(4):
        for label,first,direction in lane_pairs(lane):
            mat="teal" if direction=="up" else "blue"
            pnum = [first,first+2]
            edge_y = [pin_center_y(n) for n in pnum]
            middle=sum(edge_y)/2
            dest=(cx-3.4,cy+(middle-8.55)*.64)
            traces, lands, vias = [],[],[]
            for sign,(pin,y) in zip((-1,1),zip(pnum,edge_y)):
                packed=middle+sign*.145
                out=dest[1]+sign*.145
                start=[(1.75,y),(2.50,y),(3.12,packed)]
                stop=[(4.55,packed),(8.25,out),(dest[0]-.10,out)]
                if direction=="up":
                    traces.extend([ribbon(start+[(3.62,packed)],.125,signal_z,.085),
                                   ribbon([(4.04,packed)]+stop,.125,signal_z,.085)])
                    add(f"ac_{pin}",f"发送端交流耦合电容 · #{pin}","pcie_path","mlcc",
                        tile(3.83,packed,signal_z+.085,.34,.19,.13),"每根发送导体串接一枚电容。落点、封装、容值均为教学模型中的等效表示。")
                    add(f"ac_{pin}_ends",f"交流耦合电容 #{pin} · 两侧端头","pcie_path","solder",
                        [tile(xx,packed,signal_z,.10,.19,.215) for xx in (3.61,4.05)],"端头分别接入断开的两段铜线。")
                else:
                    traces.append(ribbon(start+stop,.125,signal_z,.085))
                lands.extend([tile(1.09,y,signal_z,1.60,.35,.09),
                              ring(dest[0],out,signal_z,.26,.092,.085),ring(dest[0],out,land_z,.266,.092,.09)])
                vias.append(ring(dest[0],out,signal_z+.085,.182,.092,land_z-(signal_z+.085)))
            add(f"{label}{lane}",f"Lane {lane} · {ENDPOINTS[direction]} · #{first}/{first+2}","pcie_path",mat,traces,
                "一对差分铜线传输一个方向的串行信号；收、发各一对组成一条全双工 Lane。板端引脚按公开 M.2 引脚表，封装端扇出为示意。")
            add(f"{label}{lane}_lands",f"{label}{lane} · 触点与焊盘","pcie_path","gold",lands,
                "接口侧采用公开引脚位置。主控内部的焊盘号和真实过孔位置未公开。")
            add(f"{label}{lane}_via",f"{label}{lane} · 一对换层孔柱","pcie_path","copper",vias,
                "两根差分导体分别换层，邻近接地孔为参考电流提供回路。")
            if lane==0 and direction=="up":
                # A local reference plane above the traces, with a clearance around each
                # signal barrel. Both ground barrels connect to the lower reference.
                vx,vy=dest
                z=5.23
                coupon=tile(vx,vy,z,1.54,1.20,.065)
                holes=[post(vx,vy+s*.145,z-.01,.18,.09) for s in (-1,1)]
                returns=[(vx+.48,vy+s*.38) for s in (-1,1)]
                holes.extend(post(xx,yy,z-.01,.067,.09) for xx,yy in returns)
                add("via_reference","Lane 0 · 参考铜面的避空反焊盘","pcie_path","ground",coupon.cut(*holes),
                    "剖去其余铜面以露出两根信号孔壁与共用避空区。孔壁和参考面保持绝缘。垂直尺寸为展开值。")
                add("via_stitch","Lane 0 · 两枚参考面缝合地孔","pcie_path","teal_b",
                    [ring(xx,yy,ref_z+.13,.22,.134,z-ref_z-.13) for xx,yy in returns],
                    "两枚邻近镀铜孔把局部参考面接回下方大地平面，缩短信号换层时的高频回流绕路。")
    grounding=[]
    for pin in (1,9,15,21,27,33,39,45,51,57):
        yy=pin_center_y(pin)
        grounding.extend([tile(1.12,yy,signal_z,1.56,.32,.07),
                          ribbon([(1.63,yy),(2.46,yy)],.16,signal_z,.07),
                          post(2.42,yy,ref_z+.13,.10,signal_z-ref_z-.13)])
    add("return_vias","接地触点与回流孔柱","pcie_path","ground",grounding,
        "接地触点接至同一参考面。设计时要同时考虑信号和返回电流，过孔靠近换层位置可缩短回流路径。")
    clk=[]
    for pin,delta in ((53,-.14),(55,.14)):
        y=pin_center_y(pin)
        clk+= [tile(1.1,y,signal_z,1.6,.32,.08),
               ribbon([(1.8,y),(2.6,y),(3.3,15+delta),(5.5,15+delta),(8.9,16+delta),
                       (cx,16+delta)],.12,signal_z,.08)]
    add("refclk","REFCLK n/p · #53、55","pcie_path","teal_b",clk,
        "参考时钟与四条数据 Lane 分开传输。")

    def bus(id_, name, group, color, points, count, step, z, desc):
        pieces=[]
        marks=[]
        for i in range(count):
            off=(i-(count-1)/2)*step
            xy=[(x,y+off) for x,y in points]
            pieces.append(ribbon(xy,step*.45,z,.085))
            for x,y in (xy[0],xy[-1]):
                marks.extend([post(x,y,z+.085,step*.235,land_z-z-.085),
                              post(x,y,land_z,step*.34,.095)])
        add(id_,name,group,color,pieces,desc)
        add(id_+"_ends",name+" · 换层端点",group,"copper",marks,
            "焊盘和孔柱连接此示意层与实物轮廓平面。封装端引脚位置未测量。")

    dx,dy=dram["x"],dram["y"]
    bus("dram_dq","LPDDR4 · 代表性 DQ 字节组","dram_path","violet",
        [(cx+3.7,cy+1.9),(cx+6.2,cy+1.9),(dx-5.1,dy-1.45),(dx-2.8,dy-1.45)],8,.27,signal_z,
        "示出一个字节组的八根数据线。控制器可通过板上 LPDDR4 暂存映射与工作数据。")
    for name,dy0,n,delta in (("DQS",.05,2,.27),("CK",1.0,2,.27),("CA",1.95,3,.28)):
        bus("dram_"+name,"LPDDR4 · "+name,"dram_path","blue_b" if name=="CK" else "pink",
            [(cx+3.5,cy+3.3+dy0),(cx+6.15,cy+3.3+dy0),(dx-5.1,dy+.05+dy0),(dx-2.8,dy+.05+dy0)],
            n,delta,signal_z,"DQS 与数据一起选通采样，CK 提供时钟，CA 承载命令和地址。展示代表性线组。")
    for i,key in enumerate(("U_N1","U_N2")):
        p=table[key]
        ny=6.1 if i==0 else 11.05
        starty=cy-3.75+i*3.0
        def nbus(suffix,caption,color,off,count):
            bus("nand_"+str(i)+"_"+suffix,"NAND "+("A" if i==0 else "B")+" · "+caption,
                "nand_path",color,[(cx+4.0,starty+off),(cx+9.0,starty+off),
                                  (cx+15.5,ny+off),(p["x"]-5,ny+off),(p["x"]-2,ny+off+1.25)],
                count,.23,bus_z,"线组连接主控 NAND PHY 与照片中的这枚 NAND。只表现接口类型，封装个数不等于通道数。")
        nbus("dq","DQ 代表性数据线","orange",0,4)
        nbus("strobe","DQS 数据选通","yellow",.90,1)
        nbus("ce","CE# 片选示例","green",1.45,1)

    # A complete example buck. The two switch bodies sit between their own metal
    # terminals. The inductor and the output capacitor terminate at VOUT.
    vin,sw,out=(px-3.0,py),(px+.35,py),(px+9.0,py)
    lstart,lend=px+1.7,px+5.75
    pin72=pin_center_y(72)
    add("power_input","#72 · 3.3 V 至输入去耦和高侧开关","power_path","rose",[
        tile(1.3,pin72,supply_z,1.75,.35,.10),
        ribbon([(1.85,pin72),(3.1,pin72),(4.6,pin72-1.5),(4.6,3.4),(6.6,1.5),
                (px-6,1.5),(vin[0],py-3.1),vin,(px-1.76,py)],.33,supply_z,.10)],
        "取一个公开 3.3 V 触点作为示意输入；实卡有多枚并联电源触点。输入电容为开关脉动电流提供就近通路。")
    switch_shapes=[tile(px-1.12,py,supply_z,1.28,.72,.42),tile(sw[0],py-1.43,supply_z,.72,1.1,.42)]
    add("power_fets","降压级 · 高侧与低侧开关","power_path","violet",switch_shapes,
        "高侧导通时输入向电感供能；高侧关断、低侧导通时电感电流继续流动。图中是一组同步降压级。")
    add("power_sw","SW · 开关节点","power_path","yellow",[
        ribbon([(px-.48,py),sw,(lstart,py)],.28,supply_z,.10),
        ribbon([sw,(sw[0],py-.88)],.24,supply_z,.10)],
        "半桥中点 SW 接电感输入端，该节点脉动，其后经过电感和电容滤波。")
    helix=[]
    for i in range(49):
        f=i/48
        angle=f*8*math.pi
        helix.append((lstart+(lend-lstart)*f,py+.44*math.sin(angle),supply_z+.11+.44*(1-math.cos(angle))))
    add("power_l","L · 输出电感剖开示意","power_path","copper",
        [rod(a,b,.115) for a,b in zip(helix,helix[1:])],
        "用放大的绕组显示电感储能与续流。实物磁性器件的内部绕组和电感值未知。")
    add("power_vout","VOUT · 滤波后至主控负载","power_path","orange",[
        ribbon([(lend,py),out,(out[0]+1.25,py-1.25),(out[0]+1.25,3.15),(px+7.8,2.20),
                (cx+3.6,2.20),(cx,5.0),(cx,cy-2.45)],.36,supply_z,.11),
        post(cx,cy-2.45,supply_z+.11,.18,land_z-supply_z-.11),
        post(cx,cy-2.45,land_z,.32,.09)],
        "本图只跟踪一个被稳压的输出到主控。DRAM、NAND 以及 I/O 可能有独立电源轨。")
    ground=[]
    for x,yy in ((vin[0],py),(out[0],py)):
        # Two XYZ-separated plates, with an insulating gap and a separate ground via.
        add("cap_"+("in" if x==vin[0] else "out"),"输入去耦电容" if x==vin[0] else "输出滤波电容",
            "power_path","paper",[
                ribbon([(x,yy),(x,yy+1.32)],.17,supply_z,.1),
                tile(x,yy+1.40,supply_z,1.24,.18,.24),tile(x,yy+1.78,supply_z,1.24,.18,.24)],
            "两块电极间保留绝缘间隙，一端接电源，另一端通过过孔回到地参考面。")
        ground.extend([ribbon([(x,yy+1.87),(x,yy+2.18)],.18,supply_z,.10),
                       post(x,yy+2.18,ref_z+.13,.145,supply_z-ref_z-.13)])
    ground.extend([ribbon([(sw[0],py-1.98),(sw[0],py-2.92)],.23,supply_z,.11),
                   post(sw[0],py-2.92,ref_z+.13,.17,supply_z-ref_z-.13)])
    add("power_return","电容与低侧开关的地回路","power_path","ground",ground,
        "各回流孔落到同一参考面。")
    # A divider physically spans output and ground. Its centre tap feeds the PWM block.
    fy=py+4.20
    feed_x=out[0]-2.0
    fb=[ribbon([(out[0],py),(out[0]+.83,py+.72),(out[0]+.83,fy),(out[0],fy)],.145,supply_z,.08),
        tile(out[0]-.47,fy,supply_z,.94,.34,.22),
        ribbon([(out[0]-.94,fy),(feed_x,fy),(feed_x-.30,fy)],.14,supply_z,.08),
        tile(feed_x-.78,fy,supply_z,.96,.34,.22),
        post(feed_x-1.36,fy,ref_z+.13,.14,supply_z-ref_z-.13),
        ribbon([(feed_x-1.26,fy),(feed_x-1.49,fy)],.14,supply_z,.10),
        ribbon([(feed_x,fy),(feed_x,fy+1.1),(px-2.6,fy+1.1),(px-3.66,fy+.05),
                (px-3.66,py+1.62),(px-2.4,py+.73)],.14,supply_z,.08),
        tile(px-2.4,py+.73,supply_z,.60,.46,.20)]
    add("power_feedback","反馈分压 · VOUT 至 FB","power_path","teal_b",fb,
        "示意分压器取样输出电压，控制器调节开关占空比；实际电源 IC、通道参数和反馈网络未公开。")
    add("power_pwm","调节器 · 反馈比较与栅极驱动","power_path","silicon",[
        tile(px-1.78,py+1.84,supply_z+.25,2.13,1.12,.42),
        ribbon([(px-2.4,py+.73),(px-2.4,py+1.52)],.13,supply_z,.10),
        post(px-2.4,py+1.52,supply_z+.10,.095,.15)],
        "反馈引脚把分压信号送入调节器。两路不同的栅极驱动控制高、低侧开关，避免两者同时导通。")
    gate_z=supply_z+.70
    for key,pts in [
        ("high",[(px-1.63,py+1.40),(px-1.63,py+.68),(px-1.12,py+.68),(px-1.12,py+.25)]),
        ("low",[(px-.80,py+1.86),(px+.21,py+1.86),(px+1.04,py+1.03),(px+1.04,py-1.43),
                (px+.61,py-1.43)]),
    ]:
        xa,ya=pts[0]
        xb,yb=pts[-1]
        add("gate_"+key,("高侧" if key=="high" else "低侧")+" MOS 栅极驱动","power_path","blue_b",[
            ribbon(pts,.115,gate_z,.065),post(xa,ya,supply_z+.67,.085,.03),
            post(xb,yb,supply_z+.42,.085,gate_z-supply_z-.42)],
            "这条控制线连接调节器与相应开关的栅端。驱动级和误差补偿网络在此图中合并为功能块。")
    return parts
