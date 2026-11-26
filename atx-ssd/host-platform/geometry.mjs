import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { buildMotherboard } from './vendor/pc-anatomy/mainboard.ts';
import { buildDimm } from './vendor/pc-anatomy/memory-module.ts';
import { buildRyzen } from './vendor/pc-anatomy/processor.ts';
import { buildRyzenIo } from './vendor/pc-anatomy/io-die.ts';
import { buildDram } from './vendor/pc-anatomy/dram-package.ts';
import { buildRamArchitecture } from './vendor/pc-anatomy/ram-architecture.ts';
import { buildGpuArchitecture } from './vendor/pc-anatomy/gpu-architecture.ts';
import { roundedBox } from './vendor/pc-anatomy/geometry-cache.ts';
import { pcbTexture } from './vendor/pc-anatomy/pcb.ts';
import { installSystemIO, mainBoardLane } from './system-scene.mjs';
import { installInference } from './inference-scene.mjs';
import { installPower, showVrmCovers } from './power-scene.mjs';
import { installPsu, setPsuView } from './psu-geometry.mjs';
import { buildRtx5090, gpuEdge, gpuMemoryAnchor } from './gpu-geometry.mjs';
import { gpuLinkColors, gpuProfile } from './gpu-profile.mjs';

const palette = {
  dark:'#233136', teal:'#2c6962', blue:'#335d77', amber:'#756044',
  violet:'#635473', dim:'#435059', gold:'#e6ac5e', mint:'#76e2bf',
};
const vector = values => new T.Vector3(...values);
const materials = new Map(), labels = new Map(), boxes = new Map(), highlightMaterials = new WeakMap();
let memoryFace;
const put = (parent, object, p) => { object.position.set(...p); parent.add(object); return object; };

function material(color, metal = 0.12, rough = 0.63) {
  const key = [color,metal,rough].join();
  if (!materials.has(key)) materials.set(key,new T.MeshStandardMaterial({color,metalness:metal,roughness:rough}));
  return materials.get(key);
}

function box(size, color, metal, bevel) {
  if (bevel && bevel<.15) return new T.Mesh(roundedBox(size[0],size[1],size[2],2,bevel),material(color,metal));
  const key = size.join();
  if (!boxes.has(key)) boxes.set(key,new T.BoxGeometry(...size));
  return new T.Mesh(boxes.get(key),material(color,metal,bevel));
}

function pcb(size,kind) {
  const geometry=new T.BoxGeometry(...size);
  if(kind!=='memory')return new T.Mesh(geometry,material('#171b1e',.12,.8));
  if(!memoryFace)memoryFace=new T.MeshStandardMaterial({map:pcbTexture('memory'),metalness:.12,roughness:.8});
  const edge=material('#4c5a43',.1,.82);
  // The upstream DIMM outline consumes laminate at 0 and top solder mask at 2.
  return new T.Mesh(geometry,[edge,edge,memoryFace,memoryFace,edge,edge]);
}

function label(parent, text, p, width, color = '#e5f2ef', maxHeight = Infinity) {
  const key = text + color;
  if (!labels.has(key)) {
    const canvas = document.createElement('canvas');
    canvas.height = 84;
    const context = canvas.getContext('2d');
    const font = '650 54px "Bahnschrift", "Segoe UI", sans-serif';
    context.font = font;
    canvas.width = Math.ceil(context.measureText(text).width) + 20;
    context.font = font;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text,canvas.width/2,canvas.height/2);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = 6;
    labels.set(key,new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));
  }
  const ink = labels.get(key);
  const ratio = ink.map.image.width / ink.map.image.height;
  const height = Math.min(width / ratio, maxHeight);
  const object = new T.Mesh(new T.PlaneGeometry(height * ratio,height),ink);
  object.rotation.x = -Math.PI/2;
  object.userData.lettering = true;
  return put(parent,object,p);
}

function makeKit(root, topicFor, skip = () => false) {
  const pieces = [];
  const add = (id,object,p,delta = [0,0,0]) => {
    const part = { id, object, base:vector(p), delta:vector(delta), topic:topicFor(id) };
    object.name = id;
    if (part.topic) object.userData.topic = part.topic;
    object.position.copy(part.base);
    if (!skip(id)) {
      root.add(object);
      pieces.push(part);
    }
    return part;
  };
  const kit = {
    add, box, material, label, pcb, pieces,
    build:{board:'tomahawk',processor:'ryzen',memory:'dimm'},
    instances(id, positions, size, reveal, color = '#52859a', geometry) {
      return positions.map(p=>add(id,geometry ? new T.Mesh(geometry,material(color)) : box(size,color),p));
    },
    assembly() {
      const dimm = new T.Group();
      buildDimm(makeKit(dimm,dramTopic,hideDimmCover));
      return dimm;
    },
  };
  return kit;
}

