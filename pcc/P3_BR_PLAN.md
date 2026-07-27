# P3-BR Plan

**Target version:** v3.30.0
**Modules (3 candidates):** anesthesia2, radiology2, pathology_ext, trauma_ext, geri_ext, gen_med_ext, breast_ext

## Pick 3 for P3-BR

Suggested: `anesthesia2`, `radiology2`, `pathology_ext` (high-value, distinct domains)

## Pattern (same as P3-BQ)

1. Create 3 engine files (10 pure funcs each) — 30 funcs total
2. Create 3 unit test files (10/10 each = 30/30) — fix boundaries
3. Create `pcc\gen_p3br.py` with version `3.30.0` (FIX: use `router.post`, FIX: use real engine function names, ADD: `authenticate` comment in routes)
4. Run generator: 1 SQL pkg + 3 module SQL + 3 integ + 3 routes
5. Run 3 integ tests: 14/14 each = 42/42
6. Update `pcc\server.js`:
   - Add 3 require after `surgExtRouter`
   - Add 3 `app.use('/api/v1/...', ...)` after `/api/v1/surg-ext`
   - Add 3 names to modules[] array
   - Update `version: ('3.29.0')` → `version: ('3.30.0')`
   - Update log: "v3.30.0: 173 modules wired, P3-BR anesthesia2/radiology2/pathology_ext"
7. Restart server, verify 3 endpoints
8. Update `scratch\audit_all.py` modules list (after `'surg_ext'`)
9. Update `scratch\p3_temp_scripts\test_runner.py` (after `('surg_ext_int'...` line)
10. Run audit (expect 171 PASS), test_runner (expect ~3834 tests)
11. Write `pcc\SHIP_BR.md`
12. Update `C:\memories\repo\pcc_sandbox_state.md` and `MEMORY_PHASE_STATE.md`

## Engine function name candidates

- **anesthesia2** (10): ASA_CLASS, AIRWAY, REGIONAL, GENERAL, MONITORING, PAIN, COMPLICATIONS, FLUIDS, EMERGENCE, REGIONAL_BLOCK
- **radiology2** (10): CT, MRI, US, XRAY, NUCLEAR, INTERVENTIONAL, MAMMO, FLUORO, PE, BIOPSY
- **pathology_ext** (10): BIOPSY, FROZEN, IMMUNOHISTO, MOLECULAR, CYTO, HEMATOPATH, SURGICAL, AUTOPSY, CONSULT, MOLECULAR_DX
