-- Migration DOWN for PACU (DEP-025)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pacu_audit_iso ON pacu_audit;
ALTER TABLE IF EXISTS pacu_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pacu_audit;

DROP POLICY IF EXISTS pacu_enc_iso ON pacu_encounters;
ALTER TABLE IF EXISTS pacu_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pacu_encounters;

COMMIT;