function boardTopic(id) {
  const key = id.replace(/^tomahawk/,'');
  return {
    socket:'socket',cpu:'socket',ram:'ram',dimmslot:'ram',pcie16:'pcieSlots',pcie1:'pcieSlots',
    atx24:'atx24',eps8:'cpuEps',cpuvrm:'cpuVrm',vrmheatsink:'cpuVrm',
    jfp1:'frontPanel',debugled:'debugLed',frontheader:'boardHeaders',mobofanheader:'boardHeaders',
    chipset:'chipset',reario:'rear',sataport:'rear',moboboard:'board',
  }[key];
}
function cpuTopic(id) {
  return {
    zenccd:'ccd',zencore:'ccd',zenl3:'cache',zeniod:'iod',zenfabric:'fabric',
    zeniofabric:'fabric',zeniomemory:'umc',zeniopcie:'root',zeniodisplay:'iod',zeniousb:'iod',
  }[id] || id;
}
function dramTopic(id) {
  if (id.startsWith('dimm')) {
    if (id==='dimmspd') return 'spd';
    if (['dimmpmic','dimmdecap','dimminductor'].includes(id)) return 'pmic';
    return 'module';
  }
  if (id==='dramchip') return 'chips';
  if (['dramball','drammold','dramencap','dramsubstrate','dramadhesive','dramdie','drampads','drambondwire'].includes(id)) return 'bga';
  if (id==='drambank') return 'banks';
  return undefined;
}
const hideDimmCover = id => ['dimmspreader','dimmspreaderback','dimmpad'].includes(id);

function annotate(title,key,p) { return {title,key,p:vector(p)}; }
function scene(name, topic, annotations, pose, scale=1) {
  const root = new T.Group();
  root.name = name;
  root.userData = { topic };
  const effects = new T.Group();
  effects.name = 'Active transaction';
  return { root, effects, name, topic, annotations, pose, scale, pieces:[] };
}

const unit = new T.CylinderGeometry(1,1,1,8);
const cone = new T.ConeGeometry(1,1,8);
const pinBall = new T.SphereGeometry(1,10,8);
const up = new T.Vector3(0,1,0);

function segment(parent, start, end, radius, ink, geometry=unit) {
  const a = vector(start), b = vector(end), delta = b.clone().sub(a);
  const rod = new T.Mesh(geometry,ink);
  rod.position.copy(a).lerp(b,.5);
  rod.quaternion.setFromUnitVectors(up,delta.clone().normalize());
  rod.scale.set(radius,delta.length(),radius);
  parent.add(rod);
}
function route(parent, points, radius, color, {arrow=false,alpha=1,bright=false,depth=true}={}) {
  const ink = new T.MeshBasicMaterial({color,transparent:alpha<1,opacity:alpha,
    depthTest:depth,depthWrite:depth&&alpha===1,toneMapped:depth});
  const group = new T.Group();
  for (let i=1; i<points.length; i++) segment(group,points[i-1],points[i],radius,ink);
  if (arrow) {
    const a=vector(points.at(-2)), b=vector(points.at(-1));
    const base=b.clone().lerp(a,Math.min(.7,7*radius/b.distanceTo(a)));
    segment(group,base.toArray(),b.toArray(),radius*2.8,ink,cone);
  }
  group.renderOrder = bright ? 7 : 0;
  parent.add(group);
  return group;
}

const boardPositions = {
  socket:[4.5,9,-64],ram:[79.4,34,-60],m2_1:[28.3,6,9.7],
  m2_2:[-4.3,6,113.6],m2_3:[86.8,8,113.6],chipset:[70,13,63],
  pcieSlots:[-60,10,30],atx24:[115,10,-26],cpuEps:[-62,10,-145],cpuVrm:[-42,7,-112],
  frontPanel:[112,5,147],debugLed:[118,3,-106],rear:[-103,39,-94],
  storage:[-29,8,9.7],
};
const gpuCardLabelPoint = [98,0,-66];

let registeredCard;
async function readRegisteredCard() {
  const encoded=document.getElementById('registered-ssd').textContent.trim();
  const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  const file=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return (await new GLTFLoader().parseAsync(file,'')).scenes;
}
async function cardAssets(withCutaway) {
  if(!registeredCard)registeredCard=readRegisteredCard().catch(error=>{registeredCard=null;throw error;});
  return (await registeredCard).slice(0,withCutaway?3:2).map(object=>object.clone(true));
}

