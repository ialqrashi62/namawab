# Wave 37 — Redis Metric Ping Fix (Closeout)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ Complete

---

## 1. Goal

After Wave 36 silenced the persistent `rls_risk_count_high` alert, the
**only firing alert on prod** was `redis_down` (severity: warning). The
behavior was confusing:

- `/api/health` reported `redis:up` (UP)
- `/api/health/redis?detail=1` reported `{"status":"UP","latencyMs":1,
  "version":"6.0.16","connectedClients":5,...}` (Redis 6.0.16 with 5
  clients connected, 976 KiB used)
- BUT the Wave 32 metric `nama_redis_up` reported **0** and the alert
  `redis_down` fired continuously.

Root cause: `wave32_metrics.js:207` reads
`global.__nama_app.locals.redisClient`, but no code in
`server.js` ever assigns `global.__nama_app = app`. Server.js does
expose `app.locals.redisClient = redisClient` (line 293), but the
metric probe looked at the wrong accessor.

Wave 37 fixes the lookup, centralizes the helper, and ships a unit
test that pins the behavior.

---

## 2. What ships

| File | Purpose |
|---|---|
| `namaweb/wave37_redis_metric.js` | `setGlobalApp(app)` registers the app handle on `global.__nama_app`; `resolveRedisClient()` returns the client across every accessor the codebase has used; `probeRedis()` pings with a hard timeout and never throws; `toPrometheusMetric()` renders the gauge. |
| `namaweb/wave37_redis_metric_test.js` | 19 unit / structural / safety tests (all PASS on local + prod). |
| `namaweb/server.js` (patched) | `require('./wave37_redis_metric')` at the top; `wave37.setGlobalApp(app)` runs once near the boot path, after `app = express()`. |
| `namaweb/wave32_metrics.js` (patched) | Replaced the inline `global.__nama_app...` block with `w37.resolveRedisClient()` + `w37.probeRedis()`; surfaces the latency in a new `nama_redis_ping_ms` gauge. |
| `WAVE_37_REDIS_METRIC_AR.md` | This report. |

No DB changes. No env changes. No PG restart. No deployment of new
artifacts beyond source files.

---

## 3. The fix

### Before
```js
// wave32_metrics.js (legacy)
try {
    const rc = (global.__nama_app && global.__nama_app.locals && global.__nama_app.locals.redisClient) || null;
    if (rc && typeof rc.ping === 'function') {
        await rc.ping();
        probe.redisUp = true;
    }
} catch (_) { probe.redisUp = false; }
```

### After
```js
// wave32_metrics.js (Wave 37)
try {
    const w37 = require('./wave37_redis_metric');
    const client = w37.resolveRedisClient();
    const result = await w37.probeRedis(client);
    probe.redisUp = !!result.ok;
    probe.redisLatencyMs = result.latencyMs;
    probe.redisProbeReason = result.reason;
} catch (_) { probe.redisUp = false; }
```

### server.js (Wave 37)
```js
const app = express();
app.set('trust proxy', 1);
app.use(compression());

// Wave 37: register the app handle once so metrics modules can find
// app.locals.redisClient without a circular require.
wave37.setGlobalApp(app);
```

---

## 4. Production impact

| Metric | Before Wave 37 | After Wave 37 |
|---|---|---|
| `nama_redis_up` | 0 | **1** |
| `nama_redis_ping_ms` | (not emitted) | **1** |
| `nama_alerts_firing` | 1 (`redis_down`) | **0** |
| `redis_down` alert | Firing | Silent |
| `/api/health/redis` | UP | UP (unchanged) |
| `/api/health` | redis:up | redis:up (unchanged) |

All other waves still green:
- `nama_db_up 1`
- `nama_audit_chain_gaps 0`
- `nama_rls_audit_undefended 0`
- `/api/metrics/backup` 4/4 = 1
- `/api/metrics/logrotate` 4/4 = 1
- `/api/metrics/rls-defense` 5/5 emitted, `wave36_rls_undefended 0`

The ops dashboard now reports **zero firing alerts**.

---

## 5. Activation steps (executed during the session)

```text
1. Wrote wave37_redis_metric.js + tests locally.
2. 19/19 tests pass locally.
3. Wired wave37 into server.js (setGlobalApp) and wave32_metrics.js
   (probeRedis + resolveRedisClient).
4. SCP'd wave37_redis_metric.js + tests + wave32_metrics.js + server.js to prod.
5. node wave37_redis_metric_test.js on prod → 19/19 PASS.
6. node wave32_metrics_test.js on prod → 9/9 PASS.
7. pm2 reload nama-medical-erp → 4 workers online.
8. curl /api/metrics → nama_redis_up 1, nama_redis_ping_ms 1.
9. After uptime > 60s → nama_alerts_firing 0.
```

