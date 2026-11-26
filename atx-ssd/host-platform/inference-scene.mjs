import * as T from 'three';
import { inferenceStepColor, inferenceTracks } from './inference-flow.mjs';

const v = p => new T.Vector3(...p);
const dot = new T.SphereGeometry(1,12,8);
const ring = new T.TorusGeometry(1,.115,8,32);
const frames = {
  full: {center:[24,33,-18],size:[236,104,210],pose:[.14,2.18,.55]},
  disk: {center:[25,15,-23],size:[163,53,128],pose:[-.24,2.25,.38]},
  copy: {center:[44,40,-13],size:[140,98,132],pose:[.24,1.86,.87]},
  gpu: {center:[42,69,43],size:[102,96,44],pose:[.18,.91,1.6]},
};

export function installInference(board,ssd,tools) {
  const { host, pcie, local } = board.gpuLinkPoints;
  const hostBuffer = host[0];
  const drive = [-25,8,9.7];
  const memory = local.at(-1);
  const core = board.gpu.localToWorld(v([1,5,0])).toArray();
  const sites = {
    ssd: {p:drive,title:'990 PRO',key:'inferenceDisk',offset:[-30,-19]},
    host: {p:hostBuffer,title:'DDR5 页锁缓冲',key:'inferenceHost',offset:[25,-12]},
    vram: {p:memory,title:'RTX 5090 显存',key:'inferenceVram',offset:[44,13]},
    core: {p:core,title:'GB202',key:'inferenceCore',offset:[-13,26]},
  };
  const routes = {
    nvme: [drive,[27,7,9.7],[21,8,-12],[19,12,-33],host.at(-1),
      [39,13,-50],[59,15,-56],hostBuffer],
    h2d: [hostBuffer,...host.slice(1,-1),...pcie,...local.slice(1)],
    compute: [memory,board.gpu.localToWorld(v([15,7,-8])).toArray(),core],
  };
  const layer = new T.Group();
  layer.name = 'Inference weight paths';
  board.effects.add(layer);
  board.signal = layer;
  board.topic = 'inferenceCase';
  board.name = 'ATX · 990 PRO / DDR5 / RTX 5090 · Weight streaming';
  board.root.name = board.name;
  ssd.userData.topic = 'inferenceDisk';
  board.gpu.userData.topic = 'inferenceVram';
  board.gpu.getObjectByName('gpuDie').userData.topic = 'inferenceCore';
  for (const part of board.pieces) {
    if (part.object.userData.topic==='ram')part.object.userData.topic='inferenceHost';
  }
  board.annotations = Object.entries(sites).map(([actor,{p,title,key,offset}])=>({
    actor,p:v(p),title,key,offset,priority:0,show:true,
  }));
  board.anchors = { ...board.anchors, ...Object.fromEntries(Object.values(sites).map(({p,key})=>[key,p])) };
  board.inference = {tools,routes,sites,layer,motion:[],started:0};
}

export function inferenceFrame(focus) {
  const frame = frames[focus];
  if (!frame) return null;
  return {box:new T.Box3().setFromCenterAndSize(v(frame.center),v(frame.size)),pose:frame.pose};
}

export function showInferenceStep(board,step,mode) {
  const flow = board.inference;
  const {tools,routes,sites,layer} = flow;
  tools.clearRoutes(layer);
  layer.userData = {inferenceMode:mode,step:step.id,tracks:[...step.tracks]};
  flow.motion = [];
  flow.started = performance.now();
  const active = new Set();
  const hasBothLinks = step.tracks.includes('nvme') && step.tracks.includes('h2d');
  for (const key of step.tracks) {
    const track = inferenceTracks[key], points = routes[key];
    active.add(track.target);
    const line = tools.route(layer,points,key==='compute'?.75:.96,track.color,
      {arrow:true,bright:true,depth:false,alpha:.9});
    line.name = track.title;
    line.userData.track = key;

    const curve = new T.CurvePath();
    for (let i=1;i<points.length;i++)curve.add(new T.LineCurve3(v(points[i-1]),v(points[i])));
    const pulse = new T.Mesh(dot,new T.MeshBasicMaterial({color:track.color,depthTest:false,toneMapped:false}));
    pulse.scale.setScalar(key==='compute'?1.5:1.9);
    pulse.visible = false;
    pulse.renderOrder = 12;
    layer.add(pulse);
    const delay = key==='h2d'&&hasBothLinks ? .36 : key==='compute'&&step.id==='text-encode' ? .64 : 0;
    flow.motion.push({curve,pulse,delay});
  }
  if(step.tracks.includes('nvme'))active.add('ssd');
  if(step.tracks.includes('h2d'))active.add('host');
  if(step.tracks.includes('compute'))active.add('vram');

  const color = inferenceStepColor(step);
  const marker = new T.Mesh(ring,new T.MeshBasicMaterial({color,depthTest:false,toneMapped:false}));
  marker.name = 'Active inference component · '+step.target;
  marker.renderOrder = 10;
  marker.position.copy(v(sites[step.target].p));
  if (step.target==='ssd'||step.target==='host')marker.rotation.x=-Math.PI/2;
  marker.scale.setScalar(2.6);
  layer.add(marker);

  for (const tag of board.annotations) {
    tag.endpoint = tag.actor===step.target;
    tag.priority = tag.endpoint ? 2 : active.has(tag.actor) ? 1 : 0;
    tag.show = step.focus!=='gpu'||tag.actor==='vram'||tag.actor==='core';
    tag.offset=step.focus==='gpu'?undefined:sites[tag.actor].offset;
  }
}

export function animateInference(board,time,playing) {
  const flow = board.inference;
  const elapsed = Math.max(0,time-flow.started);
  for (const {curve,pulse,delay} of flow.motion) {
    const position = elapsed / 1650 % 1;
    pulse.visible = playing && position>=delay;
    if (pulse.visible)pulse.position.copy(curve.getPointAt((position-delay)/(1-delay)));
  }
  return playing && flow.motion.length>0;
}
