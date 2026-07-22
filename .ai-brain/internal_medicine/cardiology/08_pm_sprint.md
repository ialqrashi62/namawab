# Project Management Sprint Plan — Cardiology

> **Owner:** PM
> **Date:** 2026-07-22
> **Framework:** Agile / Scrum
> **Sprint length:** 2 weeks

---

## Sprint 0 — Setup (1 week)

- [ ] Confirm requirements with cardiology lead
- [ ] Review existing cardiology.dbml
- [ ] Identify 9 sub-units
- [ ] Prioritize P1 features
- [ ] Setup Jira board (or equivalent)
- [ ] Assign team: 1 BE, 1 FE, 1 AI/ML, 1 QA, 1 PM
- [ ] Setup Slack channel #cardio-eng
- [ ] Setup CI/CD pipeline for cardiology changes

**Story points:** 13

---

## Sprint 1 — DB + Auth (2 weeks)

### Stories
- [ ] ST-1: Create cardiac_procedures table + RLS (3 pts)
- [ ] ST-2: Create echo_reports table + RLS (3 pts)
- [ ] ST-3: Create ecg_archive table + RLS (3 pts)
- [ ] ST-4: Create holter_studies + stress_tests tables (5 pts)
- [ ] ST-5: Create cardiac_rehab_enrollment + anticoag_clinic_visits (5 pts)
- [ ] ST-6: Auth middleware (requireRole: cardiology_doctor, etc.) (5 pts)
- [ ] ST-7: Tenant scope tests (3 pts)
- [ ] ST-8: Migration up/down/validate scripts (5 pts)

**Story points:** 32

### Definition of Done
- All tables created
- RLS enabled + forced
- Indexes present
- Auth middleware tested
- Migration scripts run on staging without errors
- Migrations are non-destructive (down is safe)

---

## Sprint 2 — APIs (2 weeks)

### Stories
- [ ] ST-9: GET /api/cardiology/patients/:id/echo (3 pts)
- [ ] ST-10: POST /api/cardiology/echo (DICOM upload) (8 pts)
- [ ] ST-11: GET /api/cardiology/patients/:id/ecg (3 pts)
- [ ] ST-12: POST /api/cardiology/procedures (5 pts, idempotency)
- [ ] ST-13: PATCH /api/cardiology/procedures/:id (3 pts)
- [ ] ST-14: POST /api/cardiology/cds/chadsvasc (5 pts, calls /api/calculators)
- [ ] ST-15: POST /api/cardiology/cds/hasbled (5 pts)
- [ ] ST-16: GET /api/cardiology/anticoag/queue (3 pts)
- [ ] ST-17: POST /api/cardiology/anticoag/visit (5 pts)
- [ ] ST-18: API tests (curl + integration) (8 pts)

**Story points:** 48

### DoD
- All routes return correct status codes
- Auth + tenant scope enforced
- Idempotency on POST
- Integration tests pass
- OpenAPI spec updated

---

## Sprint 3 — RAG + CDS (2 weeks)

### Stories
- [ ] ST-19: Setup pgvector extension (3 pts)
- [ ] ST-20: Create clinical_knowledge_vectors table + RLS (5 pts)
- [ ] ST-21: Embed 100 cardiology guidelines (13 pts)
- [ ] ST-22: Implement retrieval function (8 pts)
- [ ] ST-23: Implement LLM call with system prompt (8 pts)
- [ ] ST-24: Implement output validation (5 pts)
- [ ] ST-25: Build CDSBundle (ACS + HF + AF + STEMI) (13 pts)
- [ ] ST-26: Add audit trail for CDS (5 pts)
- [ ] ST-27: LangFuse integration (8 pts)
- [ ] ST-28: Eval set (50 Q&A) + CI gate (13 pts)

**Story points:** 81

### DoD
- 100 guidelines embedded
- Retrieval top-5 working
- LLM responses cited + structured
- Audit trail captures every CDS run
- LangFuse dashboard shows metrics
- Eval set passes 90% accuracy

---

## Sprint 4 — Frontend (2 weeks)

### Stories
- [ ] ST-29: Cardiology station 3-col layout (8 pts)
- [ ] ST-30: Echo upload widget (DICOM) (8 pts)
- [ ] ST-31: Echo viewer (with measurements) (8 pts)
- [ ] ST-32: ECG viewer (12-lead + rhythm) (8 pts)
- [ ] ST-33: Procedures scheduler (8 pts)
- [ ] ST-34: Anticoag clinic queue (5 pts)
- [ ] ST-35: HF GDMT dashboard (8 pts)
- [ ] ST-36: CDS panel (right side) (8 pts)
- [ ] ST-37: i18n (AR/EN) (5 pts)
- [ ] ST-38: Stitch HTML (Layout A cardiac theme) (5 pts)
- [ ] ST-39: Accessibility audit (WCAG 2.2 AA) (5 pts)

**Story points:** 76

### DoD
- All widgets functional
- AR/EN labels complete
- Keyboard nav + screen reader
- 3-col layout matches Stitch spec
- Sub-tabs work smoothly

---

## Sprint 5 — Test + Deploy (2 weeks)

### Stories
- [ ] ST-40: Unit tests for cardiology endpoints (8 pts)
- [ ] ST-41: Integration tests (DB + RLS + auth) (8 pts)
- [ ] ST-42: E2E tests (user stories → curl) (8 pts)
- [ ] ST-43: Load test (100 concurrent users) (5 pts)
- [ ] ST-44: Security pen test (OWASP Top 10) (8 pts)
- [ ] ST-45: Performance test (latency p95 <2s) (5 pts)
- [ ] ST-46: Staging deploy (5 pts)
- [ ] ST-47: User manual + training videos (5 pts)
- [ ] ST-48: Production deploy with feature flag (8 pts)
- [ ] ST-49: 1-week soak test (5 pts)
- [ ] ST-50: Full rollout (8 pts)

**Story points:** 74

### DoD
- All tests pass
- Pen test: no high-severity findings
- Staging validated
- User manual published
- Training videos uploaded
- Production deploy with phased rollout

---

## Total Story Points

- Sprint 0: 13
- Sprint 1: 32
- Sprint 2: 48
- Sprint 3: 81
- Sprint 4: 76
- Sprint 5: 74
- **Total: 324 SP / ~10 weeks**

---

## Team Velocity

- 5-person team × 2-week sprint ≈ 30-50 SP/sprint
- Cardiology: 5-6 sprints ≈ 10-12 weeks

---

## Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| LLM cost overrun | M | M | Feature flag, daily cost alert, switch to smaller model |
| pgvector unavailable | L | H | Fallback to REAL[] + cosine in app |
| ECG AI model not ready | M | M | Manual interpretation only initially |
| Sub-unit scope creep | H | M | Strict P1/P2/P3 prioritization |
| Tenant isolation bug | L | C | Pen test + RLS validate migration |
| Guideline version drift | M | L | Weekly re-embed cron |

---

## Stakeholders

- **Sponsor:** Chief Medical Officer
- **Product Owner:** Cardiology Lead + PM
- **Tech Lead:** Architect
- **Clinical SMEs:** 2 cardiologists
- **Compliance:** Compliance Officer
- **Security:** DevOps & Security Lead

---

## Definition of Done (project-level)

- All 50 stories completed
- All tests pass
- Pen test clean
- User manual published
- Training delivered
- Production live for 1 week with <0.1% error rate
- KPIs met: door-to-balloon <90min, GDMT compliance ≥70%

---

End of sprint plan.
