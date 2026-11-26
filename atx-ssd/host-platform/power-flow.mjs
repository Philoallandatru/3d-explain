import { startupTiming } from './power-timing.mjs';

const intelAtx = 'https://edc.intel.com/content/www/us/en/design/ipla/software-development-platforms/client/platforms/alder-lake-desktop/atx-version-3-0-multi-rail-desktop-platform-power-supply-design-guide/';

export const psuProfile = Object.freeze({
  name:'Corsair RM1000x (2024)',sku:'CP-9020271',
  width:150,height:86,depth:160,fan:140,
});

export const powerSources = {
  msiVrm:['MSI · 14+2+1 供电设计','https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/'],
  atxPins:['Intel · ATX 24-pin 针位',intelAtx+'main-power-connector-required/'],
  atxEnable:['Intel · PS_ON#',intelAtx+'2.01/ps-on-required/'],
  atxOK:['Intel · PWR_OK',intelAtx+'2.01/pwr-ok-required/'],
  atxTiming:['Intel · ATX 上电时序',intelAtx+'timing-housekeeping-and-control-required/'],
  atxRegulation:['Intel · 主轨电压范围',intelAtx+'dc-voltage-regulation-required/'],
  resetSequence:['TI · 上电就绪与复位','https://www.ti.com/lit/eb/slyy168/slyy168.pdf'],
  atxGpu:['Intel · PCIe 辅助供电',intelAtx+'2.1/pcie-aic-auxiliary-power-connectors/'],
  psuTopology:['TI · 台式电源转换框图','https://www.ti.com/document-viewer/lit/html/SSZT909/GUID-14830977-F519-4B62-B81F-56283F683901'],
  buck:['TI · 同步 Buck 工作原理','https://www.ti.com/document-viewer/lit/html/SSZTCO3/GUID-292D8B9D-5297-46CB-98DA-C7099A8F41F7'],
  dimmPmic:['Renesas · DDR5 UDIMM PMIC','https://www.renesas.com/en/document/sds/p8911-short-form-datasheet?r=1600131'],
  ssdPower:['Samsung · 990 PRO 电压规格','https://www.samsung.com/us/memory-storage/nvme-ssd/990-pro-2tb-nvme-pcie-gen-4-mz-v9p2t0b-am/'],
  gpuCable:['NVIDIA · RTX 5090 16-pin','https://www.nvidia.com/content/geforce-gtx/geforce-rtx-5090-user-guide-r2.pdf'],
  psuModel:['Corsair · RM1000x 产品规格','https://www.corsair.com/eu/en/p/psu/cp-9020271-eu/rmx-series-rm1000x-fully-modular-power-supply-eu-cp-9020271-eu'],
  psuLab:['Cybenetics · RM1000x 拆解台账','https://www.cybenetics.com/evaluations/psus/2396/'],
  psuPhoto:['Profesional Review · 实物与拆解照片','https://www.profesionalreview.com/2024/09/10/corsair-rm1000x-atx3-1-review/'],
  psuFlyback:['昂宝 · OB2365 反激原理','https://www.on-bright.com/en/index/product/detail/cid/28/id/271.shtml'],
};

