# User Analytics — Inventory (DEP-054)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `dep_054_create` | tenant_id, user_id, patient_id_hash |
| `dep_054_view` | tenant_id, user_id, duration_ms |
| `dep_054_update` | tenant_id, user_id, fields_changed |
| `dep_054_delete` | tenant_id, user_id, reason |
| `dep_054_print` | tenant_id, user_id, format |
| `dep_054_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Inventory primary workflow
- step 1: open Inventory page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Inventory AI assist
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
