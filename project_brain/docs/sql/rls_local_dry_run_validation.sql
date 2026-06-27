-- ============================================================================
-- استعلامات التحقق للتشغيل التجريبي لـ RLS (RLS Local Dry-Run Validation)
-- المشروع: نظام نما الطبي (NamaMedical)
-- الملف: docs/sql/rls_local_dry_run_validation.sql
-- التحذير: للاستخدام المحلي/التجريبي فقط! (LOCAL/TEST ENVIRONMENT ONLY)
-- يمنع تماماً تشغيله على خوادم أو قواعد الإنتاج.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- الخطوة 1: تهيئة بيانات الاختبار الافتراضية
-- ----------------------------------------------------------------------------
-- نقوم بإنشاء بيانات تجريبية مؤقتة بمستأجرين مختلفين (المستأجر 1 والمستأجر 2)
-- لضمان العزل التام.

-- نقوم بتعطيل RLS مؤقتاً لإدخال بيانات مستأجر 2، أو نضبط الجلسة لكل مستأجر.

-- إدخال مريض لمستأجر 1
SET app.tenant_id = '1';
INSERT INTO patients (name, tenant_id, facility_id) VALUES ('مريض تجريبي مستأجر 1', 1, 1);
INSERT INTO invoices (invoice_number, amount, tenant_id, facility_id) VALUES ('INV-T1-100', 150.0, 1, 1);
INSERT INTO appointments (patient_name, appt_date, tenant_id) VALUES ('مريض تجريبي مستأجر 1', '2026-06-20', 1);

-- إدخال مريض لمستأجر 2 (نغير سياق الجلسة أولاً وإلا سيفشل الإدخال بسبب WITH CHECK للسياسة)
SET app.tenant_id = '2';
INSERT INTO patients (name, tenant_id, facility_id) VALUES ('مريض تجريبي مستأجر 2', 2, 1);
INSERT INTO invoices (invoice_number, amount, tenant_id, facility_id) VALUES ('INV-T2-200', 300.0, 2, 1);
INSERT INTO appointments (patient_name, appt_date, tenant_id) VALUES ('مريض تجريبي مستأجر 2', '2026-06-21', 2);


-- ----------------------------------------------------------------------------
-- الخطوة 2: اختبارات التحقق من صحة القراءة (SELECT Validation)
-- ----------------------------------------------------------------------------

-- اختبار 2.1: محاكاة مستخدم مستأجر 1
SET app.tenant_id = '1';

\echo '--- فحص سجلات مستأجر 1 في جدول المرضى (يجب أن يعيد مريض مستأجر 1 فقط) ---'
SELECT id, name, tenant_id FROM patients;

\echo '--- فحص فواتير مستأجر 1 (يجب أن يعيد فواتير مستأجر 1 فقط) ---'
SELECT id, invoice_number, amount, tenant_id FROM invoices;


-- اختبار 2.2: محاكاة مستخدم مستأجر 2
SET app.tenant_id = '2';

\echo '--- فحص سجلات مستأجر 2 في جدول المرضى (يجب أن يعيد مريض مستأجر 2 فقط) ---'
SELECT id, name, tenant_id FROM patients;

\echo '--- فحص فواتير مستأجر 2 (يجب أن يعيد فواتير مستأجر 2 فقط) ---'
SELECT id, invoice_number, amount, tenant_id FROM invoices;


-- ----------------------------------------------------------------------------
-- الخطوة 3: اختبارات منع حقن البيانات الخاطئة (INSERT Mismatch Validation)
-- ----------------------------------------------------------------------------
SET app.tenant_id = '1';

\echo '--- اختبار إدخال سجل بمستأجر 2 بينما الجلسة مضبوطة لمستأجر 1 ---'
\echo '--- (يجب أن يفشل الاستعلام تلقائياً ويرجع خطأ: new row violates row-level security policy) ---'
BEGIN;
INSERT INTO patients (name, tenant_id, facility_id) VALUES ('مريض متسلل لمستأجر 2', 2, 1);
ROLLBACK;


-- ----------------------------------------------------------------------------
-- الخطوة 4: اختبارات التحقق من التعديل العابر (UPDATE Mismatch Validation)
-- ----------------------------------------------------------------------------
SET app.tenant_id = '1';

\echo '--- اختبار تعديل سجل مستأجر 2 بواسطة مستأجر 1 ---'
\echo '--- (يجب أن لا يؤثر الاستعلام على أي صفوف: UPDATE 0) ---'
UPDATE patients SET name = 'تعديل غير مصرح به' WHERE tenant_id = 2;


-- ----------------------------------------------------------------------------
-- الخطوة 5: اختبارات منع التسريب في العمليات التجميعية (Aggregate Isolation)
-- ----------------------------------------------------------------------------
SET app.tenant_id = '1';

\echo '--- فحص الإحصائيات التجميعية لمستأجر 1 (يجب أن يعود بالمجموع الخاص به فقط) ---'
SELECT COUNT(*) AS total_patients, SUM(amount) AS total_sales 
FROM patients p
LEFT JOIN invoices i ON p.tenant_id = i.tenant_id;
