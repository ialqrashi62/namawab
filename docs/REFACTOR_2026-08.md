# Server.js Decomposition Report — Aug 2026

## Results

| Metric | Before | After |
|---|---|---|
| `server.js` size | 22,360 lines | **4,153 lines** (-81.4%) |
| Extracted routers | 0 | **123 modules** (`routes/*.routes.js`, 37,032 lines) |
| Routes extracted | — | **1,013** (+ 2 libs: `lib/notifications`, `lib/billing`) |
| Helper libs (Phase 2) | — | **15 libs**: 6 pure (`lib/*.js`) + 8 pool-bound factories (`lib/pool-fns/*.js`) + `tx.js` |
| QA | — | **123/123 PASS**, WIRING GATE 123/123 |

Remaining in server.js by design: global middleware setup, `corsAllowlist` (closes over `app`), `startServer` boot/seed block (~181L), mounts, SPA catch-all.

## Architecture Pattern

Every extracted module uses factory DI:

```js
// routes/x.routes.js
module.exports = function makeXRouter({ pool, requireAuth, requireRole, ...deps }) {
    const router = express.Router();
    router.get('/api/x', requireAuth, async (req, res) => { ... });
    return router;
};

// server.js mount (signature must match factory exactly):
app.use(require('./routes/x.routes.js')({ pool, requireAuth, requireRole, ...deps }));
```

## Tooling (scratch/)

| Tool | Purpose |
|---|---|
| `extract_routes_generic.ps1` | Route-block extractor: brace-aware `Find-BlockEnd` end detection, prefix boundary regex `(?=['/?])`, guard against swallowing top-level defs. Auto-backups to `local_backups/server.js.pre_<tag>.bak`. |
| `scan_deps.ps1` | Dependency scanner for a route block (defs + dotted roots). Known FPs: `session`, `path`, `app` — verify before adding. |
| `sync_mounts.ps1` | Rewrites every mount's dep list to match its factory signature (idempotent). |
| `tests/qa_routes_generic.test.js` | Per-module contract+runtime QA with auto-trace on failure (`500 at <method> <path> \| last deps: a -> b -> c`). Mocks are chameleon rows + universal Proxy deps. |
| `tests/qa_wiring_gate.test.js` | Fails if any mount signature ≠ factory signature. Run after every extraction. |

### Extraction loop per module
```
backup → scan_deps → extract → fix factory sig → node --check both files
→ add missing QA mocks (if any) → generic QA → wiring gate
```

## Incidents Found & Fixed During Refactor

| Incident | Root cause | Fix |
|---|---|---|
| Global middleware swallowed into `csp-report.routes.js` (cors/json/session vanished from server.js) | Old extractor matched col-0 `^});` but block ended with indented `});` | Restored from `pre_csp-report.bak`; replaced line-range end detection with brace-aware `Find-BlockEnd` + top-level-def guard |
| `/api/or` over-captured `/api/orders`, `/api/orthopedics` | Prefix match without trailing boundary | Boundary lookahead `(?=['/?])` in extractor |
| `crypto.createHash is not a function` | DI mock instead of real builtin | Top-level `const crypto = require('crypto')` in modules using it directly |
| Load-time crashes (`requireTenantAdmin is not defined`) | Dep used inside middleware chain defined at load, missed by runtime-only trace | Wiring gate + grep `\bdep\b` sweep before declaring done |
| PowerShell 5.1 `$arr += ,@($a+1,$b+1)` throws op_Addition | PS parser evaluates expressions inside array literal as Object[] | Precompute ints into variables first |

## Phase 2 — Helper Extraction

68 top-level defs moved out of server.js in 3 passes (each pass: backup → brace-aware cut by name → lib file → require wiring → `node --check` + WIRING GATE + full 123-module QA):

| Pass | Libs | Pattern |
|---|---|---|
| A (pure) | `lib/guards.js`, `roles.js`, `tenant-context.js`, `read-fallback.js`, `mfa.js`, `domain-utils.js` | plain named exports |
| B (pool-bound) | `lib/pool-fns/{audit, auth-session, results-audit, patient360, icu, misc, ai-wrap}.js` | `module.exports = ({ pool, logAudit }) => ({ ...fns })`; server.js destructures once after `pool` init |
| C (stragglers) | `lib/pool-fns/tx.js` + extended tenant-context/domain-utils | same |

Load-order rule: helper requires are inserted at the position of the first removed def, guaranteeing they exist before any mount evaluates them at load time.

## Boot Verification (REAL runtime proof)

The local workspace was missing ~200 runtime files (`db_postgres.js`, engines, services, tier routers) that only existed on the deploy machine. Recovery:

- **~40 core modules restored from git history** (commit `438c4e38` WIP waves 14-25 + `87fbd65c` TIER206-210): `db_postgres.js` (3,209L), `tenant_context`, `sms_service`, `email_service`, `crypto_envelope`, `lis`, `finance_engine`, `bloodbank_compat`, `ob_engine`, seeders, `orders`, `rbac`, `rbac_guards`, `entitlements`, `super_admin`, `plans`, `user_provisioning`, `audit_middleware`, `validation`, `route_schemas`, `password_policy`, `cds`, `ai_langchain_shim`, `clinical_prompts`, `clinical_cpoe`, scoring engines (`esi`, `icu`, `specialty`, `nursing`, `ews`), `result_loop`, `tenant_resolve`, `idempotency`, `e11_insurance_engine`, `pathology_engine`, `e16_inventory_engine`, `e18_hr_engine`, `onboarding`, `payment_adapter`, `billing_integrity`, tier210 router+engine.
- **149 files never existed in this repo** (tier291-310 routers etc., live only on the deploy machine). For local verification only, throwaway stub routers were generated (marker: `TEMP STUB`); they are NOT committed.

### Load-order fixes required after extraction

| Symbol | Problem | Fix |
|---|---|---|
| `crypto` | defined L3263, referenced by invoices mount at load | hoisted to top requires |
| `calcVAT/addVAT` binding | auth mount (L485) evaluated before const init (TDZ) | moved above first consumer mount |
| tx binding (`getPatientActiveMeds`, ...) | pharmacy mount before init | hoisted above pharmacy mount |
| `OB_RBAC`, `E12_WHO_ORDER`, `ZATCA_CREDIT_REASON_CODES`, `RAD_*` consts | same TDZ class | auto-relocated by `depsort.ps1` (static TDZ scanner over all 123 mount dep lists) |

### Result (development env, real PostgreSQL + Redis)

```
GET /api/health   -> 200 {"status":"UP","db":"up","redis":"up",...}
GET /api/patients -> 401 (auth guard active)
GET /api/auth/me  -> 401
GET /             -> 200 SPA
```

Final QA battery after boot fixes: syntax OK, lib load tests PASS, wiring gate PASS, full route QA **123/123 PASS**, `server.js` = **4,157 lines (-81.4%)**.

Bug caught by boot test that mocks missed: `lib/tenant-context.js` referenced `resolveTenantContext` without importing it -> added `require('../tenant_resolve')`.

## Known Limitations

- Tier291-310 router files are absent from this repository copy entirely; mounts for them fail-soft via try/catch in production and via local-only stubs here.
- `namaweb` is an independent git repo (nested/submodule).

## Suggested Next Steps

1. On the deploy machine: pull this branch and diff its `server.js` against the production one before cutover; restore any missing tier routers from the deploy checkout into git.
2. Optional phase 3: extract remaining top-level helpers — diminishing returns; current state is reviewable and runtime-proven.
