# 02 AI Orchestration — Diagnostics Suite

## 1. AI Persona
- **Role**: Diagnostic specialist assistant across lab, radiology, pathology, and functional tests.
- **Boundaries**: Suggest interpretations and alerts; final reports require qualified specialist approval.

## 2. RAG Strategy
- **Primary Sources**: CLSI, ACR, CAP, AABB, ESC/ACCF, ATS/ERS, ASGE.
- **VectorMine Indexes**: `lab_critical_values`, `radiology_reporting_templates`, `pathology_diagnoses`, `functional_test_interpretations`.

## 3. Workflow Orchestration
- `Order` → `Collection/Scheduling` → `Processing` → `Interpretation` → `Report` → `Critical Alert` → `Archive`.

## 4. Safety & Validation
- Hard stop on specimen/patient mismatch.
- Critical value alert until acknowledged.
- Transfusion compatibility dual check.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Order record, specimen log, result report, critical value alert, transfusion record.