const topic = (title,text,refs,jump) => ({title,text,refs,jump});
const supply = ['board','power'];
export const powerTopics = {
  power:topic('从 ATX 电源到板上各路负载',
    '电源与主板、显卡共用毫米坐标。先剖开 RM1000x 看主电源和待机转换，再循线到 ATX_PWR1、CPU_PWR1/2 与显卡。负载的回放顺序用于观察，真实系统可并行供电。',
    ['board','atxPins','msiVrm'],supply),
  atx24:topic('ATX_PWR1 · 24-pin',
    '+5VSB 从第 9 脚进入主板。主板用第 16 脚 PS_ON# 请求开启主轨，随后从第 8 脚接收 PWR_OK。主供电包含 +12 V、+5 V 和 +3.3 V，COM 提供共同回流。',
    ['board','atxPins','atxEnable','atxOK'],supply),
  cpuEps:topic('CPU_PWR1 / CPU_PWR2 · 双 8-pin',
    '电源的 CPU 线将 12 V 和 COM 送到这两个插座。板上的输入电容就近支撑开关瞬态，随后由 CPU VRM 降压。两个接口表达本板的连接布局，回放未分配两根线各自的电流。',
    ['board','msiVrm'],supply),
  cpuVrm:topic('CPU VRM · 14 核心 / 2 SoC / 1 辅助',
    '拆下散热片可看功率级、电感和滤波电容。MSI 公布的 14+2+1 为供电分组，核心 SPS 单颗额定 80 A。封装位置和单相拓扑用来解释原理，PWM 分配与各路电流采用示意。',
    ['msiVrm','buck'],supply),
  vrmPwm:topic('数字 PWM 与反馈',
    'CPU 的 VID 表达所需电压。控制器比较反馈与目标并调节驱动脉冲，多路错开的开关脉冲让合成输出更平滑。这里选取一支路解释原理。',
    ['msiVrm','buck'],supply),
  vrmSps:topic('SPS · 集成驱动与同步功率开关',
    '高侧导通时，12 V 接到开关节点。关掉高侧后，低侧开关给电感提供续流回路。功率级贴在散热片下以导出损耗。',
    ['msiVrm','buck'],supply),
  vrmChoke:topic('电感 · 把脉冲电压变成连续电流',
    '电感电流的变化率由两端电压和电感量决定。高侧导通期间电流上升，低侧续流期间回落。连续导通时，两个区间都向输出送电。',
    ['buck'],supply),
  vrmCap:topic('输入与输出去耦',
    '输入端电容吸收功率级的脉冲电流。输出端聚合物电容与 MLCC 为负载提供瞬态电流，并把剩余的电流纹波旁路到 COM。',
    ['buck'],supply),
  frontPanel:topic('JFP1 · 机箱前面板',
    'PWR_SW 跨接 JFP1 的第 6 和第 8 脚，按键瞬间闭合后由主板待机逻辑处理。这里还接电源灯、硬盘活动灯和复位开关。',
    ['board','atxEnable'],supply),
  debugLed:topic('EZ Debug LED · CPU / DRAM / VGA / BOOT',
    '四个 LED 位于 DIMM 右侧的板边，用于定位启动遇到问题的子系统。PWR_OK 表示 ATX 电源主轨已就绪，后续仍需平台初始化和自检。',
    ['board','atxOK']),
  boardHeaders:topic('板边针座与风扇接头',
    'CPU_FAN1 和 PUMP_FAN1 位于 DIMM 上方。底边补出 JUSB3 / JUSB4 等内部针座和 JBAT1 清除 CMOS 跳线。外形和针距按接口类型建模。',
    ['board','photo']),
  atxPsu:topic('Corsair RM1000x · ATX 3.1',
    '2024 款 CP-9020271，额定 1000 W，金属外壳宽 150 × 高 86 × 深 160 mm，配 140 mm 风扇。外壳和接口按产品照片建模，器件按拆解区位近似。3D 线束按台架摆位绘制。',
    ['psuModel','psuLab','psuPhoto'],supply),
  psuAc:topic('IEC C14 · 交流入口',
    '交流线接入背部 C14，L 与 N 送往输入滤波区，保护地接机壳。剖面用功能路径追踪能量。',
    ['psuPhoto','psuLab']),
  psuEmi:topic('交流侧 EMI 滤波与浪涌处理',
    '共模电感与 X/Y 电容衰减在电网侧传导的噪声。此样机还设有 MOV、限制上电浪涌的 NTC，以及旁路继电器。',
    ['psuLab','psuPhoto']),
  psuBridge:topic('桥式整流',
    '输入桥使交流的正、负半周在输出侧产生同一极性的脉动电压，供主路 PFC 升压。测试样机记录了两颗整流桥。',
    ['psuLab','psuTopology']),
  psuPfc:topic('主动 PFC 与高压储能',
    '升压级调节输入电流形状并建立直流母线，两个大电容储能，供后续半桥 LLC 取能。场景按拆解画出器件组。',
    ['psuLab','psuPhoto','psuTopology']),
  psuLlc:topic('半桥 LLC 与主变压器',
    '半桥把高压直流斩成高频交流，LLC 谐振网络调节传能。变压器把能量耦合到隔离后的低压侧，图中虚线表示初次级分界。',
    ['psuLab','psuTopology']),
  psuSync:topic('同步整流与主 12 V',
    '低压侧用 MOSFET 同步整流，电容平滑输出，形成主 12 V。这一路供 EPS、显卡辅助线和 ATX 主接口，也供内部低压 DC/DC。',
    ['psuLab','psuModel']),
  psuStandby:topic('独立待机反激 · OB2365T',
    '待机支路有自己的整流、开关控制和小型隔离变压器。反激控制器让一次侧储能，在开关关断期间向次级释放，主路关闭时仍可生成 5VSB。',
    ['psuLab','psuFlyback','atxEnable']),
  psuStandbyOut:topic('待机次级整流与 5VSB',
    '待机变压器的低压侧整流并滤波，得到 5VSB。从模块板经 ATX 线束送到主板第 9 脚，使待机逻辑能够接收按键。',
    ['psuLab','psuModel','atxPins']),
  psuDcDc:topic('次级 DC/DC · 主 5 V 与 3.3 V',
    '低压侧另有降压电路，由主 12 V 生成主 5 V 和 3.3 V。ATX 线束同时承载这些主轨、5VSB 与状态信号。',
    ['psuLab','atxPins']),
  psuOut:topic('模块面板与出线',
    '24-pin 主板线在 PSU 侧分接两口，两条 EPS 线接 CPU_PWR1/2，独立的 12V-2x6 线直通 RTX 5090 FE。额定线长可查原厂资料，图中用台架线路对齐接头。',
    ['psuModel','psuPhoto','gpuCable']),
  standbyLogic:topic('主板待机与开关控制',
    '待机逻辑仍在 +5VSB 所在电源域。它接收 JFP1 开关事件并控制 PS_ON#，还可读回电源的 PWR_OK。场景标记的是逻辑节点。',
    ['board','atxEnable','atxOK']),
  dimmSupply:topic('DIMM 本地 PMIC',
    '桌面 DDR5 UDIMM 的 PMIC 由模组插槽取电。常见示例用 5 V 生成 VDD、VDDQ 各 1.1 V 和 VPP 1.8 V。电感与输出电容就在模组上。',
    ['dimm','dimmPmic'],['dram','module']),
  m2Supply:topic('M2_1 · 3.3 V 供电触点',
    '多枚电源触点并联，向 990 PRO 提供接口 3.3 V。SSD 再用板载电源管理分配到控制器与闪存等负载。',
    ['pcie','ssdPower','ssd'],['board','io']),
  gpuSupply:topic('RTX 5090 FE · 插槽与显卡 16-pin',
    'PCI_E1 由主板供电，辅助 16-pin 由 PSU 线束直接接到显卡。两路接入卡上配电与稳压。电流分配随设计和负载变化。',
    ['board','atxGpu','gpuCable','rtx5090'],['gpu','pcb']),
};

