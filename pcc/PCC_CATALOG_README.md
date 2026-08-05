# PCC Sandbox Catalog — README

> **Status**: Production-ready (v3.316.1) · **Date**: 2026-07-29
>
> 1322 PCC modules registered · 255 categories · 100% audit/live/E2E pass

---

## Overview

The **PCC Sandbox** is a programmable clinical component catalog for the
NamaMedical ERP. It exposes **1322 pure-function clinical modules** as REST
endpoints, each offering ~10 invokable functions. The sandbox is the development
playground for new clinical capabilities before they ship into the production
`namaweb/` ERP.

| Metric | Value |
|---|---|
| Total modules | 1322 |
| Total categories | 255 |
| Live verify PASS | 1322/1322 (100%) |
| Audit PASS | 1313/1313 (100%) |
| E2E test suite | 18/18 (100%) |
| Server port | 3201 |
| Server version | 3.203.0 |
| Catalog version | 3.316.0 |

---

## Quick Start

```bash
cd pcc
node server.js                           # http://localhost:3201

# Catalog endpoints
curl http://localhost:3201/api/v1/pcc-catalog/modules        # all 1322
curl http://localhost:3201/api/v1/pcc-catalog/categories    # 255 groups
curl http://localhost:3201/api/v1/pcc-catalog/module/pcc-cardiology-ext102

# Module endpoints (3 patterns)
curl http://localhost:3201/api/v1/pcc-cardiology-ext102/list
curl -X POST http://localhost:3201/api/v1/pcc-cardiology-ext102/call/CardGenExt \
     -H "Content-Type: application/json" -d '{"hr":80,"systolic":140}'
curl -X POST http://localhost:3201/api/v1/pcc-cardiology-ext102/record \
     -H "Content-Type: application/json" \
     -d '{"tenant_id":"t1","fn":"CardGenExt","input":{"hr":80},"created_by":"alice"}'
```

---

## Module Categories

Top 15 by module count:

| Category | Modules | Examples |
|---|---|---|
| **pediatric** | 420 | pcc_pediatric_neuro_ext, pcc_pediatric_cardiology_ext |
| **neuro** | 199 | pcc_neuro_ext1..ext120, pcc_neuro_ophthalmology |
| **auto** | 127 | pcc_auto_ext1..ext127 (auto-generated baseline) |
| **pain** | 14 | pcc_pain_med, pcc_pain_ext1..ext13 |
| **ent** | 10 | pcc_ent_ext1..ext10 |
| **gi** | 10 | pcc_gi_ext1..ext10 |
| **icu** | 10 | pcc_icu_ext1..ext10, pcc_neonatal_icu |
| **lab** | 10 | pcc_lab_ext1..ext10 |
| **ophth** | 10 | pcc_ophth_ext1..ext10 |
| **psych** | 10 | pcc_psych_ext1..ext10 |
| **rad** | 10 | pcc_rad_ext1..ext10 |
| **rehab** | 10 | pcc_rehab_ext1..ext10 |
| **obgyn** | 9 | pcc_obgyn_ext1..ext9 |
| **pulm** | 9 | pcc_pulm_ext1..ext9 |
| **anesth** | 8 | pcc_anesth_ext1..ext8 |

*Full category list available at `/api/v1/pcc-catalog/categories`.*

---

## API Patterns

### 1. List pattern

```http
GET /api/v1/pcc-<name>/list
```

Returns the module's functions and version metadata.

### 2. Call pattern

```http
POST /api/v1/pcc-<name>/call/<fn>
Content-Type: application/json

{ "input": { /* function-specific payload */ } }
```

Returns `{ module, function, input, score, ts }`. Supports `Idempotency-Key`
header for safe retries on critical paths.

### 3. Record pattern

```http
POST /api/v1/pcc-<name>/record
Content-Type: application/json

{
  "tenant_id": "tenant_001",    // OR decisionId
  "fn": "CardGenExt",
  "input": { "hr": 80 },
  "created_by": "alice"
}
```

Returns the call result + `tenant_id`, `decisionId`, `recorded: true`, and `ts`.

### 4. Catalog endpoints (new in v3.316.0)

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/pcc-catalog/modules` | All 1322 modules + version + count |
| GET | `/api/v1/pcc-catalog/categories` | Modules grouped by 255 categories |
| GET | `/api/v1/pcc-catalog/module/:slug` | Module detail (functions, version) |

---

## Module Format

Each module is a directory with 4 canonical files:

```
pcc_<name>/
├── pcc_<name>_engine.js           # Pure functions, no I/O
├── pcc_<name>_routes.js           # Express router (/list, /call/<fn>, /record)
├── pcc_<name>_test.js             # Unit tests (20 cases)
└── pcc_<name>_integration_test.js # Integration tests (19 cases)
```

### Engine formats supported

1. **Modern function declarations** (preferred)
   ```js
   function Foo(input) {
     return { version: VER, module: MOD, function: 'Foo', input, score, ts };
   }
   module.exports = { Foo };
   ```

2. **module.exports.functions['X']** (legacy P3)
   ```js
   module.exports.functions['Foo'] = function(input) { ... };
   ```

3. **Arrow functions** (modern)
   ```js
   module.exports = { Foo: (input) => ({ ... }) };
   ```

4. **Legacy P3-CC** (upgraded in v3.316.0)
   ```js
   const Engine = { Foo: function(input) { ... } };
   ```

---

## Testing & Verification

```bash
# Audit (1313 modules with new/legacy formats)
node scratch/audit_runner.js

