export const gpuProfile = Object.freeze({
  name: 'GeForce RTX 5090 Founders Edition',
  dimensionsMm: Object.freeze([304, 137, 40]),
  chip: 'GB202',
  tgpW: 575,
  pcieGen: 5,
  lanes: 16,
  hostSlot: 'PCI_E1',
  slotGen: 4,
  slotLanes: 16,
  memoryType: 'GDDR7',
  memoryGB: 32,
  memoryBusBits: 512,
  memoryPinGbps: 28,
  memoryChannels: 16,
  memoryPackages: 16,
  l2MB: 96,
  gpcs: 11,
  tpcs: 85,
  sms: 170,
  cudaCores: 21760,
  tensorCores: 680,
});

export const vramGBs = gpuProfile.memoryBusBits * gpuProfile.memoryPinGbps / 8;

function pcieGBs(gen, lanes) {
  const rate = gen === 5 ? 32 : 16;
  return rate * lanes * (128 / 130) / 8;
}

export const hostLinkGBs = pcieGBs(
  Math.min(gpuProfile.pcieGen, gpuProfile.slotGen),
  Math.min(gpuProfile.lanes, gpuProfile.slotLanes),
);
export const cardLinkGBs = pcieGBs(gpuProfile.pcieGen, gpuProfile.lanes);

export function gpuTransferBounds(payloadMiB) {
  const bytes = payloadMiB * 2 ** 20;
  return { pcieMs: bytes / (hostLinkGBs * 1e6), vramMs: bytes / (vramGBs * 1e6) };
}

export const gpuLinkColors = {host:'#83e0be',pcie:'#8ec6ff',local:'#cbb4f3'};

const gpuLinkPhases = {
  h2d: [
    {id:'ddr5',label:'主机 DDR5',title:'权重位于主机 DDR5',bus:'Host DDR5 · 页锁缓冲',color:gpuLinkColors.host,
      text:'SSD 读入的权重字节已在主机缓冲。这个示例用页锁缓冲提交从主机到设备的拷贝，供 GPU 拷贝引擎通过 DMA 取用。',refs:['cudaTransfer']},
    {id:'root',label:'CPU 根端口',title:'从 DDR5 到 CPU PCIe 根端口',bus:'DDR5 → Ryzen UMC / IOD → PCIe 根端口',segment:'host',
      text:'DDR5 数据由 CPU 的内存控制器进入 I/O 裸片互连，经根端口发向显卡。CPU 根端口承担内存域与 PCIe 的连接。',refs:['slots','zen']},
    {id:'pci-e1',label:'PCI_E1',title:'权重负载穿过 PCI_E1 卡边',bus:'CPU 根端口 → PCIe 4.0 ×16 → RTX 5090 卡边',segment:'pcie',
      text:'MSI 主槽 PCI_E1 直连 CPU。这次装配使用 PCIe 4.0 ×16，权重负载经插槽和金手指抵达 RTX 5090 的 PCIe 接口。',refs:['slots','pcieGenerations']},
    {id:'gddr7',label:'写入 GDDR7',title:'拷贝引擎把权重写入 GDDR7',bus:'GPU PCIe 接口 → 拷贝引擎 / 显存控制器 → GDDR7',segment:'local',
      text:'GPU 侧接收数据后经显存控制器写入目标 GDDR7 缓冲。拷贝完成后，依赖这些权重的计算可在相应 CUDA 流或同步点之后开始。',refs:['cudaTransfer','rtxWhitepaper']},
  ],
  d2h: [
    {id:'gddr7',label:'GDDR7',title:'待回传数据位于 GDDR7',bus:'RTX 5090 · GDDR7 设备缓冲',color:gpuLinkColors.local,
      text:'设备端缓冲已就绪，CUDA Device → Host 拷贝从这个显存范围取数据。',refs:['cudaTransfer','rtxWhitepaper']},
    {id:'pci-e1',label:'PCI_E1',title:'GPU 将读出的数据送至卡边',bus:'GDDR7 → 拷贝引擎 → GPU PCIe 接口',segment:'local',
      text:'GPU 经显存控制器读取数据，再由设备侧拷贝路径送到 PCIe 接口和卡边。',refs:['rtxWhitepaper','cudaTransfer']},
    {id:'root',label:'CPU 根端口',title:'数据跨过 PCI_E1 返回 CPU 根端口',bus:'RTX 5090 卡边 → PCIe 4.0 ×16 → CPU 根端口',segment:'pcie',
      text:'数据负载沿 CPU 直连的 PCI_E1 返回主机，根端口把返回流量送进主机内存域。',refs:['slots','pcieGenerations']},
    {id:'ddr5',label:'写回 DDR5',title:'数据写入主机 DDR5 缓冲',bus:'CPU 根端口 → Ryzen IOD / UMC → DDR5',segment:'host',
      text:'主机互连与内存控制器将数据送到 DMA 映射的主机缓冲。待拷贝完成并同步后，CPU 可使用这个缓冲。',refs:['cudaTransfer','zen']},
  ],
};