function mountGpu(group, mode) {
  const linkView=mode!=='assembly';
  const slot = group.pieces.find(part => part.id === 'tomahawkpcie16').object;
  const seat = slot.getWorldPosition(new T.Vector3());
  const card = new T.Group();
  card.name = gpuProfile.name + ' · PCI_E1';
  card.userData = { topic: 'gpuCard', slot: 'PCI_E1', dimensionsMm:gpuProfile.dimensionsMm, seatMm:seat.toArray(),
    source: 'NVIDIA FE references and PC Anatomy MIT fan components' };
  card.rotation.x = Math.PI / 2;
  const edgeOffset = vector(gpuEdge).applyEuler(card.rotation);
  card.position.copy(seat).sub(edgeOffset);
  buildRtx5090(makeKit(card,id=>mode==='gpu-link'&&id==='gddr'?'gddr':
    ['power','assembly'].includes(mode)&&id==='gpuPower'?'gpuSupply':undefined),{cutaway:linkView,envelope:linkView});
  group.root.add(card);
  group.gpu = card;
  group.pieces.push({ id: 'gpuCard', object: card, base: card.position.clone(), delta: vector([8, 55, 11]) });
  if (linkView) {
    const host=[86,20,-61], root=[15,13,-52], contact=[seat.x,seat.y+3,seat.z];
    const cardEdge=card.localToWorld(vector([-44,gpuEdge[1]+1.1,59])).toArray();
    const memory = card.localToWorld(vector(gpuMemoryAnchor));
    group.gpuLinkSites={'ddr5':host,root,'pci-e1':contact,'gddr7':memory.toArray()};
    Object.assign(group.anchors,{gpuLinkSlot:contact,root,gddr:memory.toArray()});
    group.annotations = [
      ['ddr5','主机 DDR5','ram',[16,-5]], ['root','CPU 根端口','root',[-16,-8]],
      ['pci-e1','PCI_E1','gpuLinkSlot',[-8,-8]], ['gddr7','RTX 5090 · GDDR7','gddr',[18,4]],
    ].map(([actor,title,key,offset])=>({...annotate(title,key,group.gpuLinkSites[actor]),actor,offset}));
    group.gpuLinkPoints = {
      host: [host,[59,14,-61],[39,12,-55],root],
      pcie: [root,[6,12,-36],[-11,6,-13],[-23,6,12],contact],
      local: [contact,cardEdge,card.localToWorld(vector([-29,2.3,38])).toArray(),
        card.localToWorld(vector([1,6.4,13])).toArray(),memory.toArray()],
    };
  } else {
    group.gpuTag = annotate('RTX 5090 FE','gpuCard',card.localToWorld(vector(gpuCardLabelPoint)).toArray());
    group.annotations.unshift(group.gpuTag);
  }
}

