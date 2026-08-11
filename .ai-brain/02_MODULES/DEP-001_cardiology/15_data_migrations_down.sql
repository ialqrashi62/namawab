-- Migration DOWN for Cardiology (DEP-001)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS cardiology_audit_iso ON cardiology_audit;
ALTER TABLE IF EXISTS cardiology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardiology_audit;

DROP POLICY IF EXISTS cardiology_enc_iso ON cardiology_encounters;
ALTER TABLE IF EXISTS cardiology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardiology_encounters;

COMMIT;