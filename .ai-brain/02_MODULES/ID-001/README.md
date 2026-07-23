---
module_id: ID-001
name: "Infectious Diseases"
parent: "Internal Medicine"
code: ID
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# ID-001 — Infectious Diseases

## Mission
Diagnosis and treatment of complex infections: bacterial, viral, fungal, parasitic. Includes antimicrobial stewardship, infection control, tropical medicine, HIV, TB.

## Top Conditions
- Sepsis
- HIV/AIDS
- TB (drug-resistant)
- Hepatitis B, C
- Tropical diseases (malaria, dengue, typhoid)
- Endocarditis
- Osteomyelitis
- Meningitis/encephalitis
- C. difficile colitis
- Multi-drug resistant organisms (MDRO)

## Red Flags
- Septic shock
- Bacterial meningitis
- TB meningitis
- Necrotizing fasciitis
- Toxic shock syndrome
- Cerebral malaria
- Acute HIV seroconversion

## AI Decision Support (existing `ai_infectious_orchestrator.js`)
- Antibiotic selection (culture + sensitivity)
- Antimicrobial stewardship
- Drug interaction (HIV regimens, TB)
- Resistance pattern prediction
- Public health alerts (outbreak)

## L4 Validation: 6/6 PASS
- Red flags: sepsis, meningitis, necrotizing
- Drug safety: antibiotic interactions, renal dose
- PHI: encrypted (HIV, sensitive)
- Auth: ID specialist
- Compliance: JCI, IDSA, WHO, MOH
- Tests: antibiotic selection, stewardship

---
*Tier-3. L4 validated.*
