# NamaMedical — Master Blueprint
## بوابة المستشفى الشاملة + التطبيق المكتبي (Qt) + الأنظمة الفرعية

> هذه الوثيقة هي **المرجع الموحّد** لكل ما هو جاهز اليوم في المشروع، و**القالب القابل لإعادة الاستخدام** لكل قسم طبي (200+ قسم وحدة فرعية). تتجاهل أي تقييمات/فحوصات سابقة وتنطلق من فحص الكود الفعلي (2026-05-13).
>
> تتكون من ثلاثة أجزاء:
> - **القسم أ:** جرد الواقع الحالي (Inventory)
> - **القسم ب:** قالب موحّد لأي قسم طبي — Prompt + Scenario + Data Flow + كل المخرجات المطلوبة
> - **القسم ج:** Instantiations لكل المجموعات العشر الكبرى (مع روابط لملفات منفصلة لكل قسم فرعي)

---

## القسم أ — جرد التطبيق الحالي (Reality Audit)

### أ-1. بوابة الويب `AppServerPortal/`
- **index.html** — RTL، Tajawal/Inter/Orbitron، RemixIcon، شريط حالة + رأس + سايدبار + شبكة بطاقات
- **data.js** — `servicesData[]` (41 خدمة فعلية) + `categoriesConfig{}` (8 فئات)
- **script.js** — منطق العرض/البحث/التبديل (159 سطر)
- **style.css** — Dark Medical theme (470 سطر)

**الفئات النشطة:** `all, erp, clinical, hr, quality, radiology, moh, it, admin`
**الخدمات الموجودة فعلياً:**
1. clinical (7): Medical Report, LAB Inventory, Wasfaty, REFERRALS, Medication Errors, Mortality, IBM Micromedex
2. hr (6): Mawared, Mudeeri, Hudoor, Doctors Privileges (+Admin), Daily Rotations
3. quality (4): OVR, OPS Rounds, Core Standards, Risk Minimization
4. it (5): IT Orientation, MOH Reset, Domain Zone, Card System, Master DB
5. radiology (3): NNCH PACS, Cardiac PACS, BADER PACS
6. moh (9): MOH Unified, Updates, Email, Mawid, Seha, ANAT, Shahm, BAIN, Transformation
7. admin (7): Policies, Forms, Phone Dir, Intranet, Archiving, Job Cards, OASIS+
8. erp (19): Dashboard, Reception, Appointments, Doctor Station, Lab, Radiology, Pharmacy, Finance, Emergency, Nursing, Surgery&OR, Bed Mgmt, ZATCA, Blood Bank, ICU, Telemedicine, Reports, Settings + Login

### أ-2. التطبيق المكتبي Qt/C++ (تمت إزالته وإيقافه - Deprecated & Removed)
- **ملاحظة**: تم تحويل النظام بالكامل ليكون **Web-Only**، وتمت إزالة الأصول المكتبية التابعة للـ Qt/C++ (بما فيها `main.cpp` و `mainwindow.cpp` و `database.h` و `CMakeLists.txt` وغيرها) من مستودع الكود لتبسيط بيئة التطوير والاعتماد الكامل على بوابة الويب الحديثة.

**جداول قاعدة البيانات الجاهزة (50+):**
```
patients, invoices, insurance_companies, insurance_policies, medical_records,
medications, dental_records, lab_results, lab_samples,
pharmacy_prescriptions_queue, pharmacy_suppliers, pharmacy_sales,
pharmacy_purchase_items, pharmacy_opening_balances,
finance_fiscal_years, finance_cost_centers, finance_doctor_commissions, finance_vouchers,
hr_leaves, hr_advances, hr_employee_documents, hr_employee_custody,
inventory_items, inventory_opening_balances, inventory_purchase_items,
inventory_issue_to_dept, inventory_issue_items, inventory_stock_count,
form_templates, internal_messages, packages, package_sessions,
online_bookings, user_permissions, doctor_inventory_requests, doctor_inventory_request_items,
integration_settings, company_settings, hospital_inventory, drugs, system_users
```

