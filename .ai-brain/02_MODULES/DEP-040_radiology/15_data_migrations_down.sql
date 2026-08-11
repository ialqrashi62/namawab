-- Migration DOWN for Radiology (DEP-040)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS radiology_audit_iso ON radiology_audit;
ALTER TABLE IF EXISTS radiology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS radiology_audit;

DROP POLICY IF EXISTS radiology_enc_iso ON radiology_encounters;
ALTER TABLE IF EXISTS radiology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS radiology_encounters;

COMMIT;