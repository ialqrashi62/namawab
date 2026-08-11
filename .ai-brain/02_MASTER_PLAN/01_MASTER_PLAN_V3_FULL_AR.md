# NamaMedical — Master Plan V3 الكامل
## 50+ Deliverable × 122 قسم × 16 نوع مرفق = منصة طبية عالمية

> **التحديث 2026-08-11** — الإصدار الثالث من الخطة الرئيسية.
> يفهرس **كل** المخرجات المطلوبة لكل قسم من 122 قسم سريري.
> مرجع وحيد للـ AUTOPILOT / LOOP / MULTI-AGENT.

---

## 1. الموجز التنفيذي

NamaMedical هو **منصة مستشفى سعودية شاملة AI-powered** بـ:
- **122 قسم سريري** (Cardiology, Oncology, ER, ICU, NICU, PICU, …)
- **16 نوع مرفق** (مستشفى، عيادة، مركز تأهيل، صيدلية، مختبر، …)
- **44 ملف لكل قسم** = **5,368 ملف إجمالي**
- **5,000+ i18n keys** (AR/EN/FR/UR)
- **401+ migrations** مطبقة على live
- **LIVE على** [jumanasoft.com](https://jumanasoft.com) — Hetzner 8GB
- **Stack**: Node 20 + Express + PostgreSQL 16 + vanilla JS SPA + Tailwind + MD3 tokens + Prisma

---

## 2. المخرجات الـ 50+ المطلوبة (لكل قسم/منصة)

كل قسم يجب أن يُنتج الـ 50+ deliverable التالي. تُكتب في `.ai-brain/02_MODULES/<DEPT>/`:

### المجموعة A — Prompt Engineering (5 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 1 | `prompts/system_prompt.md` | System prompt رئيسي للنموذج (4 locales) |
| 2 | `prompts/context_template.md` | قالب السياق (demographics, history, vitals) |
| 3 | `prompts/workflow.md` | تسلسل الخطوات (input → reasoning → output) |
| 4 | `prompts/chaining.md` | LangChain chain spec (sequential/branch) |
| 5 | `prompts/vector_query.md` | RAG retrieval query spec |

### المجموعة B — Backend / Logic (8 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 6 | `engine.js` | Pure-function clinical engine |
| 7 | `engine_test.js` | Unit tests ≥5 |
| 8 | `router.js` | Express router + middleware |
| 9 | `router_test.js` | Integration tests ≥3 |
| 10 | `route_schemas.js` | JSON-schema validation |
| 11 | `rbac_policies.js` | Role-to-permission map |
| 12 | `audit_instrumentation.js` | Audit log hooks |
| 13 | `error_codes.js` | Dept error codebook |

### المجموعة C — Data & Storage (6 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 14 | `migrations/NN_up.sql` | Forward migration |
| 15 | `migrations/NN_down.sql` | Reverse migration |
| 16 | `migrations/migration_test.js` | Sandbox apply + verify |
| 17 | `seeders/sample_data.json` | Anonymized fixtures |
| 18 | `vector/embed_pipeline.js` | Chunk → embed → upsert |
| 19 | `vector/retrieval_pipeline.js` | Query → retrieve → rerank |

### المجموعة D — API (3 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 20 | `api/openapi.yaml` | OpenAPI 3.0 spec |
| 21 | `api/user_stories.md` | User stories + acceptance criteria |
| 22 | `api/test_cases.md` | Test cases + test plan |

### المجموعة E — Frontend / UI-UX (12 ملف)
| # | الملف | الوصف |
|---|---|---|
| 23 | `frontend/index.html` | Landing page (Stitch MD3) |
| 24 | `frontend/queue.html` | Patient queue |
| 25 | `frontend/detail.html` | Patient detail |
| 26 | `frontend/form.html` | Calculator / order form |
| 27 | `frontend/settings.html` | Dept config |
| 28 | `frontend/app.js` | Page logic |
| 29 | `frontend/app.css` | Page styles (uses tokens) |
| 30 | `frontend/icon.svg` | Dept icon |
| 31 | `frontend/i18n_ar.json` | AR translations |
| 32 | `frontend/i18n_en.json` | EN translations |
| 33 | `frontend/i18n_fr.json` | FR translations |
| 34 | `frontend/i18n_ur.json` | UR translations |

### المجموعة F — Documentation (10 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 35 | `docs/00_README.md` | Dept overview, KPIs, scope |
| 36 | `docs/01_ARCHITECTURE_AR.md` | Architecture diagram |
| 37 | `docs/02_DATA_MODEL_AR.md` | ERD, tables, relationships |
| 38 | `docs/04_SECURITY_THREAT_MODEL_AR.md` | STRIDE analysis |
| 39 | `docs/05_PERFORMANCE_BUDGET_AR.md` | Latency, throughput |
| 40 | `docs/06_I18N_KEYS_AR.md` | Key registry |
| 41 | `docs/07_COMPLIANCE_MATRIX_AR.md` | PDPL/NPHIES/CBAHI/ZATCA |
| 42 | `docs/USER_MANUAL_AR.md` | Arabic user guide |
| 43 | `docs/CHANGELOG_entry.md` | One-paragraph change note |
| 44 | `docs/EHR_BENCHMARK_AR.md` | vs Epic/Cerner/MEDITECH |

### المجموعة G — DevOps / CI-CD (4 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 45 | `ops/DEPLOY_RUNBOOK.md` | Deploy steps |
| 46 | `ops/INCIDENT_PLAYBOOK.md` | Rollback steps |
| 47 | `ops/QA_TEST_PLAN.md` | Acceptance criteria |
| 48 | `ops/cicd.yml` | GitHub Actions workflow |

### المجموعة H — Compliance & Legal (3 ملفات)
| # | الملف | الوصف |
|---|---|---|
| 49 | `legal/COMPLIANCE_REPORT_AR.md` | PDPL/NPHIES/CBAHI/ZATCA |
| 50 | `legal/AUDIT_TRAIL_AR.md` | Hash-chained audit log spec |
| 51 | `legal/PENETRATION_TEST_AR.md` | Pentest report template |

**المجموع: 51 ملف × 122 قسم = 6,222 ملف قسم** + System modules (~200 ملف) = **~6,400 ملف إجمالي**.

---

## 3. الأنظمة الطبية العالمية (المرجع للمقارنة)

### 3.1 Epic Systems (USA, ~280 مليون مريض)
- **Hyperspace** (clinician UI), **Canto/MyChart** (patient), **Beaker** (lab), **Radiant** (rad), **Cupid** (cardio)
- **Modules**: 40+ (Cadence, Prelude, Resolute HB/PB, Willow, ASAP, OpTime)
- **Interop**: FHIR R4, HL7v2, X12, NCPDP, DICOM
- **AI**: Cosmos, Deterioration Index, Sepsis Prediction
- **Lesson for us**: depth of workflow (single-screen per role), strict RLS, billing depth

### 3.2 Cerner / Oracle Health (USA, ~250 مليون)
- **Millennium PowerChart** (clinician), **FirstNet** (ER), **PharmNet** (pharmacy), **RadNet** (rad)
- **Cloud**: Oracle Health Cloud, AWS-hosted
- **Interop**: FHIR R4, HL7v2/3, IHE PCD
- **AI**: Oracle Digital Assistant, Cerner Command Language (CCL)
- **Lesson**: CCL scripts (we use pure JS), cloud-first deployment

### 3.3 Allscripts / Veradigm
- **Sunrise** (acute), **TouchWorks** (ambulatory), **Professional** (small)
- **AI**: 2bPrecise (genomic), FollowMyHealth (patient portal)
- **Lesson**: flexible for ambulatory, less acute-care depth

### 3.4 MEDITECH (USA, ~250 مستشفى)
- **Expanse** (latest), **M-Health** (patient)
- **NEMJ**: Expanse Now (mobile), Genomics
- **Lesson**: mobile-first (we have mynama/), PDPL-equivalent strong

### 3.5 Athenahealth
- **athenaOne** (cloud-native, ambulatory)
- **AI**: Moments, Glow
- **Lesson**: best-in-class cloud workflow, we can match

### 3.6 NextGen
- **Mirth Connect** (interop), NextGen Enterprise
- **Lesson**: open-source interop (we have MLLP client)

### 3.7 أنظمة إقليمية مهمة
- **InterSystems TrakCare** (UK/KSA), **Cerner KSA** (موجود في عدة مستشفيات), **Epic KSA** (موجود في مواساة)، **NPHIES Saudi** (الحكومي)
- **Riyadh Care / SEHA** (UAE)، **CCHI** (Council of Cooperative Health Insurance)
- **Lesson**: NPHIES integration is **mandatory** in KSA

---

## 4. خارطة الطريق (14 wave × ~9 قسم)

| Wave | Departments | Status |
|---|---|---|
| W01 | cardiology, oncology, pediatrics | ✅ done |
| W02 | surgery, pharmacy, emergency | ✅ done |
| W03 | endocrine, pulmo, GI | ✅ done |
| W04 | rheum, ortho, neuro | ✅ done |
| W05 | nephro, OBGYN, derma | ✅ done |
| W06 | family, geriatric, sports | 🚧 next |
| W07 | dental, ophthalmology, ENT | 🚧 next |
| W08 | urology, plastic-surg, vascular | 🚧 next |
| W09 | thoracic, neurosurg, trauma | 🚧 next |
| W10 | anesthesia, pain, palliative | 🚧 next |
| W11 | rehab, physio, occ-therapy | 🚧 next |
| W12 | nutrition, psych, sleep | 🚧 next |
| W13 | genetics, immunol, allergy | 🚧 next |
| W14 | remaining 38 depts | 🚧 next |

---

## 5. System modules (مستقلة عن الأقسام)

| Module | Purpose | Skills |
|---|---|---|
| AI co-pilot | Multi-model LLM gateway | nm-multimodel, nm-rag-vector |
| Vector store | RAG embeddings | nm-vector-store |
| LangChain orchestrator | Chain composition | nm-langchain-template |
| Prompt registry | Versioned prompts | nm-prompt-engineering |
| Auth / MFA | SSO + TOTP | nm-security-rbac |
| RBAC | 7-tier (owner→viewer) | nm-rbac-default |
| i18n switcher | AR/EN/FR/UR | nm-i18n-default |
| Compliance (PDPL/NPHIES/CBAHI/ZATCA) | Regulatory | nm-compliance-pdpl |
| Audit log | Hash-chained | nm-observability |
| Observability | Prometheus, traces | nm-observability |
| Cost tracking | Token + cost | nm-budget-tracking |
| Deploy / rollback | CI/CD | nm-deployment-cicd |
| Phase planner | Roadmap | nm-phase-planner |
| Quality gates | 6-gate enforcement | nm-quality-gates |
| Helpdesk | Ticketing | (TBD) |
| APM | App perf | nm-observability |
| LLM observability | Token use, latency | nm-llm-observability |
| SEO | Meta, sitemap | (TBD) |
| GTM | Marketing site | (TBD) |

---

## 6. Phased execution (token budget)

| Group | Tokens/dept | × 122 | With skills (75% off) |
|---|---|---|---|
| A. Prompts | ~3,000 | 366K | ~92K |
| B. Backend | ~6,000 | 732K | ~183K |
| C. Data | ~4,000 | 488K | ~122K |
| D. API | ~2,000 | 244K | ~61K |
| E. Frontend | ~5,000 | 610K | ~152K |
| F. Docs | ~4,000 | 488K | ~122K |
| G. Ops | ~1,500 | 183K | ~46K |
| H. Legal | ~1,500 | 183K | ~46K |
| **Total** | **~27,000** | **~3.3M** | **~825K** |

**System modules:** ~150K tokens (with skills).
**Total with skills:** ~975K tokens for the whole platform.

---

## 7. Master output paths (for AI agents to write to)

```
.ai-brain/02_MODULES/<DEPT>/
  prompts/             (5 files)
  *.js                 (5 files: engine, router, etc.)
  migrations/          (3 files)
  seeders/             (1 file)
  vector/              (2 files)
  api/                 (3 files)
  frontend/            (12 files)
  docs/                (10 files)
  ops/                 (4 files)
  legal/               (3 files)

.ai-brain/02_MODULES_NEW/<DEPT>/      (for 108 remaining depts W06-W14)
```

---

## 8. Safety rails (من AGENTS.md §2.2، 13 سكة)

1. لا secrets في الكود
2. لا PHI في commits
3. لا force-push على protected branches
4. لا DELETE/DROP بدون backup
5. Tenant isolation (RLS + middleware)
7. PHI at rest مشفّر
8. CSP report-only افتراضياً
9. كل مال/VAT server-side
10. Audit log hash-chained, 7+ سنوات
11. Fail-closed على tenant مفقود
12. لا PHI في logs
13. Golden Access Rule (المالك مطلق، الباقي specialty)

---

## 9. Acceptance gates (6 gates)

| # | Gate | Pass |
|---|---|---|
| G1 | Tests | All green, coverage ≥ 80% |
| G2 | Security | No secrets, no XSS, no PHI in logs |
| G3 | RLS | All new tables FORCE_RLS + policy |
| G4 | i18n | All 4 locales 100% |
| G5 | RBAC | Every router has full middleware |
| G6 | Deploy | Sandbox → live, smoke green |

---

## 10. Master plan review checklist (للـ AUTOPILOT)

- [x] 50+ deliverables listed per section
- [x] Global medical systems surveyed (Epic, Cerner, Allscripts, MEDITECH, Athena, NextGen, InterSystems)
- [x] 14-wave roadmap defined
- [x] Token budget calculated (~975K with skills)
- [x] System modules listed
- [x] Safety rails cited
- [x] Acceptance gates listed

---

> **Next step:** AUTOPILOT will execute this plan in waves, using skills to stay under 1M tokens total.
