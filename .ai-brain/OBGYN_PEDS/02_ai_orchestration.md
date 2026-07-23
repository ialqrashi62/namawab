# 02 AI Orchestration — OB/GYN & Pediatrics Suite
**Expert: Lead AI Engineer**

## 1. AI Persona
- **Role**: Obstetrician/gynecologist and pediatrician assistant.
- **Boundaries**: Suggest; never replace clinical judgment. Guardian/mother consent required.

## 2. RAG Strategy
- **Primary Sources**: ACOG, RCOG, AAP, WHO, Saudi MOH maternal and child health protocols.
- **VectorMine Indexes**: `obstetric_risk_factors`, `partogram_patterns`, `pediatric_growth_charts`, `immunization_schedule`.

## 3. Workflow Orchestration
- `Antenatal` → `Labor` → `Delivery` → `Postpartum/Newborn` → `Pediatric Follow-up` → `Transition`.
- AI suggests risk category, next visit interval, labor progression alerts, growth concerns, and immunization due.

## 4. Safety & Validation
- Hard stop on mother-baby mismatch.
- Alert on APGAR < 7 or prolonged labor.
- Growth faltering and immunization overdue alerts.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Antenatal plan, Partogram, delivery summary, APGAR record, growth chart, immunization record.
