<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: SICU
name: "Surgical Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Surgical Intensive Care Unit — SICU

## Mission
Surgical ICU: post-op complex surgical, surgical complications, surgical sepsis, post-transplant ICU care.

## Scope
Post-op complex surgical patients, surgical sepsis, anastomotic leak, post-pancreaticoduodenectomy, post-esophagectomy, post-hepatobiliary, damage control surgery continuation, post-transplant (liver, kidney), post-vascular (AAA), ICU-level monitoring.

## Top 10 Conditions: 1. Post-op Whipple (Z48.815) 2. Post-op esophagectomy (Z48.815) 3. Post-op AAA repair (Z48.03) 4. Post-op liver transplant (Z48.23) 5. Anastomotic leak (K91.89) 6. Surgical sepsis (A41) 7. Post-op hemorrhage (T81.0) 8. Post-op MI (I21) 9. Post-op stroke (I63) 10. Abdominal compartment syndrome (K66.1)
## Top 20 Procedures: Same as MICU + surgical drains, NG tube, JP drain, chest tube, abdominal washout, open abdomen VAC, tracheostomy, PEG, central line, arterial line, PA cath, bronchoscopy, EGD, colonoscopy, vasopressor, inotrope, sedation, analgesia, antibiotics, antifungal, antiviral, blood transfusion, MTP, CRRT, wound care, ostomy care, enteral nutrition, TPN, mobilization, palliative care
## Red Flags: Anastomotic leak (peritonitis) · Abdominal compartment syndrome · Post-op hemorrhage (Tachy, drain output) · Septic shock · MOF · Hepatic artery thrombosis (post-LT) · Primary non-function (post-LT) · Anastomotic stricture · Bowel ischemia · Compartment syndrome · Fascial dehiscence · EVAR endoleak · Stroke post-CEA · MI post-op
## Database: 10 tables, RLS-forced
## 20 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. ACS NSQIP. ERAS protocols. Surgical Care Improvement Project (SCIP).

## Engine: sicu_engine.js
ApacheScore, SofaScore, DrainsOutput, AnastomoticLeakScreening, AbdominalCompartmentPressure, PostOpHemorrhage, VasopressorDose, ERASCompliance, SurgicalSiteInfection, ComplicationRecognition

## Sub-Departments: SICU Beds, Surgical Step-Down, Stoma Therapy, Wound Care

---
*L1 DRAFT complete.*