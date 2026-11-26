import * as T from 'three';
import { hostSnapshot, lanePins } from './model.mjs';
import { hostWriteTarget, signalKinds } from './system-flow.mjs';

const V = p => new T.Vector3(...p);
const pulseGeometry = new T.SphereGeometry(1,12,10);
const destinationGeometry = new T.TorusGeometry(1,.10,8,28);
const chipNodes = {
  endpoint:['stack_on_asic_host_macro','PCIe / NVMe','ctrl'],
  dma:['stack_on_asic_dma_macro','DMA','ctrl'],
  ftl:['stack_on_asic_ftl_macro','FTL','ctrl'],
  sram:['stack_on_asic_sram_macro','片上 SRAM','ctrl'],
  ecc:['stack_on_asic_ecc_macro','ECC','ctrl'],
  'nand-phy':['stack_on_asic_nand_macro','NAND PHY','ctrl'],
  'nand-io':['stack_io_nand_a_io','NAND I/O','nand'],
  addr:['stack_io_nand_a_addr','行地址','nand'],
  row:['stack_io_nand_a_row','行译码','nand'],
  select:['stack_io_nand_a_select','选择栅','nand'],
  wordline:['stack_io_nand_a_wordline','选中字线','nand'],
  bitline:['stack_io_nand_a_bl','位线 BL','nand'],
  sense:['stack_io_nand_a_sense','感测放大器','nand'],
  page:['stack_io_nand_a_page','页缓冲','nand'],
  column:['stack_io_nand_a_column','列选择','nand'],
};
const hostNodes = {
  cpu:[[-4,10.2,-67.5],'Zen 4 · CPU','socket'],
  root:[[10.5,10.5,-51.5],'PCIe 根端口','root'],
  iommu:[[4.5,10.55,-52.5],'IOMMU','iommu'],
  umc:[[13.5,10.55,-56.5],'DDR5 UMC','umc'],
  'irq-target':[[-7.7,10.45,-53.5],'中断目标','irq'],
  m2:[[29.9,5.4,11.2],'M2_1 · M-key','m2_1'],
  dimm:[[79.4,33,-65],'A2 / B2 · DDR5','ram'],
  sq:[[101,43,-96],'SQ[3] · 64 B','sq'],
  buffer:[[101,43,-72],'数据页 · 4 KiB','buffer'],
  cq:[[101,43,-48],'CQ[3] · 16 B','cq'],
};
const frames = {
  cpu:{center:[48,15,-68],size:[132,40,101],pose:[.13,1.9,.89]},
  link:{center:[-2,8,-24],size:[109,20,107],pose:[.14,1.85,.94]},
  transfer:{center:[28,14,-34],size:[177,40,138],pose:[.16,1.98,.93]},
  pascal:{center:[13.7,3.7,9.8],size:[16.9,3.3,16.8],pose:[.06,2.3,.95]},
  drive:{center:[-7.9,3.6,9.7],size:[64,5,24],pose:[.05,2.6,1.0]},
  nand:{center:[-25.2,3.7,9.9],size:[18.5,3,18.4],pose:[.04,2.4,.78]},
};
const legendGroups = {
  cpu:['cpu','root','umc','iommu','irq-target','dimm','sq','buffer','cq'],
  link:['cpu','root','m2','endpoint','irq-target'],
  transfer:['cpu','root','m2','endpoint','dimm','sq','buffer','cq'],
  pascal:['endpoint','dma','ftl','sram','ecc','nand-phy'],
  drive:['endpoint','nand-phy','nand-io','page','column','row'],
  nand:['row','select','wordline','bitline','sense','page','column','nand-io'],
};

export function mainBoardLane(lane,kind,index) {
  const pin=lanePins(lane)[kind][index];
  const z=9.7-11+1.75+(pin-1)*.25;
  const offset=lane*1.65+(kind==='rx' ? .7 : 0)+index*.30;
  return {pin,points:[[11+offset,2,-37],[11+offset,2,-27],[17+offset,2,-18],
    [17+offset,2,z-5],[25+offset*.22,2,z],[28.3,3.45,z]]};
}

function attach(parent,child,p) {
  child.position.set(...p);parent.add(child);return child;
}

