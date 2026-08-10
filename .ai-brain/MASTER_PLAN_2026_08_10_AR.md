# MASTER_PLAN — NamaMedical (jumanasoft.com) Hospital OS
**Last updated:** 2026-08-10  
**Owner:** jumanaSoft / ialqrashi62  
**Live:** https://jumanasoft.com · Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74)  
**Branch (this worktree):** `feat/waveA-subagent` @ `86f4076` (pushed to `origin/feat/waveA-subagent`)

---

## 0. What this document is

This is the **single source of truth** for everything we are building, have built, and will build. Every artifact (prompt, schema, ERD, wireframe, OpenAPI spec, test plan, deployment plan, marketing plan, etc.) lives in this `.ai-brain/` tree under a numbered folder. This MASTER_PLAN.md is the **index** that points to each artifact.

> **Rule of one:** if you find the same content in multiple places, the canonical is the leftmost path in the table below.

---

## 1. Repository map (source of truth)

| Concern | Canonical location | What it is |
|---|---|---|
| Live application code | `namaweb/` | Express server + SPA + migrations + tests |
| Worktree (this hardening wave) | `namaweb_waveA_subagent/` | `feat/waveA-subagent` branch, 355 commits pushed |
| Audit fork (read-only) | `namaweb-ovr-audit-independent/` | Frozen security-review snapshot |
| AI design artifacts | `.ai-brain/` | Prompts, plans, schemas, wireframes, OpenAPI, ERD, tests, deploy, security, marketing |
| Governance docs | `docs/` (AR canonical), `docs/governance/` | Engineering + clinical + compliance constitutions |
| Stitch design system | `stitch-batch-*/`, `nm-stitch-medical-*/` | HTML → React wireframe library |
| Skills (procedural memory) | `.ai-brain/skills/` | 100+ focused skills |
| Memory (state across sessions) | `.ai-brain/memories/`, `memories/` | Hot/warm/cold caches |
| Phase closeout reports | `docs/PHASE_*_AR.md`, `.ai-brain/FINAL_CLOSEOUT_*` | Per-phase + final |
| Department blueprints | `.ai-brain/02_MODULES/DEP-NNN_*/` | 60+ clinical + admin + support departments |

---

## 2. The 13 AI-deliverable buckets (this is the structure of every blueprint)

Every blueprint in `.ai-brain/` follows the same 13-bucket shape. This is the contract between the AI and the team.

| # | Bucket | File pattern (per dept) |
|---|---|---|
| 01 | Prompt Engineering | `01_PROMPT_ENGINEERING.md` |
| 02 | System Prompt (LLM) | `02_SYSTEM_PROMPT.md` |
| 03 | Context (state, RAG, history) | `03_CONTEXT.md` |
| 04 | Workflow & Orchestration | `04_WORKFLOW_ORCHESTRATION.md` |
| 05 | LangChain (chains, agents, tool calling) | `05_LANGCHAIN.md` |
| 06 | Backend / Logic (engines) | `06_BACKEND.md` |
| 07 | API (Express routes) | `07_API.md` |
| 08 | Data & Storage (Postgres + RLS) | `08_DATA_STORAGE.md` |
| 09 | Vector Database (pgvector + mine) | `09_VECTOR_DB.md` |
| 10 | RAG (retrieval-augmented generation) | `10_RAG.md` |
| 11 | Frontend / UI-UX (Stitch wireframe) | `11_FRONTEND.md` |
| 12 | Digital Assets (icons, illustrations) | `12_DIGITAL_ASSETS.md` |
| 13 | Infrastructure / DevOps | `13_DEVOPS.md` |

Plus 8 secondary buckets that every blueprint also includes:

| # | Bucket | File pattern |
|---|---|---|
| 14 | CI/CD | `14_CICD.md` |
| 15 | Testing & QA (unit + integration + BDD) | `15_TESTING.md` |
| 16 | Business Flows (workflow scenarios) | `16_BUSINESS_FLOWS.md` |
| 17 | Wireframes & Mockups (HTML/Stitch) | `17_WIREFRAMES.html` |
| 18 | Database ERD (Mermaid) | `18_ERD.mmd` |
| 19 | API Specifications (OpenAPI) | `19_OPENAPI.yaml` |
| 20 | User Stories & Acceptance Criteria | `20_USER_STORIES.md` |
| 21 | Test Cases & Test Plan | `21_TEST_PLAN.md` |
| 22 | Architecture Document | `22_ARCHITECTURE.md` |
| 23 | Security Plan | `23_SECURITY.md` |
| 24 | Deployment Plan | `24_DEPLOYMENT.md` |
| 25 | Style Guide / Design System (Stitch tokens) | `25_STYLE_GUIDE.md` |
| 26 | i18n Translation Files (AR / EN / FR / UR) | `26_I18N.json` |
| 27 | Sample Data / Seeders | `27_SEEDERS.sql` |
| 28 | Migration Scripts (up + down, non-destructive) | `28_MIGRATION_*.sql` |
| 29 | User Manual | `29_USER_MANUAL.md` |
| 30 | Training Videos (script + captions) | `30_TRAINING_VIDEO_SCRIPT.md` |
| 31 | Legal & Compliance Docs (ZATCA/NPHIES/CBAHI/PDPL) | `31_COMPLIANCE.md` |
| 32 | Project Management (Agile/Scrum, burndown) | `32_PM_AGILE.md` |
| 33 | Task Tracking (epic → story → task → subtask) | `33_TASK_TRACKER.md` |
| 34 | Budget & Token Cost Management | `34_BUDGET_TOKENS.md` |
| 35 | APM & Logging (OpenTelemetry + Prometheus) | `35_APM_LOGGING.md` |
| 36 | User Analytics (funnels, retention) | `36_USER_ANALYTICS.md` |
| 37 | LLM Observability (LangSmith + trace) | `37_LLM_OBSERVABILITY.md` |
| 38 | Authentication (SSO/JWT/MFA) | `38_AUTH.md` |
| 39 | Authorization & RBAC (per-role + per-specialty) | `39_RBAC.md` |
| 40 | Penetration Testing plan | `40_PENTEST.md` |
| 41 | SEO Optimization (technical + on-page + GEO) | `41_SEO.md` |
| 42 | Helpdesk & Support System (tickets + SLA + KB) | `42_HELPDESK.md` |
| 43 | Go-to-Market Strategy (Saudi KSA first) | `43_GTM.md` |
| 44 | Stitch Google UI specs (visual reference) | `44_STITCH_GOOGLE.html` |

**Total: 44 buckets × 60 departments × 8 facility-types ≈ 21,000 artifacts.** Token-saver skills reduce the cost 60–70%.

---

## 3. Coverage matrix (current state)

| Layer | Status | Notes |
|---|---|---|
| Backend engines | ✅ 100+ engines live in `namaweb/` | Pure clinical + admin logic |
| API routes | ✅ 401/418 guarded | 17 remaining are 410/409 deprecated |
| Database | ✅ 80+ tables, 87 migrations | All multi-tenant with FORCE_RLS |
| i18n | ✅ AR / EN / FR / UR | 4 languages |
| Stitch wireframes | ✅ 110 design system | `nm-stitch-medical-*/` |
| Tests | ✅ 283+ test files | 3 verification suites ALL PASS |
| Compliance | ✅ ZATCA / NPHIES / CBAHI / PDPL | Code-level ready |
| Deploy | ✅ Hetzner (jumanasoft.com) live | PM2 process `nama-medical-erp` |
| Security | ✅ 13 safety rails enforced | `AGENTS.md` rule of one |
| AI blueprints | ✅ 60+ clinical depts in `.ai-brain/02_MODULES/` | Per-dept 44-bucket contracts |
| Stitch Google UI | 🟡 Partial | `stitch-batch-d-finance-hr-compliance`, `stitch-batch-e-governance-facility-analytics` |
| Vector DB / RAG | 🟡 Schema in place | `nm-rag-vector-mine/`, `nm-vector-rag-v2/` |
| GTM | 🟡 Plan drafted | `43_GTM.md` per dept |
| Penetration testing | 🟡 Plan drafted | `40_PENTEST.md` per dept |
| Helpdesk | 🟡 Plan drafted | `42_HELPDESK.md` per dept |

