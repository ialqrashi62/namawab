---
name: nm-migration-rollout
description: Use when rolling out any new migration to live (Hetzner). Loads the canonical 6-step pipeline: backup → sandbox test → manual up → verify RLS → run down test → commit. Prevents RAIL-4 (DELETE FROM/DROP without backup).
---

# Migration Rollout Pipeline

## Mandatory 6-step pipeline (every migration)

```
1. Backup current DB schema (always)
2. Apply to sandbox DB (nama_medical_web_test)
3. Run \d+ on new tables to verify columns/indexes/RLS/policy
4. Apply to live (nama_medical_web) via psql
5. Re-verify on live
6. Commit + push + log to docs/CHANGELOG.md
```

## Step 1 — Backup schema

```bash
ssh root@204.168.144.74 "pg_dump --schema-only --no-owner nama_medical_web \
  | gzip > /var/backups/schema.before-eNN_$(date +%Y%m%d_%H%M%S).sql.gz"
```

## Step 2 — Sandbox test

```bash
ssh root@204.168.144.74 "psql -U nama_medical_app -d nama_medical_web_test \
  -f /var/www/namaweb/migrations/eNN_xxx_up.sql"
```

If sandbox fails: edit migration until it passes. Never apply a failing migration
to live (RAIL-4).

## Step 3 — Verify on sandbox

```bash
ssh root@204.168.144.74 "psql -U nama_medical_app -d nama_medical_web_test -c \
  '\d {dept}_{table}'"
ssh root@204.168.144.74 "psql -U nama_medical_app -d nama_medical_web_test -c \
  'SELECT pg_class.relname, pg_class.relrowsecurity FROM pg_class WHERE relname = \\'{dept}_{table}\\';'"
ssh root@204.168.144.74 "psql -U nama_medical_app -d nama_medical_web_test -c \
  'SELECT polname FROM pg_policy WHERE polrelid = \\'{dept}_{table}\\'::regclass;'"
```

Expected output:
- Table with all columns, including `tenant_id`
- Indexes: tenant_id, patient_id, type
- `relrowsecurity = t` (RLS enabled)
- ≥ 1 policy named `{dept}_{table}_tenant_isolation`

## Step 4 — Apply to live

```bash
ssh root@204.168.144.74 "cd /var/www/namaweb && \
  psql 'postgresql://nama_medical_app:NamaMedicalApp@2026!@localhost:5432/nama_medical_web?sslmode=disable' \
  -f migrations/eNN_xxx_up.sql"
```

## Step 5 — Re-verify on live

Same queries as Step 3, against `nama_medical_web`.

## Step 6 — Commit + log

```bash
cd c:\Users\ice\Desktop\NMEDCALVSCODE
git add namaweb/migrations/eNN_xxx_up.sql namaweb/migrations/eNN_xxx_down.sql
git commit -m "feat(migrations): add {dept} {table} (eNN)"
git push origin ops/jumanasoft-enterprise-facility-platform-staging-prep
```

Append to `docs/CHANGELOG.md` under `[Unreleased] → Added`:
```
- migration eNN: {dept}.{table} (clinical)
```

## When to roll back

| Symptom | Action |
|---|---|
| Sandbox fails | Fix migration, don't apply |
| Live apply fails mid-transaction | Migration is wrapped in BEGIN/COMMIT; if COMMIT failed, run `*_down.sql` |
| Live table is fine but app 500s | Hot-fix the engine, NOT the table |
| Live data loss | **STOP** — restore from backup `/var/backups/...sql.gz`, escalate |

## Sandbox setup

```bash
ssh root@204.168.144.74 "createdb -O nama_medical_app nama_medical_web_test"
```

## Token saving

Eliminates the ~150-line ops script per migration. The agent follows this 6-step
flow as a checklist, applying one command at a time. ~50 tokens per application
vs ~1500 tokens of custom scripting.

## Reference runs

- `e47_cardiology_assessments` — applied 2026-08-10
- `e48_oncology_staging` — applied 2026-08-10
- `e49_pediatrics_apgar` — applied 2026-08-10
- `e50_surgery_asa` — applied 2026-08-10
- `e51_emergency_esi` — applied 2026-08-10