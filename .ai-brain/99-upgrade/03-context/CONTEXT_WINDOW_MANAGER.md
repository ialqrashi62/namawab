---
id: CONTEXT-WINDOW-MANAGER
version: 1.0
date: 2026-08-01
owner: AIE
status: ACTIVE
---

# Context Window Manager (CWM) — Architecture

> **Purpose:** Dynamically manage token budget per AI request to fit within model limits while preserving clinical context.

---

## 1. Why this matters (vs global systems)

| System | Approach |
|--------|----------|
| **Epic + DAX** | Encounter-level fixed window + visit-level summarization |
| **Cerner + CDA** | Sliding window per consult |
| **athena + Abridge** | Last-7-days chart + encounter transcript |
| **NamaMedical CWM** | **Hierarchical** (session → encounter → patient → cohort) with token budget allocator |

Our approach is **hierarchical memory** (better than fixed window, more deterministic than full-history).

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 Client (Provider UI)                      │
└────────────────────────┬─────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────┐
│      Context Window Manager (CWM) Service                 │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Cache Layer    │  │  Budget Allocator│               │
│  │  (HIT + Redis)  │  │  (per role)     │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │  Hierarchical   │  │  Retriever       │               │
│  │  Memory         │  │  (RAG hybrid)    │               │
│  └─────────────────┘  └─────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────┐              │
│  │  Compactor (rolling-window summarizer)  │              │
│  └─────────────────────────────────────────┘              │
└────────────────────────┬─────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────┐
│                 LLM Orchestrator                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Hierarchical Memory Levels

| Level | Granularity | Storage | Refresh |
|-------|-------------|---------|---------|
| **L0 — Session** | per-provider-session | Redis TTL 4h | every request |
| **L1 — Encounter** | per-encounter | Postgres | on encounter close |
| **L2 — Patient** | per-patient (timeline) | Postgres + PGVector | weekly |
| **L3 — Cohort** | per-cohort (specialty, condition) | PGVector materialized | nightly |

---

## 4. Token Budget Allocator (per request)

| Section | Default budget | Adjustable |
|---------|----------------|------------|
| System prompt | 800 tok | fixed |
| Patient mask + summary | 200 tok | per dept |
| Encounter payload (current) | 1000 tok | per encounter type |
| Chart history (last visit) | 1500 tok | tunable |
| Recent labs/imaging | 800 tok | tunable |
| RAG retrieval (top-5) | 1500 tok | tunable |
| Few-shot examples (2) | 800 tok | per dept |
| Citation context | 500 tok | tunable |
| **Total** | ~7,100 tok | configurable up to 128k |

For 128k models: total can scale up; for 8k models: aggressive compaction.

---

## 5. Patient Timeline API (canonical)

```
GET /api/v1/context/patients/:id/timeline
   ?since=2026-04-01T00:00:00Z
   &until=2026-08-01T00:00:00Z
   &categories=encounters,labs,imaging,medications,notes
   &max_tokens=4000
   &format=hierarchical  # flat | hierarchical
   &locale=ar-SA|EN
```

Response:
```json
{
  "patient_id_hash": "h_abc123",
  "summary": {
    "demographics": { "age_band": "55-64", "sex": "M" },
    "active_problems": ["HTN", "T2DM", "CKD-3"],
    "current_meds": [...],
    "allergies": [...],
    "last_visit_summary": "..."
  },
  "timeline": [
    { "date": "2026-07-15", "type": "encounter", "id": "ENC-001", "summary": "...", "token_estimate": 250 },
    ...
  ],
  "compaction": {
    "method": "rolling_window",
    "compression_ratio": 0.32,
    "tokens_after_compaction": 1280,
    "tokens_before_compaction": 4000
  },
  "next": { "page_token": "...", "has_more": true }
}
```

---

## 6. Compactor (rolling window)

When chart exceeds budget, apply:

1. **Most recent first**: keep last 2 visits full
2. **Older visits → summary** (1 paragraph per visit)
3. **Labs older than 90 days → ranges** (e.g., "HbA1c 7.0–8.2 over last year")
4. **Imaging older than 1y → only conclusion**
5. **Demographic, allergies, current meds → ALWAYS full**

Token estimate per row:
- Encounter: 250
- Lab single: 80
- Imaging report: 350
- Note: 400
- Medication order: 60

---

## 7. RAG Augmentation (hybrid retriever)

When system prompt requests additional context (e.g., guidelines), CWM queries:

1. **Vector** — pgvector (multilingual-e5-large, 1024d)
2. **BM25** — postgres FTS
3. **Knowledge Graph** — SNOMED+ICD+LOINC relationships
4. **Tenant-scoped filter** — `tenant_id` always set

Merged results → top-5 chunks → injected into context window.

---

## 8. Configuration

```yaml
context_config:
  default_model: gpt-4o
  budgets:
    gpt-4o: 128000
    claude-3.5: 200000
    med-llama: 8000
  strategies:
    compress_old_visits: true
    keep_recent_labs_full: 14   # days
    max_imaging_reports: 3
  red_flags:
    on_budget_exceeded: shrink_rag_first
    on_emergency: bypass_compaction
```

---

## 9. Code surface (file list)

```
src/context/
├── cwm_router.js              # HTTP entry
├── hierarchical_memory/
│   ├── L0_session_store.js    # Redis
│   ├── L1_encounter_repo.js   # Postgres
│   ├── L2_patient_repo.js     # Postgres + pgvector
│   └── L3_cohort_repo.js      # PGVector materialized
├── budget_allocator.js
├── compactor.js
├── retriever/
│   ├── vector.js
│   ├── bm25.js
│   ├── knowledge_graph.js
│   └── hybrid.js
├── timeline_api.js
├── audit.js
└── index.js
```

---

## 10. Tests

- Unit: each level, budget allocator, compactor
- Integration: cross-tenant isolation, retrieval recall@5
- E2E: prompt within budget; graceful degradation when exceeded
- Clinical safety: red flag never lost in compaction

---

*Owner: AIE — version 1.0 — 2026-08-01*