export const powerLabels = {
  atx24:'ATX 24-pin',cpuEps:'CPU 8-pin',cpuVrm:'VRM 分组',frontPanel:'JFP1',
  debugLed:'诊断灯',boardHeaders:'板边针座',vrmPwm:'PWM',vrmSps:'功率级',
  vrmChoke:'电感',vrmCap:'滤波电容',atxPsu:'ATX 电源',standbyLogic:'待机逻辑',
  dimmSupply:'DDR5 PMIC',m2Supply:'M.2 电源',gpuSupply:'GPU 电源',
  psuAc:'交流入口',psuEmi:'输入滤波',psuBridge:'整流桥',psuPfc:'主动 PFC',psuLlc:'半桥 LLC',
  psuSync:'主 12 V',psuStandby:'待机反激',psuStandbyOut:'5VSB 滤波',psuDcDc:'次级 DC/DC',psuOut:'模块面板',
};

export const powerColors = {
  standby:'#cdb9f5', control:'#a6dbae', ready:'#a6cbf8', fault:'#f2a38e', inactive:'#919996',
  ac:'#f2ab90', primary:'#f7aa6b', main:'#ffca85', core:'#ffe083', dimm:'#80dccd', m2:'#92c4ff', auxiliary:'#f4a8ab',
};

