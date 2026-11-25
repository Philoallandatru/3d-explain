# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["cadquery==2.6.1"]
# ///
"""Check exported assemblies, component clearances and modelled circuit connectivity."""

import base64
import csv
import gzip
import hashlib
import itertools
import json
import re
import struct

import cadquery as cq

from build_model import HERE, STEM
from controller import build_controller
from geometry import compound
from inplace import CAP, COIL, CHIP_ZONES, build_mounted
from installation import HOST_Z, build_installed
from m2_card import CONTACT_PINS, lane_pairs
from nand import build_flash
from pcb_circuits import build_pcb_circuits
from physical import LOAD_SWITCHES, build_physical
from sram import build_sram
from stack_board import LAYERS, LAYER_HEIGHT, NAND_SIGNALS, STACK_VIEW_ONLY, build_stack


def verify_files():
    data=(HERE/(STEM+".glb")).read_bytes()
    magic,version,length=struct.unpack_from("<4sII",data)
    assert (magic,version,length)==(b"glTF",2,len(data))
    json_len,kind=struct.unpack_from("<I4s",data,12)
    assert kind==b"JSON"
    doc=json.loads(data[20:20+json_len])
    bin_len,kind=struct.unpack_from("<I4s",data,20+json_len)
    assert kind==b"BIN\0" and len(data)==28+json_len+bin_len
    with (HERE/"parts.csv").open(encoding="utf-8-sig") as f:
        rows=list(csv.DictReader(f))
    assert [n["name"] for n in doc["nodes"]]==[row["id"] for row in rows]
    assert len(rows)==len({row["id"] for row in rows})
    vertex_buffers={p["attributes"]["POSITION"] for m in doc["meshes"] for p in m["primitives"]}
    assert len(vertex_buffers)==sum(not row["geometry_reference"] for row in rows)
    nodes_by_id={n["name"]:n for n in doc["nodes"]}
    for row in rows:
        ref=row["geometry_reference"]
        node=nodes_by_id[row["id"]]
        primitive=doc["meshes"][node["mesh"]]["primitives"][0]
        assert doc["materials"][primitive["material"]]["name"]==row["material"]
        if ref:
            original=doc["meshes"][nodes_by_id[ref]["mesh"]]["primitives"][0]
            assert primitive["attributes"]==original["attributes"] and primitive["indices"]==original["indices"]
        stack=node["extras"].get("stack")
        if row["view"]=="stack":
            assert stack and str(stack["layer"])==row["pcb_layer"] and stack["role"]==row["pcb_role"]
            assert stack["evidence"]==row["pcb_evidence"] and stack["net"]==row["pcb_net"]
        else:
            assert stack is None
    views=["mounted","physical","pcb","asic","cell","flash","installed","stack"]
    assert len(doc["scenes"])==len(views) and doc["scene"]==0
    covered=[]
    for view,scene in zip(views,doc["scenes"]):
        assert scene["nodes"]
        for ix in scene["nodes"]:
            node=doc["nodes"][ix]
            assert node["extras"]["view"]==rows[ix]["view"]==view
            assert node["extras"]["group"]==rows[ix]["group"]
            covered.append(ix)
    assert sorted(covered)==list(range(len(rows)))
    for bv in doc["bufferViews"]:
        assert bv.get("byteOffset",0)+bv["byteLength"]<=bin_len
    markup=(HERE/"view.html").read_text(encoding="utf-8")
    encoded=re.search(r'<script type="application/octet-stream" id="asset">([^<]+)</script>',markup)
    assert encoded and base64.b64decode(encoded[1])==data
    assert f'<meta name="model-sha256" content="{hashlib.sha256(data).hexdigest()}">' in markup
    verify_framework(markup)
    guide=json.loads((HERE/"link-guide.json").read_text(encoding="utf-8"))
    inline=re.search(r'<script type="application/json" id="link-guide">(.*?)</script>',markup,flags=re.S)
    assert inline and json.loads(inline[1])==guide
    inline_stack=re.search(r'<script type="application/json" id="stack-guide">(.*?)</script>',markup,flags=re.S)
    assert inline_stack and json.loads(inline_stack[1])=={"layers":[list(layer) for layer in LAYERS],"copper_mm":LAYER_HEIGHT}
    for stages in guide.values():
        for stage in stages:
            assert set(stage["targets"])<=nodes_by_id.keys(),stage
    assert [s["direction"] for s in guide["read"]]==[
        "host","down","up","down","dram","nand_out","nand_in","up","up","up","host","down"]
    assert [s["direction"] for s in guide["write"]]==[
        "host","down","up","down","up","down","dram","nand_out","up","up","host","down"]
    for flow in ("read","write"):
        for step in guide[flow]:
            direction,chain=step["direction"],step["through"]
            if direction in ("up","down"):
                i=chain.index("pcie")
                host,phy=(chain[i-1],chain[i+1]) if direction=="down" else (chain[i+1],chain[i-1])
                assert host.startswith("host_") and phy=="host",step
            if direction.startswith("nand"):
                i=chain.index("nand_bus")
                assert chain[i-1:i+2:2]==(["nand","io"] if direction=="nand_out" else ["io","nand_rx"]),step
    assert guide["read"][5]["through"][-6:]==["addr","row","select","wordline","sense","page"]
    assert guide["read"][6]["through"]==["page","column","io","nand_bus","nand_rx","ecc_word","ecc_check","ecc_fix","ecc_out"]
    assert guide["read"][7]["through"][:3]==["ecc_out","dma_addr","dma_pack"]
    assert guide["read"][7]["through"][-3:]==["host","pcie","host_data"]
    assert guide["write"][4]["through"][-3:]==["host","pcie","host_data"]
    assert guide["write"][5]["through"][:3]==["host_data","pcie","host"]
    tx=[(41,43),(29,31),(17,19),(5,7)]
    rx=[(47,49),(35,37),(23,25),(11,13)]
    for lane,(up,down) in enumerate(zip(tx,rx)):
        for key,pair,direction in (("PET",up,"up"),("PER",down,"down")):
            route=nodes_by_id[f"on_{key}{lane}"]["extras"]["link"]
            assert (route["lane"],route["direction"],tuple(route["pins"]))==(lane,direction,pair)
            assert route["path_mm"][0][0]<2<route["path_mm"][-1][0]
            stack_key=f"stack_pcie_{lane}_{direction}"
            track=nodes_by_id[stack_key+"_pair"]["extras"]["stack"]
            axes={site:nodes_by_id[stack_key+"_"+site+"_via_3"]["extras"]["stack"]["bores_mm"]
                  for site in ("edge","ctrl")}
            for i,path in enumerate(track["paths_mm"]):
                assert path[0][:2]==axes["edge"][i][:2] and path[-1][:2]==axes["ctrl"][i][:2]
                finger=nodes_by_id[f"stack_m2_pin_{pair[i]:02d}"]["extras"]["stack"]
                fanout=nodes_by_id[stack_key+"_finger"]["extras"]["stack"]["paths_mm"][i]
                assert max(abs(a-b) for a,b in zip(finger["ends_mm"][-1],fanout[0]))<1e-7
    print("Eight scenes, shared geometry, PCIe pin roles, PCB evidence and offline assets agree.",flush=True)


