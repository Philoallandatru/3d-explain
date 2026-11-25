import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Maximize2, Pause, Play, Rotate3D, RotateCcw } from 'lucide-react'
import { actorLabels, createPowerScene } from './power-demo-scene'
import { scenarios, signalKinds, specSources } from './content/power-demo-flow'
import { actionSources } from './content/power-demo-protocol'

const assemblyUrl = import.meta.env.BASE_URL+'models/power-cycle.glb'
const states = [
  ['rail','M.2 主电'],['reset','PERST#'],['clock','REFCLK'],
  ['link','PCIe 链路'],['device','PCI 设备'],['drive','NVMe 控制器'],
]

function resolve(requested) {
  const [id,beat]=requested.split('/')
  const scenario=scenarios.find(item=>item.id===id)??scenarios[0]
  const index=Math.max(0,scenario.steps.findIndex(step=>step.id===beat))
  return {id:scenario.id,index,event:0}
}

function move(scenario, cursor, delta) {
  const event=cursor.event+delta
  if (event>=0 && event<scenario.steps[cursor.index].events.length) return {...cursor,event}
  const index=cursor.index+delta
  if (index<0 || index>=scenario.steps.length) return null
  return {id:cursor.id,index,event:delta>0?0:scenario.steps[index].events.length-1}
}

function PowerStates({ state }) {
  return <div className="power-demo-states">
    <p>本步结束时的状态</p>
    <dl>{states.map(([key,label])=><div key={key}><dt>{label}</dt><dd>{state[key]}</dd></div>)}</dl>
  </div>
}

function ActionProtocol({ protocol }) {
  const [title,href]=actionSources[protocol.source]
  return <details className="power-demo-protocol">
    <summary><ChevronDown size={16} aria-hidden="true" /><span>{protocol.type}</span></summary>
    <p>{protocol.text}</p>
    <ul className="power-demo-fields" aria-label="本动作的协议字段">
      {protocol.fields.map(field=><li key={field}><code>{field}</code></li>)}
    </ul>
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-link">
      {title}<ArrowUpRight size={13} aria-hidden="true" />
    </a>
  </details>
}

