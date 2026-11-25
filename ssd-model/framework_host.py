# /// script
# requires-python = ">=3.11,<3.13"
# dependencies = ["cadquery==2.6.1"]
# ///
"""Convert the public Framework Desktop STEP into the registered host view."""

import argparse
import hashlib
from pathlib import Path
from tempfile import TemporaryDirectory

import cadquery as cq
from OCP.IFSelect import IFSelect_RetDone
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TCollection import TCollection_ExtendedString
from OCP.TDataStd import TDataStd_Name
from OCP.TDF import TDF_Label, TDF_LabelSequence
from OCP.TDocStd import TDocStd_Document
from OCP.XCAFDoc import XCAFDoc_DocumentTool

from geometry import MATERIALS, Part, frame, glyphs, tile
from glb_export import write_glb
from m2_card import BOARD_TOP, lane_pairs, pin_center_y, pin_name


HERE = Path(__file__).resolve().parent
OUTPUT = HERE / "framework-desktop.glb"
SOURCE_SHA256 = "48369d44f6fa32678ef56f6c8bf6c63fb18640e14bad9481a86fa1245e7a4d85"
TOP_SLOT = "LFSP0_SSD_MODULE_ASSY_TOP_ASM"
TOP_SPREADER = "LFSP0_SSD_PLATE_ASSY_TOP_ASM"
EXPLODED_HARDWARE = {
    "LFSP0_SSD_PLATE_TOP": ("cad_spreader", "正面插槽热扩散片", "spreader", "host_ports"),
    "LFSP0_SSD_PLATE_MYLAR": ("cad_mylar", "热扩散片绝缘膜", "spreader", "host_socket"),
    "LFSP0_SSD_THM_PAD": ("cad_thermal_pad", "正面插槽导热垫", "pad", "host_socket"),
    "LFSP0_SCREW_M2_FOR_SSD": ("cad_retaining_screw", "SSD 固定螺钉", "screw", "host_hardware"),
    "T_GFW30_LOW_SCREW_E_RING": ("cad_retaining_ring", "固定螺钉卡环", "screw", "host_hardware"),
}
PCB = "LFSP0_MB_PCB"
SOCKET = "LFSP0_DEREN_5621D3-030HXB11R"
POST = "LFSP0_SSD_STANDOFF_ES00000TO00"
PACKAGES = "DW_LPDDR5_CHIP"
# Top SN740 PCB edge, bottom and short side in the vendor STEP coordinate system.
SSD_DATUM = (-34.75, 14.80, 148.43)

COLORS = {
    **{key: MATERIALS[key] for key in ("stack_standard", "stack_trace", "deep")},
    "host_laminate": ("465c69", .04, .70),
    "host_body": ("434950", .05, .64),
    "host_socket": ("58647b", .10, .52),
    "host_ports": ("adb7bc", .21, .48),
    "host_hardware": ("c3a66f", .20, .50),
    "host_marks": ("c7cdc9", .02, .68),
}


def read_step(source):
    """Resolve named XCAF instances, including repeated connector subassemblies."""
    with source.open('rb') as file:
        checksum = hashlib.file_digest(file, "sha256").hexdigest()
    if checksum != SOURCE_SHA256:
        raise ValueError("STEP does not match the validated Framework V01 revision")
    reader = STEPCAFControl_Reader()
    doc = TDocStd_Document(TCollection_ExtendedString("XmlXCAF"))
    if reader.ReadFile(str(source)) != IFSelect_RetDone or not reader.Transfer(doc):
        raise ValueError(f"Unable to read STEP: {source}")
    tool = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())
    roots = TDF_LabelSequence()
    tool.GetFreeShapes(roots)

    def walk(label, placement, parents=()):
        if tool.IsReference_s(label):
            ref = TDF_Label()
            if tool.GetReferredShape_s(label, ref):
                yield from walk(ref, placement * cq.Location(tool.GetLocation_s(label)), parents)
            return
        attr = TDataStd_Name()
        name = attr.Get().ToExtString() if label.FindAttribute(TDataStd_Name.GetID_s(), attr) else ""
        path = (*parents, name)
        if tool.IsAssembly_s(label):
            children = TDF_LabelSequence()
            tool.GetComponents_s(label, children)
            for i in range(1, children.Length() + 1):
                yield from walk(children.Value(i), placement, path)
        else:
            raw = tool.GetShape_s(label)
            if not raw.IsNull():
                yield path, cq.Shape.cast(raw).moved(placement)

    return [item for i in range(1, roots.Length() + 1) for item in walk(roots.Value(i), cq.Location())]


def ssd_coordinates(shape):
    x, y, z = SSD_DATUM
    # STEP +Y is board normal. SSD +X points from the slot to the fixing notch.
    return (shape.rotate((0, 0, 0), (1, 0, 0), -90)
            .rotate((0, 0, 0), (0, 1, 0), 180)
            .translate((x, -z, -y)))


