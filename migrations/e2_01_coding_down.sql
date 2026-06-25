-- e2_01_coding_down.sql  (rollback of e2_01_coding_up.sql)
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL.
-- يحذف سياسة العزل ثم جدول coding. idempotent (IF EXISTS). لا يلمس medical_records_coding التركة.
BEGIN;

DROP POLICY IF EXISTS rls_coding_tenant_isolation ON coding;
ALTER TABLE IF EXISTS coding DROP CONSTRAINT IF EXISTS chk_coding_code_system;
DROP TABLE IF EXISTS coding;

COMMIT;
