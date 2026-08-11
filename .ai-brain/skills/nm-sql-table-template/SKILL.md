---
name: nm-sql-table-template
description: Use when writing any new clinical SQL table. Loads the canonical CREATE TABLE template with FORCE RLS, audit columns, soft-delete, indexes, and policy. Saves ~75% tokens per migration.
---

# SQL Table Template — Token-Saver for Clinical Migrations

## When to use

Any new clinical table (cardiology_assessments, oncology_staging, pediatrics_apgar,
surgery_asa, etc.). Same template, different columns.

## Reference

See `namaweb/migrations/patched/e47_cardiology_up.sql.v2` for a fully filled example
that survives against the live DB.

## Canonical template (drop-in)

```sql
-- migrations/eNN_{dept}_{table}_up.sql
-- {Dept} {Table} — {one-line purpose}
-- Idempotent (CREATE IF NOT EXISTS), tenant-scoped, RLS-enabled.

BEGIN;

-- ============================================================
-- {dept}_{table}
-- ============================================================
CREATE TABLE IF NOT EXISTS {dept}_{table} (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    patient_id      BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id    BIGINT,                               -- omit if no encounters table on live
    assessed_by     BIGINT NOT NULL REFERENCES system_users(id),
    {assessment_type_field} TEXT NOT NULL,
    payload         JSONB NOT NULL,
    result          JSONB,
    score           INTEGER,
    risk            TEXT,
    recommendations JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_{dept}_{table}_tenant
    ON {dept}_{table} (tenant_id);
CREATE INDEX IF NOT EXISTS idx_{dept}_{table}_patient
    ON {dept}_{table} (patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_{dept}_{table}_type
    ON {dept}_{table} ({assessment_type_field}, created_at DESC);

ALTER TABLE {dept}_{table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {dept}_{table} FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS {dept}_{table}_tenant_isolation ON {dept}_{table};
CREATE POLICY {dept}_{table}_tenant_isolation ON {dept}_{table}
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

COMMIT;
```

## Required substitutions

- `{dept}` — short prefix (cardiology, oncology, peds, surgery, pharm, er, endo, pulmo, gi, rheum, ortho, neuro, nephro, obgyn)
- `{table}` — short table name
- `{assessment_type_field}` — if no enum-style discriminator, omit

## Skip-list (omit these lines when not applicable)

| Line | Skip when |
|---|---|
| `encounter_id BIGINT REFERENCES encounters(id)` | Live DB has no `encounters` table; use plain `BIGINT` |
| `REFERENCES patients(id)` | Live DB may have `patients` or specialty-specific encounter tables |
| `REFERENCES system_users(id)` | If table needs no user FK |

## Down migration template

```sql
BEGIN;
DROP POLICY IF EXISTS {dept}_{table}_tenant_isolation ON {dept}_{table};
ALTER TABLE {dept}_{table} DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS {dept}_{table} CASCADE;
COMMIT;
```

## Seed template (optional)

```sql
INSERT INTO {dept}_{table} (tenant_id, patient_id, assessed_by, {assessment_type_field}, payload, score, risk)
SELECT 1, p.id, 1, 'sample', '{}'::jsonb, 0, 'sample'
FROM patients p
WHERE p.tenant_id = 1
LIMIT 5
ON CONFLICT DO NOTHING;
```

## Acceptance gate

- Migration runs without error against fresh DB
- After migration, `\d {dept}_{table}` shows table, indexes, RLS, policy
- `SELECT count(*) FROM {dept}_{table}` returns 0 (empty) without errors
- Re-running the migration is idempotent (no errors)

## Token savings

Average clinical table = 25 lines of repeated boilerplate. With this template the
agent writes only the unique column declarations + assessment_type_field, saving
~75% per migration × ~400 migrations = ~75K lines.
