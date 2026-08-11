-- Migration DOWN for Pediatric_Nephrology (DEP-030)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsNeph_audit_iso ON pedsNeph_audit;
ALTER TABLE IF EXISTS pedsNeph_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsNeph_audit;

DROP POLICY IF EXISTS pedsNeph_enc_iso ON pedsNeph_encounters;
ALTER TABLE IF EXISTS pedsNeph_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsNeph_encounters;

COMMIT;