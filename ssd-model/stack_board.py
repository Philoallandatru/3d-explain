"""Illustrative six-copper-layer assembly registered to the photographed 2280 board.

Z is in millimetres from the underside. None of the internal copper depths,
drills, interconnects or package lands are measured Samsung fabrication data.
"""
from collections import defaultdict
from dataclasses import dataclass, replace

import cadquery as cq

from geometry import Part, block, compound, frame, glyphs, post, ribbon, ring, tile
from io_cutaway import controller_read_cutaway, nand_read_cutaway
from m2_card import BOARD_TOP, ENDPOINTS, PIN_NAMES, lane_pairs, pin_center_y


LAYER_HEIGHT = .020
LAYERS = (
    (1, .780, "元件面与扇出", "从金手指导出，SSD 的四对 TX 在此经过各自的串联电容，然后换层。"),
    (2, .635, "上接地参考面", "连续铜面为上层和 L3 提供主要参考。信号孔穿过避空区，接地孔直接接铜面。"),
    (3, .502, "PCIe 差分与参考时钟", "四条 Lane 各有 TX、RX 两对。独立的 REFCLK 对与数据走线并列，靠近 L2 接地面。"),
    (4, .278, "主控至 NAND 总线", "两组代表性 DQ、DQS 和控制线分别通往两枚封装。就近参考下方 L5。"),
    (5, .145, "下接地参考面", "参考铜面由地孔连接至 L2。信号过孔和尾部两排用途未知的孔周围留有绝缘避空。"),
    (6, .000, "背面与边带扇出", "背面金手指从偶数触点引出 PERST# 与 CLKREQ#。尾部可见半孔及两列孔环。"),
)
Z = {layer: z for layer, z, *_ in LAYERS}
GND_PINS = (3, 9, 15, 21, 27, 33, 39, 45, 51, 57)
NAND_SIGNALS = tuple(f"DQ{i}" for i in range(8)) + ("DQS", "CE#", "CLE", "ALE", "WE#", "RE#", "R/B#")
PART_NOTE = "实物确定封装位置与外形，底部球位和焊盘扇出采用示意坐标。"
ROUTE_NOTE = "按接口功能构建的原位推演线路。线宽、间距、孔径与落点为模型值。"
STACK_VIEW_ONLY = {"logic","outline","finish","coupon","io","chip_detail"}


def part(key, title, layer, role, material, shape, detail, net="", site="", evidence="model"):
    return Part("stack_"+key, title, f"L{layer}_{role}", material, shape, "stack", desc=detail,
                stack={"layer":layer,"role":role,"evidence":evidence,"net":net,"site":site})


