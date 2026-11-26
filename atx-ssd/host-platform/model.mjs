import { gpuProfile, gpuSources, gpuTopics } from './gpu-profile.mjs';
import { inferenceSources, inferenceTopics } from './inference-flow.mjs';
import { powerSources, powerTopics } from './power-flow.mjs';

export const sources = {
  ...gpuSources,
  ...inferenceSources,
  ...powerSources,
  board: ['MSI 主板手册', 'https://download.msi.com/archive/mnu_exe/mb/MAGB650TOMAHAWKWIFI.pdf#page=28'],
  slots: ['MSI 插槽与共享说明', 'https://download.msi.com/archive/mnu_exe/mb/MAGB650TOMAHAWKWIFI.pdf#page=31'],
  spec: ['MSI 产品规格', 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification'],
  photo: ['MSI 实物照片', 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Gallery'],
  pc: ['PC Anatomy · MIT', 'https://github.com/Yoosseph/pc-anatomy/tree/485a649b697a3e367a611860d278d8de26304e76'],
  cpu: ['AMD Ryzen 9 7950X', 'https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html'],
  zen: ['AMD Raphael 芯粒框图', 'https://gpuopen.com/download/GDC2024_AMD_Ryzen_Processor_Software_Optimization.pdf#page=12'],
  iommu: ['AMD IOMMU 规范', 'https://www.amd.com/content/dam/amd/en/documents/processor-tech-docs/specifications/48882_IOMMU.pdf'],
  dimm: ['Kingston DDR5-5200 UDIMM 数据表', 'https://www.kingston.com/datasheets/KVR52U42BS8-16.pdf'],
  dram: ['Micron DDR5 技术资料', 'https://www.micron.com/products/memory/dram-components/ddr5-sdram'],
  ramulator: ['Ramulator 2 DDR5 源数据', 'https://github.com/CMU-SAFARI/ramulator2/blob/7bead6cb7c4b03e095c6d4769ae3181a8e0bf6da/python/ramulator/dram/ddr5.py'],
  cell: ['CMU 的 DRAM 单元与感测模型', 'https://pdl.cmu.edu/PDL-FTP/NVM/TLDRAM-Lee.pdf'],
  ssd: ['原 990 PRO 物理模型', '../../ssd-model/view.html#mount/socket'],
  media: ['追入 990 PRO 主控与 NAND', '../../ssd-model/view.html#stack/read/6'],
  flash: ['990 PRO 的 NAND 与板内事务依据', '../../ssd-model/io-path-evidence.md'],
  pcie: ['M.2 M-key 模块针位，第 12–13 页', 'https://advdownload.advantech.com/productfile/Downloadfile3/1-2VEJUIE/Advantech%20SQFlash_PCIe%20NVMe%20M.2%202280_M%20Key_720-D-DS_v1.13_20241223.pdf#page=12'],
  nvme: ['NVMe over PCIe 传输规范', 'https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/'],
  nvmeBase: ['NVMe Base 与 NVM Command Set', 'https://nvmexpress.org/specifications/'],
  block: ['Linux blk-mq', 'https://docs.kernel.org/block/blk-mq.html'],
  linux: ['Linux v6.12 NVMe PCI 驱动', 'https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c'],
  dma: ['Linux DMA 映射指南', 'https://docs.kernel.org/core-api/dma-api-howto.html'],
  mmio: ['Linux MMIO 与有序访问', 'https://docs.kernel.org/driver-api/device-io.html'],
  msi: ['Linux MSI/MSI-X', 'https://docs.kernel.org/PCI/msi-howto.html'],
  qemu: ['QEMU v9.2.0 NVMe 事件', 'https://github.com/qemu/qemu/blob/v9.2.0/hw/nvme/trace-events'],
};

const fact = (title, text, refs, jump) => ({ title, text, refs, jump });
export const topics = {
  ...gpuTopics,
  ...inferenceTopics,
  ...powerTopics,
  board: fact('MSI MAG B650 TOMAHAWK WIFI', '243.84 × 304.80 mm 标准 ATX。AM5 插座、四个 DDR5 插槽、三个 M.2 和两个全长 PCIe 插槽。整板以 MSI 俯视图对位，器件几何来自适配后的开源模型。', ['board','photo','pc']),
  socket: fact('AM5 · LGA1718 插座', 'CPU 封装底面接触焊盘与主板弹性触点贴合。压框、扳杆和散热器扣具提供机械约束。展开可看接触面，触点采用代表性阵列。', ['board','cpu','pc'], ['cpu','package']),
  ram: fact('DIMMA2 / DIMMB2', '两条可拆卸 16 GB DDR5 UDIMM，按 MSI 的两条安装顺序使用 A2 与 B2。7950X 的内存控制器有 A、B 两个通道，每条常规 DDR5 UDIMM 内有两个 32-bit 子通道。', ['board','cpu','dimm'], ['dram','module']),
  m2_1: fact('M2_1 · CPU 直连', 'PCIe 4.0 ×4。配置中 990 PRO 2 TB 裸盘安装在 2280 固定点。这里的事务从 CPU I/O 裸片直接进入 SSD，无需经过 B650。', ['slots','ssd'], ['host','read']),
  m2_2: fact('M2_2 · CPU 直连', '第二个 PCIe 4.0 ×4 插槽，支持 2260 / 2280。示例样机中空置。', ['slots','spec']),
  m2_3: fact('M2_3 · 经 B650', 'PCIe 4.0 ×4。与 PCI_E2 同时安装设备时，M2_3 和 PCI_E2 各以 ×2 运行。回 CPU 的数据还经过芯片组上行链路。', ['slots','spec']),
  chipset: fact('AMD B650 芯片组', '为 M2_3、PCI_E2、PCI_E3 等外设提供连接，并通过共享 PCIe ×4 上行链路接 AMD CPU。显示的芯片中心、铜线与高度采用原理坐标。', ['slots','spec']),
  pcieSlots: fact('PCI_E1 / PCI_E2 / PCI_E3', 'PCI_E1 在 Ryzen 7000 配置下是 CPU 直连 Gen4 ×16。全长外形的 PCI_E2 来自芯片组，电气 Gen4 ×2。PCI_E3 为芯片组 Gen3 ×1。', ['slots']),
  rear: fact('后置 I/O 与板边接口', '包含显示、USB、2.5 GbE、Wi‑Fi 天线与音频连接。主板还提供六个 SATA 口。后挡板与小器件采用近似几何。', ['board','photo','spec']),
  storage: fact('Samsung 990 PRO 2 TB', '沿用原模型的 SSD PCB、M-key 卡边、贴纸、Pascal 控制器与 NAND 封装网格，保持 80 × 22 mm 及原连接器零点。', ['ssd','media']),
  package: fact('Ryzen 9 7950X · Raphael', 'AM5 台式处理器。两颗 71 mm² CCD，共 16 核 32 线程与 64 MB L3，另有一颗 122 mm² I/O 裸片。IHS、裸片和封装布线以功能结构呈现。', ['cpu','zen','pc']),
  ccd: fact('双 CCD · 每颗八个 Zen 4 核', '每颗 CCD 由八个核心共享 32 MB L3。每个核心有 32 KB L1I、32 KB L1D 和 1 MB 私有 L2。点核心进入功能放大。', ['cpu','zen'], ['cpu','core']),
  cache: fact('L1I / L1D / L2 / L3', '取指和数据访问首先使用独立的 L1。L2 为每核私有，L3 在同一 CCD 内共享。Host 的 SQ 写入、MMIO 写入和 DMA 观察有各自的地址属性与顺序规则。', ['zen','dma','mmio'], ['cpu','core']),
  fabric: fact('Infinity Fabric / Data Fabric', '跨 CCD 与 IOD 搬运互连请求。IOD 的 Data Fabric 通往内存控制器、I/O Hub 和集成图形等功能，I/O 事务的可见性由平台及 DMA API 确定。', ['zen','dma']),
  iod: fact('IOD · I/O 裸片', '内含 DDR5 UMC、PCIe I/O Hub、显示和集成图形等功能。放大视图把根端口、IOMMU 与内存路径画成逻辑模块。', ['cpu','zen','iommu'], ['cpu','io']),
  root: fact('PCIe Root Complex / Root Port', '把配置空间访问、BAR MMIO 与设备发起的 PCIe 事务接到主机地址空间。M2_1 接 CPU 提供的链路，根端口及 SSD 使用相反的 Tx/Rx 视角。', ['zen','slots','nvme']),
  iommu: fact('IOMMU · 设备地址翻译', '示例使用 DMA 重映射。设备按 DMA 地址请求，IOMMU 结合设备上下文和页表得到物理地址、检查权限。CPU 虚拟地址另走 CPU MMU。', ['iommu','dma']),
  umc: fact('UMC · DDR5 内存控制器', '控制器依据请求地址选择通道、rank、bank 与列行，仲裁读写和刷新。图中只演示 DDR5 命令与一个 bank 的动作，物理地址位交织由平台配置决定。', ['zen','dram','ramulator'], ['dram','die']),
  front: fact('Zen 4 前端', '用分支预测驱动取指，经 L1I、解码或微操作缓存，把操作送到重命名和调度。布局只表示依赖关系。', ['zen']),
  execute: fact('发射、执行与退休', '核心调度整数、浮点和地址生成操作。例中的 CPU 指令构造 SQE、写门铃或检查完成；PCIe 数据搬运由 SSD DMA 发起。', ['zen','linux','dma']),
  mmu: fact('CPU MMU / DTLB', '把 CPU 虚拟地址翻译到物理地址空间。普通缓存内存和 BAR MMIO 采用各自映射，这两类访问经过不同的资源与排序路径。', ['dma','mmio']),
  module: fact('DDR5-5200 · 16 GB 1Rx8 UDIMM', '以 Kingston KVR52U42BS8-16 为电气参考。288 触点，一个 rank，共八颗 16 Gb ×8 器件，四颗服务一个 32-bit 子通道。整机两条合计 32 GB。', ['dimm','pc','ramulator']),
  chips: fact('每个子通道四颗 ×8', '一个子通道的四颗 ×8 器件合计 32 条数据线。BL16 乘 32 bit 得 64 B 数据；控制器可独立调度两个子通道。', ['dram','ramulator','dimm'], ['dram','bga']),
  pmic: fact('模块侧 PMIC 与去耦', 'DDR5 UDIMM 随模块安置电源管理器件及去耦，向 DRAM 等器件供应所需电源。PMIC 电路和器件位置以开源模组几何表示。', ['dimm','dram','pc']),
  spd: fact('SPD Hub', '保存模组组织、支持的速率和时序等信息，供主机初始化读取。图中的散热片来自供体，有无散热片取决于实际模组。', ['dram','dimm']),
  bga: fact('DDR5 DRAM · FBGA', '从封装塑封层逐级看到硅片、键合线、封装基板和焊球。采用开放的教学封装，球位和键合扇出为代表形状。', ['pc','dimm'], ['dram','die']),
  banks: fact('16 Gb ×8 裸片 · 32 banks', 'Ramulator 2 的 DDR5_16Gb_x8 预设有 8 个 bank groups，每组 4 个 banks，每 bank 2¹⁶ 行 × 2¹⁰ 列。阵列外围还包括命令译码、刷新、片上纠错、预取与 DQ I/O。', ['ramulator','dram','pc'], ['dram','bank']),
  bank: fact('Bank · 行缓冲与列选择', 'ACT 打开一行，局部感测放大器锁存并恢复整行。RD 或 WR 经列选择访问活动行，PRE 关行并使位线重新均衡。多个 subarray 的数量和布置以示意表示。', ['ramulator','cell','pc'], ['dram','cell']),
  cell: fact('1T1C · 读出、恢复与刷新', '字线打开访问晶体管，存储电容和预充位线分荷，感测放大后沿同一路恢复电荷。刷新时芯片内部也进行感测与恢复。', ['cell','ramulator','pc']),
  app: fact('应用 / 文件系统 / blk-mq', '示例为一次 4 KiB、对齐的直接 I/O。文件系统或裸块路径把 I/O 交给块层。blk-mq 组织 bio、request、tag 和硬件队列。', ['block','linux']),
  driver: fact('Linux NVMe PCI 驱动', '驱动准备 SQE 和数据描述，映射 DMA 地址，写门铃，检查 CQE phase 并按 CID 完成块请求。', ['linux','nvme']),
  sq: fact('Submission Queue · SQ', '示例为主机内存中的环形 SQ，单条 SQE 64 B。CPU 写队列，SSD 通过 Memory Read 取走命令。', ['nvme','linux','dma']),
  buffer: fact('数据页 · PRP1', '这次示例使用 4 KiB 对齐 DMA 页，PRP1 覆盖整个负载。CPU 虚拟地址、主机物理地址、设备 DMA 地址可各不相同。', ['nvmeBase','dma']),
  cq: fact('Completion Queue · CQ', '单条 CQE 16 B，通过 SSD 发出的 Memory Write 写入主机内存。主机用 Phase Tag 判断新项，CID 和 SQID 匹配命令，SQHD 报告 SQ 消费位置。', ['nvme','linux']),
  irq: fact('MSI-X / 主机轮询', '中断模式中，设备结算完成后发已配置的 MSI-X 写，主机再读取 CQ。轮询模式由 CPU 检查 CQE phase，示例为该 CQ 禁用中断。', ['msi','linux','nvme']),
  bar: fact('BAR0 · 门铃 MMIO', '主机写的是 PCIe 地址窗口里的设备寄存器。示例 QID=1、DSTRD=0，SQ Tail 门铃偏移 0x1008，CQ Head 门铃偏移 0x100C。', ['nvme','mmio','linux']),
  ctrl: fact('990 PRO · NVMe PCIe Function', '端点取 SQE，按 PRP 执行 DMA，并写 CQE。原 SSD 模型可继续追踪 Pascal 主控、FTL、ECC 与 NAND。', ['nvme','media','qemu']),
  nand: fact('990 PRO · NAND A 原位剖视', '选择一个 NAND 封装演示读页和编程。图中展示行地址、串选择栅、字线、位线、感测与页缓冲。主机 4 KiB 是此次 I/O 的逻辑长度，器件物理页按 NAND 的组织确定。', ['flash','media']),
  integrated: fact('CPU、DDR5 与 990 PRO 共用整板坐标', '单步查看 CPU 发门铃、SSD 抓取命令和访问 NAND，再比较用户数据与 CQE 各自的目标地址。SQ、数据页、CQ 挂在 DIMM 旁表示主机逻辑地址。', ['board','nvme','flash']),
};

export const modes = {
  board: [['assembly','整板装配'],['io','整机读写'],['inference','推理回放'],['pcie','PCIe 走向'],['gpu-link','显卡数据路径'],['ddr','DDR5 信号'],['power','供电']],
  cpu: [['package','封装和 CCD'],['io','I/O 裸片'],['core','单个 Zen 4 核']],
  dram: [['module','DIMM'],['bga','FBGA 封装'],['die','裸片'],['bank','Bank'],['cell','1T1C']],
  gpu: [['card','显卡外观'],['pcb','PCB 剖视'],['die','GB202 裸片'],['sm','单个 SM']],
  host: [['init','控制器初始化'],['read','读 4 KiB'],['write','写 4 KiB']],
};

export const mainViews = {
  board: ['主板','MSI MAG B650 TOMAHAWK WIFI'],
  cpu: ['CPU','AMD Ryzen 9 7950X'],
  dram: ['DRAM','两条 16 GB DDR5 UDIMM'],
  gpu: ['GPU',gpuProfile.name],
  host: ['Host','Linux · PCIe / NVMe'],
};

export const lanePins = n => ({
  rx: [41 - 12*n, 43 - 12*n],
  tx: [47 - 12*n, 49 - 12*n],
});

export const memoryProfile = Object.freeze({
  organization: 'DDR5_16Gb_x8', timingPreset: 'DDR5_5200B',
  deviceBits: 8, subchannelBits: 32, bankGroups: 8, banksPerGroup: 4,
  rowsPerBank: 2 ** 16, columnsPerRow: 2 ** 10, burstTransfers: 16,
  rateMTs: 5200, clockPs: 384, CL: 42, RCD: 42, RP: 42, RAS: 84, RC: 126, RTP: 20, CWL: 40, WR: 78, BL: 8,
  DIMMs: 2, subchannelsPerDIMM: 2, idealGBs: 83.2,
});

const h = (id, title, bus, text, path, change = {}, refs = ['nvme','linux']) => ({
  id, title, bus, text, path, change, refs,
});
export const hostExample = Object.freeze({
  qid: 1, depth: 4, dstrd: 0, cid: '0x002A', nsid: 1, lba: '0x1000', lbaBytes: 512, nlb: 7,
  prp1: '0x4100_0000', physical: '0x8_4100_0000', cpuVA: '0x7F00_4100_0000',
  sqDoorbell: 'BAR0 + 0x1008', cqDoorbell: 'BAR0 + 0x100C',
});
const initialization = irq => [
  h('power-on','上电与建链','PCIe PHY','3.3 V 稳定后按平台时序释放 PERST#，根端口与端点训练并协商链路。本例以 Gen4 ×4 可用为前提。',['root','ctrl'],{link:'Gen4 ×4'},['pcie','slots']),
  h('enum','枚举并映射 BAR','PCIe Configuration','系统分配 BDF、BAR 地址与资源。驱动启用 PCI Memory Space 和 Bus Master，准备 MMIO 及 DMA 地址能力。',['driver','root','bar'],{bar:'BAR0 已映射'},['linux','dma','mmio']),
  h('disable','使控制器进入 Disabled','MMIO','读取 CAP 并在需要时清 CC.EN，等待 CSTS.RDY=0，然后准备 Admin 队列。',['driver','root','bar','ctrl'],{ready:'CC.EN=0 / CSTS.RDY=0'}),
  h('admin','配置 Admin SQ 与 CQ','AQA · ASQ · ACQ','分配 DMA 一致性内存，将 Admin SQ、CQ 的深度与 DMA 基址写入寄存器。',['driver','sq','cq','bar'],{admin:'Admin SQ/CQ 已分配'}),
  h('enable','使能与等待就绪','CC.EN / CSTS.RDY','配置 MPS 和所需队列项大小，置 CC.EN=1，再等待控制器置 CSTS.RDY=1。',['driver','root','bar','ctrl'],{ready:'CC.EN=1 / CSTS.RDY=1'}),
  h('identify','识别并协商 I/O 队列','Admin SQ / CQ','发送 Identify Controller，随后通过 Number of Queues Feature 协商 I/O 队列数；发现命名空间并取得 LBA 格式。',['sq','root','ctrl','cq'],{admin:'可提交 Admin 命令'}),
  h('create-cq','先创建 I/O CQ','Create I/O Completion Queue',irq==='irq'?'将 CQ 关联已配置的 MSI-X 向量，启用该队列的中断。':'配置可轮询 CQ，示例关闭该队列中断。',['driver','cq','root','ctrl'],{queue:'CQ1 已创建'}),
  h('create-sq','再创建关联的 I/O SQ','Create I/O Submission Queue','为 SQ1 指定 CQ1，注册 I/O 队列资源。示例深度为 4，后续 4 KiB 场景从一次环回示例的初态开始。',['driver','sq','root','ctrl'],{queue:'SQ1 → CQ1'}),
];

export function hostSteps(kind, irq = 'irq') {
  if (kind === 'init') return initialization(irq);
  const read = kind === 'read';
  return [
    h('submit','应用提交 4 KiB','direct I/O → blk-mq','请求以 4 KiB 对齐进入块层，队列分配 request 与 tag。示例命名空间采用 512 B LBA，单笔请求覆盖 8 个 LBA。',['app','driver'],{},['block','linux']),
    h('map','建立数据页 DMA 映射','VA → PA，IOVA → PA',read?'驱动以 DMA_FROM_DEVICE 映射目的页，PRP1 填设备可用地址。':'驱动以 DMA_TO_DEVICE 映射已填好的源页，PRP1 填设备可用地址。',['driver','iommu','buffer'],{mapping:'PRP1 → IOVA → PA',data:read?'等待 SSD 数据':'CPU 数据已就绪'},['dma','linux']),
    h('sqe','CPU 填写 SQ[3]','64 B SQE',read?'NVMe Read 的 OPC=0x02，NSID=1，SLBA=0x1000，零起算的 NLB=7 表示 8 个 LBA。':'NVMe Write 的 OPC=0x01，SLBA=0x1000，NLB=7 表示 8 个 LBA，示例显式设置 FUA=1。',['driver','sq'],{sqEntry:'SQ[3] 已填，CID 0x002A'}),
    h('doorbell','CPU 写 SQ Tail 门铃','MWr · Host → SSD','先发布 SQE，再有序写 MMIO。QID=1、DSTRD=0，SQ Tail 环回到 0，门铃位于 BAR0 + 0x1008。',['driver','root','bar','ctrl'],{sqTail:0},['nvme','linux','mmio']),
    h('sq-mrd','SSD 请求读取 SQE','MRd · SSD → Host','端点向 SQ[3] 的 DMA 地址发带 Tag 的 Memory Read，请求经过根端口与 DMA 地址域。',['ctrl','root','iommu','sq']),
    h('sq-cpl','主机返回 SQE','CplD · Host → SSD','主机互连读取队列内存并由根端返回 Completion with Data。SSD 消费 SQE，SQ 内部头指针环回到 0。',['sq','root','ctrl'],{sqHead:0}),
    ...(read ? [
      h('media','SSD 处理并读介质','NAND / ECC / FTL','这条示例取一次 NAND 读取路径。设备完成映射、介质读取、ECC 与数据整理。',['ctrl'],{},['media','nvmeBase']),
      h('data-mwr','SSD 写回 4 KiB','MWr · SSD → Host','SSD 对 PRP1 发一组 posted Memory Write。根复合体和 IOMMU 把负载送到主机内存域，设备按规范保证数据先于完成项可见。',['ctrl','root','iommu','buffer'],{data:'4 KiB 已写到主机'}),
    ] : [
      h('data-mrd','SSD 请求读取数据页','MRd · SSD → Host','SSD 按 PRP1 发一次或多次非 posted Memory Read。这里 4 KiB 是整次 I/O 的总长度。',['ctrl','root','iommu','buffer']),
      h('data-cpl','主机发送待写数据','CplD · Host → SSD','主机以一组带数据的 Completion 返回源页，SSD 按请求 Tag 组织负载。',['buffer','root','ctrl'],{data:'4 KiB 已到 SSD'}),
      h('media','SSD 完成 FUA 写','NAND / FTL','示例 Write 的 FUA=1。命令成功前，需满足对该次写数据和相关元数据的非易失保存要求。',['ctrl'],{data:'该次 FUA 写已满足持久性'},['media','nvmeBase']),
    ]),
    h('cqe','SSD 发布 CQ[3]','MWr · SSD → Host','发布独立的 16 B CQE。示例含 SQID=1、SQHD=0、CID=0x002A、P=1 和成功状态。',['ctrl','root','iommu','cq'],{cqEntry:'CQ[3] P=1 / CID 0x002A'}),
    irq==='irq' ?
      h('irq','设备发 MSI-X','MWr · SSD → 中断目标','设备向配置好的 MSI-X 地址发中断消息。CPU 获得通知并进入队列处理。',['ctrl','root','irq','driver'],{notice:'MSI-X'},['msi','nvme','linux']) :
      h('poll','主机轮询 Phase Tag','CPU load · CQ','CPU 读取 CQ[3] 的状态字，对比期待的 P=1，通过后进入完成处理。',['driver','cq'],{notice:'轮询'},['linux','nvme']),
    h('consume','CPU 消费 CQE','phase / dma_rmb / CID','匹配 phase 后按 Linux 驱动的 DMA 读屏障读取其余字段。CQ Head 环回到 0，下轮期望 P=0。',['cq','driver'],{cqHead:0,phase:0,cqEntry:'CQ[3] 已消费'},['linux','nvme','dma']),
    h('cq-db','CPU 更新 CQ Head 门铃','MWr · Host → SSD','驱动写 BAR0 + 0x100C，让设备知道 CQ Head 更新。驱动收尾 DMA 映射、释放请求资源并向上层报告完成。',['driver','root','bar','ctrl','app'],{mapping:'解除本请求映射',notice:'块请求已完成'}),
  ];
}

export function hostSnapshot(kind, steps, index) {
  const initial = kind==='init' ? {link:'训练前',bar:'未映射',ready:'未启用',admin:'待建',queue:'待建'} :
    {sqHead:3,sqTail:3,cqHead:3,phase:1,sqEntry:'待提交',cqEntry:'P=0，旧数据',data:'待准备',mapping:'未建立',notice:'等待'};
  return Object.assign(initial, ...steps.slice(0,index+1).map(step=>step.change));
}

const d = (id,title,bus,text,marks,values) => ({id,title,bus,text,marks,values,refs:['ramulator','cell']});
export function dramTiming(op,phase) {
  // Ramulator 2.1 DDR5_5200B, same-bank PREpb constraints. ACT starts at zero.
  if(op==='refresh')return phase==='act' ? [['刷新窗口','REFab 后等待 tRFC']] : [];
  const {clockPs,CL,RCD,RP,RAS,RC,RTP,CWL,WR,BL}=memoryProfile;
  const prep=op==='read' ? RTP : CWL+BL+WR;
  const close=Math.max(RAS,RCD+prep);
  const ns=ck=>ck+' CK · '+(ck*clockPs/1000).toFixed(2)+' ns';
  if(phase==='act')return [[op==='read'?'最早 RD':'最早 WR',ns(RCD)]];
  if(phase==='rd')return [['RD → 首数据',ns(CL)],['BL16 传输',ns(BL)]];
  if(phase==='wr')return [['WR → 首数据',ns(CWL)],['WR → PREpb',ns(prep)]];
  if(phase==='close')return [['最早 PREpb',ns(close)],['下次 ACT',ns(Math.max(RC,close+RP))]];
  return [];
}

export function dramSteps(op, bit) {
  const shared = (5 + bit) / 11;  // normalized units, C_bitline / C_cell = 10
  const target = 1 - bit;
  const closed = [0,0.5,0.5,bit,'关闭'];
  const open = [1,bit,1-bit,bit,'已开行'];
  const steps = [
    d('pre','位线预充与均衡','Bank idle','WL 保持低，访问晶体管截止。BL 与参考线预充到归一化的 0.5。',['dram bitline','dram precharge'],closed),
    d('act',op==='refresh'?'刷新内部打开一行':'ACT · 打开一行',op==='refresh'?'REFab 内部动作':'ACT','行译码选择 WL。单元打开后，存储电容和已预充的位线之间发生电荷共享。',['dram wordline','dram access','dram rowdec'],[1,shared,0.5,shared,'感测前']),
    d('sense','感测、锁存与恢复','Sense amplifiers','感测放大器把微小差压放大到逻辑电平。WL 保持开启，同一电平同时沿通路恢复电容电荷。',['dram cellsa','dram access','dram gsa'],open),
  ];
  if (op==='read') steps.push(d('rd','RD · 选列与 Burst','RD · BL16','从已打开的行选列，经读出路径和 I/O 送上 DQ。示例位读出 '+bit+'，行保持打开。',['dram cellsa','dram coldec','dram column','dram prefetch'],open));
  if (op==='write') steps.push(d('wr','WR · 写驱动覆盖所选位','WR · BL16','写驱动经过列选择，将本示例位改写为 '+target+'。WL 仍在高位，存储电容跟随驱动。',['dram coldec','dram access','dram capacitor'],[1,target,1-target,target,'已开行']));
  const finalBit = op==='write' ? target : bit;
  steps.push(d('close',op==='refresh'?'刷新完成并回空闲':'PRE · 关行与重新预充',op==='refresh'?'REFab 完成':'PRE','访问晶体管截止，把恢复后的电荷留在电容。位线重新均衡。例中的行和时刻仅用于机理演示。',['dram precharge','dram wordline'],[0,0.5,0.5,finalBit,'关闭']));
  return steps;
}
