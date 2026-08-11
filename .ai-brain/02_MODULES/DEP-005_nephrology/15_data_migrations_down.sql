-- Migration DOWN for Nephrology (DEP-005)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS nephrology_audit_iso ON nephrology_audit;
ALTER TABLE IF EXISTS nephrology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nephrology_audit;

DROP POLICY IF EXISTS nephrology_enc_iso ON nephrology_encounters;
ALTER TABLE IF EXISTS nephrology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS nephrology_encounters;

COMMIT;