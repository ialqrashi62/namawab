# G15 — الأنف والأذن والحنجرة (ENT — Otolaryngology)

## 0) Meta
```yaml
dept_key: "ent"
group_id: "G15"
sub_units: [ent_general, head_neck_surgery, rhinology_skull_base,
            otology_neurotology, cochlear_implant, laryngology, thyroid_neck, sleep_surgery]
```

## 1) System Prompt
```text
You are NamaMedical-ENT Assistant.
GUARDRAILS: AAOHNS, ENT-UK, IFOS, AAO-HNSF guidelines.
- Audiogram interpretation type/degree; cochlear implant candidacy.
- Head/neck cancer staging (AJCC 8th); HPV status for oropharynx.
- Sleep surgery: sleep study + DISE before non-CPAP intervention.
TOOLS: audiogram_interp, ci_candidacy, ajcc_head_neck_stage,
       fess_planning, dise_score, escalate.
```

## 2) Workflow
LangGraph: classify → load(audio/imaging) → rag → tools → critique.

## 3) API
| /api/v1/ent/audiograms | GET,POST | hearing tests |
| /api/v1/ent/ci_candidates | GET,POST | cochlear workup |
| /api/v1/ent/head_neck_cancers | GET,POST | staging + MDT |
| /api/v1/ent/fess_cases | GET,POST | endoscopic sinus surgery |
| /api/v1/ent/dise | POST | drug-induced sleep endoscopy |
| /api/v1/ent/ai/ask | POST | LangGraph |

Events: `ent.audiogram.posted`, `ent.ci.activated`, `ent.cancer.mdt.decided`.

## 4) Data
```sql
CREATE TABLE ent_audiograms (id UUID PRIMARY KEY, patient_id INT,
  test_date DATE, ear CHAR(5), pta_4freq INT,
  ac_thresholds_json NVARCHAR(MAX), bc_thresholds_json NVARCHAR(MAX),
  type VARCHAR(20), degree VARCHAR(20));
CREATE TABLE ent_ci_workup (id UUID PRIMARY KEY, patient_id INT,
  evaluation_date DATE, candidacy_status VARCHAR(20), device_chosen VARCHAR(60),
  surgery_date DATE, activation_date DATE, mapping_visits_n INT);
CREATE TABLE ent_head_neck_cancers (id UUID PRIMARY KEY, patient_id INT,
  primary_site VARCHAR(40), histology VARCHAR(60), hpv_status VARCHAR(10),
  ajcc_stage VARCHAR(10), mdt_decision NVARCHAR(MAX), treatment NVARCHAR(MAX));
CREATE TABLE ent_fess_cases (id UUID PRIMARY KEY, patient_id INT,
  procedure_date DATE, sinus_involvement NVARCHAR(200), navigation BIT,
  complications NVARCHAR(MAX));
CREATE TABLE ent_dise (id UUID PRIMARY KEY, patient_id INT,
  procedure_date DATE, vote_score VARCHAR(20),
  intervention_recommended NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_ent` (AAOHNS, ENT-UK, IFOS)
- `kb_audiology_protocols`

## 5) Frontend
Audiogram entry/viewer, CI workup tracker, H&N MDT board, FESS planner with PACS link,
DISE recording log.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `ent_ci_pathway.bpmn`, `ent_oropharynx_cancer_mdt.bpmn`, `ent_fess_pathway.bpmn`.
```gherkin
Feature: Cochlear implant candidacy
  Scenario: Severe-profound bilateral SNHL
    Given pure-tone average ≥ 70 dB bilateral and aided word score < 50%
    When ENT evaluates
    Then candidacy = approved subject to imaging + medical clearance
    And MDT booking auto-created
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#0891b2`. Seeders 30 audiograms, 10 CI, 15 H&N. PDPL, CBAHI ENT bundles, SFDA cochlear device tracking.

## 23) Risks
Speech-therapy follow-up bandwidth post-CI; pediatric audiology workforce; HPV vaccine population strategy.
