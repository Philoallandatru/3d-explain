# Samsung 990 PRO 2 TB 装板模型与资料

## Framework Desktop（AMD Ryzen AI Max 300 系列）

整板装配首选这款标准 Mini-ITX 桌面主板。正面主槽和背面副槽均为 M.2 2280 M-key、NVMe PCIe 4.0 ×4，与当前模型对应的 990 PRO 2 TB 裸盘规格匹配。原厂安装指南拍到了正面热扩散片、插入角度和螺丝固定方式。[Framework Desktop 规格](https://frame.work/products/desktop-mainboard-amd-ai-max300?v=FRAMBM0006) · [正面 SSD 安装指南](https://guides.frame.work/Guide/Primary%2BStorage/502) · [背面 SSD 安装指南](https://guides.frame.work/Guide/Secondary%2BStorage/504) · [三星裸盘规格](https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf)

原厂 `FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp` 为 73.0 MB 整板装配文件。实测导入后可分别选中 PCB、正面 Deren 和背面 LOTES 的 M.2 插座实体、两套 SSD 热扩散片与支柱。正背面都带 80 × 22 mm 的 `SN740_2280` 参考盘几何。机械图首页标明两路 M-key 插座的高度为 5.5 mm 和 4.0 mm，并列出备选料号。公开分发 GLB 或改编版时应注明 Framework Computer Inc、来源、CC BY 4.0 许可证和改动。[官方 STEP](https://github.com/FrameworkComputer/Framework-Desktop/blob/75ee2c4395f34d5d98c56f81f4930fe44aed41d0/Mainboard/FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp) · [官方机械图](https://github.com/FrameworkComputer/Framework-Desktop/blob/75ee2c4395f34d5d98c56f81f4930fe44aed41d0/Mainboard/FRAMEWORK_DESKTOP_MAIN_PCB_V0.pdf) · [仓库许可](https://github.com/FrameworkComputer/Framework-Desktop#license) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

「整机读写」载入已对位的正面主槽装配，可以切换热扩散片并沿各段播放。16 页接口原理图的第 1 页可核对通道，第 2 页可核对供电，第 5 页给出 `JSSD1`、`JSSD2` 的差分对、3.3 V、参考时钟、复位和唤醒信号。Deren 正面主槽对应 `JSSD1`。蓝色为图纸针位映射，橙色为根端口到插槽及逻辑内存路径的推演。真实铜线层、过孔位置和走线长度需要对应的 PCB 版图或实物证据。[整机 4 KiB 读](view.html#system/read) · [官方接口原理图](https://github.com/FrameworkComputer/Framework-Desktop/blob/75ee2c4395f34d5d98c56f81f4930fe44aed41d0/Mainboard/Mainboard_Interfaces_Schematic_Framework_Desktop_Ryzen_AI_Max.pdf) · [安装照片](https://guides.frame.work/Guide/Primary%2BStorage/502)

正面主槽的对位预览以官方参考盘为基准。STEP 世界坐标的插入端为 X = −34.75 mm，尾部固定轴为 X = −114.75 mm，SSD 的 PCB 底面为 Y = 14.80 mm，卡宽沿 Z = 148.43–170.43 mm。用这些基准替换参考盘并隐藏主槽热扩散片。预览展示机械位置，热扩散片闭合余量和导热垫压缩量仍待验证。[基准来自原厂 STEP](https://github.com/FrameworkComputer/Framework-Desktop/blob/75ee2c4395f34d5d98c56f81f4930fe44aed41d0/Mainboard/FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp)

重新生成时，将原厂 `FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp` 下载到本机，在本目录执行以下命令。转换会核对经过对位验证的源文件版本，输出与 SSD 同坐标的 `framework-desktop.glb`。

```powershell
uv run --python 3.11 framework_host.py "C:/path/to/FRAMEWORK_DESKTOP_MAIN_PCB_V01.stp"
uv run --python 3.11 build_model.py --viewer-only
```

## Framework Laptop 13

官方仓库根目录的 Classic 和 Pro 两个 STEP 是机壳与外部模块 CAD。`Mainboard/2D` 提供主板外形、禁布区及连接器位置的 PDF/DXF，`OpenSCAD` 与 `Printable Case` 提供托盘、外壳的 3D 文件。官方资料以 CC BY 4.0 发布，可用于重建主板外形和安装环境。[原厂仓库](https://github.com/FrameworkComputer/Framework-Laptop-13) · [原厂主板文件目录](https://github.com/FrameworkComputer/Framework-Laptop-13/tree/9680262347b80efe2314673bf1f26eb955165fca/Mainboard)

第 11 代 Intel Core 版使用 M.2 2280 NVMe PCIe Gen4 ×4，第 8 页画出了 M-key 存储口。Ryzen 7040 版的接口图第 1 页也明确标注 2280 和 Gen4 ×4，第 8 页给出插座电路。可直接据图核对主板端接口。作者 whatthefilament 另提供第 11 代主板的 STEP/STL 参考模型，仓库标注 GPL-3.0，可结合官方图纸与安装实拍检查装配位置。[原厂 2280 规格](https://frame.work/blog/storage-memory-and-wifi) · [第 11 代接口图](https://github.com/FrameworkComputer/Framework-Laptop-13/blob/9680262347b80efe2314673bf1f26eb955165fca/Mainboard/Mainboard_Interfaces_Schematic_11th_Gen.pdf) · [Ryzen 7040 接口图](https://github.com/FrameworkComputer/Framework-Laptop-13/blob/9680262347b80efe2314673bf1f26eb955165fca/Mainboard/Mainboard_Interfaces_Schematic_7040_Series.pdf) · [第三方模型及许可](https://github.com/whatthefilament/Framework-Motherboard-Reference-CAD/tree/7cbf8f3360d62879245dea9bdfe90c2defdb9e82) · [第 11 代安装实拍](https://guides.frame.work/Guide/Framework%2BLaptop%2B13%2B%2811th%2BGen%2Band%2B12th%2BGen%2BIntel%2BCore%29%2BDIY%2BEdition%2BQuick%2BStart%2BGuide/57?permalink=1)

## MNT Reform Next

如果要剥开主板看真实设计的铜层，可用这块开源笔记本主板。正面是 M-key 2280 插槽，接到处理器模块时最多四条 PCIe 通道。官方手册列出的 RCORE 和 Quasar 使用 PCIe 3.0 控制器。主板包有原理图、六铜层 PCB 设计、叠层、布线、过孔以及一批器件 STEP。硬件源文件采用 CERN-OHL-S 2.0。[原厂硬件手册](https://mntre.com/documentation/reform-next-handbook/hardware.html) · [原厂设计文件入口](https://mntre.com/documentation/reform-next-handbook/schematics.html) · [主板源文件](https://source.mnt.re/reform/reform-next/-/tree/9ca0a7289e377ba889578608bddc60b289c135c7/nref-motherboard) · [仓库许可](https://source.mnt.re/reform/reform-next/-/blob/9ca0a7289e377ba889578608bddc60b289c135c7/README.md#license)

已从 PCB 文件核对正面插座 J21。Lane 0 的 #41/#43 对应主板接收端 `PCIE1_RX_N/P`，#47/#49 对应主板发送端 `PCIE1_TX_N/P`。这四根线均有正反面线段和换层过孔。可以按每个网络名导出铜段，保留原始坐标并继续追到处理器模块插座。通用部件外形可由封装所引用的模型生成。[核对过的 KiCad PCB 文件](https://source.mnt.re/reform/reform-next/-/blob/9ca0a7289e377ba889578608bddc60b289c135c7/nref-motherboard/nref-motherboard.kicad_pcb) · [KiCad 3D 导出参数](https://docs.kicad.org/master/en/cli/cli.html#pcb-step-export)

## 990 PRO 接下来的建模范围

- **装配与动画。** 在 Framework 的主槽按插座和固定柱对位。把现有的 4 KiB 动画向主机延伸，画出 SSD 从提交队列取命令，以及读数据经 PCIe 穿过主板插座写入主机缓冲区，完成项单独写入完成队列。官方机械几何、接口图确认的连接和推演走线各有来源标签。[现有上机装配](view.html#mount/socket) · [现有读数据回传](view.html#stack/read/8/end) · [NVMe over PCIe 传输规范](https://nvmexpress.org/wp-content/uploads/NVMe-over-PCIe-Transport-Specification-1_0-2021.06.02-Ratified-1.pdf)
- **继续精细化 SSD。** 现有模型已有供电器件、电感电容、BGA 示意和背标铜箔。可优先用同板号微距图补丝印和焊点，用 X 光核对封装下方焊球或可辨的过孔，用实板截面核对铜层和孔壁。若需要看运行差异，可同步采集持续写入时的 SMART 温度和外部测温，再对照装上与取下热扩散片时的表现。[器件与装配证据](mechanical-detail-evidence.md) · [现有 SSD 叠层依据](layer-stack-evidence.md)
