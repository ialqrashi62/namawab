-- Migration DOWN for Pediatric_Surgery (DEP-032)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsSurg_audit_iso ON pedsSurg_audit;
ALTER TABLE IF EXISTS pedsSurg_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsSurg_audit;

DROP POLICY IF EXISTS pedsSurg_enc_iso ON pedsSurg_encounters;
ALTER TABLE IF EXISTS pedsSurg_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsSurg_encounters;

COMMIT;