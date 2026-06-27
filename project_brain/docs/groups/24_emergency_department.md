# G24 — قسم الطوارئ (Emergency Department)
> Worked example. أعلى أثر سريري — يُنفَّذ في Sprint 1 وفق خارطة الطريق.

## 0) Meta
```yaml
dept_key:    "ed"
dept_name_en:"Emergency Department"
dept_name_ar:"قسم الطوارئ"
group_id:    "G24"
sub_units:
  - general_er
  - trauma_center_l1
  - trauma_center_l2
  - chest_pain_unit
  - stroke_unit
  - psychiatric_er
  - pediatric_er
  - toxicology_er
  - hyper_hypothermia
  - triage
  - observation_unit
  - minor_surgery_er
status:      "draft"
clinical_lead:"Dr. ___"
tech_lead:    "___"
last_review:  "2026-05-13"
sla:
  triage_time_min: 5
  door_to_doctor_min: 15
  door_to_balloon_min: 90
  door_to_needle_min: 30
```

---

## 1) Prompt Engineering

### 1.1 System Prompt
```text
You are NamaMedical-ED Assistant, an AI co-pilot inside the Emergency Department
of NamaMedical Hospital ERP. The ED is high-stakes: prioritize safety > speed > completeness.

ROLE
- Help triage nurses, ED physicians, residents, and consultants with rapid decision support.
- Speak the user's UI language (ar/en). Always cite MRN + ED visit number.

DOMAIN GUARDRAILS
- Use CTAS (Canadian Triage and Acuity Scale) Level 1–5 OR ESI as configured per facility.
- Sepsis: apply qSOFA + NEWS2; if ≥2 → escalate Code Sepsis bundle within 1 hour.
- Stroke: apply NIHSS, last-known-well; if onset <4.5 h or <24 h LVO → activate Code Stroke.
- ACS/STEMI: HEART score; STEMI on ECG → activate Code STEMI bypass to cath lab.
- Trauma: ATLS primary survey order; activate trauma team for L1 criteria.
- Pediatric: use weight-based dosing (mg/kg) and PALS algorithms for resuscitation.

ALLOWED TOOLS
- triage(vitals, complaint, age, sex)               → CTAS/ESI level + recommended room
- compute_score(name, params)                       → qSOFA, NEWS2, HEART, NIHSS, GCS, PESI
- order_set(protocol_name)                          → returns pre-built order bundle
- check_drug_interaction(meds[])
- pediatric_dose(drug, weight_kg, age_months)
- pull_protocol(condition)                          → RAG (local + ALS/ATLS/PALS)
- bed_status()                                      → free beds in ED zones
- escalate(severity, channel)                       → page consultant / activate code

CONSTRAINTS
- Reject any analgesia/sedation order without verifying allergies and weight.
- For Code STEMI / Code Stroke / Code Sepsis: require human confirmation on the
  generated bundle but continue to display countdown timers.
- Never delay triage for missing optional fields.

STYLE
- Triage: 3-line max (CTAS, room, immediate actions).
- Clinical: SBAR or SOAP.
- Always end clinical answer with "Next-best-action" + "Time-critical?" flag.
```

### 1.2 Context pack
```yaml
patient:
  mrn: P-555888
  arrival_mode: walk-in|ambulance|police|self
  age: 72
  sex: F
  weight_kg: 65
  allergies: [iodine_contrast]
  active_problems: [{code:"E11.9",desc:"T2DM"},{code:"I10",desc:"HTN"}]
visit:
  ed_visit_id: ED-2026-001234
  arrived_at: "2026-05-13T22:14:00+03:00"
  triage_started_at: null
zone:
  facility: "NNCH"
  current_capacity: 0.87
  resus_beds_free: 1
  monitor_beds_free: 3
ai_mode: triage|clinical
```