def verify_framework(markup):
    host=(HERE/"framework-desktop.glb").read_bytes()
    assert struct.unpack_from("<4sII",host)==(b"glTF",2,len(host))
    size,kind=struct.unpack_from("<I4s",host,12)
    assert kind==b"JSON"
    doc=json.loads(host[20:20+size])
    records={node["extras"]["id"]:node for node in doc["nodes"]}
    assert sorted(doc["scenes"][0]["nodes"])==list(range(len(records)))
    assert {node["extras"]["view"] for node in records.values()}=={"system"}

    def bounds(key):
        primitive=doc["meshes"][records["fw_"+key]["mesh"]]["primitives"][0]
        points=doc["accessors"][primitive["attributes"]["POSITION"]]
        return points["min"],points["max"]

    low,high=bounds("cad_board")
    assert all(abs(high[i]-low[i]-.170)<1.e-6 for i in (0,2))
    low,high=bounds("cad_post")
    assert abs((high[0]+low[0])/2-.080)<1.e-6 and abs((high[2]+low[2])/2+.011)<1.e-6
    assert records["fw_cad_socket"]["extras"]["stack"]["evidence"]=="cad"
    assert records["fw_cad_spreader"]["extras"]["stack"]["site"]=="spreader"
    assert {key:node["extras"]["stack"]["explode"] for key,node in records.items()
            if "explode" in node["extras"]["stack"]}=={
        "fw_cad_retaining_screw":"screw",
        "fw_cad_retaining_ring":"screw",
        "fw_cad_spreader":"spreader",
        "fw_cad_mylar":"spreader",
        "fw_cad_thermal_pad":"pad",
    }
    pins={n for lane in range(4) for _,p,_ in lane_pairs(lane) for n in (p,p+2)}
    assert {n for n in records if n.startswith("fw_pin_")}=={f"fw_pin_{n}" for n in pins}
    assert all(records[f"fw_pin_{n}"]["extras"]["stack"]["evidence"]=="standard" for n in pins)
    assert all(records[f"fw_host_{name}"]["extras"]["stack"]["evidence"]=="model"
               for name in ("sq","data","cq","irq","root","ram"))
    encoded=re.search(r'<script type="application/octet-stream" id="framework-asset">([^<]+)</script>',markup)
    assert encoded and gzip.decompress(base64.b64decode(encoded[1]))==host
    assert f'<meta name="framework-sha256" content="{hashlib.sha256(host).hexdigest()}">' in markup
    print("Framework host: 170 mm PCB, registered JSSD1 and post, 16 data contacts and offline asset agree.",flush=True)