**صفحات ERP (58 صفحة بفهرس Hash - متوفرة في بوابة الويب):**
0=Dashboard, 1=Reception, 2=Appointments, 3=Doctor, 4=Lab, 5=Radiology, 6=Pharmacy, 7=HR,
8=Finance, 9=Insurance, 10=Inventory, 11=Nursing, 12=Queue, 13=PatientAccounts, 14=Reports,
15=Messaging, 16=Catalog, 17=DeptRequests, 18=Surgery, 19=BloodBank, 20=ConsentForms,
21=Emergency, 22=Inpatient, 23=ICU, 24=CSSD, 25=Dietary, 26=InfectionControl, 27=Quality,
28=Maintenance, 29=Transport, 30=MedicalRecords, 31=ClinicalPharmacy, 32=Rehab, 33=PatientPortal,
34=ZATCA, 35=Telemedicine, 36=Pathology, 37=SocialWork, 38=Mortuary, 39=CME, 40=Cosmetic,
41=OBGYN, 42=Settings, 43=Consultation, 44=Referral, 45=NPHIES, 46=Waseel, 47=Wasfaty,
48=Yaqeen, 49=Mawid, 50=Sehhaty, 51=CBAHI, 52=BedMgmt, 53=Analytics, 54=ORSchedule,
55=Roles, 56=AuditTrail, 57=Branches

### أ-3. الفجوة بين الواقع والمطلوب
- **مكوّن AI / RAG**: غير موجود (لا LangChain، لا Vector DB، لا System Prompts)
- **OpenAPI specs**: غير موجودة
- **CI/CD**: لا توجد GitHub Actions/pipelines
- **Unit/Integration tests**: لا توجد
- **i18n**: نصوص ثنائية تُمرَّر يدوياً عبر `tr2(en, ar)` بدل ملفات JSON
- **ERD رسمي / Architecture Doc / Security Plan / Deployment Plan**: غير موثقة
- **User Manuals / Training**: غير موجودة

---

## القسم ب — القالب الموحّد لأي قسم طبي

> هذا قالب قابل للتعبئة بالاسم Cardiology / Pulmonology / IVF / Burn-ICU / …إلخ. **15** مخرَج معياري لكل قسم.

### ب-1. Prompt Engineering Pack (قالب جاهز)

#### ب-1-أ. System Prompt (نموذج)
```text
You are NamaMedical-{{DEPT_KEY}} Assistant, an AI co-pilot embedded inside the
{{DEPT_NAME_EN}} ({{DEPT_NAME_AR}}) module of NamaMedical Hospital ERP.

ROLE:
- Help {{ROLES}} ({{ROLES_AR}}) execute clinical & administrative tasks.
- Always speak the user's UI language (ar / en).
- Cite the patient MRN + visit ID in every clinical answer.
- Never hallucinate doses, ICD-10/SNOMED codes, or lab reference ranges; fetch from RAG.

ALLOWED ACTIONS (function-calling tools):
- search_patient(mrn|name|nationalId)
- get_lab_result(patient_id, panel)
- get_radiology(patient_id, modality)
- create_order(type, items[], priority)
- write_note(patient_id, soap_json)
- check_drug_interaction(drug_list[])
- pull_protocol(condition_code)   → RAG over guidelines
- escalate_to_human(reason)

CONSTRAINTS:
- Reject any request to write a prescription without an active visit + doctor sign-off.
- Mask PII when exporting (only show last 4 of nationalId).
- If confidence < 0.7 OR safety-critical → escalate_to_human.

STYLE:
- Concise. Bullet > prose. SOAP for clinical notes. SBAR for handover.
- Arabic medical terms keep their English in parentheses on first mention.
```

