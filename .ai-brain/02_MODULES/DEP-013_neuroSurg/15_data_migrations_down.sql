-- Migration DOWN for Neurosurgery (DEP-013)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS neuroSurg_audit_iso ON neuroSurg_audit;
ALTER TABLE IF EXISTS neuroSurg_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS neuroSurg_audit;

DROP POLICY IF EXISTS neuroSurg_enc_iso ON neuroSurg_encounters;
ALTER TABLE IF EXISTS neuroSurg_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS neuroSurg_encounters;

COMMIT;