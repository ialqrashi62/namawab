-- ============================================================
-- invoice_schema_drift_candidate_validate.sql — READ-ONLY تحقّق.
-- شغّل قبل up (يجب أن يُظهر الأعمدة مفقودة) وبعده (يجب أن تكون موجودة).
-- ============================================================

-- 1) عدّ الأعمدة العشرة المطلوبة الموجودة فعلاً (قبل=0 متوقع جزئياً، بعد=10)
SELECT 'present_required_columns' AS check_name, COUNT(*) AS n
FROM information_schema.columns
WHERE table_name='invoices'
  AND column_name IN ('discount','discount_reason','created_by','original_amount',
                      'cancelled','cancel_reason','cancelled_by','cancelled_at',
                      'amount_paid','balance_due');

-- 2) قائمة الأعمدة المفقودة (يجب أن تفرغ بعد up)
SELECT 'missing_columns' AS check_name, c AS column_name
FROM (VALUES ('discount'),('discount_reason'),('created_by'),('original_amount'),
             ('cancelled'),('cancel_reason'),('cancelled_by'),('cancelled_at'),
             ('amount_paid'),('balance_due')) v(c)
WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name='invoices' AND column_name=v.c);

-- 3) لا تغيير بيانات: عدد صفوف invoices ثابت قبل/بعد (للتأكيد اليدوي)
SELECT 'invoices_rowcount' AS check_name, COUNT(*) AS n FROM invoices;

-- 4) tenant_id موجود (مطلوب لـ RLS؛ يجب أن يكون موجوداً مسبقاً)
SELECT 'invoices_has_tenant_id' AS check_name,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name='invoices' AND column_name='tenant_id') AS n;
