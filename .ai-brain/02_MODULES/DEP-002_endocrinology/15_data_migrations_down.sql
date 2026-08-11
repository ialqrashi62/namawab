-- Migration DOWN for Endocrinology (DEP-002)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS endocrinology_audit_iso ON endocrinology_audit;
ALTER TABLE IF EXISTS endocrinology_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS endocrinology_audit;

DROP POLICY IF EXISTS endocrinology_enc_iso ON endocrinology_encounters;
ALTER TABLE IF EXISTS endocrinology_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS endocrinology_encounters;

COMMIT;