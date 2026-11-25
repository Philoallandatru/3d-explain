import {
  completeCommand, down, event, mmioRead, mmioWrite, protocol, readFields, submitCommand, up, writeFields,
} from './power-demo-protocol.js'

const base = 'https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf'
export const specSources = {
  m2: ['PCI-SIG · M.2 上电边带', 'https://pcisig.com/PCIExpress/ECN/M.2/Power-uprequirementsforPCIesidebandsPERST_etc.'],
  pcie: ['PCIe Base 5.0 · 链路与事务', 'https://pcisig.com/PCIExpress/Specs/Base/_5.0_1.0'],
  l12: ['Intel PIPE 7.1 · L1.2 停钟波形', 'https://cdrdv2-public.intel.com/643108/643108_PIPE_Arch_Spec_Rev_7_1.pdf#page=176'],
  aspm: ['PCI-SIG · CLKREQ# 与 L1 子状态', 'https://pcisig.com/PCIExpress/ECN/Base/L1PMSubstateswithCLKREQ_1.0a'],
  pme: ['PCI-SIG · PME_Turn_Off', 'https://pcisig.com/section-5323-following-error-scenario-valid-rc-sends-pmeturnoff-message-ep-ep-doesnt-respond-ack-due'],
  init: ['NVMe Base 2.4 · 控制器初始化', base+'#page=131'],
  nvme: ['NVMe Base 2.4 · 管理命令与寄存器', base],
  apst: ['NVMe Base 2.4 · APST', base+'#page=494'],
  shn: ['NVMe Base 2.4 · 正常关停', base+'#page=140'],
  rtd3: ['NVMe Base 2.4 · RTD3', base+'#page=695'],
  transport: ['NVMe over PCIe · MMIO、队列与 DMA', 'https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/'],
  nvm: ['NVM Command Set 1.3 · Read、Write 与 FUA', 'https://nvmexpress.org/specification/nvm-command-set-specification/'],
  flush: ['NVMe Base 2.4 §7.2 · Flush', base+'#page=593'],
  nand: ['JEDEC JESD230B · NAND 页与页寄存器', 'https://onfi.org/files/jesd230b-jul3-2014.pdf#page=6'],
  pciPm: ['Linux PCI 电源管理 · D0 与 D3', 'https://docs.kernel.org/power/pci.html'],
  acpi: ['ACPI 6.6 · 系统与设备电源状态', 'https://uefi.org/specs/ACPI/6.6/02_Definition_of_Terms.html'],
  win: ['Microsoft StorNVMe · 电源与关停策略', 'https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/power-management-for-storage-hardware-devices-nvme'],
  uefi: ['UEFI 2.11 · Boot Manager', 'https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html'],
  secure: ['UEFI 2.11 · Secure Boot', 'https://uefi.org/specs/UEFI/2.11/32_Secure_Boot_and_Driver_Signing.html'],
  tpm: ['Microsoft BitLocker · TPM 策略与恢复', 'https://learn.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-recovery-guide-plan'],
  opal: ['TCG · Opal SSC', 'https://www.trustedcomputinggroup.org/resources/documents/storage-work-group-storage-security-subsystem-class-opal'],
}

export const signalKinds = {
  power: {label:'供电',color:'#78f0d2'},
  wire: {label:'时钟与复位',color:'#7ce3ff'},
  pcie: {label:'PCIe',color:'#aab8ff'},
  nvme: {label:'NVMe',color:'#e9aaff'},
  data: {label:'数据',color:'#ffcf8e'},
  trust: {label:'启动与加密',color:'#ffc8e0'},
}

const off = {rail:'断开',reset:'低 · 复位',clock:'停止',link:'未训练',device:'无主电',drive:'未启用'}
const live = {rail:'3.3 V',reset:'高 · 释放',clock:'运行',link:'L0',device:'D0',drive:'就绪 · 操作态'}

const clockRestore = protocol(event('wire','REFCLK 到 SSD PHY','clockSource','socket','refclk','phy'),
  'M.2 · 差分参考时钟', ['53 · REFCLKn','55 · REFCLKp','共同时钟示例'],
  '平台向链路两端提供参考时钟。上电时按 M.2 要求满足时钟稳定与复位释放的关系。', 'm2')
const resetRelease = protocol(event('wire','PERST# 释放','platform','socket','perst','phy'),
  'M.2 · 复位边带', ['50 · PERST#','低有效','解除复位 · 低 → 高'],
  '平台在供电和参考时钟满足条件后释放硬件复位，随后端点可参与链路训练。', 'm2')

