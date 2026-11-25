# Samsung 990 PRO 2 TB 的器件、裸板背面与 M.2 装配尺寸

本页的实物基准是 KitGuru 的 2022 年 9 月裸盘，标签同时写有 `MZ-V9P2T0`、`MZVL72T0HDLB` 和 `2TB`。三星为该型号规定 M.2 2280、2 GB LPDDR4、TLC V-NAND，裸盘最大外形为 80 × 22 × 2.3 mm。板上坐标沿用项目约定，`x=0` 为金手指插入边，`x=80` 为固定端，`0≤y≤22`，从元件面向下俯视。器件中心与外形投影的读图误差约为 0.2–0.6 mm。后文的连接器、承柱和螺钉是为展示这块卡的插合关系选择的宿主零件。[三星 2022 规格书第 3–4 页][sam-spec] · [KitGuru 的原盘标签][kg-label] · [原板坐标与测量说明](board-evidence.md)

## 实物上的主控、DRAM 与供电器件

| 器件和中心坐标（mm） | 照片与原厂资料支持的内容 |
| --- | --- |
| 主控 `(14.65, 11.04)` | 封装刻有 `S4LV008`、`PASCAL`、`ARM`。可辨认顶面镀镍、一个较大的削角和附近的圆形定位标志。两块样品的其他行分别出现 `H2225`、`H2307`，应随样品保留。三星确认镀镍用于散热。[近摄一][oc-ctrl] · [近摄二][tp-ctrl] · [三星发布资料][sam-thermal] |
| DRAM `(29.74, 16.50)` | TechPowerUp 的独立特写清楚显示分行顶印 `K4F6E6S` / `4HMBGCJ`。The Overclock Page 的 2 TB 样品也可读到相同的器件标识，其文章给出完整料号 `K4F6E6S4HM-BGCJ`。KitGuru 样品可见相同分行格式。容量、类型可由三星 SSD 规格独立核对，点状定位标志位于长边一角。[TechPowerUp DRAM 微距][tp-dram] · [The Overclock Page DRAM 微距][oc-dram] · [拆解正文 DRAM 段][oc-page] · [三星第 3 页][sam-spec] |
| NAND `(53.53, 11.21)`、`(69.42, 11.19)` | 两颗大封装同面装配。两家作者的微距都可读 `K9DVGY8J5D`、`DCK0`。同一器件标识旁的 `SEC` 及批次字符会随样品变化。[KitGuru 整板][kg-front] · [The Overclock Page 微距][oc-flash] · [TechPowerUp 微距][tp-flash] |
| 供电区中央方块 `(36.21, 8.26)` | 照片给出约 5.5 × 5.7 mm 的轮廓。拆解作者将它置于主 PMIC 位置。其近摄能辨认黑色顶面和外围器件，KitGuru 照片中也可见很淡的顶印；目前没有足以对应订货号的完整顶印、芯片资料或该板电路图。可标为“供电管理 IC，具体型号待核”。[KitGuru 整板][kg-front] · [供电区微距][oc-pwr] · [拆解的 P.M.I.C./VRM 段][oc-page] |

**四个 TI TPS22990 负载开关可以在 KitGuru 板上逐个定位。** 其原图为 2048 × 855 像素。保留整图方向、在各封装范围线性提高暗部对比度，可辨出同样的首行 `RB990`、其下的 TI 追溯字符和每侧五个焊端。旁侧的一对还有另一位作者的近摄。TI 的封装标记表把 `RB990` 对应到 TPS22990，把 `RB990N` 对应到另一型号 TPS22990N；多种卷带数量共享同一首行标记。下表中的编号是项目中的观察编号。[KitGuru 原始照片][kg-front] · [两颗相邻开关的原始近摄][oc-pwr] · [TI 封装标记表，第 27 页][ti-mark]

| 观察编号 | 中心 `(x, y)` mm | 3 mm 封装长轴 | 图上两排端子的方位 |
| --- | --- | --- | --- |
| `T_B_ic_01` | `(38.62, 19.47)` | 沿 Y | 左右各五个 |
| `T_B_ic_02` | `(42.83, 19.50)` | 沿 Y | 左右各五个 |
| `T_B_ic_03` | `(23.55, 10.25)` | 沿 X | 上下各五个 |
| `T_B_ic_04` | `(25.24, 4.17)` | 沿 X | 上下各五个 |

