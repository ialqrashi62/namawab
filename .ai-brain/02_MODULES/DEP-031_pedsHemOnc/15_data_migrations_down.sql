-- Migration DOWN for Pediatric_HemOnc (DEP-031)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsHemOnc_audit_iso ON pedsHemOnc_audit;
ALTER TABLE IF EXISTS pedsHemOnc_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsHemOnc_audit;

DROP POLICY IF EXISTS pedsHemOnc_enc_iso ON pedsHemOnc_encounters;
ALTER TABLE IF EXISTS pedsHemOnc_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsHemOnc_encounters;

COMMIT;