function initializeController() {
  return [
    ...mmioRead('CSTS.RDY（复位后）','1Ch',['CSTS.RDY = 0','已有复位已结束'],
      '平台完成传输层恢复后，驱动先确认控制器已禁用并完成上一次复位。', 'init'),
    ...mmioRead('CAP','00h',['CAP.CSS / AMS','CAP.MPSMIN / MPSMAX','CAP.TO','CAP.DSTRD'],
      '主机读能力寄存器以选择命令集、页大小、控制器就绪等待及门铃步距。', 'init'),
    protocol(event('nvme','主机准备 Admin SQ 和 CQ','cpu','sq','cq'),'主机内存 · 队列',
      ['SQID = 0','CQID = 0','清零完成队列内存'],
      '驱动分配并清零管理队列所用的内存，控制器随后通过这些 DMA 地址访问队列。', 'init'),
    mmioWrite('写 AQA','24h',['ASQS / ACQS · 队列大小减 1','配置时 CC.EN = 0'],
      'AQA 记录 Admin SQ 与 CQ 大小。', 'init'),
    mmioWrite('写 ASQ 和 ACQ','28h / 30h',['ASQ · Admin SQ DMA 基址','ACQ · Admin CQ DMA 基址'],
      '分别写入已分配的管理提交队列和完成队列地址。', 'init'),
    mmioWrite('配置 CC 并设 CC.EN = 1','14h',['CC.EN = 1','CC.CSS / CC.AMS','CC.MPS = 0 · 4 KiB 示例'],
      '主机选择已报告支持的设置并启用控制器，之后轮询就绪位。', 'init'),
    ...mmioRead('CSTS','1Ch',['CSTS.RDY = 1'],
      '示例轮询到 RDY 为 1，管理命令路径就绪。', 'init'),
  ]
}

function configureIOQueues() {
  return [
    mmioWrite('设置 I/O 队列项大小','14h',['CC.IOSQES = 6 · 64 B','CC.IOCQES = 4 · 16 B'],
      '本例在已有管理队列、尚无 I/O 队列时，按 Identify 报告的有效范围选择 I/O 项大小。', 'cc'),
    ...submitCommand({label:'Create I/O CQ',fields:['OPC = 05h','QID = 1','QSIZE · 队列大小减 1','PRP1 · CQ 地址']}),
    ...completeCommand('Create I/O CQ'),
    ...submitCommand({label:'Create I/O SQ',fields:['OPC = 01h','QID = 1','CQID = 1','PRP1 · SQ 地址']}),
    ...completeCommand('Create I/O SQ'),
  ]
}

function deleteIOQueues() {
  return [
    ...submitCommand({label:'Delete I/O SQ',fields:['OPC = 00h','CDW10 · QID = 1']}),
    ...completeCommand('Delete I/O SQ'),
    ...submitCommand({label:'Delete I/O CQ',fields:['OPC = 04h','CDW10 · QID = 1']}),
    ...completeCommand('Delete I/O CQ'),
  ]
}

function shutdownNotification() {
  return mmioWrite('CC.SHN = 01b','14h',['CC[15:14] · SHN = 01b','32-bit CC 写'],
    '主机请求控制器做正常关停。该寄存器访问经 BAR，随后主机通过 CSTS 观察处理结果。', 'shutdown')
}

function shutdownStatus() {
  return mmioRead('CSTS','1Ch',['CSTS[3:2] · SHST = 10b','CSTS[6] · ST = 0 · 控制器级'],
    '示例一直轮询到完成。采用支持 ST 字段的规范语义，ST = 0 对应控制器级关停。', 'shutdown')
}

function scenario(id,label,initial,steps) {
  let state=initial
  return {id,label,steps:steps.map(step=>{
    state={...state,...step.change}
    return {...step,state}
  })}
}