export function gpuLinkSteps(direction,payloadMiB) {
  const copy=direction==='d2h'?'设备 → 主机':'主机 → 设备';
  const payload=payloadMiB>=1024?payloadMiB/1024+' GiB':payloadMiB+' MiB';
  const overview={id:'overview',title:'显卡数据路径总览',bus:copy+' · PCI_E1 Gen4 ×16',color:gpuLinkColors.pcie,
    text:'分段查看主机 DDR5、Ryzen PCIe 根端口、PCI_E1 卡边和 RTX 5090 显存。箭头表示所选拷贝的负载方向。',
    refs:['slots','cudaTransfer'],facts:[['方向',copy],['示例拷贝',payload]]};
  return [overview,...gpuLinkPhases[direction].map(step=>({...step,color:step.color??gpuLinkColors[step.segment],
    facts:[['方向',copy],['示例拷贝',payload],['当前落点',step.label]]}))];
}

export const gpuSources = {
  rtx5090: ['NVIDIA RTX 5090 规格', 'https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/#specs'],
  rtxDimensions: ['NVIDIA SFF 尺寸表', 'https://www.nvidia.com/en-us/geforce/news/gfecnt/20246/small-form-factor-sff-ready/'],
  rtxConstruction: ['NVIDIA FE 设计说明', 'https://www.nvidia.com/en-us/geforce/news/rtx-50-series-graphics-cards-gpu-laptop-announcements/#founders-edition-revolutionary-double-flow-through-design'],
  rtxDesign: ['NVIDIA FE 设计视频', 'https://www.youtube.com/watch?v=RDr1pr_c6ts'],
  rtxWhitepaper: ['NVIDIA Blackwell 白皮书', 'https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf#page=8'],
  rtxArchitecture: ['PC Anatomy GPU 几何 · MIT', 'https://github.com/Yoosseph/pc-anatomy/blob/485a649b697a3e367a611860d278d8de26304e76/lib/gpu-architecture.ts'],
  pcieGenerations: ['PCI-SIG 编码与带宽', 'https://pcisig.com/sites/default/files/files/PCIe_Specification_Webinar_Rev%206_FINAL_0.pdf#page=4'],
  cudaTransfer: ['CUDA 数据搬运指南', 'https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#data-transfer-between-host-and-device'],
};

export const gpuTopicLabels = {
  gpuCard: 'RTX 5090 FE', gpuCooling: '散热', gpuPower: '16-pin 供电',
  gpuOutput: '视频输出', gpuPcie: 'PCIe 卡边', gpuMain: '核心板',
  gpuDie: 'GB202', gddr: 'GDDR7', gpuGpc: 'GPC',
  gpuL2: 'L2', gpuMc: '显存控制器', gpuHost: 'Host 接口',
  gpuSm: '单个 SM', gpuCuda: 'CUDA Core', gpuTensor: 'Tensor Core',
  gpuShared: 'L1 / Shared', gpuScheduler: '调度与寄存器',
  gpuLinkSlot: 'PCI_E1 数据链路',
};

