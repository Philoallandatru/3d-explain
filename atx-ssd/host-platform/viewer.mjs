import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeScene, updateBoard, updateExplode, highlight, showGpuLinkStep } from './geometry.mjs';
import { topics, sources, modes, mainViews, hostSteps, hostSnapshot, hostExample, dramSteps, dramTiming, lanePins, memoryProfile } from './model.mjs';
import { hostWriteTarget, signalKinds, systemSteps } from './system-flow.mjs';
import { showSystemStep, systemFrame } from './system-scene.mjs';
import { inferenceBounds, inferenceCase, inferenceModes, inferenceStepColor, inferenceSteps, inferenceTopicLabels, inferenceTracks } from './inference-flow.mjs';
import { animateInference, inferenceFrame, showInferenceStep } from './inference-scene.mjs';
import { defaultLayerComputeMs, layerComputeOptions, planInferenceWindow } from './inference-timing.mjs';
import { gpuProfile, gpuTopicLabels, cardLinkGBs, hostLinkGBs, vramGBs, gpuTransferBounds, gpuLinkColors, gpuLinkSteps } from './gpu-profile.mjs';
import { buckExample, buckVoltages, powerColors, powerFlow, powerGoodIndex, powerLabels, powerSignals, powerSteps, psuProfile } from './power-flow.mjs';
import { startupSnapshot, startupTiming } from './power-timing.mjs';
import { powerFrame, showPowerStep } from './power-scene.mjs';
import { componentReasons, reasonFor } from './why-flow.mjs';
import anatomyLicense from './vendor/pc-anatomy/LICENSE.txt';

const $=id=>document.getElementById(id);
const node=(name,text)=>{const e=document.createElement(name);if(text!==undefined)e.textContent=text;return e;};
const canvas=$('model'), stage=$('stage');
const cache=new Map();
const state={view:'board',mode:'assembly',index:0,lane:0,direction:'both',spreader:false,evidence:false,explode:0,
  dramExplode:.62,cpuExplode:0,cpuCap:false,labels:true,dramOp:'read',bit:1,irq:'irq',selection:null,
  ioOp:'read',follow:true,showGpu:true,gpuDirection:'h2d',gpuPayloadMiB:1024,inferenceMode:'offload',
  inferenceSource:'ssd',inferenceComputeMs:defaultLayerComputeMs,vrmOpen:false,powerCovers:'auto',buckVout:1.10,
  showPsu:false,psuCover:'auto',powerCondition:'stable',powerMs:0};
const modeTitle=(view,mode)=>modes[view].find(([id])=>id===mode)?.[1]||mode;
const labels={
  ...gpuTopicLabels,
  ...inferenceTopicLabels,
  ...powerLabels,
  board:'整板',socket:'AM5 插座',ram:'A2 / B2',m2_1:'M2_1',m2_2:'M2_2',m2_3:'M2_3',chipset:'B650',pcieSlots:'PCIe 插槽',
  power:'供电',rear:'后置 I/O',storage:'990 PRO',package:'封装',ccd:'CCD / 核心',cache:'缓存',fabric:'互连',iod:'IOD',
  root:'根端口',iommu:'IOMMU',umc:'UMC',front:'前端',execute:'执行',mmu:'MMU',
  module:'UDIMM',chips:'×8 器件',pmic:'PMIC',spd:'SPD',bga:'FBGA',banks:'裸片',bank:'Bank',cell:'1T1C',
  app:'应用 / 块层',driver:'驱动',sq:'SQ',buffer:'数据页',cq:'CQ',irq:'中断',bar:'门铃',ctrl:'SSD',
  integrated:'整机',nand:'NAND A',
};
const available={
  'board/assembly':['board','socket','ram','m2_1','m2_2','m2_3','chipset','pcieSlots','power','atx24','cpuVrm',
    'frontPanel','debugLed','boardHeaders','rear','storage','gpuCard','atxPsu'],
  'board/io':['integrated','socket','ram','root','m2_1','ctrl','nand','sq','buffer','cq'],
  'board/inference':['inferenceCase','inferenceDisk','inferenceHost','inferenceVram','inferenceCore'],
  'board/pcie':['m2_1','m2_2','m2_3','chipset','pcieSlots','storage'],
  'board/gpu-link':['gpuLinkSlot','ram','socket','root','gpuCard','gddr'],
  'board/ddr':['ram','socket'],
  'board/power':['power','atxPsu','psuEmi','psuStandby','psuPfc','psuLlc','psuSync','psuDcDc','psuOut',
    'atx24','cpuEps','frontPanel','cpuVrm','vrmPwm','vrmSps','vrmChoke','vrmCap','dimmSupply','m2Supply','gpuSupply'],
  'cpu/package':['package','ccd','cache','fabric','iod'],
  'cpu/io':['iod','root','iommu','fabric','umc'],
  'cpu/core':['front','execute','mmu','cache','fabric'],
  'dram/module':['module','chips','pmic','spd'],
  'dram/bga':['bga','banks'],
  'dram/die':['banks','umc','bank'],
  'dram/bank':['bank','banks','cell'],
  'dram/cell':['cell','bank'],
  'gpu/card':['gpuCard','gpuCooling','gpuPower','gpuOutput','gpuPcie'],
  'gpu/pcb':['gpuMain','gpuDie','gddr','gpuPcie','gpuOutput','gpuPower'],
  'gpu/die':['gpuDie','gpuGpc','gpuL2','gpuMc','gpuHost'],
  'gpu/sm':['gpuSm','gpuCuda','gpuTensor','gpuShared','gpuScheduler'],
  'host':['app','driver','root','iommu','bar','sq','buffer','cq','irq','ctrl'],
};
const panelDefaults={'board/io':'integrated','board/pcie':'m2_1','board/ddr':'ram','board/power':'power',
  'board/gpu-link':'gpuLinkSlot','board/inference':'inferenceCase'};
const currentKey=()=>state.view==='host'?'host':state.view+'/'+state.mode;
const systemActive=()=>currentKey()==='board/io';
const inferenceActive=()=>currentKey()==='board/inference';
const gpuLinkActive=()=>currentKey()==='board/gpu-link';
const powerActive=()=>currentKey()==='board/power';
const powerLimited=()=>powerActive()&&state.powerCondition==='undervoltage';
const powerHints=[['','交流 / 初级',powerColors.primary],['','5VSB',powerColors.standby],['','控制',powerColors.control],
  ['','主轨',powerColors.main],['','Vcore',powerColors.core],['','DDR5',powerColors.dimm],
  ['','M.2',powerColors.m2],['','GPU 辅助',powerColors.auxiliary]];
const drillTargets={
  'read-ssd':{mode:'io',step:'doorbell',branch:'#board/io/read/',title:'SSD 读权重 · 4 KiB 读示例',action:'下钻到一笔 4 KiB 读'},
  'load-vram':{mode:'gpu-link',step:'ddr5',branch:'#board/gpu-link/h2d/',title:'装入 GDDR7 · 1 GiB 权重拷贝',action:'单步查看从 DDR5 到 GDDR7 的拷贝'},
};
const hostFields={
  link:'链路',bar:'BAR0',ready:'控制器状态',admin:'Admin 队列',queue:'I/O 队列',
  sqHead:'SQ Head',sqTail:'SQ Tail',cqHead:'CQ Head',phase:'期待 Phase',
  sqEntry:'SQ 槽位',cqEntry:'CQ 槽位',data:'数据状态',mapping:'DMA 映射',notice:'完成通知',
};
let active, renderer, camera, controls, scene, stageWidth, stageHeight, frameId;
let loadSerial=0, playTimer, wasTop=false, pressStart, exporting=false, cameraMove;
let inferenceDrill=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');