const step = (id,title,bus,text,refs,phase,landing,tracks,options = {}) => ({
  id,title,bus,text,refs,phase,landing,tracks,color:powerColors[phase],...options,
});

export const powerSteps = [
  step('ac-in','交流进入电源','IEC C14 → EMI 滤波与浪涌限制',
    '交流由 C14 进入，先经过输入滤波。共模线圈和 X/Y 电容抑制传导噪声，浪涌限制电路控制上电瞬间的冲击。这里能看到电源向内部分出待机和主转换两支。',
    ['psuModel','psuLab','psuPhoto'],'ac','psuEmi',['ac'],
    {label:'交流输入',focus:'psu',openPsu:true}),
  step('standby-convert','独立反激生成待机电压','滤波后交流 → 待机整流 → 反激变压器 → 5VSB 滤波',
    '待机控制器驱动小型变压器，导通期间一次侧储能，关断后低压侧接收能量并整流滤波。主半桥和 LLC 此时仍未启动。',
    ['psuLab','psuFlyback','atxEnable'],'standby','psuStandbyOut',['standbyPrimary','standbySecondary'],
    {label:'5VSB 生成',focus:'psu',openPsu:true}),
  step('standby','5VSB 送到主板待机逻辑','RM1000x 模块板 → ATX 线束 → ATX_PWR1 #9',
    '待机次级在交流有效时提供 5 V。沿紫色路径可从电源的模块面板追到 ATX 24-pin 和待机逻辑。主 12 V、5 V 和 3.3 V 仍关闭。',
    ['psuModel','atxEnable','atxPins'],'standby','standbyLogic',['standbyBoard','atxStandby','standby'],
    {label:'待机到主板',sourceDiagram:'standby'}),
  step('ps-on','按下开机键，主板拉低 PS_ON#','JFP1 6/8 → 待机逻辑 → ATX_PWR1 #16 → PSU',
    '机箱开关让 JFP1 的 PWR_SW 瞬时闭合。待机逻辑收到事件后把 PS_ON# 拉低，请求电源开启主输出。',
    ['board','atxEnable','atxPins'],'control','psuOut',['switch','enable'],
    {label:'开机请求'}),
  step('pfc','整流和 PFC 建立高压母线','输入滤波 → 整流桥 → 主动 PFC → 母线储能',
    '收到 PS_ON# 后，主转换开始。桥式整流统一两个交流半周的极性，主动 PFC 塑造输入电流并升压，两个大电容把能量存入高压直流母线。',
    ['psuLab','psuTopology'],'primary','psuPfc',['bridge','pfc'],
    {label:'整流 / PFC',focus:'psu',openPsu:true}),
  step('llc','半桥 LLC 跨过隔离边界','高压直流 → 半桥开关 → LLC → 主变压器',
    '半桥把直流换成高频激励，谐振网络经主变压器把能量传到低压侧。初次级电气隔离，图中高亮跨过的是变压器耦合。',
    ['psuLab','psuTopology'],'primary','psuLlc',['llc'],
    {label:'LLC 隔离',focus:'psu',openPsu:true}),
  step('sync-12','低压侧整流成主 12 V','主变压器次级 → 同步整流 → 滤波 → 主 12 V',
    '次级 MOSFET 用低导通电阻完成同步整流，再由低压电容平滑，建立主 12 V 母线。该母线连接模块板，也是主 5 V 和 3.3 V 降压级的输入。',
    ['psuLab','psuModel'],'main','psuSync',['sync','mainOut'],
    {label:'主 12 V',focus:'psu',openPsu:true}),
  step('main-rails','次级降压补齐 ATX 主轨','主 12 V → 次级 DC/DC → 5 V / 3.3 V → 模块面板',
    '次级降压电路生成主 5 V 和 3.3 V。模块面板将三条主轨同 5VSB 各自引到 ATX 线束。输出满足就绪条件后，电源才报告 PWR_OK。',
    ['psuLab','atxOK','atxPins'],'main','psuDcDc',['dcdc','dcdcOut','dcdc33Out'],
    {focus:'psu',openPsu:true,sourceDiagram:'main'}),
  step('power-ok','电源通过 PWR_OK 报告就绪','PSU → ATX_PWR1 #8 → 主板电源逻辑',
    '当 +12 V、+5 V 和 +3.3 V 满足电源正常条件，PSU 拉高 PWR_OK。主板随后依自己的电源就绪信号推进时钟、复位和初始化。',
    ['atxOK','atxPins'],'ready','standbyLogic',['check12','check5','check33','okSignal'],
    {label:'PWR_OK',gate:'passed',focus:'gate',openPsu:true}),
  step('boot-handoff','主板推进复位释放与初始化','PWR_OK 高 → 板上就绪检查 → 平台复位释放',
    'PWR_OK 高表示电源允许上电时序继续。主板还会检查本地电源和时钟，条件齐备后才释放平台复位，让 CPU 进入固件初始化。路径为通用时序示意。',
    ['atxOK','resetSequence','board'],'control','socket',['startBoard'],
    {label:'主板启动',focus:'start'}),
  step('eps','双 EPS8 将 12 V 送到 CPU VRM','PSU → CPU_PWR1 / CPU_PWR2 → 输入去耦',
    'EPS 的 12 V 随 PSU 主 12 V 建立，两组插座把它和 COM 引入 CPU 区。输入电容位于功率级近处，缩短开关瞬态的电流回路。',
    ['board','msiVrm','buck'],'main','cpuEps',['eps1','eps2','eps2Input','input','inputCap'],
    {label:'双 EPS8'}),
  step('buck-on','高侧导通，电流上升','12 V → 高侧开关 → SW → 电感 → 输出',
    '高侧把 SW 接到 12 V，低侧关断。电感两端约为 12 V 减 Vcore，电流上升并继续给 CPU 与输出电容供电。',
    ['buck','msiVrm'],'core','vrmSps',['input','high','output'],
    {label:'CPU VRM',focus:'vrm',expose:true,buck:'on'}),
  step('buck-off','低侧续流，电流回落','COM → 低侧开关 → SW → 电感 → 输出 → COM',
    '高侧关断后，低侧提供续流通道。SW 接近 0 V，电感两端约为 −Vcore。电感电流缓慢回落，仍沿原方向流向 CPU。',
    ['buck'],'core','vrmChoke',['low','output','return'],
    {focus:'vrm',expose:true,buck:'off'}),
  step('regulate','反馈调节占空比，LC 稳定 Vcore','PWM → SPS → L/C → CPU → 电压反馈',
    '输出电容平滑纹波并支撑负载阶跃。控制器根据目标电压与反馈调整驱动。多路交错工作可以分担电流。右侧可改示例 Vcore，看导通时间和电感纹波怎样变化。',
    ['msiVrm','buck'],'core','socket',['drive','high','output','outputCap','capReturn','feedback'],
    {focus:'vrm',expose:true,buck:'cycle'}),
  step('ddr5','DDR5 在内存条上产生工作电压','ATX 主 5 V → A2 / B2 → 两条 UDIMM 的 PMIC',
    '5 V 经插槽送到每根内存条。示例 PMIC 就地生成 VDD 和 VDDQ 各 1.1 V，以及 VPP 1.8 V。模组上的小电感和电容为各输出滤波。',
    ['board','dimm','dimmPmic'],'dimm','dimmSupply',['dimmFeed','dimmA','dimmB'],
    {label:'DDR5'}),
  step('m2','990 PRO 从 M2_1 取 3.3 V','主板 3.3 V → M2_1 电源触点 → SSD',
    '多枚 3.3 V 触点给 SSD 供电，990 PRO 的接口额定值为 3.3 V ±5%。设备内部再产生控制器、DRAM、NAND 等负载所需电压。',
    ['pcie','ssdPower'],'m2','m2Supply',['m2'],
    {label:'M.2'}),
  step('gpu','显卡从 PCI_E1 和 16-pin 接收电源','ATX_PWR1 → PCI_E1   ／   PSU → 显卡 16-pin',
    '主板通过 ATX 线束获得插槽电源。RM1000x 的独立 12V-2x6 线直接向显卡辅助接口提供 12 V，随后由卡上电路给 GPU 和 GDDR7 稳压。两条路径分别标色。',
    ['board','atxGpu','psuModel','gpuCable'],'auxiliary','gpuSupply',['atxMain','atxBranch','gpuSlot','gpuCable','gpuInput'],
    {label:'显卡',focus:'gpu'}),
  step('shutdown','关机，主轨退电，待机电源保留','PS_ON# 释放 → PWR_OK 拉低 → 主输出关闭',
    '主板释放 PS_ON#，电源报告主轨不再就绪并关闭主输出。交流仍有效时，+5VSB 继续供给待机逻辑，可以再次接收电源键。',
    ['atxEnable','atxOK'],'standby','standbyLogic',['atxStandby','standby'],
    {label:'关机',sourceDiagram:'standby'}),
];