def verify_mounted(layout,physical):
    mounted=build_mounted(layout,physical,build_controller(),build_sram(),build_flash())
    targets={CHIP_ZONES[p["id"]]:p for p in layout["packages"]}
    targets.update({k:next(p for p in layout["smd"] if p["id"]==source)
                    for k,source in (("coil",COIL),("cap",CAP))})
    by_id={p.id:p for p in mounted}
    sx,sy=next((r["x"],r["y"]) for r in layout["smd"] if r["id"]==LOAD_SWITCHES[0])
    sw=compound(p.shape for p in mounted if p.zone=="switch").BoundingBox()
    assert abs(sw.xmin-(sx-1.5))<.001 and abs(sw.ymax-(sy+1))<.001
    for lane in range(4):
        for name,pin,direction in lane_pairs(lane):
            segments=by_id[f"on_{name}{lane}"].shape.Solids()
            assert len(segments)==(4 if direction=="up" else 2)
            for a,b in itertools.combinations(segments,2):
                assert a.distance(b)>.02
            if direction=="up":
                for n in (pin,pin+2):
                    terminals=by_id[f"on_ac_{n}_ends"].shape.Solids()
                    assert len(terminals)==2 and terminals[0].distance(terminals[1])>.30
                    assert all(sum(end.distance(seg)<.0001 for seg in segments)==1 for end in terminals)
            else:
                assert f"on_ac_{pin}" not in by_id
    routes=[p.shape for p in mounted if p.link and "lane" in p.link]
    assert all(a.distance(b)>.02 for a,b in itertools.combinations(routes,2))
    for key,pin in (("perst",50),("clkreq",52)):
        sideband=by_id["on_"+key].shape
        assert sideband.distance(by_id[f"on_m2_pin_{pin}"].shape)<1e-5 and sideband.BoundingBox().zmax>.8
    for zone,p in targets.items():
        owned=[n for n in mounted if n.zone==zone]
        assert owned,zone
        b=compound(a.shape for a in owned).BoundingBox()
        assert b.xmin>=p["x"]-p["w"]/2-.001 and b.xmax<=p["x"]+p["w"]/2+.001,zone
        assert b.ymin>=p["y"]-p["d"]/2-.001 and b.ymax<=p["y"]+p["d"]/2+.001,zone
        assert b.zmin>=.799 and b.zmax<=.80+.052+p["h"]+.001,zone
    mem=compound(n.shape for n in mounted if n.zone=="sram").BoundingBox()
    macro=by_id["on_asic_sram_macro"].shape.BoundingBox()
    assert macro.xmin<mem.xmin<mem.xmax<macro.xmax and macro.ymin<mem.ymin<mem.ymax<macro.ymax
    assert mem.zmin>=macro.zmax-.001
    phy=by_id["on_asic_host_macro"].shape.BoundingBox()
    for p in (p for p in mounted if p.zone=="phy"):
        b=p.shape.BoundingBox()
        assert phy.xmin<b.xmin<b.xmax<phy.xmax and phy.ymin<b.ymin<b.ymax<phy.ymax
        assert b.zmin>=phy.zmax-.001
    for lane in range(4):
        metal=by_id[f"on_asic_phy_{lane}_metal"].shape
        for direction in ("PET","PER"):
            launch=by_id[f"on_package_{direction}{lane}"].shape
            assert launch.distance(metal)<1e-5 and launch.distance(by_id[f"on_{direction}{lane}"].shape)<1e-5
    assert all(by_id["on_coil_winding"].shape.distance(end)<.001 for end in by_id["on_"+COIL+"_ends"].shape.Solids())
    ends=sorted(by_id["on_"+CAP+"_ends"].shape.Solids(),key=lambda s:s.Center().y)
    for i,key in enumerate(("A","B")):
        plates=by_id["on_cap_"+key].shape.Solids()
        assert all(plate.distance(ends[i])<.001 and plate.distance(ends[1-i])>.02 for plate in plates)
    assert by_id["on_cap_A"].shape.distance(by_id["on_cap_B"].shape)>.01
    step=cq.importers.importStep(str(HERE/(STEM+"-in-place.step"))).val()
    assert step.isValid() and len(step.Solids())==sum(len(p.shape.Solids()) for p in mounted)
    b=step.BoundingBox()
    assert abs(b.xlen-80)<.001 and abs(b.ylen-22)<.001 and b.zlen<2.30
    print(f"In-place STEP: {len(mounted)} nodes, {len(step.Solids())} solids; footprints, nested SRAM and passive terminals verified.",flush=True)
    return mounted


