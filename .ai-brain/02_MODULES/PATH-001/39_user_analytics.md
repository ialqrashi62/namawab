# User Analytics — Path-001 (PATH-001)
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `path_001_create` | tenant_id, user_id, patient_id_hash |
| `path_001_view` | tenant_id, user_id, duration_ms |
| `path_001_update` | tenant_id, user_id, fields_changed |
| `path_001_delete` | tenant_id, user_id, reason |
| `path_001_print` | tenant_id, user_id, format |
| `path_001_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: Path-001 primary workflow
- step 1: open Path-001 page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: Path-001 AI assist
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