export const powerGoodIndex=powerSteps.findIndex(entry=>entry.id==='power-ok');
const undervoltageSteps=powerSteps.map(entry=>{
  if(entry.id==='main-rails')return {...entry,
    title:'次级 DC/DC 的 3.3 V 仍欠压',bus:'主 12 V → 次级 DC/DC → 5 V 就绪 / 3.3 V 欠压',
    text:'这个上电情景中，主 12 V 和 5 V 已进入工作范围，3.3 V 仍低于电源的就绪门限。下一步看电源如何报告这组主轨的状态。',
    phase:'fault',color:powerColors.fault,railFault:true,tracks:['dcdc','dcdcOut','dcdc33Low']};
  if(entry.id==='power-ok')return {...entry,
    title:'PWR_OK 保持低，主板等待就绪',label:'PWR_OK · 停住',
    bus:'3.3 V 欠压 → PWR_OK #8 保持低电平 → 主板等待',
    text:'这次主 12 V、主 5 V 和 5VSB 仍然有效，EPS 输入也可以有 12 V。3.3 V 未通过电源检查，PWR_OK 保持低位，主板开机停在电源就绪检查，复位释放和初始化都在后面。',
    phase:'fault',color:powerColors.fault,railFault:true,gate:'blocked',tracks:['check12','check5','check33Low']};
  return entry;
});

