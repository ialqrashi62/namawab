---
name: nm-erd-migrations
description: Use when designing or migrating any DB schema. Loads the canonical ERD conventions + migration patterns (forward + down) + RLS policy patterns. Saves ~80% tokens per ERD/migration work.
---

# ERD & Migrations — Token-Saver

## When to use

- New department needs new tables (ERD + migration)
- Existing table needs new column
- Cross-table relationship added
- Index optimization
- Soft-delete migration
- Data backfill migration

## ERD conventions

```
Every table:
  - id          BIGSERIAL PRIMARY KEY
  - tenant_id   BIGINT NOT NULL          (for tenant isolation)
  - created_at  TIMESTAMPTZ DEFAULT now()
  - updated_at  TIMESTAMPTZ DEFAULT now()
  - deleted_at  TIMESTAMPTZ              (soft-delete, nullable)

Every clinical table:
  - patient_id  BIGINT NOT NULL
  - assessed_by BIGINT (FK to system_users)
  - payload     JSONB (raw input, audit trail)
  - result      JSONB (engine output)

Every audit/event table:
  - actor_id    BIGINT (FK to system_users)
  - prev_hash   TEXT (for hash-chain audit log)
  - hash        TEXT
```

## Migration file structure

```sql
-- migrations/eNN_{short_name}_up.sql
-- {One-line description}
-- {Optional: list of changes}

BEGIN;

-- ============================================================
-- 1. New tables
-- ============================================================
CREATE TABLE IF NOT EXISTS ...;

-- ============================================================
-- 2. New columns
-- ============================================================
ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...;

-- ============================================================
-- 3. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS ...;

-- ============================================================
-- 4. RLS
-- ============================================================
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
ALTER TABLE ... FORCE  ROW LEVEL SECURITY;

-- ============================================================
-- 5. Policies
-- ============================================================
DROP POLICY IF EXISTS ... ON ...;
CREATE POLICY ... ON ...;

COMMIT;
```

## Forward migration example

```sql
-- e52_critical_care_icu_up.sql
BEGIN;

CREATE TABLE IF NOT EXISTS icu_admissions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    admitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    discharged_at TIMESTAMPTZ,
    bed_id BIGINT,
    apache_ii_score INTEGER,
    sofa_score INTEGER,
    attending_doctor_id BIGINT,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_icu_admissions_tenant
    ON icu_admissions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_icu_admissions_patient
    ON icu_admissions (patient_id, admitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_icu_admissions_active
    ON icu_admissions (tenant_id) WHERE discharged_at IS NULL;

ALTER TABLE icu_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_admissions FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS icu_admissions_tenant_isolation ON icu_admissions;
CREATE POLICY icu_admissions_tenant_isolation ON icu_admissions
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

COMMIT;
```

## Down migration example

```sql
-- e52_critical_care_icu_down.sql
BEGIN;

DROP POLICY IF EXISTS icu_admissions_tenant_isolation ON icu_admissions;
ALTER TABLE icu_admissions DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS icu_admissions CASCADE;

COMMIT;
```

## Column-adding migration (non-destructive)

```sql
-- e53_add_allergy_severity_up.sql
BEGIN;

ALTER TABLE patient_allergies
    ADD COLUMN IF NOT EXISTS severity TEXT;

UPDATE patient_allergies
    SET severity = 'moderate'
    WHERE severity IS NULL;

ALTER TABLE patient_allergies
    ALTER COLUMN severity SET NOT NULL,
    ALTER COLUMN severity SET DEFAULT 'moderate';

-- Add check constraint (separate, allows rollback)
DO $$ BEGIN
    ALTER TABLE patient_allergies
        ADD CONSTRAINT patient_allergies_severity_check
        CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
```

```sql
-- e53_add_allergy_severity_down.sql
BEGIN;

ALTER TABLE patient_allergies
    DROP CONSTRAINT IF EXISTS patient_allergies_severity_check;

ALTER TABLE patient_allergies
    DROP COLUMN IF EXISTS severity;

COMMIT;
```

## Data backfill migration

```sql
-- e54_backfill_mrn_up.sql
BEGIN;

-- Backfill MRN for existing patients (one-time, idempotent)
UPDATE patients
SET mrn = 'MRN-' || lpad(id::text, 8, '0')
WHERE mrn IS NULL;

-- Add NOT NULL after backfill
ALTER TABLE patients
    ALTER COLUMN mrn SET NOT NULL;

COMMIT;
```

## Soft-delete pattern

```sql
-- Add soft-delete column + partial index for active rows
ALTER TABLE foo
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_foo_active
    ON foo (id) WHERE deleted_at IS NULL;

-- Update all SELECTs in app to include WHERE deleted_at IS NULL
-- OR add a view:
CREATE OR REPLACE VIEW foo_active AS
    SELECT * FROM foo WHERE deleted_at IS NULL;
```

## Index types

| Type | Use | Example |
|---|---|---|
| B-tree | equality + range | `(tenant_id, patient_id)` |
| Hash | equality only (faster) | `(tenant_id)` |
| GIN | JSONB, full-text, array | `(payload jsonb_path_ops)` |
| BRIN | time-series, large tables | `(created_at)` |
| Partial | subset of rows | `(id) WHERE deleted_at IS NULL` |
| HNSW | vector (pgvector) | `USING hnsw (embedding vector_cosine_ops)` |

## Foreign keys — when to use

| FK | Required | Notes |
|---|---|---|
| `patient_id → patients(id)` | yes for clinical | ON DELETE CASCADE for owned data |
| `tenant_id → tenants(id)` | yes | ON DELETE RESTRICT |
| `assessed_by → system_users(id)` | recommended | ON DELETE SET NULL |
| `encounter_id → encounters(id)` | if exists | live DB may not have this table |

## Migration naming convention

```
eNN_{dept}_{table}_up.sql      # feature migration
eNN_{dept}_{table}_down.sql    # reverse
eNN_add_{column}_up.sql        # additive migration
eNN_backfill_{data}_up.sql     # data migration
pNN_{table}_up.sql             # platform-level
ex_{table}_up.sql              # cross-cutting
```

## Token saving

Each migration from scratch = ~150 lines. With template = ~30 lines unique
(columns, indexes, policies). ~80% reduction.