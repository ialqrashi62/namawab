# G02 — قسم الجهاز التنفسي (Pulmonology & Respiratory)

## 0) Meta
```yaml
dept_key: "pulmonology"
dept_name_en: "Pulmonology & Respiratory"
dept_name_ar: "طب الصدر والجهاز التنفسي"
group_id: "G02"
sub_units: [pulmonology_general, allergic_pulmonology, sleep_medicine,
            respiratory_care, bronchoscopy_unit, home_oxygen]
status: "draft"
clinical_lead: "Dr. ___"
last_review: "2026-05-13"
```

## 1) Prompt Engineering
### 1.1 System Prompt
```text
You are NamaMedical-Pulmonology Assistant.
ROLE: Help pulmonologists, sleep specialists, RTs, ICU teams.
GUARDRAILS: Use GINA 2025 (asthma), GOLD 2025 (COPD), ATS/ERS guidelines, AASM (sleep).
- Always check SpO2, ABG, weight before O2/vent settings.
- Pediatric: use weight-based bronchodilator dosing.
TOOLS: search_patient, get_pft, get_abg, interpret_pft, stop_bang_score,
       chads_for_pulmonary_htn, vent_settings_recommender, oxygen_titrator,
       check_drug_interaction, pull_protocol, escalate.
STYLE: SOAP for notes; Next-best-action; Time-critical flag.
```

### 1.2 Context
```yaml
patient: {mrn, age, sex, weight_kg, smoking_pack_years, allergies, current_meds}
visit:   {id, type, doctor_id}
recent:  {last_pft, last_abg, last_chest_xr, last_ct_chest}
vitals:  {spo2, rr, hr, bp, peak_flow}
top_k_rag: 5
```

### 1.3 Few-shot
```
Q: 60M ex-smoker, FEV1=42% predicted, FEV1/FVC=0.55, dyspnea MRC3. Plan?
A: COPD GOLD III group D (frequent exacerb assumed if hx).
   Add LABA+LAMA (e.g., umeclidinium/vilanterol). Pulmonary rehab. Vaccines (flu, pneumo, COVID, RSV).
   Consider ICS only if eos≥300 or freq exacerb. Smoking-cessation counseling.
   Next-best-action: order eosinophil count + chest CT.

Q: 8yo, asthma, night cough 4×/week, SABA use 5×/week. Step?
A: Uncontrolled. GINA step up: low-dose ICS-formoterol (MART) PRN+regular.
   Spacer technique check. Trigger review. Allergy testing.
   Next-best-action: schedule asthma-action-plan review + spirometry if ≥6yo.
```

### 1.4 Self-critique
- [ ] Inhaler technique addressed? • Vaccines updated? • O2 target SpO2 88-92% (COPD) vs 94-98%?

## 2) Workflow & Orchestration
### 2.1 LangGraph nodes
classify → load_patient_ctx → rag(GINA/GOLD/ATS) → tools(pft/abg/interp) → compose → critique → human?
### 2.2 Chaining
- pft_interp → flag → trigger order_set(severe_asthma | copd_exacerb)
- sleep_study → AHI → CPAP titration recommendation
### 2.3 VectorMine entities
ICD10 (J45/J44/J96/G47.33), LOINC (PFT codes), RxNorm (inhalers)

## 3) Backend / API
| Path | Method | Purpose |
|------|--------|---------|
| /api/v1/pulm/pft | GET,POST | spirometry/lung volumes |
| /api/v1/pulm/abg | GET,POST | arterial blood gas |
| /api/v1/pulm/sleep_studies | GET,POST | PSG/HSAT |
| /api/v1/pulm/bronchoscopy | GET,POST | bronchoscopy logs |
| /api/v1/pulm/home_oxygen | GET,POST | rentals/refills |
| /api/v1/pulm/ai/ask | POST | LangGraph |

Events: `pulm.pft.completed`, `pulm.bronchoscopy.completed`, `pulm.sleep.titration.completed`

