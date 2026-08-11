---
name: nm-observability
description: Use when adding structured logging, metrics, traces, or APM to any module. Loads the canonical logger pattern + Prometheus metrics + OpenTelemetry traces. Saves ~70% tokens per observability addition.
---

# Observability — Logs, Metrics, Traces

## When to use

Any module needs structured logging, performance metrics, distributed tracing, or APM.

## 3 pillars

| Pillar | Tool | What you get |
|---|---|---|
| **Logs** | pino + ELK | structured events, queryable |
| **Metrics** | prom-client + Grafana | counters, histograms, gauges |
| **Traces** | OpenTelemetry + Jaeger | request spans, latency breakdown |

## Structured logger (pino)

```js
// namaweb/middleware/logger.js
const pino = require('pino');
const logger = pino({
    name: 'nama-medical',
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: ['req.body.password', 'req.body.mfaCode', 'req.headers.authorization',
                'req.body.dob', 'res.body.patient.dob', '*.ssn'],
        censor: '[REDACTED]'
    },
    formatters: {
        level: (label) => ({ level: label })
    }
});
module.exports = logger;
```

Usage:
```js
const logger = require('./middleware/logger');

logger.info({ tenantId, userId, route: '/api/cardiology/grace' }, 'assessment started');
logger.warn({ tenantId, userId, warning: 'age out of range' }, 'engine warning');
logger.error({ tenantId, userId, err: err.message }, 'assessment failed');
```

## Metrics (prom-client)

```js
// namaweb/middleware/metrics.js
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
    name: 'http_requests_total',
    help: 'HTTP requests count',
    labelNames: ['method', 'route', 'status', 'tenant_id'],
    registers: [register]
});

const httpDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    registers: [register]
});

const engineErrors = new client.Counter({
    name: 'engine_errors_total',
    help: 'Clinical engine errors',
    labelNames: ['engine', 'error_type'],
    registers: [register]
});

module.exports = {
    register,
    httpRequests,
    httpDuration,
    engineErrors
};
```

## Express middleware

```js
// namaweb/middleware/observe.js
const { httpRequests, httpDuration } = require('./metrics');
const logger = require('./logger');

module.exports = function observe(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const dur = Number(process.hrtime.bigint() - start) / 1e9;
        const route = req.route?.path || req.path;
        httpRequests.inc({ method: req.method, route, status: res.statusCode, tenant_id: req.tenantId || 'none' });
        httpDuration.observe({ method: req.method, route, status: res.statusCode }, dur);
        logger.info({
            tenantId: req.tenantId, userId: req.userId,
            method: req.method, route, status: res.statusCode, durationSec: dur
        }, 'http request');
    });
    next();
};

// /metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
```

## OpenTelemetry traces

```js
// namaweb/middleware/trace.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
    }),
    instrumentations: [getNodeAutoInstrumentations()],
    serviceName: 'nama-medical-erp'
});

sdk.start();
process.on('SIGTERM', () => sdk.shutdown().catch(console.error));
```

## Engine instrumentation

```js
const { engineErrors } = require('./middleware/metrics');

function graceScore(input) {
    try {
        // ... calc ...
        return { score, risk, recommendation, cite, version };
    } catch (err) {
        engineErrors.inc({ engine: 'grace', error_type: err.name });
        throw err;
    }
}
```

## Health endpoints

```js
router.get('/health', async (req, res) => {
    const checks = {
        db: await dbHealth(),
        redis: await redisHealth(),
        rls: await rlsHealth()
    };
    const ok = Object.values(checks).every(c => c.ok);
    res.status(ok ? 200 : 503).json({ ok, ...checks });
});

async function dbHealth() {
    try {
        const { rows } = await db.query('SELECT 1 AS up');
        return { ok: rows[0].up === 1 };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}
```

## Anti-patterns

- ❌ `console.log(req.body)` — leaks PHI (RAIL-12)
- ❌ Logging `req.headers.authorization` — leaks token
- ❌ Logging entire DB row — may contain PHI
- ❌ Including `err.stack` in client response — leaks internals

## Token saving

Each observability addition from scratch = ~150 lines. With template = ~40 lines
unique (custom labels, custom metric names). ~70% reduction.