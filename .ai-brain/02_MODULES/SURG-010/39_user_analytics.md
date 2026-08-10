# User Analytics — Surg-010 (SURG-010)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `surg_010_create` | tenant_id, user_id, patient_id_hash |
| `surg_010_view` | tenant_id, user_id, duration_ms |
| `surg_010_update` | tenant_id, user_id, fields_changed |
| `surg_010_delete` | tenant_id, user_id, reason |
| `surg_010_print` | tenant_id, user_id, format |
| `surg_010_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Surg-010 primary workflow
- step 1: open Surg-010 page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Surg-010 AI assist
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
