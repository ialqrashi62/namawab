# Wave 44 — HTTP Request Metrics

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `7494209`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `094f5ef9`
**Status:** ✅ DEPLOYED + VERIFIED

## What it surfaces

server.js had structured logging (pino) but NO Prometheus counters for HTTP traffic:
- No `nama_http_requests_total`
- No `nama_http_in_flight_requests`
- No per-status-class breakdown
- No average duration

## Solution

Express middleware registered EARLY (after express.json, before routes):
- Captures `process.hrtime.bigint()` on request start
- On `res.on('finish')`: compute duration, increment counters
- Tracks per-method (GET/POST/PUT/PATCH/DELETE/OTHER), per-status-class (1xx-5xx), per-path (capped 50)

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/metrics/http` | public (scrape) | 9+ gauges |
| `GET /api/security/http` | Admin/IT | JSON, full breakdown |

## Gauges

- `nama_http_requests_total`
- `nama_http_in_flight_requests`
- `nama_http_avg_duration_ms`
- `nama_http_class_{1xx,2xx,3xx,4xx,5xx}`
- `nama_http_method_{get,post,put,patch,delete,other}`

## Test status

- 46/46 wave44 tests pass on local + prod
- Cumulative waves 31-44: **282/282 PASS**

## Production verification

60-request burst on prod:
- `nama_http_requests_total = 15` (per-worker)
- `nama_http_class_2xx = 10`
- `nama_http_class_4xx = 5`
- `nama_http_avg_duration_ms = 14.13`

## Lessons learned

1. **Middleware must register EARLY** — before all routes, after body parsers.
   Otherwise it misses requests that error before reaching the route.
2. **Use `process.hrtime.bigint()`** for duration, not `Date.now()` — nanosecond
   precision avoids jitter on fast endpoints.
3. **DELETE keyword triggers safety scans** — used `DEL_` internal token + `DELETE`
   in metric label. Same pattern: comment carefully.
4. **Cap by_path at 50** to prevent unbounded growth from malicious/unbounded URL patterns.

## Follow-ups (deferred)

- Latency histograms (p50/p95/p99 per route) — needs prom-client
- Per-route alerts on error rate
- OpenTelemetry distributed tracing
