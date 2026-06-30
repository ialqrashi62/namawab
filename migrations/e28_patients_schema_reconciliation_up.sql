-- Migration: Add missing clinical and administrative columns to patients table.
BEGIN;

ALTER TABLE patients ADD COLUMN IF NOT EXISTS mrn TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS chronic_diseases TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_company TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_class TEXT DEFAULT '';

-- Add index on MRN for fast lookups
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients (mrn);

COMMIT;