def registered_host(leaves):
    omit = ("_GND", "_LIMIT", "NON_STAMP_HOLE", "_EMN_3D", "SSD_LABEL")
    landmarks = {}
    parts = []
    for index, (path, vendor_shape) in enumerate(leaves):
        name = path[-1]
        path_text = '/'.join(path)
        if not vendor_shape.Faces() or any(word in path_text for word in omit):
            continue
        if TOP_SLOT in path and 'SN740_2280' in name:
            reference = ssd_coordinates(vendor_shape).BoundingBox()
            if (abs(reference.xmin) > .005 or abs(reference.xmax - 80) > .005
                    or abs(reference.ymin) > .005 or abs(reference.ymax - 22) > .005):
                raise ValueError("Reference drive does not match the 2280 mounting datum")
            continue
        shape = ssd_coordinates(vendor_shape)
        key, label, site, mat = f"cad_{index:02d}", name, "board", "host_body"
        motion = {}
        if name == PCB:
            key, label, mat = "cad_board", "Framework Desktop · Mini-ITX PCB", "host_laminate"
        elif name == SOCKET:
            key, label, site, mat = "cad_socket", "JSSD1 · 正面 M.2 主槽", "socket", "host_socket"
        elif name == POST:
            key, label, site, mat = "cad_post", "2280 · 尾部固定柱", "mount", "host_hardware"
        elif TOP_SPREADER in path:
            site, mat = "spreader", "host_ports"
            if name in EXPLODED_HARDWARE:
                key, label, motion["explode"], mat = EXPLODED_HARDWARE[name]
        elif name == PACKAGES:
            key, label, mat = "cad_packages", "SoC 与板载内存 · 封装区域", "host_socket"
        elif "IO_1LAYER" in path_text:
            mat = "host_ports"
        elif "WHITE_MARK" in name:
            mat = "host_marks"
        elif "STANDOFF" in name or "SCREW_M2_FOR_SSD" in name:
            mat = "host_hardware"
        detail = "Framework Desktop 官方 STEP 的装配几何，保留部件位置。"
        if site == "spreader":
            detail += "热扩散片沿用原厂参考盘的闭合位置，990 PRO 装配间隙待核验。"
        parts.append(host_part(key, label, shape, mat, "host_cad", "cad", site, detail, **motion))
        landmarks[key] = shape

    board = landmarks["cad_board"].BoundingBox()
    post = landmarks["cad_post"].BoundingBox().center
    if abs(board.xlen - 170) > .01 or abs(board.ylen - 170) > .01:
        raise ValueError("Unexpected Mini-ITX board dimensions")
    if abs(post.x - 80) > .01 or abs(post.y - 11) > .01:
        raise ValueError("SSD mounting notch is not aligned with the post")
    print(f"Framework STEP registered · {len(parts)} CAD parts · 80 × 22 mm reference", flush=True)
    return parts, landmarks["cad_packages"], board.zmax


def host_part(key, label, shape, material, role, evidence, site, detail, **meta):
    return Part("fw_" + key, label, "framework_" + site, material, shape, "system", desc=detail,
                stack={"layer": 1, "role": role, "evidence": evidence, "site": site, "net": "", **meta})


def logic(packages, board_top):
    """Place teaching anchors beside the package region, on the host board."""
    package_bounds = packages.BoundingBox()
    soc = max((solid.BoundingBox() for solid in packages.Solids()), key=lambda b: b.xlen * b.ylen)
    root = (soc.center.x, soc.center.y, package_bounds.zmax + .12)
    memory = (package_bounds.xmax + 16, package_bounds.center.y, board_top + 1.30)
    x, y, z = memory
    yield host_part("host_ram", "主机缓冲区与队列", frame(x, y, z, 24, 30, .22, .12),
                    "stack_trace", "host_actor", "model", "host",
                    "这些队列与缓冲区是主机内存中的逻辑地址。位置和大小用于讲解。")
    endpoints = (
        ("host_sq", "提交队列 SQ", "SQ", x, y + 10.4, z, 18, 5.3, "主机写入命令，再由 SSD 从内存抓取 SQE。"),
        ("host_data", "主机 4 KiB 数据缓冲区", "4 KiB", x, y + 2.8, z, 18, 7, "读数据写入此处。写命令从此处读取负载。"),
        ("host_cq", "完成队列 CQ", "CQ", x, y - 5.0, z, 18, 5.6, "SSD 另发一次写事务更新 CQE。"),
        ("host_irq", "MSI-X 中断目标", "MSI-X", x, y - 11.3, z, 18, 4.4, "可选的中断写入目标，以地址窗口示意。"),
        ("host_root", "SoC · PCIe 根端口", "PCIe", *root, 13, 6.5, "根端口位于 SoC。着色方块标示功能位置。"),
    )
    for key, title, text, x, y, z, w, d, detail in endpoints:
        shape = tile(x, y, z, w, d, .26)
        yield host_part(key, title, shape, "stack_trace", "host_actor", "model", "host", detail, actor=key)
        yield host_part(key+"_mark", title, glyphs(text, x, y, z+.26, 1.7, .018, bold=True),
                        "deep", "host_actor", "model", "host", detail, actor=key)

    for pin in sorted({n for lane in range(4) for _, p, _ in lane_pairs(lane) for n in (p, p+2)}):
        # Pin-coordinate markers above the upper contact row. Housing and spring shape come from STEP.
        y = pin_center_y(pin)
        label = f"JSSD1 · #{pin} {pin_name(pin)}"
        yield host_part(f"pin_{pin}", label, tile(-.82, y, BOARD_TOP+.030, .72, .18, .055),
                        "stack_standard", "host_pin", "standard", "socket",
                        "主板图纸的 JSSD1 针号映射到对应金手指。蓝标表示针位。", pin=pin)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("step", type=Path, help="Original FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    parts, packages, board_top = registered_host(read_step(args.step))
    parts.extend(logic(packages, board_top))
    with TemporaryDirectory(dir=args.output.resolve().parent) as work:
        stage = Path(work) / "host.glb"
        write_glb(stage, parts, COLORS, scenes=(("system", "Framework Desktop with JSSD1"),),
                  tolerance=.095, angle=.48)
        stage.replace(args.output)
    print(f"{args.output.name} · {len(parts)} parts · {args.output.stat().st_size:,} bytes", flush=True)


if __name__ == "__main__":
    main()
