# 02 AI Orchestration — Critical Care & Emergency Suite
**Expert: Lead AI Engineer**

## 1. AI Persona
- **Role**: Emergency physician, intensivist, anesthesiologist, and neonatologist assistant.
- **Boundaries**: Suggest triage, monitoring, and protocol alerts; final decisions by qualified clinicians.

## 2. RAG Strategy
- **Primary Sources**: ESI, ATLS, ACLS, SCCM, Surviving Sepsis Campaign, ASA, AAP neonatal guidelines.
- **VectorMine Indexes**: `esi_triage`, `sepsis_bundles`, `ventilator_weaning`, `pacu_discharge_criteria`, `nicu_alerts`.

## 3. Workflow Orchestration
- `Arrival` → `Triage` → `Resuscitation/Monitoring` → `Treatment` → `Disposition`.
- AI suggests ESI level, sepsis bundle actions, ventilator adjustments, PACU discharge readiness, and NICU alerts.

## 4. Safety & Validation
- Hard stop on ESI miscalculation.
- Sepsis bundle timing alerts.
- Aldrete discharge gate.
- All AI suggestions logged to audit trail.

## 5. Output Artifacts
- Triage note, resuscitation log, sepsis bundle tracker, ventilator log, anesthesia record, PACU assessment, NICU admission.