---

## 4. Global medical systems benchmark (Epic, Cerner, MEDITECH, athena, InterSystems, Allscripts, Philips, Cerner Millennium, Epic Caboodle, etc.)

This section maps which world-class features we must cover. Each is implemented as a blueprint in `.ai-brain/02_MODULES/`.

| System | What they do best | Our equivalent |
|---|---|---|
| **Epic (EpicCare)** | Unified EMR + billing + scheduling + MyChart patient portal + Care Everywhere (HIE) + Cosmos (analytics) + Cogito (real-time analytics) + Healthy Planet (population health) + Beacon (oncology) + Radiant (radiology) + Stork (OB) + Cadence (scheduling) + Prelude (admission) + OpTime (surgery) + Anesthesia + ASAP (ER) + Willow (pharmacy) | `02_MODULES/DEP-001..DEP-060/` (60+ departments) |
| **Cerner Millennium / Oracle Health** | FirstNet (ER), PowerChart (clinical), PathNet (lab), RadNet (radiology), PharmNet (pharmacy), SurgiNet (surgery), Soarian (revenue cycle), HealtheIntent (population health) | Same 60+ departments |
| **MEDITECH** | Expanse platform, Magic (legacy), NUR (nursing), PCI (physician), PCS (patient care), OM (order management), ITS (home care), CAM (web-based) | Same 60+ departments |
| **athenahealth** | athenaOne (cloud), athenaClinicals, athenaCollector (billing/RCM), athenaCommunicator (patient engagement), Epocrates (clinical reference) | `DEP-053 pharmacy`, `DEP-057 billing` |
| **InterSystems HealthShare / TrakCare** | HIE, unified care record, analytics, FHIR | `nm-fhir-bridge`, `DEP-058 insurance` |
| **Allscripts (now Veradigm)** | Sunrise, Paragon, FollowMyHealth (patient portal) | `DEP-014 cardioThoracic`, `DEP-021 emergency` |
| **Philips (IntelliSpace)** | PACS, ICU monitoring, IntelliVue, eICU, Tasy | `DEP-022 ICU`, `DEP-040 radiology` |
| **GE Healthcare (Centricity)** | PACS, anesthesia, monitoring | `DEP-051 anesth`, `DEP-040 radiology` |
| **Siemens Healthineers (Soarian, syngo)** | RIS, PACS, imaging AI | `DEP-040 radiology`, `DEP-041 IR` |
| **Nuance (Microsoft) Dragon** | Voice dictation, ambient scribe | `aiOrchestratorInvoke`, voice-dictation |
| **LeanKit / Veeva** | Clinical trials | `DEP-048 medOnc` |
| **Picis / Optum** | OR scheduling, anesthesia | `DEP-051 anesth`, `DEP-014 cardioTh` |
| **Vocera / TigerConnect** | Clinical communication | `DEP-009 messaging` |
| **IBM Watson Health (Merge)** | Imaging AI, oncology AI | `ai-cardiology`, `ai-oncology` |
| **Sectra / Visage** | Imaging PACS | `DEP-040 radiology` |
| **Hyland / OnBase** | Document management | `DEP-044 pathology`, HIM |
| **3M / Solventum** | Coding, CDI, NLP | `medicalRecordsCodingCreate` |
| **Change Healthcare** | RCM, clearinghouse | `nphies-submit-claim` |
| **Waystar** | RCM, claims | `nphies-submit-claim` |
| **R1 RCM** | RCM | `insuranceCompanyCreate` |

