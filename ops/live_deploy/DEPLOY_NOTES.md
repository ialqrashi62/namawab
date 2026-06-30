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

## NOT deployed (deliberately)
- audit_middleware + global rate-limiter: inert-by-default, low value → deferred.
- **e22 money REAL→NUMERIC on the live DB**: financial DDL on a running hospital; pg returns NUMERIC as
  STRING afterward and the live (all-epics) money display/sum paths are unverified for that. See
  `e22_live_runbook.md` — verification-first, run in a maintenance window. NOT run autonomously.
