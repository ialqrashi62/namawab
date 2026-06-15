# G37 — التعليم والبحث العلمي (Medical Education, Residency, Research, IRB, Library, Simulation)

## 0) Meta
```yaml
dept_key: "education_research"
group_id: "G37"
sub_units: [internship, residency, fellowships, cme,
            clinical_trials, basic_science, clinical_pharmacology, irb,
            biostatistics, publication_office, medical_library, simulation_center]
```

## 1) System Prompt
```text
You are NamaMedical-Education/Research Assistant.
GUARDRAILS: SCFHS curricula, ACGME/ACGME-International, ICH-GCP, KSA NCBE for IRB,
KSA-MoH research ethics.
- IRB workflow: protocol → review → approval → amendment → adverse events.
- Trainees: rotation tracking, competency milestones (EPAs).
TOOLS: rotation_planner, epa_assessor, irb_protocol_check,
       trial_eligibility_match, citation_lookup, escalate.
```

## 2) Workflow
LangGraph: classify → load(curricula/protocols) → rag → tools → critique.

## 3) API
| /api/v1/edu/trainees | GET,POST | residents/fellows |
| /api/v1/edu/rotations | GET,POST | rotation calendar |
| /api/v1/edu/epas | POST | competency assessments |
| /api/v1/edu/cme | GET,POST | CME activities |
| /api/v1/research/protocols | GET,POST | studies |
| /api/v1/research/irb_reviews | POST | IRB decisions |
| /api/v1/research/aes | POST | adverse events |
| /api/v1/sim/scenarios | GET,POST | simulation library |
| /api/v1/library/holdings | GET | books/journals/databases |
| /api/v1/edu/ai/ask | POST | LangGraph |

Events: `edu.rotation.scheduled`, `edu.epa.assessed`, `research.irb.approved`, `research.ae.reported`.

## 4) Data
```sql
CREATE TABLE edu_trainees (id UUID PRIMARY KEY, person_id INT,
  level VARCHAR(20), program VARCHAR(60), pgy_year TINYINT,
  start_date DATE, expected_end DATE);
CREATE TABLE edu_rotations (id UUID PRIMARY KEY, trainee_id UUID,
  dept_key VARCHAR(40), start_date DATE, end_date DATE, supervisor_id INT);
CREATE TABLE edu_epas (id UUID PRIMARY KEY, trainee_id UUID,
  epa_code VARCHAR(20), level INT, assessor_id INT, assessed_at DATETIMEOFFSET,
  comments NVARCHAR(MAX));
CREATE TABLE edu_cme (id UUID PRIMARY KEY, person_id INT,
  activity VARCHAR(120), credits DECIMAL(4,1), date DATE,
  certificate_url VARCHAR(500));
CREATE TABLE research_protocols (id UUID PRIMARY KEY, title NVARCHAR(300),
  pi_id INT, protocol_no VARCHAR(40), status VARCHAR(20),
  irb_decision VARCHAR(20), approved_at DATETIMEOFFSET);
CREATE TABLE research_aes (id UUID PRIMARY KEY, protocol_id UUID,
  patient_id INT, occurred_at DATETIMEOFFSET, severity VARCHAR(20),
  expectedness VARCHAR(20), reported_to_irb_at DATETIMEOFFSET);
CREATE TABLE sim_scenarios (id UUID PRIMARY KEY, name VARCHAR(120),
  category VARCHAR(40), level VARCHAR(20), duration_min INT, briefing_url VARCHAR(500));
CREATE TABLE library_holdings (id UUID PRIMARY KEY, type VARCHAR(20),
  title VARCHAR(200), author VARCHAR(120), year INT, location VARCHAR(60),
  electronic_url VARCHAR(500));
```

### 4.2 Vector
- `kb_curricula` (SCFHS, ACGME)
- `kb_research_methods` (ICH-GCP, NCBE)
- `kb_simulation_scenarios`

## 5) Frontend
Trainee dashboard, Rotation grid, EPA assessor, CME tracker,
Research workspace (protocol, IRB packet, AE log), Simulation booking, Library search.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `edu_rotation_workflow.bpmn`, `research_irb_review.bpmn`, `research_ae_reporting.bpmn`.
```gherkin
Feature: Trial eligibility match
  Scenario: New patient meets active oncology trial criteria
    Given patient diagnosis = HER2+ MBC, line=2, ECOG=1
    Then matching trials surfaced to oncologist with one-click referral
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#06b6d4`. Seeders 30 trainees, 50 rotations, 10 protocols, 5 AEs. PDPL (research data), NCBE, ICH-GCP, SFDA clinical trials.

## 23) Risks
IRB capacity; trainee duty-hour compliance; trial recruitment; library licensing.
