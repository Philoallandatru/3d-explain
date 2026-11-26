import * as T from 'three';
import { powerColors } from './power-flow.mjs';
import { psuFrame, setPsuView } from './psu-geometry.mjs';

const pin = new T.SphereGeometry(1, 12, 8);
const pos = (parent, object, xyz) => {
  object.position.set(...xyz);
  parent.add(object);
  return object;
};
const pointAt = (object, lift=0) =>
  object.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,lift,0)).toArray();
const shift = ([x,y,z],dx,dy,dz) => [x+dx,y+dy,z+dz];

function dashPath(points) {
  const path=new T.CurvePath();
  for(let i=1;i<points.length;i++){
    path.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));
  }
  const length=path.getLength(), dashes=[];
  for(let start=0;start<length;start+=7){
    dashes.push([start,Math.min(start+3.5,length)].map(d=>path.getPoint(d/length).toArray()));
  }
  return dashes;
}

export function showVrmCovers(board, visible) {
  for (const cover of board.vrmCovers) cover.visible=visible;
}

export function installPower(board, {route,clearRoutes}) {
  const {root,boardOverlays:layer,gpu,pieces}=board;
  const {atx,eps1,eps2,gpu:cable,curves,anchors:psu}=board.psu;
  const named = name => root.getObjectByName(name);
  const [dimmA,dimmB]=pieces.filter(p=>p.id==='tomahawkram')
    .map(part=>pointAt(part.object.getObjectByName('dimmpmic'),2));
  const inputCap=pointAt(named('EPS input MLCC'),1.4);
  const pwm=pointAt(named('DIGITAL PWM'),2.2);
  const sps=pointAt(named('SPS · Vcore 10'),1.5);
  const choke=pointAt(named('CHOKE · Vcore 10'),2.8);
  const outputCap=pointAt(named('COUT · Vcore 10'),3.15);
  const socket=[3,12,-70],logic=[102,2.7,-9];
  const front=pointAt(named('JFP1'),3.75);
  const m2=[28.3,5.5,9.7],ssd=[-28,5.5,9.7];
  const ddr=[79,19,-60];
  const slot=shift(board.gpuLinkSites['pci-e1'],-36,.2,0);
  const gpuLoad=gpu.localToWorld(new T.Vector3(16,1.6,-36)).toArray();
  const spsGround=shift(sps,7,-1,-8),cpuGround=shift(socket,26,-6,-4);
  const inputNode=[-51,5,-135];
  const outputNode=shift(choke,0,-.8,5.4);
  const atxToLogic=[atx,[105,7,-20],logic];
  const monitor=shift(psu.psuOut,8,-8,1);
  const rail5=shift(psu.psuDcDc,1,3,8), rail33=shift(psu.psuDcDc,0,3,-3);
  const dcdc33Out=[rail33,shift(psu.psuOut,0,-2,-9)];
  const check33=[rail33,shift(monitor,9,-2,-8),monitor];
  const okSignal=[monitor,...curves.atx,...atxToLogic.slice(1)];
  const startBoard=[logic,[84,8,-15],[57,11,-37],socket];
  const tracks={
    ac:['ac',[shift(psu.psuAc,17,0,0),psu.psuAc,psu.psuEmi]],
    standbyPrimary:['standby',[psu.psuEmi,shift(psu.psuStandby,18,0,5),psu.psuStandby]],
    standbySecondary:['standby',[psu.psuStandby,shift(psu.psuStandbyOut,13,2,0),psu.psuStandbyOut]],
    standbyBoard:['standby',[psu.psuStandbyOut,shift(psu.psuOut,6,-15,34),psu.psuOut]],
    bridge:['ac',[psu.psuEmi,psu.psuBridge]],
    pfc:['primary',[psu.psuBridge,shift(psu.psuPfc,0,-15,19),psu.psuPfc]],
    llc:['primary',[psu.psuPfc,shift(psu.psuLlc,19,2,-19),psu.psuLlc]],
    sync:['main',[psu.psuLlc,psu.psuSync]],
    mainOut:['main',[psu.psuSync,shift(psu.psuOut,11,-28,26),psu.psuOut]],
    dcdc:['main',[psu.psuSync,shift(psu.psuDcDc,5,-11,21),psu.psuDcDc]],
    dcdcOut:['main',[rail5,psu.psuOut]],
    dcdc33Out:['main',dcdc33Out],
    dcdc33Low:['fault',dcdc33Out,false],
    atxStandby:['standby',curves.atx],
    atxMain:['main',curves.atx],
    atxBranch:['main',curves.atxBranch,false],
    standby:['standby',atxToLogic],
    switch:['control',[front,[119,6,138],[119,6,23],logic]],
    enable:['control',[...atxToLogic.slice(1).reverse(),...curves.atx.slice().reverse()]],
    check12:['main',[psu.psuSync,shift(monitor,11,-4,22),monitor]],
    check5:['main',[rail5,shift(monitor,11,-1,7),monitor]],
    check33:['main',check33],
    check33Low:['fault',check33,false],
    okSignal:['ready',okSignal],
    startBoard:['control',startBoard],
    eps1:['main',curves.eps1],
    eps2:['main',curves.eps2],
    eps2Input:['main',[eps2,inputNode]],
    input:['main',[eps1,[-73,5,-135],inputNode,shift(sps,0,.8,-7),sps]],
    inputCap:['main',[[-73,5,-135],inputCap],false],
    high:['core',[sps,choke]],
    low:['core',[spsGround,sps,choke]],
    output:['core',[choke,outputNode,[-19,7,-88],socket]],
    outputCap:['core',[outputNode,shift(outputCap,-3,0,0),outputCap],false],
    capReturn:['ready',[outputCap,shift(outputCap,3,-2,0),[34,5,-102]],false],
    return:['ready',[socket,cpuGround,[34,5,-102],[34,5,-136],spsGround]],
    drive:['control',[pwm,[-43,5,-105],[-43,4,-126],sps]],
    feedback:['control',[socket,[-24,8,-77],pwm]],
    dimmFeed:['dimm',[atx,[101,8,-44],[95,8,-58],ddr]],
    dimmA:['dimm',[ddr,[70.6,8,-60],dimmA]],
    dimmB:['dimm',[ddr,[88.2,8,-60],dimmB]],
    m2:['m2',[atx,[102,5,-19],[96,5,8],[46,5,9.7],m2,ssd]],
    gpuSlot:['main',[atx,[100,6,8],[91,7,30],slot]],
    gpuCable:['auxiliary',curves.gpu],
    gpuInput:['auxiliary',[cable,gpuLoad]],
  };
  const tags=[
    ['atxPsu','RM1000x',psu.atxPsu,[0,-10]],
    ['psuAc','IEC C14',psu.psuAc,[28,8]],
    ['psuEmi','EMI 滤波',psu.psuEmi,[-2,15]],
    ['psuBridge','整流桥',psu.psuBridge,[23,0]],
    ['psuPfc','主动 PFC',psu.psuPfc,[16,-8]],
    ['psuLlc','半桥 LLC',psu.psuLlc,[0,-13]],
    ['psuSync','主 12 V',psu.psuSync,[-10,-13]],
    ['psuStandby','待机反激',psu.psuStandby,[8,-10]],
    ['psuStandbyOut','5VSB 滤波',psu.psuStandbyOut,[-10,8]],
    ['psuDcDc','5 V / 3.3 V DC/DC',psu.psuDcDc,[-2,-10]],
    ['psuOut','模块面板',psu.psuOut,[-17,8]],
    ['atx24','ATX_PWR1',atx,[-1,-12]],
    ['standbyLogic','板上待机逻辑',logic,[-10,18]],
    ['frontPanel','JFP1 · PWR_SW',front,[-30,-12]],
    ['cpuEps','CPU_PWR1 / 2',eps2,[-15,-14]],
    ['vrmPwm','数字 PWM',pwm,[-20,4]],
    ['vrmSps','SPS',sps,[0,-9]],
    ['vrmChoke','电感',choke,[35,-3]],
    ['vrmCap','输出电容',outputCap,[56,9]],
    ['socket','AM5 · Vcore',socket,[0,5]],
    ['dimmSupply','DDR5 PMIC',dimmB,[-15,-8]],
    ['m2Supply','990 PRO · 3.3 V',ssd,[0,-8]],
    ['pcieSlots','PCI_E1 供电',slot,[8,14]],
    ['gpuSupply','RTX 5090 · 12V-2x6',cable,[0,-14]],
  ];
  board.annotations=tags.map(([key,title,xyz,offset])=>({key,title,p:new T.Vector3(...xyz),offset}));
  Object.assign(board.anchors,Object.fromEntries(tags.map(([key,,xyz])=>[key,xyz])));
  const visibleTags={
    'ac-in':['psuAc'], 'standby-convert':['psuEmi','psuStandby'], pfc:['psuBridge','psuEmi'],
    llc:['psuPfc'], 'sync-12':['psuLlc','psuOut'], 'main-rails':['psuSync','psuOut'],
    standby:['atxPsu','atx24','psuOut'], 'ps-on':['frontPanel','standbyLogic','atx24','atxPsu'],
    'power-ok':['psuDcDc','atx24'], 'boot-handoff':['standbyLogic'],
    eps:['atxPsu','psuOut'], 'buck-on':['vrmChoke','vrmCap','socket'],
    'buck-off':['vrmSps','vrmCap','socket'], regulate:['vrmPwm','vrmChoke','vrmCap'],
    ddr5:['atx24'], m2:['atx24'], gpu:['atxPsu','pcieSlots','atx24'], shutdown:['atxPsu','atx24'],
  };
  board.power = {
    tracks,layer,route,clearRoutes,visibleTags,monitor,logic,lowSignal:dashPath(okSignal),
    gateFrame:{box:new T.Box3().setFromPoints([...okSignal,rail33,psu.psuSync].map(p=>new T.Vector3(...p)))
      .expandByVector(new T.Vector3(22,6,18)),pose:[.18,2.7,.55]},
    startFrame:{box:new T.Box3().setFromPoints(startBoard.map(p=>new T.Vector3(...p)))
      .expandByVector(new T.Vector3(21,10,22)),pose:[.15,2.5,.65]},
  };
}

