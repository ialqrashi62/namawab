-- Migration DOWN for Dermatology (DEP-009)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS dermatology_audit_iso ON dermatology_audit;
ALTER TABLE IF EXISTS dermatology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS dermatology_audit;

DROP POLICY IF EXISTS dermatology_enc_iso ON dermatology_encounters;
ALTER TABLE IF EXISTS dermatology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS dermatology_encounters;

COMMIT;