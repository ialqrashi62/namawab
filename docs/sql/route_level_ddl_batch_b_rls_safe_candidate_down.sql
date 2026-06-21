-- route_level_ddl_batch_b_rls_safe_candidate_down.sql
-- Rollback for Batch B up.sql. Safe only immediately post-deploy (all tables 0 rows). Drops the 7
-- newly-created tables; for the pre-existing insurance_policies, reverts the RLS/tenant_id additions
-- (drops policy, disables FORCE/RLS, drops tenant_id) WITHOUT dropping the table.
BEGIN;
DROP TABLE IF EXISTS pathology_specimens;
DROP TABLE IF EXISTS cssd_batches;
DROP TABLE IF EXISTS cme_events;
DROP TABLE IF EXISTS infection_control_reports;
DROP TABLE IF EXISTS maintenance_orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS pharmacy_prescriptions;
-- insurance_policies pre-existed (0 rows): revert only the candidate's additions
DROP POLICY IF EXISTS rls_insurance_policies_tenant_isolation ON insurance_policies;
ALTER TABLE insurance_policies NO FORCE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ALTER COLUMN tenant_id DROP DEFAULT;
ALTER TABLE insurance_policies DROP COLUMN IF EXISTS tenant_id;
COMMIT;
