# G25 — العناية المركزة (Intensive Care Units — Medical, Surgical, Trauma, Cardiac, Neuro, PICU, NICU, Burn, Onc, Renal, Transplant, Obstetric)

## 0) Meta
```yaml
dept_key: "icu"
group_id: "G25"
sub_units: [micu, sicu, trauma_icu, ccu, post_pci_unit, post_cardiac_surgery_unit,
            neuro_icu, picu, nicu_link_g19, burn_icu_link_g17, oncology_icu,
            renal_icu, transplant_icu, obstetric_icu]
```

## 1) System Prompt
```text
You are NamaMedical-ICU Assistant.
GUARDRAILS: SCCM, ESICM, BTS sepsis, ARDSnet ventilation, KDIGO AKI, CCSAP.
- Sepsis: 1-hour bundle. ARDS: low-tidal-volume 6 ml/kg PBW, plateau ≤30.
- Sedation: RASS goals, daily SAT/SBT, ABCDEF bundle.
- AKI: KDIGO staging, RRT initiation criteria.
TOOLS: apache_ii, sofa_trend, vent_settings, sat_sbt_planner,
       sedation_titrator, vte_proph_icu, glycemic_protocol,
       ards_ventilation, escalate.
STYLE: Always include daily goals (FAST-HUG-BID).
```

## 2) Workflow
LangGraph: classify → load(streams: vent, vitals, drips, labs) → rag → tools(scores) → critique → human (always for major escalation).

## 3) API
| /api/v1/icu/admissions | GET,POST | ICU admit/discharge |
| /api/v1/icu/scores | GET | APACHE/SOFA/GCS streams |
| /api/v1/icu/vent | POST | ventilator settings + waveforms |
| /api/v1/icu/sedation | POST | RASS, SAT/SBT |
| /api/v1/icu/drips | POST | titration log |
| /api/v1/icu/handover | POST | ICU SBAR |
| /api/v1/icu/ai/ask | POST | LangGraph |

Events: `icu.admit`, `icu.sepsis.bundle.started`, `icu.vent.alarm.critical`, `icu.handover.completed`.

## 4) Data
```sql
CREATE TABLE icu_admissions (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  unit VARCHAR(20), admit_at DATETIMEOFFSET, discharge_at DATETIMEOFFSET,
  source VARCHAR(20), apache_ii INT, sofa_admit INT,
  outcome VARCHAR(20));
CREATE TABLE icu_vital_streams (id UUID PRIMARY KEY, admission_id UUID,
  recorded_at DATETIMEOFFSET, hr INT, bp_sys INT, bp_dia INT, map INT,
  rr INT, spo2 INT, temp_c DECIMAL(3,1), etco2 INT, cvp INT);
CREATE TABLE icu_vent_settings (id UUID PRIMARY KEY, admission_id UUID,
  set_at DATETIMEOFFSET, mode VARCHAR(20), tv_ml INT, rr INT,
  peep INT, fio2 DECIMAL(3,2), pinsp INT, pplat INT, p_driving INT);
CREATE TABLE icu_sedation (id UUID PRIMARY KEY, admission_id UUID,
  recorded_at DATETIMEOFFSET, rass INT, cpot INT,
  drug VARCHAR(40), rate VARCHAR(20), sat_today BIT, sbt_today BIT);
CREATE TABLE icu_drips (id UUID PRIMARY KEY, admission_id UUID,
  drug VARCHAR(40), rate VARCHAR(40), changed_at DATETIMEOFFSET, changed_by INT);
CREATE TABLE icu_scores_stream (id UUID PRIMARY KEY, admission_id UUID,
  computed_at DATETIMEOFFSET, sofa INT, news2 INT, qsofa INT, gcs INT, fast_hug_bid_json NVARCHAR(MAX));
CREATE TABLE icu_handover (id UUID PRIMARY KEY, admission_id UUID,
  done_at DATETIMEOFFSET, from_user_id INT, to_user_id INT, sbar NVARCHAR(MAX));
```

### 4.2 Vector
- `kb_guidelines_icu` (SCCM, ESICM, ARDSnet, KDIGO)
- `kb_drips_titration_protocols`

## 5) Frontend
ICU bed map, Patient track sheet (vent + drips + scores), Daily goals (FAST-HUG-BID),
Sedation titration pad, Handover SBAR builder.
Components: `<BedMap>`, `<VentChart>`, `<DripBoard>`, `<DailyGoalsCard>`, `<RASSPad>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `icu_sepsis_bundle.bpmn`, `icu_ards_ventilation.bpmn`, `icu_extubation_pathway.bpmn`.
```gherkin
Feature: Sepsis 1-hour bundle
  Scenario: New qSOFA ≥ 2 in non-ICU patient
    Given patient on ward triggers qSOFA ≥ 2
    When clinician confirms
    Then 1-hour bundle items (cultures, lactate, fluids, abx, vasopressors if needed)
         are created with countdown
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#dc2626`. Seeders 20 ICU pts mix MICU/SICU/Neuro. PDPL, CBAHI critical care, MoH ICU bed reporting, JCI critical care.

## 23) Risks
Vent fleet uptime; sepsis early-warning false positives; family communication workflow; bed-block from downstream ward.