def registered(physical, mounted, layout):
    """Use the existing mesh coordinates for visible features and landmarks."""
    net_by_pin={pin:f"pcie_{lane}_{direction}" for lane in range(4)
                for _,first,direction in lane_pairs(lane) for pin in (first,first+2)}
    net_by_pin.update({53:"refclk",55:"refclk",50:"perst",52:"clkreq"})
    for p in physical:
        key=p.id
        if key in ("m2_mask_top","m2_mask_bottom"):
            layer=1 if key=="m2_mask_top" else 6
            yield replace(p,id="stack_"+key,view="stack",mesh_ref=key,group=f"L{layer}_finish",
                          material="stack_package",
                          stack={"layer":layer,"role":"finish","evidence":"photo","site":"","net":""})
        elif key.startswith("m2_pin_"):
            pin=int(key[-2:])
            layer=1 if pin%2 else 6
            evidence="standard" if pin in PIN_NAMES else "photo"
            b=p.shape.BoundingBox()
            ends=[(x,pin_center_y(pin),b.zmax) for x in (b.xmin,b.xmax)]
            yield replace(p,id="stack_"+key,view="stack",mesh_ref=key,group=f"L{layer}_fingers",
                          material="stack_standard" if evidence=="standard" else "stack_photo",
                          stack={"layer":layer,"role":"finger","evidence":evidence,"site":"edge",
                                 "net":net_by_pin.get(pin,f"ground_{pin:02d}" if pin in GND_PINS else ""),
                                 "pin":pin,"ends_mm":ends})
        elif key.startswith(("m2_mount_", "art_lands_", "art_vias_", "art_traces_", "art_solder_")) or key=="reverse_silk":
            layer=6 if key.endswith("_bottom") or key=="reverse_silk" else 1
            mount=key.startswith("m2_mount_")
            yield replace(p,id="stack_"+key,view="stack",mesh_ref=key,group=f"L{layer}_art",
                          material="stack_photo",
                          label=("元件面" if layer==1 else "背面")+"固定半孔的可见金属" if mount else p.label,
                          desc="尾端半孔的表面金属可从照片确认。它与各铜层的导通需要实测。" if mount else p.desc,
                          stack={"layer":layer,"role":"art","evidence":"photo","site":"","net":""})
        elif p.group in ("controller","dram","nand","power","passives") and not key.endswith("_seat"):
            # Keep bodies and visible hardware on the same mounting coordinates.
            material="stack_photo" if key.endswith(("_mark","_leads","_ends")) else "stack_package"
            site="ctrl" if p.group=="controller" else "flash" if p.group=="nand" else ""
            yield replace(p,id="stack_"+key,view="stack",mesh_ref=key,group="L1_components",material=material,
                          stack={"layer":1,"role":"component","evidence":"photo","site":site,"net":""})

    names={"U_CTRL":"Pascal 主控","U_DRAM":"LPDDR4","U_PWR":"供电 IC",
           "U_N1":"NAND A","U_N2":"NAND B"}
    for p in layout["packages"]:
        key=p["id"]
        net={"U_N1":"nand_a","U_N2":"nand_b"}.get(key,"")
        site="ctrl" if key=="U_CTRL" else "flash" if net else ""
        yield part(key+"_outline",names[key]+" · 封装落点",1,"outline","stack_photo",
                   frame(p["x"],p["y"],.818,p["w"],p["d"],.085,.014),
                   "外框按拆解照片的同一装配坐标定位。",net,site,"photo")

    # Reuse the existing ASIC cutaway at its original location. The hardware
    # bodies can be hidden independently while the logical handoff is visible.
    macros={"on_asic_"+name+"_macro" for name in ("host","dma","ftl","ecc","nand","sram","dram")}
    for p in mounted:
        if p.id in macros or p.id.replace("_legend","_macro") in macros:
            yield replace(p,id="stack_"+p.id,view="stack",mesh_ref=p.id,group="L1_logic",
                          material="deep" if p.id.endswith("_legend") else "stack_trace",
                          stack={"layer":1,"role":"logic","evidence":"model","site":"ctrl","net":""})
        elif p.id.startswith("on_asic_phy_") or p.id in (
            "on_asic_silicon","on_ctrl_support","on_ctrl_escape","on_asic_host_dma",
            "on_asic_ecc_nand","on_asic_sram_ecc","on_asic_dma_sram",
        ):
            cell=p.id.removeprefix("on_asic_phy_").split("_")
            actor=f"tx_{cell[0]}" if len(cell)==2 and cell[0].isdigit() and cell[1] in ("driver","ser","metal") else ""
            if p.id.endswith(("_mark","_pll_mark")):
                material="deep"
            elif p.id in ("on_asic_silicon","on_ctrl_support"):
                material="silicon"
            else:
                material="stack_control" if not actor else "stack_via"
            yield replace(p,id="stack_"+p.id,view="stack",mesh_ref=p.id,group="L1_chip_detail",material=material,
                          stack={"layer":1,"role":"chip_detail","evidence":"model","site":"ctrl","net":"","actor":actor})


