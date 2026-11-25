# PC 上电与下电时，一块 NVMe SSD 经历了什么

一块直连 PCIe 的系统盘，从插槽得电到可供应用读取，至少跨过四道可以分别核实的关口。链路要能承载事务，主机要能访问控制器寄存器，控制器要能接收队列命令，目标 namespace 还要能实际完成 I/O。关机时还要分别查明哪些写入已获持久化承诺、SSD 是否已报告可以掉电，以及主机何时真正切断 SSD 主供电。[NVMe 初始化][init]、[PCIe 传输模型][transport-io]、[NVMe 关停][shutdown]、[NVM 写入语义][fua]

本文依据公开资料分析物理形态为 M.2、通过 PCIe 接入的笔记本或台式机 SSD。协议主线采用 NVM Express Base 2.1、PCIe Transport 1.1 和 NVM Command Set 1.1，并对照常见的 NVMe 1.4c。三份 2.x 体系文档分别定义控制器、传输和块命令，版本号独立。真实设备以控制器 `VS`、Identify 能力、PCIe 能力、固件版本及实际启用的模式为准。截至 2026 年 11 月 21 日，NVM Express 目录另列最新组合 Base 2.4、PCIe Transport 1.4 和 NVM Command Set 1.3。经 Intel VMD/RST、RAID 卡、USB 转接盒或虚拟机呈现的磁盘，需区分 OS 可见的控制器与 SSD 实际所在的那段链路。[规范版本目录][versions]、[PCIe Transport][transport]、[Intel VMD 实现][vmd]

