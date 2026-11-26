import { gpuTransferBounds, hostLinkGBs } from './gpu-profile.mjs';

const revision = 'd3bc4d8b0f63f0eee46bfa69e460073a00b04591';
const sglang = 'https://github.com/sgl-project/sglang/blob/' + revision;

export const inferenceSources = {
  h3Case: ['SGLang 单卡实测', sglang + '/docs/cookbook/diffusion/MiniMax/MiniMax-H3.mdx#rtx-5090-single-card-physical-desktop'],
  h3Offload: ['SGLang 分层卸载源码', sglang + '/python/sglang/multimodal_gen/runtime/managers/memory_managers/layerwise_offload.py'],
  ssd990Read: ['三星 990 PRO 2 TB 规格', 'https://www.samsung.com/us/business/memory-storage/nvme-ssd/990-pro-pcie-4-0-nvme-ssd-2tb-sku-mz-v9p2t0b-am/'],
};

export const inferenceCase = Object.freeze({
  title: 'SGLang Diffusion · MiniMax-H3',
  referenceHardware: 'RTX 5090 · Ryzen 9 9950X · 60 GB RAM · 8 GB swap · 9100 PRO / PCIe 5.0 · Ubuntu 24.04',
  sceneHardware: 'RTX 5090 FE · Ryzen 9 7950X · 32 GB DDR5 · 990 PRO / PCIe 4.0',
  workload: '864 × 480 · 124 帧 · 20 步 · 未剪枝 BF16',
  textSeconds: 4.2,
  denoiseStepSeconds: '5.14–5.17',
  decodeSeconds: 6.4,
  requestSeconds: '112.2 / 112.1',
  residentDitLayers: 14,
  pinnedDitLayers: 34,
  totalDitLayers: 50,
  diskLayersPerStep: '约 2',
  textEncoderGiB: 46,
  ditDiskGiB: 51.3,
  courierWaitSeconds: 0.9,
});

const ssdReadGBs = 7.45;
const { pcieMs } = gpuTransferBounds(1024);
export const inferenceTransferMs = Object.freeze({
  ssd: 2 ** 30 / (ssdReadGBs * 1e6),
  h2d: pcieMs,
});
export const inferenceBounds = Object.freeze({
  ssd: inferenceTransferMs.ssd.toFixed(2) + ' ms',
  h2d: inferenceTransferMs.h2d.toFixed(2) + ' ms',
  ssdRate: ssdReadGBs + ' GB/s',
  h2dRate: hostLinkGBs.toFixed(2) + ' GB/s',
});

export const inferenceModes = Object.freeze([
  ['offload', 'CPU offload'],
  ['resident', '显存常驻（DiT 层）'],
]);

export const inferenceTracks = {
  nvme: { title: 'NVMe 读盘', color: '#ffc275', target: 'host' },
  h2d: { title: 'PCIe H→D', color: '#8ec6ff', target: 'vram' },
  compute: { title: 'GPU 本地取权重', color: '#7be7b4', target: 'core' },
};

export function inferenceStepColor(entry) {
  const active = entry.tracks.find(track => inferenceTracks[track].target === entry.target);
  return inferenceTracks[active]?.color || '#e8c67d';
}

export const inferenceTopicLabels = {
  inferenceCase: '实测条件',
  inferenceDisk: '990 PRO',
  inferenceHost: '主机 DDR5',
  inferenceVram: 'GDDR7',
  inferenceCore: 'GB202',
};

export const inferenceTopics = {
  inferenceCase: {
    title: '单卡案例与演示平台',
    text: '实测使用 9100 PRO 和 60 GB 主机内存。三维回放沿用本场景的 990 PRO 与 32 GB DDR5，显示同类数据路径。常驻与卸载对比聚焦同类 DiT 权重块。',
    refs: ['h3Case', 'h3Offload'],
  },
  inferenceDisk: {
    title: '990 PRO · 本地检查点',
    text: '权重文件在 SSD。缺少相应主机缓存时，由主机发起文件读取，NVMe 控制器将数据 DMA 到主机内存。SSD 的顺序吞吐影响冷加载、文本编码器的流式读取和检查点补读。',
    refs: ['h3Case', 'ssd990Read'],
  },
  inferenceHost: {
    title: '主机 DDR5 · 页锁缓冲',
    text: 'CPU offload 把可保留的权重放在主机内存，拷贝流可以预取到 GPU 缓冲。主机容量控制能缓存多少层，影响后续是否需要回 SSD 取权重。',
    refs: ['h3Case', 'h3Offload', 'cudaTransfer'],
  },
  inferenceVram: {
    title: 'RTX 5090 · 32 GB GDDR7',
    text: '显存同时容纳常驻权重、流式权重槽和工作张量。分层卸载只让正在处理或预取的权重进入相应的设备缓冲槽，已常驻的 DiT 层可在后续去噪步直接复用。',
    refs: ['rtx5090', 'h3Case', 'h3Offload'],
  },
  inferenceCore: {
    title: 'GB202 · 文本编码、去噪和 VAE',
    text: 'CPU 管理请求、读取与拷贝，RTX 5090 执行相应的 GPU 算子。预取赶上时，DiT 的关键路径主要是 GPU 计算。下层权重未及时到达时，计算流会等待。',
    refs: ['h3Case', 'h3Offload', 'rtxWhitepaper'],
  },
};

