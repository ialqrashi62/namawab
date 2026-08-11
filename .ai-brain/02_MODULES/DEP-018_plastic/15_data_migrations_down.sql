-- Migration DOWN for Plastic_Burns (DEP-018)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS plastic_audit_iso ON plastic_audit;
ALTER TABLE IF EXISTS plastic_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS plastic_audit;

DROP POLICY IF EXISTS plastic_enc_iso ON plastic_encounters;
ALTER TABLE IF EXISTS plastic_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS plastic_encounters;

COMMIT;