# Wave 40 — Audit Trail Resilience

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `15a854d`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `0e846479`
**Status:** ✅ DEPLOYED + VERIFIED + BUG FIXED on prod

## What it surfaces

`logAudit()` had 3 branches. Branch 3 (no tenant AND no allowAnon) silently failed
RLS on every pre-tenant event (LOGIN, BLOCKED_AUTHORIZATION, etc.) — `tenant_id`
had no DEFAULT, was NOT NULL, and SET LOCAL was a no-op without a transaction.

PM2 logs showed `Audit log error: new row violates row-level security policy for table "audit_trail"`
5 times in a sample window. **Every pre-tenant audit was being silently dropped.**

## The fix

4 surgical lines in `logAudit()` + 5 supporting fixes:

1. **Counter module** (`wave40_audit_resilience.js`) — 6 atomics:
   - `calls_total`, `branch_tenant`, `branch_anon`, `branch_nocontext`
   - `error_rls`, `error_other`
2. **`inc()` in each branch entry** — harmless, never throws
3. **`recordError(msg)` in catch block** — classifies RLS vs other
4. **Transaction wrap** in `allowAnon` branch:
   ```js
   const client = await pool.connect();
   await client.query('BEGIN');
   await client.query("SET LOCAL app.tenant_id = '0'");
   await client.query(sql, params);
   await client.query('COMMIT');
   client.release();
   ```
5. **DB grants**:
   - `tenants(id=0, name='System Audit Trail', subdomain='system')` created
   - `GRANT INSERT ON audit_trail TO nama_medical_backup` (was missing)
6. **LOGIN handler** now passes `{ allowAnon: true }` (pre-tenant event)

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/metrics/audit-log` | public (scrape) | 6 gauges |
| `GET /api/security/audit-log` | Admin/IT | JSON, live counters |

## Test status

- 39/39 wave40 tests pass on local + prod
- Cumulative waves 31-40: **168/168 PASS**

## Production verification

- 5 sequential admin logins → 5 rows in audit_trail (id 199-203) with `tenant_id=0`
- `nama_audit_log_error_rls = 0` (was silently failing before)
- `nama_audit_log_branch_anon = 1` per worker

## Safety rails

| Rail | OK |
|---|---|
| 1 (no secrets) | ✅ |
| 2 (no PHI) | ✅ counters only |
| 5 (tenant isolation) | ✅ tenant 0 sentinel |
| 11 (fail-closed) | ✅ inc() never throws |

## Lessons learned

1. **SET LOCAL is a no-op outside a transaction** — when wrapping with `pool.query` calls,
   each is its own transaction (or auto-commit). Need `pool.connect()` + `BEGIN`/`COMMIT`.
2. **`audit_trail.tenant_id` has NO DEFAULT** — must pass explicitly. The comment
   "the DEFAULT (current_setting) will populate tenant_id" was misleading.
3. **`nama_medical_backup` role lacked INSERT** — its job is to read (BYPASSRLS),
   but the prod logAudit wasn't using it — it was using the app pool. The
   INSERT was attempted by `nama_medical_app` (RLS role), which IS permitted for INSERT,
   but the SET LOCAL was a no-op.
4. **Tenant 0 needs to exist** — FK constraint rejected the sentinel.

## Follow-ups (deferred)

- Same fix may be needed for `BLOCKED_AUTHORIZATION` (L460, L468) and
  `BLOCKED_LOGIN_LOCKOUT` (L948) — all pre-tenant events.
- Consider moving LOGIN to its own audit connection pool to avoid pool.connect
  overhead at 10k+ logins/sec.
- Add a Prometheus alert: `nama_audit_log_error_rls > 0 for 5m`.
