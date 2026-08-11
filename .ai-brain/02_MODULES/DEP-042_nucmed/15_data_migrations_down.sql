-- Migration DOWN for Nuclear_Medicine (DEP-042)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS nucmed_audit_iso ON nucmed_audit;
ALTER TABLE IF EXISTS nucmed_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nucmed_audit;

DROP POLICY IF EXISTS nucmed_enc_iso ON nucmed_encounters;
ALTER TABLE IF EXISTS nucmed_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nucmed_encounters;

COMMIT;