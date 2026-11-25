# Samsung 990 PRO 2 TB 的 M.2 引脚与 PCIe 链路

**以主机为观察点，Lane 0 的发送对是 47− / 49+，接收对是 41− / 43+。** 因而写入 SSD 的用户数据经前一对及另外三条 Lane 的同向线进入 SSD，读取的用户数据经后一对及另外三条 Lane 的同向线返回主机。一次读或写还会在相反方向传送请求或协议应答。三星给这款 M.2 2280 裸盘标出的接口是 PCIe 4.0 ×4、NVMe 2.0。[三星 990 PRO 数据表第 3 页][samsung] · [NVIDIA 载板 J11 引脚表，印刷第 15 页][jetson-pins] · [NVMe over PCIe 1.0 §3.4.1，图 8][nvme]

## 同一对触点的两个名字

PCI-SIG 的 M.2 规范有两张表。Rev 4.0 v1.0 表 5-8 第 222 页按**主机插座**命名，表 3-29 第 174 页按 **SSD 插卡**命名。两表使用同一个物理脚号。平台的 PET 是平台发送，模块的 PET 是模块发送。下表采用连接器规定的极性，n 为负，p 为正。[PCI-SIG M.2 Rev 4.0 v1.0][m2] · [研华 M-key SSD 模块引脚表第 12–13 页][advantech] · [Wilder Gen4 主机测试适配器表 5，第 18 页][wilder-host]

| 连接器 Lane | 主机 TX → SSD RX 的触点（n / p） | 名称（平台 / 模块） | SSD TX → 主机 RX 的触点（n / p） | 名称（平台 / 模块） |
| --- | --- | --- | --- | --- |
| 0 | 47 / 49 | PET0 / PER0 | 41 / 43 | PER0 / PET0 |
| 1 | 35 / 37 | PET1 / PER1 | 29 / 31 | PER1 / PET1 |
| 2 | 23 / 25 | PET2 / PER2 | 17 / 19 | PER2 / PET2 |
| 3 | 11 / 13 | PET3 / PER3 | 5 / 7 | PER3 / PET3 |

可以沿一张实际电路图检查 Lane 0。NVIDIA P3768-A04 载板的 J11 将主机网络 `PCIE0_TX0_N` 经 C120 接到 47，`PCIE0_TX0_P` 经 C116 接到 49。43 和 41 分别连回 `PCIE0_RX0_P` 和 `PCIE0_RX0_N`。载板规格表注明 Output 指向 M.2 模块，Input 来自模块。另一端可查 Wilder 表 4，41/43 的测试口标作 *Device Test Transmitter*，47/49 标作 *Device Test Receiver*。[NVIDIA 原理图第 21 页，J11][jetson-schematic] · [NVIDIA 表 2-7，第 14–15 页][jetson-pins] · [Wilder 表 4，第 15 页][wilder-device]

SATA-IO 的 M-key 共用引脚表也把 41/43 的说明写作 *Host receiver*，把 47/49 写作 *Host transmitter*，并将 PCIe 模式的定义指向 PCI-SIG。查 PCIe 极性时使用该行的 PER/PET 名称，同一行里的 SATA A/B 名称只适用于该接口的 SATA 接法。[SATA-IO TP 053 v11，§12 表 4 第二部分，PDF 第 23 页][sata-pinout]

这些引脚有固定的信号方向。PCIe 的每条 Lane 含两个单向差分对，所以 ×4 有八对、十六根数据导体，可以同时双向传输。接收器测量同一对内 p 与 n 的电压差。PCB 设计可以在允许的位置对调一对内的 p/n，由接收器在训练中识别极性。板内的实际走线和主控球位仍需该板电气图确认。[PCI-SIG Base 4.0 §1.2、§4.2.5.2][base] · [PCI-SIG M.2 §3.1.2 的极性说明][m2] · [这块 2 TB 样品的板级照片依据](board-evidence.md)

## 金手指上的供电、时钟和复位

