import * as T from 'three';
import { buildCapacitor, buildChoke, buildFan, buildScrew } from './vendor/pc-anatomy/parts.ts';
import { psuProfile } from './power-flow.mjs';

const put = (parent,object,[x,y,z]) => {
  object.position.set(x,y,z);
  parent.add(object);
  return object;
};
const V = xyz => new T.Vector3(...xyz);
const move = ([x,y,z],dx,dy,dz) => [x+dx,y+dy,z+dz];
const socketNames = {
  atx:'ATX 24-pin',eps1:'CPU_PWR1 · EPS12V',eps2:'CPU_PWR2 · EPS12V',gpu:'RTX 5090 · 12V-2x6',
};
const sideMount = [273,0,-57];
const shellColor = '#242729', socketColor = '#121515', copper = '#c28b53';

const positions = {
  psuAc:[80,28,49], psuEmi:[57,19,50], psuBridge:[50,24,23],
  psuPfc:[43,43,-30], psuLlc:[-7,39,12], psuSync:[-37,20,10],
  psuStandby:[0,24,47], psuStandbyOut:[-42,16,46], psuDcDc:[-51,28,-34],
  psuOut:[-75,47,-31],
};

function ventSheet(w,h,thickness,dark,allowed) {
  const outline=new T.Shape();
  outline.moveTo(-w/2,-h/2);outline.lineTo(w/2,-h/2);outline.lineTo(w/2,h/2);
  outline.lineTo(-w/2,h/2);outline.closePath();
  for(let row=0,y=-h/2+7;y<h/2-4;row++,y+=8){
    for(let x=-w/2+7+(row%2)*4;x<w/2-4;x+=8){
      if(!allowed(x,y))continue;
      const hole=new T.Path();
      for(let k=0;k<12;k++){
        const angle=Math.PI/6*k, radius=[3.67,3.67,1.48,1.48][k%4];
        const a=x+Math.cos(angle)*radius,b=y+Math.sin(angle)*radius;
        if(k===0)hole.moveTo(a,b);else hole.lineTo(a,b);
      }
      hole.closePath();outline.holes.push(hole);
    }
  }
  return new T.Mesh(new T.ExtrudeGeometry(outline,{depth:thickness,steps:1,bevelEnabled:false}),dark);
}

function modularPort(panel,box,columns,rows,y,z,pitch=4.2,sense=false) {
  const h=rows*pitch, w=columns*pitch;
  const port=new T.Group();
  put(port,box([2.5,h+2,w+2],'#34383a',.22),[0,0,0]);
  put(port,box([.6,h+.7,w+.7],socketColor,.06),[-1.45,0,0]);
  for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){
    const py=(r-(rows-1)/2)*pitch,pz=(c-(columns-1)/2)*pitch;
    put(port,box([.34,pitch*.69,pitch*.69],'#060808'),[-1.84,py,pz]);
    put(port,box([.24,.73,.67],'#a58f70',.62),[-2.08,py,pz]);
  }
  if(sense)for(let c=0;c<4;c++)put(port,box([.35,.73,.72],'#a58f70',.62),[-2.1,h/2+.4,(c-1.5)*1.58]);
  put(panel,port,[-77.5,y,z]);
  return [-80,y,z];
}

function toroid(radius,tube,color,material) {
  const part=new T.Group();
  const core=new T.Mesh(new T.TorusGeometry(radius,tube,10,36),material('#34362e',.2,.73));
  core.rotation.x=Math.PI/2;part.add(core);
  const wire=new T.TorusGeometry(tube*1.09,tube*.19,5,12);
  for(let i=0;i<15;i++){
    const angle=2*Math.PI*i/15;
    const turn=new T.Mesh(wire,material(color,.63,.33));
    turn.position.set(Math.cos(angle)*radius,0,Math.sin(angle)*radius);
    turn.rotation.y=-angle;
    part.add(turn);
  }
  return part;
}

