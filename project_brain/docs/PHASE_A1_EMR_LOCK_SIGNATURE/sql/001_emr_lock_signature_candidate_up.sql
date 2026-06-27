-- 001_emr_lock_signature_candidate_up.sql
-- CANDIDATE — NOT executed on production yet. Additive, nullable; target clinical tables are EMPTY (0 rows) => no backfill.
-- Run as table owner, atomic, AFTER backup + isolated rehearsal + explicit gate approval.
BEGIN;

-- 1) Add lock/signature columns to core clinical note tables (additive, nullable, default 'draft')
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'medical_records','nursing_assessments','medical_reports','medical_certificates','surgery_anesthesia_records'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS emr_status text DEFAULT ''draft''', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS signed_by_user_id integer', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS signed_at timestamptz', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS locked_at timestamptz', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS integrity_hash text', t);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS lock_reason text', t);
  END LOOP;
END $$;

-- 2) Amendments ledger (tenant-isolated, append-only by convention)
CREATE TABLE IF NOT EXISTS emr_amendments (
  id serial PRIMARY KEY,
  record_type text NOT NULL,
  record_id integer NOT NULL,
  amended_by_user_id integer,
  amended_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  previous_integrity_hash text,
  new_values_summary text,
  tenant_id integer DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer
);
ALTER TABLE emr_amendments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emr_amendments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_emr_amendments_tenant_isolation ON emr_amendments;
CREATE POLICY rls_emr_amendments_tenant_isolation ON emr_amendments
  USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
  WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer);

COMMIT;
-- DO_NOT_EXECUTE on production before backup + rehearsal + explicit approval.
