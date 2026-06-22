-- 001_phi_vault_candidate_down.sql (rollback — DO_NOT_EXECUTE unless rolling back)
BEGIN;
DROP POLICY IF EXISTS rls_phi_files_tenant_isolation ON phi_files;
DROP TABLE IF EXISTS phi_files;
DROP TABLE IF EXISTS encryption_metadata;
COMMIT;
-- Safe: new empty registry tables. Never drop tables holding live file references without migrating first.
