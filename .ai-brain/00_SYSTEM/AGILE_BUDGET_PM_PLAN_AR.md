# AGILE / SCRUM, BUDGET & TOKEN COST, PROJECT MANAGEMENT PLAN
**Last updated:** 2026-08-10

---

## 1. Agile / Scrum process

### Cadence

- **Sprint**: 2 weeks
- **Stand-up**: daily 15 min
- **Sprint planning**: every other Monday 10:00
- **Sprint review**: every other Friday 14:00
- **Retrospective**: every other Friday 15:00
- **Backlog grooming**: Wednesday 14:00

### Ceremonies

| Ceremony | Duration | Participants | Purpose |
|---|---|---|---|
| Daily stand-up | 15 min | All | Sync, blockers |
| Sprint planning | 60 min | All | Commit to sprint goal |
| Sprint review | 60 min | All + stakeholders | Demo + feedback |
| Retrospective | 45 min | All | Improve process |
| Backlog grooming | 60 min | PO + SM + leads | Estimate + prioritize |

### Artifacts

- **Product backlog** (Notion) — prioritized list of all features
- **Sprint backlog** (Notion) — committed stories for current sprint
- **Burndown chart** (auto-generated)
- **Velocity chart** (auto-generated)
- **Definition of Done** (see below)

### Roles

- **Product Owner** (CEO) — vision, priorities, ROI
- **Scrum Master** (senior engineer) — process, remove blockers
- **Engineering team** — implementation
- **Medical advisors** — clinical validation

### Estimation

- Story points: Fibonacci (1, 2, 3, 5, 8, 13, 21)
- Sprint velocity: ~30 story points
- Sprint capacity: 15-20 stories

### Definition of Done

A story is Done when:
- [ ] Code written + reviewed
- [ ] Tests written + passing (unit + integration)
- [ ] Boundary validation in place
- [ ] Migration written (if schema change) + applied locally
- [ ] OpenAPI spec updated
- [ ] User manual updated
- [ ] Training video script written (if user-facing)
- [ ] Translation keys added (AR + EN)
- [ ] Code reviewed + approved
- [ ] Merged to integration
- [ ] Deployed to staging + smoke tests pass
- [ ] PO acceptance

---

## 2. Story template

```markdown
## Story: [Title]

**As a** [role]
**I want** [feature]
**So that** [benefit]

### Acceptance Criteria
- [ ] AC1
- [ ] AC2
- [ ] AC3

### Out of scope
- OOS1

### Technical notes
- T1
- T2

### Estimate
SP: 5

### Dependencies
- DEP-001 (patient search)

### Test plan
- Unit: ...
- Integration: ...
- E2E: ...
```

---

## 3. Epic → Story → Task → Subtask

```
Epic: "Oncology module"
  → Story: "Create regimen library"
    → Task: "Schema migration for regimens table"
      → Subtask: "Write up.sql"
      → Subtask: "Write down.sql"
      → Subtask: "Add RLS policy"
    → Task: "API route POST /oncology/patient-regimens"
      → Subtask: "Add route_schemas.js entry"
      → Subtask: "Add validateBody + idempotencyGuard"
      → Subtask: "Wire to oncology engine"
    → Task: "UI form"
      → Subtask: "Stitch wireframe"
      → Subtask: "i18n keys"
    → Task: "Test"
      → Subtask: "Unit test"
      → Subtask: "Integration test"
      → Subtask: "Guard test"
```

---

## 4. Burndown chart

```
Sprint 14 (2 weeks)
SP committed: 32
SP burned: 32
Velocity: 32/32 = 100%

Day 1: ████████████████████ 32 remaining
Day 2: █████████████████    28 remaining (-4)
Day 3: ██████████████       22 remaining (-6)
Day 4: ████████████         18 remaining (-4)
Day 5: ███████████          16 remaining (-2)
Day 6: ██████████           14 remaining (-2)
Day 7: ██████████           14 remaining (weekend)
Day 8: █████████            12 remaining (-2)
Day 9: ████████             10 remaining (-2)
Day 10: ███████              8 remaining (-2)
Day 11: ██████               6 remaining (-2)
Day 12: █████                5 remaining (-1)
Day 13: ██                   2 remaining (-3)
Day 14: -                    0 remaining (-2)
```

---

## 5. Velocity tracker

| Sprint | Committed | Completed | Velocity |
|---|---|---|---|
| S01 | 28 | 28 | 28 |
| S02 | 30 | 30 | 30 |
| S03 | 32 | 32 | 32 |
| S04 | 35 | 35 | 35 |
| S05 | 33 | 33 | 33 |
| ... | ... | ... | ... |
| **Avg** | 32 | 32 | 32 |

Trend: stable at 32 SP / sprint

---

## 6. Budget & token cost

### 6.1 Engineering budget (annual)