function button(text,onClick,pressed) {
  const b=node('button',text);
  b.type='button';
  if(pressed!==undefined)b.setAttribute('aria-pressed',String(pressed));
  b.addEventListener('click',onClick);
  return b;
}
function replaceChoices(row,buttons,scroller=row) {
  const focused=document.activeElement;
  const focusedIndex=[...row.children].indexOf(focused);
  const focusedLabel=focusedIndex>=0?focused.getAttribute('aria-label'):null;
  row.replaceChildren(...buttons);
  const current=row.querySelector('[aria-pressed=true],[aria-current=step]');
  const replacement=row.children[focusedIndex];
  const visible=focusedLabel&&replacement?.getAttribute('aria-label')===focusedLabel?replacement:current;
  if(focusedIndex>=0)(visible??replacement)?.focus({preventScroll:true});
  if(!visible)return;
  const group=scroller.getBoundingClientRect(), item=visible.getBoundingClientRect();
  const left=item.left-group.left-4, right=item.right-group.right+4;
  if(left>=0 && right<=0)return;
  if(scroller===row)scroller.scrollLeft+=left<0?left:right;
  else scroller.scrollLeft+=(left+right)/2;
}
function refs(ids) {
  const row=node('div'); row.className='sources';
  for (const id of [...new Set(ids)].slice(0,4)) {
    const [title,url]=sources[id];
    const link=node('a',title); link.href=url;
    if(url.startsWith('http')){link.target='_blank';link.rel='noopener noreferrer';}
    row.append(link);
  }
  return row;
}
function facts(rows) {
  const dl=node('dl'); dl.className='facts';
  for(const [name,value] of rows)dl.append(node('dt',name),node('dd',value));
  return dl;
}
function selectBox(name,values,value,onChange) {
  const group=node('div'); group.className='choice';
  const select=node('select'); select.setAttribute('aria-label',name);
  for(const [id,text] of values){const option=node('option',text);option.value=id;select.append(option);}
  select.value=String(value);
  select.addEventListener('change',()=>onChange(select.value));
  group.append(node('span',name),select);
  return group;
}
function checkBox(name,value,onChange) {
  const group=node('label'), input=node('input');
  input.type='checkbox';input.checked=value;
  input.addEventListener('change',()=>onChange(input.checked));
  group.append(input,name);
  return group;
}
function range(name,value,onInput) {
  const group=node('label'),input=node('input');
  input.type='range';input.min=0;input.max=100;input.value=Math.round(value*100);
  input.addEventListener('input',()=>onInput(Number(input.value)/100));
  group.append(name,input);
  return group;
}
function updateSetting(prop,value) {
  state[prop]=value;
  switch(prop){
    case 'showGpu':
    case 'showPsu':
      if(!value && state.selection===(prop==='showGpu'?'gpuCard':'atxPsu'))state.selection=null;
      renderInspector();renderStatic();syncScene();fit(wasTop);
      break;
    case 'gpuPayloadMiB':
      renderStatic();renderFlow();
      break;
    case 'gpuDirection':
      stopPlay();state.index=0;renderStatic();renderFlow();
      break;
    case 'ioOp':
      stopPlay();state.index=0;state.selection=null;renderInspector();renderFlow();
      break;
    case 'inferenceMode':
      stopPlay();renderInferenceComparison();renderInferenceClock();renderFlow();
      break;
    case 'inferenceSource':
      stopPlay();renderInferenceClock();renderFlow();
      break;
    case 'inferenceComputeMs':
      renderInferenceClock();
      break;
    case 'follow':
      if(value && (active?.system||active?.inference||active?.power)){active.lastFocus=null;syncScene();}
      else cameraMove=null;
      if(inferenceDrill)writeAddress();
      break;
    case 'vrmOpen':
    case 'powerCovers':
    case 'psuCover':
      syncScene();
      break;
    case 'lane':
      if(systemActive())renderFlow();
      else {renderStatic();syncScene();}
      break;
    case 'dramOp':
    case 'bit':
    case 'irq':
      stopPlay();if(!systemActive())state.index=0;
      renderFlow();
      break;
    case 'cpuExplode':
    case 'cpuCap':
    case 'dramExplode':
      syncScene();fit(wasTop);
      break;
    default: renderStatic();syncScene();
  }
}
function readAddress() {
  const [view,mode,index,step,time]=location.hash.slice(1).split('/');
  if(!mainViews[view])return {view:'board',mode:'assembly',index:0};
  if(view==='board'&&mode==='inference'){
    const residency=index==='resident'?'resident':'offload';
    const current=inferenceSteps(residency).findIndex(entry=>entry.id===step);
    return {view,mode,residency,index:Math.max(0,current)};
  }
  if(view==='board'&&mode==='io'){
    const operation=index==='write'?'write':'read';
    const completion=step==='poll'||step==='irq'?step:state.irq;
    const current=systemSteps(operation,completion).findIndex(entry=>entry.id===step);
    return {view,mode,operation,completion,index:Math.max(0,current)};
  }
  if(view==='board'&&mode==='gpu-link'){
    const direction=index==='d2h'||index==='h2d'?index:state.gpuDirection;
    const current=gpuFlow(direction).findIndex(entry=>entry.id===step);
    return {view,mode,direction,index:Math.max(0,current)};
  }
  if(view==='board'&&mode==='power'){
    const condition=['delayed','undervoltage'].includes(step)?step:'stable';
    const flow=powerFlow(condition);
    const current=Math.max(0,flow.findIndex(entry=>entry.id===index));
    if(flow[current].startupMs!==undefined&&/^\d+$/.test(time??'')){
      const sample=startupSnapshot(Number(time));
      return {view,mode,condition,index:flow.findIndex(entry=>entry.id===sample.phase.id),powerMs:sample.ms};
    }
    return {view,mode,condition,index:current};
  }
  const match=modes[view].some(([id])=>id===mode);
  return {view,mode:match?mode:(view==='host'?'read':modes[view][0][0]),index:Math.max(0,(Number.parseInt(index,10)||1)-1)};
}
function writeAddress() {
  const flow=steps();
  const powerSuffix=state.powerCondition==='stable'?'':'/'+state.powerCondition+
    (flow[state.index]?.startupMs===undefined?'':'/'+state.powerMs);
  const suffix=systemActive()?'/'+state.ioOp+'/'+(flow[state.index]?.id||flow[0].id):
    inferenceActive()?'/'+state.inferenceMode+'/'+(flow[state.index]?.id||flow[0].id):
    gpuLinkActive()?'/'+state.gpuDirection+'/'+(flow[state.index]?.id||flow[0].id):
    powerActive()?'/'+flow[state.index].id+powerSuffix:
    flow.length?'/'+(state.index+1):'';
  const bookmark=inferenceDrill?{inferenceDrill,trace:tracePreferences()}:null;
  const path=state.view+'/'+state.mode+suffix;
  history.replaceState(bookmark,'','#'+path);
  if(document.documentElement.dataset.siteView)
    window.dispatchEvent(new CustomEvent('nvmespec:route',{detail:path}));
}
function viewControls() {
  replaceChoices($('views'),Object.entries(mainViews).map(([view,[name]])=>{
    const tab=button(name,()=>changeView(view,view==='host'?'read':modes[view][0][0]),state.view===view);
    const symbol=node('span');
    symbol.className='nav-symbol';symbol.setAttribute('aria-hidden','true');
    tab.dataset.section=view;tab.prepend(symbol);return tab;
  }));
  replaceChoices($('modes'),modes[state.view].map(([mode,name])=>
    button(name,()=>inferenceDrill&&mode==='inference'?returnToInference():changeView(state.view,mode),state.mode===mode)));
  const opts=$('options');
  opts.replaceChildren();
  if(state.view==='board'){
    if(state.mode==='assembly') {
      opts.append(range('装配展开',state.explode,v=>updateSetting('explode',v)),
        checkBox('显示 RTX 5090 FE',state.showGpu,v=>updateSetting('showGpu',v)),
        checkBox('显示电源与线束',state.showPsu,v=>updateSetting('showPsu',v)),
        checkBox('M2_1 散热片',state.spreader,v=>updateSetting('spreader',v)),
        checkBox('拆下 VRM 散热片',state.vrmOpen,v=>updateSetting('vrmOpen',v)),
        button('翻面',()=>fit('rear')));
    } else if(systemActive()){
      if(!inferenceDrill)opts.append(selectBox('操作',[['read','读 4 KiB'],['write','写 4 KiB']],state.ioOp,v=>updateSetting('ioOp',v)));
      opts.append(selectBox('观察 Lane',[[0,'0'],[1,'1'],[2,'2'],[3,'3']],state.lane,v=>updateSetting('lane',Number(v))),
        selectBox('完成方式',[['irq','MSI-X'],['poll','轮询']],state.irq,v=>updateSetting('irq',v)),
        checkBox('跟随镜头',state.follow,v=>updateSetting('follow',v)));
    } else if(inferenceActive()){
      opts.append(selectBox('权重策略',inferenceModes,state.inferenceMode,v=>updateSetting('inferenceMode',v)),
        checkBox('跟随镜头',state.follow,v=>updateSetting('follow',v)));
    } else if(gpuLinkActive()){
      if(!inferenceDrill)opts.append(selectBox('GPU 数据方向',[['h2d','主机 → GPU'],['d2h','GPU → 主机']],state.gpuDirection,v=>updateSetting('gpuDirection',v)),
        selectBox('拷贝量',[[256,'256 MiB'],[1024,'1 GiB'],[4096,'4 GiB']],state.gpuPayloadMiB,v=>updateSetting('gpuPayloadMiB',Number(v))),
        button('显卡 PCB 剖视',()=>changeView('gpu','pcb')));
    } else if(powerActive()){
      opts.append(selectBox('PSU 外壳',[['auto','随回放拆装'],['open','剖开'],['closed','合上']],
        state.psuCover,v=>updateSetting('psuCover',v)),
        selectBox('VRM 散热片',[['auto','随回放拆装'],['open','拆下'],['closed','装上']],
        state.powerCovers,v=>updateSetting('powerCovers',v)),
        checkBox('跟随镜头',state.follow,v=>updateSetting('follow',v)),
        checkBox('隐藏供电高亮',state.evidence,v=>updateSetting('evidence',v)),
        button('装配外观',()=>{
          state.showPsu=true;state.showGpu=true;changeView('board','assembly');
        }));
    } else {
      if(state.mode==='pcie'){
        opts.append(selectBox('Lane',[[0,'0'],[1,'1'],[2,'2'],[3,'3']],state.lane,v=>updateSetting('lane',Number(v))),
          selectBox('方向',[['both','双向'],['tx','主机 → SSD'],['rx','SSD → 主机']],state.direction,v=>updateSetting('direction',v)));
      }
      opts.append(checkBox('隐藏推演走线',state.evidence,v=>updateSetting('evidence',v)));
    }
  }
  if(state.view==='cpu' && state.mode==='package') opts.append(
    range('芯粒展开',state.cpuExplode,v=>updateSetting('cpuExplode',v)),
    checkBox('显示顶盖',state.cpuCap,v=>updateSetting('cpuCap',v)));
  if(state.view==='dram' && state.mode==='bga')opts.append(range('封装展开',state.dramExplode,v=>updateSetting('dramExplode',v)));
  if(state.view==='dram' && ['bank','cell'].includes(state.mode))opts.append(
    selectBox('DRAM 操作',[['read','读'],['write','写入反值'],['refresh','刷新']],state.dramOp,v=>updateSetting('dramOp',v)),
    selectBox('初始位',[[1,'1'],[0,'0']],state.bit,v=>updateSetting('bit',Number(v))));
  if(state.view==='gpu')opts.append(
    button('在主板定位',()=>{state.showGpu=true;changeView('board','assembly',0,'gpuCard');}),
    button('显卡数据路径',()=>changeView('board','gpu-link')),
    button('推理回放',()=>changeView('board','inference')));
  if(state.view==='host')opts.append(
    selectBox('完成方式',[['irq','MSI-X'],['poll','轮询']],state.irq,v=>updateSetting('irq',v)),
    button('在整机追踪',()=>{
      state.ioOp=state.mode==='write'?'write':'read';
      const id=hostSteps(state.mode,state.irq)[state.index]?.id;
      const index=systemSteps(state.ioOp,state.irq).findIndex(step=>step.id===id);
      changeView('board','io',Math.max(0,index));
    }),
    button('在主板定位 M2_1',()=>changeView('board','pcie',0,'m2_1')));
  opts.hidden=!opts.childElementCount;
  const heading=modeTitle(state.view,state.mode);
  $('section-name').textContent=mainViews[state.view][0]+' / '+heading;
  $('section-title').textContent=inferenceActive()?inferenceCase.title:powerActive()?'ATX 供电':mainViews[state.view][1];
  $('reset').textContent=powerActive()?'整机全景':
    systemActive()||inferenceActive()||gpuLinkActive()?'整板全景':'复位镜头';
  $('scale-guide').hidden=true;
  const stageName=$('stage-name');
  if(currentKey()==='board/assembly')stageName.replaceChildren(node('strong',heading));
  else stageName.replaceChildren(node('strong',mainViews[state.view][1]),node('span',heading));
  const hints = systemActive()
    ? [['wire','命令 / 动作',signalKinds.command.color],['payload','4 KiB 数据',signalKinds.data.color],
      ['spec','CQE',signalKinds.completion.color],['notice','完成通知',signalKinds.notice.color]]
    : inferenceActive()
    ? Object.values(inferenceTracks).map(({title,color})=>['',title,color])
    : gpuLinkActive()
    ? [['','DDR5 / CPU 根端口',gpuLinkColors.host],['','PCI_E1',gpuLinkColors.pcie],['','卡上拷贝',gpuLinkColors.local],['','显卡外廓','#83959e']]
    : powerActive() ? powerHints
    : state.view==='gpu'
    ? state.mode==='card' ? [['','FE 标称尺寸'],['spec','开源风扇几何']] :
      [['','可选部件'],['wire',state.mode==='pcb'?'板形与布局示意':'片上功能布局示意']]
    : state.view==='board'
    ? [['','开源几何 · MSI 图纸校位'],['spec','M-key 针位'],['wire','走线原理示意']]
    : state.view==='host'
      ? [['','当前事务'],['wire','主机逻辑地址与演示状态']]
      : [['','开源几何改编'],['wire','内部功能与相对尺寸示意']];
  renderHints(hints);
}
function renderHints(hints) {
  $('hint').replaceChildren(...hints.map(([cls,text,color])=>{
    const chip=node('span'),dot=node('span');
    dot.className='dot '+cls;
    if(color)dot.style.backgroundColor=color;
    chip.append(dot,text);return chip;
  }));
}
function selectedTopic() {
  return state.selection||(powerActive()?steps()[state.index]?.landing:undefined)||
    panelDefaults[currentKey()]||active?.topic||available[currentKey()][0];
}
function selectTopic(id) {
  if(!topics[id])return;
  state.selection=id;renderInspector();syncScene();
}
function renderInspector() {
  const key=selectedTopic(), topic=topics[key];
  const inspector=$('inspector');
  inspector.replaceChildren();
  if(topic.title!==$('section-title').textContent)inspector.append(node('h3',topic.title));
  inspector.append(node('p',topic.text));
  if(!steps().length&&componentReasons[key])inspector.append(reasonPanel(componentReasons[key]));
  inspector.append(refs(topic.refs));
  if(key!=='board' && key!=='package'){
    const focus=button('镜头聚焦',()=>focusTopic(key));focus.className='jump';
    inspector.append(focus);
  }
  if(topic.jump && (topic.jump[0]!==state.view || topic.jump[1]!==state.mode)){
    const [view,mode]=topic.jump;
    const stepId={atxPsu:'ac-in',atx24:'standby',frontPanel:'ps-on',cpuEps:'eps',cpuVrm:'buck-on',vrmSps:'buck-on',
      vrmChoke:'buck-off',vrmCap:'regulate',vrmPwm:'regulate'}[key];
    const index=mode==='power'?Math.max(0,powerFlow(state.powerCondition).findIndex(entry=>entry.id===stepId)):0;
    const jump=button('打开 '+modeTitle(view,mode),()=>changeView(view,mode,index));
    jump.className='jump';inspector.append(jump);
  }
  const listed=available[currentKey()];
  const options=(powerActive()&&!listed.includes(key)?[key,...listed]:listed)
    .filter(id=>currentKey()!=='board/assembly'||(
      (id!=='gpuCard'||state.showGpu)&&(id!=='atxPsu'||state.showPsu)));
  $('topics').replaceChildren(...options.map(id=>button(labels[id],()=>selectTopic(id),id===key)));
}

