(()=>{
"use strict";
const T=window.CAD3D,$=id=>document.getElementById(id);
const canvas=$("model"),stage=canvas.parentElement;
const labels={
 board:"PCB 板体",edge:"M.2 金手指",controller:"主控芯片",dram:"LPDDR4",nand:"V-NAND 封装",power:"供电区域",passives:"分立器件",artwork:"阻焊、焊盘与丝印",top_label:"正面标签",bottom_label:"背面标签",
 pcb_stack:"板层与器件参考",pcie_path:"PCIe 差分通道",dram_path:"DRAM 接口",nand_path:"NAND 通道",power_path:"供电与回流",
 asic_pkg:"封装与基板",asic_die:"芯片基底",asic_host:"主机接口 / NVMe",asic_dma:"DMA",asic_ftl:"处理器 / FTL",asic_sram:"片上 SRAM",asic_dram:"外部 DRAM 接口",asic_ecc:"ECC 引擎",asic_nand:"NAND 接口",asic_link:"片上互连",
 cell_frame:"单元参考面",cell_vdd:"电源 VDD",cell_vss:"地 VSS",cell_wl:"字线 WL",cell_bl:"位线 BL",cell_blb:"互补位线 BLB",cell_q:"存储节点 Q",cell_qb:"互补节点 QB",cell_access:"接入晶体管",cell_cmos:"交叉耦合反相器",cell_text:"电路标记",
 flash_pkg:"NAND 封装与叠片",flash_string:"垂直沟道 / 存储串",flash_wl:"堆叠字线",flash_trap:"电荷陷阱区",flash_select:"选择晶体管",flash_io:"位线与源端",
 on_pcie:"PCIe 差分线与边带",on_memory:"DRAM / NAND 信号线",on_supply:"输入、开关与稳压输出",
 host_board:"参考主板",host_pads:"SMT 焊盘",host_spring:"67 个弹片与焊尾",host_lid:"插座上盖",host_socket:"导向槽与防呆筋",host_fix:"螺钉、承柱与焊盘"
};
const boardZones={
 ctrl:["Pascal 主控","镀镍边框内有七个功能区。左下部 SRAM 区里嵌着一整个位单元。"],
 sram:["片上 6T SRAM","六只晶体管直接画在 Pascal 的 SRAM 区。点选位线、字线或反馈线可辨认电气节点。"],
 phy:["PCIe PHY · 四组收发器","每条 Lane 的橙色发送路径有串化器和驱动器。蓝绿色接收路径有均衡、时钟恢复和解串。点选内部方块可查看职责。"],
 dram:["LPDDR4 阵列","在板载 DRAM 的开窗内辨认交叉的字线、位线与感测放大器带。"],
 pmic:["供电区 IC","方形器件内以高低侧开关、PWM 与驱动线演示降压。供电角色按周边布局推断。"],
 coil:["输出电感示例","原器件的两枚端头之间露出磁芯和铜绕组。转动视角可以看到绕组的立体形状。"],
 cap:["滤波电容示例","阶梯剖口露出陶瓷与内电极。相邻电极交替连接原有的两端电极。"],
 switch:["RB990 · 负载开关","主控右侧的 TPS22990。窗口里可以点选串联功率 MOS 和驱动区，另三枚同顶标器件保留封装。"],
 nand_a:["NAND A · 封装叠片","在第一颗 NAND 的开窗内看裸片、层间黏合膜和代表性封装引线。"],
 nand_b:["NAND B · 垂直存储串","第二颗 NAND 将存储串纵剖沿板面展开，便于看字线、沟道和陷阱层。两颗实物均使用 TLC。"]
};
const nets=new Set(["on_pcie","on_memory","on_supply"]);
const cardViews=new Set(["mounted","physical","stack"]);
const stackViewMode=v=>v==="stack"||v==="system";
const explodedSsd=v=>v==="ssd-explode";
const evidenceView=v=>stackViewMode(v)||explodedSsd(v);
const boardView=v=>cardViews.has(v)||v==="installed"||v==="system"||explodedSsd(v);
const guides=JSON.parse($("link-guide").textContent);
const storyNames={train:"建立链路",read:"读 4 KiB",write:"写 4 KiB"};
const directions={up:"SSD TX → 主机 RX",down:"主机 TX → SSD RX",both:"两端收发 · 独立方向",
 host:"主机内存 · 此步没有跨卡传输",side:"主机 → SSD · 供电、参考时钟与复位",wake:"主机 / SSD · 开漏时钟请求",
 dram:"主控与工作存储 · 可能命中片上缓存",nand_in:"NAND A → 主控 · 板内总线",nand_out:"主控 → NAND A · 板内总线"};
const viewInfo={
 system:["Framework Desktop · 正面主槽","观察 990 PRO 的上机位置，或播放一次 4 KiB 读写。","主板与插槽使用原厂 CAD。主板内部走线、内存窗口和芯片剖面采用原理推演。"],
 mounted:["整板原位剖视","点击板上标注就地放大，点击内部器件查看名称。","封装和器件落点按实物定位。内部剖面、层数与彩色电路按原理放大绘制。"],
 physical:["实物结构","按同容量样品的封装、连接器和板面位置重建。","实物重建。芯片内部、板内走线及封装高度另需专用测量。"],
 "ssd-explode":["SSD 本体 · 爆炸展开","正背标签、封装与周边器件依次离板，随后展开 PCB。","器件位置与标签据拆解照片重建。六铜层、铜线和孔壁为原理示意。展开距离用于观察。"],
 installed:["上机装配","查看卡边两面的弹片、焊尾，以及固定端的螺钉与有肩承柱。","插座和承柱按选定主板侧器件的公开图纸绘制，弹片曲线、盖内分隔、示例主板外形及部分高度为建模值。"],
 stack:["PCB 逐层剥开","在同一位置剥开铜层与介质，沿卡边走线到主控。","铜层、参考面、板内走线、封装球位及其关键尺寸采用功能推演。"],
 pcb:["PCB 内层原理","板级电气原理示意 · 可点选通道、端点与板层。","原理示意。层次、过孔与线形用于说明连接关系，真实叠层及布线未公开。"],
 asic:["主控 ASIC 剖视","功能架构示意 · 橙色标出当前命令步骤涉及的功能块。","功能示意。方块位置、比例与互连线仅用于说明职责和数据流。"],
 cell:["6T SRAM 单元","通用 CMOS 电路示意 · 橙色标出所选工况的反馈或放电通路。","通用六晶体管静态存储机理。结构展示电气关系，未使用三星工艺版图。"],
 flash:["V-NAND 单元","介质结构示意 · 封装叠片与放大的垂直存储串使用不同尺度。","本图截取少量字线层。叠片数量、膜厚、电压和窗口间距属于示意参数。"]
};
const flows={
 read:[
  ["取得读命令",["asic_host","asic_dma"],"主机更新提交队列门铃。控制器取回命令，识别逻辑地址与主机数据缓冲区。"],
  ["查找物理地址",["asic_ftl","asic_sram","asic_dram"],"FTL 把逻辑地址映射为物理页。映射访问可命中片上 SRAM，也可能访问外部 DRAM。"],
  ["读 NAND 并纠错",["asic_nand","asic_ecc","asic_sram"],"目标通道发出读页操作。返回的数据经过 ECC 解码，必要时可尝试读重试。"],
  ["DMA 回传与完成",["asic_sram","asic_dma","asic_host"],"DMA 将数据传入主机缓冲区，控制器向完成队列写入结果。"]
 ],
 write:[
  ["取得命令与数据",["asic_host","asic_dma","asic_sram"],"控制器取得写命令，经 DMA 从主机缓冲区读入待写数据。"],
  ["映射与空间分配",["asic_ftl","asic_sram","asic_dram"],"FTL 选择写入位置，并准备记录此逻辑地址的新映射。"],
  ["ECC 编码与编程",["asic_ecc","asic_nand"],"控制器生成纠错冗余，向目标 NAND 通道发送数据并执行编程。"],
  ["提交映射与完成",["asic_ftl","asic_dram","asic_host"],"按控制器策略维护映射并报告完成。易失缓存、FUA 与 Flush 会改变完成时可依赖的持久性，写入 DRAM 本身不能保证掉电后保留。"]
 ]
};
const cases={
 hold:{groups:["cell_q","cell_qb","cell_vdd","cell_vss"],desc:"WL 为低，两只接入管截止。交叉反馈使 Q 侧上拉管及 QB 侧下拉管导通，Q 维持高电平，QB 维持低电平。位线与单元隔离。"},
 read1:{groups:["cell_wl","cell_blb","cell_qb","cell_vss"],desc:"BL 与 BLB 先预充至高电平。WL 拉高，两只接入管导通。QB≈0 一侧形成放电通路，BLB 略降，BL 保持较高，感测放大器据此判读 Q=1。"},
 read0:{groups:["cell_wl","cell_bl","cell_q","cell_vss"],desc:"两根位线先预充至高电平。WL 拉高，两只接入管导通。Q≈0 一侧形成放电通路，BL 略降，BLB 保持较高，感测放大器据此判读 Q=0。"}
};
let view="mounted",direction="read",step=0,cell="hold",threshold=0,face=1,annotations=true,selected=null;
let showNets=true,focusedZone="";
let story="",storyIndex=0,traceLane=-1,openLid=false,hideCarrier=false;
let liftScrew=false,peelLabel=false;
const pairs=[],traceIds=new Set();
const stickers={top_label:false,bottom_label:false},parts=[],partIds=new Map(),groups=new Map(),meshOwner=new Map();
const stackView=window.createBoardStack({T,$,guides,parts,partById:key=>partIds.get(key),visible,box:bounds,project,svg,refresh:refreshStack,frame,animateFrame,setView,choose,draw:schedule});
let scene,camera,controls,renderer,root=null,w=1,h=1,span=.12,pending=false,focusOn=null;
let cameraMotion=0;
let frameworkLoad=null,frameworkReady=false,viewRequest=0;
const SVG="http://www.w3.org/2000/svg";
function svg(tag,a,parent){const e=document.createElementNS(SVG,tag);for(const [k,v] of Object.entries(a))e.setAttribute(k,v);parent.append(e);return e;}
function fail(msg){$("loading").hidden=true;$("error").hidden=false;$("error").textContent=msg;}
const list=(value)=>Array.isArray(value)?value:[value];
function visible(p){
 if(view==="system")return stackView.showSystem(p);
 if(explodedSsd(view))return stackView.showSsdAssembly(p);
 return p.view===view&&(view!=="physical"||!(p.group in stickers)||stickers[p.group])
 &&(view!=="stack"||stackView.show(p))
 &&!(view==="physical"&&peelLabel&&p.group==="bottom_label"&&!["bottom_adh","bottom_cu"].includes(p.id))
 &&(view!=="mounted"||showNets||!nets.has(p.group))
 &&(view!=="installed"||!(openLid&&p.group==="host_lid"||hideCarrier&&p.group==="host_board"));}
function groupParts(key){return (groups.get(key)||[]).filter(p=>p.view===view);}
function named(id){return parts.find(p=>p.view===view&&p.id===id);}
function representative(key){
 const a=groupParts(key);
 if(key==="edge"){const pin=a.find(p=>p.obj.name.endsWith("m2_pin_"+(camera.position.y>=controls.target.y?"35":"36")));if(pin)return pin;}
 const namedIds={pcb_stack:"pcb_ground",pcie_path:"pcb_PER1",dram_path:"pcb_dram_dq",nand_path:"pcb_nand_1_dq",power_path:"pcb_power_l",flash_pkg:"flash_stack",flash_string:"flash_poly",flash_wl:"flash_wl_3",flash_trap:"flash_nitride",flash_io:"flash_bitline",flash_select:"flash_sgd"};
 if(namedIds[key]){const specific=named(namedIds[key]);if(specific)return specific;}
 return a.reduce((best,p)=>p.weight>(best?.weight??-1)?p:best,null);
}
function bounds(part){
 const box=new T.Box3();for(const mesh of part.meshes)box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));return box;
}
function sceneBounds(set){const box=new T.Box3();for(const p of set)box.union(bounds(p));return box;}
function showScene(){
 for(const part of parts){
   part.obj.visible=visible(part);
   if(part.id==="host_screw")part.obj.position.y=liftScrew?.003:0;
   if(part.view==="stack" && stackViewMode(view))part.obj.position.y=stackView.offset(part);
   if(part.view==="stack" && explodedSsd(view) && !stackView.ssdAssembling())part.obj.position.y=0;
 }
 root.updateMatrixWorld(true);
}
function refreshStack(refit=false){
 showScene();options();
 if(selected?.items.every(p=>!visible(p)))choose(null);else recolor();
 if(refit)frame();
}
function resize(){
 w=Math.max(1,stage.clientWidth);h=Math.max(1,stage.clientHeight);renderer.setSize(w,h,false);
 projection();
}
function projection(){
 camera.left=-span*w/h/2;camera.right=-camera.left;camera.bottom=-span/2;camera.top=span/2;
 camera.updateProjectionMatrix();schedule();
}
function stopCameraMotion(){
 if(cameraMotion)cancelAnimationFrame(cameraMotion);
 cameraMotion=0;
}
function frame(target=null,keep=false){
 if(!root)return;
 stopCameraMotion();
 const envelope=target?.bounds;
 const items=envelope?[]:target?.items?.filter(visible)||parts.filter(visible);
 if(!envelope&&!items.length)return;
 const box=envelope||sceneBounds(items),mid=box.getCenter(new T.Vector3());
 let dir=keep?camera.position.clone().sub(controls.target):
  target?.assembly==="ssd-explode"?new T.Vector3(-.28,1.13*face,1.81):
  target?.assembly?new T.Vector3(-.46,1.05*face,1.77):
  target?.chip?new T.Vector3(-.20,1.90,1.05):
 view==="system"?new T.Vector3(-.18,2.65*face,1.34):
  view==="installed"?new T.Vector3(-.60,1.25*face,1.78):
  view==="stack"&&stackView.isExploded()?(stackView.isViaFocus()?new T.Vector3(-.60,1.64*face,2.05):new T.Vector3(-.39,.79*face,2.15)):
  boardView(view)?new T.Vector3(-.15,2.40*face,1.05):
  view==="pcb"?new T.Vector3(.34,1.66,1.18):
  view==="asic"?new T.Vector3(.10,2.35,1.1):view==="flash"?new T.Vector3(.30,1.1,1.8):new T.Vector3(0,3.8,.95);
 dir.normalize();
 const radius=Math.max(.055,sceneBounds(parts.filter(visible)).getSize(new T.Vector3()).length()*5);
 camera.zoom=1;controls.target.copy(mid);camera.position.copy(mid).addScaledVector(dir,radius);camera.lookAt(mid);camera.updateMatrixWorld(true);
 const ext=new T.Box3();
 const include=(b,matrix)=>{
   for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
     const vertex=new T.Vector3(x,y,z);
     if(matrix)vertex.applyMatrix4(matrix);
     ext.expandByPoint(vertex.applyMatrix4(camera.matrixWorldInverse));
   }
 };
 if(envelope)include(envelope);
 else for(const p of items)for(const m of p.meshes)include(m.geometry.boundingBox,m.matrixWorld);
 const size=ext.getSize(new T.Vector3()),center=ext.getCenter(new T.Vector3());
 const showLayerLabels=view==="stack"&&stackView.isExploded()&&!stackView.isViaFocus();
 const compactSsd=target?.assembly==="ssd-explode"&&w<630;
 const occX=target?.80:showLayerLabels?.78:view==="cell"?.77:view==="asic"?.73:.86;
 const occY=compactSsd?.49:target?.66:showLayerLabels?.79:boardView(view)?.69:.73;
 span=Math.max(size.x/(w/h*occX),size.y/occY,target?.00019:radius*.019);
 const hudOffset=compactSsd?span*41/h:0;
 const delta=new T.Vector3(center.x,center.y-hudOffset,0).applyQuaternion(camera.quaternion);camera.position.add(delta);controls.target.add(delta);
 camera.near=Math.max(1e-6,radius/10000);camera.far=Math.max(2,radius*8);
 focusOn=target;resize();controls.update();schedule();
}
function animateFrame(target){
 if(!root)return;
 const snapshot=()=>({eye:camera.position.clone(),target:controls.target.clone(),span:span/camera.zoom});
 const from=snapshot();
 frame(target);
 if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const to=snapshot();
 const duration=430;
 let start=null;
 const move=(now)=>{
   if(start===null)start=now;
   const p=Math.min(1,(now-start)/duration),u=p*p*(3-2*p);
   camera.position.lerpVectors(from.eye,to.eye,u);
   controls.target.lerpVectors(from.target,to.target,u);
   span=from.span*Math.pow(to.span/from.span,u);
   camera.lookAt(controls.target);controls.update();projection();
   cameraMotion=p<1?requestAnimationFrame(move):0;
 };
 move(performance.now());
}
function project(v){const z=v.clone().project(camera);return {x:(z.x+1)*w/2,y:(1-z.y)*h/2};}
function schedule(){if(!root||pending)return;pending=true;requestAnimationFrame(()=>{pending=false;
 stage.dataset.magnified=String(!!focusOn||camera.zoom>1.45);renderer.render(scene,camera);axes();drawLabels();
 if(stackViewMode(view))stackView.drawPlayback();});}