| 触点 | 信号 | 主机和 SSD 在此处做什么 |
| --- | --- | --- |
| 2、4、12、14、16、18、70、72、74 | 3.3 V 主电源 | 主机经九个并联电源触点给模块供电。M.2 §3.3.1 说明并联可减小连接器上的压降。 |
| 9、15、27、33、39、45、51、57 等 | GND | 高频信号组之间穿插接地触点，接入双方地平面，为高频回流提供就近路径。 |
| 53 / 55 | REFCLKn / REFCLKp | 在本文的公共时钟接法中，平台给 SSD 提供一对 100 MHz 参考时钟。它有独立触点。接收器还要从收到的串行数据恢复采样时刻。 |
| 50 | PERST# | 平台拉低，使 SSD 保持硬件复位。主电源和公共参考时钟稳定、满足时序后，平台释放复位。 |
| 52 | CLKREQ# | 低有效、开漏。模块拉低可请求参考时钟。使用 L1 电源管理子状态时，平台或模块均可拉低以发起退出。释放此线允许平台按配置停钟。 |
| 59–66 | M 键缺口 | 这八个编号位置用于机械键位，两面都没有相应触点。 |

可同时核对 53/55 是奇数触点、50/52 是偶数触点。M.2 Rev 4.0 v1.0 的表 3-2、表 3-3 还区分公共时钟与可选的独立时钟架构。表 3-5 给出公共参考时钟在 PERST# 释放前至少稳定 100 µs。模型采用公共时钟的上电例，三星所列产品参数没有给出该块样品的启动波形或独立时钟能力。[PCI-SIG M.2 §3.1.3–3.1.4，表 3-2 至 3-5、图 3-2][m2] · [研华 SSD 引脚表第 13 页][advantech-sideband] · [Wilder 电源与触点分配第 15–16 页][wilder-device]

## 交流耦合和接收端

可插拔 M.2 的每个数据发送方向各自在**发端所在的一侧**交流耦合，一对内的 p、n 各有一个串联电容。以 Lane 0 为例，主机 TX 经主机侧两个电容、47/49 和卡上走线到 SSD RX。回程从 SSD TX 经模块侧两个电容、41/43 到主机 RX。照此展开，四个 SSD 发送对一共有八处串联耦合，另八处归主机发送侧。串联电容隔开两侧的直流工作点，交流差分信号继续通过。NVIDIA 图中的 C116、C120 为该载板的 0.22 µF 示例。三星样品的器件位号、容量和在板坐标尚无公开资料可供核对。[PCI-SIG M.2 附录图 6-44，第 280 页][m2] · [NVIDIA J11 交流耦合电路][jetson-schematic] · [板上可见走线及未辨认器件](board-evidence.md)

接收端以时钟与数据恢复电路（CDR）确定采样相位。通道损耗会使一个比特的波形延伸到相邻比特，从而缩小判决余量。常见 SerDes 用发送端滤波、接收端连续时间线性均衡（CTLE）和判决反馈均衡（DFE）改善接收条件。训练过程可协调发端预置或系数，接收端可调节本地均衡。这里的电路名称用于解释功能，Pascal 主控内的实际滤波器拓扑和系数未知。[Tektronix Gen4 接收器图 4，第 5 页，时钟恢复见第 3 页][tek] · [Teledyne LeCroy 链路均衡量测说明][lecroy]

## 开机怎样到达 16 GT/s

下面采用主机与 SSD 均支持 Gen4 ×4、四条 Lane 都能训练成功、由硬件自主升速的冷启动例。主机侧的下行端口和 SSD 侧的上行端口各有自己的链路训练与状态机（LTSSM）。[PCI-SIG Base 4.0 §4.2.3，第 253–255 页，§4.2.5，第 284–285 页][base] · [Teledyne LeCroy 对 8→16 GT/s 训练的说明][lecroy]