function renderInferenceComparison() {
  const panel=$('inference-comparison');
  panel.hidden=!inferenceActive();
  if(panel.hidden)return;
  panel.dataset.placement=state.inferenceMode;
  const columns=node('thead'), body=node('tbody'), table=node('table');
  const heading=node('tr');
  for(const title of ['去噪时','显存常驻','CPU offload']){
    const header=node('th',title);header.scope='col';heading.append(header);
  }
  columns.append(heading);
  const rows=[
    ['权重在哪里','GDDR7','页锁 DDR5，未命中时回到检查点'],
    ['每步怎样取用','GPU 就地读入片上层级','DDR5 经 PCIe 预取到 GDDR7'],
    ['哪段可能等','GPU 算子和显存访问','预取赶不上时，GPU 等搬运。SSD 影响补读'],
  ];
  for(const [label,resident,offload] of rows){
    const row=node('tr'), header=node('th',label);
    header.scope='row';
    row.append(header,node('td',resident),node('td',offload));body.append(row);
  }
  table.append(node('caption','同类 DiT 权重块的两条路径'),columns,body);
  panel.replaceChildren(table);
}

const clockNumbers=new Intl.NumberFormat('zh-CN',{maximumFractionDigits:2});
const clockTime=ms=>clockNumbers.format(ms)+' ms';

function initInferenceClock() {
  const compute=$('clock-compute');
  for(const ms of layerComputeOptions){
    const option=node('option',clockTime(ms));option.value=String(ms);compute.append(option);
  }
  compute.onchange=()=>updateSetting('inferenceComputeMs',Number(compute.value));
  $('clock-source').onchange=event=>updateSetting('inferenceSource',event.target.value);
  $('clock-jump').onclick=()=>{
    const index=steps().findIndex(entry=>entry.id==='dit-overlap');
    if(index<0)return;
    moveTo(index);
    stage.scrollIntoView({block:'nearest'});
  };
  $('clock-assumptions').textContent='990 PRO '+inferenceBounds.ssdRate+' · PCIe 4.0 ×16 '+inferenceBounds.h2dRate+
    '。当前层开始时启动预取。SSD 补读先读完整块，再做 H→D。';
  const [title,url]=sources.h3Case;
  const report=$('clock-report');report.href=url;report.textContent=title;
  const metrics=[
    ['DiT 去噪 / 步',inferenceCase.denoiseStepSeconds+' s'],
    ['DiT 读盘 / 请求',inferenceCase.ditDiskGiB+' GiB'],
    ['累计等搬运 / 请求',inferenceCase.courierWaitSeconds+' s'],
  ];
  for(const [label,value] of metrics){
    const metric=node('div');metric.append(node('dt',label),node('dd',value));$('clock-metrics').append(metric);
  }
}

function renderInferenceClock() {
  const panel=$('inference-clock');
  panel.hidden=!inferenceActive();
  if(panel.hidden)return;
  const resident=state.inferenceMode==='resident';
  const source=$('clock-source');
  source.disabled=resident;
  source.value=resident?'resident':state.inferenceSource;
  $('clock-compute').value=String(state.inferenceComputeMs);
  const plan=planInferenceWindow(state.inferenceMode,state.inferenceSource,state.inferenceComputeMs);
  $('clock-wait').dataset.stalled=String(plan.waitMs>0);
  $('clock-wait-value').textContent=clockTime(plan.waitMs);
  const percentage=ms=>(100*ms/plan.axisEnd)+'%';

  const grid=$('clock-grid'), scaleRow=node('div'), scale=node('div'), unit=node('div','ms');
  scaleRow.className='clock-row';scale.className='clock-scale';unit.className='clock-unit';
  grid.style.setProperty('--tick-width',percentage(plan.ticks[1]));
  grid.style.setProperty('--finish',percentage(plan.computeMs));
  for(const time of plan.ticks){
    const tick=node('span',String(time));tick.className='clock-tick';tick.style.left=percentage(time);scale.append(tick);
  }
  scaleRow.append(unit,scale);
  const rows=[
    {id:'ssd',title:'SSD 读盘',color:inferenceTracks.nvme.color,...plan.ssd},
    {id:'h2d',title:'PCIe 拷贝',color:inferenceTracks.h2d.color,...plan.h2d},
    {id:'gpu',title:'GPU 计算',color:inferenceTracks.compute.color,segments:plan.gpu},
  ];
  const rendered=rows.map(({id,title,color,segments,coveredMs,uncoveredMs})=>{
    const row=node('div'), label=node('div'), plot=node('div');
    row.className='clock-row';row.dataset.track=id;row.style.setProperty('--track',color);
    row.setAttribute('role','group');row.setAttribute('aria-label',title);
    label.className='clock-label';plot.className='clock-plot';
    label.append(node('strong',title));
    if(id==='gpu')label.append(node('small',clockTime(plan.computeMs)+' / 层'));
    else if(segments.length){
      label.append(node('small','覆盖 '+clockTime(coveredMs)));
      if(uncoveredMs>0){
        const blocked=node('small','阻塞 '+clockTime(uncoveredMs));
        blocked.className='clock-uncovered';label.append(blocked);
      }
    }else label.append(node('small','本窗口 0 ms'));
    for(const {start,end,kind,label:partLabel} of segments){
      const part=node('span',kind==='compute'&&(end-start)/plan.axisEnd>=.16?partLabel:undefined);
      part.className='clock-part '+kind;
      part.style.setProperty('--start',percentage(start));
      part.style.setProperty('--span',percentage(end-start));
      const description=partLabel||(kind==='covered'?'计算覆盖':'阻塞下一层');
      part.title=description+' · '+clockNumbers.format(start)+'–'+clockTime(end);
      part.setAttribute('role','img');part.setAttribute('aria-label',part.title);
      plot.append(part);
    }
    const finish=node('span');finish.className='clock-done';finish.setAttribute('aria-hidden','true');
    plot.append(finish);row.append(label,plot);
    return row;
  });
  grid.replaceChildren(scaleRow,...rendered);
  $('clock-summary').textContent=resident
    ? '下一层权重已在显存，当前层算完后立即开始下一层。'
    : '当前层 '+clockTime(plan.computeMs)+' 算完，下一层权重 '+clockTime(plan.readyAt)+' 就绪。'+
      (plan.waitMs>0?'GPU 等到权重就绪再开始下一层。':'下一层可在当前层算完时直接开始。');
  const serial=$('clock-serial');
  serial.hidden=resident;
  serial.textContent='如果当前层算完才启动搬运，下一层要等 '+clockTime(plan.readyAt)+
    '。提前预取后等 '+clockTime(plan.waitMs)+'，省下 '+clockTime(plan.readyAt-plan.waitMs)+'。';
}

