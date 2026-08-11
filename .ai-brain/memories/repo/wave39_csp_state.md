# Wave 39 — CSP Report Persistence

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `2fffae0`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `df45969a`
**Status:** ✅ DEPLOYED + VERIFIED on prod

## What it does

Stops throwing away CSP violation reports. Every `POST /api/csp-report` body
is persisted to the `csp_reports` table (RLS-scoped to the calling tenant
when context is available, NULL otherwise), and exposes three Prometheus
gauges on `/api/metrics/csp`.

## Files

| File | Purpose |
|---|---|
| `namaweb/wave39_csp.js` | `persistCspReport`, `summarizeCspReports`, `toPrometheusMetrics` |
| `namaweb/wave39_csp_test.js` | 14 tests (PASS on local + prod) |
| `namaweb/migrations/p1_13_wave39_csp_reports_up.sql` | CREATE TABLE + RLS + FORCE RLS + 2 indexes + GRANTs |
| `namaweb/migrations/p1_13_wave39_csp_reports_down.sql` | DROP POLICY + DROP TABLE CASCADE |
| `namaweb/server.js` | handler `async` + 2 new endpoints (metrics, security/csp-reports) + 60s cache |

## Schema

```sql
CREATE TABLE csp_reports (
  id BIGSERIAL PRIMARY KEY,
  tenant_id INTEGER,                 -- nullable when no tenant context
  document_uri TEXT,
  directive TEXT,
  blocked_uri TEXT,
  source_ip TEXT,
  user_agent TEXT,
  raw_body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS policy matches app.tenant_id GUC; FORCED at table-owner level too.
```

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `POST /api/csp-report` | public (rate-limited) | rewritten as async, calls persistCspReport |
| `GET /api/metrics/csp` | public (scrape) | 3 gauges |
| `GET /api/security/csp-reports` | Admin/IT | JSON, 60s cached |

## Test status

- 14/14 wave39 tests pass on local + prod
- Cumulative waves 31-39: **90/90 PASS**

## Safety rails

| Rail | OK |
|---|---|
| 1 (no secrets) | ✅ |
| 2 (no PHI) | ✅ CSP reports are browser-side telemetry, not PHI |
| 5 (tenant isolation) | ✅ RLS + FORCE RLS |
| 11 (fail-closed) | ⚠️ partial — best-effort INSERT inside try/catch because CSP reports are non-critical |
| 12 (no log of body) | ✅ explicit static check in test |

## Lessons learned

1. **Always use exact SQL prefix matching in tests** — regex chains over multi-line SQL
   are fragile and ambiguous (the 24h regex matched the byDirective SQL too).
2. **`\\b` in JS literal becomes literal `\b`** — use `(?!_)` lookahead instead.
3. **create_file with multiline content can fail silently** — fall back to PowerShell
   `Set-Content` with a single-line concatenated string.
4. **`global.__nama_app` was never set** (Wave 37 lesson) — Wave 39 didn't need it
   because `summarizeCspReports` takes the pool explicitly.

## Follow-ups (deferred)

- `csp_violations_threshold_exceeded` Prometheus alert — needs baseline data first.
- Archival/rotation of csp_reports after 90 days.
- Slow-lane analysis of `blocked_uri` patterns.
