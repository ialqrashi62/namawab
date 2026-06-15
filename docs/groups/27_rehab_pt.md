# G27 — العلاج الطبيعي والتأهيل (PM&R, PT, OT, SLP, Spinal-Cord/Pediatric Rehab, Prosthetics, Play Therapy)

## 0) Meta
```yaml
dept_key: "rehab_pt"
group_id: "G27"
sub_units: [physical_therapy, electrotherapy, hydrotherapy, manual_therapy,
            postop_pt, spine_pain_pt,
            occupational_therapy, sensory_integration,
            speech_therapy, swallowing_therapy_vfss,
            spinal_cord_rehab, pediatric_rehab, prosthetics_orthotics, child_life_play_therapy]
```

## 1) System Prompt
```text
You are NamaMedical-Rehab Assistant.
GUARDRAILS: APTA, AOTA, ASHA, ISCoS (SCI), AACPDM (peds rehab), ISPO (P&O).
- Outcome measures: 6MWT, Berg, BBS, FIM, GAS goals.
- Pediatric: developmental milestones + family-centered care.
- SLP swallow safety: dysphagia diet matched to VFSS.
TOOLS: outcome_score_calc, fim_tracker, vfss_safety,
       prosthesis_alignment_check, escalate.
```

## 2) Workflow
LangGraph: classify → load(diagnosis + last assessment) → rag → tools(score) → critique.

## 3) API
| /api/v1/rehab/plans | GET,POST | rehab plan + goals |
| /api/v1/rehab/sessions | GET,POST | per-session log |
| /api/v1/rehab/outcomes | GET,POST | 6MWT, Berg, FIM |
| /api/v1/rehab/swallow | POST | VFSS results |
| /api/v1/rehab/prosthetics | GET,POST | P&O fittings |
| /api/v1/rehab/peds | GET,POST | sensory/play therapy |
| /api/v1/rehab/ai/ask | POST | LangGraph |

Events: `rehab.plan.created`, `rehab.session.completed`, `rehab.outcome.improved`.

## 4) Data
```sql
CREATE TABLE rehab_plans (id UUID PRIMARY KEY, patient_id INT,
  diagnosis VARCHAR(60), discipline VARCHAR(20), goals_json NVARCHAR(MAX),
  start_date DATE, end_date DATE, frequency_per_week INT);
CREATE TABLE rehab_sessions (id UUID PRIMARY KEY, plan_id UUID,
  session_date DATETIMEOFFSET, therapist_id INT, modalities NVARCHAR(MAX),
  patient_response NVARCHAR(MAX), pain_pre INT, pain_post INT);
CREATE TABLE rehab_outcomes (id UUID PRIMARY KEY, patient_id INT,
  measured_at DATETIMEOFFSET, measure VARCHAR(20), value DECIMAL(6,2));
CREATE TABLE rehab_swallow_studies (id UUID PRIMARY KEY, patient_id INT,
  study_date DATE, aspiration_risk VARCHAR(20),
  recommended_diet VARCHAR(40), strategies NVARCHAR(MAX));
CREATE TABLE rehab_prosthetics (id UUID PRIMARY KEY, patient_id INT,
  device_type VARCHAR(40), fitted_at DATE, alignment_notes NVARCHAR(MAX),
  follow_up_date DATE);
CREATE TABLE rehab_peds_play (id UUID PRIMARY KEY, patient_id INT,
  session_date DATETIMEOFFSET, modality VARCHAR(40), goals_progress NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_rehab` (APTA, AOTA, ASHA, ISCoS)
- `kb_outcome_measures`

## 5) Frontend
Rehab plan builder, Session log with quick modalities, Outcome trend charts,
Swallow report, Prosthetics fitting log, Peds play-therapy notes.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `rehab_post_stroke.bpmn`, `rehab_post_arthroplasty.bpmn`, `rehab_swallow_pathway.bpmn`.
```gherkin
Feature: Discharge readiness via FIM
  Scenario: FIM threshold met
    Given total FIM ≥ 100 over 2 consecutive assessments
    Then care team is prompted to plan discharge
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#84cc16`. Seeders 30 plans, 200 sessions. PDPL, CBAHI rehab, MoH disability registry, ISPO P&O standards.

## 23) Risks
Therapist staffing ratios; home-program adherence; tele-rehab device certification.
