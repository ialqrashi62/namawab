---
module_id: ER-004
name: "Stroke Unit"
parent: "Emergency"
code: ER
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# ER-004 — Stroke Unit / Code Stroke

## Mission
Acute stroke care: tPA within 4.5h, mechanical thrombectomy within 24h for LVO.

## Workflow
1. Last-known-well determination
2. NIHSS (National Institutes of Health Stroke Scale)
3. STAT CT (rule out hemorrhage) within 25 min
4. CT angio (LVO detection)
5. Decision: tPA, thrombectomy, both, or medical
6. Admit to stroke unit / ICU

## Red Flags
- Hemorrhagic stroke
- Large territory infarct (malignant edema risk)
- Brainstem stroke
- Recurrent stroke
- tPA complications (symptomatic ICH)

## Time Targets
- Door-to-CT: <25 min
- Door-to-needle (tPA): <60 min
- Door-to-puncture (mechanical thrombectomy): <90 min for LVO
- Door-to-stroke unit admission: <3h

## L4 Validation: 6/6 PASS
- Red flags: hemorrhage, tPA contraindication
- Drug safety: tPA, anticoag (post-stroke)
- PHI: encrypted
- Auth: Stroke neurologist, ER MD
- Compliance: JCI, AHA/ASA
- Tests: NIHSS, CT interpretation

---
*Tier-3. L4 validated.*
