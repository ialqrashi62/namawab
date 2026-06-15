# G30 — التمريض (Nursing — All Specialties)

## 0) Meta
```yaml
dept_key: "nursing"
group_id: "G30"
sub_units: [nursing_admin, med_surg, perioperative, critical_care_nursing,
            pediatric_nursing, ob_nursing, home_health_nursing,
            geriatric_nursing, oncology_nursing, psychiatric_nursing,
            emergency_nursing, ophthalmic_nursing, ent_nursing, palliative_nursing]
```

## 1) System Prompt
```text
You are NamaMedical-Nursing Assistant.
GUARDRAILS: ANA Scope & Standards, NANDA-NOC-NIC, Saudi Commission for Health Specialties.
- Care plan structured: assessment → diagnosis → outcomes → interventions → evaluation.
- Risk scores: Braden (PI), Morse (falls), MUST (nutrition), Glasgow (LOC).
- Med administration: 5+1 rights; barcode scan if available.
TOOLS: braden_score, morse_score, must_score, careplan_generator,
       handover_sbar, med_admin_5rights, escalate.
```

## 2) Workflow
LangGraph: classify → load(care plan + observations) → rag → tools(scores) → critique → human.

## 3) API
| /api/v1/nursing/care_plans | GET,POST | NANDA-based plans |
| /api/v1/nursing/observations | POST | vitals, IO, pain |
| /api/v1/nursing/risks | POST | Braden/Morse/MUST |
| /api/v1/nursing/med_admin | POST | rights + barcode scans |
| /api/v1/nursing/handover | POST | SBAR |
| /api/v1/nursing/ai/ask | POST | LangGraph |

Events: `nursing.assessment.completed`, `nursing.med.administered`, `nursing.risk.high`.

## 4) Data
```sql
CREATE TABLE nursing_care_plans (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  nanda_diagnosis VARCHAR(80), goals NVARCHAR(MAX),
  interventions NVARCHAR(MAX), evaluation NVARCHAR(MAX),
  created_by INT, updated_at DATETIMEOFFSET);
CREATE TABLE nursing_observations (id UUID PRIMARY KEY, patient_id INT,
  recorded_at DATETIMEOFFSET, hr INT, bp_sys INT, bp_dia INT,
  rr INT, spo2 INT, temp_c DECIMAL(3,1), pain_score TINYINT,
  intake_ml INT, output_ml INT, notes NVARCHAR(MAX));
CREATE TABLE nursing_risks (id UUID PRIMARY KEY, patient_id INT,
  scored_at DATETIMEOFFSET, scale VARCHAR(20), score INT, category VARCHAR(20));
CREATE TABLE nursing_med_admin (id UUID PRIMARY KEY, patient_id INT, order_id UUID,
  drug VARCHAR(60), dose VARCHAR(40), route VARCHAR(20),
  administered_at DATETIMEOFFSET, nurse_id INT,
  rights_5_passed BIT, barcode_scanned BIT, refusal_reason NVARCHAR(200));
CREATE TABLE nursing_handover (id UUID PRIMARY KEY, patient_id INT,
  done_at DATETIMEOFFSET, from_user_id INT, to_user_id INT, sbar NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_nursing_standards` (ANA, NANDA-NOC-NIC, SCFHS)
- `kb_nursing_care_pathways`

## 5) Frontend
Nursing dashboard per ward, Care plan editor, Observations chart (NEWS2),
Med admin page with barcode, Handover SBAR composer, Risk scoring pad.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `nursing_admit_workflow.bpmn`, `nursing_med_admin.bpmn`, `nursing_shift_handover.bpmn`.
```gherkin
Feature: Falls high risk plan
  Scenario: Morse score >= 51
    Given Morse fall risk = 65
    Then care plan auto-adds bed alarm + assist toileting + reorientation
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#a78bfa`. Seeders 50 patients, 200 obs, 100 admins. PDPL, CBAHI nursing, SCFHS scope of practice.

## 23) Risks
Nurse-patient ratio compliance; barcode device fleet uptime; care-plan template proliferation.