function axes(){
 const a=$("axes");a.replaceChildren();const inv=camera.quaternion.clone().invert();
 const vs=[["X",new T.Vector3(1,0,0),"#a46150"],["Y",new T.Vector3(0,0,-1),"#388166"],["Z",new T.Vector3(0,1,0),"#527294"]];
 for(const [key,v,color] of vs){v.applyQuaternion(inv);const x=30+v.x*20,y=28-v.y*20;
  svg("line",{x1:30,y1:28,x2:x,y2:y,stroke:color,"stroke-width":2},a);
  svg("circle",{cx:x,cy:y,r:2,fill:color},a);svg("text",{x:x+Math.sign(v.x)*5,y:y-Math.sign(v.y)*5+3,"text-anchor":"middle",fill:color,"font-size":10,"font-weight":700},a).textContent=key;
 }
}
function isActive(p){
 if(view==="mounted"&&story)return tracePart(p);
 if(view==="asic")return flows[direction][step][1].includes(p.group);
 if(view==="cell"){
   if(cases[cell].groups.includes(p.group))return true;
   const id=p.obj.name.toLowerCase();
   if(cell==="hold")return p.group==="cell_cmos"&&/^cell_(p_l|n_r)(?:$|_)/.test(id);
   if(!["cell_access","cell_cmos"].includes(p.group))return false;
   const qb=/(qb|right|(?:^|_)r(?:_|$))/.test(id),q=/(?:^|_)q(?:_|$)|left|(?:^|_)l(?:_|$)/.test(id);
   return (cell==="read1"?qb:q)&&(p.group==="cell_access"||/(^cell_n_|nm|pull_down|pulldown|pd)/.test(id));
 }
 return false;
}
function recolor(){
 const activeColor=new T.Color("#f4a952"),selectedColor=new T.Color("#4db98f"),softGray=new T.Color("#8c928d");
 for(const p of parts){if(!visible(p))continue;const chosen=!selected?.context&&selected?.items.includes(p),lit=isActive(p);
   for(const mesh of p.meshes)for(const m of list(mesh.material)){
     if(!m.color)continue;const base=m.userData.cadColor;m.color.copy(base);
     if(m.emissive)m.emissive.copy(m.userData.cadEmissive);
     if(explodedSsd(view)&&p.stack){stackView.colorSsdAssembly(p,m,chosen);continue;}
     if(stackViewMode(view)&&p.stack){stackView.color(p,m,chosen);continue;}
     if(chosen){m.color.lerp(selectedColor,.45);if(m.emissive)m.emissive.setHex(0x124432);}
     else if(lit&&view==="mounted"&&story){
       const color=p.link?.direction==="up"?0xf19125:p.link?.direction==="down"?0x387fd4:0xc88b27;
       m.color.lerp(new T.Color(color),.72);if(m.emissive)m.emissive.setHex(color).multiplyScalar(.23);
     }else if(lit){
       const trace=view!=="asic"||p.obj.name.endsWith("_macro");
       if(trace){m.color.lerp(activeColor,view==="asic"?.74:.44);if(m.emissive)m.emissive.setHex(0x402003);}
     }else if(view==="mounted"&&story&&p.link)m.color.lerp(softGray,.83);
     else if(view==="asic"&&p.obj.name.endsWith("_macro"))m.color.lerp(softGray,.64);
     else if(view==="flash"&&p.obj.name==="flash_nitride")m.color.lerp(activeColor,threshold/7*.82);
   }
 }schedule();
}
function makeSelect(items,group,name,description){return {items,group,name,description};}
function focusZone(key){
 const info=boardZones[key];if(view!=="mounted"||!info)return;
 const items=parts.filter(p=>visible(p)&&(p.zone===key||(key==="ctrl"&&["sram","phy"].includes(p.zone))));
 if(!items.length)return;
 if(story)stopTrace(false);
 face=1;focusedZone=key;
 const context={...makeSelect(items,"on_"+key,info[0],info[1]),context:true};
 choose(context);frame(context);options();
}
function pick(part){
 if(!part){choose(null);return;}
 const evidence=part.stack?.evidence||(evidenceView(view)&&part.view==="physical"?"photo":undefined);
 choose({...makeSelect([part],part.group,part.label,part.desc||labels[part.group]),evidence});
}
function choose(s){
 selected=s;$("selection").textContent=s?.name||(boardView(view)?"整板":"当前场景");
 $("selection-info").textContent=s?.description||"点选模型或图例查看名称。";
 $("pick-evidence").hidden=!s?.evidence;
 $("pick-evidence").dataset.evidence=s?.evidence||"";
 $("pick-evidence").textContent=stackView.evidence[s?.evidence]||"";
 $("focus").disabled=!s;
 const next=view==="mounted"?null:s?.group==="controller"?"asic":s?.group==="asic_sram"?"cell":s?.group==="nand"||s?.group==="asic_nand"?"flash":null;
 $("drill").hidden=!next;$("drill").textContent=next==="asic"?"打开主控剖视":next==="flash"?"打开 V-NAND 单元":"打开 6T SRAM";$("drill").onclick=()=>setView(next);
 document.querySelectorAll(".item").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.group===s?.group)));
 recolor();
}
function options(){
 $("mounted-options").hidden=view!=="mounted";
 $("link-options").hidden=view!=="mounted";$("mount-options").hidden=view!=="installed";
 $("mount-lid").setAttribute("aria-pressed",String(openLid));$("mount-board").setAttribute("aria-pressed",String(hideCarrier));
 $("mount-screw").setAttribute("aria-pressed",String(liftScrew));
 $("physical-options").hidden=view!=="physical";$("flow").hidden=view!=="asic";$("cell-options").hidden=view!=="cell";$("flash-options").hidden=view!=="flash";$("flip").hidden=!boardView(view);
 $("pcb-options").hidden=view!=="pcb";
 $("legend-panel").hidden=evidenceView(view);
 $("legend-title").textContent=({mounted:"板上网络",physical:"器件图例",installed:"主板安装件",pcb:"板层与网络",asic:"功能块",cell:"节点与器件",flash:"结构与材料"})[view]||"证据颜色";
 $("mode-name").textContent=viewInfo[view][0];$("mode-tip").textContent=viewInfo[view][1];$("display-info").textContent=viewInfo[view][2];
 for(const b of document.querySelectorAll("button[data-view]"))b.setAttribute("aria-pressed",String(b.dataset.view===view));
 for(const k of Object.keys(stickers))$(k).setAttribute("aria-pressed",String(stickers[k]));
 $("peel-label").setAttribute("aria-pressed",String(peelLabel));
 for(const b of document.querySelectorAll("[data-zone]"))b.setAttribute("aria-pressed",String(b.dataset.zone===focusedZone));
 $("show-nets").checked=showNets;
 $("anno").setAttribute("aria-hidden",String(view!=="mounted"));
 if(view==="mounted"&&focusedZone)$("mode-name").textContent="整板原位剖视 · "+boardZones[focusedZone][0];
 if(view==="mounted"&&story){$("mode-name").textContent=storyNames[story]+" · "+guides[story][storyIndex].title;$("mode-tip").textContent="箭头沿模型上的线路标出本步方向。点选触点或功能区可查看实物位置。";}
 $("trace-badge").hidden=!(view==="mounted"&&story);
 $("annotate").setAttribute("aria-pressed",String(annotations));document.body.dataset.view=view;
 stackView.sync(stackViewMode(view),explodedSsd(view));
}
function legend(){
 const box=$("parts");box.replaceChildren();
 for(const [key,label] of Object.entries(labels)){
  if(view==="mounted"&&!nets.has(key))continue;
  if(view==="installed"&&!key.startsWith("host_"))continue;
  const items=groupParts(key);if(!items.length)continue;
  const rep=representative(key),m=list(rep.meshes[0].material)[0];
  const b=document.createElement("button");b.type="button";b.className="item";b.dataset.group=key;b.setAttribute("aria-pressed","false");
  const sw=document.createElement("span");sw.className="chip";if(m.userData.cadColor)sw.style.background="#"+m.userData.cadColor.getHexString();
  b.append(sw,document.createTextNode(label));b.onclick=()=>{
   if(view==="mounted"&&!showNets){showNets=true;showScene();options();}
   if(view==="installed"&&(key==="host_lid"||key==="host_board")){
     if(key==="host_lid")openLid=false;else hideCarrier=false;showScene();options();
   }
   if(key in stickers&&!stickers[key]){stickers[key]=true;options();showScene();}
   choose(makeSelect(items,key,label,rep.desc||rep.label));
  };box.append(b);
 }
}
function setStep(flow,index){
 direction=flow;step=index;const seq=flows[flow],container=$("steps");container.replaceChildren();
 for(const key of Object.keys(flows))$(key).setAttribute("aria-pressed",String(key===flow));
 seq.forEach(([title],i)=>{const b=document.createElement("button");b.type="button";b.className="step";b.dataset.step=i;b.setAttribute("aria-pressed",String(i===index));
  const n=document.createElement("span");n.className="number";n.textContent=String(i+1);b.append(n,document.createTextNode(title));b.onclick=()=>setStep(flow,i);container.append(b);});
 $("step-status").textContent=(index+1)+" / "+seq.length;$("step-desc").textContent=seq[index][2];document.body.dataset.flow=flow+"-"+index;
 choose(null);
}
function setCell(key){cell=key;for(const b of document.querySelectorAll("button[data-cell]"))b.setAttribute("aria-pressed",String(b.dataset.cell===key));
 $("cell-desc").textContent=cases[key].desc;document.body.dataset.cellState=key;choose(null);}
