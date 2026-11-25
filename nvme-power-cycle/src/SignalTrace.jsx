import React, { useEffect, useRef } from 'react'
import { ArrowUpRight, CircleHelp } from 'lucide-react'

const traces = {
  on: {
    stages: [
      ['供电', '盘端 3.3 V 建立', '主板供电并保持 PERST# 为低。BIOS 的早期执行可与插槽上电重叠。', '#startup'],
      ['PERST#', '平台释放复位', 'PERST# 拉高后，两端可以开始 PCIe 链路训练。', '#startup'],
      ['PCIe L0', '链路可传输事务', '根端口枚举 SSD、映射 BAR，并发起寄存器读写。', '#startup'],
      ['RDY=1', '主机读回 CSTS.RDY=1', '建立管理队列后，主机可以识别控制器和命名空间并创建 I/O 队列。', '#startup'],
      ['卷解锁', '读出首批系统卷明文', '软件加密在主机解密数据。Opal 由 SSD 放行目标范围，ESP 被锁时需要提前认证。', '#boot-security'],
    ],
    lines: [
      [[0,0],[.05,0],[.14,1],[1,1]],
      [[0,0],[.28,0],[.28,1],[1,1]],
      [[0,0],[.28,0],[.33,.22],[.37,.22],[.37,.45],[.42,.45],[.42,.73],[.5,1],[1,1]],
      [[0,0],[.61,0],[.61,.4],[.69,.4],[.69,1],[1,1]],
    ],
  },
  off: {
    stages: [
      ['停接访问', '文件系统开始收尾', '主机收敛应用写入。卸载和写回仍可能产生后续 I/O。', '#shutdown-sequence'],
      ['Flush', '最后一轮写入完成', '若发出 Flush，主机等待其 CQE，再进入卷关闭或显式上锁路径。', '#shutdown-security'],
      ['SHN', '根侧写入关停通知', '主机在 BAR 写 CC.SHN=01b，可继续轮询 CSTS。', '#shutdown-sequence'],
      ['SHST', 'SSD 报告关停完成', '主机在 PCIe CplD 中读回 CSTS.SHST=10b。随后平台可收链。', '#shutdown-sequence'],
      ['掉电', '插槽主电失效', '平台控制 PERST# 与电源。若匹配已配置的 LockOnReset，SSD 自动上锁。', '#shutdown-security'],
    ],
    lines: [
      [[0,1],[.88,1],[.98,0],[1,0]],
      [[0,1],[.87,1],[.87,0],[1,0]],
      [[0,1],[.78,1],[.78,.42],[.88,.42],[.88,0],[1,0]],
      [[0,0],[.49,0],[.49,.46],[.68,.46],[.68,1],[.82,1],[.82,0],[1,0]],
    ],
  },
}

const rowLabels = ['3.3 V', 'PERST#', 'PCIe', 'NVMe']
const colors = ['#78f0d2', '#7ce3ff', '#9caaff', '#e9aaff']

export function ModeButtons({ mode, setMode, label = '选择电源过程' }) {
  return <div className="mode-select" role="group" aria-label={label}>
    <button type="button" aria-pressed={mode === 'on'} onClick={() => setMode('on')}>上电</button>
    <button type="button" aria-pressed={mode === 'off'} onClick={() => setMode('off')}>下电</button>
  </div>
}

function Waveform({ mode, step }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (width < 1) return
      const scale = Math.min(devicePixelRatio, 2)
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(scale, scale)
      const lane = height / 4
      const section = width / 5
      ctx.fillStyle = '#569cff27'
      ctx.fillRect(section * step, 0, section, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#b4d2ff23'
      ctx.setLineDash([3, 5])
      for (let i = 0; i <= 5; i++) {
        const x = section * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      ctx.setLineDash([])
      for (const [i, points] of traces[mode].lines.entries()) {
        ctx.strokeStyle = '#b4d2ff1c'
        ctx.beginPath()
        ctx.moveTo(0, (i + 1) * lane)
        ctx.lineTo(width, (i + 1) * lane)
        ctx.stroke()
        ctx.strokeStyle = colors[i]
        ctx.lineWidth = 2.2
        ctx.lineJoin = 'round'
        ctx.beginPath()
        points.forEach(([x, y], j) => {
          const py = lane * (i + .73 - y * .45)
          if (j) ctx.lineTo(2 + (width - 4) * x, py)
          else ctx.moveTo(2 + (width - 4) * x, py)
        })
        ctx.stroke()
        ctx.lineWidth = 1
      }
      ctx.strokeStyle = '#b3dcff7a'
      ctx.beginPath()
      ctx.moveTo(section * (step + .5), 0)
      ctx.lineTo(section * (step + .5), height)
      ctx.stroke()
    }
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    draw()
    return () => observer.disconnect()
  }, [mode, step])
  return <canvas className="wave" ref={ref} aria-hidden="true" />
}

export function SignalTrace({ mode, setMode, step, setStep }) {
  const { stages } = traces[mode]
  const [, title, description, href] = stages[step]
  return <section className="signal" aria-label="可交互的上电和下电时序示意">
    <div className="signal-head">
      <div className="signal-title"><span className="trace-mark" aria-hidden="true"><i /><i /><i /></span>主时序示意</div>
      <ModeButtons mode={mode} setMode={setMode} />
    </div>
    <div className="signal-grid">
      <div className="signals" aria-hidden="true">{rowLabels.map((label, i) => <span key={label}><i style={{background: colors[i]}} />{label}</span>)}</div>
      <Waveform mode={mode} step={step} />
    </div>
    <div className="phase-row" role="group" aria-label="选择时序阶段">
      {stages.map(([name], index) => <button type="button" key={name} aria-pressed={step === index} onClick={() => setStep(index)}>
        <span className="phase-dot" aria-hidden="true" />{name}
      </button>)}
    </div>
    <div className="signal-detail">
      <div aria-live="polite"><strong>{title}</strong><p>{description}</p></div>
      <a className="signal-link" href={href} aria-label={`阅读${title}的分析`}><ArrowUpRight size={17} /></a>
    </div>
    <div className="signal-note"><CircleHelp size={13} />阶段位置为示意，时间样本见下方记录</div>
  </section>
}
