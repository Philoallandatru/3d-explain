"""Register the existing SSD and Framework meshes for the power-cycle scene."""

import json
import struct
from pathlib import Path


APP = Path(__file__).resolve().parents[1]
MODELS = APP.parent / "ssd-model"
OUTPUT = APP / "public/models/power-cycle.glb"

HOST_PARTS = {
    "fw_cad_board", "fw_cad_packages", "fw_cad_socket", "fw_cad_post", "fw_host_root",
    "fw_cad_08", "fw_cad_09", "fw_cad_11", "fw_cad_15", "fw_cad_26", "fw_cad_47",
    "fw_cad_59", "fw_cad_60", "fw_cad_61", "fw_cad_73", "fw_cad_74", "fw_cad_75",
    "fw_cad_76", "fw_cad_77", "fw_cad_86",
}


def ssd_node(node):
    info = node["extras"]
    if info["view"] == "physical":
        return info["group"] not in {"top_label", "bottom_label"}
    if info["view"] == "stack":
        return node["name"].startswith("stack_io_nand_a_")
    return info["view"] == "mounted" and info["zone"] in {"ctrl", "phy"} and (
        info["group"] in {"on_ctrl", "on_phy"} or node["name"].startswith("on_asic_")
    )


def read_glb(path):
    data = path.read_bytes()
    assert struct.unpack_from("<4sII", data) == (b"glTF", 2, len(data)), path
    size, kind = struct.unpack_from("<I4s", data, 12)
    assert kind == b"JSON", path
    length, kind = struct.unpack_from("<I4s", data, 20 + size)
    assert kind == b"BIN\0" and len(data) == 28 + size + length, path
    return json.loads(data[20:20 + size]), data[28 + size:]


def collect(output, payload, source, binary, select):
    remap = {key: {} for key in ("materials", "accessors", "bufferViews", "meshes")}

    def add(key, index):
        if index in remap[key]:
            return remap[key][index]
        entry = source[key][index].copy()
        if key == "bufferViews":
            start = entry.get("byteOffset", 0)
            payload.extend(bytes(-len(payload) % 4))
            entry["byteOffset"] = len(payload)
            payload.extend(binary[start:start + entry["byteLength"]])
        elif key == "accessors":
            entry["bufferView"] = add("bufferViews", entry["bufferView"])
        elif key == "meshes":
            entry["primitives"] = [
                {**primitive, "material": add("materials", primitive["material"]),
                 "indices": add("accessors", primitive["indices"]),
                 "attributes": {key: add("accessors", i) for key, i in primitive["attributes"].items()}}
                for primitive in entry["primitives"]
            ]
        dest = len(output[key])
        output[key].append(entry)
        remap[key][index] = dest
        return dest

    for node in source["nodes"]:
        if select(node):
            output["nodes"].append({**node, "mesh": add("meshes", node["mesh"])})


def main():
    doc = {key: [] for key in ("nodes", "meshes", "materials", "bufferViews", "accessors")}
    blob = bytearray()
    collect(doc, blob, *read_glb(MODELS / "framework-desktop.glb"), lambda n: n["name"] in HOST_PARTS)
    collect(doc, blob, *read_glb(MODELS / "990-pro-2tb.glb"), ssd_node)
    names = {n["name"] for n in doc["nodes"]}
    assert {"fw_cad_board", "fw_cad_socket", "fw_host_root", "m2_core", "U_CTRL_body", "U_N1_body",
            "U_PWR_body", "on_asic_host_macro", "on_asic_dma_macro", "stack_io_nand_a_page"} <= names
    blob.extend(bytes(-len(blob) % 4))
    doc.update(asset={"version": "2.0", "generator": "NVMe Power Cycle",
                      "copyright": "Framework Desktop CAD: Framework Computer Inc., CC BY 4.0. "
                                   "Selected geometry, colored and registered with the 990 PRO study."},
               scene=0, scenes=[{"name": "NVMe power-cycle assembly", "nodes": list(range(len(doc["nodes"])))}],
               buffers=[{"byteLength": len(blob)}])
    data = json.dumps(doc, ensure_ascii=False, separators=(",", ":")).encode()
    data += b" " * (-len(data) % 4)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("wb") as out:
        out.write(struct.pack("<4sIII4s", b"glTF", 2, len(data) + len(blob) + 28, len(data), b"JSON"))
        out.write(data)
        out.write(struct.pack("<I4s", len(blob), b"BIN\0"))
        out.write(blob)
    print(f"{OUTPUT.name}: {len(names)} named parts, {OUTPUT.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
