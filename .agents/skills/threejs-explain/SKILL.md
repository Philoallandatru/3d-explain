---
name: threejs-explain
description: 在 3d-explain 中维护交互式 Three.js 货架、硬件装配剖视或协议动画。用于设备拖放、可逆爆炸展开、CAD 与 GLB 对位、逐动作信号追踪和浏览器验收。
---

# Three.js 交互模型

先找对应的编辑入口。货架是 `equipment-layout/设备货架布局.html`。SSD 的可编辑查看器和几何分别在 `ssd-model/viewer/` 与 `ssd-model/*.py`。NVMe 的动作、场景与 React 控件分别在 `nvme-power-cycle/src/content/power-demo-*.js`、`power-demo-scene.js` 和 `PowerDemo3D.jsx`。项目目前使用 Three.js r170，先核对该版本的 API。可按需读 [上游技能索引](../../../skills/README.md)。

## 资产与交互

- 跨 CAD 与 GLB 记录单位和轴向，先用两个以上的物理锚点检查比例、朝向和插接位置。保留脚位、封装、层与功能区的稳定名称或 `extras`，让镜头、射线拾取和信号路径引用同一个零件。
- 爆炸展开从闭合姿态加上按组的偏移。用同一个进度值实现展开、暂停及复原。剥层切换和点击高亮可独立控制，恢复时保留原始材质与变换。
- 货架三维、二维展开图、搜索和持久化共同使用设备与工位 ID。用射线把指针投到可落点区域，拖动先预览，松手再提交交换或新增。处理取消、触屏和已有存档的迁移。
- 硬件解释按证据区分可见外形、规范定义的针位、推演走线及芯片功能块。协议动作单独记录发起者、响应者、方向、字段与规范链接。时间轴的视觉速率服务于阅读，规范时限或实测值另行注明。

## 渲染与验证

- 大型 GLB 和 Three.js 在进入交互场景时加载。相机、滑块、播放和状态变化按需请求帧。监听容器尺寸调整投影，限制高 DPI 像素倍率。共用几何和材质时先核对所有权，再释放几何、材质、纹理和控件监听。
- 离线页在 `file://` 下实测。使用同版本的 Three 核心与加载器，将运行时和必要模型嵌入产物。SSD 可用 `uv run --python 3.11 ssd-model/build_model.py --viewer-only` 从已有 GLB 重新打包。
- 在根目录运行 `npm ci` 和 `npm run build`。在 WebGL 浏览器验证桌面和窄屏、输入与旋转的冲突、播放和逆向单步、深链接、重置及加载失败时的交互。校验设备状态和信号方向，同时观察实际画面。更改几何时再运行 `uv run --python 3.11 ssd-model/verify_model.py`。

[Three.js r170 源码与附加模块](https://github.com/mrdoob/three.js/tree/r170) · [Three.js 准备安装](https://threejs.org/manual/pages/installation.html) · [按需渲染](https://threejs.org/manual/#en/rendering-on-demand) · [资源释放](https://threejs.org/manual/#en/how-to-dispose-of-objects)
