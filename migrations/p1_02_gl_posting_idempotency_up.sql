-- ============================================================
-- p1_02_gl_posting_idempotency_up.sql
-- PHASE-1 REMEDIATION — GL posting idempotency backstop for finance_journal_entries.
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT DDL APPROVAL (DB gate).
--
-- الهدف: حارس منع الازدواج (double-posting) عند تفعيل الترحيل المحاسبي التلقائي مستقبلاً.
--   finance_engine.idempotencyKey() موجود لكنه غير مربوط، ولا يوجد قيد فريد يمنع تكرار قيد لنفس
--   الحدث المصدر. نضيف عمود idempotency_key + فهرس فريد جزئي على (tenant_id, idempotency_key)
--   بحيث يمنع تكرار الترحيل لنفس المفتاح داخل المستأجر، مع السماح بالصفوف القديمة (idempotency_key IS NULL).
--   التطبيق يحسب المفتاح (مثلاً hash لـ source_type|source_id|event_type|tenant) ويمرّره عند الإدراج.
-- idempotent: ADD COLUMN IF NOT EXISTS + CREATE UNIQUE INDEX IF NOT EXISTS (partial).
-- ============================================================
BEGIN;

ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Partial UNIQUE: blocks a duplicate (tenant, idempotency_key) post; pre-existing NULL keys are exempt.
CREATE UNIQUE INDEX IF NOT EXISTS uq_fje_tenant_idempotency
    ON finance_journal_entries (tenant_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

COMMIT;