def io_context():
    """On-screen anchors for logical I/O endpoints, in the same board axes."""
    def context(key, title, where, shape, desc, net=""):
        return part("io_"+key,title,1,"io","stack_control",shape,desc,net,where)

    ram="主机内存示意。主机的物理尺寸、方向与 SSD 的安装位置无关。"
    yield context("host_ram","主机内存 · 示意","host",
                  frame(-13.8,11.85,1.025,12.0,15.6,.21,.12),ram)
    for key,title,mark,x,y,w,d,desc in (
        ("host_sq","主机提交队列","SQ", -13.8,16.9,9.6,3.3,"主机填入 SQE。控制器通过 PCIe MRd 获取命令。"),
        ("host_data","主机数据缓冲区","4 KiB", -13.8,11.82,9.6,4.5,"PRP1 指向示例中的页对齐缓冲区。读数据由 SSD 写入这里。"),
        ("host_cq","主机完成队列","CQ", -13.8,6.76,9.6,3.3,"SSD 把 16 B CQE 写入此处。主机检查相位和状态。"),
        ("host_root","主机 PCIe 根端口","HOST", -4.18,11.0,3.7,3.2,"以逻辑端点表示主机 PCIe 根复合体和到插座的连接。"),
        ("host_irq","主机中断目标","MSI-X", -13.8,1.95,9.6,2.55,"可选 MSI-X 中断地址，位于主机的中断目标。"),
    ):
        top=1.28
        yield context(key,title,"host",tile(x,y,1.05,w,d,top-1.05),desc)
        mark_part=context(key+"_mark",title,"host",glyphs(mark,x,y,top,min(1.31,w/4.4),.012,bold=True),desc)
        yield replace(mark_part,material="deep")

@dataclass(frozen=True)
class Via:
    x: float
    y: float
    radius: float = .088
    bore: float = .059
    clearance: float = .226


@dataclass
class BoardRoutes:
    """Geometric inputs shared by laminate cuts, copper bodies and verification."""
    parts: list
    via_fields: dict
    ball: cq.Shape

    def add(self, *args, **kwargs):
        self.parts.append(part(*args, **kwargs))

    def vias(self, net, site, points, **size):
        field=tuple(Via(x,y,**size) for x,y in points)
        self.via_fields[net,site]=field
        return field

    def tracks(self, key, title, layer, net, site, paths, occupied=(), terminals=(), width=.106, mat="stack_trace", signal=""):
        """Make planar tracks with exposed plated lands and leave the bore open."""
        z=Z[layer]
        shapes=[ribbon(path,width,z,LAYER_HEIGHT) for path in paths]
        shapes.extend(post(v.x,v.y,z,.129,LAYER_HEIGHT) for v in occupied)
        shapes.extend(post(x,y,z,.108,LAYER_HEIGHT) for x,y in terminals)
        # Traces and via collars are fused along each conductor before making
        # the circular cut. The associated barrel owns the removed annulus.
        copper=shapes[0].fuse(*shapes[1:]) if len(shapes)>1 else shapes[0]
        if occupied:
            copper=copper.cut(*(post(v.x,v.y,z-.01,v.radius,LAYER_HEIGHT+.02) for v in occupied))
        self.add(key,title,layer,"trace",mat,copper,ROUTE_NOTE,net,site)
        self.parts[-1].stack["paths_mm"]=[[(x,y,z+LAYER_HEIGHT) for x,y in path] for path in paths]
        if signal:
            self.parts[-1].stack["signal"]=signal

    def balls(self, key, title, net, site, points):
        self.add(key,title,1,"ball","stack_via",compound(self.ball.translate((x,y,0)) for x,y in points),
                 PART_NOTE,net,site)
        top=self.ball.BoundingBox().zmax
        self.parts[-1].stack["centres_mm"]=[(x,y,top) for x,y in points]


