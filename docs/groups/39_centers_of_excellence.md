# G39 — مراكز التميز المتكاملة (Centers of Excellence — Multi-Specialty Hubs)

## 0) Meta
```yaml
dept_key: "centers_of_excellence"
group_id: "G39"
sub_units:
  - heart_vascular_center
  - comprehensive_cancer_center
  - ortho_spine_center
  - advanced_fertility_center
  - ent_head_neck_center
  - trauma_center
  - burn_center
  - transplant_center
  - geriatric_center
  - pain_center
  - bariatric_metabolic_center
  - childrens_hospital
  - behavioral_health_center
  - eye_institute
  - neuroscience_stroke_center
  - women_fetal_center
nature: "cross-cutting — composes other groups"
```

## 1) System Prompt
```text
You are NamaMedical-CoE Assistant.
ROLE: Provide cross-departmental, patient-journey-oriented coordination across the
Center of Excellence selected by the user.
GUARDRAILS: Inherit guardrails of all composed sub-groups (e.g., Heart-Vascular CoE inherits
G01+G11+G21+G24+G25 rules).
- Default to the strictest guardrail when conflicts arise.
- Always show: composing departments, current pathway stage, next milestones.
TOOLS:
- coe_pathway_router(coe, condition)
- mdt_meeting_pack(coe, patient_id)
- outcomes_dashboard(coe)
- patient_journey_summary(patient_id, coe)
- escalate
```

## 2) Workflow
LangGraph: classify(coe + intent) → load(cross-dept context) → rag(per-CoE composite KB) → tools → critique → human (always for cross-team decisions).

### 2.1 CoE composition map
| CoE | Composes |
|-----|----------|
| Heart & Vascular | G01 + G11 + G21 + G25 |
| Cancer | G05 + G21 + G22 + G28 + G37 |
| Ortho & Spine | G12 + G13 + G27 |
| Advanced Fertility | G18 + G22 |
| ENT-Head-Neck | G15 + G05 + G21 + G28 |
| Trauma | G24 + G10 + G12 + G25 + G34 |
| Burn | G17 + G25 + G27 + G28 |
| Transplant | G04 + G05 + G10 + G25 |
| Geriatric | G06 + G27 + G30 + G31 + G32 |
| Pain | G26 + G27 + G30 |
| Bariatric & Metabolic | G06 + G10 + G31 |
| Children's Hospital | G19 + G20 + G26 + G37 |
| Behavioral Health | G24-psych + G32 + G37 |
| Eye Institute | G14 + G21 |
| Neuroscience & Stroke | G12 + G24 + G25 + G27 |
| Women & Fetal | G18 + G19 + G21 + G40 |

## 3) API
| /api/v1/coe/{coe_key}/dashboard | GET | composite KPIs |
| /api/v1/coe/{coe_key}/patients | GET | enrolled patients |
| /api/v1/coe/{coe_key}/pathways | GET,POST | unified care pathways |
| /api/v1/coe/{coe_key}/mdt | GET,POST | MDT meetings |
| /api/v1/coe/{coe_key}/outcomes | GET | outcome registries |
| /api/v1/coe/ai/ask | POST | LangGraph |

Events: `coe.{key}.patient.enrolled`, `coe.{key}.mdt.decided`, `coe.{key}.pathway.completed`.

## 4) Data
```sql
CREATE TABLE coe_definitions (id UUID PRIMARY KEY, coe_key VARCHAR(40) UNIQUE,
  name_ar NVARCHAR(120), name_en VARCHAR(120),
  composes_groups NVARCHAR(MAX));
CREATE TABLE coe_enrollments (id UUID PRIMARY KEY, coe_key VARCHAR(40),
  patient_id INT, enrolled_at DATETIMEOFFSET, lead_doctor_id INT,
  pathway_template VARCHAR(60), status VARCHAR(20));
CREATE TABLE coe_mdt_meetings (id UUID PRIMARY KEY, coe_key VARCHAR(40),
  meeting_at DATETIMEOFFSET, attendees NVARCHAR(MAX),
  patients_discussed NVARCHAR(MAX), decisions NVARCHAR(MAX));
CREATE TABLE coe_outcomes (id UUID PRIMARY KEY, coe_key VARCHAR(40),
  patient_id INT, measure VARCHAR(60), value DECIMAL(12,3),
  measured_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_coe_pathways_{coe_key}` — per-CoE composite knowledge

## 5) Frontend
CoE landing page (composing depts, KPIs, enrolled patients), Pathway viewer,
MDT scheduler with rich agenda, Outcome registry, Patient journey timeline.
Components: `<CoEHeader>`, `<PathwayStepGrid>`, `<MDTAgenda>`, `<JourneyTimeline>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `coe_cancer_pathway.bpmn`, `coe_stroke_pathway.bpmn`, `coe_transplant_pathway.bpmn`.
```gherkin
Feature: Stroke CoE patient journey
  Scenario: From ED to inpatient rehab
    Given Code Stroke activated and tPA given
    When patient stabilized
    Then CoE enrolls patient automatically into stroke pathway
    And neurology + neurorehab + SLP teams notified with shared timeline
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent per CoE (inherits from primary group). Seeders 5 enrollments per CoE. PDPL, CBAHI service-line standards, MoH CoE designations.

## 23) Risks
Cross-team accountability gaps; KPI reconciliation across composing depts; PHI access scope.
