"""Solid primitives shared by the board reproduction and its three teaching views. Units: mm."""

from dataclasses import dataclass
import math

import cadquery as cq
import numpy as np


# Display sRGB, metallic fraction, perceptual roughness. Colours on the circuit
# views encode functions. They are independent of the materials on the real card.
MATERIALS = {
    "laminate": ("82745A", .12, .64), "mask": ("252830", .10, .47),
    "gold": ("E6BC64", .57, .36), "solder": ("B9BCC0", .52, .35),
    "copper": ("C78259", .43, .44), "track": ("383D45", .12, .53),
    "ink": ("D8D8CC", .05, .60), "goldink": ("C1A775", .14, .57),
    "print": ("F0F0E9", .02, .58), "mark": ("888984", .10, .63),
    "nickelmark": ("62646B", .10, .62), "nickel": ("BCB9B5", .49, .42),
    "mold": ("37373E", .04, .72), "carrier": ("38423D", .07, .59),
    "qfn": ("292C30", .04, .66), "mlcc": ("B59A74", .03, .59),
    "ferrite": ("706E75", .09, .58), "resist": ("343339", .06, .66),
    "label": ("26272C", .04, .56), "label_edge": ("37383C", .07, .55),
    "red": ("EE493C", .03, .53), "silicon": ("475260", .28, .48),
    "dielectric": ("46646C", .11, .63), "frame": ("536570", .18, .55),
    "paper": ("DCE1DB", .03, .62), "deep": ("192D37", .12, .57),
    "ground": ("70988D", .29, .49), "teal": ("39B6AC", .22, .47),
    "teal_b": ("82DDD1", .19, .49), "blue": ("5AA5D9", .24, .46),
    "blue_b": ("A3CFED", .19, .45), "orange": ("E59552", .25, .46),
    "yellow": ("F1CA69", .21, .47), "violet": ("AD91CE", .19, .47),
    "pink": ("DC91A4", .18, .48), "rose": ("E66E65", .21, .47),
    "green": ("96BB78", .19, .49),
    "hostmask": ("345947", .12, .59),
    "stack_photo": ("44AE98", .14, .52), "stack_package": ("49776B", .08, .60),
    "stack_standard": ("679AE7", .18, .48), "stack_trace": ("E6A152", .15, .45),
    "stack_control": ("C48649", .15, .47), "stack_via": ("EEB96E", .21, .41),
    "stack_ground": ("A3774D", .20, .55), "stack_diel": ("556367", .04, .67),
}


@dataclass
class Part:
    id: str
    label: str
    group: str
    material: str
    shape: cq.Shape
    view: str = "physical"
    stage: str = ""
    desc: str = ""
    zone: str = ""
    mesh_ref: str = ""
    link: dict | None = None
    stack: dict | None = None


def block(x, y, z, w, d, h):
    return cq.Solid.makeBox(w, d, h, (x, y, z))


def tile(x, y, z, w, d, h):
    """A rectangular tile specified at its XY centre and bottom face."""
    return block(x - w/2, y - d/2, z, w, d, h)


def rounded(x, y, z, w, d, h, radius):
    wp = cq.Workplane("XY", origin=(x + w/2, y + d/2, z)).rect(w, d).extrude(h)
    return wp.edges("|Z").fillet(radius).val() if radius else wp.val()


def post(x, y, z, r, h):
    return cq.Solid.makeCylinder(r, h, (x, y, z))


def ring(x, y, z, od, inner, h):
    return cq.Workplane("XY", origin=(x,y,z)).circle(od/2).circle(inner/2).extrude(h).val()


def profile(pts, z, h):
    return cq.Workplane("XY", origin=(0,0,z)).polyline([tuple(p) for p in pts]).close().extrude(h).val()


def compound(shapes):
    shapes = list(shapes)
    return shapes[0] if len(shapes) == 1 else cq.Compound.makeCompound(shapes)


def frame(x, y, z, w, d, t, h):
    wp = cq.Workplane("XY", origin=(x,y,z))
    return wp.rect(w,d).rect(w-2*t,d-2*t).extrude(h).val()


def glyphs(text, x, y, z, size, height=.018, xdir=(1,0,0), normal=(0,0,1), bold=False):
    plane = cq.Plane(origin=(x,y,z), xDir=xdir, normal=normal)
    return cq.Compound.makeText(text, size, height, font="Arial", kind="bold" if bold else "regular",
                                halign="center", valign="center", position=plane)


def ribbon(points, w, z, h):
    """Constant-width planar trace with mitered bends, specified by its centreline."""
    pts = np.asarray(points, dtype=float)
    steps = np.diff(pts, axis=0)
    if np.any(np.linalg.norm(steps, axis=1) < 1e-8):
        raise ValueError(f"Duplicate consecutive trace vertices: {points}")
    unit = steps / np.linalg.norm(steps, axis=1)[:, None]
    normals = np.column_stack((-unit[:,1], unit[:,0]))
    mid = normals[:-1] + normals[1:]
    mid /= np.maximum((mid * normals[1:]).sum(axis=1), .30)[:, None]
    offsets = np.vstack((normals[0], mid, normals[-1])) * w/2
    return profile(np.vstack((pts + offsets, (pts - offsets)[::-1])).tolist(), z, h)


def rod(a, b, r):
    delta = tuple(end - start for start, end in zip(a, b))
    length = math.sqrt(sum(v*v for v in delta))
    return cq.Solid.makeCylinder(r, length, a, tuple(v/length for v in delta))
