-- Migration: Add missing columns to pharmacy_prescriptions_queue for CPOE and pharmacy billing.
BEGIN;

ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS medication_name TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS dosage TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS quantity_per_day TEXT DEFAULT '1';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT '';
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS tenant_id INTEGER DEFAULT 1;
ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN IF NOT EXISTS branch_id INTEGER DEFAULT 1;

-- If tenant_id was missing and we need RLS (like on staging)
ALTER TABLE pharmacy_prescriptions_queue ALTER COLUMN tenant_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ph_rx_queue_tenant ON pharmacy_prescriptions_queue (tenant_id, branch_id);

COMMIT;
