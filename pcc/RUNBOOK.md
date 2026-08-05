# PCC Sandbox — Operations Runbook

> **For SREs, DevOps, and on-call engineers.**
> Last updated: 2026-07-29 · v3.316.4

---

## Quick Reference

| Item | Value |
|---|---|
| Server port | 3201 |
| Server version | 3.203.0 |
| Catalog version | 3.316.0 |
| Health check | `GET /health` |
| Process | node server.js |
| Logs | `scratch/server_v3_316_v*.log` |
| Master runner | `node scratch/master_test_runner.js` |

---

## Start / Stop

### Start
```bash
cd c:\Users\ice\Desktop\NMEDCALVSCODE\pcc
$env:PCC_PORT = 3201
node server.js
```

### Start in background (Windows)
```powershell
cd c:\Users\ice\Desktop\NMEDCALVSCODE\pcc
Start-Process -FilePath "node" -ArgumentList "server.js" -RedirectStandardOutput scratch/server.log -RedirectStandardError scratch/server_err.log -NoNewWindow
```

### Stop
```powershell
Get-Process -Name node | Stop-Process -Force
```

### Restart
```powershell
Get-Process -Name node | Stop-Process -Force
Start-Sleep 2
cd c:\Users\ice\Desktop\NMEDCALVSCODE\pcc
Start-Process -FilePath "node" -ArgumentList "server.js" -RedirectStandardOutput scratch/server.log -RedirectStandardError scratch/server_err.log -NoNewWindow
```

---

## Health Checks

### Liveness
```bash
curl http://localhost:3201/health
```
Expected: `{ "status": "ok", "version": "3.203.0" }`

### Full Diagnostics
```bash
curl http://localhost:3201/api/v1/pcc-diagnostics/diagnostics
```
Returns: uptime, memory, process info, catalog stats.

### Catalog Stats
```bash
curl http://localhost:3201/api/v1/pcc-catalog/modules | jq '.count, .version'
```

---

## Validation Scripts

### Master Runner (4 validators in one command)
```bash
cd pcc
node scratch/master_test_runner.js
```
Runs: audit + live + E2E + OpenAPI validation. Wall-clock: ~5s.

Expected output:
```
[PASS] Audit (multi-format)           ~0.2s
[PASS] Live API verification          ~4s
[PASS] E2E test suite                 ~0.1s
[PASS] OpenAPI spec validation        ~0.05s
Total wall-clock: ~5s
Overall verdict: PASS ✅
```

### Auto-Healer (scans all 1322 modules)
```bash
node scratch/auto_healer.js
```
Expected: `Modules with failures: 0`

### Performance Benchmark
```bash
node scratch/perf_benchmark.js
```
Expected throughput: ~1700 req/s @ 50 concurrent.

---

## Common Operations

### Regenerate catalog data
```bash
node scratch/gen_pcc_catalog.js           # rebuild catalog from 1322 modules
node scratch/gen_pcc_search_index.js      # rebuild inverted index
node scratch/gen_openapi_pcc.js           # rebuild OpenAPI spec
node scratch/gen_coverage_report.js       # rebuild coverage analysis
```

### Re-wire routes (if server.js was modified)
```bash
node scratch/wire_server_batch.js
```

### Apply upgrades
```bash
node scratch/upgrade_p3cc_engines.js      # P3-CC legacy engines
node scratch/upgrade_minimal_engines.js   # minimal engines
node scratch/fix_call_endpoints.js        # plan/score refs
node scratch/fix_decisionId_bug.js        # destructure bug
node scratch/add_tenant_to_record.js      # tenant_id check
node scratch/enhance_record_endpoint.js   # tenant_id in response
```

### Add new PCC catalog endpoint
```bash
# Edit scratch/add_pcc_catalog_endpoint.js then run:
node scratch/add_pcc_catalog_endpoint.js
```

---

## Backup & Restore

### Backup server.js before any modification
```bash
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item server.js "server.js.bak_$timestamp"
```

### Restore from backup
```bash
# List backups
Get-ChildItem server.js.bak_*

# Restore specific backup
Copy-Item "server.js.bak_20260729_143022" server.js -Force
```

---

## Database

### Migrations Status
- 597 SQL files in `migrations/`
- 596 up + 1 down (cath_lab)
- **Safe to apply** per `scratch/validate_migrations.js`
- **NOT YET APPLIED** — sandbox runs in-memory

### Dry-run validation
```bash
node scratch/validate_migrations.js
```
Expected: `Verdict: SAFE TO APPLY ✅`

---

## Performance Baselines

| Metric | Baseline | Action if degraded |
|---|---|---|
| p95 latency (call) | 1ms | >5ms → check `scratch/perf_report.json` |
| Burst throughput | 1724 req/s | <1000 → check memory leaks |
| Master runner | ~5s | >15s → check disk/AV interference |
| Auto-healer | ~30s | >60s → check server responsiveness |

---

## Troubleshooting

### Server won't start
1. Check port 3201 availability: `Get-NetTCPConnection -LocalPort 3201`
2. Check Node version: `node --version` (need 18+)
3. Check PCC_PORT env: `$env:PCC_PORT`
4. Check for syntax errors: `node -c server.js`

### Module returns 404
1. Verify module is in catalog: `curl /api/v1/pcc-catalog/modules`
2. Check URL slug uses dashes not underscores: `pcc-cardiology-ext102` not `pcc_cardiology_ext102`
3. Run `node scratch/auto_healer.js` to identify all failing modules

### /record returns 400
1. Ensure body has either `tenant_id` OR `decisionId`
2. Check JSON body is well-formed
3. Verify Content-Type: application/json

### Memory leak suspicion
1. `curl /api/v1/pcc-diagnostics/diagnostics` — check `process.memory`
2. Restart server
3. Run `node scratch/perf_benchmark.js` — compare with baseline

---

## Monitoring Checklist (Daily)

- [ ] Server listening on 3201: `Get-NetTCPConnection -LocalPort 3201`
- [ ] Health check returns 200: `curl /health`
- [ ] Master runner passes: `node scratch/master_test_runner.js`
- [ ] Auto-healer shows 0 failures: `node scratch/auto_healer.js`
- [ ] Memory <200MB: `curl /api/v1/pcc-diagnostics/diagnostics`
- [ ] No 500 errors in logs: `Get-Content scratch/server.log -Tail 100`

---

## Emergency Contacts

| Severity | Action |
|---|---|
| Server DOWN | Restart process; check port; check disk |
| Audit failures | Run upgrade scripts; restart server |
| Memory leak | Restart server; investigate via diagnostics |
| Port conflict | Change `$env:PCC_PORT`; update config |

---

## Reference

- **Catalog data**: `scratch/catalog_data/pcc-catalog.json`
- **Search index**: `scratch/catalog_data/pcc-search-index.json`
- **OpenAPI spec**: `openapi-pcc.yaml` (20,161 lines)
- **Module graph**: `scratch/catalog_data/module-graph.json`
- **Perf reports**: `scratch/perf_report.json`
- **Security report**: `scratch/security_audit_report.json`
- **CHANGELOG**: `CHANGELOG.md`
- **Catalog README**: `PCC_CATALOG_README.md`