-- Migration DOWN for Pathology (DEP-043)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS path_audit_iso ON path_audit;
ALTER TABLE IF EXISTS path_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS path_audit;

DROP POLICY IF EXISTS path_enc_iso ON path_encounters;
ALTER TABLE IF EXISTS path_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS path_encounters;

COMMIT;