export const gpuTopics = {
  gpuCard: {
    title: 'GeForce RTX 5090 Founders Edition',
    text: '双槽卡，304 × 137 × 40 mm。安装到 B650 TOMAHAWK 的 PCI_E1，卡边与 CPU 直连插槽对位。',
    refs: ['rtxDimensions', 'rtx5090', 'slots'],
    jump: ['gpu', 'card'],
  },
  gpuCooling: {
    title: '双贯流散热',
    text: '两把同侧轴流风扇把空气送过两侧鳍片。中间的核心板为两侧气流留出通道，均热板把芯片热量分散到散热器。',
    refs: ['rtxConstruction', 'rtxDesign', 'pc'],
  },
  gpuPower: {
    title: '辅助供电 · 16-pin',
    text: '整卡额定总功耗（TGP）为 575 W。辅助接口与 PCIe 插槽供电共同服务板上电源电路。模型绘制了接口位置和外形。',
    refs: ['rtx5090', 'rtxDesign'],
  },
  gpuOutput: {
    title: '视频输出板及挡板',
    text: 'Founders Edition 提供三路 DisplayPort 2.1b 与一路 HDMI 2.1b。小板沿机箱后挡板安置，并连到中央核心板。',
    refs: ['rtx5090', 'rtxDesign'],
  },
  gpuPcie: {
    title: 'PCIe 卡边子板 · Gen5 ×16',
    text: 'FE 把 PCIe 卡边单独做在一块小板上。这套 ATX 组合的 CPU 直连 PCI_E1 提供 Gen4 ×16，链路按两端共同能力训练。触点位置为可视化近似。',
    refs: ['rtx5090', 'rtxDesign', 'slots', 'pcieGenerations'],
    jump: ['board', 'gpu-link'],
  },
  gpuMain: {
    title: '三片式 PCB · 中央核心板',
    text: '中央 PCB 安置 GB202、GDDR7 和板上稳压电路。PCIe 卡边板和显示输出板分开布置。板形、互连和小器件的位置按公开资料近似绘制。',
    refs: ['rtxConstruction', 'rtxDesign'],
  },
  gpuDie: {
    title: 'GB202 · RTX 5090 启用配置',
    text: '11 个 GPC、85 个 TPC、170 个 SM、21,760 个 CUDA Core、680 个第五代 Tensor Core，配 96 MB L2。芯片视图按功能块表达资源关系，位置采用示意坐标。',
    refs: ['rtxWhitepaper', 'rtxArchitecture'],
    jump: ['gpu', 'die'],
  },
  gddr: {
    title: '32 GB GDDR7 显存',
    text: '512-bit 接口以每 pin 28 Gbit/s 工作，标称带宽为 1,792 GB/s。推理引擎可把权重、缓存和工作区分配在这片独立显存中。颗粒位置是三维重建近似。',
    refs: ['rtxWhitepaper', 'rtx5090', 'cudaTransfer'],
  },
  gpuGpc: {
    title: 'GPC → TPC → SM',
    text: 'RTX 5090 启用 11 个 GPC、85 个 TPC，每个 TPC 包含两个 SM。单个 SM 视图可以查看 CUDA、Tensor、调度与本地存储资源。',
    refs: ['rtxWhitepaper', 'rtxArchitecture'],
    jump: ['gpu', 'sm'],
  },
  gpuL2: {
    title: '96 MB 片上 L2',
    text: 'SM 通过片上缓存和内存控制器访问全局数据。命中 L2 时，相关的数据读取可以在芯片内完成，减少对 GDDR7 的访问。',
    refs: ['rtxWhitepaper'],
  },
  gpuMc: {
    title: '16 个 32-bit 显存控制器',
    text: '控制器合计提供 512-bit 接口，与卡上的 GDDR7 相连。推理阶段的实际带宽取决于数据布局、访问粒度、缓存命中与并发。',
    refs: ['rtxWhitepaper', 'cudaTransfer'],
  },
  gpuHost: {
    title: 'GB202 的 PCIe Host 接口',
    text: 'Host 经 PCIe 提交工作并在需要时搬动数据。显存中的张量可以跨 CUDA kernel 保留，后续 kernel 经本地显存层级读取它们。',
    refs: ['rtxWhitepaper', 'cudaTransfer', 'slots'],
    jump: ['board', 'gpu-link'],
  },
  gpuSm: {
    title: '一个 Blackwell SM',
    text: '每个 SM 包含四个处理分区，共 128 个 CUDA Core、四个第五代 Tensor Core、256 KB 寄存器文件、128 KB L1 / Shared Memory 和一个 RT Core。',
    refs: ['rtxWhitepaper', 'rtxArchitecture'],
  },
  gpuCuda: {
    title: 'CUDA Core · 128 / SM',
    text: '四组各 32 个执行单元用于通用 GPU 运算。逐元素运算、归约与数据变换会用到这些算术和访存资源，实际用量由 kernel 决定。',
    refs: ['rtxWhitepaper'],
  },
  gpuTensor: {
    title: '第五代 Tensor Core · 4 / SM',
    text: 'Tensor Core 执行支持的数据类型和形状上的矩阵乘累加。推理引擎需要选用对应的 kernel，才能使用 Blackwell 的 FP4、FP8、BF16 等算力。',
    refs: ['rtxWhitepaper'],
  },
  gpuShared: {
    title: 'L1 / Shared Memory · 128 KB / SM',
    text: 'SM 的 L1 / Shared Memory 容量可按工作负载配置。Shared Memory 可在同一线程块内重用数据，典型用途是暂存矩阵分块。',
    refs: ['rtxWhitepaper', 'cudaTransfer'],
  },
  gpuScheduler: {
    title: 'Warp 调度、指令分派与寄存器',
    text: 'SM 的四个处理分区各自包含 Warp 调度器、分派单元和寄存器资源。线程块占用的寄存器和 Shared Memory 会影响可同时驻留的 Warp 数。',
    refs: ['rtxWhitepaper'],
  },
  gpuLinkSlot: {
    title: 'Host DDR5 ↔ CPU I/O ↔ PCI_E1 ↔ GDDR7',
    text: '高亮箭头表示数据负载的逻辑方向。一次 CUDA Host ↔ Device 拷贝穿过 CPU 侧根端口和 GPU 卡边，GPU 侧可将负载写入或读自显存。两项时间分别用所选字节量除以 PCIe 编码后带宽和显存标称带宽。',
    refs: ['slots', 'rtxWhitepaper', 'pcieGenerations', 'cudaTransfer'],
  },
};
