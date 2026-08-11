-- ============================================================
-- Family Medicine — Migration 01: Assessments table
-- ============================================================
-- Created: 2026-08-11
-- Author: engineering@namamedical.sa
-- ============================================================

BEGIN;

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS family_medicine;

-- 2. Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Create enum types
DO $$ BEGIN
  CREATE TYPE family_medicine.assessment_type AS ENUM (
    'ascvd_risk',
    'diabetes_risk',
    'smoking_cessation',
    'wellness_screenings',
    'general_visit'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE family_medicine.priority AS ENUM ('routine', 'urgent', 'stat');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Create assessments table
CREATE TABLE IF NOT EXISTS family_medicine.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  encounter_id uuid REFERENCES encounters(id) ON DELETE SET NULL,

  type family_medicine.assessment_type NOT NULL,
  priority family_medicine.priority NOT NULL DEFAULT 'routine',

  -- engine inputs (raw)
  inputs jsonb NOT NULL DEFAULT '{}',

  -- engine outputs (structured)
  result jsonb NOT NULL DEFAULT '{}',

  -- derived
  score numeric(8,2),
  category text,
  risk_pct numeric(5,2),

  -- recommendations
  recommendations text[] NOT NULL DEFAULT '{}',
  codes text[] NOT NULL DEFAULT '{}',

  -- clinical notes
  notes text,
  follow_up_days integer,

  -- audit
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_by uuid REFERENCES users(id) ON DELETE RESTRICT,
  is_deleted boolean NOT NULL DEFAULT false,

  CONSTRAINT assessments_score_check CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_tenant ON family_medicine.assessments (tenant_id);
CREATE INDEX IF NOT EXISTS idx_assessments_patient ON family_medicine.assessments (patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON family_medicine.assessments (type);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON family_medicine.assessments (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_composite ON family_medicine.assessments (tenant_id, patient_id, type, created_at DESC)
  WHERE is_deleted = false;

-- 6. RLS (mandatory)
ALTER TABLE family_medicine.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_medicine.assessments FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS assessments_tenant_isolation ON family_medicine.assessments;
CREATE POLICY assessments_tenant_isolation ON family_medicine.assessments
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- 7. updated_at trigger
CREATE OR REPLACE FUNCTION family_medicine.fn_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assessments_updated_at ON family_medicine.assessments;
CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON family_medicine.assessments
  FOR EACH ROW EXECUTE FUNCTION family_medicine.fn_set_updated_at();

-- 8. audit trigger
DROP TRIGGER IF EXISTS trg_assessments_audit ON family_medicine.assessments;
CREATE TRIGGER trg_assessments_audit
  AFTER INSERT OR UPDATE OR DELETE ON family_medicine.assessments
  FOR EACH ROW EXECUTE FUNCTION observability.fn_log_change();

-- 9. grants
GRANT USAGE ON SCHEMA family_medicine TO nama_app, nama_readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON family_medicine.assessments TO nama_app;
GRANT SELECT ON family_medicine.assessments TO nama_readonly;
GRANT EXECUTE ON FUNCTION family_medicine.fn_set_updated_at TO nama_app;

COMMIT;
