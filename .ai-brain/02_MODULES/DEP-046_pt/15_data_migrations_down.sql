-- Migration DOWN for Physical_Therapy_Rehab (DEP-046)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS pt_audit_iso ON pt_audit;
ALTER TABLE IF EXISTS pt_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pt_audit;

DROP POLICY IF EXISTS pt_enc_iso ON pt_encounters;
ALTER TABLE IF EXISTS pt_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pt_encounters;

COMMIT;