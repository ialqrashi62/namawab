# G36 — الجودة والاعتماد (Quality, Credentialing, Accreditation, Audit, Risk)

## 0) Meta
```yaml
dept_key: "quality_accreditation"
group_id: "G36"
sub_units: [tqm, credentialing_privileging, accreditation_jci_cap_iso,
            medical_audit, patient_complaints, risk_management,
            medical_liability, medical_errors_management]
```

## 1) System Prompt
```text
You are NamaMedical-Quality Assistant.
GUARDRAILS: CBAHI standards (KSA mandatory), JCI, CAP (lab), ISO 9001/15189/27001,
KSA-MoH quality contracts, IPSG (International Patient Safety Goals).
- Surveys: traceable evidence; gap analysis with mitigation owners + due dates.
- Adverse events: root-cause analysis (RCA-2) for sentinel; FMEA for processes.
TOOLS: cbahi_gap_scan, ipsg_check, rca2_template, fmea_template,
       audit_finding_summary, escalate.
```

## 2) Workflow
LangGraph: classify → load(standards + evidence) → rag(CBAHI) → tools(gap) → critique.

## 3) API
| /api/v1/qa/standards | GET | mapped per accreditation |
| /api/v1/qa/audits | GET,POST | audit findings |
| /api/v1/qa/cap_actions | POST | CAPA tracking |
| /api/v1/qa/incidents | GET,POST | OVR (extends existing) |
| /api/v1/qa/sentinel_rca | POST | RCA-2 |
| /api/v1/qa/credentialing | GET,POST | privileging |
| /api/v1/qa/risk_register | GET,POST | enterprise risk |
| /api/v1/qa/ai/ask | POST | LangGraph |

Events: `qa.audit.finding.created`, `qa.capa.due`, `qa.sentinel.declared`, `qa.privileging.expiring`.

## 4) Data
```sql
CREATE TABLE qa_standards (id UUID PRIMARY KEY, framework VARCHAR(20),
  code VARCHAR(20), name NVARCHAR(200), evidence_type VARCHAR(40));
CREATE TABLE qa_audits (id UUID PRIMARY KEY, standard_id UUID,
  performed_at DATETIMEOFFSET, auditor_id INT, finding NVARCHAR(MAX),
  severity VARCHAR(20), status VARCHAR(20));
CREATE TABLE qa_capa (id UUID PRIMARY KEY, audit_id UUID,
  action NVARCHAR(MAX), owner_id INT, due_date DATE, completed_at DATETIMEOFFSET);
CREATE TABLE qa_incidents (id UUID PRIMARY KEY, occurred_at DATETIMEOFFSET,
  patient_id INT, kind VARCHAR(40), severity VARCHAR(20),
  narrative NVARCHAR(MAX), reported_by INT, status VARCHAR(20));
CREATE TABLE qa_sentinel_rca (id UUID PRIMARY KEY, incident_id UUID,
  performed_at DATETIMEOFFSET, team NVARCHAR(MAX), root_causes NVARCHAR(MAX),
  contributing_factors NVARCHAR(MAX), action_plan NVARCHAR(MAX));
CREATE TABLE qa_credentialing (id UUID PRIMARY KEY, doctor_id INT,
  privileges NVARCHAR(MAX), valid_from DATE, valid_to DATE,
  primary_source_verified BIT, committee_approved_at DATETIMEOFFSET);
CREATE TABLE qa_risk_register (id UUID PRIMARY KEY, area VARCHAR(40),
  description NVARCHAR(MAX), likelihood TINYINT, impact TINYINT,
  inherent_score INT, controls NVARCHAR(MAX), residual_score INT, owner_id INT);
```

### 4.2 Vector
- `kb_cbahi_standards` (current KSA mandatory)
- `kb_jci_iso_standards`
- `kb_ipsg_protocols`

## 5) Frontend
Standards explorer with evidence binder, Audit pad, CAPA tracker,
OVR triage, RCA-2 builder, Privileging dashboard, Risk heatmap.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `qa_audit_capa_workflow.bpmn`, `qa_sentinel_rca.bpmn`, `qa_privileging_renewal.bpmn`.
```gherkin
Feature: Privilege expiring
  Scenario: Doctor's privileging valid_to within 60 days
    Given valid_to = 2026-07-01 and today = 2026-05-13
    Then renewal task created and notification sent to doctor + credentialing
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#fbbf24`. Seeders 50 standards, 20 audits, 10 incidents, 30 privileges. PDPL, CBAHI (mandatory), JCI, CAP, ISO, IPSG, MoH licensing.

## 23) Risks
Survey readiness drift; CAPA backlog; RCA quality variability; risk register staleness.
