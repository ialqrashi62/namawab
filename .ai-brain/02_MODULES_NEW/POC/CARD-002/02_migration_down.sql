<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- CARD-002 Migration DOWN — 12 tables
-- NON-DESTRUCTIVE: only DROPs tables created in this migration.

BEGIN;

DROP TABLE IF EXISTS cath_consent CASCADE;
DROP TABLE IF EXISTS cath_audit_log CASCADE;
DROP TABLE IF EXISTS cath_lab_red_flags CASCADE;
DROP TABLE IF EXISTS cath_lab_equipment CASCADE;
DROP TABLE IF EXISTS radiation_dose_log CASCADE;
DROP TABLE IF EXISTS contrast_tracking CASCADE;
DROP TABLE IF EXISTS cath_lab_scheduling CASCADE;
DROP TABLE IF EXISTS tavr_workup CASCADE;
DROP TABLE IF EXISTS structural_heart_mdt CASCADE;
DROP TABLE IF EXISTS stent_registry CASCADE;
DROP TABLE IF EXISTS pci_records CASCADE;
DROP TABLE IF EXISTS cardiac_cath_procedures CASCADE;

COMMIT;

-- FORCE_RLS count: returns to 150.