function renderStatic() {
  const info=$('static');
  if(inferenceActive()){
    info.hidden=false;
    info.replaceChildren(facts([
      ['原机实测',inferenceCase.referenceHardware],
      ['3D 演示',inferenceCase.sceneHardware],
      ['请求规格',inferenceCase.workload],
      ['原机 · 两次请求',inferenceCase.requestSeconds+' s'],
    ]),refs(['h3Case','h3Offload']));
    return;
  }
  let data=[];
  if(state.view==='board'){
    if(systemActive()){
      data=[['主槽','M2_1 · CPU PCIe 4.0 ×4'],['示例数据页',hostExample.prp1+' · PRP1'],
        ['地址范围','512 B / LBA · NLB 7'],['NAND','A 封装 · 原位原理剖视']];
    } else if(state.mode==='pcie'){
      const pins=lanePins(state.lane);
      data=[
        ['主机 TX → SSD RX','M.2 #'+pins.tx.join('− / #')+'+'],
        ['SSD TX → 主机 RX','M.2 #'+pins.rx.join('− / #')+'+'],
        ['共同时钟例','REFCLK #53−/#55+'],
        ['边带','PERST# #50 · CLKREQ# #52'],
        ['M.2 电源','3.3 V，多触点并联'],
        ['Gen4 ×4','编码后 7.877 GB/s / 方向'],
      ];
    } else if(state.mode==='gpu-link'){
      const {pcieMs,vramMs}=gpuTransferBounds(state.gpuPayloadMiB);
      data=[['显卡接口','Gen'+gpuProfile.pcieGen+' ×'+gpuProfile.lanes+' · '+cardLinkGBs.toFixed(2)+' GB/s / 方向'],
        ['整机 PCI_E1','Gen'+gpuProfile.slotGen+' ×'+gpuProfile.slotLanes+' · '+hostLinkGBs.toFixed(2)+' GB/s / 方向'],
        ['卡上 GDDR7',vramGBs.toLocaleString('zh-CN')+' GB/s'],
        ['PCIe 理想下限',pcieMs.toFixed(2)+' ms'],
        ['显存读取下限',vramMs.toFixed(2)+' ms']];
    } else if(state.mode==='ddr'){
      data=[['板端','CPU UMC → A2 / B2'],['信号','DQ / DQS、CK / CA / CS'],
        ['每条模组','2 × 32 bit'],['整机有效位宽','128 bit'],['带宽上限','83.2 GB/s @ 5200 MT/s']];
    } else if(state.mode==='power'){
      data=[['ATX 3.1 电源','RM1000x · CP-9020271'],['宽 × 高 × 深',
        [psuProfile.width,psuProfile.height,psuProfile.depth].join(' × ')+' mm'],
        ['VRM 标称分组','14 核心 + 2 SoC + 1 辅助']];
    } else {
      data=[['ATX 标称','243.84 × 304.80 mm'],['CPU','AM5 / Ryzen 9 7950X'],['内存','DIMMA2 / DIMMB2'],['启动盘','M2_1 / 990 PRO 2 TB']];
      if(state.showGpu)data.push(['显卡','PCI_E1 / RTX 5090 FE'],['显卡外廓',gpuProfile.dimensionsMm.join(' × ')+' mm']);
      if(state.showPsu)data.push(['电源','RM1000x · 150 × 86 × 160 mm']);
    }
  }
  if(state.view==='gpu'){
    if(state.mode==='sm')data=[['CUDA Core','128 / SM'],['Tensor Core','4 / SM · 第五代'],
      ['寄存器文件','256 KB / SM'],['L1 / Shared','128 KB / SM']];
    else if(state.mode==='die')data=[['核心',gpuProfile.chip],['启用配置',gpuProfile.gpcs+' GPC · '+gpuProfile.tpcs+' TPC · '+gpuProfile.sms+' SM'],
      ['计算单元',gpuProfile.cudaCores.toLocaleString('zh-CN')+' CUDA · '+gpuProfile.tensorCores+' Tensor'],
      ['L2',gpuProfile.l2MB+' MB'],['显存控制器',gpuProfile.memoryChannels+' × 32-bit']];
    else data=[['尺寸',gpuProfile.dimensionsMm.join(' × ')+' mm · 双槽'],
      ['显存',gpuProfile.memoryGB+' GB '+gpuProfile.memoryType+' · '+gpuProfile.memoryBusBits+'-bit'],
      ['显存带宽',vramGBs.toLocaleString('zh-CN')+' GB/s'],['TGP',gpuProfile.tgpW+' W']];
  }
  if(state.view==='cpu')data=[['封装','2 × CCD + 1 × IOD'],['CCD','71 mm² · 5 nm · 8 核 / 片'],['IOD','122 mm² · 6 nm'],['每核','32 KB L1I + 32 KB L1D + 1 MB L2'],['共享 L3','32 MB / CCD']];
  if(state.view==='dram')data=[['模组','2 × 16 GB · 1Rx8'],['裸片','16 Gb ×8 · 8 BG × 4 banks'],
    ['速率示例',memoryProfile.rateMTs+' MT/s · '+memoryProfile.CL+'-'+memoryProfile.RCD+'-'+memoryProfile.RP],
    ['示例时钟',memoryProfile.clockPs+' ps，Ramulator 预设'],['标准突发','BL16 · 64 B / 32-bit 子通道']];
  if(state.view==='host' && state.mode!=='init')data=[
    ['示例','QID 1 / 4 槽 / CID 0x002A'],['CPU VA',hostExample.cpuVA],['物理 PA',hostExample.physical],
    ['DMA / PRP1',hostExample.prp1],['命名空间','512 B / LBA · NLB 7'],['SQ Tail DB',hostExample.sqDoorbell],['CQ Head DB',hostExample.cqDoorbell],
  ];
  info.hidden=!data.length;info.replaceChildren(facts(data));
}
function gpuFlow(direction=state.gpuDirection) {
  const flow=gpuLinkSteps(direction,state.gpuPayloadMiB);
  return inferenceDrill?.opener==='load-vram'?flow.slice(1):flow;
}

const steps = () => systemActive() ? systemSteps(state.ioOp,state.irq) :
  inferenceActive() ? inferenceSteps(state.inferenceMode,state.inferenceSource) : gpuLinkActive() ? gpuFlow() :
  powerActive() ? powerFlow(state.powerCondition) :
  state.view==='host' ? hostSteps(state.mode,state.irq) :
  state.view==='dram' && ['bank','cell'].includes(state.mode) ? dramSteps(state.dramOp,state.bit) : [];
const replayEnd=flow=>powerLimited()?powerGoodIndex:flow.length-1;
const startupActive=()=>powerActive()&&steps()[state.index]?.startupMs!==undefined;

function tracePreferences() {
  const {ioOp,lane,irq,follow,gpuDirection,gpuPayloadMiB}=state;
  return {ioOp,lane,irq,follow,gpuDirection,gpuPayloadMiB};
}

function startInferenceDrill(opener) {
  if(!inferenceActive())return;
  const target=drillTargets[opener], origin=steps(), entry=origin[state.index];
  inferenceDrill={
    opener,originStep:entry.id,originNumber:state.index+1,originTitle:entry.title,
    inferenceMode:state.inferenceMode,inferenceSource:state.inferenceSource,inferenceComputeMs:state.inferenceComputeMs,
    selection:state.selection,scrollY:window.scrollY,
    resume:Boolean(playTimer)&&state.index<origin.length-1,
    previous:tracePreferences(),
  };
  if(target.mode==='io'){state.ioOp='read';state.follow=true;}
  else {state.gpuDirection='h2d';state.gpuPayloadMiB=1024;}
  const flow=target.mode==='io'?systemSteps(state.ioOp,state.irq):gpuFlow();
  changeView('board',target.mode,flow.findIndex(step=>step.id===target.step));
  $('inference-drill').scrollIntoView({block:'nearest'});
  $('return-inference').focus({preventScroll:true});
}

function closeInferenceDrill() {
  if(!inferenceDrill)return;
  Object.assign(state,inferenceDrill.previous??inferenceDrill.previousIo);
  inferenceDrill=null;
}

function renderInferenceDrill() {
  $('inference-drill').hidden=!inferenceDrill;
  if(!inferenceDrill)return;
  $('drill-title').textContent=drillTargets[inferenceDrill.opener].title;
  const caption=$('drill-origin');
  caption.textContent='推理第 '+String(inferenceDrill.originNumber).padStart(2,'0')+' 步 · '+inferenceDrill.originTitle;
  caption.title=caption.textContent;
  $('return-inference-label').textContent=inferenceDrill.resume?'返回并继续播放':'返回推理';
}

async function returnToInference() {
  const origin=inferenceDrill;
  if(!origin)return;
  closeInferenceDrill();
  state.inferenceMode=origin.inferenceMode;
  state.inferenceSource=origin.inferenceSource;
  state.inferenceComputeMs=origin.inferenceComputeMs;
  const flow=inferenceSteps(state.inferenceMode,state.inferenceSource);
  const index=Math.max(0,flow.findIndex(step=>step.id===origin.originStep));
  const transition=changeView('board','inference',index,origin.selection), serial=loadSerial;
  window.scrollTo(0,origin.scrollY);
  $('milestones').querySelector('[data-drill="'+origin.opener+'"]')?.focus({preventScroll:true});
  await transition;
  if(serial===loadSerial&&origin.resume&&state.index===index&&index<flow.length-1&&!playTimer)playback();
}

const ioMilestones={
  doorbell:{label:'门铃',compact:'SQ 门铃已写'},
  sense:{label:'NAND 感测'},
  'data-mwr':{label:'数据回传',compact:'数据已回主机'},
  'data-cpl':{label:'负载到 SSD',compact:'写负载已到 SSD'},
  program:{label:'NAND 编程'},
  cqe:{label:'CQE 写回',compact:'CQE 已写回'},
};
const inferenceMilestones={
  'read-ssd':{label:'SSD 读权重',compact:'权重读入 DDR5'},
  'load-vram':{label:'装入 GDDR7',compact:'权重装入 GDDR7'},
  'dit-feed':{label:'DiT 取权重'},
  'dit-overlap':{label:'预取与计算',compact:'GPU 计算与预取重叠'},
  'vae-decode':{label:'VAE 解码'},
};

function replayCue(entry) {
  if(systemActive())return {...ioMilestones[entry.id],color:signalKinds[entry.kind].color};
  if(gpuLinkActive())return {label:entry.label,compact:entry.label,color:entry.color};
  if(powerActive())return {label:entry.label,compact:entry.label,color:entry.color};
  if(inferenceActive()){
    const cue=entry.id==='dit-overlap'&&state.inferenceMode==='resident' ?
      {label:'GPU 本地计算',compact:'GPU 执行常驻层'} : inferenceMilestones[entry.id];
    return {...cue,color:inferenceStepColor(entry)};
  }
  return {};
}

function renderMilestones(flow,cues,end) {
  const row=$('milestones');
  const marks=cues.flatMap(({label,color},i)=>{
    if(!label)return [];
    const number=String(i+1).padStart(2,'0');
    const opener=flow[i].id, drill=inferenceActive()&&drillTargets[opener];
    const point=button('',drill?()=>startInferenceDrill(opener):()=>moveTo(i),drill?undefined:i===state.index);
    point.append(node('span',number),node('strong',label));
    point.disabled=i>end;
    point.title=point.disabled?'等待 PWR_OK · '+flow[i].title:drill?drill.action:flow[i].title;
    point.setAttribute('aria-label',number+' '+label);
    point.style.setProperty('--point-tone',color);
    if(drill){
      const arrow=node('i');arrow.className='drill-arrow';arrow.setAttribute('aria-hidden','true');
      point.classList.add('drill-entry');point.dataset.drill=opener;point.append(arrow);
      if(i===state.index)point.setAttribute('aria-current','step');
    }
    return [point];
  });
  row.hidden=!marks.length;
  replaceChoices(row,marks);
}

function ioResults(entry,memory) {
  const target=hostWriteTarget(entry), results=node('dl');
  results.className='flow-results';
  const fields=[
    ['buffer','数据页',memory.data,signalKinds.data.color,state.ioOp==='read' ?
      memory.data==='4 KiB 已写到主机'?'已写回':'待写回' : ''],
    ['cq','CQ[3]',memory.cqEntry,signalKinds.completion.color,
      memory.cqHead===0?'已消费':memory.cqEntry==='P=0，旧数据'?'待写回':'已写回'],
  ];
  for(const [key,label,value,color,status] of fields){
    const item=node('div'), detail=node('dd'), active=key===target;
    item.dataset.result=key;
    item.style.setProperty('--result-tone',color);
    if(active)item.setAttribute('aria-current','step');
    detail.append(node('strong',value));
    if(active||status)detail.append(node('span',active?'本步写入':status));
    item.append(node('dt',label),detail);
    results.append(item);
  }
  return results;
}

function powerStatus(entry) {
  const panel=node('dl');panel.className='flow-results power-status';
  panel.setAttribute('aria-label','ATX 针脚和主轨状态');
  const highlight={'boot-handoff':'board-start','rails-ready':'rail33'}[entry.id]??entry.phase;
  for(const [name,value,phase] of powerSignals(entry)){
    const row=node('div'),result=node('dd');
    row.dataset.rail=phase;
    row.style.setProperty('--result-tone',phase==='rail33'?powerColors.main:powerColors[phase]??powerColors.control);
    if(phase===highlight)row.setAttribute('aria-current','step');
    if(entry.gate==='blocked'&&['ready','board-start'].includes(phase))row.dataset.held='';
    result.append(node('strong',value));
    row.append(node('dt',name),result);panel.append(row);
  }
  return panel;
}