function transformer(parent,box,xyz,w,h,d,bobbin) {
  put(parent,box([w,h,d],'#282a26',.25),xyz);
  put(parent,box([w*.67,h*.81,d*1.02],bobbin,.26),xyz);
  for(let j=0;j<4;j++)
    put(parent,box([1.08,h*.82,d*1.026],'#745a40',.35),move(xyz,(j-1.5)*w*.12,0,0));
  for(const x of [-1,1])put(parent,box([w*.16,h*1.08,d*1.01],'#343837',.42),move(xyz,x*w*.43,0,0));
}

function finBank(parent,box,xyz,length,height,width) {
  put(parent,box([length,2,width],'#555b60',.77),xyz);
  for(let i=0;i<5;i++)
    put(parent,box([length,height,1.1],'#40474c',.66),move(xyz,0,height/2,(i-2)*width/5));
}

function buildInterior(psu,{box,material,label}) {
  const interior=new T.Group();
  interior.name='RM1000x · CWT double-sided board and daughtercards';
  psu.add(interior);
  put(interior,box([151,1.7,143],'#383135',.14),[1,4,0]);
  put(interior,box([2.2,65,141],'#263b33',.13),[-73,40,0]);
  const zone=(key,name)=>{
    const g=new T.Group();g.name=name;g.userData={topic:key};
    interior.add(g);return g;
  };
  const emi=zone('psuEmi','AC input filter · CM chokes, X/Y caps, MOV, NTC and relay');
  for(const [x,z] of [[67,47],[57,57]]){
    put(emi,toroid(5.2,2.3,copper,material),[x,14,z]);
    put(emi,box([5,12,10],'#286d63',.1),[x-7,11,z-3]);
  }
  for(const [i,z] of [32,41,50].entries())
    put(emi,box([3.2,9,5.6],i===0?'#404a68':'#397360',.11),[69,10,z]);
  put(emi,box([15,13.5,10],'#252a27',.12),[58,12,34]);
  const bridge=zone('psuBridge','Dual bridge rectifiers');
  for(const z of [19,28])put(bridge,box([14,13,3.5],'#252929',.21),[57,13,z]);
  finBank(bridge,box,[57,8,23],27,16,12);
  const pfc=zone('psuPfc','Active PFC · boost inductor and two bulk capacitors');
  put(pfc,toroid(11,3.9,copper,material),[55,16,-50]).rotation.x=Math.PI/2;
  for(const [x,r] of [[25,12.7],[51,11.7]]){
    const cap=put(pfc,buildCapacitor(material,r,43,'#663e3b'),[x,26,-27]);
    cap.userData={topic:'psuPfc'};
  }
  finBank(pfc,box,[43,9,-9],50,23,13);
  for(const x of [31,43,55])
    put(pfc,box([6.4,10.2,2.3],'#212526',.16),[x,13,-2]);
  const llc=zone('psuLlc','Half-bridge switches, LLC tank and isolated main transformer');
  transformer(llc,box,[-6,20,11],32,30,28,'#b69c64');
  for(const z of [-12,-4])
    put(llc,box([5.8,11,3.2],'#232726',.2),[17,13,z]);
  put(llc,box([10,11,8.3],'#805045',.23),[14,12,26]);
  const sync=zone('psuSync','Synchronous rectification and 12 V output filter');
  finBank(sync,box,[-35,7,12],26,13,16);
  for(const z of [-10,1,12,23,34])
    put(sync,buildCapacitor(material,3.65,15,'#59393a'),[-53,12.5,z]);
  for(let i=0;i<8;i++)
    put(sync,box([4.1,1.05,3.1],'#1a2422'),[-25+i%4*5.2,6.1,6+Math.floor(i/4)*5.9]);
  const standby=zone('psuStandby','Independent On-Bright flyback converter');
  transformer(standby,box,[-2,13.2,49],19,16.5,18.5,'#b39263');
  put(standby,box([7.1,12.1,1.5],'#204138',.19),[13,12.5,53]);
  put(standby,box([4.1,1.2,3.4],'#212827',.15),[13,8.2,48]);
  const filtered=zone('psuStandbyOut','Standby secondary rectifier and filter');
  put(filtered,box([5.7,1.2,3.8],'#202527'),[-27,5.7,46]);
  for(const z of [43,53])put(filtered,buildCapacitor(material,3.2,10,'#3c4a52'),[-41,10,z]);
  const dcdc=zone('psuDcDc','Secondary DC/DC buck boards · +5 V and +3.3 V');
  put(dcdc,box([1.7,33,54],'#29433a',.18),[-56,21,-32]);
  for(const z of [-17,-44]){
    const coil=put(dcdc,toroid(5.5,2.3,copper,material),[-49,23,z]);
    coil.rotation.z=Math.PI/2;
    put(dcdc,buildCapacitor(material,3.5,12,'#55393a'),[-62,11,z]);
  }
  for(const [dx,dz] of [[28,58],[28,48],[-26,-51],[-36,-47],[-33,-25],[-25,25],[-20,54],[6,-56]]){
    put(interior,buildChoke(material,4.1,1.9,'#54544d'),[dx,6.2,dz]);
    put(interior,box([3.1,1.1,2.25],'#1d2623',.18),[dx+4.8,5.9,dz]);
  }
  for(let z=-61;z<=61;z+=10)
    put(interior,box([8,2,1.7],z<24?'#ad8863':'#b5a367',.56),[-65,7,z]);
  // The dashed divide marks the two electrical domains, with gaps for transformers.
  for(const z of [-63,-55,-47,-39,-31,-23,-15,33,65])
    put(interior,box([.68,.11,4],'#91846e'),[-15,5,z]);
  label(interior,'PRIMARY', [27,5.13,-61],23,'#b5a791');
  label(interior,'SECONDARY', [-43,5.13,-62],25,'#b5a791');
  return interior;
}

