-- ============================================================
-- invoice_schema_drift_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE WITHOUT EXPLICIT DDL APPROVAL.
-- يضيف الأعمدة التي يكتبها server.js إلى جدول invoices لكنها مفقودة على الإنتاج
-- (انحراف مخطط). additive + idempotent. لا يحذف/يغيّر بيانات. 0 صف متأثّر بالقيم
-- (الأعمدة جديدة بقيم افتراضية على جدول بـ3 صفوف).
-- الأنواع تطابق أعراف الجدول الحالي (REAL للنقود، TEXT للنصوص، INTEGER للأعلام، TIMESTAMP).
-- ملاحظة: invoices جدول FORCE-RLS؛ ALTER ADD COLUMN لا يغيّر السياسات.
-- ============================================================
BEGIN;

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount         REAL    DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_reason  TEXT    DEFAULT '';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS created_by       TEXT    DEFAULT '';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS original_amount  REAL    DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancelled        INTEGER DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancel_reason    TEXT    DEFAULT '';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancelled_by     TEXT    DEFAULT '';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS cancelled_at     TIMESTAMP;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount_paid      REAL    DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS balance_due      REAL    DEFAULT 0;

COMMIT;

-- ملاحظة ربط: هذه الأعمدة شرط تشغيلي لعدة مسارات فواتير (إنشاء/إلغاء/دفع جزئي/استرداد)؛
-- بدونها تُخفق تلك المسارات على الإنتاج بخطأ "column does not exist" بصرف النظر عن أي flag.
-- لا تتطلّب backfill (القيم الافتراضية كافية؛ original_amount يساوي total للصفوف القديمة إن لزم —
-- يُحسم في خطة التنفيذ، اختياري وليس ضرورياً للتشغيل).