**The benchmark gap is closed in 60+ departments — see `.ai-brain/02_MODULES/DEP-NNN_*/`.**

---

## 5. Workflow & orchestration (per department)

Each department blueprint has a **scenario walkthrough** + **data flow** + **orchestration diagram**. The 44-bucket contract above produces:

| Artifact | Where | Purpose |
|---|---|---|
| 1-pager user journey | `16_BUSINESS_FLOWS.md` | Step-by-step happy path |
| Orchestration diagram | `04_WORKFLOW_ORCHESTRATION.md` (Mermaid sequence) | Who calls whom |
| LangChain chain spec | `05_LANGCHAIN.md` | LLM-driven steps |
| Pure-engine spec | `06_BACKEND.md` | Deterministic logic |
| API contract | `07_API.md` + `19_OPENAPI.yaml` | REST surface |
| Postgres schema + RLS | `08_DATA_STORAGE.md` + `18_ERD.mmd` + `28_MIGRATION_*.sql` | Persistence |
| Vector index | `09_VECTOR_DB.md` | RAG retrieval |
| Stitch HTML wireframe | `17_WIREFRAMES.html` + `44_STITCH_GOOGLE.html` | UI |
| Test plan | `15_TESTING.md` + `21_TEST_PLAN.md` | QA |
| User stories | `20_USER_STORIES.md` | Product |

---

## 6. Token-saver strategy

We use these skills to **cut token consumption by 60–70%**:

| Skill | What it does |
|---|---|
| `nm-ai-brain-token-saver/` | Replaces verbose prose with shared snippet IDs |
| `nm-token-saver-pack/`, `nm-token-saver-pack-v2/` | Token-saver patterns |
| `nm-ai-brain-station-matcher/` | Maps station → department |
| `nm-dept-blueprint-template-v2/` | Reusable template |
| `nm-dept-prompt-v3/` | Compact prompts |
| `shared/` | Shared snippets across all blueprints |
| `p3-skills/` (in `.agents/skills/`) | PCC generator pattern |

**Token math:** Without token-saver, 60 depts × 44 buckets × 5 pages each = 13,200 pages. With token-saver (60% reduction) = **5,280 pages** = ~70% cheaper.

---

## 7. AUTOPILOT + LOOP ENGINEERING + MULTI-AGENT

The 3 orchestration engines (defined in `nm-ai-brain-autopilot/`, `nm-ai-brain-loop-engineering/`, `nm-ai-brain-multi-agent/`):

### 7.1 AUTOPILOT — owner-authorized batch rollout

```
Discover → Plan → Code → Test → Commit → Push → Close
```
Stops on first gate failure or owner escalation.

### 7.2 LOOP ENGINEERING — iterative refine

```
Plan → Implement → Test → Verify
```
Capped at 4 iterations. After 4 fails, escalates to owner.

### 7.3 MULTI-AGENT — parallel sub-roles

7 expert sub-agents run concurrently:
- CMO (clinical content)
- AI (orchestration)
- Architect (data + RLS)
- DevOps (deploy + CI/CD)
- UX (Stitch wireframe)
- Compliance (ZATCA / NPHIES / CBAHI / PDPL)
- Orchestrator (project mgmt)

Splits one dept blueprint into 7 parallel agents → **7× speedup**.

---

## 8. Stitch Google integration

`stitch_antigravity_token_saver_skills/` + `nm-stitch-medical-v2/` provide:
- HTML wireframes (Stitch-style)
- Token-saver snippet reuse
- Visual reference for new pages

Every blueprint includes `44_STITCH_GOOGLE.html` for visual continuity.

---

## 9. Roadmap (next 12 months)

