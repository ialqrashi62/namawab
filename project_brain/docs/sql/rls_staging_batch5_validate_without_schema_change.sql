-- Validation SQL scripts for testing Batch 5 RLS Enablement
-- ============================================================================

-- 1. Setup testing role if not exists and grant access to the 3 tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON emergency_beds TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON pharmacy_sales TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON pharmacy_sale_items TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select emergency_beds as Tenant 1 (should return 8 rows for tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 emergency_beds count' as label, COUNT(*) FROM emergency_beds;
RESET ROLE;
COMMIT;

-- 3. Test Select emergency_beds as Tenant 2 (should return 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 emergency_beds count' as label, COUNT(*) FROM emergency_beds;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on emergency_beds (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO emergency_beds (bed_name, bed_name_ar, zone, zone_ar, status, tenant_id, branch_id) 
VALUES ('Bed-Test', 'سرير اختبار', 'Zone-A', 'المنطقة أ', 'Available', 2, 1);
RESET ROLE;
ROLLBACK;

-- 5. Test UPDATE cross-tenant on emergency_beds (should fail/update 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
-- Trying to update tenant 1 bed under tenant 2 context should update 0 rows
UPDATE emergency_beds SET status = 'Occupied' WHERE id = 1;
RESET ROLE;
ROLLBACK;

-- 6. Test INSERT mismatch on pharmacy_sales (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO pharmacy_sales (patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share, payment_method, cashier, invoice_number, tenant_id, branch_id)
VALUES (1, 'Cash', 100.0, 0.0, 0.0, 100.0, 'Cash', 'Cashier', 'INV-001', 2, 1);
RESET ROLE;
ROLLBACK;

-- 7. Test INSERT mismatch on pharmacy_sale_items (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO pharmacy_sale_items (sale_id, drug_id, qty, unit_price, total_price, bonus_qty, discount, tenant_id)
VALUES (1, 1, 1, 10.0, 10.0, 0, 0.0, 2);
RESET ROLE;
ROLLBACK;
