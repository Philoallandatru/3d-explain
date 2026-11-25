const nvmeSite = 'https://nvmexpress.org/wp-content/uploads/'
const base = nvmeSite + 'NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf'
const pcieTransport = nvmeSite + 'NVM-Express-NVMe-over-PCIe-Transport-Specification-Revision-1.4-Ratified-2026.07.31.pdf'
const commandSet = nvmeSite + 'NVM-Express-NVM-Command-Set-Specification-Revision-1.3-Ratified-2026.07.31.pdf'

export const actionSources = {
  doorbell: ['NVMe over PCIe 1.4 · 图 4–6 · 门铃寄存器', pcieTransport + '#page=10'],
  queue: ['NVMe over PCIe 1.4 §3.4.1 · 命令提取和完成', pcieTransport + '#page=12'],
  irq: ['NVMe over PCIe 1.4 §3.5 · 中断', pcieTransport + '#page=13'],
  rtd3: ['NVMe over PCIe 1.4 §3.6 · RTD3', pcieTransport + '#page=16'],
  cc: ['NVMe Base 2.4 · 图 41 · Controller Configuration', base + '#page=86'],
  init: ['NVMe Base 2.4 §3.5.1 · 初始化', base + '#page=131'],
  shutdown: ['NVMe Base 2.4 §3.6.1 · 正常关停', base + '#page=140'],
  flush: ['NVMe Base 2.4 §7.2 · Flush', base + '#page=593'],
  apst: ['NVMe Base 2.4 §5.2.30.1.7 · APST 配置', base + '#page=494'],
  sleep: ['NVMe Base 2.4 §8.1.19.1 · 非操作态', base + '#page=694'],
  read: ['NVM Command Set 1.3 · Read', commandSet + '#page=48'],
  write: ['NVM Command Set 1.3 · Write / FUA', commandSet + '#page=53'],
  pcie: ['PCIe Base 5.0 · 事务与链路', 'https://pcisig.com/PCIExpress/Specs/Base/_5.0_1.0'],
  m2: ['PCI-SIG · M.2 4.0、表 3-2 至 3-5', 'https://pcisig.com/PCIExpress/Specs/M.2/_4.0_1.0'],
  l12: ['Intel PIPE 7.1 · 图 9-5', 'https://cdrdv2-public.intel.com/643108/643108_PIPE_Arch_Spec_Rev_7_1.pdf#page=176'],
  acpi: ['ACPI 6.6 §7.2–7.3 · 电源资源', 'https://uefi.org/specs/ACPI/6.6/07_Power_and_Performance_Mgmt.html#pr3-power-resources-for-d3hot'],
  opal: ['TCG · Opal SSC', 'https://www.trustedcomputinggroup.org/resources/documents/storage-work-group-storage-security-subsystem-class-opal'],
  uefi: ['UEFI 2.11 §3 · Boot Manager', 'https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html'],
}

export const event = (kind, label, ...actors) => ({kind, label, actors})

function hostToDrive(host, end, contacts) {
  return [...(host==='root' ? [] : [host]),'root','socket',contacts,'phy',...(end==='phy' ? [] : [end])]
}

export const down = (kind,label,host='root',end='ctrl') =>
  event(kind,label,...hostToDrive(host,end,'hostTx'))
export const up = (kind,label,host='root',end='ctrl') =>
  event(kind,label,...hostToDrive(host,end,'driveTx').reverse())

export function protocol(action, type, fields, text, source) {
  return {...action, protocol:{type, fields, text, source}}
}

