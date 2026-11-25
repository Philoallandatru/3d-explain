"""Two independent enlargements: NAND package stack and a charge-trap string.

The package sketch and the radial device cross section have different scales.
Six word lines show the repeating geometry without implying a six-layer device.
"""

import cadquery as cq
from geometry import Part, block, compound, frame, glyphs, post, rounded, tile


def build_flash():
    parts=[]

    def add(id_,label,group,mat,items,desc):
        shape=compound(items) if isinstance(items,list) else items
        parts.append(Part("flash_"+id_,label,group,mat,shape,"flash","",desc))

    desc="左侧说明封装中可堆叠多枚裸片。示例片数、片厚及偏移不代表本样品的实际封装剖面。"
    add("carrier","NAND 封装剖角 · 载板","flash_pkg","carrier",rounded(-10.55,-4.15,0,9.78,8.30,.34,.25),desc)
    add("land","封装边缘焊盘","flash_pkg","gold",
        [tile(-10.13,-3.15+i*.58,.34,.30,.29,.06) for i in range(12)],desc)
    dies=[];films=[]
    for i in range(4):
        dx=-9.72+i*.27
        z=.34+i*.58
        films.append(block(dx,-3.50,z,7.13,6.96,.12))
        dies.append(block(dx,-3.50,z+.12,7.13,6.96,.46))
    add("adhesives","裸片之间的黏合层","flash_pkg","dielectric",films,desc)
    add("stack","封装内裸片堆叠示例","flash_pkg","silicon",dies,desc)
    top=.34+4*.58
    array=[]
    for ix in range(2):
        for iy in range(3):
            x=-7.16+ix*2.96
            y=-2.12+iy*2.08
            array.append(frame(x,y,top,2.58,1.69,.085,.07))
            array.extend(tile(x,y-.57+j*.19,top,2.32,.064,.05) for j in range(7))
    add("plane","单片上的阵列分区","flash_pkg","copper",array,
        "顶层图案代表一片硅上的存储阵列。封装中有几枚裸片，与每片硅上垂直堆了多少字线，是两种不同的层数。")

    x,y=3.02,0
    add("section_base","垂直串 · 剖面底座","flash_string","deep",
        rounded(.14,-3.39,0,10.18,6.78,.35,.24),
        "右侧把芯片上一根垂直存储串独立放大，左右两幅比例不同。所示六条存储字线仅是重复结构的节选。")
    add("source","共源线 SL","flash_io","blue",[
        tile(x+.2,y,.35,4.9,2.55,.21),glyphs("SL",1.4,-2.22,.35,.49,.04,bold=True)],
        "垂直沟道的一端通向共源线，另一端经选择管接位线。")
    def shell(ro,ri,z,h,span):
        solid=cq.Solid.makeCylinder(ro,h,(x,y,z),(0,0,1),span)
        if ri:
            solid=solid.cut(post(x,y,z-.02,ri,h+.04))
        return solid

    z0,z1=.56,6.23
    # The offset sector openings make the radial sequence legible in one view.
    for key,label,group,mat,ro,ri,span,lowest,highest,st in [
        ("oxide_core","中央绝缘填芯","flash_string","paper",.44,0,360,z0,z1,"在代表性中空沟道结构中，中央为绝缘填芯。"),
        ("poly","多晶硅沟道","flash_string","silicon",.65,.44,325,z0,z1,
         "读出电流沿垂直多晶硅沟道行进。多层控制栅沿同一根沟道排列，形成串联晶体管。"),
        ("tunnel","隧穿介质","flash_trap","blue_b",.78,.65,288,1.23,5.56,
         "编程电场使电荷穿过隧穿介质进入陷阱层，失去外部电源后仍可保持电荷状态。"),
        ("nitride","电荷陷阱层","flash_trap","orange",1.00,.78,254,1.23,5.56,
         "陷阱层储存的电荷改变单元阈值。TLC 利用八个可区分的阈值范围编码三位，每次编程的单元处于其中一个状态。"),
        ("blocking","阻挡介质","flash_trap","teal_b",1.17,1.00,220,1.23,5.56,
         "阻挡介质位于字线控制栅与电荷陷阱层之间。几个切开角度错开，便于辨认由内及外各层。"),
    ]:
        add(key,label,group,mat,shell(ro,ri,lowest,highest-lowest,span),st)
    for i in range(6):
        bottom=1.41+i*.72
        end=9.35-i*.62
        selected=i==3
        add("wl_"+str(i),f"WL{i}"+(" · 被选字线" if selected else " · 相邻字线"),"flash_wl",
            "yellow" if selected else "copper",[
                shell(1.74,1.17,bottom,.29,198),
                block(x+1.43,.45,bottom,end-x-1.43,.64,.29),
                post(end-.17,.78,bottom+.29,.115,6.16-bottom-.29),post(end-.17,.78,6.16,.202,.11)],
            "存储控制栅围绕沟道。选择此行时，施加读参考电压并感测位线电流；同串其余存储字线加通过电压。台阶端的独立引出显示各字线可以单独寻址。")
    for key,zz,legend in (("sgs",.80,"源侧"),("sgd",5.68,"漏侧")):
        add(key+"_oxide",legend+"选择管 · 栅介质","flash_select","blue_b",
            shell(.83,.65,zz,.30,285),"选择栅与沟道之间由绝缘介质隔开。")
        add(key,legend+"选择栅","flash_select","violet",
            [shell(1.59,.83,zz,.30,203),
             block(x-.35,.95,zz,.53,1.2,.30)],
            legend+"选择管控制垂直串和相邻电极的通断。两端选择管单独示出。")
    add("bitline","位线 BL · 读出端","flash_io","teal",[
        shell(.66,.44,z1,.14,325),tile(x+.98,y,z1+.14,3.24,.40,.19),
        glyphs("BL",x+1.98,y,z1+.33,.39,.036,bold=True)],
        "位线接读出外围电路。读时逐个参考条件辨别阈值区间，编程时利用脉冲与校验逐步逼近目标区间。")
    add("wl_caption","TLC 与字线剖切标识","flash_wl","paper",[
        glyphs("TLC  /  WL",6.43,-2.43,.35,.66,.045,bold=True)],
        "立体模型只取少数层，尺寸与颜色用于解释拓扑。")
    return parts
