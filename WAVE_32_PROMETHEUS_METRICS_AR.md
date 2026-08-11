# Wave 32 — Prometheus Metrics + Alert Engine (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

Provide a single, unified Prometheus scrape surface at `/api/metrics`
that combines:

- Wave 29 session metrics (sets/gets/deletes/touches/fallbacks/errors)
- Wave 31 RLS audit summary counters
- System probe (uptime, RSS, DB up, Redis up, audit-chain gaps)
- An alert engine that evaluates 7 rules and exposes both a Prometheus
  gauge (`nama_alerts_firing`) and a JSON surface (`/api/metrics/alerts`)
  with remediation text.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave32_metrics.js` | Probe engine + Prometheus exporter + alert rules. |
| `namaweb/wave32_metrics_test.js` | 8 unit tests — all PASS. |
| `server.js` | + `wave32` require, + `/api/metrics` GET, + `/api/metrics/alerts` GET (Admin/IT). |
| `WAVE_32_PROMETHEUS_METRICS_AR.md` | This report. |

---

## 3. Design choices

- **Single scrape surface.** `/api/metrics` returns the full Prometheus
  text format with HELP/TYPE markers. The scrape is operator-facing — no
  auth required (Prometheus convention).
- **Alert JSON surface.** `/api/metrics/alerts` is Admin/IT only and
  returns the firing rules with remediation text — easier to triage
  than gauges.
- **In-process evaluation.** No external alert manager dependency.
  Rules are evaluated on every scrape (with a 30s in-process cache to
  bound DB load).
- **Degraded scrape on error.** The scrape surface itself NEVER 500s.
  If the system probe fails, it emits a degraded-but-valid prom output
  with `nama_alerts_firing 1` so Prometheus alerts keep firing.
- **Pure-function probe.** `probeSystem(pool)` is async but never
  throws; each check is independently wrapped in try/catch.

---

## 4. Alert rules shipped

| ID | Severity | Trigger | Remediation |
|---|---|---|---|
| `db_down` | critical | `SELECT 1` from app pool fails | Check `systemctl status postgresql`; `pg_isready` |
| `redis_down` | warning | Redis configured but `PING` fails | Check `systemctl status redis-server`; sessions fall back to MemoryStore |
| `redis_errors_spike` | warning | `m.redis_errors > 1` | Inspect Redis logs |
| `rls_risk_count_high` | warning | Wave 31 risk count > 50 | Run `node wave31_rls_audit.js` and review findings |
| `audit_chain_gap` | critical | Broken hash-chain links in `audit_trail` | Restore from known-good dump |
| `session_reaper_lagging` | warning | Reaper hasn't run in 24h | Restart the app |
| `process_uptime_low` | warning | Process restarted in last 60s | Inspect `pm2 logs` |

---

## 5. Verification

```
$ node --check wave32_metrics.js
$ node wave32_metrics_test.js
[PASS] evaluateAlerts: db_down fires when dbUp=false
[PASS] evaluateAlerts: redis_down fires when redis configured but down
[PASS] evaluateAlerts: redis_down NOT firing when not configured
[PASS] evaluateAlerts: rls_risk_count_high fires over 50
[PASS] evaluateAlerts: audit_chain_gap fires when > 0
[PASS] evaluateAlerts: process_uptime_low fires when uptime < 60
[PASS] evaluateAlerts: clean probe fires nothing
[PASS] RULES: every rule has id, severity, title, check, remediation
8 passed, 0 failed
```

Live HTTP smoke (server running on port 3999):

```
$ curl /api/metrics
HTTP 200
# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds 204
# HELP process_resident_memory_bytes Node.js RSS in bytes
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 107212800
# HELP nama_db_up 1 if the application DB connection works, 0 otherwise
# TYPE nama_db_up gauge
nama_db_up 1
# HELP nama_redis_up 1 if Redis is connected, 0 otherwise
# TYPE nama_redis_up gauge
nama_redis_up 0
# HELP nama_audit_chain_gaps ...
nama_audit_chain_gaps 0
# + Wave 29 session counters from wave29_sessions.toPrometheusMetrics()
# + Wave 31 RLS audit summary (cached)

$ curl /api/metrics/alerts        # → 401 (auth required, correct)
$ curl /api/metrics/alerts (admin) # → 200 JSON `{alerts: [...], count: N}`
```

---

## 6. Safety rails respected

- **No PHI / no secrets** in the Prometheus output.
- **No DB query beyond `SELECT 1`** in the probe (the audit-chain gap check
  is a single COUNT, cheap).
- **Fail-safe evaluator.** Each rule exception is swallowed; the
  scrape surface always returns valid Prometheus text.
- **No behavior change** to any existing endpoint.

---

## 7. Activation

Routes are mounted in `server.js` and effective on next PM2 restart.

```yaml
# /etc/prometheus/prometheus.yml
scrape_configs:
  - job_name: 'nama-medical-erp'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
```
