# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["cadquery==2.6.1"]
# ///
"""Rebuild the 990 PRO physical assembly, electrical studies and offline viewer asset.

Run: uv run --python 3.11 build_model.py
"""

import argparse
import base64
import csv
import gzip
import hashlib
import json
from collections import Counter
from pathlib import Path
from tempfile import TemporaryDirectory

import cadquery as cq

from controller import build_controller
from geometry import MATERIALS, compound
from glb_export import write_glb
from inplace import build_mounted
from installation import build_installed
from nand import build_flash
from pcb_circuits import build_pcb_circuits
from physical import build_physical
from sram import build_sram
from stack_board import LAYERS, LAYER_HEIGHT, STACK_VIEW_ONLY, build_stack


HERE=Path(__file__).resolve().parent
STEM="990-pro-2tb"


def subtree(parts, name):
    assembly=cq.Assembly(name=name)
    for group in dict.fromkeys(p.group for p in parts):
        branch=cq.Assembly(name=group+"_assembly" if any(p.id==group for p in parts) else group)
        for p in (p for p in parts if p.group==group):
            rgb=MATERIALS[p.material][0]
            color=cq.Color(*(int(rgb[i:i+2],16)/255 for i in (0,2,4)))
            branch.add(p.shape,name=p.id,color=color)
        assembly.add(branch)
    return assembly


def write_assemblies(dest,parts):
    physical=[p for p in parts if p.view=="physical"]
    subtree(physical,"Samsung_990_PRO_2TB").export(str(dest/(STEM+".step")),exportType="STEP")
    mounted=[p for p in parts if p.view=="mounted"]
    subtree(mounted,"Samsung_990_PRO_2TB_in_place").export(str(dest/(STEM+"-in-place.step")),exportType="STEP")
    installed=[p for p in parts if p.view=="installed"]
    subtree(installed,"M2_2280_installed").export(str(dest/(STEM+"-installed.step")),exportType="STEP")
    stack=[p for p in parts if p.view=="stack" and p.stack["role"] not in STACK_VIEW_ONLY]
    layered=cq.Assembly(name="Samsung_990_PRO_2TB_illustrative_stack")
    for layer,*_ in LAYERS:
        layered.add(subtree([p for p in stack if p.stack["layer"]==layer],f"L{layer}"))
    layered.export(str(dest/(STEM+"-layer-stack.step")),exportType="STEP")
    studies=cq.Assembly(name="SSD_electrical_studies")
    for view,name,offset in (("pcb","Board_signal_and_power",(0,0,0)),
                             ("asic","Controller_cutaway",(16,39,0)),("cell","Six_transistor_SRAM",(47,39,0)),
                             ("flash","Charge_trap_NAND",(74,39,0))):
        branch=subtree([p for p in parts if p.view==view],name)
        studies.add(branch,loc=cq.Location(cq.Vector(*offset)))
    studies.export(str(dest/(STEM+"-circuits.step")),exportType="STEP")


def write_viewer(dest,glb):
    source=HERE/"viewer"
    markup=(source/"template.html").read_text(encoding="utf-8")
    blob=glb.read_bytes()
    host=(HERE/"framework-desktop.glb").read_bytes()
    fields={"/*__THREE_LICENSE__*/":"/* Three.js r170\n"+(source/"THREE-LICENSE.txt").read_text(encoding="utf-8")+"\n*/",
            "__LINK_GUIDE__":(HERE/"link-guide.json").read_text(encoding="utf-8"),
            "__IO_WHY__":(source/"why-io.json").read_text(encoding="utf-8"),
            "__STACK_GUIDE__":json.dumps({"layers":LAYERS,"copper_mm":LAYER_HEIGHT},ensure_ascii=False),
            "/*__VENDOR__*/":(source/"three.bundle.js").read_text(encoding="utf-8"),
            "/*__ASSEMBLY_EXPLODE__*/":(source/"assembly.js").read_text(encoding="utf-8"),
            "/*__STACK_PLAYBACK__*/":(source/"stack-playback.js").read_text(encoding="utf-8"),
            "/*__STACK_APPLICATION__*/":(source/"stack.js").read_text(encoding="utf-8"),
            "/*__APPLICATION__*/":(source/"app.js").read_text(encoding="utf-8"),
            "__GLB_HASH__":hashlib.sha256(blob).hexdigest(),"__MODEL__":base64.b64encode(blob).decode("ascii"),
            "__FRAMEWORK_HASH__":hashlib.sha256(host).hexdigest(),
            "__FRAMEWORK_MODEL__":base64.b64encode(gzip.compress(host,compresslevel=6,mtime=0)).decode("ascii")}
    for slot,value in fields.items():
        if markup.count(slot)!=1:
            raise ValueError("Missing or ambiguous viewer slot: "+slot)
        markup=markup.replace(slot,value.replace("</script",r"<\/script"))
    dest.write_text(markup,encoding="utf-8")


