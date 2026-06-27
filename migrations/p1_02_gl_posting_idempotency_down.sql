-- ============================================================
-- p1_02_gl_posting_idempotency_down.sql  (rollback of p1_02_gl_posting_idempotency_up.sql)
-- Drops the partial unique index and the idempotency_key column.
-- CANDIDATE ONLY — DO NOT EXECUTE WITHOUT EXPLICIT DDL APPROVAL.
-- ============================================================
BEGIN;

DROP INDEX IF EXISTS uq_fje_tenant_idempotency;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS idempotency_key;

COMMIT;
