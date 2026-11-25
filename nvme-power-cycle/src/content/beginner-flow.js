const commandPackets = (data = []) => [
  ['主机 → SSD', 'MWr', '更新提交队列（SQ）尾门铃，通知盘有新命令。'],
  ['SSD → 主机', 'MRd', '从主机内存取命令条目（SQE）。'],
  ['主机 → SSD', 'CplD', '带回 SSD 请求的命令条目。'],
  ...data,
  ['SSD → 主机', 'MWr', '把 NVMe 完成项（CQE）写入主机内存。按配置还可能另发 MSI-X。'],
  ['主机 → SSD', 'MWr', '主机取走完成项后，更新完成队列（CQ）头门铃。'],
]

const readPackets = commandPackets([
  ['SSD → 主机', 'MWr', '把读取的数据写入主机内存（DMA）。'],
])

const opalPackets = commandPackets([
  ['SSD → 主机', '81h · MRd', 'SSD 请求读取主机内存里的 Opal 请求。'],
  ['主机 → SSD', '81h · CplD', '把 Opal 请求的有效载荷返回给 SSD。'],
  ['SSD → 主机', '82h · MWr', 'SSD 把 Opal 响应写入主机内存。'],
])

const opalFields = ['Admin Security Send 81h', 'Admin Security Receive 82h', 'SQ0 Tail / CQ0 Head']
const opalNote = '81h 和 82h 都由主机提交。上面的提交和完成步骤对每条命令各适用一次，中间按操作码选数据行。要确认锁状态改变，还要看 Opal 方法返回和对应范围的锁位。'

