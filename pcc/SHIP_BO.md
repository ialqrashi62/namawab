# P3-BO SHIP — v3.27.0 (Allergy-Ext, Endocrine-Ext, Derm-Ext-2)

**Date:** 2026-07-15
**Phase:** P3-BO
**Version:** 3.27.0 (was v3.26.0)

## Modules shipped (3)

| # | Module | Label | Functions | Tests |
|---|---|---|---|---|
| 1 | `allergy_ext` | Allergy-Ext | 10 | 10/10 unit + 5/5 integ |
| 2 | `endocrine_ext` | Endocrine-Ext | 10 | 10/10 unit + 5/5 integ |
| 3 | `derm_ext2` | Derm-Ext-2 | 10 | 10/10 unit + 5/5 integ |

## Engines

- **allergy_ext** — Anaphylaxis, FoodAllergy, DrugAllergy, Urticaria, Angioedema, AllergicRhinitis, Asthma, Atopic, Venom, PrimaryImmuno
- **endocrine_ext** — DiabetesT2, Hypothyroid, Hyperthyroid, AdrenalInsufficient, Cushings, Pheo, Calcium, Pituitary, AdrenalIncidental, GenderAffirming
- **derm_ext2** — Acne, Psoriasis, Eczema, SkinCancer, DrugRash, Bullous, Autoimmune, Hair, PediatricDerm, Ulcer

## Server wiring (v3.27.0)

- 3 requires + 3 app.use + 3 module names
- `version: '3.27.0'`
- Boot log: "v3.27.0: 164 modules wired, P3-BO allergy_ext/endocrine_ext/derm_ext2"

## Audit + Test runner

- Audit: 162 PASS, 0 FAIL
- Tests: 2167 UNIT + 1475 INTEG = 3642 TOTAL

## Cumulative

- Modules: 164 (was 161)
- Tests: 3642 (was 3597)
- Audit: 162 (was 159)
- P3 phases: 31 (P3-AZ → P3-BO)

## Status: SHIPPED ✅
