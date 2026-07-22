# Cardiology — 7-Expert Panel Synthesis (EXAMPLE)

> **Dept:** Cardiology (general + 8 sub-units)
> **Group:** Internal Medicine
> **Cluster DBML:** `docs/erd/cardiology.dbml`
> **Status:** A (existing cluster, partial sub-units)
> **Date:** 2026-07-22
> **Demo:** This is a complete example of the 7-Expert Panel output for ONE department. Use the per-dept template to replicate for other depts.

---

## 🎯 CMO Input (Chief Medical Officer)

### Clinical Scope
- **Mission:** Comprehensive cardiovascular care for inpatients and outpatients, from prevention to advanced heart failure.
- **Patient population:** Adults ≥18y with suspected/confirmed cardiovascular disease (CVD).
- **Top 5 conditions (ICD-10-AM):**
  1. I20-I25 (Ischemic heart disease, including STEMI/NSTEMI)
  2. I50 (Heart failure)
  3. I48 (Atrial fibrillation/flutter)
  4. I10-I15 (Hypertensive diseases)
  5. I44-I49 (Conduction disorders + arrhythmias)
- **Care bundles:**
  - ACS (acute coronary syndrome) bundle: MONA-B → ECG → troponin → cath lab activation if STEMI
  - HF bundle: GDMT titration + daily weight + BNP trend
  - AF bundle: CHA₂DS₂-VASc → anticoagulation decision → rate/rhythm control
- **Hand-off:** SBAR template (Situation, Background, Assessment, Recommendation)
- **Escalation thresholds:** EWS ≥5, MEWS ≥4, qSOFA ≥2 → immediate MD review

### Sub-units (each becomes a workspace or sub-tab)
1. **General Cardiology** — OP clinic, echo, stress testing
2. **Interventional Cardiology** — cath lab, PCI, TAVR
3. **Electrophysiology (EP)** — ablation, devices (PPM, ICD, CRT)
4. **Preventive Cardiology** — risk scoring, lifestyle, lipid clinic
5. **Nuclear Cardiology** — MPI, PET, viability
6. **Cardio-Obstetrics** — joint with OB (high-risk pregnancy)
7. **Cardiac Catheterization Lab** — scheduling, pre-procedure checklist
8. **Peripheral Vascular Disease (PVD)** — joint with vascular surgery
9. **Advanced Heart Failure** — LVAD, transplant listing, palliative

---

## 🤖 AI Engineer Input

### RAG Strategy
- **Embedding model:** text-embedding-3-small (1536-dim)
- **Chunk size:** 512 tokens, 50 overlap
- **Top-k retrieval:** 5 (re-ranked via cross-encoder)
- **Sources:** ESC Guidelines 2023, AHA/ACC 2022, Saudi Heart Association guidelines
- **Re-embed schedule:** Weekly (CI job)

### LangChain Chain
```
[PatientContext] → [Retriever] → [PromptTemplate] → [LLM (gpt-4o-mini)] → [OutputParser] → [Validator] → [Audit]
```

### VectorMine Hook
- pgvector: 1536-dim; ivfflat lists=100
- Fallback: REAL[] + cosine in app code

### Prompt Template
```
{system_prompt}

Patient: {patient_context}
ECG: {ecg_summary}
Labs: {recent_labs}
Question: {question}

Relevant guidelines (top 5):
{retrieved_chunks}

Answer in this JSON shape:
{output_schema}
```

### Guardrails
- Refuse if not cardiology scope (route to appropriate dept)
- Always cite chunk_id
- Flag drug-allergy interactions (e.g., beta-blocker + asthma)
- LVEF <30% → escalate to Heart Failure team

---

## 🏗️ Architect Input

### Data Model (append to `cardiology.dbml`)
- `cardiac_procedures` (cath, PCI, TAVR, ablation, device implant)
- `echo_reports` (TTE, TEE with EF, valve assessment)
- `ecg_archive` (12-lead + rhythm strips)
- `holter_studies` (24h, 48h, 7-day)
- `stress_tests` (exercise, pharmacologic, echo, nuclear)
- `cardiac_rehab_enrollment`
- `anticoagulation_clinic_visits`
- `lipid_clinic_followup`

