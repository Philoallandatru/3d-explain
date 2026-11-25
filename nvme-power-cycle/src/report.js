import MarkdownIt from 'markdown-it'
import source from './content/report.md?raw'

export const asset = (name) => `${import.meta.env.BASE_URL}figures/${name}`
export const pdf = asset('nvme-pcie-power-sequences.pdf')

const md = new MarkdownIt({ html: true })
md.renderer.rules.link_open = (tokens, i, options, env, renderer) => {
  const token = tokens[i]
  const href = token.attrGet('href')
  if (href?.startsWith('nvme-pcie-figures/')) token.attrSet('href', asset(href.split('/').at(-1)))
  if (href === '../output/pdf/nvme-pcie-power-sequences.pdf') token.attrSet('href', pdf)
  if (href?.startsWith('https://')) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return renderer.renderToken(tokens, i, options)
}
md.renderer.rules.table_open = () => '<div class="table-scroll" role="region" aria-label="技术数据表" tabindex="0"><table>'
md.renderer.rules.table_close = () => '</table></div>'

function tokenText(token) {
  if (token.children) return token.children.map(tokenText).join('')
  return token.type !== 'html_inline' && token.content ? token.content : ''
}

const env = {}
const tokens = md.parse(source, env)
const anchors = []
const chunks = []
let chunk = { tokens: [], title: '', id: '', level: 0 }
let pendingId

for (let i = 0; i < tokens.length; i++) {
  const token = tokens[i]
  const explicit = token.type === 'html_block' && token.content.trim().match(/^<a id="([a-z-]+)"><\/a>$/)
  if (explicit) {
    pendingId = explicit[1]
    continue
  }
  if (token.type === 'heading_open') {
    if (token.tag === 'h1') {
      i += 2
      continue
    }
    if (chunk.tokens.length) chunks.push(chunk)
    const [line, close] = tokens.slice(i + 1, i + 3)
    const level = Number(token.tag[1])
    const id = pendingId ?? `chapter-${line.map[0] + 1}`
    pendingId = undefined
    token.attrSet('id', id)
    token.tag = close.tag = `h${level + 1}`
    chunk = { tokens: [token, line, close], title: tokenText(line), id, level }
    anchors.push({ id, title: chunk.title, level })
    i += 2
    continue
  }
  chunk.tokens.push(token)
}
if (chunk.tokens.length) chunks.push(chunk)

export const contents = anchors
export const report = chunks.map(({ id, title, level, tokens }) => ({
  id,
  title,
  level,
  text: tokens.map(tokenText).filter(Boolean).join(' '),
  html: md.renderer.render(tokens, md.options, env),
}))

export const measurements = [
  {
    device: 'ThinkPad T14 Gen 1',
    value: '6.373',
    unit: 's',
    description: 'LUKS 启动记录中的固件阶段',
    href: 'https://bbs.archlinux.org/viewtopic.php?id=309678',
  },
  {
    device: 'Dell XPS 13 · SK hynix PC300',
    value: '412.470',
    unit: 'ms',
    description: '进入 S3 时等待 SHST 的软件轮询',
    href: 'https://lists.infradead.org/pipermail/linux-nvme/2024-May/047178.html',
  },
  {
    device: 'Dell Inspiron 16 7610',
    value: '≈ 50',
    unit: 's',
    description: 'LUKS 故障关机中的同步超时',
    href: 'https://discussion.fedoraproject.org/t/why-might-sd-sync-hang-during-shutdown/71885',
  },
]
