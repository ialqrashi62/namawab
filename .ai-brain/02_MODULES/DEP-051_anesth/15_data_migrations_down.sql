-- Migration DOWN for Anesthesia (DEP-051)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS anesth_audit_iso ON anesth_audit;
ALTER TABLE IF EXISTS anesth_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS anesth_audit;

DROP POLICY IF EXISTS anesth_enc_iso ON anesth_encounters;
ALTER TABLE IF EXISTS anesth_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS anesth_encounters;

COMMIT;