const step = (id, title, focus, bus, tracks, target, text, facts, refs = ['h3Case', 'h3Offload']) => ({
  id, title, focus, bus, tracks, target, text, facts, refs,
});
const c = inferenceCase;

const openCheckpoint = step('checkpoint', '打开本地检查点', 'full', '冷加载 · 权重文件', [], 'ssd',
  '服务先定位权重文件与张量切片。回放用一个 1 GiB 的代表性块演示冷加载，接着查看原案例的文本编码、DiT 去噪与 VAE 解码。',
  [['权重位置', '990 PRO · 检查点'], ['回放单位', '1 GiB 示例块'], ['计时范围', '冷加载独立展示']]);

const readWeights = step('read-ssd', '从 990 PRO 读到 DDR5', 'disk', 'NVMe DMA · SSD → 主机 DDR5', ['nvme'], 'host',
  '读取缺少缓存的文件区段时，990 PRO 从介质取数据，经 M2_1 把内容送入主机缓冲。高亮显示权重字节的方向。',
  [['SSD · 顺序读标称', inferenceBounds.ssdRate], ['1 GiB · 规格推算', '约 ' + inferenceBounds.ssd],
    ['GPU', '等待权重进入设备缓冲']], ['ssd990Read', 'h3Case']);

const loadGpu = step('load-vram', '把权重送入 GDDR7', 'copy', 'CUDA H→D · DDR5 → PCI_E1 → GDDR7', ['h2d'], 'vram',
  '拷贝引擎从主机缓冲取权重，经 CPU 根端口和 PCI_E1 写入显存。页锁缓冲和独立拷贝流可以让后续拷贝与计算重叠。',
  [['PCI_E1 · 编码后上限', inferenceBounds.h2dRate], ['1 GiB · 规格推算', '约 ' + inferenceBounds.h2d],
    ['权重位置', 'RTX 5090 · GDDR7']], ['slots', 'pcieGenerations', 'cudaTransfer']);

const textEncoder = step('text-encode', '文本编码器流式读权重', 'full', 'SSD → DDR5 → GDDR7 → GB202', ['nvme', 'h2d', 'compute'], 'core',
  '原案例每个请求流式读取约 ' + c.textEncoderGiB + ' GiB 文本编码器权重。块到达显存后由 GPU 做编码。上游报告这段对 SSD 的持续顺序吞吐敏感。',
  [['原机实测 · 文本编码', c.textSeconds + ' s'], ['权重文件读取', '约 ' + c.textEncoderGiB + ' GiB / 请求'],
    ['原机 SSD', '9100 PRO · PCIe 5.0']], ['h3Case']);

const vaeDecode = step('vae-decode', 'VAE 解码', 'gpu', 'RTX 5090 · VAE 解码算子', ['compute'], 'core',
  '去噪结束后，GPU 解码潜变量。原案例设置 video_vae=36，将这组视频 VAE 解码层保留在显存中，回放聚焦本地解码。',
  [['原机实测 · 解码', c.decodeSeconds + ' s'], ['GPU', 'VAE 解码算子'], ['解码权重', '视频 VAE 层已在显存']], ['h3Case']);

const end = step('result', '核对一轮请求的实测', 'full', '上游整轮请求 · 两次实跑', [], 'core',
  '原机共执行 20 个去噪步。逐阶段时间和请求总时间取自 SGLang 的报告，三维播放按观察节奏推进。两种权重路径在同一个混合驻留案例中都能看到。',
  [['原机实测 · 请求', c.requestSeconds + ' s'], ['文本编码 / 解码', c.textSeconds + ' s / ' + c.decodeSeconds + ' s'],
    ['原机实测 · 去噪', c.denoiseStepSeconds + ' s / 步']], ['h3Case']);

