import type { Skill } from './types'

/** Exactly the skills listed on the résumé, grouped as the résumé groups them. */
export const skills: Skill[] = [
  { name: 'Python', family: 'Languages', symbol: 'Py', note: 'Primary language across agents, RAG, models and APIs.' },
  { name: 'TypeScript', family: 'Languages', symbol: 'Ts', note: 'Production RAG and agentic systems in TypeScript.' },
  { name: 'JavaScript', family: 'Languages', symbol: 'Js', note: 'Front-end and tooling.' },
  { name: 'SQL', family: 'Languages', symbol: 'Sq', note: 'NL-to-SQL agents guarded by an AST firewall.' },
  { name: 'Bash', family: 'Languages', symbol: 'Ba', note: 'Automation and tooling.' },
  { name: 'PyTorch', family: 'AI & LLM Systems', symbol: 'Pt', note: 'Streaming ECG inference service; BeatNet.' },
  { name: 'Hugging Face Transformers', family: 'AI & LLM Systems', symbol: 'Hf', note: 'Fine-tuned RoBERTa for entity extraction.' },
  { name: 'LangGraph', family: 'AI & LLM Systems', symbol: 'Lg', note: 'Multi-agent contract review at CDF and NL-to-SQL orchestration.' },
  { name: 'MCP', family: 'AI & LLM Systems', symbol: 'Mc', note: 'Model Context Protocol tool layer for agents.' },
  { name: 'RAG', family: 'AI & LLM Systems', symbol: 'Rg', note: 'Retrieval-grounded answers with vector search.' },
  { name: 'FAISS', family: 'AI & LLM Systems', symbol: 'Fa', note: 'Multi-vector reranking in production search.' },
  { name: 'Human-in-the-Loop', family: 'AI & LLM Systems', symbol: 'Hl', note: 'Approval gate that routes high-risk contracts to a person.' },
  { name: 'LLM Evaluation', family: 'AI & LLM Systems', symbol: 'Ev', note: 'Agreement with expert review, adversarial suites, benchmark sets.' },
  { name: 'Ragas', family: 'AI & LLM Systems', symbol: 'Rs', note: 'Automated RAG quality metrics.' },
  { name: 'Arize AI', family: 'LLM Observability', symbol: 'Ar', note: 'Tracing that makes every agent decision auditable.' },
  { name: 'OpenTelemetry', family: 'LLM Observability', symbol: 'Ot', note: 'Trace IDs and per-agent timings on every answer.' },
  { name: 'FastAPI', family: 'Backend & Data', symbol: 'Fp', note: 'Secure backends and inference endpoints.' },
  { name: 'REST APIs', family: 'Backend & Data', symbol: 'Re', note: 'Contract-first API design.' },
  { name: 'PostgreSQL', family: 'Backend & Data', symbol: 'Pg', note: 'Row-level security, agent checkpoints and pooled backends.' },
  { name: 'PySpark', family: 'Backend & Data', symbol: 'Ps', note: 'Distributed batch NER extraction.' },
  { name: 'JSON Schema', family: 'Backend & Data', symbol: 'Jo', note: 'Validated, typed data contracts.' },
  { name: 'Vector Databases', family: 'Backend & Data', symbol: 'Vd', note: 'FAISS indexes at scale.' },
  { name: 'Distributed Systems', family: 'Backend & Data', symbol: 'Ds', note: 'Worker fan-out with fault isolation.' },
  { name: 'AWS', family: 'Cloud & DevOps', symbol: 'Aw', note: 'Cloud deployment.' },
  { name: 'Azure', family: 'Cloud & DevOps', symbol: 'Az', note: 'Cloud deployment.' },
  { name: 'Docker', family: 'Cloud & DevOps', symbol: 'Do', note: 'Reproducible services.' },
  { name: 'GitHub Actions', family: 'Cloud & DevOps', symbol: 'Ga', note: 'CI quality gates.' },
  { name: 'CI/CD', family: 'Cloud & DevOps', symbol: 'Ci', note: 'IEC 62304-compliant release gates.' },
  { name: 'RBAC/RLS', family: 'Cloud & DevOps', symbol: 'Rl', note: 'Tenant isolation through roles and row policies.' },
  { name: 'Claude Code', family: 'AI-Assisted Dev', symbol: 'Cc', note: 'Daily driver, with review, tests and release quality owned by me.' },
  { name: 'Cursor', family: 'AI-Assisted Dev', symbol: 'Cu', note: 'AI-assisted development.' },
]

export const FAMILIES = ['Languages', 'AI & LLM Systems', 'LLM Observability', 'Backend & Data', 'Cloud & DevOps', 'AI-Assisted Dev'] as const
