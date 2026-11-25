"""A reference host installation in the card coordinate system (mm).

Envelope, mounting height, key, rows and pads follow TE 2199119 Rev F.
The spring profiles, plastic partitions and generic screw are teaching cutaways.
"""
from dataclasses import replace

import cadquery as cq
import numpy as np

from geometry import Part, block, compound, glyphs, post, ring, rounded, tile
from m2_card import BOARD_TOP, CONTACT_PINS, KEY_Y, pin_center_y, pin_function


HOST_Z = -1.50
PIN_WIDTH = .15
PAD_HEIGHT = .035


def spring(pin):
    """A bent strip with tangential, flat contact at the pad and card finger."""
    z=HOST_Z+.045
    if pin%2:
        pts=[(-4.10,z),(-3.52,z),(-3.18,z+.34),(-3.18,.92),(-2.81,1.23),
             (-1.32,1.23),(.15,1.04),(1.02,.845),(1.28,.845),(1.54,.996)]
    else:
        pts=[(4.60,z),(3.84,z),(3.57,z+.26),(3.54,-.85),(3.24,-.64),
             (2.74,-.55),(1.77,-.13),(1.53,-.045),(1.26,-.045),(.97,-.17)]
    points=np.array(pts,dtype=float)
    vec=np.diff(points,axis=0)
    vec/=np.linalg.norm(vec,axis=1)[:,None]
    normals=np.column_stack((-vec[:,1],vec[:,0]))
    middle=normals[:-1]+normals[1:]
    middle/=(middle*normals[1:]).sum(axis=1)[:,None]
    delta=.045*np.vstack((normals[0],middle,normals[-1]))
    polygon=np.vstack((points+delta,(points-delta)[::-1]))
    return (cq.Workplane("XZ",origin=(0,pin_center_y(pin)+PIN_WIDTH/2,0))
            .polyline([tuple(p) for p in polygon]).close().extrude(PIN_WIDTH).val())


