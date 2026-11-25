"""Enlarged 3D connectivity diagram for a six-transistor static memory bit.

Terminals are explicit. Two metal heights take the feedback wires across each
other. The diagram is drawn at teaching scale and is not a silicon mask set.
"""

from geometry import Part, block, compound, glyphs, post, ribbon, rounded, tile


def build_sram():
    parts = []

    def add(id_, label, group, mat, shape, desc):
        parts.append(Part(id_, label, group, mat, shape, "cell", "", desc))

    add("cell_base", "单比特 SRAM · 绝缘底板", "cell_frame", "deep",
        rounded(-10,-5.1,0,20,10.7,.32,.42),
        "为看清六只晶体管与端口，按电路拓扑放大。导线颜色表示电气节点。")
    z = .80
    metal_h = .10
    pad_z = .49
    contact = []
    gate_oxide = []
    p_gates = []
    n_gates = []
    device_text = []
    anchors = {}
    # local v is along the channel. The two local contacts are always v = +/- .84.
    devices = [
        ("p_L", "左上拉 PMOS", -2.55,1.8, False, 1, "PMOS", "QB", "VDD、Q"),
        ("n_L", "左下拉 NMOS", -2.55,-1.8,False, 1, "NMOS", "QB", "Q、VSS"),
        ("p_R", "右上拉 PMOS", 2.55,1.8,False,-1, "PMOS", "Q", "VDD、QB"),
        ("n_R", "右下拉 NMOS", 2.55,-1.8,False,-1, "NMOS", "Q", "QB、VSS"),
        ("access_L", "左访问 NMOS", -6.10,0,True,1, "NMOS", "WL", "BL、Q"),
        ("access_R", "右访问 NMOS", 6.10,0,True,1, "NMOS", "WL", "QB、BLB"),
    ]
    for name, label, x,y, horizontal, gate_side, kind, gate_net, terminals in devices:
        def at(u,v):
            return (x+v, y+gate_side*u) if horizontal else (x+gate_side*u,y+v)

        def rect(u,v,wu,dv,height,thick):
            a,b = at(u,v)
            return tile(a,b,height,dv if horizontal else wu,wu if horizontal else dv,thick)

        access = name.startswith("access")
        group = "cell_access" if access else "cell_cmos"
        add("cell_"+name, label, group, "green" if kind=="PMOS" else "blue",
            compound([rect(0,-.55,.62,.81,.33,.16), rect(0,.55,.62,.81,.33,.16),
                      rect(0,0,.39,.29,.33,.13)]),
            f"{kind}，两端分别接 {terminals}，栅极接 {gate_net}。" +
            ("WL 为高时，访问管把存储节点接入位线。" if access else "这是交叉耦合反相器的一只上拉或下拉管。"))
        gate_oxide.append(rect(0,0,.65,.28,.46,.045))
        gates = p_gates if kind=="PMOS" else n_gates
        gates.append(rect(.25,0,1.13,.25,.505,.085))
        gate_xy = at(.72,0)
        anchors[name] = gate_xy
        for v in (-.84,.84):
            xx,yy = at(0,v)
            contact.append(post(xx,yy,pad_z,.135,z-pad_z))
        label_x = x if access else x + (-1.04 if x<0 else 1.04)
        label_y = y-1.00 if access else y
        device_text.append(glyphs({"access_L":"AL","access_R":"AR"}.get(name,name.replace("_","")),
                                  label_x,label_y,.32,.52))

    add("cell_oxide", "栅介质", "cell_frame", "paper", compound(gate_oxide),
        "栅极与沟道间的绝缘层使栅电压能控制导通。介质厚度已放大。")
    for key, gates, mat, label in (("p",p_gates,"orange","PMOS 栅"),("n",n_gates,"violet","NMOS 栅")):
        add("cell_"+key+"_gates", label, "cell_cmos", mat, compound(gates),
            "栅端通过竖向接触孔连接到对应的字线或交叉反馈线。")
    add("cell_sd_contacts", "源漏接触孔", "cell_frame", "solder", compound(contact),
        "每只管的两个沟道端点分别接一枚接触柱，上端与所属网络的第一层金属相接。")
    add("cell_device_names", "六只管的位号", "cell_text","ink",compound(device_text),
        "pL/nL 与 pR/nR 组成两组反相器，AL 与 AR 是字线控制的访问管。")

    def net(key, label, mat, routes, vias, desc, txt):
        shape = []
        for pts, level, width in routes:
            shape.append(ribbon(pts,width,level,metal_h))
        for x,y,bottom,top in vias:
            shape.append(post(x,y,bottom,.125,top-bottom))
        group = "cell_"+key
        add("cell_net_"+key, label, group, mat, compound(shape), desc)
        for i,(s,x,y) in enumerate(txt):
            add(f"cell_tag_{key}_{i}", s, group, "paper", glyphs(s,x,y,.32,.61,bold=True), desc)

    left,right=-2.55,2.55
    net("vdd","VDD · 电源","rose", [([(left,2.64),(left,3.36),(right,3.36),(right,2.64)],z,.22)],[],
        "电源轨同时接左右两个 PMOS 的源极。", [("VDD",0,3.19)])
    net("vss","VSS · 地","blue", [([(left,-2.64),(left,-3.35),(right,-3.35),(right,-2.64)],z,.22)],[],
        "两个下拉 NMOS 的源极接 VSS。读出时，保存低电平的一侧提供位线的放电通路。",[("VSS",0,-3.95)])
    wl_z=1.19
    wl_routes=[([(-8.45,4.33),(8.45,4.33)],wl_z,.17)]
    wl_vias=[]
    for name in ("access_L","access_R"):
        x,y=anchors[name]
        wl_routes.append(([(x,4.33),(x,y)],wl_z,.16))
        wl_vias.append((x,y,.59,wl_z))
    net("wl","WL · 字线","violet",wl_routes,wl_vias,
        "一条字线同时控制两只访问管。WL=0 保持，WL=1 接入位线。",[("WL",-9.03,4.32)])
    for sign,key,mark in ((-1,"bl","BL"),(1,"blb","BLB")):
        bx=sign*8.15
        net(key,mark+" · 位线","teal" if sign<0 else "yellow",
            [([(bx,-3.42),(bx,3.10)],z,.21), ([(bx,0),(sign*6.94,0)],z,.18)],[],
            "读出前与另一条位线一起预充为高。读 Q="+("0" if sign<0 else "1")+" 时，本侧出现小幅压降，由外围感测放大器判别。",
            [(mark,bx,-4.0)])
    for sign,key,tag,opp,upper in ((-1,"q","Q","R",1.43),(1,"qb","QB","L",1.84)):
        x=sign*2.55
        gate_x, _=anchors["p_"+opp]
        routes=[([(x,-.96),(x,.96)],z,.20),
                ([(sign*5.26,0),(x,0)],z,.20),
                ([(x,0),(x,sign*.43),(gate_x,sign*.43)],upper,.16),
                ([(gate_x,-1.8),(gate_x,1.8)],upper,.16)]
        vias=[(x,0,z+metal_h,upper)]
        for dev in ("p_"+opp,"n_"+opp):
            gx,gy=anchors[dev]
            vias.append((gx,gy,.59,upper))
        net(key,tag+" · 锁存节点","orange" if sign<0 else "pink", routes,vias,
            tag+" 同时连接本侧两只反相器管的漏极、本侧访问管及对侧反相器的两只栅端。反馈线跨越处使用不同金属高度。",
            [(tag,sign*3.95,.65)])
    return parts
