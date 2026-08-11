# APM & Logging Configuration — NamaMedical ERP
# Filepath: .ai-brain/07-devops/apm/observability-stack.md
# Generated: 2026-08-08

# APM & Observability Stack

> **Purpose:** Production-grade observability for `namaweb/` deployment on Hetzner
> **Stack:** Prometheus + Grafana + Loki + Tempo + LangFuse (LLM)
> **Owner:** DevOps Team

---

## 1. Metrics (Prometheus + Grafana)

### 1.1 Application Metrics

```yaml
# prometheus.yml (already in .ai-brain/07-devops/monitoring/)
metrics:
  - http_requests_total{tenant_id, route, method, status}
  - http_request_duration_seconds{tenant_id, route, method}
  - http_requests_in_flight{tenant_id, route}
  - nodejs_active_handles
  - nodejs_heap_size_bytes
  - nodejs_eventloop_lag_seconds
  - pg_pool_total_connections
  - pg_pool_idle_connections
  - pg_pool_waiting_clients
```

### 1.2 Business Metrics

```yaml
  - dept_encounters_created_total{tenant_id, dept}
  - dept_orders_created_total{tenant_id, dept, order_type}
  - dept_notes_signed_total{tenant_id, dept}
  - rls_violations_total{tenant_id, table}
  - ai_diagnoses_total{tenant_id, dept}
  - drug_interactions_flagged_total{tenant_id, severity}
  - audit_log_writes_total{tenant_id, action}
```

### 1.3 Custom Metric Exporter

```javascript
// filepath: namaweb/metrics_exporter.js
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// HTTP request duration histogram
const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['tenant_id', 'route', 'method'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
  registers: [register],
});

// RLS violations counter
const rlsViolations = new client.Counter({
  name: 'rls_violations_total',
  help: 'Number of RLS policy violations',
  labelNames: ['tenant_id', 'table'],
  registers: [register],
});

module.exports = { register, httpDuration, rlsViolations };
```

### 1.4 Grafana Dashboards

| Dashboard | Panels | Refresh |
|---|---|---|
| **Overview** | Request rate, error rate, latency, uptime | 10s |
| **Tenant Health** | Per-tenant request rate, errors | 30s |
| **Database** | Connection pool, query duration, locks | 30s |
| **AI / RAG** | LLM calls, token usage, latency | 1m |
| **Business KPIs** | Encounters, orders, signatures | 5m |
| **Security** | Failed logins, RLS violations, audit | 1m |

---

## 2. Logging (Loki + Promtail)

### 2.1 Log Levels

```yaml
log_levels:
  ERROR: # Critical failures, must page
  WARN:  # Recoverable issues, log + dashboard
  INFO:  # Normal operations (request logs, lifecycle)
  DEBUG: # Verbose, off in production
```

### 2.2 Structured Logging Format

```json
{
  "timestamp": "2026-08-08T14:30:00.000Z",
  "level": "INFO",
  "tenant_id": 1,
  "user_id": 42,
  "request_id": "uuid-xxx",
  "route": "POST /api/cardiology/",
  "method": "POST",
  "status": 201,
  "duration_ms": 124,
  "message": "Encounter created",
  "context": {
    "dept": "cardiology",
    "encounter_id": 12345
  }
}
```

### 2.3 PHI Redaction (CRITICAL)

```javascript
// filepath: namaweb/log_redactor.js
const PHI_FIELDS = [
  'mrn', 'national_id', 'phone', 'email', 'address',
  'dob', 'patient_name', 'diagnosis', 'note_text',
  'allergies', 'medications',
];

function redactLog(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const redacted = {};
  for (const [key, value] of Object.entries(obj)) {
    if (PHI_FIELDS.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      redacted[key] = redactLog(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

module.exports = { redactLog };
```

### 2.4 Promtail Config

```yaml
# filepath: .ai-brain/07-devops/monitoring/promtail.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: namaweb
    static_configs:
      - targets: [localhost]
        labels:
          job: namaweb
          __path__: /var/log/namaweb/*.log
    pipeline_stages:
      - json:
          expressions:
            level: level
            tenant_id: tenant_id
      - labels:
          level:
          tenant_id:
      - match:
          selector: '{level="ERROR"}'
          stages:
            - match:
                selector: '{tenant_id!=""}'
                action: drop
                drop_counter_reason: 'redact_PHI'
```

---

## 3. Tracing (Tempo + OpenTelemetry)

