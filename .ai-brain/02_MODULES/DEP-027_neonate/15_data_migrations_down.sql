-- Migration DOWN for Neonatology (DEP-027)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS neonate_audit_iso ON neonate_audit;
ALTER TABLE IF EXISTS neonate_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS neonate_audit;

DROP POLICY IF EXISTS neonate_enc_iso ON neonate_encounters;
ALTER TABLE IF EXISTS neonate_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS neonate_encounters;

COMMIT;