export const startup = [
  {
    title: '主板给 SSD 供电，放开复位',
    text: '主板先给 M.2 插槽送上 3.3 V。等电和参考时钟（REFCLK）就绪，主板才放开复位，让盘开始工作。',
    signals: [
      ['out', '主板', '3.3 V 供电', 'SSD', 'wire'],
      ['out', '主板', '提供参考时钟（REFCLK）', 'SSD', 'wire'],
      ['out', '主板', '放开复位（PERST# 拉高）', 'SSD', 'wire'],
    ],
    fields: ['M.2 3.3 V', 'REFCLK', 'PERST# 低 → 高'],
    note: '这里画的是常见的共同时钟方案。供电、参考时钟和复位引脚各自是电信号，没有对应的 NVMe 寄存器访问或 PCIe 事务包（TLP）。',
  },
  {
    title: '连通 PCIe，让电脑认出这块盘',
    text: '两边先商量通信速度和用几条线。连通后，UEFI（通常叫 BIOS）读取设备身份、配置访问地址，让后面的读写能找到这块盘。',
    signals: [
      ['both', '主机', '相互发送链路训练序列', 'SSD'],
      ['out', 'UEFI', '问设备身份并配置地址', 'SSD'],
      ['back', '主机', '返回设备信息', 'SSD'],
    ],
    fields: ['Detect → Polling → Configuration → L0', 'PCI BAR', 'Memory Space Enable', 'Bus Master Enable'],
    packets: [
      ['主机 ↔ SSD', 'TS1 / TS2', '训练序列。链路可能重试、升速，或降到双方能稳定使用的速率。'],
      ['主机 → SSD', 'CfgRd0 / CfgWr0', '直连端点常见的配置读写，用来认出设备、配置 BAR 和启用访问。'],
      ['SSD → 主机', 'CplD / Cpl', '配置读返回数据，配置写返回完成。'],
    ],
  },
  {
    title: '让 NVMe 控制器就绪，建好读写队列',
    text: 'UEFI 先开一组发管理命令的队列。等 SSD 说控制器已就绪，再问盘的能力，准备普通读写用的队列。',
    signals: [
      ['out', 'UEFI', '设置管理队列并启用控制器', 'SSD'],
      ['back', '主机', '读回就绪状态', 'SSD'],
      ['both', 'UEFI', '查询盘信息、建立读写队列', 'SSD'],
    ],
    fields: ['CAP / VS', 'AQA 24h / ASQ 28h / ACQ 30h', 'CC.EN = 1', 'CSTS.RDY = 1', 'Admin Identify 06h', 'Create I/O CQ 05h → SQ 01h'],
    packets: [
      ['主机 → SSD', 'MWr', '设管理队列的大小和主存地址，再写 CC 启用控制器。'],
      ['主机 → SSD', 'MRd', '读取 BAR 中的状态寄存器 CSTS。'],
      ['SSD → 主机', 'CplD', '返回 CSTS，主机检查 RDY。'],
      ...commandPackets([['SSD → 主机', 'Identify · MWr', '把盘的识别信息写入主机内存。建立 I/O 队列时没有这一步识别数据。']]),
    ],
    note: '如驱动协商 I/O 队列数量，会看到 Admin Set Features 09h（FID 07h）。操作系统接管时可能重建队列，于是类似动作会再次出现。',
  },
  {
    id: 'unlock',
    title: '先解锁被 Opal 锁住的启动分区',
    condition: '只在启动分区也被锁住时走这一步',
    text: 'ESP 是放引导程序的小分区。如果盘锁住了它，电脑得先从固件或其他可读位置运行认证程序，获得 SSD 的读取许可。否则直接到下一步。',
    signals: [
      ['out', '认证程序', '向盘认证，请求放行 ESP', 'SSD', 'security'],
      ['back', '主机', '返回认证和解锁结果', 'SSD', 'security'],
    ],
    fields: opalFields,
    packets: opalPackets,
    note: opalNote,
  },
  {
    title: '读取启动文件，Secure Boot 检查签名',
    text: 'UEFI 从 ESP 读引导程序。启用了 Secure Boot 时，程序须通过签名或哈希策略才会运行。启用度量启动时，固件也会向 TPM 记录摘要，记录工作可以更早开始。',
    signals: [
      ['out', 'UEFI', '读 ESP 的数据块', 'SSD'],
      ['back', '主机内存', '写回引导程序数据', 'SSD'],
      ['local', 'UEFI', '在主机内检查引导程序'],
      ['out', 'UEFI', '把启动度量记入 PCR', 'TPM', 'local'],
    ],
    fields: ['I/O NVM Read 02h', 'Secure Boot db / dbx', 'TPM PCR'],
    packets: readPackets,
    note: '表里是 ESP 读盘的 PCIe 包。验签发生在主机，向 TPM 扩展 PCR 走平台内部接口，两者都没有对应的 NVMe 命令。',
  },
  {
    title: '访问系统卷前，拿到密钥或让盘放行',
    branches: [
      {
        title: '软件加密 · 电脑取得卷密钥',
        text: 'BitLocker 或 LUKS 的启动环境取得解密所需的密钥。按配置，密钥可用口令取得，或由 TPM 在条件满足时放行所保护的材料。',
        signals: [
          ['both', '启动环境', '按配置向 TPM 申请密钥材料', 'TPM', 'local'],
        ],
        fields: ['BitLocker VMK / FVEK', 'LUKS 卷密钥', 'TPM PCR 策略（按配置）'],
        note: '口令处理和 TPM 交互都没有对应的 NVMe 寄存器或 PCIe 包。取到密钥后，系统才用它解密接下来读到的数据。',
      },
      {
        title: 'Opal · SSD 放行系统卷',
        text: '如果系统卷还在锁定范围里，电脑先向 SSD 认证并解锁该范围。若前面已同时放行，就继续读盘。',
        signals: [
          ['out', '认证程序', '请求解锁系统卷所在范围', 'SSD', 'security'],
          ['back', '主机', '返回解锁结果', 'SSD', 'security'],
        ],
        fields: opalFields,
        packets: opalPackets,
        note: opalNote,
      },
    ],
  },
  {
    title: '系统第一次读到可用的明文',
    text: '普通读盘把数据送到内存。软件加密时，SSD 送的是卷密文，由电脑解密。只用 Opal 时，SSD 在盘内解密并送出可读数据。两层加密同时使用时，电脑还要解开软件加密这一层。',
    signals: [
      ['out', '启动环境', '请求读系统卷数据', 'SSD'],
      ['back', '主机内存', '写回系统卷数据', 'SSD'],
      ['local', '电脑', '软件加密时，在主机内解密'],
    ],
    fields: ['I/O NVM Read 02h', 'NSID / SLBA / NLB'],
    packets: readPackets,
    note: '普通读命令的包型在两条加密路径中相同。带回的数据是卷密文还是可直接读的块内容，要看这块卷配置的是哪一层加密。',
  },
]

