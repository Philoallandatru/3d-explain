import React, { lazy, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDown, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, CircuitBoard, HardDrive,
} from 'lucide-react'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/geist-mono'
import TermText from './TermText'
import { shutdown, startup } from './content/beginner-flow'
import './styles.css'
import './beginner.css'
import './power-demo.css'

const reportHome = './index.html'
const clickableActors = new Set(['TPM', 'UEFI'])
const PowerDemo3D = lazy(() => import('./PowerDemo3D'))
const demoRoutes = {
  'turn-on': [
    'startup/rail', 'startup/train', 'startup/admin', 'unlock/opal-esp',
    'unlock/esp', 'unlock/key', 'unlock/plaintext',
  ],
  'turn-off': [
    'shutdown/last-write', 'shutdown/flush', 'shutdown/lock', 'shutdown/delete-queues',
    'shutdown/notify', 'shutdown/done', 'shutdown/link-off', 'shutdown/power-off',
  ],
}

function demoRequest() {
  const match = location.hash.match(/^#demo-3d(?:\/([a-z0-9-]+\/[a-z0-9-]+))?$/)
  return match ? match[1] ?? '' : null
}

function DemoSection() {
  const [requested, setRequested] = useState(demoRequest)

  useEffect(() => {
    const followLink = () => {
      const route = demoRequest()
      if (route === null) return
      setRequested(route)
      requestAnimationFrame(() => document.getElementById('demo-3d').scrollIntoView({ block: 'start' }))
    }
    followLink()
    window.addEventListener('hashchange', followLink)
    return () => window.removeEventListener('hashchange', followLink)
  }, [])

  return <section className="shell power-demo-section" id="demo-3d" aria-labelledby="demo-3d-title">
    <div className="power-demo-intro">
      <h2 id="demo-3d-title">在主板上跟踪 SSD 的状态</h2>
      <p>拖动旋转，滚轮或双指缩放。切换场景可查看开机、解锁、空闲、深睡和关机。</p>
    </div>
    {requested === null
      ? <a href="#demo-3d/startup/rail" className="button primary"><CircuitBoard size={17} aria-hidden="true" /> 加载 3D 模型</a>
      : <Suspense fallback={<p className="power-demo-loading" role="status">正在加载 3D 播放器…</p>}>
        <PowerDemo3D requested={requested} />
      </Suspense>}
  </section>
}

function FlowSignals({ signals }) {
  return <ul className="flow-signals" aria-label="本步动作和方向">
    {signals.map(([direction, left, action, right, kind]) => {
      const actors = direction === 'back' ? [right, left] : [left, right]
      const description = right
        ? actors.join(direction === 'both' ? ' 与 ' : ' 发给 ')
        : left + '内部'
      return <li key={action} className={'flow-signal flow-' + direction} data-kind={kind}>
        <span className="flow-sr">{description}，</span>
        <span aria-hidden={!clickableActors.has(left)}>{clickableActors.has(left) ? <TermText text={left} /> : left}</span>
        <span className="flow-action"><span><TermText text={action} /></span></span>
        {right && <span aria-hidden={!clickableActors.has(right)}>{clickableActors.has(right) ? <TermText text={right} /> : right}</span>}
      </li>
    })}
  </ul>
}

function FlowDetail({ fields, packets, note, title }) {
  return <details className="flow-detail">
    <summary><ChevronDown size={16} aria-hidden="true" /> 寄存器和 PCIe 包 <span className="flow-sr">· {title}</span></summary>
    <div className="flow-detail-body">
      {fields.length > 0 && <dl className="flow-fields">
        <dt>寄存器、命令或信号</dt>
        <dd>{fields.map(field => <code key={field}><TermText text={field} /></code>)}</dd>
      </dl>}
      {packets && <>
        <p className="flow-packet-heading">线路上能看到什么</p>
        <ol className="flow-packets">
          {packets.map(([direction, name, description]) => <li key={description}>
            <span className="flow-packet-direction">{direction}</span><code><TermText text={name} /></code><span><TermText text={description} /></span>
          </li>)}
        </ol>
      </>}
      {note && <p className="flow-detail-note"><TermText text={note} /></p>}
    </div>
  </details>
}

function FlowStage({ stage, number, demoRoute }) {
  return <li className="flow-stage" id={stage.id}>
    <span className="flow-number" aria-hidden="true">{number}</span>
    <div className="flow-stage-content">
      <div className="flow-stage-main">
        <div>
          <h3><TermText text={stage.title} /></h3>
          {stage.condition && <p className="flow-condition">{stage.condition}</p>}
          {stage.text && <p className="flow-description"><TermText text={stage.text} /></p>}
        </div>
        {stage.signals && <FlowSignals signals={stage.signals} />}
      </div>
      {stage.branches ? <div className="flow-branches">
        {stage.branches.map(branch => <section className="flow-branch" key={branch.title}>
          <h4><TermText text={branch.title} /></h4>
          <p><TermText text={branch.text} /></p>
          <FlowSignals signals={branch.signals} />
          <FlowDetail {...branch} />
        </section>)}
      </div> : <FlowDetail {...stage} />}
      <a href={'#demo-3d/' + demoRoute} className="text-link flow-demo-link">
        在 3D 中看本步 <ArrowUpRight size={15} aria-hidden="true" />
        <span className="flow-sr"> · {stage.title}</span>
      </a>
    </div>
  </li>
}

function FlowChart({ id, title, caption, stages, reportSection, securitySection }) {
  return <section id={id} className="starter-chapter shell" aria-labelledby={id + '-title'}>
    <h2 id={id + '-title'}>{title}</h2>
    <figure className="flow-chart">
      <figcaption>
        <span>{caption}</span>
        <span className="flow-direction-key"><ArrowRight size={16} aria-hidden="true" /> 箭头指向接收方</span>
      </figcaption>
      <ol className="flow-stages">
        {stages.map((stage, index) => <FlowStage key={stage.title} stage={stage} number={index + 1}
          demoRoute={demoRoutes[id][index]} />)}
      </ol>
    </figure>
    <div className="flow-sources">
      <a href={reportHome + reportSection} className="text-link">完整时序和出处 <ArrowRight size={16} aria-hidden="true" /></a>
      <a href={reportHome + securitySection} className="text-link">加密技术细节 <ArrowRight size={16} aria-hidden="true" /></a>
    </div>
  </section>
}

const segments = [
  ['固件', 6.373, '#8daaf8'],
  ['引导器', 0.195, '#3959b1'],
  ['内核阶段', 16.527, '#3762d0'],
  ['用户空间', 5.877, '#b9cef6'],
]

function Measurements() {
  return <section id="example" className="starter-example shell" aria-labelledby="example-title">
    <h2 id="example-title">两台机器的公开记录</h2>
    <div className="starter-example-grid">
      <article>
        <h3>ThinkPad T14 Gen 1 · LUKS 启动</h3>
        <p>Samsung 512 GB Gen3 NVMe。机主记录的一次启动用了 <strong>28.972 秒</strong>，内核阶段的大部分时间在等机主输入口令。</p>
        <figure>
          <div className="starter-sample-bar" aria-hidden="true">
            {segments.map(([label, time, color]) => <span key={label} style={{ backgroundColor: color, flexGrow: time }} />)}
          </div>
          <dl>{segments.map(([label, time, color]) => <div key={label}><dt><i style={{ backgroundColor: color }} />{label}</dt><dd>{time.toFixed(3)} s</dd></div>)}</dl>
        </figure>
        <a className="text-link" href="https://bbs.archlinux.org/viewtopic.php?id=309678" target="_blank" rel="noopener noreferrer">启动原始记录 <ArrowUpRight size={15} aria-hidden="true" /></a>
      </article>
      <article>
        <h3>Dell Inspiron 16 7610 · 关机卡住</h3>
        <p>Fedora 35，盘型号未公开。LUKS 卷仍在使用，关闭失败。同一秒开始同步文件系统，约 <strong>50 秒</strong>后记录超时。这个间隔量的是同步等待，日志没有给 SSD 断电或密钥清理打时间戳。</p>
        <a className="text-link" href="https://discussion.fedoraproject.org/t/why-might-sd-sync-hang-during-shutdown/71885" target="_blank" rel="noopener noreferrer">关机原始记录 <ArrowUpRight size={15} aria-hidden="true" /></a>
      </article>
    </div>
  </section>
}

function Beginner() {
  return <div className="starter">
    <a className="skip" href="#start">跳到正文</a>
    <header className="masthead">
      <div className="shell mast-inner">
        <a className="brand" href="#start"><span className="brand-icon"><Activity size={20} aria-hidden="true" /></span><span>NVMe <span className="brand-second">/ PCIe</span></span></a>
        <nav className="mast-links" aria-label="简明版章节"><a href="#demo-3d">3D 演示</a><a href="#turn-on">开机</a><a href="#unlock">解锁</a><a href="#turn-off">关机</a><a href="#example">看实测</a></nav>
        <a className="pdf-link" href={reportHome}><BookOpen size={16} aria-hidden="true" /> 完整报告</a>
      </div>
    </header>
    <main id="start">
      <div className="hero-field">
        <div className="starter-hero shell">
          <div>
            <h1>开机、待机和关机时，SSD 在做什么？</h1>
            <p>在 3D 里沿主板、插槽和 SSD 看一遍信号方向，再从下方流程图查看寄存器、PCIe 包和术语解释。</p>
          </div>
          <div className="hero-actions">
            <a href="#demo-3d" className="button primary"><CircuitBoard size={17} aria-hidden="true" /> 进入 3D 演示 <ArrowDown size={16} aria-hidden="true" /></a>
            <a href="#turn-on" className="button secondary"><HardDrive size={17} aria-hidden="true" /> 看开机图 <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <DemoSection />
      <FlowChart id="turn-on" title="开机 · 从通电到第一次读出明文"
        caption="冷启动示意 · 读到标有条件的步骤时，按电脑的加密设置走。"
        stages={startup} reportSection="#startup" securitySection="#boot-security" />
      <FlowChart id="turn-off" title="关机 · 从最后一次写入到断电"
        caption="有序关机示意 · 主板实际撤电和自动上锁取决于设备设置。"
        stages={shutdown} reportSection="#shutdown-sequence" securitySection="#shutdown-security" />
      <Measurements />
    </main>
    <footer><div className="shell footer-inner"><span>NVMe / PCIe · 简明图解</span><a href={reportHome + '#figures'}>查看完整时序图</a></div></footer>
  </div>
}

const root = createRoot(document.getElementById('root'))
const note = new URLSearchParams(location.search).get('note')

if (note) {
  import('./KnowledgeNote').then(({ default: KnowledgeNote }) => root.render(<KnowledgeNote note={note} />))
} else {
  root.render(<Beginner />)
}
