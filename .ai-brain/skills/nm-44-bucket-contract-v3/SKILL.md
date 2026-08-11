---
name: nm-44-bucket-contract-v3
description: Use when generating a new department blueprint. Loads the 44-bucket contract that every NamaMedical department must satisfy. Saves ~70% tokens by reusing one canonical schema instead of re-inventing it per dept.
---

# 44-bucket contract (v3) — every department blueprint must include these

## Layout

For each department `D` (e.g. `cardiology`), produce a self-contained blueprint under
`.ai-brain/02_MODULES/{D}/` containing exactly these 44 files. Skip none.

| # | File | Purpose | Token budget |
|---|---|---|---|
| 01 | `00_DEPT_OVERVIEW_AR.md` | One-page summary | 1 KB |
| 02 | `01_BUSINESS_FLOWS_AR.md` | Workflow + data flow | 8 KB |
| 03 | `02_USER_STORIES_AR.md` | User stories | 4 KB |
| 04 | `03_ACCEPTANCE_CRITERIA_AR.md` | BDD scenarios | 6 KB |
| 05 | `04_WIREFRAME_HOME_AR.html` | Stitch home page (1 file) | 12 KB |
| 06 | `04_WIREFRAME_PATIENT_AR.html` | Stitch patient view | 12 KB |
| 07 | `04_WIREFRAME_ORDER_AR.html` | Stitch order view | 12 KB |
| 08 | `04_WIREFRAME_RESULT_AR.html` | Stitch result view | 12 KB |
| 09 | `04_WIREFRAME_QUEUE_AR.html` | Stitch queue | 12 KB |
| 10 | `04_WIREFRAME_REPORT_AR.html` | Stitch report | 12 KB |
| 11 | `05_API_SPEC_AR.yaml` | OpenAPI 3 spec | 8 KB |
| 12 | `06_DB_ERD_AR.md` | ERD mermaid | 6 KB |
| 13 | `07_MIGRATIONS_UP.sql` | idempotent CREATE TABLE IF NOT EXISTS | 8 KB |
| 14 | `07_MIGRATIONS_DOWN.sql` | reverse | 6 KB |
| 15 | `07_MIGRATIONS_SEED.sql` | sample data | 4 KB |
| 16 | `08_RBAC_MATRIX_AR.md` | role→action table | 2 KB |
| 17 | `09_TEST_PLAN_AR.md` | QA matrix | 4 KB |
| 18 | `10_UNIT_TESTS_AR.js` | Jest test spec | 6 KB |
| 19 | `10_INTEGRATION_TESTS_AR.js` | supertest | 8 KB |
| 20 | `11_ENGINE_SPEC_AR.md` | Pure-function spec | 4 KB |
| 21 | `12_ENGINE_JS.js` | Pure-function engine | 14 KB |
| 22 | `13_ROUTER_JS.js` | Express router | 10 KB |
| 23 | `14_VALIDATION_AR.md` | fail-closed input rules | 3 KB |
| 24 | `15_I18N_AR.json` | Arabic translations | 6 KB |
| 25 | `15_I18N_EN.json` | English translations | 6 KB |
| 26 | `16_TENANT_ISOLATION_AR.md` | RLS rules | 2 KB |
| 27 | `17_SECURITY_THREATS_AR.md` | STRIDE per dept | 3 KB |
| 28 | `18_OBSERVABILITY_AR.md` | Metrics, logs, traces | 2 KB |
| 29 | `19_DEVOPS_DEPLOY_AR.md` | CI/CD for this module | 3 KB |
| 30 | `20_LLM_OBSERVABILITY_AR.md` | prompt + token tracking | 2 KB |
| 31 | `21_REGULATORY_AR.md` | SFDA / NPHIES / CBAHI per dept | 2 KB |
| 32 | `22_USER_MANUAL_AR.md` | End-user doc (Arabic) | 4 KB |
| 33 | `22_USER_MANUAL_EN.md` | End-user doc (English) | 4 KB |
| 34 | `23_TRAINING_VIDEO_SCRIPT_AR.md` | Storyboard | 3 KB |
| 35 | `24_AGENT_PROMPT_AR.md` | System prompt for AI assistant in this dept | 4 KB |
| 36 | `25_KB_ARTICLES_AR.md` | 10 knowledge-base Q&As | 6 KB |
| 37 | `26_RAG_DOCS_AR.md` | RAG corpus references (PMID, DOI, SFDA) | 3 KB |
| 38 | `27_VOICE_SCRIPT_AR.md` | Voice/speech prompts (Arabic + English) | 3 KB |
| 39 | `28_MOBILE_SCREENS_AR.md` | Mobile-first specs | 3 KB |
| 40 | `29_VENDOR_INTEGRATIONS_AR.md` | SFDA NDC, NPHIES, etc. | 3 KB |
| 41 | `30_KPIS_AR.md` | 5 measurable KPIs | 2 KB |
| 42 | `31_TELEMED_WORKFLOW_AR.md` | Telehealth integration | 2 KB |
| 43 | `32_PATIENT_PORTAL_AR.md` | mynama view | 2 KB |
| 44 | `33_FINAL_CLOSEOUT_AR.md` | Sign-off checklist | 2 KB |

Total per dept ≈ **200 KB** of generated content.

## Reuse (token-saver)

- Stitch pages: reuse the **HTML scaffold** from `nm-stitch-scaffold` skill
- Migrations: reuse **table template** from `nm-sql-table-template` skill
- Engines: reuse **clinical calculation pattern** from `nm-engine-pattern` skill
- Routers: reuse **middleware chain** from `nm-router-middleware` skill

## Acceptance gate

The blueprint is **not done** until all 44 files exist AND:
- `07_MIGRATIONS_UP.sql` runs without error against a fresh DB
- `12_ENGINE_JS.js` has ≥ 1 exported function with ≥ 80% branch coverage
- `13_ROUTER_JS.js` mounts in `server.js` without regression
- `10_UNIT_TESTS_AR.js` has ≥ 10 PASS assertions
- `10_INTEGRATION_TESTS_AR.js` has ≥ 5 supertest cases

## See also

- `nm-stitch-scaffold` — HTML template for any Stitch page
- `nm-sql-table-template` — SQL template for any clinical table
- `nm-engine-pattern` — Pure-function pattern for clinical scoring
- `nm-router-middleware` — Express router with required middleware chain
- `nm-migration-rollout` — Safe migration application pattern
- `nm-rbac-default` — Default role → action matrix
- `nm-i18n-default` — Default AR/EN locale strings
- `nm-wireframe-stub` — Empty Stitch HTML stub
- `nm-test-suite-default` — Default Jest + supertest skeleton
