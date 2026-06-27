# G18 — النساء والتوليد (OB-GYN, MFM, REI/IVF, Gyn-Surgery, Urogyn)

## 0) Meta
```yaml
dept_key: "obgyn"
group_id: "G18"
sub_units: [obgyn_general, mfm_high_risk, prenatal_diagnosis_4d,
            prenatal_diagnosis_amnio, gyn_surgery, gyn_robotic, rei_ivf,
            ivf_icsi, ivf_imsi, ivf_pgd, cryopreservation_sperm, cryopreservation_oocyte_embryo,
            ovarian_tissue_bank, adolescent_gynecology, menopause, urogynecology_cosmetic]
```

## 1) System Prompt
```text
You are NamaMedical-OBGYN Assistant.
GUARDRAILS: ACOG, RCOG, FIGO, ESHRE (REI), ASRM.
- Pregnancy dating: LMP + early US; safety: no teratogens.
- High-risk: pre-eclampsia screening (1st-trimester), GDM screen (24-28w).
- IVF: pre-cycle hormone profile, AMH, sonography; OHSS risk score.
- Adolescent: confidentiality + guardian consent rules per KSA legal framework.
TOOLS: gestational_age_calc, preeclampsia_risk, fetal_growth_centile,
       ovulation_induction, ohss_risk, embryo_grading, cryostorage_lookup, escalate.
```

## 2) Workflow
LangGraph: classify → load(ANC + scans + labs) → rag → tools → critique → human (always for delivery decisions).

## 3) API
| /api/v1/obgyn/anc_visits | GET,POST | antenatal care |
| /api/v1/obgyn/prenatal_dx | GET,POST | NIPT/amnio/CVS |
| /api/v1/obgyn/labor | GET,POST | labor & delivery |
| /api/v1/obgyn/cs | POST | C-section log |
| /api/v1/ivf/cycles | GET,POST | IVF cycle mgmt |
| /api/v1/ivf/embryos | GET,POST | embryo registry |
| /api/v1/ivf/cryostore | GET | freeze/thaw events |
| /api/v1/obgyn/ai/ask | POST | LangGraph |

Events: `obgyn.ga.recorded`, `obgyn.labor.started`, `ivf.cycle.completed`, `ivf.embryo.transferred`.

## 4) Data
```sql
CREATE TABLE obgyn_pregnancies (id UUID PRIMARY KEY, patient_id INT,
  lmp DATE, edd DATE, parity VARCHAR(20), risk_category VARCHAR(20));
CREATE TABLE obgyn_anc_visits (id UUID PRIMARY KEY, pregnancy_id UUID,
  visit_date DATE, ga_weeks DECIMAL(3,1), bp VARCHAR(15), weight_kg DECIMAL(5,2),
  fundal_height_cm INT, fetal_hr INT, notes NVARCHAR(MAX));
CREATE TABLE obgyn_prenatal_dx (id UUID PRIMARY KEY, pregnancy_id UUID,
  test VARCHAR(20), date DATE, result NVARCHAR(MAX), karyotype VARCHAR(60));
CREATE TABLE obgyn_labor (id UUID PRIMARY KEY, pregnancy_id UUID,
  onset_at DATETIMEOFFSET, mode VARCHAR(20),
  delivery_at DATETIMEOFFSET, apgar_1 INT, apgar_5 INT, baby_id INT);
CREATE TABLE obgyn_cs (id UUID PRIMARY KEY, labor_id UUID,
  indication VARCHAR(60), urgency VARCHAR(20), surgeon_id INT,
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET);
CREATE TABLE ivf_cycles (id UUID PRIMARY KEY, patient_id INT,
  cycle_n INT, start_date DATE, protocol VARCHAR(40),
  oocytes_retrieved INT, fertilized INT, blastocysts INT,
  transfer_date DATE, outcome VARCHAR(20));
CREATE TABLE ivf_embryos (id UUID PRIMARY KEY, cycle_id UUID,
  embryo_label VARCHAR(20), grade VARCHAR(10), day_n INT,
  status VARCHAR(20), -- 'fresh_transfer','frozen','discarded','pgd_pending'
  pgd_result VARCHAR(20));
CREATE TABLE ivf_cryostore (id UUID PRIMARY KEY, sample_type VARCHAR(20),
  tank_id VARCHAR(20), location VARCHAR(40),
  patient_id INT, frozen_at DATETIMEOFFSET, expiry DATETIMEOFFSET,
  consent_active BIT);
```

### 4.2 Vector
- `kb_guidelines_obgyn` (ACOG, RCOG, FIGO)
- `kb_ivf_protocols` (ESHRE, ASRM)
- `kb_local_sop_labor`

## 5) Frontend
ANC visit card, Pregnancy timeline, Labor partograph, CS booking,
IVF cycle planner, Embryo registry grid, Cryostore inventory.
Components: `<Partograph>`, `<GestationalWheel>`, `<EmbryoGradingPad>`, `<CryostoreMap>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `obgyn_anc_pathway.bpmn`, `obgyn_labor_partograph.bpmn`, `ivf_cycle_lifecycle.bpmn`, `ivf_pgd_workflow.bpmn`.
```gherkin
Feature: Preeclampsia screening
  Scenario: High-risk by 1st-trimester screen
    Given screen returns risk = 1:50
    When result is recorded
    Then aspirin 150 mg starting <16 weeks is recommended and ordered
    And MFM clinic referral is created
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#ec4899`. Seeders 50 pregnancies, 20 IVF cycles, 100 embryos, 50 cryo. PDPL (very strict; reproductive data sensitive), CBAHI maternity, MoH IVF licensing, Islamic ART ethics regulations KSA.

## 23) Risks
Embryo legal disposition rules KSA; cross-border surrogacy prohibited; cryostore disaster recovery; PGD ethics oversight.
