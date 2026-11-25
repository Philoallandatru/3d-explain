import React, { useLayoutEffect } from 'react'
import MarkdownIt from 'markdown-it'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

const notes = import.meta.glob('./content/knowledge/*/*.md', { eager: true, query: '?raw', import: 'default' })
const files = new Map(Object.entries(notes).map(([path, file]) => {
  const frontmatter = file.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  return [
    path.slice('./content/knowledge/'.length, -3),
    {
      text: file.slice(frontmatter?.[0].length ?? 0),
      localOnly: /^local_only: true\r?$/m.test(frontmatter?.[1] ?? ''),
    },
  ]
}))

const renderer = new MarkdownIt()
renderer.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet('id', encodeURIComponent(tokens[index + 1].content))
  return self.renderToken(tokens, index, options)
}
renderer.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const href = token.attrGet('href')
  const url = new URL(href, 'https://ficus-kb.invalid/' + env.note + '.md')
  if (url.hostname === 'ficus-kb.invalid' && url.pathname.endsWith('.md')) {
    const target = url.pathname.slice(1, -3)
    if (files.has(target)) token.attrSet('href', './beginner.html?note=' + encodeURIComponent(target) + url.hash)
  }
  if (url.origin === 'http://127.0.0.1:4317') {
    token.attrSet('href', '.' + url.pathname + url.search + url.hash)
  }
  return self.renderToken(tokens, index, options)
}

export default function KnowledgeNote({ note }) {
  const { text, localOnly } = files.get(note) ?? {}
  const title = text?.match(/^# (.+)$/m)?.[1]
  const heading = location.hash.slice(1)
  const section = new URLSearchParams('heading=' + heading).get('heading')
  const originalUrl = 'obsidian://open?vault=Ficus-KB&file=' + encodeURIComponent(
    'wiki/' + note + (section ? '#' + section : ''),
  )

  useLayoutEffect(() => {
    document.title = (title ?? '知识库笔记') + (localOnly ? ' · NVMe / PCIe' : ' · Ficus-KB')
    document.getElementById(heading)?.scrollIntoView({ block: 'start' })
  }, [heading, localOnly, title])

  return <div className="starter">
    <header className="masthead">
      <nav className="shell knowledge-nav" aria-label="笔记导航">
        <a className="text-link" href="./beginner.html"><ArrowLeft size={16} aria-hidden="true" /> 返回简明图解</a>
        {text && !localOnly && <a className="text-link" href={originalUrl}>在 Obsidian 打开原笔记 <ArrowUpRight size={15} aria-hidden="true" /></a>}
      </nav>
    </header>
    <main className="shell knowledge-page">
      {text
        ? <article className="report-copy knowledge-copy" dangerouslySetInnerHTML={{ __html: renderer.render(text, { note }) }} />
        : <h1>找不到这篇知识库笔记</h1>}
    </main>
  </div>
}
