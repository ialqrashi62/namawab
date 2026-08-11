-- ============================================================
-- {{DEPT_NAME_AR}} — Migration {{MIGRATION_NUMBER}}
-- {{MIGRATION_DESC_AR}}
-- ============================================================
-- Created: {{DATE}}
-- Author: {{OWNER}}
-- Tenant: applies to all (no tenant-specific data in schema)
-- ============================================================

-- UP ============================================================

BEGIN;

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS {{SCHEMA_NAME}};

-- 2. Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgvector";      -- for RAG embeddings

-- 3. Create enum types
DO $$ BEGIN
  CREATE TYPE {{SCHEMA_NAME}}.{{ENUM_NAME}} AS ENUM (
    '{{VALUE_1}}',
    '{{VALUE_2}}',
    '{{VALUE_3}}'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Create table
CREATE TABLE IF NOT EXISTS {{SCHEMA_NAME}}.{{TABLE_NAME}} (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,

  -- domain columns
  {{COL_1}} {{TYPE_1}} {{NULL_1}} {{CONSTRAINTS_1}},
  {{COL_2}} {{TYPE_2}} {{NULL_2}} {{CONSTRAINTS_2}},
  {{COL_3}} {{TYPE_3}} {{NULL_3}} {{CONSTRAINTS_3}},

  -- audit columns
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_by uuid REFERENCES users(id) ON DELETE RESTRICT,
  is_deleted boolean NOT NULL DEFAULT false,

  -- constraints
  CONSTRAINT {{TABLE_NAME}}_check CHECK ({{CHECK_CONDITION}})
);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_{{TABLE_NAME}}_tenant
  ON {{SCHEMA_NAME}}.{{TABLE_NAME}} (tenant_id);

CREATE INDEX IF NOT EXISTS idx_{{TABLE_NAME}}_patient
  ON {{SCHEMA_NAME}}.{{TABLE_NAME}} (patient_id);

CREATE INDEX IF NOT EXISTS idx_{{TABLE_NAME}}_created_at
  ON {{SCHEMA_NAME}}.{{TABLE_NAME}} (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_{{TABLE_NAME}}_composite
  ON {{SCHEMA_NAME}}.{{TABLE_NAME}} (tenant_id, patient_id, created_at DESC)
  WHERE is_deleted = false;

-- 6. Add RLS (mandatory for NamaMedical)
ALTER TABLE {{SCHEMA_NAME}}.{{TABLE_NAME}} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{SCHEMA_NAME}}.{{TABLE_NAME}} FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS {{TABLE_NAME}}_tenant_isolation ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
CREATE POLICY {{TABLE_NAME}}_tenant_isolation ON {{SCHEMA_NAME}}.{{TABLE_NAME}}
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 7. Add updated_at trigger
CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.fn_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_{{TABLE_NAME}}_updated_at ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
CREATE TRIGGER trg_{{TABLE_NAME}}_updated_at
  BEFORE UPDATE ON {{SCHEMA_NAME}}.{{TABLE_NAME}}
  FOR EACH ROW EXECUTE FUNCTION {{SCHEMA_NAME}}.fn_set_updated_at();

-- 8. Add audit trigger (uses global audit schema)
DROP TRIGGER IF EXISTS trg_{{TABLE_NAME}}_audit ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
CREATE TRIGGER trg_{{TABLE_NAME}}_audit
  AFTER INSERT OR UPDATE OR DELETE ON {{SCHEMA_NAME}}.{{TABLE_NAME}}
  FOR EACH ROW EXECUTE FUNCTION audit.fn_log_change();

-- 9. Grant permissions
GRANT USAGE ON SCHEMA {{SCHEMA_NAME}} TO nama_app, nama_readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON {{SCHEMA_NAME}}.{{TABLE_NAME}} TO nama_app;
GRANT SELECT ON {{SCHEMA_NAME}}.{{TABLE_NAME}} TO nama_readonly;

COMMIT;

-- DOWN ============================================================

BEGIN;

DROP TRIGGER IF EXISTS trg_{{TABLE_NAME}}_audit ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
DROP TRIGGER IF EXISTS trg_{{TABLE_NAME}}_updated_at ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
DROP POLICY IF EXISTS {{TABLE_NAME}}_tenant_isolation ON {{SCHEMA_NAME}}.{{TABLE_NAME}};
DROP TABLE IF EXISTS {{SCHEMA_NAME}}.{{TABLE_NAME}} CASCADE;
-- DROP TYPE IF EXISTS {{SCHEMA_NAME}}.{{ENUM_NAME}};
-- DROP SCHEMA IF EXISTS {{SCHEMA_NAME}} CASCADE;  -- careful: may have other tables

COMMIT;