function renderPowerReplay(entry) {
  const {gate,railFault,id}=entry;
  const timed=entry.startupMs!==undefined, low=gate!=='passed';
  const lab=$('power-lab'),status=$('power-replay-state');
  lab.style.setProperty('--fault-tone',powerColors.fault);
  for(const option of lab.querySelectorAll('[data-condition]')){
    option.setAttribute('aria-pressed',String(option.dataset.condition===state.powerCondition));
  }
  status.dataset.gate=gate??'';
  const timedMessage={
    'main-rails':'12 V 和 5 V 已就绪 · 等待 3.3 V',
    'rails-ready':'主轨均达标 · 等待 T3',
    'power-ok':'PWR_OK 已拉高 · 平台复位保持',
    'boot-handoff':'平台复位已释放 · CPU 进入初始化',
  };
  const message=timed?timedMessage[id]:gate==='blocked'?'开机停在 PWR_OK · 等待电源就绪':
    gate==='passed'?'PWR_OK 已拉高 · 下一步进入主板启动':
    id==='boot-handoff'?'主板已进入初始化':
    powerLimited()?'欠压情景 · 回放将在 PWR_OK 停住':
      state.powerCondition==='delayed'?'延迟稳定情景 · 可跳到 3.3 V 建立步骤':'切换条件可对照 3.3 V 和 PWR_OK';
  if(status.textContent!==message)status.textContent=message;
  renderHints(gate||railFault ? [
    ['','12 V 通过',powerColors.main],['','5 V 通过',powerColors.main],
    ['',railFault?(timed?'3.3 V 建立中':'3.3 V 欠压'):'3.3 V 通过',railFault?powerColors.fault:powerColors.main],
    ...(gate?[['',low?'虚线 · PWR_OK 低电平':'实线 · PWR_OK 高电平',low?powerColors.inactive:powerColors.ready]]:[]),
  ] : powerHints);
  $('stage-name').replaceChildren(node('strong',timed?entry.title:gate?(low?'PWR_OK 低 · 开机停住':'PWR_OK 高 · 电源就绪'):'ATX 供电'),
    node('span',gate?(gate==='blocked'?'3.3 V 欠压 · 等待主轨就绪':'主板可以推进上电时序'):entry.title));
  Object.assign(document.body.dataset,{powerStep:id,powerCondition:state.powerCondition,powerGate:gate??''});
  if(timed)renderStartupTime(startupSnapshot(state.powerMs));
  else delete document.body.dataset.powerTime;
}

const startupPercent=ms=>100*ms/startupTiming.durationMs+'%';

function initStartupTiming() {
  const {durationMs,minimumVolts,t3Ms,phases,railPoints}=startupTiming;
  const [,rail,ok,reset]=phases;
  const svg=$('startup-wave'), plot=$('startup-plot'), scrub=$('startup-scrub');
  const setAttrs=(element,values)=>{
    for(const [name,value] of Object.entries(values))element.setAttribute(name,value);
    return element;
  };
  const line=(parent,x1,y1,x2,y2)=>parent.append(setAttrs(
    document.createElementNS(svg.namespaceURI,'line'),{x1,y1,x2,y2}));
  const trace=(id,points,color)=>setAttrs($(id),{points:points.map(([x,y])=>`${x},${y}`).join(' '),stroke:color});
  const railY=volts=>33-(volts-2.85)*27/(3.47-2.85);
  const floor=railY(minimumVolts), railCoords=railPoints.map(([x,volts])=>[x,railY(volts)]);
  const crossing=railCoords.findIndex(([x])=>x===rail.ms);
  svg.setAttribute('viewBox',`0 0 ${durationMs} 114`);
  setAttrs($('startup-valid-band'),{x:0,y:6,width:durationMs,height:floor-6});
  setAttrs($('startup-floor'),{x1:0,y1:floor,x2:durationMs,y2:floor});
  $('startup-floor-label').style.top=(floor+1)+'px';
  $('startup-floor-label').textContent=minimumVolts.toFixed(2)+' V 下限';
  plot.style.setProperty('--t3-start',startupPercent(rail.ms));
  plot.style.setProperty('--t3-width',startupPercent(t3Ms));
  $('startup-t3').textContent=`T3 · ${t3Ms} ms`;
  for(const y of [38,76])line($('startup-grid'),0,y,durationMs,y);
  for(const ms of [0,50,100,150,durationMs]){
    line($('startup-grid'),ms,0,ms,114);
    const label=node('span',String(ms));label.style.left=startupPercent(ms);$('startup-scale').append(label);
  }
  for(const event of phases.slice(1)){
    line($('startup-edges'),event.ms,0,event.ms,114);
    const marker=button('',()=>{stopPlay();setStartupTime(event.ms,true);});
    marker.append(node('span',event.ms+' ms'),node('strong',event.label));
    marker.dataset.phase=event.id;
    marker.style.setProperty('--event-tone',powerColors[event.color]);
    $('startup-events').append(marker);
  }
  trace('startup-rail-ramp',railCoords.slice(0,crossing+1),powerColors.fault);
  trace('startup-rail-valid',railCoords.slice(crossing),powerColors.main);
  trace('startup-ok-low',[[0,68],[ok.ms,68]],powerColors.inactive);
  trace('startup-ok-high',[[ok.ms,68],[ok.ms,49],[durationMs,49]],powerColors.ready);
  trace('startup-reset-held',[[0,103],[reset.ms,103]],powerColors.inactive);
  trace('startup-reset-released',[[reset.ms,103],[reset.ms,85],[durationMs,85]],powerColors.control);
  scrub.max=String(durationMs);
  scrub.oninput=()=>{if(playTimer)stopPlay();setStartupTime(Number(scrub.value));};
  scrub.onchange=()=>writeAddress();

  const waveform=$('startup-waveforms');
  const seek=event=>{
    const {left,width}=waveform.getBoundingClientRect();
    setStartupTime((event.clientX-left)/width*durationMs);
  };
  waveform.onpointerdown=event=>{
    if(event.button!==0||!event.isPrimary)return;
    if(playTimer)stopPlay();
    waveform.setPointerCapture(event.pointerId);seek(event);
  };
  waveform.onpointermove=event=>{if(waveform.hasPointerCapture(event.pointerId))seek(event);};
  waveform.onpointerup=event=>{if(waveform.hasPointerCapture(event.pointerId))seek(event);};
  waveform.onlostpointercapture=()=>{if(startupActive())writeAddress();};
}

function renderStartupTime(sample) {
  const {ms,volts,railValid,powerGood,resetReleased,phase}=sample;
  const scrub=$('startup-scrub'), voltage=volts.toFixed(2)+' V';
  const good=powerGood?'高':'低', reset=resetReleased?'已释放':'保持';
  const time=ms+' ms';
  scrub.value=String(ms);
  scrub.setAttribute('aria-valuetext',`${time}，3.3 V 主轨 ${voltage}，PWR_OK ${good}，平台复位${reset}`);
  $('startup-plot').style.setProperty('--startup-time',startupPercent(ms));
  $('startup-readout').textContent=time;
  const t3=railValid&&!powerGood?`T3 还剩 ${startupTiming.phases[2].ms-ms} ms`:`T3 · ${startupTiming.t3Ms} ms`;
  $('startup-t3').textContent=t3;
  for(const [id,text,valid] of [['startup-volts',voltage,railValid],['startup-ok',good,powerGood],['startup-reset',reset,resetReleased]]){
    const readout=$(id);
    readout.textContent=text;readout.dataset.tone=valid?'valid':'held';
  }
  for(const marker of $('startup-events').children){
    marker.setAttribute('aria-current',marker.dataset.phase===phase.id?'step':'false');
  }
  $('stage-name').lastElementChild.textContent=`${time} · PWR_OK ${good} · 复位${reset}`;
  document.body.dataset.powerTime=String(ms);
}

function setStartupTime(time,commit=false) {
  if(!startupActive())return;
  const sample=startupSnapshot(time);
  if(sample.ms===state.powerMs){if(commit)writeAddress();return;}
  state.powerMs=sample.ms;
  const target=steps().findIndex(entry=>entry.id===sample.phase.id);
  if(target!==state.index){
    state.index=target;state.selection=null;renderFlow({address:commit});
  }else{
    renderStartupTime(sample);
    if(commit)writeAddress();
  }
}

function psuDiagram(active,railFault) {
  const panel=node('section'),list=node('ul');
  panel.className='psu-diagram';
  panel.append(node('h3','ATX 电源内部'));
  for(const [kind,parts] of [
    ['main',['交流','整流 / PFC','隔离 DC/DC','+12 V']],
    ['main',['+12 V','次级 DC/DC',railFault?'+5 V 有效 / +3.3 V 欠压':'+5 V / +3.3 V']],
    ['standby',['交流','待机变换器','+5VSB']],
  ]){
    const row=node('li');
    row.classList.toggle('energized',kind==='standby'||kind===active);
    row.style.setProperty('--branch-tone',powerColors[kind]);
    for(const [i,part] of parts.entries()){
      if(i)row.append(node('span',' → '));
      row.append(node('strong',part));
    }
    list.append(row);
  }
  panel.append(list);
  return panel;
}

function drawBuck(plot,focus,sample) {
  const ctx=plot.getContext('2d');
  if(!ctx)return;
  const {vin,vout,averageAmps,duty,rippleAmps,periodUs}=sample;
  const width=plot.width,height=plot.height;
  const left=84,right=width-22,pivot=left+(right-left)*duty;
  const swHigh=58,swLow=106,currentMid=184,currentTop=currentMid-rippleAmps*2.5,currentBottom=currentMid+rippleAmps*2.5;
  ctx.fillStyle='#23292b';ctx.fillRect(0,0,width,height);
  if(focus!=='cycle'){
    ctx.fillStyle=focus==='on'?'#ffdc821f':'#91bded20';
    ctx.fillRect(focus==='on'?left:pivot,18,focus==='on'?pivot-left:right-pivot,200);
  }
  const stroke=(color,vertices,lineWidth=2)=>{
    ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.beginPath();
    for(const [i,[x,y]] of vertices.entries())i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    ctx.stroke();
  };
  for(const y of [swHigh,swLow,currentMid,218])stroke('#5a6260',[[left,y],[right,y]],1);
  ctx.setLineDash([5,5]);
  stroke('#c3bdb0',[[pivot,18],[pivot,218]],1);
  ctx.setLineDash([]);
  stroke(powerColors.core,[[left,swHigh],[pivot,swHigh],[pivot,swLow],[right,swLow]],3.5);
  stroke(powerColors.dimm,[[left,currentBottom],[pivot,currentTop],[right,currentBottom]],3.5);
  const write=(value,x,y,color='#e2e2d8')=>{ctx.fillStyle=color;ctx.fillText(value,x,y);};
  ctx.font='600 24px system-ui,sans-serif';
  write('SW',left,34,powerColors.core);write('Iₗ',left,147,powerColors.dimm);
  ctx.font='22px system-ui,sans-serif';
  write(vin+' V',19,swHigh+7);write('0 V',30,swLow+7);
  write(averageAmps+' A',14,currentMid+6);
  write('0',left,244);
  ctx.textAlign='right';write(periodUs.toFixed(2)+' µs',right,244);ctx.textAlign='left';
  plot.setAttribute('aria-label','同步 Buck 单周期。目标 '+vout.toFixed(2)+' V。开关节点先高后低，电感电流上升后回落。'+
    '当前显示'+{on:'高侧导通区间',off:'低侧续流区间',cycle:'完整周期'}[focus]+'。峰峰纹波 '+rippleAmps.toFixed(2)+' A。');
}

