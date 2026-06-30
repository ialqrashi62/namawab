-- Rollback Migration: Remove custom clinical/admin columns from patients.
BEGIN;

DROP INDEX IF EXISTS idx_patients_mrn;

ALTER TABLE patients DROP COLUMN IF EXISTS mrn;
ALTER TABLE patients DROP COLUMN IF EXISTS allergies;
ALTER TABLE patients DROP COLUMN IF EXISTS chronic_diseases;
ALTER TABLE patients DROP COLUMN IF EXISTS emergency_contact_name;
ALTER TABLE patients DROP COLUMN IF EXISTS emergency_contact_phone;
ALTER TABLE patients DROP COLUMN IF EXISTS address;
ALTER TABLE patients DROP COLUMN IF EXISTS insurance_company;
ALTER TABLE patients DROP COLUMN IF EXISTS insurance_policy_number;
ALTER TABLE patients DROP COLUMN IF EXISTS insurance_class;

COMMIT;
