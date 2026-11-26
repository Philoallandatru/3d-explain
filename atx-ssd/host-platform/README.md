# ATX 台式机主机侧模型

[打开硬件剖视网站](../index.html#atx) · [打开独立 ATX 查看器](view.html) · [下载整套 GLB](atx-platform.glb) · [规格、原厂图和协议出处](evidence.md) · [GPU 开源模型与推理资料](GPU-SOURCES.md)

参考配置采用 **MSI MAG B650 TOMAHAWK WIFI 标准 ATX 主板、可拆卸的 AMD Ryzen 9 7950X、DIMMA2 / DIMMB2 上的两条 16 GB DDR5 UDIMM**。三星 990 PRO 2 TB 裸盘装在处理器直连的 `M2_1`，RTX 5090 Founders Edition 装在同样由处理器直连的 `PCI_E1`。Linux 主机侧以 v6.12 NVMe PCI 驱动为例。

| 视图 | 能查看的结构与行为 |
| --- | --- |
| [主板装配](view.html#board/assembly) | 243.84 × 304.80 mm ATX 板框，AM5 插座与压框，四个 DIMM 槽，B650 芯片组，VRM 与电源输入，后置 I/O、PCIe 和三个 M.2。可翻面、展开 CPU、内存和显卡、更换视角、显隐 RTX 5090 FE 与 M2_1 散热片。 |
| [整机 4 KiB 读](view.html#board/io/read/submit) / [整机 4 KiB 写](view.html#board/io/write/submit) | 同一个整板场景中串联 CPU、DDR5 与 M2_1 的 990 PRO。18 步读、18 步写，镜头可跟随事务。Pascal 与 NAND A 剖面复用原 SSD 模型，保留在各自的封装原位。 |
| [推理回放](view.html#board/inference/offload/checkpoint) | 九步追踪 SGLang Diffusion 的 MiniMax-H3 单卡案例。从 990 PRO 把权重读到 DDR5，再拷贝到 RTX 5090。可切换显存常驻与 CPU offload，在同一时间刻度上查看读盘、拷贝和计算。 |
| [PCIe 走向](view.html#board/pcie) | 跟踪 M2_1 的四条 Lane，查看每条 Lane 的主机 Tx / Rx 两对针位。对照 CPU 直连的 M2_2、经 B650 的 M2_3，以及 M2_3 与 PCI_E2 的共享。另有 [DDR5 信号](view.html#board/ddr)。 |
| [ATX 供电](view.html#board/power/ac-in) | 在 RM1000x 剖面中分别追踪主 12 V 和 5VSB 的生成，再沿 ATX、EPS 和 12V-2x6 线束对照主板、CPU 与显卡的供电。 |
| [CPU](view.html#cpu/package) | 两颗八核 Zen 4 CCD、各自的 32 MB L3、封装基板与顶盖。放大 [I/O 裸片](view.html#cpu/io) 看 UMC、Data Fabric、根端口和 IOMMU，或进入 [单核](view.html#cpu/core) 看取指、译码、执行、MMU 和缓存。 |
| [DRAM](view.html#dram/module) | 从 288 触点 UDIMM、PMIC、SPD Hub 和两组颗粒，进入 [FBGA](view.html#dram/bga)、[16 Gb ×8 裸片](view.html#dram/die)、[Bank](view.html#dram/bank) 与 [1T1C](view.html#dram/cell)。可以改初始位，逐步看读出、写入反值和刷新。 |
| [GPU](view.html#gpu/card) | 查看 RTX 5090 FE 双贯流散热、PCIe 卡边和后部接口。在 [PCB 剖视](view.html#gpu/pcb) 查看核心板、PCIe 卡边板、视频输出板与 16 颗显存，再进入 [GB202](view.html#gpu/die) 和 [单个 SM](view.html#gpu/sm) 的功能模型。 |
| [显卡数据路径](view.html#board/gpu-link) | 在同一块主板上单步跟踪 DDR5、CPU 根端口、PCI_E1 与 GDDR7。可切换 H→D / D→H 与 256 MiB、1 GiB、4 GiB 负载。 |
| [Linux Host](view.html#host/read) | 8 步 [初始化](view.html#host/init)、12 步读和 13 步 [写](view.html#host/write)。可切换 MSI-X / 轮询，逐步检查 BAR 门铃、地址翻译、数据事务、CQE、phase 翻转与请求收尾。 |

## 由哪里追到哪里

### SGLang 单卡推理回放

点回放条的「SSD 读权重」可下钻到一笔 4 KiB NVMe 读示例，从 CPU 写 SQ 门铃开始单步。第 14 步写回数据页，第 15 步另写 CQE。返回时恢复下钻前的步骤和设定，正在播放的推理会从原步骤继续。

点「装入 GDDR7」可下钻到一次 1 GiB H→D 拷贝。依序追踪主机 DDR5、CPU 根端口、PCI_E1 和 RTX 5090 的 GDDR7，再点「返回推理」回到下钻前的步骤。

进入「主板 → 推理回放」。前三步以 1 GiB 权重块演示冷加载，先经 `M2_1` 读到主机 DDR5，再经 `PCI_E1` 送入 GDDR7。页面分开显示两段规格推算，按 990 PRO 标称顺序读 7.45 GB/s 约 **144.13 ms**，按 PCIe 4.0 ×16 编码后 31.51 GB/s 约 **34.08 ms**。两者是单段理想时间，真实加载还涉及文件布局、DMA、驱动与读写并发。[三星 990 PRO 2 TB](https://www.samsung.com/us/business/memory-storage/nvme-ssd/990-pro-pcie-4-0-nvme-ssd-2tb-sku-mz-v9p2t0b-am/) · [MSI 主槽规格](https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification) · [PCI-SIG 编码带宽](https://pcisig.com/sites/default/files/files/PCIe_Specification_Webinar_Rev%206_FINAL_0.pdf#page=4)

原机是 RTX 5090、Ryzen 9 9950X、60 GB RAM、8 GB swap 和 PCIe 5.0 的 9100 PRO。未剪枝 BF16 的 MiniMax-H3 在 864 × 480、124 帧、20 个去噪步下，两次请求实测 **112.2 s / 112.1 s**。报告另列文本编码 **4.2 s**、DiT 去噪 **5.14–5.17 s/步**、VAE 解码 **6.4 s**。这些数据标为「原机实测」。本场景使用 7950X、32 GB DDR5 和 990 PRO 展示拓扑，回放以等步节奏呈现权重位置与依赖。[固定版 SGLang 单卡实测](https://github.com/sgl-project/sglang/blob/d3bc4d8b0f63f0eee46bfa69e460073a00b04591/docs/cookbook/diffusion/MiniMax/MiniMax-H3.mdx#rtx-5090-single-card-physical-desktop)

- [第 5 步 · 显存常驻](view.html#board/inference/resident/dit-feed)查看常驻 DiT 层从 GDDR7 就地取权重。同一个权重块跨去噪步复用。原案例配置了 14 层 DiT 常驻。
- [第 5 步 · CPU offload](view.html#board/inference/offload/dit-feed)查看页锁 DDR5 命中后的 CUDA H→D 预取。原案例主机缓存覆盖 34 层 DiT，约两层每步回到 SSD 补读。执行完后，GPU 可复用缓冲槽。
- [第 7 步 · 计算与预取](view.html#board/inference/offload/dit-overlap)用绿色表示当前层 GPU 计算，琥珀色和蓝色表示下一层补读与拷贝。原机每请求读盘约 51.3 GiB 的 DiT 权重，报告计算线程等搬运约 0.9 s。文本编码器每请求读取约 46 GiB 权重，对顺序读吞吐更敏感。[SGLang 单卡实测](https://github.com/sgl-project/sglang/blob/d3bc4d8b0f63f0eee46bfa69e460073a00b04591/docs/cookbook/diffusion/MiniMax/MiniMax-H3.mdx#rtx-5090-single-card-physical-desktop) · [拷贝流、等待事件与释放](https://github.com/sgl-project/sglang/blob/d3bc4d8b0f63f0eee46bfa69e460073a00b04591/python/sglang/multimodal_gen/runtime/managers/memory_managers/layerwise_offload.py#L2218-L2350)

「DiT 预取与计算」时间轴在同一毫秒尺度上对齐 SSD 读盘、PCIe 拷贝和 GPU 计算。图示假定当前层开算时预取一个 1 GiB 权重块，补读时先读完整块，再做 H→D。实色搬运与当前层计算重叠，斜纹搬运落在 GPU 等待区间。每层计算设为 150 ms 时，SSD 补读约 144.13 ms 全被覆盖，PCIe 的约 34.08 ms 里仍有 28.21 ms 挡住下一层。此时切到 DDR5 命中或显存常驻，等待为 0 ms。时间轴下方的「原机实测」保留 SGLang 公布的单步与每请求统计。

### RTX 5090 FE 与主机之间的数据路径

装配视图按同一毫米尺度绘制 243.84 × 304.8 mm 的 PCB 与 304 × 137 × 40 mm 的公版卡。卡长沿 PCB 的 243.84 mm 短边方向延伸，装配模型中的卡尾伸出 PCB 约 54.5 mm。点「俯视」可用毫米比例尺对照。推理与显卡路径的剖视用细线标出同尺度外廓。[MSI 原厂规格](https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification) · [NVIDIA 公版尺寸](https://www.nvidia.com/en-us/geforce/news/gfecnt/20246/small-form-factor-sff-ready/)

显卡外壳以标称 **304 × 137 × 40 mm** 建模，按 PCI_E1 卡边对位装到主板。打开 GPU 可看外壳、散热鳍片与双风扇，也可进入 PCB 剖视查看 32 GB GDDR7、GB202 和两块接口子板。板形、内部互连和卡边触点使用近似几何。组件位置和机箱净空可用实物复核。[NVIDIA 标称尺寸](https://www.nvidia.com/en-us/geforce/news/gfecnt/20246/small-form-factor-sff-ready/) · [NVIDIA 公版设计](https://www.nvidia.com/en-us/geforce/news/rtx-50-series-graphics-cards-gpu-laptop-announcements/) · [GPU 资料与可复用网格](GPU-SOURCES.md)

显卡接口支持 PCIe 5.0 ×16，B650 TOMAHAWK 的 CPU 直连主槽支持 PCIe 4.0 ×16。取编码后每方向理论上限 **31.51 GB/s**，1 GiB 的一次拷贝仅 PCIe 段的理想下限为 **34.08 ms**。若 GPU 从本地 GDDR7 顺序读取同样的字节量，以标称 **1,792 GB/s** 计算约 **0.60 ms**。前者可用于理解 CPU offload 的搬运预算，后者对应显存工作集的读取下限。实际时间还取决于协议、缓存命中、访问方式和调度。[MSI 主槽规格](https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/Specification) · [PCI-SIG 编码带宽表](https://pcisig.com/sites/default/files/files/PCIe_Specification_Webinar_Rev%206_FINAL_0.pdf#page=4) · [Blackwell 白皮书](https://images.nvidia.com/aem-dam/Solutions/geforce/blackwell/nvidia-rtx-blackwell-gpu-architecture.pdf#page=13) · [CUDA 搬运指南](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#data-transfer-between-host-and-device)

### 在一块板上跑通整机读写

进入「主板 → 整机读写」，选择读或写，点播放或用 ‹ / › 单步。「跟随镜头」可切换是否自动聚焦，「整板全景」可随时拉回。A2/B2 旁的三块标签分别代表 SQ、4 KiB 数据页和 CQ 的逻辑地址。绿色标数据，蓝色标 CQE，琥珀色标命令与设备动作，紫色标完成通知。所选 Lane 仅用来定位一组 PCIe 物理针位，链路仍按 ×4 模拟。PCB 隐藏走线和芯片内部取原理模型，地址分布与播放时间取演示值。

| 单步位置 | 读 4 KiB | 写 4 KiB |
| --- | --- | --- |
| CPU 发布命令 | [CPU 写 SQ Tail 门铃](view.html#board/io/read/doorbell)，随后 SSD 发 `MRd` 取 SQE，主机回 `CplD`。 | [CPU 写 SQ Tail 门铃](view.html#board/io/write/doorbell)，`SQ[3]` 的 Write 命令里带 FUA。 |
| 设备处理 | [读页命令和行地址](view.html#board/io/read/nand-command) → [位线感测](view.html#board/io/read/sense) → [页缓冲](view.html#board/io/read/page) → [Pascal ECC](view.html#board/io/read/ecc)。 | [SSD 请求写负载](view.html#board/io/write/data-mrd) → [主机回 CplD](view.html#board/io/write/data-cpl) → [装载页缓冲](view.html#board/io/write/nand-load) → [编程](view.html#board/io/write/program) → [验证](view.html#board/io/write/verify)。 |
| 主机内存与完成队列 | [第 14 步写入数据页](view.html#board/io/read/data-mwr)，此时 CQ[3] 仍是旧项。[第 15 步另写 16 B CQE](view.html#board/io/read/cqe)。 | [满足 FUA 持久条件](view.html#board/io/write/media)，再 [写入 CQE](view.html#board/io/write/cqe)。 |
| 通知与归还槽位 | [中断或轮询](view.html#board/io/read/irq)后，主机消费 CQE 并把 CQ Head 写回门铃。 | 同样从 [CQE](view.html#board/io/write/cqe)走到 [CQ Head 门铃](view.html#board/io/write/cq-db)。 |

[SSD 的原位剖视与 NAND 事务依据](../../ssd-model/io-path-evidence.md) · [NVMe over PCIe 规范](https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/)

### 分开查看主板和逻辑 Host

在主板的 PCIe 视图选 Lane 0。M-key 的 #47− / #49+ 接在主机发送方向，#41− / #43+ 接在 SSD 发送方向。Gen4 ×4 每方向编码后约 7.877 GB/s，事务和链路开销会进一步占用带宽。图中八对走线、DDR5 线束和供电路径为原理绘制。勾选「隐藏推演走线」可保留已核对的针位标记。四条 Lane 同属一条链路，单条高亮用于定位针位。[MSI 插槽规格](https://download.msi.com/archive/mnu_exe/mb/MAGB650TOMAHAWKWIFI.pdf#page=18) · [M.2 模块针位表](https://advdownload.advantech.com/productfile/Downloadfile3/1-2VEJUIE/Advantech%20SQFlash_PCIe%20NVMe%20M.2%202280_M%20Key_720-D-DS_v1.13_20241223.pdf#page=12)

在 Host 的读流程，CPU 写 64 B SQE 和 SQ Tail 门铃，SSD 发出 `MRd` 取 SQE，主机以 `CplD` 返回。SSD 读出数据后通过 posted `MWr` 把 4 KiB 送入主机内存域，另写 16 B CQE。写流程依靠 `MRd` / `CplD` 传送写入负载，示例启用 FUA。读写都以 512 B 逻辑块为例，`NLB=7` 表示 8 块，4 KiB 对齐的页由 `PRP1` 指向。四槽队列从索引 3 环回，CQE phase 从本次的 1 切到下一圈期待的 0。实际硬件的 BDF、队列深度、地址、映射和分包需要读取或测量。[NVMe 传输规范](https://nvmexpress.org/specification/nvme-over-pcie-transport-specification/) · [Linux 驱动](https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/pci.c)

Host 中的 VA、PA、IOVA 分别表示 CPU 虚拟地址、主机物理地址和启用重映射时的设备虚拟地址。队列使用一致性 DMA 内存，数据页按命令方向建映射。设备事务进入主机内存一致性域，后续由缓存、IOD 与内存控制器提供可见性和访问。可从 Host 跳到 M2_1，再从 SSD 模型继续查看 Pascal 主控、ECC 和 NAND。[Linux DMA API](https://docs.kernel.org/core-api/dma-api-howto.html) · [原盘读写剖视](../../ssd-model/view.html#stack/read/6)

DRAM 的例子以每条 1Rx8、两个 ×32 子通道组织。两条以 5200 MT/s 训练时，理论合计带宽为 83.2 GB/s。单 bank 时序按 Ramulator 的 `DDR5_5200B` 演算，显示 ACT 到列命令、读写突发和 PRE 的约束，浏览器播放使用观察节奏。1T1C 分荷示意取 `Cbitline = 10 × Ccell`，以 `VDD` 归一化，示例电容保持 0 或 1 时，预充 0.5 的位线分别变为约 0.455 或 0.545。实物训练速率、二级时序、地址交织和电气参数取决于实际平台。[Kingston 模组数据表](https://www.kingston.com/datasheets/KVR52U42BS8-16.pdf) · [Ramulator 2.1 DDR5 源数据](https://github.com/CMU-SAFARI/ramulator2/blob/7bead6cb7c4b03e095c6d4769ae3181a8e0bf6da/python/ramulator/dram/ddr5.py) · [DRAM 电路与感测论文](https://pdl.cmu.edu/PDL-FTP/NVM/TLDRAM-Lee.pdf)

### 从交流输入追到各路负载

「主板 → 供电」可播放或单步走完 17 步。默认随回放打开外壳，亦可在「PSU 外壳」固定为剖开或合上。参考电源为 2024 款 Corsair RM1000x CP-9020271，外壳宽 150 × 高 86 × 深 160 mm，配 140 mm 风扇。点击「装配外观」可在整机中看合盖后的电源、主板和显卡。「整板装配」的「显示电源与线束」也可独立开启。[Corsair 尺寸和线缆规格](https://www.corsair.com/eu/en/p/psu/cp-9020271-eu/rmx-series-rm1000x-fully-modular-power-supply-eu-cp-9020271-eu) · [剖面和模块面板实拍](https://www.profesionalreview.com/2024/09/10/corsair-rm1000x-atx3-1-review/)

[交流输入](view.html#board/power/ac-in)经 EMI 滤波进入两条支路。[待机反激](view.html#board/power/standby-convert)先产生 5VSB，经 ATX 线束 #9 供主板待机逻辑。主板经 #16 拉低 PS_ON# 后，主路依次显示[整流与 PFC](view.html#board/power/pfc)、[半桥 LLC](view.html#board/power/llc)和[次级同步整流](view.html#board/power/sync-12)。主 12 V 还给次级 5 V / 3.3 V 降压级供电。主轨就绪后，PSU 经 #8 送回 PWR_OK。交流有效时，关机后仍保留 5VSB。[Cybenetics 拆解台账](https://www.cybenetics.com/evaluations/psus/2396/) · [Intel 24-pin 针位](https://edc.intel.com/content/www/us/en/design/ipla/software-development-platforms/client/platforms/alder-lake-desktop/atx-version-3-0-multi-rail-desktop-platform-power-supply-design-guide/main-power-connector-required/)

在「整板装配」勾选「拆下 VRM 散热片」，可看 SPS、扼流电感、聚合物电容、去耦电容和 PWM 控制器。装配视图还补出了 JFP1、EZ Debug LED、风扇接头和底边插针。沿[双 EPS8](view.html#board/power/eps)看主 12 V 怎样从电源绕到主板顶部。[高侧导通](view.html#board/power/buck-on) 和 [低侧续流](view.html#board/power/buck-off) 自动露出 VRM 散热片下的器件，分别强调开关状态与电流方向。示例 Vcore 可调，单相取 500 kHz、0.22 µH、平均 20 A，右侧计算占空比、导通时间和峰峰纹波。[MSI 板图](https://download.msi.com/archive/mnu_exe/mb/MAGB650TOMAHAWKWIFI.pdf#page=28) · [MSI 14+2+1 标称分组](https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI/) · [TI 同步 Buck](https://www.ti.com/document-viewer/lit/html/SSZTCO3/GUID-292D8B9D-5297-46CB-98DA-C7099A8F41F7)

[DDR5](view.html#board/power/ddr5) 显示 5 V 经 A2/B2 送入各自 PMIC，[M.2](view.html#board/power/m2) 显示 990 PRO 的 3.3 V 接口，[显卡](view.html#board/power/gpu) 同时标出 PCI_E1 插槽供电和 PSU 直达 5090 的 12V-2x6 辅助线。电源器件的坐标取实拍区位近似，内部回路是功能模型。线束长度和弯折用于台架展示，回放时间用于观察。[Renesas UDIMM PMIC](https://www.renesas.com/en/document/sds/p8911-short-form-datasheet?r=1600131) · [Samsung 990 PRO 规格](https://www.samsung.com/us/memory-storage/nvme-ssd/990-pro-2tb-nvme-pcie-gen-4-mz-v9p2t0b-am/) · [NVIDIA 16-pin 接口](https://www.nvidia.com/content/geforce-gtx/geforce-rtx-5090-user-guide-r2.pdf)

## 在回放里看原因和后果

在供电回放条把「3.3 V 主轨」切到「欠压」，会跳到 [PWR_OK 检查](view.html#board/power/power-ok/undervoltage)。此情景保留正常的主 12 V、主 5 V 和 5VSB。3D 标出 3.3 V 检测未通过并用虚线显示 PWR_OK #8 低电平，回放停在主板的上电就绪检查。切回「已稳定」后可以进到[主板启动](view.html#board/power/boot-handoff)，看主板如何推进复位释放与固件初始化。主板后续时序为通用原理示意。[Intel ATX PWR_OK](https://edc.intel.com/content/www/us/en/design/ipla/software-development-platforms/client/platforms/alder-lake-desktop/atx-version-3-0-multi-rail-desktop-platform-power-supply-design-guide/2.01/pwr-ok-required/) · [TI 上电就绪与复位](https://www.ti.com/lit/eb/slyy168/slyy168.pdf)

右侧的「换个条件会怎样」仍可暂停回放并展开解释。在[双 EPS8](view.html#board/power/eps)改示例功率，可以对比同功率下 12 V 线束与 1.10 V 输出侧的电流。

在 [4 KiB 写回](view.html#board/io/read/data-mwr) 点「对照 CQE 写入」，可比较数据页和完成队列的变化。在 [DiT 计算与预取](view.html#board/inference/offload/dit-overlap) 切换权重来源或计算耗时，时间轴会对比「算完再搬」与「提前预取」的 GPU 等待。[NVM Express Base 规范](https://nvmexpress.org/specification/nvm-express-base-specification/) · [CUDA 传输与重叠](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html#asynchronous-and-overlapping-transfers-with-computation)

## 模型来源与精度

- **PC Anatomy，MIT。** 直接复用上游的主板、配件、DIMM、FBGA、DRAM 裸片 / Bank / 单元、Ryzen 芯粒和 I/O 裸片生成器。主板由 Tomahawk 系列供体按 B650 手册重新定位，更新了 M.2 朝向、PCIe 槽、AM5、四槽内存、B650 散热外形和板边接口。CPU 改为 Raphael 的 Zen 4 示例，UDIMM 使用拆下上游散热罩的裸条几何。版权与许可随源码和查看器附带。[固定源版本](https://github.com/Yoosseph/pc-anatomy/tree/485a649b697a3e367a611860d278d8de26304e76) · [许可证](vendor/pc-anatomy/LICENSE.txt)
- **SSD 样品与连接器。** 从现有 GLB 提取原尺寸的 990 PRO 实物场景和参考 M-key 插座，重设到 MSI 手册确认的入槽方向。主板板框按标称毫米比例绘制，器件位置为图稿近似，插座为相容参考几何，EZ M.2 Clip 外形按安装图近似。铜层、精确装配公差、真实芯片平面图和信号完整性均需另行取证。[前版物理模型](../../ssd-model/README.md) · [MSI 图纸与装配依据](evidence.md#主板与装配)
- **DRAM 与 Host。** DDR5 组织和时序参数来自 Ramulator 2.1 的 MIT 模型。Host 的软件和设备状态按 Linux v6.12、QEMU v9.2.0 与 NVMe 规范建模，播放页执行的是这些示例步骤。[开源模型和复用范围](evidence.md#可复用的开源模型)
- **RTX 5090 FE。** 外壳与三片式 PCB 依照公版资料重建。风扇复用 PC Anatomy 的轴流组件，GB202 和 SM 视图复用并适配其 MIT 方块模型。显卡数据路径演示用链路规格和数据量计算，真实推理和采集方案见资料页。[上游风扇](https://github.com/Yoosseph/pc-anatomy/blob/485a649b697a3e367a611860d278d8de26304e76/lib/parts.ts) · [上游架构模型](https://github.com/Yoosseph/pc-anatomy/blob/485a649b697a3e367a611860d278d8de26304e76/lib/gpu-architecture.ts) · [许可证](vendor/pc-anatomy/LICENSE.txt) · [推理采样资料](GPU-SOURCES.md#向推理工作负载延伸)

## 文件和重建

查看器 HTML 内置渲染代码、SSD 网格和交互状态，可直接用支持 WebGL2 的浏览器离线打开。页面「导出 GLB」保存当前视图，「整套 GLB」包含 25 个静态场景，其中有 RM1000x 合盖装配、LLC 剖视、VRM 高侧导通、整机读写及两个推理权重路径。单卡可直接取 [RTX 5090 FE GLB](rtx-5090-fe.glb)。整板、电源、单卡外观和显卡 PCB 以米作 glTF 单位，CPU、DRAM、GPU 芯片和 Host 功能模型采用各自的演示倍率。动画、选择状态和资料链接在 HTML 中。

GLB 中的触点阵列以 glTF 的 EXT_mesh_gpu_instancing 扩展保存。主板视图沿用 67 枚参考 M-key 弹片，整机读写的剖面与 SSD 装配共用安装基准。

验证覆盖 Chrome、Edge 的供电回放、4 KiB 读写、推理下钻及站内跨查看器导航。整套 GLB 校验同时检查了 PSU 合盖外廓、LLC 剖视、线束和单位。

`geometry.mjs` 组合模型，`system-scene.mjs` 在整板中定位剖面和信号路径，`system-flow.mjs` 定义整机事务，`model.mjs` 定义队列状态和 DRAM 时序。`gpu-geometry.mjs` 生成显卡外壳和板件，`gpu-profile.mjs` 保存硬件参数和带宽计算。`inference-flow.mjs` 保存固定版实测数据和回放步骤，`inference-scene.mjs` 把权重路径挂到整板坐标。`inference-timing.mjs` 计算时间轴的重叠与等待区间。`psu-geometry.mjs` 生成电源、剖视部件和线束，`power-flow.mjs` 定义状态和 Buck 参数，`power-scene.mjs` 将功能路径对齐到器件。`vendor/pc-anatomy/` 保存开源几何生成器的适配代码。构建从相邻 SSD 的 GLB 提取实物、插座和原位剖面。

```powershell
npm.cmd ci
npm.cmd run build
```
