-- Rollback Migration: Remove payment_gateway_ref column from invoices.
BEGIN;

DROP INDEX IF EXISTS idx_invoices_payment_gateway_ref;
ALTER TABLE invoices DROP COLUMN IF EXISTS payment_gateway_ref;

COMMIT;
