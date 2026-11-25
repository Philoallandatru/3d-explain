# 3D Explain

设备货架的交互布局、990 PRO 2 TB 的物理拆解，以及对应的 NVMe 协议演示。

| 项目 | 入口 | 可查看的内容 |
| --- | --- | --- |
| 设备货架 | [离线 HTML](equipment-layout/设备货架布局.html) · [三维预览](equipment-layout/场景预览.png) | 拖放换位、自动对齐、控制平面、人物视角、增删平台 |
| 990 PRO 2 TB | [离线 3D 查看器](ssd-model/view.html) · [模型说明](ssd-model/README.md) | SSD 爆炸展开、PCB 正反面和分层、主控及 NAND 剖视、测量依据、STEP 与 GLB |
| NVMe 上下电 | [应用源码与说明](nvme-power-cycle/) | 带电空闲、D3cold 复电、4 KiB 读写和关机，配有寄存器、事务方向和规范出处 |

## 本地运行

货架和 SSD 的离线 HTML 在下载后可以直接用浏览器打开，Three.js 随文件一并提供。要从同一个入口打开三个场景，请安装 Node.js 22.12 或更新的版本，然后在仓库根目录运行：

```sh
npm ci
npm run build
npm run preview
```

访问终端显示的本地地址，默认是 `http://127.0.0.1:4173/`。构建好的入口、静态页面和运行资源放在 `dist/`。编辑 NVMe 应用时，可从根目录运行 `npm run dev:nvme`，然后打开开发地址下的 `/beginner.html#demo-3d`。

Three.js 0.170.0、React、Vite 和字体依赖由根目录的 [npm 锁文件](package-lock.json) 固定。SSD 查看器的 [Three.js 构建和许可证](ssd-model/viewer/) 也随源码保留。货架的离线文件包含它自己的 Three.js 构建。

## 继续建模与复现

- [SSD 模型说明](ssd-model/README.md) 列出 CAD 入口、Python 建模源文件、校验命令和证据。运行 `uv run --python 3.11 ssd-model/build_model.py` 可重新生成 STEP、GLB 和离线查看器。
- 运行 `python nvme-power-cycle/scripts/build-3d-assets.py` 可用已收录的 SSD 与 Framework GLB 重建 NVMe 演示的轻量组合模型。
- [Three.js 项目技能](.agents/skills/threejs-explain/SKILL.md) 收录本项目验证过的做法。[上游技能索引](skills/README.md) 列出收录版本、许可证和用途。
- [资产与第三方许可](NOTICE.md) 记录 Framework CAD、Three.js、字体和上游技能的出处。
