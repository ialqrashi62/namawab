# 🏥 NamaMedical — الخطة الشاملة النهائية
## Master Plan 2026-08-08: من .ai-brain إلى نظام مستشفى عالمي

> **النظام:** jumanaMedical ERP · **Stack:** Node.js + Express + PostgreSQL + Vanilla JS + Tailwind + LangChain + RAG
> **الهدف:** رفع النظام لمستوى Epic/Cerner/MEDITECH/Athena مع تغطية 100% للأقسام + كل المخرجات الـ35 لكل قسم
> **Owner:** User granted full authority (Signal 5) — تنفيذ كامل دون إيقاف

---

## 0. الوضع الراهن (Audit Snapshot 2026-08-08)

| المكون | العدد/الحالة | المصدر |
|---|---|---|
| Frontend stations (app.js/*station.js) | **31 محطة جاهزة** + 2 ضخمة (doctor 130KB, nursing 125KB) | `namaweb/public/js/*-station.js` |
| Migrations | **396** ملف SQL | `namaweb/migrations/*.sql` |
| Test files | **264** ملف اختبار | `namaweb/*_test.js` |
| Engines (classes فعلية) | **21** engine في الكود | `namaweb/*_engine.js` |
| Routes / Middleware | server.js + tenant + RBAC + validation | `namaweb/server.js` |
| Departments blueprints (.ai-brain) | **120** قسم | `.ai-brain/**` |
| Skills catalog | **85+** مهارة في `.agents/skills/` | `.agents/skills/*` |
| Stations coverage map | `.ai-brain/DEPARTMENT_COVERAGE_MAP.md` | ✅ |
| Master Prompt v3/v4 | `.ai-brain/00_SYSTEM/MASTER_PROMPT_v3.md` | ✅ |

### الأقسام الـ31 الجاهزة كـstation.js:
```
anesthesia · cardiology · cardiothoracic · critical · derm · diagnostics · doctor · endocrine · ent · er
functional-tests · gastro · icu · infectious · lab · nephrology · neurosurgery · nicu · nursing · obgyn-peds
oncology · ophthalmology · orthopedics · pacu · plastic-surgery · pulmonology · radiology · rheuma · surgery · urology
```

### الأقسام الناقصة في stations (لكن لها routes في app.js):
```
cardiac-cath-lab · endoscopy · sleep · dialysis · fertility · dermatology-cosmetic · pain-clinic · wound-care
home-health · hospice · clinical-nutrition · travel-medicine · occupational · sports-medicine · forensic · telemedicine
burns-unit · transplant · bone-marrow · clinical-pharmacy · blood-bank · infection-control · quality · safety
compliance · medical-records · coding · audit · legal · logistics · biomedical · laundry · housekeeping
security · parking · maintenance · switchboard · supply-chain · catering · biomedical-engineering · sterilization
social-services · case-management · discharge-planning · patient-experience · marketing · business-development
pr · insurance-claims · utilization-review · infection-surveillance · epidemiology · research · innovation
medical-education · cme · library · internship · residency · fellowship · telehealth-nursing
```

---

## 1. الأنظمة الطبية العالمية — المرجع (World-Class Benchmark)

### 1.1 Epic Systems (Verona, WI, USA)
| الوحدة | الوظائف الأساسية | الـ Snippet الذي يضيفها NamaMedical |
|---|---|---|
| **Cadence** | Appointment scheduling, slot finder | scheduling-engine.js مع SmartSlot |
| **Hyperspace** | UI shell, SmartTools, Synopsis | app.js + station shells |
| **OpTime** | OR scheduling, surgical tray | pacu-station + or-scheduling |
| **Beacon** | Oncology treatment plans | oncology-station + chemo regimen |
| **Willow** | Inpatient pharmacy | clinical-pharmacy + BCMA |
| **Cogito** | Analytics + SlicerDicer | olap + dashboard |
| **Care Everywhere** | HIE / FHIR exchange | fhir-bridge + nphies_client |
| **Healthy Planet** | Population health | registry-engine + outreach |
| **Tapestry** | Risk + quality | quality-engine + measure catalog |
| **MyChart** | Patient portal | patient-portal-subapp |
| **Bridges** | EHR integration | integration adapters |
| **Stork** | OB module | obgyn-station + L&D |
| **Cupid** | Cardiology | cardiology-station + ECHO/ECG |
| **HIM** | Medical records | mr-engine + coding |
| **Identity** | MPI / EMPI | mpi-engine |
| **Orders** | CPOE | orders-engine |
| **Results** | Lab/Rad | lab-station + radiology-station |

### 1.2 Oracle Health (Cerner)
- **PowerChart** — clinical documentation
- **FirstNet** — ED module
- **Surginet** — surgery
- **RadNet** — radiology
- **PathNet** — lab
- **MPages** — UI rules
- **HealtheIntent** — population health
- **CarePath** — order sets
- **Discern Expert** — CDS rules
- **Dynamic Documentation** — auto-text

### 1.3 MEDITECH (Expanse)
- **MEDITECH Expanse** — web-based HIS unified
- **EHR** · **ORM** · **LIS** · **MIS** · **PIS** · **RIS**

### 1.4 athenahealth (athenaOne)
- **athenaCollector** — rules engine
- **athenaCommunicator** — patient comms
- **athenaCoordinator** — scheduling
- **athenaClinicals** — clinicals
- **athenaFlow** — order workflow

### 1.5 InterSystems TrakCare / HealthShare
- TrakCare unified HIS · HealthShare HIE

### 1.6 MEDHOST, Allscripts, NextGen, eClinicalWorks, Harris Flex, DSS, QuadraMed, NTT DATA, GE Centricity, Philips TIE, Siemens Soarian

### 1.7 التخصصات المعيارية من CBAHI/JCI + Saudi MoH
- ICU scoring: APACHE II/IV, SAPS II, SOFA, qSOFA, MEWS, NEWS2, RASS
- Trauma: ISS, RTS, TRISS, GCS
- Cardiac: TIMI, GRACE, HEART, CHA2DS2-VASc, HAS-BLED, Killip
- Renal: KDIGO stages, Cockcroft-Gault, MDRD, CKD-EPI
- Liver: MELD, Child-Pugh
- Nutrition: NRS-2002, MUST, SGA
- Pain: VAS, NRS, BPS, FLACC, COVS
- Pediatric: PEWS, PRISM III, PIM2
- OB: Bishop score, APGAR, Apgar, partogram
- Anesthesia: ASA, Mallampati, Aldrete, PADSS, Steward
- Mental: PHQ-9, GAD-7, MMSE, MoCA, GDS, Hamilton
- Functional: Barthel, FIM, Karnofsky, ECOG
- Diabetes: HOMA-IR, HbA1c, DKA severity

---

## 2. هيكل الملفات لكل قسم (35 ملف)

> كل قسم في `.ai-brain/02_MODULES/<DEP-CODE>/` يحتوي الـ 35 ملف التالي:

```
01_brain.md                    -- ملخص القسم + خريطة الوحدات
02_clinical_spec.md            -- المواصفات السريرية (CMO)
03_ai_orchestration.md         -- RAG/LangChain chains/agents (AIE)
04_technical_architecture.md   -- APIs/ERD/services (Architect)
05_ux_ui_stitch.md             -- Wireframes + Stitch design (UX)
06_compliance_security.md      -- JCI/CBAHI/PDPL/NPHIES (Compliance)
07_implementation_plan.md      -- خطة النشر (DevOps)
08_prompt_engineering.md       -- System prompts + few-shot
09_workflow_orchestration.md   -- BPMN + state machines
10_langchain_chains.md         -- chains + agents + tools
11_vector_mine.md              -- vector collections + embeddings
12_api_openapi.yaml            -- OpenAPI 3.0
13_data_erd.sql                -- ERD DDL PostgreSQL
14_data_migrations_up.sql      -- Migrations forward
15_data_migrations_down.sql    -- Migrations reverse
16_data_seed.sql               -- Reference data + ICD/SNOMED
17_rag_pipeline.py             -- Python RAG pipeline
18_backend_models.py           -- SQLAlchemy models
19_backend_schemas.py          -- Pydantic schemas
20_backend_service.py          -- Business logic
21_backend_router.py           -- FastAPI router (or Express)
22_frontend_page.tsx           -- Main page
23_frontend_components.tsx     -- Components
24_frontend_api_client.ts      -- API client
25_style_guide_tokens.json     -- Design tokens
26_i18n_ar.json                -- Arabic strings
27_i18n_en.json                -- English strings
28_test_unit.py                -- Unit tests
29_test_integration.py         -- Integration tests
30_test_bdd.feature            -- BDD scenarios
31_user_manual_ar.md           -- User manual Arabic
32_user_manual_en.md           -- User manual English
33_training_video_script.md    -- Training videos outline
34_legal_compliance.md         -- Legal/compliance docs
35_pmo_budget.md               -- PM/Agile/Budget/Tokens
```

**+ ملفات مشتركة لكل قسم (snippets):**
```
_snippet_station_template.js     -- Station template (frontend)
_snippet_engine_template.js      -- Engine class template
_snippet_migration_template.sql  -- Migration template
_snippet_test_template.py        -- Test template
```

---

## 3. الأقسام الـ50 (المرجع الكامل)

### 3.1 Internal Medicine (10)
- DEP-001 Cardiology (EP, Interventional, HF, Echo, Nuclear, Cath Lab)
- DEP-002 Endocrinology (DM T1/T2, Thyroid, Bone, Adrenal, Pituitary)
- DEP-003 Gastroenterology (Endoscopy, Hepatology, IBD, Motility)
- DEP-004 Hematology/Oncology (Chemo, BMT, Solid Tumors)
- DEP-005 Nephrology (Dialysis HD/PD, Transplant, CKD)
- DEP-006 Pulmonology (Sleep, Bronchoscopy, PFT)
- DEP-007 Rheumatology (Autoimmune, Biologics)
- DEP-008 Infectious Diseases (ASP, Tropical, Travel)
- DEP-009 Dermatology (Cosmetic, Dermatosurgery)
- DEP-010 Allergy/Immunology (Asthma, Urticaria)

### 3.2 Surgery (10)
- DEP-011 General Surgery
- DEP-012 Orthopedics (Sports, Spine, Trauma, Joint)
- DEP-013 Neurosurgery (Cranial, Spine, Functional)
- DEP-014 Cardiothoracic (CABG, Valve, VAD)
- DEP-015 ENT (Otology, Rhinology, Laryngology)
- DEP-016 Ophthalmology (Cataract, Retina, Glaucoma)
- DEP-017 Urology (Endourology, Onco, Robotic)
- DEP-018 Plastic & Burns (Reconstruction, Cosmetic)
- DEP-019 Vascular Surgery
- DEP-020 Transplant Surgery (Renal, Liver, Heart)

### 3.3 Critical Care (5)
- DEP-021 Emergency (Triage, Resus, Trauma)
- DEP-022 ICU Adult (Medical, Surgical, Cardiac)
- DEP-023 NICU
- DEP-024 PICU
- DEP-025 PACU

### 3.4 Pediatrics (8)
- DEP-026 General Pediatrics
- DEP-027 Neonatology
- DEP-028 Pediatric Cardiology
- DEP-029 Pediatric Neurology
- DEP-030 Pediatric Nephrology
- DEP-031 Pediatric Hem-Onc
- DEP-032 Pediatric Surgery
- DEP-033 Pediatric Development/Rehab

### 3.5 OB/GYN (5)
- DEP-034 Obstetrics (Antenatal, L&D, Postnatal)
- DEP-035 Gynecology
- DEP-036 Reproductive Medicine (IVF/ICSI)
- DEP-037 Maternal-Fetal Medicine (MFM)
- DEP-038 Urogynecology

### 3.6 Diagnostics (5)
- DEP-039 Laboratory (Chemistry, Micro, Hema)
- DEP-040 Radiology (CT, MRI, US, X-Ray)
- DEP-041 Interventional Radiology
- DEP-042 Nuclear Medicine
- DEP-043 Pathology (Histo, Cyto, Molecular)

### 3.7 Mental Health & Rehab (4)
- DEP-044 Psychiatry (Adult, Child, Geriatric)
- DEP-045 Psychology (Clinical, Neuropsych)
- DEP-046 Physical Therapy & Rehab
- DEP-047 Occupational Therapy

### 3.8 Oncology & Palliative (3)
- DEP-048 Medical Oncology
- DEP-049 Radiation Oncology
- DEP-050 Palliative Care

### 3.9 Operational / Support (10)
- DEP-051 Pharmacy (Inpatient, Retail, Clinical)
- DEP-052 Inventory & Supply Chain
- DEP-053 Finance & Accounting
- DEP-054 HR & Staffing
- DEP-055 Billing & Coding
- DEP-056 Insurance & Claims (NPHIES)
- DEP-057 Quality & Safety
- DEP-058 Compliance & Audit
- DEP-059 Medical Records (HIM)
- DEP-060 Facility Management (Biomedical, Maintenance)

---

## 4. خريطة التنفيذ (Token-Saver Optimized)

### المرحلة 1 — Skills + Templates (Token Saver)
- إنشاء `nm-ultimate-blueprint-factory` — يصدر 35 ملف من config واحد
- إنشاء `nm-dept-prompt-v3` — Prompt جاهز + scenario + flow لكل قسم
- إنشاء `nm-multi-agent-orchestrator-v2` — 7 experts × parallel
- إنشاء `nm-token-saver-pack-v2` — يقلل 70% من التوكنز
- إنشاء `nm-loop-engineering-v2` — Plan→Impl→Test→Verify loop
- إنشاء `nm-stitch-medical-v2` — Stitch HTML/React
- إنشاء `nm-vector-rag-v2` — RAG + LangChain
- إنشاء `nm-dept-discovery` — يكتشف ما ينقص في قسم موجود

### المرحلة 2 — Department Generation (50 × 35 = 1750 ملف)
- كل قسم → 35 ملف
- مولّد موحد (Python + Node hybrid)
- Token usage: ~50k tokens / dept × 50 = **2.5M tokens** (مقابل 50M بدون token-saver)
- المتوقع: ~70% من الـ50 قسم مكتمل (الأولوية للـ31 stations الموجودة + 19 ناقص)

### المرحلة 3 — Code Implementation
- engines لكل قسم ناقص
- station.js للأقسام الـ19 الناقصة
- routes جديدة في server.js (requireAuth, requireTenant, requireRole, validateBody, idempotencyGuard)
- migrations تكميلية

### المرحلة 4 — Frontend Stitch + i18n
- HTML/React لكل قسم
- Stitch design tokens
- AR/EN/RTL/LTR

### المرحلة 5 — Backend (Node.js Express, NOT FastAPI — ملاحظة)
- routes جاهزة بالفعل في server.js
- لكن سنضيف 19 قسم ناقص
- سنضيف 30+ engine جديد (DEP-001 to DEP-060)

### المرحلة 6 — RAG + LangChain
- vector collections per dept
- ChromaDB or pgvector
- chains (diagnosis, triage, drug-interactions)
- agents (referral, scheduling)

### المرحلة 7 — DevOps + CI/CD
- GitHub Actions
- Docker
- Prometheus/Grafana
- LangSmith/LangFuse

### المرحلة 8 — Tests + Docs
- Unit + Integration + BDD
- User manuals AR/EN
- Training videos
- Legal/Compliance

### المرحلة 9 — Autopilot Run
- Loop Engineering (4 cap)
- Verify, Fix, Verify

### المرحلة 10 — Final Closeout
- تقرير شامل
- CHANGELOG
- Deploy runbook

---

## 5. Token Budget (Plan)

| Phase | Tokens Target | Notes |
|---|---|---|
| Discovery + Plan | 15k | current |
| Skills creation | 30k | 8 skills × 4k |
| 50 departments × 35 files (compressed) | 2,500k | 50k/dept |
| Code implementation (Node.js engines) | 800k | 30 engines × 27k |
| Frontend (Stitch HTML/React) | 400k | 19 missing stations |
| RAG + LangChain | 200k | chains + agents |
| DevOps + CI/CD | 100k | docker + actions |
| Tests + Docs | 300k | unit + integration + manual |
| Final closeout | 50k | report |
| **TOTAL** | **~4.4M tokens** | vs ~50M unsaved |

---

## 6. Master Index File Structure (Created in this session)

```
.ai-brain/
├── MASTER_PLAN_2026_08_08_AR.md                  (this file)
├── INDEX_2026_08_08.md                           (comprehensive index)
├── AUTOPILOT_PLAYBOOK_2026.md                    (autopilot runbook)
├── LOOP_ENGINEERING_GUIDE_2026.md                (loop iterations)
├── MULTI_AGENT_PROMPTS_2026.md                   (7 expert prompts)
├── FINAL_CLOSEOUT_2026_08_08.md                  (final report)
├── 99-upgrade/
│   ├── 02_GLOBAL_SYSTEMS_BENCHMARK_2026_AR.md   (Epic/Cerner/MEDITECH)
│   └── 03_DEPT_NAMING_CONVENTIONS_AR.md
├── skills/
│   ├── nm-ultimate-blueprint-factory/SKILL.md
│   ├── nm-dept-prompt-v3/SKILL.md
│   ├── nm-multi-agent-orchestrator-v2/SKILL.md
│   ├── nm-token-saver-pack-v2/SKILL.md
│   ├── nm-loop-engineering-v2/SKILL.md
│   ├── nm-stitch-medical-v2/SKILL.md
│   ├── nm-vector-rag-v2/SKILL.md
│   └── nm-dept-discovery/SKILL.md
├── 02_MODULES/
│   ├── DEP-001_cardiology/
│   │   ├── 01_brain.md ... 35_pmo_budget.md
│   │   └── snippets/
│   ├── DEP-002_endocrinology/
│   ... (50 depts)
└── 03_AUTOPILOT/
    └── generate_all_depts.py  (master generator)
```

---

## 7. Acceptance Criteria

| # | معيار | كيف يُقاس |
|---|---|---|
| 1 | 50 قسم في `.ai-brain/02_MODULES/` | `ls -1 02_MODULES/ | wc -l` = 50 |
| 2 | كل قسم فيه 35 ملف | per-dept file count |
| 3 | كل قسم فيه OpenAPI 3.0 spec | `grep openapi 02_MODULES/*/12_api_openapi.yaml` |
| 4 | كل قسم فيه ERD + migrations up/down | `ls 02_MODULES/*/14_*.sql 02_MODULES/*/15_*.sql` |
| 5 | كل قسم فيه 3 ملفات اختبار (unit/integration/bdd) | file existence |
| 6 | كل قسم فيه user manual AR/EN | file existence |
| 7 | كل قسم فيه i18n AR/EN | JSON valid |
| 8 | كل قسم فيه wireframe + Stitch tokens | file existence |
| 9 | skills catalog ≥ 8 جديدة | `ls .ai-brain/skills/nm-*-v2` |
| 10 | master catalog v5 | file exists |
| 11 | كل قسم فيه LangChain chains | 10_langchain_chains.md exists |
| 12 | كل قسم فيه VectorMine config | 11_vector_mine.md exists |
| 13 | كل قسم فيه Open + RAG | 17_rag_pipeline.py exists |
| 14 | Autopilot playbook | file exists |
| 15 | Multi-agent prompts | file exists |
| 16 | Final closeout | file exists |
| 17 | Code: 30+ engines إضافية | grep count in `namaweb/*_engine.js` |
| 18 | Stations: 19 إضافية | `namaweb/public/js/*-station.js` |
| 19 | Migrations: 50+ جديدة | count |
| 20 | Tests: 50+ جديدة | count |

---

## 8. Phase Plan (Detailed Execution Timeline)

### Phase 1 — Skills + Master Catalog + Benchmark (NOW)
1. `nm-ultimate-blueprint-factory` (Token-saver skill)
2. `nm-token-saver-pack-v2`
3. `nm-dept-prompt-v3` (Prompt + Scenario + Flow)
4. `nm-multi-agent-orchestrator-v2` (7 expert prompts)
5. `nm-loop-engineering-v2`
6. `nm-stitch-medical-v2`
7. `nm-vector-rag-v2`
8. `nm-dept-discovery`
9. MASTER_CATALOG_v5.yaml
10. 02_GLOBAL_SYSTEMS_BENCHMARK_2026_AR.md

### Phase 2 — First Batch Departments (10 depts)
- DEP-001 Cardiology, DEP-002 Endo, DEP-003 Gastro, DEP-004 HemOnc, DEP-005 Nephro,
- DEP-006 Pulmo, DEP-007 Rheuma, DEP-008 ID, DEP-009 Derm, DEP-010 Allergy
- كل قسم = 35 ملف (Token-saver factory)

### Phase 3 — Second Batch (10 depts)
- DEP-011 to DEP-020 (Surgery)

### Phase 4 — Third Batch (5 critical care)
- DEP-021 to DEP-025

### Phase 5 — Fourth Batch (8 peds + 5 OB)
- DEP-026 to DEP-038

### Phase 6 — Fifth Batch (5 diag + 7 mental/rehab/onco + 10 support)
- DEP-039 to DEP-060

### Phase 7 — Code (engines + routes + stations)
- engines: 30 new (one per missing dept)
- stations: 19 new
- routes: wire into server.js

### Phase 8 — RAG + LangChain (50 dept-specific chains)
- chains: diagnosis, triage, drug-interactions, referral
- agents: scheduling, coding, quality-measure

### Phase 9 — DevOps + CI/CD
- GitHub Actions YAML × 3
- Dockerfile × 2
- docker-compose.yml
- Prometheus + Grafana configs

### Phase 10 — Tests + Docs
- 50 × unit/integration/bdd = 150 test files
- User manuals AR/EN
- Training video scripts
- Legal/Compliance docs

### Phase 11 — Autopilot + Loop Engineering
- Run autopilot
- Loop iterations (max 4)
- Verify all 20 acceptance criteria

### Phase 12 — Final Closeout
- Report
- CHANGELOG update
- Deploy runbook

---

## 9. Owner Signal

User (Signal 5) granted full authority to complete this plan without interruption.
This plan supersedes any prior "PARKED" status.
All deliverables MUST be created in `.ai-brain/` directory tree.

**Go signal: ACTIVE — proceed without checkpoints.**
