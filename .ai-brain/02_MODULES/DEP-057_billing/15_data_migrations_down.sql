-- Migration DOWN for Billing_Coding (DEP-057)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS billing_audit_iso ON billing_audit;
ALTER TABLE IF EXISTS billing_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS billing_audit;

DROP POLICY IF EXISTS billing_enc_iso ON billing_encounters;
ALTER TABLE IF EXISTS billing_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS billing_encounters;

COMMIT;