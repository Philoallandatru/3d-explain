# 990 PRO 2 TB 的原位 PCB 逐层剖视

[打开三维叠层](view.html#stack) · [展开六层](view.html#stack/explode) · [孔壁、避空与回流](view.html#stack/vias) · [展开整条路径](view.html#stack/route) · [分层装配 STEP](990-pro-2tb-layer-stack.step)

这套叠层采用 2022 年拆解样品的板外廓、M.2 插入端及封装装配坐标。元件面朝上时，X 从接口的 0 mm 延伸到尾部的 80 mm，Y 从 0 到 22 mm，Z 以无贴标的板底为 0 mm。模型板厚取 0.80 mm。三星数据表给出了整盘包络 80 × 22 × 2.3 mm、PCIe 4.0 ×4、2 GB LPDDR4 与 TLC V-NAND。公开照片可辨认外形和部分表面金属，板内深度和各层铜图需要截面或板厂数据才能核定。[三星 2 TB 规格书](https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf#page=3) · [KitGuru 元件面实物](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg) · [同容量对照样品去贴裸背](https://tpucdn.com/review/samsung-990-pro-2-tb/images/pcb2.jpg)

| 三维颜色 | 对应证据 |
| --- | --- |
| 青绿色 | 板外形参照、主要封装的落点与可辨外观、金手指的可见金属、露铜焊盘、可辨的局部线形和尾部孔口。尺寸随照片定标误差，约为 0.2–0.6 mm。局部线形保持截断，网名未知。 |
| 蓝色 | 照片中能定位且 M.2 引脚表能给出信号名的接触片。收发方向以两端写明。 |
| 琥珀色 | 假设的铜线、焊盘、串联电容、接地铜面、孔壁和芯片功能模块。检查器可查看所属层与功能。 |
| 灰色 | 模型选用的层间介质。其几何外廓仍采用同一板形。 |

尾部两列五行孔的两面孔口可以核对。孔壁按贯穿结构画成可剥的空心金属段，在两张地参考面上给整组留有避空。原盘上这些孔是否接地、是否用于测量以及孔壁厚度，均缺少电气验证。[板面证据与坐标说明](board-evidence.md) · [样品照片、装配与器件依据](mechanical-detail-evidence.md)

## 六铜层的示范叠层

各层铜底面 Z 和层间几何厚度如下。铜厚统一取 0.020 mm。五片介质分别切出两层铜之间的间隙，薄铜层的平面内绝缘填充省略。展开时沿 Z 移动各层和对应的孔壁段，合起来时各段在同一孔轴和接合面上。原型样品的层数、叠层顺序、铜厚、材料参数与内层阻抗均未由公开资料确认。[TI 高速接口走线、参考面与回流说明](https://www.ti.com/lit/an/slla414a/slla414a.pdf#page=6)

| 铜层 | 铜底面 Z / mm | 本例功能 | 下方介质 / mm |
| --- | ---: | --- | ---: |
| L1 | 0.780 | 卡边扇入、SSD TX 串联耦合、封装示意焊盘 | 0.125 |
| L2 | 0.635 | 上接地参考面，L1 和 L3 的邻近参考面 | 0.113 |
| L3 | 0.502 | PCIe 四条 Lane 的八对数据线和独立参考时钟 | 0.204 |
| L4 | 0.278 | 两组主控到 NAND 封装的示范总线与两根边带线 | 0.113 |
| L5 | 0.145 | 下接地参考面，地孔把它接到 L2 | 0.125 |
| L6 | 0.000 | 背面触点、PERST# 和 CLKREQ# 的引入、尾部孔环 | — |

## 沿信号和返回路径检查

1. **M.2 到 L1。** Lane 0 的 #47−/#49+ 为主机 TX → SSD RX，#41−/#43+ 为 SSD TX → 主机 RX。模型在四对 SSD TX 上给每根导体串接一枚电容；连接铜在电容两端断开。主机 TX 的同类耦合在主机板上。#53/#55 是独立的差分参考时钟，#50 和 #52 在背面。模型触点沿用既有金手指尺寸，连接器规范定义的触点号与走线模型分开存储。[M.2 引脚与 PCIe 端点方向](pcie-link-evidence.md) · [NVIDIA 载板实物原理图，第 21 页](https://cdck-file-uploads-global.s3.dualstack.us-west-2.amazonaws.com/nvidia/original/4X/e/4/f/e4f818c957d9553c250c863222d723bc3bb07c30.pdf#page=21)
2. **L1 经孔到 L3。** 每根差分导体用自己的空心孔壁接表面和内层。示范孔贯穿 PCB，未用于转接的深处仍会形成残桩。圆形反焊盘从参考铜中挖空，紧邻的地孔把上下接地面连接起来。换层局部视图从同一铜面截出窗口。实板的阻抗、串扰和眼图需要电气测量或仿真参数。[TI 差分和孔避空，§4.1–4.8](https://www.ti.com/lit/an/slla414a/slla414a.pdf#page=12)
3. **Pascal 主控。** L3 到达主控的 BGA 侧示例焊盘。通过「主控」可看到 PCIe PHY、DMA、固件处理、ECC 与 NAND 控制器。高速 PCIe 串行铜对到 PHY 为止，芯片处理命令后由另一接口发起 NAND 访问。[主控板级位置](board-evidence.md) · [NVMe 事务与板内数据路径](io-path-evidence.md)
4. **L4 到 NAND。** A、B 两组分别示范 8 根 DQ、DQS 和 CE#、CLE、ALE、WE#、RE#、R/B#，从控制器示例焊盘经 L4 到两颗 NAND 下方，再返回 L1 焊盘。示例焊球从铜焊盘接到封装基板底面。DQ 可复用命令、地址和数据。读突发时由 NAND 输出数据与选通，写突发时由控制器驱动。实际闪存通道数、球图和协商速率需要更进一步的证据。[JEDEC JESD230C §2.6 表 1](https://ssd.borecraft.com/documents/JESD230C.pdf#page=9) · [闪存访问时序与证据范围](io-path-evidence.md)

浏览器的「显示封装」恢复实物外形作为空间参照。「只看实物与标准」隐藏琥珀色网络和灰色介质。「PCB 逐层剥开」与「整板原位剖视」共用板坐标，普通剥层时切换视图保留相机。CAD 中的分层装配为压合状态，按 L1–L6 组织，并在各层下细分接插件、器件、布线、介质和孔壁。可以用 CAD 的装配树逐层隐藏或移动。独立 GLB 也包含同一套分层节点，`extras.stack` 记录层号、角色和证据类别。
