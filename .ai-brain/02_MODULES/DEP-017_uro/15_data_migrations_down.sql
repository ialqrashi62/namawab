-- Migration DOWN for Urology (DEP-017)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS uro_audit_iso ON uro_audit;
ALTER TABLE IF EXISTS uro_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS uro_audit;

DROP POLICY IF EXISTS uro_enc_iso ON uro_encounters;
ALTER TABLE IF EXISTS uro_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS uro_encounters;

COMMIT;