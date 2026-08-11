# Agile/Scrum Plan — NamaMedical ERP (Wave 49 — 60 Departments)
# Filepath: .ai-brain/12_PM/agile-sprint-plan.md
# Generated: 2026-08-08

# Agile/Scrum Plan — Master Build v5

> **Sprint length:** 2 weeks
> **Total story points (v5):** 1,200 SP
> **Team:** 7 specialists + 1 orchestrator (AI/Agent mode)
> **Velocity target:** 120 SP/sprint

---

## 1. Sprint Backlog (10 sprints × 2 weeks)

### Sprint 49 (current) — Master Plan v5 Foundation ✅ DONE
| Story | SP | Status |
|---|---|---|
| Discovery + Plan | 8 | ✅ |
| 8 v2 skills | 16 | ✅ |
| 60 dept blueprints × 35 files | 800 | ✅ |
| 60 engines + 49 stations + 60 routers | 120 | ✅ |
| 124 migrations + 60 tests | 80 | ✅ |
| 60 RAG pipelines | 40 | ✅ |
| DevOps + CI/CD + APM | 40 | ✅ |
| Index + Closeout | 16 | ✅ |
| **TOTAL Sprint 49** | **1,120** | **✅ COMPLETE** |

### Sprint 50 — Production Deploy
| Story | SP | Status |
|---|---|---|
| Owner authorization | 3 | ☐ |
| Sandbox DB apply | 5 | ☐ |
| Staging smoke test | 8 | ☐ |
| Production migration apply | 13 | ☐ |
| PM2 reload | 3 | ☐ |
| Health check | 5 | ☐ |
| 24h monitoring | 8 | ☐ |
| Stakeholder notify | 3 | ☐ |
| **TOTAL Sprint 50** | **48** | ☐ |

### Sprint 51 — RAG Knowledge Ingestion
| Story | SP | Status |
|---|---|---|
| Source curation (Uptodate, SFDA, ICD-10, SNOMED) | 21 | ☐ |
| Ingestion scripts | 13 | � |
| Embedding pipeline | 21 | ☐ |
| Quality eval (RAGAS) | 13 | ☐ |
| Cost tracking | 5 | ☐ |
| **TOTAL Sprint 51** | **73** | ☐ |

### Sprint 52 — Behavioral Health + Population Health (Gap Fill)
| Story | SP | Status |
|---|---|---|
| Psychiatry + Psychology full UI | 21 | ☐ |
| Substance use disorder module | 13 | ☐ |
| Registry engine | 21 | ☐ |
| Outreach scheduler | 13 | ☐ |
| Risk stratification | 13 | ☐ |
| **TOTAL Sprint 52** | **81** | � |

### Sprint 53 — Telehealth + Voice NLP
| Story | SP | Status |
|---|---|---|
| WebRTC signaling server | 21 | ☐ |
| Video visit UI | 13 | ☐ |
| Whisper voice-to-text | 13 | ☐ |
| Structured extraction | 21 | ☐ |
| **TOTAL Sprint 53** | **68** | ☐ |

### Sprint 54 — Mobile PWA + Push
| Story | SP | Status |
|---|---|---|
| PWA shell | 13 | ☐ |
| Push notifications | 13 | ☐ |
| Offline sync | 21 | ☐ |
| Service worker | 8 | ☐ |
| **TOTAL Sprint 54** | **55** | ☐ |

### Sprint 55 — Wearable + IoT + K8s
| Story | SP | Status |
|---|---|---|
| Apple Watch ingestion | 13 | ☐ |
| Fitbit + glucometer | 13 | ☐ |
| K8s manifests | 21 | ☐ |
| Helm charts | 13 | ☐ |
| **TOTAL Sprint 55** | **60** | ☐ |

### Sprint 56 — Analytics + Quality Measures
| Story | SP | Status |
|---|---|---|
| OLAP dashboards | 21 | ☐ |
| Clinical quality measures (CQM) | 21 | ☐ |
| Mortality analytics | 13 | ☐ |
| Readmission prediction | 13 | ☐ |
| **TOTAL Sprint 56** | **68** | ☐ |

### Sprint 57 — Multi-language Expansion
| Story | SP | Status |
|---|---|---|
| French (FR) i18n | 13 | ☐ |
| Urdu (UR) i18n | 13 | � |
| Hindi (HI) i18n | 13 | ☐ |
| RTL audit | 8 | ☐ |
| **TOTAL Sprint 57** | **47** | ☐ |

### Sprint 58 — Microservices Migration
| Story | SP | Status |
|---|---|---|
| Kafka setup | 21 | ☐ |
| Billing service carve-out | 21 | ☐ |
| Notifications service | 13 | ☐ |
| Event sourcing | 21 | ☐ |
| **TOTAL Sprint 58** | **76** | ☐ |

### Sprint 59 — Epic Parity Push
| Story | SP | Status |
|---|---|---|
| Gap analysis (5% remaining) | 8 | ☐ |
| Missing features implementation | 60 | ☐ |
| External pentest | 21 | ☐ |
| Documentation polish | 13 | ☐ |
| **TOTAL Sprint 59** | **102** | ☐ |

---

## 2. Sprint Velocity Tracking

| Sprint | Planned | Completed | Velocity |
|---|---|---|---|
| 49 | 1,120 | 1,120 | ✅ 1,120 SP |
| 50 | 48 | TBD | TBD |
| 51 | 73 | TBD | TBD |

---

## 3. Definition of Done (DoD)

- [ ] Code merged to `integration/all-epics`
- [ ] All tests pass (unit + integration + cross-tenant)
- [ ] RLS enforced on all new tables
- [ ] Audit log writes for all mutations
- [ ] i18n AR + EN coverage
- [ ] Documentation updated
- [ ] CHANGELOG entry added
- [ ] Reviewed by ≥ 1 expert
- [ ] No secrets in code
- [ ] No PHI in fixtures
- [ ] Migration has symmetric up + down
- [ ] Safety rails preserved

---

## 4. Risks Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Production migration fails | Medium | High | Sandbox first + smoke tests + auto-rollback |
| RLS bypass | Low | Critical | FORCE_RLS on every table + cross-tenant test suite |
| Token budget exceeded | Medium | Medium | Truncation + token-saver pack |
| AI hallucination | Medium | High | RAGAS eval + guardrails + physician sign-off |
| PHI leak in logs | Low | Critical | Log redactor middleware + audit grep |

---

## 5. Sprint Ceremonies

- **Daily Standup:** 09:00 UTC (15 min, async Slack)
- **Sprint Planning:** First Monday of sprint (60 min)
- **Sprint Review:** Last Friday of sprint (30 min demo)
- **Sprint Retro:** Last Friday of sprint (30 min)
- **Backlog Grooming:** Wednesdays (60 min)

---

## 6. Tools

- **Board:** GitHub Projects
- **Communication:** Slack + WhatsApp
- **Docs:** `.ai-brain/` + Confluence
- **CI/CD:** GitHub Actions
- **Monitoring:** Grafana + Sentry + LangFuse

---

**Generated:** 2026-08-08 · **Sprint:** 49 (closed) → 50 (next)
