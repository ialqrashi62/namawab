# CARD-301_STROKE — Agile Sprint Plan

## Sprint 1 (Week 1) — Foundation
- [x] ERD design + migration up
- [x] 5 core tables (cases, thrombolysis, thrombectomy, imaging, followup)
- [x] Pure engine (11 functions)
- [x] Unit tests (25 cases)
- [x] RLS policies
- [x] OpenAPI spec

**Story Points**: 21
**Velocity**: 21 SP/week

## Sprint 2 (Week 2) — API Layer
- [x] Express router (17 endpoints)
- [x] Score endpoints (NIHSS, ASPECTS, mRS, ICH, Hunt-Hess, ABCD2, CHA2DS2-VASc, HAS-BLED)
- [x] Dosing endpoint (Tenecteplase)
- [x] Eligibility endpoint
- [x] DNT compliance endpoint
- [x] Bundle endpoint
- [x] Stats endpoint
- [x] Integration tests

**Story Points**: 26

## Sprint 3 (Week 3) — Vector + RAG
- [x] pgvector extension
- [x] stroke_clinical_knowledge table
- [x] Sample seeds (AHA/ASA + MoH)
- [x] Cosine similarity search
- [x] Rerank + compress
- [x] LangChain pipeline
- [x] Safety guardrails

**Story Points**: 21

## Sprint 4 (Week 4) — Frontend
- [x] Stitch index (dashboard)
- [x] Stitch detail (case view)
- [x] Stitch form (Code Stroke activation)
- [x] Stitch chart (GWTG-S metrics)
- [x] i18n AR/EN/FR/UR (50+ keys)
- [x] Mobile responsive

**Story Points**: 18

## Sprint 5 (Week 5) — Compliance + Docs
- [x] PDPL compliance
- [x] CBAHI standards
- [x] NPHIES bundle
- [x] Security threat model (STRIDE)
- [x] User manual (AR/EN)
- [x] Training videos (4 storyboards)
- [x] Deployment runbook

**Story Points**: 13

## Sprint 6 (Week 6) — QA + Production
- [x] Smoke tests
- [x] Security scan
- [x] Apply migrations to staging
- [x] Verify RLS
- [x] Performance test
- [x] Deploy to production
- [x] Closeout

**Story Points**: 13

## Sprint 7 (Week 7) — Enhancements
- [ ] GWTG-S data export
- [ ] Telestroke integration
- [ ] Mobile app (PWA)
- [ ] Patient engagement (reminders)
- [ ] ML risk score (30-day outcome)

**Story Points**: 26

## Velocity & Burndown

| Sprint | Planned | Actual | Cumulative |
|---|---|---|---|
| 1 | 21 | 21 | 21 |
| 2 | 26 | 26 | 47 |
| 3 | 21 | 21 | 68 |
| 4 | 18 | 18 | 86 |
| 5 | 13 | 13 | 99 |
| 6 | 13 | 13 | 112 |
| 7 | 26 | TBD | 138 |

## Definition of Done

- [ ] Code complete (no `// rest of code`)
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] No PHI in logs
- [ ] RLS verified
- [ ] i18n 4 locales
- [ ] Documentation updated
- [ ] Owner approval
- [ ] Deployed to staging
- [ ] Smoke test passes
- [ ] Production deployed

## Risks

| Risk | Mitigation |
|---|---|
| Tenecteplase not available | Fallback to Alteplase |
| Thrombectomy not 24/7 | Drip-and-Ship protocol |
| Slow CT | Pre-notification + Lean workflow |
| Neurologist not on-site | Telestroke + on-call |
| Bed shortage in stroke unit | Prioritize high-NIHSS |
