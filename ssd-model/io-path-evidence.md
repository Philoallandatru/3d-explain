# 一次 4 KiB 读写如何经过三星 990 PRO 2 TB

[从剥层模型播放读 4 KiB](view.html#stack/read) · [读数据落入主机缓冲区](view.html#stack/read/8/end) · [从剥层模型播放写 4 KiB](view.html#stack/write)

在主机发出的 NVMe **Read** 中，SSD 把 4,096 字节**写入主机内存**，线上看到从 SSD 发出的 PCIe Memory Write。在 NVMe **Write** 中，SSD 先发 PCIe Memory Read 去取主机缓冲区，真正的 4,096 字节随主机返回的 Completion with Data 到达 SSD。命令名描述主机对命名空间的操作，PCIe 事务名描述请求方对某个内存地址的操作。[NVM Command Set 1.0a §3.2.4、§3.2.6，图 45、60][nvm] · [PCIe 4.0 §2.2.1 表 2-3、§2.3.1.1][pci] · [可公开阅读的 NXP 事务类型表，第 11 页][nxp]

三星 2022 年裸盘规格书第 3–4 页将 **MZ-V9P2T0** 列为 PCIe 4.0 ×4、NVMe 2.0、三星主控、TLC V-NAND 和板载 2 GB LPDDR4。本例采用上市前已发布的 NVMe Base 2.0a、PCIe Transport 1.0a 和 NVM Command Set 1.0a 解释接口。2021 年 6 月的 PCIe Transport 1.0 已有同一幅命令处理图。这里给出一次成功 I/O 的协议推导，样品照片用于定位器件。[三星 990 PRO 规格书 Rev. 1.0][ssd] · [PCIe Transport 1.0 §3.4.1，图 8][transport10] · [2022 年样品的板级照片和坐标](board-evidence.md)

## 在剥层模型上播放

读和写各有 12 个事务或处理步骤。视图下方可以播放、暂停或用 ‹ / › 单步检查当前事务经过的部位。侧栏可跳到上一或下一事务、直接选择部位并放大，也能选择 Lane 0–3 及 NAND A/B。在展开模式中可以看到完整的跨层顺序，剥开模式会随着所选部位露出对应铜层。点选某层或开启「只看实物与标准」时，播放暂停。

箭头按这套 CAD 的走线中心线和孔轴移动。SSD 发送方向经过卡上串联交流耦合电容，PCIe 数据段经过 L3，两端并排的过孔只点亮与该段转接有关的部分。闪存访问使用 L4 的代表性 DQ、DQS 与控制线，读回方向沿该组走线折返。虚线还用来显示展开后孔轴之间的跨层方向、封装内交接和主机侧连接。主机 SQ、数据缓冲区、CQ 与中断目标是逻辑位置，运动时长采用讲解节奏。青绿色表示照片可见，蓝色表示标准定义的触点，琥珀色表示原理模型，灰色表示示意介质。[层深、过孔和证据标注](layer-stack-evidence.md) · [M.2 方向表与交流耦合依据](pcie-link-evidence.md)

## 芯片内部的逐步剖视

镜头沿用整块 PCB 的装配坐标，进入所选 NAND 或 Pascal 时才放大。关闭「跟随信号放大芯片」可自由控制相机。NAND A、B 使用各自的实物落点，共用一套示意的读出结构。芯片剖视内选「只看实物与标准」会暂停，并以相同视点显示实物封装外形。

| 观察位置 | 芯片内部发生的操作 |
| --- | --- |
| [NAND 行地址锁存](view.html#stack/read/6/addr) | DQ 先传命令、行与列地址。行地址帮助定位块和逻辑页，列地址用于选择页缓冲中的起始位置。 |
| [选中串组和 WL2](view.html#stack/read/6/wordline) | 行译码和串选择栅确定参与访问的单元。示范字线为 WL2，被选串中的其余字线施加通过偏置。图中截取五层字线和两排串。 |
| [位线感测并锁存](view.html#stack/read/6/sense) | 位线将所选串的响应带到感测放大器。TLC 每个逻辑页可能需要多组参考阈值。感测结果进入并行页缓冲，随后由列复用器取所需区间送给 DQ/DQS。主机 4 KiB 和 NAND 物理页是两个尺度。 |
| [主控 ECC](view.html#stack/read/7/ecc_check) | NAND PHY 采样后交给 ECC。图中以偶校验汉明码演示，收到 0110111，三组校验给出综合征 101，翻转第 5 位得到 0110011。主控实际算法、码字和重试策略有待专有资料或实测。 |
| [DMA 与 PCIe TX](view.html#stack/read/8/dma_addr) | 纠错后进入工作缓冲。DMA 取主机目标地址，向 PCIe 事务层提交数据，经发送串化与差分驱动，沿 L3、金手指到主机。PCIe Memory Write 把数据送入主机缓冲区。 |

NAND 剖视以页读、列选择和字线感测的通用机制作为依据。ONFI 文档用于核对命令、行列地址和页寄存器的通用关系，三星同代论文提供其 Toggle DDR 器件的公开背景。芯片中的排列、偏置电压、页大小和动画时间均采用示意。偶校验演示采用位号 1–7，第 1、2、4 位为校验位。[ONFI 命令定义](https://onfi.org/files/onfi_2_0_gold.pdf) · [三星 V7 ISSCC 论文](https://doi.org/10.1109/ISSCC42613.2021.9366054) · [NVMe PCIe 传输规范图 8](https://nvmexpress.org/wp-content/uploads/NVMe-over-PCIe-Transport-Specification-1_0-2021.06.02-Ratified-1.pdf#page=13)

## 主机准备的队列、缓冲区和地址

假定控制器已就绪，I/O 提交队列（SQ）、完成队列（CQ）和用户数据缓冲区都在主机 RAM，门铃采用直接 MMIO 写入。队列是环形缓冲区。Linux 6.0 的 PCI 驱动给出了一个可核对的实现，它分配 DMA 一致性队列内存，也为支持并启用 Controller Memory Buffer 的设备设有可选的 SQ 分配路径。软件填给控制器的是该设备能访问的 DMA 地址，启用 IOMMU 时可经地址转换。[PCIe Transport 1.0a §3.1.2、§3.2，正文第 9–11 页][transport] · [Linux 6.0 队列分配][linux-alloc] · [Linux DMA 地址映射说明][dma]

| 对象 | 本例中的位置及内容 |
| --- | --- |
| SQE（提交项） | 主机 SQ 中的 64 B。包括操作码、命令标识 CID、命名空间标识 NSID、数据指针 DPTR、起始逻辑块地址 SLBA 和块数 NLB。主机将读目的缓冲区或写源缓冲区的地址写入 DPTR。 |
| 用户数据 | 4,096 B，在独立的主机缓冲区。Read 的操作码为 `02h`，Write 为 `01h`。不带元数据时，若命名空间每个 LBA 是 512 B，覆盖 8 个连续 LBA，NLB 填 7。若每个 LBA 是 4 KiB，覆盖 1 个 LBA，NLB 填 0。实际格式由 Identify Namespace 的 FLBAS 和所选 LBAF.LBADS 确定。 |
| CQE（完成项） | 主机 CQ 中的标准 16 B。SQID 和 CID 标识完成的是哪条命令，SQHD 报告已消费到哪里，状态字段报告结果，P 位帮助识别新条目。由主机配置的标准 NVM 队列槽大小为 64/16 B，对应 CC.IOSQES=6、CC.IOCQES=4。 |
| SQ Tail 和 CQ Head 门铃 | SSD 的 PCI BAR 寄存器空间，两者均由主机写。写入的是新的循环队列指针索引，每次门铃可覆盖多个条目。 |

字段及长度可核对 Base 2.0a §3.3.3.1–2 的图 86–91，以及 Identify Controller 图 275 中的 SQES/CQES（正文第 257 页）。命令方向和 LBA 计数见 NVM 图 18、45–48、60–63、97–98。门铃寄存器在传输规范图 5、6。[NVMe Base 2.0a][base] · [NVM Command Set 1.0a][nvm] · [PCIe Transport 1.0a][transport]

**一个页对齐例子。** 设 CC.MPS 选定 4 KiB 主机内存页，驱动用 PRP 描述这次读写。缓冲区从页首开始，4,096 B 全在一页内，PRP1 足够，PRP2 保留。若起点在页内偏移 2,048 B 处，前后两页各承载 2,048 B，PRP2 直接给出第二页的页首 DMA 地址。更长传输跨越多于一个页边界时，PRP2 可指向 PRP List。支持 SGL 的控制器也可由驱动为 I/O 选用 SGL，CDW0.PSDT 指示 DPTR 格式，Identify Controller.SGLS 报告能力。命名空间 LBA、PRP 主机页、NAND 物理页分别由不同层定义。[Base 2.0a 图 86–87，第 92–93 页，§4.1.1–2，第 129–132 页，图 275 第 262 页][base] · [NVM Command Set 1.0a 图 98][nvm]

## 从提交到回收，M.2 链路上能看到什么

表内“主机”表示根复合体及其背后的内存或中断目标。“SSD”表示 Pascal 主控中的 PCIe 端点。设备通过 DMA（直接内存访问）传输队列项和用户数据，表中的 TLP 是 PCIe 事务层包。每一行是一个逻辑动作，具体包数由所选数据传输参数决定。[PCIe Transport 1.0a §3.4.1，第 12–13 页，图 8][transport] · [PCIe 4.0 §2.2、§2.3][pci]

| 顺序 | 发起动作与地址目标 | M.2 上的 TLP 方向和内容 |
| --- | --- | --- |
| 1 · 准备 | 驱动映射数据缓冲区，把 64 B SQE 写入主机 SQ 的空槽，保证 SSD 能在门铃后看到命令。 | CPU 写主机内存，此步无需穿过 M.2。 |
| 2 · 通知提交 | 主机写该 I/O SQ 的 Tail Doorbell。 | **主机 → SSD，MWr**，将新尾指针写入 32 位 MMIO 寄存器。 |
| 3 · 获取命令 | SSD 向主机 SQ 槽地址发起 DMA 读。 | **SSD → 主机，MRd** 请求命令字节。随后 **主机 → SSD，CplD** 返回 SQE。控制器也可批量取命令。 |
| 4R · 执行 Read | SSD 解析 LBA，在需要时从 NAND 取得数据，将结果 DMA 写到 DPTR 描述的主机缓冲区。 | **SSD → 主机，MWr**，载荷合计 4,096 B。 |
| 4W · 执行 Write | SSD 向 DPTR 描述的主机缓冲区发起 DMA 读，取得载荷后按本次写入的持久性要求处理。 | **SSD → 主机，MRd** 指定地址和所需长度。随后 **主机 → SSD，CplD** 返回数据，载荷合计 4,096 B。 |
| 5 · 发布完成 | SSD 向关联的主机 CQ 槽写入 CQE，主机据其状态处理成功或错误。 | **SSD → 主机，MWr**。若分次构造该项，P 位随最后一次写更新。 |
| 6 · 可选通知 | 已启用 MSI-X 且达到通知条件时，端点用为该向量配置的消息地址与数据通知主机中断控制器。 | **SSD → 主机中断目标，MWr**。中断合并可用一个通知覆盖多项，轮询运行时可省略此步。 |
| 7 · 消费 | CPU 在主机 CQ 检查当前槽的 P 位，按 SQID/CID 关联命令并读取状态。成功 Read 的数据在主机目的缓冲区。 | CPU 读主机内存，此步无需穿过 M.2。主机绕回队列首部时翻转预期相位。 |
| 8 · 归还空间 | 主机处理一项或多项后，向 SSD 写对应 CQ 的 Head Doorbell，释放消费过的槽。 | **主机 → SSD，MWr**，将新头指针写入 32 位 MMIO 寄存器。 |

MWr 是 posted 写，在 PCIe 事务层无需 Completion 回包。CplD 回答的是特定 MRd，依 PCIe 的 Requester ID 和 Tag 关联。NVMe CQE 则通过一次或多次 MWr 发布，并用 SQID/CID 关联整条 NVMe 命令。因而取到写入载荷、整条写命令完成、主机收到中断分别发生在不同的动作。[PCIe 4.0 §2.2.6、§2.3.1.1、§6.1.4][pci] · [NXP 事务类型表][nxp] · [Base 2.0a §3.3.3.2，图 89–91][base] · [Linux 6.0 的相位检查和 CQ 门铃][linux-cq]

4 KiB 只给出总载荷。发送端的 Max Payload Size（MPS）限制每个带数据 TLP 的载荷，Max Read Request Size（MRRS）限制单个 MRd 的请求长度。内存请求还要遵守 4 KiB 地址边界，一个 MRd 的响应可拆成若干 CplD。举例而言，若发送端 MPS 为 256 B，用满每包载荷写主机页首对齐的 4 KiB 读结果，会产生 16 个数据 MWr。示例只计算第 4R 步的用户数据包。PCIe MPS 和 NVMe 的 CC.MPS 分别表示包载荷上限与主机内存页大小。[PCIe 4.0 §2.2.2、§2.2.7、§2.3.1.1、§7.5.3.4][pci] · [Base 2.0a 图 46，CC.MPS][base]

## 进入 Pascal、LPDDR4 和 NAND 之后

2022 年 10 月 KitGuru 的 2 TB 裸盘样品有一颗 Pascal、一个 LPDDR4 封装、两个第七代 TLC V-NAND 封装。三星公布 V7 有 176 层，并在 990 PRO 固件支持页注明该系列自 **2023 年 9 月**起混用 V7 和 V8 工艺。176 层描述适用于该拆解样品。主机分配给 PRP/SGL 的地址和队列内存，不能用板上这颗 LPDDR4 的容量或位置来定位。[KitGuru 拆解第 2 页][teardown] · [三星 V7 工艺介绍][v7] · [三星 990 PRO 固件与混产说明][mix] · [三星 990 PRO 规格书][ssd]

Pascal 看到的是命名空间 LBA。闪存转换层（FTL）维护逻辑地址到闪存位置的映射。三星的 SSD 技术说明介绍了板载 DRAM 如何缓存映射信息、暂存或汇集写入。图中可将“Pascal 查询映射／必要时周转数据”画为通向 LPDDR4 的分支。要确定某次用户读写是否经过该器件、片内 SRAM 如何分配，或哪颗 NAND 承接该 LBA，还需要样品的运行记录。[三星 FTL 与 DRAM 技术说明，PDF 第 2–3 页][ftl] · [三星 990 PRO 规格书][ssd]

三星研究人员在 ISSCC 2021 论文 30.3 中介绍了同代 512 Gb、每单元 3 bit 的研究芯片。芯片用 16 KB 页缓冲器经位线读写阵列，Toggle DDR 5.0 I/O 的最高速率为 2.0 Gbit/s。板上运行的具体速率、总线端接方式、各通道连接的封装，以及某次 4 KiB 落在哪个 die 或页，都需要该样品的进一步证据。[Jiho Cho 等，ISSCC 2021，第 426–428 页][paper] · [ISSCC 大会资料，Session 30.3][isscc] · [KitGuru 样品照片][teardown]

| NAND 侧阶段 | 谁驱动什么 | 如何理解就绪 |
| --- | --- | --- |
| 选目标，发命令和地址 | 控制器驱动 CE# 选择目标。DQ 复用命令和地址，CLE、ALE 区分相应的周期，WE# 参与锁存。 | 所选行列地址属于 NAND 的地址空间。 |
| 读阵列并取数据 | 以一次需要访问阵列的读为例。主控下发读命令和地址，阵列在内部读时间 tR 将页数据送到页寄存器。数据输出阶段由主控驱动 RE#，NAND 驱动 DQ 和 DQS 将数据送回主控。 | 主控可观察 R/B# 或读取目标状态以判定就绪。此时用户数据还要经 PCIe DMA 到主机。 |
| 编程并检查 | 主控下发编程命令和地址，在数据输入阶段驱动 DQ 与 DQS，随后确认编程。NAND 在内部编程时间 tPROG 内把数据写入阵列。 | 等待就绪后可再读状态确认成功或失败。R/B# 反映忙／就绪，操作结果由状态位报告。 |

信号定义可核对 JEDEC 与 ONFI 联合制定的 JESD230C §2.1、§2.6 表 1，正文第 2、5–6 页。以三星另一颗原始 NAND 的数据手册为例，§5.1 第 51 页列出 `00h → 地址 → 30h → 等待 → 数据输出`，§5.5 第 56 页列出 `80h → 地址 → 数据输入 → 10h → 等待 → 读状态`。要在 990 PRO 上识别一次实际命令的字节与时刻，需要本板的 BGA 引脚波形或控制器执行记录。[JEDEC 标准目录][jedec] · [JESD230C 的 ONFI 发布本][joint] · [JESD230C 表 1 可读副本][joint-copy] · [三星原始 NAND 操作实例][raw-nand]

## 写命令完成时，哪些数据已持久化

- **普通 Write，FUA=0。** 若设备启用易失写缓存，主机可能在该写入仍由缓存承载时收到成功 CQE。Identify Controller.VWC 和 Volatile Write Cache 特性给出缓存能力和使能状态。990 PRO 规格书中“2 GB LPDDR4”描述硬件容量，单凭这一行不能确定命令完成时的数据位置。[Base 2.0a 图 275 第 260 页、§5.27.1.4 第 293 页][base] · [NVM Command Set 1.0a 图 63 第 38 页][nvm] · [三星 990 PRO 规格书][ssd]
- **Write，FUA=1。** 控制器必须先把本命令指定逻辑块的数据及关联元数据写到非易失介质，然后才能报告该命令成功。该保证限定于本命令。Read 的同名位另有定义，FUA=1 要求先将对应数据和元数据提交到非易失介质，再返回从介质读出的内容。[NVM Command Set 1.0a 图 48 第 34 页、图 63 第 38 页][nvm]
- **Flush，操作码 00h。** 当易失写缓存启用时，对指定命名空间，Flush 必须使其提交前已经完成的相关命令的数据及元数据持久化，控制器也可以一并刷出其他数据。主机若要涵盖某条 Write，可先确认该 Write 已完成，再提交 Flush 并等待成功 CQE。Flush 有自己的 SQE、CQE，不传用户数据。[Base 2.0a §7.1，图 390，正文第 331–332 页][base]
- **TurboWrite 的缓冲区。** 三星在这款产品的写入性能脚注中说明测量启用了 Intelligent TurboWrite。厂商对 TurboWrite 的说明描述了以 SLC 方式存储数据的闪存区域，数据可以随后迁移到主存储区。协议上的持久性保证不指定最终 TLC 存放位置或迁移时刻。[三星 990 PRO 规格书第 3 页脚注 4][ssd] · [三星 TurboWrite 技术白皮书][turbo] · [NVM Command Set 1.0a 图 63][nvm]

[ssd]: https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf
[base]: https://nvmexpress.org/wp-content/uploads/NVMe-NVM-Express-2.0a-2021.07.26-Ratified.pdf
[transport]: https://nvmexpress.org/wp-content/uploads/NVMe-PCIe-Transport-Specification-1.0a-2021.07.26-Ratified.pdf
[transport10]: https://nvmexpress.org/wp-content/uploads/NVMe-over-PCIe-Transport-Specification-1_0-2021.06.02-Ratified-1.pdf
[nvm]: https://nvmexpress.org/wp-content/uploads/NVMe-NVM-Command-Set-Specification-1.0a-2021.07.26-Ratified.pdf
[pci]: https://pcisig.com/PCIExpress/Specs/Base/_4.0_1.0
[nxp]: https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/Layerscape/2220/1/FTF-SNT-F1121_Utilizing%20PCI%20Express%20in%20QorIQ%20LS%20Series%20Processors.pdf#page=12
[linux-alloc]: https://github.com/torvalds/linux/blob/v6.0/drivers/nvme/host/pci.c#L1560-L1601
[linux-cq]: https://github.com/torvalds/linux/blob/v6.0/drivers/nvme/host/pci.c#L1043-L1130
[dma]: https://docs.kernel.org/6.8/core-api/dma-api-howto.html
[teardown]: https://www.kitguru.net/components/ssd-drives/simon-crisp/samsung-990-pro-2tb-review/2/
[v7]: https://semiconductor.samsung.com/news-events/tech-blog/editorial-extraordinary-innovation-for-a-more-unforgettable-world-the-story-behind-samsungs-pioneering-v-nand-memory-solution/
[mix]: https://semiconductor.samsung.com/consumer-storage/support/tools/
[ftl]: https://image-us.samsung.com/SamsungUS/b2b/resource/2016/07/08/b2b_resource_WHP-SSD-POWERLOSSPROTECTION-r1-JUL16J.pdf
[paper]: https://doi.org/10.1109/ISSCC42613.2021.9366054
[isscc]: https://static1.squarespace.com/static/6130ef779c7a2574bd4b8888/t/616c79ed5a30e36825f47818/1634499069232/isscc2021.press_kit_110620.pdf#page=87
[jedec]: https://www.jedec.org/standards-documents/docs/jesd230c
[joint]: https://onfi.org/files/jesd230c-nov2016.pdf
[joint-copy]: https://ssd.borecraft.com/documents/JESD230C.pdf#page=9
[raw-nand]: https://www.100y.com.tw/pdf_file/37-SAMSUNG-K9GBG08U0A-SCB0.pdf
[turbo]: https://download.semiconductor.samsung.com/resources/white-paper/Samsung_SSD_TurboWrite_Whitepaper_EN.pdf