TI 的 DML0010A 图给出本体 3.0 ± 0.1 × 2.0 ± 0.1 mm，最大高度 0.8 mm，底面有十个端子及 2.6 ± 0.1 × 1.1 ± 0.1 mm 的裸露热焊盘。**中央热焊盘接 VIN**。1 脚为上升时间控制 CT，2 脚 NC，3 脚 VIN，4 脚 VBIAS，5 脚 ON，6 脚 GND，7 脚 PG，8–10 脚 VOUT。这样可以解释开关如何接通电源和控制上升速度。四颗分别接通哪一路电源、实际电压和时序，需要该板原理图或实测。[TI 引脚表，第 3 页][ti-pins] · [TI DML0010A，第 31 页][ti-dml]

供电区近摄可区分灰黑本体、两端金属封头的较大片件，以及米色本体的多组小片件。拆解作者确认这一带包含电感、电容和电阻。`(30.22, 9.94)`、`(30.26, 7.43)`、`(30.36, 5.02)` 三处灰色件可按磁性器件外形重建，紧邻的米色小件按片式陶瓷电容外形重建。个别两端件的外形也可能与铁氧体磁珠等重合，准确型号、感量或容值及各自所在电源网络仍待确认。TI 推荐在自身 VIN 引脚旁用陶瓷电容旁路到地，这为“局部去耦”提供功能解释，无法据此给照片中每颗电容指派网络。[供电区微距][oc-pwr] · [作者的供电段][oc-page] · [TI 第 3 页 VIN 说明][ti-pins]

主控靠金手指一端的下方，`(9.90, 2.29)` 可见约 1.8 × 1.3 mm 的浅色金属盖小封装。连着标签的原照也能从侧边看见它及短顶印。可保留金属盖、圆角和基座；仅凭这些画面不足以区分无源石英谐振器、有源振荡器或其他金属盖器件，也无法确定振荡频率。PCIe 公共参考时钟的差分对另有独立的卡边引脚定义。[KitGuru 有标图][kg-label] · [KitGuru 去标图][kg-front] · [项目的主机时钟与卡边引脚说明](pcie-link-evidence.md)

## 去贴背面、板料号与热流

TechPowerUp 给同一台 2 TB 裸盘拍摄了四张可互相对应的照片。带标正面能核对容量和型号，带标背面显示监管标签与白色 `SAMSUNG SSD`，揭开背贴后的背面仍保留该白色字样、尾部的固定半环与两列五个镀孔。原先被标签覆盖的中段露出了连续黑色阻焊，照片中没有可辨认的 NAND、DRAM 或离散器件封装。KitGuru 的样品保留了背贴；两组资料共同支持单面布件，前一组提供看见贴下表面的依据。照片的照明和分辨率不足以提取阻焊下的完整布线和微孔表。[同台 2 TB 带标正面][tp-label] · [带标背面][tp-back-label] · [去标正面][tp-front] · [去标背面][tp-bare] · [KitGuru 背面][kg-back]

KitGuru 样品的标签写明 `2022.09`、`MZVL72T0HDLB`、`MZ-V9P2T0`。另一张实物照片能同时读到 `2025.04`、`MZVL72T0HFLB`、`MZ-V9P2T0`、`2TB`。同一个销售型号确有不同内部产品料号。两张照片的接口、尾部半孔和角上的镀孔组仍可对应。后一期样品的正贴遮挡主要封装，这两张标签不足以判定 PCB 走线修订、后期 NAND 丝印及内部芯片的具体代数。[2022 年样品原图][kg-label] · [2025 年样品原图][flb-label] · [同一 2025 年样品的背面照片][flb-back]

三星明确说明主控带镍涂层，背面的标签用于扩散热量。2 TB 拆解的作者在背面监管标识下辨认出薄铜片。按 KitGuru 反面投影，背标约覆盖 `x=27.5…72.9`、`y=1.5…19.9`，覆盖了部分 DRAM 和 NAND 对应的板背区域，主控中心 `x≈14.65` 位于覆盖范围外。热流示意可画主控经封装顶面向外散热，以及器件经安装面、PCB 向背部含铜标签传热并沿其表面扩散。后一条是依据接触关系得到的传热解释。实物中的热阻、热流占比、板内各层铜厚和胶层厚度需要另测。裸盘配件中没有上下夹壳，其在三星手册中的爆炸图属于另售散热片版本。[三星对镀镍与背部热扩散标签的说明][sam-thermal-back] · [2 TB 拆解的铜片说明][tc-page] · [KitGuru 背面原图][kg-back] · [三星两种外形对照，第 2 页][sam-brochure]

## 宿主插座与主板焊盘