def write_inventory(path,parts):
    with path.open("w",encoding="utf-8-sig",newline="") as f:
        writer=csv.writer(f)
        writer.writerow(["id","view","group","label","material","xmin_mm","ymin_mm","zmin_mm",
                         "xmax_mm","ymax_mm","zmax_mm","evidence_or_function","board_zone","geometry_reference",
                         "pcb_layer","pcb_role","pcb_evidence","pcb_net"])
        for p in parts:
            b=p.shape.BoundingBox()
            bbox=[round(getattr(b,k),4) for k in ("xmin","ymin","zmin","xmax","ymax","zmax")]
            stack=p.stack or {}
            writer.writerow([p.id,p.view,p.group,p.label,p.material,*bbox,p.desc,p.zone,p.mesh_ref,
                             *(stack.get(key,"") for key in ("layer","role","evidence","net"))])


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--viewer-only",action="store_true",help="Refresh HTML using the existing SSD and host GLB assets")
    if parser.parse_args().viewer_only:
        with TemporaryDirectory(dir=HERE) as work:
            viewer=Path(work)/"view.html"
            write_viewer(viewer,HERE/(STEM+".glb"))
            viewer.replace(HERE/"view.html")
        print("Offline viewer ready.",flush=True)
        return
    layout=json.loads((HERE/"board-layout.json").read_text(encoding="utf-8-sig"))
    print("Building the photographed card and electrical geometry",flush=True)
    physical=build_physical(layout)
    controller,sram,flash=build_controller(),build_sram(),build_flash()
    mounted=build_mounted(layout,physical,controller,sram,flash)
    parts=physical+build_pcb_circuits(layout)+controller+sram+flash+mounted+build_installed(physical)
    parts+=build_stack(layout,physical,mounted)
    if len({p.id for p in parts})!=len(parts):
        raise ValueError("Part IDs must be unique across all scenes")
    for p in parts:
        if p.material not in MATERIALS or not p.shape.Solids() or not p.shape.isValid():
            raise ValueError("Invalid geometry or material: "+p.id)
    b=compound(p.shape for p in physical).BoundingBox()
    dims=(b.xlen,b.ylen,b.zlen)
    if abs(dims[0]-80)>.005 or abs(dims[1]-22)>.005 or dims[2]>2.30+.001:
        raise ValueError(f"Physical model does not fit Samsung's envelope: {dims}")
    print(f"Envelope {dims}; nodes by view {dict(Counter(p.view for p in parts))}",flush=True)
    with TemporaryDirectory(dir=HERE) as work:
        stage=Path(work)
        print("Exporting coloured STEP assemblies",flush=True)
        write_assemblies(stage,parts)
        print("Tessellating the glTF scenes",flush=True)
        glb=stage/(STEM+".glb")
        write_glb(glb,parts,MATERIALS)
        write_inventory(stage/"parts.csv",parts)
        write_viewer(stage/"view.html",glb)
        for f in stage.iterdir():
            f.replace(HERE/f.name)
    print("Exports ready.",flush=True)


if __name__=="__main__":
    main()