---

## 6. Verification

### 6.1 Tests on local + prod (57/57 across waves)

```text
$ node wave37_redis_metric_test.js
[PASS] setGlobalApp: registers the in-process reference
[PASS] setGlobalApp: also writes global.__nama_app when global exists
[PASS] setGlobalApp: ignores null / undefined
[PASS] resolveRedisClient: returns null when no app registered
[PASS] resolveRedisClient: returns the client from the registered app
[PASS] resolveRedisClient: returns the client from global.__nama_app
[PASS] resolveRedisClient: returns null when client has no ping()
[PASS] resolveRedisClient: returns null when locals has no redisClient
[PASS] probeRedis: returns ok=true when ping succeeds
[PASS] probeRedis: returns ok=false when ping throws
[PASS] probeRedis: returns ok=false when ping hangs past timeout
[PASS] probeRedis: returns ok=false with reason=no_client when client is null
[PASS] toPrometheusMetric: emits 1 when ok
[PASS] toPrometheusMetric: emits 0 when not ok
[PASS] toPrometheusMetric: emits 0 when probe is null
[PASS] toPrometheusMetric: appends a custom suffix
[PASS] source file: present and non-empty
[PASS] source file: never embeds a password or KEK phrase
[PASS] source file: never references DELETE FROM or DROP DATABASE
19 passed, 0 failed
```

Plus:
- wave32: 9/9 PASS
- wave36: 19/19 PASS
- wave31: 10/10 PASS

### 6.2 Production endpoint

```text
$ curl -fsS http://127.0.0.1:3000/api/metrics
process_uptime_seconds 123
nama_db_up 1
nama_redis_up 1
nama_redis_ping_ms 1
nama_audit_chain_gaps 0
nama_rls_audit_undefended 0
nama_alerts_firing 0
```

---

## 7. Safety rails respected

- **AGENTS.md §2.2 rail 1** — no secrets. The helper only holds a
  reference to the redis client; never logs connection strings or
  keyspace.
- **Rail 4** — read-only. `probeRedis()` only calls `client.ping()`.
  Never `FLUSHDB`, never `INFO` with secrets.
- **Rail 12** — never logs client config / connection strings.
- **No PG changes** — `wave37` does not touch the database.

---

## 8. Lessons learned

1. **The redis client was always reachable.** The bug was purely
   cosmetic — Redis was up the whole time. The metric just couldn't
   see the client. Fixing it required zero Redis changes, zero DB
   changes, zero env changes — just one line of code at boot.

2. **`global.__nama_app` is a useful pattern for cross-context access.**
   When metrics modules live in separate files and can't `require`
   server.js (circular dep risk), exposing the app handle on
   `global.__nama_app` is the canonical pattern. Wave 37 codifies
   it: a single `setGlobalApp(app)` call at boot, a single
   `resolveRedisClient()` accessor for everyone else.

3. **A persistent alert is always actionable.** `redis_down` had been
   firing silently for weeks — every operator who looked at the
   dashboard saw "1 alert firing" and assumed it was the rls one.
   Wave 36 silenced rls; Wave 37 silenced redis. **The dashboard is
   now green.**

---

## 9. Operational runbook

```bash
# Re-run the helper tests (no DB / no Redis needed).
node /var/www/namaweb/wave37_redis_metric_test.js | tail -3

# Confirm the metric reports 1.
curl -s http://127.0.0.1:3000/api/metrics | grep -E "^nama_redis"

# Confirm Redis really is up.
curl -s http://127.0.0.1:3000/api/health/redis | head

# Confirm the alert is silent.
curl -s http://127.0.0.1:3000/api/metrics | grep "^nama_alerts_firing"
```

---

## 10. Status

- Wave 37 is **committed, deployed, tested (19/19 + 9/9 + 19/19 + 10/10
  = 57 tests on local + prod)**, and the metric `nama_redis_up`
  correctly reports `1` on prod.
- **`nama_alerts_firing 0`** on prod. Zero firing alerts.
- No behavior change to the running server beyond the metric
  reporting correctly + the new `nama_redis_ping_ms` latency gauge.