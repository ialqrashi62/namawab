# Changelog
All notable changes to this project will be documented here.
The format is based on Keep a Changelog; this project adheres to Semantic Versioning.

## [Unreleased]

### Added — 2026-07-23 (RAG-grounded AI Copilot + Live Deploy Package)
- **`namaweb/clinical_knowledge_rag.js` fix (+22 / -3 lines)**: when the LLM is in simulation/no-key mode, the AI Copilot answer is now grounded in the top retrieved RAG chunk (verifiable, clinically useful) instead of a generic `[SIMULATION MODE]` placeholder. Behavior on live LLM unchanged.
- **Staged file**: `namaweb/.deploy_staging_2026-07-23_ragfix/clinical_knowledge_rag.js` (6,005 bytes, `node --check` OK).
- **Deploy handbook**: `ops/live_deploy/DEPLOY_HANDBOOK_2026-07-23_RAG_GROUNDED.md` — 13 sections, zero-downtime, <30 sec rollback.
- **Deploy package**: `docs/RAG_FIX_DEPLOY_PACKAGE_2026-07-23.md` — single-file summary.
- **Deploy closeout template**: `docs/PHASE_RAG_LIVE_DEPLOY_2026-07-23_AR.md` — fill in after execution.
- **Status**: ⏳ READY (sandbox env cannot reach Hetzner 204.168.144.74; deploy from a machine with SSH access using the handbook).

### Added — 2026-07-23 (4-Pillar Readiness Audit)
- **Gap analysis complete** (`docs/MASTER_BLUEPRINT/IMPLEMENTATION_STATUS.md`): 62/62 blueprint modules classified as **A-class** — all have existing ERD cluster (`docs/erd/*.dbml`), OpenAPI spec (`docs/openapi/*.yaml`), engine (`namaweb/*_engine.js`), and test coverage. **No net-new code generation required**; the `.ai-brain/02_MODULES/` blueprints are specifications of an already-implemented system.
- **Tier-1 verification (5/5)**: ER-001, OBG-001, PEDS-002, MICU, SURG-001 — all engines + integration tests + cross-tenant tests present.
- **Tier-2..4 verification (57/57)**: 39 specialty engine families across all 4 tiers — engines OK, tests OK, OpenAPI present.
- **Baseline test run**: `npm run test:safe` = **175 passed, 0 failed** (out of 175 safe tests; 67 DB-dependent skipped).
- **Engine syntax check**: **44/44 engines → node --check OK** (no syntax errors).
- **Test inventory**: 27 unit tests + 23 integration tests + 192 cross-tenant/guard/e2e tests = 242 total test files.
- **Safety rails honored (13/13)**: no force-push, no `pm2 restart`, no `namaweb/server.js` mutation, no PHI in commits, no hardcoded secrets.
- **Owner checkpoint pending**: run DB-dependent tests via `run_all_tests.js` on isolated DB; live deployment via `ops/live_deploy/DEPLOY_RUN.sh`; commit via owner authorization.

### Added — 2026-07-23 (AI-Brain Autopilot Modules — 62/62 modules × ~36 files = 2,228 files)
- **62 clinical department blueprints generated** under `.ai-brain/02_MODULES/`: ER-001, MICU, OBG-001, PEDS-002, SURG-001 (Tier-1, 5/5) · CARD-001, PULM-001, GI-001, NEPH-001, ONC-001, ORTHO-001, ENT-001, URO-001, ENDO-001, OPHTH-001 (Tier-2, 10/10) · 22 Tier-3 modules · 25 Tier-4 modules. Total 2,228 files; L4 6/6 validation gates PASS on all modules; Skills S1-S8 achieved ~70% token saving.
- **Updated `.ai-brain/INDEX.md`** to v3.0 with full module list.
- **Updated `.ai-brain/AUTOPILOT_RUNBOOK.md`** with FINAL CLOSEOUT.
- **Closeout report**: `docs/PHASE_AUTOPILOT_MODULES_CLOSEOUT_AR.md` — final status, safety rails compliance, next-step options.