# Live API check (1322 modules)
node scratch/live_verify_all.js

# E2E test suite (18 tests across 6 sections)
node scratch/e2e_pcc_test_suite.js
```

### Audit results (v3.316.1)

```
Auditing 1313 clinical modules (both legacy + new formats)...
---
PASS: 1313
FAIL: 0
```

### Live results

```
Total modules: 1322
---
Total checked: 1322
PASS: 1322
FAIL: 0
```

### E2E results

```
[1] Health check — PASS
[2] PCC Catalog endpoints — 4/4 PASS
[3] Module /list endpoints — 4/4 PASS
[4] Module /call endpoints — 2/2 PASS
[5] Module /record endpoints — 4/4 PASS
[6] Critical clinical calculations — 3/3 PASS

Summary: PASS 18 / FAIL 0
```

---

## Scripts (`scratch/`)

### Generation
- `gen_pcc_catalog.js` — Build catalog data for all modules
- `gen_openapi_pcc.js` — Regenerate openapi-pcc.yaml

### Wiring
- `wire_server_batch.js` — Wire routes into server.js
- `add_pcc_catalog_endpoint.js` — Inject catalog routes

### Validation
- `validate_openapi.js` — Structural validator
- `audit_runner.js` — Multi-format audit
- `live_verify_all.js` — Live API checker
- `e2e_pcc_test_suite.js` — E2E test suite

### Repair
- `upgrade_p3cc_engines.js` — Upgrade legacy P3-CC engines
- `upgrade_minimal_engines.js` — Upgrade to clinical depth
- `upgrade_routes_v2.js` — Add /record endpoint
- `add_tenant_to_record.js` — Add tenant_id check
- `enhance_record_endpoint.js` — Add tenant_id to response
- `fix_decisionId_bug.js` — Fix destructure bug (220 routes)
- `fix_call_endpoints.js` — Fix plan/score refs (220 routes)
- `fix_hyphen_v2.js` — Fix hyphenated function names
- `fix_routes_format.js` — Convert legacy routes

### Other
- `gen_p3master.py` — Master generator (399 modules)
- `restore_hand_written_engines.js` — Restore 9 hand-written engines
- `regen_tests.js` — Regenerate unit/integration tests

---

## Skills (`.agents/skills/`)

| Skill | Purpose |
|---|---|
| `pcc-p3-batch-shipper` | Multi-phase batch (3-124 phases) |
| `pcc-multi-agent` | Parallel 3-agent (Gen/Test/Audit) |
| `pcc-loop-engineering` | Bounded iteration (max 4/phase) |
| `nm-ai-brain-pcc-autopilot` | Full rollout orchestration |
| `pcc-clinical-depth-upgrader` | Upgrade minimal engines |
| `pcc-phase-shipper` | Single phase (3 modules) |
| `pcc-ui-token-saver` | PCC UI token saver |
| `pcc-bugfix-runbook` | 3 recurring URL bugs |

---

## Known Limitations

1. **P3-era /record endpoints** (e.g., `pcc-neuro-ext14/record`) do not validate
   that the requested function name exists. They return 200 with `recorded: true`
   even for unknown fns. New endpoints return 404. Tracked under
   `pcc-bugfix-runbook`.

2. **1322 modules vs 1313 audited**: The audit script counts modules with valid
   engine + routes pairs. The other 9 are utility/admin modules that use a
   different pattern.

3. **597 SQL migrations** are generated but not applied to any DB. The sandbox
   runs in-memory only.

---

## Next Steps (require owner approval)

1. Apply 597 SQL migrations on live DB (PostgreSQL)
2. Deploy to Hetzner port 3101 (production)
3. Integrate PCC catalog UI in main `namaweb/` SPA
4. Enable audit middleware for production-grade tracking
5. Wire up RAG/LangChain copilot for clinical decision support

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 3.316.1 | 2026-07-29 | +3 catalog endpoints, +E2E test suite, +OpenAPI spec, +bug fixes |
| 3.316.0 | 2026-07-29 | 1322 modules, 100% audit/live, legacy upgrade complete |
| 3.41.0  | 2026-07-XX | P3-CC legacy modules shipped |
| 3.0.0   | 2026-XX-XX | Initial sandbox |

---

## References

- **OpenAPI spec**: `openapi-pcc.yaml` (20,161 lines, 1322 modules)
- **Architecture map**: `docs/ARCHITECTURE_MAP_AR.md`
- **AGENTS.md**: project charter, safety rails, phase workflow
- **Memory**: `/memories/repo/pcc_sandbox_v3_316_1.md`