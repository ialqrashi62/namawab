-- ============================================================
-- Family Medicine — Migration 01: DOWN
-- ============================================================

BEGIN;

DROP TRIGGER IF EXISTS trg_assessments_audit ON family_medicine.assessments;
DROP TRIGGER IF EXISTS trg_assessments_updated_at ON family_medicine.assessments;
DROP POLICY IF EXISTS assessments_tenant_isolation ON family_medicine.assessments;
DROP TABLE IF EXISTS family_medicine.assessments CASCADE;
DROP TYPE IF EXISTS family_medicine.assessment_type;
DROP TYPE IF EXISTS family_medicine.priority;
-- DROP SCHEMA IF EXISTS family_medicine CASCADE; -- careful

COMMIT;