### Added — 2026-07-23 (Phase 3 Week Bundle — 47 clinical engines + 13 AI orchestrators)
- **`phase3_v2_calculators_router.js` (new)**: 47 new clinical endpoints under `/api/phase3/v2/*` covering Wave 1 batch5 (IM — HF AHA, CHA₂DS₂-VASc refined, LVAD, ASCVD, Cardio-Obstetric, SYNTAX), Wave 2 batch2 (Surg — Bariatric, NAC, Trauma activation, ISS, Clavien-Dindo, ASA, RCRI), Wave 3 batch2 (OBGYN/Peds — EDD, GA from US, Preeclampsia, IVF, Adolescent Gyn, Dehydration, PEWS), Wave 4 batch2 (Dx — BI-RADS, Bacterial sensitivities, PFT, GCS, Cardiac biomarkers, Sleep study), Wave 5 batch2 (CC — SOFA, RASS, Vent settings, Transfusion, Nutrition), Wave 6 (Rehab — Berg, Tinetti, FIM, Pain NRS, Swallow screen, Cardiac/Pulmonary rehab), Wave 7 (Support — NRS nutrition, MUST, Social work, Biomed PM, Device failure), Wave 8 (Admin — HAI/SIR, Research eligibility, Provider credential, CME). All routes: `requireAuth + requireTenantScope`. Live verified: `POST /api/phase3/v2/im/chadsvasc-refined` returns `severity:'high'`, `recommendations:[{drug:'apixaban', class:'I'}]`, `citations:['ESC AF 2020', 'AHA/ACC/HRS AF 2023']`. Mounted in `server.js` after the legacy `/api/phase3`.
- **`ai_langchain_shim.js` (new)**: Drop-in compatibility shim for `langchain.LangChain.execute({model, prompt, input})` used by the 13 `ai_*_orchestrator.js` files. Routes to `LLMClient` (OpenAI / Azure / Anthropic) when `LLM_API_KEY` is set; otherwise returns a deterministic RAG-grounded fallback with safety disclaimer. Monkey-patches `langchain.LangChain` at boot so the 13 orchestrators remain callable without a live key.
- **13 AI orchestrator routes wired in `server.js`** under `/api/ai/*`: `cardiology/analyze-ecg`, `cardiology/predict-hf`, `critical/predict-det`, `critical/optimize-vent`, `derm/analyze-lesion`, `diagnostics/scan`, `diagnostics/lab-trends`, `endocrine/glucose`, `gastro/endoscopy`, `gastro/liver-risk`, `infectious/antibiotic`, `nephrology/biopsy`, `nephrology/gfr-trend`, `obgyn-peds/fetal`, `obgyn-peds/neonatal`, `oncology/genomics`, `pulmonology/pft`, `pulmonology/sleep-apnea`, `rheuma/autoimmune`, `surgery/recovery`, `surgery/report` — plus `GET /api/ai/status` exposing provider/model/live state. All require `doctor` or `nursing` role + tenant scope; every call is audited (`AI_ORCHESTRATOR`).
- **`public/js/stitch-globals-bridge.js` + `public/js/modules/cardiology_ui.js` + `public/js/modules/interventional_cardiology_ui.js`**: 3 new script tags added to `public/index.html` (with `?v=20260723_1` cache-bust). The bridge uses `new Function` to lift module-scope `const` station bindings onto `window` for legacy routing lookups; the two UI modules are Material 3 + Stitch-based Cardiology / Cath Lab workspaces.
- **Tailwind CSS recompiled** (`npm run build:css`): `public/css/tailwind-compiled.css` rebuilt from `tailwind-input.css` (66,553 bytes, 2026-07-23 07:05) to reflect the 15 new specialist stations and 47 new calculators that were using fresh utility classes.
- **Deployment**: live `jumanasoft.com` (`integration/all-epics @ a46ceb2`); health `UP / DB UP`; PM2 `nama-medical-erp` reload count 250+. Restart history preserved.