function setThreshold(n){
 threshold=n;
 const container=$("windows");container.replaceChildren();
 for(let i=0;i<8;i++){
   const b=document.createElement("button");b.type="button";b.dataset.window=String(i);b.textContent=i===0?"E":"P"+i;
   b.setAttribute("aria-pressed",String(i===n));b.onclick=()=>setThreshold(i);container.append(b);
 }
 const head=n===0?"E 为擦除态，位于该示意的最低阈值窗口。":"P"+n+" 为第 "+n+" 个编程态，读电路通过参考电压分辨其相对阈值窗口。";
 $("flash-desc").textContent=head+"八个可分辨的范围可编码 3 位。陷阱区着色仅标记所选窗口，具体电压与码字映射随实现变化。";
 document.body.dataset.threshold=String(n);
 choose(null);
}
function activateView(next){
 stopCameraMotion();
 const spread=(view==="stack"||next==="stack")&&stackView.isExploded();
 const compare=cardViews.has(view)&&cardViews.has(next)&&!spread&&view!==next&&document.body.dataset.ready==="true";
 stackView.useView(next);
 view=next;focusOn=null;focusedZone="";if(!compare)face=1;
 showScene();options();legend();choose(null);
 if(explodedSsd(view)){stackView.openSsdAssembly();return;}
 if(view==="asic")setStep(direction,step);if(view==="cell")setCell(cell);if(view==="flash")setThreshold(threshold);
 if(compare)schedule();else if(!stackView.focusAssembly(frame))frame();
 if(stackViewMode(view))stackView.enter();
}
function setView(next){
 if(!root||!Object.hasOwn(viewInfo,next))return;
 const request=++viewRequest;
 $("error").hidden=true;
 if(next==="system"&&!frameworkReady)return enterSystem(request);
 $("loading").hidden=true;
 activateView(next);
 return true;
}
async function enterSystem(request){
 $("loading").textContent="正在读取 Framework 主板…";
 $("loading").hidden=false;
 try{
   frameworkLoad??=loadFramework();
   await frameworkLoad;
   if(request!==viewRequest)return false;
   $("loading").hidden=true;
   activateView("system");
   return true;
 }catch(e){
   frameworkLoad=null;
   if(request===viewRequest)fail("主板模型读取失败。"+e.message);
   return false;
 }
}
function zoom(f){stopCameraMotion();camera.zoom=Math.max(controls.minZoom,Math.min(camera.zoom*f,controls.maxZoom));camera.updateProjectionMatrix();schedule();}
function tracePairs(direction){
 return pairs.filter(p=>(traceLane<0||p.link.lane===traceLane)&&(direction==="both"||p.link.direction===direction));
}
function tracePart(p){return traceIds.has(p.id);}
function updateTrace(){
 const on=!!story,active=on?guides[story][storyIndex]:null;
 traceIds.clear();
 $("story-panel").hidden=!on;$("trace-stop").hidden=!on;$("story-stack").hidden=!(story==="read"||story==="write");
 for(const b of document.querySelectorAll("[data-story]"))b.setAttribute("aria-pressed",String(b.dataset.story===story));
 document.body.dataset.story=story;document.body.dataset.storyIndex=on?String(storyIndex):"";
 if(on){
   const d=active.direction,crossing=tracePairs(d);
   for(const id of active.targets)traceIds.add(id);
   for(const part of crossing){
     traceIds.add(part.id);
     const tx=part.link.direction==="up",lane=part.link.lane;
     traceIds.add("on_package_"+(tx?"PET":"PER")+lane);
     for(const unit of (tx?["ser","driver"]:["eq","cdr","des"]))traceIds.add("on_asic_phy_"+lane+"_"+unit);
     for(const pin of part.link.pins){traceIds.add("on_m2_pin_"+String(pin).padStart(2,"0"));
       if(part.link.direction==="up"){traceIds.add("on_ac_"+pin);traceIds.add("on_ac_"+pin+"_ends");}}
   }
   const side=d==="side"?[2,4,12,14,16,18,70,72,74,50,53,55]:d==="wake"?[52,53,55]:[];
   if(d==="side"||d==="wake"||d==="both")traceIds.add("on_asic_phy_pll");
   for(const pin of side)traceIds.add("on_m2_pin_"+String(pin).padStart(2,"0"));
   $("trace-packet").textContent=active.packet;$("trace-direction").textContent=directions[d];
   $("story-title").textContent=active.title;$("story-text").textContent=active.detail;
   $("story-count").textContent="步骤 "+(storyIndex+1)+" / "+guides[story].length;
   $("story-prev").disabled=storyIndex===0;$("story-next").disabled=storyIndex===guides[story].length-1;
   $("trace-focus").disabled=!traceIds.size;$("trace-lane").value=String(traceLane);
   $("trace-lane").disabled=!crossing.length&&!["both","up","down"].includes(d);
   const pinText=dir=>crossing.filter(p=>p.link.direction===dir).map(p=>"#"+p.link.pins[0]+"−/"+p.link.pins[1]+"+").join("、");
   $("lane-key").textContent=crossing.length?["up","down"].filter(dir=>pinText(dir)).map(dir=>directions[dir]+"  "+pinText(dir)).join(" ｜ "):
       d==="side"?"#53/55 REFCLK · #50 PERST# · 3.3 V":d==="wake"?"#52 CLKREQ# · #53/55 REFCLK":directions[d];
 }
 options();recolor();
}
function setTrace(mode,index=0,lane=traceLane){
 if(!guides[mode])return;
 if(view!=="mounted")setView("mounted");
 const wasFocused=Boolean(focusOn);
 story=mode;storyIndex=Math.min(guides[mode].length-1,Math.max(0,index));traceLane=lane;
 focusedZone="";face=1;showNets=true;showScene();choose(null);updateTrace();
 if(wasFocused&&traceIds.size)focusTrace();else if(wasFocused)frame();
}
function stopTrace(reset=true){
 story="";storyIndex=0;choose(null);updateTrace();if(reset)frame();
}
function focusTrace(){
 const items=parts.filter(p=>visible(p)&&tracePart(p));if(!items.length)return;
 const s={...makeSelect(items,"",guides[story][storyIndex].title,guides[story][storyIndex].detail),context:true};
 choose(s);face=1;frame(s);
}
function drawVectors(layer){
 if(camera.position.y<controls.target.y)return;
 const d=guides[story][storyIndex].direction;
 let routes=tracePairs(d);
 if(d.startsWith("nand"))routes=[named("on_nand_link_0")];
 if(d==="dram")return;  // A mapping cache hit may generate no external DRAM transfer.
 for(const part of routes){
   if(!part||!visible(part))continue;
   const link=part.link,reverse=link.direction==="up"||d==="nand_in";
   let pts=link.path_mm.map(([x,y,z])=>project(new T.Vector3(x/1000,z/1000,-y/1000)));
   if(reverse)pts.reverse();
   const segments=pts.slice(1).map((b,i)=>({a:pts[i],b,len:Math.hypot(b.x-pts[i].x,b.y-pts[i].y)}));
   const total=segments.reduce((sum,s)=>sum+s.len,0);if(total<5)continue;
   const color=link.kind==="nand"?"#a25314":reverse?"#a24b0a":"#185b97";
   const group=svg("g",{class:"story-vector","data-route":part.id,"data-direction":d},layer);
   const fractions=total>160?[.34,.73]:[.56];
   for(const f of fractions){
     let remaining=f*total;
     for(const seg of segments){
       if(remaining>seg.len||seg.len<.1){remaining-=seg.len;continue;}
       const dx=(seg.b.x-seg.a.x)/seg.len,dy=(seg.b.y-seg.a.y)/seg.len;
       const x=seg.a.x+dx*remaining,y=seg.a.y+dy*remaining,r=total>100?6.5:3.7;
       if(x<3||x>w-3||y<3||y>h-3)break;
       const triangle=[[x+dx*r,y+dy*r],[x-dx*r-dy*r*.72,y-dy*r+dx*r*.72],[x-dx*r+dy*r*.72,y-dy*r-dx*r*.72]];
       svg("polygon",{points:triangle.map(v=>v.join(",")).join(" "),fill:color,stroke:"#fff9e9","stroke-width":.85},group);break;
     }
   }
 }
}
function focusMount(key){
 if(view!=="installed")setView("installed");
 const socket=key==="socket";
 if(socket)openLid=true;else liftScrew=true;
 showScene();options();
 const items=parts.filter(p=>visible(p)&&(socket?["host_socket","host_spring","host_pads"].includes(p.group):p.group==="host_fix"));
 const s={...makeSelect(items,"",socket?"M-key 插座 · 剖开上盖":"M2 固定位 · 提起螺钉",
  socket?"上层奇数针从壳后焊入主板，下层偶数针的焊尾落在入口侧。点一枚弹片可读对应针号。":
         "螺钉沿轴线向上移开 3 mm。Ø3.00 定心颈仍在卡尾半孔中，Ø4.50 承面支撑卡底。"),context:true};
 choose(s);face=1;frame(s);
}
function applyHash(){
 const [mode,num,lane,destination]=location.hash.slice(1).split("/");
 if(mode==="stack")stackView.hash(num,lane,destination);
 else if(mode==="system")Promise.resolve(setView("system")).then(open=>{
   if(!open)return;
   if(num==="explode")stackView.openAssembly();
   else{
     stackView.closeAssembly();
     if(num==="read"||num==="write")stackView.play(num,Math.max(0,(Number(lane)||1)-1),undefined,destination);
   }
 });
 else if(mode==="mount"){setView("installed");if(num==="socket"||num==="fix")focusMount(num);}
 else if(mode==="zone"&&Object.hasOwn(boardZones,num)){setView("mounted");focusZone(num);}
 else if(mode==="thermal"){setView("physical");peelLabel=false;$("peel-label").click();}
 else if(Object.hasOwn(guides,mode))setTrace(mode,Math.max(0,(parseInt(num,10)||1)-1),/^[0-3]$/.test(lane||"")?Number(lane):-1);
 else if(Object.hasOwn(viewInfo,mode))setView(mode);
}
function annotation(part,text,rail,hot=false){return part&&visible(part)?{part,text,rail,hot}:null;}
function visibleSurface(part,desired){
 if(!part.probes){
   part.probes=[];
   for(const mesh of part.meshes){
     const geom=mesh.geometry,positions=geom.attributes.position,indices=geom.index;
     const n=Math.floor((indices?indices.count:positions.count)/3),stride=Math.max(1,Math.floor(n/160));
     for(let i=0;i<n;i+=stride){
       const sample=new T.Vector3();
       for(let j=0;j<3;j++){const k=indices?indices.getX(i*3+j):i*3+j;sample.add(new T.Vector3().fromBufferAttribute(positions,k));}
       part.probes.push(sample.multiplyScalar(1/3).applyMatrix4(mesh.matrixWorld));
     }
   }
 }
 const at=project(desired),samples=part.probes.map(p=>({p,xy:project(p)}));
 samples.sort((a,b)=>Math.hypot(a.xy.x-at.x,a.xy.y-at.y)-Math.hypot(b.xy.x-at.x,b.xy.y-at.y));
 const targets=parts.filter(visible).flatMap(p=>p.meshes),ray=new T.Raycaster();
 for(const {xy} of samples){
   ray.setFromCamera(new T.Vector2(2*xy.x/w-1,1-2*xy.y/h),camera);
   const hit=ray.intersectObjects(targets,false)[0];
   if(hit&&meshOwner.get(hit.object)===part)return xy;
 }
 return null;
}
function tagDefs(){
 const rep=representative,a=annotation,front=camera.position.y>=controls.target.y;
 if(evidenceView(view))return stackView.tags(a,front,!!focusOn);
 if(view==="mounted"){
   if(story){
     const current=guides[story][storyIndex],items=current.targets.map(named).filter(Boolean);
     if(!front)return [50,52].filter(n=>current.direction==="side"||current.direction==="wake").map(n=>a(named("on_m2_pin_"+n),"#"+n+(n===50?" PERST#":" CLKREQ#"),"bottom"));
     if(current.direction==="host")return [];
     const routes=tracePairs(current.direction);
     const primary=routes.find(p=>p.link.direction==="up")||routes[0];
     return [primary&&a(named("on_m2_pin_"+String(primary.link.pins[0]).padStart(2,"0")),"M.2 · Lane "+primary.link.lane,"bottom",true),
             items[0]&&a(items[0],current.direction==="side"?"参考时钟":current.direction==="wake"?"时钟请求":"Pascal 主控","top",true),
             current.direction.startsWith("nand")&&a(named("on_a_array"),"NAND A","top",true),
             current.direction==="dram"&&a(named("on_dram_wl"),"LPDDR4","top",true)];
   }
   if(!front)return [a(named("on_reverse_silk"),"背面丝印","top"),a(named("on_m2_pin_36"),"M.2 金手指","bottom")];
   return [a(named("on_asic_ftl_macro"),"Pascal 主控","top"),a(named("on_dram_wl"),"LPDDR4 阵列","top"),
           a(named("on_coil_winding"),"电感绕组","bottom"),a(named("on_pmic_pwm"),"供电区 IC","bottom"),
           a(named("on_a_array"),"NAND A · 叠片","top"),a(named("on_b_flash_wl_3"),"NAND B · 存储串","top")];
 }
 if(view==="physical"){
   if(front&&stickers.top_label)return [a(rep("top_label"),"正面标签","top"),a(rep("edge"),"M.2 金手指","bottom")];
   if(!front)return [peelLabel?a(named("bottom_cu"),"背标内的铜箔","top"):a(rep(stickers.bottom_label?"bottom_label":"board"),stickers.bottom_label?"背面标签":"PCB 背面","top"),a(rep("edge"),"M.2 金手指","bottom")];
   const all=groupParts("nand").filter(p=>/body|package/i.test(p.obj.name));
   const ns=(all.length?all:groupParts("nand")).slice().sort((x,y)=>y.weight-x.weight);
   const first=ns[0],center=first?bounds(first).getCenter(new T.Vector3()):null;
   const second=ns.find(p=>center&&bounds(p).getCenter(new T.Vector3()).distanceTo(center)>.004);
   const chipName=p=>p?.obj.name.includes("U_N1_")?"V-NAND A":p?.obj.name.includes("U_N2_")?"V-NAND B":"V-NAND";
   return [a(rep("power"),"供电区域","bottom"),a(rep("controller"),"主控","top"),a(rep("dram"),"LPDDR4","top"),
     a(first,chipName(first),"top"),a(second,chipName(second),"top"),a(rep("edge"),"M.2 金手指","bottom")];
 }
 if(view==="installed"){
   return [a(named(openLid?"host_pin_41":"host_lid"),openLid?"上排弹片":"TE M-key 插座","top"),
           a(named("host_screw"),"M2 螺钉","top"),a(named("host_standoff"),"定心承柱","bottom")];
 }
 if(view==="pcb"){
   const ref=a(named("pcb_ground")||rep("pcb_stack"),"GND 参考铜面","bottom");
   if(ref)ref.ratio=[.88,.6,.89];
   return [a(named("pcb_PER1")||rep("pcie_path"),"PCIe 差分束","top"),a(named("pcb_dram_dq")||rep("dram_path"),"LPDDR4","top"),a(named("pcb_nand_1_dq")||rep("nand_path"),"NAND 数据线","top"),a(named("pcb_power_l")||rep("power_path"),"输出电感 L","bottom"),ref];
 }
 if(view==="asic"){
  const active=flows[direction][step][1],fallback=["asic_host","asic_ftl","asic_ecc","asic_nand"];
  const keys=[...new Set([...active,...fallback])].slice(0,w<630?3:5);
  const ns={asic_host:"主机接口",asic_dma:"DMA",asic_ftl:"处理器 / FTL",asic_sram:"SRAM",asic_dram:"DRAM 接口",asic_ecc:"ECC",asic_nand:"NAND 接口"};
  return keys.map(k=>a(rep(k),ns[k],["asic_ecc","asic_ftl","asic_dma"].includes(k)?"top":"bottom",active.includes(k)));
 }
 if(view==="flash")return [a(rep("flash_pkg"),"封装叠片","top"),a(rep("flash_string"),"垂直沟道","bottom"),a(rep("flash_wl"),"字线","top"),a(rep("flash_trap"),"电荷陷阱 · "+(threshold===0?"E":"P"+threshold),"bottom")];
 const high=cell!=="read0";
 return [a(rep("cell_wl"),cell==="hold"?"WL 低":"WL 高","top",true),a(rep("cell_q"),high?"Q 高":"Q 低","top",true),a(rep("cell_qb"),high?"QB 低":"QB 高","bottom",true),
 a(rep(high?"cell_blb":"cell_bl"),cell==="hold"?"BLB（隔离）":(high?"BLB 略降":"BL 略降"),"bottom",cell!=="hold")];
}
function drawLabels(){
 const layer=$("anno");layer.replaceChildren();if(!root)return;
 if(view==="mounted"&&story&&showNets)drawVectors(layer);
 if(!annotations||(focusOn&&!evidenceView(view)))return;
 if(view==="system"||explodedSsd(view))stackView.drawAssembly(layer);
 if(focusOn?.chip&&w<630)return;
 if((view==="stack"&&!focusOn)||explodedSsd(view)){
   for(const tag of stackView.layerLabels()){
     const p=project(tag.point),x=Math.min(w-(w<600?27:60),p.x+(w<600?14:30));
     if(p.y<50||p.y>h-54||p.x<8||x<=p.x)continue;
     svg("line",{x1:p.x,y1:p.y,x2:x-4,y2:p.y,class:"stack-layer-line"},layer);
     svg("text",{x,y:p.y+4,class:"stack-layer-label"},layer).textContent=w<600?tag.short:tag.title;
   }
 }
 let tags=tagDefs().filter(Boolean);
 if(!tags.length)return;
 if(w<630&&explodedSsd(view))tags=tags.filter(t=>!["LPDDR4","NAND A","NAND B"].includes(t.text));
 if(w<530&&boardView(view)&&tags.length>4)tags=tags.filter(t=>!["供电区域","M.2 金手指","供电区 IC","电感绕组"].includes(t.text));
 const listBy={top:[],bottom:[]};
 const ys=[];
 if(view!=="system"&&!explodedSsd(view)){
   const modelbox=sceneBounds(parts.filter(visible));
   for(const x of [modelbox.min.x,modelbox.max.x])for(const y of [modelbox.min.y,modelbox.max.y])for(const z of [modelbox.min.z,modelbox.max.z])ys.push(project(new T.Vector3(x,y,z)).y);
 }
 for(const tag of tags){
  const b=bounds(tag.part),point=b.getCenter(new T.Vector3());
  if(tag.ratio){const sz=b.getSize(new T.Vector3());point.set(b.min.x+sz.x*tag.ratio[0],b.min.y+sz.y*tag.ratio[1],b.min.z+sz.z*tag.ratio[2]);}
  const pos=view==="flash"?visibleSurface(tag.part,point):project(point);if(!pos)continue;
  if(pos.x<10||pos.x>w-10||pos.y<16||pos.y>h-16)continue;
  const len=[...tag.text].reduce((n,c)=>n+(c.charCodeAt(0)>127?(w<630?11:13):7.3),0)+8;
  listBy[tag.rail].push({...tag,pos,len});
 }
 for(const [rail,trow] of Object.entries(listBy)){
  if(!trow.length)continue;trow.sort((a,b)=>a.pos.x-b.pos.x);
  const top=rail==="top",space=w<560?9:17;
  let cursor=12;
  for(const t of trow){t.tx=Math.max(t.pos.x,cursor+t.len/2);cursor=t.tx+t.len/2+space;}
  cursor=w-12;for(let i=trow.length-1;i>=0;i--){const t=trow[i];t.tx=Math.min(t.tx,cursor-t.len/2);cursor=t.tx-t.len/2-space;}
  const pad=w<540?15:30;
  const limits=view==="system"||explodedSsd(view)?trow.map(t=>t.pos.y):ys;
  const band=top?Math.max(76,Math.min(...limits)-pad):Math.min(h-60,Math.max(...limits)+pad);
  for(const t of trow){
   const {x,y}=t.pos;const labelY=top?Math.min(y-14,band):Math.max(y+14,band);
   const bottomSpace=evidenceView(view)&&w<630?105:34;
   if(labelY<52||labelY>h-bottomSpace)continue;
   const endY=labelY+(top?7:-7),midY=endY+(y-endY)*.40;
   const cls=t.hot?" active":"";
   svg("polyline",{points:[[x,y],[x,midY],[t.tx,endY]].map(v=>v.join(",")).join(" "),class:"leader"+cls},layer);
   svg("circle",{cx:x,cy:y,r:3,class:"dot"+cls},layer);
   const caption=svg("text",{x:t.tx,y:labelY+4,class:"caption"+cls,"text-anchor":"middle"},layer);
   caption.textContent=t.text;
   if(view==="mounted"&&boardZones[t.part.zone]){
     caption.classList.add("zoom-tag");caption.setAttribute("role","button");caption.setAttribute("tabindex","0");
     caption.setAttribute("aria-label","在板上放大"+t.text);caption.onclick=()=>focusZone(t.part.zone);
     caption.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();focusZone(t.part.zone);}};
   }
  }
 }
}
function hit(e){
 const r=canvas.getBoundingClientRect(),ray=new T.Raycaster();
 ray.setFromCamera(new T.Vector2((e.clientX-r.left)*2/w-1,1-(e.clientY-r.top)*2/h),camera);
 const collided=ray.intersectObjects([...meshOwner.keys()].filter(m=>visible(meshOwner.get(m))),false);
 return collided[0]?meshOwner.get(collided[0].object):null;
}
function init(){
 renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.NoToneMapping;
 scene=new T.Scene();camera=new T.OrthographicCamera(-1,1,1,-1,.000001,5);
 controls=new T.OrbitControls(camera,canvas);controls.minZoom=.25;controls.maxZoom=110;controls.zoomToCursor=true;controls.rotateSpeed=.8;controls.zoomSpeed=.95;controls.addEventListener("change",schedule);
 controls.addEventListener("start",stopCameraMotion);
 scene.add(new T.HemisphereLight(0xfffbf3,0xc9d3d0,1.55));
 for(const [x,y,z,k] of [[.42,.9,.6,1.65],[-.6,.4,-.5,.95],[.18,-.8,.45,1.12]]){
  const light=new T.DirectionalLight(0xffffff,k);light.position.set(x,y,z);scene.add(light);
 }
 const pt={x:0,y:0,down:0,drag:false};
 canvas.addEventListener("pointerdown",e=>{pt.x=e.clientX;pt.y=e.clientY;pt.down++;pt.drag=pt.down>1;});
 canvas.addEventListener("pointermove",e=>{if(pt.down&&Math.hypot(e.clientX-pt.x,e.clientY-pt.y)>5)pt.drag=true;});
 canvas.addEventListener("pointercancel",()=>pt.down=Math.max(0,pt.down-1));
 canvas.addEventListener("pointerup",e=>{pt.down=Math.max(0,pt.down-1);if(!pt.drag&&!pt.down&&e.button===0&&root)pick(hit(e));});
 canvas.addEventListener("dblclick",e=>{const p=hit(e);if(p){pick(p);frame(selected,true);}});
 canvas.addEventListener("keydown",e=>{
  if(e.key==="+"||e.key==="=")zoom(1.25);else if(e.key==="-")zoom(.8);else if(e.key==="Home")$("reset").click();
  else if(e.key.startsWith("Arrow")){
   stopCameraMotion();
   const v=camera.position.clone().sub(controls.target),az=controls.getAzimuthalAngle()+(e.key==="ArrowLeft"?-.12:e.key==="ArrowRight"?.12:0);
   const pol=controls.getPolarAngle()+(e.key==="ArrowUp"?-.12:e.key==="ArrowDown"?.12:0);v.setFromSphericalCoords(v.length(),Math.max(.02,Math.min(Math.PI-.02,pol)),az);
   camera.position.copy(controls.target).add(v);controls.update();
  }else return;e.preventDefault();
 });
 document.querySelectorAll("button[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
 stackView.bind();
 document.querySelectorAll("button[data-zone]").forEach(b=>b.onclick=()=>focusZone(b.dataset.zone));
 document.querySelectorAll("button[data-story]").forEach(b=>b.onclick=()=>setTrace(b.dataset.story));
 $("story-prev").onclick=()=>setTrace(story,storyIndex-1);$("story-next").onclick=()=>setTrace(story,storyIndex+1);
 $("trace-focus").onclick=focusTrace;$("trace-stop").onclick=()=>stopTrace();
 $("story-stack").onclick=()=>{if(story==="read"||story==="write"){setView("stack");stackView.play(story,storyIndex,traceLane);}};
 $("trace-lane").onchange=e=>setTrace(story,storyIndex,Number(e.target.value));
 document.querySelectorAll("button[data-mount]").forEach(b=>b.onclick=()=>focusMount(b.dataset.mount));
 function mountOption(){showScene();options();if(selected?.items.every(p=>!visible(p)))choose(null);recolor();}
 $("mount-lid").onclick=()=>{openLid=!openLid;mountOption();};
 $("mount-board").onclick=()=>{hideCarrier=!hideCarrier;mountOption();};
 $("mount-screw").onclick=()=>{liftScrew=!liftScrew;mountOption();if(focusOn)frame(focusOn,true);};
 window.addEventListener("hashchange",()=>{if(root)applyHash();});
 window.addEventListener("nvmespec:visibility",event=>{if(!event.detail)stackView.pause();});
 $("show-nets").onchange=e=>{
  showNets=e.target.checked;if(!showNets&&story)stopTrace(false);showScene();if(selected?.items.every(p=>!visible(p)))choose(null);options();recolor();
 };
 document.querySelectorAll("button[data-cell]").forEach(b=>b.onclick=()=>setCell(b.dataset.cell));
 document.querySelectorAll("button[data-detail]").forEach(b=>b.onclick=()=>{
   const k=b.dataset.detail;
   if(k==="via"){
    const items=["pcb_PET0_via","pcb_via_reference","pcb_via_stitch"].map(named);
    const s={...makeSelect(items,"pcie_path","Lane 0 · 孔壁、避空与回流","信号孔穿过铜面避空区，旁边两根地孔将上下参考面连接。垂直层距为展开示意。"),context:true};
    choose(s);frame(s);return;
   }
   const p=k==="diff"?(named("pcb_PER1")||representative("pcie_path")):k==="coil"?(named("pcb_power_l")||representative("power_path")):(named("pcb_ground")||representative("pcb_stack"));
   if(p){pick(p);frame(selected);}
 });
 for(const k of Object.keys(stickers))$(k).onclick=()=>{stickers[k]=!stickers[k];if(k==="bottom_label")peelLabel=false;showScene();options();if(selected?.items.every(p=>!visible(p)))choose(null);recolor();};
 $("peel-label").onclick=()=>{peelLabel=!peelLabel;stickers.bottom_label=true;face=-1;showScene();options();pick(peelLabel?named("bottom_cu"):null);frame();};
 $("focus").onclick=()=>{if(selected)frame(selected,true);};$("reset").onclick=()=>{face=1;focusedZone="";choose(null);options();if(!stackView.focusAssembly(frame))frame();};
 $("flip").onclick=()=>{
   stopCameraMotion();
   face=camera.position.y>=controls.target.y?-1:1;
   const offset=camera.position.clone().sub(controls.target);
   offset.y=face*Math.max(Math.abs(offset.y),offset.length()*.04);
   camera.position.copy(controls.target).add(offset);camera.lookAt(controls.target);controls.update();options();schedule();
 };
 $("plus").onclick=()=>zoom(1.25);$("minus").onclick=()=>zoom(.8);
 $("read").onclick=()=>setStep("read",0);$("write").onclick=()=>setStep("write",0);
 $("return-board").onclick=()=>setView("physical");
 $("annotate").onclick=()=>{annotations=!annotations;options();schedule();};
 new ResizeObserver(()=>{document.documentElement.style.setProperty("--head",document.querySelector("header").offsetHeight+"px");}).observe(document.querySelector("header"));
 new ResizeObserver(()=>{if(stage.clientWidth!==w||stage.clientHeight!==h){resize();if(root)frame(focusOn);}}).observe(stage);
 resize();
 new T.GLTFLoader().parse(assetBytes("asset").buffer,"",loaded,e=>fail("模型读取失败。"+e.message));
}
function assetBytes(id){
 const raw=atob($(id).textContent.trim()),data=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)data[i]=raw.charCodeAt(i);
 return data;
}
async function loadFramework(){
 const stream=new Blob([assetBytes("framework-asset")]).stream().pipeThrough(new DecompressionStream("gzip"));
 const gltf=await new T.GLTFLoader().parseAsync(await new Response(stream).arrayBuffer(),"");
 const host=gltf.scene;
 if(!host.children.length)throw new Error("主板场景为空。");
 root.add(host);root.updateMatrixWorld(true);indexParts(host);
 frameworkReady=true;
}
function indexParts(branch){
 const owners=new Map();
 branch.traverse(mesh=>{
  if(!mesh.isMesh)return;let obj=mesh;while(obj!==branch&&!obj.userData.group)obj=obj.parent;if(obj===branch)return;
  let p=owners.get(obj);
  if(!p){const d=obj.userData;p={obj,id:d.id||obj.name,group:d.group,view:d.view||"physical",label:d.label||obj.name,desc:d.desc||"",stage:d.stage||"",zone:d.zone||"",link:d.link||null,stack:d.stack||null,meshes:[],weight:0};
   if(p.view==="mounted"&&p.link?.lane!==undefined)pairs.push(p);
   owners.set(obj,p);parts.push(p);partIds.set(p.id,p);if(!groups.has(p.group))groups.set(p.group,[]);groups.get(p.group).push(p);}
  const converted=list(mesh.material).map(old=>{const m=old.clone();if(m.isMeshStandardMaterial){m.metalness=Math.min(.30,m.metalness);m.roughness=Math.max(.29,m.roughness);}
   if(m.color)m.userData.cadColor=m.color.clone();if(m.emissive)m.userData.cadEmissive=m.emissive.clone();return m;});
  mesh.material=Array.isArray(mesh.material)?converted:converted[0];mesh.geometry.computeBoundingBox();meshOwner.set(mesh,p);p.meshes.push(mesh);
 });
 for(const p of owners.values()){
  const sz=bounds(p).getSize(new T.Vector3());
  p.weight=sz.x*sz.y*sz.z+(sz.x*sz.y+sz.x*sz.z+sz.y*sz.z)*.00004;
  p.obj.visible=visible(p);
 }
}
function loaded(gltf){
 root=new T.Group();for(const s of gltf.scenes)root.add(s);scene.add(root);root.updateMatrixWorld(true);indexParts(root);
 if(!parts.length){fail("未找到带分组信息的模型实体。");return;}
 $("loading").hidden=true;setView("mounted");updateTrace();document.body.dataset.ready="true";applyHash();
}
try{init();}catch(e){fail("无法启动三维显示。请用启用 WebGL 2 的现代浏览器打开。"+e.message);}
})();

