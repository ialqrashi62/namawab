-- Migration DOWN for Pediatric_Development_Rehab (DEP-033)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsDev_audit_iso ON pedsDev_audit;
ALTER TABLE IF EXISTS pedsDev_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsDev_audit;

DROP POLICY IF EXISTS pedsDev_enc_iso ON pedsDev_encounters;
ALTER TABLE IF EXISTS pedsDev_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsDev_encounters;

COMMIT;