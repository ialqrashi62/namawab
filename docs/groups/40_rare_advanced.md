# G40 — أقسام نادرة ومتقدمة جداً (Rare & Super-Specialized)

## 0) Meta
```yaml
dept_key: "rare_advanced"
group_id: "G40"
sub_units: [space_dive_medicine, sleep_disorders_psg, epilepsy_monitoring_unit,
            advanced_stem_cell, fetal_surgery, fetal_medicine_unit,
            dbs_movement_disorders, nuclear_therapy_isotopes,
            cryotherapy_cryosurgery, confocal_endomicroscopy,
            pharmacogenomics, nanomedicine_robotics]
```

## 1) System Prompt
```text
You are NamaMedical-RareAdvanced Assistant.
ROLE: Co-pilot for highly specialized programs with low volume but high complexity.
GUARDRAILS: National & international expert society guidelines per program; conservative defaults.
- ALL recommendations require senior specialist review (no autonomous decisions).
- Document conservation: extended retention (rare-disease registries, often lifelong).
- Pharmacogenomics: variant interpretation per CPIC + ACMG.
TOOLS: per-program specific (see below).
```

### 1.1 Per-program tools
- Space/Dive: `dcs_risk`, `o2_toxicity_calc`
- Sleep PSG: `psg_score_ai_review`
- EMU: `seizure_video_classifier`
- Stem cell: `cell_dose_calc`, `engraftment_predictor`
- Fetal surgery: `gestational_window_check`, `fetoscope_planner`
- DBS: `target_planner`, `programming_assistant`
- Nuclear therapy: `dose_optimization`, `radiation_safety_check`
- Cryo: `iceball_planner`
- Confocal: `image_features_classifier`
- Pharmacogenomics: `cpic_lookup`, `variant_interpreter`
- Nanomedicine: `delivery_planner` (research only)

## 2) Workflow
LangGraph: classify(program) → load(case + literature) → rag(specialty) → tools → critique → human (mandatory).

## 3) API
| /api/v1/rare/{program}/cases | GET,POST | per-program case mgmt |
| /api/v1/rare/{program}/registries | GET | rare-disease registries |
| /api/v1/rare/{program}/research_link | GET | linked clinical trials |
| /api/v1/rare/ai/ask | POST | LangGraph |

Events: `rare.{program}.case.opened`, `rare.{program}.case.completed`.

## 4) Data
```sql
CREATE TABLE rare_programs (id UUID PRIMARY KEY, program_key VARCHAR(40) UNIQUE,
  name_ar NVARCHAR(120), name_en VARCHAR(120),
  governing_body VARCHAR(120), license_no VARCHAR(60));
CREATE TABLE rare_cases (id UUID PRIMARY KEY, program_key VARCHAR(40),
  patient_id INT, opened_at DATETIMEOFFSET, lead_doctor_id INT,
  diagnosis VARCHAR(120), procedure VARCHAR(120), outcome VARCHAR(40),
  rare_disease_orpha_code VARCHAR(20));
CREATE TABLE pharmacogenomics_results (id UUID PRIMARY KEY, patient_id INT,
  gene VARCHAR(20), variant VARCHAR(60), phenotype VARCHAR(60),
  cpic_recommendation NVARCHAR(MAX), reported_at DATETIMEOFFSET);
CREATE TABLE rare_registry_links (id UUID PRIMARY KEY, case_id UUID,
  registry_name VARCHAR(120), registry_id VARCHAR(80), submitted_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_rare_diseases` (Orphanet, NORD, KSA rare-disease registry)
- `kb_pharmacogenomics_cpic`
- `kb_advanced_therapies` (FDA/EMA cell & gene therapy guidances)

## 5) Frontend
Per-program landing pages with case board, Registry submission pad,
Pharmacogenomics report viewer with CPIC actionable cards, Sim-only tools for
nanomedicine R&D.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard. Manual review gates everywhere.
- BPMN: `rare_case_intake.bpmn`, `pharmacogenomics_workflow.bpmn`, `dbs_program_pathway.bpmn`.
```gherkin
Feature: Pharmacogenomics actionable variant
  Scenario: CYP2C19 poor metabolizer prescribed clopidogrel
    Given variant report = poor metabolizer
    When physician orders clopidogrel for ACS
    Then CPIC alert recommends ticagrelor or prasugrel; physician can override with reason
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#06b6d4`. Seeders 2 cases per program. PDPL (long retention; sensitive genetic data),
KSA-MoH advanced therapies licensing, IAEA (nuclear), SFDA cell/gene therapy oversight,
MoH rare-disease registry submission.

## 23) Risks
Volume-too-low to maintain skills; ethics oversight intensity; long-term registry linkage;
genetic-data downstream consent.