| 阶段 | 在线上或端口内能观察到什么 |
| --- | --- |
| Detect | 在 2.5 GT/s 初始设置下，发端检测对侧是否呈现接收终端。 |
| Polling | 双方在检测到终端的 Lane 上交换 TS1、TS2 训练序列，建立比特与符号锁定、识别极性。 |
| Configuration | 协商链路宽度及 Lane 编号，校正 Lane 间的到达时间差。初次进入 L0 时速率是 2.5 GT/s。 |
| Recovery 到 8 GT/s | 端口协调变速，在 Recovery.Equalization 训练每条 Lane 的收发设置，重新锁定并返回 L0。 |
| Recovery 到 16 GT/s | 在 8 GT/s L0 之后再次进入 Recovery，协商并训练 16 GT/s。达到条件后回到 16 GT/s ×4 的 L0。 |
| L0 与数据链路初始化 | L0 是物理层正常运行状态。两侧建立数据链路并初始化默认虚拟通道 VC0 的流控额度之后，常规事务包可以传输。 |

TS1/TS2 是物理层训练序列。实际协商受插槽连接的 Lane 数、双方支持的速率和通道质量影响，重新训练也可能发生在运行期间。确认一台机器的最终结果可以读 PCIe Link Status 的 Current Link Speed 和 Negotiated Link Width。恢复每一次训练经过的状态、预置变化和耗时，需要当次训练的协议或电气采集。[PCI-SIG Base 4.0 §3.2、§3.4、§4.2.6、§7.5.3.8 的 Link Status Register][base] · [Teledyne LeCroy 联合采集的方法][lecroy]

## 到达 L0 后，每条线传多少数据

Gen4 每条 Lane 每个方向是 **16 GT/s、NRZ、128b/130b**。NRZ 每次传输表示一位，单位间隔是 62.5 ps，奈奎斯特频率为 8 GHz。每个常规数据块由 2 位同步头和 128 位块载荷构成。×4 在一个方向上扣除块编码后的上限为 `16 × 4 × (128/130) ÷ 8 ≈ 7.877 GB/s`（十进制）。协议头、控制包、链路维护与设备处理还会占用带宽或时间。三星给 2 TB 裸盘列出的顺序读写最高值分别是 7,450 和 6,900 MB/s，并列出了测试系统与写缓存条件。[PCI-SIG 信令及编码速查表，第 4 页][speed] · [PCI-SIG Base 4.0 §4.2.2][base] · [三星数据表第 3 页及脚注][samsung]

一个传输方向上的四条 Lane 共同承载同一数据流。按 Base 图 4-12 的示例，逻辑 Lane 0 承载字节符号 0、4、8……，Lane 1 承载 1、5、9……，依次类推。接收端完成跨 Lane 对齐后恢复符号顺序，再解析包。来自同一逻辑块的数据字节就这样分布在四条 Lane 上。[PCI-SIG Base 4.0 §4.2.2，图 4-12 第 236 页][base]

## 一次 PCIe 事务怎样得到确认

| 机制 | 双端行为 | 以一笔事务说明 |
| --- | --- | --- |
| 流控 credit | 相邻端口在每个虚拟通道独立管理 Posted、Non-Posted、Completion 的头部和数据额度。接收侧用 InitFC1/2 建立初始额度，随后用 UpdateFC 更新。发端确认相应额度充足才发送新的 TLP。 | 用未缩放的基本额度表示，128 字节 Memory Write 消耗 1 个 Posted Header 和 8 个 Posted Data，每个数据额度为 16 字节。 |
| 序号、LCRC、Ack | 发端为事务层包（TLP）分配 12 位序号，计算 32 位链路 CRC，并保留可重发的副本。收端检查序号和 LCRC，用反向链路的数据链路层包（DLLP）累计确认。 | 收到 Ack 序号 `0x031`，该段链路的发端就可释放直到这个序号的已确认副本。 |
| Nak 与 replay | 顺序中的 TLP 损坏时，收端可调度 Nak。发端收到 Nak 或重放定时器超时，就从尚未确认的最早 TLP 起按序重传。重放沿用原来的序号和已经计入的额度。 | 若收端已连续收妥 `0x031`，期待的 `0x032` 检查失败，Nak 携带最后连续接收的 `0x031`，发端从 `0x032` 重传。 |