export const scenarios = [
  scenario('startup','开机初始化',off,[
    {id:'rail',title:'主电送到 M.2',text:'供电从主板经 JSSD1 进入 SSD 供电区。主控在链路训练开始前保持复位。',fields:['3.3 V','PERST# 低'],sources:['m2'],focus:'slot',change:{rail:'3.3 V',device:'上电复位'},
      events:[
        protocol(event('power','3.3 V 到盘端','supply','socket','powerPin','pmic'),'M.2 · 电源触点',
          ['3.3 V','2 / 4 · 代表性供电脚'],'主板电源轨通过 M.2 的多枚并联电源触点送到盘端供电区。', 'm2'),
        protocol(event('wire','PERST# 保持低','platform','socket','perst','phy'),'M.2 · 复位边带',
          ['50 · PERST#','低有效'],'供电建立期间，平台让端点保持硬件复位。', 'm2'),
      ]},
    {id:'release',title:'参考时钟就绪，释放复位',text:'以共同时钟平台为例，等参考时钟满足时序后释放 PERST#。电源、时钟和复位各自有独立的观测点。',fields:['REFCLK','PERST# 低 → 高'],sources:['m2','pcie'],focus:'slot',change:{reset:'高 · 释放',clock:'运行',device:'D0'},
      events:[clockRestore,resetRelease]},
    {id:'train',title:'两端训练 PCIe 链路',text:'从电气检测到双向训练序列，接着初始化链路层流控。速率转换或重试由 LTSSM 在相应阶段处理。',fields:['Detect','Polling','Configuration','L0','InitFC1 / InitFC2'],sources:['pcie'],focus:'link',change:{link:'L0'},
      events:[
        protocol(down('pcie','Detect · 检查端点接收端','root','phy'),'PCIe 物理层 · 接收端检测',
          ['Receiver Detect','链路训练前'],'在已启用的候选传输线上进行物理检测，然后进入相应的 LTSSM 状态。', 'pcie'),
        protocol(down('pcie','TS1 / TS2 · 主机发送','root','phy'),'PCIe 物理层 · Ordered Set',
          ['TS1 / TS2','Link Number / Lane Number','代表性 Lane 0 · 47−/49+'],'链路训练中，根端口发送有序集，端点识别训练信息。', 'pcie'),
        protocol(up('pcie','TS1 / TS2 · SSD 发送','root','phy'),'PCIe 物理层 · Ordered Set',
          ['TS1 / TS2','代表性 Lane 0 · 41−/43+'],'端点在反方向发送训练序列。图中顺序显示两个方向。', 'pcie'),
        protocol(down('pcie','InitFC1 / InitFC2 · 建立 VC0 流控','root','phy'),'PCIe 链路层 · Flow Control DLLP',
          ['InitFC1 / InitFC2','VC0','Posted / Non-Posted / Completion'],'两端交换流控额度，图中标出主机发送方向。之后可传输配置和内存事务。', 'pcie'),
      ]},
    {id:'bar',title:'枚举设备并配置 BAR',text:'主机读取端点的配置空间，分配寄存器窗口，启用内存空间与总线主控。随后主机可以访问控制寄存器，SSD 可以进行 DMA。',fields:['CfgRd0 / CfgWr0','BAR','MSE / BME'],sources:['pcie','transport'],focus:'link',change:{link:'L0'},
      events:[
        protocol(down('pcie','CfgRd0 · 读取端点配置'),'PCIe TLP · Configuration Read Type 0',
          ['目标 BDF','00h · Vendor / Device ID','08h · Class Code = 01h/08h/02h'], '根端口把数次配置读分别路由到直连 NVMe 端点。', 'pcie'),
        protocol(up('pcie','CplD · 返回 PCI 配置'),'PCIe TLP · Completion with Data',
          ['Requester ID / Tag','配置 DWORD'], '端点把被读取的配置数据返回给请求者。', 'pcie'),
        protocol(down('pcie','CfgWr0 · 设置 BAR 与访问权限'),'PCIe TLP · Configuration Write Type 0',
          ['MLBAR / MUBAR','PCI Command.MSE = 1','PCI Command.BME = 1'],
          'BAR 确定 MMIO 窗口，MSE 允许访问该窗口，BME 允许端点发起总线主控事务。', 'pcie'),
        protocol(up('pcie','Cpl · 返回配置写结果'),'PCIe TLP · Completion',
          ['Requester ID / Tag','Completion Status','无数据负载'], '配置写由完成包确认。', 'pcie'),
      ]},
    {id:'admin',title:'放置管理队列，启用控制器',text:'主机在系统内存准备 Admin SQ、CQ。在控制器禁用时写好队列大小和地址，再写 CC.EN 并轮询 CSTS.RDY。',fields:['AQA 24h','ASQ 28h','ACQ 30h','CC.EN = 1','CSTS.RDY = 1'],sources:['init','transport'],focus:'link',cutaway:true,change:{drive:'等待 RDY → 1'},
      events:initializeController()},
    {id:'identify',title:'读取 Identify Controller',text:'控制器执行 CNS = 01h 的 Identify，分别写回识别数据与完成项。驱动需要命名空间详情时还会按 NSID 提交相应的 Identify 命令。',fields:['Admin Identify 06h','CNS = 01h','APSTA / PSD','MRd / CplD','MWr / CQE'],sources:['nvme','transport'],focus:'link',cutaway:true,change:{drive:'Admin 就绪'},
      events:[
        ...submitCommand({label:'Identify',fields:['OPC = 06h','CDW10 · CNS = 01h','PRP1 · Identify 缓冲区']}),
        protocol(up('data','MWr · 写回 Identify 数据','memory'),'PCIe TLP · Memory Write',
          ['Identify Controller · 4096 B','APSTA / NPSS','电源状态描述符 PSD'],
          '控制器将识别数据 DMA 到主机指定的缓冲区，随后报告命令完成。','queue'),
        ...completeCommand('Identify'),
      ]},
    {id:'queues',title:'先建 I/O CQ，再建 I/O SQ',text:'驱动可以先协商数量。创建 I/O 提交队列时引用已经存在的完成队列。随后可以提交普通读写。',fields:['Set Features 09h · FID 07h','Create I/O CQ 05h','Create I/O SQ 01h'],sources:['init','nvme'],focus:'link',cutaway:true,change:{drive:'普通 I/O 就绪'},
      events:configureIOQueues()},
  ]),
  scenario('unlock','启动与解锁',live,[
    {id:'opal-esp',title:'按配置放行被锁住的 ESP',text:'如果 Opal 锁定范围包含启动分区，先从可以运行的预引导环境认证。普通未锁定的 ESP 直接进入下一步。',fields:['Security Send 81h','Security Receive 82h','ReadLocked'],sources:['opal','nvme'],focus:'link',
      events:[
        protocol(down('trust','按配置提交 Security Send','uefi'),'NVMe Admin · TCG Opal',
          ['Security Send · OPC = 81h','SECP / SPSP / TL','主机提供 TCG 消息缓冲区'],
          '主机提交管理命令来传递 TCG 请求。SSD 按该盘认证策略和锁定范围处理请求。', 'opal'),
        protocol(down('trust','主机请求 Security Receive','uefi'),'NVMe Admin · TCG Opal',
          ['Security Receive · OPC = 82h','SECP / SPSP / AL'],
          '主机通过另一个管理命令请求返回 TCG 响应。', 'opal'),
        protocol(up('trust','SSD 写回 Opal 响应','memory'),'PCIe TLP · Memory Write',
          ['Security Receive 数据缓冲区','TCG 响应','随后写 CQE'],
          '控制器把响应 DMA 到主机缓冲区，预引导环境据此判断访问是否已放行。', 'queue'),
      ]},
    {id:'esp',title:'UEFI 读取启动文件',text:'固件读取 ESP 上的启动文件。一次典型读盘包含门铃、SSD 取命令、数据 DMA 和完成项写回。',fields:['NVM Read 02h','NSID / SLBA / NLB','DMA','CQE'],sources:['uefi','nvm','transport'],focus:'link',cutaway:true,
      events:[
        protocol(event('trust','UEFI 向存储驱动发读请求','uefi','cpu'),'UEFI · 启动与存储服务',
          ['启动项','EFI 文件系统 / Block I/O','固件 NVMe 驱动'],
          '启动管理器加载 EFI 文件，存储驱动把块读取请求转换成 NVM Read。', 'uefi'),
        ...submitCommand({label:'启动 Read',fields:['OPC = 02h','NSID / SLBA / NLB','PRP · 主机缓冲区'],queue:1,source:'read'}),
        event('data','闪存数据经 NAND 接口回主控','nand','ctrl'),
        protocol(up('data','MWr · 启动数据到主机缓冲区','memory'),'PCIe TLP · Memory Write',
          ['目的地址 = Read 数据缓冲区'],'固件随后可以解析这些块的数据。', 'queue'),
        ...completeCommand('启动 Read',[],1),
      ]},
    {id:'secure-boot',title:'主机验签与度量',text:'Secure Boot 按签名、允许或撤销策略验证启动程序。度量启动会把摘要扩展到 TPM 的 PCR，具体时点可早于本步。',fields:['Secure Boot db / dbx','TPM PCR Extend'],sources:['secure','tpm'],focus:'host',
      events:[event('trust','UEFI 检查加载的启动程序','memory','uefi'),event('trust','按配置扩展启动度量','uefi','tpm')]},
    {id:'key',title:'取得卷密钥，或让 SSD 放行',text:'软件加密由主机获取解密材料，例如 TPM 策略满足后释放受保护材料。Opal 可由认证程序继续解锁系统卷所在范围。',fields:['BitLocker VMK / FVEK','PCR 策略','Opal Locking Range'],sources:['tpm','opal'],focus:'host',
      events:[event('trust','软件加密 · 主机申请受保护材料','cpu','tpm'),event('trust','软件加密 · 解锁材料进入主机','tpm','cpu'),down('trust','Opal 分支 · 盘内访问范围放行','cpu')]},
    {id:'handoff',title:'启动环境交接给操作系统',text:'加载器退出 Boot Services。操作系统 NVMe 驱动按自身实现接管或重新初始化控制器与队列。',fields:['ExitBootServices','Admin SQ / CQ','I/O SQ / CQ'],sources:['uefi','init'],focus:'host',
      events:[event('trust','UEFI → OS 驱动','uefi','cpu'),event('nvme','OS 重新准备主机队列','cpu','sq','cq')]},
    {id:'plaintext',title:'第一次读到可用的卷内容',text:'软件加密时，SSD 传回卷密文，主机在内存中解密。单独使用 Opal 时，放行后的可读块内容从 SSD 返回。',fields:['NVM Read','数据 MWr','主机解密 / 盘内放行'],sources:['nvm','tpm','opal'],focus:'link',cutaway:true,
      events:[event('data','卷数据在 SSD 内交给主控','nand','ctrl'),up('data','DMA · 写入主机缓冲区','memory'),event('trust','软件加密路径 · 由主机解密','memory','cpu')]},
  ]),
  scenario('idle','空闲与唤醒',live,[
    {id:'configure',title:'驱动设置可选的省电策略',text:'主机可以读取 APSTA 与各电源状态描述符，再用 Set Features 配置 APST。ASPM 由 PCIe 两端的能力、控制位与时延预算决定。',fields:['APSTA','NOPS / ENLAT / EXLAT','FID 0Ch · APSTE','ITPT → ITPS','ASPM / L1SS'],sources:['apst','aspm'],focus:'link',cutaway:true,
      events:[
        ...submitCommand({label:'Set Features · APST',fields:['OPC = 09h','CDW10 · FID = 0Ch','CDW11[0] · APSTE = 1','PRP1 · 转换表'],source:'apst'}),
        protocol(up('pcie','MRd · 读取主机 APST 转换表','memory'),'PCIe TLP · Memory Read',
          ['Requester = SSD','地址 = 转换表的 DMA 地址','256 B 表'], '控制器通过数据指针访问主机设置的转换表。', 'apst'),
        protocol(down('pcie','CplD · 返回 APST 转换表','memory'),'PCIe TLP · Completion with Data',
          ['32 项 × 8 B','当前 PS 条目：ITPT[31:8]、ITPS[7:3]','ITPT 单位 = ms'],
          '每项对应当前 NVMe PS。ITPT 指连续空闲门限，ITPS 指目标非操作态。', 'apst'),
        ...completeCommand('Set Features · APST'),
        protocol(down('pcie','配置链路的 ASPM 和 L1 子状态','root','phy'),'PCIe 配置 · ASPM / L1SS',
          ['Link Control.ASPM Control','ASPM L1.2 Enable','LTR_L1.2_THRESHOLD'],
          '主机侧按两端能力与时延约束配置链路。本动作画出对端点配置空间的访问。', 'pcie'),
      ]},
    {id:'apst',title:'NVMe 控制器自主进入低功耗 PS',text:'I/O SQ 持续没有未完成命令，满足 APST 阈值后控制器可进入非操作态。演示先画 APST，实际链路省电走独立状态机。',fields:['ITPT 到期','ITPS','NOPS = 1','PCI 设备保持 D0'],sources:['apst'],focus:'ssd',cutaway:true,change:{drive:'低功耗 · 非操作 PS'},
      events:[protocol(event('nvme','空闲计时到期，控制器在盘内换 PS','ctrl'),'NVMe 内部 · APST',
        ['所有 I/O SQ 无未完成命令','连续空闲超过 ITPT','目标 PS · NOPS = 1'],
        '控制器按已配置的表进入低功耗状态。PCI 功能可继续处于 D0。', 'sleep')]},
    {id:'l12',title:'PCIe 链路单独进入 L1.2',text:'SSD 请求进入 L1，根端口同意后链路进入电气空闲。带 CLKREQ# 的共同时钟示例中，两端释放请求后可停参考时钟，3.3 V 保持。',fields:['L0 → L1.0 → L1.2','PM_Request_Ack','CLKREQ# 释放','REFCLK 可停','D0'],sources:['pcie','aspm','l12'],focus:'link',change:{clock:'停 · L1.2 示例',link:'L1.2'},
      events:[
        protocol(up('pcie','SSD 发出 ASPM L1 请求','root','phy'),'PCIe 链路层 · 电源管理 DLLP',
          ['发送方：SSD','方向：SSD TX → 主机 RX','PM_Active_State_Request_L1'],
          '端点发起 L1 进入协商。链路层请求经数据对传输。', 'pcie'),
        protocol(down('pcie','根端口回 PM_Request_Ack','root','phy'),'PCIe 链路层 · 电源管理 DLLP',
          ['发送方：根端口','PM_Request_Ack','接着进入电气空闲'],
          '根端口允许后，两端按链路状态机完成 L1 转换。', 'pcie'),
        protocol(event('wire','两端释放 CLKREQ#','phy','clkreq','socket','root'),'M.2 · 时钟请求边带',
          ['52 · CLKREQ#','开漏 · 低有效','两端释放后被上拉'],
          '在这个共同时钟路径中，L1.2 条件满足后，两端都释放对参考时钟的请求。', 'l12'),
        protocol(event('wire','时钟源停止分配 REFCLK','clockSource','socket','refclk','phy'),'M.2 · 差分参考时钟',
          ['53 / 55 · REFCLK','M.2 主电仍为 3.3 V','PERST# 保持释放'],
          '平台可以停参考时钟，外部供电与设备配置上下文保留。', 'l12'),
      ]},
    {id:'link-wake',title:'请求时钟，链路醒来',text:'有传输需求的一端可以拉低 CLKREQ#。这次由主机发起。先恢复参考时钟，两端完成电气恢复后回到 L0。',fields:['CLKREQ# 拉低','REFCLK 恢复','L1.0 / Recovery / L0'],sources:['aspm','l12'],focus:'link',change:{clock:'恢复运行',link:'L0'},
      events:[
        protocol(event('wire','主机侧拉低 CLKREQ#','root','socket','clkreq','phy'),'M.2 · 时钟请求边带',
          ['52 · CLKREQ#','拉低 · 请求时钟','PERST# 保持释放'],
          '主机端口有待发事务，在这个示例里由它发起恢复。', 'l12'),
        {...clockRestore,label:'REFCLK 重新送达两端',protocol:{...clockRestore.protocol,
          text:'时钟源重新提供稳定的参考时钟。盘端主电在整个过程中保持供电。',source:'l12'}},
        protocol(up('pcie','两端恢复链路至 L0','root','phy'),'PCIe 物理层 · LTSSM',
          ['L1.2 → L1.0 → Recovery → L0','T_POWER_ON','Common_Mode_Restore_Time'],
          '链路经过电气恢复和训练过程后恢复传输。方向箭头示例为 SSD 到主机，恢复由两端完成。', 'l12'),
      ]},
    {id:'io-wake',title:'首笔 I/O 唤醒 NVMe 控制器',text:'主机提交一笔 4 KiB Read，链路可传输后敲门铃。SSD 沿用原队列提取命令，在处理 Read 前回到操作态。示例按 512 B 逻辑块计算，NLB = 7 表示读取八块。',fields:['NVM Read 02h','SQ Tail 门铃','EXLAT','SLBA / NLB = 7'],sources:['apst','transport','nvm'],focus:'link',cutaway:true,change:{drive:'就绪 · 操作态'},
      events:[
        ...submitCommand({label:'Read',fields:readFields,queue:1,source:'read'}),
        protocol(event('nvme','处理 Read 前回到最近的操作态','ctrl'),'NVMe 内部 · 电源状态转换',
          ['NOPS = 0 · 操作态','EXLAT · 退出延迟描述符','沿用 SQID / CQID'],
          '规范要求先回到最近用过的操作态再处理普通 I/O。取命令与硬件恢复的细粒度先后由实现决定。', 'sleep'),
      ]},
    {id:'read-page',title:'闪存映射并发出读页请求',text:'按缓存未命中的路径演示。控制器的 FTL 把逻辑地址映射到介质位置，NAND 接口再发送读页请求和地址。',fields:['4 KiB 主机请求','FTL','NAND 行与列地址'],sources:['nvm','nand'],focus:'ssd',cutaway:true,nandCutaway:true,
      events:[event('data','FTL 查找闪存位置','ftl','nandCtrl'),event('data','主控向 NAND A 发送命令和地址','nandCtrl','nandIo')]},
    {id:'sense',title:'选中字线，感测并锁存到页缓冲',text:'NAND 内部译码选中字线，感测电路经位线读取单元状态，把结果锁存到页缓冲。闪存按物理页感测，主机请求以逻辑块表示。',fields:['行译码','WL / BL','感测放大器','页缓冲'],sources:['nand'],focus:'nand',cutaway:true,nandCutaway:true,
      events:[event('data','锁存行地址，译码并选中字线','nandIo','nandAddr','nandRow','nandWl'),event('data','经位线感测所选单元','nandWl','nandSense'),event('data','感测结果锁存到页缓冲','nandSense','nandPage')]},
    {id:'read-return',title:'纠错后 DMA 回写，主机收到完成',text:'页缓冲输出的数据进入主控 ECC。DMA 把请求的数据写入主机缓冲区，控制器写入 CQE，按中断配置发 MSI-X 或由主机轮询完成队列。',fields:['ECC','PRP / SGL','MWr · 4 KiB','CQE','可选 MSI-X'],sources:['nvm','transport','nvme'],focus:'link',cutaway:true,nandCutaway:true,
      events:[
        {...event('data','页缓冲经列选择输出，主控接收','nandPage','nandCol','nandIo','nandCtrl'),focus:'ssd'},
        {...event('data','ECC 纠错，结果交给 DMA','nandCtrl','ecc','dma'),focus:'controller'},
        protocol(up('data','MWr · 4 KiB 数据到主机缓冲区','memory','dma'),'PCIe TLP · Memory Write',
          ['目标 = PRP1 指向的 DMA 缓冲区','合计 4096 B','按 MPS 等约束分成多个 MWr'],
          '本例的 4 KiB 缓冲区按 4 KiB 控制器页对齐，使用一个 PRP。DMA 将读取结果写回主机。', 'queue'),
        ...completeCommand('Read',['CID = 003Ah','SCT = 0 / SC = 0 · 示例成功'],1,[
          protocol(up('pcie','启用时 · 发 MSI-X 中断','cpu'),'PCIe TLP · MSI-X Memory Write',
            ['Message Address','Message Data','完成队列关联的中断向量'],
            '中断通知主机检查 CQ。若使用轮询，可直接在主机内存读取 CQE。', 'irq'),
        ]),
      ]},
  ]),
  scenario('sleep','深睡与复电',live,[
    {id:'prepare',title:'为设备低功耗收尾',text:'本例选择会撤 SSD 主电的路径。停止新 I/O，等在途请求完成，再按控制器关停顺序通知并确认完成。',fields:['I/O 静默','CC.SHN = 01b','CSTS.SHST = 10b'],sources:['shn','rtd3','pciPm'],focus:'link',cutaway:true,change:{drive:'已完成控制器关停'},
      events:[event('nvme','主机停止新提交，等待在途 I/O','cpu','sq','cq'),
        ...deleteIOQueues(),shutdownNotification(),...shutdownStatus()]},
    {id:'d3hot',title:'PCI 功能进入 D3hot',text:'驱动通过 PCI PMCSR 进入 D3hot。主电保留，配置空间仍可访问。普通 BAR 访问在该电源状态中暂停。',fields:['PMCSR.PowerState = 11b','D3hot','配置空间可访问'],sources:['pciPm','acpi'],focus:'link',change:{device:'D3hot',link:'按链路电源策略'},
      events:[
        protocol(down('pcie','CfgWr0 · PMCSR = D3hot','root','phy'),'PCIe TLP · Configuration Write Type 0',
          ['目标 = PCI PM Capability.PMCSR','PowerState[1:0] = 11b'],
          '主机通过 PCI 配置空间请求 D3hot。这个阶段主电保留。', 'pcie'),
        protocol(up('pcie','Cpl · PCI 配置写完成','root','phy'),'PCIe TLP · Completion',
          ['Completion Status','主 3.3 V 保持'],
          '端点确认配置写。配置空间仍可用，NVMe BAR 的普通内存访问停止。', 'pcie'),
      ]},
    {id:'d3cold',title:'平台撤掉 SSD 主电',text:'ACPI 平台可以通过 _PR3 描述 D3hot 所用的电源资源。共享条件允许时关闭资源，盘端失去主 3.3 V，PCI 配置与 NVMe 队列上下文随之失效。',fields:['_PR3 / _OFF','D3cold','主 3.3 V 关闭','RTD3'],sources:['rtd3','pciPm','acpi'],focus:'slot',change:{rail:'断开',clock:'停止',reset:'由平台控制',link:'失活',device:'D3cold',drive:'上下文丢失'},
      events:[
        {...protocol(event('power','操作系统关闭可撤的电源资源','cpu','platform','supply'),'ACPI · Power Resource',
          ['_PR3 · D3hot 所需资源','Power Resource._OFF · 资源关闭'],
          '系统固件描述资源，操作系统按引用和唤醒要求决定是否允许撤电。', 'acpi'),focus:'link'},
        protocol(event('power','平台关闭 M.2 主电','supply','socket','powerPin','pmic'),'M.2 主电 · PCI D3cold',
          ['M.2 主 3.3 V · 关闭','设备配置空间不可访问','NVMe RTD3'],
          '实际撤去主电后进入这个 RTD3 路径。盘端易失控制器内存和队列环境需恢复。', 'rtd3'),
      ]},
    {id:'restore',title:'平台恢复供电、时钟和链路',text:'恢复设备主电资源，依平台完成参考时钟、复位与 PCIe 训练，再恢复 PCI 配置与 D0。',fields:['恢复 3.3 V','REFCLK / PERST#','LTSSM → L0','恢复 PCI 配置'],sources:['m2','pcie','pciPm'],focus:'link',change:{rail:'3.3 V',reset:'高 · 释放',clock:'运行',link:'L0',device:'D0',drive:'待重建'},
      events:[
        protocol(event('power','恢复 M.2 主电','supply','socket','powerPin','pmic'),'ACPI · Power Resource',
          ['Power Resource._ON','盘端 3.3 V 恢复','恢复所需资源'],
          '平台通过电源资源恢复供电，接着按板级条件去控制时钟、复位和训练。', 'acpi'),
        clockRestore,resetRelease,
        protocol(down('pcie','LTSSM · 重新训练链路','root','phy'),'PCIe 物理层 · 链路训练',
          ['Detect / Polling / Configuration','L0'],'端点在恢复电源和解除复位后重新参与训练。', 'pcie'),
        protocol(down('pcie','CfgWr0 · 恢复所需 PCI 配置','root','phy'),'PCIe TLP · Configuration Write Type 0',
          ['BAR / MSE / BME','按需恢复 MSI-X','设备处于可访问的 D0'],
          '平台和驱动恢复运行所需的 PCI 配置，之后才能使用 NVMe MMIO 与 DMA。', 'pcie'),
      ]},
    {id:'reinit',title:'重新初始化 NVMe 与 I/O 队列',text:'主机重新放置 Admin SQ 和 CQ、启用控制器、等待 RDY，恢复 I/O CQ/SQ 后才继续普通读写。',fields:['AQA / ASQ / ACQ','CC.EN = 1','CSTS.RDY = 1','重建 CQ → SQ'],sources:['init','rtd3'],focus:'link',cutaway:true,change:{drive:'普通 I/O 就绪'},
      events:[...initializeController(),...configureIOQueues()]},
  ]),
  scenario('shutdown','有序关机',live,[
    {id:'last-write',title:'回写文件系统，完成最后一批写入',text:'操作系统停止新业务，提交文件内容、元数据与日志。控制器用 DMA 从主机取写入负载。',fields:['NVM Write 01h','MRd / CplD','可选 FUA'],sources:['nvm','transport'],focus:'link',cutaway:true,
      events:[
        ...submitCommand({label:'Write',fields:writeFields,queue:1,source:'write'}),
        protocol(up('pcie','MRd · SSD 向主机请求写数据','memory','dma'),'PCIe TLP · Memory Read',
          ['Requester = SSD','地址 = PRP1 指向的缓冲区','请求可分多笔'],
          '控制器主动提取主机负载。此前另有 MRd 提取 SQE，两者访问主机内存的不同地址。', 'queue'),
        protocol(down('data','CplD · 写负载从主机返回到 SSD','memory','dma'),'PCIe TLP · Completion with Data',
          ['对应读取请求的 Requester ID / Tag','合计 4096 B 示例'],
          '主机侧分批返回写负载，数据从主机流向 SSD。', 'queue'),
        event('data','主控接收数据并调度介质写入','dma','nandCtrl','nand'),
        ...completeCommand('Write',[],1),
      ]},
    {id:'flush',title:'按缓存策略等待持久化',text:'启用易失写缓存时，Flush 覆盖指定命名空间中在提交 Flush 前已完成的命令。Write 设置 FUA 时，该写的数据和元数据须在报告完成前提交到非易失介质。',fields:['Flush OPC = 00h','NSID · 命名空间范围','Write FUA · CDW12[30]','CQE 状态'],sources:['flush','nvm','transport'],focus:'link',cutaway:true,
      events:[
        ...submitCommand({label:'Flush',fields:['OPC = 00h','NSID = 1','无主机数据负载'],queue:1,source:'flush'}),
        protocol(event('data','控制器持久化 Flush 覆盖范围','ctrl','nand'),'NVMe 内部 · 持久化边界',
          ['易失写缓存 · 已启用','数据和元数据','Flush 提交前已完成的命令'],
          '示例中的 Write 先完成，再提交 Flush。控制器按 Flush 语义保证覆盖范围内的内容写入非易失介质。', 'flush'),
        ...completeCommand('Flush',[],1),
      ]},
    {id:'lock',title:'收尾加密卷访问',text:'软件加密在主机侧结束卷访问。选择 Opal 主动上锁的配置仍需保持设备可访问，等最后一笔相关 I/O 结束再发送请求。',fields:['卸载 / 停止使用密钥','可选 Opal 主动 Lock'],sources:['tpm','opal'],focus:'host',
      events:[event('trust','软件路径 · 主机结束卷访问','memory','cpu'),down('trust','Opal 分支 · 可选主动上锁','cpu')]},
    {id:'delete-queues',title:'有条件地撤掉 I/O 队列',text:'如果驱动显式删除 I/O 队列，先删除 SQ，再删除其引用的 CQ。删除命令走管理队列。',fields:['Admin Delete I/O SQ 00h','Admin Delete I/O CQ 04h'],sources:['nvme','transport'],focus:'link',cutaway:true,
      events:deleteIOQueues()},
    {id:'notify',title:'写 CC.SHN，通知正常关停',text:'这是主机对 PCIe BAR 的寄存器写。控制器开始收尾，主机随后通过读寄存器确认状态。',fields:['BAR + 14h','CC.SHN = 01b','MWr'],sources:['shn','transport'],focus:'link',cutaway:true,change:{drive:'SHST · 关停处理中'},
      events:[shutdownNotification(),event('nvme','控制器内部进行关停处理','ctrl')]},
    {id:'done',title:'读 CSTS，观察关停完成',text:'主机轮询 SHST。支持相关字段的版本用 ST 确认这次是控制器级关停。示例取得完成状态后进入后续平台步骤。',fields:['BAR + 1Ch','CSTS.SHST = 10b','控制器级 ST = 0（适用时）'],sources:['shn','win'],focus:'link',cutaway:true,change:{drive:'SHST = 10b · 完成'},
      events:shutdownStatus()},
    {id:'link-off',title:'按平台路径收链',text:'平台可能发起 PCIe 关停握手。消息与应答表示链路准备关闭，盘端是否撤主电还要看下一步的供电。',fields:['可选 PME_Turn_Off','PME_TO_Ack','L2/L3 Ready'],sources:['pme','pciPm'],focus:'link',change:{link:'收链 · 按平台'},
      events:[
        protocol(down('pcie','PME_Turn_Off · 平台准备关链','root','phy'),'PCIe TLP · Power Management Message',
          ['PME_Turn_Off','方向：根端口 → SSD'],
          '在图示的 PCIe 平台关停路径中，根端口发消息请求准备关闭链路。','pcie'),
        protocol(up('pcie','PME_TO_Ack · 端点回应','root','phy'),'PCIe TLP · Power Management Message',
          ['PME_TO_Ack','方向：SSD → 根端口','随后按链路机制进入 L2/L3 Ready'],
          '端点确认平台的消息。供电动作由平台在后续控制。','pcie'),
      ]},
    {id:'power-off',title:'复位、停钟并撤去主电',text:'完整断电示例中，平台控制 PERST#、REFCLK 和 3.3 V 的边沿。配置了匹配复位事件的 Opal 范围可恢复锁定。',fields:['PERST#','REFCLK','M.2 3.3 V','可选 LockOnReset'],sources:['m2','acpi','opal'],focus:'slot',change:{...off,reset:'由平台控制',drive:'上下文丢失'},
      events:[
        protocol(event('wire','平台拉低 PERST#','platform','socket','perst','phy'),'M.2 · 复位边带',
          ['50 · PERST#','低有效'],'本例按平台路径让端点进入复位，再结束参考时钟和供电。','m2'),
        event('trust','遇到匹配复位，按配置恢复锁定','ctrl'),
        event('wire','平台关闭盘端 REFCLK','clockSource','socket','refclk','phy'),
        event('power','主板撤去盘端主电','supply','socket','powerPin','pmic'),
      ]},
  ]),
]