async function makeBoard(mode) {
  const group=scene('MSI MAG B650 TOMAHAWK WIFI','board',[
    annotate('AM5 · 7950X','socket',boardPositions.socket),
    annotate('DDR5 · A2 / B2','ram',[79.4,34,-19]),
    annotate('990 PRO · M2_1','m2_1',boardPositions.storage),
    annotate('M2_2','m2_2',[-37,5,113.6]),
    annotate('M2_3','m2_3',[51,13,119]),
    annotate('B650','chipset',boardPositions.chipset),
  ],mode==='inference'?[-.35,2.2,.55]:mode==='gpu-link'?[.18,2.6,.42]:
    mode==='assembly'||mode==='power'?[-.08,2.75,.36]:[.35,1.65,.75],.001);
  const body=new T.Group();
  body.scale.setScalar(22);
  group.root.add(body);
  const kit=makeKit(body,boardTopic);
  buildMotherboard(kit,body,'tomahawk');
  group.pieces=kit.pieces;
  group.anchors={...boardPositions};
  group.vrmCovers=kit.pieces.filter(p=>p.id==='tomahawkvrmheatsink').map(p=>p.object);
  const m2=kit.pieces.filter(p=>p.id==='tomahawkm2slot');
  m2.forEach((p,i)=>{p.object.userData.topic=['m2_1','m2_2','m2_3'][i];});
  const covers=kit.pieces.filter(p=>p.id==='tomahawkm2heatsink');
  covers[0].object.userData.topic='m2_1';
  covers[1].object.userData.topic='m2_3';
  // The upper slot keeps the earlier M-key connector and card registration.
  m2[0].object.removeFromParent();
  group.pieces=group.pieces.filter(p=>p!==m2[0]);
  const [ssd,connector,cutaway]=await cardAssets(mode==='io');
  for (const [mesh,key] of [[ssd,'storage'],[connector,'m2_1']]) {
    mesh.scale.setScalar(1000);
    mesh.rotation.y=Math.PI;
    mesh.position.set(28.3,2.3,9.7-11);
    mesh.userData={topic:key,evidence:key==='storage'?'registered previous 990 PRO geometry':'reference M-key connector'};
    group.root.add(mesh);
  }
  const clip = new T.Group();
  clip.name='M2_1 · 2280 EZ M.2 Clip';
  clip.userData={topic:'m2_1',evidence:'holder shape reconstructed from MSI mounting guide'};
  clip.add(new T.Mesh(new T.CylinderGeometry(2.55,2.55,1.45,20),material('#b5a17e',.55)));
  put(clip,new T.Mesh(new T.CylinderGeometry(2.15,2.15,.8,20),material('#252b31')),[0,1,0]);
  put(clip,box([5.1,.66,1.9],'#252b31'),[1.25,1.4,0]);
  put(group.root,clip,[-51.7,1.7,9.7]);
  put(group.root,new T.Mesh(new T.CylinderGeometry(2.5,2.5,1.5,20),material('#ac9b80',.48)),[-81.7,1.55,9.7]);
  group.pieces.push({id:'ssd',object:ssd,base:ssd.position.clone(),delta:vector([-7,30,0])});
  group.firstCover=covers[0].object;
  group.boardOverlays=new T.Group();
  group.boardOverlays.name='Functional connectivity overlay';
  group.root.add(group.boardOverlays);
  if (['assembly','gpu-link','inference','power'].includes(mode)) mountGpu(group,mode);
  if (['assembly','power'].includes(mode)) installPsu(group,{box,material,label});
  if (mode==='assembly') {
    for(const [title,key] of [['ATX_PWR1','atx24'],['CPU_PWR1 / 2','cpuEps'],['JFP1','frontPanel'],['EZ Debug','debugLed']])
      group.annotations.push(annotate(title,key,boardPositions[key]));
    group.psuTag=annotate('RM1000x','atxPsu',group.anchors.atxPsu);
    group.annotations.push(group.psuTag);
    setPsuView(group,{visible:false});
  }
  if (mode==='power') {
    group.firstCover.visible=false;
    installPower(group,{route,clearRoutes});
  }
  if (mode==='inference') {
    group.firstCover.visible=false;
    installInference(group,ssd,{route,clearRoutes});
  }
  if(cutaway){
    group.firstCover.visible=false;
    installSystemIO(group,ssd,cutaway,cpuScene('package').root,{label,route,clearRoutes});
  }
  return group;
}

export function showGpuLinkStep(group,step,direction) {
  group.firstCover.visible=false;
  const layer=group.boardOverlays;
  clearRoutes(layer);
  layer.name='PCI_E1 transfer · '+step.id;
  layer.userData={payloadDirection:direction,step:step.id,landing:group.gpuLinkSites[step.id]??null};
  const order=direction==='d2h'?['local','pcie','host']:['host','pcie','local'];
  const overview=step.id==='overview', current=order.indexOf(step.segment);
  order.slice(0,overview?order.length:current+1).forEach((key,i)=>{
    const points=group.gpuLinkPoints[key];
    const bright=overview||i===current;
    const line=route(layer,direction==='d2h'?[...points].reverse():points,bright?.93:.46,gpuLinkColors[key],
      {arrow:bright,bright,depth:false,alpha:bright?.93:.25});
    line.name='GPU transfer · '+key;
    line.userData={segment:key,active:bright};
  });
  const landing=group.gpuLinkSites[step.id];
  if(landing){
    const marker=new T.Mesh(pinBall,new T.MeshBasicMaterial({color:step.color,depthTest:false,toneMapped:false}));
    marker.name='GPU transfer landing · '+step.id;
    marker.renderOrder=12;marker.scale.setScalar(2.4);
    put(layer,marker,landing);
  }
  for(const tag of group.annotations){
    tag.endpoint=tag.actor===step.id;
    tag.priority=tag.endpoint?2:0;
  }
}