以上序号和 128 字节事务用于演算。Ack 证明相邻 PCIe 节点收到了包，NVMe 完成则由控制器写入完成队列项（CQE）报告。以主机内存中的队列为例，主机写 SQ 尾门铃走主机 TX，控制器取提交队列项先从 SSD TX 发 Memory Read，主机用自己的 TX 发回带数据的 Completion。NVMe Read 的用户数据由 SSD 用 Memory Write 推送到主机，NVMe Write 则由 SSD 发 Memory Read 拉取主机缓冲区，用户数据随主机的 Completion with Data 返回。两种命令结束时，控制器均可通过 SSD TX 写入 CQE。[PCI-SIG Base 4.0 §2.2、§2.6.1、§3.4–3.6，重放见第 210–211 页][base] · [Altera 数据链路层发送及重试缓冲实现][altera] · [NVMe over PCIe 1.0 §3.4.1，图 8][nvme]

3D 场景可以据此标定连接器针号、收发箭头、时钟和电容所属的一侧。板面照片可定位主控与局部可见走线。隐藏层、BGA 球位、哪一颗无源件连接到哪一根数据线、均衡后的眼图、TLP 序号和时间戳，都需要原理图、板级测量或协议记录才能落实到这块 990 PRO 样品。[样品板级证据](board-evidence.md) · [三星产品规格][samsung]

[samsung]: https://download.semiconductor.samsung.com/resources/data-sheet/samsung_nvme_ssd_990_pro_datasheet_rev.2.0.pdf#page=3
[m2]: https://pcisig.com/PCIExpress/Specs/M.2/_4.0_1.0
[base]: https://pcisig.com/PCIExpress/Specs/Base/_4.0_1.0
[jetson-pins]: https://developer.nvidia.com/downloads/assets/embedded/secure/jetson/orin_nano/docs/jetson_orin_nano_devkit_carrier_board_specification_sp.pdf#page=19
[jetson-schematic]: https://cdck-file-uploads-global.s3.dualstack.us-west-2.amazonaws.com/nvidia/original/4X/e/4/f/e4f818c957d9553c250c863222d723bc3bb07c30.pdf#page=21
[sata-pinout]: https://sata-io.org/sites/default/files/TP_053v11_SATA31_Mdot2_Card_Format_for_SSDs.pdf#page=23
[advantech]: https://advdownload.advantech.com/productfile/Downloadfile3/1-2VEJUIE/Advantech%20SQFlash_PCIe%20NVMe%20M.2%202280_M%20Key_720-D-DS_v1.13_20241223.pdf#page=12
[advantech-sideband]: https://advdownload.advantech.com/productfile/Downloadfile3/1-2VEJUIE/Advantech%20SQFlash_PCIe%20NVMe%20M.2%202280_M%20Key_720-D-DS_v1.13_20241223.pdf#page=13
[wilder-device]: https://wildertechcmsassets.s3.amazonaws.com/system/uploads/fae/file/asset/228/910-0064-000_Rev_A_PCIe_M2_Gen-4_Socket_3_Preliminary_User_Manual_12-9-2020.pdf#page=15
[wilder-host]: https://wildertechcmsassets.s3.amazonaws.com/system/uploads/fae/file/asset/228/910-0064-000_Rev_A_PCIe_M2_Gen-4_Socket_3_Preliminary_User_Manual_12-9-2020.pdf#page=18
[speed]: https://pcisig.com/sites/default/files/2026-01/PCI-SIG%20Cabling%20Webinar_FINAL.pdf#page=4
[tek]: https://download.tek.com/document/Understanding%20Transition%20Gen4%20Enterprise%20Datacenter%20I_O%20Standards%2065W_61047.pdf#page=5
[lecroy]: https://www.teledynelecroy.com/doc/leq-response-during-training-app-note
[altera]: https://docs.altera.com/r/docs/683111/23.4/l-and-h-tile-avalon-streaming-and-single-root-i/o-virtualization-sr-iov-ip-for-pci-express-user-guide/data-link-layer
[nvme]: https://nvmexpress.org/wp-content/uploads/NVMe-over-PCIe-Transport-Specification-1_0-2021.06.02-Ratified-1.pdf#page=12
