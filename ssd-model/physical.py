"""Reconstruct the photographed Samsung 990 PRO 2TB review board in millimetres."""

from geometry import Part, block, compound, glyphs, post, profile, ribbon, ring, rounded, tile
from m2_card import BOARD_BOTTOM, BOARD_TOP, build_card, pin_function, pin_name

LOAD_SWITCHES=("T_B_ic_03","T_B_ic_04","T_B_ic_01","T_B_ic_02")


def packages(layout):
    parts=[]
    names={"controller":"Pascal 主控","dram":"2 GB LPDDR4","nand":"TLC V-NAND","power":"供电区 IC"}
    for p in layout["packages"]:
        group=p["group"]
        x,y,w,d,h=[p[v] for v in ("x","y","w","d","h")]
        x0,y0=x-w/2,y-d/2
        name=p["id"]
        title=names[group]+({"U_N1":" A","U_N2":" B"}.get(name,""))
        detail={
            "controller":"照片中靠近金手指的镀镍封装。该芯片连接 PCIe 主机、板载 DRAM 和 NAND。可进入主控视图查看功能。",
            "dram":"板载 2 GB LPDDR4。两张同容量样品微距可读出 K4F6E6S / 4HMBGCJ，对应三星 K4F6E6S4HM-BGCJ。控制器可用它缓存映射与工作数据。",
            "nand":"同一块 2 TB 样品上可见两枚三星 TLC V-NAND 封装。照片给出本体位置与方向，封装内部堆叠未作实测。",
            "power":"主控与 NAND 之间的方形 IC。附近磁性器件和去耦电容与电源区特征相符；此 IC 的具体料号及网络未确认。",
        }[group]

        def add(suffix,what,mat,shape):
            parts.append(Part(name+"_"+suffix,title+" · "+what,group,mat,shape,desc=detail))

        # Enclosed ball array is represented by a short mounting standoff, not
        # a guessed per-pin map. The carrier is visible as a thin edge at grazing angles.
        seating=.051
        z=BOARD_TOP+seating
        add("seat","封装安装间隙的简化支承","qfn",tile(x,y,BOARD_TOP,w*.90,d*.90,seating))
        add("carrier","基板边缘","carrier",rounded(x0,y0,z,w,d,.105,.10))
        bottom=z+.105
        if group=="controller":
            a,b=x0+.045,y0+.045
            ww,dd=w-.09,d-.09
            c=.28
            pts=[(a+1.04,b),(a+ww-c,b),(a+ww,b+c),(a+ww,b+dd-c),(a+ww-c,b+dd),
                 (a+c,b+dd),(a,b+dd-c),(a,b+1.04)]
            add("body","镀镍表面与倒角","nickel",profile(pts,bottom,h-.105))
        else:
            add("body","模塑封装","qfn" if group=="power" else "mold",
                rounded(x0+.052,y0+.052,bottom,w-.104,d-.104,h-.105,.10))
        top=z+h
        if group=="controller":
            letters=[glyphs("SAMSUNG",x,y+3.75,top,1.74,.012,bold=True),
                     glyphs("S4LV008",x-.35,y+1.12,top,1.02,.012),
                     glyphs("PASCAL",x-.82,y-3.87,top,.98,.012),
                     glyphs("ARM",x+3.18,y-1.78,top,.87,.012)]
            letters.append(ring(x0+1.65,y0+1.22,top,.52,.31,.012))
            add("mark","封装丝印","nickelmark",compound(letters))
        elif group in ("nand","dram"):
            along=(0,1,0) if group=="nand" else (1,0,0)
            size=1.02 if group=="nand" else .83
            if p["lines"]:
                letters=[]
                for i,line in enumerate(p["lines"]):
                    off=((len(p["lines"])-1)/2-i)*1.45
                    letters.append(glyphs(line,x-along[1]*off,y+along[0]*off,top,size,.012,along))
                dot_x=x0+w-.94 if group=="nand" else x0+.8
                letters.append(post(dot_x,y0+.86,top,.21,.012))
                add("mark","封装标志与定位点","mark",compound(letters))
    return parts


