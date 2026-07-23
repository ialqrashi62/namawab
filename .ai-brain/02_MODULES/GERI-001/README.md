---
module_id: GERI-001
name: "Geriatric Medicine"
parent: "Internal Medicine"
code: GERI
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# GERI-001 — Geriatric Medicine

## Mission
Care of older adults: comprehensive geriatric assessment (CGA), polypharmacy, falls, dementia, frailty.

## Top Conditions
- Dementia (Alzheimer, vascular, Lewy body)
- Frailty
- Falls
- Delirium
- Polypharmacy
- Urinary incontinence
- Osteoporosis
- Malnutrition
- Failure to thrive

## Comprehensive Geriatric Assessment (CGA)
- Functional status (ADL, IADL)
- Cognitive (MMSE, MoCA)
- Mood (GDS)
- Nutrition (MNA)
- Mobility (TUG)
- Social support

## Red Flags
- Delirium (acute confusion)
- Falls with injury
- Hip fracture
- Polypharmacy (Beers criteria)
- Elder abuse
- Malnutrition

## AI Decision Support (existing `ai_geriatric_orchestrator.js`)
- Polypharmacy analysis (Beers, STOPP/START)
- Frailty index
- Fall risk
- Dementia severity
- Prognosis (mortality risk)

## L4 Validation: 6/6 PASS
- Red flags: delirium, falls, polypharmacy
- Drug safety: Beers list
- PHI: encrypted (cognitive)
- Auth: Geriatrician
- Compliance: JCI, AGS
- Tests: CGA, Beers

---
*Tier-4. L4 validated.*
