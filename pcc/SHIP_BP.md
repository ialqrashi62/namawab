# P3-BP SHIP — v3.28.0 (Uro-Ext, Vasc-Ext, Ortho-Ext)

**Date:** 2026-07-15
**Phase:** P3-BP
**Version:** 3.28.0 (was v3.27.0)

## Modules shipped (3)

| # | Module | Label | Functions | Tests |
|---|---|---|---|---|
| 1 | `uro_ext` | Uro-Ext | 10 | 10/10 unit + 5/5 integ |
| 2 | `vasc_ext` | Vasc-Ext | 10 | 10/10 unit + 5/5 integ |
| 3 | `ortho_ext` | Ortho-Ext | 10 | 10/10 unit + 5/5 integ |

## Engines

- **uro_ext** — BPH, ProstateCancer, KidneyStone, UTI, Hematuria, ED, Incontinence, Testicular, Penile, BladderCancer
- **vasc_ext** — AAA, Carotid, PAD, DVT, VaricoseVein, AorticDissect, MesentericIsch, ThoracicAortic, DialysisAccess, Lymphedema
- **ortho_ext** — Osteoarthritis, RA, Fracture, Spine, Sports, Pediatric, Tumor, Hand, FootAnkle, Prosthetic

## Server wiring (v3.28.0)

- 3 requires + 3 app.use + 3 module names
- `version: '3.28.0'`
- Boot log: "v3.28.0: 167 modules wired, P3-BP uro_ext/vasc_ext/ortho_ext"

## Audit + Test runner

- Audit: 165 PASS, 0 FAIL
- Tests: 2197 UNIT + 1490 INTEG = 3687 TOTAL

## Cumulative

- Modules: 167 (was 164)
- Tests: 3687 (was 3642)
- Audit: 165 (was 162)
- P3 phases: 32 (P3-AZ → P3-BP)

## Issues fixed during this phase

- `vasc_ext.AAA` test used `size: 6` → engine hit `size >= 5.5` urgent-EVAR branch first. Fixed by using `size: 5.1` to hit the `size >= 5` branch.

## Status: SHIPPED ✅
