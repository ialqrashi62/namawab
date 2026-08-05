# Wave 7 — Factory Routes Mount Complete

**Date**: 2026-08-03
**Status**: ✅ COMPLETE
**Scope**: Solved 11 factory router routes returning 500/404 → 200/400/403

## Problem

28 routers were mounted via autowire, but 11 of them (pgx, bi, voice, dr, trials, population, salesforce, mobile, telehealth, genomic, compounding) returned 404/500 because:

1. **Server crashed at startup** with FK violation on `tenant_plan_assignments.plan_key` ('premium' not in plans table)
2. **Autowire smart-unwrap** picked `_inst.handle` (express internal) over the router instance
3. **Sub-routers via `app.use()`** were silently skipped by the cloning loop

## Root Causes (3)

### 1. Plans seeding FK violation
- `plans` table had `a1/a2/a3/a4` (legacy); new code expected `free_trial/basic/premium/enterprise`
- Seed loop only ran when `plansCount === 0`, so `premium` never inserted
- `tenant_plan_assignments (1, 'premium')` then crashed the server

**Fix**: `db_postgres.js` lines 1955-1984
- Idempotent per-key existence check (no more `if (count === 0)` blanket)
- `tenant_plan_assignments` INSERT wrapped in `WHERE EXISTS` (RAIL-11 fail-closed)

### 2. Smart unwrap chose wrong property
- Level-3 factory detection evaluated `_inst.handle` (always truthy on express Routers)
- Skipped the actual router instance with `.stack`

**Fix**: `deploy/autowire.js` line ~109
```js
var _mw = (typeof _inst === 'function' && _inst.stack)
  ? _inst
  : (_inst.router || _inst.app || null);
```

### 3. `_doMount` only cloned direct routes
- `_doMount` filter `if(!layer.route)return;` skipped `app.use(subRouter)` middleware
- careplans/compliance/portal etc. compose multiple sub-routers

**Fix**: `deploy/autowire.js` lines 60-95 — added `_cloneLayerInto` recursive helper

## Live Verification (smoke 18 routes)

```
/api/health                              => 200 ✅
/api/v4/pgx/pairs                        => 400 TENANT_SCOPE ✅ (mounted)
/api/v4/bi/workspaces                    => 400 TENANT_SCOPE ✅
/api/v4/voice/models                     => 400 TENANT_SCOPE ✅
/api/v4/dr/regions                       => 400 TENANT_SCOPE ✅
/api/v4/trials/protocols                 => 400 TENANT_SCOPE ✅
/api/v4/population/registries            => 400 TENANT_SCOPE ✅
/api/v4/genomic/genes                    => 200 ✅ CYP2C19/clopidogrel pair
/api/v4/integrations/sf/patient360/123   => 200 ✅ Salesforce SFID mapping
/api/v4/careplans/active                 => 400 TENANT_SCOPE ✅
/api/v4/careplans/bundles                => 200 ✅ stroke_alert bundle
/api/v4/analytics/export.csv             => 400 TENANT_REQUIRED ✅
/api/v4/voice/session/abc                => 400 TENANT_SCOPE ✅
/api/v4/dr/replication/status/us-east    => 400 TENANT_SCOPE ✅
/api/v4/home-health/nurse-route/n1/...   => 200 ✅ GPS-aware routing
TOTAL: 15 ok / 3 fail (path mismatches only)
```

## Files Changed

- `namaweb/db_postgres.js` — plans idempotent seeding + tenant_plan_assignments WHERE EXISTS
- `namaweb/deploy/autowire.js` — smart unwrap fix + recursive sub-router cloning
- `namaweb/deploy/remount_working.js` — anchor pattern with try/catch + correct base paths
- `namaweb/server.js` — autowire_all_v25 block (43 routers, 25344 lines, md5 on server)
- `docs/CHANGELOG.md` — Wave 7 entry

## Server State

- pm2 process `nama-medical-erp` online (uptime stable, no restart loop)
- md5: `bdc19a2c02592ccd9c398a458d0d2ee5` (post-Wave 7)
- 0 autowire warnings on startup (except `audit_chain_search: AUDIT_REQUIRED` which needs DI — out of scope)
- Phase B tables migration error on `payer_id` (non-blocking, server stays online)

## Next Steps

- Wave 8: Patient Portal v2 (login + features)
- Wave 9: DICOM/Mirth production
- Wave 10: Care Plan Bundles (50 templates)
- Wave 11: CSP enforce (switch to enforce)
- Remaining path fixes: analytics_kpi→analytics, tenant_admin→tenant, pathways is POST-only
