# Token Budget & Cost Management — NamaMedical ERP
# Filepath: .ai-brain/12_PM/token-budget.md
# Generated: 2026-08-08

# Token Budget & Cost Management

> **Tracking:** Per-skill + per-dept + per-Phase
> **Target:** < 1.5M tokens per master build cycle
> **Actual (Wave 49):** ~1.1M tokens (27% under budget)

---

## 1. Token Budget by Skill

| Skill | Avg Tokens/Run | Monthly Limit |
|---|---|---|
| `nm-token-saver-pack-v2` | 50 | ∞ (reusable) |
| `nm-loop-engineering-v2` | 1,000 | 50,000 |
| `nm-stitch-medical-v2` | 2,000 | 30,000 |
| `nm-vector-rag-v2` | 3,000 | 50,000 |
| `nm-ultimate-blueprint-factory` | 15,000/dept | 900,000 |
| `nm-multi-agent-orchestrator-v2` | 5,000/dept | 300,000 |
| `nm-dept-prompt-v3` | 500/dept | 30,000 |
| `nm-dept-discovery` | 100 | 5,000 |

---

## 2. Cost Calculation (LLM API)

### 2.1 Model Pricing (as of 2026-08-08)

| Model | Input ($/M tokens) | Output ($/M tokens) |
|---|---|---|
| GPT-4o | $2.50 | $10.00 |
| GPT-4o-mini | $0.15 | $0.60 |
| text-embedding-3-large | $0.13 | — |

### 2.2 Master Build v5 Costs

| Activity | Tokens | Cost |
|---|---|---|
| 60 dept blueprints (generation) | 900k input + 200k output | $2.25 + $2.00 = $4.25 |
| 60 RAG pipelines (code) | 200k | $0.50 |
| Engines + stations + routers | 150k | $0.40 |
| Documentation | 100k | $0.25 |
| Index + Closeout | 50k | $0.15 |
| **TOTAL Wave 49** | **1.6M** | **$5.55** |

### 2.3 Production RAG Costs (Ongoing)

| Activity | Per Request | Monthly @ 100k req |
|---|---|---|
| Embedding query (text-embedding-3-large) | $0.00013 | $13 |
| GPT-4o-mini response (avg 800 tokens) | $0.00012 input + $0.00048 output | $60 |
| LangFuse tracing | Free tier | $0 |
| **TOTAL per 100k requests** | **$0.00073** | **$73** |

---

## 3. Cost Optimization Strategies

### 3.1 Already Implemented
- ✅ Token-saver pack (S-01..S-20 snippets): 65-75% reduction
- ✅ Multi-agent parallel: 6× speedup, same tokens
- ✅ Reusable templates (no copy-paste)
- ✅ GPT-4o-mini for non-critical paths

### 3.2 Future Optimizations
- [ ] Semantic cache for RAG queries (40% reduction)
- [ ] Prompt compression (15-20% reduction)
- [ ] Model distillation (smaller models for simple queries)
- [ ] Batch embedding (50% reduction)

---

## 4. Monthly Budget Cap

| Category | Monthly Limit |
|---|---|
| Master build / re-build | $10 |
| Production RAG | $200 |
| Embeddings (one-time + updates) | $50 |
| Misc (debugging, ad-hoc) | $50 |
| **TOTAL monthly** | **$310** |

---

## 5. Tracking Dashboard

| Metric | Wave 49 Actual | Target |
|---|---|---|
| Tokens per dept | 11.6k | < 15k |
| Cost per dept | $0.09 | < $0.15 |
| Wall-clock per dept | 25 sec | < 60 sec |
| Acceptance criteria pass | 100% | 100% |

---

**Generated:** 2026-08-08