#### ب-1-ب. Context Pack (يُحقَن مع كل طلب)
```yaml
patient: { mrn, age, sex, allergies[], active_problems[], current_meds[] }
visit:   { id, type: opd|er|ipd, doctor_id, started_at }
dept:    { key: "{{DEPT_KEY}}", subspecialty, ward_id }
policy:  { facility_code, language, ksa_pdpl: true, hipaa: false }
top_k_rag: 5 chunks from `guidelines_{{DEPT_KEY}}`, `local_sop`, `formulary`
```

#### ب-1-ج. Prompt Engineering Rules
- **CoT داخلي مخفي** (لا يظهر للمستخدم) — التفكير بصمت ثم إخراج النتيجة.
- **Few-shot** ≤ 3 أمثلة سريرية لكل intent.
- **Self-critique pass**: قبل الإرجاع، يسأل النموذج نفسه "هل الجرعة آمنة لـ eGFR هذا؟ هل هناك تعارض؟".
- **Token budget**: 8K للسؤال + 4K للسياق + 2K للجواب.

---

### ب-2. Workflow & Orchestration

#### ب-2-أ. LangChain / LangGraph Topology
```
                   ┌─────────────┐
   user / UI ─────▶│  Router LLM │──┐
                   └─────────────┘  │
                                    ▼
        ┌───────────────────────────────────────────┐
        │           LangGraph StateGraph            │
        │   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  │
        │   │intent│─▶│ tool │─▶│ RAG  │─▶│verify│  │
        │   └──────┘  └──────┘  └──────┘  └──────┘  │
        └───────────────────────────────────────────┘
              │             │            │
              ▼             ▼            ▼
        ERP REST API   Vector DB     Drug-Drug API
```

#### ب-2-ب. Chaining patterns
- **Sequential**: triage → labs-needed → order-set → consent → handover
- **Map-reduce**: each lab panel summarized in parallel → merged report
- **Re-entrant**: nurse vitals every 4h → trigger re-summarization

#### ب-2-ج. VectorMine / Pipeline tooling
- استخدم `VectorMine` لاستخراج: (ICD-10, SNOMED, LOINC, RxNorm) من نصوص الأطباء الحرة قبل التخزين.
- يُغذي Vector DB بـ embeddings (1536-dim, `text-embedding-3-large`) + metadata structured.

---

### ب-3. Backend / Logic — API

#### ب-3-أ. Endpoints (REST + OpenAPI 3.1)
```yaml
/api/v1/{{dept_key}}/patients               GET, POST
/api/v1/{{dept_key}}/patients/{id}          GET, PATCH, DELETE
/api/v1/{{dept_key}}/orders                 GET, POST
/api/v1/{{dept_key}}/orders/{id}/status     PATCH
/api/v1/{{dept_key}}/results                GET
/api/v1/{{dept_key}}/notes                  POST
/api/v1/{{dept_key}}/handover               POST
/api/v1/{{dept_key}}/ai/ask                 POST   # AI co-pilot
/api/v1/{{dept_key}}/ai/explain/{result_id} GET
/api/v1/{{dept_key}}/audit                  GET    # immutable trail
```
- Auth: OAuth2 + JWT (RS256) + per-role scopes
- Rate-limit: 60 r/m / user, 600 r/m / facility
- Idempotency-Key header إلزامي على POST

#### ب-3-ب. Architecture
- FastAPI (Python 3.12) للـ AI/RAG endpoints
- ASP.NET Core أو Node/NestJS للـ CRUD الحالي (متوافق مع SQL Server backend)
- Message bus: RabbitMQ / Kafka (events: `order.created`, `lab.result.ready`, `bed.released`)

---

### ب-4. Data & Storage

#### ب-4-أ. Relational (موجود + إضافات)
- Engine: SQL Server (server-side) + SQLite (offline desktop)
- Partition by `facility_id` + monthly partitions on `visits`, `lab_results`, `radiology_reports`
- Audit table: `audit_log(actor, action, entity, before, after, ts)` — append-only

