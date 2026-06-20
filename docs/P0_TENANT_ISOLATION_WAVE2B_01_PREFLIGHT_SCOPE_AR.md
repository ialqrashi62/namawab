# P0 الموجة 2B — 01 تأكيد النطاق ما قبل التنفيذ (Preflight Scope)

> المرحلة: `P0_TENANT_ISOLATION_WAVE2B_CLASSA_CONTROLLED_DDL_DEPLOY` | التاريخ: 2026-06-20
> **النتيجة: أُوقِف التنفيذ عند بوابة السلامة — اكتُشف حاجز إنتاجي حرج (BLOCKER).** لم يُنفَّذ أي DDL.

---

## 1. قائمة Class A النهائية (Wave 2B)

| الجدول | يحتاج tenant_id | backfill | index | RLS/FORCE | كود |
| ------ | :-------------: | :------: | :---: | :-------: | :--: |
| blood_bank_units | نعم | نعم | نعم | نعم | نعم |
| blood_bank_donors | نعم | نعم | نعم | نعم | نعم |
| blood_bank_crossmatch | نعم | نعم | نعم | نعم | نعم |
| blood_bank_transfusions | نعم | نعم | نعم | نعم | نعم |
| approvals | نعم | نعم | نعم | نعم | نعم |
| package_sessions | نعم | نعم | نعم | نعم | نعم |

SQL المتتبع جاهز: `docs/sql/p0_tenant_isolation_wave2_{up,validate,down,noop_safety_checks}.sql`. (Wave 3 ما زالت متبقية: internal_messages, cssd, cme، وفحص الموديولات منخفضة الـ PII).

---

## 2. فحص السلامة قبل DDL (Gate 1 + Gate 3) — كشف حاجز حرج

أثناء التحقق من آلية RLS القائمة على الإنتاج (قراءة فقط)، تبيّن التالي على خادم الإنتاج (`alfaisal-erp.com` / `nama_medical_web`):

| الفحص | النتيجة |
| ----- | ------- |
| دور اتصال التطبيق | `nama_medical_app` (rolsuper=`f`، rolbypassrls=`f`) |
| مالك جدول `patients` | `postgres` |
| سياسة `patients` | `rls_patients_tenant_isolation`: `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer` |
| هل التطبيق يضبط `app.tenant_id`؟ | **لا** — `server.js` لا يحوي أي `set_config`/`withTenantTransaction` (0 إشارات)، ولا يستورد `tenant_context_pg_session.js` |
| عدد صفوف `patients` كـ superuser (يتجاوز RLS) | **3** |
| عدد صفوف `patients` كما يراها التطبيق (`nama_medical_app`) | **0** |
| عدد صفوف `invoices` كما يراها التطبيق | **0** |
| عند ضبط `app.tenant_id=1` يدوياً ثم القراءة كـ `nama_medical_app` | **3** (يعود الظهور) |

---

## 3. الاستنتاج (سبب إيقاف التنفيذ)

سياسات FORCE RLS الـ13 على الإنتاج تعتمد على متغير الجلسة `app.tenant_id`، **والتطبيق لا يضبطه إطلاقاً** (يعتمد على فلترة `WHERE tenant_id=$N` على مستوى التطبيق فقط). النتيجة:

> **التطبيق لا يرى أي صف في الجداول الـ13 المحمية بـ FORCE RLS على الإنتاج الآن** (مثبت: `patients` به 3 صفوف يراها الـ superuser، بينما التطبيق يرى 0). هذا حاجز إنتاجي كامن (P0) سابق لهذه المرحلة.

تشغيل Wave 2B (إضافة FORCE RLS إلى blood_bank/approvals/package_sessions) **سيوسّع نفس الإعداد المكسور** — فبمجرد إدخال بيانات لهذه الجداول لن يراها التطبيق.

لذلك، التزاماً بـ Hard Stop ("إيقاف التنفيذ فوراً عند أي فشل" + سلامة البيانات + عدم كسر الإنتاج):
- **لم يُنفَّذ backup ولا up SQL ولا أي DDL** (أُوقِف عند بوابة السلامة قبل الوصول إليها).
- يُرفع الأمر كـ `BLOCKER`. التفاصيل والحل في:
  `docs/P0_TENANT_ISOLATION_WAVE2B_BLOCKER_RLS_GUC_INCOMPATIBILITY_AR.md`.

---

## 4. الحالة

`STATUS: P0_TENANT_ISOLATION_WAVE2B_CLASSA_DEPLOY_BLOCKED`
`PRODUCTION_DDL_EXECUTED: NO` | `ROLLBACK_REQUIRED: NO` (لا تغيير حدث)

`WAVE2B_PREFLIGHT_SCOPE_COMPLETE → BLOCKED`
