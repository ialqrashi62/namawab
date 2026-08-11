-- Migration DOWN for ENT (DEP-015)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS ent_audit_iso ON ent_audit;
ALTER TABLE IF EXISTS ent_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ent_audit;

DROP POLICY IF EXISTS ent_enc_iso ON ent_encounters;
ALTER TABLE IF EXISTS ent_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS ent_encounters;

COMMIT;