export const shutdown = [
  {
    title: '停止新访问，写完最后的数据',
    text: '应用先停下来，系统把没写完的文件和文件系统记录送到盘里。这时软件加密卷仍需能加密写入，Opal 范围也要保持可写。',
    signals: [
      ['out', '操作系统', '提交最后一批写入', 'SSD'],
      ['back', '主机内存', '写回命令完成记录', 'SSD'],
    ],
    fields: ['I/O NVM Write 01h', '可选 Write FUA'],
    packets: commandPackets([
      ['SSD → 主机', 'MRd', 'SSD 请求取走主机内存里的待写数据。'],
      ['主机 → SSD', 'CplD', '把待写数据返回给 SSD。软件加密卷此时送的是卷密文。'],
    ]),
    note: '普通写入的成功完成与数据已能熬过断电是两件事。按缓存策略，带 FUA 的写入或后续 Flush 可以提供相应的持久化保证。',
  },
  {
    title: '按需要发 Flush，等盘确认保存',
    text: '如果存储栈发出 Flush，就等待盘确认。启用易失写缓存时，Flush 覆盖指定命名空间中在提交 Flush 前已完成的命令。',
    signals: [
      ['out', '操作系统', '要求保存缓存里的相关写入', 'SSD'],
      ['back', '主机内存', '返回 Flush 完成状态', 'SSD'],
    ],
    fields: ['I/O NVM Flush 00h', 'NSID', 'CQE 状态'],
    packets: commandPackets(),
    note: 'Flush 有提交和完成过程，没有单独的数据缓冲区传输。是否有最后一条 Flush，以及它与上层卷关闭的先后，取决于存储栈。图示把需要完成的写入放在撤掉对应访问权限之前。',
  },
  {
    title: '加密卷收尾，关掉访问权限',
    branches: [
      {
        title: '软件加密 · 结束卷访问，停止使用密钥',
        text: '系统不再访问这块卷时，就可以撤掉解密路径。比如 LUKS 映射实际关闭时，主机清理映射持有的密钥。下次启动要重新解锁。',
        signals: [['local', '操作系统', '关闭卷访问、结束使用运行期密钥']],
        fields: [],
        note: '这些动作在主机内发生。SSD 上没有对应的 NVMe 寄存器访问或 PCIe 包。仅凭关机或停止服务日志，无法确定每份内存密钥清理的时刻。',
      },
      {
        title: 'Opal · 可在盘还在线时主动上锁',
        text: '如果系统配置了主动上锁，就在最后一笔相关 I/O 结束后、通知 SSD 关停前发上锁请求。使用自动上锁的盘会在后面的复位或掉电阶段处理。',
        signals: [
          ['out', '操作系统', '认证并请求锁住范围', 'SSD', 'security'],
          ['back', '主机内存', '返回上锁结果', 'SSD', 'security'],
        ],
        fields: [...opalFields, 'ReadLocked / WriteLocked'],
        packets: opalPackets,
        note: opalNote,
      },
    ],
  },
  {
    title: '停止新 I/O，撤掉读写队列',
    text: '主机等在途命令收尾。在走删除队列的路径时，先撤掉递交读写请求的队列，再撤掉接收结果的队列。盘还能接管理命令。',
    signals: [
      ['out', '操作系统', '先删 I/O SQ，再删 I/O CQ', 'SSD'],
      ['back', '主机内存', '写回删除结果', 'SSD'],
    ],
    fields: ['Admin Delete I/O SQ 00h', 'Admin Delete I/O CQ 04h', 'SQ0 Tail / CQ0 Head'],
    packets: commandPackets(),
    note: '两个删除命令都走管理队列。这里的 00h 是管理队列删除 SQ，前面的 Flush 00h 在 I/O 队列上。',
  },
  {
    title: '通知 SSD 关停',
    text: '操作系统往 SSD 的控制寄存器写一个值，意思是「可以开始关停」。SSD 开始处理内部收尾。',
    signals: [['out', '操作系统', '发正常关停通知', 'SSD']],
    fields: ['BAR + 14h · CC.SHN = 01b'],
    packets: [['主机 → SSD', 'MWr', '直接写 CC 的 SHN 字段。这次写入没有独立的 NVMe 完成项。']],
  },
  {
    title: '主机反复读，等 SSD 报告完成',
    text: '电脑会问「做完了吗」。SSD 返回状态，主机读到完成后，才走后续的断电路径。',
    signals: [
      ['out', '操作系统', '读取关停状态', 'SSD'],
      ['back', '主机', '返回状态，直到报告完成', 'SSD'],
    ],
    fields: ['BAR + 1Ch · CSTS.SHST', 'SHST 01b 进行中 / 10b 完成', 'NVMe 2.1 控制器级 · ST = 0'],
    packets: [
      ['主机 → SSD', 'MRd', '读取 CSTS。'],
      ['SSD → 主机', 'CplD', '回传寄存器值，主机从里面取得 SHST 与适用的 ST。'],
    ],
    note: '盘的状态从正常到关停完成，轮询可能直接读到完成。突然断电或超时退出的路径可能没有这次完成读回。',
  },
  {
    title: '主板收链、复位，按平台设计切电',
    text: '在这条完整断电示例路径里，PCIe 通信结束，主板让 SSD 进入复位并关掉 M.2 的 3.3 V。各个引脚边沿的顺序和是否切电，取决于主板的实现。',
    signals: [
      ['both', '主机', '可能进行 PCIe 电源握手', 'SSD'],
      ['out', '主板', '拉低 PERST#，撤掉 3.3 V', 'SSD', 'wire'],
    ],
    fields: ['PCIe L2/L3 Ready（如适用）', 'PERST# 高 → 低', 'M.2 3.3 V 掉电'],
    packets: [
      ['主机 → SSD', 'PME_Turn_Off', '平台若走 PCIe 关停握手，会请求设备准备断电。'],
      ['SSD → 主机', 'PME_TO_Ack', '设备回应该请求，随后链路可进入低功耗或失活。'],
    ],
    note: '表中是可选的 PCIe 消息。PERST#、参考时钟停止、3.3 V 掉电属于电信号，各自没有对应的 PCIe 包。',
  },
  {
    title: '按设置遇到复位事件，Opal 盘自动上锁',
    condition: '仅当设置了适用的自动上锁策略',
    text: '这是上一步触发的盘内动作。断电或复位符合设置时，SSD 按策略把范围恢复成锁定状态。下次开机读这块范围前，要重新认证。',
    signals: [['local', 'SSD', '检测到匹配的事件，按策略上锁']],
    fields: ['LockOnReset', 'Power Cycle / Hardware Reset（按配置）'],
    note: '盘内自动上锁没有对应的 81h/82h 或 PCIe 事务。链路失活或仅清 CC.EN 不等同于这类复位。支持哪些触发事件要对照盘能力和具体供电状态。',
  },
]
