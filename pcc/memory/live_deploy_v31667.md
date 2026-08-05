# PCC Live Deploy · v3.316.67 · 2026-07-30

## Summary
- **Build version bumped**: 3.316.66 → 3.316.67.
- **Autopilot iteration 2**: 7-step pipeline re-ran (GEN→RESTORE→REGEN, WIRE skipped because 1304 routes already wired, AUDIT passed).
- **Live verified**: 1322/1322 PASS via `node scratch/live_verify_all.js`.
- **Live endpoints tested**:
  - GET `/api/v1/pcc-catalog/stats` → v3.316.67
  - All 1322 modules responding
- **Skills used**: `nm-ai-brain-pcc-autopilot`, `pcc-p3-batch-shipper`

## Pipeline results (this iteration)
| Step | Command | Output | Wall |
|------|---------|--------|------|
| GEN | `python gen_p3master.py` | 133 phases · 399 modules | ~33s |
| RESTORE | `node scratch/restore_hand_written_engines.js` | 9 modules restored | <1s |
| REGEN | `node scratch/regen_tests.js` | 9 test suites regen | <1s |
| WIRE | (skipped — 1304 already wired) | 0 new requires | 0s |
| AUDIT | (covered by master runner) | 4/4 PASS | 0.73s |
| BOOT | `pm2 restart nama-medical-pcc` | Online | 5s |
| VERIFY | `node scratch/live_verify_all.js` | 1322/1322 PASS | ~4s |

## Current live stats
- **Version**: v3.316.67
- **Modules**: 1322 (1304 auto-generated + 18 specialty/hand-written)
- **Functions**: 13,282 total · 10,035 unique indexed
- **Categories**: 255
- **Process**: PM2 `nama-medical-pcc` on port 3101 (via PCC_PORT=3101)
- **Domain**: jumanasoft.com · nginx proxies `/api/v1/pcc-` to PCC

## Next iteration
- Run `python gen_p3master.py` again
- Bump to v3.316.68
- Deploy to live
- Run live_verify_all.js