export function showPowerStep(board, entry, {covers='auto', psuCover='auto', evidence=false}={}) {
  const {tracks,layer,route,clearRoutes,visibleTags,monitor,logic,lowSignal}=board.power;
  const blocked=entry.gate==='blocked';
  showVrmCovers(board,covers==='closed'||(covers==='auto'&&!entry.expose));
  board.gpu.visible=entry.focus!=='vrm';
  setPsuView(board,{
    open:psuCover==='open'||(psuCover==='auto'&&entry.openPsu),
    cables:entry.focus!=='vrm',
  });
  clearRoutes(layer);
  layer.name='ATX power replay · '+entry.id;
  layer.userData={step:entry.id,landing:entry.landing,geometry:'functional paths',
    ...(entry.gate?{powerGood:blocked?'low':'high'}:{})};
  if(!evidence){
    for(const key of entry.tracks){
      const [kind,points,arrow=true]=tracks[key];
      const line=route(layer,points,entry.focus==='vrm'?.54:.76,powerColors[kind],
        {arrow,bright:true,alpha:.96,depth:false});
      line.name='Power path · '+key;
      line.userData={topic:entry.landing,rail:kind};
    }
    if(blocked){
      for(const dash of lowSignal)route(layer,dash,.74,powerColors.inactive,{depth:false});
      for(const anchor of [monitor,logic]){
        for(const sign of [-1,1]){
          route(layer,[shift(anchor,-3,1,-3*sign),shift(anchor,3,1,3*sign)],.94,entry.color,{depth:false});
        }
      }
    }else{
      const ink=new T.MeshBasicMaterial({color:entry.color,depthTest:false,depthWrite:false,toneMapped:false});
      const marker=new T.Mesh(pin,ink);
      marker.name='Power landing · '+entry.landing;
      marker.renderOrder=12;
      marker.scale.setScalar(entry.focus==='vrm'?1.6:2.3);
      pos(layer,marker,board.anchors[entry.landing]);
      if(entry.gate){
        const check=new T.Mesh(pin,ink);
        check.scale.setScalar(2.3);
        pos(layer,check,monitor);
      }
    }
  }
  const captions=entry.gate?{
    psuDcDc:entry.railFault?'3.3 V 欠压':'3.3 V 就绪',
    atx24:blocked?'#8 · PWR_OK 低':'#8 · PWR_OK 高',
    standbyLogic:blocked?'主板等待就绪':'主板可继续上电',
  }:entry.id==='boot-handoff'?{
    standbyLogic:'主板电源时序',socket:'AM5 · 进入初始化',
  }:entry.railFault?{psuDcDc:'3.3 V 欠压'}:{};
  for(const tag of board.annotations){
    tag.endpoint=tag.key===entry.landing;
    tag.show=tag.endpoint||visibleTags[entry.id].includes(tag.key);
    tag.caption=captions[tag.key];
    tag.tone=tag.caption?(entry.gate&&tag.key==='psuDcDc'&&!blocked?powerColors.main:entry.color):null;
    tag.priority=tag.endpoint?2:tag.caption?1:0;
  }
}

const vrmFrame = {
  box:new T.Box3(new T.Vector3(-92,0,-152),new T.Vector3(47,16,-42)),
  pose:[-.17,2.4,.45],
};
export function powerFrame(focus,board) {
  if(focus==='psu')return psuFrame(board);
  if(focus==='gate')return board.power.gateFrame;
  if(focus==='start')return board.power.startFrame;
  return focus==='vrm'?vrmFrame:null;
}