function buckPanel(focus) {
  const panel=node('section'),heading=node('div'),plot=node('canvas'),results=node('dl'),caption=node('p');
  panel.className='buck-panel';heading.className='buck-heading';results.className='buck-measures';
  plot.width=620;plot.height=262;plot.setAttribute('role','img');
  heading.append(node('h3','同步 Buck 波形'),selectBox('示例 Vcore',
    buckVoltages.map(value=>[value,value.toFixed(2)+' V']),state.buckVout,value=>{
      state.buckVout=Number(value);refresh();
    }));
  function refresh() {
    const sample=buckExample(state.buckVout);
    const {duty,onUs,rippleAmps,frequencyKHz,inductanceUh}=sample;
    drawBuck(plot,focus,sample);
    results.replaceChildren(...[
      ['占空比',(duty*100).toFixed(2)+'%'],['高侧导通',onUs.toFixed(3)+' µs'],['电感纹波',rippleAmps.toFixed(2)+' Aₚₚ'],
    ].map(([name,value])=>{
      const metric=node('div');metric.append(node('dt',name),node('dd',value));return metric;
    }));
    caption.textContent='理想单相 CCM 示例 · '+frequencyKHz+' kHz · '+inductanceUh+' µH · D ≈ Vcore / 12 V';
  }
  refresh();
  panel.append(heading,plot,results,caption);
  return panel;
}

function reasonPanel([question,cause,comparison], {example,actions=[]}={}) {
  const panel=node('section');panel.className='why-panel';
  const details=node('details'),summary=node('summary','换个条件会怎样');
  details.className='why-comparison';
  summary.addEventListener('click',()=>{if(!details.open)stopPlay();});
  details.append(summary,node('p',comparison));
  if(example)details.append(example);
  panel.append(node('h3',question),node('p',cause),details,...actions);
  return panel;
}

function cableCurrentExample() {
  const example=node('div'),rows=node('dl');
  const loadOptions=[100,150,200],vcore=1.10,scaleLimit=loadOptions.at(-1)/vcore;
  example.className='why-example';rows.className='why-current';
  rows.setAttribute('aria-live','polite');
  const set=value=>{
    const watts=Number(value);
    rows.replaceChildren(...[[12,'EPS 输入合计'],[vcore,'Vcore 侧']].map(([volts,label])=>{
      const row=node('div'),current=watts/volts;
      const fill=node('span');fill.className='why-current-bar';fill.setAttribute('aria-hidden','true');
      fill.style.setProperty('--current',100*current/scaleLimit+'%');
      row.append(node('dt',label+' · '+volts.toFixed(volts===12?0:2)+' V'),
        node('dd',current.toFixed(1)+' A'),fill);
      return row;
    }));
  };
  example.append(selectBox('示例负载功率',loadOptions.map(watts=>[watts,watts+' W']),150,set),
    rows,node('p','同功率换算 I = P / V，取理想转换。'));
  set(150);
  return example;
}

function completionComparison(flow,id) {
  const target=id==='data-mwr'?'cqe':'data-mwr';
  const index=flow.findIndex(step=>step.id===target);
  if(index<0)return [];
  const jump=button(target==='cqe'?'对照 CQE 写入':'对照 4 KiB 写回',()=>{
    moveTo(index);
    $('flow-content').querySelector('.why-jump')?.focus({preventScroll:true});
  });
  jump.className='why-jump';
  return [jump];
}

function renderFlow({address=true}={}) {
  const flow=steps(),end=replayEnd(flow);
  const timeline=$('timeline'), panel=$('flow-details');
  timeline.hidden=!flow.length;panel.hidden=!flow.length;
  $('power-lab').hidden=!powerActive();
  timeline.toggleAttribute('data-limited',powerLimited());
  const timed=powerActive()&&flow[Math.min(end,Math.max(0,state.index))]?.startupMs!==undefined;
  timeline.toggleAttribute('data-timed',timed);
  $('startup-timing').hidden=!timed;
  $('seek-scroll').hidden=timed;
  if(!flow.length){stage.style.removeProperty('--flow-signal');syncScene();return;}
  state.index=Math.max(0,Math.min(end,state.index));
  const entry=flow[state.index], cues=flow.map(replayCue), cue=cues[state.index], sub=$('flow-content');
  for(const surface of [stage,timeline,panel])surface.style.setProperty('--flow-signal',cue.color??'');
  $('flow-title').textContent=entry.title;
  $('step-number').textContent=String(state.index+1).padStart(2,'0');
  $('step-total').textContent=' / '+flow.length;
  const bus=node('div',entry.bus);bus.className='bus';
  sub.replaceChildren(bus);
  if(powerActive()&&entry.gate)sub.append(powerStatus(entry));
  const scope=powerActive()?'power':inferenceActive()?'inference':gpuLinkActive()?'gpu-link':
    systemActive()||state.view==='host'?'io':state.view;
  const reason=reasonFor(scope,entry.id,{operation:systemActive()?state.ioOp:state.mode,
    residency:state.inferenceMode,direction:state.gpuDirection});
  if(reason){
    const example=scope==='power'&&entry.id==='eps'?cableCurrentExample():undefined;
    const actions=scope==='io'&&['data-mwr','cqe'].includes(entry.id)?completionComparison(flow,entry.id):[];
    sub.append(reasonPanel(reason,{example,actions}));
  }
  sub.append(node('p',entry.text));
  if(systemActive()){
    const memory=hostSnapshot(state.ioOp,flow,state.index);
    const link=entry.path.find(key=>key.startsWith('pcie-'));
    if(link){
      const pins=lanePins(state.lane)[link.endsWith('up')?'rx':'tx'];
      bus.append(node('span',' · Lane '+state.lane+' #'+pins[0]+'−/#'+pins[1]+'+'));
    }
    sub.append(ioResults(entry,memory),facts([['NAND / 主控',memory.media||'等待介质操作'],
      ['SQ Head / Tail',memory.sqHead+' / '+memory.sqTail],
      ['CQ Head / 期待 P',memory.cqHead+' / '+memory.phase],['完成通知',memory.notice]]));
    const op=state.ioOp==='read'?'读 4 KiB':'写 4 KiB';
    $('stage-name').replaceChildren(node('strong',op),node('span',hostWriteTarget(entry)?cue.compact:entry.location));
    document.body.dataset.ioStep=entry.id;
    document.body.dataset.ioFocus=entry.focus;
    document.body.dataset.ioTarget=entry.path.at(-1);
  } else if(inferenceActive()){
    sub.append(facts(entry.facts));
    $('stage-name').replaceChildren(node('strong','990 PRO · DDR5 · RTX 5090'),node('span',entry.title));
    $('inference-clock').style.setProperty('--flow-signal',cue.color);
    $('clock-jump').setAttribute('aria-current',entry.id==='dit-overlap'?'step':'false');
    document.body.dataset.inferenceStep=entry.id;
    document.body.dataset.inferenceMode=state.inferenceMode;
  } else if(gpuLinkActive()){
    sub.append(facts(entry.facts));
    const direction=state.gpuDirection==='d2h'?'RTX 5090 → DDR5':'DDR5 → RTX 5090';
    $('stage-name').replaceChildren(node('strong',direction),node('span',entry.label??'全链路'));
    document.body.dataset.gpuStep=entry.id;
    document.body.dataset.gpuDirection=state.gpuDirection;
  } else if(powerActive()){
    if(entry.buck)sub.append(buckPanel(entry.buck));
    if(entry.sourceDiagram)sub.append(psuDiagram(entry.sourceDiagram,entry.railFault));
    if(!entry.gate)sub.append(powerStatus(entry));
    renderPowerReplay(entry);
    if(!state.selection)renderInspector();
  } else if(state.view==='host'){
    const memory=hostSnapshot(state.mode,flow,state.index);
    sub.append(facts(Object.entries(memory).map(([key,val])=>[hostFields[key],val])));
  } else {
    const [wl,bl,ref,cell,bank]=entry.values;
    sub.append(facts([['Bank',bank],['WL',wl? '高 · 导通':'低 · 截止'],['BL / 参考线',bl.toFixed(3)+' / '+ref.toFixed(3)],
      ['电容 V / VDD',cell.toFixed(3)],...dramTiming(state.dramOp,entry.id)]));
  }
  sub.append(refs(entry.refs));
  $('prev').disabled=state.index===0;$('next').disabled=state.index===end;
  updatePlayControl();
  $('step-pick').replaceChildren(...flow.map(({title},i)=>{
    const option=node('option',(i+1)+' · '+(cues[i].compact??title));
    option.value=i;option.title=title;option.disabled=i>end;return option;
  }));
  $('step-pick').value=String(state.index);
  if(timed)$('milestones').hidden=true;
  else{
    $('seek').style.setProperty('--step-count',String(flow.length));
    $('seek').style.setProperty('--reach',String(end/Math.max(1,flow.length-1)));
    const scrub=$('scrub');
    scrub.max=String(end);scrub.value=String(state.index);
    scrub.style.setProperty('--progress',(100*state.index/Math.max(1,end))+'%');
    scrub.setAttribute('aria-valuetext',(state.index+1)+' / '+(end+1)+'，'+entry.title);
    replaceChoices($('step-buttons'),flow.map(({title},i)=>{
      const b=button(String(i+1).padStart(2,'0'),()=>moveTo(i),i===state.index);
      if(cues[i].label)b.classList.add('has-milestone');
      b.disabled=i>end;
      b.title=title;b.setAttribute('aria-label',(i+1)+' '+title);b.classList.toggle('done',i<state.index);return b;
    }),scrub.matches(':active')?undefined:$('seek-scroll'));
    renderMilestones(flow,cues,end);
  }
  if(address)writeAddress();
  syncScene();
}
function updatePlayControl(){
  $('play-label').textContent=playTimer?'暂停':powerLimited()&&state.index===powerGoodIndex?'重播':'播放';
  $('play').setAttribute('aria-pressed',String(Boolean(playTimer)));
}
function stopPlay(){
  clearTimeout(playTimer);playTimer=undefined;
  updatePlayControl();
  schedule();
}
function moveTo(index,fromPlayback=false) {
  if(!fromPlayback)stopPlay();
  state.index=index;
  state.powerMs=steps()[index]?.startupMs??0;
  renderFlow();
}
function playback(){
  if(playTimer){stopPlay();if(startupActive())writeAddress();return;}
  const flow=steps();
  if(!flow.length)return;
  const end=replayEnd(flow);
  if(state.index===end)moveTo(0,true);
  const period=powerActive()?2800:systemActive()||inferenceActive()?1750:1450;
  const advance=()=>{
    if(state.index>=end){stopPlay();return;}
    moveTo(state.index+1,true);
    if(powerLimited()&&state.index===end){stopPlay();return;}
    queueAdvance();
  };
  const queueAdvance=()=>{
    if(!startupActive()||state.powerMs===startupTiming.durationMs){playTimer=setTimeout(advance,period);return;}
    const started=performance.now(), from=state.powerMs;
    const tick=()=>{
      const sample=startupSnapshot(from+(performance.now()-started)*.04);
      setStartupTime(sample.ms,sample.phase.id!==flow[state.index].id);
      if(sample.ms===startupTiming.durationMs){writeAddress();playTimer=setTimeout(advance,period);}
      else playTimer=setTimeout(tick,40);
    };
    playTimer=setTimeout(tick,40);
  };
  queueAdvance();updatePlayControl();schedule();
}

