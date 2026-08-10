# NamaMedical (jumanasoft.com) — .ai-brain INDEX
**Last updated:** 2026-08-10

---

## What is `.ai-brain/`?

This directory is the **single source of truth** for every artifact we generate: prompts, schemas, wireframes, OpenAPI specs, ERD, user stories, test plans, deployment plans, marketing plans, security plans, observability plans, RAG pipelines, LangChain chains, vector DB schemas, i18n files, seeders, migrations, user manuals, training videos, legal docs, project management docs, helpdesk plans, budget plans, agile plans, and Stitch Google UI references.

The `MASTER_PLAN_2026_08_10_AR.md` is the **root index** — start there.

---

## Folder map (the 44-bucket contract)

```
.ai-brain/
├── MASTER_PLAN_2026_08_10_AR.md ← START HERE (root index)
├── 00_SYSTEM/ ← global / cross-cutting plans
│   ├── GLOBAL_MEDICAL_SYSTEMS_BENCHMARK_AR.md
│   ├── STITCH_GOOGLE_UI_CATALOG_AR.md
│   ├── WORKFLOW_SCENARIOS_DATA_FLOW_CATALOG_AR.md
│   ├── OPENAPI_TOP_MODULES.yaml
│   ├── GTM_PLAN_2026_KSA_AR.md
│   ├── SECURITY_PENTEST_PLAN_AR.md
│   ├── APM_OBSERVABILITY_PLAN_AR.md
│   ├── DEPLOYMENT_CICD_PLAN_AR.md
│   ├── RAG_LANGCHAIN_VECTOR_PLAN_AR.md
│   ├── AUTH_RBAC_SSO_PLAN_AR.md
│   ├── TESTING_I18N_USER_MANUAL_PLAN_AR.md
│   ├── AGILE_BUDGET_PM_PLAN_AR.md
│   ├── PROMPT_ENGINEERING_LEGAL_COMPLIANCE_AR.md
│   └── HELPDESK_SUPPORT_PLAN_AR.md
│
├── 01-requirements/ ← user stories + acceptance criteria
├── 01_DATA/ ← reference data
├── 02_MODULES/ ← 60+ clinical departments (DEP-001 to DEP-060)
│   ├── DEP-001_cardiology/ (44 buckets per dept)
│   ├── DEP-002_endocrinology/
│   ├── ... 60+ departments ...
│   └── DEP-060_facility/
│
├── 03-database/ ← schemas + ERDs
├── 03_AUTOPILOT/ ← autonomous build pipeline
├── 04-backend/ ← service layer
├── 04_BACKEND/ ← alternative backend
├── 04_EXAMPLES/ ← code samples
├── 05-frontend/ ← UI components
├── 05_SHARED/ ← shared utilities
├── 06-vector-rag/ ← vector + RAG layer
├── 06_SHARED/ ← shared utilities
├── 07-devops/ ← CI/CD + deploy
├── 07_DEPLOY/ ← deployment configs
├── 08-testing/ ← test plans + cases
├── 08_TESTING/ ← alt testing
├── 09-docs/ ← documentation
├── 09_DOCS/ ← alt docs
├── 10-compliance/ ← ZATCA + NPHIES + CBAHI + PDPL
├── 10_COMPLIANCE/ ← alt compliance
├── 11-security/ ← security plans + audits
├── 11_TRAINING/ ← training docs
├── 12-project-mgmt/ ← PM artifacts
├── 12_DATA/ ← alt data
├── 12_PM/ ← alt PM
├── 13-business/ ← business cases
├── 13_AGILE/ ← agile artifacts
├── 13_BIZ/ ← alt business
├── 14_ADMIN_UI/ ← admin UI
├── 14_OBSERVABILITY/ ← observability
├── 15_EXECUTION/ ← execution runbooks
├── 99-state/ ← state caches
├── 99-upgrade/ ← upgrade plans
│
├── skills/ ← 100+ procedural memory skills
├── SKILL_INDEX_2026_08_09.md ← skills index
├── runs/ ← autopilot run logs
├── templates/ ← reusable templates
└── memories/ ← state cache
```

---

## The 44-bucket contract (per department blueprint)

Every department blueprint in `02_MODULES/DEP-NNN_*/` follows this exact structure:

