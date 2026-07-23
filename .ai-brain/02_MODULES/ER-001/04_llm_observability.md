---
module_id: ER-001
section: 02_ai_orchestration
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 LLM Observability (LLMOps)

## Stack
- **Tracing:** LangSmith (or LangFuse self-hosted)
- **Metrics:** Prometheus + Grafana
- **Logs:** Loki + Promtail
- **APM:** Datadog or New Relic
- **Cost tracking:** custom + OpenAI/Anthropic dashboards

## What We Trace (Every Call)
```yaml
trace_metadata:
  trace_id: uuid
  span_id: uuid
  parent_span_id: uuid
  service: "er-service"
  environment: production
  tenant_id: uuid
  user_id: uuid
  encounter_id: uuid
  module: "ER-001"
  agent: "TriageAI" | "ChestPainAI" | "SepsisAI" | etc.
  tool: "esi_classifier" | "ecg_interpreter" | etc.
  llm_model: "gpt-4o" | "claude-3.5-sonnet" | etc.
  llm_version: "2024-01"
  prompt_version: "v1.2.3"
  temperature: 0.0
  input_tokens: int
  output_tokens: int
  total_tokens: int
  cost_usd: float
  latency_ms: int
  status: success | error | timeout
  error_message: str (if error)
  output_hash: str (for replay)
  input_hash: str (for audit)
```

## State Snapshots
- Every state change: full state JSON
- Replay: re-run with same input + state for debugging
- Diff: compare two runs to identify regression

## Key Metrics

### Performance
| Metric | Target | Alert |
|--------|--------|-------|
| Triage agent p50 latency | <2s | >5s |
| Triage agent p99 latency | <5s | >10s |
| ECG interpreter p99 | <3s | >8s |
| Sepsis bundle initiation p99 | <5s | >15s |

### Quality
| Metric | Target | Calculation |
|--------|--------|-------------|
| ESI auto-classification accuracy | >90% | vs RN gold standard (sample 100/week) |
| Red flag detection sensitivity | >99% | chart review for missed red flags |
| Red flag detection precision | >80% | false positive rate |
| Triage override rate | <15% | (overridden by MD / total) |
| Drug alert precision | >80% | MD-confirmed true interactions |
| Citation accuracy | >90% | spot-check 50 citations/week |

### Cost
| Metric | Target |
|--------|--------|
| Cost per encounter | <$0.50 |
| Cost per red flag detection | <$0.05 |
| Monthly LLM cost | <$5,000 |

### Reliability
| Metric | Target |
|--------|--------|
| LLM availability | >99.5% |
| Fallback activation rate | <5% |
| Error rate | <1% |

## Drift Monitoring

### Data Drift
- Input distribution shift (patient population, symptoms)
- New drug market entries (RxNorm updates)
- Guideline updates (monthly check)

### Model Drift
- Accuracy degradation on validation set (weekly)
- Calibration drift (predicted vs actual outcomes)
- Embedding drift (cluster movement)

### Concept Drift
- New disease patterns (e.g., new pandemic)
- Practice changes (telehealth surge)

### Response
- Auto-alert on drift detection
- Trigger retraining pipeline
- Roll back to previous model version if performance drops
- A/B test new model before full rollout

## Golden Dataset (Eval)

### Per Use Case
- 100-500 Q&A pairs with verified answers
- Updated quarterly

### Coverage
- Top 50 ER diagnoses
- Top 20 procedures
- All 8 red flag categories (cat 1-5)
- All 18 clinical calculators
- Drug interactions (top 100 pairs)
- Allergic reactions (top 50 drugs)

### Eval Methods
- BLEU/ROUGE for text similarity
- LLM-as-judge (with medical LLM) for clinical accuracy
- Citation accuracy (does citation support claim?)
- Hallucination detection (semantic similarity to source)
- Human review (monthly, random sample)

## Pre-Deployment Gates
- All unit tests pass
- All clinical safety tests pass
- Golden dataset accuracy >95%
- Citation accuracy >90%
- Hallucination rate <5%
- Latency p99 <SLA
- Cost per call <budget

## Alerts
- Agent success rate <95% for 1h → page
- Agent p99 >10s for 30m → page
- Cost spike >200% baseline → alert
- Hallucination rate >5% → page
- Red flag miss (cat 1-2) → IMMEDIATE page (CMO, AIE, on-call)

## Audit & Compliance
- Every LLM call: input hash, output hash, model, version, cost
- PII redaction: never send unredacted PHI to external LLM
- Patient consent: opt-out flag per patient (skip AI, use rule-based)
- Regulatory: SFDA/HIPAA logging requirements met

## Replay & Debug
- "Replay" button: re-run with same input + state
- "Why did you say that?" → show retrieval chunks + reasoning
- "What if input was X?" → counterfactual analysis

---
*Section 02.d of ER-001. Owner: AIE. L4 validated.*
