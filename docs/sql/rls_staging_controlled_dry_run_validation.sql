-- Validation scripts for testing RLS policies during controlled dry-run

-- 1. Test Select as Tenant 1 (should see all existing rows)
BEGIN;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 patients count' as label, COUNT(*) FROM patients;
SELECT 'Tenant 1 invoices count' as label, COUNT(*) FROM invoices;
SELECT 'Tenant 1 appointments count' as label, COUNT(*) FROM appointments;
COMMIT;

-- 2. Test Select as Tenant 2 (should see 0 rows, since all existing data is tenant 1)
BEGIN;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 patients count (should be 0)' as label, COUNT(*) FROM patients;
SELECT 'Tenant 2 invoices count (should be 0)' as label, COUNT(*) FROM invoices;
COMMIT;

-- 3. Test Select without any tenant context (should return 0 rows or fail depending on settings)
BEGIN;
SET LOCAL app.tenant_id = '';
SELECT 'No tenant context patients count (should be 0)' as label, COUNT(*) FROM patients;
COMMIT;

-- 4. Test INSERT mismatch (trying to insert tenant 2 row under tenant 1 context - should fail)
BEGIN;
SET LOCAL app.tenant_id = '1';
-- This insert should raise an RLS policy violation error because tenant_id in values (2) does not match app.tenant_id (1)
INSERT INTO patients (file_number, mrn, name_ar, name_en, tenant_id) 
VALUES (9999, 'MRN-999999', 'مريض تجريبي', 'Test Patient RLS', 2);
ROLLBACK;
