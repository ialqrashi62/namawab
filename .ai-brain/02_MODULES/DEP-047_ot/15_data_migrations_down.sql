-- Migration DOWN for Occupational_Therapy (DEP-047)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS ot_audit_iso ON ot_audit;
ALTER TABLE IF EXISTS ot_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ot_audit;

DROP POLICY IF EXISTS ot_enc_iso ON ot_encounters;
ALTER TABLE IF EXISTS ot_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ot_encounters;

COMMIT;