# TIER5_PHARMACY_EXT-101..106 SHIPPED (2026-08-05)

30 endpoints live (e761-e766):

| # | Module | Routes (5) |
|---|---|---|
| 101 | PGx | /api/pgx/{cyp2c19,cyp2d6,slco1b1,tpmt,dpyd} |
| 102 | Formulary | /api/formulary/{formulary,interaction,ivcompat,dose,info} |
| 103 | Safety | /api/pharm_safety/{medrec,recon,mechas,monitor,recurring} |
| 104 | Dispensing | /api/pharm_disp/{final,prep,cis,label,stock} |
| 105 | Stewardship | /api/pharm_stew/{warfarin,doac,abx,insulin,almperi} |
| 106 | Immunization | /api/pharm_imm/{elig,catchup,preg,pe,titer} |

**Smoke**: 30/30 PASS, server.js c119e110 (inner) / 391cec9d (outer).

**Tables**: pharmacy_pgx, pharmacy_formulary, pharmacy_safety, pharmacy_dispensing,
pharmacy_stewardship, pharmacy_immunization — all RLS + FORCE RLS + tenant policy.

**Bugs fixed**:
- Smoke paths used wrong names (`/lookup`, `/inter`, `/ivcomp`) — corrected to
  engine's actual `router.post` paths (`/formulary`, `/interaction`, `/ivcompat`).
- PGx payloads needed `phenotype`/`genotype` enum strings (engine uses `nm|im|pm|um`
  for most genes, `normal|intermediate|poor|ultra_high` for TPMT, `normal|intermediate|poor`
  for DPYD, `normal_c_normal_c|normal_c_c|c_c_c` for SLCO1B1).
- Formulary `check_formulary` requires `tier_2_or_3`/`biosimilar_or_brand_only` booleans
  + `drug_class` enum + `local_cost_index` number.
- Formulary `check_interaction` requires `mechanism` enum + `drug_a_renal_clearance_ml_min`
  + `both_with_qt_prolongation_risk`.
- Formulary `iv_compatibility` requires `drug_a`, `drug_b`, `compatibility_layer`,
  `reaction_when_mixture` enums.
- Formulary `dose_check` requires `age_years` (not just `age`).
- Formulary `drug_info_lookup` requires `frequency` enum + `renal_adjust_required` +
  `egfr_value`.
