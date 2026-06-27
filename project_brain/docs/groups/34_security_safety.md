# G34 — الأمن والسلامة (Security, Occupational H&S, Disaster Management)

## 0) Meta
```yaml
dept_key: "security_safety"
group_id: "G34"
sub_units: [physical_security, workplace_violence_response, occupational_health_safety,
            radiation_chem_bio_safety, disaster_management, mass_casualty, medical_evacuation]
```

## 1) System Prompt
```text
You are NamaMedical-Safety Assistant.
GUARDRAILS: KSA Civil Defense, KSA NRC (radiation), OSHA-equivalent, JCI Environment of Care, IPSG.
- Workplace violence: red-alert button → security + nursing supervisor + HR dispatch.
- Mass casualty: ICS roles activated; surge capacity protocol.
- Bio/chem/rad: containment + decontamination per Civil Defense.
TOOLS: incident_classify, mci_simulator, decon_protocol,
       radiation_exposure_track, escalate.
```

## 2) Workflow
LangGraph: classify(incident type) → load(roster, resources) → rag → tools → critique → human (always).

## 3) API
| /api/v1/sec/incidents | GET,POST | security incidents |
| /api/v1/sec/red_alert | POST | panic button |
| /api/v1/ohs/exposures | POST | needlestick, chem, rad |
| /api/v1/disaster/plans | GET,POST | EOPs |
| /api/v1/disaster/drills | GET,POST | drill records |
| /api/v1/mci/activations | POST | mass casualty |
| /api/v1/safety/ai/ask | POST | LangGraph |

Events: `sec.incident.opened`, `sec.red_alert`, `mci.activated`, `ohs.exposure.reported`.

## 4) Data
```sql
CREATE TABLE sec_incidents (id UUID PRIMARY KEY, occurred_at DATETIMEOFFSET,
  location VARCHAR(60), kind VARCHAR(40), severity VARCHAR(20),
  narrative NVARCHAR(MAX), status VARCHAR(20));
CREATE TABLE sec_red_alerts (id UUID PRIMARY KEY, triggered_at DATETIMEOFFSET,
  triggered_by INT, location VARCHAR(60), responded_at DATETIMEOFFSET,
  resolved_at DATETIMEOFFSET);
CREATE TABLE ohs_exposures (id UUID PRIMARY KEY, employee_id INT,
  exposed_at DATETIMEOFFSET, type VARCHAR(20), source NVARCHAR(MAX),
  ppp_started BIT, follow_up_dates NVARCHAR(MAX));
CREATE TABLE disaster_plans (id UUID PRIMARY KEY, plan_name VARCHAR(80),
  version VARCHAR(10), approved_at DATETIMEOFFSET, file_blob_url VARCHAR(500));
CREATE TABLE disaster_drills (id UUID PRIMARY KEY, drill_date DATE,
  scenario VARCHAR(80), participants_count INT, lessons_learned NVARCHAR(MAX));
CREATE TABLE mci_activations (id UUID PRIMARY KEY, activated_at DATETIMEOFFSET,
  scenario VARCHAR(80), patients_count INT, beds_surged INT,
  deactivated_at DATETIMEOFFSET);
```

### 4.2 Vector
- `kb_safety_protocols` (Civil Defense, NRC, OSHA-equivalent, JCI EOC)

## 5) Frontend
Incident board, Panic button (mobile), OHS exposure form, EOP library,
Drill scheduler, MCI command console, Decontamination checklist.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `sec_workplace_violence.bpmn`, `mci_activation.bpmn`, `ohs_exposure_pathway.bpmn`.
```gherkin
Feature: Workplace violence panic
  Scenario: Nurse triggers red alert
    Given nurse presses red alert in ED bed 4
    Then security + nursing supervisor + on-call MD paged within 30s
    And incident logged with start timestamp
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#dc2626`. Seeders 10 incidents, 5 drills, 2 MCI scenarios. PDPL (workforce data), Civil Defense, KSA NRC, JCI EOC.

## 23) Risks
Drill realism vs disruption; cross-agency coordination during MCI; PPE supply for chem/bio events.
