-- Migration DOWN for Laboratory (DEP-039)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS lab_audit_iso ON lab_audit;
ALTER TABLE IF EXISTS lab_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS lab_audit;

DROP POLICY IF EXISTS lab_enc_iso ON lab_encounters;
ALTER TABLE IF EXISTS lab_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS lab_encounters;

COMMIT;