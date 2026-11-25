---
type: Concept
local_only: true
title: NVMe SSD 空闲、入睡和唤醒
description: 对照带电空闲与设备 D3，顺着 APST、ASPM、CLKREQ#、插槽供电和控制器队列读懂两种恢复过程。
summary: 带电空闲可以接着用原来的队列，盘端撤电后要重新建立控制器环境
tags:
  - storage
  - nvme
  - pcie
  - power
  - beginner
sources:
  - "nvme-power-cycle/src/content/report.md"
  - "https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf"
  - "https://nvmexpress.org/wp-content/uploads/NVM-Express-NVMe-over-PCIe-Transport-Specification-Revision-1.4-Ratified-2026.07.31.pdf"
  - "https://pcisig.com/PCIExpress/Specs/Base/_5.0_1.0"
  - "https://cdrdv2-public.intel.com/643108/643108_PIPE_Arch_Spec_Rev_7_1.pdf"
  - "https://uefi.org/sites/default/files/resources/ACPI_Spec_6.6.pdf"
  - "https://docs.kernel.org/power/pci.html"
  - "https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/power-management-for-storage-hardware-devices-nvme"
  - "https://blog.teledynelecroy.com/2021/08/debugging-l1-substates-timing-errors.html"
createdAt: "2026-11-25"
---

# NVMe SSD 空闲、入睡和唤醒

**带电空闲时，PCIe 通道和 NVMe 控制器各自省电，还可以接着用原来的队列。平台把盘的主电源撤掉后，驱动要先重建与 SSD 通信的环境，再接着读写。**

## 先认清图上的状态

`D0 / D3hot / D3cold` 描述 PCI 功能，`L0 / L1 / L1.2` 描述 PCIe 链路，`PS0 / PS1 / …` 描述 NVMe 控制器。整机另有 `S0`、`S3` 等系统状态。一次设备省电可以发生在整机仍处于 `S0` 的时候，Windows Modern Standby 的系统状态也是 `S0` 低功耗空闲。 [PCIe Base 5.0 §5.2][pcie] · [NVMe Base 2.4 §8.1.19][nvme-ps] · [Microsoft 存储设备电源管理][win-storage]

## 带电空闲与恢复

在这条路径里，M.2 主电源保持 3.3 V，PCI 功能在 `D0`。上一次 I/O 完成后，控制器和链路分别判断何时省电。链路空闲看的是线路活动，控制器空闲看的是 I/O 队列，进出各自按它们的条件发生。 [PCIe Base 5.0 §5.2、§5.4、§5.5][pcie] · [NVMe Base 2.4 §8.1.19.1–2][nvme-ps]

