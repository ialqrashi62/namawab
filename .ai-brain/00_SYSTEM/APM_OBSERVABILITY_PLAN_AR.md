# APM, LOGGING, USER ANALYTICS, LLM OBSERVABILITY PLAN
**Last updated:** 2026-08-10

---

## 1. APM (Application Performance Monitoring)

### Stack

- **OpenTelemetry SDK** (Node.js)
- **Prometheus** (metrics)
- **Grafana** (dashboards)
- **Loki** (logs aggregation)
- **Tempo / Jaeger** (distributed tracing)

### Metrics

| Metric | Type | Labels |
|---|---|---|
| `http_request_duration_seconds` | histogram | method, route, status, tenant_id |
| `http_requests_total` | counter | method, route, status, tenant_id |
| `http_requests_in_flight` | gauge | method, route |
| `db_pool_active_connections` | gauge | pool |
| `db_pool_idle_connections` | gauge | pool |
| `db_query_duration_seconds` | histogram | query_name |
| `cache_hit_total` | counter | cache_name |
| `cache_miss_total` | counter | cache_name |
| `session_active_count` | gauge | tenant_id |
| `rls_violation_total` | counter | tenant_id, table |
| `failed_auth_total` | counter | reason |
| `idempotency_replay_total` | counter | route |
| `ai_orchestrator_duration_seconds` | histogram | orchestrator_id |
| `ai_orchestrator_error_total` | counter | orchestrator_id, error_type |
| `nphies_request_duration_seconds` | histogram | endpoint |
| `nphies_rejection_total` | counter | rejection_code |
| `zatca_request_duration_seconds` | histogram | endpoint |

### Dashboards (Grafana)

1. **Request overview** — latency p50/p95/p99, error rate, RPS
2. **Per-tenant** — top tenants by RPS, latency, errors
3. **DB pool** — active/idle/waiting connections, slow queries
4. **Sessions** — active count, login rate, MFA enrollment rate
5. **RLS violations** — count by tenant + table
6. **AI orchestrators** — per-orchestrator latency, error rate, cost
7. **NPHIES** — request rate, rejection rate, top rejection codes
8. **ZATCA** — invoice generation rate, credit note rate, error rate

### Alerts

| Trigger | Severity | Channel |
|---|---|---|
| p99 latency > 2s for 5min | High | PagerDuty |
| Error rate > 5% for 5min | High | PagerDuty |
| DB pool waiting > 80% | Medium | email |
| RLS violation | Critical | PagerDuty + SMS |
| Failed auth > 10/min | High | PagerDuty |
| NPHIES error rate > 10% | Medium | email |
| ZATCA endpoint failure | High | PagerDuty |

---

## 2. Structured logging (Winston)

### Format

```json
{
  "timestamp": "2026-08-10T12:34:56.789Z",
  "level": "info",
  "service": "nama-medical-erp",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/clinical/notes",
  "method": "POST",
  "status": 201,
  "duration_ms": 45,
  "msg": "Clinical note created",
  "metadata": {
    "patient_id_hash": "sha256:abc..." // PHI is hashed, not raw
  }
}
```

### Log levels

- **error** — 500 errors, exceptions, RLS violations
- **warn** — 4xx errors (except 404), validation failures, rate limits
- **info** — 2xx and 3xx, audit events
- **debug** — verbose (disabled in production)

### PHI redaction

- Patient identifiers → SHA-256 hash
- Names → replaced with `[REDACTED]`
- Dates of birth → replaced with year only
- All other PHI → `[REDACTED]`
- Tokens / passwords → never logged

### Secrets in logs — NEVER

