"""Samsung 990 PRO 2 TB 无散热片版的 M.2 2280-M 板卡和卡边接触面。

元件面俯视：插入端 x=0，螺钉半孔 x=80，M 键位于 y=17.125。
顶/底面共用物理 XY；成品板的顶面为 z=0.80，底面为 z=0（mm）。
图形依据 ACES 51765 系列推荐卡图第 13 页和 E-tec MPE-075-REMR9 第 2 页。
薄层厚度用于独立显示基材、阻焊及金属表面，未测量该 SKU 的 PCB 叠层或镀层。
"""

from math import radians, tan

import cadquery as cq


LENGTH = 80.0
WIDTH = 22.0
BOARD_TOP = 0.80
BOARD_BOTTOM = 0.0
SURFACE_LAYER = 0.02
KEY_Y = WIDTH / 2 + 6.125
KEY_RADIUS = 0.60
KEY_ARC_X = 2.90
RETAINER_RADIUS = 1.75
CONTACT_PINS = tuple(pin for pin in range(1, 76) if not 59 <= pin <= 66)

# 研华 SQFlash 720-D 数据表 Rev 1.13 第 12–13 页，PCIe SSD *模块侧* 引脚命名。
# 平台侧的收发称谓相反。这里记录接口位置，不表示三星 PCB 上的实际走线或过孔。
PIN_NAMES = {
    **dict.fromkeys((1, 3, 9, 15, 21, 27, 33, 39, 45, 51, 57, 71, 73, 75), "GND"),
    **dict.fromkeys((2, 4, 12, 14, 16, 18, 70, 72, 74), "3.3 V"),
    5: "PETn3", 7: "PETp3", 11: "PERn3", 13: "PERp3",
    17: "PETn2", 19: "PETp2", 23: "PERn2", 25: "PERp2",
    29: "PETn1", 31: "PETp1", 35: "PERn1", 37: "PERp1",
    41: "PETn0", 43: "PETp0", 47: "PERn0", 49: "PERp0",
    50: "PERST#", 52: "CLKREQ#", 53: "REFCLKn", 55: "REFCLKp",
}


def pin_name(pin):
    """返回已核对的模块侧信号名；其余触点及键位返回空串。"""
    return PIN_NAMES.get(pin, "")


def lane_pairs(lane):
    """Module signal name, negative contact number and end-to-end direction."""
    if not 0 <= lane < 4:
        raise ValueError(lane)
    return (("PET", 41 - 12*lane, "up"), ("PER", 47 - 12*lane, "down"))


ENDPOINTS = {"up":"SSD TX → 主机 RX", "down":"主机 TX → SSD RX"}


def pin_function(pin):
    for lane in range(4):
        for _, first, direction in lane_pairs(lane):
            if pin in (first, first+2):
                return f"Lane {lane}，{ENDPOINTS[direction]}，差分{'负' if pin==first else '正'}端。"
    return {50:"主机输出低有效的基础复位 PERST#，SSD 接收。",
            52:"低有效开漏时钟请求 CLKREQ#。共同时钟架构下可用于时钟电源管理与 L1 子状态退出。",
            53:"共同时钟示例中，主机提供 100 MHz 差分参考时钟负端。",
            55:"共同时钟示例中，主机提供 100 MHz 差分参考时钟正端。",
            }.get(pin, {"GND":"接口地与返回路径。","3.3 V":"连接器的并联 3.3 V 电源触点之一。",
                        }.get(pin_name(pin),"该样品在此触点上的电气用途未核实。"))


def pin_center_y(pin):
    """Key M 卡边触点中心，正反面均用元件面的坐标，奇数在顶面。"""
    if pin not in CONTACT_PINS:
        raise ValueError(f"Key M has no contact at position {pin}")
    return 1.75 + (pin - 1) * 0.25


def _outline(z, thickness):
    # 插入段宽 19.85，肩部圆角 R0.50。两条肩的细台阶保留可见的退让。
    y0 = (WIDTH - 19.85) / 2
    y1 = WIDTH - y0
    lower_key, upper_key = KEY_Y - KEY_RADIUS, KEY_Y + KEY_RADIUS
    mid = WIDTH / 2
    return (
        cq.Workplane("XY", origin=(0, 0, z))
        .moveTo(0, y0)
        .lineTo(3.50, y0)
        .radiusArc((4.00, y0 - 0.50), 0.50)
        .lineTo(4.00, 0).lineTo(79.75, 0).lineTo(LENGTH, 0.25)
        .lineTo(LENGTH, mid - RETAINER_RADIUS)
        .threePointArc((LENGTH - RETAINER_RADIUS, mid), (LENGTH, mid + RETAINER_RADIUS))
        .lineTo(LENGTH, WIDTH - 0.25).lineTo(79.75, WIDTH).lineTo(4.00, WIDTH)
        .lineTo(4.00, y1 + 0.50)
        .radiusArc((3.50, y1), 0.50)
        .lineTo(0, y1).lineTo(0, upper_key).lineTo(KEY_ARC_X, upper_key)
        .threePointArc((KEY_ARC_X + KEY_RADIUS, KEY_Y), (KEY_ARC_X, lower_key))
        .lineTo(0, lower_key).close().extrude(thickness).val()
    )


