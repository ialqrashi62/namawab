<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — LLM Observability (LangSmith + Helicone + Custom)

## LLM Gateway
- Primary: gpt-4o (OpenAI)
- Secondary: claude-3.5-sonnet (Anthropic)
- Tertiary: med-llama-70b (self-hosted)
- Quaternary: rule-based cath_lab_engine.js (always available as floor)

## PII Redaction (BEFORE external LLM)
- Patient name → [NAME]
- MRN → [MRN]
- National ID → [NATID]
- Phone → [PHONE]
- Address → [ADDRESS]
- Date of birth → [AGE: 58] (age only)
- DOB-based date calculations → [DATE: -7d] (relative)

## RAG Pipeline (6 stages)
1. **Query rewrite** — expand medical abbreviations, add context
2. **Hybrid retrieval** — vector (0.5) + BM25 (0.3) + KG (0.2), Top-K=20
3. **Rerank** — Cohere rerank, Top-K=5
4. **Context window** — ≤4000 tokens
5. **LLM call** — primary model, fallback chain
6. **Validation** — citation check, hallucination detection

## Observability Stack
- **LangSmith** — LLM call trace, prompt versioning, eval
- **Helicone** — cost tracking, latency, error rate
- **OpenTelemetry** — distributed tracing across services
- **Custom metrics** — clinical-specific (D2B compliance, MD override rate)

## Drift Monitoring
- **Data drift:** input distribution shift (symptoms, demographics)
- **Model drift:** output distribution shift
- **Concept drift:** relationship between input and outcome changes
- **Hallucination rate:** manual review weekly sample (n=20)
- **Citation accuracy:** required for all non-trivial recommendations

## Eval Framework
- Golden dataset: 100 cases (STEMI, NSTEMI, structural heart, complications)
- Automated metrics: BLEU/ROUGE for text, exact match for scores
- LLM-as-judge: GPT-4 evaluates response quality
- Human-in-loop: monthly chart review by CMO

## Audit (per LLM call)
- Input hash (SHA-256 of redacted prompt)
- Output hash (SHA-256 of LLM response)
- Model + version
- Token count (input + output)
- Cost (USD)
- Latency (ms)
- Citations (URLs or doc IDs)
- User ID (who triggered the LLM)
- Patient context (encounter ID, no PHI)
- Audit event: cath.llm.assisted

## Override Tracking
- MD override of AI recommendation → audit + reason
- Override rate per provider (feedback loop)
- Override rate per rule (identify weak rules)
- Adverse events linked to AI suggestions (RCA)

---
*Section 30 of CARD-002. AIE voice. L1 DRAFT.*