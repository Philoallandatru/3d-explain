import * as T from 'three';
import { roundedBox } from './vendor/pc-anatomy/geometry-cache.ts';
import { buildFan } from './vendor/pc-anatomy/parts.ts';
import { gpuProfile } from './gpu-profile.mjs';

const [length, height, thickness] = gpuProfile.dimensionsMm;
const halfLength = length / 2, halfHeight = height / 2, halfThickness = thickness / 2;
const steel = '#818785', graphite = '#4a4d4d', laminate = '#283733', gold = '#bc9253';
const fanCenters = [-85, 85];
const fanOpening = 48.3;
const portCenters = [-45, -25, -5, 15];
const finBox = new T.BoxGeometry(1, 1, 1);
const memorySide = 39.5, memoryPitch = 13.3;

// The standalone model uses millimetres. X runs away from the rear bracket,
// Y points toward the fans, and Z points toward the PCIe tongue.
export const gpuEdge = Object.freeze([-58, -13.8, halfHeight]);
export const gpuMemoryAnchor = Object.freeze([memorySide, 2.1, -memoryPitch / 2]);

function put(group, object, x, y, z) {
  object.position.set(x, y, z);
  group.add(object);
  return object;
}

function polygon(points) {
  const shape = new T.Shape();
  shape.moveTo(...points[0]);
  for (const point of points.slice(1)) shape.lineTo(...point);
  shape.closePath();
  return shape;
}

function extrude(shape, depth) {
  return new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 36 });
}