def _core():
    low_z = BOARD_BOTTOM + SURFACE_LAYER
    high_z = BOARD_TOP - SURFACE_LAYER
    board = _outline(low_z, high_z - low_z)
    # 卡前缘双面斜磨。去除整个宽度上的三角棱柱，会自然保留 M 槽。
    depth = 0.30
    rise = depth * tan(radians(20))
    for surface, offset in ((low_z, rise), (high_z, -rise)):
        wedge = (
            cq.Workplane("XZ", origin=(0, WIDTH, 0))
            .polyline([(0, surface), (depth, surface), (0, surface + offset)])
            .close().extrude(WIDTH).val()
        )
        board = board.cut(wedge)
    return board.clean()


def _retainer_pad(top_side, z, thickness):
    # ACES 图 13：顶面 Ø5.50 半环同心；底面的 Ø6.00 圆心向板内偏 1 mm，
    # 外缘两端直线接回板端，螺钉开口仍为以 x=80 为中心的 Ø3.50 半孔。
    radius = 2.75 if top_side else 3.00
    cx = LENGTH if top_side else LENGTH - 1.00
    cy = WIDTH / 2
    outer = cq.Workplane("XY", origin=(0, 0, z)).moveTo(LENGTH, cy - radius)
    if not top_side:
        outer = outer.lineTo(cx, cy - radius)
    outer = outer.threePointArc((cx - radius, cy), (cx, cy + radius))
    if not top_side:
        outer = outer.lineTo(LENGTH, cy + radius)
    return (
        outer.lineTo(LENGTH, cy + RETAINER_RADIUS)
        .threePointArc((LENGTH - RETAINER_RADIUS, cy), (LENGTH, cy - RETAINER_RADIUS))
        .close().extrude(thickness).val()
    )


def _finger(pin):
    center = pin_center_y(pin)
    top_side = pin % 2 == 1
    z = BOARD_TOP - SURFACE_LAYER if top_side else BOARD_BOTTOM
    # 前缘留 0.50，自前端量正面到 2.00、背面到 2.50。各指间露出基材。
    x0, x1 = 0.50, (2.00 if top_side else 2.50)
    half_width = 0.175
    return cq.Solid.makeBox(
        x1 - x0, half_width * 2, SURFACE_LAYER, cq.Vector(x0, center - half_width, z)
    )


def _layout_cutters(layout):
    """将远离插入段/半孔的相对边缘退让与已确认钻孔转为三层共用的刀具。"""
    holes = list(layout.get("holes", []))
    for via in layout.get("vias", []):
        if via.get("drill_through") is True:
            diameter = via.get("drill_diameter", via.get("drill", via.get("diameter")))
            if diameter is None or diameter <= 0:
                raise ValueError(f"Through via has no positive drill diameter: {via}")
            holes.append({"x": via["x"], "y": via["y"], "diameter": diameter})
    cutters = [
        cq.Solid.makeCylinder(hole["diameter"] / 2, 2, cq.Vector(hole["x"], hole["y"], -0.5))
        for hole in holes
    ]
    outline = layout.get("outline_mm", [])
    # 只取两处退让所在的取样窗口。用两端连线扣除照片残余的透视斜率，
    # 再把退让贴到 22 mm 名义包络上。插入段和安装端保留机械图给定的基准。
    for edge, inside in ((0.0, 1), (WIDTH, -1)):
        for left, right in ((4.3, 12.8), (66.4, 73.2)):
            samples = sorted((x, y) for x, y in outline if left <= x <= right and abs(y - edge) < 1)
            if len(samples) < 3:
                continue
            x0, y0 = samples[0]
            x1, y1 = samples[-1]
            contour = []
            for x, y in samples:
                baseline = y0 + (y1 - y0) * (x - x0) / (x1 - x0)
                depth = max(0.0, inside * (y - baseline))
                contour.append((x, edge + inside * depth))
            outside = edge - inside
            contour.extend(((x1, outside), (x0, outside)))
            tool = cq.Workplane("XY", origin=(0, 0, -0.5)).polyline(contour).close().extrude(2)
            cutters.append(tool.val())
    return cutters


def build_card(layout=None):
    """返回 (ASCII 标识，中文名，board/edge，材质，Shape)；layout 可传照片测量字典。"""
    cutters = _layout_cutters(layout) if layout else []
    core = _core()
    if cutters:
        core = core.cut(*cutters).clean()
    parts = [("m2_core", "2280 板芯、M 键槽与固定半孔", "board", "laminate", core)]
    for side, is_top in (("top", True), ("bottom", False)):
        z = BOARD_TOP - SURFACE_LAYER if is_top else BOARD_BOTTOM
        face = "元件面" if is_top else "背面"
        pad = _retainer_pad(is_top, z, SURFACE_LAYER)
        mask = _outline(z, SURFACE_LAYER)
        mask_start = 2.15 if is_top else 2.65
        keepout = cq.Solid.makeBox(mask_start + 1, WIDTH + 2, 2, cq.Vector(-1, -1, -0.50))
        mask = mask.cut(keepout, pad, *cutters).clean()
        parts.append((f"m2_mask_{side}", f"{face}黑色阻焊层", "board", "mask", mask))
        parts.append((f"m2_mount_{side}", f"{face}固定孔接地镀层", "edge", "gold", pad))
    for pin in CONTACT_PINS:
        parts.append((f"m2_pin_{pin:02d}", f"M.2 卡边触点 {pin}", "edge", "gold", _finger(pin)))
    return parts
