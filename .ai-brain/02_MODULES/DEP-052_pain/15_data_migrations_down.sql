-- Migration DOWN for Pain_Management (DEP-052)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pain_audit_iso ON pain_audit;
ALTER TABLE IF EXISTS pain_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pain_audit;

DROP POLICY IF EXISTS pain_enc_iso ON pain_encounters;
ALTER TABLE IF EXISTS pain_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pain_encounters;

COMMIT;