def smd_parts(layout):
    parts=[]
    names={"mlcc":("片式陶瓷电容外观","mlcc"),"resistor":("片式阻容外观","resist"),
           "inductor":("磁性器件外观","ferrite"),"ic":("小型 IC","qfn"),
           "metal":("金属封装","solder"),"tantalum":("有极性片式器件外观","mlcc")}
    for p in layout["smd"]:
        x,y,w,d,h=[p[k] for k in ("x","y","w","d","h")]
        ident=p["id"]
        top=p["side"]=="top"
        mounting=.024
        z=BOARD_TOP+mounting if top else -mounting-h
        face="正面" if top else "背面"
        kind=p["kind"]
        name,mat=names[kind]
        desc=f"按拆解照片定位的{face}器件，名称按可见封装与外观推断，{w:.2f} × {d:.2f} mm 为照片估计，具体电气参数未知。"
        if ident in LOAD_SWITCHES:
            # The TI DML package drawing supersedes the lower-resolution photo outline.
            desc="本样品丝印 RB990，对应 TI TPS22990 负载开关。WSON-10 名义 3 × 2 mm，沿长边每侧五个端子。模型高度取估值。该器件所控制的板上电源轨未知。"
            def orient(shape):
                return shape.rotate((x,y,0),(x,y,1),90) if d>w else shape
            body=rounded(x-1.50,y-1,z,3,2,h,.07)
            parts.append(Part(ident,"TPS22990 · 负载开关","power","qfn",orient(body),desc=desc))
            lands=[tile(x+(i-2)*.50,y+side*.84,BOARD_TOP,.25,.32,mounting)
                   for i in range(5) for side in (-1,1)]
            parts.append(Part(ident+"_leads","WSON · 十个底部端子","power","solder",orient(compound(lands)),
                              desc=desc+" TI 引脚为 1 CT、2 NC、3 VIN、4 VBIAS、5 ON、6 GND、7 PG、8–10 VOUT。"))
            parts.append(Part(ident+"_vin_land","WSON · VIN 裸露散热焊盘","power","solder",
                              orient(tile(x,y,BOARD_TOP,2.6,1.1,mounting)),
                              desc="TI DML0010A 的 2.6 × 1.1 mm 裸露焊盘与 VIN 电气相连，兼作封装散热路径。"))
            marks=[glyphs("RB990",x,y,z+h,.57,.012),post(x-1.14,y+.65,z+h,.09,.012)]
            parts.append(Part(ident+"_mark","RB990 顶标","power","mark",orient(compound(marks)),desc=desc))
            continue
        if kind in ("ic","metal"):
            body=rounded(x-w/2,y-d/2,z,w,d,h,min(.10,min(w,d)*.12))
            parts.append(Part(ident,face+" · "+name,"passives",mat,body,desc=desc))
            # A recessed seating plane accounts for hidden terminations without
            # inventing a pin count or footprint under an unidentified IC.
            foot=tile(x,y,BOARD_TOP if top else -mounting,w*.79,d*.79,mounting)
            parts.append(Part(ident+"_seat","底部焊接面","passives","solder",foot,desc=desc))
            continue
        along_x=(w>=d)
        length=w if along_x else d
        cap=length*.19
        if along_x:
            middle=tile(x,y,z,w-2*cap,d,h)
            lands=[(x+sign*(w-cap)/2,y,cap,d) for sign in (-1,1)]
        else:
            middle=tile(x,y,z,w,d-2*cap,h)
            lands=[(x,y+sign*(d-cap)/2,w,cap) for sign in (-1,1)]
        parts.append(Part(ident,face+" · "+name,"passives",mat,middle,desc=desc))
        ends=[tile(a,b,BOARD_TOP if top else -mounting-h,c,e,h+mounting) for a,b,c,e in lands]
        parts.append(Part(ident+"_ends","两端金属端头及焊接面","passives","solder",compound(ends),desc=desc))
    return parts


