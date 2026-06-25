-- e2_02_roi_down.sql  (rollback of e2_02_roi_up.sql)
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL.
-- يحذف سياسة العزل ثم جدول roi_requests. idempotent (IF EXISTS).
BEGIN;

DROP POLICY IF EXISTS rls_roi_requests_tenant_isolation ON roi_requests;
ALTER TABLE IF EXISTS roi_requests DROP CONSTRAINT IF EXISTS chk_roi_status;
DROP TABLE IF EXISTS roi_requests;

COMMIT;