#### ب-4-ب. Vector Database (مفقود — مطلوب إضافته)
- اختيار: **Qdrant** (self-hosted, KSA data residency) أو **pgvector** (لو نريد التوحيد مع SQL)
- Collections:
  - `kb_guidelines_{{dept_key}}` (NICE, UpToDate-style references)
  - `kb_local_sop_{{dept_key}}` (الإجراءات المعتمدة محلياً)
  - `kb_drug_formulary`
  - `kb_patient_history_{{patient_id}}` (per-patient memory, expires after 2y)

#### ب-4-ج. RAG Pipeline
```
upload PDF/DOCX ─▶ Unstructured.io ─▶ chunk(800 tok, 80 overlap)
                                         │
                                         ▼
                              embed (3-large) ─▶ Qdrant
                                         │
query ─▶ rewrite ─▶ hybrid search (bm25 + vector) ─▶ rerank (Cohere/bge)
        ─▶ top-5 chunks ─▶ context window ─▶ LLM answer + citations
```

---

### ب-5. Frontend / UI-UX

#### ب-5-أ. Stack
- React 19 + Vite + TypeScript / Or Qt-Quick (للنسخة المكتبية)
- TanStack Query + Zustand
- shadcn/ui + Tailwind (dark medical preset متوافق مع `style.css` الحالي)
- RemixIcon (موجود) + Tabler للأيقونات الطبية

#### ب-5-ب. Component inventory (لكل قسم)
| Component        | Purpose                                           |
|------------------|---------------------------------------------------|
| `<PatientHeader>`| MRN, allergies, vitals strip                      |
| `<OrderSheet>`   | Multi-select labs/rad/meds + priority             |
| `<ResultsTable>` | Reference range coloring, deltas                  |
| `<AINotePad>`    | Live SOAP via streaming                           |
| `<ConsentForm>`  | E-signature + Arabic/English toggle               |
| `<BedMap>`       | Visual ward layout, drag-and-drop                 |
| `<HandoverSBAR>` | Generated SBAR card                               |

#### ب-5-ج. Assets / Imagery
- مصادر مرخّصة: **Shutterstock Medical**, Unsplash medical, Iconfinder
- أي صورة سريرية حقيقية → blur PII + موافقة + watermark "training-use"

---

### ب-6. Infrastructure / DevOps

#### ب-6-أ. CI/CD pipeline (GitHub Actions)
```yaml
.github/workflows/main.yml:
  on: [push, pull_request]
  jobs:
    lint:    eslint + ruff + clang-tidy
    test:    pytest + jest + Qt qmltest
    build:   docker buildx → ghcr.io
    scan:    trivy (image) + gitleaks (secrets) + dependabot
    deploy:
      staging:  on push main → k3s @ Hetzner
      prod:     on tag v* → blue-green, manual approval
```

#### ب-6-ب. Environments
| Env       | Host             | DB             | Purpose       |
|-----------|------------------|----------------|---------------|
| dev       | docker-compose   | SQLite         | local         |
| staging   | Hetzner CX31     | MSSQL 2022     | QA            |
| prod      | Hetzner AX42 ×3  | MSSQL HA + Q   | live          |

#### ب-6-ج. Observability
- Logs: Loki + Grafana
- Metrics: Prometheus + Grafana
- Tracing: OpenTelemetry → Tempo
- Alerts: PagerDuty (sev1 = patient-safety)

---

### ب-7. Testing & QA

#### ب-7-أ. Unit testing
- C++/Qt: `QTest` لكل `*Page` صف
- Python: `pytest` + `pytest-asyncio` + `respx`
- Coverage gate: ≥ 75%

#### ب-7-ب. Integration testing
- Testcontainers (MSSQL + Qdrant + Redis)
- Golden-file tests للـ AI responses (snapshot + similarity ≥ 0.92)
- Contract tests (Pact) بين Frontend ↔ API

