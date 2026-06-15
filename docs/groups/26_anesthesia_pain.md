# G26 — التخدير وإدارة الألم (Anesthesia, Interventional Pain, PACU, HBOT)

## 0) Meta
```yaml
dept_key: "anesthesia_pain"
group_id: "G26"
sub_units: [anesthesia_general, ob_anesthesia, peds_anesthesia, cardiac_anesthesia,
            interventional_pain, spinal_injections, rfa, scs, intrathecal_pumps,
            pacu, hbot]
```

## 1) System Prompt
```text
You are NamaMedical-Anesthesia/Pain Assistant.
GUARDRAILS: ASA, ESA, AAGBI, ASRA, KSA-MoH anesthesia.
- Pre-op: ASA class, NPO status, allergies, anticoag review, airway assessment (Mallampati).
- Difficult airway algorithm; rescue plan documented.
- Regional anesthesia: LAST recognition + lipid emulsion stockpile.
- Pain mgmt: WHO ladder; opioid stewardship; PCA settings.
TOOLS: asa_class, mallampati, npo_check, anticoag_holding,
       last_protocol, pca_dose_calc, intrathecal_concentration_check,
       block_planner, escalate.
```

## 2) Workflow
LangGraph: classify → load(pre-op) → rag → tools → critique → human (always for difficult airway).

## 3) API
| /api/v1/anes/pre_op | GET,POST | preop assessment |
| /api/v1/anes/intra_op | POST | intraop record (auto+manual) |
| /api/v1/anes/blocks | POST | regional block log |
| /api/v1/pacu/admissions | GET,POST | post-anesthesia care |
| /api/v1/pain/procedures | GET,POST | interventional pain |
| /api/v1/pain/pca | POST | PCA settings + boluses |
| /api/v1/pain/intrathecal_pumps | POST | refill log |
| /api/v1/hbot/sessions | GET,POST | hyperbaric sessions |
| /api/v1/anes/ai/ask | POST | LangGraph |

Events: `anes.preop.completed`, `anes.intraop.event`, `pacu.discharge.cleared`, `pain.pca.adjusted`.

## 4) Data
```sql
CREATE TABLE anes_pre_op (id UUID PRIMARY KEY, patient_id INT, surg_case_id UUID,
  asa_class CHAR(2), mallampati TINYINT, airway_findings NVARCHAR(MAX),
  npo_status VARCHAR(20), anticoag_held VARCHAR(40),
  allergies NVARCHAR(300), plan NVARCHAR(MAX));
CREATE TABLE anes_intra_op (id UUID PRIMARY KEY, surg_case_id UUID,
  recorded_at DATETIMEOFFSET, hr INT, bp_sys INT, bp_dia INT,
  spo2 INT, etco2 INT, mac_iso DECIMAL(3,2), drugs_given NVARCHAR(MAX),
  fluids_ml INT, blood_products NVARCHAR(MAX), events NVARCHAR(MAX));
CREATE TABLE anes_blocks (id UUID PRIMARY KEY, surg_case_id UUID,
  block_type VARCHAR(40), location VARCHAR(40), volume_ml DECIMAL(4,1),
  drug VARCHAR(40), efficacy VARCHAR(20), complications NVARCHAR(MAX));
CREATE TABLE pacu_admissions (id UUID PRIMARY KEY, surg_case_id UUID,
  admit_at DATETIMEOFFSET, discharge_at DATETIMEOFFSET,
  aldrete_score INT, pain_score TINYINT, complications NVARCHAR(MAX));
CREATE TABLE pain_procedures (id UUID PRIMARY KEY, patient_id INT,
  procedure VARCHAR(60), date DATE, fluoro_used BIT,
  outcome NVARCHAR(MAX), follow_up_date DATE);
CREATE TABLE pain_pca (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(40), demand_dose_mg DECIMAL(5,2), lockout_min INT,
  basal_mg_h DECIMAL(5,2), max_4h_mg DECIMAL(5,2), set_at DATETIMEOFFSET);
CREATE TABLE pain_intrathecal_pumps (id UUID PRIMARY KEY, patient_id INT,
  refill_at DATETIMEOFFSET, drug VARCHAR(40), concentration VARCHAR(20),
  rate_mg_day DECIMAL(6,3), reservoir_ml DECIMAL(4,1));
CREATE TABLE hbot_sessions (id UUID PRIMARY KEY, patient_id INT,
  session_date DATE, indication VARCHAR(40), pressure_ata DECIMAL(3,1),
  duration_min INT, complications NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_anes` (ASA, ESA, AAGBI)
- `kb_difficult_airway_algorithms`
- `kb_pain_protocols`

## 5) Frontend
Pre-op clinic, Intra-op chart (auto-data feed), Block planner with US image,
PACU board, Pain procedure scheduler, PCA settings pad, HBOT calendar.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `anes_preop_workflow.bpmn`, `anes_difficult_airway.bpmn`, `pain_intrathecal_refill.bpmn`.
```gherkin
Feature: NPO violation gate
  Scenario: Recent solid intake before elective surgery
    Given last solid intake = 4 hours ago
    When pre-op confirmed for general anesthesia
    Then case flagged, anesthesia consultant must approve override
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#1d4ed8`. Seeders 30 preops, 15 blocks, 20 PACUs, 10 pain procs, 10 HBOT. PDPL, CBAHI anesthesia, SFDA opioid stewardship.

## 23) Risks
Opioid diversion; LAST kit availability; HBOT chamber maintenance; difficult-airway equipment standardization.
