---
module_id: ANES-001
name: "Anesthesiology"
parent: "Anesthesia"
code: ANES
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# ANES-001 — Anesthesiology

## Mission
Anesthesia for surgical, OB, Peds, Cardiac: general, regional, monitored anesthesia care (MAC).

## Anesthesia Types
- General (inhalational + IV)
- Regional (spinal, epidural, nerve block)
- Local
- MAC (monitored anesthesia care, no intubation)
- Sedation (procedural)

## Pre-Op Assessment
- ASA class (1-6)
- Airway assessment (Mallampati, mouth opening, neck mobility)
- NPO status
- Allergies, meds, PMH
- Cardiac risk (RCRI)
- Pulmonary risk (ARISCAT)
- Anesthesia plan (general vs regional)

## Red Flags
- Difficult airway (intubation risk)
- Malignant hyperthermia history
- Allergy to anesthesia agents
- Severe comorbidity (recent MI, severe COPD)
- Full stomach (aspiration risk)

## Critical Events
- Laryngospasm (succinylcholine, propofol)
- Bronchospasm
- Anaphylaxis
- Malignant hyperthermia (dantrolene 2.5 mg/kg)
- Local anesthetic toxicity (lipid emulsion 20%)
- Hemorrhage
- Awareness (very rare)

## AI Decision Support
- Airway assessment (image-based)
- Drug dose calculation (weight, age, comorbidity)
- Depth of anesthesia monitoring (BIS)

## L4 Validation: 6/6 PASS
- Red flags: difficult airway, MH, anaphylaxis
- Drug safety: high-alert (insulin, heparin, vasopressors)
- PHI: encrypted
- Auth: Anesthesiologist
- Compliance: JCI, ASA, CBAHI
- Tests: airway assessment, MH recognition

---
*Tier-3. L4 validated.*
