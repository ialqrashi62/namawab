# G21 — الأشعة والتصوير الطبي (Radiology, Interventional, Nuclear, Ultrasound, MRI, CT)

## 0) Meta
```yaml
dept_key: "radiology_imaging"
group_id: "G21"
sub_units: [diagnostic_radiology, interventional_radiology, ct_scan, ct_dual_energy, ct_cardiac,
            mri, mri_functional, mri_spectroscopy, mri_dti, mra_mrv, breast_pelvis_mri,
            ultrasound, tee, trus, fetal_4d, color_doppler,
            nuclear_medicine, pet_ct, bone_scan, thyroid_scan, renal_scan,
            myocardial_perfusion, i131_therapy, radioisotope_therapy]
```

## 1) System Prompt
```text
You are NamaMedical-Radiology Assistant.
GUARDRAILS: ACR Appropriateness, ESR iGuide, RANZCR, IAEA radiation safety, KSA-MoH PACS rules.
- Justification + dose optimization (ALARA) on every order.
- Contrast: eGFR + thyroid status + allergies; metformin if iv contrast & eGFR<30.
- AI-assisted reads ALWAYS clinician-overread; advisory only.
TOOLS: appropriateness_lookup, contrast_safety_check, ai_chest_xr,
       ai_ct_stroke_aspects, ai_mri_segmentation, dose_tracker,
       isotope_inventory, escalate.
```

## 2) Workflow
LangGraph: classify(modality+region) → load(prior images via PACS) → rag(ACR/ESR) → tools(appropriateness) → critique.

## 3) API
| /api/v1/rad/orders | GET,POST | imaging requests |
| /api/v1/rad/appropriateness | GET | ACR/ESR lookup |
| /api/v1/rad/contrast/check | POST | safety eligibility |
| /api/v1/rad/reports | GET,POST | structured report |
| /api/v1/rad/ai/{modality}/run | POST | trigger AI |
| /api/v1/rad/dose | GET,POST | per-study DLP/CTDI |
| /api/v1/nm/isotope_inventory | GET | radioisotope stock |
| /api/v1/rad/ai/ask | POST | LangGraph |

Events: `rad.order.created`, `rad.study.completed`, `rad.report.signed`, `rad.ai.completed`.

## 4) Data
```sql
CREATE TABLE rad_orders (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  modality VARCHAR(20), region VARCHAR(40), priority VARCHAR(10),
  indication NVARCHAR(300), contraindications NVARCHAR(MAX),
  approved_by INT, scheduled_at DATETIMEOFFSET);
CREATE TABLE rad_studies (id UUID PRIMARY KEY, order_id UUID,
  performed_at DATETIMEOFFSET, dicom_uid VARCHAR(120),
  pacs_url VARCHAR(500), dose_dlp DECIMAL(8,2), ctdi DECIMAL(6,2),
  contrast_ml INT, technologist_id INT);
CREATE TABLE rad_reports (id UUID PRIMARY KEY, study_id UUID,
  technique NVARCHAR(MAX), findings NVARCHAR(MAX),
  impression NVARCHAR(MAX), reported_by INT, reported_at DATETIMEOFFSET,
  addendum NVARCHAR(MAX));
CREATE TABLE rad_ai_results (id UUID PRIMARY KEY, study_id UUID,
  ai_model VARCHAR(60), version VARCHAR(20), result_json NVARCHAR(MAX),
  confidence DECIMAL(3,2), processed_at DATETIMEOFFSET);
CREATE TABLE rad_contrast_safety (id UUID PRIMARY KEY, patient_id INT,
  egfr DECIMAL(4,1), allergies NVARCHAR(300), thyroid_status VARCHAR(20),
  metformin_held BIT, cleared_at DATETIMEOFFSET);
CREATE TABLE nm_isotope_inventory (id UUID PRIMARY KEY, isotope VARCHAR(20),
  activity_mci DECIMAL(8,2), calibrated_at DATETIMEOFFSET, lot VARCHAR(40));
```

### 4.2 Vector
- `kb_guidelines_radiology` (ACR Appropriateness, ESR iGuide, RANZCR)
- `kb_radiation_safety` (IAEA, KSA NRC)
- `kb_radiology_lexicon` (RadLex, BI-RADS, LI-RADS, PI-RADS, TI-RADS)

## 5) Frontend
Worklist (modality-grouped), Order entry with appropriateness suggestions,
Structured report with templates, AI overlay viewer (OHIF integration),
Dose dashboard, Isotope inventory, Reading queue.
Components: `<OrderEntry>`, `<StructuredReport>`, `<DICOMViewerWithAI>`, `<DoseGauge>`, `<IsotopeStock>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard. PACS link mandatory.
- BPMN: `rad_order_workflow.bpmn`, `rad_ai_assisted_read.bpmn`, `nm_iodine_therapy.bpmn`.
```gherkin
Feature: Appropriateness gate
  Scenario: MRI lumbar spine for <6w back pain without red flags
    Given indication = mechanical LBP < 6 weeks, no red flags
    When order submitted
    Then system suggests deferral, returns ACR rating, requires override + reason
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#a78bfa`. Seeders 80 orders mix CT/MRI/US/NM, 40 reports, 10 AI results. PDPL, CBAHI imaging bundle, IAEA + KSA NRC compliance, MoH PACS standards.

## 23) Risks
Cross-PACS DICOM compatibility (existing NNCH/Cardiac/BADER PACS); AI medical-device class; isotope supply chain.
