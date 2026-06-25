-- e2_03_record_access_down.sql  (rollback of e2_03_record_access_up.sql)
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL.
-- يحذف سياسة العزل ثم جدول record_access_log. idempotent (IF EXISTS).
BEGIN;

DROP POLICY IF EXISTS rls_record_access_log_tenant_isolation ON record_access_log;
ALTER TABLE IF EXISTS record_access_log DROP CONSTRAINT IF EXISTS chk_record_access_type;
DROP TABLE IF EXISTS record_access_log;

COMMIT;