def verify_stack(layout, physical, mounted):
    parts=build_stack(layout,physical,mounted)
    objects={p.id.removeprefix("stack_"):p.shape for p in parts}
    traces=[p for p in parts if p.stack["role"]=="trace"]
    vias=[p for p in parts if p.stack["role"]=="via"]

    def touches(a,b):
        return a.distance(b)<1e-5

    for lane in range(4):
        for _,first,direction in lane_pairs(lane):
            key=f"pcie_{lane}_{direction}"
            feed=objects[key+"_finger"]
            core=objects[key+"_pair"].Solids()
            assert len(core)==2 and core[0].distance(core[1])>.06
            for pin in (first,first+2):
                assert sum(touches(s,objects[f"m2_pin_{pin:02d}"]) for s in feed.Solids())==1
            launch=objects[key+"_aftercap"] if direction=="up" else feed
            if direction=="up":
                ends=objects[key+"_cap_ends"].Solids()
                assert len(ends)==4 and feed.distance(launch)>.40
                assert sum(touches(s,feed) for s in ends)==2 and sum(touches(s,launch) for s in ends)==2
                assert all(not (touches(s,feed) and touches(s,launch)) for s in ends)
            assert all(touches(s,launch) for s in objects[key+"_edge_via_1"].Solids())
            for site in ("edge","ctrl"):
                tubes=objects[f"{key}_{site}_via_3"].Solids()
                assert len(tubes)==2 and all(sum(touches(s,t) for t in tubes)==1 for s in core)
            assert all(touches(s,objects[key+"_launch"]) for s in objects[key+"_ctrl_via_1"].Solids())
            assert all(touches(ball,objects[key+"_launch"]) and touches(ball,objects["U_CTRL_carrier"])
                       for ball in objects[key+"_balls"].Solids())
    for side in ("a","b"):
        key="nand_"+side
        shell=objects["U_N1_body" if side=="a" else "U_N2_body"].BoundingBox()
        for i in range(len(NAND_SIGNALS)):
            bus=objects[f"{key}_{i}"]
            assert len(bus.Solids())==1
            for site in ("ctrl","flash"):
                v1=objects[f"{key}_{site}_via_1"].Solids()
                v4=objects[f"{key}_{site}_via_4"].Solids()
                hits=[j for j,v in enumerate(v4) if touches(v,bus)]
                assert len(hits)==1
                via_xy=v4[hits[0]].Center()
                above=[v for v in v1 if abs(v.Center().y-via_xy.y)<1e-5]
                assert len(above)==1 and touches(above[0],objects[f"{key}_{site}_{i}"])
                if site=="flash":
                    assert shell.xmin<via_xy.x<shell.xmax and shell.ymin<via_xy.y<shell.ymax
                balls=objects[f"{key}_{site}_balls"].Solids()
                near=[b for b in balls if touches(b,objects[f"{key}_{site}_{i}"])]
                carrier="U_CTRL_carrier" if site=="ctrl" else ("U_N1_carrier" if side=="a" else "U_N2_carrier")
                assert len(near)==1 and touches(near[0],objects[carrier])
    for key,pin in (("perst",50),("clkreq",52)):
        assert touches(objects[key+"_bottom"],objects[f"m2_pin_{pin}"])
        assert touches(objects[key+"_bottom"],objects[f"{key}_edge_via_6"])
        assert touches(objects[key+"_inner"],objects[f"{key}_edge_via_4"])
        assert touches(objects[key+"_inner"],objects[f"{key}_ctrl_via_4"])
        assert touches(objects[key+"_top"],objects[f"{key}_ctrl_via_1"])
    for p in vias:
        n=p.stack["layer"]
        net=p.stack["net"]
        site=p.stack["site"]
        if n in (2,5):
            gap=objects[f"ground_plane_{n}"].distance(p.shape)
            assert gap<1e-5 if net.startswith("ground_") else gap>.10,p.id
        if n<6:
            below=objects[f"{net}_{site}_via_{n+1}"].Solids()
            for segment in p.shape.Solids():
                assert sum(touches(segment,b) for b in below)==1

    # Net isolation includes unused barrel sections traversing other signal layers.
    boxes={p.id:p.shape.BoundingBox() for p in traces+vias}
    for p,q in itertools.chain(itertools.combinations(traces,2),itertools.product(traces,vias)):
        if p.stack["net"]==q.stack["net"] and q.stack["role"]=="via":
            continue
        a,b=boxes[p.id],boxes[q.id]
        if all(min(getattr(a,k+"max"),getattr(b,k+"max"))>=max(getattr(a,k+"min"),getattr(b,k+"min"))-.0001
               for k in "xyz"):
            assert not touches(p.shape,q.shape),(p.id,q.id)

    substrate=compound(p.shape for p in parts if p.stack["role"]=="dielectric")
    outline=substrate.BoundingBox()
    assert abs(outline.xlen-80)<.001 and abs(outline.ylen-22)<.001
    layer_step=cq.importers.importStep(str(HERE/(STEM+"-layer-stack.step"))).val()
    assert layer_step.isValid()
    assert len(layer_step.Solids())==sum(len(p.shape.Solids()) for p in parts
                                        if p.stack["role"] not in STACK_VIEW_ONLY)
    print(f"PCB layer STEP: {len(layer_step.Solids())} solids; 8 PCIe pairs and two 15-line NAND buses, through-wall continuity and isolation verified.",flush=True)
    verify_chip_windows(layout,parts)


