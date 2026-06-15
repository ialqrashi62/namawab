# G06 — الغدد الصماء والسكري والاستقلاب (Endocrinology, Diabetes & Metabolism)

## 0) Meta
```yaml
dept_key: "endocrine_diabetes"
dept_name_en: "Endocrinology, Diabetology & Metabolic Bone"
dept_name_ar: "الغدد الصماء والسكري والتمثيل الغذائي"
group_id: "G06"
sub_units: [endocrinology, diabetology_t1, diabetology_t2, gestational_dm,
            diabetic_complications, metabolic_bone, obesity_medicine]
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Endocrine Assistant.
ROLE: Help endocrinologists, diabetes nurses, dietitians, podiatrists.
GUARDRAILS: ADA Standards of Care 2025, EASD, AACE, Endocrine Society guidelines.
- Insulin titration: weight-based + carb ratio + correction factor; check eGFR.
- Pregnancy: tighter targets (FBG<95, 1h<140, 2h<120 mg/dL).
- DKA/HHS: protocolized fluid+insulin+K+electrolytes; not pediatric-adult-mix.
TOOLS: search_patient, get_glucose_logs, get_cgm_stream, hba1c_trend,
       insulin_titrator, carb_ratio_calc, dka_protocol, hhs_protocol,
       thyroid_function_panel, ostpr_frax, obesity_meds_select,
       check_drug_interaction, pull_protocol, escalate.
STYLE: SOAP; cite ADA SoC chapter; flag time-critical (DKA, severe hypo).
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, bmi, dm_type, dx_year, allergies, pregnancy}
recent: {hba1c, fasting_glucose, cgm_summary, lipids, microalbumin, foot_exam}
meds: {insulin_regimen, oral_agents, glp1_sglt2}
top_k_rag: 5
```

### 1.3 Few-shot
```
Q: T1DM 22F, HbA1c 8.4%, hypo 2x/week. Plan?
A: Optimize basal-bolus or pump+CGM. Reduce overnight basal 10-20% (Somogyi),
   review carb-counting accuracy, education re: hypo unawareness.
   Next-best-action: 2-week CGM trial; CDE referral; recheck A1c 3mo.

Q: 60F, T2DM, A1c 9.2%, eGFR 38, ASCVD. Add-on?
A: Prefer GLP-1 RA with proven CV benefit (semaglutide) OR dapagliflozin (eGFR 25-45 OK).
   Avoid metformin if eGFR<30 (caution 30-45). Statin high-intensity, ASA per risk.
   Next-best-action: foot exam, retinal screen, ACR.
```

## 2) Workflow
LangGraph: classify → load(labs+CGM) → rag(ADA) → tools(insulin_titrate/dka) → compose → critique.
Chains: DKA → fluid → insulin drip → K replace → bicarb decision → transition.

## 3) Backend / API
| Path | Method | Purpose |
|------|--------|---------|
| /api/v1/endo/glucose | GET,POST | POC + CGM ingestion |
| /api/v1/endo/insulin/titrate | POST | recommend dose change |
| /api/v1/endo/dka_protocol | POST | start/track DKA orders |
| /api/v1/endo/foot_exams | GET,POST | annual + at-risk |
| /api/v1/endo/thyroid | GET,POST | TFTs + nodules |
| /api/v1/endo/ai/ask | POST | LangGraph |

Events: `endo.cgm.ingested`, `endo.dka.started`, `endo.foot.high_risk`.

## 4) Data
```sql
CREATE TABLE endo_glucose_logs (id UUID PRIMARY KEY, patient_id INT,
  taken_at DATETIMEOFFSET, value_mgdl INT, source VARCHAR(10), -- 'poc','cgm','lab'
  meal_context VARCHAR(20));
CREATE TABLE endo_cgm_streams (id UUID PRIMARY KEY, patient_id INT,
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, device VARCHAR(40),
  tir_pct DECIMAL(4,1), tbr_pct DECIMAL(4,1), tar_pct DECIMAL(4,1),
  gmi DECIMAL(3,1), cv_pct DECIMAL(4,1), data_blob_url VARCHAR(500));
CREATE TABLE endo_insulin_regimens (id UUID PRIMARY KEY, patient_id INT,
  type VARCHAR(20), basal_units DECIMAL(4,1), bolus_ratio NVARCHAR(60),
  correction_factor INT, target_low INT, target_high INT, updated_at DATETIMEOFFSET);
CREATE TABLE endo_dka_episodes (id UUID PRIMARY KEY, patient_id INT,
  onset_at DATETIMEOFFSET, ph DECIMAL(4,3), bicarb INT, anion_gap INT,
  glucose_admit INT, k_admit DECIMAL(3,1), resolved_at DATETIMEOFFSET);
CREATE TABLE endo_foot_exams (id UUID PRIMARY KEY, patient_id INT,
  exam_date DATE, monofilament BIT, vibration BIT, pulses VARCHAR(40),
  ulcer_present BIT, wagner_grade TINYINT, risk_category TINYINT);
CREATE TABLE endo_thyroid_nodules (id UUID PRIMARY KEY, patient_id INT,
  side VARCHAR(5), size_mm INT, ti_rads TINYINT, fnac_done BIT, fnac_result VARCHAR(40));
```

### 4.2 Vector
- `kb_guidelines_endo` (ADA SoC, EASD, AACE, ETA, ATA)
- `kb_local_sop_endo` (DKA pathway, sick-day rules)
- `kb_drug_formulary_endo`

## 5) Frontend
Screens: Diabetes dashboard (TIR/A1c trends), CGM viewer (AGP), Insulin titration wizard,
Foot exam form, Thyroid nodule tracker.
Components: `<TIRGauge>`, `<AGPChart>`, `<InsulinDoseAdvisor>`, `<TIRADSBadge>`.

## 6-7) Infra/CI/Tests: standard.

## 8-15) BPMN/ERD/Stories
- BPMN: `endo_dka_pathway.bpmn`, `endo_gestational_dm.bpmn`, `endo_foot_screening.bpmn`.
```gherkin
Feature: Insulin titration suggestion
  Scenario: Persistent fasting hyperglycemia
    Given last 7 days fasting glucose mean = 180 mg/dL on glargine 30u
    When endocrine reviews
    Then system suggests glargine increase by 10% (3u) every 3 days until <130
    And alerts on hypo events
```
- STRIDE: CGM data interception, insulin pump telemetry.

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#f59e0b`. Seeders 60 dm pts, 10 thyroid nodules, 15 foot risk. PDPL, CBAHI diabetes, MoH NCD program (HEFAZ/PHC).

## 23) Risks
CGM device interoperability (Dexcom/Libre/Medtronic); insulin pump cyber risk; pediatric DM workflow vs adult.