export function updateBoard(group,{mode,lane=0,direction='both',spreader=false,evidence=false,explode=0,
  showGpu=true,showPsu=false,vrmOpen=false}) {
  if(mode==='io')return;
  group.firstCover.visible=spreader || (mode==='assembly' && explode>.02);
  for (const part of group.pieces) {
    part.object.position.copy(part.base);
    if (mode==='assembly') {
      const amount = /cpu$|ram$|ssd$|m2heatsink$|vrmheatsink$|^gpuCard$/.test(part.id) ? explode : 0;
      part.object.position.addScaledVector(part.delta,amount);
    }
  }
  clearRoutes(group.boardOverlays);
  const layer=group.boardOverlays;
  if (mode==='assembly') {
    showVrmCovers(group,!vrmOpen);
    setPsuView(group,{visible:showPsu,cables:explode<=.02,gpu:showGpu});
    group.psuTag.show=showPsu;
    group.gpu.visible = showGpu;
    group.gpuTag.show = showGpu;
    group.gpuTag.p.copy(group.gpu.localToWorld(vector(gpuCardLabelPoint)));
  }
  if (mode==='pcie') {
    const side=2;
    for (let i=0; i<4; i++){
      for (const kind of ['tx','rx']){
        const enabled = direction==='both' || direction===kind;
        const selected=lane===i && enabled;
        for (let k=0;k<2;k++){
          const {pin,points}=mainBoardLane(i,kind,k);
          const [x,,z]=points.at(-1);
          const marker=new T.Mesh(pinBall,
            new T.MeshBasicMaterial({color:selected?'#b7e4ff':'#476a7c'}));
          marker.scale.setScalar(selected ? .28 : .18);
          marker.name='M-key pin '+pin;
          marker.userData={topic:'m2_1',evidence:'M-key pin number',pin};
          put(layer,marker,[x,3.31,z]);
          if (evidence) continue;
          const color=selected?(kind==='tx'?'#77e9c5':'#91c3ff'):'#6e6251';
          route(layer,kind==='tx'?points:[...points].reverse(),selected ? .16 : .09,color,
            {arrow:selected,alpha:selected ? 1 : .58});
        }
      }
    }
    if (evidence) return;
    route(layer,[[.3,side,-33],[-4,side,-18],[-16,side,69],[-15,side,101],[-4.3,4,113.6]],.43,'#e1a466',{arrow:true});
    route(layer,[[22,side,-43],[42,side,-20],[48,side,35],[64,6,63]],.46,'#e1a466',{arrow:true});
    route(layer,[[65,5,67],[75,side,81],[87,side,106],[86.8,4,113.6]],.38,'#e1a466',{arrow:true});
    route(layer,[[64,5,67],[44,side,86],[17,4,91.3]],.27,'#b68f62',{arrow:true});
    route(layer,[[-5,side,-36],[-16,side,-10],[-35,side,18],[-44,4,29.5]],.32,'#b68f62',{arrow:true});
  }
  if (mode==='ddr' && !evidence) {
    for (const [channel,endX] of [70.6,88.2].entries()){
      for (let i=0;i<10;i++){
        const z=-64+i*1.6+channel*3;
        const color=i<8?(channel?'#6fa9ec':'#6be0b5'):'#e9b45d';
        route(layer,[[26,3,z-5],[37+channel*4,3,z-5],[52+channel*3,3,z],[endX,6,z]],.18,color);
      }
    }
  }
}

function moduleScene() {
  const group=scene('DDR5 UDIMM · 288 contacts','module',[
    annotate('×8 FBGA','chips',[-6,1,-.1]),
    annotate('PMIC','pmic',[0,.8,.6]),
    annotate('SPD','spd',[0,.8,-1]),
    annotate('288 触点','module',[7,.4,-2.2]),
  ],[.27,1.65,.69],.006);
  const kit=makeKit(group.root,dramTopic,hideDimmCover);
  buildDimm(kit);
  group.pieces=kit.pieces;
  return group;
}

function dramScene(mode) {
  if (mode==='module') return moduleScene();
  const settings = {
    bga:['DDR5 FBGA','bga',[.41,1.1,1],.001],
    die:['DDR5 16 Gb x8 · 8 bank groups','banks',[.2,1.7,.79],.001],
    bank:['DDR5 bank · mat and sense amplifiers','bank',[.24,1.5,.88],.001],
    cell:['DDR5 1T1C · cell array','cell',[.26,1.55,.97],.001],
  };
  const [name,topic,pose,unitScale]=settings[mode];
  const group=scene(name,topic,[],pose,unitScale);
  const kit=makeKit(group.root,dramTopic);
  if (mode==='bga') buildDram(kit);
  else buildRamArchitecture(mode==='die'?'banks':mode,kit,group.root);
  group.pieces=kit.pieces;
  if (mode==='bga') {
    group.annotations=[
      annotate('塑封层','bga',[4,2,-4]),
      annotate('裸片','banks',[-1,1,0]),
    ];
  }
  return group;
}

