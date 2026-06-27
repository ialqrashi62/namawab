# G12 — جراحة المخ والأعصاب والعمود الفقري (Neurosurgery & Spine Surgery)

## 0) Meta
```yaml
dept_key: "neurosurgery_spine"
group_id: "G12"
sub_units: [neurosurgery_general, cerebrovascular, neuro_oncology_surgery,
            functional_neurosurgery, peripheral_nerve, skull_base, endoscopic_neurosurg,
            spine_interventional, scoliosis_surgery]
```

## 1) System Prompt
```text
You are NamaMedical-NeuroSurg Assistant.
GUARDRAILS: AANS, CNS, NASS, EANS, WHO CNS tumor classification 2021.
- Pre-op: GCS, motor exam, imaging review (MRI/CT navigation), antiplatelet/anticoag plan.
- Awake craniotomy mapping cases get separate consent + speech path team.
- Spine: ASIA exam pre/post; navigation/robotics if used.
TOOLS: gcs_tracker, asia_exam, simpson_grade_meningioma, who_cns_classifier,
       dbs_target_planner, scoliosis_cobb, navigation_export, escalate.
```

## 2) Workflow
LangGraph: classify → load(GCS+imaging) → rag → tools(scores) → critique → human (always for high-risk).

## 3) API
| /api/v1/neuro/cases | GET,POST | craniotomy/spine/DBS/EVD |
| /api/v1/neuro/asia | GET,POST | spine motor/sensory grading |
| /api/v1/neuro/icp_logs | POST | bedside ICP/CPP |
| /api/v1/neuro/dbs/programming | POST | DBS settings log |
| /api/v1/neuro/scoliosis/cobb | POST | Cobb angle measurement |
| /api/v1/neuro/ai/ask | POST | LangGraph |

Events: `neuro.case.completed`, `neuro.icp.alert`, `neuro.dbs.programmed`.

## 4) Data
```sql
CREATE TABLE neuro_cases (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  procedure VARCHAR(60), pathology VARCHAR(80),
  scheduled_date DATE, awake BIT, navigation BIT, robotics BIT,
  start_at DATETIMEOFFSET, end_at DATETIMEOFFSET, ebl_ml INT,
  outcome VARCHAR(40), pathology_result NVARCHAR(MAX));
CREATE TABLE neuro_asia_exams (id UUID PRIMARY KEY, patient_id INT,
  exam_date DATETIMEOFFSET, motor_score INT, sensory_pin INT, sensory_light INT,
  asia_grade CHAR(1), level VARCHAR(10));
CREATE TABLE neuro_icp_logs (id UUID PRIMARY KEY, patient_id INT,
  taken_at DATETIMEOFFSET, icp_mmHg INT, cpp_mmHg INT, evd_drainage_ml INT,
  notes NVARCHAR(500));
CREATE TABLE neuro_dbs_programming (id UUID PRIMARY KEY, patient_id INT,
  programmed_at DATETIMEOFFSET, target VARCHAR(20), -- 'STN','GPi','VIM'
  amplitude_v DECIMAL(3,1), frequency_hz INT, pulse_us INT,
  side VARCHAR(5), benefit_pct DECIMAL(4,1));
CREATE TABLE neuro_scoliosis_measurements (id UUID PRIMARY KEY, patient_id INT,
  measured_at DATE, cobb_thoracic INT, cobb_lumbar INT, kyphosis INT,
  brace_treatment BIT, surgical_threshold_met BIT);
```

### 4.2 Vector
- `kb_guidelines_neurosurg` (AANS, CNS, NASS, EANS)
- `kb_who_cns_tumor_2021`

## 5) Frontend
Neurosurg schedule, Awake-mapping checklist, ICP bedside chart, DBS programming pad,
Scoliosis Cobb measurement viewer, Pathology integration view.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `neuro_brain_tumor_pathway.bpmn`, `neuro_dbs_workflow.bpmn`, `neuro_spine_fusion.bpmn`.
```gherkin
Feature: ICP alert
  Scenario: Sustained ICP > 22 mmHg for 5 minutes
    Given EVD in place with continuous ICP monitor
    When ICP exceeds threshold sustained
    Then bedside nurse + neuro on-call paged within 60s
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#7c3aed`. Seeders 20 neurosurg cases, 10 spine, 5 DBS. PDPL, CBAHI neurosurg bundle, SFDA implant traceability (DBS, fusion hardware).

## 23) Risks
Neuronavigation system uptime; intraop monitoring vendor lock-in; pediatric vs adult anesthesia neurosurg coverage.
