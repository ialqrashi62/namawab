# User Analytics — Surg-006 (SURG-006)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `surg_006_create` | tenant_id, user_id, patient_id_hash |
| `surg_006_view` | tenant_id, user_id, duration_ms |
| `surg_006_update` | tenant_id, user_id, fields_changed |
| `surg_006_delete` | tenant_id, user_id, reason |
| `surg_006_print` | tenant_id, user_id, format |
| `surg_006_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Surg-006 primary workflow
- step 1: open Surg-006 page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Surg-006 AI assist
- step 1: click AI assist
- step 2: invoke orchestrator
- step 3: review suggestion
- step 4: accept or override

Adoption target: > 60%

## Retention

- DAU / WAU / MAU per dept
- Cohort retention per facility type
- Feature adoption rate

## Reports

- Weekly: top events, top users, anomalies
- Monthly: cohort retention, NPS, feature adoption
- Quarterly: ROI calculator input

## Tool

- PostHog (self-hosted) or Mixpanel
- Server-side tracking (no PHI)