function addBlock(kit,id,title,detail,p,size,color) {
  const [x,y,z]=size;
  const body=new T.Group();
  body.add(box(size,color));
  put(body,box([x*.96,.04,z*.95],color,.06,.7),[0,y/2+.017,0]);
  put(body,box([x*.83,.055,.045],'#9aaeb6',.25),[0,y/2+.032,-z*.43]);
  label(body,title,[0,y/2+.05,detail ? -.15*z : 0],x*.83,'#102123',z*.45);
  if(detail) label(body,detail,[0,y/2+.05,.22*z],x*.74,'#203c41',z*.28);
  const part=kit.add(id,body,p);
  return {part,port:[p[0],p[1]+y/2+.13,p[2]]};
}

function cpuScene(mode) {
  const rootTopic={package:'package',io:'iod',core:'front'}[mode];
  const group=scene('Ryzen 9 7950X · '+mode,rootTopic,[],[.26,1.65,.93],.004);
  const kit=makeKit(group.root,cpuTopic);
  if(mode==='package'){
    buildRyzen(kit,group.root);
    const outline=new T.Shape();
    const points=[[-5.15,-3.6],[-3.3,-3.6],[-3,-3.17],[-1.02,-3.17],[-.72,-3.6],[.72,-3.6],
      [1.02,-3.17],[3,-3.17],[3.3,-3.6],[5.15,-3.6],[5.15,-1.62],[4.77,-1.32],
      [4.77,1.32],[5.15,1.62],[5.15,3.6],[3.3,3.6],[3,3.17],[1.02,3.17],[.72,3.6],[-.72,3.6],
      [-1.02,3.17],[-3,3.17],[-3.3,3.6],[-5.15,3.6],[-5.15,1.62],[-4.77,1.32],[-4.77,-1.32],[-5.15,-1.62]];
    points.forEach(([x,z],i)=>i?outline.lineTo(x,-z):outline.moveTo(x,-z));outline.closePath();
    const capGeometry=new T.ExtrudeGeometry(outline,{depth:.31,bevelEnabled:true,bevelSize:.06,bevelThickness:.035,bevelSegments:2});
    capGeometry.rotateX(-Math.PI/2);
    const cap=new T.Group();
    cap.add(new T.Mesh(capGeometry,material('#acb4b9',.74,.42)));
    label(cap,'AMD RYZEN 9 7950X',[0,.35,0],5,'#333e42',.79);
    kit.add('package',cap,[0,.74,0],[0,3.35,-3.7]);
    group.cap=cap;
    cap.visible=false;
    group.annotations=[
      annotate('CCD 0 · 8 核','ccd',[-2.6,.52,-2.8]),
      annotate('CCD 1 · 8 核','ccd',[2.6,.52,-2.8]),
      annotate('I/O 裸片','iod',[0,.35,2.25]),
    ];
  } else if(mode==='io') {
    buildRyzenIo(kit,group.root);
    addBlock(kit,'iommu','IOMMU','IOVA → PA',[0,.14,-2.18],[2.72,.25,1.15],palette.violet);
    route(group.root,[[0,.04,-1.6],[0,.04,-.75]],.045,palette.gold);
    group.annotations=[annotate('IOMMU','iommu',[.3,.4,-2.2]),annotate('根端口','root',[3.55,.32,1.5])];
  } else {
    put(group.root,box([12.8,.14,7.1],'#1a282c'),[0,-.14,0]);
    const blocks = [
      ['front','取指 / 解码','L1I · µOP CACHE',[-3.9,.31,-1.95],[3.8,.55,1.7],palette.teal],
      ['execute','重命名 / 调度','INT · FP · RETIRE',[.08,.31,-1.95],[3.4,.55,1.7],palette.blue],
      ['mmu','Load / Store','DTLB · AGU',[3.95,.31,-1.95],[3.7,.55,1.7],palette.violet],
      ['cache','L1D','32 KB · 私有',[3.94,.31,.24],[3.7,.55,1.25],palette.teal],
      ['cache','L2','1 MB · 私有',[1.35,.31,1.97],[4,.55,1.35],palette.teal],
      ['fabric','CCD 互连','L3 32 MB / Fabric',[-3.33,.31,1.97],[4.4,.55,1.35],palette.amber],
    ];
    for (const args of blocks) addBlock(kit,...args);
    for (const path of [
      [[-2,.62,-1.95],[-1.62,.62,-1.95]],[[1.78,.62,-1.95],[2.1,.62,-1.95]],
      [[3.94,.62,-1.1],[3.94,.62,-.38]],[[3.94,.62,.87],[3.94,.62,1.97],[3.35,.62,1.97]],
      [[-.65,.62,1.97],[-1.13,.62,1.97]],
    ]) route(group.root,path,.035,palette.gold,{arrow:true});
  }
  group.pieces=kit.pieces;
  return group;
}