机械参考选用 TE Connectivity **1-2199119-5**。它是直角 SMT、M 键、3.2 mm 高度等级的 67 位置插座。TE 资料列出黑色玻纤增强 LCP 外壳、一排 34 片上簧、一排 33 片下簧、两片不锈钢固定焊片和外壳自带的两个定位柱。接触簧片为铜合金，接触区的金层下限为 0.381 µm。TE 当前产品页列有 G 修订结构图和 Rev C 的 STEP 客户查看模型；下表标出的图号、视图与尺寸复算使用能逐页核对的 **C-2199119 Rev F** 及 TE 应用规范 Rev C。这里核验的是静态装配几何。[TE 产品与 CAD 下载入口][te-pn] · [TE 结构图第 1 页][te-1] · [TE 应用规范第 1–2 页，图 1][te-app]

下表用主板焊接表面为 `z=0`、水平到位的 SSD 插入边为 `x=0`、插口朝 `+x`。`REF` 表示图纸给出的参考尺寸。点与点的距离均按标注基准换算。

| 几何关系 | 数值或构造（mm） | 尺寸的依据 |
| --- | --- | --- |
| 壳体宽度与槽宽 | 壳体沿 Y 宽 `21.90 ± 0.10`。可插卡槽沿 Y 宽 `20.15 ± 0.05`；对名义 19.85 的卡边，横向总余量约 0.30。 | [TE 第 1 页正视图][te-1] · [ACES 推荐卡图第 13 页][aces] |
| 壳体进深与实际插入深度 | 塑壳总深 `7.75`。以落座卡前缘为零，定位柱轴线 `x=+1.75`；下方最前的导入唇到轴线 `2.50`，所以该唇 `x=+4.25`，后壳 `x=−3.50`。完全插入时，从这条导入唇量到卡前缘为 **4.25**。上方入口、键舌端以及焊尾各有自己的位置。 | [TE 第 1 页剖 A–A 与右视图][te-1] · [TE 安装规范第 6 页，图 6.1–6.3][te-install] |
| 含尾总长 | 以同一定位轴为起点，远端和近端焊尾分别距轴 `5.85 REF` 与 `2.85 REF`，因此金属总包络约 `x=−4.10…+4.60`，合计 `8.70`。 | [TE 第 1 页剖 A–A][te-1] |
| Z 方向 | 外壳最大高 `3.20`，系列表给出名义 `3.10`。剖 A–A 标注卡底至主板 `1.48 REF`、槽中心 `1.94 REF`、该方向开口 `0.92 REF`。本装配另用承柱把 0.80 厚卡的底面放在 `z=1.50`，顶面为 `2.30`。这样实际卡中心为 `1.90`。 | [TE 第 1 页][te-1] · [TE 系列尺寸定义第 5 页][te-guide] · [JAE 承柱图][jae] |
| M 键与触点 | 键筋宽 `1.10 REF`，M 键相对中心线偏距 `6.125`，本坐标为 `y=17.125`。标准卡槽宽 `1.20`、槽底圆角约 `R0.60`。针号 59–66 处留键；同面金属触点节距 `0.50`，两面行横向错开 `0.25`。 | [TE 第 1 页][te-1] · [TE 第 2 页 M 键表][te-2] · [TE 第 3 页][te-3] · [ACES 卡图第 13 页][aces] |
| 34 个奇数上簧及焊尾 | 上簧接触 SSD 正面，焊尾向 `−x` 出壳。首个卡边触指在 `y=1.75`。主板铜焊盘为沿 x `1.55 ± 0.03`、沿 y `0.30 ± 0.03`；奇数排焊盘的 x 范围 `−4.30…−2.75`。 | [TE 第 1 页剖视与底视][te-1] · [TE 第 3 页 SMT 布局][te-3] |
| 33 个偶数下簧及焊尾 | 下簧接触 SSD 背面，焊尾向 `+x` 出壳。首个卡边触指在 `y=2.00`，主板焊盘尺寸同上，偶数排焊盘的 x 范围 `+3.25…+4.80`。金属焊尾本身的横宽 `0.15 ± 0.02`，焊前共面度 `0.10` 最大。 | [TE 第 1 页][te-1] · [TE 第 3 页][te-3] |
| 外壳定位柱与主板钻孔 | 两柱轴 `x=1.75`。靠 1 脚的小柱 `y=1.00`、`Ø0.80 ± 0.05`，钻孔 `Ø1.10 ± 0.05`。靠 75 脚的大柱 `y=21.00`、`Ø1.45 ± 0.05`，钻孔 `Ø1.60 ± 0.05`。两柱中心距 20，下伸 `0.65 REF`。 | [TE 第 1 页][te-1] · [TE 第 3 页][te-3] |
| 两片固定焊片 | 钢片单独焊接到主板。铜焊盘中心 `x=−2.75`、`y=0.65` 或 `21.35`，尺寸沿 x `2.75 ± 0.03`、沿 y `1.20 ± 0.03`。固定片焊盘和定位柱钻孔是四个各自独立的结构。 | [TE 第 3 页与局部 B][te-3] · [TE 装配爆炸图第 1 页][te-app] |