**按问题阅读**　[真实 PC 的两种关机结果](#real-pc) · [冷启动的八个阶段](#startup) · [BIOS、验签和启动卷解锁](#boot-security) · [一条命令的总线事务](#transactions) · [整机关机时序](#shutdown-sequence) · [密钥失效与 Opal 重新上锁](#shutdown-security) · [写入与掉电恢复](#durability) · [公开原始数据与复算](#samples)

<a id="real-pc"></a>

## 一台真实的启动盘 PC

主案例取自 Debian 问题 #1035665。报告人使用 x86-64、Debian 12、Linux 6.1.0-7-amd64、systemd、UEFI、GRUB 2.06-12 和一块 Samsung 980。现场的挂载表把 EFI 分区列在 `nvme0n1p1`，根文件系统列在 `nvme0n1p4`，数据分区列在 `nvme0n1p6`。因此这块盘参与了从引导到运行的全过程。三星给 980 标注的接口能力为 M.2 2280、PCIe Gen3 ×4、NVMe 1.4，支持借用主机内存的 HMB。现场记录没有给出协商速率、实际宽度或 HMB 启用值。[Debian 原始记录，含挂载表和 GRUB 配置](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1035665) · [报告人的内核与系统版本](https://mail-archive.com/debian-bugs-dist%40lists.debian.org/msg1905173.html) · [三星对 980 接口和 HMB 的说明](https://news.samsung.com/global/samsungs-980-nvme-ssd-combines-speed-and-affordability-to-set-a-new-standard-in-consumer-ssd-performance)

| 在这台 PC 上发生的事 | 可以得出的结论 |
|---|---|
| 在 GRUB 菜单进入命令行，执行 `halt`。机器关机。下次开机读取 SMART，报告人观察到每次 `Unsafe Shutdowns` 增加 1 | 这条发生在操作系统接管之前的关机路径改变了控制器计数。 |
| 启动 Debian Bookworm 后执行 `poweroff` 或 `shutdown -h`。报告人观察到上述增量消失 | 同一台机器换了发起关机的软件，盘记录的结果也变了。 |
| 另一位参与者在自己的 Samsung 980 500 GB 上复现了 GRUB 现象，并报告升级至 `3B4QFXO7` 后仍能复现 | 支持在第二套环境中出现相同表现。不能据此指定第一台机器的固件版本。 |

按该型号所声明的 NVMe 1.4 家族，1.4c 的 SMART 定义把这个计数与掉电前是否收到关机通知联系起来。故障排查最值得检查的是 GRUB、UEFI 和平台关电这段路径。报告没有附寄存器抓包、盘端电压或复电后的数据比对，所以既无法从中定位哪一行固件漏了通知，也无法计算丢失的文件、字节或 NAND 页数。[原始问题](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1035665) · [第二位测试者的复现与固件信息](https://debianforum.de/forum/viewtopic.php?t=186800#p1326586) · [NVMe 1.4c，SMART / Health Information Log](https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4c-2021.06.28-Ratified.pdf)

可以用对应内核系列的源码检查一种具体解释。上游 Linux v6.1 在 PCI 关机回调走 `nvme_disable_prepare_reset(dev, true)`。控制器仍可通信时，驱动给在途 I/O 完成的机会，停止队列，随后 `nvme_shutdown_ctrl` 写正常 SHN 并读 CSTS。读到完成即退出，否则每次轮询之间调用 `msleep(100)`，到等待上限会记录错误。这个实现能解释进入 Debian 后多出来的关停机会，源码没有证明这台 PC 关机时每笔 MMIO 已按期到达 SSD。[v6.1 关机回调](https://github.com/torvalds/linux/blob/v6.1/drivers/nvme/host/pci.c#L3204) · [可通信条件与队列处理](https://github.com/torvalds/linux/blob/v6.1/drivers/nvme/host/pci.c#L2676) · [关停通知和轮询间隔](https://github.com/torvalds/linux/blob/v6.1/drivers/nvme/host/core.c#L2339)

GRUB 这一侧也能追到具体的分支。Debian `2.06-12` 的 x86-64 EFI 实现先调用 `grub_machine_fini`，随后调用 `grub_acpi_halt()`。后者查找 ACPI 的 `_S5_` 睡眠类型及 PM1a 控制端口，满足条件时写入睡眠类型和使能位。**只有控制流继续返回**，EFI 路径才调用 `ResetSystem(EfiResetShutdown)`。UEFI 对此服务规定的是整机进入相当于 G2/S5 或 G3 的电源状态。回到现场，若要指出是谁负责最后一次 SHN，仍需要知道实际走了哪条分支，以及固件或设备回调做了什么。问题报告只记录到整机关机和下次开机的计数。[Debian 该版本 EFI 关机代码](https://salsa.debian.org/grub-team/grub/-/blob/debian/2.06-12/grub-core/lib/efi/halt.c#L29) · [同版本 ACPI 关机代码](https://salsa.debian.org/grub-team/grub/-/blob/debian/2.06-12/grub-core/commands/acpihalt.c#L389) · [UEFI 2.10 ResetSystem](https://uefi.org/specs/UEFI/2.10/08_Services_Runtime_Services.html#resetsystem)

第二位测试者给出了 500 GB 容量，可据该容量官方规格计算工作电压范围。三星标出 3.3 V ±5%，对应 **3.135–3.465 V**。这些是工作电压边界，器件内部的欠压复位门限、保持能量和此次实际越限时间仍需各自的证据。[Samsung 980 500 GB 电气规格](https://www.samsung.com/uk/memory-storage/nvme-ssd/980-500gb-nvme-pcie-gen-3-mz-v8v500bw/)

下文用公开波形、总线截图、Linux 时间戳和 Windows ETW 样例说明这台 PC 未公开的观测层。每组数字只归属于列出的样本。全文没有把这些时间戳换算成这台 Samsung 980 PC 的开机或关机耗时。

### 从 M.2 端子到 PCIe 包的两张时序图

两图采用直连 M.2 启动盘、共同时钟与主存队列。顶端波形对齐供电、PERST#、PCIe 链路和 NVMe 寄存器。上电主时序从插槽和主板固件起步，向下接入控制器初始化、读 EFI 系统分区（ESP）、Secure Boot 与 TPM 度量、卷解锁，直至主机读出受保护系统卷的首批明文。命令框展开门铃、取 SQE、数据传输与完成项，并标明 PCIe 的发送方与接收方。[上电矢量图](nvme-pcie-figures/power-on.svg) · [下电矢量图](nvme-pcie-figures/power-off.svg) · [两页 PDF](../output/pdf/nvme-pcie-power-sequences.pdf)

上电图标出 Wilder 的 Gen5 M.2 Socket 3 测试板的两次独立测量。图 17 的两路电源起升相隔 9.711 ms，图 27 的 1.8 V 起升至 PERST# 释放为 103.58 ms。下电图中的 PCIe 消息以 Intel 700 系列 PCH 的实现为例，根端口发 `PME_Turn_Off`，设备回复 `PME_TO_Ack`，并向上游发 `PM_Enter_L23`。这组时序的盘端电压和三星主案例的关机计数各有独立来源。[Wilder 图 17](https://wilder-tech.com/wp-content/uploads/2025/03/910-0077-100-Rev-B-PCIe-Gen-5-M2-Socket-3-Performance-Report-2-29-2024-1.pdf#page=12) · [Wilder 图 27](https://wilder-tech.com/wp-content/uploads/2025/03/910-0077-100-Rev-B-PCIe-Gen-5-M2-Socket-3-Performance-Report-2-29-2024-1.pdf#page=19) · [Intel PCH 关电消息方向](https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/700-series-chipset-family-platform-controller-hub-datasheet-volume-1-of/002/005/pci-express-power-management/)

上电图从第 4 段开始可沿 A、B1、B2 三列跟踪。A 先读 ESP、启动引导器，再由主机解锁软件加密卷。B1 画 Opal 读锁覆盖 ESP 时的前置盘端认证。B2 画 ESP 可读而系统卷受 Opal 读锁保护时的后置认证。紫框就近标出了各组公开计时的机型、平台和计时边界。[主时序 ESP 至明文的放大图](nvme-pcie-figures/power-on-security.png) · [正文与引用](#boot-security)

下电图从停止新的卷访问开始，将最后的写与 Flush、软件卷关闭、Opal 显式锁定或按复位策略自动上锁，接到 NVMe 关停及插槽 3.3 V 失效。下电图的 A 为软件加密，B1 为主机在关停前发安全命令上锁，B2 为盘在匹配的复位事件上自动锁定。B1 与 B2 可以同时配置。[下电加密与关停的放大图](nvme-pcie-figures/power-off-security.png) · [正文与引用](#shutdown-security)

## 一、先确认是哪一种开关机

| 场景 | 对这块盘可以作出的判断 |
|---|---|
| G3 机械断电后冷启动 | 平台恢复供电，目标插槽主电源从失效到有效，设备重新建立链路、配置空间和 NVMe 队列。笔记本仅拔交流适配器仍可能由电池供电。判定 SSD 曾掉电所需的直接证据是目标电源轨。[ACPI 全局与设备电源状态][acpi]、[PCIe 上电时序][perst] |
| G2/S5 软关机后开机 | 操作系统重新启动，平台可保留待机电源。目标盘的主电、辅助电和根端口如何变化取决于供电设计。关机灯灭、主机仍插电、机箱电源指示均不能代替盘端电压。[ACPI 状态][acpi]、[Windows S5][s5] |
| 普通重启或控制器复位 | 可以再次看到 PCI 配置、`CC.EN` 变化、RDY 重新置位和队列重建。复位的范围决定是否重训链路以及哪些 PCI 配置被复位。仅见重新枚举不足以判定 SSD 主电源消失。[PCIe Transport §3.3][reset]、[Linux 接管路径][linux-admin] |
| Windows 快速启动或 S4 休眠 | 快速启动注销用户并把内核会话保存在休眠文件中，普通休眠还保存用户会话。两者都可能出现末段集中写入、设备关停和下一次的恢复读。Windows 完整关机另列为 S5。[Windows 系统电源状态][win-power]、[StorNVMe Shutdown/Hibernate][stornvme] |
| S3、S0 低功耗空闲、单盘 Runtime D3 | 唤醒取决于该平台保留的上下文与插槽供电。PCI 的 D0/D3hot/D3cold 描述设备，L0/L1/L1.2/L2 等描述链路，NVMe PS0…PSn 描述控制器功耗状态。APST 是设备按策略自主转换 NVMe 电源状态，ASPM 是链路电源管理。三个层次分别记录。[ACPI 定义][acpi]、[PCI 设备电源管理][pci-pm]、[PCI-SIG 链路低功耗][aspm]、[StorNVMe 电源策略][stornvme] |
| 程序请求快速关停、按键长按、强制掉电 | 主机仍能访问 BAR 时，可写 `CC.SHN=10b` 请求 abrupt shutdown。主供电直接丢失时，发送通知的机会取决于上游预警和保持时间。长按电源键最终走哪条路径由平台决定。[Base 2.1 §3.6.1][shutdown]、[SSD 掉电保护设计][plp] |

<a id="startup"></a>

## 二、从主电源建立到系统盘第一次成功读

下表给出直接连接的普通 NVMe 块设备的因果顺序。“前提”表示完成该层功能所需的条件，“典型”是公开实现中的常见行为，“条件”表示取决于平台、设备能力或启动路径。同一行内的事务可以交错，链路训练可重试，固件和 OS 也可以分别初始化同一块盘。[PCIe 链路训练][ltssm]、[Base 2.1 §3.5.1][init]、[UEFI 接管界面][uefi-exit]

| 阶段 | 会发生什么 | 如何辨认，结论到哪里为止 |
|---|---|---|
| 1. 插槽上电（冷启动前提） | 常见 M.2 M-key SSD 由 3.3 V 主电供电，观察点在 SSD 一侧。板上稳压、负载开关、参考时钟和复位电路按平台设计动作。共同时钟方案会涉及差分 REFCLK 和低有效的 PERST#，部分系统还有 CLKREQ#、PEWAKE#。 | 对照该板卡形态的电压门限、复位释放要求和时钟架构。PCI-SIG 专门修改过 M.2 复位时序模型。CEM 插卡的计时数值不能直接套给内置 M.2、焊盘或不同供电域。电源轨和时钟是电信号。[PCI-SIG M.2 边带 ECN][perst]、[CEM 实现时序示例][cem-reset]、[M.2 实际探测信号][interposer] |
| 2. 根端口与 SSD 建链（前提） | 典型训练经历 Detect、Polling、Configuration、L0。可识别接收端检测、TS1/TS2 训练序列、lane 编号与宽度协商。升速可经过 Recovery 与均衡，可能重试或降速。 | 协议记录可给出训练序列、速率变化和进入 L0 的位置。稳定后的 Link Status 只给出当时速率和宽度。接收端检测等电气事件以及芯片内部精确 LTSSM 子状态还取决于测点、设备调试接口和分析仪的重构能力。[PCI-SIG 训练实例][ltssm]、[AMD Link Status 定义][link-status] |
| 3. 数据链路可用与 PCI 枚举（前提） | 链路建立后还要具备传输 TLP 的数据链路条件。传统模式可查看流控初始化、信用量、ACK/NAK 和重放。根复合体通过配置读写发现端点，读 Vendor/Device ID、Class Code、PCIe/PM/MSI-X 等能力，分配或沿用 BAR。常规 NVMe I/O 控制器常见 class `01/08/02`。 | 保留根端口到插槽的路径、BDF、BAR 基址、Command 的 Memory Space Enable 与 Bus Master Enable。前者关系到 MMIO 解码，后者关系到设备发起主存 DMA。桥上游可见 Type 1、端点处通常见 Type 0 配置事务。FLIT 模式需按协商模式解码，如 PCIe 6.0 的 FLIT、CRC、FEC，不能照搬旧版链路包格式。[UEFI PCI 枚举与寄存器职责][uefi-pci]、[NVMe PCI 配置空间][pci-cfg]、[PCI-SIG FLIT 说明][flit] |
| 4. 主机检查 NVMe 状态（典型） | 固件或驱动在寄存器 BAR 读 `CAP`、`VS`、`CC`、`CSTS`，核对最大队列项数、门铃间距、支持的命令集和页大小。若接手已启用的控制器，可先清 `CC.EN` 并等 `CSTS.RDY=0`。 | 读 `CSTS` 时使用 PCIe 读完成包里的数据。区分“地址已分配”“寄存器可读”“旧复位已完成”。在已失联端点读到全 1 的路径，Linux 将其当作设备不可访问。[Base 2.1 控制器寄存器][regs]、[Linux 管理队列配置][linux-admin]、[Linux 状态轮询][linux-shn] |
| 5. 建立管理队列并使能（前提） | 主机为 Admin SQ/CQ 准备 DMA 可达内存，设置 `AQA` 的两种深度（零基）、`ASQ`、`ACQ` 基址，配置 `CC` 的命令集、页大小、仲裁与 I/O 项尺寸，然后置 `CC.EN=1` 并等 `CSTS.RDY=1`。Admin 队列 ID 为 0。 | 配对同一次使能与随后首次成功读到 RDY 的时间，同时保留 `CSTS.CFS`。较早版本按 `CAP.TO` 判读，2.x 先核对 `CAP.CRMS`、`CC.CRIME`、`CRTO.CRWMT/CRIMT`。支持且启用“独立于介质就绪”时，RDY 可以先于 namespace 介质就绪。超时字段以 500 ms 为单位，作用于控制器就绪阶段。[初始化][init]、[就绪模式与时间][ready]、[寄存器定义][regs] |
| 6. 识别控制器和 namespace（典型） | `Identify Controller` 的 CNS 为 01h，可取型号、序号、固件、能力和 RTD3 进入/退出延迟。典型主机查询活动 NSID，按命令集查询 `Identify Namespace`，得到容量、当前 LBA 格式和元数据。 | 记录实际 CNS、NSID 和返回状态。不同 NVMe 版本、namespace 管理支持及固件枚举策略可产生不同命令序列。namespace 有地址范围、介质就绪、磁盘分区可用是逐层成立的结论。[Base 2.1 初始化][init]、[EDK II namespace 识别][edk-ns] |
| 7. 建 I/O 队列与可选特性（普通块 I/O 前提） | 主机通常用 Set Features 的 Number of Queues（FID 07h）协商队列数。先创建 I/O CQ，再创建引用已有 CQ 的 I/O SQ。队列可共享 CQ，启用中断的 CQ 带向量，也可轮询。 | 记录请求与获准的队列数、QID、深度和 CQ 关联。中断配置、异步事件请求、APST、HMB、Doorbell Buffer Config、Get Log Page 等依能力和驱动而异。一次开机无需出现整张能力表中的命令。[Base 2.1 初始化][init]、[传输队列模型][transport-queue]、[Linux 配置路径][linux-setup] |
| 8. 固件读取启动内容、OS 接管（启动盘典型） | UEFI 启动管理器选定目标，块驱动发读取分区信息、文件系统元数据、EFI 加载器等所需的命令。操作系统加载器结束 Boot Services，内核驱动重新准备控制器和 I/O 队列，随后挂载系统卷。数据盘可以有不同的固件访问轨迹。 | 首次成功 Read 的 NSID、SLBA、NLB 直接来自命令。要给一组 LBA 标上 GPT、EFI 文件、内核或休眠镜像，需要分区及文件映射或固件/OS 记录。光看 TLP 也无法读出发送者的软件名称。NVMe 的可选 Boot Partition 是另一种控制器能力，常规 ESP 启动可用普通 NVM Read。[UEFI 媒体接口][uefi-media]、[UEFI Boot Services][uefi-exit]、[EDK II 读取实现][edk-read]、[Base 2.1 寄存器与能力][regs] |

**一个可复核的固件到内核交接。** TianoCore 的 `edk2-stable202411` 中，`NvmeControllerInit` 在启用 PCI 属性、读取 CAP 后先禁用控制器，然后写 AQA、ASQ、ACQ，重新使能、发 Identify Controller，再创建两个 I/O CQ 和两个 I/O SQ。同步 `NvmExpressPassThru` 写 SQ Tail，轮询 CQ 的 Phase Tag，检验 SCT/SC 后写 CQ Head。块读实现把 SLBA 拆到 CDW10/11，把块数减一填入 CDW12。由此可解释固件阶段的几类实际寄存器操作和命令，而无需猜测一个固定的启动 LBA。[EDK II 控制器初始化][edk-init]、[SQ 门铃与 CQ 轮询][edk-submit]、[CQ Head][edk-done]、[块读命令][edk-read]

随后 Linux v6.12 的 `nvme_pci_configure_admin_queue` 在接管已启用设备时清 EN、重建管理队列，再编程自己的 ASQ/ACQ。源码说明旧管理队列的地址对接手者未知。`nvme_enable_ctrl` 在这个版本主动清 CRIME，按 CAP 与可用的 CRTO 选择等待值。因此，一次操作系统冷启动中出现两套 ASQ/ACQ 地址、两次使能周期或不同队列深度，可以由固件和 OS 的交接解释。精确归属仍需关联该 PC 的固件或内核事件。[Linux v6.12 管理队列接管][linux-admin]、[v6.12 控制器使能][linux-enable]

### 把上电阶段的 PCIe 训练读细一层

以主案例的 **Gen3 ×4 能力**为例。Detect 阶段寻找有接收端的 lane。Polling 阶段交换训练序列并取得接收同步。Configuration 阶段确定参加这条链路的 lane、链路宽度与编号。链路可以先在低速进入 L0，再经 Recovery 升速。升到 8 GT/s 时，均衡过程会交换发送端预设等信息。若某些 lane 未能参与，端点仍可能通过较窄的链路完成枚举。判断实际状态要看此时的 Link Status 或训练记录。单看产品规格中的“×4”或操作系统已认盘，都不能还原协商过程。[PCI-SIG 链路训练材料][ltssm] · [PCI-SIG 对 Gen3 宽度与均衡的解答](https://pcisig.com/faq?field_category_value%5B%5D=pci_express_3.0&keys=)

若这块盘确实协商到 8 GT/s ×4，Gen3 采用 128b/130b 编码，仅扣除线路编码后的单方向上限为 `8 × 128/130 × 4 ÷ 8 ≈ 3.938 GB/s`，这里 GB 取十进制。事务头、数据链路包、训练、空闲和软件等待都会占用时间。这个数值可用来检查计算单位，不能由它倒推出开机读了多少字节或花了多久。[PCI-SIG 的编码与单 lane 带宽说明](https://pcisig.com/faq?field_category_value%5B%5D=pci_express_3.0&keys=) · [Intel PCIe 吞吐量分析](https://cdrdv2-public.intel.com/666721/an881-683291-666721.pdf)

在这种传统传输模式，信用流控分别为 posted、non-posted 和 completion 流量预留接收资源。配置、门铃写、DMA 请求和返回数据共享链路，但使用的事务类型及流控资源不同。链路层的 ACK/NAK 及重放只解决相邻端口之间的可靠传输，完成某个 PCIe 读还需要事务层的 Completion，完成一条 NVMe 命令还要看 NVMe CQE。因链路错误重放过一次 TLP，也不能把上层写命令计成两次。[Intel 对 PCIe 流控与读事务的分解](https://cdrdv2-public.intel.com/666721/an881-683291-666721.pdf) · [PCIe Request 与 Completion][pcie-read] · [NVMe 传输模型][transport-io]

<a id="boot-security"></a>

### BIOS/UEFI 在何时验签，受保护的系统卷在何处解密

这里的 BIOS 指采用 UEFI 的现代 x86 PC，固件阶段用 PI/EDK II 举例。主板固件开始执行与盘端 3.3 V 有效分别由不同电路决定，两者可重叠。能读 BAR、能完成 Identify、能读 EFI 系统分区（ESP）、能执行引导器、能读出系统卷明文，是五个可以分别核实的事件。图上把受保护系统卷的数据扇区首次在主机侧可用作为终点。[PI 阶段与驱动职责][pi-stages] · [UEFI 启动管理器][fw-boot] · [上电主时序](nvme-pcie-figures/power-on.svg)

| 图中路径 | 从固件选好启动项到首次明文 |
|---|---|
| **A 软件加密** | NVMe 就绪 → UEFI 用普通 `Read` 加载 ESP 的 EFI 文件 → 按 Secure Boot 策略验证后执行 → BitLocker 或 LUKS 在主机取得卷密钥 → 普通 `Read` 把受保护数据扇区的卷密文送到主存 → 主机解密得到明文。BitLocker 引导环境可以在 OS 完整接管前读取这些数据。典型 Linux initramfs 则在内核接管后解锁 LUKS。[微软 TPM 与 BitLocker][win-tpm] · [Debian initramfs][luks-init] |
| **B1 Opal 读锁覆盖 ESP** | 管理队列可用 → 固件认证模块或其他可读位置的预启动认证程序先执行 → 经 Admin `81h/82h` 放行 ESP 所在范围 → 读 ESP、验证并执行 EFI 引导器 → 核实目标系统卷范围也已放行 → SSD 读出并在盘内解密，以 DMA 返回逻辑块。若预启动程序本身是一个独立 EFI 应用，它也受相应的镜像验证策略约束。[TCG Opal][opal-spec] · [UEFI Secure Boot][fw-secure] · [EDK II Opal][edk-opal] |
| **B2 ESP 可读、系统卷受 Opal 读锁保护** | 先读 ESP、验证并执行可访问的引导代码 → 预启动程序、加载器或 OS 按平台配置经 Admin `81h/82h` 解锁系统卷所在范围 → 首次读该卷的受保护扇区，由 SSD 在盘内解密并把逻辑块 DMA 到主存。若还叠加软件卷加密，主机接着走 A 的数据解密步骤。[TCG Opal][opal-spec] · [EDK II 安全收发打包][edk-sec-opcode] |

| 发生时机 | 谁在做什么 | 在这块 M.2 SSD 的 PCIe 链路上能辨认什么 |
|---|---|---|
| CPU 刚开始执行平台启动代码 | 以配置了 Intel Boot Guard 验证策略的平台为例，CPU 执行经认证的启动模块，验证主板 BIOS 的初始启动块（IBB）后交给固件。随后 PI 的 SEC 建立早期执行环境，PEI 初始化永久内存并把平台信息传给 DXE。OEM 选择平台验证策略。 | 这次验证读取的是平台固件，发生在主板一侧。盘端 PERST# 的边沿只能给电气时间，无法给 IBB 验证打时间戳。[Intel Boot Guard][fw-guard] · [PI SEC][pi-sec] · [PI 阶段][pi-stages] |
| DXE 与启动设备连接 | 固件的 PCI 总线驱动配置端点，NVMe 驱动准备管理队列、置 `CC.EN`、等 `CSTS.RDY`、Identify 并建立 I/O 队列。EDK II 将可用的 namespace 接入 UEFI 块 I/O。BDS 可以按实际启动选项再连接所需设备。 | 根端口 R 向 SSD D 发配置事务和 BAR 读写，SSD 与主存交换队列和数据。此时还要单独确认目标 LBA 范围的读权限。[EDK II 控制器初始化][edk-boot-ctrl] · [PI 的 DXE 与 BDS][pi-stages] |
| 固件选择启动项并读取 EFI 程序 | 正常 UEFI 启动可先尝试一次性的 `BootNext`，再按 `BootOrder` 找到相应 `Boot####`。本地 GPT/FAT 启动的典型路径会读分区信息、ESP 目录和 EFI 文件。加载成功且策略允许时，Boot Manager 调用 `StartImage()`。 | I/O SQ 上常见 `NVM Read 02h`，SSD 用 D→R 的 `MWr` 向主存写文件字节。总线给的是 NSID/LBA。要从中识别文件路径，还需把 GPT、FAT 分配关系与该次读对上。[UEFI 启动管理器][fw-boot] · [PCIe 收发与队列][transport-io] |
| Secure Boot 作出执行决定，Measured Boot 累积度量 | 启用强制验证时，固件对 EFI 镜像的签名或哈希应用授权库 `db` 与吊销/禁止库 `dbx` 的策略。PK、KEK 用于管理信任策略。度量启动记录代码与策略的摘要，扩展 TPM 的 PCR，并在主存保留事件日志。PC Client 常见 PCR 4 记录 EFI 引导应用，PCR 7 记录 Secure Boot 策略及相关授权事件。度量可早在读 ESP 之前开始。 | 读取 EFI 字节可在 M.2 上看到。验签运算、启动或拒绝执行的决定、向 TPM 扩展 PCR 走平台内部路径。要核实这些事件，应查该次启动的固件执行记录、Secure Boot 状态及 TCG 事件日志。[UEFI Secure Boot 第 32 章][fw-secure] · [TCG PC Client 固件规范][tcg-pfp] · [EDK II 度量启动][fw-measure] |
| Windows 使用软件 BitLocker | 典型 UEFI 安装从独立且未被 BitLocker 加密的 ESP 读入 Windows Boot Manager。使用 TPM 保护器时，策略满足后引导环境可取得卷主密钥（VMK）所需材料，配置 TPM+PIN 时还需 PIN。VMK 解开全卷加密密钥（FVEK），引导环境和 OS 按需解密受保护扇区。正常保护器无法满足时可进入恢复密钥流程。 | 读这些扇区仍是普通 `NVM Read`。对受保护的数据扇区，SSD 写入主机缓冲区的是卷密文，主机随后产生明文。TPM 操作与扇区解密均无专属 NVMe 命令。若实际配置为硬件加密盘，需另核对下方盘端路径和 Windows 策略。[微软的 TPM 与 BitLocker][win-tpm] · [密钥层级与分区][bitlocker-faq] · [硬件加密策略][bitlocker-policy] |
| Linux 使用软件 LUKS 加密根卷 | 一种常见布局从可读的 ESP 或 /boot 加载内核和 initramfs。早期用户空间读取 LUKS 元数据，按配置接受口令或已注册的令牌，得到卷密钥，建立 dm-crypt 映射后挂载根文件系统。引导器需要先解锁加密 /boot 的布局会把认证提前。 | 读 LUKS 元数据和后来读取密文数据扇区都可走普通块读。密钥槽处理、卷映射和 dm-crypt 解密由主机执行。输入口令所用的秒数可能全部落在软件统计的较大阶段内。[Debian initramfs 集成][luks-init] · [Linux dm-crypt][luks-dm] · [GRUB cryptomount][grub-crypt] |
| SSD 使用 TCG Opal 范围锁 | 管理队列可用且盘支持安全收发后，固件或预启动认证程序可查询功能和锁状态，并向 SSD 认证、请求解除目标范围的读锁。若 ESP 位于受锁范围，执行认证的代码须先从固件或其他可读区域取得。若 ESP 可读，系统可以先加载引导器，稍后在访问受锁卷前认证。 | 可出现 Admin `Security Send 81h` 与 `Security Receive 82h`。确认解锁要对上安全协议的方法、返回状态、目标范围的读锁及后续访问。仅发现操作码、某条 CQE 成功，或 `CSTS.RDY=1`，都不足以判定该范围已经解锁。[TCG Opal 2.02][opal-spec] · [EDK II 的预启动认证][edk-opal] |

**从 EFI 文件追到下一段代码。** 微软列出的 Windows Boot Manager 常规 EFI 路径为 `\EFI\Microsoft\Boot\bootmgfw.efi`。Ubuntu 的一种受支持路径是固件验证并执行 shim，shim 验证 GRUB，随后验证要执行的内核。两者都可能在 M.2 线上留下 EFI 文件的普通块读。知道文件内容、由谁验证和验证之后把控制权交给谁，才可以把这些读和实际启动步骤对应起来。[微软 UEFI 启动路径][win-efi-path] · [Ubuntu 的 Secure Boot 实现][ubuntu-efi-chain]

**把 Opal 的两条管理命令落实到 PCIe 包。** 下表沿用传统主存队列。主机软件为 H，主存为 M，根复合体为 R，SSD 为 D。两条命令均由 H 提交。固定的逻辑关系是先让 D 取到命令，完成所需数据传输，再让 H 消费完成项。一次门铃可公布多个条目，缓冲区也可拆成多笔 TLP。[NVMe PCIe 队列与 DMA][transport-io] · [EDK II 的命令构造][edk-sec-opcode] · [NVMe 管理命令表][nvme-security-ops]

| 阶段 | Security Send，Admin 81h | Security Receive，Admin 82h |
|---|---|---|
| 提交并取 SQE | H 在 M 写 SQ0 条目及待发送的协议数据。R→D `MWr` 敲 SQ0 尾门铃。D→R `MRd` 取 SQE，R→D `CplD` 返回条目。 | H 在 M 写 SQ0 条目并提供接收缓冲区。尾门铃及设备读取 SQE 的包方向与 81h 相同。 |
| 有有效载荷的数据阶段 | **D→R `MRd` 请求读主存，R→D `CplD` 携协议数据。** 逻辑上是主机向 SSD 发送。 | **D→R `MWr` 把协议响应 DMA 写入 M。** 逻辑上是主机从 SSD 接收。 |
| 完成与回收 | D→R `MWr` 写 CQ0 完成项。采用 MSI-X 且需要通知时，D→R 另发中断 `MWr`。H 读 M 中的 CQE，R→D `MWr` 更新 CQ0 头门铃。 | PCIe 完成路径相同。H 可在 M 中解析安全协议响应，核对会话状态、认证结果或目标范围状态。 |

EDK II 的 PCI NVMe 驱动检查 `Identify Controller.OACS[0]` 再提供相应的 UEFI 存储安全命令接口。Opal 的 Level 0 Discovery 可报告 `LockingSupported`、`LockingEnabled`、`Locked`、`MediaEncryption` 等属性。目标 LBA 的读访问还取决于其所属范围的 `ReadLocked` 和相应的复位策略 `LockOnReset`。完成解锁后，自加密盘在盘内处理介质加密，再向主机返回逻辑块内容，若该卷又叠加了软件加密，逻辑块可仍是卷密文。PCIe IDE 另外保护启用它的在途 TLP 流，图中的包方向表示协议语义，受保护流的有效载荷能否直接解码取决于 IDE 状态。[EDK II 能力检查][edk-sec-cap] · [TCG Opal 2.02][opal-spec] · [PCI-SIG IDE][pcie-ide-security]

例如在一次典型 Opal 会话里，主机可以先用 Security Receive 做 Level 0 Discovery，随后通过针对 Locking SP 的已认证会话请求改变目标范围的 `ReadLocked`。Opal 定义了 `StartSession`、会话内的表操作和方法状态，认证也可以作为建立会话的一部分。分析时可根据会话标识和响应把协议操作与 81h/82h 配对，避免把只查询功能、读取状态或与其他安全协议有关的命令误计为解锁。[Opal 2.02 §3.1、§4.1 和 Locking SP 表][opal-spec] · [EDK II 存储安全接口][edk-sec-opcode]

**开机屏幕上的“密码”还要看由谁验证。** 联想给 ThinkPad T14 Gen 2 等机型分别定义了开机密码、管理 BIOS 设置的主管密码和保护存储数据的 NVMe 密码。Windows 的 BitLocker 开机 PIN 和 Linux 的 LUKS 口令又由各自的引导软件处理。界面来自 BIOS 或看起来像 BIOS，只能定位交互界面。要关联一笔 SSD 命令，仍需确认密码类型与实际启用的磁盘策略。[联想机型手册][lenovo-passwords] · [微软 TPM 使用说明][win-tpm] · [Debian 加密根卷][luks-init]

**实机时间一，平台固件的独立打点。** 2024 年 Opportunity Open Source Conference 演示第 23 页展示了 `omnigul-rev2` 的 coreboot 时间表。Chromium 将 Omnigul 对应到 Acer Chromebook Plus 515（CB515-2H/2HT 系列）。按原图用微秒列出的阶段耗时，TPM 初始化约 **143 ms**（事件 503→504），ChromeOS 固件 keyblock/preamble 的 RSA 验证约 **109 ms**（505→506），TPM PCR 扩展阶段约 **98 ms**（511→512）。这些数字来自 ChromeOS 固件 Verified Boot 期间的 `cbmem -t`。演示未把这些阶段与 M.2 3.3 V 的边沿同步，亦未提供 UEFI 对 ESP 中 EFI 文件的验签时间或 NVMe 解锁时间。[原始控制台图，第 23 页][acer-cbmem] · [Chromium 板名与机型对照][acer-platform] · [coreboot 的时间单位][cbmem-clock]

**实机时间二，加密启动盘的一次整机启动。** 一位 ThinkPad T14 Gen 1 用户公开了 Ryzen 5 4650U、Samsung 512 GB Gen3 NVMe、EFI stub 与 LUKS 的一次 `systemd-analyze` 输出。固件 **6.373 s**，引导器 **195 ms**，内核 **16.527 s**，用户空间 **5.877 s**，合计 **28.972 s**。机主说明内核阶段大部分时间在输入解密口令，并明确未使用 TPM2 密钥。记录没有单列密码派生、Secure Boot 验签或 Opal 认证耗时。前文 Debian/Samsung 980 的原帖同样没有公布这些功能的启用状态或协议时间。三星为 980 500 GB 标注的 AES-256、TCG/Opal 2.0 和 Encrypted Drive 是型号能力。[ThinkPad 机主原始记录][t14-luks-time] · [Debian 主案例][case-debian-security] · [Samsung 980 500 GB 型号规格][samsung-980-security]

**Opal 台架对照。** SANBlaze 的验证白皮书记录了一条锁定后的 NVMe Read 在 **96 µs** 返回 Access Denied（`SCT=2h, SC=86h`），以及解锁后读 4 KiB 成功的 **122 µs**。时间量自测试软件报告的两条 Read，白皮书没有给出认证耗时或整机型号、测试盘型号。这个例子给出了读锁解除前后的完成状态。[SANBlaze 白皮书 §3.1.4–3.1.5][sanblaze-opal]

<a id="transactions"></a>

## 三、一条 NVMe 命令在线路上长什么样

下表采用普通主存队列、未加密且可解码的直连 PCIe 端点。Host 是根复合体/主机侧，SSD 是端点。NVMe 的“读、写”以主机对逻辑块的动作为准，PCIe 的“读、写”以该笔内存事务的发起者为准，因此两种方向常常相反。[PCIe Transport §3.4 图 8][transport-io]、[SPDK 提交 I/O 的实现解说][spdk-io]

| 顺序 | 主机或 SSD 做什么 | SSD 所在链路上常见的形态 |
|---|---|---|
| 1 | 主机把典型的 64 B SQE 放入主存中的 SQ。记录队列、CID、opcode、NSID、PRP 或受支持的 SGL，以及命令特有字段。 | CPU 写本地主存通常不会经过 SSD 插槽。主机随后更新 SQ Tail Doorbell，常见为 Host → SSD 的 posted Memory Write。一次门铃可以公布多条命令。[命令提交][transport-io]、[SPDK 队列][spdk-io] |
| 2 | SSD 取一个或多个 SQE，按需要取得 PRP 列表或 SGL 描述符。 | SSD → Host 的 Memory Read（MRd），随后 Host → SSD 的 Completion with Data（CplD）。用请求者、Tag、地址与返回分片配对。一个 TLP 与一条 NVMe 命令没有固定的一一对应关系。[PCIe 读事务][pcie-read]、[NVMe 数据描述符][prp] |
| 3 | 对 NVM **Write**，SSD 要得到主机提供的数据。对 NVM **Read** 或 Identify，SSD 要将结果送到主机。 | **Write** 载荷常见为 SSD 发 MRd，主机回 CplD。**Read/Identify** 结果常见为 SSD → Host 的 posted Memory Write（MWr）。主机写门铃的 MWr 与 SSD 写数据、写 CQE 的 MWr 应按方向和地址区分。[PCIe Transport][transport-io]、[NVM Write 定义][fua] |
| 4 | SSD 执行完成，把典型的 16 B CQE 写到主机 CQ。回查 SQID、CID、SQHD、Phase Tag、SCT/SC，以及命令特定结果。 | 识别 SSD → Host 写入 CQ 地址区间的 MWr，再按队列基址和环形偏移解码。PCIe 的 CplD 只完成某个非 posted 事务。设备放到 NVMe CQ 中的成功状态才对应这一条 NVMe 命令的完成。[队列和命令完成][transport-io]、[SPDK 驱动内存布局][spdk-queue] |
| 5 | 主机从 CQ 取走有效完成，推进 CQ Head。中断可以合并，也可以直接轮询。 | 如启用 MSI-X，可能看到写往已配置中断消息地址的事务。主机消费 CQE 的本地内存读通常过不了 SSD 插槽。主机的 CQ Head Doorbell 说明已回收一批 CQ 项。[PCIe Transport §§3.4–3.5][transport-io]、[固件轮询实例][edk-submit] |

**按地址重建队列。** NVMe 寄存器相对 BAR 的偏移为 `CAP 0x00`、`VS 0x08`、`CC 0x14`、`CSTS 0x1C`、`AQA 0x24`、`ASQ 0x28`、`ACQ 0x30`。门铃步长 `s = 4 << CAP.DSTRD` 字节。队列 `q` 的 SQ Tail 为 `0x1000 + (2q) × s`，CQ Head 为 `0x1000 + (2q+1) × s`。控制器再次使能或队列删除再建后，重新解析地址和环绕代次。配对键至少用“控制器、队列创建代次、SQID、CID”，看到同 CID 时也核对方向和完成状态。IOMMU 启用时以分析点所见的设备 DMA 地址为准。[Base 2.1 寄存器][regs]、[队列门铃间距][stride]、[Linux DMA 地址模型][dma]

若 SQ 放在 Controller Memory Buffer（CMB），主机会直接写该设备映射的内存。支持并启用 shadow doorbell 后，软件可更新主存中的门铃并按事件条件决定是否写 MMIO。加上队列批处理、预取、中断合并或轮询，都可能减少门铃或中断的数量。解析器依赖当前这批队列的配置。从运行中段开始的记录往往缺少队列基址。[SPDK 的 CMB 支持][spdk-queue]、[Doorbell Buffer Config][dbbuf]、[Linux 可选功能与 I/O 队列][linux-setup]

**一个 4 KiB 写入在线路上占多少包。** 假设用户数据缓冲区对齐且连续，SSD 的 Max Read Request Size（MRRS）为 512 B，返回数据时采用的 Max Payload Size（MPS）为 256 B。一条 4 KiB NVM Write，光是从主存取这 4,096 B 数据，就至少需要 **8 个 MRd、16 个 CplD**。实际分片、边界与缓冲区布局可能增加包数。反过来，一条 4 KiB NVM Read 把数据送回主存时，若每个 MWr 最多 256 B，仅数据就至少要 **16 个 MWr**。这两个算例都另计取命令、门铃、写完成项和可能的中断消息。它解释了为什么按 TLP 条数统计会得到与文件读写次数完全不同的结果。[Intel 对 MRRS、MPS 和拆分 Completion 的说明](https://docs.altera.com/r/docs/683504/current/an-855-pci-express-high-performance-reference-design-for-intel-cyclone-10-gx/throughput-for-reads) · [NVMe over PCIe 数据方向][transport-io]

### 读包时常用的命令和位域

先用队列角色、命令集和寄存器地址解释数值。比如同一个 opcode `02h`，在管理 SQ 上是 Get Log Page，在使用 NVM 命令集的 I/O SQ 上是 Read。同一个偏移 `0x08`，在 PCI 配置空间读取的是 Class Code 与修订号所在的双字，在 NVMe 寄存器 BAR 中读取的是 VS。[微软列出的管理与 I/O opcode](https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/stornvme-command-set-support) · [PCI 配置空间和 NVMe 寄存器][pci-cfg] · [控制器寄存器][regs]

| 所在层 | 十六进制编码 | 能查到什么 |
|---|---|---|
| 管理命令 | `06` Identify，`09/0A` Set/Get Features，`02` Get Log Page，`0C` Asynchronous Event Request | Identify 的 CNS 决定返回控制器还是 namespace 信息。Features 的 FID 决定查询或设置哪一项，Get Log Page 的 LID 决定日志种类。异步事件请求在正常运行期间可以长时间处于未完成状态。 |
| 管理队列上配置 I/O 队列 | `05` 建 CQ，`01` 建 SQ，`00` 删 SQ，`04` 删 CQ | 创建 I/O SQ 时还要读取目标 CQID。管理 SQ/CQ 本身靠寄存器建立，所以抓到的第一条 Create Queue 可以已经是 I/O 队列。 |
| 常见 FID | `02` 电源管理，`06` 易失写缓存，`07` 队列数，`0B` 异步事件配置，`0C` APST，`0D` HMB | Identify 给出能力，Get/Set Features 与对应返回状态说明特定功能是否配置。设备报支持 HMB 与主机实际交付内存是两步。 |
| NVM 块 I/O | `00` Flush，`01` Write，`02` Read | Read/Write 的 NSID 确定命名空间，CDW10/11 给起始 LBA，CDW12 低 16 位给零基 NLB，Write 的 CDW12 bit 30 是 FUA。Flush 的作用域和完成点另外核对。 |
| NVMe 完成队列 | SQID、CID、Phase、SCT、SC，及有定义时的命令结果 | Phase 区分队列环绕时的新旧项，SCT 与 SC 决定成功及错误类别。PCIe 收到链路层 ACK 或读事务 CplD 与 NVMe CQE 各属一层。 |

编码依据可对照 [StorNVMe 命令表](https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/stornvme-command-set-support)、[NVMe Features 定义](https://learn.microsoft.com/en-us/windows/win32/api/nvme/ne-nvme-nvme_features)、[NVM 命令字段](https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-Revision-1.1-2024.08.05-Ratified.pdf) 和 [PCIe 命令及完成队列][transport-queue]。

<a id="shutdown-sequence"></a>

## 四、从关机请求到 SSD 主电源消失

| 阶段 | 有序路径的行为 | 观测与判定 |
|---|---|---|
| 1. 上层收尾 | 应用提交缓冲写入，文件系统回写脏页、日志与元数据。Windows 快速启动/休眠可另写休眠文件。后台 I/O、跨队列完成及文件系统提交会交错。 | 应用成功返回、块层提交、NVMe CQE 和恢复后的文件内容是不同事件。已经关掉的应用、末次文件系统日志或系统关机事件，只能给出相应层次的时间界限。[Windows 文件缓存][win-flush]、[Linux 写回控制][writeback]、[快速启动][win-power] |
| 2. 确立持久化边界 | 根据设备写缓存和上层请求，可出现 NVM Flush，或带 FUA 的 Write，或二者组合。需要对照 SQE 的 NSID/FUA、写入完成与 Flush 提交的先后，以及各自 CQE 的状态。 | Idle、无易失写缓存、设备能力及块层优化都会改变末段命令。规范规定的是命令语义和关停程序，不能为每次关机预填一条“最后的 Flush”。[Base 2.1 §7.2][flush]、[NVM Write.FUA][fua]、[块层写回策略][writeback] |
| 加密卷与范围锁收尾 | 文件系统、交换区和在途 I/O 不再依赖目标范围后，主机可撤掉软件解密路径。配置了显式 Opal 上锁时，保留可用 Admin 队列，在关停通知前送出认证与锁定请求。依赖 `LockOnReset` 的分支继续向下等匹配的复位事件。 | 软件解密路径关闭与密钥状态在主机侧观察。显式 Opal 上锁可关联 Admin 安全收发及方法状态。自动上锁用具体 reset_type 和复电后的范围状态判读。[加密关停详情](#shutdown-security) |
| 3. 停止新 I/O，处理队列 | 对已使能的内存型控制器，Base 2.1 建议正常关停先停止提交新 I/O，等在途命令完成。若有 I/O 队列，再删 I/O SQ，后删 I/O CQ。删除 SQ 成功时残余在途命令会被中止。 | 对照各队列的末笔成功、失败、中止和未决命令。管理队列仍承担 Delete I/O 队列命令。设备已失联、异常停止或不同驱动可能省略部分步骤。[Base 2.1 §3.6.1][shutdown]、[Linux v6.12 删除顺序][linux-del] |
| 4. 通知控制器 | 正常通知是在 BAR 中写 `CC.SHN=01b`。可通信的快速关停写 `10b`。`00b` 为没有关停通知，`11b` 保留。该字段是 CC[15:14]，应解码写入后的整字。 | 这是寄存器写，没有与它一一对应的 NVMe 命令或 CQE。对比 `CC.EN` 由 1 到 0 的控制器复位。关停进行中立即清 EN 会触发复位并可能扰动完成时间。[Base 2.1 CC 定义][cc]、[关停顺序][shutdown] |
| 5. 确认关停完成 | 主机读 `CSTS.SHST`（[3:2]）。`00b` 为正常运行，`01b` 为关停进行中，`10b` 为完成，`11b` 保留。Base 2.1 的控制器级可断电条件为 `SHST=10b` 且 `CSTS.ST=0`，与此刻 EN 的值无关。 | 在寄存器读的 CplD 中取值。轮询可直接从 00 读到 10，首次读到 10 是完成时刻的上界。ST 是关停**范围**，控制器/子系统由此区分。普通/快速则由 SHN 区分。NVMe 1.4c 未定义 ST，按该版 SHST 判定。[Base 2.1 CSTS][csts]、[控制器及子系统关停][shutdown]、[1.4c 关停][old-down] |
| 6. 平台收链、断电 | 设备和端口按平台策略可进入 D3hot，经平台电源资源进入 D3cold，或直接走系统关机供电路径。参与 PCIe 电源握手时可能见 `PME_Turn_Off`、`PME_TO_Ack`、`PM_Enter_L23`，随后链路失活、复位、时钟停转以及主供电失效。 | D3hot 可保留配置访问。D3cold 涉及主电源移除，辅助电源若有应单列。PMCSR 指示、链路失活、PERST# 拉低与盘端电压各有独立含义。握手是否出现及三种电信号的相互顺序，应依所处路径与板级设计核实。[Linux PCI 电源状态][pci-pm]、[PCI-SIG Turn Off 说明][turnoff]、[Runtime D3 时序扩展][dsm] |

**关停需要等多久。** 驱动愿意等多久，由超时策略决定。SSD 何时报告完成，可以用轮询约束。若用设备对 CSTS 取样的时刻表示，`最后一次未完成采样 < 完成时刻 ≤ 首次完成采样`。若只有线上的 PCIe 时间戳，从最后一次读到未完成的**请求**到首次读到完成的 **CplD** 是一个保守区间，其中包括链路延迟。没有读到中间态时，可从正常 SHN 写开始计这段上界。记录在成功读之前终止时，完成时刻未知。[Base 2.1 关停][shutdown]、[Linux 状态轮询][linux-shn]

| 来源 | 等待与返回条件 |
|---|---|
| NVMe Base 2.1 §3.6.1 | Identify Controller 的 `RTD3E` 给出典型进入延迟，单位 µs。规范建议给关停处理至少该等待预算，RTD3E 为 0 表示未报告，建议至少给 1 s。完成条件满足时即可判读为就绪。这是主机的等待建议，不能把 1 s 当掉电延时或证明控制器已经完成。启动 RDY 的 `CAP.TO/CRTO` 属于另一段时间。[关停程序][shutdown]、[RTD3E 字段][rtd3]、[就绪时间][ready] |
| Microsoft 内置 StorNVMe | 微软对关机/休眠的实现说明是写 SHN=1，等待 SHST=2。设备有报告时采用其 RTD3 进入延迟，未报告时默认 5 s。超过这 5 s，系统可继续关机或休眠。文档说明的检查字段是 SHST。第三方存储驱动需看各自实现。[Microsoft，Shutdown/Hibernate][stornvme] |
| Linux v6.12 的 PCI 驱动 | `nvme_shutdown` 走 `nvme_dev_disable(..., true)`。对可通信且有队列的控制器，先冻结/静默 I/O、删队列，再由 `nvme_disable_ctrl(..., true)` 写 normal SHN 并轮询 **SHST 掩码**。模块参数 `shutdown_timeout` 默认 5 s。若 RTD3E 非零，先将 µs 截整为 s，再以该模块参数为下限、60 s 为上限取值。RTD3E 为零时使用模块参数。全 1、读失败和超时走错误路径。源码中的检查没有包含 ST，报告协议级判据时应写明两者。[v6.12 关机入口][linux-entry]、[禁用条件][linux-stop]、[轮询与掩码][linux-shn]、[参数默认值][linux-default]、[RTD3E 换算][linux-timeout] |

**快速通知与电源骤失。** 对 `SHN=10b`，Base 2.1 仍定义控制器级完成状态。主机被迫提前断电时，未必来得及等待它。没有预警的主电源切断可以让命令、DMA 或 CQE 停在任一阶段。具有掉电保护（PLP）的设备可用保持能量处理内部缓存/映射，保护的数据类别取决于具体型号。链路的最后一个包、最后完成的写、内部最终写入介质的时刻分别记录。NVMe 子系统级关停是另一项有能力前提的流程，Base 2.1 用 `ST=1` 标明其范围，不能把该位解成“突然掉电”。[控制器级关停][shutdown]、[子系统级关停][subshutdown]、[Micron 的保护范围实例][plp]

**M.2 的掉电预警边带。** PCI-SIG 的 M.2 ECN 还定义了可选 `PLN#`。支持它的平台可在供电即将失效时通过引脚通知设备，触发该设备设计提供的保护动作。解释波形时要区分硬件预警的引脚边沿、软件向 NVMe `CC.SHN` 的写入和主电压的越限。这是三个不同的观测点。PCI-SIG 也将该信号的用途与 PCIe 的设备及链路低功耗状态区分开来。Samsung 980 主案例没有公开这个引脚的连线或活动记录。[PCI-SIG 的 M.2 Power Loss Notification ECN](https://pcisig.com/PCIExpress/ECN/M.2/1.8VsidebandPowerLossNotificationUSB2.0andHigherPowerSupport_B)

<a id="shutdown-security"></a>

### 软件卷密钥何时失效，Opal 何时重新上锁

图示的参考对象是正常执行完整关机的一台 NVMe PC。应用停止访问后，文件系统仍可能写回日志、脏页和卸载元数据。软件加密的主机此时还必须能加密这些写入，Opal 锁定范围也要维持对应的写权限。核对最后一轮需要持久化的写已完成。如果发出 NVM Flush，则以其作用域和成功 CQE 确认写回边界。上层卸载与下层 Flush 的实际先后由存储栈决定。主机在移除软件映射后仍能对底层 namespace 发 Flush。[Linux 写回与 FUA][writeback] · [NVMe Flush][flush] · [systemd 关机][systemd-poweroff-src]

| 图中动作 | 主机软件、SSD 或主板如何完成 | 目标 M.2 上的可见事务 |
|---|---|---|
| **A，停止使用软件加密卷** | 软件 BitLocker 或 dm-crypt 仍处理关机期间最后的正常卷读写。停用上层文件系统和交换区、收敛在途 I/O 后，运行期解密路径可以撤除。 | 写入通常为 NVM Write，D→R 发 `MRd`，R→D 的 `CplD` 携带软件卷密文。若有 Flush，同样经过 SQE、门铃、CQE，载荷阶段没有独立数据缓冲区传输。[dm-crypt][luks-dm] · [BitLocker 对密钥与内存的说明][bitlocker-powerkeys] · [队列传输][transport-io] |
| **A，LUKS 映射关闭和密钥失效** | 关闭成功时，`cryptsetup close` 移除 dm-crypt 映射，并清理它持有的内核密钥。Linux v6.12 的 `crypt_dtr` 释放加密变换并清除密钥材料。若根卷仍被引用，普通停止请求可报 busy，或按配置将卸载留给关机 initramfs。只有实际移除才产生映射关闭的结果。清理映射的密钥与修改磁盘上的 LUKS 密钥槽是独立操作。 | 映射操作和密钥清理发生在主机。总线记录能看到前后发生的块 I/O，无法看到这一步的 RAM 写入。仅有 systemd 的单元停止日志，仍需核对退出状态和映射实际消失。[cryptsetup close][cryptsetup-close] · [dm-crypt 释放路径][dmcrypt-dtr] · [crypttab 的 x-initrd.attach][crypttab-shutdown] |
| **A，软件 BitLocker 系统卷结束使用** | 正常完整关机关掉运行期卷访问上下文。加密卷元数据及其保护器留作下一次启动使用。微软给出的公开行为可确认启动时如何重新得到解密材料。清理每份内存密钥的时间和它与 `CC.SHN` 的相对时刻在上述公开资料中没有给出。显式锁定的数据卷有其独立管理接口。 | TPM 交互、在主机内结束密钥使用和 NVMe 关停可以分别观察。Linux TPM 2.0 驱动的 `TPM2_Shutdown(CLEAR)` 是平台接口示例，NVMe 不承载这个命令。[微软 TPM 使用说明][win-tpm] · [卷保护和运行期密钥][bitlocker-powerkeys] · [BitLocker 数据卷锁定接口][bitlocker-lock-data] · [Linux TPM 关机源码][tpm-kernel-down] |
| **B1，主机在线显式锁住 Opal 范围** | Admin SQ0/CQ0 可用，主机取得授权的 Locking SP 会话，按策略请求设置目标范围的 `ReadLocked`、`WriteLocked`。图示在该范围的最后一轮 I/O 完成后、写 `CC.SHN` 之前执行。若认证、方法状态或范围校验失败，不能记为已锁定。正常上锁保留盘内介质密钥和数据。 | H 提交 Admin `81h/82h`。每条命令均有 R→D `MWr` 门铃、D→R `MRd` 取 SQE、R→D `CplD` 回 SQE。81h 的数据阶段是 D→R `MRd` 后 R→D `CplD` 携带请求，82h 由 D→R `MWr` 写回响应。再核对 D→R 的 CQ0 完成项、方法状态及对应的范围锁位。主机消费 CQE 后用 R→D `MWr` 写 CQ0 头门铃。[Linux Opal 锁范围实现][opal-lock-linux] · [NVMe 安全命令][nvme-security-ops] · [队列传输][transport-io] |
| **B2，按 `LockOnReset` 自动上锁** | 已配置目标范围、`ReadLockEnabled`、`WriteLockEnabled` 与 `LockOnReset`。按 TCG SIIS 1.20 表 20，单端口设备主电源丢失或发生 PCIe cold reset 对应 TCG `Power Cycle`，有电时发生 PCIe warm reset 对应 `Hardware Reset`，链路下降或仅清 `CC.EN` 不产生表中的 TCG 复位类型。Opal 2.30 要求支持包含 Power Cycle 的组合，支持包含 Hardware Reset 的组合是可选能力。只有 `PERST#` 波形时，还需结合供电判断复位类型。 | 主机即使发了 SHN 和 PCIe 电源管理消息，自动锁定本身也在 SSD 内完成。它没有一笔对应的 `81h/82h`。可在下次可通信时查看范围锁位或读访问结果。只有聚合的 `Locked` 属性时，尚需确认它对应目标范围。[TCG SIIS §6.2，表 20–21][siis-reset] · [Opal 2.30 §4.3.5.2.2][opal-230] · [OCP 对 PERST# 和上锁的说明][ocp-perst-lock] |

沿图继续，主机在条件允许时由 Admin 队列先删 I/O SQ、再删 I/O CQ，随后用 R→D `MWr` 写 BAR+14h 的 `CC.SHN=01b`。它用 R→D `MRd` 和 D→R `CplD` 读取 BAR+1Ch 的 `CSTS`，通过 `SHST=10b`（Base 2.1 控制器级再看 `ST=0`）确认关停完成。之后平台才在示例路径上收链、控制 `PERST#` 和 REFCLK，并撤掉插槽主电。主机只做 S5 而插槽主电仍在的板子，需要另判定有没有触发 B2 的复位类型。NVMe 状态、主机密钥状态和 Opal 范围状态来自三个观察层。[NVMe 关停][shutdown] · [Intel PCIe 收链][intel-pm-off] · [TCG 复位映射][siis-reset]

**加密关机的公开记录。** Dell Inspiron 16 7610（BIOS 1.4.0，Fedora 35 内核 5.16.11，M.2 NVMe 型号未公开）的故障关机日志在 **14:02:34** 报 LUKS 映射因设备仍在使用而关闭失败，同秒记录开始同步文件系统和块设备。**14:03:24** 记录同步超时，相距约 **50 s**，分辨率为秒。这一时间来自同步开始到超时的两个软件事件，密钥清理和盘端断电均未打点。SANBlaze Opal 台架的 **96 µs / 122 µs** 分别为锁定后读被拒绝与解锁后读成功的单命令时间，主机和盘型号未披露，`81h/82h` 上锁会话耗时也没有单列。正文所引的 Dell XPS 13 / SK hynix PC300 的 **412.470 ms** 则属于 S3 入睡路径的一次 SHST 轮询。[Inspiron 7610 原始关机日志][dell-7610-luks] · [SANBlaze 读测试][sanblaze-opal] · [Dell XPS 13 原始日志](https://lists.infradead.org/pipermail/linux-nvme/2024-May/047178.html)

<a id="durability"></a>

## 五、什么样的写入可在复电后要求读回

| 下电前已有的证据 | 持久性结论与恢复时的判读 |
|---|---|
| 应用缓冲写返回成功，或只见 Write 已提交/数据已 DMA | 可能仍在应用、内核、设备队列或易失缓存中。缺 CQE 时结果是未决，介质可能已写入。把复电读回与前一版本和新版本逐块对照，保留未决分类。[Windows 文件缓存][win-flush]、[命令处理][transport-io] |
| 普通 Write 的成功 CQE | 若控制器启用易失写缓存，该 CQE 的语义允许先确认再持久化。已禁用/不存在易失写缓存，或厂商定义了更强的数据保护时，需以该配置、命令和具体产品保证解释。数据到达 SSD、CQE 到达主机、主机软件取走 CQE 也各有时间差。[写命令][fua]、[易失缓存及 Flush][flush]、[PLP 范围][plp] |
| FUA=1 的 Write 成功 | 在该条 Write 报告完成前，所覆盖逻辑块的数据和相关元数据应已进入非易失介质。FUA 不为其他并行命令附带排序保证。恢复后核对这一写入范围，排除后续合法覆盖。[NVM Command Set 1.1 图 70][fua] |
| 指定 namespace 的 Flush 成功 | 启用易失写缓存时，覆盖**提交这条 Flush 之前已由控制器完成**、且属于该作用域的旧命令。跨队列仅仅“先提交”仍可能未完成，不能归进此集合。全 namespace 的 `FFFFFFFFh` 还要核对 Identify 的 VWC Flush Behavior 能力。[Base 2.1 §7.2][flush] |
| 已确认写与掉电时正在覆盖的 LBA 重叠 | 先依据 namespace 的 LBA 格式、掉电原子写大小与边界解释可接受的旧/新结果。查看控制器 `AWUPF` 和有能力时 namespace 的 `NAWUPF`、原子边界。大于承诺范围的多块写不能预设全旧或全新。文件系统事务与设备保证的原子写单位也应各自检验。[NVM Command Set 1.1，Atomic Operations][atomic] |

对公开案例，最强的端到端依据是同一盘、同一 namespace、同一 LBA 范围在复电前后的已知数据。理想记录将确定已持久化、在途与从未更新三类数据各自保留序列号和校验值，预期清单存放在独立设备。复电后核对盘身份、namespace 和 LBA 格式，尽量在系统恢复写入前读取。若必须查看文件系统，区分原始块、日志回放前镜像、回放后的目录和应用记录。重启成功、挂载成功、文件可打开各自只证实相应层次。这里给出的是公开证据的验收口径，具体数据恢复结论需要相应读回记录。[写入与原子性][atomic]、[Linux 写回控制][writeback]、[Windows 文件缓冲刷新][win-flush]

### 盘内地址映射、主机内存和文件系统各恢复什么

**FTL 恢复。** 主机读写的是逻辑块地址，SSD 的闪存转换层（FTL）负责把它映射到实际闪存位置。掉电时用户数据和地址映射元数据都可能正被更新。美光披露，其文中举例的客户端设计可在复电后利用非易失存储中的信息重建丢失的映射表，厂商称这一项可给启动增加几秒。开源的 SPDK FTL 是运行在块设备之上的软件，它公开了另一种具体算法。该实现读取各区域保存的物理到逻辑映射，按序号确定同一 LBA 的最新副本，重建逻辑到物理映射。Samsung 980 的公开案例没有给出它使用的恢复算法，也无法把一次 RDY 等待直接归因于 FTL 重建。[美光白皮书，第 3 页](https://www.micron.com/content/dam/micron/global/public/products/white-paper/ssd-power-loss-protection-white-paper-lo.pdf#page=3) · [SPDK FTL 的 Dirty shutdown recovery](https://spdk.io/doc/ftl.html)

**HMB 和盘内供电。** 主案例的 980 支持 HMB，主机可为 SSD 分配一段可 DMA 的内存。要判断现场存在何种掉电风险，还要看 HMB 是否启用、固件用它保存什么，以及对应写入是否已经获得持久化承诺。一项针对其所测 DRAM-less NVMe 样品的同行评审研究发现，样品主要用 HMB 缓存地址映射。另一个有明确厂商承诺的 NVMe 型号是三星 PM9A3，三星说明其掉电保护电容可在检测到电源异常时为盘内 DRAM 数据搬到闪存提供能量。这两份资料分别说明 **缓存里装的是什么** 与 **失去外部电源后谁还能供电**。主案例中只看到 HMB 产品能力和 SMART 差值，无法反推出某块用户数据留在主机 DRAM 中。[980 产品说明](https://news.samsung.com/global/samsungs-980-nvme-ssd-combines-speed-and-affordability-to-set-a-new-standard-in-consumer-ssd-performance) · [HMB 研究原文](https://pmc.ncbi.nlm.nih.gov/articles/PMC7051071/) · [三星 PM9A3 设计说明](https://download.semiconductor.samsung.com/resources/brochure/Samsung%20PM9A3%20NVMe%20PCIe%20SSD.pdf#page=3)

**文件系统恢复。** 主案例的根和数据分区是 ext4。按 Linux 文档，默认 `data=ordered` 模式对元数据记日志，并在提交相应元数据前安排文件数据写入。恢复时，ext4 可以回放已提交的日志事务，连普通的只读挂载也可能触发回放并写盘。因此“第一次挂载后读到的值”与“刚复电时盘上原始块的值”是两个时间点。若关注新建或重命名文件，Linux 的 `fsync()` 还区分文件数据和父目录项的持久化。判断某文件是否丢失，应关联应用实际同步的对象、SSD 已承诺的 LBA 范围和恢复之后的内容。[现场挂载表](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1035665) · [ext4 日志](https://docs.kernel.org/filesystems/ext4/journal.html) · [只读挂载与日志回放](https://kernel.org/doc/html/v5.19/admin-guide/ext4.html) · [Linux fsync 手册](https://man7.org/linux/man-pages/man2/fsync.2.html)

## 六、怎样判读恢复后的健康计数

读取同一盘前后的 SMART/Health（Log 02h），对照 Power Cycles（字节 112–127）、掉电计数（144–159）、Media and Data Integrity Errors、Error Information Log Entries、Critical Warning。记录 SSD 序号、固件、NSID/日志作用域以及原始小端计数。错误日志 Log 01h 给出该次可读取的详细条目。若设备支持 Persistent Event Log（0Dh），可用其事件与主机日志交叉核对。累计计数没有每个电源边沿的时间，且每个字段表达的事件不同。[Base 2.1 健康日志图 206][health]、[Microsoft 字段解释][win-health]、[nvme-cli 日志命令][nvmecli]

| 同一位置的字段 | 原规范如何计数 | 对分析的影响 |
|---|---|---|
| NVMe 1.4c，Unsafe Shutdowns | 设备失电前没有收到 Shutdown Notification（CC.SHN）时递增。 | 一个平稳的差值不能独自证实“SHST 已完成后才掉电”，因为这个版本把“收到通知”作为计数条件。[1.4c SMART/Health][old-health] |
| NVMe Base 2.1，Unexpected Power Losses（UPL），原名 Unsafe Shutdowns | 主供电失效时，控制器未报告 `SHST=10b`，或带外管理命令使用 Ignore Shutdown 访问介质、使介质脱离 shutdown 状态，按规范规定计数。 | OS/SMART 工具可能沿用旧标签。相同的“写了 SHN，尚未完成即掉电”在两版中的计数条件不同。增量用于佐证设备经历的事件，不能据此计算丢失了多少条写入。[Base 2.1 图 206][health]、[1.4c 对照][old-health] |

<a id="samples"></a>

## 公开记录的逐项复算

### 电从哪里开始、在哪里消失

Quarch 用 U.2 夹具录下了一次成功枚举。图上同时有 12 V、3.3 V、PERST#、SMBus 和活动指示线。功率曲线采用 16 µs 采样间隔，每点平均四个底层样本。厂商读出的启动后空闲功耗为 **6.18 W**，另有约 2 ms 量级的重复尖峰，最高约 **10 W**。这是 U.2 盘的数值。Samsung 980 使用 M.2，不能把 U.2 的 12 V 供电条件或功率值移到它身上。[Quarch 上电波形及采样说明](https://quarch.com/news/the-cost-effective-way-to-debug-ssd-sidebands/)

同一篇文章的另一幅实测图记录了切断一台 PC 的交流输入。SSD 的 3.3 V 轨先降至零，随后出现数次短促回升，WAKE# 也随之变化。作者将电源尝试恢复列为可能原因。仅凭这条线不能判断 SSD 重新执行了哪段固件。工程上应给“掉电时刻”写明测量位置、电压阈值和首次或最终越过阈值，尤其是在波形有回弹时。[Quarch 的交流断电波形](https://quarch.com/news/the-cost-effective-way-to-debug-ssd-sidebands/)

### 从三个 PCIe 配置读还原出 NVMe 寄存器地址

Teledyne LeCroy 公布的教学抓包第 4–5 页给出了端点配置和三次配置读。显示的端点为 `06:00.0`，NVMe 版本为 1.1。对 PCI 配置空间偏移 `0x08` 的三次读取均成功，返回 class code `0x010802` 和 revision `0x10`。图中时间戳依次为 **38.811122282 s、38.811235170 s、38.811348170 s**。相邻行相隔 **112.888 µs、113.000 µs**。它们是三次显示事件间隔。公开页没有把抓包的时间零点定义成盘上电，也没有给出每次读请求到其 Completion 的独立延迟。[分析仪原图，第 4–5 页](https://cdn.teledynelecroy.com/files/appnotes/capture-of-an-nvme-boot-up-trace-appnote.pdf#page=4)

该公开样本给出寄存器基址 `0xFE200000`，门铃实际步长 4 B，`ASQS=ACQS=127`，`IOSQES=6`、`IOCQES=4`。据此可以复算出两个管理队列各配置 128 个条目，I/O 提交项及完成项分别为 64 B 和 16 B。下表的地址是从厂商公布的映射推导的结果，不能将“地址可算出”填成“原图已出现一次该地址写入”。[样本配置图](https://cdn.teledynelecroy.com/files/appnotes/capture-of-an-nvme-boot-up-trace-appnote.pdf#page=4) · [NVMe over PCIe，Doorbell Registers](https://nvmexpress.org/wp-content/uploads/NVM-Express-PCIe-Transport-Specification-1.0c-2022.10.03-Ratified.pdf)

| 读写目标 | 相对基址 | 此样本的主机 MMIO 地址 |
|---|---:|---:|
| 控制器配置 CC | `0x14` | `0xFE200014` |
| 控制器状态 CSTS | `0x1C` | `0xFE20001C` |
| 管理 SQ0 尾门铃 | `0x1000` | `0xFE201000` |
| 管理 CQ0 头门铃 | `0x1004` | `0xFE201004` |
| I/O SQ1 尾门铃 | `0x1008` | `0xFE201008` |
| I/O CQ1 头门铃 | `0x100C` | `0xFE20100C` |

### 一块实体 Samsung 970 EVO Plus 为何晚出现了 2.35 秒

Jason A. Donenfeld 在 Linux 内核邮件列表公布了同一设备在不同内核的启动记录。型号为 **970 EVO Plus 2 TB**，固件 `2B2QEXM7`。以下三行只取 `nvme0`，忽略同一主机交错输出的 `nvme1`。时间从各自的内核时钟零点起算。[两次启动原始记录](https://lkml.iu.edu/2206.1/01792.html) · [同一报告人的 Identify Controller 输出](https://lkml.iu.edu/2206.1/03521.html)

| 内核事件 | Linux 5.17 | 报告所列 5.18 / 5.19 组 |
|---|---:|---:|
| 驱动打印已设置 8 s 关机等待上限 | 0.888361 s | 3.226962 s |
| 打印 16 个 default I/O 队列、0 个专用 read 队列、0 个 poll 队列 | 0.906301 s | 3.253890 s |
| 列出 `nvme0n1` 的两个分区 | 0.910087 s | 3.263778 s |
| 从设置上限的日志到队列日志 | 17.940 ms | 26.928 ms |
| 从队列日志到列出分区 | 3.786 ms | 9.888 ms |

分区出现时间后移 **2.353691 s**。最早那条可比较的日志本身已经后移 **2.338601 s**。从该日志到分区出现的区间只多出 **15.090 ms**。仅凭最后两条消息就把额外的两秒归给建队列或分区读取，会定位错阶段。报告人进一步追到了 Samsung X5 共用 PCI ID 的驱动兼容处理，随后有补丁改用产品型号匹配。设备 Identify 输出中的 `RTD3E=0x7A1200` 等于 8,000,000 µs，与日志中的 8 s 相符。那是开机时设置的等待参数。[原始跟进](https://lkml.iu.edu/2206.1/01831.html) · [内核补丁讨论](https://lists.infradead.org/pipermail/linux-nvme/2022-June/032872.html) · [Identify 字段](https://lkml.iu.edu/2206.1/03521.html)

### 从驱动事件还原创建队列和读取 LBA

Linux NVMe tracepoint 作者给出过一段 **QEMU 仿真的 PCI NVMe 控制器**日志，包含命令参数和成功完成事件。下表是从同一次运行的时间戳相减得到的主机软件区间，其价值在于命令配对和单位换算，实体 SSD 的时延需要另找记录。[含队列和首批读取的原始 trace](https://lkml.iu.edu/1801.3/00090.html)

| 在这段日志中 | 软件准备时间 | 软件完成时间 | 间隔 |
|---|---:|---:|---:|
| Admin，创建 CQ1 | 9.158541 s | 9.158705 s | 164 µs |
| Admin，创建引用 CQ1 的 SQ1 | 9.158712 s | 9.159214 s | 502 µs |
| Admin，创建 CQ2 | 9.159236 s | 9.159288 s | 52 µs |
| Admin，创建引用 CQ2 的 SQ2 | 9.159293 s | 9.159479 s | 186 µs |
| I/O，在 SQ1 上读 NSID 1、SLBA 0 | 9.161390 s | 9.161578 s | 188 µs |
| I/O，同一队列上读 NSID 1、SLBA 24 | 9.161608 s | 9.161681 s | 73 µs |

管理命令的 `QSIZE=1023` 表示申请 1,024 个条目。上面两条 Read 的原始 `NLB=7` 表示每条读 8 个逻辑块，字节数还需要本命名空间的 LBA 格式。两条 Read 先后都用了 `CID=718`，因为第一条已经完成。配对要把控制器、队列、CID 和本次使用的时间范围一起看。LBA 0 的读取与分区探测相容，这条日志本身没有文件名。[命令参数与完成状态](https://lkml.iu.edu/1801.3/00090.html) · [NVM Command Set 1.1 的 Read 字段](https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-Revision-1.1-2024.08.05-Ratified.pdf)

### Dell XPS 13 的同一块盘出现了三种等待时间

Paul Menzel 在装有 SK hynix PC300 的 Dell XPS 13 上给 `nvme_wait_ready()` 前后加了时间戳，公布了冷启动、ACPI S3 挂起和恢复的连续内核记录。开关参数决定该函数等待复位结束或控制器关停完成。这里可以量出软件轮询的墙钟时间，时间戳精度不能替代总线探针精度。[原始补丁和日志](https://lists.infradead.org/pipermail/linux-nvme/2024-May/047178.html)

| 这台机的阶段 | 轮询分支 | 进入 → 返回 | 差值 |
|---|---|---|---:|
| 冷启动时清理已有控制器状态 | 复位，等 `RDY=0` | 0.955898 s → 0.961861 s | 5.963 ms |
| 进入 S3 | 关停，等 `SHST=10b` | 62.697538 s → 63.110008 s | 412.470 ms |
| S3 恢复期间的另一次调用 | 复位，等 `RDY=0` | 63.308394 s → 63.308399 s | 5 µs |

同一讨论还给出设备上报的 `RTD3E` 为 **60 ms**，当次 Linux 配置的关停超时为 **5 s**。这三种数值分别回答设备预期多久、主机在这次调用中实际等了多久，以及主机最多准备等多久。日志没有逐次读出的 CSTS，也没有 S5 断电时间戳。表中的 412.470 ms 只能归属于 S3 进入时的驱动调用。[报告人给出的值](https://lists.infradead.org/pipermail/linux-nvme/2024-May/047178.html) · [内核维护者对超时策略的说明](https://lists.infradead.org/pipermail/linux-nvme/2024-May/047186.html)

### 其他平台的记录各自能补上什么

| 公开样本 | 观察结果 | 对分析的意义 |
|---|---|---|
| PCIe 4.0 M.2 SSD 退出 L1 子状态，示波器与协议仪同步 | 按厂商图 7–11 的游标，CLKREQ# 拉低至 REFCLK 有效约 **301 µs**，从有效 REFCLK 至首个 TS1 约 **53 µs**，从同一参考点至链路返回 L0 约 **384 µs**。 | 后两个区间共享起点。把 53 和 384 相加会重复计时。这一段说明低功耗退出，不能当成冷启动或插槽上电耗时。[原始测量图](https://cdn.teledynelecroy.com/files/appnotes/measuring-pcie-l1-substate-timing.pdf#page=5) |
| Windows Fast Startup，微软 WPA 的 Post On/Off 示例 | normal priority 磁盘读取约 **152 MB**，写入约 **129 MB**，微软指出这些写入大多用于保存正在采集的 ETL。 | 解释了为什么启动并非只读，也说明跟踪工具能改变写入负载。这里是 Windows 磁盘层的所选窗口，资料没有给出相应盘的 PCIe 字节数。[微软 WPA 样本](https://learn.microsoft.com/en-us/windows-hardware/test/wpt/optimizing-performance-and-responsiveness-exercise-2) |
| Linux 整机关机，20 多块 NVMe 的客户主机 | 补丁作者报告，每盘响应正常关停约 **13 s**。串行处理时 NVMe 关停阶段超过 **300 s**，该试验的两阶段并行实现约 **15 s**。 | 这是实机关机路径的多盘案例。解释整机耗时时，要先知道主机是逐盘等待还是并行等待。这些数值只属于该配置。[作者的实验报告](https://lists.infradead.org/pipermail/linux-nvme/2023-December/043933.html) |
| SSD 厂商披露的带电容 PLP 设计 | Exascend 白皮书图 3 的 2 TB 示例将 DRAM 写缓冲最大使用量列为 **小于 8 MB**、所需回写时间 **6 ms**、电容维持时间 **40 ms**。图 4 单独给出供电切换波形。 | 这是厂商公布的设计参数。它解释盘内如何在外部失电后继续工作，但不能推算 Samsung 980 有同样的电容或时间，也没有给出它的 NAND 写入轨迹。[Exascend 图 3–4](https://exascend.com/wp-content/uploads/dlm_uploads/2024/08/Exascend-PLP-White-Paper_Rev3.1_20240823.pdf#page=6) |

## 同一份记录如何定位到故障阶段

沿时间轴找出最后一个有直接证据的成功事件。对每个现象，下面给出应该在已有材料中核对的下一个字段。这样能在保留证据空白的同时，把问题缩小到一段可解释的行为。

| 已经看见的现象 | 优先核对什么 | 能缩小到哪一层 |
|---|---|---|
| 台式机开机信号有效，SSD 毫无响应 | 明确插槽侧供电、PERST# 和参考时钟架构。传统多轨 ATX 的 PS_ON# 与 PWR_OK 来自电源系统，与 M.2 端子之间仍有主板配电或稳压环节。常见共同时钟参考约 100 MHz。 | 只有 PSU 侧信息时，盘端是否有效仍待定。已有盘端电压及复位后，才有依据继续看链路训练。[Intel 台式机供电设计指南](https://www.intel.com/content/dam/www/public/us/en/documents/design-guides/resellers-power-supply-design-guide-changes.pdf) · [参考时钟架构](https://software-dl.ti.com/mcu-plus-sdk/esd/AM243X/09_02_01_05/exports/docs/api_guide_am243x/EXAMPLES_DRIVERS_PCIE_ENUMERATE_EP.html) |
| 可以看到 TS1/TS2，但一直未出现成功配置读 | 看双向训练是否到 L0、是否反复进入 Recovery、链路层是否可传事务。若有配置读请求，再看 Completion Status、重试、超时及分析点。 | 可将链路无法训练与端点尚未完成配置响应区分开。Root Port 的配置重试可见性是另一项能力。[链路训练与升速示例](https://cdn.teledynelecroy.com/files/appnotes/debugging-pcie-dynamic-link-behaviors.pdf) · [Intel 对配置重试可见性的说明](https://www.intel.com/content/dam/doc/datasheet/7500-chipset-datasheet.pdf) |
| Class Code 和 BAR 已读到，但 `CC.EN=1` 后未见 `RDY=1` | 检查写入的 BAR 和 CC，管理队列地址、页大小、`CSTS.CFS`、读完成状态以及对应版本的 CAP/CRTO 等待条件。排除 `0xFFFFFFFF` 或解码中断。 | PCI 枚举已成功，调查范围落在寄存器访问、控制器初始化或状态观察缺口。[NVMe 初始化和寄存器定义][init] |
| 有成功 Identify Controller，系统仍然找不到启动卷 | 依次查活动 NSID、Identify Namespace、LBA 格式、建 I/O 队列结果、目标 namespace 上首个成功 Read，再查 ESP/启动项与 OS 驱动。 | 管理通路已工作。可以分辨 namespace 或块 I/O 问题，以及分区、文件系统或加载器问题。[控制器初始化][init] · [UEFI 启动管理器](https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html) |
| 关机日志出现正常 SHN，之后只看到链路消失 | 查看最后一次成功的 CSTS 读、其 PCIe Completion、抓包过滤及结束位置、PERST# 和盘端电压。 | 仅这一项能确认请求已发出。收到就绪、超时继续、失去链路或记录提前结束，都需要额外证据区分。[控制器关停][shutdown] · [微软的超时继续行为][stornvme] |
| 有 SQ Tail 更新却未见对应 CQE | 核对队列地址和本次 CID 的使用范围，沿 MRd/CplD 查 SSD 是否取到 SQE、是否发生数据 DMA，随后查 CQ 地址处的写和链路错误。另核对 CMB、门铃缓冲和轮询设置。 | 可以定位到取命令、搬数据或观察完成项三个环节，并识别抓包中原本不可见的主存动作。[传输模型][transport-io] · [PCIe AER][pci-aer] |
| OS 报正常关机，SMART 掉电计数仍增加 | 匹配设备身份、规范版本、两次采样的区间及同时段其他供电事件。按现有记录核对 SHN、SHST、后续复位或再使能，以及适用时的带外介质访问。 | 两个快照能确认区间内有增量。将增量定位到某一次关机的哪个环节，还需要该次事件记录。[1.4c 计数][old-health] · [2.1 计数][health] · [关停状态变化][shutdown] |
| 电源恢复后能挂载，但有人报告最近的文件丢了 | 找对应的写缓存状态、成功 Write/FUA、覆盖这些写的 Flush 及应用提交边界，再看是否还有后来对同一 LBA 的覆盖写。 | 可以把“设备重新可用”和“某一笔已承诺的写是否仍在”分别判断。读回数据要有预期值。[Linux 写回控制][writeback] · [NVM Write.FUA][fua] |

**寄存器译码算例。** 假设对一块普通控制器读到 `CC=0x00460001`，随后完整写入 `0x00464001`。前后 `EN=1`，`(CC >> 14) & 3` 由 0 变成 1，因而这是正常关停通知。如果两次成功的 CSTS 读分别为 `0x00000005` 和 `0x00000009`，则 `(CSTS >> 2) & 3` 从 1 变成 2，`RDY` 在两次读中均为 1。按 Base 2.1，第二个值的 `ST`（bit 6）为 0，报告了控制器级关停完成。算例中的数值只用于演示位域。即便真有这一组总线包，仍要有后续的电压时间戳，才能算出从完成到主电越限的裕量。[CC 与 CSTS 定义][cc] · [关停范围与可断电条件][shutdown]

## 附录 A　从现成材料能看见什么

仅有系统日志时可以定位最后一次成功的驱动操作。多一份从枚举前开始的 PCIe 记录，才能往前核对训练和配置、往后追踪门铃及 DMA。与总线同源或经过时钟校准的电源波形，才能给出最后一次有效寄存器读到主电跌落的物理时间。若链路启用了 PCIe IDE，受保护流量的载荷能否解码还取决于记录点和可用明文。[PCI-SIG IDE 定义][ide]、[M.2 探测手册][interposer]、[跨仪器时间关联][scope-correlation]

| 现成材料或测点 | 最适合回答的问题 | 证据的边界 |
|---|---|---|
| 盘端示波器、电源/电流记录、复位和时钟边带 | 主电何时过门限，复位何时释放/断言，REFCLK 何时有效，有无短时跌落和保持时间。 | 带宽、采样率、探头位置和阈值须随数据保留。电流变化可以提示设备活动，具体 NAND 页编程和 FTL 映射更新还需盘内证据。[M.2 探测手册][interposer]、[Micron 内部保护举例][plp] |
| 板载 Root Port 调试或 PCIe 分析仪与适配插槽的 interposer | TS1/TS2、重训、速率/宽度、配置读写、MMIO、DMA 与 CQE，适配器若接出边带还可联看 PERST#/CLKREQ#。 | 保存双向流、协商速率、过滤器、预触发深度、丢包/覆盖区和加密状态。链路两侧或中间有 switch/retimer 时标明分析点。若使用独立时钟或跨仪器时基，先用同一可见边沿关联并报告误差。[PCI-SIG 链路分析][ltssm]、[M.2 interposer][interposer]、[厂商跨仪器案例][scope-correlation] |
| UEFI 输出、Linux 内核或 Windows ETW/WPA | 发起动作的驱动、启动阶段、请求及软件所见完成、磁盘重试和错误。 | 驱动开始前和记录器关闭后的区间属于空白。软件跟踪点记录的是调用时刻。已有 ETL、串口或 journal 的最后一行不能替代盘端切电时刻。[UEFI 接管][uefi-exit]、[WPR On/Off][wpr]、[Linux tracepoint 定义][linux-trace] |
| SSD 标准日志、厂家遥测、带外 NVMe-MI | 识别能力、健康计数、固件报告的异常及有限的历史事件。 | 日志粒度、持久性和采样作用域随设备变化。普通协议分析只能观察 SSD 对外接口，盘内 PLP 保持、FTL 重建和每一次 NAND program/erase 需要对应型号的遥测或厂商证据。[健康日志][health]、[NVM Express 规范目录][versions]、[厂商 PLP 说明][plp] |

**Windows 资料的读法。** WPR/WPA 的 On/Off 跟踪分 Boot、Shutdown、RebootCycle、FastStartup、Hibernate 等场景。将已有 ETL 按磁盘号、设备实例、驱动、时间区间与磁盘 I/O 和电源事件关联。StorPort/StorNVMe、Kernel-PnP、Kernel-Power、Disk、WHEA 的可用事件取决于系统版本和录制配置。129 表示存储路径发生超时复位，153 表示 I/O 重试，157 表示系统报告盘意外消失，Kernel-Power 41 在下次启动表明上次关机异常。只有带原值的寄存器或总线记录才能直接证明 SHN/SHST。支持的 NVMe 路径可通过 `IOCTL_STORAGE_QUERY_PROPERTY` 读取 Identify、Get Features 和日志。VMD、虚拟盘或厂商 miniport 另记来源。[WPR 场景][wpr]、[Storport 事件][stor-events]、[Windows 存储事件][win-errors]、[事件 41][win-41]、[Windows NVMe 查询][win-query]

**Linux 资料的读法。** 有持久日志时，`journalctl -k -b -1 -o short-monotonic` 与 `journalctl -k -b 0 -o short-monotonic` 可分开查看前次与本次内核消息，`journalctl --list-boots` 核对 boot ID。既有的 `lspci -t`、`lspci -nnvv -s <BDF>` 对照根端口、驱动、LnkCap/LnkSta、PM、MSI-X、AER。`nvme list`、`id-ctrl`、`id-ns`、`smart-log`、`error-log`、`show-regs` 所见的通常是采样时状态。启动期 ftrace 可区分 `nvme:nvme_setup_cmd`、`nvme:nvme_complete_rq`、块层 issue/complete，按现场内核的 `available_events` 核对支持。PCIe AER 是总线错误报告，NVMe Asynchronous Event Request 是管理命令，两者在日志中都可能被简称 AER。掉电会丢失普通内存环形缓冲，末段需已保存的独立记录支持。[systemd journalctl][journal]、[Linux boot-time tracing][boottrace]、[NVMe tracepoint 源码][linux-trace]、[PCIe AER][pci-aer]、[nvme-cli 文档][nvmecli]

## 附录 B　跨来源记录与验收

对已有测试资料，先把 **G3 冷启动、S5 开关机、热重启、S4/快速启动、S3/S0 低功耗、单盘 RTD3、强制切主电** 列为不同记录组，再标出启动盘/数据盘、空闲/有写负载、写缓存与 PLP 配置、是否存在在途 I/O。只比较初始条件相符的样本。若数据来自多次运行，按场景给出有效样本数、失败数、延迟范围及分布，单条记录保留为个案。[系统状态][acpi]、[写缓存][flush]、[设备保护范围][plp]

| 记录项 | 建议保留内容 |
|---|---|
| 标识 | 来源 URL、记录编号、日期、PC 与固件、OS/驱动/构建号、盘型号/序号或匿名稳定标识、SSD 固件与 VS、PCIe 拓扑/BDF、NSID/NGUID 或 EUI-64（若提供）、LBA 格式、启动盘身份。 |
| 单事件 | 启动轮次、时钟域、时间/误差、方向、层次、来源包号/示波器游标/日志行、原始寄存器值或 QID/CID/NSID/SLBA、译码、状态、所支持的结论。示波器、协议仪、UEFI 和 OS 的零点分别注明，别把不同启动的单调时钟直接相减。 |
| 上电时间段 | 依次记录主电到达规定范围、PERST# 释放、链路可用、首个成功配置读。分别计算 EN 上升至首次读到 RDY=1、管理队列可用至 Identify 完成、首个业务 Read 提交至成功 CQE 的间隔。电气和协议时基对齐后才跨层计算。 |
| 下电时间段 | 分别记录最后一批受保证写入及同步完成至 SHN 写、SHN 写至最后一次未完成或首次完成读回、首次读到可断电状态至主电跌破设备有效范围的间隔。没有寄存器读回或端点波形时留空。 |
| 恢复与数据 | 重枚举的身份/速率/宽度、RDY 时间、识别的 namespace 和容量、介质/错误日志及计数差，已承诺持久化且未被覆盖的数据读回校验、未决写的实际结果、文件系统或应用恢复情况。 |

验收至少分别回答四件事。**设备可用性**由同一块盘和 namespace 的实际成功 I/O 证实。**协议关停**由正确版本的 SHN、SHST 和可用时的 ST 证实。**供电顺序**由同一时基或已校正时基上的盘端电压与协议记录证实。**数据完整性**由已知持久化范围的复电读回证实。每项独立写成“已有直接记录”“依据实现或规范推断”“资料不足”或“与预期冲突”。其中任何一项未获证实，其余项目仍可给出结论。[NVMe 初始化][init]、[NVMe 关停][shutdown]、[传输完成][transport-io]、[持久化语义][flush]

[versions]: https://nvmexpress.org/specification/nvm-express-base-specification/
[init]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=124
[ready]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=130
[regs]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=73
[cc]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=80
[csts]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=82
[rtd3]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=322
[health]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=233
[shutdown]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=133
[subshutdown]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=135
[flush]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=485
[stride]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=76
[prp]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=173
[dbbuf]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.1-2024.08.05-Ratified.pdf#page=445
[old-down]: https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4c-2021.06.28-Ratified.pdf#page=300
[old-health]: https://nvmexpress.org/wp-content/uploads/NVM-Express-1_4c-2021.06.28-Ratified.pdf#page=123
[transport]: https://nvmexpress.org/wp-content/uploads/NVM-Express-PCI-Express-Transport-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=9
[ide]: https://pcisig.com/PCI%20Express/ECN/Base/IntegrityandDataEncryption
[transport-queue]: https://nvmexpress.org/wp-content/uploads/NVM-Express-PCI-Express-Transport-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=11
[reset]: https://nvmexpress.org/wp-content/uploads/NVM-Express-PCI-Express-Transport-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=11
[transport-io]: https://nvmexpress.org/wp-content/uploads/NVM-Express-PCI-Express-Transport-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=12
[pci-cfg]: https://nvmexpress.org/wp-content/uploads/NVM-Express-PCI-Express-Transport-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=16
[fua]: https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=54
[atomic]: https://nvmexpress.org/wp-content/uploads/NVM-Express-NVM-Command-Set-Specification-Revision-1.1-2024.08.05-Ratified.pdf#page=14
[acpi]: https://uefi.org/specs/ACPI/6.6/02_Definition_of_Terms.html
[uefi-media]: https://uefi.org/specs/UEFI/2.10/13_Protocols_Media_Access.html
[uefi-exit]: https://uefi.org/specs/UEFI/2.10/07_Services_Boot_Services.html#efi-boot-services-exitbootservices
[uefi-pci]: https://uefi.org/specs/UEFI/2.10/14_Protocols_PCI_Bus_Support.html
[edk-init]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressHci.c#L723-L941
[edk-ns]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpress.c#L89-L142
[edk-read]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressBlockIo.c#L43-L70
[edk-submit]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressPassthru.c#L728-L828
[edk-done]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressPassthru.c#L863-L883
[linux-admin]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c#L1761-L1815
[linux-enable]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/core.c#L2455-L2532
[linux-setup]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c#L2789-L2815
[linux-entry]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c#L3201-L3206
[linux-del]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c#L2494-L2498
[linux-stop]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c#L2637-L2668
[linux-shn]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/core.c#L2402-L2451
[linux-default]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/core.c#L54-L60
[linux-timeout]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/core.c#L3343-L3355
[linux-trace]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/trace.h#L47-L123
[vmd]: https://www.intel.com/content/dam/support/us/en/documents/memory-and-storage/Linux-Intel-VROC-TPS-335893.pdf
[perst]: https://pcisig.com/PCIExpress/ECN/M.2/Power-uprequirementsforPCIesidebandsPERST_etc.
[cem-reset]: https://docs.amd.com/r/en-US/pg054-7series-pcie/Configuration-Access-Specification-Requirements
[ltssm]: https://pcisig.com/sites/default/files/files/02_01_Troubleshooting_PCI_Express_Link_Training_and_Protocol_Issues_FROZEN.pdf
[link-status]: https://docs.amd.com/r/en-US/am028-versal-gen2-register-reference/VF7_PF3_PCIE_CAP_VF_LINK_CONTROL_LINK_STATUS_REG-MMI_PCIE_CTRL_USP-Register
[interposer]: https://cdn.teledynelecroy.com/files/manuals/pciegen4x4m2mkeyinterposercrosssyncphyquickstart.pdf
[scope-correlation]: https://cdn.teledynelecroy.com/files/appnotes/measuring-pcie-l1-substate-timing.pdf
[flit]: https://pcisig.com/what-flit-mode-and-why-did-pci-sig-move-unit-data-exchange
[aspm]: https://pcisig.com/blog/making-most-pcie%C2%AE-low-power-features
[turnoff]: https://pcisig.com/section-5323-following-error-scenario-valid-rc-sends-pmeturnoff-message-ep-ep-doesnt-respond-ack-due
[dsm]: https://pcisig.com/PCIFirmware/ECN/Firmware/DSMAdditionsforRuntimeDevicePowerManagement
[pcie-read]: https://docs.amd.com/r/en-US/pg054-7series-pcie/Memory-and-I/O-Read-TLP-Processing
[plp]: https://www.micron.com/content/dam/micron/global/public/products/technical-marketing-brief/client-vs-enterprise-performance-use-cases-tech-brief.pdf
[spdk-io]: https://spdk.io/doc/nvme_spec.html
[spdk-queue]: https://spdk.io/doc/nvme.html
[dma]: https://docs.kernel.org/core-api/dma-api-howto.html
[pci-pm]: https://docs.kernel.org/power/pci.html
[writeback]: https://docs.kernel.org/block/writeback_cache_control.html
[pci-aer]: https://docs.kernel.org/PCI/pcieaer-howto.html
[boottrace]: https://docs.kernel.org/trace/boottime-trace.html
[journal]: https://www.freedesktop.org/software/systemd/man/259/journalctl.html
[nvmecli]: https://github.com/linux-nvme/nvme-cli/tree/v2.11/Documentation
[s5]: https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/system-shutdown-state-s5
[win-power]: https://learn.microsoft.com/en-us/windows/win32/power/system-power-states
[stornvme]: https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/power-management-for-storage-hardware-devices-nvme#shutdownhibernate
[wpr]: https://learn.microsoft.com/en-us/windows-hardware/test/wpt/recording-onoff-transitions
[stor-events]: https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/storport-event-log-extensions
[win-errors]: https://learn.microsoft.com/en-us/troubleshoot/windows-server/backup-and-storage/troubleshoot-data-corruption-and-disk-errors
[win-41]: https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/event-id-41-restart
[win-flush]: https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers
[win-query]: https://learn.microsoft.com/en-us/windows/win32/fileio/working-with-nvme-devices
[win-health]: https://learn.microsoft.com/en-us/windows/win32/api/nvme/ns-nvme-nvme_health_info_log
[fw-guard]: https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/resources/key-usage-in-integrated-firmware-images.html
[pi-sec]: https://uefi.org/specs/PI/1.8/V1_Security_SEC_Phase_Information.html
[pi-stages]: https://uefi.org/specs/PI/1.8/V2_Overview.html
[fw-boot]: https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html
[fw-secure]: https://uefi.org/specs/UEFI/2.11/32_Secure_Boot_and_Driver_Signing.html
[tcg-pfp]: https://medias.cdn.trustedcomputinggroup.org/production/TCG_PC_Client_Platform_Firmware_Profile_Version_1_06_Revision_52_pub_3_1184065dfc.pdf
[fw-measure]: https://tianocore-docs.github.io/edk2-TrustedBootChain/release-1.00/3_TCG_Trusted_Boot_Chain_in_EDKII.html
[edk-boot-ctrl]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressHci.c#L723
[win-tpm]: https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/how-windows-uses-the-tpm
[bitlocker-faq]: https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/faq
[bitlocker-policy]: https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/configure
[luks-init]: https://cryptsetup-team.pages.debian.net/cryptsetup/README.initramfs.html
[luks-dm]: https://docs.kernel.org/admin-guide/device-mapper/dm-crypt.html
[grub-crypt]: https://www.gnu.org/software/grub/manual/grub/html_node/cryptomount.html
[opal-spec]: https://medias.cdn.trustedcomputinggroup.org/production/TCG_Storage_Opal_SSC_v2p02_r1p0_pub24jan2022_db77e4750a.pdf
[edk-opal]: https://github.com/tianocore/edk2/blob/edk2-stable202411/SecurityPkg/Tcg/Opal/OpalPassword/OpalDriver.c#L2907
[edk-sec-cap]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpress.c#L275
[edk-sec-opcode]: https://github.com/tianocore/edk2/blob/edk2-stable202411/MdeModulePkg/Bus/Pci/NvmExpressDxe/NvmExpressBlockIo.c#L1626
[nvme-security-ops]: https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/stornvme-command-set-support
[lenovo-passwords]: https://download.lenovo.com/pccbbs/pubs/t14_p14s_t15_p15s_gen2/ug/html_en/en/Password_types.html
[pcie-ide-security]: https://pcisig.com/PCI%20Express/ECN/Base/IntegrityandDataEncryption
[t14-luks-time]: https://bbs.archlinux.org/viewtopic.php?id=309678
[case-debian-security]: https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=1035665
[samsung-980-security]: https://www.samsung.com/us/business/support/owners/product/980-ssd-500gb/
[acer-cbmem]: https://events.canonical.com/event/89/contributions/496/attachments/226/400/Building%20and%20Flashing%20Chrome%20OS%20AP%20Firmware_%20A%20Hands-On%20Dive%20into%20Coreboot.pdf#page=23
[acer-platform]: https://www.chromium.org/chromium-os/developer-information-for-chrome-os-devices/
[cbmem-clock]: https://doc.coreboot.org/lib/timestamp.html
[win-efi-path]: https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/bcd-system-store-settings-for-uefi
[ubuntu-efi-chain]: https://documentation.ubuntu.com/security/security-features/platform-protections/secure-boot/
[sanblaze-opal]: https://23c7f89b-a3b3-4170-9c31-4f67e748726f.filesusr.com/ugd/9865d6_d5835e6f8316491ea15df702fe668ab5.pdf#page=9
[cryptsetup-close]: https://man7.org/linux/man-pages/man8/cryptsetup-close.8.html
[crypttab-shutdown]: https://www.freedesktop.org/software/systemd/man/latest/crypttab.html#x-initrd.attach
[systemd-poweroff-src]: https://www.freedesktop.org/software/systemd/man/latest/systemd-shutdown.html
[dmcrypt-dtr]: https://github.com/torvalds/linux/blob/v6.12/drivers/md/dm-crypt.c#L2783-L2834
[tpm-kernel-down]: https://github.com/torvalds/linux/blob/v6.12/drivers/char/tpm/tpm-chip.c#L277-L310
[bitlocker-powerkeys]: https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/countermeasures
[bitlocker-lock-data]: https://learn.microsoft.com/en-us/powershell/module/bitlocker/lock-bitlocker
[opal-lock-linux]: https://github.com/torvalds/linux/blob/v6.12/block/sed-opal.c#L2155-L2198
[siis-reset]: https://trustedcomputinggroup.org/wp-content/uploads/TCG-Storage-Interface-Interactions-Specification-SIIS_V1.0_R20_pub.pdf#page=49
[opal-230]: https://trustedcomputinggroup.org/wp-content/uploads/TCG-Storage-Opal-SSC-v2.30_pub.pdf#page=88
[ocp-perst-lock]: https://www.opencompute.org/documents/datacenter-nvme-ssd-specification-v2-7-final-pdf-1/
[intel-pm-off]: https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/700-series-chipset-family-platform-controller-hub-datasheet-volume-1-of/002/005/pci-express-power-management/
[dell-7610-luks]: https://discussion.fedoraproject.org/t/why-might-sd-sync-hang-during-shutdown/71885