export function submitCommand({label, fields, queue=0, source='queue'}) {
  const io = queue>0
  const kind = 'nvme'
  return [
    protocol(event(kind,'主机写入 '+label+' SQE','cpu','sq'), '主机内存 · NVMe SQE',
      ['SQID = '+queue,'64 B SQE',...fields],
      '驱动把完整命令放入提交队列的空槽。主机内存写发生在通知控制器之前。', source),
    protocol(down(kind,'MWr · 敲 '+(io ? 'I/O' : 'Admin')+' SQ 门铃','cpu'), 'PCIe TLP · Memory Write',
      ['BAR0 + 1000h + 2 × QID × (4 << CAP.DSTRD)','QID = '+queue,'32-bit 写 · 新 SQ Tail'],
      '驱动用 Posted Memory Write 更新 BAR 内的 SQ Tail 寄存器。示例 CAP.DSTRD = 0 时，偏移为 '+(io ? '1008h。' : '1000h。'), 'doorbell'),
    protocol(up('pcie','MRd · SSD 请求 '+label+' SQE','sq'), 'PCIe TLP · Memory Read',
      ['Requester = SSD','地址 = SQE 的 DMA 地址','请求数据 = 64 B','Tag 由请求端分配'],
      'SSD 用 DMA 发起读取，目标是主机内存中的提交队列。Memory Read 请求本身不带命令数据。', 'queue'),
    protocol(down('pcie','CplD · 主机返回 '+label+' SQE','sq'), 'PCIe TLP · Completion with Data',
      ['Completer = 主机侧','对应 MRd 的 Requester ID / Tag',...fields],
      '主机侧返回包含命令字段的数据。控制器收到 SQE 后才能按 NVMe 操作码解码。', source),
  ]
}

export function completeCommand(label, fields=[], queue=0, notifications=[]) {
  return [
    protocol(up('nvme','MWr · '+label+' CQE 写入主机','cq'), 'PCIe TLP · Memory Write',
      ['CQID = '+queue,'16 B CQE','SQID / SQHD / CID / P / SCT / SC',...fields],
      '控制器把完成项写到主机内存。CID 和 SQID 用于匹配请求，SQHD 表示已消费的提交队列进度，P 用于辨别本轮有效项。', 'queue'),
    ...notifications,
    protocol(event('nvme','主机读取 '+label+' 完成状态','cq','cpu'), '主机内存 · NVMe CQE',
      ['检查 Phase Tag','核对 CID','读取 SCT / SC'],
      '中断处理或轮询代码直接读取主机内存里的 CQE。同一槽位在队列回卷后被再次写入，Phase Tag 相对上一次写入翻转。', 'queue'),
    protocol(down('nvme','MWr · 更新 '+label+' CQ Head 门铃','cpu'), 'PCIe TLP · Memory Write',
      ['BAR0 + 1000h + (2 × QID + 1) × (4 << CAP.DSTRD)','QID = '+queue,'32-bit 写 · 新 CQ Head'],
      '主机告知控制器已消费到哪里。示例 CAP.DSTRD = 0 时，偏移为 '+(queue>0 ? '100Ch。' : '1004h。'), 'doorbell'),
  ]
}

export function mmioWrite(label, offset, fields, text, source) {
  return protocol(down('nvme','MWr · '+label,'cpu'), 'PCIe TLP · Memory Write',
    ['BAR0 + '+offset,...fields], text, source)
}

export function mmioRead(label, offset, fields, text, source) {
  return [
    protocol(down('pcie','MRd · 读取 '+label,'cpu'), 'PCIe TLP · Memory Read',
      ['BAR0 + '+offset,'Requester = 主机'], '主机发读请求，控制器以 CplD 返回寄存器内容。', source),
    protocol(up('nvme','CplD · 返回 '+label,'cpu'), 'PCIe TLP · Completion with Data',
      fields, text, source),
  ]
}

export const readFields = [
  'OPC = 02h','CID = 003Ah','NSID = 1','CDW10–11 · SLBA = 2048',
  'CDW12[15:0] · NLB = 7','PRP1 = 0x0012_0000',
]

export const writeFields = [
  'OPC = 01h','NSID = 1','NLB = 7','CDW12[30] · FUA = 0','PRP1 = 0x0013_0000',
]