簧片的接触凸点、弹性梁和 SMT 尾可建成同一条连续有厚度的金属实体。按剖 A–A 的标注比例读图，空载上簧最低点约在 `x≈0.9`，下簧最高点约在 `x≈1.9`；它们各自落入板上相应金手指的纵向范围。建装好卡的剖面时，应让上、下凸点分别落在卡的顶、底接触面，弯曲段在壳体腔内有让位空间。凸点位置是剖面读图近似值，接触力、接触斑面积、连续曲面与冲压料厚仍以零件数据为准。安装示意可按 TE 给出的 `25° ± 5°` 插到导向斜面，再压平直到卡边贴到座面。[TE 结构图第 1 页剖 A–A][te-1] · [TE 安装规范第 6 页][te-install] · [E-tec 卡图第 2 页][etec]

## 2280 固定端的有肩柱与螺钉

选用 JAE **SM3ZS067U310-NUT1** 的肩柱外形，卷带订货号 **SM3ZS067U310-NUT1-R1800**。JAE 推荐图专为其 SM3 插座配套，本例将有尺寸依据的柱与上述 TE 插座组合成教学装配。JAE 图上的两定位孔轴线，距 80 mm 卡的尾柱轴线 **78.25 ± 0.10 mm**，与上文的 `x=1.75`、尾柱 `(80,11)` 相合。[JAE SJ116266 Rev 2，表 1、表 2 和主板图][jae] · [JAE 系列选型资料][jae-series]

| 零件 | 可以直接建模的截面或位置（mm） |
| --- | --- |
| 柱身与定心颈 | 镀锡黄铜，内通螺纹 `M2 × 0.4`。承托柱身 `Ø4.50 ± 0.10`，名义高度 `1.45 ± 0.03`。上颈 `Ø3.00 ± 0.03`、高 `0.65 ± 0.03`，进入卡尾 `Ø3.50` 的半圆切口。给本例选 `0.05` 焊接层后，柱承面 `z=1.50`，颈顶 `z=2.15`，比卡顶低 `0.15`。[JAE 外形][jae] · [ACES 卡尾尺寸][aces] |
| 入板端及焊盘 | 入板端 `Ø2.50 ± 0.05`、长 `0.70 ± 0.05`，主板的中心通孔 `Ø2.60 ± 0.03`。四段弧形 land 外半径 `2.50 ± 0.05`、内半径 `1.50 ± 0.05`，十字隔缝各 `0.30 ± 0.05`。基板应为入板端与螺杆留出孔内空间。[JAE 详图 A][jae] |
| 压卡螺钉 | PCI Express M.2 Rev 1.1 图 87 的十字薄头螺钉使用 `M2 × 0.4`，头径 `4.80 ± 0.15`、头高 `1.10 ± 0.10`、图示杆长 `2.50 +0/−0.20`。螺头底面在 `z=2.30` 压住卡顶半环，配 Ø3.50 半孔时，名义径向压边为 `(4.80−3.50)/2=0.65`。使用图示杆长时，名义杆尖到 `z=−0.20`，仍在柱下端的贯通孔内。该规范将这种螺钉与有肩柱配用。[PCI-SIG Rev 1.1，第 97 页，图 87][m2-screw] · [JAE 通牙结构][jae] |

TE 在产品页提供 STEP 压缩包 `ENG_CVM_CVM_1-2199119-5_C.3d_stp.zip`，可用于对照外壳与安装尺寸。本项目根据图纸重新建模，弹片和卡边是可分别点选的实体。[TE STEP 下载入口][te-step] · [TE 产品页 CAD Files][te-pn]

