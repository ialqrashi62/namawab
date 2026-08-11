-- Migration DOWN for Pediatric_Neurology (DEP-029)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsNeuro_audit_iso ON pedsNeuro_audit;
ALTER TABLE IF EXISTS pedsNeuro_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsNeuro_audit;

DROP POLICY IF EXISTS pedsNeuro_enc_iso ON pedsNeuro_encounters;
ALTER TABLE IF EXISTS pedsNeuro_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsNeuro_encounters;

COMMIT;