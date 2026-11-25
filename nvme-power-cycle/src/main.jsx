import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, BookOpen, FileText,
  List, Maximize2, Minus, Plus, Search, X,
} from 'lucide-react'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/geist-mono'
import { asset, contents, measurements, pdf, report } from './report.js'
import { ModeButtons, SignalTrace } from './SignalTrace.jsx'
import './styles.css'

const figureInfo = {
  on: {
    title: '上电时序',
    copy: '从 3.3 V、PERST# 与链路训练，追到 EFI 引导器验签、软件卷解锁或 Opal 认证。',
    jump: '#boot-security',
    detail: '从 ESP 到系统卷明文',
  },
  off: {
    title: '下电时序',
    copy: '从文件系统收尾和 Flush，追到密钥失效、Opal 上锁、SHST 完成和 3.3 V 失效。',
    jump: '#shutdown-security',
    detail: '从加密卷收尾到盘端掉电',
  },
}

function FigureDialog({ figure, close }) {
  const ref = useRef(null)
  const [zoom, setZoom] = useState(100)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return <dialog ref={ref} className="figure-dialog" aria-labelledby="figure-title" onCancel={close}>
    <div className="figure-toolbar">
      <h3 id="figure-title">{figure.title}</h3>
      <div className="zoom-tools" aria-label="图像缩放">
        <button type="button" className="icon-btn" aria-label="缩小" disabled={zoom <= 100} onClick={() => setZoom(zoom - 25)}><Minus size={17} /></button>
        <button type="button" className="fit-btn" aria-label="恢复适应宽度" onClick={() => setZoom(100)}>{zoom}%</button>
        <button type="button" className="icon-btn" aria-label="放大" disabled={zoom >= 300} onClick={() => setZoom(zoom + 25)}><Plus size={17} /></button>
      </div>
      <button type="button" className="icon-btn" aria-label="关闭时序图" onClick={close}><X size={21} /></button>
    </div>
    <div className="zoom-scroll" tabIndex="0" aria-label="可滚动的时序图">
      <img src={figure.url} alt={figure.title} style={{ width: `${zoom}%` }} />
    </div>
  </dialog>
}

function Figures({ mode, setMode }) {
  const [figure, setFigure] = useState(null)
  const view = figureInfo[mode]
  const stem = `power-${mode}`
  return <section className="figure-section shell" id="figures" aria-labelledby="figures-title">
    <div className="section-head">
      <div><h2 id="figures-title">上下电时序图</h2><p>沿同一张图追踪边带、电源、寄存器、队列和 PCIe 包。</p></div>
      <ModeButtons mode={mode} setMode={setMode} label="选择要查看的主时序图" />
    </div>
    <div className="atlas">
      <div className="atlas-copy">
        <h3>{view.title}</h3>
        <p>{view.copy}</p>
        <button type="button" className="button primary" onClick={() => setFigure({ title: view.title, url: asset(`${stem}.svg`) })}><Maximize2 size={16} /> 放大完整图</button>
        <button type="button" className="detail-action" onClick={() => setFigure({ title: view.detail, url: asset(`${stem}-security.png`) })}>
          <span>{view.detail}</span><ArrowUpRight size={16} />
        </button>
        <a className="text-link" href={view.jump}>读加密分支 <ArrowRight size={15} /></a>
      </div>
      <button className="figure-preview" type="button" aria-label={`打开${view.title}`} onClick={() => setFigure({ title: view.title, url: asset(`${stem}.svg`) })}>
        <img className="figure-sheet" loading="lazy" decoding="async" src={asset(`${stem}.png`)} alt={`${view.title}的开头，显示波形和事件顺序`} />
        <span className="preview-zoom"><Maximize2 size={16} /> 查看原图</span>
      </button>
    </div>
    {figure && <FigureDialog figure={figure} close={() => setFigure(null)} />}
  </section>
}

function searchMatches(query) {
  const term = query.trim().toLowerCase()
  if (!term) return []
  return report.filter(chapter => chapter.id && chapter.text.toLowerCase().includes(term)).slice(0, 10).map(chapter => {
    const start = chapter.text.toLowerCase().indexOf(term)
    return { ...chapter, snippet: chapter.text.slice(Math.max(0, start - 18), start + term.length + 53) }
  })
}

