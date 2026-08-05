---
id: MASTER-UPGRADE-PLAN
version: 1.0
date: 2026-08-01
owner: ORC
status: ACTIVE
applies: NamaMedical ERP (entire stack)
status_signal: AUTOPILOT — wait for owner break signal
---

# 🧭 NamaMedical — خطة التطوير الشاملة (Master Upgrade Plan v1)

> **النطاق:** كل المنصة (المرحلة الأولى: planning + blueprints).
> **المنهجية:** 7-Expert Panel + 5-Loop Engineering + AUTOPILOT + Token-Saver S1-S8 + Skill Pack.
> **الناتج:** كل ملف deliverable موجود في `.ai-brain/99-upgrade/` + كل ما يُنفّذ لاحقاً في `namaweb/`.
> **الهدف النهائي:** التفوق على Epic, Oracle Health (Cerner), MEDITECH, athenahealth, InterSystems, SAP IS-H في السوق السعودي والخليجي.

---

## 0. ملخص تنفيذي (Executive Summary)

| البُعد | ما عند Epic/Cerner | ما عند NamaMedical اليوم | الفجوة (Gap) | ما سنضيفه الآن |
|--------|--------------------|--------------------------|--------------|----------------|
| **Stack** | C#, .NET + Caché/Oracle + Web/Java | Node + Express + pg + Vanilla JS | متقاربة | Serverless + Workers + Cache layer أقوى |
| **Specialty Tune** | Generic + heavy config | 13 AI Orchestrators + 18 Calc | ميزة Nama | + tiers + prompt registry |
| **Compliance** | HIPAA, JCI | CBAHI, NPHIES, ZATCA, SFDA, PDPL | ميزة Nama قوية | أقوى + NABIDH + HL7 FHIR R4 |
| **UI/UX** | Desktop-heavy | Vanilla SPA + Tailwind | متأخرة | Stitch v2 + Scribe + Mobile |
| **AI** | Co-pilot (DAX, Cerner Assist) | AI Orchestrators + LLM | متقاربة | Citation + Patient Graph + Prompt Registry |
| **Patient Portal** | MyChart / HealtheLife | غير موجود | كبيرة | Build MyNama (patient-first) |
| **RAG / Vector** | Custom | None at prod | متوسطة | pgvector + multilingual-e5 |
| **Multi-tenant SaaS** | Single-tenant on-prem | Multi-tenant ✅ | ميزة Nama قوية | + tenant billing + throttling |
| **Care Pathways** | Yes (Epic BPA) | جزئي | متوسطة | + Care Pathway Library 50+ |
| **Mobile** | Limited | Limited | متوسطة | RN + Expo app |

---

## 1. المنهجية (Engineering Methodology)

### 1.1 — 7-Expert Panel (لجنة الـ 7 خبراء)

كل قرار يُتخذ من خلال:
- **CMO** — clinical accuracy (VETO)
- **AIE** — AI, RAG, LangChain, Vector
- **SA** — backend, frontend, API, ERD, events
- **DSL** — CI/CD, security, infra
- **PM** — UX, story, accessibility, i18n
- **CQO** — JCI, ISO, NPHIES, ZATCA, SFDA, PDPL, audit
- **ORC** — synthesis + token discipline + final QC

### 1.2 — 5-Loop Engineering
```
L1 DISCOVER  → facts only (no opinions)
L2 PLAN      → approach + risks + rollback
L3 BUILD     → complete code (no abbreviations)
L4 TEST      → unit + integration + cross-tenant + clinical safety
L5 VERIFY    → compliance + signoff
```
**حد أقصى 4 iterations** — بعدها escalate للمالك.

### 1.3 — AUTOPILOT (هذا التطوير)
- **Tier-1**: 20 dept × 60 ملف = 1,200 ملف
- **Tier-2**: 40 dept × 40 ملف = 1,600 ملف
- **Tier-3**: 40 dept × 25 ملف = 1,000 ملف
- **Tier-4**: 20 dept × 15 ملف = 300 ملف
- **Total**: 4,100 ملف جديد في `.ai-brain/` + الكود لاحقاً في `namaweb/`

### 1.4 — Token-Saver S1-S8 (مفعّل دائماً)
- S1 schema_first (25%)
- S2 chunked_reasoning (5%)
- S3 id_reference (5%)
- S4 templated_output (10%)
- S5 cached_context (10%)
- S6 compressed_prompts (10%)
- S7 selective_depth (20%)
- S8 parallel_gen (wall-time)
- + snippet reuse (30%)

