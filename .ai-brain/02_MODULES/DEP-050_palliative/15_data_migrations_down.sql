-- Migration DOWN for Palliative_Care (DEP-050)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS palliative_audit_iso ON palliative_audit;
ALTER TABLE IF EXISTS palliative_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS palliative_audit;

DROP POLICY IF EXISTS palliative_enc_iso ON palliative_encounters;
ALTER TABLE IF EXISTS palliative_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS palliative_encounters;

COMMIT;