#### ب-7-ج. Manual QA scripts
- Smoke: login → search patient → create order → result back → bill → ZATCA invoice
- Regression matrix per role (Doctor/Nurse/Lab/Pharm/Admin)

---

### ب-8. مخرجات إضافية (لكل قسم)

#### ب-8-أ. Wireframes & Mockups
- Figma library: `NamaMedical-DS` — كل قسم له Frame منفصل
- Naming: `dept-{{key}}-{{screen-name}}@1x` / `@2x`
- صور خام من Shutterstock معتمدة فقط

#### ب-8-ب. Business Flows (BPMN 2.0)
- استخدم Camunda Modeler
- ملف لكل قسم: `flows/{{dept_key}}.bpmn`

#### ب-8-ج. Database ERD
- DbDiagram.io → `erd/{{dept_key}}.dbml`
- علاقات أساسية: `patients 1—N visits 1—N orders 1—N results`

#### ب-8-د. API Specifications (OpenAPI 3.1)
- ملف لكل قسم: `openapi/{{dept_key}}.yaml`
- يُولَّد منه SDK تلقائياً (TS + Python + C++)

#### ب-8-هـ. User Stories & Acceptance Criteria (Gherkin)
```gherkin
Feature: {{DEPT_NAME_EN}} — Place lab order
  Scenario: Doctor orders CBC for admitted patient
    Given a doctor logged in with role "Physician"
    And patient "MRN-12345" is admitted to ward "{{DEPT_KEY}}-W1"
    When the doctor selects "CBC" + priority "STAT" and submits
    Then an order is created with status "Requested"
    And the lab module receives a real-time event
    And the patient bill is updated with the lab fee
    And an audit row is appended within 200ms
```

#### ب-8-و. Test Cases & Test Plan
- Master sheet `tests/{{dept_key}}_test_matrix.xlsx`
- أعمدة: TC-ID | Title | Priority | Steps | Expected | Linked-Req | Status

#### ب-8-ز. Architecture Document (C4 model)
- Context → Containers → Components → Code
- `arch/{{dept_key}}.c4.puml`

#### ب-8-ح. Security Plan
- Threat model: STRIDE
- Controls: PDPL (السعودي) + إيزو 27799 (Health) + CBAHI
- إخفاء PII، تشفير at-rest (TDE) + in-transit (TLS 1.3)
- Pen-test سنوي + bug bounty

#### ب-8-ط. Deployment Plan
- Blue/Green مع smoke-tests
- Roll-back script ≤ 5 دقائق
- Maintenance window: الجمعة 02:00–04:00 KSA

#### ب-8-ي. Style Guide / Design System
- ملف رئيسي `design-system/tokens.json`
- Colors: primary `#00d4ff`, success `#00e5a0`, danger `#ef4444`, dark-bg `#0a0e1a`
- Type: Tajawal (ar) / Inter (en) / Orbitron (display)
- Spacing: 4/8/12/16/24/32/48/64
- Radius: 6 / 12 / 24

#### ب-8-ك. i18n Translation Files
- `i18n/ar.json`, `i18n/en.json` (و قابل للتوسعة `ur`, `fr`, `tl`)
- مفاتيح بصيغة `dept.{{key}}.screen.element`
- إلزامي: نص طبي يُترجَم بمعجم منضبط (UMLS-Arabic)

#### ب-8-ل. Sample Data / Seeders
- `seeders/{{dept_key}}_seed.sql` — 50 مريض + 200 طلب + 500 نتيجة
- مولّد PII اصطناعي 100% (`Faker` + قائمة أسماء سعودية)

#### ب-8-م. Migration Scripts
- Alembic (Python) للـ FastAPI / EF Core للـ .NET
- One-way forward only في الإنتاج (rollback via snapshot)

#### ب-8-ن. User Manual
- `docs/manuals/{{dept_key}}_user_manual_ar.pdf` (و en)
- لقطات شاشة + خطوات مرقَّمة + FAQ + مكان شكوى

