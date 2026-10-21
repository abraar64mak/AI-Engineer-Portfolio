import { Check, Loader2, ShieldCheck, UserCheck, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SAMPLES = [
  { label: 'Office supplies MSA', text: 'Supplier will deliver office supplies monthly. Payment is due net 30. Supplier’s liability is limited to the fees paid in the prior 12 months. Either party may terminate for convenience on 30 days notice.' },
  { label: 'Logistics services', text: 'Carrier provides freight services for 24 months and this agreement will automatically renew for successive 12 month terms. Carrier shall indemnify Customer against third-party claims arising from carrier negligence. Payment is due net 45.' },
  { label: 'SaaS vendor agreement', text: 'Vendor’s liability under this agreement shall not be limited in any way. Vendor shall indemnify and hold harmless Customer from any and all claims, losses and damages. This agreement will automatically renew annually. Payment is due net 90.' },
]

interface Finding { clause: string; why: string; points: number }
const RULES: { clause: string; re: RegExp; why: string; points: number }[] = [
  { clause: 'Unlimited liability', re: /(?:shall not be limited|unlimited liability|without limit)/i, why: 'No cap on liability', points: 40 },
  { clause: 'Broad indemnity', re: /any and all claims|indemnify and hold harmless/i, why: 'Indemnifies against any and all claims', points: 30 },
  { clause: 'Indemnity', re: /indemnif/i, why: 'Indemnity obligation present', points: 15 },
  { clause: 'Auto-renewal', re: /automatically renew/i, why: 'Renews without notice', points: 10 },
  { clause: 'Long payment terms', re: /net (?:6\d|[7-9]\d|\d{3})\b/i, why: 'Payment terms over 60 days', points: 10 },
]
const STAGES = ['Parse document', 'LLM clause extraction', 'Rule checks', 'Risk score', 'Route']

function analyse(text: string) {
  const found: Finding[] = []
  let broad = false
  RULES.forEach((r) => {
    if (!r.re.test(text)) return
    if (r.clause === 'Indemnity' && broad) return
    if (r.clause === 'Broad indemnity') broad = true
    found.push({ clause: r.clause, why: r.why, points: r.points })
  })
  const capped = /liability[^.]{0,60}(?:limited to|capped)/i.test(text)
  const score = Math.min(100, found.reduce((n, f) => n + f.points, 0))
  return { found, capped, score, auto: score < 25 }
}

export default function ContractDemo() {
  const [si, setSi] = useState(0)
  const [text, setText] = useState(SAMPLES[0].text)
  const [stage, setStage] = useState(0)
  const [decision, setDecision] = useState<null | 'approved' | 'rejected'>(null)
  const timer = useRef<number>(0)

  const run = (t = text, i = si) => {
    window.clearInterval(timer.current)
    setSi(i); setText(t); setDecision(null); setStage(0)
    let s = 0
    timer.current = window.setInterval(() => { s++; setStage(s); if (s >= STAGES.length) window.clearInterval(timer.current) }, 420)
  }
  useEffect(() => { run(SAMPLES[0].text, 0); return () => window.clearInterval(timer.current) }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const r = analyse(text)
  const done = stage >= STAGES.length

  return (
    <div className="space-y-5">
      <div>
        <p className="mono-label mb-2">1 · Pick a (synthetic) contract, or edit the text</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLES.map((x, i) => (
            <button key={x.label} onClick={() => run(x.text, i)} className={`rounded-lg border px-3 py-2 text-left text-sm transition ${i === si && text === x.text ? 'border-cyan-300/60 bg-cyan-300/10 text-white' : 'border-cyan-300/15 text-slate-300 hover:border-cyan-300/40'}`}>{x.label}</button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} spellCheck={false} aria-label="Contract text" className="w-full resize-none rounded-lg border border-cyan-300/20 bg-ink-950/80 p-3 text-sm text-slate-200 outline-none focus:border-cyan-300/60" />
        <button onClick={() => run()} className="btn btn-primary mt-3">Run through the agents</button>
      </div>

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {STAGES.map((s, i) => {
          const ok = stage > i, cur = stage === i && stage < STAGES.length
          return (
            <li key={s} className={`rounded-lg border p-3 text-xs leading-snug transition ${ok ? 'border-emerald-400/30 bg-emerald-400/5 text-slate-200' : cur ? 'border-cyan-300/50 bg-cyan-300/10 text-white' : 'border-cyan-300/10 text-slate-500'}`}>
              <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px]">{ok ? <Check size={12} className="text-emerald-300" /> : cur ? <Loader2 size={12} className="animate-spin text-cyan-300" /> : <span className="h-3 w-3" />}0{i + 1}</span>{s}
            </li>
          )
        })}
      </ol>

      {done && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <p className="mono-label mb-2">2 · Flagged clauses</p>
            {r.found.length === 0 && !r.capped ? <p className="rounded-lg border border-cyan-300/10 p-3 text-sm text-slate-400">No risky clauses found.</p> : (
              <ul className="space-y-2">
                {r.capped && <li className="rounded-lg border border-emerald-400/25 bg-emerald-400/5 p-3 text-sm"><span className="font-mono text-[11px] text-emerald-300">Liability capped</span><span className="mt-0.5 block text-slate-300">Cap found, no points added.</span></li>}
                {r.found.map((f) => (
                  <li key={f.clause} className="rounded-lg border border-amber-300/30 bg-amber-300/5 p-3 text-sm">
                    <span className="flex items-center justify-between font-mono text-[11px] text-amber-200"><span>{f.clause}</span><span>+{f.points}</span></span>
                    <span className="mt-0.5 block text-slate-300">{f.why}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mono-label mb-2">3 · Risk score and routing</p>
            <div className="rounded-lg border border-cyan-300/15 bg-ink-900/60 p-4">
              <div className="flex items-end justify-between"><span className="font-mono text-3xl font-semibold text-white">{r.score}<span className="text-base text-slate-500"> / 100</span></span><span className="font-mono text-[11px] text-slate-400">auto-clear below 25</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-700"><div className={`h-full rounded-full transition-all duration-500 ${r.auto ? 'bg-emerald-400' : 'bg-amber-300'}`} style={{ width: `${r.score}%` }} /></div>

              {r.auto ? (
                <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-200"><ShieldCheck size={18} />Auto-cleared as low risk</p>
              ) : decision ? (
                <p className={`mt-4 flex items-center gap-2 font-semibold ${decision === 'approved' ? 'text-emerald-200' : 'text-rose-200'}`}>{decision === 'approved' ? <Check size={18} /> : <X size={18} />}Reviewer {decision}. Decision logged.</p>
              ) : (
                <div className="mt-4">
                  <p className="flex items-center gap-2 font-semibold text-amber-200"><UserCheck size={18} />Waiting at the human approval gate</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setDecision('approved')} className="rounded-md border border-emerald-400/50 bg-emerald-400/10 px-3 py-1.5 font-mono text-xs text-emerald-200">Approve</button>
                    <button onClick={() => setDecision('rejected')} className="rounded-md border border-rose-400/50 bg-rose-400/10 px-3 py-1.5 font-mono text-xs text-rose-200">Reject</button>
                  </div>
                </div>
              )}
              <p className="mt-4 font-mono text-[11px] text-slate-500">checkpoint saved · trace logged</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">Scripted illustration with simple rules on synthetic text. In production at CDF, LangGraph agents using LLM extraction and rule checks reached 94% agreement with legal review, auto-cleared 55% of contracts and cut manual triage time 65%.</p>
          </div>
        </div>
      )}
    </div>
  )
}
