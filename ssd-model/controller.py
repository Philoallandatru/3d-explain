"""Representative SSD ASIC, package redistribution and die-level function overlay.

The active-face functions are projected onto the exposed silicon for readability.
No die photo, ball map, mask layout or Samsung implementation is assumed.
"""

import cadquery as cq
from geometry import Part, block, compound, frame, glyphs, post, ribbon, rounded, tile


PHY_X, PHY_Y = -6.44, .04


def phy_port(lane,transmit):
    """Illustrated chip-side pair centre (mm, before the in-package transform)."""
    row=PHY_Y+1.52-lane*1.45
    return PHY_X-1.48,row+(.27 if transmit else -.27),2.13


def serdes(add):
    """Four parallel lane slices. Each has two independently selectable signal paths."""
    z=2.09
    def node(key,title,mat,shape,note):
        add("phy_"+key,title,"asic_host",mat,shape,note,"host")
    for lane in range(4):
        title=f"Lane {lane} · "
        pin,ty,_=phy_port(lane,True)
        _,ry,_=phy_port(lane,False)
        prefix=str(lane)+"_"
        markings=[glyphs("L"+str(lane),PHY_X+1.20,ty,z,.25,.020,bold=True)]
        for key,row,xx,mat,label,note in [
            ("driver",ty,-.98,"orange","差分发送驱动器","发送器以差分电压驱动线路，均衡训练可调节发送端的预置或滤波系数。"),
            ("ser",ty,.45,"yellow","串化器","将发送数据从较宽的并行字转换为高速串行位流，交给发送驱动器。"),
            ("eq",ry,-.98,"blue","接收均衡器","对端送入的差分信号在接收侧均衡。CTLE、DFE 是典型实现，模型未指定 Pascal 的电路拓扑。"),
            ("cdr",ry,-.05,"teal_b","时钟与数据恢复","从收到的串行数据恢复合适的采样相位。共同时钟另由专用触点送入。"),
            ("des",ry,.92,"blue_b","解串器","在恢复的采样时钟下取样，再把串行位流转为内部并行字。")]:
            width=.88 if key=="ser" else .63
            node(prefix+key,title+label,mat,tile(PHY_X+xx,row,z,width,.36,.095),note)
            markings.append(glyphs("DRV" if key=="driver" else key.upper(),PHY_X+xx,row,z+.095,.19,.017,bold=True))
        node(prefix+"mark",title+"发送与接收电路标识","deep",markings,
             "TX 依次经过 SER 串化与 DRV 驱动；RX 依次经过 EQ 均衡、CDR 时钟恢复与 DES 解串。")
        metal=[]
        for row in (ty,ry):
            for s in (-1,1):
                metal.append(ribbon([(pin,row+s*.085),(PHY_X-1.27,row+s*.085)],.052,z+.028,.03))
        for lo,hi,row in ((-.67,.015,ty),(-.67,-.358,ry),(.25,.61,ry)):
            metal.append(ribbon([(PHY_X+lo,row),(PHY_X+hi,row)],.075,z+.035,.035))
        node(prefix+"metal",title+"收发电路互连","copper",metal,
             "每排分别展示 TX（串化、驱动）与 RX（均衡、时钟恢复、解串）。四排代表四条 Lane。位置与电路尺寸均为示意。")
    node("pll","参考时钟 · PLL 频率合成","violet",tile(PHY_X,PHY_Y+2.66,z,2.62,.62,.12),
         "共同时钟示例中，参考时钟进入收发器的频率合成电路。逻辑方块代表时钟资源，实际共享方式和 PLL 数目未知。")
    node("pll_mark","PLL / REF · 图示标识","deep",glyphs("REF / PLL",PHY_X,PHY_Y+2.66,z+.12,.32,.02,bold=True),
         "PLL 表示锁相环。图中为功能标识。")


