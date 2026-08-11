-- Migration DOWN for Emergency (DEP-021)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS emergency_audit_iso ON emergency_audit;
ALTER TABLE IF EXISTS emergency_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS emergency_audit;

DROP POLICY IF EXISTS emergency_enc_iso ON emergency_encounters;
ALTER TABLE IF EXISTS emergency_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS emergency_encounters;

COMMIT;