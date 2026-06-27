# G09 — الجلدية (Dermatology, Cosmetic, Surgical & Onco-Derm)

## 0) Meta
```yaml
dept_key: "dermatology"
dept_name_en: "Dermatology, Cosmetic Derm, Dermatosurgery, Onco-Derm, Phototherapy"
dept_name_ar: "الأمراض الجلدية والتجميلية والجراحية وعلاج الأورام الجلدية"
group_id: "G09"
sub_units: [dermatology_general, cosmetic_derm, dermatosurgery,
            dermatologic_oncology, phototherapy]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Derm Assistant.
ROLE: Help dermatologists, dermo-surgeons, derm-onc, aesthetic clinicians, phototherapy nurses.
GUARDRAILS: AAD, EADV, BAD, KSA-derm consensus.
- Skin lesion AI screening is ADVISORY ONLY; final dx by clinician.
- Biologics: TB/HBV/HCV screen as G07 rules.
- Phototherapy: track cumulative J/cm2 per session/lifetime.
- Cosmetic procedures: PDPL+SFDA compliance for filler/laser device classes.
TOOLS: search_patient, lesion_image_triage, dlqi_score, pasi_score,
       biologic_select, mohs_planner, phototherapy_dose_calc,
       check_drug_interaction, pull_protocol, escalate.
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, skin_type_fitzpatrick, allergies, photosensitive_meds}
recent: {last_pasi, last_dlqi, biopsy_results, phototherapy_cumulative_j}
```

### 1.3 Few-shot
```
Q: 35M psoriasis BSA 18%, PASI 16, DLQI 19, methotrexate failed. Next?
A: Severe; consider biologic. Anti-IL-17 (secukinumab/ixekizumab) or anti-IL-23 (guselkumab).
   Pre-bio screen as G07. Check for psoriatic arthritis (refer rheum if joint sx).
   Next-best-action: pre-bio panel + SHARED decision; education; smoking/alcohol counsel.

Q: Suspicious lesion 8mm, asymm, multi-color. Plan?
A: ABCDE-positive → urgent biopsy (excisional with 1-2mm margin). Dermoscopy doc.
   If melanoma: BRAF/NRAS, sentinel-node assessment per Breslow >0.8mm.
   Next-best-action: book excisional biopsy; counsel patient.
```

## 2) Workflow
LangGraph: classify → load(images+history) → rag(AAD) → tools(image_triage/PASI) → critique → human (always for image AI).

## 3) Backend / API
| /api/v1/derm/lesion_photos | GET,POST | image upload + AI |
| /api/v1/derm/scores | GET,POST | PASI/DLQI/SCORAD |
| /api/v1/derm/phototherapy_sessions | GET,POST | UVB/PUVA |
| /api/v1/derm/cosmetic_procedures | GET,POST | filler/laser/peel logs |
| /api/v1/derm/mohs_cases | GET,POST | Mohs surgery tracker |
| /api/v1/derm/ai/ask | POST | LangGraph |

Events: `derm.lesion.ai_flagged`, `derm.phototherapy.dose_warning`, `derm.cosmetic.completed`.

## 4) Data
```sql
CREATE TABLE derm_lesion_photos (id UUID PRIMARY KEY, patient_id INT,
  body_site VARCHAR(40), captured_at DATETIMEOFFSET, image_blob_url VARCHAR(500),
  ai_label VARCHAR(40), ai_confidence DECIMAL(3,2), clinician_dx VARCHAR(60));
CREATE TABLE derm_scores (id UUID PRIMARY KEY, patient_id INT,
  score_name VARCHAR(20), value DECIMAL(5,2), recorded_at DATETIMEOFFSET);
CREATE TABLE derm_phototherapy (id UUID PRIMARY KEY, patient_id INT,
  session_date DATE, modality VARCHAR(20), -- 'NBUVB','PUVA','UVA1','Excimer'
  dose_mj_cm2 INT, cumulative_j DECIMAL(8,2), erythema_grade TINYINT);
CREATE TABLE derm_cosmetic (id UUID PRIMARY KEY, patient_id INT,
  procedure VARCHAR(60), product VARCHAR(80), units DECIMAL(6,2),
  performed_at DATETIMEOFFSET, performed_by INT, complications NVARCHAR(MAX));
CREATE TABLE derm_mohs (id UUID PRIMARY KEY, patient_id INT, lesion_site VARCHAR(40),
  histology VARCHAR(40), stages_n INT, final_clear BIT, repair VARCHAR(60));
```

### 4.2 Vector
- `kb_guidelines_derm` (AAD, EADV, BAD)
- `kb_local_sop_phototherapy`
- `kb_cosmetic_devices_sfda`

## 5) Frontend
Lesion-photo viewer (with dermoscopy overlay + AI badge), PASI/DLQI tracker,
Phototherapy scheduler with dose graph, Cosmetic procedure log, Mohs map sheet.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `derm_biopsy_pathway.bpmn`, `derm_phototherapy_cycle.bpmn`, `derm_mohs_workflow.bpmn`.
```gherkin
Feature: Phototherapy cumulative dose alert
  Scenario: PUVA approaching lifetime limit
    Given patient cumulative PUVA = 1900 J/cm2
    When new session is being booked
    Then system warns of skin cancer risk and requires senior approval
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#f472b6`. Seeders 30 derm pts, 10 lesions for AI, 20 phototherapy. PDPL, SFDA cosmetic device class compliance, advertising rules for cosmetic services.

## 23) Risks
Image storage size (high-res); patient consent for image AI training; cosmetic claims advertising; teledermatology scope limits.