- `console.log(req.body)` → BANNED (safety rail #12)
- `console.log(req.headers)` → BANNED
- `console.log(DB row)` → only with explicit `redactPHI()` helper

### Log aggregation

- Loki (Grafana)
- Retention: 30 days (hot) · 1 year (cold) · 7+ years for audit log
- Search by: tenant_id, user_id, route, status, trace_id

---

## 3. User analytics

### Tools

- **PostHog** (self-hosted) — product analytics, funnels, retention
- **Mixpanel** (optional) — event analytics

### Events tracked

| Event | Properties |
|---|---|
| `login_success` | tenant_id, user_id, role |
| `login_failed` | tenant_id, attempted_email, reason |
| `logout` | tenant_id, user_id, duration_seconds |
| `patient_view` | tenant_id, user_id, patient_id_hash, section |
| `order_create` | tenant_id, user_id, order_type |
| `prescription_create` | tenant_id, user_id, medication_class |
| `ai_orchestrator_invoke` | tenant_id, user_id, orchestrator_id, latency_ms, cost_tokens |
| `voice_dictation_complete` | tenant_id, user_id, duration_seconds, language |
| `invoice_pay` | tenant_id, user_id, payment_method, amount_bucket |
| `er_disposition` | tenant_id, user_id, esi_level, disposition |

### Funnels

1. **Triage → admit → discharge**
   - step 1: er_triage
   - step 2: er_disposition = admit
   - step 3: adt_discharge
   - conversion rate

2. **Order → result → action**
   - step 1: lab_order_create
   - step 2: lab_result_create
   - step 3: clinical_action

3. **Prescription → dispense → admin**
   - step 1: prescription_create
   - step 2: pharmacy_dispense
   - step 3: mar_administer

### Retention analysis

- DAU / WAU / MAU
- Cohort retention per specialty
- Feature adoption rate

---

## 4. LLM observability

### Tools

- **LangSmith** (LangChain's tracing platform)
- **OpenLLMetry** (OpenTelemetry for LLM)
- **Custom** in-app tracing

### Tracked per LLM call

| Field | Purpose |
|---|---|
| `trace_id` | Link to HTTP request trace |
| `tenant_id` | Multi-tenant accounting |
| `user_id` | Per-user cost |
| `orchestrator_id` | Per-engine usage |
| `model` | e.g. gpt-4o, claude-3-5-sonnet |
| `prompt_tokens` | Input token count |
| `completion_tokens` | Output token count |
| `total_tokens` | Total cost basis |
| `latency_ms` | Performance |
| `cost_usd` | Direct $ tracking |
| `cache_hit` | True/False (prompt caching) |
| `error` | Error type if any |

### Per-orchestrator dashboard

| Orchestrator | Calls/day | Tokens/day | Cost/day | p99 latency |
|---|---|---|---|---|
| ai-cardiology-analyze-ecg | ? | ? | ? | ? |
| ai-cardiology-predict-hf | ? | ? | ? | ? |
| ai-critical-predict-det | ? | ? | ? | ? |
| ai-critical-optimize-vent | ? | ? | ? | ? |
| ai-derm-analyze-lesion | ? | ? | ? | ? |
| ai-diagnostics-scan | ? | ? | ? | ? |
| ai-endocrine-glucose | ? | ? | ? | ? |
| ai-gastro-endoscopy | ? | ? | ? | ? |
| ai-infectious-antibiotic | ? | ? | ? | ? |
| ai-nephrology-biopsy | ? | ? | ? | ? |
| ai-obgyn-peds-fetal | ? | ? | ? | ? |
| ai-oncology-genomics | ? | ? | ? | ? |
| ai-pulmonology-pft | ? | ? | ? | ? |
| ai-rheuma-autoimmune | ? | ? | ? | ? |
| ai-surgery-recovery | ? | ? | ? | ? |
| ai-surgery-report | ? | ? | ? | ? |
| ai-voice-dictation | ? | ? | ? | ? |
| voiceDictationStart | ? | ? | ? | ? |

### Cost controls

- **Per-tenant budget** — hard cap monthly
- **Per-user budget** — soft cap daily
- **Per-orchestrator budget** — hard cap monthly
- **Fallback** — switch to smaller model (e.g. gpt-4o-mini) when budget exceeded
- **Cache** — common queries (ECG, lab values) cached for 24h

### Alerts

| Trigger | Action |
|---|---|
| Daily cost > 80% of cap | Notify admin + log |
| Daily cost > 100% of cap | Block + notify |
| Latency p99 > 10s | Notify |
| Error rate > 5% | Notify + fallback |
| Prompt injection attempt | Log + alert |

---

## 5. Distributed tracing

### Flow

```
HTTP request → trace_id
  ↓
Express middleware (auth, tenant, role) → span
  ↓
Route handler → span
  ↓
validateBody → span
  ↓
Engine (pure logic) → span
  ↓
DB query → span (with query SQL)
  ↓
External API (NPHIES, ZATCA) → span
  ↓
LLM call → span (with tokens + cost)
  ↓
Response → trace complete
```

### OpenTelemetry collector

- Receives OTLP from app
- Stores in Tempo / Jaeger
- UI in Grafana

---

## 6. SLOs

| Service | SLO |
|---|---|
| HTTP API | p99 < 500ms, availability 99.9% |
| DB queries | p99 < 100ms |
| LLM calls | p99 < 5s |
| NPHIES integration | success rate > 95% |
| ZATCA integration | success rate > 99% |
| AI orchestrators | p99 < 10s |
| Auth | p99 < 200ms |

---

## 7. Runbooks (in `ops/runbooks/`)

- DB connection pool exhausted
- NPHIES integration timeout
- ZATCA Phase 2 CSID expired
- Audit log integrity broken
- Redis session store full
- OpenTelemetry collector down
- LLM provider rate limit
- DDoS detected
- Tenant data leak suspected
- Money route error spike

---

End of observability plan.