function Report() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('')
  const results = searchMatches(query)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const section = entries.find(entry => entry.isIntersecting)
      if (section) setActive(section.target.id)
    }, { rootMargin: '-15% 0px -68% 0px' })
    contents.forEach(({ id }) => {
      const heading = document.getElementById(id)
      if (heading) observer.observe(heading)
    })
    return () => observer.disconnect()
  }, [])
  return <section className="reader shell" id="report" aria-labelledby="report-title">
    <div className="section-head">
      <div><h2 id="report-title">完整研究报告</h2><p>规范、真实机器记录和每组计时的适用边界。</p></div>
      <a className="button secondary" href={pdf} download><ArrowDownToLine size={16} /> 下载时序 PDF</a>
    </div>
    <div className="reader-grid">
      <aside className="reader-rail" aria-label="报告导览">
        <form role="search" className="search" onSubmit={event => { event.preventDefault(); if (results[0]) location.hash = results[0].id }}>
          <Search size={18} />
          <input type="search" aria-label="搜索正文" placeholder="搜索正文" value={query} onChange={event => setQuery(event.target.value)} />
        </form>
        {query.trim() && <div className="search-results" aria-live="polite">
          {results.length ? results.map(hit => <a key={hit.id} href={`#${hit.id}`}>
            <strong>{hit.title}</strong><span>{hit.snippet}…</span>
          </a>) : <p>未找到匹配的章节。可试试 Flush、Opal 或 PERST#。</p>}
        </div>}
        <details className="toc" open>
          <summary><List size={16} /> 章节目录</summary>
          <nav aria-label="章节目录">
            {contents.map(section => <a className={section.level > 2 ? 'subsection' : ''} key={section.id}
              href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}
              onClick={() => setActive(section.id)}>{section.title}</a>)}
          </nav>
        </details>
      </aside>
      <article className="report-copy" aria-label="PC 上电与下电时，一块 NVMe SSD 经历了什么">
        {report.map((chunk, i) => <div key={chunk.id || i} dangerouslySetInnerHTML={{ __html: chunk.html }} />)}
      </article>
    </div>
  </section>
}

function App() {
  const [mode, setModeValue] = useState('on')
  const [step, setStep] = useState(1)
  function setMode(next) {
    if (next === mode) return
    setModeValue(next)
    setStep(0)
  }
  useEffect(() => {
    const syncHash = () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      target?.scrollIntoView()
    }
    if (location.hash) syncHash()
  }, [])

  return <>
    <a className="skip" href="#main">跳到正文</a>
    <header className="masthead">
      <div className="shell mast-inner">
        <a className="brand" href="#main" aria-label="返回 NVMe 上下电报告总览"><span className="brand-icon"><Activity size={20} /></span><span>NVMe <span className="brand-second">/ PCIe</span></span></a>
        <nav className="mast-links" aria-label="网站导航"><a href="./beginner.html">简明版</a><a href="#figures">时序图</a><a href="#evidence">公开实测</a><a href="#report">完整报告</a></nav>
        <a className="pdf-link" href={pdf} download><FileText size={16} /> <span>时序 PDF</span><ArrowDownToLine size={15} /></a>
      </div>
    </header>
    <main id="main">
      <div className="hero-field">
        <div className="hero shell">
          <div className="hero-copy">
            <h1><span>NVMe 的</span><span>上电与下电</span></h1>
            <p>从 M.2 插槽的 3.3 V 和 PERST#，追到第一批系统卷明文，以及最后一次写入之后的断电。</p>
            <div className="hero-actions">
              <a className="button primary" href="#figures">查看时序图 <ArrowDown size={17} /></a>
              <a className="button secondary" href="#report"><BookOpen size={17} /> 阅读完整分析</a>
            </div>
            <div className="scope">M.2 直连 PCIe · UEFI 启动盘 · 公开实测与规范</div>
          </div>
          <SignalTrace mode={mode} setMode={setMode} step={step} setStep={setStep} />
        </div>
      </div>
      <section id="evidence" className="evidence shell" aria-labelledby="evidence-title">
        <div className="evidence-label"><h2 id="evidence-title">公开实测</h2><a href="#samples">全部记录 <ArrowRight size={14} /></a></div>
        {measurements.map(m => <a className="measurement" key={m.device} href={m.href} target="_blank" rel="noopener noreferrer">
          <span className="device">{m.device}<ArrowUpRight size={15} /></span>
          <strong>{m.value} <small>{m.unit}</small></strong>
          <span className="measurement-detail">{m.description}</span>
        </a>)}
      </section>
      <Figures mode={mode} setMode={setMode} />
      <Report />
    </main>
    <footer><div className="shell footer-inner"><span>NVMe / PCIe · 上下电技术报告</span><a href="#main">返回顶部</a></div></footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
