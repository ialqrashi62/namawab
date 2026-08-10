# User Analytics — Peds-002 (PEDS-002)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `peds_002_create` | tenant_id, user_id, patient_id_hash |
| `peds_002_view` | tenant_id, user_id, duration_ms |
| `peds_002_update` | tenant_id, user_id, fields_changed |
| `peds_002_delete` | tenant_id, user_id, reason |
| `peds_002_print` | tenant_id, user_id, format |
| `peds_002_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Peds-002 primary workflow
- step 1: open Peds-002 page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Peds-002 AI assist
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