function makeHost() {
  const group=scene('Linux Host · NVMe over PCIe','app',[],[.19,1.58,1],.010);
  const kit=makeKit(group.root,id=>id);
  const bands=[
    [[0,-.14,-4.2],[14.2,.13,2.7],'#15292c','PROCESSOR / SOFTWARE'],
    [[0,-.14,-.38],[14.2,.13,3.8],'#1c3038','PCIe / ADDRESS SPACE'],
    [[-1.3,-.14,3.52],[11.6,.13,2.7],'#162e2d','HOST MEMORY'],
  ];
  for(const [p,size,tint,caption] of bands){
    const slab=put(group.root,box(size,tint),p);
    label(group.root,caption,[p[0]-size[0]/2+1.48,slab.position.y+.083,p[2]-size[2]/2+.18],2.45,'#75989e');
  }
  const items=[
    ['app','应用 / blk-mq','DIRECT I/O',[-5.07,.26,-4.05],[3.55,.53,1.45],palette.teal],
    ['driver','NVMe 驱动','CPU',[-.62,.26,-4.05],[3.85,.53,1.45],palette.teal],
    ['irq','MSI-X / Poll','通知',[4.48,.26,-4.05],[3.82,.53,1.45],palette.violet],
    ['iommu','IOMMU','IOVA → PA',[-4.67,.26,-.34],[3.92,.53,1.56],palette.violet],
    ['root','Root Port','PCIe 4.0 ×4',[-.2,.26,-.34],[3.28,.53,1.56],palette.blue],
    ['bar','BAR0','DOORBELL',[2.72,.26,-1.0],[2.15,.53,1.04],palette.amber],
    ['ctrl','SSD','990 PRO',[5.38,.26,.24],[2.9,.53,2.18],palette.blue],
    ['sq','SQ','64 B / ENTRY',[-5.11,.26,3.66],[3.45,.53,1.52],palette.teal],
    ['buffer','DATA BUFFER','4 KiB',[-1.17,.26,3.66],[3.69,.53,1.52],palette.teal],
    ['cq','CQ','16 B / ENTRY',[2.8,.26,3.66],[3.51,.53,1.52],palette.teal],
  ];
  group.ports={};
  for(const args of items) group.ports[args[0]]=addBlock(kit,...args).port;
  group.pieces=kit.pieces;
  for(const [from,to] of [['app','driver'],['driver','root'],['root','ctrl'],['root','iommu'],['iommu','sq'],['iommu','buffer'],['iommu','cq']]){
    const p=group.ports[from], q=group.ports[to];
    route(group.root,[[p[0],.036,p[2]],[p[0],.036,q[2]],[q[0],.036,q[2]]].filter((v,i,a)=>!i||v[0]!==a[i-1][0]||v[2]!==a[i-1][2]),
      .028,'#5b817f');
  }
  return group;
}

function clearRoutes(object) {
  const old=new Set();
  object.traverse(o=>{if(o!==object && o.isMesh)old.add(o.material);});
  object.clear();
  for (const ink of old) ink.dispose();
}

