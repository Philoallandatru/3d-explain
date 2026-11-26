"use strict";
window.createBoardStack = function ({T, $, guides, parts, partById, visible, box, project, svg, refresh, frame, animateFrame, setView, choose, draw}) {
  const data = JSON.parse($("stack-guide").textContent);
  const layers = data.layers;
  const evidence = {photo:"照片可辨", standard:"M.2 标准针位", model:"原理推演", cad:"原厂主板 CAD"};
  const pathLayer = {edge:1, pcie:3, ctrl:1, nand:4};
  const ink = new T.Color("#f9e8c7");
  let layer = 1;
  let mode = "peel";
  let step = "";
  let lane = 0;
  let direction = "down";
  let target = "a";
  let components = false;
  let dielectric = true;
  let confirmed = false;
  let nearestGround = "";
  let followChip = true;
  let cameraScope = "";
  let system = false;
  let systemProof = false;
  let spreader = false;
  let ssdProof = false;
  let ssdDielectric = true;
  const pcieNet = () => "pcie_" + lane + "_" + direction;
  const nandNet = () => "nand_" + target;
  const isViaFocus = () => !system && mode === "explode" && step === "vias";
  const showLogic = () => playback.active() || (!system && (step === "ctrl" || step === "route"));
  const all = () => parts.filter(p => p.view==="stack");
  const byId = key => partById("stack_" + key);
  const hostPart = key => partById("fw_" + key);
  const proofOnly = () => system ? systemProof : confirmed;
  const shownLayer = () => system ? playback.active() ? playback.layer() : 1 : layer;
  const peeled = () => system || mode==="peel";
  const isSignal = p => ["trace","via","component_cap","ball"].includes(p.stack.role);
  const assembly = window.createAssemblyExplode({T,$,parts,partById,box,project,svg,draw,layerChange:refresh});
  const ssdAssembling = () => assembly.view()==="ssd-explode";
  const playback = window.createStackPlayback({
    T,$,guides,byId,all,visible,box,project,svg,choose,frame,system:()=>system,hostPart,
    begin() {
      if (!system) {
        step = "";
        mode = "explode";
        confirmed = false;
      }
      cameraScope = "";
      choose(null);
    },
    changed(refit, currentLayer) {
      if (!system && mode === "peel" && currentLayer) layer = currentLayer;
      refresh(false);
      trackChip(refit);
    },
    inspected() { if (followChip) cameraScope = "inspection"; }
  });

  function useView(view) {
    if (assembly.active() && assembly.view()!==view) assembly.exit();
    const next = view==="system";
    if (next===system) return;
    playback.reset();
    system = next;
    cameraScope = "";
  }

  function openAssembly() {
    if (!system || !assembly.enter()) return;
    playback.pause(false);
    cameraScope = "inspection";
    choose(null);
    refresh();
    assembly.focus(animateFrame);
    assembly.play(1);
  }

  function openSsdAssembly() {
    if (assembly.enter("ssd-explode")) {
      refresh();
      assembly.focus(animateFrame);
      assembly.play(1);
    } else assembly.focus(frame);
  }

  function closeAssembly(refit=true) {
    if (!assembly.exit()) return;
    cameraScope = "";
    refresh();
    if (!refit) return;
    if (playback.active() && followChip) trackChip(true);
    else frame();
  }

  function systemFrame(scope, move, selected=false) {
    if (scope==="mainboard") {
      move(null);
      return;
    }
    const landmarks = scope==="socket" ? ["cad_socket"] :
      scope==="memory" ? ["host_ram","host_root","cad_packages"] : [];
    const items = (scope==="ssd" ? all() : landmarks.map(hostPart)).filter(p=>p&&visible(p));
    if (!items.length) return move(null);
    const shot = {items,context:true};
    if (selected) {
      choose({...shot, name:items[0].label,description:items[0].desc,evidence:items[0].stack.evidence});
    }
    move(shot);
  }

  function trackChip(refit=false) {
    if (assembly.active()) return;
    const site = playback.chip();
    if (system && !followChip && playback.active()) return;
    const scope = followChip && site ? (site==="flash" ? "nand_"+playback.target() : site) :
      system && followChip ? playback.scope() : "";
    if (scope===cameraScope && !refit) return;
    cameraScope = scope;
    if (!scope) {
      animateFrame(null);
      return;
    }
    if (!site) {
      systemFrame(scope,animateFrame);
      return;
    }
    if (system && systemProof) {
      const prefix = site==="ctrl" ? "U_CTRL" : playback.target()==="a" ? "U_N1" : "U_N2";
      const items = parts.filter(p=>p.view==="physical"&&p.id.startsWith(prefix+"_")&&visible(p));
      animateFrame({items,chip:site,context:true});
      return;
    }
    const outline = byId(site==="ctrl" ? "U_CTRL_outline" : "U_N"+(playback.target()==="a" ? "1" : "2")+"_outline");
    const items = [outline,...all().filter(p=>visible(p) && p.stack.role==="chip_detail" &&
      p.stack.site===site && (site==="ctrl" || p.stack.net===scope))];
    animateFrame({items, chip:site, context:true});
  }

  function currentShell(part) {
    if (playback.chip()==="ctrl") return part.stack.site==="ctrl";
    return playback.chip()==="flash" && part.id.startsWith("stack_U_N"+(playback.target()==="a" ? "1" : "2")+"_");
  }

  function show(part) {
    const s = part.stack;
    const proof = proofOnly();
    const top = shownLayer()===1;
    if (proof && s.evidence === "model") return false;
    if (s.role === "io") {
      if (!playback.active()) return false;
      return s.site==="host" ? !system : s.net==="nand_"+playback.target() && (!peeled() || top);
    }
    if (s.role === "chip_detail") {
      if (!playback.active() || (peeled() && !top) ||
          (s.operation && s.operation!==playback.operation())) return false;
      if (s.site==="ctrl") return playback.chip()==="ctrl";
      return s.net==="nand_"+playback.target() && (playback.chip()==="flash" || s.actor==="io");
    }
    if (isViaFocus()) {
      if (s.net !== pcieNet() && s.net !== nearestGround) return false;
      return s.site === "edge" || (s.net === pcieNet() && s.role === "trace" && s.site === "span");
    }
    if (s.role === "coupon") return false;
    if (s.role === "finish") return proof && s.layer >= shownLayer();
    if (s.role === "outline") return !(system || components) || (showLogic() && s.site === "ctrl");
    if (s.role === "component") {
      if (proof && currentShell(part)) return true;
      if (currentShell(part)) return false;
      return (system || components) && !(showLogic() && s.site === "ctrl");
    }
    if (s.role === "logic") return showLogic() && (!peeled() || top);
    if (system && isSignal(part) && playback.intensity(part)>=2) return true;
    if (s.role === "dielectric" && !system && !dielectric) return false;
    return !peeled() || s.layer >= shownLayer();
  }

  function showSystem(part) {
    if (assembly.active()) {
      if (part.view==="system") return part.stack.role==="host_cad";
      return part.view==="physical" && !["top_label","bottom_label"].includes(part.group);
    }
    const active = playback.active(), scope = playback.scope();
    const surface = scope!=="ssd" || systemProof;
    if (part.view==="physical" && surface) {
      if (["top_label","bottom_label"].includes(part.group)) return false;
      return !part.id.startsWith("m2_pin_") || playback.intensity(byId(part.id))<1;
    }
    if (part.view==="stack") {
      return active && (surface
        ? part.stack.role==="finger" && playback.intensity(part)>0
        : show(part));
    }
    if (part.view!=="system") return false;
    const {role,site} = part.stack;
    if (role==="host_cad") return site!=="spreader" || (spreader && !active);
    if (!active || scope==="ssd") return false;
    if (role==="host_pin") return playback.intensity(part)>0;
    return !systemProof && ["mainboard","memory"].includes(scope);
  }

  function showSsdAssembly(part) {
    if (part.view==="physical") {
      return !assembly.layersVisible() || !["board","edge","artwork"].includes(part.group);
    }
    if (!assembly.layersVisible() || !assembly.isSsdLayer(part)) return false;
    const {role,evidence:source} = part.stack;
    return !(ssdProof && source==="model") && (role!=="dielectric" || ssdDielectric);
  }

  function offset({stack:s}) {
    if (peeled()) return 0;
    // A local launch cutaway uses smaller offsets to keep the hole walls legible.
    const pitch = isViaFocus() ? .00122 : .0068;
    return (3.5 - s.layer) * pitch;
  }

  function highlighted(part) {
    const s = part.stack;
    if (system || !step) return false;
    if (step === "edge") return s.site === "edge" && s.net === pcieNet();
    if (step === "pcie") return s.net === pcieNet();
    if (step === "nand") return s.net === nandNet();
    if (step === "route") return s.role === "logic" || [pcieNet(),nandNet()].includes(s.net);
    if (step === "ctrl") return s.site === "ctrl" && (s.role === "logic" || [pcieNet(),nandNet()].includes(s.net));
    return s.site === "edge" && (s.net === pcieNet() || s.net === nearestGround);
  }

  function color(part, material, chosen) {
    const {role, layer: partLayer, evidence: source} = part.stack;
    const lit = assembly.active() ? 0 : playback.intensity(part);
    const selected = lit>=2 || highlighted(part);
    const quiet = ((!system && !!step) || playback.active()) && lit===0 && !selected && isSignal(part);
    let opacity = quiet ? .24 : 1;
    if (role === "dielectric") opacity = peeled() ? 1 : .24;
    if (role === "component" && ((!system && !!step) || playback.active())) opacity = playback.active() ? .39 : .58;
    if (role === "component" && proofOnly()) opacity = 1;
    if (partLayer !== layer && !peeled() && role === "plane") opacity = .88;
    if (system && role === "dielectric") opacity = .27;
    if (system && role === "plane") opacity = .35;
    if (system && !assembly.active() && part.id==="fw_cad_socket" && playback.scope()==="socket") opacity = .30;
    if (role==="host_actor" && !lit && !chosen) opacity = .62;
    setOpacity(material,opacity);
    if (chosen || selected) {
      // Intensity changes leave the evidence colour in the same hue family.
      const strength = lit===3 ? .67 : chosen ? .39 : .25;
      if (source === "model" && role !== "logic") material.color.lerp(ink, lit===3 ? .32 : chosen ? .44 : .19);
      if (material.emissive) material.emissive.copy(material.color).multiplyScalar(strength);
    }
  }

  function setOpacity(material, opacity) {
    const transparent = opacity < 1;
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.depthWrite = !transparent;
    material.opacity = opacity;
  }

  function colorSsdAssembly(part, material, chosen) {
    const {role} = part.stack;
    const opacity = {dielectric:.18,finish:.24,plane:.78}[role] ?? 1;
    setOpacity(material,chosen ? Math.max(opacity,.62) : opacity);
    if (chosen && material.emissive) material.emissive.copy(material.color).multiplyScalar(.55);
  }

  function pinText() {
    const pins = all().filter(p => p.stack.role === "finger" && p.stack.net === pcieNet())
      .map(p => p.stack.pin).sort((a,b) => a-b);
    return pins.length === 2 ? "#" + pins[0] + "− / #" + pins[1] + "+" : "";
  }

  function pathNote() {
    const pins = pinText();
    const bus = "NAND " + target.toUpperCase();
    switch (step) {
      case "edge":
        return "Lane " + lane + " · " + pins + "。"
          + (direction === "up" ? "SSD TX 两根导体各经过一枚串联电容，再到接口。"
            : "主机 TX 通过插座送入 SSD RX，主机发送侧的串联电容在主板上。");
      case "pcie":
        return "从 " + pins + " 沿 L3 到主控端，两根导体在两端各有过孔。L2 为此段的主要接地参考。";
      case "ctrl":
        return "PCIe 差分线在 Pascal 主控的 PHY 端结束。主控处理命令、地址与纠错，再由独立的 NAND 控制器驱动闪存总线。";
      case "nand":
        return "L4 的代表性 DQ、DQS 与控制线从 Pascal 扇出，到 " + bus + " 下方由过孔返回 L1 的示意封装焊盘。";
      case "route":
        return "从 " + pins + " 到 L3，再接 Pascal 的 PCIe 端。主控处理命令后，经 L4 总线到 "
          + bus + "。亮色轨迹随层分开，两段接口在主控内转接。";
      case "vias":
        return "亮色双孔是 " + pins + " 的入层孔，旁边地孔连接 L2 与 L5。信号孔穿过接地面的避空区，孔壁彼此绝缘。展开距离已放大。";
      default:
        return "";
    }
  }

  function sync(active, ssd=false) {
    const showHost = active && system;
    const exploded = showHost && assembly.active();
    $("system-options").hidden = !showHost;
    $("ssd-explode-options").hidden = !ssd;
    $("system-cad-key").hidden = !showHost;
    $("stack-dielectric-key").hidden = showHost || (ssd && (!assembly.layersVisible() || ssdProof || !ssdDielectric));
    $("stack-layer-quick").hidden = !active || system;
    $("stack-options").hidden = !active || system;
    $("stack-overlay").hidden = !active && !ssd;
    $("stack-io-auto-text").textContent = showHost ? "跟随信号切换视野" : "跟随信号放大芯片";
    playback.sync(active&&!exploded,proofOnly());
    if (ssd) {
      $("ssd-explode-proof").checked = ssdProof;
      $("ssd-explode-dielectric").checked = ssdDielectric;
      $("ssd-explode-dielectric").disabled = ssdProof || !assembly.layersVisible();
    }
    if (!active) return;
    if (showHost) {
      const playing = !exploded && playback.active();
      $("system-explode").textContent = exploded ? "返回整机" : "爆炸展开";
      $("system-explode").setAttribute("aria-expanded",String(exploded));
      $("system-slot").textContent = exploded ? "聚焦装配" : "放大主槽";
      $("system-spreader").checked = exploded || (spreader && !playing);
      $("system-spreader").disabled = exploded || playing;
      $("system-confirmed").checked = systemProof;
      $("system-confirmed").disabled = exploded;
      if (exploded) {
        $("mode-name").textContent = "M.2 主槽 · 爆炸展开";
        $("mode-tip").textContent = "依次分离固定螺钉、散热片、导热垫和 990 PRO。";
        $("display-info").textContent = "主板、插座和尾部固定柱是装配基准。展开距离与抽卡角度为演示参数。";
      } else if (playing) {
        const chip = playback.chip();
        const shell = chip==="ctrl" ? "Pascal 主控" : "NAND "+playback.target().toUpperCase();
        $("mode-name").textContent = systemProof && chip ? shell+" · 实物封装" : playback.title();
        $("mode-tip").textContent = chip ? playback.transactionTitle() : playback.packet();
        $("display-info").textContent = "蓝色对应接口针位，橙色虚线表示推演连接。主板铜层位置和芯片内部布局待实测。";
      }
      document.body.dataset.systemSpreader = String(exploded || (spreader&&!playing));
      document.body.dataset.systemEvidence = systemProof ? "confirmed" : "all";
      return;
    }
    const [n, , title, note] = layers[layer-1];
    $("mode-name").textContent = isViaFocus() ? "信号过孔与回流"
      : mode === "explode" ? (step === "route" ? "金手指 · Pascal · NAND "+target.toUpperCase() : "PCB 原位展开")
      : "L" + n + " · " + title;
    $("mode-tip").textContent = "与整板共用器件坐标。PCB 内层、过孔与球位采用原理模型。";
    $("display-info").textContent = "可见线段按照片画出。内层拓扑、铜厚、孔型及完整布线有待实物剖切或板厂资料验证。";
    if (playback.active()) {
      const chip = playback.chip();
      const shell = chip==="ctrl" ? "Pascal" : "NAND "+playback.target().toUpperCase();
      $("mode-name").textContent = confirmed&&chip ? shell+" · 实物封装" : playback.title();
      $("mode-tip").textContent = chip
        ? confirmed ? "只看实物与标准 · 保持当前视点" : playback.transactionTitle()
        : playback.packet();
      $("display-info").textContent = "箭头按讲解节奏移动。PCIe ×4 示例中显示选定 Lane 的走线，Z 向间距随剥层方式变化。";
    }
    $("stack-position").textContent = mode === "explode" ? "展开 · L1–L6" : "L" + n + " / L6";
    $("stack-layer-note").textContent = isViaFocus() ? "保持原位，截取入层孔周围的两片参考铜面。"
      : confirmed && layer > 1 && layer < 6 && mode === "peel"
      ? "这层的铜和孔属于推演，已按证据筛选隐藏。"
      : mode === "explode" ? "各层沿 Z 方向拉开，元件和线路的平面坐标保持一致。上下两层地之间的孔位仍然同轴。" : note;
    $("stack-path-note").hidden = !step;
    $("stack-path-note").textContent = pathNote();
    $("stack-focus").hidden = !step || step === "vias" || step === "route";
    $("stack-clear").hidden = !step;
    $("stack-peel").setAttribute("aria-pressed", String(mode === "peel"));
    $("stack-explode").setAttribute("aria-pressed", String(mode === "explode"));
    $("stack-vias").setAttribute("aria-pressed", String(step === "vias"));
    $("stack-route").setAttribute("aria-pressed", String(step === "route"));
    $("stack-components").checked = components;
    $("stack-dielectric").checked = dielectric;
    $("stack-dielectric").disabled = confirmed || isViaFocus();
    $("stack-components").disabled = isViaFocus();
    $("stack-confirmed").checked = confirmed;
    $("stack-prev-layer").disabled = mode === "peel" && layer === 1;
    $("stack-next-layer").disabled = mode === "peel" && layer === layers.length;
    $("stack-lane").value = String(lane);
    $("stack-direction").value = direction;
    $("stack-target").value = target;
    for (const button of $("stack-layers").children) {
      const value = Number(button.dataset.stackLayer);
      button.setAttribute("aria-pressed", String(mode === "peel" && value === layer));
      button.dataset.removed = String(mode === "peel" && value < layer);
    }
    for (const button of document.querySelectorAll("[data-stack-step]")) {
      button.setAttribute("aria-pressed", String(button.dataset.stackStep === step));
    }
    Object.assign(document.body.dataset, {stackMode:mode, stackLayer:layer, stackStep:step, stackEvidence:confirmed ? "confirmed" : "all"});
    $("stack-manual").hidden = playback.active();
  }

  function layerAt(n) {
    playback.pause(false);
    layer = Math.min(layers.length, Math.max(1, n));
    const refit = mode === "explode";
    if (isViaFocus()) step = "pcie";
    mode = "peel";
    refresh(refit);
  }

  function setStep(name, refocus=false) {
    choose(null);
    confirmed = false;
    step = name;
    if (name === "vias") {
      mode = "explode";
      dielectric = false;
      components = false;
      const pin = all().find(p => p.stack.net === pcieNet() && p.stack.role === "finger");
      const center = box(pin).getCenter(new T.Vector3()).z;
      const candidates = all().filter(p => p.stack.role === "via" && p.stack.layer === 1
        && p.stack.net.startsWith("ground_") && p.stack.site === "edge");
      candidates.sort((a,b) => Math.abs(box(a).getCenter(new T.Vector3()).z-center) - Math.abs(box(b).getCenter(new T.Vector3()).z-center));
      nearestGround = candidates[0].stack.net;
      refresh();
      focusStep();
    } else if (name === "route") {
      mode = "explode";
      refresh(true);
    } else {
      const refit = mode === "explode" || refocus;
      mode = "peel";
      layer = pathLayer[name];
      refresh(refit);
    }
  }

  function focusStep() {
    let selected = all().filter(p => visible(p) && highlighted(p));
    if (step === "edge") selected = selected.filter(p => p.stack.layer === 1);
    if (step === "pcie" || step === "nand") selected = selected.filter(p => p.stack.site === "span");
    if (!selected.length) return;
    const name = {edge:"金手指 · "+pinText(), pcie:"Lane "+lane+" · L3 差分对",
      ctrl:"Pascal · 从 PCIe 到 NAND 总线", nand:"L4 · NAND "+target.toUpperCase()+" 数据与控制",
      vias:"信号孔、反焊盘与地孔"}[step];
    const inspect = {items:selected, group:"", name, description:pathNote(), context:true};
    choose(inspect);
    frame(inspect);
  }

  function tags(annotation, front, focused) {
    const a = (key, title, rail="top", active=false) => annotation(byId(key), title, rail, active);
    if (ssdAssembling()) {
      const at = assembly.progress();
      const p = (id,title,rail="top")=>annotation(partById(id),title,rail);
      return [
        at>.07 && p("top_film","正面标签"),
        at>.30 && p("U_CTRL_body","Pascal 主控"),
        at>.30 && p("U_DRAM_body","LPDDR4"),
        at>.30 && p("U_N1_body","NAND A"),
        at>.30 && p("U_N2_body","NAND B"),
        at>.33 && p("bottom_cu","背标铜箔","bottom")
      ];
    }
    if (system) {
      const h = (key,title,rail="top",active=false) => annotation(hostPart(key), title, rail, active);
      if (assembly.active()) {
        const at = assembly.progress();
        return [
          at>.08 && h("cad_retaining_screw","固定螺钉"),
          at>.31 && h("cad_spreader","散热片"),
          at>.51 && h("cad_thermal_pad","导热垫"),
          at>.71 && annotation(partById("m2_core"),"990 PRO SSD","bottom"),
          h("cad_socket","JSSD1 插座","bottom")
        ];
      }
      const chip = playback.chipAnchor();
      if (chip && !systemProof) return [annotation(chip,chip.label,"top",true)];
      const actor = playback.hostAnchor();
      if (playback.scope()==="memory" && actor && !systemProof)
        return [annotation(actor,actor.label,"top",true)];
      if (playback.scope()==="ssd") return [a("U_CTRL_outline","Pascal"),a("U_N"+(playback.target()==="a" ? "1" : "2")+"_outline","NAND "+playback.target().toUpperCase())];
      return [h("cad_socket","JSSD1 · 正面主槽","top",playback.scope()==="socket"),
        playback.scope()==="mainboard" ? h("host_root","SoC · 根端口","bottom") : h("cad_post","2280 固定端")];
    }
    if (playback.active()) {
      if (focused) {
        const part = playback.chipAnchor();
        return part && !confirmed ? [annotation(part,part.label,"top",true)] : [];
      }
      const host = playback.hostAnchor() || byId("io_host_ram");
      return [annotation(host,host.label,"top",host.id!=="stack_io_host_ram"),
        a("U_CTRL_outline","Pascal 主控"),
        a("U_N"+(playback.target()==="a" ? "1" : "2")+"_outline","NAND "+playback.target().toUpperCase())];
    }
    if (step === "vias" && mode === "explode") {
      return [a(pcieNet()+"_edge_via_1","两根信号孔","top",true),
        a(nearestGround+"_edge_via_5","地孔接 L5","bottom",true)];
    }
    if (focused) return [];
    if (showLogic()) return [a("on_asic_host_macro","PCIe PHY"),
      a("on_asic_nand_macro","NAND 控制器",mode==="explode" ? "top" : "bottom"),
      a("U_N"+(target==="a" ? "1" : "2")+"_outline","NAND "+target.toUpperCase())];
    const anchors = [a("U_CTRL_outline","Pascal"), a("U_N1_outline","NAND A"), a("U_N2_outline","NAND B")];
    if (mode === "explode") return [];
    if ((layer === 1 && front) || !front) return [
      a(front ? "m2_pin_43" : "m2_pin_50",front ? "M.2 金手指" : "M.2 背面针位","bottom"),
      ...anchors
    ];
    if (layer === 2 || layer === 5) {
      return [a("ground_plane_"+layer,"L"+layer+" · 接地参考面","bottom"), ...anchors];
    }
    if (layer === 3) return [a(pcieNet()+"_pair","L3 · 差分走线","bottom",!!step), ...anchors];
    if (layer === 4) return [a(nandNet()+"_0","L4 · NAND 总线","bottom",!!step), ...anchors];
    return [a("m2_pin_50","#50 · PERST#","bottom"),a("art_vias_bottom","背面孔环","top")];
  }

  function layerLabels() {
    if (ssdAssembling()) {
      if (assembly.progress()<.78 || ssdProof) return [];
      const names = ["元件面","GND","PCIe","NAND","GND","背面"];
      return layers.map(([n,z])=>({
        short:"L"+n,title:"L"+n+" · "+names[n-1],
        point:new T.Vector3(.078,z/1000+assembly.layerOffset(n),-.012)
      }));
    }
    if (mode !== "explode" || isViaFocus()) return [];
    const names = ["元件面","GND","PCIe","NAND","GND","背面"];
    return layers.filter(([n]) => !confirmed || n===1 || n===6).map(([n,z]) => ({
      short:"L"+n, title:"L"+n+" · "+names[n-1],
      point:new T.Vector3(.0775,z/1000+offset({stack:{layer:n}}),-.012)
    }));
  }

  function hash(section, option, destination) {
    setView("stack");
    if (section==="read" || section==="write") {
      const i=Math.max(0,(Number(option)||1)-1);
      playback.start(section,i,undefined,destination);
      return;
    }
    if (section && playback.active()) playback.close(false);
    if (/^[1-6]$/.test(section || "")) layerAt(Number(section));
    else if (section === "explode") $("stack-explode").click();
    else if (option === "a" || option === "b") {
      target = option;
      if (section === "nand" || section === "route") setStep(section);
    } else if (Object.hasOwn(pathLayer, section) || section === "vias" || section === "route") setStep(section);
  }

  function bind() {
    playback.bind();
    assembly.bind();
    for (const [n,z,title] of layers) {
      const button = document.createElement("button");
      const number = document.createElement("b");
      const name = document.createElement("span");
      const height = document.createElement("small");
      number.textContent = "L" + n;
      name.textContent = title;
      height.textContent = z.toFixed(3);
      height.title = "铜层底面 Z（mm）";
      button.dataset.stackLayer = String(n);
      button.type = "button";
      button.append(number,name,height);
      button.onclick = () => layerAt(n);
      $("stack-layers").append(button);
    }
    $("stack-prev-layer").onclick = () => layerAt(mode === "explode" ? layer : layer-1);
    $("stack-next-layer").onclick = () => layerAt(mode === "explode" ? layer : layer+1);
    $("stack-peel").onclick = () => layerAt(layer);
    $("stack-explode").onclick = () => {
      if (mode === "explode" && !isViaFocus()) return;
      if (isViaFocus()) step = "";
      mode = "explode";
      refresh(true);
    };
    $("stack-components").onchange = e => { components = e.target.checked; refresh(); };
    $("stack-dielectric").onchange = e => { dielectric = e.target.checked; refresh(); };
    $("stack-confirmed").onchange = e => {
      confirmed = e.target.checked;
      if (playback.chip()) {
        playback.pause(false);
        refresh();
      } else if (confirmed) { step = ""; layerAt(1); } else refresh();
    };
    $("stack-io-auto").onchange = e => {
      followChip = e.target.checked;
      if (followChip) trackChip(true);
      else cameraScope = "";
    };
    $("system-overview").onclick = () => {
      playback.pause();
      if (assembly.active()) assembly.pause();
      choose(null);
      cameraScope = "inspection";
      frame();
    };
    $("system-slot").onclick = () => {
      playback.pause();
      cameraScope = "inspection";
      if (assembly.focus(frame)) return;
      systemFrame("socket",frame,true);
    };
    $("system-explode").onclick = () => assembly.active() ? closeAssembly() : openAssembly();
    for (const button of document.querySelectorAll("[data-ssd-stage]")) {
      button.onclick = () => assembly.scrub(Number(button.dataset.ssdStage)/100);
    }
    $("ssd-explode-proof").onchange = e => { ssdProof = e.target.checked; refresh(); };
    $("ssd-explode-dielectric").onchange = e => { ssdDielectric = e.target.checked; refresh(); };
    $("system-spreader").onchange = e => { spreader = e.target.checked; refresh(); };
    $("system-confirmed").onchange = e => {
      systemProof = e.target.checked;
      playback.pause(false);
      refresh(false);
    };
    document.querySelectorAll("[data-stack-step]").forEach(button => {
      button.onclick = () => setStep(button.dataset.stackStep, true);
    });
    const changed = () => step ? setStep(step, true) : sync(true);
    $("stack-lane").onchange = e => { lane = Number(e.target.value); changed(); };
    $("stack-direction").onchange = e => { direction = e.target.value; changed(); };
    $("stack-target").onchange = e => { target = e.target.value; changed(); };
    $("stack-focus").onclick = focusStep;
    $("stack-route").onclick = () => setStep("route");
    $("stack-vias").onclick = () => setStep("vias");
    $("stack-clear").onclick = () => { step = ""; refresh(true); };
  }

  return {show,showSystem,showSsdAssembly,ssdAssembling,useView,offset,color,colorSsdAssembly,sync,tags,layerLabels,hash,bind,evidence,
    isExploded: () => !peeled(), isViaFocus, drawPlayback:playback.draw, play:playback.start,
    pause:()=>{playback.pause();if(assembly.active())assembly.pause();},
    openAssembly,openSsdAssembly,closeAssembly,focusAssembly:assembly.focus,drawAssembly:assembly.guides,
    enter:()=>{if (playback.active() && followChip) trackChip(true);}};
};
