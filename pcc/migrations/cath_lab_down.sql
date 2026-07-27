-- pcc/migrations/cath_lab_down.sql
-- Non-destructive: only DROPs the cath_lab_* tables.
-- Sandbox only.

BEGIN;

DROP TABLE IF EXISTS cath_lab_audit_log CASCADE;
DROP TABLE IF EXISTS cath_lab_red_flag CASCADE;
DROP TABLE IF EXISTS cath_lab_vessel_intervention CASCADE;
DROP TABLE IF EXISTS cath_lab_procedure CASCADE;

COMMIT;