def board_art(layout):
    parts=[]
    barrels=[ring(v["x"],v["y"],BOARD_BOTTOM,v["drill"],v["drill"]-.032,BOARD_TOP-BOARD_BOTTOM)
             for v in layout["vias"] if v.get("drill_through")]
    if barrels:
        parts.append(Part("art_plated_walls","双面孔阵列 · 金属孔壁","artwork","copper",compound(barrels),
                          desc="同一样品两面均可见的十枚孔按贯穿结构处理。孔壁厚度为显示估值，电测用途未知。"))
    for side in ("top","bottom"):
        upper=side=="top"
        face="元件面" if upper else "背面"
        hs=.014
        z=BOARD_TOP if upper else BOARD_BOTTOM-hs
        pads=[]
        for p in layout["test_pads"]:
            if p["side"]!=side:
                continue
            x,y,w,d=[p[k] for k in ("x","y","w","d")]
            if p.get("shape") in ("circle","round","disc","disk"):
                pads.append(post(x,y,z,(w+d)/4,hs))
            else:
                pads.append(tile(x,y,z,w,d,hs))
        if pads:
            parts.append(Part("art_lands_"+side,face+" · 裸露焊盘","artwork","gold",compound(pads),
                              desc="根据同容量照片定位。露铜几何可以观察，电测用途与对应网络无法从外形确定。"))
        tin=[tile(p["x"],p["y"],z,p["w"],p["d"],hs) for p in layout.get("solder_lands",[])
             if p["side"]==side]
        if tin:
            parts.append(Part("art_solder_"+side,face+" · 微型露锡点","artwork","solder",compound(tin),
                              desc="照片中可辨的独立锡色端点。未能辨明其间的器件本体，仅画出可见金属。"))
        vias=[]
        for v in layout["vias"]:
            if v["side"] not in (side,"both"):
                continue
            bore=v["drill"]-(.032 if v.get("drill_through") else 0)
            vias.append(ring(v["x"],v["y"],z,v["od"],bore,hs))
        if vias:
            parts.append(Part("art_vias_"+side,face+" · 可见孔环","artwork","copper",compound(vias),
                              desc="表面可见的环形金属。是否贯穿 PCB 依据影像证据单独记录。"))
        tracks=[ribbon(t["points"],t["width"],BOARD_TOP+.0005 if upper else -.0065,.006)
                for t in layout["tracks"] if t["side"]==side]
        if tracks:
            # Visible trace contrast starts at the solder mask, not on the finish
            # of the connector fingers. The pin fan-out under the mask is cropped.
            x0=2.15 if upper else 2.65
            clipped=compound(tracks).intersect(block(x0,0,-.04,80-x0,22,.90))
            parts.append(Part("art_traces_"+side,face+" · 可辨局部线段","artwork","track",clipped,
                              desc="这些阻焊下的局部线形来自拆解影像。没有可见端点的部分保留截断，电气网络未知。"))
    # Printed directly on the reverse near the interface, outside the copper label.
    ink=[glyphs("SAMSUNG",15.12,4.18,0,3.78,.015,(1,0,0),(0,0,-1),True),
         glyphs("SSD",9.78,9.05,0,3.58,.015,(1,0,0),(0,0,-1),True)]
    parts.append(Part("reverse_silk","背面板上 SAMSUNG / SSD 印字","artwork","print",compound(ink),
                      desc="字样的位置来自同一样品的背面实拍，揭去中央散热标签后仍可独立查看。"))
    return parts


