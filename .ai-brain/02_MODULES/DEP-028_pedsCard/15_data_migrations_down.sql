-- Migration DOWN for Pediatric_Cardiology (DEP-028)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pedsCard_audit_iso ON pedsCard_audit;
ALTER TABLE IF EXISTS pedsCard_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsCard_audit;

DROP POLICY IF EXISTS pedsCard_enc_iso ON pedsCard_encounters;
ALTER TABLE IF EXISTS pedsCard_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pedsCard_encounters;

COMMIT;