### 3.1 Trace Pipeline

```javascript
// filepath: namaweb/tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nama-medical-erp',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318/v1/traces',
  }),
  instrumentations: [
    require('@opentelemetry/instrumentation-express').default,
    require('@opentelemetry/instrumentation-pg').default,
    require('@opentelemetry/instrumentation-http').default,
  ],
});

sdk.start();
```

### 3.2 Span Attributes (per request)

```
http.method = POST
http.route = /api/cardiology/
http.status_code = 201
tenant.id = 1
user.id = 42
dept = cardiology
db.statement = "INSERT INTO cardiology_encounters..."
db.duration_ms = 12
```

---

## 4. LLM Observability (LangFuse)

### 4.1 LangFuse Setup

```yaml
# filepath: .ai-brain/07-devops/llm-observability/langfuse-config.yaml
langfuse:
  public_key: __CHANGE_ME__
  secret_key: __CHANGE_ME__
  host: https://cloud.langfuse.com
  project: nama-medical-prod
```

### 4.2 Tracing Integration

```python
# filepath: 02_MODULES/<dept>/17_rag_pipeline.py (snippet)
from langfuse.callback import CallbackHandler

langfuse_handler = CallbackHandler(
    public_key=os.environ["LANGFUSE_PUBLIC_KEY"],
    secret_key=os.environ["LANGFUSE_SECRET_KEY"],
    tags=["dept:" + code_short, "tenant:" + str(tenant_id)],
)

# Add to chain
chain = build_qa_chain(tenant_id)
result = chain(
    {"question": "..."},
    config={"callbacks": [langfuse_handler]}
)
```

### 4.3 LangFuse Metrics

| Metric | Description | Threshold |
|---|---|---|
| **Faithfulness** | Answer grounded in context | > 0.85 |
| **Answer Relevancy** | Answer addresses question | > 0.80 |
| **Context Precision** | Retrieved chunks are relevant | > 0.85 |
| **Token Cost** | $ per 1000 requests | < $5 |
| **Latency p95** | 95th percentile response time | < 1500ms |

---

## 5. Alerting (Alertmanager)

### 5.1 Critical Alerts (Page immediately)

```yaml
# filepath: .ai-brain/07-devops/monitoring/alerts.yml
groups:
  - name: namaweb-critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Error rate > 5% for 5 minutes"

      - alert: DatabaseDown
        expr: pg_up == 0
        for: 1m
        labels:
          severity: critical

      - alert: RLSViolationSpike
        expr: rate(rls_violations_total[5m]) > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Possible RLS bypass attempt"

      - alert: TenantCrossAccess
        expr: rate(http_requests_total{status="403"}[5m]) > 50
        for: 5m
        labels:
          severity: critical
```

### 5.2 Warning Alerts (Slack notify)

```yaml
      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 10m
        labels:
          severity: warning

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.2
        for: 30m
        labels:
          severity: warning

      - alert: AuditChainBreak
        expr: audit_chain_valid == 0
        for: 1m
        labels:
          severity: warning
```

---

## 6. On-Call Runbook

### 6.1 PagerDuty Integration

```
Service: nama-medical-erp
Escalation Policy:
  - L1: DevOps on-call (responds within 15 min)
  - L2: Backend lead (responds within 30 min)
  - L3: CTO (responds within 60 min)
```

### 6.2 Slack Channels

- `#nama-alerts` — Auto-alerts from Alertmanager
- `#nama-deploys` — CI/CD notifications
- `#nama-incidents` — Active incident coordination

---

## 7. Cost Budget

| Component | Monthly Cost |
|---|---|
| Prometheus + Grafana (self-hosted) | $0 (on Hetzner) |
| Loki + Promtail (self-hosted) | $0 |
| Tempo (self-hosted) | $0 |
| LangFuse Cloud | $0 (free tier, 50k events/mo) |
| PagerDuty | $0 (5 users free) |
| **TOTAL** | **$0** (self-hosted) |

---

## 8. SLAs / SLOs

| Metric | Target |
|---|---|
| **Availability** | 99.9% (8.7h downtime/year) |
| **p95 Latency** | < 200ms |
| **p99 Latency** | < 500ms |
| **Error Rate** | < 0.1% |
| **RAG p95 Latency** | < 1500ms |
| **Backup Recovery Time** | < 1 hour |
| **Backup Recovery Point** | < 1 hour |

---

**Generated:** 2026-08-08 · **Owner:** DevOps Team
