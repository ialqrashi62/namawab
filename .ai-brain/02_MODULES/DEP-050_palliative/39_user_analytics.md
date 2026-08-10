# User Analytics — Palliative (DEP-050)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `dep_050_create` | tenant_id, user_id, patient_id_hash |
| `dep_050_view` | tenant_id, user_id, duration_ms |
| `dep_050_update` | tenant_id, user_id, fields_changed |
| `dep_050_delete` | tenant_id, user_id, reason |
| `dep_050_print` | tenant_id, user_id, format |
| `dep_050_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Palliative primary workflow
- step 1: open Palliative page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Palliative AI assist
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