def build_controller():
    parts=[]

    def add(id_,label,group,mat,shapes,desc,stage=""):
        shape=compound(shapes) if isinstance(shapes,list) else shapes
        parts.append(Part("asic_"+id_,label,group,mat,shape,"asic",stage,desc))

    ball_r=.26
    balls=[]
    ball_pads=[]
    for ix in range(11):
        for iy in range(7):
            x,y=(ix-5)*1.70,(iy-3)*1.90
            if 2<=ix<=8 and 2<=iy<=4:
                continue
            balls.append(cq.Solid.makeSphere(ball_r,(x,y,.24),(0,0,1),-70,70))
            ball_pads.append(post(x,y,.475,.245,.045))
    add("bga","封装下层 · BGA 焊球","asic_pkg","solder",balls,
        "示例焊球把整颗封装焊到 PCB。球数、间距、外圈取样和比例仅用于说明连接方式。")
    add("bga_lands","BGA 侧焊盘","asic_pkg","gold",ball_pads,
        "焊球一端接 PCB，另一端接封装基板的金属焊盘。")
    add("carrier","封装介质基板","asic_pkg","carrier",rounded(-10,-7.4,.52,20,14.8,.40,.28),
        "基板在较疏的 PCB 焊球与较密的芯片端口之间布线。此剖面使用通用封装结构。")
    # An exposed terrace at the south edge makes copper routing and vertical
    # interconnects legible even from directly above.
    fanout=[]
    pkg_vias=[]
    for i in range(26):
        x=-8.55+i*.677
        dx=(i-12.5)*.052
        fanout.append(ribbon([(x,-6.91),(x,-6.55),(x-dx,-5.98),(x-dx,-5.1)],.106,.92,.075))
        pkg_vias.extend([post(x,-6.87,.69,.076,.23),post(x-dx,-5.10,.995,.087,.20)])
    add("substrate_fanout","封装基板扇出铜线","asic_pkg","copper",fanout,
        "芯片端点通过基板铜线扇出到更粗的球阵间距。模型剖开一段介质以露出导线。")
    add("substrate_vias","基板导通孔","asic_pkg","gold",pkg_vias,
        "垂直导通孔联结封装内不同布线层。")
    bumps=[]
    for side in (-1,1):
        for i in range(21):
            x=-7.7+i*.77
            y=side*5.0
            bumps.append(post(x,y,1.18,.132,.32))
        for i in range(9):
            bumps.append(post(side*7.92,-3.65+i*.90,1.18,.132,.32))
    add("bumps","芯片侧细间距凸点","asic_pkg","solder",bumps,
        "此处以倒装芯片示意硅片有源面与封装基板的连接。凸点与底部较大的 BGA 焊球属于两个不同接口。")
    add("silicon","硅片 · 有源功能投影面","asic_die","silicon",rounded(-8.35,-5.40,1.50,16.7,10.8,.37,.09),
        "为同时观察封装和功能，逻辑区投影在硅片可见面上。区域尺度、方向和相互位置都是示意。")
    add("rim_mold","切开的封装包封料","asic_pkg","qfn",[
        block(-9.78,6.18,.92,19.56,.87,1.10),block(8.95,2.42,.92,.83,3.76,1.10)],
        "剖切视图只保留远侧包封料和一角表面，以露出基板、凸点和硅片。")
    add("rim_nickel","镀镍表面 · 剖切保留段","asic_pkg","nickel",[
        block(-9.78,6.18,2.02,19.56,.87,.095),block(8.95,2.42,2.02,.83,3.76,.095)],
        "实物控制器具有镀镍表面。这里的剖角、镀层厚度和内部截面是示意。")

    blocks=[
        ("host","PCIe PHY / NVMe 命令前端","PCIE", PHY_X,PHY_Y,3.29,8.72,"teal",
         "PCIe SerDes 处理串并转换。NVMe 前端接收门铃通知，取主机提交队列中的命令并向完成队列回报结果。"),
        ("dma","DMA · 描述符与数据搬运","DMA",-2.51,2.46,3.53,3.99,"blue",
         "DMA 根据命令中的主机内存描述搬运数据。SQ/CQ 位于主机内存，本区域显示设备端取命和搬运的逻辑。"),
        ("ftl","固件处理核 · 闪存映射","FTL",1.61,2.46,3.56,3.99,"orange",
         "FTL 由固件及其使用的硬件资源实现。逻辑块映射到物理页；写入可分配新页并更新映射，后台负责垃圾回收和磨损均衡。"),
        ("sram","片上 SRAM · 缓冲与状态","SRAM",-2.51,-2.36,3.53,4.19,"green",
         "片上 SRAM 保存短时缓冲、队列状态和热点元数据。进入单元视图可查看六只晶体管怎样保持一位数据。"),
        ("dram","板载内存接口 · LPDDR4 PHY","DDR",1.61,-2.36,3.56,4.19,"violet",
         "DRAM 控制器/PHY 访问板上的 2 GB LPDDR4。映射表可缓存于此，具体内容分配与替换策略由固件决定。"),
        ("ecc","ECC · 编码与解码","ECC",5.89,2.46,3.76,3.99,"pink",
         "写入时生成校验冗余，读取时根据校验关系修正可纠正错误。LDPC 为公开 SSD 控制器的典型实现，Pascal 的码率与矩阵未知。"),
        ("nand","NAND 控制器及 PHY","NAND",5.89,-2.36,3.76,4.19,"yellow",
         "后端排程页读、编程及块擦除，PHY 控制与 NAND 封装之间的命令、地址、数据及选通。本图没有指定 Pascal 的通道数量。"),
    ]
    for key,label,legend,x,y,w,d,mat,desc in blocks:
        group="asic_"+key
        add(key+"_macro",label,group,mat,rounded(x-w/2,y-d/2,1.87,w,d,.22,.10),desc,key)
        add(key+"_legend",label+" · 模块标识",group,"deep",glyphs(legend,x,y+d/2-.55,2.09,.68,.038,bold=True),desc,key)
        cells=[]
        if key=="host":
            serdes(add)
            continue
        elif key=="sram":
            for i in (-1,1):
                for j in (-1,1):
                    bx,by=x+i*.73,y-.32+j*.52
                    cells.append(frame(bx,by,2.09,1.22,.87,.053,.062))
                    cells.extend(block(bx-.54,by-.31+k*.107,2.09,1.08,.038,.047) for k in range(7))
        elif key=="ftl":
            for row in range(5):
                yy=y-1.28+row*.36
                for col,span in enumerate((.43,.60,.30,.48)):
                    cells.append(tile(x-1.02+col*.62+(row%2)*.05,yy,2.09,span,.21,.065))
        elif key=="dma":
            for bank in (-1,1):
                cells.append(frame(x+bank*.72,y-.38,2.09,1.14,1.89,.07,.07))
                cells.extend(tile(x+bank*.72,y-1.06+i*.31,2.09,.88,.115,.065) for i in range(5))
        elif key=="ecc":
            for i in range(5):
                xx=x-1.24+i*.62
                for row in range(3):
                    cells.append(tile(xx,y-1.25+row*.53+(.15 if i%2 else 0),2.09,.37,.23,.078))
        elif key=="dram":
            for i in range(9):
                cells.append(tile(x-1.29+i*.32,y-.61,2.09,.15,1.18 if i<8 else 1.49,.08))
            cells.append(tile(x,y+.24,2.09,2.78,.19,.08))
        else:
            for i in range(4):
                yy=y-1.38+i*.41
                cells.extend([tile(x-.61,yy,2.09,1.55,.20,.075),tile(x+.79,yy,2.09,.83,.20,.075)])
        add(key+"_detail",label+" · 内部结构符号",group,"deep",cells,desc,key)

    # Dedicated teaching buses deliberately run through the empty alleys.
    # Their drawn endpoints represent module ports, not masks of this ASIC.
    links=[
        ("host_dma","主机前端 ↔ DMA",[(-4.80,2.69),(-4.26,2.69)],"teal_b"),
        ("dma_ftl","命令描述符 → 固件核",[(-.745,2.78),(-.17,2.78)],"blue_b"),
        ("dma_sram","DMA ↔ 片上缓冲",[(-2.90,.465),(-2.90,-.265)],"blue_b"),
        ("ftl_sram","映射工作集 ↔ SRAM",[(.90,.465),(.90,.04),(-1.55,.04),(-1.55,-.265)],"orange"),
        ("ftl_dram","FTL ↔ 板上内存控制器",[(2.38,.465),(2.38,-.265)],"violet"),
        ("sram_ecc","缓冲 ↔ ECC 管线",[(-.745,-2.18),(-.46,-2.18),(-.46,.24),(3.71,.24),
                                      (3.71,2.43),(4.01,2.43)],"pink"),
        ("ftl_ecc","页操作调度 → 纠错后端",[(3.39,1.40),(4.01,1.40)],"orange"),
        ("ecc_nand","ECC ↔ NAND 后端",[(5.90,.465),(5.90,-.265)],"yellow"),
    ]
    for key,label,points,mat in links:
        add(key,label,"asic_link",mat,[ribbon(points,.135,2.18,.068)]+[
            post(x,y,2.09,.11,.155) for x,y in (points[0],points[-1])],
            "连线代表对应模块间的逻辑数据或控制关系。可借助读写流程逐步查看。")
    return parts