---

## 2. الـ 16 منطقة وظيفية — المخرجات المطلوبة

> كل منطقة لها blueprint خاص بها + ملف Executor Skill + token-saver snippet.

### 2.1 Prompt Engineering + System Prompt
**الملفات المطلوبة:**
- ✅ `02-prompt-engineering/PROMPT_REGISTRY.yaml` (central catalog)
- ✅ `02-prompt-engineering/SYSTEM_PROMPT_BASE.md` (master template)
- ✅ `02-prompt-engineering/FEW_SHOT_LIBRARY.md` (per condition)
- ✅ `02-prompt-engineering/PROMPT_GUARDRAILS.md` (input + output)
- ✅ `02-prompt-engineering/PROMPT_SANDBOX_UI.md` (admin test)
- ✅ Skill `nm-prompt-engineering`

### 2.2 Context Window Management
- ✅ `03-context/CONTEXT_WINDOW_MANAGER.md` (architecture)
- ✅ `03-context/HIERARCHICAL_MEMORY.md` (session → encounter → patient → cohort)
- ✅ `03-context/PATIENT_TIMELINE_API.md` (GET endpoint)
- ✅ `03-context/CONTEXT_BUDGET_CONFIG.yaml` (per dept, per role)

### 2.3 Workflow & Orchestration
- ✅ `04-workflow/LANGGRAPH_ORCHESTRATOR.md` (state machine)
- ✅ `04-workflow/CARE_PATHWAYS_LIBRARY.yaml` (50+ pathways as code)
- ✅ `04-workflow/TASK_SYSTEM_V2.md` (assigned, due-by, escalation)
- ✅ `04-workflow/MDR_MODULE.md` (multi-disciplinary rounds)

### 2.4 LangChain (Chaining)
- ✅ `05-langchain/UNIVERSAL_LANGCHAIN.md`
- ✅ `05-langchain/GUARDRAIL_CHAIN.md` (pre + post LLM)
- ✅ `05-langchain/MULTIMODAL_CHAIN.md`
- ✅ `05-langchain/CHAIN_REGISTRY.yaml`

### 2.5 VectorMine (Vector DB)
- ✅ `06-vector/PGVECTOR_DEPLOYMENT.md`
- ✅ `06-vector/SCHEMAS_PER_DEPT.md`
- ✅ `06-vector/HYBRID_RETRIEVAL.md` (vector + BM25 + graph)
- ✅ `06-vector/TERMINOLOGY_INDEX.md` (SNOMED + ICD + LOINC + RxNorm)
- ✅ `06-vector/EMBEDDING_SERVICE.md`

### 2.6 Backend / Logic
- ✅ `07-backend/HEXAGONAL_BASE.md` (per engine)
- ✅ `07-backend/EVENT_BUS_V2.md` (outbox + idempotency)
- ✅ `07-backend/BACKGROUND_JOBS.md` (BullMQ-compatible)

### 2.7 API (OpenAPI, GraphQL, gRPC)
- ✅ `08-api/OPENAPI_3_1_SPEC.md`
- ✅ `08-api/SMART_ON_FHIR.md` (OAuth2 + scopes)
- ✅ `08-api/API_VERSIONING_POLICY.md`
- ✅ `08-api/RATE_LIMITING_QUOTA.md`

### 2.8 Data & Storage
- ✅ `09-data/PGVECTOR_PROD_SETUP.md`
- ✅ `09-data/OUTBOX_PATTERN.md`
- ✅ `09-data/CDC_TABLES.md`
- ✅ `09-data/DATA_VAULT_2_0.md`

### 2.9 RAG
- ✅ `10-rag/UNIVERSAL_RAG_SERVICE.md`
- ✅ `10-rag/CITATION_ENGINE.md`
- ✅ `10-rag/PATIENT_GRAPH_RAG.md`
- ✅ `10-rag/KNOWLEDGE_GRAPH_SNOMED.md`

### 2.10 Frontend / UI-UX
- ✅ `11-frontend/STITCH_DESIGN_SYSTEM_V2.md`
- ✅ `11-frontend/CLINICAL_COMMAND_BAR.md` (Cmd+K)
- ✅ `11-frontend/CONVERSATIONAL_UI.md` (DAX-like)
- ✅ `11-frontend/MOBILE_APP_RN.md`