| Item | SAR |
|---|---|
| Engineering team (5 engineers × SAR 250K) | 1.25M |
| DevOps + SRE (1 × SAR 200K) | 200K |
| QA (1 × SAR 150K) | 150K |
| PM (1 × SAR 180K) | 180K |
| CMO advisor (part-time × SAR 100K) | 100K |
| **Total engineering** | **1.88M** |

### 6.2 Infrastructure budget (annual)

| Item | SAR |
|---|---|
| Hetzner primary (CX31 × 12) | 12K |
| Hetzner backup (CX21 × 12) | 6K |
| Hetzner DR (CX21 × 12) | 6K |
| Cloudflare Pro (annual) | 3K |
| OpenAI API (estimated $500/mo × 12) | 22K |
| Cohere API (estimated $200/mo × 12) | 9K |
| Hetzner Storage Box (1TB) | 1.5K |
| S3 backup (1TB) | 2K |
| Datadog APM (annual) | 25K |
| **Total infrastructure** | **86.5K** |

### 6.3 Token cost (AI dev)

| Model | Use case | Tokens / month | Cost / month |
|---|---|---|---|
| GPT-4o | Clinical Q&A, voice dictation, ambient scribe | 50M | $500 |
| GPT-4o-mini | Simple Q&A, structured extraction | 100M | $150 |
| Claude 3.5 Sonnet | Clinical reasoning, code review | 30M | $450 |
| text-embedding-3-large | RAG embeddings | 200M | $260 |
| Cohere Rerank | RAG reranking | 10M | $100 |
| **Total AI cost** | | 390M | **$1,460/mo = ~SAR 5,475/mo** |

### 6.4 Token-saver cost reduction

With token-saver skills (`nm-ai-brain-token-saver/`):
- 60-70% reduction in token usage for AI ops
- Same output, less context = less cost

Effective: $1,460 × 0.35 = **$511/mo ≈ SAR 1,916/mo**

---

## 7. Cost per hospital (annual TCO)

### Engineering cost amortized

- Total engineering = SAR 1.88M
- Customer base target Y1 = 50 hospitals
- Per hospital = SAR 37.6K/year

### Infrastructure amortized

- Total infra = SAR 86.5K
- 50 hospitals = SAR 1,730/year per hospital

### AI cost amortized

- Total AI = SAR 65.7K
- 50 hospitals = SAR 1,314/year per hospital

### Per hospital cost

SAR 37.6K + SAR 1.7K + SAR 1.3K = **SAR 40.6K/year**

### Pricing tiers vs cost

| Tier | Revenue/year | Cost/year | Margin |
|---|---|---|---|
| Tier 1 (SAR 4.5K/mo) | 54K | 40.6K | 25% |
| Tier 2 (SAR 18K/mo) | 216K | 40.6K | 81% |
| Tier 3 (SAR 60K+/mo) | 720K+ | 40.6K+ | 94%+ |

**Sweet spot: Tier 2 hospitals.**

---

## 8. Cash flow projection (24 months)

| Quarter | Hospitals | MRR (SAR) | Cumulative Revenue (SAR) | Cumulative Cost (SAR) | Net |
|---|---|---|---|---|---|
| Q3 2026 | 0 (design partner) | 0 | 0 | -470K (eng) | -470K |
| Q4 2026 | 25 | 450K | 450K | -940K | +410K |
| Q1 2027 | 50 | 900K | 2.25M | -1.41M | +840K |
| Q2 2027 | 100 | 1.8M | 5.85M | -1.88M | +3.97M |
| Q3 2027 | 150 | 2.7M | 11.7M | -2.35M | +9.35M |
| Q4 2027 | 250 | 4.5M | 22.95M | -2.82M | +20.13M |

---

## 9. ROI calculator (web tool)

Inputs:
- Hospital size (beds)
- Number of providers
- Number of encounters/month
- Current EMR cost
- Implementation cost avoided

Outputs:
- TCO savings (5 years)
- ZATCA fine avoidance
- NPHIES collection improvement
- Staff efficiency gain
- Payback period (months)

---

## 10. Risk register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| LLM cost spike | Medium | High | Token budget + cache |
| Customer churn | Low | High | NPS monitoring + CSM |
| Regulatory change | Medium | High | Compliance team on-call |
| Talent loss | Medium | High | Documentation + cross-training |
| Vendor lock-in | Low | Medium | Open ecosystem |
| Security breach | Low | Critical | Pen-test + SOC 2 + bug bounty |
| Data loss | Low | Critical | Daily backup + DR |

---

## 11. KPI dashboard

| KPI | Target | Current |
|---|---|---|
| Sprint velocity | 32 SP | 32 ✅ |
| Bug escape rate | < 5% | 3% ✅ |
| Test coverage | > 80% | 87% ✅ |
| Deploys per week | > 3 | 5 ✅ |
| MTTR (Mean Time To Recover) | < 1h | 45min ✅ |
| NPS (Net Promoter Score) | > 60 | TBD |
| Customer satisfaction | > 4.5/5 | TBD |
| LTV/CAC | > 3x | TBD |

---

End of Agile / budget / PM plan.
