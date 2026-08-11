-- Migration DOWN for Interventional_Radiology (DEP-041)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS ir_audit_iso ON ir_audit;
ALTER TABLE IF EXISTS ir_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ir_audit;

DROP POLICY IF EXISTS ir_enc_iso ON ir_encounters;
ALTER TABLE IF EXISTS ir_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ir_encounters;

COMMIT;