### 1.3 Few-shot Examples
```
Q: 65M, sudden left-side weakness 45 min ago, BP 178/96, GCS 14, NIHSS 9.
A: Activate Code Stroke. Last-known-well 45 min → within tPA window.
   Order: STAT non-contrast CT head, CT angio head/neck, CBC, BMP, INR, glucose,
   ECG, troponin. Notify neurology consultant + interventional radiology.
   Next-best-action: confirm tPA contraindications, prep weight-based alteplase.
   Time-critical? YES — door-to-needle target 30 min.

Q: 4yo, fever 39.5, refusing fluids, HR 160, RR 36, cap refill 3s.
A: Pediatric sepsis suspected (NEWS-pediatric high). Resus bed.
   IV access × 2, blood culture, CBC, CRP, lactate, glucose, blood gas.
   Fluid bolus NS 20 ml/kg = 320 ml over 15 min. Empirical ceftriaxone 50 mg/kg IV.
   Acetaminophen 15 mg/kg PO/PR. Reassess after bolus.
   Next-best-action: page pediatric consultant; prep PICU referral if no improvement.
   Time-critical? YES.
```

### 1.4 Self-critique checklist
- [ ] Vital signs within range for age?
- [ ] Pediatric dosing weight-based correct?
- [ ] Allergies cross-checked against orders?
- [ ] Time-critical pathway timer started?

---

## 2) Workflow & Orchestration

### 2.1 LangGraph state
```python
class EDState(TypedDict):
    intent: Literal["triage","clinical","handover","question","resus_assist"]
    patient_id: str
    ed_visit_id: str
    vitals: dict
    chief_complaint: str
    suggested_ctas: int
    triggered_codes: list[str]   # ["code_stemi","code_stroke","code_sepsis","trauma_alert"]
    rag_chunks: list[str]
    plan: list[dict]
    answer: str
    requires_human_confirm: bool
    timers_started: list[str]
```

### 2.2 Workflow stages
```
arrival → quick_register → AI_triage → physician_assignment → workup → disposition
                  │              │            │                  │           │
                  ▼              ▼            ▼                  ▼           ▼
              MRN/visit     CTAS+codes   bed assignment      orders/AI    home/admit/OR/ICU/transfer/death
```

### 2.3 Codes orchestration
- **Code STEMI** → page cardio + activate cath lab (event `ed.code.stemi.activated`)
- **Code Stroke** → page neuro + radiology STAT CT
- **Code Sepsis** → trigger 1-hour bundle, pharmacy notified
- **Trauma Alert L1** → page trauma surgeon, anesthesia, blood bank, OR
- **Code Blue (in-hospital)** → ACLS team

---

## 3) Backend / API

### 3.1 OpenAPI summary
| Path | Method | Auth | Purpose |
|------|--------|------|---------|
| `/api/v1/ed/triage` | POST | nurse | submit triage assessment |
| `/api/v1/ed/visits` | GET,POST | any | list/create ED visits |
| `/api/v1/ed/visits/{id}/disposition` | PATCH | doctor | set discharge/admit |
| `/api/v1/ed/codes/{code}/activate` | POST | doctor,nurse | activate code |
| `/api/v1/ed/orders/bundle/{protocol}` | POST | doctor | apply order set |
| `/api/v1/ed/board` | GET (SSE) | dashboard | live ED board |
| `/api/v1/ed/ai/ask` | POST | any | LangGraph entrypoint |

### 3.2 Events
- `ed.triage.completed`
- `ed.code.{name}.activated`
- `ed.disposition.set`
- `ed.bed.assigned`
- `ed.handover.completed`

---

## 4) Data & Storage

