"""Functional I/O cutaways anchored inside the photographed package footprints."""

from geometry import Part, compound, frame, glyphs, post, ribbon, ring, rod, rounded, tile


def inside(key, label, material, shape, note, site, net="", actor="", operation=""):
    return Part("stack_io_"+key,label,"L1_chip_detail",material,shape,"stack",desc=note,
                stack={"layer":1,"role":"chip_detail","evidence":"model","site":site,"net":net,
                       "actor":actor,"operation":operation})


def marked(add, key, title, mark, x, y, z, w, d, note, material="stack_control", height=.075):
    body=rounded(x-w/2,y-d/2,z,w,d,height,min(.10,w/8,d/8))
    add(key,title,material,body,note,key)
    add(key+"_mark",title+"标识","deep",
        glyphs(mark,x,y,z+height,min(.50,w/5.8,d*.56),.010,bold=True),note)


def nand_read_cutaway(package, side):
    """Visualize the connection from representative vertical strings to the page registers."""
    x,y,w,d=(package[k] for k in ("x","y","w","d"))
    net="nand_"+side
    parts=[]

    def add(key,title,mat,shape,note,actor="",paths=None):
        p=inside(net+"_"+key,title,mat,shape,note,"flash",net,actor)
        if paths:
            p.stack["paths_mm"]=paths
        parts.append(p)

    def wires(key, title, mat, paths, z, width, note, actor):
        height=.025
        add(key,title,mat,compound(ribbon(path,width,z,height) for path in paths),note,actor,
            [[(xx,yy,z+height) for xx,yy in path] for path in paths])

    add("edge","NAND 封装开窗边缘","stack_ground",
        frame(x,y,.922,w-.12,d-.12,.43,.18),
        "外边界与拆解照片的器件位置对齐。开窗及看到的内部布局采用功能剖视。")
    add("support","NAND 裸片与基板示意","silicon",
        rounded(x-w/2+.60,y-d/2+.60,.918,w-1.20,d-1.20,.07,.21),
        "裸片面积、厚度和外围电路相对位置为观察所用的模型尺寸。")

    interface=(x-4.48,y-5.91)
    address=(x-4.52,y-2.58)
    decoder=(x-4.48,y+.55)
    column=(x+2.04,y-4.33)
    for key,title,mark,xy,ww,dd,note in (
        ("io","NAND I/O 接口","I/O",interface,3.04,1.30,"接口在命令、地址和数据阶段复用 DQ。输出读数据时，器件也驱动读选通。"),
        ("addr","锁存行地址","ADDR",address,3.04,1.28,"命令和地址分开锁存。行地址用于找到块和页，列地址决定从页缓冲的哪个位置起读。"),
        ("row","块与字线译码","ROW",decoder,3.05,1.39,"行译码选择块和目标字线，页类型还决定 TLC 需要比较的阈值。"),
        ("column","列选择","COL MUX",column,5.31,1.02,"从页缓冲选出列偏移，对外输出所需字节。内部整页感测在此之前已经发生。"),
    ):
        marked(add,key,title,mark,*xy,1.085,ww,dd,note)

    columns=[x-.61+j*.71 for j in range(8)]
    front_string,back_string=y+2.0,y+5.64
    array_x=x+1.88
    drill_points=[(xx,yy) for xx in columns for yy in (front_string,back_string)]
    bores=[post(xx,yy,1.00,.113,.80) for xx,yy in drill_points]
    shaft_note="这些立柱表示竖直沟道。剖面只截取少量重复单元和两排示例串。"
    add("strings","所选串组的垂直沟道","stack_via",
        compound(post(xx,back_string,.998,.063,.718) for xx in columns),shaft_note,"select")
    add("front_strings","剖开的相邻 NAND 串","stack_control",
        compound(post(xx,front_string,.998,.063,.718) for xx in columns),shaft_note)
    add("dielectric","沟道周围的绝缘与电荷俘获结构","stack_diel",
        compound(ring(xx,yy,1.035,.181,.139,.626) for xx,yy in drill_points),
        "用一圈代表选通区外的介质与陷阱结构。纵剖省略了实际电荷俘获层的比例。")
    add("source","代表性共源线","stack_ground",tile(array_x,y+3.75,.988,6.63,4.50,.010),
        "所示 NAND 串的一端连到公共源端。读时通过串中的沟道判断目标单元是否导通。","select")
    levels=[]
    for i,front in enumerate((.26,.91,1.55,2.77,3.78)):
        half=(6.55-front)/2
        levels.append(tile(array_x,y+front+half,1.108+i*.121,6.68,2*half,.051).cut(*bores))
    add("wordline","选中的字线 · WL2","stack_via",levels[2],
        "WL2 是示例选中字线。该字线上的多根串并行参与感测。逻辑页的 TLC 数据可能需要多组参考电压。","wordline")
    add("pass_wl","其余字线的通过偏置","stack_ground",compound(p for i,p in enumerate(levels) if i!=2),
        "被选串内的其它未选字线施加通过偏置 Vpass，使它们在本次读取中保持可导通。")
    add("wl_mark","选中字线标记","deep",glyphs("WL2",x+4.43,y+1.86,1.402,.37,.012,bold=True),
        "本图选择 WL2 展示，与实物的页号没有对应关系。")
    def gates(yy):
        return compound(tile(array_x,yy,z,6.63,.35,.041).cut(*bores) for z in (1.024,1.674))

    add("select","串选择栅 · SGD / SGS","stack_control",gates(back_string),
        "串两端的选择栅将所选串接到位线和共源线。字线偏置与串选择共同决定访问哪些单元。","select")
    add("front_gates","相邻串组的选择栅","stack_ground",gates(front_string),
        "邻近串组是阵列结构的参照。当前读取点亮的是后方选中的串组。")
    wires("bl","位线 BL · 阵列到感测电路","stack_via",
        [[(xx,back_string),(xx,y-.75)] for xx in columns],1.716,.053,
        "位线从所选串的漏端延伸到感测端。每根示例线分别对应一个并行位线位置。","sense")
    add("bl_drop","位线至感测端的剖视引线","stack_trace",
        compound(rod((xx,y-.75,1.716),(xx,y-.75,1.198),.030) for xx in columns),
        "截面中将阵列与外围电路摊开，显示位线如何延续到感测输入。","sense",
        [[(xx,y-.75,1.716),(xx,y-.75,1.198)] for xx in columns])
    add("sense","位线感测放大器","stack_control",
        compound(tile(xx,y-1.03,1.112,.42,.66,.090) for xx in columns),
        "给位线建立感测条件，比较所选串在参考阈值下的电流或电压响应。","sense")
    wires("sense_link","感测结果到页缓冲","stack_via",
        [[(xx,y-1.31),(xx,y-2.30)] for xx in columns],1.175,.062,
        "每个示例感测通道把判决结果送到对应的锁存器。","page")
    add("page","页缓冲 · 锁存阵列","stack_control",
        compound(tile(xx,y-2.50,1.105,.53,1.03,.096) for xx in columns),
        "多个并行锁存器暂存从阵列感测的原始数据。对外读到的区间由列选择决定。","page")
    add("page_mark","页缓冲标识","deep",glyphs("PAGE BUF",array_x,y-2.50,1.201,.43,.012,bold=True),
        "锁存器数量为图示节选。")
    wires("page_to_mux","页缓冲至列复用器","stack_control",
        [[(xx,y-2.94),(xx,y-3.42),(xx+.15,y-3.70),(xx+.15,y-3.91)] for xx in columns],1.154,.049,
        "列读出从整页锁存结果中取指定的窗口。","column")
    for key,title,actor,path in (
        ("io_addr","接口至地址锁存","addr",[interface,(x-4.48,y-4.24),address]),
        ("addr_row","地址锁存至行译码","row",[address,(x-4.52,y-1.12),(x-4.48,y-.45),decoder]),
        ("row_wl","行译码至字线区域","wordline",[decoder,(x-2.84,y+.55),(x-1.0,y+1.56)]),
    ):
        wires(key,title,"stack_control",[path],1.166,.083,
              "画出接口、地址锁存、行译码和阵列之间的功能连接。",actor)
    row_lead=parts[-1]
    entry=(x-1.0,y+1.56)
    row_lead.shape=compound([row_lead.shape,rod((*entry,1.191),(*entry,1.401),.038)])
    row_lead.stack["paths_mm"][0].append((*entry,1.401))
    wires("io_bus","列选择至 NAND I/O 的数据通路","stack_via",
        [[column,(x-.55,y-4.33),(x-2.08,y-5.91),interface]],1.164,.092,
        "读数据经列选择送到 DQ。写入时数据由接口进入页缓冲。","io")
    return parts