function buildShell(kit) {
  const {box,label,material}=kit;
  const {depth:d,height:h,width:w}=psuProfile;
  const root=new T.Group();
  root.name='Corsair RM1000x (2024) · CP-9020271';
  root.userData={topic:'atxPsu',caseMm:[w,h,d],axisMm:['width (Z)','height (Y)','depth (X)'],sku:psuProfile.sku};
  const ink=material(shellColor,.56,.53);
  put(root,box([d,1.6,w],shellColor,.56),[0,.8,0]);
  const ports=new T.Group();ports.name='Modular outputs · Corsair Type 4';ports.userData={topic:'psuOut'};root.add(ports);
  put(ports,box([1.6,h,w],shellColor,.41),[-79.2,h/2,0]);
  const first=modularPort(ports,box,9,2,60,-48),second=modularPort(ports,box,5,2,60,-16);
  const gpu=modularPort(ports,box,6,2,60,9,3,true);
  const eps=[];
  for(const z of [30,47,64])for(const y of [59,39]){
    const endpoint=modularPort(ports,box,2,4,y,z,3.85);
    if(y===59&&z<=47)eps.push(endpoint);
  }
  for(const z of [-62,-47,-32,-17,-2])modularPort(ports,box,3,2,40,z,3.65);
  // Flat printed legends on the modular panel.
  const text=(name,y,z,width)=>{
    const item=label(ports,name,[-80.12,y,z],width,'#e1e0db');
    item.rotation.set(0,-Math.PI/2,0);
  };
  text('MOTHERBOARD',71,-35,36);text('12V-2x6',71,9,17);
  text('CPU / PCIe',72,47,30);text('SATA / PATA',31,-30,32);

  const rear=ventSheet(w,h,1.4,ink,(z,y)=>z<15||y<-34||y>33);
  rear.rotation.y=Math.PI/2;put(root,rear,[78.6,h/2,0]);
  const inlet=new T.Group();inlet.name='IEC C14 · rear AC inlet';inlet.userData={topic:'psuAc'};
  put(inlet,box([1.5,30,25],'#121617',.14),[-1,0,0]);
  put(inlet,box([.45,22,18],'#060809'),[-.15,0,0]);
  for(const [y,z] of [[-5,-5],[-5,5],[5,0]])
    put(inlet,box([1.02,4.8,1.35],'#bab7aa',.64),[-.66,y,z]);
  put(root,inlet,positions.psuAc);
  put(root,box([1.3,15,18],'#18191b',.15),[79.3,28,22]);
  const dial=new T.Mesh(new T.CylinderGeometry(7.6,7.6,2,32),material('#303536',.54,.45));
  dial.rotation.z=Math.PI/2;put(root,dial,[78.9,52,22]);
  const interior=buildInterior(root,kit);
  const cover=new T.Group();cover.name='RM1000x · removable fan cover';root.add(cover);
  const roof=ventSheet(d,w,1.4,ink,(x,z)=>Math.hypot(x,z)<65.5);
  roof.rotation.x=-Math.PI/2;put(cover,roof,[0,h-1.4,0]);
  const fan=buildFan(material,{size:psuProfile.fan,blades:7,frameless:true,bladeColor:'#33383b'});
  fan.scale.y=.72;put(cover,fan,[0,70.5,0]);fan.name='NR140HP · 140 mm fan';
  for(const z of [-74.2,74.2]){
    put(cover,box([d,84.4,1.6],shellColor,.57),[0,43.8,z]);
    put(cover,box([124,25,.13],'#181a1c',.21),[0,39,z*1.01]);
    const mark=label(cover,'RM1000x',[6,39,z*1.011],63,'#d7d8d5',12);
    mark.rotation.set(0,z<0?Math.PI:0,0);
  }
  for(const x of [-63,63])for(const z of [-63,63])
    put(cover,buildScrew(material,2.35),[x,h-1.25,z]);
  const frame=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(d,h,w)),
    new T.LineBasicMaterial({color:'#78938f',transparent:true,opacity:.44}));
  frame.name='PSU case envelope · 150 × 86 × 160 mm';frame.raycast=()=>{};
  put(root,frame,[0,h/2,0]);
  return {root,cover,interior,frame,ports:{first,second,gpu,eps1:eps[0],eps2:eps[1]}};
}

