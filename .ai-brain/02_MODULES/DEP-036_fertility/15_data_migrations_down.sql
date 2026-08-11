-- Migration DOWN for Reproductive_Medicine_IVF (DEP-036)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS fertility_audit_iso ON fertility_audit;
ALTER TABLE IF EXISTS fertility_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS fertility_audit;

DROP POLICY IF EXISTS fertility_enc_iso ON fertility_encounters;
ALTER TABLE IF EXISTS fertility_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS fertility_encounters;

COMMIT;