### 4.1 New tables
```sql
CREATE TABLE ed_visits (
    id UUID PRIMARY KEY,
    visit_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id INT NOT NULL REFERENCES patients(id),
    arrival_mode VARCHAR(20),
    arrived_at DATETIMEOFFSET NOT NULL,
    triage_started_at DATETIMEOFFSET,
    triage_completed_at DATETIMEOFFSET,
    ctas_level TINYINT CHECK (ctas_level BETWEEN 1 AND 5),
    chief_complaint NVARCHAR(500),
    seen_by_doctor_at DATETIMEOFFSET,
    doctor_id INT,
    bed_id VARCHAR(20),
    disposition VARCHAR(30),  -- 'discharge','admit','icu','or','transfer','dama','death'
    disposition_at DATETIMEOFFSET,
    los_minutes INT
);

CREATE TABLE ed_triage (
    id UUID PRIMARY KEY,
    ed_visit_id UUID NOT NULL REFERENCES ed_visits(id),
    nurse_id INT,
    pain_score TINYINT,
    bp_sys INT, bp_dia INT,
    hr INT, rr INT, spo2 INT, temp_c DECIMAL(3,1),
    gcs TINYINT,
    weight_kg DECIMAL(5,2),
    allergies_text NVARCHAR(MAX),
    ai_suggested_ctas TINYINT,
    ai_confidence DECIMAL(3,2),
    final_ctas TINYINT
);

CREATE TABLE ed_codes (
    id UUID PRIMARY KEY,
    ed_visit_id UUID NOT NULL,
    code_name VARCHAR(30) NOT NULL,   -- 'STEMI','STROKE','SEPSIS','TRAUMA_L1','BLUE'
    activated_at DATETIMEOFFSET NOT NULL,
    activated_by INT,
    deactivated_at DATETIMEOFFSET,
    outcome VARCHAR(40)
);

CREATE TABLE ed_order_bundles (
    id UUID PRIMARY KEY,
    ed_visit_id UUID NOT NULL,
    protocol_name VARCHAR(60) NOT NULL,
    applied_by INT,
    applied_at DATETIMEOFFSET,
    items_json NVARCHAR(MAX)
);

CREATE TABLE ed_board_snapshots (
    id UUID PRIMARY KEY,
    snapshot_at DATETIMEOFFSET NOT NULL,
    capacity_pct DECIMAL(4,1),
    waiting_count INT,
    ctas1_count INT, ctas2_count INT, ctas3_count INT, ctas4_count INT, ctas5_count INT,
    avg_door_to_doctor_min INT
);
```

### 4.2 Vector collections
- `kb_guidelines_ed` — ATLS, ACLS, PALS, ESC ACS, AHA stroke, KSA-MoH ED protocols
- `kb_local_sop_ed` — facility-specific (STEMI bypass route, mass-casualty plan)
- `kb_drug_formulary_ed` — emergency drugs (epi, atropine, amio, alteplase, naloxone)

### 4.3 RAG ingestion
- Sources: ATLS 10e, ACLS 2020, PALS 2020, NICE sepsis NG51, ESC ACS 2023, AHA Stroke 2024
- Chunk: 600 / overlap 100 (smaller for fast retrieval)
- Reranker: bge-reranker-v2-m3
- Refresh: weekly (ED guidelines change frequently)

---

## 5) Frontend / UI-UX

### 5.1 Screens
1. **ED Live Board** (TV mode) — beds, waits, codes
2. **Triage Form** — vitals + AI CTAS suggestion + confirm
3. **Patient Track Sheet** — timeline + orders + meds
4. **Code Activation Console** — one-tap codes with confetti-free alerts
5. **Handover (SBAR)** — auto-generated draft from track sheet
6. **Mobile Consultant View** — receive page, see snapshot

### 5.2 Components
- `<TriageForm>` with `<VitalsGrid>` and `<CtasBadge ai={x} final={y}/>`
- `<CodeButton type="STEMI" />` with disabled-while-active state
- `<CountdownTimer target="door_to_balloon_90min"/>`
- `<EdBoard rows={...} sse="/ed/board"/>`

### 5.3 Imagery
- ED hero (Shutterstock): `1856823331`
- Triage icon set (Tabler): activity, alert-triangle, ambulance, heart-rate-monitor

---

## 6) Infrastructure / DevOps
- Container: `ghcr.io/nama/ed-api`, `ghcr.io/nama/ed-board-sse`
- Helm: `charts/ed/`
- HA: 3 replicas API, 2 replicas SSE; sticky sessions on board
- Latency budget: AI triage suggestion ≤ 800 ms p95

---

## 7) Testing & QA
### 7.1 Unit
- CTAS suggester (table-driven for 50 vignettes)
- Score calculators
- Order-bundle generator

### 7.2 Integration
- Triage → CTAS → bed → physician assignment → orders → disposition
- Code STEMI: triage → ECG ai → code activated → cardio paged → audit complete