const {phases:[rampPhase,railPhase,okPhase,resetPhase],t3Ms,boardDelayMs}=startupTiming;
const delayedSteps=powerSteps.flatMap(entry=>{
  if(entry.id===rampPhase.id)return [
    step(rampPhase.id,'3.3 V 正在建立','12 V / 5 V 已达标 → 等 3.3 V',
      '在这段示意的起点，12 V 和 5 V 已经达标。3.3 V 还在上升，电源维持 PWR_OK 低电平，主板保持复位。',
      ['atxRegulation','atxOK'],'fault','standbyLogic',['check12','check5','check33Low'],
      {label:'3.3 V 建立中',startupMs:rampPhase.ms,gate:'waiting',focus:'gate',openPsu:true,railFault:true}),
    step(railPhase.id,'3.3 V 达标，电源等待 T3','三条主轨达标 → 等待 PWR_OK 延迟',
      `3.3 V 进入工作范围后三条主轨均已达标。示例从这时起等待 ${t3Ms} ms，再由电源拉高 PWR_OK。`,
      ['atxRegulation','atxTiming','atxOK'],'main','standbyLogic',['check12','check5','check33'],
      {label:railPhase.label,startupMs:railPhase.ms,gate:'waiting',focus:'gate',openPsu:true}),
  ];
  if(entry.id===okPhase.id)return [{...entry,
    title:'PWR_OK 拉高，平台复位保持',label:okPhase.label,startupMs:okPhase.ms,
    bus:'PSU → ATX_PWR1 #8 → 主板开始检查本地条件',
    text:`这时主板收到 PWR_OK 高电平。示例中的本地电源和时钟再等 ${boardDelayMs} ms 就绪，平台复位在这段时间内保持。`,
    refs:['atxOK','atxTiming','resetSequence']}];
  if(entry.id===resetPhase.id)return [{...entry,label:resetPhase.label,startupMs:resetPhase.ms}];
  return [entry];
});

