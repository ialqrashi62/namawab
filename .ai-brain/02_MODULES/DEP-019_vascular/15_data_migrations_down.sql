-- Migration DOWN for Vascular_Surgery (DEP-019)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS vascular_audit_iso ON vascular_audit;
ALTER TABLE IF EXISTS vascular_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS vascular_audit;

DROP POLICY IF EXISTS vascular_enc_iso ON vascular_encounters;
ALTER TABLE IF EXISTS vascular_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS vascular_encounters;

COMMIT;