#### ب-8-س. Training Videos
- Loom / Camtasia ≤ 5 دقائق لكل سيناريو
- مسار: مقدمة (30s) → عرض شاشة (3m) → اختبار قصير → مرجع

#### ب-8-ع. Legal & Compliance Docs
- اتفاقية معالجة بيانات (DPA) — بصيغة PDPL السعودي
- نموذج موافقة مريض (ar + en) — متطابق مع CBAHI
- سياسة الاحتفاظ بالبيانات (10 سنوات للسجل الطبي، 25 للأطفال)
- تسجيل الأنشطة وفق MoH-eHealth standards

---

## القسم ج — Instantiation per Group

> لكل مجموعة (من 1 إلى 38) ملف فرعي تحت `docs/groups/`. أدناه فهرس + خصوصيات كل مجموعة.

### G01. القلب والأوعية الدموية → `docs/groups/01_cardiology.md`
- AI tools خاصة: `interpret_ecg`, `triage_chest_pain (HEART-score)`, `risk_calc_grace`
- جداول إضافية: `cath_lab_cases`, `echo_studies`, `device_implants`, `cardiac_rehab`
- RAG corpus: ESC/AHA guidelines + protocols + drug formulary (anticoag)
- مكاملة: Cardiac PACS الموجودة بالفعل

### G02. الجهاز التنفسي → `docs/groups/02_pulmonology.md`
- AI: `pft_interpreter`, `sleep_apnea_screening (STOP-BANG)`
- جداول: `pft_results`, `bronchoscopy_logs`, `sleep_studies`, `home_oxygen_rentals`

### G03. الجهاز الهضمي والكبد → `docs/groups/03_gastro_hepato.md`
- AI: `endoscopy_image_caption`, `meld_score`, `hcv_treatment_selector`
- جداول: `endoscopy_reports`, `ercp_logs`, `liver_biopsies`, `motility_studies`

### G04. الكلى → `docs/groups/04_nephrology.md`
- AI: `dialysis_adequacy (Kt/V)`, `egfr_calc`, `aki_predictor`
- جداول: `dialysis_sessions`, `transplant_workups`, `pd_logs`

### G05. الدم والأورام → `docs/groups/05_hemato_oncology.md`
- AI: `chemo_protocol_picker`, `pain_scale_tracker`, `bmt_donor_matcher`
- جداول: `chemo_regimens`, `bmt_cases`, `tumor_board_decisions`, `radiation_courses`

### G06. السكري والغدد والاستقلاب → `docs/groups/06_endocrine_diabetes.md`
- AI: `insulin_titrator`, `hba1c_trend`, `obesity_meds_recommender`
- جداول: `glucose_logs`, `cgm_streams`, `thyroid_workups`, `diabetic_foot_exams`

### G07. الروماتيزم والمناعة → `docs/groups/07_rheum_immunology.md`
- AI: `das28_calc`, `biologics_selector`, `lupus_renal_flare`
- جداول: `rheum_panels`, `biologics_administration`

### G08. الأمراض المعدية → `docs/groups/08_infectious_diseases.md`
- AI: `antibiotic_steward (de-escalation)`, `outbreak_detector`, `travel_risk_assess`
- جداول: `cultures_with_sensitivities`, `outbreaks`, `vaccinations`, `travel_clinic`

### G09. الجلدية → `docs/groups/09_dermatology.md`
- AI: `lesion_image_triage`, `mohs_planner`
- جداول: `derm_photos`, `phototherapy_sessions`, `cosmetic_procedures`

### G10. الجراحة العامة → `docs/groups/10_general_surgery.md`
- AI: `surgical_risk (P-POSSUM)`, `eras_checklist`, `consent_explainer`
- جداول: `or_schedules`, `surgical_counts`, `implants_used`, `eras_pathways`

### G11. القلب-صدر-أوعية الجراحية → `docs/groups/11_cts_vascular_surgery.md`
- AI: `sts_score`, `euroscore_ii`, `endograft_planner`