function syncTraceLabels() {
  for(const tag of active.annotations){
    const target=Boolean(tag.endpoint);
    tag.button.classList.toggle('active',target||tag.key===state.selection);
    tag.button.classList.toggle('trace-target',target);
    if(active.power){
      setAnnotationCaption(tag);
      tag.button.toggleAttribute('data-power-cue',Boolean(tag.tone));
      tag.button.style.setProperty('--annotation-tone',tag.tone??'');
    }
  }
}

function syncScene() {
  if(!active)return;
  if(active.inference){
    const entry=steps()[state.index],signature=[state.inferenceMode,state.inferenceSource,entry.id].join('/');
    if(active.trace!==signature){
      showInferenceStep(active,entry,state.inferenceMode);
      active.trace=signature;
    }
    if(state.follow&&active.lastFocus!==entry.focus){
      const frame=inferenceFrame(entry.focus);
      fit(false,frame?.box,frame?.pose,Boolean(active.lastFocus));
      active.lastFocus=entry.focus;
    }
    syncTraceLabels();
    schedule();return;
  }
  if(active.system){
    const flow=steps(), entry=flow[state.index];
    const signature=[state.ioOp,entry.id,state.irq,state.lane].join('/');
    let frame=systemFrame(entry.focus);
    if(active.trace!==signature){
      frame=showSystemStep(active,flow,state.index,state.ioOp,state.lane);
      active.trace=signature;
      active.traceStart=performance.now();
    }
    if(state.follow&&active.lastFocus!==entry.focus){
      fit(false,frame.box,frame.pose,Boolean(active.lastFocus));
      active.lastFocus=entry.focus;
    }
    syncTraceLabels();
    schedule();return;
  }
  if(gpuLinkActive()){
    const entry=steps()[state.index],signature=state.gpuDirection+'/'+entry.id;
    if(active.trace!==signature){showGpuLinkStep(active,entry,state.gpuDirection);active.trace=signature;}
    syncTraceLabels();schedule();return;
  }
  if(active.power){
    const entry=steps()[state.index],focus=entry.focus??'board';
    const signature=[entry.id,state.powerCondition,state.powerCovers,state.psuCover,state.evidence].join('/');
    if(active.trace!==signature){
      showPowerStep(active,entry,{covers:state.powerCovers,psuCover:state.psuCover,evidence:state.evidence});
      active.trace=signature;
    }
    if(state.follow&&active.lastFocus!==focus){
      const frame=powerFrame(focus,active);
      fit(false,frame?.box,frame?.pose,Boolean(active.lastFocus));
      active.lastFocus=focus;
    }
    syncTraceLabels();schedule();return;
  }
  if(state.view==='board')updateBoard(active,state);
  if(state.view==='cpu' && state.mode==='package'){
    active.cap.visible=state.cpuCap;
    updateExplode(active,state.cpuExplode);
  }
  if(state.view==='dram' && state.mode==='bga')updateExplode(active,state.dramExplode);
  highlight(active,steps()[state.index],state.view==='gpu'?state.selection:selectedTopic(),state);
  for(const tag of active.annotations)tag.button?.classList.toggle('active',tag.key===selectedTopic());
  schedule();
}
function buildAnnotations() {
  if(!active)return;
  const assembly=currentKey()==='board/assembly';
  $('annotations').replaceChildren(...active.annotations.map(item=>{
    const e=button('',()=>selectTopic(item.key));e.className='annotation';
    if(assembly)e.classList.add(['socket','ram','m2_1','gpuCard'].includes(item.key)?'assembly-key':'assembly-secondary');
    item.button=e;setAnnotationCaption(item);return e;
  }));
}
function setAnnotationCaption(item){
  const title=item.caption??item.title;
  if(item.button.textContent===title)return;
  item.button.textContent=title;
  item.button.setAttribute('aria-label','选择 '+title);
  item.halfWidth=Math.max(30,([...title].reduce((width,char)=>width+(char.charCodeAt(0)>255?14:8),0)+16)/2);
}
async function changeView(view,mode,index=0,selection=null,powerMs) {
  stopPlay();
  if(view!=='board'||mode!==drillTargets[inferenceDrill?.opener]?.mode)closeInferenceDrill();
  cameraMove=null;
  const serial=++loadSerial;
  state.view=view;state.mode=mode;state.index=index;state.selection=selection;
  state.powerMs=powerMs??steps()[index]?.startupMs??0;
  const key=currentKey();
  if(active){active.root.removeFromParent();active.effects.removeFromParent();active=null;}
  $('annotations').replaceChildren();updateExportAccess();
  viewControls();renderInferenceDrill();renderInspector();renderStatic();renderInferenceComparison();renderInferenceClock();renderFlow();writeAddress();
  document.body.dataset.view=view;document.body.dataset.mode=mode;
  if(!systemActive())for(const key of ['ioStep','ioFocus','ioTarget'])delete document.body.dataset[key];
  if(!inferenceActive())for(const key of ['inferenceStep','inferenceMode'])delete document.body.dataset[key];
  if(!gpuLinkActive())for(const key of ['gpuStep','gpuDirection'])delete document.body.dataset[key];
  if(!powerActive())for(const key of ['powerStep','powerCondition','powerGate','powerTime'])delete document.body.dataset[key];
  $('render-message').textContent=renderer?'正在载入模型…':'当前浏览器未能初始化 WebGL2。仍可查看右侧资料和流程。';
  $('render-message').hidden=false;
  if (!renderer) return;
  try {
    if(!cache.has(key))cache.set(key,Promise.resolve(makeScene(view,mode)));
    const loaded=await cache.get(key);
    if(serial!==loadSerial)return;
    active=loaded;
    scene.add(active.root,active.effects);
    active.lastFocus=null;
    buildAnnotations();
    if(!active.power&&(!(active.system||active.inference)||!state.follow))fit();
    syncScene();
    if(active.power&&!state.follow)fit();
    $('render-message').hidden=true;updateExportAccess();
    document.body.dataset.ready='true';
  } catch(error) {
    cache.delete(key);
    if(serial!==loadSerial)return;
    $('render-message').textContent='三维模型加载失败。'+error.message;
    console.error(error);
  }
}

function projectLabels() {
  if(!active)return;
  const shown=[];
  const priority=tag=>tag.priority??(tag.key===state.selection?2:tag.button.classList.contains('assembly-key')?1:0);
  const ordered=[...active.annotations].sort((a,b)=>priority(b)-priority(a));
  for(const tag of ordered){
    const p=tag.p.clone().project(camera);
    const anchorX=(p.x+1)*stageWidth/2+(tag.offset?.[0]||0), y=(1-p.y)*stageHeight/2+(tag.offset?.[1]||0);
    const halfWidth=tag.halfWidth, edge=halfWidth+4;
    const x=tag.endpoint?T.MathUtils.clamp(anchorX,edge,stageWidth-edge):anchorX;
    const overlap=shown.some(([x0,y0,w])=>Math.abs(x-x0)<halfWidth+w+5 && Math.abs(y-y0)<30);
    const visible=state.labels && tag.show!==false && p.z>-1 && p.z<1 &&
      anchorX>0 && anchorX<stageWidth && x>=edge && y>52 && x<=stageWidth-edge && y<stageHeight-12 && !overlap;
    tag.button.hidden=!visible;
    if(visible){
      tag.button.style.left=x+'px';tag.button.style.top=y+'px';
      if(tag.endpoint)tag.button.style.setProperty('--leader-offset',T.MathUtils.clamp(anchorX-x,3-halfWidth,halfWidth-3)+'px');
      else tag.button.style.removeProperty('--leader-offset');
      shown.push([x,y,halfWidth]);
    }
  }
}
function schedule() {
  if(!renderer || frameId)return;
  frameId=requestAnimationFrame(time=>{
    frameId=0;
    if(cameraMove){
      const move=cameraMove;
      const progress=Math.min(1,Math.max(0,(time-move.start)/420));
      const eased=progress*progress*(3-2*progress);
      const eye=move.from.eye.clone().lerp(move.to.eye,eased);
      const target=move.from.target.clone().lerp(move.to.target,eased);
      const span=Math.exp(T.MathUtils.lerp(Math.log(move.from.span),Math.log(move.to.span),eased));
      applyCamera({eye,target,span});
      if(progress===1)cameraMove=null;
      else schedule();
    }
    if(active?.pulse){
      active.pulse.visible=Boolean(playTimer)&&!reduced.matches;
      if(active.pulse.visible){
        const elapsed=active.system?Math.max(0,time-active.traceStart):time;
        active.pulse.position.copy(active.motion.getPointAt((elapsed%1480)/1480));
        schedule();
      }
    }
    if(active?.inference && animateInference(active,time,Boolean(playTimer)&&!reduced.matches))schedule();
    if(active)projectLabels();
    if(currentKey()==='board/assembly')updateScaleGuide();
    renderer.render(scene,camera);
  });
}
function updateScaleGuide() {
  const guide=$('scale-guide');
  guide.hidden=!active||camera.getWorldDirection(new T.Vector3()).y>-.999;
  if(guide.hidden)return;
  const pixelsPerMm=stageHeight*camera.zoom/(camera.top-camera.bottom);
  const mm=[100,50,20,10,5,1].find(length=>length*pixelsPerMm<=Math.min(210,stageWidth*.42))??1;
  guide.style.setProperty('--scale-width',mm*pixelsPerMm+'px');
  guide.textContent=mm+' mm';
}
function applyCamera({eye,target,span}) {
  const aspect=stageWidth/stageHeight;
  camera.zoom=1;
  camera.position.copy(eye);
  controls.target.copy(target);camera.lookAt(target);camera.updateMatrixWorld();
  Object.assign(camera,{left:-span*aspect,right:span*aspect,top:span,bottom:-span});
  camera.updateProjectionMatrix();controls.update();
}

