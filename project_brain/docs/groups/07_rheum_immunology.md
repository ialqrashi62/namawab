# G07 — الروماتيزم والمناعة (Rheumatology & Clinical Immunology)

## 0) Meta
```yaml
dept_key: "rheum_immunology"
dept_name_en: "Rheumatology, Clinical Immunology, Autoimmune & Allergy"
dept_name_ar: "الأمراض الروماتيزمية والمناعية والحساسية"
group_id: "G07"
sub_units: [rheumatology, clinical_immunology, autoimmune_diseases, allergy_asthma]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Rheum Assistant.
ROLE: Help rheumatologists, immunologists, allergy specialists, infusion nurses.
GUARDRAILS: ACR 2024, EULAR 2024, ACAAI/EAACI for allergy, CARRA for pediatric.
- Biologic init: TB screen (IGRA), HBV/HCV serology, vaccinations updated, CBC/LFT.
- Steroid taper protocol; bone protection (Ca/Vit D/biphosphonate as needed).
TOOLS: search_patient, das28_calc, sledai_calc, asas_axspa, basdai,
       biologic_select, mtx_dose_check, infusion_pre_meds,
       allergy_skin_test_interp, anaphylaxis_protocol,
       check_drug_interaction, pull_protocol, escalate.
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, allergies, pregnancy, infections_history}
labs: {esr, crp, anti_ccp, rf, ana, anti_dsdna, c3, c4, cbc, lfts, igra}
disease_activity: {current_score, last_3_scores}
```

### 1.3 Few-shot
```
Q: RA, DAS28=5.6 on MTX 20mg + HCQ. Step?
A: High activity despite csDMARD combo. Add bDMARD (TNFi as 1st line if no contraindication)
   or JAKi. Pre-bio screen: IGRA, HBV/HCV, CBC, LFT. Vaccines (no live).
   Next-best-action: schedule pre-bio panel; counsel infection risk.

Q: SLE flare, SLEDAI 14, urine RBC casts, low C3/C4. Plan?
A: Likely class III/IV LN suspected. Renal biopsy. Pulse methylpred 1g x3 + MMF 2-3g/d
   or cyclophosphamide. Hydroxychloroquine continue. BP control (ACEi).
   Next-best-action: nephrology + biopsy schedule; PCP prophylaxis.
```

## 2) Workflow
LangGraph: classify → load(scores+labs) → rag(ACR/EULAR) → tools(scoring/dose) → critique.

## 3) Backend / API
| /api/v1/rheum/disease_activity | GET,POST | DAS28/SLEDAI/BASDAI |
| /api/v1/rheum/biologics | GET,POST | infusion log + TDM |
| /api/v1/rheum/allergy/tests | GET,POST | skin/SPT/ImmunoCAP |
| /api/v1/rheum/anaphylaxis_kit | POST | bedside kit checkout |
| /api/v1/rheum/ai/ask | POST | LangGraph |

Events: `rheum.flare.detected`, `rheum.biologic.administered`, `rheum.anaphylaxis.alerted`.

## 4) Data
```sql
CREATE TABLE rheum_disease_activity (id UUID PRIMARY KEY, patient_id INT,
  disease VARCHAR(20), score_name VARCHAR(20), score_value DECIMAL(5,2),
  components_json NVARCHAR(MAX), recorded_at DATETIMEOFFSET);
CREATE TABLE rheum_biologics_admin (id UUID PRIMARY KEY, patient_id INT,
  drug VARCHAR(60), dose_mg DECIMAL(8,2), route VARCHAR(20),
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET,
  reaction NVARCHAR(MAX), tdm_level DECIMAL(6,2));
CREATE TABLE rheum_allergy_tests (id UUID PRIMARY KEY, patient_id INT,
  test_type VARCHAR(20), test_date DATE, allergens_json NVARCHAR(MAX),
  positive_panel NVARCHAR(MAX));
CREATE TABLE rheum_pre_bio_screen (id UUID PRIMARY KEY, patient_id INT,
  igra_done DATE, hbv_done DATE, hcv_done DATE, vaccinations NVARCHAR(MAX),
  cleared BIT, cleared_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_guidelines_rheum` (ACR, EULAR, CARRA, ACAAI, EAACI)
- `kb_drug_formulary_biologics`

## 5) Frontend
Disease-activity timeline, Biologic infusion calendar, Allergy panel viewer, Anaphylaxis kit checkout.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `rheum_pre_bio_clearance.bpmn`, `rheum_anaphylaxis.bpmn`.
```gherkin
Feature: Pre-biologic clearance gate
  Scenario: Initiating TNFi without TB screen
    Given patient has no IGRA in last 12mo
    When physician orders adalimumab
    Then order is held with reason "tb_screen_pending"
    And IGRA + CXR ordered automatically
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fde047`. Seeders 30 RA, 15 SLE, 20 axSpA. PDPL, CBAHI biologics stewardship, SFDA biologic adverse reporting.

## 23) Risks
Biosimilar substitution policy, biologics cold chain, pediatric vs adult disease scoring.
