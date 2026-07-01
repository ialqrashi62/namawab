# حزمة جاهزية الإنتاج لتفعيل منصة المنشآت الطبية (PHASE_FACILITY_PLATFORM_PRODUCTION_READINESS_PACKET_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المستند:** حزمة جاهزية النشر للإنتاج وخطة الطوارئ
* **الوضعية:** جاهز بانتظار قرار المالك النهائي للنشر للإنتاج 🚀

---

## 1. ملخص نتائج بيئة Staging والـ UAT

تم فحص كافة جوانب منصة المنشآت على بيئة Staging بنجاح تام وفقاً للنتائج التالية:
* **فحص واجهات الدخول (Auth E2E):** **PASS** ✅ (تمت مصادقة الدخول بنجاح).
* **تحميل لوحة التحكم (Dashboard rendering):** **PASS** ✅ (دعم RTL كامل وخالٍ من Mojibake).
* **محدد المدن الطبية والمنشآت:** **PASS** ✅ (يعمل بالكامل).
* **عزل المستأجرين (Tenant Isolation):** **PASS** ✅ (تفعيل سياسات RLS بنجاح).
* **عدد الاختبارات الفردية لـ EMR:** **101 passed, 0 failed, 48 skipped** ✅.
* **حالة بيئة الإنتاج:** **لم تُمَس نهائياً (Production touched: NO)**.

---

## 2. النطاق البرمجي للترقية وجداول قاعدة البيانات

### قائمة الجداول الـ 17 المنشأة حديثاً:
1. `health_networks` (شبكات التجمع الصحي)
2. `regions` (المناطق الجغرافية)
3. `medical_cities` (المدن الطبية)
4. `facility_types` (تصنيفات المنشآت)
5. `facility_templates` (قوالب المنشآت)
6. `facility_template_departments` (أقسام القوالب)
7. `facility_enabled_departments` (الأقسام المفعلة للمنشأة - RLS)
8. `facility_buildings` (المباني التابعة - RLS)
9. `facility_floors` (الطوابق التابعة - RLS)
10. `facility_rooms` (الغرف التابعة - RLS)
11. `facility_beds` (الأسرة التابعة - RLS)
12. `facility_operating_hours` (ساعات العمل - RLS)
13. `facility_services` (خدمات المنشأة - RLS)
14. `facility_modules` (الموديولات المفعلة - RLS)
15. `facility_accreditations` (الاعتمادات والتراخيص - RLS)
16. `facility_navigation_items` (عناصر التنقل للمنشأة - RLS)
17. `facility_dashboard_widgets` (عناصر لوحة التحكم - RLS)

* **ملاحظة:** جدول المنشآت الأساسي `facilities` مستثنى من الإنشاء لوجوده مسبقاً بقاعدة البيانات.

### مسار ملف الـ DDL المعتمد للترقية:
* [FACILITY_PLATFORM_STAGING_DDL_17_TABLES.sql](file:///c:/Users/ice/Desktop/NamaMedical/docs/governance/enterprise-engineering-constitution/FACILITY_PLATFORM_STAGING_DDL_17_TABLES.sql)

---

## 3. خطة إدارة المخاطر وتأمين البيئة (Downtime & Rollback Plan)

* **مخاطر قفل الجداول (Downtime/Lock Risk):** خفيف جداً، عمليات إنشاء جداول جديدة (`CREATE TABLE`) لا تغلق الجداول النشطة ولا تؤثر على سرعة التشغيل.
* **متطلبات النسخ الاحتياطي (Backup Requirement):** يجب أخذ نسخة احتياطية Snapshot كاملة لقاعدة بيانات الإنتاج باستخدام `pg_dump` قبل بدء التنفيذ.
* **خطة التراجع (Rollback Plan):** في حال حدوث أي خلل، يتم تشغيل سكربت التراجع لإسقاط الجداول الـ 17 المحددة فقط:
  `DROP TABLE IF EXISTS table_name CASCADE;`
  مما يضمن سلامة البيانات السابقة بنسبة 100%.

---

## 4. قائمة التحقق للموافقة النهائية والقرار (Go/No-Go Checklist)

* [x] تم اجتياز فحص Staging UAT بنسبة 100%.
* [x] تم التحقق من عزل المستأجرين بنجاح.
* [x] تم تجهيز خطة التراجع والنسخ الاحتياطي.
* [ ] موافقة المالك الصريحة للنشر على الإنتاج (انتظار قرار: `OWNER_DECISION_TO_DEPLOY_TO_PRODUCTION`).
