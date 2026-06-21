-- ============================================================
-- invoice_schema_drift_candidate_down.sql — CANDIDATE ROLLBACK (DO NOT EXECUTE WITHOUT APPROVAL).
-- يتراجع عن up بإسقاط الأعمدة المضافة. آمن لأنها أُضيفت بهذه الترقية (جديدة).
-- تحذير: إن كانت قد عُبّئت ببيانات بعد التطبيق، فالإسقاط يفقدها — يُفضّل backup قبل أي rollback.
-- ============================================================
BEGIN;

ALTER TABLE invoices DROP COLUMN IF EXISTS discount;
ALTER TABLE invoices DROP COLUMN IF EXISTS discount_reason;
ALTER TABLE invoices DROP COLUMN IF EXISTS created_by;
ALTER TABLE invoices DROP COLUMN IF EXISTS original_amount;
ALTER TABLE invoices DROP COLUMN IF EXISTS cancelled;
ALTER TABLE invoices DROP COLUMN IF EXISTS cancel_reason;
ALTER TABLE invoices DROP COLUMN IF EXISTS cancelled_by;
ALTER TABLE invoices DROP COLUMN IF EXISTS cancelled_at;
ALTER TABLE invoices DROP COLUMN IF EXISTS amount_paid;
ALTER TABLE invoices DROP COLUMN IF EXISTS balance_due;

COMMIT;