function fit(top=false,focus,direction,animated=false){
  if(!active || !renderer)return;
  wasTop=top;
  const bbox=focus||new T.Box3();
  if(!focus){
    active.root.updateMatrixWorld(true);
    active.root.traverseVisible(object=>{if(object.isMesh)bbox.expandByObject(object);});
  }
  const target=bbox.getCenter(new T.Vector3()), size=bbox.getSize(new T.Vector3());
  const pose=top==='rear'?[.12,-1.5,.45]:top?[0,1,.0002]:direction||active.pose;
  const look=new T.Vector3(...pose).normalize();
  const screenX=new T.Vector3(0,1,0).cross(look).normalize(),screenY=look.clone().cross(screenX);
  const extent=axis=>(Math.abs(axis.x)*size.x+Math.abs(axis.y)*size.y+Math.abs(axis.z)*size.z)/2;
  const aspect=stageWidth/stageHeight;
  const eye=target.clone().addScaledVector(look,Math.max(12,size.length()*1.9));
  const margin=!focus&&!top&&currentKey()==='board/assembly'?1.01:1.13;
  const span=Math.max(extent(screenY),extent(screenX)/aspect)*margin;
  const to={eye,target,span};
  if(animated&&!reduced.matches){
    cameraMove={from:{eye:camera.position.clone(),target:controls.target.clone(),span:camera.top/camera.zoom},
      to,start:performance.now()};
  }else{
    cameraMove=null;applyCamera(to);
  }
  schedule();
}
function focusTopic(key){
  if(!active)return;
  if(key==='atxPsu'&&active.psu){
    const frame=powerFrame('psu',active);
    fit(false,frame.box,frame.pose,true);
    return;
  }
  if(active.system){
    const scope={integrated:'',socket:'cpu',ram:'cpu',root:'link',m2_1:'link',ctrl:'pascal',nand:'nand',
      sq:'cpu',buffer:'cpu',cq:'cpu'}[key];
    const frame=systemFrame(scope);
    if(frame){fit(false,frame.box,frame.pose,true);return;}
  }
  const anchor=active.anchors?.[key];
  if(anchor){
    const center=new T.Vector3(...anchor);
    const spans=/^m2_|storage$/.test(key)?[53,15,33]:[50,35,62];
    fit(false,new T.Box3().setFromCenterAndSize(center,new T.Vector3(...spans)));
    return;
  }
  const matched=active.pieces.filter(p=>p.object.visible&&(p.object.userData.topic===key||p.id===key));
  if(matched.length){
    const bounds=new T.Box3();
    for(const part of matched)bounds.expandByObject(part.object);
    fit(false,bounds.expandByScalar(.18));
  } else {
    fit();
  }
}
function initRenderer() {
  renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;
  scene=new T.Scene();
  scene.add(new T.HemisphereLight('#e8f6ff','#65847d',2.35));
  const key=new T.DirectionalLight('#f5f0de',3.1);key.position.set(-.7,1.5,1.1);scene.add(key);
  const fill=new T.DirectionalLight('#9fd3ff',2.2);fill.position.set(1,1,-.7);scene.add(fill);
  camera=new T.OrthographicCamera(-1,1,1,-1,.01,22000);
  controls=new OrbitControls(camera,canvas);
  controls.minZoom=.48;controls.maxZoom=18;controls.zoomToCursor=true;
  controls.addEventListener('change',schedule);
  controls.addEventListener('start',()=>{cameraMove=null;});
  function resize(){
    stageWidth=Math.max(1,stage.clientWidth);stageHeight=Math.max(1,stage.clientHeight);
    renderer.setSize(stageWidth,stageHeight,false);
    if((active?.system||active?.inference||active?.power)&&state.follow&&active.lastFocus&&!wasTop){
      const frame=active.power?powerFrame(active.lastFocus,active):
        active.inference?inferenceFrame(active.lastFocus):systemFrame(active.lastFocus);
      fit(false,frame?.box,frame?.pose);
    }else if(active)fit(wasTop);
    else schedule();
  }
  resize();new ResizeObserver(resize).observe(stage);
  const picker=new T.Raycaster();
  canvas.addEventListener('pointerdown',e=>{pressStart=[e.clientX,e.clientY];});
  canvas.addEventListener('pointerup',e=>{
    if(!active||!pressStart||e.button!==0||Math.hypot(e.clientX-pressStart[0],e.clientY-pressStart[1])>5)return;
    const rect=canvas.getBoundingClientRect();
    picker.setFromCamera(new T.Vector2(2*(e.clientX-rect.x)/rect.width-1,1-2*(e.clientY-rect.y)/rect.height),camera);
    for(const hit of picker.intersectObject(active.root,true)){
      if(hit.object.userData.lettering)continue;
      let key,o=hit.object,visible=true;
      while(o&&o!==scene){key=key||o.userData.topic;visible=visible&&o.visible;o=o.parent;}
      if(visible&&key&&topics[key]){selectTopic(key);break;}
    }
  });
  canvas.addEventListener('keydown',e=>{
    if(!active)return;
    if(['+','=','-'].includes(e.key)){
      camera.zoom=T.MathUtils.clamp(camera.zoom*(e.key==='-' ? .82 : 1.22),controls.minZoom,controls.maxZoom);
      camera.updateProjectionMatrix();
    }else if(e.key.startsWith('Arrow')){
      const spherical=new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if(e.key==='ArrowLeft'||e.key==='ArrowRight')spherical.theta+=e.key==='ArrowLeft'?-.14:.14;
      else spherical.phi=T.MathUtils.clamp(spherical.phi+(e.key==='ArrowUp'?-.13:.13),.02,Math.PI-.02);
      camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));
      controls.update();
    }else return;
    e.preventDefault();schedule();
  });
}
function updateExportAccess(){
  for(const id of ['export','export-all'])$(id).disabled=!active||exporting;
}
const modelViews=[
  ['board','assembly'],['board','io','read'],['board','io','write'],
  ['board','inference','offload'],['board','inference','resident'],
  ['board','pcie'],['board','gpu-link','h2d'],['board','ddr'],
  ['board','power',null,'llc'],['board','power',null,'buck-on'],
  ['cpu','package'],['cpu','io'],['cpu','core'],
  ['dram','module'],['dram','bga'],['dram','die'],['dram','bank'],['dram','cell'],
  ['gpu','card'],['gpu','pcb'],['gpu','die'],['gpu','sm'],
  ['host','init'],['host','read'],['host','write'],
];
function exportScene(model,view,mode,operation,step){
  const exported=new T.Scene();
  const includesGpu=view==='gpu'||model.gpu?.visible;
  const physicalGpu=view==='gpu'&&['card','pcb'].includes(mode);
  exported.name=view+' / '+mode+(operation?' / '+operation:mode==='power'&&step?' / '+step:'')+' · '+model.name;
  exported.userData={
    source:view==='gpu'?'NVIDIA Founders Edition references and PC Anatomy (MIT)':
      'PC Anatomy (MIT), MSI and AMD documentation, and registered 990 PRO geometry'+(includesGpu?', NVIDIA FE references':''),
    pcAnatomyLicense:anatomyLicense,
    unit:'metre',view,mode,geometry:view==='board'||physicalGpu?'approximate reproduction and reference parts':'illustrative',
    ...(includesGpu ? {gpu:gpuProfile.name} : {}),
    ...(model.psu?.root.visible?{psu:psuProfile.name,psuDimensionsMm:[psuProfile.width,psuProfile.height,psuProfile.depth]}:{}),
    ...(operation ? {operation} : {}),
    ...(step ? {step} : {}),
    ...(mode==='power'?{powerModel:'RM1000x cutaway, functional power flow and ideal synchronous buck',reference:sources.psuLab[1]}:{}),
    ...(mode==='inference'?{benchmark:sources.h3Case[1],topology:'ATX with 990 PRO and 32 GB DDR5'}:{}),
  };
  const assembly=new T.Group();
  assembly.name=model.root.name;assembly.scale.setScalar(model.scale);
  assembly.add(model.root.clone(true));
  if(model.signal)assembly.add(model.signal.clone(true));
  exported.add(assembly);
  return exported;
}
async function exportGlb(all=false) {
  if(!active||exporting)return;
  const requested=active,tab=state.view,mode=state.mode;
  const operation=systemActive()?state.ioOp:inferenceActive()?state.inferenceMode:gpuLinkActive()?state.gpuDirection:null;
  const id=operation||powerActive()?steps()[state.index].id:null;
  const btn=$(all?'export-all':'export'), text=btn.textContent;
  exporting=true;updateExportAccess();btn.textContent='导出中…';
  try{
    const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');
    const exported=all ? [] : [exportScene(requested,tab,mode,operation,id)];
    if(all)for(const [view,mode,operation,powerExample] of modelViews){
      const model=await makeScene(view,mode);
      let example;
      if(mode==='inference'){
        const flow=inferenceSteps(operation);
        example=operation==='offload'?'dit-overlap':'dit-feed';
        showInferenceStep(model,flow.find(step=>step.id===example),operation);
      }else if(mode==='gpu-link'){
        const flow=gpuLinkSteps(operation,1024);
        example=flow[0].id;showGpuLinkStep(model,flow[0],operation);
      }else if(mode==='power'){
        example=powerExample;
        showPowerStep(model,powerSteps.find(step=>step.id===example));
      }else if(operation){
        const flow=systemSteps(operation);
        example=operation==='read'?'data-mwr':'nand-load';
        showSystemStep(model,flow,flow.findIndex(step=>step.id===example),operation,0);
      }else if(view==='board')updateBoard(model,{mode,showPsu:mode==='assembly'});
      if(view==='dram' && mode==='bga')updateExplode(model,.68);
      if(view==='host'){
        const flow=hostSteps(mode);
        const entry=flow.find(s=>['data-cpl','data-mwr','create-cq'].includes(s.id));
        highlight(model,entry,null);
      }
      exported.push(exportScene(model,view,mode,operation,example));
    }
    const file=await new GLTFExporter().parseAsync(exported,{binary:true,onlyVisible:true,maxTextureSize:768});
    const url=URL.createObjectURL(new Blob([file],{type:'model/gltf-binary'}));
    const link=node('a');link.href=url;
    link.download=all?'atx-platform.glb':tab==='gpu'&&mode==='card'?'rtx-5090-fe.glb':
      'atx-'+tab+'-'+mode+(operation?'-'+operation:'')+'.glb';
    link.click();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
  }catch(error){
    console.error(error);
    btn.textContent='导出失败';
    setTimeout(()=>{btn.textContent=text;},2000);
    return;
  }finally{exporting=false;updateExportAccess();}
  btn.textContent=text;
}

$('export').onclick=()=>exportGlb();
$('export-all').onclick=()=>exportGlb(true);
$('reset').onclick=()=>{
  if(active?.system||active?.inference||active?.power)active.lastFocus=null;
  fit(false);
};
$('top').onclick=()=>fit(true);
$('labels').onclick=()=>{
  state.labels=!state.labels;$('labels').setAttribute('aria-pressed',String(state.labels));schedule();
};
$('prev').onclick=()=>moveTo(state.index-1);$('next').onclick=()=>moveTo(state.index+1);
$('play').onclick=playback;
$('return-inference').onclick=returnToInference;
for(const option of $('power-lab').querySelectorAll('[data-condition]')){
  option.onclick=()=>{
    const {condition}=option.dataset;
    if(condition===state.powerCondition&&(condition!=='delayed'||startupActive()))return;
    state.powerCondition=condition;state.selection=null;
    const index=condition==='delayed'?steps().findIndex(entry=>entry.id===startupTiming.phases[0].id):powerGoodIndex;
    moveTo(index);
    if(condition==='delayed')$('startup-timing').scrollIntoView({block:'nearest'});
  };
}
for(const id of ['scrub','step-pick'])$(id).oninput=e=>moveTo(Number(e.target.value));
function openAddress(){
  const saved=history.state;
  const origin=saved?.inferenceDrill??saved?.readDrill;
  const opener=origin?.opener??'read-ssd';
  if(origin&&drillTargets[opener]&&location.hash.startsWith(drillTargets[opener].branch)){
    inferenceDrill={...origin,opener};
    Object.assign(state,saved.trace);
  }else closeInferenceDrill();
  const loc=readAddress();
  if(loc.operation)state.ioOp=loc.operation;
  if(loc.completion)state.irq=loc.completion;
  if(loc.residency)state.inferenceMode=loc.residency;
  if(loc.direction)state.gpuDirection=loc.direction;
  if(loc.condition)state.powerCondition=loc.condition;
  changeView(loc.view,loc.mode,loc.index,null,loc.powerMs);
}
window.addEventListener('hashchange',openAddress);
window.addEventListener('nvmespec:visibility',event=>{if(!event.detail)stopPlay();});
initInferenceClock();
initStartupTiming();
try{initRenderer();}catch(error){renderer=undefined;console.warn(error);}
openAddress();
