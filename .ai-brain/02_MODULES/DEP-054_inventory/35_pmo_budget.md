# PMO Budget — Inventory_Supply_Chain (DEP-054)

> **PM:** Master Orchestrator · **Generated:** 2026-08-08

## 1. Story Points (Agile/Scrum)
| Epic | SP |
|---|---|
| Backend engine + RLS + RBAC | 8 |
| Frontend station (Stitch) + i18n | 5 |
| RAG ingestion + chains | 3 |
| Migrations + ERD + seeds | 3 |
| Tests (unit + integration + BDD) | 5 |
| Docs (manual AR/EN + training) | 2 |
| Compliance (JCI/CBAHI/PDPL) | 2 |
| **TOTAL** | **28 SP** |

## 2. Sprint Plan (2-week sprints)
| Sprint | Tasks |
|---|---|
| Sprint 1 | Design + Backend engine + Tests (15 SP) |
| Sprint 2 | Frontend + RAG + Docs (13 SP) |

## 3. Token Budget
| Phase | Tokens |
|---|---|
| Plan | 2,000 |
| Backend (engine + service + router) | 5,000 |
| Frontend (page + components + client) | 4,000 |
| RAG (chains + agents + pipeline) | 3,000 |
| Tests (3 files) | 3,000 |
| Docs (manual + training) | 2,000 |
| **TOTAL** | **~19,000 tokens** |

## 4. Cost Estimate (LLM)
- Avg $0.005 per 1k tokens (input) + $0.015 per 1k tokens (output)
- Per dept: ~$0.50 LLM cost
- For 60 depts: ~$30 LLM cost (one-time)

## 5. Wall-Clock Time
- Per dept (sequential): ~30 minutes
- Per dept (parallel, 7 experts): ~5 minutes
- For 60 depts: ~5 hours parallel

## 6. Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| RLS policy conflict | Medium | High | Test cross-tenant in CI |
| i18n missing key | High | Low | Auto-generate from ar.json |
| Migration drift | Medium | High | Always generate up + down symmetric |
| Token budget exceed | Medium | Medium | Truncate + appendix |

## 7. Acceptance Criteria
- [ ] Station loads in <500ms
- [ ] API endpoints respond in <200ms
- [ ] RLS blocks cross-tenant (test passed)
- [ ] i18n AR + EN complete
- [ ] RAG returns answer in <800ms
- [ ] All 35 files generated
- [ ] Tests pass (unit + integration + BDD)
- [ ] Manual AR + EN written
- [ ] Compliance mapping done

## 8. Dependencies
- Parent: operational
- Related depts: 

## 9. Definition of Done
- Code merged to `integration/all-epics`
- Tests pass in CI
- Reviewed by MO + 1 expert
- Index updated
- CHANGELOG entry added

## 10. Go/No-Go
**Owner signal: ACTIVE — GO**