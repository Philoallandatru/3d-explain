---
name: Cloud Edge
description: 中文 NVMe / PCIe 上下电技术报告的视觉系统
colors:
  ink: "#101f39"
  muted: "#4c5e7a"
  blue: "#2150d0"
  blue-pressed: "#173ca4"
  cloud: "#f2f6fd"
  rule: "#dbe4f2"
  surface: "#fff"
  masthead: "#f9fbff"
  report-copy: "#263958"
  control-surface: "#f8fbff"
  control-ink: "#233f7b"
  control-hover: "#e8effe"
  search-surface: "#fafcff"
  atlas-surface: "#f0f5ff"
  measurement-ink: "#182c54"
  segment-surface: "#eaf0fb"
  segment-ink: "#374f79"
  toc-ink: "#42597c"
  toc-current: "#edf3ff"
  toc-current-ink: "#1b48be"
  signal-base: "#142751"
  signal-ink: "#f3f8ff"
  signal-power: "#78f0d2"
  signal-reset: "#7ce3ff"
  signal-pcie: "#9caaff"
  signal-nvme: "#e9aaff"
typography:
  display:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "clamp(2.75rem, 5.05vw, 4.75rem)"
    fontWeight: 720
    lineHeight: 1.13
    letterSpacing: "-.038em"
  headline:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "clamp(1.65rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-.027em"
  title:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "26px"
    fontWeight: 710
    lineHeight: 1.38
    letterSpacing: "-.022em"
  body:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.95
  label:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "13px"
    fontWeight: 640
  button:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "14px"
    fontWeight: 630
  search:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "14px"
  toc:
    fontFamily: "Instrument Sans Variable, Noto Sans SC Variable"
    fontSize: "13px"
    lineHeight: 1.42
  measurement:
    fontFamily: "Geist Mono Variable, Noto Sans SC Variable"
    fontSize: "clamp(1.5rem, 2.25vw, 2.05rem)"
    fontWeight: 610
    letterSpacing: "-.038em"
  lead:
    fontSize: "17px"
    lineHeight: 1.8
  display-medium:
    fontSize: "clamp(2.47rem, 5.15vw, 3.65rem)"
  display-narrow:
    fontSize: "clamp(2.48rem, 9.3vw, 3.55rem)"
  signal-title:
    fontSize: "16px"
    fontWeight: 650
  signal-label:
    fontSize: "12px"
    fontWeight: 600
  phase-label:
    fontSize: "11px"
    fontWeight: 600
  signal-label-narrow:
    fontSize: "10px"
    fontWeight: 600
  evidence-heading:
    fontSize: "19px"
    fontWeight: 690
  atlas-title:
    fontSize: "23px"
    fontWeight: 700
    letterSpacing: "-.02em"
  atlas-title-narrow:
    fontSize: "21px"
  report-title-narrow:
    fontSize: "22px"
  report-subtitle:
    fontSize: "20px"
    fontWeight: 710
    lineHeight: 1.38
    letterSpacing: "-.01em"
  measurement-unit:
    fontSize: ".46em"
    fontWeight: 620
  report-link:
    fontSize: ".93em"
  inline-code:
    fontSize: ".94em"
rounded:
  inline-code: "4px"
  phase: "5px"
  segment: "6px"
  search: "8px"
  control: "9px"
  dialog: "14px"
  atlas: "15px"
  signal: "16px"
  signal-dot: "100%"
spacing:
  section-gap: "69px"
  section-gap-narrow: "43px"
  shell-max: "1264px"
  shell-gutter: "48px"
  shell-gutter-medium: "28px"
  shell-gutter-narrow: "18px"
  paragraph-bottom: "17px"
  button-padding: "9px 16px"
  signal-padding: "23px 25px 20px"
  atlas-copy-padding: "30px 25px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "{spacing.button-padding}"
  button-primary-hover:
    backgroundColor: "{colors.blue-pressed}"
  button-secondary:
    backgroundColor: "{colors.control-surface}"
    textColor: "{colors.control-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "{spacing.button-padding}"
  button-secondary-hover:
    backgroundColor: "{colors.control-hover}"
  mode-switch:
    backgroundColor: "{colors.segment-surface}"
    rounded: "{rounded.control}"
    padding: "3px"
  mode-tab:
    textColor: "{colors.segment-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    padding: "4px 12px"
  mode-tab-pressed:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.surface}"
  search-input:
    backgroundColor: "{colors.search-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.search}"
    rounded: "{rounded.search}"
    padding: "0 11px"
  toc-link:
    textColor: "{colors.toc-ink}"
    typography: "{typography.toc}"
    rounded: "{rounded.phase}"
    padding: "7px 8px"
  toc-link-current:
    backgroundColor: "{colors.toc-current}"
    textColor: "{colors.toc-current-ink}"
  signal-panel:
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.signal}"
    padding: "{spacing.signal-padding}"
  figure-atlas:
    backgroundColor: "{colors.atlas-surface}"
    rounded: "{rounded.atlas}"
  measurement-value:
    textColor: "{colors.measurement-ink}"
    typography: "{typography.measurement}"
---

# Cloud Edge 设计系统

