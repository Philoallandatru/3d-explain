"""Write the same OCCT bodies as a named, metre-based glTF 2.0 scene."""

import json
import struct
from pathlib import Path

import numpy as np


SSD_SCENES = (
    ("mounted", "Samsung 990 PRO 2TB - in-place board cutaway"),
    ("physical", "Samsung 990 PRO 2TB - physical assembly"),
    ("pcb", "PCB electrical paths - illustrative"),
    ("asic", "Controller package and architecture - illustrative"),
    ("cell", "6T SRAM - illustrative"),
    ("flash", "Charge-trap V-NAND - illustrative"),
    ("installed", "990 PRO in a reference M-key host socket"),
    ("stack", "990 PRO 2TB - registered six-copper-layer study"),
)


def write_glb(path: Path, parts, materials, *, scenes=SSD_SCENES, tolerance=.045, angle=None):
    payload = bytearray()
    views, accessors, meshes, nodes = [], [], [], []

    def accessor(array, kind, component_type, target, bounds=False):
        payload.extend(bytes(-len(payload) % 4))
        offset = len(payload)
        raw = array.tobytes(order="C")
        payload.extend(raw)
        views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(raw), "target": target})
        item = {"bufferView": len(views) - 1, "componentType": component_type, "count": len(array), "type": kind}
        if bounds:
            item.update(min=array.min(axis=0).tolist(), max=array.max(axis=0).tolist())
        accessors.append(item)
        return len(accessors) - 1

    def linear(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    palette = []
    for name, (rgb, metallic, roughness) in materials.items():
        color = [linear(int(rgb[i:i + 2], 16) / 255) for i in (0, 2, 4)]
        palette.append({"name": name, "pbrMetallicRoughness": {
            "baseColorFactor": color + [1], "metallicFactor": metallic, "roughnessFactor": roughness}})
    material_ids = {name: i for i, name in enumerate(materials)}

    def mesh_for(part):
        # The stack adds hundreds of small plated surfaces. A coarser angular
        # sampling keeps the offline viewer compact; STEP retains the cylinders.
        angular_tolerance = angle if angle is not None else .42 if part.stack else .22
        vertices, triangles = part.shape.tessellate(tolerance, angular_tolerance)
        xyz = np.asarray([v.toTuple() for v in vertices], dtype=float)
        faces = np.asarray(triangles, dtype=np.uint32)
        if not len(faces):
            raise ValueError(f"No triangles for {part.id}")
        # Board X runs from the M-key edge to the fixing notch. glTF uses Y up.
        xyz = xyz[:, [0, 2, 1]] / 1000
        xyz[:, 2] *= -1
        norm = np.zeros_like(xyz)
        fn = np.cross(xyz[faces[:, 1]] - xyz[faces[:, 0]], xyz[faces[:, 2]] - xyz[faces[:, 0]])
        for i in range(3):
            np.add.at(norm, faces[:, i], fn)
        lengths = np.linalg.norm(norm, axis=1)
        valid = lengths > 1e-20
        norm[valid] /= lengths[valid, None]
        norm[~valid] = (0.0, 1.0, 0.0)
        indices = faces.reshape(-1)
        index_type = 5123 if len(xyz) <= 65535 else 5125
        primitive = {
            "attributes": {"POSITION": accessor(xyz.astype("<f4"), "VEC3", 5126, 34962, True),
                           "NORMAL": accessor(norm.astype("<f4"), "VEC3", 5126, 34962)},
            "indices": accessor(indices.astype("<u2" if index_type == 5123 else "<u4"), "SCALAR", index_type, 34963),
            "material": material_ids[part.material],
        }
        meshes.append({"name": part.id, "primitives": [primitive]})
        return len(meshes)-1

    mesh_ids, variants = {}, {}
    for part in parts:
        if part.mesh_ref:
            original=mesh_ids[part.mesh_ref]
            primitive=meshes[original]["primitives"][0]
            material=material_ids[part.material]
            mesh_id=original
            if material!=primitive["material"]:
                key=(original,material)
                if key not in variants:
                    variants[key]=len(meshes)
                    meshes.append({"name":part.id,"primitives":[{**primitive,"material":material}]})
                mesh_id=variants[key]
        else:
            mesh_id=mesh_for(part)
        mesh_ids[part.id] = mesh_id
        nodes.append({"name": part.id, "mesh": mesh_id, "extras": {
            "label": part.label, "id": part.id, "group": part.group, "view": part.view,
            "stage": part.stage, "desc": part.desc, "zone": part.zone, "explode_mm": [0, 0, 0],
            **({"link":part.link} if part.link else {}),
            **({"stack":part.stack} if part.stack else {}),
        }})
    header = {
        "asset": {"version": "2.0", "generator": "Samsung 990 PRO 2TB study / CadQuery"},
        "scene": 0, "scenes": [
            {"name": title, "nodes": [i for i, p in enumerate(parts) if p.view == key]}
            for key, title in scenes],
        "nodes": nodes, "meshes": meshes, "materials": palette, "accessors": accessors,
        "bufferViews": views, "buffers": [{"byteLength": len(payload)}],
    }
    text = json.dumps(header, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    text += b" " * (-len(text) % 4)
    payload.extend(bytes(-len(payload) % 4))
    with path.open("wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, 28 + len(text) + len(payload)))
        f.write(struct.pack("<I4s", len(text), b"JSON"))
        f.write(text)
        f.write(struct.pack("<I4s", len(payload), b"BIN\0"))
        f.write(payload)
