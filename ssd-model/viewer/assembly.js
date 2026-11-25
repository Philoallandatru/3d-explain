"use strict";
window.createAssemblyExplode = function ({T, $, parts, partById, box, project, svg, draw, layerChange}) {
  // Metres in the registered SSD axes. The socket and standoff stay on the host PCB.
  const hostLayers = [
    {id:"screw", start:0, end:.24, rise:.053},
    {id:"spreader", start:.15, end:.52, rise:.039},
    {id:"pad", start:.34, end:.65, rise:.026},
    {id:"card", start:.76, end:1, rise:.014}
  ];
  const pcbStart = .58, copperPitch = .0065;
  const pcbRoles = new Set(["art","finger","finish","trace","via","plane","dielectric","ball","component_cap"]);
  const isSsdLayer = p => p.view==="stack" && pcbRoles.has(p.stack.role);
  const ssdLayers = [
    {id:"top_label", start:0, end:.25, rise:.031},
    {id:"back_adhesive", start:.04, end:.41, rise:-.0345},
    {id:"back_copper", start:.04, end:.42, rise:-.041},
    {id:"back_label", start:.01, end:.40, rise:-.049},
    {id:"packages", start:.18, end:.49, rise:.018},
    {id:"passives", start:.33, end:.58, rise:.009},
    ...Array.from({length:6},(_,i)=>({id:"layer_"+(i+1),start:pcbStart,end:1,rise:-i*copperPitch})),
    ...Array.from({length:5},(_,i)=>({id:"ply_"+(i+1),start:pcbStart,end:1,rise:-(i+.5)*copperPitch}))
  ];
  const recipes = {
    system:{layers:hostLayers, anchors:["fw_cad_socket","fw_cad_post"], duration:3600,
      phases:[[.19,"固定螺钉"],[.40,"热扩散片"],[.58,"导热垫"],[1,"SSD 与插槽"]]},
    "ssd-explode":{layers:ssdLayers, anchors:["m2_core"], duration:4200,
      phases:[[.20,"正背标签"],[.36,"芯片封装"],[pcbStart,"周边器件"],[1,"PCB 铜层"]]}
  };
  const pivotAxis = new T.Vector3(0,0,1);
  const tilt = new T.Group().quaternion;
  const offset = new T.Vector3();
  const registrations = new Map();
  let registration = null;
  let view = "system";
  let open = false;
  let progress = 0;
  let destination = 1;
  let request = 0;

  function smooth(value, start, end) {
    const t = Math.min(1,Math.max(0,(value-start)/(end-start)));
    return t*t*(3-2*t);
  }

  function groupOf(part) {
    if (view==="system") {
      if (part.view==="physical") return "card";
      return part.view==="system" ? part.stack.explode : undefined;
    }
    if (isSsdLayer(part)) return (part.stack.role==="dielectric" ? "ply_" : "layer_")+part.stack.layer;
    if (part.view!=="physical") return "";
    if (part.group==="top_label") return "top_label";
    if (part.group==="bottom_label") {
      if (part.id==="bottom_adh") return "back_adhesive";
      return part.id==="bottom_cu" ? "back_copper" : "back_label";
    }
    if (["controller","dram","nand"].includes(part.group) || part.id.startsWith("U_PWR_")) return "packages";
    return ["power","passives"].includes(part.group) ? "passives" : "";
  }

  const layersVisible = () => view==="ssd-explode" && progress>pcbStart;
  const layerOffset = n => -(n-1)*copperPitch*smooth(progress,pcbStart,1);

  function register() {
    const recipe = recipes[view];
    const envelope = new T.Box3();
    for (const key of recipe.anchors) envelope.union(box(partById(key)));
    const groups = recipe.layers.map(layer=>{
      const bounds = new T.Box3();
      const members = parts.filter(p=>groupOf(p)===layer.id).map(p=>{
        bounds.union(box(p));
        return {obj:p.obj, position:p.obj.position.clone(), quaternion:p.obj.quaternion.clone()};
      });
      if (!members.length) throw new Error("装配模型缺少展开部件 "+layer.id);
      envelope.union(bounds);
      const slide = layer.id==="card" ? .007 : 0;
      // The lifted tail clears the support before the card leaves the slot.
      const rise = layer.rise+(layer.id==="card" ? .002 : 0);
      envelope.union(bounds.clone().translate(new T.Vector3(slide,rise,0)));
      return {...layer,members};
    });
    return {groups,envelope};
  }

  function stage() {
    if (progress===0) return "已合拢";
    if (progress===1) return "已展开";
    return recipes[view].phases.find(([end])=>progress<end)[1];
  }

  function sync() {
    const percent = String(Math.round(progress*100));
    const label = stage();
    const action = request ? "暂停" : progress===1 ? "重播" : progress===0 ? "播放" : "继续";
    $("assembly-control").hidden = !open;
    if ($("assembly-position").value!==percent) $("assembly-position").value = percent;
    if ($("assembly-percent").value!==percent+"%") $("assembly-percent").value = percent+"%";
    if ($("assembly-stage").textContent!==label) $("assembly-stage").textContent = label;
    if ($("assembly-play").textContent!==action) $("assembly-play").textContent = action;
    $("assembly-collapse").disabled = !progress && !request;
    document.body.dataset.assemblyOpen = String(open);
    document.body.dataset.assemblyView = open ? view : "";
    document.body.dataset.assemblyLayers = String(open && layersVisible());
    document.body.dataset.assemblyPlaying = String(!!request);
    document.body.dataset.assemblyProgress = percent;
  }

  function seek(value) {
    const hadLayers = layersVisible();
    progress = value;
    const pitch = .099*(smooth(value,.56,.69)-smooth(value,.82,1));
    tilt.setFromAxisAngle(pivotAxis,pitch);
    for (const group of registration.groups) {
      const card = group.id==="card";
      offset.set(card ? .007*smooth(value,.67,.81) : 0,
        group.rise*smooth(value,group.start,group.end),0);
      for (const {obj,position,quaternion} of group.members) {
        obj.position.copy(position);
        obj.quaternion.copy(quaternion);
        if (card) {
          obj.position.applyQuaternion(tilt);
          obj.quaternion.premultiply(tilt);
        }
        obj.position.add(offset);
      }
    }
    sync();
    if (open && hadLayers!==layersVisible()) layerChange();
    draw();
  }

  function stop() {
    if (request) cancelAnimationFrame(request);
    request = 0;
  }

  function pause() {
    stop();
    sync();
  }

  function play(to) {
    stop();
    destination = to;
    if (progress===to || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      seek(to);
      return;
    }
    const from = progress;
    const duration = recipes[view].duration;
    let started = null;
    const tick = now=>{
      started ??= now;
      const fraction = Math.min(1,(now-started)/(duration*Math.abs(to-from)));
      request = fraction<1 ? requestAnimationFrame(tick) : 0;
      seek(fraction===1 ? to : from+(to-from)*fraction);
    };
    request = requestAnimationFrame(tick);
    sync();
  }

  function enter(next="system") {
    if (open) return false;
    view = next;
    if (!registrations.has(view)) registrations.set(view,register());
    registration = registrations.get(view);
    open = true;
    destination = 1;
    seek(0);
    return true;
  }

  function exit() {
    if (!open) return false;
    stop();
    open = false;
    seek(0);
    return true;
  }

  function focus(move) {
    if (!open) return false;
    move({bounds:registration.envelope,assembly:view,context:true});
    return true;
  }

  function guides(layer) {
    if (!open || progress<.05) return;
    const ssd = view==="ssd-explode";
    const lines = ssd ? [[.018,-.041*smooth(progress,.04,.42),.031*smooth(progress,0,.25)],
      [.071,-.041*smooth(progress,.04,.42),.031*smooth(progress,0,.25)]] :
      [[.080,0,.053*smooth(progress,0,.24)],[.001,0,.039*smooth(progress,.15,.52)]];
    for (const [x,low,high] of lines) {
      if (high-low<.002) continue;
      const base = project(new T.Vector3(x,low,-.011));
      const top = project(new T.Vector3(x,high,-.011));
      svg("line",{x1:base.x,y1:base.y,x2:top.x,y2:top.y,class:"assembly-datum"},layer);
    }
  }

  function scrub(value) {
    stop();
    destination = 1;
    seek(value);
  }

  function bind() {
    $("assembly-play").onclick = ()=>{
      if (request) return pause();
      if (progress===1) {
        seek(0);
        destination = 1;
      } else if (progress===0) destination = 1;
      play(destination);
    };
    $("assembly-collapse").onclick = ()=>play(0);
    $("assembly-position").oninput = e=>scrub(Number(e.target.value)/100);
    document.addEventListener("visibilitychange",()=>{if (open && document.hidden) pause();});
  }

  return {enter,exit,play,pause,focus,guides,bind,scrub,layersVisible,layerOffset,isSsdLayer,
    active:()=>open,view:()=>open ? view : "",progress:()=>progress};
};