## Overview

**Creative North Star: "Cloud Edge"**

Cloud Edge 以云白和墨蓝组织中文技术长文。比例字形用于标题、导航和正文。技术字段与实测数值用等宽字形对齐。

钴蓝标示可操作的入口与浅底选中态。深蓝波形区集中呈现信号层级，细线、阶段标签和文字说明共同标记当前进度。

**Key Characteristics**

- 云白阅读面、细分隔线、墨蓝正文。
- 中文用 Noto Sans SC，西文界面用 Instrument Sans，代码与数值用 Geist Mono。
- 四路信号色保持固定，波形阶段与实测记录各有标签。

## Colors

- **Primary**　钴蓝用于主要按钮、正文链接与浅底选中状态。主要按钮悬停后加深，目录当前项使用浅蓝底和蓝字。
- **Secondary**　四条信号线在深色面板内各有固定色。选中阶段用半透明蓝色带和竖向游标定位。
- **Neutral**　阅读面以白色为底，浅蓝区承接序言、图册和页脚。细浅蓝分隔线连接阅读区，略淡的字色用于说明与计时条件。

**The 信号色固定 Rule.** 3.3 V 用薄荷青，PERST# 用冰青，PCIe 用淡蓝紫，NVMe 用浅品红。上电和下电沿用同一映射。

## Typography

Noto Sans SC 排中文标题与正文，Instrument Sans 排西文和界面文案，Geist Mono 排协议字段与实测读数。三套可变字体由 Fontsource 随项目提供。技术行内代码关闭连字。

- **Display**　首屏标题用两个块级行组织文字，首行为 630，主行使用 display 字重。字号会随屏宽收放。
- **Headline / Title**　页面区块用 headline 标度，报告章标题用 title 标度，子标题在桌面为 20px。
- **Body**　长文正文保持 16px、1.95 行高，段宽上限为 42em。段落、列表和章节间距建立长文节奏。
- **Label**　分段控件用 13px，波形轨名为 12px，窄屏降至 10px。实测数字使用表格数字特性，单位用较小字级。

**The 阅读与字段角色 Rule.** 标题、正文和控件用比例字族。寄存器、包字段和实测数值切换到等宽。

## Layout

- 桌面容器上限为 1264px，左右各至少留 48px。首屏两栏以 0.82∶1.18 分配，报告以 210–280px 目录配正文。页头与桌面目录均可吸附。
- 1020px 及以下，左右边距降为 28px，同时收窄首屏间距和波形内边距。760px 及以下，左右边距为 18px，页头改两行，首屏、图册与正文顺序堆叠，目录回到正文上方。
- 实测在宽屏用竖线排列成一排，窄屏用横线分开每条记录，数值和单位同置右列。760px 及以下，报告区块的顶部间距由 69px 缩为 43px。360px 及以下再收紧导航、首屏按钮与阶段标签。
- 报告表格保持 580px 最小宽度，表格容器独立横向滚动。放大的时序图也在自身区域内滚动。

## Elevation & Depth

正文与实测使用平面、边线和底色区分层级。首屏云白渐变承托深蓝波形面板，面板以径向渐变着色，并使用 `0 22px 54px #15387b38` 扩散阴影。放大图模态使用 `#081b40bd` 遮罩。

**The 集中层次 Rule.** 常驻阅读区以背景与细线分层。扩散阴影留给主时序示意，模态精读以遮罩隔开背景。

## Shapes

按钮、分段底板与表框为 9px 圆角，搜索框和图预览按钮为 8px，分段选项与图像工具按钮为 6px。主波形、图册和放大图模态分别使用 16px、15px 和 14px 圆角。实测分隔与正文区块使用 1px 边线，信号图例和阶段定位使用小圆点。

## Components

- **按钮**　跳转与下载使用同一圆角和尺寸，主按钮为实心钴蓝，次按钮用浅底和细边框。键盘焦点用 2px 外轮廓，深蓝面板内使用浅色轮廓。背景和字色过渡为 160ms，仅在用户未请求减弱动态效果时启用。
- **分段与阶段切换**　浅底分段控件用钴蓝填充选中项，深底波形用浅蓝填充选中项。阶段选择同步改变波形高亮区和事件说明，分段与阶段均公开 `aria-pressed` 状态。
- **目录与搜索**　页头链接在悬停时加下划线，目录使用浅蓝底标记当前章节。搜索框聚焦时整框显示轮廓，结果按章节列出命中文段。
- **实测条目**　设备名、读数、单位与测试条件分别排版，整条链接到原始出处。
- **时序图精读**　浅蓝图册将导读与图预览同置一框。原图用原生对话框展示，按 25% 步进在 100–300% 范围缩放，百分比按钮恢复适应宽度。

## Do's and Don'ts

### Do

- 顺序示意同时给出信号名称、阶段选择和文字事件，实测记录同时给出设备、数值、单位与原始出处。
- 保留键盘焦点轮廓和选中态，宽表与图集允许在组件内滚动。

### Don't

- 所有网页字族统一由项目自托管。
- 阶段等分表示事件顺序，时间比例留给带来源的独立测量。