function makeMemory(overlay,label) {
  const backing=new T.Mesh(new T.BoxGeometry(37,.27,65),new T.MeshStandardMaterial({
    color:'#152c38',roughness:.74,metalness:.2,transparent:true,opacity:.85,
  }));
  backing.name='DDR5 address overlay (logical, not an address-to-DIMM map)';
  attach(overlay,backing,[101,40,-72]);
  const slots={};
  const titles={sq:'SQ[3]  ·  64 B',buffer:'DATA  ·  4 KiB',cq:'CQ[3]  ·  16 B'};
  const tones={sq:'#705239',buffer:'#24564e',cq:'#2f4c6c'};
  for(const key of ['sq','buffer','cq']){
    const [p,,topic]=hostNodes[key];
    const body=new T.Group();
    body.name=titles[key];body.userData={topic,endpoint:key,addressKind:'logical host memory'};
    const face=new T.Mesh(new T.BoxGeometry(34,1.15,12),new T.MeshStandardMaterial({
      color:tones[key],metalness:.18,roughness:.66,
    }));
    attach(body,face,[0,-.65,0]);
    label(body,titles[key],[0,.024,-2.05],27,'#e4f0ee',3.75);
    attach(overlay,body,[p[0],p[1]-.8,p[2]]);
    slots[key]={body,face,status:null};
  }
  label(overlay,'主机 DDR5 · 逻辑地址',[101,43,-111.4],33,'#d0e8ec',3.55);
  return slots;
}

function setMemory(slots,snapshot,step,operation,landing,label) {
  const lit = {
    sq: snapshot.sqHead===0 || snapshot.sqEntry!=='待提交',
    buffer: operation==='read' ? snapshot.data==='4 KiB 已写到主机' : snapshot.data!=='待准备',
    cq: snapshot.cqEntry!=='P=0，旧数据',
  };
  const messages = {
    sq:snapshot.sqHead===0?'SSD 已取 / SQHD 0':snapshot.sqTail===0?'门铃已发布':lit.sq?'SQE 已填写':'等待 CPU 写入',
    buffer:operation==='read'?(lit.buffer?'数据已写入':'等待读数据'):
      (snapshot.data.includes('已到')||snapshot.data.includes('持久性')?'负载已送到 SSD':lit.buffer?'写负载已准备':'等待准备写负载'),
    cq:!lit.cq?'旧项 · P=0':snapshot.cqHead===0?'已消费 · 下轮 P=0':'新项 · 成功 / P=1',
  };
  for(const [key,slot] of Object.entries(slots)){
    const active=step.path.at(-1)===key;
    const writtenHere=key===landing;
    const kind=key==='cq'?'completion':key==='buffer'?'data':'command';
    slot.face.material.emissive.set(signalKinds[kind].color);
    slot.face.material.emissiveIntensity=writtenHere ? .72 : active ? .42 : lit[key] ? .13 : 0;
    const message=writtenHere?(key==='cq'?'本步写入 · P=1':'本步写入'):messages[key];
    if(slot.status?.userData.text===message)continue;
    if(slot.status){slot.status.geometry.dispose();slot.status.removeFromParent();}
    slot.status=label(slot.body,message,[0,.022,2.45],27,'#edf7f4',3.4);
    slot.status.userData.text=message;
  }
}

