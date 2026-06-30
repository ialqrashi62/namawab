-- Migration: Add payment_gateway_ref column to invoices for payment gateway integrations.
BEGIN;

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_gateway_ref VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_gateway_ref ON invoices (payment_gateway_ref);

COMMIT;