function plate(points, depth, material) {
  const shape = polygon(points.map(([x, z]) => [x, -z]));
  const mesh = new T.Mesh(extrude(shape, depth), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function rounded(size, material, radius = 1.4) {
  return new T.Mesh(roundedBox(...size, 2, radius), material);
}

function coverWithVents(material) {
  const x0 = -halfLength + 1.6, x1 = halfLength, z0 = -halfHeight, z1 = 61;
  const corners = [
    [x0 + 8, -z1], [x1 - 12, -z1], [x1, -z1 + 12], [x1, -z0 - 12],
    [x1 - 12, -z0], [x0 + 8, -z0], [x0, -z0 - 8], [x0, -z1 + 8],
  ];
  const shape = polygon(corners);
  for (const x of fanCenters) {
    const hole = new T.Path();
    hole.absarc(x, 0, fanOpening, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const mesh = new T.Mesh(extrude(shape, 2.5), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function addCooler(kit) {
  const { add, material, label } = kit;
  const metallic = material(graphite, .57, .46);
  const frame = new T.Group();
  put(frame, coverWithVents(metallic), 0, halfThickness - 2.5, 0);
  put(frame, coverWithVents(material('#333737', .45, .49)), 0, -halfThickness, 0);
  put(frame, rounded([297, 32, 3.6], metallic), 0, 0, 59);
  put(frame, rounded([140, 30, 3.6], metallic), -76, 0, -66.7);
  put(frame, rounded([108, 30, 3.6], metallic), 85, 0, -66.7);
  put(frame, rounded([3.5, 31, 105], metallic), 149, 0, -3);
  const bridge = [
    [-44, -54], [-29, -57], [0, -29], [29, -57], [44, -54],
    [33, -28], [24, 0], [36, 35], [48, 56], [28, 55],
    [0, 30], [-28, 55], [-48, 56], [-36, 35], [-24, 0], [-33, -28],
  ];
  put(frame, plate(bridge, 1.1, material('#555959', .48, .45)), 0, 18.91, 0);
  label(frame, 'RTX 5090', [0, 20.025, 0], 32, '#d2d5d5');
  const backMark = label(frame, 'GEFORCE RTX', [0, -20.025, 0], 44, '#abb1b0');
  backMark.rotation.x = Math.PI / 2;
  const spineMark = label(frame, 'GEFORCE RTX', [-74, 0, -halfHeight - .018], 50, '#bbc0c0');
  spineMark.rotation.x = Math.PI;
  add('gpuCard', frame, [0, 0, 0]);

  for (const [index, x] of fanCenters.entries()) {
    const cooling = new T.Group();
    const fins = new T.InstancedMesh(finBox, material('#767a78', .56, .53), 29);
    const pose = new T.Object3D();
    for (let i = 0; i < fins.count; i++) {
      const offset = (i - (fins.count - 1) / 2) * 3.16;
      const span = 2 * Math.sqrt(49 ** 2 - offset ** 2);
      pose.position.set(offset, -5, 0);
      pose.scale.set(.7, 17.8, span);
      pose.updateMatrix();
      fins.setMatrixAt(i, pose.matrix);
    }
    put(cooling, fins, 0, 0, 0);
    const fan = buildFan(material, {
      size: 101, blades: 9, phase: index * .21, frameless: true,
      bladeColor: '#1b2021', hubColor: '#14191a',
    });
    fan.scale.y = .83;
    put(cooling, fan, 0, 7.7, 0);
    add('gpuCooling', cooling, [x, 0, 0]);
  }
}

function addCoreBoard({ add, box, material, label }) {
  const board = new T.Group();
  put(board, plate([
    [-54, -47], [-41, -57], [44, -57], [59, -42], [59, 36], [47, 47], [-54, 47],
  ], 1.7, material(laminate, .12, .8)), 0, -1.7, 0);
  label(board, 'FE   MAIN PCB', [18, .025, -51], 27, '#96a79d');
  for (const x of [-47, 51]) for (const z of [-39, 37]) {
    put(board, new T.Mesh(new T.TorusGeometry(1.55, .28, 6, 18), material(gold, .49, .48)),
      x, .25, z).rotation.x = -Math.PI / 2;
  }
  for (let i = 0; i < 10; i++) {
    const z = -36 + 7.9 * i;
    put(board, box([3.4, 2.0, 4.3], '#645865', .33), -50, 1.0, z);
    put(board, box([2.0, .9, 3.1], '#999184', .42), -53, .45, z);
    put(board, box([3.7, 1.8, 4.8], '#454b50', .32), 53, .9, z);
  }
  add('gpuMain', board, [0, 0, 0]);

  const gpu = new T.Group();
  put(gpu, rounded([47, 2.8, 47], material('#2f5250', .26, .55)), 0, 1.4, 0);
  put(gpu, rounded([31, 1.35, 25], material('#6e838b', .56, .42), .5), 0, 3.4, 0);
  label(gpu, 'GB202', [0, 4.1, 0], 19, '#dce8e9');
  add('gpuDie', gpu, [0, 0, 0]);

  const memory = new T.Group();
  const perSide = gpuProfile.memoryPackages / 4;
  for (let i = 0; i < perSide; i++) {
    const p = (i - (perSide - 1) / 2) * memoryPitch;
    for (const side of [-1, 1]) for (const [x, z, turned] of [
      [p, side * 35.5, false], [side * memorySide, p, true],
    ]) {
      const module = rounded([10.2, 1.65, 12.8], material('#202628', .16, .53), .28);
      module.name = 'GDDR7 package';
      module.rotation.y = turned ? Math.PI / 2 : 0;
      put(memory, module, x, .83, z);
      label(memory, 'GDDR7', [x, 1.68, z], 7.2, '#a0afaa');
    }
  }
  add('gddr', memory, [0, 0, 0]);
}

function addPcieBoard({ add, box, material }, cutaway) {
  const cardEdge = new T.Group();
  const key = -94;
  put(cardEdge, plate([
    [-107, 56], [-94, 50], [-24, 50], [-20, 57], [-20, halfHeight],
    [key + 1.7, halfHeight], [key + 1.7, 64], [key - 1.7, 64],
    [key - 1.7, halfHeight], [-107, halfHeight],
  ], 1.6, material(laminate, .2, .72)), 0, -.8, 0);
  for (const [start, count] of [[-106, 11], [-92, 71]]) {
    const fingers = new T.InstancedMesh(
      new T.BoxGeometry(.66, .09, 4.4), material(gold, .59, .36), count * 2,
    );
    const pose = new T.Object3D();
    for (let i = 0; i < count; i++) for (const [j, side] of [-1, 1].entries()) {
      pose.position.set(start + i, side * .82, 66.1);
      pose.updateMatrix();
      fingers.setMatrixAt(i * 2 + j, pose.matrix);
    }
    fingers.name = 'Representative PCIe edge fingers';
    cardEdge.add(fingers);
  }
  if (cutaway) {
    put(cardEdge, box([26, 1.4, 8], '#77758a', .35), -30, .7, 53);
    const flex = box([20, .55, 22], '#87653c', .26);
    flex.rotation.x = .57;
    put(cardEdge, flex, -30, 7.2, 42);
  }
  add('gpuPcie', cardEdge, [0, gpuEdge[1], 0]);
}

function socketOutline(z, width, hdmi, y = -10) {
  const [a, b] = [z - width / 2, z + width / 2];
  return hdmi
    ? [[a, y + 2.7], [b, y + 2.7], [b - 2, y - 2.6], [a + 2, y - 2.6]]
    : [[a, y + 2.7], [b - 1.6, y + 2.7], [b, y + 1.1], [b, y - 2.6], [a, y - 2.6]];
}

function addOutputs({ add, box, material, label }, cutaway) {
  const io = new T.Group(), panel = polygon([[-61,-18], [57,-18], [57,18], [-61,18]]);
  for (const [i, z] of portCenters.entries()) {
    const hdmi = i === 3;
    const opening = socketOutline(z, hdmi ? 13.7 : 13, hdmi);
    panel.holes.push(polygon(opening));
    const socket = new T.Mesh(extrude(polygon(opening), 1.1), material('#101718', .18, .8));
    socket.rotation.y = -Math.PI / 2;
    put(io, socket, -148.9, 0, 0);
    put(io, box([.85, .6, 9.5], '#506465', .32), -150.1, -10.6, z);
  }
  for (let i = 0; i < 10; i++) {
    const z = -52 + i * 10.5;
    panel.holes.push(polygon([[z-3, 3], [z+3, 3], [z+3, 11], [z-3, 11]]));
  }
  const bracket = new T.Mesh(extrude(panel, 1.2), material(steel, .66, .41));
  bracket.rotation.y = -Math.PI / 2;
  put(io, bracket, -150.8, 0, 0);
  if (cutaway) {
    put(io, box([32, 1.55, 90], laminate, .14), -132, -14, -8);
    put(io, box([66, .58, 8], '#8d6d3d', .27), -86.6, -6.8, -13).rotation.z = .22;
    label(io, 'DISPLAY I/O', [-131, -13.2, 33], 22, '#a9bfba');
  }
  add('gpuOutput', io, [0, 0, 0]);
}

function addPower({ add, box, material }, cutaway) {
  const power = new T.Group();
  put(power, rounded([21, 11, 7], material('#181d1e', .12, .62)), 0, 0, 3.5);
  put(power, box([18.1, 8.4, .28], '#090b0c', .1), 0, 0, .17);
  for (const y of [-1.4, 1.4]) for (let i = 0; i < 6; i++) {
    put(power, box([1.5, 1.3, .52], '#6e6958', .43), (i - 2.5) * 2.8, y, .27);
  }
  for (let i = 0; i < 4; i++)
    put(power, box([.55, .55, .43], gold, .48), (i - 1.5) * 1.8, 3.4, .27);
  if (cutaway) put(power, box([18, 1.4, 12.9], laminate, .18), 0, -1.5, 8.5);
  add('gpuPower', power, [16, 1.6, -halfHeight + .3]);
}

export function buildRtx5090(kit, { cutaway = false, envelope = false } = {}) {
  if (cutaway) addCoreBoard(kit);
  else addCooler(kit);
  addPcieBoard(kit, cutaway);
  addOutputs(kit, cutaway);
  addPower(kit, cutaway);
  if(envelope){
    const box = new T.BoxGeometry(length,thickness,height);
    const outline = new T.LineSegments(new T.EdgesGeometry(box),new T.LineBasicMaterial({
      color:'#83959e',transparent:true,opacity:.46,
    }));
    box.dispose();
    kit.add('RTX 5090 FE outer envelope',outline,[0,0,0]);
  }
}
