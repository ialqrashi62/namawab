# 01 Clinical Spec — Critical Care & Emergency Suite
**Expert: Chief Medical Officer (CMO)**

## 1. Clinical Domain & Scope
- **Focus**: Emergency department, intensive care unit, anesthesia, PACU, and NICU.
- **Key Workflows**:
  - ESI triage and patient flow.
  - Resuscitation and trauma management.
  - Hemodynamic and ventilator monitoring.
  - Sepsis bundle tracking.
  - Anesthesia record and PACU recovery.
  - Neonatal intensive care.

## 2. Patient Journey
1. Arrival/Admission → 2. Triage/Assessment → 3. Resuscitation/Monitoring → 4. Treatment → 5. Disposition/Transfer/Discharge.

## 3. Clinical Decision Support
- ESI auto-calculation.
- Sepsis bundle timing alerts.
- Ventilator weaning criteria (RSBI).
- Aldrete score for PACU discharge.
- APGAR and neonatal alert thresholds.

## 4. Integration Points
- ADT, OR, LIS, RIS, pharmacy, blood bank, transport.

## 5. Safety Gates
- ESI-based waiting time alerts.
- Anesthesia readiness before surgery.
- Aldrete ≥ 9 or anesthesiologist override before PACU discharge.
- Mother-baby identity match in NICU.
