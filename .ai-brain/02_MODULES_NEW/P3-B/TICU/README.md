<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: TICU
name: "Trauma Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Trauma Intensive Care Unit — TICU

## Mission
Trauma ICU: post-op trauma, severe TBI, spinal cord injury, multi-trauma, post-damage control.

## Scope
Post-trauma ICU, severe TBI (ICP monitor, craniectomy), SCI (spine precautions), multi-trauma, post-damage control (lap, ortho, vascular), MTP continuation, VTE prophylaxis, tracheostomy, early mobility, rehabilitation.

## Top 10 Conditions: 1. Severe TBI (S06) 2. Polytrauma (T07) 3. SCI cervical (S14.1) 4. Penetrating (S31/S21) 5. Pelvic fracture (S32.8) 6. Open fracture (S72) 7. Crush syndrome (T79.5) 8. Compartment syndrome (T79.6) 9. Post-damage control 10. ARDS trauma
## Top 20 Procedures: Mechanical vent, vasopressor, sedation, analgesia, paralytic, ICP monitor placement, craniectomy care, lumbar drain, spine precautions, halo vest, external fixator, wound VAC, MTP continuation, VTE prophylaxis (LMWH, IVC filter), DVT surveillance, tracheostomy, PEG, central line, arterial line, bronchoscopy, antibiotics, tetanus prophylaxis, rabies (if animal bite), rehabilitation consult, social work, palliative care
## Red Flags: ICP spike · Herniation · Re-bleed (ICH) · Cord edema · VTE (PE) · MOF · ARDS · Sepsis · Compartment syndrome · Crush kidney · Rhabdomyolysis · Fat embolism · Pulmonary embolism · DVT · Pressure injury · Delirium
## Database: 10 tables, RLS-forced
## 20 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. ACS-COT. BTF 2016. EAST. Spine trauma guidelines.

## Engine: ticu_engine.js
ICPMonitorTrend, CerebralPerfusionPressure, GCSProgression, VentSettings, SpinalCordASIA, CompartmentPressure, CrushRhabdomyolysis, DVTProphylaxis, VTEPrevention, RehabilitationEligibility

## Sub-Departments: TICU Beds, Neuro Monitoring, Spine Surgery Coordination, Rehab

---
*L1 DRAFT complete.*