export function highlight(group,step,selection,options={}) {
  if (group.lightOutline) {
    group.lightOutline.removeFromParent();
    group.lightOutline.material.dispose();
    group.lightOutline.geometry.dispose();
    group.lightOutline=null;
  }
  if (!step && selection) {
    const selected=group.pieces.find(p=>p.object.userData.topic===selection&&p.object.visible);
    if (selected && selection!=='board') {
      group.lightOutline=new T.BoxHelper(selected.object,0xa4f9d1);
      group.effects.add(group.lightOutline);
    }
  }
  for (const part of group.pieces) {
    if (part.light) {
      for(const item of part.light) item.o.material=item.original;
      part.light=null;
    }
  }
  if (!step) return;
  if (group.ports) {
    if(group.signal) { clearRoutes(group.signal); group.signal.removeFromParent(); }
    group.signal=new T.Group();
    group.motion=new T.CurvePath();
    group.pulse=null;
    group.effects.add(group.signal);
    const points=step.path.filter(k=>group.ports[k]).map(k=>group.ports[k]);
    if(points.length>1) {
      for (let i=1;i<points.length;i++){
        const a=points[i-1], b=points[i];
        const corner=[(a[0]+b[0])/2,.82,(a[2]+b[2])/2];
        const segmentPoints=[a,[a[0],.82,a[2]],corner,[b[0],.82,b[2]],b];
        route(group.signal,segmentPoints,.038,palette.mint,{arrow:true,bright:true});
        for(let j=1;j<segmentPoints.length;j++){
          group.motion.add(new T.LineCurve3(vector(segmentPoints[j-1]),vector(segmentPoints[j])));
        }
      }
      group.pulse=new T.Mesh(pinBall,new T.MeshBasicMaterial({color:'#f4fff8'}));
      group.pulse.scale.setScalar(.13);group.pulse.visible=false;
      group.signal.add(group.pulse);
    }
  }
  const highlighted = group.ports ? step.path :
    (step.marks||[]).map(s=>s.replace(' ',''));
  const endpointIndexes=new Map();
  for (const part of group.pieces) {
    const idx=endpointIndexes.get(part.id)||0;
    endpointIndexes.set(part.id,idx+1);
    if (!highlighted.includes(part.id)) continue;
    if (part.id==='dramwordline' && idx!==0) continue;
    if (/^dram(bitline|cellsa)$/.test(part.id) && idx!==(options.bit===1?0:1)) continue;
    if (part.id==='dramaccess' && idx!==(options.bit===1?0:1)) continue;
    if (part.id==='dramcapacitor' && !((part.object.position.z < -3.8) && Math.abs(part.object.position.x-(options.bit===1?-3:-2))<.01)) continue;
    part.light=[];
    part.object.traverse(o=>{
      if(!o.isMesh || !o.material?.isMeshStandardMaterial) return;
      const original=o.material;
      if(!highlightMaterials.has(o)) highlightMaterials.set(o,o.material.clone());
      const active=highlightMaterials.get(o);
      active.emissive.set(group.ports?'#52a982':'#63c6b8');
      active.emissiveIntensity=group.ports ? .41 : .72;
      part.light.push({o,original});
      o.material=active;
    });
  }
}

export function updateExplode(group,factor) {
  for(const p of group.pieces) p.object.position.copy(p.base).addScaledVector(p.delta,factor);
}

function gpuScene(mode) {
  if (mode==='card' || mode==='pcb') {
    const cutaway=mode==='pcb';
    const tags=cutaway ? [
      ['GB202','gpuDie',[0,5,0]],['GDDR7','gddr',[42,3,-13]],['核心板','gpuMain',[34,0,-53]],
      ['PCIe 卡边','gpuPcie',[-61,-12,66]],['显示输出板','gpuOutput',[-141,-12,-9]],
    ] : [
      ['双贯流散热','gpuCooling',[-88,19,1]],['16-pin','gpuPower',[16,8,-67]],
      ['PCIe 卡边','gpuPcie',[-57,-12,66]],['显示接口','gpuOutput',[-148,5,-18]],
    ];
    const group=scene(gpuProfile.name,cutaway?'gpuMain':'gpuCard',
      tags.map(args=>annotate(...args)),[-.16,1.57,.6],.001);
    const kit=makeKit(group.root,id=>id);
    buildRtx5090(kit,{cutaway});
    group.pieces=kit.pieces;
    return group;
  }
  const die=mode==='die';
  const tags=die ? [
    ['GPC','gpuGpc',[-2.25,.47,1.15]],['L2','gpuL2',[0,.28,0]],
    ['显存控制器','gpuMc',[2.7,.35,-2.7]],['PCIe Host','gpuHost',[0,.38,4.1]],
  ] : [
    ['CUDA Core','gpuCuda',[-2.8,.35,-.65]],['Tensor Core','gpuTensor',[1.05,.39,2.05]],
    ['L1 / Shared','gpuShared',[0,.38,3.55]],['Warp 调度','gpuScheduler',[-1.05,.35,-2.65]],
  ];
  const picked=die ? {gpc:'gpuGpc',l2:'gpuL2',controller:'gpuMc',host:'gpuHost'} :
    {cuda:'gpuCuda',tensor:'gpuTensor',l1:'gpuShared',scheduler:'gpuScheduler',register:'gpuScheduler'};
  const group=scene(die?'GB202 · RTX 5090':'Blackwell · Streaming Multiprocessor',
    die?'gpuDie':'gpuSm',tags.map(args=>annotate(...args)),[.12,1.67,.71],.006);
  const kit=makeKit(group.root,id=>picked[id]);
  put(group.root,box(die?[9.55,.18,10.5]:[11.7,.18,8.2],'#18272b',.28,.08),[die?0:.75,-.19,die?-.2:.13]);
  buildGpuArchitecture(mode,kit,group.root);
  group.pieces=kit.pieces;
  return group;
}

export function makeScene(view,mode) {
  if (view==='board') return makeBoard(mode);
  if (view==='cpu') return cpuScene(mode);
  if (view==='dram') return dramScene(mode);
  if (view==='gpu') return gpuScene(mode);
  return makeHost();
}