def verify_chip_windows(layout,parts):
    by_id={p.id:p for p in parts}
    packages={p["id"]:p for p in layout["packages"]}
    for p in parts:
        s=p.stack
        if s["role"]!="chip_detail":
            continue
        pkg=packages["U_CTRL" if s["site"]=="ctrl" else "U_N1" if s["net"]=="nand_a" else "U_N2"]
        b=p.shape.BoundingBox()
        assert pkg["x"]-pkg["w"]/2-.001<=b.xmin<b.xmax<=pkg["x"]+pkg["w"]/2+.001,p.id
        assert pkg["y"]-pkg["d"]/2-.001<=b.ymin<b.ymax<=pkg["y"]+pkg["d"]/2+.001,p.id
        assert .798<=b.zmin<b.zmax<=.853+pkg["h"],p.id
        assert s["evidence"]=="model",p.id
    for side in ("a","b"):
        def shape(key):
            return by_id[f"stack_io_nand_{side}_{key}"].shape
        assert len(shape("wordline").Solids())==1 and len(shape("pass_wl").Solids())==4
        assert shape("wordline").distance(shape("strings"))>.045
        assert shape("wordline").distance(shape("row_wl"))<1e-5
        assert len(shape("sense").Solids())==len(shape("page").Solids())==8
        for wire,first,last in (("bl","strings","bl_drop"),("bl_drop","bl","sense"),
                                ("sense_link","sense","page"),("page_to_mux","page","column")):
            for branch in shape(wire).Solids():
                assert branch.distance(shape(first))<1e-5 and branch.distance(shape(last))<1e-5, (side,wire)
    def syndrome(code):
        error=0
        for i,v in enumerate(code,1):
            if v=="1":
                error^=i
        return error
    corrupt,corrected=(by_id[f"stack_io_ecc_{key}"].stack["codeword"] for key in ("word","fix"))
    assert syndrome(corrupt)==5 and syndrome(corrected)==0
    assert [i for i,(a,b) in enumerate(zip(corrupt,corrected),1) if a!=b]==[5]
    print("Chip windows registered to their packages; bit lines, latches, word-line isolation and ECC example verified.",flush=True)