### Indexes
- `(patient_id, study_date DESC)` on echo_reports, ecg_archive
- `(patient_id, status)` on cardiac_procedures
- GIN on cardiac_procedures.indication (for cohort queries)

### API Surface
| Method | Path | RBAC | Idempotency | Notes |
|---|---|---|---|---|
| GET | `/api/cardiology/patients/:id/echo` | Doctor, Nurse | no | Latest echo |
| POST | `/api/cardiology/echo` | Sonographer, Doctor | no | Upload new |
| GET | `/api/cardiology/patients/:id/ecg` | Doctor, Nurse | no | ECG list |
| POST | `/api/cardiology/procedures` | Doctor | yes | Schedule cath |
| GET | `/api/cardiology/procedures/:id` | Doctor, Nurse | no | Detail |
| POST | `/api/cardiology/cds/chadsvasc` | Doctor, Nurse | no | Calls /api/calculators/cha2ds2-vasc |
| POST | `/api/cardiology/cds/hasbled` | Doctor, Nurse | no | Bleeding risk |
| GET | `/api/cardiology/cohorts/post-mi` | Doctor, Researcher | no | RLS on tenant |

### RBAC Matrix
| Action | Admin | Cardiologist | Cardiology Nurse | Sonographer | EP Doctor | Researcher |
|---|---|---|---|---|---|---|
| View patient | ✅ | ✅ (own dept) | ✅ (own dept) | ✅ (own dept) | ✅ | ❌ |
| Order echo | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Read echo | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Schedule cath | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Sign procedure note | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| View cohort | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Run CDS | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

### Observability
- Spans: `cardiology.echo.upload`, `cardiology.cath.schedule`, `cardiology.cds.run`
- Audit events: all procedure orders + sign events
- Metrics: cath lab door-to-balloon time (target <90 min)

---

## 🔒 DevOps & Security Input

### Threat Model (STRIDE)
- **Spoofing:** JWT + tenant context; OAuth via Keycloak
- **Tampering:** DB write audit, hash-chained audit log
- **Repudiation:** Audit log immutable (7-year retention)
- **Info disclosure:** PHI encrypted (crypto_envelope), need-to-know RBAC
- **Denial of service:** rate limit on `/api/cardiology/*` (100 req/min/user)
- **Elevation of privilege:** requireRole for procedures

### Secrets & Env Vars
- `CARDIOLOGY_AI_MODEL=gpt-4o-mini` (or self-hosted)
- `CARDIOLOGY_CDS_ENABLED=true`
- No secrets in code or fixtures

### Deploy
- Pre-deploy: backup DB, run migrations `e30-e55` if new
- Feature flag: `CARDIOLOGY_CDS_ENABLED` (off → no LLM, deterministic only)
- Rollback: restore DB + redeploy last good

### Pen Test
- Pre-release: full OWASP + STRIDE
- Quarterly: smoke + new endpoint review

---

## 🎨 PM/UX Input

### User Stories (Gherkin samples)

```gherkin
Feature: CHA₂DS₂-VASc CDS

  Scenario: Cardiologist assesses stroke risk in new AF
    Given a 65-year-old male patient with new-onset AF
    And the cardiology station is open
    When the cardiologist clicks "Calculate stroke risk"
    Then the system shows CHA₂DS₂-VASc = 3 (age 65-74, HTN, DM)
    And suggests "Consider oral anticoagulation per ESC 2020"
    And cites "chunk_id=cv-2020-esc-af-007, score=0.91"

  Scenario: Nurse views anticoagulation clinic
    Given a patient on warfarin
    And INR is due today
    When the nurse opens the cardiology station
    Then the dashboard highlights the patient
    And shows the last 3 INR values
    And flags if INR > 3.5 (over-anticoagulated)
```

### Wireframe (Stitch HTML)
- See `STITCH_SAMPLES/cardiology_stitch.html` (3-col layout: vitals / ECG + CDS / orders)

### Acceptance Criteria
- All CDS suggestions cite a guideline chunk
- All procedure orders require Doctor role
- All patient views filtered by tenant_id
- RTL/LTR supported
- WCAG 2.2 AA: keyboard nav + screen reader

