# P0 ربط app.tenant_id — 01 خط الأساس (Baseline)

> المرحلة: `P0_APP_TENANT_ID_RLS_BINDING_COMPLETION` | التاريخ: 2026-06-20

## 1. حالة Git قبل البدء
- parent HEAD: `af50de0` (master).
- namaweb HEAD: `70e01cf`، مع تعديلات **غير ملتزمة** من مرحلة الربط السابقة (`db_postgres.js`، `server.js`).
- ملفات untracked في namaweb غير ذات صلة ولن تُلتزَم: `tmp/db_validate.js`, `tmp/run_validate_sql.js`, `public/AppServerPortal/`.

## 2. الحاجز (مُعاد تأكيده)
الجداول الـ13 المحمية بـ FORCE RLS على الإنتاج تعتمد سياستها على `current_setting('app.tenant_id')`، والتطبيق (Express + `pg.Pool` + `pool.query` مباشرة) **لا يضبط هذا المتغيّر**. النتيجة: مستخدم التطبيق `nama_medical_app` (غير superuser) يرى **0 صف** في كل الجداول الـ13 رغم وجود بيانات (superuser يرى 3 في patients).

الجداول الـ13: appointments, emergency_beds, emergency_visits, insurance_claims, invoices, lab_radiology_orders, lab_results, lab_samples, patients, pharmacy_prescriptions_queue, pharmacy_sale_items, pharmacy_sales, prescriptions.

## 3. التعديلات الموجودة (غير المكتملة) قبل هذه المرحلة
- `db_postgres.js`: `AsyncLocalStorage` (tenantStore) + `runWithTenant` + `getCurrentTenantId` + wrapper لـ `pool.query` (checkout → `set_config('app.tenant_id')` → query → reset → release) + تصدير الرموز.
- `server.js`: استيراد `tenantStore` + middleware بعد الجلسة يشغّل الطلب داخل سياق المستأجر.

## 4. الناقص (نطاق هذه المرحلة)
- ربط السياق على مسار `pool.connect` (معاملة الإفراغ `/api/admissions/:id/discharge`).
- اختبارات تثبت الربط/العزل/عدم التسرّب على مساري `pool.query` و`pool.connect`.
- تحقق read-only من الإنتاج بمستخدم التطبيق.
- توثيق.

## 5. قابلية تكرار المشكلة (مؤكَّدة)
بمستخدم التطبيق على الإنتاج: `SELECT count(*) FROM patients` = 0؛ وبعد `set_config('app.tenant_id','1')` = 3. الفرق يثبت أن RLS تحجب لغياب الربط.

`BASELINE_COMPLETE`
