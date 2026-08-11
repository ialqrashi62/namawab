-- Migration DOWN for Facility_Biomedical_Management (DEP-060)
-- Generated: 2026-08-08
-- Reverse of 14_data_migrations_up.sql (non-destructive)
BEGIN;

DROP POLICY IF EXISTS facility_audit_iso ON facility_audit;
ALTER TABLE IF EXISTS facility_audit DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS facility_audit;

DROP POLICY IF EXISTS facility_enc_iso ON facility_encounters;
ALTER TABLE IF EXISTS facility_encounters DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS facility_encounters;

COMMIT;