const residency = {
  resident: [
    step('dit-feed', '常驻层直接读 GDDR7', 'gpu', 'DiT · GDDR7 → GB202', ['compute'], 'core',
      '选中一块在预热时已放进显存的 DiT 权重。进入去噪时，GPU 经本地显存层级取权重。这个对比单位是一层的权重路径。',
      [['原案例 · 常驻 DiT 层', c.residentDitLayers + ' / ' + c.totalDitLayers],
        ['GPU', '本地显存访问和 kernel'], ['SSD', '参与此前冷加载']]),
    step('dit-storage', '下一步继续复用常驻层', 'gpu', 'DiT · 显存中的同一权重', ['compute'], 'core',
      '本层的权重跨去噪步保留在 GDDR7，下一步可再次使用。显存还要给工作张量以及流式层的缓冲槽留出空间。',
      [['每步 NVMe 读盘', '此常驻层 0 次'], ['每步 H→D', '此常驻层 0 次'],
        ['比较范围', '同类 DiT 权重块']]),
    step('dit-overlap', '常驻层由 GPU 执行', 'gpu', 'DiT · 本地读取与计算', ['compute'], 'core',
      'GPU 继续执行该层的注意力和矩阵运算。GPU 算力与显存访问决定本地阶段的成本，整模型里其他卸载层仍有自己的取权重路径。',
      [['本层的主要因素', 'GPU kernel / 显存访问'], ['SSD', '此常驻层在循环中无需补读'],
        ['原机整步 · 混合驻留', c.denoiseStepSeconds + ' s / 步']]),
  ],
  offload: [
    step('dit-feed', '从页锁 DDR5 预取卸载层', 'copy', 'DiT · DDR5 命中 → H→D', ['h2d'], 'vram',
      '未保留在 GPU 的权重可以留在页锁主机内存。下一次执行前经 PCI_E1 预取到显存缓冲槽，矩阵计算在 GB202 上执行。',
      [['原案例 · 页锁 DiT 层', c.pinnedDitLayers + ' / ' + c.totalDitLayers],
        ['主机命中', '本次由 DDR5 供数'], ['每次使用前', '按需 H→D 拷贝']]),
    step('dit-storage', '主机缓存未命中，SSD 补读', 'full', 'DiT · SSD → 主机缓冲 → GDDR7', ['nvme', 'h2d'], 'vram',
      '页锁缓存容纳不了所有卸载层时，预取队列从检查点补读剩余权重，再把它送入 GPU 槽位。更小的主机内存可能提高这种读盘比例。',
      [['原机 · 每步来自 SSD', c.diskLayersPerStep + ' 个 DiT 层'],
        ['原机 · DiT 读盘', c.ditDiskGiB + ' GiB / 请求'], ['SSD', '影响补读与预取就绪时间']]),
    step('dit-overlap', 'GPU 计算与下一层预取重叠', 'full', '当前层执行 ＋ 下一层取数', ['compute', 'nvme', 'h2d'], 'core',
      '绿色显示 GB202 执行当前层，琥珀色与蓝色显示下一层在 SSD 未命中路径上的准备。只读权重的源保留在主机侧，GPU 用完可复用缓冲槽。原机大部分 DiT 读盘被计算覆盖。',
      [['原机实测 · 去噪', c.denoiseStepSeconds + ' s / 步'],
        ['原机 · 计算线程等搬运', c.courierWaitSeconds + ' s / 请求'], ['慢到无法重叠时', '下一层就绪延迟进入关键路径']]),
  ],
};

const flows = Object.fromEntries(Object.entries(residency).map(([mode, stages]) => [
  mode, [openCheckpoint, readWeights, loadGpu, textEncoder, ...stages, vaeDecode, end],
]));

const hostOverlap = step('dit-overlap', 'GPU 计算与 DDR5 预取重叠', 'full',
  '当前层执行 ＋ 从 DDR5 预取下一层', ['compute', 'h2d'], 'core',
  '当前层在 GB202 上计算。下一层的权重已在页锁 DDR5，由拷贝流送入 GDDR7，可以与当前层计算并行。时间轴显示本次 H→D 拷贝何时就绪。',
  [['本窗口 · 下一层来源', 'DDR5 命中'], ['GPU', '当前层计算与 H→D 重叠'],
    ['原机实测 · 混合驻留', c.denoiseStepSeconds + ' s / 步']]);
const hostFlow = flows.offload.map(entry => entry.id === hostOverlap.id ? hostOverlap : entry);

export function inferenceSteps(mode, source = 'ssd') {
  if (mode === 'offload' && source === 'host') return hostFlow;
  return flows[mode] ?? flows.offload;
}
