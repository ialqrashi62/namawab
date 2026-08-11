-- Migration DOWN for Finance_Accounting (DEP-055)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS finance_audit_iso ON finance_audit;
ALTER TABLE IF EXISTS finance_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS finance_audit;

DROP POLICY IF EXISTS finance_enc_iso ON finance_encounters;
ALTER TABLE IF EXISTS finance_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS finance_encounters;

COMMIT;