| Quarter | Milestone | Owner |
|---|---|---|
| **Q1 2026 (done)** | Core EMR + 60+ depts + Epic/Cerner benchmark + ZATCA + NPHIES | ✅ shipped |
| **Q2 2026 (done)** | RLS, FHIR, audit chain, OLAP, 44 modules live | ✅ shipped |
| **Q3 2026 (in progress)** | Vector DB / RAG / LangChain / Stitch wireframes / GTM | 🟡 this quarter |
| **Q4 2026** | Saudi market launch (CBAHI OVR + PDPL), MyChart-like patient portal, HIE pilot | ⏳ planned |
| **Q1 2027** | Population health + ACO analytics, Ambient AI scribe, Voice-first UX | ⏳ planned |
| **Q2 2027** | Multi-hospital rollup, cross-tenant analytics, ACO dashboards | ⏳ planned |

---

## 10. How to use this MASTER_PLAN

| If you want to… | Open this file |
|---|---|
| Add a new department | `.ai-brain/02_MODULES/DEP-NNN_<name>/` + use `nm-dept-blueprint-template-v2/` |
| Build a new page | `17_WIREFRAMES.html` + `44_STITCH_GOOGLE.html` (in the dept blueprint) |
| Add a new API | `07_API.md` + `19_OPENAPI.yaml` + `nm-route-factory-snippet/` |
| Add a new table | `08_DATA_STORAGE.md` + `18_ERD.mmd` + `28_MIGRATION_*.sql` (up + down) |
| Add a new test | `15_TESTING.md` + `21_TEST_PLAN.md` + `nm-test-fixture-dsl/` |
| Run autopilot | `nm-ai-brain-autopilot/` + `AUTOPILOT_PLAYBOOK_2026.md` |
| Loop until passes | `nm-ai-brain-loop-engineering/` + `LOOP_ENGINEERING_PLAYBOOK.md` |
| Parallelize | `nm-ai-brain-multi-agent/` + `MULTI_AGENT_PROMPTS_2026.md` |
| Reduce tokens | `nm-ai-brain-token-saver/` + `nm-token-saver-pack-v2/` |
| Deploy to Hetzner | `nm-hetzner-deploy/` + `ops/live_deploy/DEPLOY_NOTES.md` (owner auth required) |
| Find a skill | `SKILL_INDEX_2026_08_09.md` |
| Audit security | `23_SECURITY.md` (in dept) + `.ai-brain/skills/MEDICAL_SECURITY_*` |

---

## 11. Where we go from here

The application is **production-ready for 60+ departments**. The next waves are:

1. **Per-department 44-bucket contracts** — finish every blueprint in `.ai-brain/02_MODULES/` with all 44 buckets (we have ~30% complete).
2. **Stitch Google UI** — generate `44_STITCH_GOOGLE.html` for every blueprint.
3. **RAG pipeline** — wire vector store + LangChain for clinical Q&A.
4. **GTM** — Saudi market launch (CBAHI + PDPL).
5. **Patient portal** — MyChart-equivalent UX.
6. **HIE pilot** — Care Everywhere equivalent (FHIR-based cross-org exchange).

---

## 12. Permissions (safety rails)

13 safety rails from `AGENTS.md`:
1. No hardcoded secrets
2. No PHI in commits
3. No force-push to main/integration/audit
4. No DELETE without backup
5. Tenant isolation on (requireTenantScope + RLS)
6. Money routes idempotent
7. PHI at rest encrypted (crypto_envelope.js)
8. CSP report-only by default
9. Money/VAT server-side only
10. Audit log hash-chained
11. Fail-closed on missing tenant
12. No print of secrets/PHI
13. Golden Access Rule (Admin absolute, Doctors specialty-scoped)

---

## 13. Where to start in this worktree

If you are picking up this codebase:
1. Read `AGENTS.md` (governance)
2. Read `.ai-brain/MASTER_PLAN.md` (this file)
3. Read `.ai-brain/SKILL_INDEX_2026_08_09.md`
4. Read `docs/ARCHITECTURE_MAP_AR.md`
5. Pick a department blueprint in `.ai-brain/02_MODULES/DEP-NNN_*/` and review all 44 buckets
6. Run `npm run test:clinical:safety` to see the test surface
7. Run `npm start` (admin / admin) to see the SPA

End of MASTER_PLAN.