1. **盘内 APST。** 主机从 Identify Controller 的 `APSTA[0]` 判断支持情况，从电源状态描述符读取 `NOPS` 和 `ENLAT / EXLAT`，了解状态是否处理 I/O 以及进出延迟。主机可用 Set Features `FID 0Ch` 设置 `APSTE` 和转换表。表里的 `ITPT` 指连续空闲阈值，`ITPS` 指要进入的非操作态。所有 I/O 提交队列都没有未完成命令，且连续空闲超过相应阈值时，控制器按表自主转换。自检等后台工作仍可能影响进入条件。 [NVMe Base 2.4 APST 特性][nvme-apst] · [NVMe Base 2.4 §8.1.19.1–2][nvme-ps]
2. **链路 ASPM。** 主机侧端口和 SSD 端都支持且启用相应能力时，链路可从 `L0` 进 `L1`。启用 L1 子态时，基础态称 `L1.0`。带 `CLKREQ#` 的 ASPM `L1.2` 还要求启用 `ASPM L1.2 Enable`，并按 `LTR_L1.2_THRESHOLD` 判断可容忍的服务延迟是否够长。可在 `Link Control.ASPM Control` 和 `L1 PM Substates Control 1` 查配置，后者也给 `PCI-PM L1.2` 设有独立使能位。 [PCIe Base 5.0 §5.5、§7.8.3][pcie] · [PCI-SIG 的 CLKREQ# 子态修订][l1-ecn] · [Linux L1.2 配置实现][linux-aspm]
3. **有新 I/O 时。** 以支持 `CLKREQ#` 的共同时钟 L1.2 路径为例，链路进入 `L1.0` 后两端释放低有效的 `CLKREQ#`，线回高，平台给链路的 `REFCLK` 在进入 `L1.2` 时停掉。主机有待发事务时，端口把 `CLKREQ#` 拉低，参考时钟回来，链路经过 `L1.0 → Recovery → L0`，随后传送队列门铃和取命令所需的事务。`T_POWER_ON` 和 `Common_Mode_Restore_Time` 约束链路恢复阶段，`PERST#` 保持释放。控制器遇到 I/O 时回到最近一次使用的操作态，接着在原队列处理命令并回报完成。 [PCIe Base 5.0 §5.5.3–5][pcie] · [Intel PIPE 7.1 图 9-5][l1-timing] · [NVMe Base 2.4 §8.1.19.1][nvme-ps]

主机和驱动可以采用不同的盘内策略。Linux 的 NVMe 驱动会根据控制器能力和延迟约束设置 APST 表。Microsoft 的 StorNVMe 文档描述了另一种路径，Modern Standby 由驱动管理非操作态并要求关闭 APST。 [Linux NVMe APST 实现][linux-apst] · [Microsoft StorNVMe 电源管理][win-nvme]

## 设备 D3 与恢复

1. **先收尾。** 在这条有序路径中，驱动停止提交新 I/O，等现有 I/O 完成。NVMe 规范建议删除 I/O SQ 再删除 I/O CQ，写 `CC.SHN=01b` 请求正常关停。控制器报告 `CSTS.SHST=10b` 且 `CSTS.ST=0` 时，已完成控制器级关停。 [NVMe Base 2.4 §3.6.1][nvme-shutdown]
2. **先到 D3hot，再按平台决定是否撤电。** PCI 电源管理把 `PMCSR.PowerState` 写成 `11b`，设备进 `D3hot`，主电源仍在，PCI 配置空间仍可访问。若平台和驱动允许，且共享电源资源可以关闭，平台才撤掉盘端主电源，进入 `D3cold`。ACPI 平台可通过 `_PR3` 描述 `D3hot` 需要的电源资源，操作系统决定何时关闭可撤的资源。NVMe 规范把实际撤掉主电源这一档称为 Runtime D3（RTD3）。 [PCIe Base 5.0 §5.3.1、§7.5.2.2][pcie] · [ACPI 6.6 §7.3.11][acpi-pm] · [Microsoft D3cold 固件示例][win-d3] · [NVMe over PCIe 1.4 §3.6][transport]
3. **有请求时先恢复设备。** 从 `D3hot` 可以用 `PMCSR.PowerState=00b` 返回 `D0`。`PMCSR.No_Soft_Reset` 表示这次转换是否保持 PCI 功能上下文，走过 NVMe 正常关停时还要恢复 NVMe 控制器。从 `D3cold` 则先恢复主电源，按板级时序恢复时钟、释放复位、训练 PCIe 链路并恢复所需的 PCI 配置。通用 Linux PCI runtime PM 先把设备恢复到全功耗并恢复配置，再调设备驱动的恢复回调。 [PCIe Base 5.0 §5.3.1、§7.5.2.2][pcie] · [Linux PCI 电源管理][linux-pci] · [M.2 供电、时钟和复位](../specs/m2-power-clock-reset.md)
4. **重建队列后接着读盘。** 控制器可访问后，驱动确认复位完成，写 `AQA / ASQ / ACQ` 配管理队列，设 `CC.EN=1` 并等 `CSTS.RDY=1`，再设置所需特性、先建 I/O CQ 后建 I/O SQ，最后放行普通读写。Identify Controller 的 `RTD3E / RTD3R` 是盘报告的进入与恢复延迟，动画只表示动作先后。 [NVMe Base 2.4 §3.5.1][nvme-init] · [NVMe Base 2.4 §8.1.19.4][nvme-rtd3]

## 看实机时对准观测点

查 APST 表和 L1 子态使能位可确认配置。把总线分析仪的链路事件、`CLKREQ#`、`REFCLK` 和盘端 3.3 V 对在同一条时间线上，就能区分哪一刻链路开始省电、停钟和撤电。有新请求时，带电空闲看链路和现有队列恢复活动，D3cold 看 PCI 配置和 NVMe 队列重新就绪。 [Teledyne LeCroy 链路与时钟测量示例][l1-analyzer] · [NVMe Base 2.4 §3.5.1][nvme-init]

## 相关

- [NVMe SSD 开关机读图指南](nvme-power-cycle-guide.md)
- [从 PCIe 建链到 NVMe 读盘](../specs/pcie-nvme-queues-and-packets.md)
- [保存、上锁、关停和断电](nvme-shutdown-and-power-loss.md)

[nvme-apst]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf#page=494
[nvme-ps]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf#page=694
[nvme-shutdown]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf#page=140
[nvme-init]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf#page=131
[nvme-rtd3]: https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf#page=695
[transport]: https://nvmexpress.org/wp-content/uploads/NVM-Express-NVMe-over-PCIe-Transport-Specification-Revision-1.4-Ratified-2026.07.31.pdf#page=16
[pcie]: https://pcisig.com/PCIExpress/Specs/Base/_5.0_1.0
[l1-ecn]: https://pcisig.com/PCIExpress/ECN/Base/L1PMSubstateswithCLKREQ_1.0a
[l1-timing]: https://cdrdv2-public.intel.com/643108/643108_PIPE_Arch_Spec_Rev_7_1.pdf#page=176
[l1-analyzer]: https://blog.teledynelecroy.com/2021/08/debugging-l1-substates-timing-errors.html
[acpi-pm]: https://uefi.org/sites/default/files/resources/ACPI_Spec_6.6.pdf
[linux-pci]: https://docs.kernel.org/power/pci.html
[linux-aspm]: https://github.com/torvalds/linux/blob/v6.12/drivers/pci/pcie/aspm.c#L551-L689
[linux-apst]: https://github.com/torvalds/linux/blob/v6.12/drivers/nvme/host/core.c#L2440-L2571
[win-storage]: https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/power-management-for-storage-hardware-devices-intro
[win-nvme]: https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/power-management-for-storage-hardware-devices-nvme
[win-d3]: https://learn.microsoft.com/en-us/windows-hardware/drivers/bringup/firmware-requirements-for-d3cold
