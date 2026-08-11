-- Migration DOWN for Quality_Safety (DEP-059)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS quality_audit_iso ON quality_audit;
ALTER TABLE IF EXISTS quality_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS quality_audit;

DROP POLICY IF EXISTS quality_enc_iso ON quality_encounters;
ALTER TABLE IF EXISTS quality_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS quality_encounters;

COMMIT;