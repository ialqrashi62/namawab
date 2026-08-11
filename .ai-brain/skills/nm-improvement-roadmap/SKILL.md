---
name: nm-improvement-roadmap
description: Use when planning the next development wave after a baseline is established. Ranks improvements by (impact × safety rail relevance) / (effort × risk). Outputs a wave-by-wave rollout plan with concrete SQL/code templates and verification queries.
---

# Improvement Roadmap — Token-Saver

## When to use

After a baseline (deploy, audit, closeout), the team needs a prioritized list of
what to ship next. Inputs:
- Existing feature list
- New compliance requirements
- User feedback
- Competitive gaps

## Priority formula

```
score = (impact × safety_rail_relevance × urgency) / (effort × risk)
```

Each factor scored 1-5.

| Score | Priority |
|---|---|
| ≥ 4.0 | P0 (this sprint) |
| 3.0-3.9 | P1 (next sprint) |
| 2.0-2.9 | P2 (this quarter) |
| 1.0-1.9 | P3 (next quarter) |
| < 1.0 | P4 (backlog) |

## Improvement template

```yaml
improvements:
  - id: IMP-001
    title: "Add FORCE RLS to patient_insurance table"
    description: |
      patient_insurance table currently has RLS enabled but FORCE_RLS not set.
      This means the table owner bypasses RLS. Critical for tenant isolation.
    impact: 5                    # critical: bypass risk
    safety_rails: [RAIL-5, RAIL-11]
    safety_relevance: 5
    urgency: 5                   # recently noticed
    effort: 1                    # one-line SQL
    risk: 1                      # no app change
    score: 25.0                  # top priority
    files: [namaweb/migrations/eNN_force_rls_patient_insurance_up.sql]
    acceptance: "pg_class.relforcerowsecurity = true for patient_insurance"
    verify_query: "SELECT relforcerowsecurity FROM pg_class WHERE relname = 'patient_insurance';"
    eta_minutes: 5

  - id: IMP-002
    title: "Migrate hardcoded ICU strings to i18n keys"
    description: "Hardcoded Arabic in icu-station.js → use data-i18n"
    impact: 2
    safety_rails: []
    safety_relevance: 1
    urgency: 2
    effort: 2
    risk: 1
    score: 2.0
    files: [namaweb/public/js/icu-station.js]
    acceptance: "0 hardcoded Arabic strings in icu-station.js"
    verify_query: "scripts/i18n_audit_strings.js | grep icu-station"
    eta_minutes: 30
```

## Wave planning

```yaml
wave_1:
  name: "Critical safety rail fixes"
  scope: IMP-001, IMP-005, IMP-007
  total_eta_minutes: 240
  total_tokens: 8000
  owners: [security-team]

wave_2:
  name: "Compliance & audit"
  scope: IMP-010, IMP-011, IMP-012
  total_eta_minutes: 480
  total_tokens: 16000
  owners: [compliance-team]

wave_3:
  name: "User-facing UX"
  scope: IMP-020, IMP-021, IMP-022, IMP-023
  total_eta_minutes: 960
  total_tokens: 32000
  owners: [frontend-team]
```

## SQL template (for schema improvements)

```sql
-- migrations/eNN_{short}_up.sql
BEGIN;

-- IMP-001: FORCE RLS on patient_insurance
ALTER TABLE patient_insurance FORCE ROW LEVEL SECURITY;

-- Verify (will be checked in nm-quality-gates)
DO $$ BEGIN
    IF NOT (SELECT relforcerowsecurity FROM pg_class WHERE relname = 'patient_insurance') THEN
        RAISE EXCEPTION 'FORCE_RLS not set';
    END IF;
END $$;

COMMIT;
```

```sql
-- migrations/eNN_{short}_down.sql
BEGIN;

ALTER TABLE patient_insurance NO FORCE ROW LEVEL SECURITY;

COMMIT;
```

## Code template (for app improvements)

```js
// IMP-020: Add input validation
const { validateBody } = require('./mw');
const RS = require('./route_schemas');

router.post('/foo',
    requireAuth, requireTenantScope, requireRole('doctor'),
    validateBody(RS.foo),                // NEW
    idempotencyGuard,
    handler
);
```

## Verification template

```bash
# After applying improvements, run this:
echo "=== IMP-001 verify ==="
ssh root@204.168.144.74 "psql ... -c \"SELECT relforcerowsecurity FROM pg_class WHERE relname = 'patient_insurance';\""

echo "=== IMP-002 verify ==="
node scripts/i18n_audit_strings.js | grep icu-station || echo "OK"

echo "=== IMP-020 verify ==="
grep -A1 "router.post" namaweb/foo_router.js | grep validateBody || echo "FAIL"
```

## Roadmap output

```markdown
# Improvement Roadmap — {Quarter}

## Summary
- 47 improvements identified
- 8 P0, 12 P1, 18 P2, 9 P3 (4 P4 backlog)

## Wave 1 (this week)
| ID | Title | ETA | Owner |
|---|---|---|---|
| IMP-001 | FORCE RLS on patient_insurance | 5 min | security |
| IMP-005 | Add tenant scope check | 30 min | backend |
| IMP-007 | Fix hardcoded JWT secret | 15 min | security |

## Wave 2 (next week)
| ID | Title | ETA | Owner |
|---|---|---|---|
| IMP-010 | PDPL consent capture | 4 hr | compliance |
| IMP-011 | Audit log hash chain | 4 hr | compliance |

## Wave 3 (this month)
| ID | Title | ETA | Owner |
|---|---|---|---|
| IMP-020 | i18n cleanup | 2 hr | frontend |
| IMP-021 | Mobile responsive | 8 hr | frontend |
| IMP-022 | RTL/LTR polish | 4 hr | frontend |

## Done criteria
- All IMPs verified via verify_query / verify_bash
- All IMPs tested (smoke + integration)
- CHANGELOG.md updated
- docs/ROADMAP_QUARTER.md created
```

## Token saving

Each roadmap from scratch = ~400 lines. With template = ~80 lines unique
(specific IMPs, specific scores). ~80% reduction.