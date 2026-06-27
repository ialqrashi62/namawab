# G10 — الجراحة العامة (General, Endocrine, Bariatric, Breast, Trauma, Colorectal Surgery)

## 0) Meta
```yaml
dept_key: "general_surgery"
group_id: "G10"
sub_units: [general_surgery, surgical_oncology, endocrine_surgery_thyroid,
            endocrine_surgery_adrenal, endocrine_surgery_parathyroid,
            minimal_invasive_robotic, bariatric, breast, trauma_surgery, colorectal]
```

## 1) System Prompt
```text
You are NamaMedical-GenSurg Assistant.
GUARDRAILS: ACS, SAGES, IFSO (bariatric), NCCN (surg-onc).
- Pre-op: ASA, P-POSSUM/SORT risk, anticoag plan, consent, marking, antibiotic prophylaxis.
- ERAS pathways always referenced.
- Bariatric: BMI ≥40 or ≥35 with comorbid + multidisciplinary clearance.
TOOLS: ppossum_calc, sort_score, eras_checklist, vte_prophylaxis,
       wound_class_classifier, antibiotic_proph_select, consent_explainer,
       implant_traceability, escalate.
```

## 2) Workflow
LangGraph: classify → load(pre-op) → rag(SAGES/ACS) → tools(risk/eras) → critique → human (consent).

## 3) API
| /api/v1/surg/cases | GET,POST | OR cases |
| /api/v1/surg/eras | GET,POST | pathway tracker |
| /api/v1/surg/implants | POST | UDI traceability |
| /api/v1/surg/counts | POST | sponge/needle/instrument count |
| /api/v1/surg/ai/ask | POST | LangGraph |

Events: `surg.case.scheduled`, `surg.timeout.completed`, `surg.case.completed`.

## 4) Data
```sql
CREATE TABLE surg_cases (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  scheduled_date DATE, room VARCHAR(20), surgeon_id INT, anesth_id INT,
  procedure_code VARCHAR(20), wound_class TINYINT, asa CHAR(2),
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, ebl_ml INT,
  outcome VARCHAR(40));
CREATE TABLE surg_eras_pathways (id UUID PRIMARY KEY, case_id UUID,
  step VARCHAR(60), expected_at DATETIMEOFFSET, completed_at DATETIMEOFFSET,
  variance_reason NVARCHAR(MAX));
CREATE TABLE surg_implants_used (id UUID PRIMARY KEY, case_id UUID,
  udi VARCHAR(80), product_name VARCHAR(120), lot VARCHAR(40),
  expiry DATE, vendor VARCHAR(80));
CREATE TABLE surg_counts (id UUID PRIMARY KEY, case_id UUID,
  count_type VARCHAR(20), initial_n INT, final_n INT, reconciled BIT,
  performed_at DATETIMEOFFSET, performed_by INT);
CREATE TABLE surg_consents (id UUID PRIMARY KEY, case_id UUID, patient_id INT,
  signed_at DATETIMEOFFSET, witness_id INT, language VARCHAR(5),
  pdf_blob_url VARCHAR(500));
```

### 4.2 Vector
- `kb_guidelines_surgery` (ACS, SAGES, IFSO, NCCN-surgical)
- `kb_local_sop_or` (timeout, antibiotic prophylaxis windows)
- `kb_eras_pathways`

## 5) Frontend
OR schedule, Pre-op checklist, Timeout checklist, ERAS tracker, Implants log, Counts pad.
Components: `<TimeoutChecklist>`, `<ERASStepGrid>`, `<UDIScanner>`, `<CountsPad>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `surg_eras_colorectal.bpmn`, `surg_bariatric_pathway.bpmn`, `surg_trauma_l1.bpmn`.
```gherkin
Feature: Sponge count reconciliation
  Scenario: Final count short by one
    Given initial sponge count = 20
    When final count = 19 at closing
    Then closure is blocked, intra-op X-ray triggered
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#3b82f6`. Seeders 30 cases mix gen/lap/bariatric. PDPL, CBAHI surgery bundle, SFDA UDI, ZATCA implant-cost in invoice.

## 23) Risks
Robotic surgery licensing; bariatric long-term follow-up funding; trauma activation criteria local variance.
