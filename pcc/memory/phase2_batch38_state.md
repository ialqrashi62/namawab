# Phase 2 Batch 38 — Base Legacy + Cardio Gap (v3.316.71)

## Status: PARTIAL — 5 cardio upgraded, 7 base restored

### Upgraded (5 modules at v3.316.71)
- pcc_aortic_surgery
- pcc_cardiac_ct
- pcc_cardiac_mri
- pcc_cardiovascular_optimization
- pcc_cath_lab_specialized

### Restored (7 hand-written base modules — DO NOT AUTO-UPGRADE)
- pcc_admin (v3.39.0)
- pcc_clinical_dx (v3.41.0)
- pcc_compliance
- pcc_drug
- pcc_imaging
- pcc_infection
- pcc_workflow

## 🚨 Critical Lesson Learned

**Three module patterns exist**:
1. **Hand-written Epic-grade** (don't touch) — these have custom routes and proprietary schemas
2. **Hand-written with specialty routes** (don't generic-upgrade) — like AMS/GM/IR/BR/PHE/PIM
3. **Auto-generated stubs** (safe to bulk-upgrade) — what the batches have been upgrading

### How to detect hand-written
- Route file has hard-coded `version: '3.XX.X'` (not `'vX.X.X'`)
- Route file has custom output fields like `plan`, `r.plan`, `score: r.score` (not `severityClass`)
- Engine is on `v3.41.0` (the legacy base version) — DO NOT auto-upgrade
- Generic auto-upgrade breaks the routes

### Detection Heuristic
- Modules with `v3.41.0` or similar legacy versions in their engine = HAND-WRITTEN = skip
- Modules with `v3.109.x` to `v3.316.x` patterns = AUTO-GENERATED = safe to upgrade
- After any batch run, verify live API has `severityClass` field

## Cumulative Progress
- Phase 1 Cardiac: 20 modules
- Phase 2 B1-38: 418 modules
- **Total: 438 modules upgraded (~33% of 1322)**
- Remaining: ~162 modules (excluding 7 base hand-written)

## Next: Batch 39 — Lab ext3-8 + cardio ext4-10
- Continue with safe-to-upgrade modules