def pcie_routes(board, ctrl):
    assignments=[(f"pcie_{lane}_{direction}",lane,first,direction) for lane in range(4)
                 for _,first,direction in lane_pairs(lane)]
    assignments.append(("refclk",None,53,"down"))
    for key,lane,first,direction in assignments:
        tx=direction=="up"
        y0=(pin_center_y(first)+pin_center_y(first+2))/2
        y1=ctrl["y"]+(y0-8.55)*.73+.04
        launch_x=4.57 if tx else 4.24
        die_x=11.14 if tx else 11.38
        title=f"Lane {lane} · {ENDPOINTS[direction]}" if lane is not None else "REFCLK · 主机参考时钟"
        entry=[(launch_x,y0+s*.18) for s in (-1,1)]
        exit_=[(die_x,y1+s*.18) for s in (-1,1)]
        ev=board.vias(key,"edge",entry)
        cv=board.vias(key,"ctrl",exit_)
        pads=[(die_x+.62,y) for _,y in exit_]
        pads_in=[]; pads_out=[]; starts=[]; after=[]; inner=[]; exits=[]
        for i,((_,yy),(_,dy),(px,py)) in enumerate(zip(entry,exit_,pads)):
            fy=pin_center_y(first+2*i)
            start=[(2.,fy),(2.48,fy),(2.91,yy)]
            if tx:
                starts.append(start+[(3.16,yy)])
                after.append([(3.81,yy),(launch_x,yy)])
                pads_in.append((3.16,yy))
                pads_out.append((3.81,yy))
            else:
                starts.append(start+[(launch_x,yy)])
            inner.append([(launch_x,yy),(5.24,yy),(8.85,dy),(die_x,dy)])
            exits.append([(die_x,dy),(px,py)])
        if tx:
            board.tracks(key+"_finger",title+" · 金手指至电容",1,key,"edge",starts,terminals=pads_in)
            board.tracks(key+"_aftercap",title+" · 电容到入层孔",1,key,"edge",after,ev,pads_out)
            body=[tile(3.485,y,.802,.49,.19,.133) for _,y in entry]
            tips=[tile(x,y,BOARD_TOP,.16,.19,.135) for x,y in pads_in+pads_out]
            board.add(key+"_caps",title+" · 两枚交流耦合电容",1,"component_cap","stack_control",compound(body),
                      "每根 SSD TX 导体一枚串联电容；电容隔开直流工作点，位置和容值未实测。",key,"edge")
            board.add(key+"_cap_ends",title+" · 四枚电容端头",1,"component_cap","stack_via",compound(tips),
                      "端头各自接触 L1 的铜。两侧焊盘之间留有绝缘间隔。",key,"edge")
        else:
            board.tracks(key+"_finger",title+" · 金手指至入层孔",1,key,"edge",starts,ev)
        board.tracks(key+"_pair",title+" · L3 差分对",3,key,"span",inner,ev+cv)
        board.tracks(key+"_launch",title+" · 主控端 BGA 扇入",1,key,"ctrl",exits,cv,pads)
        board.balls(key+"_balls",title+" · 主控示例焊球",key,"ctrl",pads)

    for pin in GND_PINS:
        y=pin_center_y(pin)
        # The through-connection makes L2 and L5 the same reference in this model.
        key=f"ground_{pin:02d}"
        via=board.vias(key,"edge",[(4.70,y)],radius=.104,bore=.071,clearance=.228)
        board.tracks(key,f"#{pin} GND · 地触点扇入",1,key,"edge",[[(2,y),(4.70,y)]],via,
                     width=.108,mat="stack_ground")
    # Reference vias near the controller launch, between neighbouring pairs.
    for i in range(7):
        y=ctrl["y"]+(3.75+i*1.5-8.55)*.73+.04
        board.vias(f"ground_ctrl_{i}","ctrl",[(11.54,y)],radius=.104,bore=.071,clearance=.228)