### Persona Map
- **Cardiologist:** focused, time-poor; needs CDS at point-of-care
- **Cardiology Nurse:** needs vitals + orders + results in one view
- **Sonographer:** needs echo upload + report workflow
- **EP Doctor:** needs ablation scheduling + device tracking
- **Researcher:** needs cohort queries (RLS-scoped)

---

## ⚖️ Compliance & Quality Input

### Standards
- **CBAHI:** APR (Assessment of Patients) standards; MMU (Medication Use) for anticoagulation
- **JCI:** IPSG (International Patient Safety Goals) 1, 2, 3; ACC (Access to Care) for STEMI door-to-balloon
- **ISO 7101:** Quality management for healthcare
- **PDPL:** Patient consent for AI-suggested plans

### Required Audits
- All cath procedures: door-to-balloon time logged
- All anticoagulation starts: indication + CHA₂DS₂-VASc + HAS-BLED logged
- All CDS suggestions: prompt + response + clinician action logged

### KPIs
1. STEMI door-to-balloon <90 min (target: ≥90% of cases)
2. AF anticoagulation rate in eligible patients (target: ≥85%)
3. CDS suggestion acceptance rate (target: ≥60%)
4. Echo turnaround time <24h (target: ≥90%)
5. Cardiac rehab enrollment post-MI (target: ≥70%)

### Consent Template
- AI-assisted clinical decision support: PDPL consent form (opt-in, opt-out anytime)
- Cardiac rehab enrollment: separate consent

### Retention
- Echo/ECG images: 7 years
- Procedure notes: 10 years (Saudi law)
- Audit logs: 7 years (CBAHI)

---

## 🎼 Master Orchestrator Synthesis

The 6 expert inputs above combine into:

### 1. **Clinical scope** (CMO) — 9 sub-units, 5 top conditions
### 2. **RAG chain** (AI) — pgvector + LangChain + LLM observability
### 3. **ERD** (Architect) — 7 new tables in `cardiology.dbml`
### 4. **API** (Architect) — 8 routes with RBAC + idempotency
### 5. **Threat model** (DevOps) — STRIDE + rate limit + JWT
### 6. **Wireframe** (PM/UX) — 3-col Stitch + Gherkin
### 7. **Compliance** (Compliance) — CBAHI/JCI + KPIs + consent

### What needs to be built (Phase 3 work):
1. 9 sub-unit workspaces in cardiology-station (or 9 sub-stations)
2. 7 new DBML tables in `cardiology.dbml`
3. 8 API routes
4. 1 new engine: `cardiology_cds.js` (calls /api/calculators + adds ESC/AHA guidelines)
5. RAG: 50+ cardiology guideline chunks embedded
6. Stitch HTML per sub-unit
7. 8 i18n keys (AR/EN)
8. Seeders + migrations
9. 5+ unit tests + 3 integration tests
10. User manual (AR/EN)
11. KPI dashboard (links to compliance)

### What is ALREADY live (from Phase 1-2):
- `cardiology-station` (general cardiology + sub-tabs)
- `cardiology.dbml` (base cluster)
- `/api/calculators/cha2ds2-vasc`, `/has-bled`, `/gcs` (used by cardiology)
- `cardiology_orchestrator.js` (partial)

### Token estimate to complete
- 34 files × ~500 tokens/file = ~17K tokens (per dept)
- Multi-agent: split into 3 sub-agents (clinical / tech / UX) = ~6K effective tokens

### Open questions
- (Compliance) Do we use Saudi MoH or ESC guidelines as the primary reference? → Owner to decide.
- (Architect) Should we add a `cardiac_rehab_enrollment` table now or wait? → Defer to Phase 4.
- (DevOps) Self-hosted LLM (cost-saving) vs OpenAI (reliable)? → Owner to decide.

---

## SUMMARY: Sample complete for ONE dept

This document shows what the 7-Expert Panel produces for ONE department.
The same template, when applied to all 88 workstreams, generates the
~1,700 .ai-brain files needed for Phase 3.

See `../PANEL_PROMPTS/PER_DEPARTMENT_QUICKSTART_TEMPLATE.md` for the
full 35-file template per dept.
