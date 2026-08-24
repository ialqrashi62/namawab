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

## Known Limitations

- **Boot smoke test blocked locally**: `server.js:10` requires `./db_postgres.js`, which has never existed in this repo copy (absent from HEAD too). Pre-existing condition, unrelated to refactor. Full-boot validation must run where `db_postgres.js` exists (production/staging checkout). All other verification (syntax, per-module runtime, wiring) passes.
- `namaweb` is an independent git repo (nested/submodule): ~381 uncommitted changes including this entire refactor.

## Suggested Next Steps

1. Commit the refactor inside `namaweb/` (single commit or batched by cluster).
2. On a machine with `db_postgres.js`: run boot smoke (`SKIP_SEED=1 PORT=3777 node server.js`) + hit `/api/health`.
3. Optional phase 2: extract remaining top-level helpers (64 defs) into `lib/` engines — diminishing returns; current state already reviewable.