def nand_routes(board, ctrl, nand, side):
    net="nand_"+side
    title="主控 ↔ NAND "+side.upper()
    y_start=(5.15 if side=="a" else 12.13)
    y_trunk=(4.22 if side=="a" else 12.69)
    y_end=(5.72 if side=="a" else 12.18)
    x0=ctrl["x"]+ctrl["w"]/2-1.98
    x1=nand["x"]-2.10
    pitch=.285
    upstream=board.vias(net,"ctrl",[(x0,y_start+i*pitch) for i in range(len(NAND_SIGNALS))])
    downstream=board.vias(net,"flash",[(x1,y_end+i*pitch) for i in range(len(NAND_SIGNALS))])
    lands={"ctrl":[],"flash":[]}
    for i,(signal,src,dst) in enumerate(zip(NAND_SIGNALS,upstream,downstream)):
        sy=y_trunk+i*pitch
        a=[(src.x,src.y),(25.8,src.y),(28.9,sy),(x1-5.55,sy),(x1-2.67,dst.y),(dst.x,dst.y)]
        mat="stack_trace" if i<9 else "stack_control"
        board.tracks(net+f"_{i}",f"{title} · {signal}",4,net,"span",[a],(src,dst),mat=mat,width=.092,signal=signal)
        for via,site,s in ((src,"ctrl",-1),(dst,"flash",1)):
            land=(via.x+s*.57,via.y)
            lands[site].append(land)
            board.tracks(net+f"_{site}_{i}",f"{title} · {signal} 封装端",1,net,site,
                         [[(via.x,via.y),land]],(via,),(land,),width=.092,mat=mat,signal=signal)
    for site in lands:
        board.balls(net+"_"+site+"_balls",title+" · "+("主控" if site=="ctrl" else "闪存")+"示例焊球",
                    net,site,lands[site])


def sideband_routes(board, ctrl):
    for pin,key,desc,end in (
        (50,"perst","PERST# · 主机低有效基础复位",16.72),
        (52,"clkreq","CLKREQ# · 开漏时钟请求",17.35),
    ):
        y=pin_center_y(pin)
        entry=board.vias(key,"edge",[(5.21,y+.12)])
        exit_=board.vias(key,"ctrl",[(ctrl["x"]-2.5,end)])
        a,b=entry[0],exit_[0]
        land=(b.x+.56,b.y)
        board.tracks(key+"_bottom",f"#{pin} {desc} · 背面",6,key,"edge",[[(2.50,y),(3.1,y),(a.x,a.y)]],entry,
                     width=.092,mat="stack_control")
        board.tracks(key+"_inner",desc+" · L4",4,key,"span",
                     [[(a.x,a.y),(6.1,a.y),(8.7,b.y),(b.x,b.y)]],entry+exit_,width=.092,mat="stack_control")
        board.tracks(key+"_top",desc+" · 主控端",1,key,"ctrl",[[(b.x,b.y),land]],exit_,(land,),
                     width=.092,mat="stack_control")
        board.balls(key+"_balls",desc+" · 主控示例焊球",key,"ctrl",[land])


def plated_fields(board, layout):
    board.vias("unknown","tail",[(p["x"],p["y"]) for p in layout["vias"] if p.get("drill_through")],
               radius=.18,bore=.164,clearance=.40)
    for (net,site),field in board.via_fields.items():
        ground=net.startswith("ground_")
        if net=="unknown":
            name="尾部双面孔 · 推演孔壁"
            detail="该阵列的正背孔口与中心坐标可观察。内孔壁按贯穿结构表示，镀层厚度和电气用途待实测。"
        elif ground:
            name="地孔 · 连接 L2 与 L5"
            detail="镀铜孔壁连接两层地参考面。它提供信号换层处邻近的回流路径。"
        else:
            name="镀铜过孔 · "+net.replace("pcie_","PCIe ").replace("nand_","NAND ").replace("_up"," TX").replace("_down"," RX").upper()
            detail="中空镀铜孔壁是连续的。信号层的铜环接孔壁，参考面在这里有避空。贯穿孔在信号换层之后仍可有残桩。"
        # Segment each cylinder at the layer boundaries so the peel is physical.
        # Mating faces share the same Z when the exploded-view spacing is zero.
        for layer,z,*_ in LAYERS:
            upper=BOARD_TOP if layer==1 else Z[layer-1]
            tubes=compound(ring(v.x,v.y,z,2*v.radius,2*v.bore,upper-z) for v in field)
            board.add(f"{net}_{site}_via_{layer}",name,layer,"via","stack_via",tubes,detail,net,site)
            board.parts[-1].stack["bores_mm"]=[(v.x,v.y,z,upper) for v in field]


