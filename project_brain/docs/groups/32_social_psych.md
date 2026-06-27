# G32 — الخدمات الاجتماعية والنفسية (Medical Social Work, Patient Relations, Health Education, EAP)

## 0) Meta
```yaml
dept_key: "social_psych"
group_id: "G32"
sub_units: [medical_social_work, discharge_coordination, child_elder_protection,
            patient_relations_advocacy, health_education, employee_assistance_program]
```

## 1) System Prompt
```text
You are NamaMedical-Social Assistant.
GUARDRAILS: KSA Social Affairs (مسار), MoH Patient Rights, EAP confidentiality, mandatory reporting laws.
- Discharge planning: clinical readiness + caregiver capacity + transport + meds.
- Suspected abuse/neglect: MANDATORY report path; never deny escalation.
- Cultural sensitivity to KSA family structure.
TOOLS: discharge_readiness, social_risk_score, abuse_report_workflow,
       eap_referral, escalate.
```

## 2) Workflow
LangGraph: classify → load(social hx + barriers) → rag(MoH protocols) → tools → critique → human (always for safeguarding).

## 3) API
| /api/v1/social/cases | GET,POST | social work cases |
| /api/v1/social/discharge_plans | POST | discharge planning |
| /api/v1/social/safeguarding | POST | abuse/neglect report |
| /api/v1/patrel/complaints | GET,POST | complaints + resolution |
| /api/v1/heduc/sessions | GET,POST | health education |
| /api/v1/eap/referrals | GET,POST | employee EAP |
| /api/v1/social/ai/ask | POST | LangGraph |

Events: `social.case.opened`, `safeguard.report.filed`, `complaint.resolved`.

## 4) Data
```sql
CREATE TABLE social_cases (id UUID PRIMARY KEY, patient_id INT,
  opened_at DATETIMEOFFSET, sw_id INT, issues NVARCHAR(MAX), status VARCHAR(20));
CREATE TABLE social_discharge_plans (id UUID PRIMARY KEY, patient_id INT, visit_id INT,
  caregiver_capacity VARCHAR(40), home_safety VARCHAR(40), transport VARCHAR(40),
  meds_arranged BIT, follow_ups_arranged BIT, ready BIT);
CREATE TABLE social_safeguarding (id UUID PRIMARY KEY, patient_id INT,
  reported_at DATETIMEOFFSET, type VARCHAR(40), narrative NVARCHAR(MAX),
  reported_by INT, authority_notified VARCHAR(60));
CREATE TABLE patrel_complaints (id UUID PRIMARY KEY, patient_id INT,
  filed_at DATETIMEOFFSET, channel VARCHAR(20), category VARCHAR(40),
  narrative NVARCHAR(MAX), resolved_at DATETIMEOFFSET, resolution NVARCHAR(MAX));
CREATE TABLE heduc_sessions (id UUID PRIMARY KEY, patient_id INT,
  topic VARCHAR(60), session_date DATETIMEOFFSET, educator_id INT,
  comprehension_check BIT);
CREATE TABLE eap_referrals (id UUID PRIMARY KEY, employee_id INT,
  referred_at DATETIMEOFFSET, reason VARCHAR(80), confidential BIT, outcome VARCHAR(40));
```

### 4.2 Vector
- `kb_social_pathways`
- `kb_safeguarding_legal_ksa`

## 5) Frontend
Social work inbox, Discharge planning checklist, Safeguarding form (mandatory reporter path),
Complaint dashboard with SLA, Education catalog, EAP confidential intake.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `social_discharge_pathway.bpmn`, `social_safeguarding_workflow.bpmn`, `complaint_resolution.bpmn`.
```gherkin
Feature: Safeguarding mandatory report
  Scenario: Suspected child abuse
    Given suspicion documented
    Then case routed to designated team within 1 hour
    And legal authority notified per KSA child protection law
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#a3a3a3`. Seeders 20 social cases, 15 complaints. PDPL, CBAHI patient rights, KSA child/elder protection laws, EAP confidentiality contract.

## 23) Risks
Confidentiality vs mandatory reporting tension; complaint SLA tracking; cultural taboos around mental health (link G15-psych ER).
