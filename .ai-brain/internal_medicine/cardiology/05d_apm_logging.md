# APM & Logging — Cardiology

> **Owner:** DevOps
> **Date:** 2026-07-22

---

## APM Spans

| Span name | Operation | Latency target |
|---|---|---|
| `cardiology.cds.run` | Full CDS pipeline (retrieve + generate + validate) | <2s p95 |
| `cardiology.cds.retrieve` | Vector search + re-rank | <500ms p95 |
| `cardiology.cds.generate` | LLM call | <1500ms p95 |
| `cardiology.cds.validate` | Schema + safety validation | <50ms p95 |
| `cardiology.echo.upload` | DICOM upload + extract | <5s p95 |
| `cardiology.cath.schedule` | Procedure scheduling | <300ms p95 |
| `cardiology.cath.activate_stemi` | STEMI activation | <1s p95 |
| `cardiology.inr.document` | INR visit documentation | <200ms p95 |
| `cardiology.hf.gdmt_update` | GDMT pillar update | <300ms p95 |

## Logs (JSON format)

```json
{
  "timestamp": "2026-07-22T10:15:32.184Z",
  "level": "info",
  "service": "nama-medical-erp",
  "trace_id": "abc123def456",
  "span_id": "span-789",
  "request_id": "req-uuid",
  "user_id": "user-123",
  "tenant_id": 1,
  "patient_id": "PT-10234",
  "action": "cardiology.cds.run",
  "cluster": "cardiology",
  "input_summary": "CHA₂DS₂-VASc for new AF",
  "output_summary": "score=3, anticoag indicated",
  "latency_ms": 1840,
  "tokens_input": 487,
  "tokens_output": 612,
  "cost_usd": 0.0054,
  "model_version": "gpt-4o-mini-2025-01",
  "status": "ok"
}
```

## Required fields

- `timestamp` (ISO 8601, UTC)
- `level` (debug|info|warn|error|fatal)
- `service`
- `trace_id` (for distributed tracing)
- `user_id` (or `system` for background jobs)
- `tenant_id`
- `action` (one of the spans above)
- `status` (ok|error)
- `latency_ms`

## PII Redaction

- Replace `patient_id` with internal ID (never log full national ID or DOB)
- Replace `display_name` with `***`
- Replace `email`, `phone` with `***`
- Audit trail keeps full PHI (encrypted at rest) but is not in application logs

## Alerting

| Alert | Condition | Severity | Action |
|---|---|---|---|
| CDS latency p95 > 3s | 5min rolling | warn | Slack to #cardio-eng |
| CDS error rate > 2% | 15min rolling | warn | Slack |
| Echo upload failures | any | warn | Slack |
| Door-to-balloon > 90min (STEMI) | each event | critical | PagerDuty on-call |
| LangFuse cost > $50/day | daily | warn | Slack to #finance |
| OpenAI 5xx | any | warn | Auto-failover to deterministic |

## Sampling

- INFO: 10% sampling (production), 100% (staging)
- WARN: 100% always
- ERROR: 100% always
- AUDIT: 100% always (compliance requirement)

## Retention

- App logs: 30 days hot, 1 year cold (S3)
- Audit logs: 7 years (compliance)
- APM traces: 14 days
- LangFuse: 90 days

---

End of APM spec.
