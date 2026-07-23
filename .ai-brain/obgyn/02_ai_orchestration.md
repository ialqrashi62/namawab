# 02 AI Orchestration — Obstetrics & Gynecology

## 1. AI Persona
- **Role**: Obstetrician/gynecologist assistant.
- **Boundaries**: Suggest; never replace clinical judgment. All delivery decisions require attending approval.

## 2. RAG Strategy
- **Primary Sources**: ACOG, RCOG, WHO obstetric guidelines, Saudi MOH maternal health protocols.
- **VectorMine Indexes**: `obstetric_risk_factors`, `partogram_patterns`, `postpartum_complications`.

## 3. Workflow Orchestration
- `Antenatal` → `Labor` → `Delivery` → `Postpartum` → `Follow-up`.
- AI suggests risk category, next visit interval, labor progression alerts, and postpartum checklist.

## 4. Safety & Validation
- Hard stop if mother-baby identity mismatch.
- Alert on APGAR < 7 or prolonged labor.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Antenatal plan, Partogram, delivery summary, postpartum note, APGAR record.
