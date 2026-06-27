# التدقيق العالمي 05 — قاعدة البيانات وعزل المستأجرين (Database & Tenant Isolation)

> التاريخ: 2026-06-20 | الفحص: قراءة فقط لـ `db_postgres.js`, `tenant_context_pg_session.js`, مسارات `server.js`.
> **تنبيه**: لم تُطبع أي أسرار/سلاسل اتصال/كلمات مرور في هذا التقرير.

---

## 1. ملخص

- **عدد الجداول**: ~148 جدولاً (`CREATE TABLE` في `db_postgres.js`).
- **تغطية `tenant_id`**: 228 إشارة لـ `tenant_id` في المخطط — ~80+ جدولاً مُغطّى (core clinical + مالي + HR + مخزون + صيدلية).
- **آلية سياق المستأجر**: PostgreSQL GUC عبر `set_config('app.tenant_id', $1, true)` لكل معاملة في `tenant_context_pg_session.js` (+ `app.facility_id`, `app.branch_id` اختياري).
- **العزل على مستوى التطبيق**: نمط `requireTenantScope` + `withTenantFilter` + ختم `tenant_id` من الجلسة (لا من العميل) — مُطبّق على الموديولات الأساسية.

---

## 2. هل كل الجداول الحساسة معزولة؟ — **لا، توجد فجوة مؤكّدة**

### 2.1 الجداول المغطّاة جيداً (آمنة)
المرضى، الفواتير، المواعيد، السجلات الطبية الأساسية، الوصفات، المختبر/الأشعة، التمريض/العلامات الحيوية، الجراحة، الطوارئ، التنويم، ICU، الموافقات، المطالبات، القيود المالية، ZATCA، الصيدلية، المخزون، HR — جميعها تحمل `tenant_id`/`facility_id` ومفهرسة وتمر عبر `requireTenantScope` (تأكّدت من المراحل 9-21 و63 اختبار عزل ناجح في الذاكرة).

### 2.2 ⚠️ جداول حساسة بلا `tenant_id` ومساراتها بلا `requireTenantScope` (فجوة حرجة)

تم التأكد برمجياً: لا يوجد `ALTER TABLE ... ADD tenant_id` لهذه الجداول في `db_postgres.js`، ومساراتها تستخدم `requireAuth` **فقط** (لا `requireTenantScope`):

| الموديول (NAV) | الجداول | المسارات | الخطر |
| -------------- | ------- | -------- | ----- |
| السجلات الطبية (30) | `medical_records_files`, `medical_records_requests`, `medical_records_coding` | `/api/medical-records/*` (server.js:4442-4473) | بيانات مرضى — **P0** |
| الصيدلية السريرية (31) | `clinical_pharmacy_reviews`, `patient_drug_education` | `/api/clinical-pharmacy/*` (4483-4511) | مراجعات/تثقيف دوائي للمريض — **P0** |
| إعادة التأهيل (32) | `rehab_patients`, `rehab_sessions`, `rehab_goals`, `rehab_assessments` | `/api/rehab/*` (4521-4563) | سجلات تأهيل سريرية — **P0** |
| بوابة المرضى (33) | `portal_users` (تحوي بيانات مصادقة وهاش كلمة المرور) | `/api/portal/*` (4106-4124) | مصادقة + PII — **P0** |
| التغذية (25) | `diet_orders`, `diet_meals`, `nutrition_assessments` | `/api/dietary/*`, `/api/nutrition/*` (3762-3807) | بيانات سريرية للمريض — **P1** |
| التأمين/الموافقات | `approvals`, `package_sessions` | مسارات الموافقات/الباقات | ربط مريض/خدمة — **P1** |
| الرسائل | `internal_messages` | `/api/messages` | تسريب رسائل بين المستأجرين — **P1** |

> **السبب الجذري**: هذه الموديولات (المؤشرات 25, 30-33) أُضيفت **بعد** حملة تقوية عزل المستأجرين (المراحل 9-21)، ولم تُشمل في كتلة ترحيل `tenant_id` ولا في الـ 17 ملف اختبار عزل (لا يوجد `cross_tenant_rehab_test.js` / `medical_records` / `clinical_pharmacy` / `portal` / `dietary`).

> **التخفيف الموجود**: قد يكون FORCE RLS المُطبّق على الإنتاج (13 جدولاً) يشمل بعضها، لكن **لا دليل على ذلك في المصدر**، والمسارات نفسها لا تضبط سياق `app.tenant_id` (لأنها لا تستخدم `withTenantTransaction`/`requireTenantScope`) — مما يعني أنه حتى لو كان RLS مفعّلاً، الاستعلام بدون سياق tenant قد يرجع صفراً أو يفشل، وليس بالضرورة يعزل بشكل صحيح. **يلزم تحقق فعلي قراءة-فقط على الإنتاج.**

