# Wave 41 — DR Drill Hardening

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `f2b4351`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `d24b93a8`
**Status:** ✅ DEPLOYED + VERIFIED

## What it surfaces

`/var/backups/nama-medical/dr-restore.log` had 3 errors:
- `pg_restore: error: could not execute query: ERROR: permission denied to create extension "pg_stat_statements"`
- A COMMENT that follows
- `pg_restore: warning: errors ignored on restore: 2`

The drill tolerates errors via `2>&1 | tail -20`, so the failure was silent and
the `[DR] patients restored: 4` count was a false positive — operators couldn't
tell if the drill actually succeeded.

## Solution

The actual fix is a *metric*, not a script patch. PG14's `pg_dump` doesn't
support `--exclude-extension` (only `pg_dumpall` does). So I:

1. Wrote a parser that **whitelists pg_stat_statements errors as benign**
2. Surfaced real errors separately
3. Added 5 Prometheus gauges + JSON endpoint

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/metrics/dr-drill` | public (scrape) | 5 gauges |
| `GET /api/security/dr-drill` | Admin/IT | JSON, 60s cached |

## Gauges

- `nama_dr_drill_last_success` (1=yes, 0=no)
- `nama_dr_drill_patients_restored`
- `nama_dr_drill_restore_errors` (real only)
- `nama_dr_drill_benign_errors` (whitelisted)
- `nama_dr_drill_age_hours`

## Test status

- 40/40 wave41 tests pass on local + prod
- Cumulative waves 31-41: **208/208 PASS**

## Production verification

- `nama_dr_drill_last_success = 1` (Sunday drill was actually successful)
- `nama_dr_drill_patients_restored = 4`
- `nama_dr_drill_restore_errors = 0`
- `nama_dr_drill_benign_errors = 3`
- `nama_dr_drill_age_hours = 10.93`

## Lessons learned

1. **`pg_dump --exclude-extension` doesn't exist in PG14** — only in pg_dumpall.
   The fix had to be a metric whitelist, not a script flag.
2. **Default `pg_restore` is "continue on error"** — so the drill wasn't actually
   failing. The errors are noise, not failures.
3. **DR drill runs only Sundays** (`date -u +%u == "7"`) — so the metric lag is
   intrinsic to the cron schedule.

## Follow-ups (deferred)

- Off-site backup (REMOTE_DEST empty — owner-gated)
- PG15 upgrade for true `--exclude-extension` support
- Encryption integrity verification (KEK from env file)