function mountHarness(board,psu,{box,material}) {
  const atxPort=board.root.getObjectByName('tomahawkatx24');
  const boardSocket = name => board.root.getObjectByName(name).getWorldPosition(new T.Vector3()).add(new T.Vector3(0,4.5,0)).toArray();
  const atx=atxPort.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,4.5,0)).toArray();
  const eps1=boardSocket('CPU_PWR1'),eps2=boardSocket('CPU_PWR2');
  const gpu=board.gpu.getObjectByName('gpuPower').getWorldPosition(new T.Vector3()).toArray();
  const out=id=>psu.root.localToWorld(V(psu.ports[id])).toArray();
  const a=out('first'), b=out('second'), c=out('eps1'), d=out('eps2'), e=out('gpu');
  const merge=[164,54,-99];
  const layer=new T.Group();layer.name='RM1000x · attached modular harnesses';board.root.add(layer);
  const gpuHarness=new T.Group();gpuHarness.name='GPU auxiliary harness';layer.add(gpuHarness);
  const sleeve=material('#232628',.08,.81);
  const plug = (at,dimensions,axis,topic,parent=layer)=>{
    const p=new T.Group();p.name=topic+' · attached plug';p.userData={topic};
    put(p,box(dimensions,'#222529',.13),[0,0,0]);
    if(axis==='module')p.rotation.z=Math.PI/2;
    return put(parent,p,at);
  };
  const wire = (name,points,radius,parent=layer)=>{
    const line=new T.CatmullRomCurve3(points.map(V));
    const shape=new T.TubeGeometry(line,44,radius,7,false);
    const cable=new T.Mesh(shape,sleeve);
    cable.name=name;
    parent.add(cable);
    return line.getSpacedPoints(26).map(v=>v.toArray());
  };
  const atxStem=wire('ATX 24-pin · main bundle',[merge,[144,32,-81],[132,27,-44],[115,20,-26],move(atx,0,3,0)],4.2);
  const branches=[
    wire('ATX 24-pin · PSU half A',[move(a,-3,0,0),move(a,-13,0,0),merge],3.15),
    wire('ATX 24-pin · PSU half B',[move(b,-3,0,0),move(b,-16,0,0),merge],2.4),
  ];
  const epsPath=(start,end,side)=>{
    const x=end[0], runway=-168-side*8;
    return [move(start,-3,0,0),move(start,-15,0,0),[152+side*13,41,-117],
      [117,28,runway],[x+32,23,runway],[x,20,-148],move(end,0,3,0)];
  };
  const gpuPath=[move(e,-3,0,0),move(e,-17,0,0),[174,83,-10],[146,gpu[1]+37,25],
    [gpu[0],gpu[1]+29,gpu[2]],move(gpu,0,4,0)];
  const curves={
    atx:[...branches[0],...atxStem.slice(1),atx],
    atxBranch:branches[1],
    eps1:[...wire(socketNames.eps1,epsPath(c,eps1,1),2.7),eps1],
    eps2:[...wire(socketNames.eps2,epsPath(d,eps2,0),2.7),eps2],
    gpu:[...wire(socketNames.gpu,gpuPath,3.4,gpuHarness),gpu],
  };
  for(const [point,dim,topic] of [
    [a,[9,8,37],'psuOut'],[b,[9,8,20],'psuOut'],[c,[16,8,10],'psuOut'],[d,[16,8,10],'psuOut'],
  ])plug(move(point,-3.6,0,0),dim,'module',topic);
  plug(move(e,-3.6,0,0),[10,8,21],'module','psuOut',gpuHarness);
  const mainPlug=plug(move(atx,0,4,0),[51.4,8,9.3],'host','atx24');
  mainPlug.rotation.y=Math.PI/2;
  for(const point of [eps1,eps2])plug(move(point,0,3.9,0),[17.5,7.9,9.3],'host','cpuEps');
  plug(move(gpu,0,4,0),[20,8,10.8],'host','gpuSupply',gpuHarness);
  return {layer,gpuHarness,curves,atx,eps1,eps2,gpu};
}

export function installPsu(board,kit) {
  const psu=buildShell(kit);
  put(board.root,psu.root,sideMount);
  const anchors=Object.fromEntries(Object.entries(positions)
    .map(([key,local])=>[key,psu.root.localToWorld(V(local)).toArray()]));
  anchors.atxPsu=psu.root.localToWorld(new T.Vector3(-10,psuProfile.height,0)).toArray();
  board.psu={...psu,anchors,...mountHarness(board,psu,kit)};
  Object.assign(board.anchors,anchors);
  setPsuView(board,{visible:true});
}

export function setPsuView(board,{visible=true,open=false,cables=true,gpu=true}={}) {
  const psu=board.psu;
  psu.root.visible=visible;
  psu.cover.visible=!open;
  psu.interior.visible=open;
  psu.frame.visible=open;
  psu.layer.visible=visible&&cables;
  psu.gpuHarness.visible=gpu;
}

export function psuFrame(board) {
  const {width,height,depth}=psuProfile;
  return {
    box:new T.Box3().setFromCenterAndSize(
      V(move(board.psu.root.position.toArray(),0,height*.39,0)),V([depth+8,height*.76,width+8])),
    pose:[.15,2.48,.63],
  };
}
