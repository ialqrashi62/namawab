---
module_id: PICU
name: "Pediatric ICU"
parent: "ICU"
code: ICU
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# PICU — Pediatric Intensive Care Unit

## Mission
Critical care for children (1 month - 18 years): respiratory failure, sepsis, status epilepticus, trauma, post-cardiac surgery.

## Top Conditions
- Status asthmaticus
- Bronchiolitis (severe)
- DKA
- Septic shock
- Status epilepticus
- Trauma (peds)
- Post-cardiac surgery

## Red Flags
- Respiratory failure (age-specific)
- Shock (compensated vs decompensated)
- Status epilepticus
- Raised ICP
- Anaphylaxis

## AI Decision Support (existing)
- PEWS (Pediatric Early Warning Score)
- Age-specific vital signs
- Weight-based dosing (critical in peds)
- Broselow tape integration

## L4 Validation: 6/6 PASS
- Red flags: respiratory failure, shock, seizure
- Drug safety: weight-based, double-check
- PHI: encrypted
- Auth: Peds intensivist
- Compliance: JCI, PALS, CBAHI
- Tests: PEWS, weight dose, Broselow

---
*Tier-3. L4 validated.*
