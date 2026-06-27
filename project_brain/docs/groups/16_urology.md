# G16 — المسالك البولية والذكورة (Urology, Andrology, Reconstructive)

## 0) Meta
```yaml
dept_key: "urology"
group_id: "G16"
sub_units: [urology_general, endourology_stones, urologic_oncology_prostate,
            urologic_oncology_bladder, urologic_oncology_kidney,
            peds_urology, andrology_male_infertility, female_urology_urodynamics, reconstructive_urology]
```

## 1) System Prompt
```text
You are NamaMedical-Urology Assistant.
GUARDRAILS: AUA, EAU, NCCN-urology, SIU, KSA-MoH cancer registry rules.
- Stones: imaging (NCCT) → size/location → SWL/URS/PCNL pathway.
- Prostate cancer: PSA + MRI → PI-RADS → biopsy decision.
- Pediatric urology: VUR grading, antibiotic prophylaxis criteria.
- Andrology: WHO 2021 semen analysis ranges.
TOOLS: psa_velocity_calc, stone_treatment_select, pi_rads_logger,
       urodynamics_interp, semen_analysis_interp, escalate.
```

## 2) Workflow
LangGraph: classify → load(imaging+labs) → rag → tools → critique.

## 3) API
| /api/v1/urol/stones | GET,POST | stone events + treatments |
| /api/v1/urol/prostate | GET,POST | PSA, MRI PI-RADS, biopsy |
| /api/v1/urol/bladder_cancer | GET,POST | TURBT, cystectomy plans |
| /api/v1/urol/peds | GET,POST | VUR, hypospadias, undescended testis |
| /api/v1/urol/andrology | GET,POST | semen analysis, varicocele |
| /api/v1/urol/urodynamics | GET,POST | UDS studies |
| /api/v1/urol/ai/ask | POST | LangGraph |

Events: `urol.stone.treated`, `urol.psa.alert`, `urol.uds.completed`.

## 4) Data
```sql
CREATE TABLE urol_stones (id UUID PRIMARY KEY, patient_id INT,
  diagnosed_at DATE, side VARCHAR(5), location VARCHAR(20), size_mm INT,
  hu INT, treatment VARCHAR(20), -- 'observation','swl','urs','pcnl','open'
  outcome VARCHAR(40));
CREATE TABLE urol_prostate (id UUID PRIMARY KEY, patient_id INT,
  measured_at DATETIMEOFFSET, psa DECIMAL(5,2), psa_velocity DECIMAL(5,2),
  pi_rads TINYINT, biopsy_done BIT, gleason_score VARCHAR(10),
  staging VARCHAR(20));
CREATE TABLE urol_bladder_cancer (id UUID PRIMARY KEY, patient_id INT,
  turbt_date DATE, histology VARCHAR(40), grade VARCHAR(10), stage VARCHAR(10),
  bcg_started BIT, cystectomy_date DATE);
CREATE TABLE urol_peds (id UUID PRIMARY KEY, patient_id INT,
  diagnosis VARCHAR(40), grade VARCHAR(20), surgery_date DATE);
CREATE TABLE urol_andrology (id UUID PRIMARY KEY, patient_id INT,
  test_date DATE, volume_ml DECIMAL(3,1), conc_million_ml INT,
  motility_pct DECIMAL(4,1), morphology_pct DECIMAL(4,1));
CREATE TABLE urol_uds (id UUID PRIMARY KEY, patient_id INT, study_date DATE,
  detrusor_pressure INT, capacity_ml INT, compliance VARCHAR(20),
  diagnosis VARCHAR(60));
```

### 4.2 Vector
- `kb_guidelines_urol` (AUA, EAU, NCCN-urology, SIU)

## 5) Frontend
Stone treatment selector, PSA trend chart, PI-RADS image viewer, BCG calendar,
UDS interpretation, Andrology profile, Pediatric VUR tracker.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `urol_stone_pathway.bpmn`, `urol_prostate_screening.bpmn`, `urol_bcg_protocol.bpmn`.
```gherkin
Feature: PI-RADS triage
  Scenario: PI-RADS 4 lesion
    Given mpMRI shows PI-RADS 4 in peripheral zone
    When report finalized
    Then MRI-targeted fusion biopsy is auto-suggested
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#06b6d4`. Seeders 20 stones, 30 prostate, 10 peds. PDPL, CBAHI cancer bundle, MoH cancer registry.

## 23) Risks
PSA screening policy variability; BCG supply chain; pediatric urology surgical volume.
