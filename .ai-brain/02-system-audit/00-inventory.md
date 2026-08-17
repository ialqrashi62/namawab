# System Audit — Production Inventory (as of 2026-08-17)
**Source**: jumanasoft.com (Hetzner ubuntu-8gb-hel1-1)
**Database**: nama_medical_web @ 127.0.0.1:5432

---

## Summary

| Metric | Count |
|---|---|
| Engine files (.js) | 455+ |
| Router files (.js) | 455+ |
| Mounted routes | **1,365** |
| Migration files | 1,172 |
| Tier tables (created via migrations) | 679 |
| All public tables | **1,674** |
| Branches active | 50+ |
| Git commits this session | 13+ |

## Architecture

- **Runtime**: Node.js 20.20.2, Express 4.x
- **Database**: PostgreSQL 14+ (pg pool, AsyncLocalStorage tenant context)
- **Cache**: Redis + MemoryStore fallback
- **Process**: PM2 (nama-medical-erp) @ 204.168.144.74
- **Domain**: jumanasoft.com
- **CDN/Security**: helmet + cors allowlist + CSP report-only + express-rate-limit

## Engine Pattern (canonical)

```js
class ValidationError extends Error { ... }
function ensureNumber(v, f) { ... }
function ensureStr(v, f) { ... }
function ensureEnum(v, f, allowed) { ... }
function ensureBool(v, f) { ... }

function func_name(req) {
  ensureStr(req.field, 'field');
  // ... validation logic
  return { status, ...result };
}

function funcs() { return { func_name, ... }; }
module.exports = { funcs, CITATIONS, ValidationError };
```

## Router Pattern (canonical)

```js
const express = require('express');
const router = express.Router();
const { funcs, ValidationError } = require('./engine');
const eps = ['name1','name2',...];
function asyncH(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
eps.forEach(name => {
  router.post('/' + name, asyncH((req, res) => {
    try { res.json(funcs()[name](req.body || {})); }
    catch (e) { if (e instanceof ValidationError) return res.status(400).json({ error: e.message, field: e.field }); throw e; }
  }));
});
module.exports = router;
```

## Mount Pattern

```js
try { app.use('/api/PREFIX', require('./ROUTER')); } catch(e) { console.error('PREFIX mount failed', e.message); }
```

## Migration Pattern

```sql
CREATE TABLE IF NOT EXISTS tierN_X_y ( ... );
ALTER TABLE tierN_X_y ENABLE ROW LEVEL SECURITY;
ALTER TABLE tierN_X_y FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tierN_X_y_tenant ON tierN_X_y;
CREATE POLICY tierN_X_y_tenant ON tierN_X_y USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tierN_X_y_tenant_idx ON tierN_X_y (tenant_id, ...);
```

## Wave Inventory (this session)

| Wave | Modules | Endpoints | Status | Memory |
|---|---|---|---|---|
| TIER5 (7 waves) | 42 | 252 | ✅ | tier5_*_ext_6_modules_complete.md (×7) |
| TIER6_VC | 6 | 30 | ✅ | tier6_vc_ext_6_modules_complete.md |
| TIER7_POP_HEALTH | 6 | 30 | ✅ | tier7_pop_health_ext_6_modules_complete.md |
| TIER8_RC | 6 | 30 | ✅ | tier8_rc_ext_6_modules_complete.md |
| TIER9_GOV | 6 | 30 | ✅ | tier9_gov_ext_6_modules_complete.md |
| TIER10_LAB | 6 | 30 | ✅ | tier10_lab_ext_6_modules_complete.md |
| TIER11_RAD | 6 | 30 | ✅ | tier11_rad_ext_6_modules_complete.md |
| TIER12_EMR | 6 | 30 | ✅ | tier12_emr_ext_6_modules_complete.md |
| TIER13_INTEG | 6 | 30 | ✅ | tier13_integ_ext_6_modules_complete.md |
| **TOTAL** | **90** | **492 (smoke-verified)** | | |
