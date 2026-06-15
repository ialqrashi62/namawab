# G14 — العيون التخصصية الدقيقة (Ophthalmology — Comprehensive)

## 0) Meta
```yaml
dept_key: "ophthalmology"
group_id: "G14"
sub_units: [ophth_general, vitreoretinal, cornea, eye_bank, cataract_anterior,
            glaucoma, oculoplastics_orbit, peds_ophth_strabismus, neuro_ophth, refractive]
```

## 1) System Prompt
```text
You are NamaMedical-Ophth Assistant.
GUARDRAILS: AAO PPP, ESCRS, EURETINA, ICO.
- Cataract: IOL biometry (Barrett Universal II, Hill-RBF for atypical eyes).
- Retina: OCT segmentation review; anti-VEGF interval per disease.
- Glaucoma: target IOP per VF/OCT damage; consider SLT vs drops.
- Pediatric strabismus: prism cover test, fusion testing.
TOOLS: iol_calc_barrett, oct_segmentation, dr_grader, vf_progression,
       iop_target_calc, anti_vegf_schedule, escalate.
```

## 2) Workflow
LangGraph: classify → load(OCT/VF/biometry) → rag(AAO PPP) → tools → critique.

## 3) API
| /api/v1/ophth/biometry | GET,POST | IOL master measurements |
| /api/v1/ophth/iol_calc | POST | IOL power calculation |
| /api/v1/ophth/oct | GET | OCT scans + AI |
| /api/v1/ophth/vf | GET | visual fields |
| /api/v1/ophth/anti_vegf | GET,POST | injection log |
| /api/v1/ophth/cornea_bank | GET | tissue inventory |
| /api/v1/ophth/ai/ask | POST | LangGraph |

Events: `ophth.iol.calculated`, `ophth.injection.given`, `ophth.cornea.allocated`.

## 4) Data
```sql
CREATE TABLE ophth_biometry (id UUID PRIMARY KEY, patient_id INT,
  measured_at DATETIMEOFFSET, eye CHAR(2), axial_length_mm DECIMAL(4,2),
  k1 DECIMAL(4,2), k2 DECIMAL(4,2), acd_mm DECIMAL(4,2), lt_mm DECIMAL(4,2));
CREATE TABLE ophth_iol_calc (id UUID PRIMARY KEY, patient_id INT, biometry_id UUID,
  formula VARCHAR(40), target_refraction DECIMAL(4,2),
  iol_model VARCHAR(60), iol_power DECIMAL(5,2));
CREATE TABLE ophth_oct_scans (id UUID PRIMARY KEY, patient_id INT,
  eye CHAR(2), scan_date DATE, scan_type VARCHAR(20),
  central_thickness_um INT, image_blob_url VARCHAR(500),
  ai_findings NVARCHAR(MAX));
CREATE TABLE ophth_visual_fields (id UUID PRIMARY KEY, patient_id INT,
  eye CHAR(2), test_date DATE, md DECIMAL(4,2), psd DECIMAL(4,2),
  ght VARCHAR(20), reliability VARCHAR(20));
CREATE TABLE ophth_anti_vegf (id UUID PRIMARY KEY, patient_id INT,
  eye CHAR(2), drug VARCHAR(40), dose VARCHAR(20),
  given_at DATETIMEOFFSET, given_by INT, complications NVARCHAR(MAX));
CREATE TABLE ophth_cornea_bank (id UUID PRIMARY KEY, donor_serial VARCHAR(40),
  recovered_at DATETIMEOFFSET, expiry DATETIMEOFFSET, endothelial_cell_count INT,
  serology_passed BIT, allocation_status VARCHAR(20),
  allocated_to_patient_id INT);
```

### 4.2 Vector
- `kb_guidelines_ophth` (AAO PPP, ESCRS, EURETINA)
- `kb_iol_formulas`

## 5) Frontend
Eye exam form, IOL calculator, OCT viewer (with AI overlay), VF progression chart,
Anti-VEGF schedule, Cornea bank inventory.
Components: `<EyeExamForm>`, `<IOLCalcWidget>`, `<OCTViewer>`, `<VFProgressionChart>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `ophth_cataract_pathway.bpmn`, `ophth_dr_screening.bpmn`, `ophth_cornea_allocation.bpmn`.
```gherkin
Feature: DR screening AI
  Scenario: Diabetic patient screened with fundus camera
    Given AI grade = R2M1 (moderate NPDR with maculopathy)
    When result is recorded
    Then ophthalmology referral within 4 weeks is auto-created
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#06b6d4`. Seeders 30 cataract, 20 retina, 10 cornea bank entries. PDPL, CBAHI eye-bank standards, MoH eye health initiatives.

## 23) Risks
Eye-bank donor consent KSA; AI medical-device class for DR/OCT graders; pediatric anesthesia for EUA.