### 2.11 Digital Assets (Patient + Provider Portals)
- ✅ `12-digital-assets/PATIENT_PORTAL.md` (MyNama)
- ✅ `12-digital-assets/PROVIDER_MOBILE_APP.md`
- ✅ `12-digital-assets/TELEHEALTH.md`
- ✅ `12-digital-assets/PATIENT_ENGAGEMENT.md`

### 2.12 Infrastructure / DevOps
- ✅ `13-infra/TERRAFORM_MODULES.md`
- ✅ `13-infra/MULTI_REGION_FAILOVER.md`
- ✅ `13-infra/CHAOS_ENGINEERING.md`

### 2.13 CI/CD
- ✅ `14-cicd/FEATURE_FLAG_SERVICE.md`
- ✅ `14-cicd/AUTOMATED_MIGRATION_CI.md`
- ✅ `14-cicd/SIGNED_RELEASES_SBOM.md`

### 2.14 Testing & QA
- ✅ `15-testing/CLINICAL_SAFETY_SUITE.md`
- ✅ `15-testing/CROSS_TENANT_NEGATIVE_TESTS.md`
- ✅ `15-testing/CONTRACT_TESTS_PACT.md`
- ✅ `15-testing/E2E_NIGHTLY.md`

### 2.15 Business Flows (Care Pathways)
- ✅ `16-business/CARE_PATHWAYS_LIBRARY.yaml`
- ✅ `16-business/ORDER_SETS_LIBRARY.yaml`
- ✅ `16-business/CARE_PLANS_GOALS.md`
- ✅ `16-business/OUTCOME_DASHBOARDS.md`

### 2.16 Wireframes & Mockups
- ✅ `17-wireframes/DESIGN_TOKENS.yaml`
- ✅ `17-wireframes/STITCH_UI_LIBRARY.md`
- ✅ `17-wireframes/WIREFRAMES_PER_DEPT/` (4 pages × 100+ dept)
- ✅ `17-wireframes/COMPONENT_DOC.md` (Storybook-like)

---

## 3. الـ Cross-Cutting Areas (تُضاف لاحقاً لكل قسم)

| ID | المنطقة | الملف |
|----|---------|-------|
| **AuthN/AuthZ** | SSO + JWT + RBAC | `.ai-brain/99-upgrade/18-auth/SINGLE_SIGN_ON.md` + `JWT_STRATEGY.md` + `RBAC_MATRIX.yaml` |
| **Compliance (CBAHI/NPHIES/ZATCA/SFDA/PDPL/JCI)** | One-per-dept | `.ai-brain/99-upgrade/19-compliance/` |
| **Penetration Testing** | OWASP top 10 + HIPAA + tenant isolation | `.ai-brain/99-upgrade/20-pentest/` |
| **Helpdesk & Support System** | Zendesk-like | `.ai-brain/99-upgrade/21-helpdesk/` |
| **Go-to-Market Strategy** | KSA launch playbook | `.ai-brain/99-upgrade/22-gtm/` |
| **Budget & Token Cost** | per dept LLM cost | `.ai-brain/99-upgrade/23-budget/` |
| **APM & Logging** | Datadog-like | `.ai-brain/99-upgrade/24-apm/` |
| **User Analytics** | Mixpanel-like | `.ai-brain/99-upgrade/25-user-analytics/` |
| **LLM Observability** | Langfuse + Helicone | `.ai-brain/99-upgrade/26-llm-obs/` |
| **i18n Translation Files** | ar/en/fr/ur (RTL) | `.ai-brain/99-upgrade/27-i18n/` |
| **Style Guide / Design System** | Stitch v2 | `.ai-brain/99-upgrade/28-design-system/` |
| **Sample Data / Seeders** | dummy seeders per dept | `.ai-brain/99-upgrade/29-seeders/` |
| **Migration Scripts** | forward + reverse | `.ai-brain/99-upgrade/30-migrations/` |
| **User Manual** | AR + EN | `.ai-brain/99-upgrade/31-user-manual/` |
| **Training Videos** | scripts | `.ai-brain/99-upgrade/32-training/` |
| **Legal & Compliance Docs** | contracts, consents | `.ai-brain/99-upgrade/33-legal/` |
| **Project Management (Agile/Scrum)** | sprint plans, board | `.ai-brain/99-upgrade/34-pm/` |
| **Task Tracking** | Jira-like local | `.ai-brain/99-upgrade/35-tasks/` |