## 4) Data & Storage
```sql
CREATE TABLE pulm_pft_results (
  id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  test_date DATE, fev1_l DECIMAL(4,2), fvc_l DECIMAL(4,2),
  fev1_fvc_ratio DECIMAL(4,3), tlc_l DECIMAL(4,2), dlco DECIMAL(4,1),
  bronchodilator_response_pct DECIMAL(4,1),
  interpretation NVARCHAR(MAX), gold_stage CHAR(3));
CREATE TABLE pulm_abg ( id UUID PRIMARY KEY, patient_id INT,
  taken_at DATETIMEOFFSET, ph DECIMAL(4,3), pco2 INT, po2 INT,
  hco3 INT, base_excess DECIMAL(4,1), spo2 INT, fio2 DECIMAL(3,2));
CREATE TABLE pulm_sleep_studies (id UUID PRIMARY KEY, patient_id INT,
  study_date DATE, type VARCHAR(10), ahi DECIMAL(4,1), odi DECIMAL(4,1),
  rem_pct DECIMAL(4,1), recommended_cpap DECIMAL(3,1));
CREATE TABLE pulm_bronchoscopy (id UUID PRIMARY KEY, patient_id INT,
  procedure_date DATE, indication NVARCHAR(300), findings NVARCHAR(MAX),
  bal_taken BIT, biopsy_taken BIT, complications NVARCHAR(500));
CREATE TABLE pulm_home_oxygen (id UUID PRIMARY KEY, patient_id INT,
  start_date DATE, lpm DECIMAL(3,1), hours_per_day INT, device VARCHAR(40));
```

### 4.2 Vector
- `kb_guidelines_pulm` (GINA, GOLD, ATS/ERS, AASM)
- `kb_local_sop_pulm`
- `kb_drug_formulary_resp` (inhalers, biologics, antibiotics)

### 4.3 RAG ingest
GINA-2025.pdf, GOLD-2025.pdf, ATS-COPD-management.pdf, AASM-OSA.pdf, local SOPs.

## 5) Frontend / UI-UX
Screens: Dashboard, PFT viewer (flow-volume loop), Sleep dashboard (CPAP titration), Bronch report builder, Home-O2 tracker.
Components: `<PFTChart>`, `<AHIBadge>`, `<CPAPTitrator>`, `<InhalerTechniqueChecklist>`.
Imagery: lungs hero, sleep mask, spirometer.

## 6) Infra/DevOps
Container `ghcr.io/nama/pulm-api`; Helm `charts/pulm/`; CI: lint+test+build+deploy staging→prod (manual approve).

## 7) Testing
Unit: PFT interpreters, BMI/STOP-BANG calc. Integration: PFT request→result→ai_interp→note. E2E: order spirometry → result rendered → SOAP draft.

## 8-15) Wireframes/BPMN/ERD/Stories/Tests/Arch/Security/Deploy
- Wireframes: `NamaMedical-Pulm-v1`
- BPMN: `flows/pulm_copd_exacerb.bpmn`, `pulm_sleep_titration.bpmn`, `pulm_bronchoscopy.bpmn`
- ERD: patient ─ pft ─ abg ─ sleep ─ bronch ─ home_o2
- Gherkin sample:
```gherkin
Feature: Sleep study titration
  Scenario: AHI severe with O2 desat
    Given patient AHI=42, ODI=35, BMI=38
    When study uploaded
    Then system suggests CPAP 9-11 cmH2O auto
    And schedules titration follow-up in 4 weeks
```
- STRIDE: PFT report tampering, blob storage of bronchoscopy video.
- Deploy: blue/green; rollback ≤5m.

## 16-17) Style/i18n
Accent `#22d3ee`. Keys ~200 (`pulmonology.dashboard.title`, `pulm.sleep.cpap.label`...).

## 18-19) Seeders/Migrations
seeders/pulm_seed.sql (40 patients mix asthma/COPD/OSA). migrations V001 core, V002 sleep, V003 home_o2.

## 20-21) Manual/Training
TOC: Login → PFT → Sleep → Bronch → Home-O2 → Reports. Videos V01-V05 (≤5m each).

## 22) Compliance
PDPL, CBAHI (asthma/COPD bundles), MoH chronic disease registry, SFDA device reporting (CPAP/BiPAP).

## 23) Risks
AI PFT interpreter validation; CPAP compliance data privacy; tobacco control reporting.
