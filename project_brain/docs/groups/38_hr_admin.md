# G38 — الموارد البشرية والإدارة (HR, Training, Legal, Public Relations, Customer Service)

## 0) Meta
```yaml
dept_key: "hr_admin"
group_id: "G38"
sub_units: [hr_recruitment, career_planning, training_development, legal_affairs,
            public_relations_media, community_outreach, customer_service_call_center]
```

## 1) System Prompt
```text
You are NamaMedical-HR/Admin Assistant.
GUARDRAILS: KSA Labor Law, Saudization (Nitaqat), GOSI, KSA Health Workforce Strategy 2030,
data privacy on personnel files (PDPL).
- Recruitment: SCFHS license verification + primary source verification.
- Training: competency mapping per role; mandatory annual modules.
TOOLS: license_verify, training_due, performance_review_pack,
       leave_balance_calc, escalate.
```

## 2) Workflow
LangGraph: classify → load(employee record + policies) → rag(KSA labor law) → tools → critique.

## 3) API
| /api/v1/hr/employees | GET,POST | extends existing hr_* |
| /api/v1/hr/recruitment/positions | GET,POST | open roles |
| /api/v1/hr/training/modules | GET,POST | LMS-light |
| /api/v1/hr/performance | POST | reviews + ratings |
| /api/v1/legal/cases | GET,POST | legal cases |
| /api/v1/pr/media | GET,POST | press, social |
| /api/v1/cs/call_center | POST | inbound calls + tickets |
| /api/v1/hr/ai/ask | POST | LangGraph |

Events: `hr.candidate.shortlisted`, `hr.training.completed`, `hr.review.signed`, `legal.case.opened`.

## 4) Data
```sql
CREATE TABLE hr_positions (id UUID PRIMARY KEY, title VARCHAR(80),
  dept_key VARCHAR(40), required_license VARCHAR(40), opened_at DATE,
  filled_at DATE, status VARCHAR(20));
CREATE TABLE hr_candidates (id UUID PRIMARY KEY, position_id UUID,
  name NVARCHAR(120), license_no VARCHAR(40), license_verified BIT,
  stage VARCHAR(20), decision VARCHAR(20));
CREATE TABLE hr_training_modules (id UUID PRIMARY KEY, name VARCHAR(120),
  audience NVARCHAR(MAX), frequency_months INT, mandatory BIT);
CREATE TABLE hr_training_records (id UUID PRIMARY KEY, employee_id INT,
  module_id UUID, completed_at DATETIMEOFFSET, score DECIMAL(4,1),
  next_due DATE);
CREATE TABLE hr_performance_reviews (id UUID PRIMARY KEY, employee_id INT,
  reviewer_id INT, period VARCHAR(20), rating VARCHAR(20),
  goals NVARCHAR(MAX), signed_at DATETIMEOFFSET);
CREATE TABLE legal_cases (id UUID PRIMARY KEY, opened_at DATETIMEOFFSET,
  type VARCHAR(40), counterparty NVARCHAR(120), status VARCHAR(20),
  amount_at_risk DECIMAL(12,2));
CREATE TABLE pr_media (id UUID PRIMARY KEY, channel VARCHAR(20),
  published_at DATETIMEOFFSET, topic VARCHAR(120), reach INT, sentiment VARCHAR(20));
CREATE TABLE cs_calls (id UUID PRIMARY KEY, called_at DATETIMEOFFSET,
  caller VARCHAR(120), category VARCHAR(40), agent_id INT, resolved BIT,
  ticket_id UUID);
```

### 4.2 Vector
- `kb_ksa_labor_law`
- `kb_pr_brand_guidelines`

## 5) Frontend
HR dashboard, Job board, ATS pipeline, Training catalog, Review pad,
Legal case board, PR calendar, Call center console.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `hr_recruitment_pipeline.bpmn`, `hr_onboarding.bpmn`, `cs_complaint_resolution.bpmn`.
```gherkin
Feature: Mandatory training overdue
  Scenario: BLS expired
    Given BLS next_due < today for clinical staff
    Then access to clinical modules is restricted until renewed
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#7c3aed`. Seeders 50 employees, 20 positions, 200 trainings. PDPL, KSA Labor, GOSI, Saudization, MoH PR rules.

## 23) Risks
Saudization quota; training completion enforcement; legal data confidentiality; brand-voice consistency.
