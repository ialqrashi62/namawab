-- Migration DOWN for Transplant_Surgery (DEP-020)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS transplant_audit_iso ON transplant_audit;
ALTER TABLE IF EXISTS transplant_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS transplant_audit;

DROP POLICY IF EXISTS transplant_enc_iso ON transplant_encounters;
ALTER TABLE IF EXISTS transplant_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS transplant_encounters;

COMMIT;