### G12. مخ وأعصاب وعمود فقري → `docs/groups/12_neurosurgery_spine.md`
- AI: `gcs_tracker`, `tumor_resection_planner`, `dbs_target_planner`

### G13. العظام والمفاصل → `docs/groups/13_orthopedics.md`
- AI: `fracture_classifier_xr`, `joint_replacement_picker`, `sports_return_protocol`

### G14. العيون → `docs/groups/14_ophthalmology.md`
- AI: `oct_segmentation`, `iol_calc (Barrett)`, `dr_grader`
- جداول: `oct_scans`, `visual_fields`, `iol_inventory`, `cornea_bank`

### G15. الأنف والأذن والحنجرة → `docs/groups/15_ent.md`
- AI: `audiogram_interp`, `nasal_endoscopy_summary`

### G16. المسالك البولية → `docs/groups/16_urology.md`
- AI: `psa_velocity`, `stone_recurrence_risk`, `urodynamics_interp`

### G17. التجميل والحروق → `docs/groups/17_plastic_burns.md`
- AI: `tbsa_calc`, `parkland_fluid`, `flap_planner`

### G18. النساء والتوليد → `docs/groups/18_obgyn.md`
- AI: `fetal_growth_curve`, `preeclampsia_risk`, `ivf_protocol_picker`
- جداول: `ivf_cycles`, `embryos`, `cryostore`, `cs_logs`

### G19. حديثي الولادة والأطفال → `docs/groups/19_neonatal_pediatrics.md`
- AI: `bilirubin_nomogram`, `apgar_tracker`, `growth_chart_who`
- جداول: `nicu_admissions`, `respiratory_support_logs`

### G20. التخصصات الدقيقة للأطفال → `docs/groups/20_pediatric_subspec.md`
- AI: `pediatric_dose_calc (mg/kg)`, `congenital_heart_classifier`

### G21. الأشعة والتصوير → `docs/groups/21_radiology_imaging.md`
- AI: `xr_chest_findings`, `ct_stroke_aspects`, `mri_lesion_segmentation`
- مكاملة: PACS الموجود (NNCH/Cardiac/BADER)

### G22. المختبرات → `docs/groups/22_laboratories.md`
- AI: `delta_check`, `antimicrobial_susceptibility_interpreter`, `pap_smear_triage`
- جداول: `lab_panels`, `microbiology_cultures`, `cytogenetics`, `blood_bank_units`

### G23. الفحوصات الوظيفية → `docs/groups/23_functional_diagnostics.md`
- AI: `holter_ai_review`, `eeg_seizure_detection`, `emg_pattern_classify`

### G24. الطوارئ → `docs/groups/24_emergency_department.md`
- AI: `ctas_triage`, `stroke_code_router`, `sepsis_early_warning (qSOFA/NEWS2)`

### G25. العناية المركزة → `docs/groups/25_intensive_care.md`
- AI: `apache_ii`, `sofa_trend`, `vent_settings_recommender`, `early_extubation_predictor`

### G26. التخدير والألم → `docs/groups/26_anesthesia_pain.md`
- AI: `asa_classifier`, `pca_dosing`, `nerve_block_planner`

### G27. العلاج الطبيعي والتأهيل → `docs/groups/27_rehab_pt.md`
- AI: `gait_video_analysis`, `rehab_progress_predictor`

### G28. الأورام العلاجية والصيدلية → `docs/groups/28_radiation_pharmacy.md`
- AI: `chemo_dose_check`, `radiotherapy_dose_volume_check`

### G29. الطب التكميلي → `docs/groups/29_integrative_medicine.md`
- AI: `tcm_pattern_match`, `acupuncture_point_planner` (مع تحذير: غير مفعّلة بالـ default)

### G30. التمريض → `docs/groups/30_nursing.md`
- AI: `careplan_generator`, `pressure_ulcer_predictor (Braden)`, `falls_risk (Morse)`

