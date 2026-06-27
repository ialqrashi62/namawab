# G23 — الفحوصات الوظيفية (ECG, EMG/NCS, EEG, PFT, Sweat/Allergy)

## 0) Meta
```yaml
dept_key: "functional_diagnostics"
group_id: "G23"
sub_units: [ecg_stress, dobutamine_stress_echo, holter, event_recorder,
            cerebral_angiography, bronchial_angiography,
            emg, ncs, evoked_potentials,
            eeg, video_eeg, sleep_eeg,
            pft, dlco, sweat_test, allergy_skin]
```

## 1) System Prompt
```text
You are NamaMedical-FuncDx Assistant.
GUARDRAILS: AHA, ASE, AANEM (EMG/NCS), ACNS (EEG), ATS/ERS (PFT), AAAAI (allergy).
- Pre-test: stop interfering meds, document baseline; consent for stress.
- Stress: protocol selection (Bruce/modified Bruce/pharm); termination criteria explicit.
- EEG: video-tagging seizures; spike-detection AI advisory.
TOOLS: stress_protocol_select, holter_arrhythmia_summary, eeg_seizure_detect,
       emg_pattern_classify, pft_interp, allergy_skin_interp, escalate.
```

## 2) Workflow
LangGraph: classify(test) → load(prior + meds) → rag → tools → critique.

## 3) API
| /api/v1/funcdx/ecg | GET,POST | 12-lead studies |
| /api/v1/funcdx/stress | GET,POST | stress test logs |
| /api/v1/funcdx/holter | GET,POST | rhythm streams + AI summary |
| /api/v1/funcdx/emg_ncs | GET,POST | EMG/NCS findings |
| /api/v1/funcdx/eeg | GET,POST | EEG + video sync |
| /api/v1/funcdx/pft | GET,POST | (shared with G02) |
| /api/v1/funcdx/sweat_allergy | GET,POST | sweat + skin tests |
| /api/v1/funcdx/ai/ask | POST | LangGraph |

Events: `funcdx.{test}.completed`, `funcdx.eeg.seizure.detected`, `funcdx.holter.afib.detected`.

## 4) Data
```sql
CREATE TABLE funcdx_stress_tests (id UUID PRIMARY KEY, patient_id INT,
  protocol VARCHAR(20), start_at DATETIMEOFFSET, end_at DATETIMEOFFSET,
  max_hr INT, max_bp VARCHAR(15), reason_terminated VARCHAR(60),
  symptoms NVARCHAR(MAX), st_changes NVARCHAR(MAX), conclusion NVARCHAR(MAX));
CREATE TABLE funcdx_holter (id UUID PRIMARY KEY, patient_id INT,
  start_at DATETIMEOFFSET, duration_h INT, total_beats INT,
  pvc_pct DECIMAL(4,1), pac_pct DECIMAL(4,1), afib_burden_pct DECIMAL(4,1),
  longest_pause_s DECIMAL(4,2), ai_summary NVARCHAR(MAX));
CREATE TABLE funcdx_emg_ncs (id UUID PRIMARY KEY, patient_id INT,
  study_date DATE, nerves_tested NVARCHAR(MAX), muscles_tested NVARCHAR(MAX),
  findings NVARCHAR(MAX), conclusion NVARCHAR(MAX));
CREATE TABLE funcdx_eeg (id UUID PRIMARY KEY, patient_id INT,
  start_at DATETIMEOFFSET, duration_h INT, video BIT,
  events_json NVARCHAR(MAX), ai_spike_count INT, conclusion NVARCHAR(MAX));
CREATE TABLE funcdx_sweat_test (id UUID PRIMARY KEY, patient_id INT,
  test_date DATE, chloride_meq INT, interpretation VARCHAR(40));
CREATE TABLE funcdx_allergy_skin (id UUID PRIMARY KEY, patient_id INT,
  test_date DATE, allergens_json NVARCHAR(MAX), positives_json NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_funcdx_protocols` (AHA stress, ACNS EEG, AANEM EMG)

## 5) Frontend
Stress test pad with HR/BP graph, Holter AI summary card, EEG viewer with seizure marks,
EMG/NCS structured form, Sweat-test result, Allergy skin grid.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `funcdx_stress_pathway.bpmn`, `funcdx_eeg_video_workflow.bpmn`.
```gherkin
Feature: Stress test termination
  Scenario: Hypertensive response > 230/110
    Given BP rises to 235/115 during Bruce stage 3
    Then test terminated, recovery monitoring 5 min, doctor notified
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#a3e635`. Seeders 30 ECGs, 20 holters, 15 EEGs, 20 EMGs, 20 PFTs. PDPL, CBAHI cardio-functional bundle, MoH device licensing.

## 23) Risks
Stress test cardiac arrest preparedness; EEG remote read coverage; Holter device fleet management.