def labels(layout,component_top):
    parts=[]

    def add(id_,title,group,mat,shape,desc):
        parts.append(Part(id_,title,group,mat,shape,desc=desc))

    # Top reference photo has its text upright when the M-key is at the right.
    z=component_top+.003
    grp="top_label"
    desc="按同一 2 TB 样品的顶面标签外观建模，略去唯一码；标签简化为平面薄膜，显示时覆盖芯片。"
    add("top_film","正面产品贴膜",grp,"label",rounded(9.55,3.36,z,66.45,15.24,.042,.57),desc)
    surf=z+.042
    along=(-1,0,0)
    def front(text,x,y,size,bold=False):
        return glyphs(text,x,y,surf,size,.010,along,bold=bold)
    add("top_ink","990 PRO 标签 · 品名、容量与型号",grp,"print",compound([
        front("V-NAND SSD",65.18,6.03,1.85),front("990",71.22,9.05,3.79,True),
        front("PCIe 4.0 NVMe M.2 SSD",66.83,12.73,1.17),front("2TB",52.82,16.05,1.67,True),
        front("SAMSUNG",17.96,5.75,1.87,True),front("MODEL  MZ-V9P2T0",33.55,6.51,1.03,True),
        front("SAMSUNG ELECTRONICS CO., LTD.",66.13,16.05,.72),
        front("PRODUCT OF KOREA",40.2,8.20,.88),front("RATED  DC 3.3V",25.40,9.81,.88),
        front("NVMe SSD 990 PRO",35.1,13.82,1.00),
    ]),desc)
    add("top_red","PRO 红色印字与分隔线",grp,"red",compound([
        front("PRO",62.78,9.05,3.79,True),block(56.70,11.36,surf,18.68,.22,.010)]),desc)
    grp="bottom_label"
    desc="背面散热标签中薄铜片沿板面扩散热量。覆盖区约 x=27.5–72.9 mm，主控中心在 x=14.65 mm。胶层和铜层厚度为显示估值，热阻及实际热流分布未知。"
    corners=layout["label_geometry"]["bottom"]["corners_mm"]
    outer_x=(corners[0][0]+corners[3][0])/2
    outer_y=(corners[0][1]+corners[1][1])/2
    w=(corners[1][0]+corners[2][0])/2-outer_x
    d=(corners[2][1]+corners[3][1])/2-outer_y
    for id_,title,mat,b,h in (("adh","背面标签胶层","label_edge",-.024,.024),
                               ("cu","背面标签内嵌铜箔","copper",-.049,.025),
                               ("film","背面散热标签印刷基材","label",-.078,.029)):
        add("bottom_"+id_,title,grp,mat,rounded(outer_x,outer_y,b,w,d,h,.58),desc)
    def back(t,x,y,size,bold=False):
        return glyphs(t,x,y,-.078,size,.012,(1,0,0),(0,0,-1),bold)
    print_=compound([back("CE",32.8,5.28,4.35),back("UK",40.50,4.43,2.14,True),back("CA",40.50,6.53,2.04,True),
                     back("VCCI",48.10,5.56,1.81),back("10",55.77,5.49,2.16,True),back("RoHS",65.39,5.4,1.85),
                     back("FCC",33.17,11.20,3.35,True),back("KC",40.11,11.20,2.62),
                     back("R",48.08,10.98,2.34),back("D33475",55.74,11.47,.90),
                     back("SAMSUNG ELECTRONICS CO., LTD.",40.42,17.03,1.02,True),
                     back("www.samsung.com/ssd",64.62,17.04,.85),
                     back("WARNING  Electrostatic discharge (ESD)",41.25,15.10,.85)])
    add("bottom_ink","散热标签 · 实拍标识简化",grp,"print",print_,desc)
    inkframes=[ring(55.77,5.52,-.090,4.52,4.14,.012),ring(48.08,11.14,-.090,4.2,3.91,.012)]
    add("bottom_symbols","背面标签图形轮廓",grp,"print",compound(inkframes),desc)
    return parts


def build_physical(layout):
    out=[]
    for id_,label,group,mat,shape in build_card(layout):
        desc="名义轮廓结合 M-key 卡边机械图；板厚、镀层与阻焊层厚度为模型取值。"
        if id_.startswith("m2_pin_"):
            n=int(id_[-2:])
            signal=pin_name(n)
            if signal:
                label+=" · "+signal
            desc=pin_function(n)+" 卡边按 M-key 推荐图定位。奇数在元件面，偶数在背面，PET/PER 采用模块侧命名。"
        out.append(Part(id_,label,group,mat,shape,desc=desc))
    population=packages(layout)+smd_parts(layout)
    out+=population
    out+=board_art(layout)
    return out+labels(layout,max(p.shape.BoundingBox().zmax for p in population))