### G31. التغذية → `docs/groups/31_nutrition.md`
- AI: `tpn_calculator`, `dietary_recommendation_ai`

### G32. الخدمة الاجتماعية → `docs/groups/32_social_psych.md`
- AI: `discharge_planner`, `social_risk_classifier`

### G33. اللوجستية والفنية → `docs/groups/33_logistics_it.md`
- AI: `bme_maintenance_predictor`, `pacs_storage_optimizer`

### G34. الأمن والسلامة → `docs/groups/34_security_safety.md`
- AI: `incident_classifier`, `mass_casualty_drill_simulator`

### G35. الإدارة التنفيذية → `docs/groups/35_executive.md`
- AI dashboards: throughput, LOS, readmission, NPS, financial KPIs

### G36. الجودة والاعتماد → `docs/groups/36_quality_accreditation.md`
- AI: `cbahi_gap_scanner`, `audit_finding_summarizer`

### G37. التعليم والبحث → `docs/groups/37_education_research.md`
- AI: `cme_curriculum_builder`, `clinical_trial_eligibility_matcher`

### G38. الموارد البشرية → `docs/groups/38_hr_admin.md`
- AI: `shift_optimizer`, `recruitment_screener`

### G39. مراكز التميز → `docs/groups/39_centers_of_excellence.md`
- تجميع cross-department dashboards + KPIs

### G40. النادر والمتقدم → `docs/groups/40_rare_advanced.md`
- AI: `fetal_surgery_planner`, `stem_cell_donor_match`, `pharmacogenomics_advisor`, `dbs_programming_assistant`

---

## ملخص المخرجات لكل قسم (Deliverables Checklist)
لكل قسم/مجموعة يجب وجود **15 ملف** بالحد الأدنى:

- [ ] `prompts/{{dept}}_system.md` — System Prompt
- [ ] `prompts/{{dept}}_context.yaml` — Context Pack
- [ ] `flows/{{dept}}.bpmn` — Business Flow
- [ ] `flows/{{dept}}_langgraph.py` — Orchestration code
- [ ] `openapi/{{dept}}.yaml` — API spec
- [ ] `erd/{{dept}}.dbml` — Database ERD
- [ ] `arch/{{dept}}.c4.puml` — Architecture
- [ ] `wireframes/{{dept}}/*.fig` — UI mockups
- [ ] `tests/{{dept}}_test_plan.md` — Test plan
- [ ] `seeders/{{dept}}_seed.sql` — Sample data
- [ ] `migrations/{{dept}}/V001__init.sql` — Migration
- [ ] `i18n/{{dept}}.ar.json` + `.en.json` — Translations
- [ ] `security/{{dept}}_threat_model.md` — STRIDE
- [ ] `manuals/{{dept}}_user_manual.md` (+ PDF) — User manual
- [ ] `legal/{{dept}}_compliance.md` — PDPL/CBAHI/HIPAA mapping

---

## خارطة الطريق المقترحة (6 أشهر)

| Sprint | الهدف                                                       | Owner      |
|--------|-------------------------------------------------------------|------------|
| 0      | اعتماد القالب + إعداد monorepo + CI/CD skeleton             | Platform   |
| 1      | تنفيذ G24 (ED) + G25 (ICU) — أعلى أثر سريري                 | Clinical   |
| 2      | G21 (Radiology AI) + ربط PACS                               | Imaging    |
| 3      | G22 (Lab) + Vector DB + RAG                                 | Data       |
| 4      | G01 (Cardio) + G14 (Eye) + G18 (OB-GYN)                     | Specialty  |
| 5      | G35–G38 (Admin/Quality/Edu/HR)                              | Admin      |
| 6      | G39 (Centers of Excellence) + Public release                | All        |

---

**نهاية الوثيقة الرئيسية. ملفات المجموعات الفرعية تحت `docs/groups/` تحتوي على Prompt + Scenario + Data Flow الخاصة بكل قسم.**
