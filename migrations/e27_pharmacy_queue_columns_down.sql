-- Rollback Migration: Remove custom columns from pharmacy_prescriptions_queue.
BEGIN;

ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS medication_name;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS dosage;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS quantity_per_day;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS frequency;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS duration;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS price;
ALTER TABLE pharmacy_prescriptions_queue DROP COLUMN IF EXISTS payment_method;

COMMIT;