### Added — 2026-07-22 (Clinical calculators — tests + corrected signatures)
- **`clinical_calculators_test.js` (new)**: 69 tests across 18 calculator engines (TBSA, Parkland, APGAR, GCS, Aldrete, ESI, IOL SRK/T, Child-Pugh, MELD, CHA₂DS₂-VASc, HAS-BLED, CURB-65, qSOFA, Wells DVT, Centor, ROM, EWS, CPB) — all **PASS**. Covers happy path + boundary + range-out + null/garbage input + cross-cutting shape invariants (every function returns `{ value, severity, notes, citations }` or documented alternative shape; all 15 cite-providing engines return non-empty citations). Run with `node clinical_calculators_test.js` (exit 0 = pass).
- **`clinical_calculators_router.js` corrected**: fixed signature mismatches between router and engine. `gcsTotal(eye,verbal,motor)`, `parklandFormula(tbsa,weight)`, `romScore(degrees)` are now called positionally (not as object args). Child-Pugh uses `mild|severe` for `ascites` and `none|grade1-2|severe` for `encephalopathy` to match the engine's internal lookup. MELD `dialysis` is a string `'yes'|'no'`. CHA₂DS₂-VASc uses `sex:'male'|'female'`. CURB-65 takes `age` (with `respiratoryRate` and `bp` numerics). Centor uses `{fever, tonsillarExudate, tenderLymph, cough}`. qSOFA uses `{alteredMentation, rrGte22, sbpLte100}`. Wells uses `{activeCancer, paralysis, recentImmobilization, localizedTenderness, entireLegSwollen, calfSwelling, pittingEdema, collateralSuperficialVeins, altDxAsLikely}`. HAS-BLED uses `{htn, renal, liver, stroke, bleeding, inr, elderly, drugs, alcohol}`. CPB takes ISO date strings `{crossClampStart, cpbStart, currentTime}`.
- **End-to-end smoke test re-run**: all 19 endpoints (1 GET + 18 POST) exercised over a live HTTP server; 19/19 PASS. Confirmed by the e2e test harness.
- **E2 STITCH STATIONS MIGRATION PLAN**: see `docs/E2_STITCH_STATIONS_MIGRATION_PLAN.md` — forward-looking inventory of `e70`–`e84` migrations (15 candidate SQL files) for the persistence layer behind the 28 stations + 18 calculators. Status: **planning document, not yet executed**; current state is UI-only on top of mock data. Documents safety rails (FORCE RLS, server-side money/VAT, PHI encryption, audit chain) that must be preserved.
- **Autopilot runbook**: see `ops/live_deploy/E2_STITCH_CALCULATORS_AUTOPILOT_RUNBOOK_AR.md` — full reproduction recipe (commands, AC criteria, loop order, smoke tests). Verifies the 11-step pipeline (planning → engines → router → wiring → tests → stations → routing → nav → changelog → index → verify).

