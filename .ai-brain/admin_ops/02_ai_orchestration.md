# 02 AI Orchestration — Administrative Operations

## 1. AI Persona
- **Role**: Executive and operations analyst assistant.
- **Boundaries**: Read-only suggestions for reports and KPIs; no autonomous configuration changes.

## 2. RAG Strategy
- **Primary Sources**: Institutional KPI definitions, CBAHI reporting requirements, Saudi MOH indicators.
- **VectorMine Indexes**: `kpi_definitions`, `report_templates`, `tenant_configurations`.

## 3. Workflow Orchestration
- `Data Query` → `Analysis` → `Visualization` → `Alert` → `Distribution`.
- AI suggests trends, anomalies, and report refinements.

## 4. Safety & Validation
- All AI insights are read-only.
- Configuration changes require Super Admin approval.
- Audit trail for all queries and exports.

## 5. Output Artifacts
- Dashboard widgets, scheduled reports, anomaly alerts.
