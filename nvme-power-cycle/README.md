# NVMe 上下电技术报告

React 和 Vite 项目。交互波形在 `src/SignalTrace.jsx`，报告正文为 `src/content/report.md`，原始时序图和 PDF 位于 `public/figures/`。网页中的波形表示阶段顺序，机型对应的实测时间来自正文的原始链接。

网页版有两个入口。首页是完整技术报告，`/beginner.html` 是简明图解。打开 `/beginner.html#demo-3d` 可进入主板和 990 PRO 2 TB 的三维演示，从上电、启动解锁、带电空闲、深睡复电和关机五条流程中选择。每个阶段列有寄存器、信号、阶段结束状态和规范出处。选中关键动作后可展开事务或边带详情，查看示例字段值、方向和对应规范条款。

简明版的术语解释维护在 `src/content/beginner-terms.js`，三维流程维护在 `src/content/power-demo-flow.js`。`src/content/knowledge/` 收录了 Ficus-KB 笔记镜像和本站的《NVMe SSD 空闲、入睡和唤醒》。镜像笔记的阅读页可以打开 Obsidian 原文。

在工作目录根级运行 `npm ci` 和 `npm run dev:nvme` 可编辑这个应用。

在工作目录根级运行 `npm run build` 和 `npm run preview` 可从总入口预览，也可在本目录单独运行构建。浏览器从项目本地加载字体、正文和时序图。引用链接指向公开来源。

三维资产是 `public/models/power-cycle.glb`。运行 `python scripts/build-3d-assets.py` 可以用兄弟目录 [ssd-model](../ssd-model/) 下的 Framework 主板 CAD 和 SSD 拆解模型重新生成。彩线和芯片功能区按规范及通用架构绘制，播放时间为演示时间。

## 字体

中文标题、正文和导航使用 [Noto Sans SC](https://fontsource.org/fonts/noto-sans-sc)，西文界面文字使用 [Instrument Sans](https://fontsource.org/fonts/instrument-sans)。寄存器、代码和测量数字使用 [Geist Mono](https://fontsource.org/fonts/geist-mono)。三套可变 Web Font 由 Fontsource 包提供，通过 Vite 随项目自托管。原始矢量图、PNG 与 PDF 沿用原报告的排版。
