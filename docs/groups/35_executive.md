# G35 — الإدارة التنفيذية والطبية (Executive Administration, CMO/CNO/CFO/COO, Ethics)

## 0) Meta
```yaml
dept_key: "executive"
group_id: "G35"
sub_units: [ceo_office, cmo, cno, cfo, coo, medical_staff_council,
            ethics_committee, patient_care_committee]
```

## 1) System Prompt
```text
You are NamaMedical-Exec Assistant.
GUARDRAILS: Governance frameworks (Saudi Code of Corporate Governance), CBAHI leadership chapters,
KSA-MoH performance contracts (Vision 2030), HCAHPS-equivalent patient experience.
- Provide aggregate, de-identified data only; respect role-based access.
- Ethics referrals routed via committee workflow.
TOOLS: kpi_lookup, exec_dashboard_query, ethics_case_router, escalate.
```

## 2) Workflow
LangGraph: classify(query type) → load(KPI cube) → rag(governance) → tools → critique.

## 3) API
| /api/v1/exec/kpis | GET | rolling KPI snapshots |
| /api/v1/exec/dashboards | GET | role-based exec views |
| /api/v1/exec/strategic_initiatives | GET,POST | OKRs |
| /api/v1/ethics/cases | GET,POST | ethics committee |
| /api/v1/exec/board_packs | GET,POST | board meeting packs |
| /api/v1/exec/ai/ask | POST | LangGraph |

Events: `exec.kpi.threshold.breached`, `ethics.case.opened`, `exec.board.pack.published`.

## 4) Data
```sql
CREATE TABLE exec_kpis (id UUID PRIMARY KEY, kpi_name VARCHAR(60),
  scope VARCHAR(40), measured_at DATETIMEOFFSET, value DECIMAL(12,3),
  target DECIMAL(12,3), unit VARCHAR(20));
CREATE TABLE exec_initiatives (id UUID PRIMARY KEY, name VARCHAR(120),
  owner_id INT, objective NVARCHAR(MAX), key_results NVARCHAR(MAX),
  start_date DATE, end_date DATE, status VARCHAR(20));
CREATE TABLE ethics_cases (id UUID PRIMARY KEY, opened_at DATETIMEOFFSET,
  patient_id INT NULL, summary NVARCHAR(MAX), urgency VARCHAR(20),
  decision NVARCHAR(MAX), closed_at DATETIMEOFFSET);
CREATE TABLE exec_board_packs (id UUID PRIMARY KEY, period VARCHAR(20),
  published_at DATETIMEOFFSET, file_blob_url VARCHAR(500));
```

### 4.2 Vector
- `kb_governance` (KSA corporate governance, CBAHI leadership)
- `kb_ethics_frameworks` (bioethics references)

## 5) Frontend
Exec dashboard (KPIs, throughput, LOS, readmission, NPS, P&L), Initiative tracker (OKR view),
Ethics case board, Board pack publisher.
Components: `<KPITile>`, `<OKRTracker>`, `<EthicsCaseCard>`, `<BoardPackBuilder>`.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `exec_kpi_review.bpmn`, `ethics_case_workflow.bpmn`.
```gherkin
Feature: KPI alert
  Scenario: 30-day readmission rate above target
    Given monthly readmission rate = 14% (target ≤10%)
    Then exec dashboard flags red, owner notified, root-cause review scheduled
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#0f172a`. Seeders 24 monthly KPIs, 5 OKRs, 3 ethics cases. PDPL, CBAHI leadership, MoH performance reporting.

## 23) Risks
Vanity metrics; KPI gaming; ethics committee response time; data democratization vs role privacy.