---

## 3. هل توجد جداول بدون `tenant_id`؟ — نعم (مصنّفة)

| النوع | أمثلة | الحكم |
| ----- | ----- | ----- |
| مرجعية عالمية (مقبول) | `icd10_codes`, `medications`, `lab_tests_catalog`, `radiology_catalog`, `drug_interactions`, `medical_services` | KEEP — بيانات مرجعية مشتركة، تُخصّص عبر جداول `tenant_*_overrides` |
| حساسة بلا عزل (خطر) | الجداول في القسم 2.2 | FIX_NOW |
| إدارية بلا مريض | `employees` (الكتالوج العام), `maintenance_orders` | مراجعة — قد تحتاج عزلاً حسب نموذج العمل |

---

## 4. هل يوجد خطر cross-tenant leakage؟ — **نعم، محدود ومحدّد**

- **الموديولات الأساسية**: مؤمّنة (63+ اختبار عزل ناجح).
- **الموديولات في 2.2**: خطر تسريب فعلي محتمل بين المستأجرين عند تشغيل أكثر من مستأجر. **هذا أخطر اكتشاف في التدقيق.**
- **الأثر العملي الحالي**: مخفّف لأن الإنتاج يعمل عملياً بمستأجر واحد افتراضي (`tenant_id=1`)، لكنه **يصبح P0 فوري عند إضافة مستأجر ثانٍ**.

---

## 5. هل RLS فعّالة؟ — **نعم على الإنتاج، لكن خارج version control (مخاطر حوكمة)**

| الموقع | الحالة |
| ------ | ------ |
| المصدر (`db_postgres.js`) | RLS + FORCE RLS على **3 جداول** فقط: `tenant_lab_test_overrides`, `tenant_radiology_overrides`, `tenant_service_overrides` |
| الإنتاج (موثّق في الذاكرة المرحلة 103/106) | FORCE RLS على **13 جدولاً حساساً** مُطبّق عبر DDL مباشر على الخادم |

> **P0-حوكمة**: تباين بين المصدر والإنتاج. لا مصدر حقيقة واحد متتبع لسياسات الـ 13 جدولاً. أي استعادة/إعادة بناء للقاعدة من المصدر **تُسقط RLS صامتاً**. **يجب** ترحيل سياسات الـ 13 جدولاً إلى ملف SQL متتبع + idempotent.

سياسات RLS تعتمد `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer` — تصميم صحيح (لا تستخدم `USING(true)`).

---

## 6. هل التطبيق يستخدم user آمن؟ — **نعم على الإنتاج**

- المصدر الافتراضي: `process.env.DB_USER || 'postgres'` (افتراضي خطير لو استُخدم).
- الإنتاج (المرحلة 106): مستخدم محدود `nama_medical_app` بلا صلاحيات تجاوز RLS (`NOBYPASSRLS`) ومخضع للسياسات — **سليم**. لكن — مثل RLS — هذا الإعداد على الخادم لا في المصدر.

---

## 7. الفهارس والأداء

- 23+ فهرساً مركّباً على `tenant_id (+ facility_id/branch_id/patient_id)` — تصميم جيد للأداء عند العزل.
- **النواقص**: لا `updated_at`/`created_by`/`modified_by` في معظم الجداول؛ لا soft-delete (`deleted_at`) — اعتماد على الحذف الصلب. هذا يضعف التتبع وقابلية التراجع.

---

## 8. القرار والتوصيات

**الحالة**: `DATABASE_STATUS: WARNING`، `TENANT_ISOLATION_STATUS: WARNING`.

**FIX_NOW (P0)**:
1. إضافة `tenant_id` + فرض `requireTenantScope`/`withTenantTransaction` على موديولات: السجلات الطبية، الصيدلية السريرية، إعادة التأهيل، بوابة المرضى، التغذية (القسم 2.2).
2. كتابة اختبارات عزل (`cross_tenant_*`) لهذه الموديولات.
3. ترحيل سياسات FORCE RLS للـ 13 جدولاً إلى ملف migration متتبع + idempotent (مصدر حقيقة واحد).

**FIX_NEXT (P1/P2)**:
4. إضافة `updated_at`/`created_by` و soft-delete للجداول الحساسة.
5. توثيق إنشاء `nama_medical_app` كـ migration متتبع.

`DATABASE_TENANT_ISOLATION_AUDIT_COMPLETE`
