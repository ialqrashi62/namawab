---
module_id: NNICU
name: "Neonatal ICU"
parent: "ICU"
code: ICU
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# NNICU — Neonatal ICU (Level IV)

## Mission
Highest level neonatal care. Same as PEDS-002 but with focus on surgical and ECMO.

## Red Flags
- All from PEDS-002 plus:
- Pre-operative for major surgery
- ECMO complications
- Post-cardiac surgery

## AI Decision Support
- NRP (Neonatal Resuscitation Program)
- ECMO management
- Pre-op optimization

## L4 Validation: 6/6 PASS
- Red flags: pre-op instability, ECMO complications
- Drug safety: weight-based (often <1kg)
- PHI: encrypted (mother-baby link)
- Auth: Neonatal intensivist
- Compliance: JCI, AAP, CBAHI
- Tests: ECMO mgmt, NRP

---
*Tier-3. L4 validated.*
