# G17 — التجميل والترميم والحروق وجراحة الفكين (Plastic, Reconstructive, Burns, Maxillofacial)

## 0) Meta
```yaml
dept_key: "plastic_burns"
group_id: "G17"
sub_units: [plastic_face, plastic_body_contour, microsurgery, composite_allotransplant,
            burn_chemical, burn_icu, burn_reconstruction, maxfac_orthognathic, maxfac_trauma]
```

## 1) System Prompt
```text
You are NamaMedical-Plastic-Burns Assistant.
GUARDRAILS: ASPS, IAPS, ISBI burn care, AOCMF maxfac, ABA TBSA & Parkland.
- Burns: TBSA via Lund-Browder (peds) or rule-of-9s; Parkland fluid; inhalation injury workup.
- Microsurgery: free-flap monitoring (perfusion, color, temp, doppler hourly first 48h).
- Cosmetic: photo-consent, realistic outcomes, advertising compliance.
TOOLS: tbsa_calc, parkland_fluid, free_flap_monitor, mafface_classify,
       photo_consent_form, escalate.
```

## 2) Workflow
LangGraph: classify → load(burn admit data + photos) → rag → tools(TBSA/fluid) → critique.

## 3) API
| /api/v1/burns/admissions | GET,POST | burn admit + TBSA |
| /api/v1/burns/fluid | POST | Parkland calc + tracking |
| /api/v1/burns/wound_care | GET,POST | dressings, debridement |
| /api/v1/plastic/free_flaps | GET,POST | free-flap monitoring |
| /api/v1/plastic/cosmetic | GET,POST | aesthetic procedures |
| /api/v1/maxfac/cases | GET,POST | orthognathic, trauma |
| /api/v1/plastic/ai/ask | POST | LangGraph |

Events: `burn.admit`, `burn.fluid.warning`, `flap.compromised.alert`, `maxfac.case.completed`.

## 4) Data
```sql
CREATE TABLE burn_admissions (id UUID PRIMARY KEY, patient_id INT,
  admit_at DATETIMEOFFSET, burn_mechanism VARCHAR(40),
  tbsa_pct DECIMAL(4,1), depth_distribution_json NVARCHAR(MAX),
  inhalation_injury BIT, abi BIT, parkland_total_ml INT,
  outcome VARCHAR(40));
CREATE TABLE burn_fluid_tracking (id UUID PRIMARY KEY, burn_admit_id UUID,
  hour_n INT, target_ml INT, actual_ml INT, urine_output_ml INT, map_mmhg INT);
CREATE TABLE burn_wound_care (id UUID PRIMARY KEY, burn_admit_id UUID,
  done_at DATETIMEOFFSET, area VARCHAR(40), dressing VARCHAR(40),
  debridement BIT, photo_blob_url VARCHAR(500));
CREATE TABLE plastic_free_flaps (id UUID PRIMARY KEY, patient_id INT,
  flap_type VARCHAR(40), recipient_site VARCHAR(40), surgery_date DATE,
  monitor_status VARCHAR(20), salvage_attempts INT);
CREATE TABLE plastic_flap_obs (id UUID PRIMARY KEY, flap_id UUID,
  observed_at DATETIMEOFFSET, color VARCHAR(20), temp_c DECIMAL(3,1),
  doppler_signal VARCHAR(20), capillary_refill_s DECIMAL(3,1));
CREATE TABLE plastic_cosmetic (id UUID PRIMARY KEY, patient_id INT,
  procedure VARCHAR(60), photos_consent BIT, before_photo_url VARCHAR(500),
  after_photo_url VARCHAR(500), satisfaction_score TINYINT);
CREATE TABLE maxfac_cases (id UUID PRIMARY KEY, patient_id INT,
  case_type VARCHAR(40), procedure VARCHAR(60), surgery_date DATE,
  hardware_used NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_burns` (ABA, ISBI, EBA)
- `kb_guidelines_plastic` (ASPS, IAPS)
- `kb_guidelines_maxfac` (AOCMF)

## 5) Frontend
Burn admit wizard (Lund-Browder), Fluid clock, Wound photo timeline, Flap monitoring board,
Cosmetic photo-pair viewer, Maxfac surgical planner.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `burn_admit_pathway.bpmn`, `flap_post_op_monitoring.bpmn`.
```gherkin
Feature: Free-flap compromise alert
  Scenario: Flap turns dusky in hour 6
    Given hourly flap obs records color = dusky and doppler weak
    Then take-back paged within 5 minutes
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fb923c`. Seeders: 10 burns, 5 free-flaps, 10 cosmetic, 10 maxfac. PDPL (extra-strict for cosmetic photos), CBAHI burn unit, MoH burn registry.

## 23) Risks
Burn ICU bed scarcity; cosmetic medico-legal photo retention; child-burn safeguarding referral.