export default function PowerDemo3D({ requested }) {
  const [cursor,setCursor]=useState(()=>resolve(requested))
  const [playing,setPlaying]=useState(false)
  const [follow,setFollow]=useState(true)
  const [status,setStatus]=useState('loading')
  const [picked,setPicked]=useState(null)
  const stage=useRef(null), labels=useRef(null), scene=useRef(null)
  const actionList=useRef(null), activeAction=useRef(null)

  const scenario=scenarios.find(item=>item.id===cursor.id)
  const step=scenario.steps[cursor.index]
  const action=step.events[cursor.event]
  const signal=signalKinds[action.kind]
  const previous=move(scenario,cursor,-1)
  const next=move(scenario,cursor,1)
  const ready=status==='ready'
  const onEnd=useEffectEvent(()=>{
    if (next) setCursor(next)
    else setPlaying(false)
  })

  useEffect(()=>{
    setCursor(resolve(requested))
    setPlaying(false)
    setPicked(null)
  },[requested])

  useEffect(()=>{
    let alive=true
    let stageScene
    try {
      stageScene=createPowerScene(stage.current,labels.current,{onEnd:()=>onEnd(),onPick:setPicked})
      scene.current=stageScene
      stageScene.load(assemblyUrl).then(loaded=>{
        if (alive && loaded) setStatus('ready')
      }).catch(()=>{
        if (alive) setStatus('error')
      })
    } catch {
      setStatus('error')
    }
    return ()=>{
      alive=false
      stageScene?.dispose()
      scene.current=null
    }
  },[])

  useEffect(()=>{
    if (!ready) return
    scene.current.paintStep(step,action,follow)
    scene.current.start(playing)
  },[ready,step,action,follow,playing])

  useEffect(()=>{
    const list=actionList.current
    const bounds=list.getBoundingClientRect()
    const active=activeAction.current.getBoundingClientRect()
    list.scrollTop+=Math.min(0,active.top-bounds.top)+Math.max(0,active.bottom-bounds.bottom)
  },[cursor])

  function select(nextCursor) {
    setPlaying(false)
    setPicked(null)
    setCursor(nextCursor)
  }

  function togglePlay() {
    if (!ready) return
    if (playing) {
      setPlaying(false)
      return
    }
    if (!next) setCursor({id:scenario.id,index:0,event:0})
    setPlaying(true)
  }

  const playLabel=playing?'暂停':next?'播放':'从头播放'
  return <div className="power-demo" data-scenario={scenario.id} data-beat={step.id}
    data-action={cursor.event+1} data-playing={playing} data-ready={ready}>
    <div className="power-demo-modes" role="group" aria-label="选择 3D 场景">
      {scenarios.map(item=><button type="button" key={item.id} aria-pressed={scenario.id===item.id}
        onClick={()=>select({id:item.id,index:0,event:0})}>{item.label}</button>)}
    </div>
    <div className="power-demo-grid">
      <div className="power-demo-visual">
        <div className="power-demo-stage">
          <div ref={stage} className="power-demo-canvas" />
          <div ref={labels} className="power-demo-labels" aria-hidden="true" />
          <div className="power-demo-event-tag" style={{'--event-color':signal.color}} aria-live="polite">
            <span>{signal.label}</span><strong>{action.label}</strong>
          </div>
          {!ready && <div className="power-demo-stage-message" role={status==='error'?'alert':'status'}>
            {status==='error'?'三维模型暂时无法显示。可以继续单步查看规范流程。':'正在载入主板与 SSD 模型…'}
          </div>}
          {ready && <div className="power-demo-view-tools">
            <label><input type="checkbox" checked={follow} onChange={e=>setFollow(e.target.checked)} />跟随镜头</label>
            <button type="button" onClick={()=>{setFollow(false);scene.current.focus('board')}} title="主板全景" aria-label="主板全景"><Maximize2 size={17} aria-hidden="true" /></button>
            <button type="button" onClick={()=>{setFollow(false);scene.current.flip()}} title="翻面" aria-label="翻面"><Rotate3D size={17} aria-hidden="true" /></button>
          </div>}
          {picked && <div className="power-demo-picked"><strong>{picked.label}</strong><span>{picked.evidence}</span></div>}
        </div>
        <div className="power-demo-transport" role="group" aria-label="播放与单步">
          <button type="button" onClick={()=>select(previous)} disabled={!previous} aria-label="上一个动作"><ArrowLeft size={17} aria-hidden="true" /></button>
          <button type="button" className="power-demo-play" onClick={togglePlay} disabled={!ready}>
            {playing?<Pause size={17} aria-hidden="true" />:next?<Play size={17} aria-hidden="true" />:<RotateCcw size={17} aria-hidden="true" />}
            {playLabel}
          </button>
          <button type="button" onClick={()=>select(next)} disabled={!next} aria-label="下一个动作"><ArrowRight size={17} aria-hidden="true" /></button>
          <label className="power-demo-progress">
            <input aria-label="跳到阶段" type="range" min="0" max={scenario.steps.length-1} value={cursor.index}
              onChange={e=>select({...cursor,index:Number(e.target.value),event:0})} />
            <output>{cursor.index+1}/{scenario.steps.length}</output>
          </label>
        </div>
      </div>
      <aside className="power-demo-detail" aria-label="当前阶段的规范解释">
        <label className="power-demo-step-picker">阶段
          <select aria-label="选择阶段" value={cursor.index}
            onChange={e=>select({...cursor,index:Number(e.target.value),event:0})}>
            {scenario.steps.map((item,index)=><option key={item.id} value={index}>{index+1}. {item.title}</option>)}
          </select>
        </label>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <ol ref={actionList} className="power-demo-actions" aria-label="本阶段动作">
          {step.events.map((item,index)=><li key={step.id+'-'+index}>
            <button ref={index===cursor.event?activeAction:null} type="button"
              onClick={()=>select({...cursor,event:index})} aria-pressed={index===cursor.event}>
              <span style={{'--kind-color':signalKinds[item.kind].color}} aria-hidden="true"></span>{item.label}
            </button>
          </li>)}
        </ol>
        <p className="power-demo-route" aria-label="当前动作的信号路径">
          {action.actors.map(id=>actorLabels[id]).join(' → ')}
        </p>
        {action.protocol && <ActionProtocol protocol={action.protocol} />}
        <ul className="power-demo-fields" aria-label="关联寄存器和信号">
          {step.fields.map(field=><li key={field}><code>{field}</code></li>)}
        </ul>
        <div className="power-demo-specs" aria-label="规范出处">
          {step.sources.map(key=>{
            const [title,href]=specSources[key]
            return <a key={key} href={href} target="_blank" rel="noopener noreferrer">{title}<ArrowUpRight size={13} aria-hidden="true" /></a>
          })}
          {(scenario.id==='idle'||scenario.id==='sleep') && <a href="./beginner.html?note=storage%2Fnvme-idle-and-wake">空闲与唤醒依据 <ArrowUpRight size={13} aria-hidden="true" /></a>}
        </div>
      </aside>
    </div>
    <PowerStates state={step.state} />
    <ul className="power-demo-evidence" aria-label="几何和信号的来源">
      <li>实物外形 · 原厂 CAD 与拆解重建</li>
      <li>彩色信号、主机功能区与芯片剖面 · 原理示意</li>
    </ul>
    <p className="power-demo-foot">
      播放速度用于阅读。数据触点标出 Lane 0 的方向示例，PCIe ×4 的数据可分布在四条 Lane。省电、复电和寄存器示例值随平台配置而异。
      {' '}<a href="https://github.com/FrameworkComputer/Framework-Desktop" target="_blank" rel="noopener noreferrer">Framework Desktop CAD（CC BY 4.0）</a>
      {' · '}<a href="https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514049640.pdf" target="_blank" rel="noopener noreferrer">Samsung 990 PRO 2 TB 规格</a>
    </p>
  </div>
}