def verify_clearance(parts):
    boxes={p.id:p.shape.BoundingBox() for p in parts}
    for p,q in itertools.combinations(parts,2):
        a,b=boxes[p.id],boxes[q.id]
        if any(min(getattr(a,k+"max"),getattr(b,k+"max"))-max(getattr(a,k+"min"),getattr(b,k+"min"))<.0005
               for k in "xyz"):
            continue
        common=p.shape.intersect(q.shape)
        if common.Solids() and common.Volume()>1e-6:
            raise AssertionError(f"Physical overlap: {p.id}, {q.id}, {common.Volume():.6f} mm³")


def verify_sram():
    nets={p.id.removeprefix("cell_net_"):p.shape for p in build_sram() if p.id.startswith("cell_net_")}
    for (k,a),(l,b) in itertools.combinations(nets.items(),2):
        assert a.distance(b)>1e-5, f"Short between {k} and {l}"
    for name,net in nets.items():
        # Connectivity of every metal segment and contact within each named net.
        solids=net.Solids()
        seen={0}
        while True:
            added={j for j in range(len(solids)) if j not in seen
                   and any(solids[i].distance(solids[j])<1e-6 for i in seen)}
            if not added:
                break
            seen|=added
        assert len(seen)==len(solids), f"Disconnected metal inside {name}"
    # Probe the two terminals and the separate gate for all six devices.
    for sign,internal,other,bl in ((-1,"q","qb","bl"),(1,"qb","q","blb")):
        x=sign*2.55
        gx=x-sign*.72
        probes=[("vdd",x,2.64,.84),(internal,x,.96,.84),(other,gx,1.8,.68),
                ("vss",x,-2.64,.84),(internal,x,-.96,.84),(other,gx,-1.8,.68),
                (bl,sign*6.94,0,.84),(internal,sign*5.26,0,.84),("wl",sign*6.10,.72,.68)]
        for name,xx,yy,zz in probes:
            assert any(s.isInside((xx,yy,zz),1e-6) for s in nets[name].Solids()), f"Open {name} at {(xx,yy,zz)}"
    print("6T: seven isolated, connected nets; 18 transistor terminals checked.",flush=True)


