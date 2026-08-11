-- Migration DOWN for Rheumatology (DEP-007)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS rheumatology_audit_iso ON rheumatology_audit;
ALTER TABLE IF EXISTS rheumatology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS rheumatology_audit;

DROP POLICY IF EXISTS rheumatology_enc_iso ON rheumatology_encounters;
ALTER TABLE IF EXISTS rheumatology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS rheumatology_encounters;

COMMIT;