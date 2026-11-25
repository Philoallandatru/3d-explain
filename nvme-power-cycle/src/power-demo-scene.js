import {
  Box3, BoxGeometry, CatmullRomCurve3, Color, ConeGeometry, DirectionalLight, GridHelper, Group,
  HemisphereLight, Mesh, MeshBasicMaterial, OrthographicCamera, Raycaster, RingGeometry, Scene,
  SphereGeometry, TubeGeometry, Vector2, Vector3, WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { signalKinds } from './content/power-demo-flow'

export const actorLabels = {
  supply:'主板 3.3 V', root:'PCIe 根端口', socket:'JSSD1 插槽', pmic:'SSD 供电区',
  platform:'平台电源与复位', clockSource:'平台参考时钟',
  phy:'SSD PHY', ctrl:'NVMe 主控', nand:'NAND', cpu:'主机 CPU / OS',
  uefi:'UEFI', tpm:'TPM', memory:'主机缓冲区', sq:'主机 SQ', cq:'主机 CQ',
  ftl:'FTL', nandCtrl:'主控 NAND 接口', ecc:'ECC', dma:'DMA',
  nandIo:'NAND I/O', nandAddr:'行地址', nandRow:'行译码', nandWl:'选中字线',
  nandSense:'感测放大器', nandPage:'页缓冲', nandCol:'列选择',
  hostTx:'SSD RX · #47/49',driveTx:'SSD TX · #41/43',
  perst:'PERST# · #50',clkreq:'CLKREQ# · #52',refclk:'REFCLK · #53/55',powerPin:'3.3 V · #2/4',
}

const contacts = {
  hostTx:[47,49], driveTx:[41,43], perst:[50], clkreq:[52], refclk:[53,55], powerPin:[2,4],
}

const CAMERA = new Vector3(-.22, 1.55, 1.02).normalize()
const TICK_MS = 2050
const pulseGeometry = new SphereGeometry(.00145, 12, 8)
const arrowGeometry = new ConeGeometry(.0021, .0049, 12)
const Y = new Vector3(0, 1, 0)
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function disposeModel(model) {
  const geometries = new Set(), materials = new Set()
  model.traverse(object => {
    if (object.geometry) geometries.add(object.geometry)
    for (const material of [object.material].flat()) if (material) materials.add(material)
  })
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
}

export function createPowerScene(mount, labels, {onEnd,onPick}) {
  const scene = new Scene()
  const renderer = new WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))
  renderer.setClearColor(0,0)
  const canvas = renderer.domElement
  canvas.tabIndex = 0
  canvas.setAttribute('aria-label','NVMe 三维主板与 SSD。拖动旋转，滚轮或双指缩放。')
  mount.append(canvas)
  scene.add(new HemisphereLight(0xe6f1ff,0x7e8cac,2.2))
  for (const [x,y,z,intensity] of [[-.45,.7,.55,2.3],[.45,.35,-.7,1.0]]) {
    const light=new DirectionalLight(0xffffff,intensity)
    light.position.set(x,y,z)
    scene.add(light)
  }
  const grid = new GridHelper(.52, 40, 0x284075, 0x1d315e)
  grid.position.set(.052,-.0105,.056)
  grid.material.transparent = true
  grid.material.opacity = .65
  scene.add(grid)
  const camera = new OrthographicCamera(-1,1,1,-1,.0001,3)
  camera.position.set(.028,.30,.25)
  const controls = new OrbitControls(camera,canvas)
  controls.minZoom=.42
  controls.maxZoom=13
  controls.screenSpacePanning=true
  controls.enablePan=true

  const flow = new Group()
  scene.add(flow)
  const ray = new Raycaster()
  const cursor = new Vector2()
  const points = new Map(), chips = new Map()
  const physicalController = [], cutawayController = [], physicalNand = [], cutawayNand = []
  let model, views, pointer, tween, curve, pulse, arrow, lastShot
  let shots = new Map()
  let destroyed=false, frameId=0, width=1, height=1, span=.205, shotWidth=.20
  let stepRef, eventRef, tagRefs=[], running=false, time=0, lastTime=0

  function drawSoon() {
    if (!destroyed && !frameId) frameId=requestAnimationFrame(draw)
  }

  function projection() {
    const aspect=width/height
    const fit=Math.max(span,shotWidth/aspect)
    camera.left=-fit*aspect/2
    camera.right=fit*aspect/2
    camera.top=fit/2
    camera.bottom=-fit/2
    camera.updateProjectionMatrix()
  }

  function resize() {
    width=Math.max(1,mount.clientWidth)
    height=Math.max(1,mount.clientHeight)
    renderer.setSize(width,height,false)
    projection()
    drawSoon()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(mount)
  controls.addEventListener('change',drawSoon)
  controls.addEventListener('start',()=>{tween=null})

  function focus(key='board', immediate=false) {
    const shot=shots.get(key)
    if (!shot) return
    lastShot=key
    const {target,h,w}=shot
    const eye=target.clone().addScaledVector(CAMERA,.36)
    const fromSpan=Math.max(span,shotWidth/(width/height))/camera.zoom
    camera.zoom=1
    if (immediate || reducedMotion()) {
      camera.position.copy(eye)
      controls.target.copy(target)
      span=h
      shotWidth=w
      tween=null
      controls.update()
      projection()
    } else {
      tween={fromEye:camera.position.clone(),fromTarget:controls.target.clone(),fromSpan,
        eye,target,h,w,start:null}
      span=fromSpan
      shotWidth=0
      projection()
    }
    drawSoon()
  }

  function moveCamera(now) {
    if (!tween) return
    tween.start ??= now
    const u=Math.min(1,(now-tween.start)/390)
    const ease=u*u*(3-2*u)
    const nextSpan=Math.max(tween.h,tween.w/(width/height))
    camera.position.lerpVectors(tween.fromEye,tween.eye,ease)
    controls.target.lerpVectors(tween.fromTarget,tween.target,ease)
    span=tween.fromSpan+(nextSpan-tween.fromSpan)*ease
    controls.update()
    if (u===1) {
      span=tween.h
      shotWidth=tween.w
      tween=null
    }
    projection()
  }

  function labelFrame(topSide) {
    const area=new Vector3()
    for (const tag of tagRefs) {
      const {element,point}=tag
      area.copy(point).project(camera)
      const visible = topSide && area.z>=-1 && area.z<=1 && Math.abs(area.x)<.95 && Math.abs(area.y)<.84
      element.hidden=!visible
      if (visible) {
        tag.width??=element.offsetWidth+8
        const x=(area.x+1)*width/2
        const alignLeft=x>tag.width && (x+tag.width>width || element.hasAttribute('data-tail'))
        element.toggleAttribute('data-align-left',alignLeft)
        element.style.left=x+'px'
        element.style.top=(1-area.y)*50+'%'
      }
    }
  }

  function updatePulse() {
    if (!pulse || !curve) return
    const ratio=running || time ? Math.max(.04,Math.min(.97,time/TICK_MS)) : .46
    pulse.position.copy(curve.getPointAt(ratio))
    arrow.position.copy(curve.getPointAt(Math.min(.98,ratio+.045)))
    arrow.quaternion.setFromUnitVectors(Y,curve.getTangentAt(Math.min(.98,ratio+.045)).normalize())
  }

  function draw(now) {
    frameId=0
    if (destroyed) return
    moveCamera(now)
    let done=false
    if (running && eventRef) {
      if (lastTime) time+=now-lastTime
      lastTime=now
      updatePulse()
      if (time>=TICK_MS) {
        running=false
        lastTime=0
        done=true
      }
    }
    const topSide=camera.position.y>=controls.target.y
    flow.visible=topSide
    renderer.render(scene,camera)
    labelFrame(topSide)
    if (done) onEnd()
    if (running || tween) drawSoon()
  }

  function material(color, opacity=1) {
    return new MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1})
  }

  function placeActor(id, point, size) {
    points.set(id,point)
    if (!size) return
    const marker = new Mesh(new BoxGeometry(size[0],.00065,size[1]),material(0x36588a,.84))
    marker.position.copy(point).add(new Vector3(0,-.0010,0))
    scene.add(marker)
    marker.visible=false
    chips.set(id,marker)
  }

  function top(name, clearance=.0014) {
    const object=model.getObjectByName(name)
    const bounds=new Box3().setFromObject(object)
    const center=bounds.getCenter(new Vector3())
    center.y=bounds.max.y+clearance
    return center
  }

  function indexAssembly() {
    model.traverse(node=>{
      if (node.userData.view==='mounted') cutawayController.push(node)
      if (node.userData.view==='physical' && node.userData.group==='controller') physicalController.push(node)
      if (node.name.startsWith('stack_io_nand_a_')) cutawayNand.push(node)
      if (node.name==='U_N1_body' || node.name==='U_N1_mark') physicalNand.push(node)
    })
    for (const node of [...cutawayController,...cutawayNand]) node.visible=false
    const root=top('fw_host_root',.0012)
    model.getObjectByName('fw_host_root').visible=false
    const ctrl=top('U_CTRL_body',.0013)
    const socket=top('fw_cad_socket',.0012)
    placeActor('root',root,[.013,.0075])
    placeActor('socket',socket)
    for (const [id,pins] of Object.entries(contacts)) {
      const point=new Vector3()
      for (const pin of pins) point.add(top('m2_pin_'+String(pin).padStart(2,'0')))
      // Keep the marker visible above the installed connector while aligned to the contacts in plan.
      placeActor(id,point.multiplyScalar(1/pins.length).setY(socket.y+.0008))
    }
    placeActor('ctrl',ctrl)
    placeActor('nand',top('U_N1_body'))
    placeActor('phy',top('on_asic_host_macro').setY(ctrl.y))
    placeActor('pmic',top('U_PWR_body'))
    for (const [id,name] of Object.entries({ftl:'ftl',nandCtrl:'nand',ecc:'ecc',dma:'dma'})) {
      placeActor(id,top('on_asic_'+name+'_macro',.0007))
    }
    for (const [id,name] of Object.entries({
      nandIo:'io',nandAddr:'addr',nandRow:'row',nandWl:'wordline',nandSense:'sense',nandPage:'page',nandCol:'column',
    })) {
      placeActor(id,top('stack_io_nand_a_'+name,.0006))
    }
    placeActor('supply',new Vector3(-.012,root.y+.0006,.023),[.013,.0065])
    const host=(dx,dz)=>root.clone().add(new Vector3(dx,.0005,dz))
    placeActor('platform',host(-.024,-.003),[.015,.0075])
    placeActor('clockSource',host(-.030,-.013),[.013,.0075])
    placeActor('cpu',host(.011,.019),[.016,.008])
    placeActor('uefi',host(-.022,-.016),[.013,.0075])
    placeActor('tpm',host(.017,-.019),[.013,.0075])
    placeActor('memory',host(.042,.010),[.017,.009])
    placeActor('sq',host(.039,-.008),[.013,.006])
    placeActor('cq',host(.056,.024),[.013,.006])
    shots=new Map([
      ['board',{target:new Vector3(.057,.002,.062),w:.213,h:.198}],
      ['slot',{target:new Vector3(.012,.002,.008),w:.071,h:.050}],
      ['link',{target:new Vector3(.024,.001,.030),w:.112,h:.097}],
      ['host',{target:root.clone().add(new Vector3(.017,0,.003)),w:.105,h:.067}],
      ['ssd',{target:new Vector3(.037,.002,-.0105),w:.091,h:.045}],
      ['controller',{target:ctrl.clone().setY(.0011),w:.020,h:.014}],
      ['nand',{target:new Vector3(.054,.0011,-.0115),w:.023,h:.017}],
    ])
    views=[...model.children].filter(item=>item.userData.label && item.name!=='fw_host_root')
  }

  function applyPower(level) {
    grid.material.color.set(level==='断开' ? 0x1f305b : 0x2b4179)
  }

  function paintStep(step, action, follow) {
    if (!model || !action) return
    const shot=action.focus??step.focus
    const followShot=follow && (lastShot!==shot || camera.position.y<controls.target.y)
    if (step===stepRef && action===eventRef) {
      if (followShot) focus(shot)
      return
    }
    stepRef=step
    eventRef=action
    time=0
    lastTime=0
    pulse=undefined
    arrow=undefined
    curve=undefined
    for (const object of [...flow.children]) {
      if (object.geometry!==pulseGeometry && object.geometry!==arrowGeometry) object.geometry.dispose()
      object.material.dispose()
      flow.remove(object)
    }
    labels.replaceChildren()
    for (const node of physicalController) node.visible=!step.cutaway
    for (const node of cutawayController) node.visible=!!step.cutaway
    for (const node of physicalNand) node.visible=!step.nandCutaway
    for (const node of cutawayNand) node.visible=!!step.nandCutaway
    applyPower(step.state.rail)
    const color=signalKinds[action.kind].color
    const actors=[...new Set(action.actors)]
    for (const [id,mesh] of chips) {
      mesh.visible=actors.includes(id)
      mesh.material.color.set(mesh.visible ? new Color(color).multiplyScalar(.62) : 0x36588a)
    }
    const route=action.actors.map(id=>points.get(id))
    const markerScale=['controller','nand'].includes(shot) ? .38 : shot==='ssd' ? .72 : 1
    if (route.length>1) {
      const path=[route[0]]
      for (let i=1;i<route.length;i++) {
        const a=route[i-1], b=route[i]
        const mid=a.clone().lerp(b,.48)
        mid.y=Math.max(a.y,b.y)+Math.min(.0075,a.distanceTo(b)*.14)
        path.push(mid,b)
      }
      curve=new CatmullRomCurve3(path,false,'centripetal')
      const tube=new Mesh(new TubeGeometry(curve,44,.00044*markerScale,5,false),material(color,.77))
      pulse=new Mesh(pulseGeometry,material(0xffffff))
      arrow=new Mesh(arrowGeometry,material(color))
      pulse.scale.setScalar(markerScale)
      arrow.scale.setScalar(markerScale)
      flow.add(tube,pulse,arrow)
      updatePulse()
    }
    for (const id of actors) {
      const point=points.get(id)
      const ring=new Mesh(new RingGeometry(.0024,.00285,24),material(color,.86))
      ring.rotation.x=-Math.PI/2
      ring.position.copy(point)
      ring.scale.setScalar(markerScale*(contacts[id] ? .60 : 1))
      ring.material.side=2
      flow.add(ring)
    }
    const contact=actors.find(id=>contacts[id])
    const waypoint=contact??(actors.includes('socket')?'socket':null)
    const tags=actors.length>3 ? [actors[0],waypoint,actors.at(-1)].filter(Boolean) : actors
    tagRefs=[...new Set(tags)].map((id,index)=>{
      const element=document.createElement('span')
      element.textContent=actorLabels[id]
      if (index%2===1) element.dataset.tail=''
      element.style.setProperty('--node-color',color)
      labels.append(element)
      return {element,point:points.get(id)}
    })
    if (followShot) focus(shot)
    drawSoon()
  }

  function handleDown(event) {
    pointer={x:event.clientX,y:event.clientY}
  }

  function handleUp(event) {
    if (!views || !pointer || event.button!==0 || Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y)>5) return
    const rect=canvas.getBoundingClientRect()
    cursor.set(2*(event.clientX-rect.left)/rect.width-1,1-2*(event.clientY-rect.top)/rect.height)
    ray.setFromCamera(cursor,camera)
    const hit=ray.intersectObjects(views.filter(object=>object.visible),false)[0]
    if (!hit) { onPick(null); return }
    const data=hit.object.userData
    const evidence = data.view==='system' ? '原厂 CAD' : data.view==='physical' ? '拆解重建' : '功能推演'
    onPick({label:data.label,evidence})
  }

  function keys(event) {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return
    const displacement=camera.position.clone().sub(controls.target)
    const azimuth=controls.getAzimuthalAngle()+(event.key==='ArrowLeft'?-.12:event.key==='ArrowRight'?.12:0)
    const polar=Math.min(3.05,Math.max(.08,controls.getPolarAngle()+(event.key==='ArrowUp'?-.12:event.key==='ArrowDown'?.12:0)))
    tween=null
    displacement.setFromSphericalCoords(displacement.length(),polar,azimuth)
    camera.position.copy(controls.target).add(displacement)
    controls.update()
    drawSoon()
    event.preventDefault()
  }
  canvas.addEventListener('pointerdown',handleDown)
  canvas.addEventListener('pointerup',handleUp)
  canvas.addEventListener('keydown',keys)
  resize()

  return {
    async load(url) {
      const gltf=await new GLTFLoader().loadAsync(url)
      if (destroyed) { disposeModel(gltf.scene); return false }
      model=gltf.scene
      scene.add(model)
      model.updateMatrixWorld(true)
      indexAssembly()
      focus('board',true)
      return true
    },
    paintStep,
    start(flag) {
      if (running===flag) return
      running=flag
      lastTime=0
      if (flag && time>=TICK_MS) time=0
      drawSoon()
    },
    focus,
    flip() {
      const flipToBottom=camera.position.y>=controls.target.y
      tween=null
      const eye=camera.position.clone().sub(controls.target)
      eye.y=(flipToBottom?-1:1)*Math.max(Math.abs(eye.y),eye.length()*.05)
      camera.position.copy(controls.target).add(eye)
      controls.update()
      drawSoon()
    },
    dispose() {
      destroyed=true
      if (frameId) cancelAnimationFrame(frameId)
      observer.disconnect()
      controls.dispose()
      for (const object of [pulse,arrow]) if (object) flow.remove(object)
      disposeModel(scene)
      if (pulse) pulse.material.dispose()
      if (arrow) arrow.material.dispose()
      renderer.dispose()
      canvas.remove()
      labels.replaceChildren()
    },
  }
}

