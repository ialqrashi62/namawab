-- Migration DOWN for Gynecology (DEP-035)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS gyn_audit_iso ON gyn_audit;
ALTER TABLE IF EXISTS gyn_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS gyn_audit;

DROP POLICY IF EXISTS gyn_enc_iso ON gyn_encounters;
ALTER TABLE IF EXISTS gyn_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS gyn_encounters;

COMMIT;