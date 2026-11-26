"use strict";
window.createStackPlayback = function ({
  T, $, guides, byId, all, visible, box, project, svg, choose, frame, begin, changed, inspected, system, hostPart
}) {
  const name = {read:"读", write:"写"};
  const reasons = JSON.parse($("link-why").textContent);
  const chipReason = {
    addr:"nand-command",row:"wordline",select:"wordline",wordline:"wordline",sense:"sense",page:"page",
    column:"nand-out",program:"verify",nand_rx:"ecc",ecc_word:"ecc",ecc_check:"ecc",ecc_fix:"ecc",
    ecc_encode:"ecc-encode",ecc_out:"ecc",dma_addr:"map",dma_pack:"data-mwr",
  };
  const actors = {
    host_sq:["io_host_sq","主机提交队列 SQ"], host_data:["io_host_data","主机数据缓冲区"],
    host_cq:["io_host_cq","主机完成队列 CQ"], host_root:["io_host_root","主机 PCIe 根端口"],
    host_irq:["io_host_irq","主机中断目标"], host:["on_asic_host_macro","Pascal · PCIe PHY"],
    dma:["on_asic_dma_macro","Pascal · DMA"], ftl:["on_asic_ftl_macro","Pascal · FTL"],
    ecc:["on_asic_ecc_macro","Pascal · ECC"], sram:["on_asic_sram_macro","Pascal · 工作缓冲"],
    nand:["on_asic_nand_macro","Pascal · NAND 控制器"]
  };
  const flashActors = {
    addr:["addr","锁存行地址","DQ 先送命令和地址。行地址用于选择块与页，列地址用于决定从页缓冲的哪里起读。"],
    row:["row","译码选块与字线","行译码把块和页地址转换为阵列控制信号。图中指定一个示例字线。"],
    select:["select","打开所选串的选择栅","点亮后方串组的 SGD 与 SGS。它们把这一组沟道接到各自的位线和共源线。"],
    wordline:["wordline","选中字线 WL2","申请所读逻辑页对应的比较条件。示例把 WL2 高亮，其余字线给被选串提供 Vpass。"],
    sense:["sense","并行感测位线","感测电路观察所选串在参考阈值下的位线响应。TLC 的一个逻辑页可能需要多次参考电压比较。"],
    page:["page","页缓冲","感测后的原始位在并行锁存器中暂存。主机请求的 4 KiB 和 NAND 物理页各有自己的尺寸。"],
    column:["column","列选择","列复用器用列偏移从页缓冲中取所需区间，交给 NAND 的 I/O。"],
    io:["io","器件 I/O","NAND 的 DQ 复用命令、地址和数据。输出读数据时由 NAND 驱动 DQ 和读选通。"],
    program:["wordline","编程与读回验证","编程从页缓冲取数，按所选字线施加编程脉冲并验证单元阈值。"]
  };
  const chipActors = {
    nand_rx:["on_asic_nand_macro","NAND PHY 采样","主控按 NAND 的读选通采样 DQ，取出原始数据和对应的纠错冗余。"],
    ecc_word:["io_ecc_word","ECC 收到码字","图中的 7 位偶校验汉明码只是例子。读到 0110111，其中第 5 位相对有效码字翻转。"],
    ecc_check:["io_ecc_check","计算校验综合征","检查重叠的三组偶校验，得到二进制 101，指出示例第 5 位发生错误。"],
    ecc_fix:["io_ecc_fix","纠正并复核","将示例第 5 位恢复为 0，得到 0110011。复核通过后交出数据，无可纠正结果时需要重读或报错。"],
    ecc_encode:["on_asic_ecc_macro","ECC 编码","写入示例先为数据生成可用于将来读回和纠错的冗余，再交给 NAND 写入路径。"],
    ecc_out:["on_asic_sram_macro","纠错后进入工作缓冲","这条示例路径把纠错成功的数据交给主控工作缓冲，供 DMA 送往主机。"],
    dma_addr:["io_dma_addr","DMA 取主机缓冲地址","DMA 采用命令给出的数据指针。在示例的页首对齐条件下，PRP1 指向此次传输的 4 KiB 缓冲区。"],
    dma_pack:["io_dma_pack","向 PCIe 提交写数据","将工作缓冲里的数据交给 PCIe 事务层。一次 4 KiB 逻辑读取可以对应多笔 posted Memory Write。"]
  };
  const directionLabel = {host:"主机内存内", down:"主机 → SSD", up:"SSD → 主机",
    dram:"主控内部处理", nand_out:"主控 → NAND", nand_in:"NAND → 主控"};
  const colors = {photo:"#2e8f78", standard:"#407cd3", model:"#c77822"};
  const output = $("stack-io-flights");
  let trailLayer, markerLayer;
  let operation = "", index = 0, position = 0, lane = 0, nand = "a";
  let legs = [], pickedPins = [], stageVisible = false, onlyConfirmed = false;
  let progress = 0, playing = false, request = 0, lastTime = 0;
  let currentParts = new Set(), travelled = new Set(), batch = new Set();
  const active = () => !!operation;
  const current = () => guides[operation]?.[index];
  const leg = () => legs[position];
  const chip = () => leg()?.chip || "";
  const scope = () => leg() ? leg().scope || "ssd" : "";
  const transactionTitle = () => name[operation]+" 4 KiB · "+current().title;
  const net = () => "nand_" + nand;
  const mark = (ref, mm) => ({ref, point:new T.Vector3(mm[0]/1000, mm[2]/1000, -mm[1]/1000)});

  function top(ref) {
    const bounds = box(ref);
    const point = bounds.getCenter(new T.Vector3());
    point.y = bounds.max.y + .000035;
    return {ref,point:ref.obj.worldToLocal(point)};
  }

  function actor(key, step) {
    if (Object.hasOwn(flashActors,key)) {
      const [id,label,description] = flashActors[key];
      const ref = byId("io_" + net() + "_" + id);
      let detail = description;
      if (operation==="write" && key==="page") detail = "输入数据与纠错冗余在编程开始前先装入 NAND 页缓冲。";
      if (operation==="write" && key==="column") detail = "列地址决定往页缓冲中放入数据的起始位置。";
      if (key==="io" && step.direction==="nand_out") detail = operation==="read"
        ? "器件在 DQ 上接收读页命令和地址，命令与地址周期由各自的控制信号区分。"
        : "器件用主控送来的选通采样写入数据，随后装入页缓冲。";
      const refs = [ref,...all().filter(p=>p!==ref && p.stack.net===net() && p.stack.actor===id)];
      refs.push(byId("U_N" + (nand==="a" ? "1" : "2") + "_outline"));
      return {ref,refs,title:"NAND "+nand.toUpperCase()+" · "+label,point:top(ref),chip:"flash",detail};
    }
    if (Object.hasOwn(chipActors,key) || (key==="host" && step?.through.includes("dma_pack"))) {
      const tx = key==="host";
      const [id,title,detail] = tx
        ? ["on_asic_phy_"+lane+"_driver","PCIe Lane "+lane+" · TX 串化与驱动",
           "PCIe 前端把并行数据送给发送串化器和差分驱动器。图中点亮被选 Lane 的发送截面，主机链路为 ×4。"]
        : chipActors[key];
      const ref = byId(id);
      const refs = [ref,...all().filter(p=>p!==ref && p.stack.site==="ctrl" && p.stack.actor===(tx ? "tx_"+lane : key))];
      return {ref,refs,title:"Pascal · "+title,point:top(ref),chip:"ctrl",detail};
    }
    const [id,title] = actors[key];
    const host = system() && key.startsWith("host_");
    const ref = host ? hostPart(key) : byId(id);
    if (host) return {ref,title,point:top(ref),scope:key==="host_root" ? "mainboard" : "memory"};
    return {ref,title,point:top(ref)};
  }

  function section(title, refs, paths, layer=1, kind="model", guide=false, where="") {
    return {title,refs,paths,layer,kind,guide,where:where || "L"+layer};
  }

  function paths(ref) {
    return ref.stack.paths_mm.map(path => path.map(mm => mark(ref, mm)));
  }

  function flashMotion(key, previous) {
    const wire = (name,i=0) => paths(byId("io_"+net()+"_"+name))[i];
    const col = 3;
    if (key==="addr") return wire("io_addr");
    if (key==="row") return wire("addr_row");
    if (key==="wordline") return wire("row_wl");
    if (key==="sense") return [...wire("bl",col),...wire("bl_drop",col)];
    if (key==="page" && previous==="sense") return wire("sense_link",col);
    if (key==="column" && previous==="page") return wire("page_to_mux",col);
    if (key==="page" && previous==="column") return wire("page_to_mux",col).slice().reverse();
    if (key==="io" && previous==="column") return wire("io_bus");
    if (key==="column" && previous==="io") return wire("io_bus").slice().reverse();
    return null;
  }

  function transition(key, site, lowest, positions, title) {
    const refs = Array.from({length:lowest}, (_,i) => byId(key+"_"+site+"_via_"+(i+1)));
    const beams = positions.map(i => refs.flatMap((ref,n) => {
      const [x,y,low,high] = ref.stack.bores_mm[i];
      const end = n===lowest-1 ? low + .020 : low;
      return [mark(ref,[x,y,high]),mark(ref,[x,y,end])];
    }));
    const hop = section(title, refs, beams, lowest,"model",true,"L1 → L"+lowest);
    // In peel mode each way point exposes the correct copper level. The lower
    // stub remains unlit below the target pad in the full exploded model.
    hop.layers = [1,lowest];
    return hop;
  }

  function reversed(hops) {
    return hops.slice().reverse().map(hop => {
      const layerRange = hop.layers?.slice().reverse();
      return {...hop, paths:hop.paths.map(path=>path.slice().reverse()),
        layers:layerRange, where:layerRange ? "L"+layerRange[0]+" → L"+layerRange[1] : hop.where};
    });
  }

  function systemHops(host, root, contacts, fingers) {
    const socket = hostPart("cad_socket");
    const board = hostPart("cad_board");
    const pins = fingers.map(ref=>hostPart("pin_"+ref.stack.pin));
    const pads = pins.map(top);
    const surface = box(board).max.y * 1000 + .18;
    const paths = pads.map((pad,i)=>{
      const landing = pad.ref.obj.localToWorld(pad.point.clone());
      const far = mark(board,[-13-i*.65,-18-i*.65,surface]);
      const near = mark(board,[-6.2,-landing.z*1000,surface]);
      return [root.point,far,near,pad];
    });
    const hops = [];
    if (host.ref!==root.ref) hops.push({...section("主机内存 · 经 SoC 到根端口",
      [host.ref,root.ref],[[host.point,root.point]],1,"model",true,"主机内存 · 功能示意"),
      key:"host_memory",scope:"memory",detail:"队列和缓冲区是主机内存中的逻辑地址。箭头表示请求或数据经过 SoC。"});
    hops.push({...section("主板 · PCIe 根端口与 JSSD1",
      [root.ref,board,socket],paths,1,"model",true,"Framework 主板 · 推演路径"),
      key:"host_link",scope:"mainboard",detail:"原厂原理图给出根端口到插槽的连接。橙色虚线表示连接关系，铜层与线形按原理推演。"});
    hops.push({...section("JSSD1 · 接触针位 "+pinText(),
      [socket,...pins],pads.map((pad,i)=>[pad,contacts[i][0]]),1,"standard",false,"原厂接口图 · JSSD1"),
      key:"host_contact",scope:"socket",detail:"蓝色标出接口图对应的两根触点。半透明外壳为原厂插座几何。"});
    return hops;
  }

  function pcie(step, a, b) {
    const incoming = step.direction === "down";
    const key = "pcie_"+lane+"_"+step.direction;
    const host = incoming ? a : b;
    const phy = incoming ? b : a;
    const root = actor("host_root");
    const fingers = all().filter(p=>p.stack.role==="finger" && p.stack.net===key)
      .sort((x,y)=>x.stack.pin-y.stack.pin);
    pickedPins = fingers.map(p=>p.stack.pin);
    const contacts = fingers.map(ref=>ref.stack.ends_mm.map(mm=>mark(ref,mm)));
    const lead = contacts.map(contact=>[host.point,root.point,contact[0]]);
    const launch = byId(key+"_finger");
    const copper = byId(key+"_pair");
    const fan = byId(key+"_launch");
    const balls = byId(key+"_balls");
    const exit = paths(fan).map((path,i)=>[...path, mark(balls,balls.stack.centres_mm[i]), phy.point]);
    const edgePaths = paths(launch);
    const launchHops = [section("L1 · 卡边扇入",[launch],edgePaths)];
    if (!incoming) {
      const cap = byId(key+"_caps");
      const after = byId(key+"_aftercap");
      const afterPaths = paths(after);
      const across = edgePaths.map((path,i)=>[path.at(-1),afterPaths[i][0]]);
      launchHops.push(section("SSD TX · 串联交流耦合电容",
        [cap,byId(key+"_cap_ends")],across,1,"model",true));
      launchHops.push(section("L1 · 电容与卡边过孔",[after],afterPaths));
    }
    const hostHops = system() ? systemHops(host,root,contacts,fingers) : [
      section("主机侧 · 根端口与插座",[root.ref],lead,1,"model",true,"主机侧示意")];
    const edge = section("M.2 金手指 · "+pinText(),fingers,contacts,1,"standard");
    const hops = [
      ...hostHops,
      system() ? {...edge,key:"card_contact",scope:"socket"} : edge,
      ...launchHops,
      transition(key,"edge",3,[0,1],"卡边过孔"),
      section("L3 · Lane "+lane+" 差分铜线",[copper],paths(copper),3),
      ...reversed([transition(key,"ctrl",3,[0,1],"主控端过孔")]),
      section("L1 · 主控扇入与示意焊球",[fan,balls],exit,1,"model",true)
    ];
    return incoming ? hops : reversed(hops);
  }

  function nandBus(step, a, b) {
    const outbound = step.direction === "nand_out";
    const ctrl = outbound ? a : b;
    const page = outbound ? b : a;
    const key = net();
    const signals = all().filter(p=>p.stack.role==="trace" && p.stack.net===key);
    const signalRefs = site => signals.filter(p=>p.stack.site===site && /^DQ/.test(p.stack.signal));
    const line = [3,6];
    const wires = line.map(i=>byId(key+"_"+i));
    const startBalls = byId(key+"_ctrl_balls"), endBalls = byId(key+"_flash_balls");
    const sample = (site,i) => paths(byId(key+"_"+site+"_"+i))[0];
    const fromCtrl = line.map(i=>[ctrl.point,mark(startBalls,startBalls.stack.centres_mm[i]),...sample("ctrl",i).slice().reverse()]);
    const toFlash = line.map(i=>[...sample("flash",i),mark(endBalls,endBalls.stack.centres_mm[i]),page.point]);
    const cmd = operation==="read" && outbound;
    const refs = site => cmd ? signals.filter(p=>p.stack.site===site &&
      (/^DQ\d$/.test(p.stack.signal) || ["CE#","CLE","ALE","WE#"].includes(p.stack.signal))) : signalRefs(site);
    const hops = [
      section("L1 · 主控 NAND 焊盘",[startBalls,...refs("ctrl")],fromCtrl,1,"model",true),
      transition(key,"ctrl",4,line,"主控侧 NAND 过孔"),
      section("L4 · "+(cmd ? "复用的 DQ 命令与地址" : "DQ 数据与 DQS 选通"),refs("span"),wires.map(p=>paths(p)[0]),4),
      ...reversed([transition(key,"flash",4,line,"闪存侧 NAND 过孔")]),
      section("L1 · NAND "+nand.toUpperCase()+" 焊盘与焊球",[endBalls,...refs("flash")],toFlash,1,"model",true)
    ];
    return outbound ? hops : reversed(hops);
  }

  function plan() {
    const step = current();
    pickedPins = [];
    const nodes = step.through.map(key=>key==="pcie" || key==="nand_bus" ? null : actor(key,step));
    return step.through.flatMap((key,i)=>{
      if (key==="pcie") return pcie(step,nodes[i-1],nodes[i+1]);
      if (key==="nand_bus") return nandBus(step,nodes[i-1],nodes[i+1]);
      const here = nodes[i];
      const before = nodes[i-1];
      const traced = here.chip==="flash" ? flashMotion(key,step.through[i-1]) : null;
      const piloted = traced || (before ? [before.point,here.point] : [here.point]);
      const where = here.chip ? "原位芯片剖视 · L1" : here.scope ? "主机侧 · 功能示意"
        : key.startsWith("host_") ? "主机侧示意" : "L1 封装位置 · 功能示意";
      const refs = [...new Set([...(here.refs || [here.ref]),...(traced || []).map(p=>p.ref)])];
      const node = section(here.title,refs,[piloted],1,"model",!traced,where);
      return [{...node, key, chip:here.chip, scope:here.scope, detail:here.detail}];
    });
  }

  function pinText() {
    return pickedPins.length ? "#"+pickedPins[0]+"− / #"+pickedPins[1]+"+" : "";
  }

  function packet() {
    const arrow = directionLabel[current().direction];
    const pins = pinText();
    const type = current().packet;
    return type + (type.includes(arrow) ? "" : " · " + arrow) + (pins ? " · Lane "+lane+" · "+pins : "");
  }

  function layer() {
    const s = leg();
    return s?.layers ? Math.max(...s.layers) : s?.layer ?? 1;
  }

  function refresh(refit=false) {
    currentParts = new Set(leg()?.refs || []);
    travelled = new Set(legs.slice(0,position).flatMap(s=>s.refs));
    batch = new Set(legs.flatMap(s=>s.refs));
    changed(refit, active() ? layer() : null, chip());
  }

  function intensity(part) {
    if (currentParts.has(part)) return 3;
    if (travelled.has(part)) return 2;
    return batch.has(part) ? 1 : 0;
  }

  function pause(update=true) {
    playing = false;
    if (request) cancelAnimationFrame(request);
    request = 0;
    lastTime = 0;
    if (update && stageVisible) sync(true);
  }

  function toTransaction(n, destination="", refit=false) {
    index = Math.max(0, Math.min(guides[operation].length-1,n));
    legs = plan();
    position = destination==="end" ? legs.length-1 : Math.max(0,legs.findIndex(s=>s.key===destination));
    progress = position>0 || destination==="end" ? 1 : 0;
    refresh(refit);
  }

  function toLeg(n) {
    pause(false);
    if (system() && n<0 && index>0) return toTransaction(index-1,"end");
    if (system() && n>=legs.length && !isLast()) return toTransaction(index+1);
    position = Math.max(0, Math.min(legs.length-1,n));
    progress = 1;
    refresh();
  }

  function isLast() {
    return index===guides[operation].length-1 && position===legs.length-1;
  }

  function tick(now) {
    if (!playing) return;
    const duration = chip() ? 1250 : system() && scope()!=="ssd" ? 1050 : leg().layer>1 || leg().layers ? 720 : 520;
    if (lastTime) progress = Math.min(1,progress+(now-lastTime)/duration);
    lastTime = now;
    draw(false);
    if (progress===1) {
      if (isLast()) {
        pause();
        return;
      }
      if (position===legs.length-1) toTransaction(index+1);
      else {
        position++;
        progress = 0;
        refresh();
      }
    }
    request = requestAnimationFrame(tick);
  }

  function toggle() {
    if (!active()) return;
    if (playing) {
      pause();
      return;
    }
    if (isLast() && progress===1) toTransaction(0);
    playing = true;
    lastTime = 0;
    sync(true);
    request = requestAnimationFrame(tick);
  }

  function options(select, values, value) {
    const signature = values.join("\u001f");
    if (select.dataset.values!==signature) {
      select.replaceChildren(...values.map((title,i)=>new Option(title,String(i))));
      select.dataset.values = signature;
    }
    select.value = String(value);
  }

  function syncReason(segment,filtered) {
    const id=(!filtered&&chipReason[segment.key])||current().why;
    const key=reasons[id+"-"+operation]?id+"-"+operation:id;
    const reason=reasons[key],panel=$("stack-io-why");
    panel.hidden=!reason;
    if(!reason||panel.dataset.reason===key)return;
    panel.dataset.reason=key;
    $("stack-io-why-title").textContent=reason[0];
    $("stack-io-why-cause").textContent=reason[1];
    $("stack-io-why-case").textContent=reason[2];
    $("stack-io-why-comparison").open=false;
  }

  function sync(on, confirmed=onlyConfirmed) {
    stageVisible = on;
    onlyConfirmed = confirmed;
    if (!on) pause(false);
    const open = on && active();
    $("stack-io").hidden = !on;
    $("stack-io-panel").hidden = !open;
    $("stack-io-close").hidden = !open;
    $("stack-io-transport").hidden = !open;
    for (const b of document.querySelectorAll("[data-stack-io]")) b.setAttribute("aria-pressed",String(open&&b.dataset.stackIo===operation));
    if (!open) {
      trailLayer.replaceChildren();
      markerLayer.replaceChildren();
      document.body.dataset.stackIo = "";
      document.body.dataset.stackIoPlaying = "false";
      document.body.dataset.stackIoChip = "";
      document.body.dataset.stackIoSection = "";
      document.body.dataset.stackIoScope = "";
      return;
    }
    options($("stack-io-transaction"),guides[operation].map((s,i)=>(i+1)+". "+s.title),index);
    options($("stack-io-leg"),legs.map((s,i)=>(i+1)+". "+s.title),position);
    const segment = leg();
    $("stack-io-packet").textContent = packet();
    $("stack-io-location").textContent = segment.where+(confirmed ? " · 只看实物与标准" : "");
    const filtered = confirmed && segment.kind==="model";
    syncReason(segment,filtered);
    $("stack-io-chip-note").hidden = !segment.detail || filtered;
    $("stack-io-chip-note").textContent = segment.detail || "";
    $("stack-io-note").textContent = current().detail.replace("NAND A","NAND "+nand.toUpperCase());
    $("stack-io-lane").value = String(lane);
    $("stack-io-nand").value = nand;
    $("stack-io-play").textContent = playing ? "暂停" : "播放";
    $("stack-io-play").setAttribute("aria-label",playing ? "暂停读写流程" : "播放读写流程");
    $("stack-io-prev").disabled = position===0 && (!system() || index===0);
    $("stack-io-next").disabled = position===legs.length-1 && (!system() || isLast());
    $("stack-io-prev-transaction").disabled = index===0;
    $("stack-io-next-transaction").disabled = index===guides[operation].length-1;
    $("stack-io-focus").disabled = (system() && filtered) || !segment.refs.some(visible);
    $("stack-io-tally").textContent = (index+1)+"/"+guides[operation].length+" · "+(position+1)+"/"+legs.length+" 段";
    Object.assign(document.body.dataset, {stackIo:operation, stackIoTransaction:index+1,
      stackIoLeg:position+1, stackIoLayer:segment.where, stackIoPlaying:String(playing),
      stackIoChip:chip(), stackIoSection:segment.key || "", stackIoScope:scope()});
  }

  function draw(updateTrail=true) {
    if (!stageVisible || !active()) return;
    if (updateTrail) {
      trailLayer.replaceChildren();
      for (const crossed of legs.slice(0,position)) {
        if (!system() || (crossed.scope || "ssd")===scope()) drawSection(crossed,false,trailLayer);
      }
    }
    markerLayer.replaceChildren();
    drawSection(leg(),true,markerLayer);
  }

  function drawSection(segment, moving, surface) {
    if (onlyConfirmed && segment.kind==="model" && system()) return;
    if (!segment.refs.some(visible)) return;
    const color = colors[segment.kind];
    const group = svg("g",moving ? {"data-phase":segment.title,"data-evidence":segment.kind} : {"data-trail":segment.kind},surface);
    for (const path of segment.paths) {
      const route = path.filter(p=>visible(p.ref)).map(p=>p.ref.obj.localToWorld(p.point.clone()));
      if (!route.length) continue;
      const flat = route.map(project);
      if (flat.length===1) {
        if (!moving) continue;
        const {x,y}=flat[0];
        svg("circle",{cx:x,cy:y,r:6+progress*5,fill:"none",stroke:color,"stroke-width":2,opacity:1-progress*.5},group);
        svg("circle",{cx:x,cy:y,r:3.8,fill:color},group);
        continue;
      }
      svg("polyline",{points:flat.map(p=>p.x+","+p.y).join(" "),stroke:color,
        class:"io-flight"+(segment.guide?" io-flow-logic":""),opacity:moving?.86:.52},group);
      if (!moving) continue;
      const lengths=route.slice(1).map((p,i)=>p.distanceTo(route[i]));
      let distance = lengths.reduce((a,b)=>a+b,0)*Math.min(.98,Math.max(.02,progress));
      for (let i=0;i<lengths.length;i++) {
        const size = lengths[i];
        if (distance>size || size<1e-8) {
          distance -= size;
          continue;
        }
        const a=flat[i], b=flat[i+1], u=distance/size;
        const x=a.x+(b.x-a.x)*u, y=a.y+(b.y-a.y)*u;
        const angle = Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
        svg("polygon",{points:"6,0 -5,-3.7 -3.5,0 -5,3.7",fill:color,class:"io-arrow",
          transform:"translate("+x+" "+y+") rotate("+angle+")"},group);
        break;
      }
    }
  }

  function start(kind, first=0, inspectLane, destination="") {
    if (!Object.hasOwn(name,kind)) return;
    reset();
    if (inspectLane>=0 && inspectLane<=3) lane = Number(inspectLane);
    begin();
    operation = kind;
    toTransaction(first,destination,true);
  }

  function reset() {
    pause(false);
    operation = "";
    legs = [];
    currentParts.clear();
    travelled.clear();
    batch.clear();
  }

  function close(refit=true) {
    reset();
    refresh(refit);
  }

  function focus() {
    pause();
    const s = leg();
    const items = s.refs.filter(visible);
    if (!items.length) return;
    const selection = {items,group:"",name:s.title,description:s.detail||packet(),context:true,chip:s.chip};
    choose(selection);
    frame(selection);
    inspected();
  }

  function bind() {
    trailLayer = svg("g",{},output);
    markerLayer = svg("g",{},output);
    for (const button of document.querySelectorAll("[data-stack-io]")) button.onclick=()=>start(button.dataset.stackIo);
    $("stack-io-close").onclick=()=>close();
    $("stack-io-play").onclick=toggle;
    $("stack-io-why-comparison").querySelector("summary").onclick=()=>{
      if(!$("stack-io-why-comparison").open)pause();
    };
    $("stack-io-prev").onclick=()=>toLeg(position-1);
    $("stack-io-next").onclick=()=>toLeg(position+1);
    $("stack-io-leg").onchange=e=>toLeg(Number(e.target.value));
    const turn=n=>{pause(false);toTransaction(n);};
    $("stack-io-prev-transaction").onclick=()=>turn(index-1);
    $("stack-io-next-transaction").onclick=()=>turn(index+1);
    $("stack-io-transaction").onchange=e=>turn(Number(e.target.value));
    $("stack-io-focus").onclick=focus;
    const retarget=()=>{
      pause(false);
      legs=plan();
      position=Math.min(position,legs.length-1);
      refresh();
    };
    $("stack-io-lane").onchange=e=>{lane=Number(e.target.value);retarget();};
    $("stack-io-nand").onchange=e=>{nand=e.target.value;retarget();};
    document.addEventListener("visibilitychange",()=>{if (document.hidden) pause();});
  }

  return {active, start, close, reset, pause, bind, sync, intensity, draw, layer, scope,
    title:()=>chip() ? leg().title : transactionTitle(), transactionTitle,
    packet, target:()=>nand, chip, operation:()=>operation,
    chipAnchor:()=>chip() ? leg().refs[0] : null,
    hostAnchor:()=>leg()?.refs.find(p=>["io","host_actor"].includes(p.stack.role) && p.stack.site==="host")};
};
