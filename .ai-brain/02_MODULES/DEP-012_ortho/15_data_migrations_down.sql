-- Migration DOWN for Orthopedics (DEP-012)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS ortho_audit_iso ON ortho_audit;
ALTER TABLE IF EXISTS ortho_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ortho_audit;

DROP POLICY IF EXISTS ortho_enc_iso ON ortho_encounters;
ALTER TABLE IF EXISTS ortho_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ortho_encounters;

COMMIT;