def controller_read_cutaway(mounted):
    """Place subcircuits on the same ECC and DMA macros as the original Pascal window."""
    macros={p.id:p.shape.BoundingBox() for p in mounted if p.id in ("on_asic_ecc_macro","on_asic_dma_macro")}
    parts=[]

    def add(key,title,mat,shape,note,actor="",operation=""):
        parts.append(inside(key,title,mat,shape,note,"ctrl",actor=actor,operation=operation))

    ecc=macros["on_asic_ecc_macro"]
    x=(ecc.xmin+ecc.xmax)/2
    yy=ecc.ymin+.43
    z=ecc.zmax+.014
    dx=(ecc.xmax-ecc.xmin)*.131
    cell=(ecc.xmax-ecc.xmin)*.096
    corrupt,corrected="0110111","0110011"
    for key,title,row,bits,note in (
        ("ecc_word","读入码字与校验冗余",yy+1.16,corrupt,"采用偶校验汉明码作演示。收到 0110111 时，第 5 位相对示例有效码字翻转。"),
        ("ecc_fix","纠正并验证码字",yy,corrected,"按综合征示例翻转第 5 位，再检查为有效码字 0110011，交出其中的数据。"),
    ):
        xy=[x+(i-3)*dx for i in range(7)]
        add(key,title,"stack_control",compound(tile(xx,row,z,cell,.31,.060) for xx in xy),note,key,"read")
        parts[-1].stack["codeword"]=bits
        add(key+"_mark",title+"位标记","deep",
            compound(glyphs(bit,xx,row,z+.060,.172,.010,bold=True) for bit,xx in zip(bits,xy)),note,operation="read")
        add(key+"_fifth",title+"第 5 位","stack_via",frame(xy[4],row,z+.060,cell,.31,.025,.020),
            note,key,"read")
    marked(lambda *args:add(*args,operation="read"),"ecc_check","计算校验综合征","S = 101",
           x,yy+.55,z,(ecc.xmax-ecc.xmin)*.70,.30,
           "偶校验汉明码示例中三项校验的综合征为 101，指向错误的第 5 位。")

    dma=macros["on_asic_dma_macro"]
    x=(dma.xmin+dma.xmax)/2
    z=dma.zmax+.015
    for key,title,mark,yy,note in (
        ("dma_addr","DMA 取目的地址","PRP / DMA",dma.ymin+1.16,
         "用命令里的数据指针定位主机缓冲区。4 KiB 与页首对齐时，本例用 PRP1。"),
        ("dma_pack","DMA 向 PCIe 提交写数据","MWr",dma.ymin+.43,
         "把纠错后的数据交给事务层写往目标地址。4 KiB 可以分为多个 posted Memory Write TLP。"),
    ):
        marked(add,key,title,mark,x,yy,z,(dma.xmax-dma.xmin)*.77,.38,note)
    add("dma_link","DMA 地址和负载的逻辑移交","stack_via",
        ribbon([(x,dma.ymin+.63),(x,dma.ymin+.96)],.065,z+.026,.052),
        "地址与数据在功能上汇合为发向主机的事务。图中互连位置为示意。","dma_pack")
    return parts
