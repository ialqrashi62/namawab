# G11 — جراحة القلب والصدر والأوعية (Cardiothoracic & Vascular Surgery)

## 0) Meta
```yaml
dept_key: "cts_vascular"
group_id: "G11"
sub_units: [open_heart_surgery, thoracic_surgery, airway_surgery,
            vascular_surgery, endovascular, vascular_grafts, venous_disease]
```

## 1) System Prompt
```text
You are NamaMedical-CTS-Vascular Assistant.
GUARDRAILS: STS, EACTS, SVS, ESVS, AHA peripheral.
- Pre-op: STS/EuroSCORE-II for cardiac; ankle-brachial index, TBI for PAD; CT-A for endograft sizing.
- Heparin protocol intra-op (ACT >300 for CPB).
- Post-op: extubation criteria, chest tube outputs, AKI surveillance.
TOOLS: sts_score, euroscore_ii, abi_calc, endograft_planner,
       cpb_perfusion_log, drain_output_tracker, escalate.
```

## 2) Workflow
LangGraph: classify → load(cardio risk + imaging) → rag → tools(scores) → critique.

## 3) API
| /api/v1/cts/cases | GET,POST | open heart / thoracic |
| /api/v1/vasc/cases | GET,POST | vascular cases |
| /api/v1/vasc/abi | GET,POST | ankle-brachial measurements |
| /api/v1/vasc/endograft/plan | POST | sizing tool |
| /api/v1/cts/cpb_logs | POST | perfusion logs |
| /api/v1/cts/ai/ask | POST | LangGraph |

Events: `cts.cpb.started`, `cts.cpb.weaned`, `vasc.endograft.deployed`.

## 4) Data
```sql
CREATE TABLE cts_cases (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  procedure VARCHAR(40), -- 'cabg','avr','mvr','aortic_root','bentall','rastelli'
  scheduled_date DATE, sts_mortality_pct DECIMAL(4,2),
  euroscore_ii DECIMAL(4,2), cpb_min INT, cross_clamp_min INT,
  outcome VARCHAR(40));
CREATE TABLE cts_perfusion_logs (id UUID PRIMARY KEY, case_id UUID,
  taken_at DATETIMEOFFSET, flow_l_min DECIMAL(3,1), map_mmHg INT,
  temp_c DECIMAL(3,1), act_sec INT, gases_json NVARCHAR(MAX));
CREATE TABLE vasc_cases (id UUID PRIMARY KEY, patient_id INT,
  procedure VARCHAR(40), -- 'evar','tevar','fem_pop_bypass','cea','venous_ablation'
  date DATE, contrast_ml INT, fluoro_min DECIMAL(5,1),
  graft_used VARCHAR(60), complications NVARCHAR(MAX));
CREATE TABLE vasc_abi_studies (id UUID PRIMARY KEY, patient_id INT,
  test_date DATE, abi_right DECIMAL(3,2), abi_left DECIMAL(3,2),
  tbi_right DECIMAL(3,2), tbi_left DECIMAL(3,2), interpretation NVARCHAR(MAX));
CREATE TABLE vasc_endografts (id UUID PRIMARY KEY, patient_id INT, vasc_case_id UUID,
  device VARCHAR(80), proximal_diameter_mm INT, distal_diameter_mm INT,
  length_mm INT, deployed_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_guidelines_cts` (STS, EACTS, AHA cardiac surgery)
- `kb_guidelines_vascular` (SVS, ESVS)

## 5) Frontend
CTS schedule, Perfusion live chart, Vascular case worklist, Endograft planner (interactive sizing), ABI input form.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `cts_cabg_pathway.bpmn`, `vasc_evar_workflow.bpmn`.
```gherkin
Feature: STS-based pre-op risk
  Scenario: High-risk CABG candidate
    Given STS mortality = 8.2% and EuroSCORE-II = 7.5
    When team reviews case
    Then alternative plan (PCI/medical) is suggested with documentation
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#ef4444`. Seeders 20 cardiac cases, 30 vascular. PDPL, CBAHI cardiac surgery bundle, MoH cardiac registry.

## 23) Risks
ECMO program governance; endograft long-term surveillance imaging; vascular emergency transfers.