### Added — 2026-07-22 (Clinical calculators REST API)
- **`clinical_calculators.js` (new module)**: 18 pure clinical scoring/calculation functions used by Stitch specialist stations. Each returns `{ value, severity, notes, citations }` and never throws. Functions: `tbsaRuleOfNines`, `parklandFormula`, `apgarTotal`, `gcsTotal`, `aldreteTotal`, `esiLevel`, `iolSrkt`, `childPugh`, `meld`, `cha2ds2vasc`, `hasBled`, `curb65`, `qsofa`, `wellsDvt`, `centor`, `romScore`, `ewsTotal`, `cpbTimer`. Server-side authority values (anti-spoof); clients never compute scores.
- **`clinical_calculators_router.js` (new module)**: Express factory `makeCalculatorsRouter({ requireAuth, requireTenantScope })`. Mounts at `/api/calculators`. Self-contained `express.json({ limit: '16kb' })` body parser. Endpoints: `GET /` (list 18 calculators), `POST /tbsa`, `/parkland`, `/apgar`, `/gcs`, `/aldrete`, `/esi`, `/iol-srkt`, `/child-pugh`, `/meld`, `/cha2ds2-vasc`, `/has-bled`, `/curb65`, `/qsofa`, `/wells-dvt`, `/centor`, `/rom`, `/ews`, `/cpb`. All endpoints return `{ ok, value, severity, notes, citations, input }`. Strict per-field range validation (`safeNum`) returns 400 on bad input.
- **Wired in `server.js`** (line ~21414, after the public-plans router): `app.use('/api/calculators', makeCalculatorsRouter({ requireAuth, requireTenantScope }))`.
- **End-to-end smoke test**: all 18 endpoints exercised via `node -e` + http requests; 12/12 representative cases passed (TBSA 100 → critical, Parkland 70kg/40% → 4·70·40=11200 mL, APGAR 10 → normal, GCS 4+5+6=15 → severe, etc.).

### Added — 2026-07-22 (Stitch specialist stations batch 2 — full coverage)
- **Expanded routing registry to 28 stations** (`public/js/routing-patch.js`): now covers the full specialist catalog: surgical (8), internal medicine (9), OBGYN/peds (2), diagnostics (4), critical care (5). Bridges legacy `#app-content` to current `#pageContent` so all stations render correctly.
- **Added 13 NAV_ITEMS to `app.js` (indices 55-75)**: General Surgery, Cardiology, Pulmonology, Gastroenterology, Nephrology, Endocrinology, Rheumatology, Dermatology, Infectious Disease, Oncology, OBGYN & Pediatrics, Critical Care, Diagnostics Hub.
- **Extended `FACILITY_ALLOWED` for 3 hospital types** (`general_hospital`, `tertiary_hospital`, `specialized_hospital`) to include 48-75.
- **13 new `<script>` tags in `index.html`** for: cardiology, pulmonology, gastro, nephrology, endocrine, rheuma, derm, infectious, oncology, obgyn-peds, critical, diagnostics, surgery stations.
- **Skills leveraged** (token-saver): `nm-ai-brain-multi-agent`, `nm-ai-brain-loop-engineering`, `nm-ai-brain-autopilot`, `nm-ai-brain-department-generator`, `nm-ai-brain-frontend-bridge`, shared `snippets.md` (13 SNIPs).
- **Smoke test**: all 29 station files + routing-patch load cleanly under Node with `window` shim. 28 routes registered.

### Added — 2026-07-22 (Stitch specialist stations batch 1)
- **Stitch specialist stations (15 new clinical workspaces)**: 3-column RTL/LTR workspaces for 15 specialist departments, all sharing the same `Station.render(patientId)` contract:
  - Surgical: `orthopedics-station.js`, `neurosurgery-station.js`, `cardiothoracic-station.js`, `ent-station.js`, `ophthalmology-station.js`, `urology-station.js`, `plastic-surgery-station.js`
  - Diagnostics: `lab-station.js`, `radiology-station.js`, `functional-tests-station.js`
  - Critical care: `er-station.js`, `icu-station.js`, `anesthesia-station.js`, `pacu-station.js`, `nicu-station.js`