```
DEP-NNN_<dept>/
├── 01_PROMPT_ENGINEERING.md         ← prompt design notes
├── 02_SYSTEM_PROMPT.md              ← LLM system prompt (if AI)
├── 03_CONTEXT.md                    ← state + RAG + history
├── 04_WORKFLOW_ORCHESTRATION.md     ← sequence diagram
├── 05_LANGCHAIN.md                  ← chains + agents + tools
├── 06_BACKEND.md                    ← pure engines
├── 07_API.md                        ← REST contract
├── 08_DATA_STORAGE.md               ← Postgres + RLS
├── 09_VECTOR_DB.md                  ← pgvector + mine
├── 10_RAG.md                        ← retrieval pipeline
├── 11_FRONTEND.md                   ← UI/UX (Stitch)
├── 12_DIGITAL_ASSETS.md             ← icons + illustrations
├── 13_DEVOPS.md                     ← infra + CI/CD
├── 14_CICD.md                       ← CI/CD pipeline
├── 15_TESTING.md                    ← unit + integration
├── 16_BUSINESS_FLOWS.md             ← workflow scenarios
├── 17_WIREFRAMES.html               ← Stitch wireframe
├── 18_ERD.mmd                       ← Mermaid ERD
├── 19_OPENAPI.yaml                  ← OpenAPI spec
├── 20_USER_STORIES.md               ← user stories
├── 21_TEST_PLAN.md                  ← test plan
├── 22_ARCHITECTURE.md               ← architecture doc
├── 23_SECURITY.md                   ← security plan
├── 24_DEPLOYMENT.md                 ← deployment plan
├── 25_STYLE_GUIDE.md                ← design system
├── 26_I18N.json                     ← AR + EN + FR + UR
├── 27_SEEDERS.sql                   ← sample data
├── 28_MIGRATION_up.sql              ← forward migration
├── 28_MIGRATION_down.sql            ← reverse migration
├── 29_USER_MANUAL.md                ← user manual
├── 30_TRAINING_VIDEO_SCRIPT.md      ← training video script
├── 31_COMPLIANCE.md                 ← legal + compliance
├── 32_PM_AGILE.md                   ← agile artifacts
├── 33_TASK_TRACKER.md               ← epic → story → task
├── 34_BUDGET_TOKENS.md              ← budget + token cost
├── 35_APM_LOGGING.md                ← observability
├── 36_USER_ANALYTICS.md             ← funnels + retention
├── 37_LLM_OBSERVABILITY.md          ← LLM tracing + cost
├── 38_AUTH.md                       ← auth flow
├── 39_RBAC.md                       ← permissions matrix
├── 40_PENTEST.md                    ← pen-test plan
├── 41_SEO.md                        ← SEO + GEO
├── 42_HELPDESK.md                   ← support flow
├── 43_GTM.md                        ← marketing
└── 44_STITCH_GOOGLE.html            ← visual reference
```

**Total: 60 departments × 44 buckets = 2,640 artifacts** (token-saver reduces 60-70%).

---

## Key skills (in `.ai-brain/skills/`)

| Skill | Purpose |
|---|---|
| `nm-ai-brain-autopilot/` | Owner-authorized batch rollout |
| `nm-ai-brain-department-generator/` | Generate single dept blueprint (35 files) |
| `nm-ai-brain-loop-engineering/` | Iterate Plan→Implement→Test→Verify |
| `nm-ai-brain-multi-agent/` | Parallel 7-expert-panel |
| `nm-ai-brain-master-orchestrator/` | Combine all 3 |
| `nm-ai-brain-token-saver/` | 60-70% token reduction |
| `nm-ai-brain-station-matcher/` | Map station → dept |
| `nm-ai-brain-frontend-bridge/` | Stitch HTML → React |
| `MEDICAL_AUTOPILOT_CORE_SKILL_AR.md` | Medical autopilot core |
| `MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR.md` | Security |
| `MEDICAL_GLOBAL_BENCHMARK_SKILL_AR.md` | Epic/Cerner parity |
| `MEDICAL_STITCH_DESIGN_SYSTEM_SKILL_AR.md` | Design tokens |

---

## Token-saver pattern (60-70% reduction)

Without token-saver: 2,640 artifacts × 5 pages each = 13,200 pages
With token-saver: 2,640 artifacts × shared snippets = **5,280 pages (60% reduction)**

How:
- Shared snippets in `.ai-brain/snippets/`
- Table-first docs (rows instead of prose)
- Shared JSON schemas across modules
- Reusable ERDs (Mermaid subgraphs)

---

## AUTOPILOT + LOOP ENGINEERING + MULTI-AGENT (the 3 orchestration engines)

### AUTOPILOT
Owner-authorized batch rollout: Discover → Plan → Code → Test → Commit → Push → Close.

### LOOP ENGINEERING
Iterative Plan → Implement → Test → Verify. Cap 4 iterations. Escalate after.

### MULTI-AGENT
7 parallel experts: CMO + AI + Architect + DevOps + UX + Compliance + Orchestrator.

---

## Stitch Google integration

Every blueprint includes `44_STITCH_GOOGLE.html` for visual continuity. See `00_SYSTEM/STITCH_GOOGLE_UI_CATALOG_AR.md`.

---

## Status (as of 2026-08-10)

✅ Application live on https://jumanasoft.com (Hetzner)
✅ 401/418 routes guarded with validateBody + idempotencyGuard
✅ 60+ department blueprints in `.ai-brain/02_MODULES/`
✅ 44-bucket contract defined (per dept)
✅ 12+ global cross-cutting plans in `00_SYSTEM/`
✅ OpenAPI top modules drafted
✅ Stitch wireframes drafted (110+ pages)
✅ Skills indexed (100+ procedural skills)
✅ Token-saver patterns active
✅ AUTOPILOT + LOOP + MULTI-AGENT operational

---

## Next steps

1. **Per-department 44-bucket completion** — finish every blueprint
2. **Per-department Stitch Google UI** — generate visual reference for every dept
3. **RAG pipeline production rollout** — clinical Q&A + drug interaction + SOP lookup
4. **Saudi market launch** — ZATCA + NPHIES + CBAHI go-live
5. **Patient portal launch** — MyChart-equivalent UX
6. **HIE pilot** — Care Everywhere equivalent

---

End of README. Start with `MASTER_PLAN_2026_08_10_AR.md`.
