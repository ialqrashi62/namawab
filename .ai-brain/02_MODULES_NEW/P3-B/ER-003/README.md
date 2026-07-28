<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-003
name: "Trauma Center Level II"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Trauma Center Level II — ER-003

## Mission
Level II trauma center: 24/7 in-house emergency coverage, surgical subspecialty on-call, ACS verification, transfer agreements with Level I for complex cases.

## Scope
ATLS-driven trauma care, immediate resuscitation, damage control surgery, MTP, transfer to Level I for complex neuro/CT/vascular, ATLS education, registry participation.

## Top 10 Conditions: 1. Polytrauma (T07) 2. Severe TBI (S06) 3. Penetrating (S31/S21) 4. MVC ejection (V86) 5. Fall >20ft 6. Hemorrhagic shock (R57.1) 7. Pelvic fracture (S32.8) 8. Long-bone (S72/S82) 9. Pediatric trauma 10. Burn (T30/T31)
## Top 20 Procedures: ATLS survey, definitive airway, needle decompression, chest tube, ED thoracotomy, FAST, DPL, REBOA, MTP, damage control lap, ex-fix, ICP monitor, craniotomy, fasciotomy, vascular shunt, amputation, splinting, transfer out (to Level I for neuro/CT/hand/omfs), ACS-COT registry, NTDB export, outreach
## Red Flags: Hemorrhagic shock III/IV · Tension PTX · Tamponade · Massive hemothorax · Flail chest · Open-book pelvis · GCS ≤8 · Penetrating · Mangled extremity · Crush · Compartment syndrome · Penetrating cardiac
## Database: 10 tables, RLS-forced
## 18 endpoints, 6 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. ACS-COT Level II. NTDB/TQIP. KSA MOH trauma designation.

## Engine: trauma_center_l2_engine.js
TierClassifier, ISS, TRISS, MTPTrigger, TBISeverity, HemorrhageControl, TransferOutCriteria, ACSCOTCompliance, NTDBExport, OutreachMetrics

## Sub-Departments: Trauma Bay, Resus, Hybrid OR, TICU

---
*L1 DRAFT complete.*