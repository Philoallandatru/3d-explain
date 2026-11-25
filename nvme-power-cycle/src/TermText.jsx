import React, { useId } from 'react'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { terms } from './content/beginner-terms'

const termsByName = new Map(terms.flatMap(term => term.names.map(name => [name, term])))
const matchTerms = new RegExp(
  '(?<![A-Za-z0-9_])('
    + [...termsByName.keys()].sort((a, b) => b.length - a.length)
      .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    + ')(?![A-Za-z0-9_])',
)

function SmallDiagram({ term }) {
  if (term.wave) {
    const heights = term.wave === 'clock' ? [0, 1, 0, 1, 0, 1, 0, 1, 0] : [0, 1]
    return <span className="term-diagram term-wave" role="img" aria-label={term.diagram.join('，然后')}>
      <span className="term-trace" aria-hidden="true">
        {heights.map((height, index) => <i key={index} data-high={height === 1} />)}
      </span>
      <span className="term-wave-labels" aria-hidden="true">{term.diagram.map(label => <span key={label}>{label}</span>)}</span>
    </span>
  }

  return <span className="term-diagram term-process" role="img" aria-label={term.diagram.join('，然后')}>
    {term.diagram.map((label, index) => <React.Fragment key={label}>
      {index > 0 && <ArrowRight size={16} aria-hidden="true" />}
      <span className="term-node" aria-hidden="true">{label}</span>
    </React.Fragment>)}
  </span>
}

function Term({ word, term }) {
  const id = useId()
  const noteUrl = './beginner.html?note=' + encodeURIComponent(term.note) + '#' + encodeURIComponent(term.section)
  return <>
    <button type="button" className="term-trigger" popoverTarget={id} aria-label={word + '，查看解释'}>
      {word}
    </button>
    <span className="term-popover" id={id} popover="auto" role="group" aria-labelledby={id + '-title'}>
      <span className="term-heading">
        <strong id={id + '-title'}>{term.title ?? word}</strong>
        <button type="button" className="term-close" popoverTarget={id} popoverTargetAction="hide" aria-label="关闭术语解释">
          <X size={17} aria-hidden="true" />
        </button>
      </span>
      <span className="term-plain">{term.text}</span>
      <SmallDiagram term={term} />
      <a className="text-link term-note" href={noteUrl} target="_blank" rel="noopener">
        看知识库笔记 <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </span>
  </>
}

export default function TermText({ text }) {
  return text.split(matchTerms).map((part, index) => index % 2 === 1
    ? <Term key={index} word={part} term={termsByName.get(part)} />
    : part)
}