def verify_installation(physical):
    installed=build_installed(physical)
    obj={p.id:p.shape for p in installed}
    for n in CONTACT_PINS:
        spring=obj[f"host_pin_{n:02d}"]
        assert len(spring.Solids())==1 and spring.distance(obj[f"installed_m2_pin_{n:02d}"])<1e-6,n
        assert spring.distance(obj["host_pads"])<1e-6,n
        if n+2 in CONTACT_PINS:
            assert spring.distance(obj[f"installed_m2_pin_{n+2:02d}"])>.10,n
    screw,post_=obj["host_screw"],obj["host_standoff"]
    assert screw.distance(obj["installed_m2_mount_top"])<1e-6
    assert post_.distance(obj["installed_m2_mount_bottom"])<1e-6
    assert post_.distance(obj["host_boss_joint"])<1e-6
    assert abs(obj["host_lid"].BoundingBox().zmax-HOST_Z-3.2)<1e-6
    assert abs(obj["installed_m2_mount_bottom"].BoundingBox().zmin-obj["host_mask"].BoundingBox().zmax-1.5)<1e-6
    verify_clearance(installed)
    step=cq.importers.importStep(str(HERE/(STEM+"-installed.step"))).val()
    assert step.isValid() and len(step.Solids())==sum(len(p.shape.Solids()) for p in installed)
    print(f"Installed STEP: {len(step.Solids())} solids; 67 contacts on both finger and host pad, head and shoulder seated, no solid overlap.",flush=True)


def main():
    verify_files()
    verify_sram()
    layout=json.loads((HERE/"board-layout.json").read_text(encoding="utf-8-sig"))
    p=build_physical(layout)
    mounted=verify_mounted(layout,p)
    verify_stack(layout,p,mounted)
    verify_installation(p)
    assert len([x for x in p if x.id.startswith("m2_pin_")])==len(CONTACT_PINS)==67
    verify_clearance(p)
    shape=cq.importers.importStep(str(HERE/(STEM+".step"))).val()
    expected=compound(t.shape for t in p)
    assert shape.isValid() and len(shape.Solids())==len(expected.Solids())
    a,b=shape.BoundingBox(),expected.BoundingBox()
    assert all(abs(getattr(a,k)-getattr(b,k))<.002 for k in ("xmin","xmax","ymin","ymax","zmin","zmax"))
    print(f"Physical STEP: {len(shape.Solids())} solids, {a.xlen:.3f} × {a.ylen:.3f} × {a.zlen:.3f} mm; clearance passed.",flush=True)
    study=cq.importers.importStep(str(HERE/(STEM+"-circuits.step"))).val()
    board=build_pcb_circuits(layout)
    geom={p.id:p.shape for p in board}
    assert geom["pcb_PET0_via"].distance(geom["pcb_via_reference"])>.08
    assert all(g.distance(geom["pcb_ground"])<1e-5 and g.distance(geom["pcb_via_reference"])<1e-5
               for g in geom["pcb_via_stitch"].Solids())
    study_parts=board+build_controller()+build_sram()+build_flash()
    assert study.isValid() and len(study.Solids())==sum(len(p.shape.Solids()) for p in study_parts)
    print(f"Electrical STEP: {len(study.Solids())} valid solids.",flush=True)


if __name__=="__main__":
    main()