> **الصيغة**: كل ملف يتبع `nm-dept-blueprint-template-v2/SKILL.md` كنموذج مرجعي.

---

## 4. خطة الباتشات (Batch Plan)

### Batch 0: التأسيس (تم)
- [x] Global Systems Comparison
- [x] Master Upgrade Plan (هذا الملف)
- [ ] Token-saver skill pack
- [ ] Skill pack + Autopilot runner

### Batch 1: 60-File Templates for Tier-1 (20 dept)
- [ ] CARD-001 (✅ existing example)
- [ ] PULM-001, GI-001, NEPH-001, ONC-001, ENDO-001, ID-001, DERM-001, RHEUM-001
- [ ] ER-001, OBG-001, PEDS-001, SURG-001, NEURO-001, ORTHO-001, OPHTH-001, ENT-001, URO-001, ANES-001, ICU-001

### Batch 2: Tier-2 (40 dept × 40 ملف)
- Surgical subspecs, Internal Medicine subspecs, OBG/Peds subspecs, Radiology, Laboratory, Functional Tests

### Batch 3: Tier-3 (40 dept × 25 ملف)
- Rehabilitation, Oncology Therapeutics, Integrative Medicine, Support Services, Admin & Academic

### Batch 4: Tier-4 (20 dept × 15 ملف)
- Rare & Super-Specialized

### Batch 5: Cross-cutting implementations
- Patient Portal, Provider Mobile, RAG Service, Prompt Registry, Feature Flags
- Code-level: real implementations in `namaweb/`

---

## 5. Acceptance Criteria (لكل ملف)

1. ✅ **Self-documenting** — README في أول سطر
2. ✅ **References** — يستخدم `$ref: <id>` بدل التكرار
3. ✅ **Safety rails مذكورة** — 13 rails
4. ✅ **Compliance mapped** — CBAHI + NPHIES + PDPL + JCI (where applicable)
5. ✅ **Test cases** — on كل critical path
6. ✅ **i18n keys** — ar + en
7. ✅ **Design tokens** — no hardcoded colors
8. ✅ **Error paths** — fail-safe (never skip)
9. ✅ **Citations** — every clinical fact
10. ✅ **No PHI** — placeholder data only

---

## 6. أصحاب المصلحة (Stakeholders)

| Owner | Role | Deliverables |
|-------|------|--------------|
| **CMO (Dr. Sarah Chen)** | clinical | clinical workflows, red flags, drug safety, care pathways |
| **AIE (Marcus Patel)** | AI | prompt, context, RAG, vector, langchain |
| **SA (Elena Volkov)** | architecture | API, ERD, microservices, frontend arch |
| **DSL (Ahmed Hassan)** | infra + security | CI/CD, deploy, infra, security, threat model |
| **PM (Priya Sharma)** | product | stories, wireframes, accessibility, i18n |
| **CQO (Omar Al-Rashid)** | compliance | JCI, ISO, NPHIES, ZATCA, PDPL, audit |
| **ORC** | synthesis | token discipline, gate enforcement, closeout |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token explosion in batch mode | Medium | Skill pack + S1-S8 + snippets |
| Schema conflicts | High | Validators + migration review per dept |
| PHI leakage to LLM | HIGH (compliance) | Tenant-aware RAG + redaction + no logs |
| Cross-tenant bleed | HIGH | Defense-in-depth tests |
| RBAC bypass | HIGH | RBAC matrix audit every sprint |
| LLM hallucination | HIGH | Citation-first + red-flag rules + supervisor LLM |
| ZATCA CSID blocked | Medium | Mock + ready for real credentials |
| Production deploy mid-build | HIGH | AUTOPILOT gate halts on deploy attempts |

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Departments with full 60-file blueprint | 120 / 120 |
| Code-level impl of Tier-1 dept | 20 / 20 |
| Patient portal MVP | LIVE |
| Mobile app MVP | LIVE |
| RAG service in prod | LIVE |
| pgvector in prod | LIVE |
| Token savings per dept | 60-70% |
| Total files in `.ai-brain/` | +4,100 |
| Build & test commands | All passing |

---

> **Owner approval needed before Phase B (live code in `namaweb/`).**
> **Default AUTOPILOT signal = continue without stopping (per user's direct instruction).**

*ORC — 2026-08-01 — Phase P3-C Skills v2 enhancement + Global Upgrade*
