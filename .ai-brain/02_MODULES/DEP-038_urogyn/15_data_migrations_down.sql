-- Migration DOWN for Urogynecology (DEP-038)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS urogyn_audit_iso ON urogyn_audit;
ALTER TABLE IF EXISTS urogyn_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS urogyn_audit;

DROP POLICY IF EXISTS urogyn_enc_iso ON urogyn_encounters;
ALTER TABLE IF EXISTS urogyn_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS urogyn_encounters;

COMMIT;