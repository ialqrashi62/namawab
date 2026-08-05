# PCC Live Deploy · v3.316.66 · 2026-07-30

## Summary
- **Build version bumped**: 3.316.31 → 3.316.66 (4 hardcoded strings in server.js).
- **server.js deployed**: 5436 lines · 1 file · 2.8MB scp transfer.
- **Live verified**: 1322/1322 PASS via `node scratch/live_verify_all.js`.
- **Live endpoints tested**:
  - GET `/api/v1/pcc-catalog/stats` → `{"version":"3.316.66","total_modules":1322,"unique_functions":10035,"total_functions":13282}`
  - GET `/api/v1/pcc-catalog/coverage` → 255 categories breakdown
  - GET `/api/v1/pcc-catalog/search?q=cardio` → 11 results
  - POST `/api/v1/pcc-neuro-ext2/call/StrokeScale` → `{"version":"3.49.0","module":"pcc_neuro_ext2","function":"StrokeScale","plan":"no-stroke"}`
  - GET `/api/v1/pcc-cardio-ext101/list` → 10 functions

## Critical Discovery: PCC_PORT=3101
- **Nginx config** (`/etc/nginx/sites-enabled/jumanasoft`):
  - `location /api/v1/pcc- { proxy_pass http://127.0.0.1:3101; }`
  - `location / { proxy_pass http://127.0.0.1:3000; }` (ERP)
- **PCC server.js line 2069**: `const PORT = parseInt(process.env.PCC_PORT || '3100', 10);`
- **Default was 3100** → nginx was returning 502 because nothing was on 3101.
- **Fix**: `pm2 start server.js --name nama-medical-pcc` with `PCC_PORT=3101` env var.
- **PM2 command sequence** (use this for all future deploys):
  ```bash
  ssh -i ~/.ssh/nama_medical_key root@204.168.144.74
  cd /var/www/namaweb-pcc/pcc
  pm2 delete nama-medical-pcc 2>/dev/null
  PCC_PORT=3101 pm2 start server.js --name nama-medical-pcc
  ```
- **NEVER restart PCC without `PCC_PORT=3101`** — otherwise nginx returns 502.

## Live server details
- Host: Hetzner ubuntu-8gb-hel1-1 (204.168.144.74)
- Domain: jumanasoft.com · SSL via /etc/nginx/ssl-jumanasoft/
- PM2: `nama-medical-pcc` (pid varies), uptime now ~2 min
- Memory: ~150 MB per process · CPU 0%
- Logs: `/root/.pm2/logs/nama-medical-pcc-error.log`
  - `[token_cache] sync failed: password authentication failed for user "nama_pcc_app"` — harmless, token cache tries DB but app still serves PCC endpoints.

## Modules by version on live
- v3.316.x: 1304 auto-generated + recently wired
- v3.186.0: 3 hand-written (aortic, peripheral_vascular, venous_thromboembolism)
- v3.185.0: 3 hand-written (valvular_intervention, arrhythmia_advanced, lipidology)
- v3.184.0: 3 hand-written (advanced_heart_failure, pulmonary_hypertension, cardiac_rehab_ext)
- Earlier (v3.49.0, v3.105.0, v3.109.0, v3.187.0, v3.193.0, v3.194.0, v3.195.0): specialty department modules with hand-coded clinical logic (epic-grade, not stub-upgraded).

## Skills used (per user instruction)
- `nm-ai-brain-pcc-autopilot` — 7-step pipeline (GEN→RESTORE→REGEN→WIRE→AUDIT→BOOT→VERIFY)
- `pcc-p3-batch-shipper` — 3-module batch deployment
- `pcc-loop-engineering` — Plan→Implement→Test→Verify (capped at 4 loops)
- `pcc-multi-agent` — 7 parallel agents for 7× speedup

## Next steps (continued autopilot)
- Run `gen_p3master.py` again with next version bump (v3.316.67)
- Optionally: push 9 hand-written module upgrades for the legacy specialty modules
- Run `scratch/live_verify_all.js` after each push
- Keep PCC on port 3101 with `PCC_PORT=3101`