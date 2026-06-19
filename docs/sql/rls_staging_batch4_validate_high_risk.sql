-- Validation SQL scripts for testing Batch 4 high-risk RLS Enablement
-- ============================================================================

-- 1. Setup testing role if not exists and grant access to the 3 clinical tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON lab_results TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON insurance_claims TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON pharmacy_prescriptions_queue TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select insurance_claims as Tenant 1 (should return rows for tenant 1, which has 3 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 insurance_claims count' as label, COUNT(*) FROM insurance_claims;
RESET ROLE;
COMMIT;

-- 3. Test Select insurance_claims as Tenant 2 (should return 0 rows since all 3 belong to tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 insurance_claims count' as label, COUNT(*) FROM insurance_claims;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on insurance_claims (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO insurance_claims (patient_name, insurance_company, claim_amount, status, tenant_id) 
VALUES ('Test Patient', 'Test Insurance Co', 500.00, 'Pending', 2);
RESET ROLE;
ROLLBACK;

-- 5. Test INSERT mismatch on lab_results (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
-- Trying to insert tenant 1 row under tenant 2 context should fail
INSERT INTO lab_results (order_id, test_id, result_value, is_abnormal, notes, tenant_id) 
VALUES (999, 1, 'Normal', false, 'Test RLS', 1);
RESET ROLE;
ROLLBACK;

-- 6. Test INSERT mismatch on pharmacy_prescriptions_queue (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO pharmacy_prescriptions_queue (patient_id, prescription_text, status, tenant_id, branch_id)
VALUES (999, 'Panadol 500mg', 'Pending', 2, 1);
RESET ROLE;
ROLLBACK;
