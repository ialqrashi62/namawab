-- 001_missing_modules_candidate_down.sql  (CANDIDATE rollback — DO_NOT_EXECUTE)
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['document_signatures','fhir_resources','hl7_messages'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS rls_%I_tenant_isolation ON %I', t, t);
  END LOOP;
END $$;
DROP TABLE IF EXISTS hl7_messages;
DROP TABLE IF EXISTS fhir_resources;
DROP TABLE IF EXISTS document_signatures;
COMMIT;
-- Note: only safe because these tables are NEW/empty in the candidate. Never drop populated tables.