export function installSystemIO(board,ssd,cutaway,cpuModel,tools) {
  const {label}=tools;
  board.topic='integrated';
  board.name='ATX · CPU / DDR5 / Samsung 990 PRO';
  board.root.name=board.name;
  cutaway.name='Registered 990 PRO electrical cutaway';
  ssd.add(cutaway);
  const physical=new Map(ssd.children.filter(o=>o!==cutaway).map(o=>[o.userData.id,o]));
  const parts=new Map(cutaway.children.map(o=>[o.userData.id,o]));

  const overlay=new T.Group();
  overlay.name='ATX functional I/O overlays';
  overlay.userData.evidence='educational geometry, anchored to AM5 / A2-B2 and M2_1';
  board.root.add(overlay);
  cpuModel.name='7950X logical package layout in place';
  cpuModel.scale.set(3.35,2.8,3.65);
  attach(overlay,cpuModel,[4.5,9,-60.8]);
  const slots=makeMemory(overlay,label);

  board.root.updateMatrixWorld(true);
  const landmarks=new Map();
  for(const [key,[p,title,topic]] of Object.entries(hostNodes))landmarks.set(key,{p:V(p),title,topic});
  for(const [key,[id,title,topic]] of Object.entries(chipNodes)){
    const object=parts.get(id);
    if(!object)throw new Error('Missing registered SSD part '+id);
    const bounds=new T.Box3().setFromObject(object);
    const p=bounds.getCenter(new T.Vector3());p.y=bounds.max.y+.078;
    landmarks.set(key,{p,title,topic});
  }
  for(const object of parts.values()){
    if(object.userData.stack.site==='flash')object.userData.topic='nand';
    else if(object.userData.stack.site==='ctrl')object.userData.topic='ctrl';
  }
  board.annotations=[...landmarks].map(([actor,{p,title,topic}])=>({actor,p,title,key:topic,show:false,
    offset:actor==='m2'?[15,22]:undefined}));
  board.anchors={...board.anchors,...Object.fromEntries([['ctrl','ftl'],['nand','wordline'],['sq','sq'],
    ['buffer','buffer'],['cq','cq'],['root','root'],['iommu','iommu']].map(([key,ref])=>[key,landmarks.get(ref).p.toArray()]))};
  const signal=new T.Group();
  signal.name='Highlighted transaction on this assembly';
  board.effects.add(signal);
  board.signal=signal;
  board.system={ssd,physical,parts,landmarks,slots,signal,tools,glow:new Map()};
}

function pinToCard(ssd,[x,y,z],raise=0) {
  const p=ssd.localToWorld(new T.Vector3(x/1000,z/1000,-y/1000));
  p.y+=raise;
  return p.toArray();
}

function requiredPaths(parts,id) {
  const paths=parts.get(id)?.userData.stack.paths_mm;
  if(!paths?.length)throw new Error('Missing registered route '+id);
  return paths;
}

function pciePath(model,lane,direction,signal) {
  const prefix='stack_pcie_'+lane+'_'+direction+'_';
  const legs=direction==='up'?['finger','aftercap','pair','launch']:['finger','pair','launch'];
  const hostSide=mainBoardLane(lane,direction==='up'?'rx':'tx',signal);
  const device=legs.flatMap(section=>requiredPaths(model.parts,prefix+section)[signal])
    .map(point=>pinToCard(model.ssd,point,.34));
  const points=[...hostSide.points,...device];
  return direction==='up' ? points.reverse() : points;
}

function nandPath(model,direction) {
  const prefix='stack_nand_a_';
  const fanout=requiredPaths(model.parts,prefix+'ctrl_0')[0];
  const body=requiredPaths(model.parts,prefix+'0')[0];
  const incoming=requiredPaths(model.parts,prefix+'flash_0')[0];
  const routes=[...fanout.slice().reverse(),...body,...incoming];
  const points=routes.map(point=>pinToCard(model.ssd,point,.72));
  return direction==='up'?points.reverse():points;
}

function pathPlan(model,path,lane) {
  const result=[];
  for(let i=0;i<path.length;i++){
    const key=path[i], p=model.landmarks.get(key)?.p.toArray();
    if(p){result.push(p);continue;}
    if(key.startsWith('pcie-')){
      const direction=key.endsWith('up')?'up':'down';
      const paths=[0,1].map(index=>pciePath(model,lane,direction,index));
      result.push(...paths[0].map((point,index)=>point.map((value,axis)=>(value+paths[1][index][axis])/2)));
    }else{
      result.push(...nandPath(model,key.endsWith('up')?'up':'down'));
    }
  }
  return result.filter((point,i)=>i===0||point.some((value,axis)=>Math.abs(value-result[i-1][axis])>.0001));
}