[sam-spec]: https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf#page=3
[kg-front]: https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg
[kg-label]: https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveFront.jpg
[kg-back]: https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveRear.jpg
[tp-ctrl]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/controller.jpg
[tp-dram]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/dram.jpg
[tp-flash]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/flash.jpg
[tp-label]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/drive1.jpg
[tp-back-label]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/drive2.jpg
[tp-front]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/pcb1.jpg
[tp-bare]: https://tpucdn.com/review/samsung-990-pro-2-tb/images/pcb2.jpg
[oc-ctrl]: https://theoverclockingpage.com/wp-content/uploads/2023/06/SSD-Samsung-990-Pro-2TB-Controlador.jpg
[oc-dram]: https://theoverclockingpage.com/wp-content/uploads/2023/06/SSD-Samsung-990-Pro-2TB-DRAM.jpg
[oc-flash]: https://theoverclockingpage.com/wp-content/uploads/2023/06/SSD-Samsung-990-Pro-2TB-NAND.jpg
[oc-pwr]: https://theoverclockingpage.com/wp-content/uploads/2023/06/SSD-Samsung-990-Pro-2TB-PMIC.jpg
[oc-page]: https://theoverclockingpage.com/2023/06/07/review-samsung-990-pro-2tb-um-dos-ssds-4-0-mais-rapidos-do-planeta/
[ti-mark]: https://www.ti.com/lit/ds/symlink/tps22990.pdf#page=27
[ti-pins]: https://www.ti.com/lit/ds/symlink/tps22990.pdf#page=3
[ti-dml]: https://www.ti.com/lit/ds/symlink/tps22990.pdf#page=31
[flb-label]: https://westalliswi.paymore.com/cdn/shop/files/179495271605624cvyjt.jpg?v=1794953081&width=1946
[flb-back]: https://westalliswi.paymore.com/cdn/shop/files/1794952726398yir4tbk.jpg?v=1794953081&width=1946
[sam-thermal]: https://semiconductor.samsung.com/news-events/news/samsung-electronics-unveils-high-performance-990-pro-ssd-optimized-for-gaming-and-creative-applications/
[sam-thermal-back]: https://news.samsung.com/us/samsung-adds-4tb-capacity-to-990-pro-series/
[tc-page]: https://www.tech-critter.com/samsung-990-pro-2tb-review/
[sam-brochure]: https://download.semiconductor.samsung.com/resources/brochure/990_PRO_Series_Brouchure_Web_Version_1.0_230509.pdf#page=2
[te-pn]: https://www.te.com/en/product-1-2199119-5.html
[te-1]: https://cdn.promelec.ru/upload/items/2022/05/18/ENG_CD_2199119_F.pdf#page=1
[te-2]: https://cdn.promelec.ru/upload/items/2022/05/18/ENG_CD_2199119_F.pdf#page=2
[te-3]: https://cdn.promelec.ru/upload/items/2022/05/18/ENG_CD_2199119_F.pdf#page=3
[te-guide]: https://www.te.com/commerce/DocumentDelivery/DDEController?Action=srchrtrv&DocFormat=pdf&DocLang=English&DocNm=1-1773702-1NGFFQRG-EN&DocType=Data+Sheet&PartCntxt=1-2199119-5#page=5
[te-app]: https://www.te.com/commerce/DocumentDelivery/DDEController?Action=srchrtrv&DocFormat=pdf&DocLang=English&DocNm=114-115006&DocType=Specification+Or+Standard&PartCntxt=1-2199119-5#page=1
[te-install]: https://www.te.com/commerce/DocumentDelivery/DDEController?Action=srchrtrv&DocFormat=pdf&DocLang=English&DocNm=114-115006&DocType=Specification+Or+Standard&PartCntxt=1-2199119-5#page=6
[te-step]: https://www.te.com/commerce/DocumentDelivery/DDEController?Action=srchrtrv&DocFormat=3d_stp.zip&DocLang=English&DocNm=CVM_1-2199119-5&DocType=Customer+View+Model&PartCntxt=1-2199119-5
[aces]: https://www.acesconn.com/upload/product_file/SPEC-51765-075xx-xxx%20rev-A.pdf#page=13
[etec]: https://www.e-tec.com/v5/documents/pdfs/pcb-interconnect-products/mpe-075-remr9-95.pdf#page=2
[jae]: https://www.infinity-semiconductor.com/datasheet/5e-SM3ZS067U310-NUT1-R1800.pdf#page=1
[jae-series]: https://www.ttieurope.com/content/dam/tti-europe/manufacturers/jae/resources/jae_sm3_datasheet_specifications.pdf
[m2-screw]: https://attychen.github.io/Download/circuit-design/%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83/%E5%90%84%E7%B1%BB%E9%80%9A%E4%BF%A1%E4%B8%8E%E6%8E%A5%E5%8F%A3%E5%8D%8F%E8%AE%AE%E6%A0%87%E5%87%86/PCI_Express_M.2_Specification_Rev1.1.pdf#page=97