export const powerFlow=condition=>condition==='delayed'?delayedSteps:condition==='undervoltage'?undervoltageSteps:powerSteps;

export function powerSignals(entry) {
  const waiting=['ac-in','standby-convert','standby','shutdown'].includes(entry.id);
  const request=entry.id==='ps-on', ramping=['pfc','llc','sync-12','main-rails'].includes(entry.id);
  const standby=entry.id==='ac-in'?'未输出':entry.id==='standby-convert'?'建立中':'5 V';
  const blocked=entry.gate==='blocked', starting=entry.id==='boot-handoff', delayed=entry.gate==='waiting';
  const rails=entry.railFault||entry.gate||starting ? [
    ['+12 V / +5 V','有效','main'],
    ['+3.3 V',entry.railFault?(delayed?'上升中 · 未达标':'欠压'):'有效',entry.railFault?'fault':delayed?'rail33':'main'],
  ] : [['+12 / +5 / +3.3 V',waiting?'关闭':request?'待建立':ramping?'上升中':'有效','main']];
  return [
    ['+5VSB · #9',standby,'standby'],
    ['PS_ON# · #16',waiting?'高 · 释放':'低 · 请求','control'],
    ...rails,
    ['PWR_OK · #8',blocked?'低 · 未就绪':delayed?(entry.railFault?'低 · 等 3.3 V':'低 · 等待 T3'):
      waiting||request||ramping?'低':'高 · 就绪','ready'],
    ...(entry.gate||starting?[[entry.startupMs===undefined?'主板启动':'平台复位',
      blocked?'等待电源就绪':starting?(entry.startupMs===undefined?'进入初始化':'已释放 · 进入初始化'):
        entry.startupMs===undefined?'可推进时序':'保持','board-start']]:[]),
  ];
}

export const buckVoltages = [.90, 1.10, 1.20];
export function buckExample(vout) {
  const vin=12, frequencyKHz=500, inductanceUh=.22, averageAmps=20;
  const duty=vout/vin, periodUs=1000/frequencyKHz, onUs=periodUs*duty;
  const rippleAmps=(vin-vout)*onUs/inductanceUh;
  return {vin,vout,duty,periodUs,onUs,rippleAmps,averageAmps,frequencyKHz,inductanceUh};
}