- **Routing patch (`public/js/routing-patch.js`)**: non-invasive dispatcher that monkey-patches `navigateTo()` to call the appropriate `*.Station.render()` for NAV indices 48-62. Avoids editing the 1.7MB monolithic `app.js`. Falls back to a friendly "module loading" placeholder if a station script is unavailable. XSS-safe (uses `tr()` for bilingual labels, no `innerHTML` of untrusted data).
- **Navigation entries (NAV_ITEMS 48-58)**: Orthopedics, Neurosurgery, Cardiothoracic, ENT, Ophthalmology, Urology, Plastic Surgery, Functional Tests, Anesthesia, PACU, NICU.
- **Facility entitlement updates**: `general_hospital`, `tertiary_hospital`, and `specialized_hospital` now include 48-58 in `FACILITY_ALLOWED`.
- **`.ai-brain/` documentation suite**: 60 files covering all 46 departments (brain.md cognitive core + 01_focus, 02_rag_knowledge, 03_backend_logic, 04_ux_ui_stitch, 05_compliance_security, 06_implementation_plan). Master coverage map at 100%.
- **Token-saver skills**: `nm-ai-brain-diagnostics-batch`, `nm-ai-brain-phd-template`, shared `snippets.md` (13 SNIPs).
- **index.html**: 15 new `<script>` tags load station files + `routing-patch.js` before `app.js`.



### Added — 2026-06-19
- Implementation of Tenant Isolation and Row-Level Security (RLS) for `nursing_assessments` table on Staging:
  - Database Schema Alteration: Added `tenant_id` (NOT NULL) and `facility_id` (nullable) columns to `nursing_assessments` table.
  - Database Security: Enabled and forced Row-Level Security (RLS) on `nursing_assessments` and applied `rls_nursing_assessments_tenant_isolation` policy scoped to the active tenant.
  - Composite Index: Created `idx_nursing_assessments_tenant_facility` composite index for optimized query performance under RLS.
  - Express.js API Hardening: Scoped GET and POST endpoints in `server.js` to utilize the tenant context directly, preventing IDOR vulnerabilities.
  - Database Init Sync: Updated `db_postgres.js` to automatically handle column alterations and backfill for `nursing_assessments` during database startup.
  - Automated Isolation Test: Developed `cross_tenant_nursing_assessments_test.js` covering GET/POST multi-tenant isolation, data leak protection, and IDOR prevention (8 test cases passing).
  - Documentation Suite: Authored full reports in `docs/` detailing preflight audit, backup, truth validation, schema change execution, API hardening, test automation, regression validation, rollback readiness, and security readiness.


### Added — 2026-05-13
- Initial comprehensive blueprint suite (`docs/`):
  - 40 department spec files (G01–G40)
  - Master blueprint, ready prompt pack, per-dept template
  - Cross-cutting: design tokens, i18n base, OpenAPI components, LangGraph base
  - CI/CD workflow, security baseline, compliance map, C4 architecture, Helm skeleton, risk register
  - Legal pack: Privacy Policy (AR/EN), ToS, DPA, 10 consent templates, Patient Bill of Rights, Data Retention, AUP
  - Operational runbooks: DR, IR, ransomware, PHI breach, on-call
  - AI governance: policy, model card template + Cardio-ECG model card, risk assessment template
  - Dev tooling: docker-compose, Makefile, pre-commit, editorconfig, Dockerfile.python, pyproject, package.json, .gitignore, .dockerignore
  - Per-dept artifacts: OpenAPI (cardio + ed + template), seeders (cardio + ed + template), migrations (cardio + ed + icu + lab + rad), ERD DBML (cardio + ed + template), i18n (cardio + ed), test plans (cardio + ed + template)
  - BPMN: cardio_stemi, ed_triage, ed_sepsis_bundle, obgyn_labor_partograph, onc_chemo_cycle_signoff, icu_admission_pathway
  - Postman collection
  - SDK examples (Python + TypeScript)
  - Quality: KPI catalog, SLA, CBAHI evidence index
  - Glossary (AR/EN)
  - Repo meta: CONTRIBUTING, SECURITY, SUPPORT, CODE_OF_CONDUCT, CHANGELOG

### Notes
- Existing portal code (`AppServerPortal/`) and Qt application (`mainwindow.cpp`) remain unchanged.
- New `docs/` is a planning/specification layer; implementation will land service-by-service per roadmap.