def ground_planes(board, core):
    for layer in (2,5):
        z=Z[layer]
        # Preserve the key and mounting outline. Set back from the perimeter,
        # from the mating edge and from the photo-confirmed tooling holes.
        plane=core.intersect(block(2.95,.48,z,76.60,21.04,LAYER_HEIGHT))
        holes=[]
        for (net,_),field in board.via_fields.items():
            for v in field:
                radius=v.radius if net.startswith("ground_") else v.clearance
                holes.append(post(v.x,v.y,z-.01,radius,LAYER_HEIGHT+.02))
        plane=plane.cut(*holes).clean()
        board.add(f"ground_plane_{layer}",f"L{layer} · 接地参考面与反焊盘",layer,"plane","stack_ground",plane,
                  "地孔接到铜面。圆孔和并排合并的避空区使信号孔与参考面绝缘。平面范围为推演。","ground")
        # A local cut of the same plane is used when inspecting a launch. This
        # keeps the antipads visible without adding unrelated metal to the view.
        for (net,site),field in board.via_fields.items():
            if not net.startswith("pcie_") or site!="edge":
                continue
            center=sum(v.y for v in field)/len(field)
            patch=plane.intersect(block(3.52,center-1.07,z,2.75,2.14,LAYER_HEIGHT))
            board.add(f"{net}_coupon_{layer}",f"L{layer} · 入层孔旁的接地铜面",layer,"coupon","stack_ground",patch,
                      "截取这块模型的接地铜面。避空围住两根信号孔。相邻地孔的镀铜孔壁接合铜面。",net,"edge")


def dielectrics(board, core):
    drills=[post(v.x,v.y,-.02,v.radius,.84) for key,field in board.via_fields.items()
            if key[0]!="unknown" for v in field]
    laminate=core.cut(*drills)
    for layer in range(1,6):
        low=Z[layer+1]+LAYER_HEIGHT
        gap=Z[layer]-low
        piece=laminate.intersect(block(-.1,-.1,low,80.2,22.2,gap))
        name=f"L{layer}–L{layer+1} · 介质  {gap:.3f} mm"
        board.add(f"dielectric_{layer}",name,layer,"dielectric","stack_diel",piece,
                  "取用与实物场景一致的外形、倒角与工艺孔；层间材料和厚度属于示意叠层。")


def build_stack(layout, physical, mounted):
    bodies={p.id:p.shape for p in physical}
    seat=bodies["U_CTRL_carrier"].BoundingBox().zmin-BOARD_TOP
    bead=cq.Solid.makeSphere(.097,(0,0,BOARD_TOP+seat/2),angleDegrees1=-90,angleDegrees2=90)
    ball=bead.intersect(block(-.12,-.12,BOARD_TOP,.24,.24,seat))
    board=BoardRoutes([],{},ball)
    pk={p["id"]:p for p in layout["packages"]}
    core=bodies["m2_core"]
    pcie_routes(board,pk["U_CTRL"])
    nand_routes(board,pk["U_CTRL"],pk["U_N1"],"a")
    nand_routes(board,pk["U_CTRL"],pk["U_N2"],"b")
    sideband_routes(board,pk["U_CTRL"])
    plated_fields(board,layout)
    ground_planes(board,core)
    dielectrics(board,core)
    return [*registered(physical,mounted,layout),*board.parts,*io_context(),
            *nand_read_cutaway(pk["U_N1"],"a"),*nand_read_cutaway(pk["U_N2"],"b"),
            *controller_read_cutaway(mounted)]
