import { useEffect, useRef, useState, type RefObject } from 'react'
import { scrollToTarget } from '../lib/scroll'

interface Msg { t: number; text: string; cta?: boolean }
/** When each message "arrives", in seconds on the bubbles' own clock. Spaced so each one can be read. */
const MSGS: Msg[] = [
  { t: 0.5, text: 'Hi, I’m Abraar.' },
  { t: 3.0, text: 'I’m an AI engineer: agents, RAG and document intelligence.' },
  { t: 6.4, text: 'Now at CDF: LangGraph agents that review contracts. 65% less triage time.' },
  { t: 10.2, text: 'Before that, BeatNet at Aventusoft: real-time ECG AI on wearables.' },
  { t: 14.0, text: 'And at Plumb5, FAISS search that lifted precision 12%.' },
  { t: 17.6, text: 'M.S. in AI Systems, University of Florida. B.Tech, Anna University.' },
  { t: 21.4, text: 'Two Best Paper awards along the way.' },
  { t: 24.2, text: 'Open to AI roles. Let’s talk →', cta: true },
]
const LOOP = 30         // seconds; the thread clears just before this and starts again
const VISIBLE = 3       // newest messages kept on screen
const TYPING = 0.7      // typing dots show this long before a message lands

/** Seconds on our own clock, so the full script always plays whatever the video loop length is. */
function useClock() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf = 0, last = -1
    const t0 = performance.now()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const q = Math.round((((performance.now() - t0) / 1000) % LOOP) * 10) / 10
      if (q !== last) { last = q; setT(q) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

const Dots = () => (
  <span className="flex items-center gap-1 px-1 py-1.5" aria-hidden>
    {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-faint" style={{ animationDelay: `${i * 150}ms` }} />)}
  </span>
)

/** Chat-style messages that pop in beside the avatar: a short intro and my experience. Silent by design. */
export default function SpeechBubbles(_props: { video?: RefObject<HTMLVideoElement>; follow?: boolean; loopSec?: number }) {
  const t = useClock()
  const reduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const fading = !reduced && t > LOOP - 0.7

  const shown = reduced ? MSGS.filter((_, i) => [0, 1, 2, MSGS.length - 1].includes(i)) : MSGS.filter((m) => t >= m.t).slice(-VISIBLE)
  const next = reduced ? undefined : MSGS.find((m) => t < m.t)
  const typing = next && t >= next.t - TYPING

  return (
    <div
      className={`absolute left-[62%] top-[6%] z-10 w-[135px] space-y-2 transition-opacity duration-500 sm:left-[62%] sm:w-[230px] lg:top-[10%] lg:w-[300px] ${fading ? 'opacity-0' : 'opacity-100'}`}
      role="log" aria-label="Short introduction and experience"
    >
      <p className="tag flex items-center gap-1.5 !text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-ink" />Abraar</p>
      {shown.map((m) => (
        <div
          key={m.text}
          className={`pointer-events-auto w-fit max-w-full origin-top-left animate-[pop_.5s_var(--ease)] rounded-2xl rounded-tl-md px-3.5 py-2 text-[11.5px] leading-snug shadow-[inset_0_0_0_1px_rgba(13,13,13,.1),0_12px_30px_-16px_rgba(0,0,0,.3)] sm:text-[13.5px] ${m.cta ? 'bg-ink text-white' : 'bg-white text-ink'}`}
        >
          {m.cta ? (
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget('contact') }} className="font-medium">{m.text}</a>
          ) : m.text}
        </div>
      ))}
      {typing && <div className="w-fit rounded-2xl rounded-tl-md bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,.1)]"><Dots /></div>}
    </div>
  )
}
