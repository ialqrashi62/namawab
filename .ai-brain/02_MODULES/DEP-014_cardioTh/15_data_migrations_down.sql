-- Migration DOWN for Cardiothoracic_Surgery (DEP-014)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS cardioTh_audit_iso ON cardioTh_audit;
ALTER TABLE IF EXISTS cardioTh_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardioTh_audit;

DROP POLICY IF EXISTS cardioTh_enc_iso ON cardioTh_encounters;
ALTER TABLE IF EXISTS cardioTh_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS cardioTh_encounters;

COMMIT;