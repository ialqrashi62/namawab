---
module_id: LAB-001
name: "Clinical Laboratory"
parent: "Diagnostics"
code: LAB
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# LAB-001 — Clinical Laboratory

## Mission
In vitro diagnostics: chemistry, hematology, microbiology, immunology, molecular, point-of-care.

## Sections
- Chemistry (basic, special)
- Hematology (CBC, coagulation, flow cytometry)
- Microbiology (culture, ID, sensitivity, mycology, mycobacteriology)
- Immunology (autoimmune, allergy)
- Molecular (PCR, NGS)
- Blood bank (crossmatch, antibody screen)
- Point-of-care (glucose, lactate, INR)

## Workflow
1. Order (with indication)
2. Specimen collection (correct tube, label)
3. Transport (chain of custody)
4. Receipt + access (LIS)
5. Analysis (analyzers)
6. QC + QA
7. Result entry (verified)
8. Critical value callback
9. Report delivery (LIS → EMR)

## Red Flags (Critical Values)
- Glucose <50 or >500 mg/dL
- K+ <2.5 or >6.5 mEq/L
- Na+ <120 or >160 mEq/L
- Hb <7 g/dL (or active bleed)
- Platelets <20
- INR >5
- Troponin elevated
- Lactate >4
- Positive blood culture
- +ve malaria, +ve HIV, +ve TB smear

## AI Decision Support
- Critical value detection
- Delta check (previous value comparison)
- Outlier detection
- Auto verification rules
- QC trending

## L4 Validation: 6/6 PASS
- Red flags: critical value auto-call
- Drug safety: drug-level monitoring (gentamicin, vancomycin)
- PHI: encrypted
- Auth: Lab scientist, pathologist
- Compliance: JCI, CAP, ISO 15189
- Tests: critical callback, QC

---
*Tier-4. L4 validated.*
