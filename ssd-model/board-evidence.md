# Samsung 990 PRO 2 TB 裸盘的板级证据

本模型的板级几何来自 KitGuru 拍摄的 **2022 年 2 TB 无散热器样品**。作者拍了产品标签、揭下正面标签后的整块 PCB，以及保留背面导热贴的反面。三星的资料确认 MZ-V9P2T0 是 2 TB 版本，板型为 M.2 2280。坐标文件可单独编辑。[坐标数据](board-layout.json) · [三星裸盘规格书](https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf) · [KitGuru 拆解原文](https://www.kitguru.net/components/ssd-drives/simon-crisp/samsung-990-pro-2tb-review/2/)

## 如何从两面照片读坐标

揭下正面标签，令元件朝观察者、金手指朝左、固定半孔朝右。X 从插入边的 0 mm 增至固定端的 80 mm。Y 从照片的下边向上，名义板宽为 22 mm，元件面为 +Z。背面照片中的长短触指上下互换，所有坐标仍投影到同一个板坐标系。作者的带标正面照片将接口摆在了右手边，也要转向比对。[元件面原图，2048 × 855](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg) · [正面容量标签，2048 × 940](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveFront.jpg) · [反面原图，2048 × 940](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveRear.jpg)

两张照片各自以板长和板宽校正透视。用三处未参与校准的参照检查正反面位置，同一个接口端工艺孔的孔心相差约 **0.27 mm**，固定端工艺孔相差 **0.36 mm**，右上十个镀孔的阵列中心相差 **0.34 mm**。因此 XY 用于辨认子系统和装配位置时可按约 **0.2–0.6 mm** 的定位误差看待。这是投影复核得到的误差尺度。物料高度、PCB 内层、焊球和封装内部没有独立尺度证据，机械加工、公差叠加和电气测试需要实测或生产图。[元件面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg) · [反面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveRear.jpg)

## 能够定位的主要器件

| 器件 | 中心 X, Y（mm） | 投影外形 X × Y（mm） | 辨认依据 |
| --- | --- | --- | --- |
| Pascal 主控 | 14.65, 11.04 | 13.76 × 13.43 | 银色顶面，能读到 Samsung、S4LV008 与 PASCAL，靠近接口 |
| 2 GB LPDDR4 | 29.74, 16.50 | 13.93 × 7.71 | 长条封装，同容量微距可读 K4F6E6S / 4HMBGCJ，对应 K4F6E6S4HM-BGCJ |
| 四颗 TPS22990 | 见下方器件记录 | 3 × 2，方向随位置而异 | 原板顶印 RB990 对应 TI WSON-10 负载开关；建模按原厂名义外形，坐标表保留较早的读图宽度 |
| 电源管理区域的 IC | 36.21, 8.26 | 5.52 × 5.66 | DRAM 的右下方，周边有成组的大型储能和去耦器件；功能由位置推断，具体芯片型号未知 |
| TLC V-NAND 封装 1 | 53.53, 11.21 | 14.96 × 18.38 | 两颗竖置封装中的左颗，特写可读 K9DVGY8J5D、DCK0 |
| TLC V-NAND 封装 2 | 69.42, 11.19 | 14.66 × 18.47 | 靠近固定缺口。照片水平缩短与视角造成尺寸差异，未据此推断二者使用不同封装 |

KitGuru 正文与照片对 NAND 料号个别字符的记录有差异，模型采用照片可辨的丝印。TechPowerUp 的另一台 2 TB 样机的主控与 NAND 特写可用于交叉核对。不同批次的完整日期码各自归属于其样机。另一份 2 TB 原始拆解也描述了单面安装的两颗约 1 TB NAND 和 2 GB LPDDR4。[KitGuru 元件面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg) · [TechPowerUp 主控特写](https://www.techpowerup.com/review/samsung-990-pro-2-tb/images/controller.jpg) · [TechPowerUp NAND 特写](https://www.techpowerup.com/review/samsung-990-pro-2-tb/images/flash.jpg) · [The SSD Review 的 2 TB 实物拆解](https://www.thessdreview.com/our-reviews/nvme/samsung-990pro-gen-4-ssd-series-review-samsung-reigns-true-yet-again/)

## 可见电路、背标和未知范围

- **接口。** 从照片逐排辨认到元件面短排 5、长排 29 个金手指，底面短排 4、长排 29 个。短排位于高 Y 端。十个小铜环在固定端排列为两列五行，反面同位置可见相同阵列。模型将其表示为通孔，每个孔只建一行；光学证据可以辨认环与孔口，内壁连续性、孔壁厚度及电气用途仍待验证。[元件面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg) · [反面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveRear.jpg)
- **主控周边与供电区。** 坐标中有 101 枚可辨本体的小器件，按外观粗分电阻、电容、电感、小 IC 和金属壳体。主控上下两条密集区域另记录了 81 个反光焊锡端点。只看清端点的地方只保留端点；电容值、电阻值、位号、网络与未显露的微小本体没有逐件填写。为使模型中的元件表面不相互穿入，结合原图暗缝微调了 NAND 上边缘的六枚小件，移动量最大约 0.14 mm；两枚供电区相邻器件也按可见外形修正。[正面原图](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg)
- **表层走线。** 接口与主控之间可辨认四对并行线状纹理。模型描摹了八段局部线条的走向，并在可见区域内截断。照片无法建立网络名、终端电阻数值、隐藏层、差分阻抗或完整连通关系。[KitGuru 正面原图](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-PCB.jpg)
- **负载开关。** 四颗 RB990 在两处横向、两处纵向装配。建模可见每侧五枚底部端子与 VIN 散热焊盘。其中一颗有同坐标的开窗结构，另外三颗保留丝印，便于在整板上相互对照。[四处定位、逐项照片与 TI 资料](mechanical-detail-evidence.md)
- **背面。** KitGuru 背照可见白色 SAMSUNG SSD 印字、右端镀孔和覆盖约 X 27.5–72.9、Y 1.5–19.9 mm 的含铜标签。TechPowerUp 的另一台 2 TB 有同机带标与完整揭标背照，贴下可见连续黑色阻焊，未见背装芯片或分立器件。照片无法解析阻焊下的内层铜或微孔。[KitGuru 原样品背面](https://www.kitguru.net/wp-content/uploads/2022/10/Samsung-SSD990-PRO-2TB-Review-on-KitGuru-DriveRear.jpg) · [同容量对照样品带标](https://tpucdn.com/review/samsung-990-pro-2-tb/images/drive2.jpg) · [同一盘去标背面](https://tpucdn.com/review/samsung-990-pro-2-tb/images/pcb2.jpg)
