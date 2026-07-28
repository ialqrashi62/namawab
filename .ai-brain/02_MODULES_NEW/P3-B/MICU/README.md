<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: MICU
name: "Medical Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Medical Intensive Care Unit — MICU

## Mission
Medical ICU: severe sepsis, ARDS, multi-organ failure, severe metabolic disorders, post-cardiac arrest care.

## Scope
Mechanical ventilation, vasopressors, CRRT, sepsis bundles, sedation/analgesia, delirium prevention (ABCDEF bundle), early mobility, family meetings, palliative care, central line management, VAP/CLABSI/CAUTI prevention.

## Top 10 Conditions: 1. Severe sepsis/septic shock (A41) 2. ARDS (J80) 3. Multi-organ failure (R65.3) 4. Post-cardiac arrest (I46.9) 5. Acute respiratory failure (J96.0) 6. DKA (E10.10) 7. Acute liver failure (K72.0) 8. Severe pneumonia (J18) 9. Toxic ingestion (T50) 10. Severe electrolyte (E87)
## Top 20 Procedures: Mechanical vent, vasopressor (norepinephrine, vasopressin, epinephrine), inotrope (dobutamine, milrinone), CRRT, IABP, Impella, ECMO, bronchoscopy, central line, arterial line, PA cath, sedation (propofol, dexmedetomidine, midazolam), analgesia (fentanyl, hydromorphone), paralytic (cisatracurium), antibiotics, blood culture, lactate, ABG, sepsis bundle (1h bundle), transfusion, MTP, prone positioning, ECMO, lung-protective vent, extubation, tracheostomy, palliative care
## Red Flags: Cardiac arrest · Refractory shock · Refractory hypoxia · Refractory acidosis (pH<7.0) · Tension PTX · Massive hemoptysis · Malignant hyperthermia · Brain death (consideration) · Withdrawal of care (family meeting) · Failed intubation (cric) · Code blue · VAP · CLABSI · CAUTI · Delirium · Pressure injury
## Database: 10 tables, RLS-forced
## 20 endpoints, 6 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. SCCM guidelines. ATS/ESICM/SCCM ARDS 2017. Surviving Sepsis 2021.

## Engine: micu_engine.js
APACHE_IIScore, SOFAScore, VentSettingsOptimizer, SepsisBundleComplete, SedationLevel, RASS_Score, CAM_ICUDelirium, CRRTCircuitLife, ECMOIndicationCheck, WithdrawalOfCareTrigger

## Sub-Departments: MICU Beds, Respiratory Therapy, Pharmacy, Nutrition, Social Work

---
*L1 DRAFT complete.*