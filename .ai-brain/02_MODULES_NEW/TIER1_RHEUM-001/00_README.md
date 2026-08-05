# RHEUM-001 — Rheumatology Department Blueprint (Tier-1, AUTOPILOT generated)

> **Tier:** 1
> **Generated:** 2026-08-01
> **Owner:** CMO + AIE + SA + DSL + PM + CQO
> **Status:** SHIPPED scaffold (12 key files + 48 placeholders follow Tier-1 template)

---

## Top 10 conditions
(See `03_icd10_snomed_map.md` for codes.)

## Top 20 procedures
(See `02_sub_dept_catalog.md`.)

## Critical alerts
(See `04_clinical_red_flags.md`.)

## Files in this folder

```
00_README.md                 (this file)
01_clinical_workflows.md
02_sub_dept_catalog.md
03_icd10_snomed_map.md
04_clinical_red_flags.md
05-13: prompt + RAG + observability (placeholders, follow TPL:DEPT)
14_engine_module.md
15_routes_api.md             (placeholder)
16_middleware_chain.md       (placeholder)
17_data_flow.md              (placeholder)
18_erd_diagram.md
19_openapi_spec.md
20_21 dbml + ADR (placeholders)
22_migration_up.sql
23_migration_down.sql
24_validate                  (placeholder)
25_seed_data.sql
26-31 stitch + i18n (placeholders)
32_business_flow             (placeholder)
33-41 ops + security (placeholders)
42-48 compliance (placeholders)
49-52 tests (placeholders)
53-59 user-facing (placeholders)
60_closeout.md
```

## Acceptance

- [x] 12 key files present
- [x] Migration forward + reverse (non-destructive)
- [x] Seed data PHI-free
- [x] RLS + FORCE_RLS on every tenant-scoped table
- [x] Engine follows hexagonal pattern
- [x] OpenAPI 3.1 with auth + RBAC
- [x] Red flag list with HARD + SOFT + drug

## Next

- [ ] Fill 48 placeholder files via TPL:DEPT
- [ ] Wire engine into `server.js` (sandbox)
- [ ] Compile prompt ID
- [ ] Run clinical safety suite
- [ ] Owner sign-off (CMO+CQO)

---

*ORC — AUTOPILOT — 2026-08-01*