function setCutaways(model,step,operation,lane,color) {
  const ctrl=step.path.some(key=>chipNodes[key]?.[2]==='ctrl');
  const flash=step.path.some(key=>chipNodes[key]?.[2]==='nand');
  const flashOrCtrl=ctrl||flash;
  for(const id of ['top_film','top_ink','top_red'])model.physical.get(id).visible=!flashOrCtrl;
  for(const id of ['U_CTRL_body','U_CTRL_mark'])model.physical.get(id).visible=!ctrl;
  for(const id of ['U_N1_body','U_N1_mark'])model.physical.get(id).visible=!flash;
  const selectedNet=step.path.includes('pcie-up')?'pcie_'+lane+'_up':
    step.path.includes('pcie-down')?'pcie_'+lane+'_down':
      step.path.some(key=>key==='nand-up'||key==='nand-down')?'nand_a':'';
  const anchors=[...step.path,...(step.mark||[])];
  const pathMeshes=new Set(anchors.map(key=>chipNodes[key]?.[0]));
  const activeNandActors=new Set(anchors.filter(key=>chipNodes[key]?.[2]==='nand').map(key=>({
    'nand-io':'io',bitline:'sense',
  }[key]||key)));
  for(const [id,object] of model.parts) {
    const {site,role,net,actor,operation:scope}=object.userData.stack;
    const detail=role==='logic'||role==='chip_detail';
    const activeNet=Boolean(selectedNet)&&net===selectedNet;
    object.visible=detail?(site==='ctrl'?ctrl:flash)&&(!scope||scope===operation):activeNet;
    const lit=object.visible && (pathMeshes.has(id)||(site==='flash'&&activeNandActors.has(actor))||
      (role!=='chip_detail'&&activeNet));
    let paint=model.glow.get(object);
    if(lit && !paint){
      paint={normal:object.material,bright:object.material.clone()};
      model.glow.set(object,paint);
    }
    if(paint){
      paint.bright.emissive.set(color);paint.bright.emissiveIntensity=.53;
      object.material=lit?paint.bright:paint.normal;
    }
  }
}

function drawActiveSignal(board,step,lane,color,landing) {
  const model=board.system;
  const {signal,tools}=model;
  tools.clearRoutes(signal);
  board.pulse=null;
  const points=pathPlan(model,step.path,lane);
  if(!points.length)return;
  const zoomed=step.focus==='pascal'||step.focus==='nand';
  if(points.length>1){
    const pcie=step.path.find(key=>key.startsWith('pcie-'));
    if(pcie){
      const way=pcie.endsWith('up')?'up':'down';
      for(let line=0;line<2;line++){
        tools.route(signal,pciePath(model,lane,way,line),.14,color,{depth:false,alpha:.76});
      }
    }
    tools.route(signal,points,landing ? .49 : zoomed ? .073 : .32,color,{depth:false,arrow:true,bright:true,
      alpha:pcie ? .87 : 1});
    board.motion=new T.CurvePath();
    for(let i=1;i<points.length;i++)board.motion.add(new T.LineCurve3(V(points[i-1]),V(points[i])));
    board.pulse=new T.Mesh(pulseGeometry,new T.MeshBasicMaterial({
      color:'#f6fff9',depthTest:false,toneMapped:false,
    }));
    board.pulse.scale.setScalar(zoomed ? .16 : .60);
    board.pulse.renderOrder=13;board.pulse.visible=false;
    signal.add(board.pulse);
  }
  const target=points.at(-1);
  const ring=new T.Mesh(destinationGeometry,new T.MeshBasicMaterial({
    color,depthTest:false,toneMapped:false,
  }));
  ring.name='Destination · '+step.path.at(-1);
  ring.rotation.x=-Math.PI/2;
  ring.scale.setScalar(landing ? 3.3 : zoomed ? .55 : 1.7);
  ring.renderOrder=10;
  attach(signal,ring,target);
}

export function systemFrame(focus) {
  const frame=frames[focus];
  if(!frame)return null;
  return {box:new T.Box3().setFromCenterAndSize(V(frame.center),V(frame.size)),pose:frame.pose};
}

export function showSystemStep(board,steps,index,operation,lane) {
  const model=board.system, step=steps[index];
  const color=signalKinds[step.kind].color;
  const landing=hostWriteTarget(step);
  const snapshot=hostSnapshot(operation,steps,index);
  setCutaways(model,step,operation,lane,color);
  setMemory(model.slots,snapshot,step,operation,landing,model.tools.label);
  drawActiveSignal(board,step,lane,color,landing);
  const allowed=legendGroups[step.focus];
  for(const tag of board.annotations){
    const involved=step.path.includes(tag.actor)||(step.mark?.includes(tag.actor)??false);
    tag.show=allowed.includes(tag.actor) && (step.focus==='nand'||step.focus==='pascal'?involved:
      tag.actor==='irq-target'?involved:true);
    tag.endpoint=step.path.at(-1)===tag.actor;
    tag.priority=tag.endpoint?2:involved?1:0;
  }
  return systemFrame(step.focus);
}
