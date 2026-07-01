# تقرير التحقق من عزل بيئة Staging قبل هجرات قاعدة البيانات (PHASE_ENTERPRISE_FACILITY_PLATFORM_STAGING_ISOLATION_VERIFICATION_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** التحقق من عزل بيئة Staging (STAGING_ISOLATION_VERIFICATION_BEFORE_DDL)
* **المستند:** تقرير التحقق من العزل وحالة التشغيل لبيئة Staging
* **الحالة الفنية:** تعليق العمل لعدم استقرار عملية تشغيل Staging في PM2 (`BLOCKED_STAGING_RUNTIME_NOT_AVAILABLE`) 🛑

---

## 1. ملخص المراجعة والتحقق الفني (Verification Summary)

* **القرار والقرار النهائي المعتمد للمرحلة (FINAL_STATUS):**
  * **`BLOCKED_STAGING_RUNTIME_NOT_AVAILABLE`** (فشل تشغيل عملية Staging بسبب حدوث خطأ تعارض RLS أثناء بدء التشغيل، مما أدى لتوقف العملية).
* **سبب التوقف الرئيسي (Primary Blocker):**
  * **`BLOCKED_STAGING_PM2_PROCESS_NOT_RUNNING`** (العملية `nama-app-staging` موجودة ولكنها متوقفة/crashed بسبب خطأ: `new row violates row-level security policy for table "emergency_beds"` أثناء محاولة تهيئة قاعدة البيانات على Staging).
* **معرف الالتزام للمستودع الأب (Root Branch & SHA):**
  * الفرع: `ops/jumanasoft-enterprise-facility-platform-staging-prep`
  * معرف الالتزام (Commit SHA): `99d0d26bd8eb38d9b4474c619d070c33cae8ebd6`
* **معرف الالتزام للمستودع الفرعي (Submodule Branch & SHA):**
  * الفرع: `integration/all-epics`
  * معرف الالتزام (Commit SHA): `9e66447e421c6298f1f8dd09c6ff127e3ee17169`

---

## 2. جدول نتائج التحقق الفني والتشغيلي لبيئة Staging

| البند الفني | النتيجة الفعالة | التفاصيل وإيضاحات الأمان |
| :--- | :---: | :--- |
| **هل Staging متاح وقت التشغيل؟** | **NO** ❌ | العملية متوقفة بسبب خطأ RLS عند الإقلاع. |
| **هل عملية PM2 تعمل؟** | **NO** ❌ | اسم العملية: `nama-app-staging` (الحالة: `stopped`). |
| **هل منفذ 3010 يعمل؟** | **NO** ❌ | المنفذ لا يستمع لعدم تشغيل الخدمة: `BLOCKED_STAGING_PORT_3010_NOT_LISTENING`. |
| **فحص HTTP Smoke** | **FAILED** | تعذر الاتصال بالنطاق الفرعي أو المنافذ المحلية: `BLOCKED_STAGING_HTTP_SMOKE_FAILED`. |
| **اسم قاعدة بيانات Staging** | `nama_medical_staging` | معينة في ملف التهيئة معزولة. |
| **مستخدم قاعدة Staging** | `nama_staging_user` | مستخدم مقيد وخاص ببيئة الاستضافة التجريبية. |
| **صلاحيات `rolsuper`** | **غير مفحوص** | لم يتمكن الفحص الحي من العمل لعدم تشغيل قاعدة البيانات بشكل كامل. |
| **صلاحيات `rolbypassrls`** | **غير مفحوص** | متوقف لحين إقلاع الخدمة. |
| **الاتصال بقاعدة الإنتاج** | **غير مفحوص** | متوقف لحين إقلاع الخدمة. |
| **هل ملف `.env.staging` متتبع؟** | **NO** ✅ | تم التأكد ساكناً من عدم تتبعه في مستودع Git. |
| **هل تم تنفيذ DDL / Migrations؟** | **NO** ❌ | لم يتم إجراء أي تغيير في المخطط أو تشغيل هجرات. |
| **هل تم لمس الإنتاج؟** | **NO** ❌ | بيئة الإنتاج الفعلي وعملياته معزولة بنسبة 100%. |

---

## 3. نتائج فحص الهيكل قبل التطبيق (Schema Preflight)

* **جداول الـ ERD الـ 18 الجديدة:**
  * الجداول الـ 18 المقترحة لمنصة المنشآت الطبية المتعددة **غير موجودة** حالياً على Staging، والبيئة مهيأة لاستقبال الهجرة فور حل مشكلة بدء التشغيل: `SCHEMA_PREFLIGHT_DEFERRED_UNTIL_STAGING_RUNTIME_BOOT_FIX`.
* **حالة فحص RLS التشغيلي:**
  * `RLS_RUNTIME_NOT_APPLICABLE_TABLES_NOT_CREATED_YET` (لا توجد جداول جديدة بعد لفرض وفحص حماية الصفوف عليها حياً).

---

## 4. نتائج تشغيل الفحوصات الفنية المحلية (Local Test Results)

* **الاختبارات الآمنة لـ EMR (run_safe_tests.js):**
  * عدد الاختبارات الكلي: **101** اختباراً.
  * عدد الناجح منها (PASS): **101 DB-free passed, 0 failed, 48 skipped need DB/server** ✅.

---
**الخطوة التالية المسموحة (Next Allowed Action):**
* قيام الـ DevOps/المالك بمراجعة وحل مشكلة تعارض الـ RLS لجدول `emergency_beds` أثناء تهيئة الخادم وبدء التشغيل لتمكين إقلاع الخدمة بنجاح (`REMEDY_STAGING_STARTUP_DB_RLS_VIOLATION`).
