# Live deploy — validateBody on jumanasoft.com (204.168.144.74)

**Date:** 2026-06-30 · **Target:** live public hospital server (Hetzner `ubuntu-8gb-hel1-1`),
app dir `/var/www/namaweb`, PM2 `nama-medical-erp`, branch `integration/all-epics` @ `5539629`.
**Access:** `ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74`.

## Why this is NOT the same as the committed remediation
The live server runs the `integration/all-epics` line (EMR/CPOE/LIS/billing epics), which is DIFFERENT
from the `audit/phase-1a-critical-remediation` branch where the original remediation was built. So the
remediation could NOT be deployed by a branch push / file copy — it was ported surgically and the
schemas were re-tuned to be non-breaking against the live route handlers (read directly from the live
`server.js`). Local `namaweb/route_schemas.js` ≠ this live-tuned `route_schemas.live.js` (see diffs below).

## What was deployed (3 changes)
1. `validation.js` — copied verbatim from `namaweb/validation.js` (pure, dependency-free, fail-closed).
2. `route_schemas.js` — the LIVE-TUNED schema in this folder (`route_schemas.live.js`).
3. `server.js` — 5 surgical edits (require + 4 route wirings), exact strings below.

### server.js edit 1 — add requires (after the billing_integrity require, ~line 297)
```js
const { validateBody } = require('./validation');
const RS = require('./route_schemas');
```
### server.js edits 2-5 — insert `validateBody(...)` as the last middleware before each handler
| Route | before | after (added) |
|---|---|---|
| POST /api/patients | `requireRole('patients'), async` | `requireRole('patients'), validateBody(RS.patientCreate), async` |
| POST /api/invoices | `requireRole('invoices', 'accounts'), async` | `..., validateBody(RS.invoiceCreate), async` |
| POST /api/finance/journal | `requireTenantScope, async` | `requireTenantScope, validateBody(RS.journalCreate), async` |
| POST /api/invoices/:id/refund | `requireTenantScope, async` | `requireTenantScope, validateBody(RS.invoiceRefund), async` |

## Live-tuning vs the committed schemas (so it does NOT break live data)
- **journal.entry_date → OPTIONAL** (committed copy had it REQUIRED). The live handler defaults it:
  `entry_date || new Date().toISOString().slice(0,10)`, so requiring it would reject valid entries.
- **patient gender/phone → bounded STRINGS, not enum/regex.** Live data may store Arabic gender
  ("ذكر"/"أنثى") and varied phone formats; a PII read to confirm was (correctly) harness-blocked, so we
  loosened to TYPE+LENGTH only to guarantee no false rejection. `national_id` stays a lenient string.
- patient schema expanded to the ~16 fields the live route reads. `validateBody` only writes
  `req.validated` and never mutates `req.body`, so all live fields + money (billing_integrity.parseMoney)
  + journal lines (finance_engine.validateBalancedEntry) pass through untouched.

## How it was deployed (safe path, with rollback)
scp → `/var/www/namaweb/.deploy_staging/` → `node --check` + require-resolution + schema-build test →
backup live `server.js` → copy files in → `node --check` live server.js → `pm2 restart nama-medical-erp`
→ health poll (up to 24s) → on failure auto-restore server.js + remove new files + restart.
Result: health `{"status":"UP","db":"up"}`, pm2 online, restarts 108→109 stable, zero errors. `pm2 save`.

## Rollback (if ever needed)
```bash
cp /root/nama_backups/prewire_20260630_073137/server.js.prewire /var/www/namaweb/server.js
rm -f /var/www/namaweb/validation.js /var/www/namaweb/route_schemas.js
pm2 restart nama-medical-erp --update-env
```
Full pre-deploy snapshots: `/root/nama_backups/20260630_072310/` (tree tar + working_tree.patch + DB dump).

## Follow-up deploy 2026-06-30 — e22 money REAL→NUMERIC (APPLIED)
- server.js edit 6: `GET /api/patients/:id/account` summed `i.total` RAW → `parseFloat(i.total)` (lines
  ~3858-3859). Required because e22 makes the pg driver return those money columns as STRINGS; raw `+`
  would string-concat the patient billed/paid/balance totals. Deployed (backup
  `/root/nama_backups/prefix_20260630_075240/server.js.pre`), health UP.
- Then e22 applied to the live DB (owner-authorized): fresh backup
  `/root/nama_backups/PRE_e22_20260630_075439.dump`, all 13 money cols → NUMERIC(14,2), validate=0,
  pm2 restart, health UP, stable. See `e22_live_runbook.md` (now marked APPLIED) for full procedure +
  rollback (`down.sql` or `pg_restore --clean` the PRE_e22 dump).

## NOT deployed (deliberately)
- audit_middleware + global rate-limiter: inert-by-default, low value → deferred.
