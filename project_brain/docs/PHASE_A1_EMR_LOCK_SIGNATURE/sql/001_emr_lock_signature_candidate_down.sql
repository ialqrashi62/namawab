-- 001_emr_lock_signature_candidate_down.sql  (rollback — DO_NOT_EXECUTE unless rolling back)
BEGIN;
DROP POLICY IF EXISTS rls_emr_amendments_tenant_isolation ON emr_amendments;
DROP TABLE IF EXISTS emr_amendments;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'medical_records','nursing_assessments','medical_reports','medical_certificates','surgery_anesthesia_records'
  ] LOOP
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS lock_reason', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS integrity_hash', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS locked_at', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS signed_at', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS signed_by_user_id', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS emr_status', t);
  END LOOP;
END $$;
COMMIT;
-- Safe because target tables are empty in current deployment; never drop columns holding data.