def host_hardware():
    parts=[]
    def add(key,title,group,mat,shape,desc):
        parts.append(Part("host_"+key,title,"host_"+group,mat,shape,"installed",desc=desc))
    # The example carrier PCB is deliberately cropped around the two mounting features.
    holes=[post(80,11,HOST_Z-2,1.30,2.2)]
    pegs=[(1.75,1,.40,.55),(1.75,21,.725,.80)]
    holes.extend(post(x,y,HOST_Z-2,drill,2.2) for x,y,r,drill in pegs)
    core=rounded(-7.8,-4.4,HOST_Z-1.60,94.8,30.8,1.60-PAD_HEIGHT,1.6)
    mask=rounded(-7.8,-4.4,HOST_Z-PAD_HEIGHT,94.8,30.8,PAD_HEIGHT,1.6)
    pads=[]
    for pin in CONTACT_PINS:
        yy=pin_center_y(pin)
        xx=-3.525 if pin%2 else 4.025
        pads.append(tile(xx,yy,HOST_Z-PAD_HEIGHT,1.55,.30,PAD_HEIGHT))
        add(f"pin_{pin:02d}",f"插座弹片 #{pin} · "+("上排" if pin%2 else "下排"),"spring","gold",
            spring(pin),pin_function(pin)+" 弹片的平头贴住卡边，弯折焊尾落在主板焊盘上。弯折形状为示意。")
    def split_land(z,height,outer):
        return ring(80,11,z,outer,3.00,height).cut(tile(80,11,z-.01,.30,5.1,height+.02),
                                                   tile(80,11,z-.01,5.1,.30,height+.02))
    mount_pad=split_land(HOST_Z-PAD_HEIGHT,PAD_HEIGHT,5.00)
    stakes=[]
    for yy in (.65,21.35):
        pads.append(tile(-2.75,yy,HOST_Z-PAD_HEIGHT,2.75,1.20,PAD_HEIGHT))
        stakes.extend([tile(-2.70,yy,HOST_Z,2.22,.66,.13),tile(-2.05,yy,HOST_Z+.13,.58,.64,1.20)])
    add("carrier","主板局部 · 1.6 mm 示例基材","board","laminate",core.cut(*holes),
        "主板外廓是为了展示接插件和 2280 固定点而截取的示意区域。装配基准为主板上表面。")
    add("mask","主板局部 · 阻焊与开窗","board","hostmask",mask.cut(*holes,*pads,mount_pad),
        "金属焊盘在阻焊开窗中露出。板芯和阻焊的显示厚度为模型参数。")
    add("pads","主板两排 SMT 焊盘与固定焊盘","pads","gold",compound(pads),
        "奇数排位于插座后侧，偶数排位于入口侧。信号焊盘 1.55 × 0.30 mm，同排节距 0.50 mm。")
    add("boss_pad","M2 承柱 · 四段焊盘","fix","solder",mount_pad,
        "JAE 推荐焊盘外径 5.00、内径 3.00 mm，十字隔缝 0.30 mm，主板中心开孔 Ø2.60 mm。")
    add("boss_joint","承柱底部 · 分段焊接层","fix","solder",
        split_land(HOST_Z,.05,4.50),
        "安装示例的焊接层取 0.05 mm，与承面高度 1.45 mm 合计形成板下 1.50 mm 间隙。")
    add("stakes","插座侧边金属固定片","socket","solder",compound(stakes),
        "侧边固定片把安装力传给主板焊盘。折弯为简化几何。")
    peg_shapes=[post(x,y,HOST_Z-.65,r,.70) for x,y,r,drill in pegs]
    add("pegs","插座定位柱 · 大小防错","socket","qfn",compound(peg_shapes),
        "靠 #1 一侧 Ø0.80，靠 #75 一侧 Ø1.45 mm，两柱向主板内伸出 0.65 mm。")
    # Sidewalls stop before the card flares to its full 22 mm width.
    rails=[block(-3.50,yy,HOST_Z+.05,6.94,.87,3.15) for yy in (.05,21.08)]
    rails=[s.cut(*stakes) for s in rails]
    add("walls","M-key 插座 · 两侧导向壁","socket","qfn",compound(rails),
        "塑壳标称宽 21.90 mm，导入口净宽 20.15 mm，主体只包住卡前端。")
    add("rib","M-key 防呆筋 · 1.10 mm","socket","mold",block(-1.68,KEY_Y-.55,-.77,4.43,1.10,2.15),
        "键筋插入卡上的 M 缺口。缺口外形与卡边同一坐标定标。")
    comb=block(-3.49,.92,HOST_Z+.14,2.89,20.16,2.80)
    slots=[block(-3.50,pin_center_y(p)-.12,HOST_Z+.12,2.92,.24,2.85) for p in CONTACT_PINS if p%2]
    comb=comb.cut(*slots)
    key_clear=block(-1.69,KEY_Y-.56,-.78,4.46,1.12,2.18)
    add("comb","上排端子绝缘隔墙","socket","mold",comb.cut(key_clear,*stakes),
        "齿状隔墙隔开上排弹片。剖掉盖板后可沿金手指找到单个端子。")
    # A shallow lower lip and open upper lid keep the spring channels visible.
    lip=block(-.59,.92,HOST_Z+.04,4.84,20.16,.15)
    slots=[block(-.60,pin_center_y(p)-.12,HOST_Z+.03,4.87,.24,.18) for p in CONTACT_PINS if not p%2]
    add("lip","插口朝向卡体的下唇","socket","mold",lip.cut(*slots,*peg_shapes),"从卡前端基准到塑壳前缘约 4.25 mm。")
    add("lid","插座上盖 · 可打开剖视","lid","qfn",block(-3.50,.92,1.45,6.68,20.16,.25),
        "这块外壳合上后总高 3.20 mm。查看器可移去上盖观察两排弹片。")
    add("standoff","JAE · M2×0.4 有肩承柱","fix","solder",
        ring(80,11,-1.45,4.50,2,1.45).fuse(ring(80,11,0,3.00,2,.65),
                                            ring(80,11,-2.15,2.50,2,.70)).clean(),
        "SM3ZS067U310-NUT1。Ø4.50 承面托住卡底，Ø3.00 × 0.65 定心颈进入 Ø3.50 半孔。螺纹按名义直径简化。")
    head=post(80,11,BOARD_TOP,2.40,1.10)
    head=head.cut(block(78.70,10.77,BOARD_TOP+.66,2.60,.46,.46),
                  block(79.77,9.70,BOARD_TOP+.66,.46,2.60,.46))
    add("screw","M2 压紧螺钉 · 十字槽","fix","nickel",
        head.fuse(post(80,11,BOARD_TOP-2.50,1,2.50)).clean(),
        "Ø4.80 宽头压住半圈卡顶镀环，2.50 mm 螺杆穿过半孔旋入承柱。头部取 M.2 参考螺钉尺寸，槽型与螺纹简化。")
    add("print","主板丝印 · 插座与 2280 固定位","board","paper",compound([
        glyphs("M.2   /   KEY  M",9,24.1,HOST_Z,1.18,.015,bold=True),
        glyphs("2280",80,19.1,HOST_Z,.90,.015,bold=True)]),"主板丝印为模型的定位说明。")
    return parts


def build_installed(physical):
    # Omit only the front sticker for this cutaway; the bare physical scene retains it.
    card=[replace(p,id="installed_"+p.id,view="installed",mesh_ref=p.id)
          for p in physical if p.group!="top_label"]
    return card+host_hardware()
