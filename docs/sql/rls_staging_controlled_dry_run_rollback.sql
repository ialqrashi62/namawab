-- Rollback scripts to disable RLS and clean up temporary policies

-- 1. Disable RLS on target tables
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- 2. Drop the dry-run policies
DROP POLICY IF EXISTS dry_run_patients_tenant_isolation ON patients;
DROP POLICY IF EXISTS dry_run_invoices_tenant_isolation ON invoices;
DROP POLICY IF EXISTS dry_run_appointments_tenant_isolation ON appointments;