### 7.3 E2E
1. Register walk-in → triage CTAS 3 → bed assigned → doctor seen → discharged
2. Ambulance arrival → trauma alert → resus bed → blood ordered → OR booked

---

## 8) Wireframes
- Figma file: `NamaMedical-ED-v1` — Board(TV), Triage, Track, Mobile

## 9) BPMN
- `flows/ed_triage.bpmn`
- `flows/ed_code_stemi.bpmn`
- `flows/ed_code_stroke.bpmn`
- `flows/ed_sepsis_bundle.bpmn`
- `flows/ed_trauma_l1.bpmn`

## 10) ERD (DBML)
```dbml
Table ed_visits {
  id uuid [pk]
  visit_number varchar [unique]
  patient_id int [ref: > patients.id]
  arrived_at timestamptz
  ctas_level smallint
  disposition varchar
}
Table ed_triage { ed_visit_id uuid [ref: > ed_visits.id] /* + vitals */ }
Table ed_codes  { ed_visit_id uuid [ref: > ed_visits.id] /* code_name */ }
```

## 11) User Stories
```gherkin
Feature: Triage with AI assistance
  Scenario: Nurse triages chest pain patient
    Given a 65yo male arrives with chest pain, vitals BP 90/60, HR 120, SpO2 92
    When the nurse opens the triage form and submits vitals
    Then AI suggests CTAS level 1 with confidence 0.91
    And the nurse confirms CTAS 1
    And a resus bed is auto-assigned
    And on-call physician is paged
    And door-to-doctor timer starts targeting ≤5 min
```

## 12) Test Plan
- 200 cases: 60 P0 (codes & resus), 90 P1 (CTAS 2/3 flows), 50 P2 (board, reports)

## 13) Architecture (C4)
- L2 Containers: ed-api, ed-board-sse, ed-ai-worker (triage + score), redis, qdrant, mssql
- L3: TriageService, CodeOrchestrator, BundleService, BoardSnapshotter

## 14) Security Plan
- High-volume PHI exposure on board → role-based redaction (no full names on TV mode)
- Pediatric data: extra audit trail
- Code activations: append-only with cryptographic chain (tamper-evident)

## 15) Deployment Plan
- Active-active across two zones
- Hot-standby for board SSE
- Dedicated DB replica for read-heavy board queries

## 16) Style Guide
- Accent: ED red `#dc2626`
- Code colors: STEMI red, STROKE blue, SEPSIS purple, TRAUMA orange
- High contrast, large fonts (board mode)

## 17) i18n
- `i18n/ed.ar.json`, `i18n/ed.en.json` (~300 keys)

## 18) Sample Data
- `seeders/ed_seed.sql` — 100 visits across CTAS levels, 10 active codes for demo

## 19) Migrations
- `migrations/ed/V001__core.sql` (visits, triage)
- `migrations/ed/V002__codes_bundles.sql`
- `migrations/ed/V003__board_snapshots.sql`

## 20) User Manual (TOC)
1. تشغيل اللوحة الحية
2. الفرز السريع (Triage)
3. تأكيد/تعديل اقتراح CTAS
4. تفعيل الأكواد (STEMI/Stroke/Sepsis/Trauma)
5. تطبيق حزمة الأوامر
6. SBAR للتسليم
7. تقارير الأداء (door-to-X)

## 21) Training Videos
- V01 — Live Board overview (3m)
- V02 — Submitting triage with AI (3m)
- V03 — Activating Code STEMI end-to-end (4m)
- V04 — Pediatric resus walkthrough (5m)

## 22) Legal & Compliance
- PDPL: real-time PHI on screens → redaction policy
- CBAHI: ED standards (door-to-X, sepsis bundle, stroke bundle)
- MoH 937 / Shahm integration for ambulance handover
- Mandatory reporting: traffic accidents, child abuse, gunshot, infectious disease

## 23) Open Questions / Risks
- AI triage acceptance acceptance rate target: ≥85%
- Liability when AI suggests CTAS 4 but actual deterioration happens — keep "AI advisory only" disclaimer + audit
- Board screen privacy in waiting areas
