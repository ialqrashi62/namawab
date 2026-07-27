# P3-BN SHIP — v3.26.0 (Gastro-Ext, Rheum-Ext-2, ID-Ext)

**Date:** 2026-07-15
**Phase:** P3-BN
**Version:** 3.26.0 (was v3.25.0)

## Modules shipped (3)

| # | Module | Label | Functions | Tests |
|---|---|---|---|---|
| 1 | `gastro_ext` | Gastro-Ext | 10 | 10/10 unit + 5/5 integ |
| 2 | `rheum_ext2` | Rheum-Ext-2 | 10 | 10/10 unit + 5/5 integ |
| 3 | `id_ext` | ID-Ext | 10 | 10/10 unit + 5/5 integ |

## Engines

- **gastro_ext** — IBS, IBD, LiverLesion, Cirrhosis, HepB, HepC, PUD, GERD, Pancreatitis, ColonCancer
- **rheum_ext2** — RA, SLE, PsoriaticArthritis, AnkylosingSpondyl, Gout, Vasculitis, Sjogren, Scleroderma, Polymyalgia, PediatricRheum
- **id_ext** — SepsisBundle, EmpiricAbx, HIVInitiation, TB, Travel, Fungal, Viral, OPAT, ProstheticJoint, HIVPrep

## Server wiring (v3.26.0)

- Added 3 requires + 3 app.use + 3 module names
- Updated `version: '3.26.0'`
- Boot log: "v3.26.0: 161 modules wired, P3-BN gastro_ext/rheum_ext2/id_ext"

## Audit + Test runner

- Audit: 159 PASS, 0 FAIL
- Tests: 2137 UNIT + 1460 INTEG = 3597 TOTAL

## Cumulative

- Total modules: 161 (was 158)
- Total tests: 3597 (was 3552)
- Audit pass: 159 (was 156)
- P3 phases shipped: 30 (P3-AZ → P3-BN)

## Issues fixed during this phase

- `gastro_ext.Cirrhosis` test used `meld: 16` → engine hit `meld >= 15 && meld < 30` first. Fixed by using `meld: 13` to hit the `childPugh === 'B' && meld >= 12` branch.

## Status: SHIPPED ✅
