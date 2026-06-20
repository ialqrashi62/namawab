# P0 عزل المستأجرين — 02 تدقيق فجوات مخطط قاعدة البيانات (Database Schema Gap Audit)

> التاريخ: 2026-06-20 | الفحص: قراءة فقط لـ `db_postgres.js`. لا اتصال بقاعدة إنتاج (لا PostgreSQL محلي على جهاز التطوير — موثّق في المرحلة 28).

---

## 1. مصدر الحقيقة

تغطية `tenant_id` مأخوذة من 92 جملة `ALTER TABLE ... ADD COLUMN IF NOT EXISTS tenant_id` في `db_postgres.js` (كتلة الترحيل ~السطر 1801+). RLS في المصدر = 3 جداول overrides فقط؛ FORCE RLS للـ13 جدولاً مُطبّق على الإنتاج خارج المصدر (تباين حوكمة موثّق في GLOBAL_AUDIT_05).

---

## 2. الجداول الحساسة بلا `tenant_id` (Class A)

| الجدول | الموديول | بيانات حساسة | tenant_id | facility_id | يحتاج |
| ------ | -------- | ------------ | --------- | ----------- | ----- |
| medical_records_files | السجلات الطبية | patient_id، رقم ملف، موقع | ❌ | ❌ | ADD + backfill + RLS + index |
| medical_records_requests | السجلات الطبية | patient_id، غرض، قسم | ❌ | ❌ | ADD + RLS + index |
| medical_records_coding | السجلات الطبية | patient_id، تشخيص، ICD | ❌ | ❌ | ADD + RLS + index |
| clinical_pharmacy_reviews | الصيدلية السريرية | patient_id، مراجعة دوائية | ❌ | ❌ | ADD + RLS + index |
| patient_drug_education | الصيدلية السريرية | patient_id، تثقيف دوائي | ❌ | ❌ | ADD + RLS + index |
| rehab_patients | التأهيل | patient_id، تشخيص | ❌ | ❌ | ADD + RLS + index |
| rehab_sessions | التأهيل | patient_id، جلسات | ❌ | ❌ | ADD + RLS + index |
| rehab_goals | التأهيل | (مرتبط بـ rehab_patient_id) | ❌ | ❌ | ADD + RLS + index |
| rehab_assessments | التأهيل | patient_id، تقييم | ❌ | ❌ | ADD + RLS + index |
| portal_users | بوابة المرضى | patient_id، هاش كلمة المرور، PII | ❌ | ❌ | ADD + RLS + index |
| diet_orders | التغذية | patient_id، حمية | ❌ | ❌ | ADD + RLS + index |
| diet_meals | التغذية | patient_id، وجبات | ❌ | ❌ | ADD + RLS + index |
| nutrition_assessments | التغذية | patient_id، BMI | ❌ | ❌ | ADD + RLS + index |
| blood_bank_units | بنك الدم | فصائل، وحدات | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| blood_bank_donors | بنك الدم | متبرعون، PII | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| blood_bank_crossmatch | بنك الدم | patient_id، توافق | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| blood_bank_transfusions | بنك الدم | patient_id، نقل دم | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| approvals | الموافقات | patient_id، service_id | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| package_sessions | الباقات | patient_id، جلسات | ❌ | ❌ | ADD + RLS + index (الموجة 2) |
| internal_messages | الرسائل | sender/receiver | ❌ | ❌ | نموذج عزل خاص (الموجة 3) |
| cssd_* / cme_* | تعقيم/تعليم | PII أقل | ❌ | ❌ | الموجة 3 |

---

## 3. الجداول الحساسة التي **تحمل** `tenant_id` لكن دون استعلام يصفّي (Class B)

| الجدول | الموديول | tenant_id | الفلتر في الكود | الحكم |
| ------ | -------- | --------- | --------------- | ----- |
| telemedicine_sessions | الطب عن بعد | ✅ | ❌ لا فلتر/ختم | فجوة استعلام — آمن للنشر |
| pathology_cases | علم الأمراض | ✅ | ❌ | فجوة استعلام |
| social_work_cases | الخدمة الاجتماعية | ✅ | ❌ | فجوة استعلام |
| mortuary_cases | خدمة الوفيات | ✅ | ❌ | فجوة استعلام |
| zatca_invoices | ZATCA | ✅ | ❌ | فجوة استعلام |
| cosmetic_cases/consents/followups | التجميل | ✅ | يحتاج تأكيد | فحص |
| infection_*/quality_*/maintenance_*/transport_* | متعددة | ✅ (معظمها) | متفاوت | فحص الموجة 3 |

---

## 4. الفهارس وleast-privilege

- الجداول المُغطّاة أصلاً تحمل فهارس `tenant_id` مركّبة (23+). الجداول الجديدة (Class A) **تحتاج إنشاء فهارس `tenant_id`** عند إضافة العمود.
- مستخدم التطبيق `nama_medical_app` (محدود، NOBYPASSRLS) مُفعّل على الإنتاج (المرحلة 106) — أي RLS جديدة ستُطبَّق عليه.

---

## 5. الخلاصة

- **Class A**: 19 جدولاً حساساً بلا `tenant_id` (12 في الموجة 1، 7 في الموجة 2) → يحتاج DDL.
- **Class B**: 5+ جداول تحمل `tenant_id` لكن بلا تصفية → إصلاح كود آمن للنشر.
- **القرار**: SQL متتبع يُنشأ في Gate 5 لكل Class A؛ إصلاح Class B كود فقط.

`DATABASE_SCHEMA_GAP_AUDIT_COMPLETE`
