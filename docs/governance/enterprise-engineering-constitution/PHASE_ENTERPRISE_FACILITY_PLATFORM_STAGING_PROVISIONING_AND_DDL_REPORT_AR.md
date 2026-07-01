# تقرير تهيئة بيئة Staging وتجهيز الجداول الطبية (PHASE_ENTERPRISE_FACILITY_PLATFORM_STAGING_PROVISIONING_AND_DDL_REPORT_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تهيئة وفحص بيئة Staging وتجهيز الجداول (PHASE_ENTERPRISE_FACILITY_PLATFORM_STAGING_PROVISIONING_AND_DDL_PREP)
* **المستند:** تقرير تهيئة بيئة Staging وتجهيز جداول الـ ERD
* **الحالة الفنية:** تعليق تهيئة الاستضافة بانتظار إجراءات المالك (`STAGING_PROVISIONING_PACKET_PREPARED_OWNER_ACTION_REQUIRED`) 🛑

---

## 1. ملخص المراجعة والقرارات الأمنية للمرحلة

* **القرار والقرار النهائي المعتمد للمرحلة (FINAL_STATUS):**
  * **`BLOCKED_OWNER_DEVOPS_STAGING_PROVISIONING_REQUIRED`** (تعليق العمل لعدم جاهزية موارد خادم الاستضافة وقاعدة بيانات Staging من قبل المالك/DevOps).
* **معرف الالتزام للمستودع الأب (Root Branch & SHA):**
  * الفرع: `ops/jumanasoft-enterprise-facility-platform-staging-prep`
  * معرف الالتزام (Commit SHA): `20f415ee9d8ea4f3c0ce25ca31238ad8383f9e9f` (بعد التأسيس وقبل تحديث التوضيحات).
* **معرف الالتزام للمستودع الفرعي (Submodule Branch & SHA):**
  * الفرع: `integration/all-epics`
  * معرف الالتزام (Commit SHA): `9e66447e421c6298f1f8dd09c6ff127e3ee17169`

---

## 2. جدول إقرار الأمان والقيود والجاهزية للـ Staging

| البند الفني | الجاهزية والإقرار | التفاصيل وإيضاحات الأمان |
| :--- | :---: | :--- |
| **هل بيئة Staging متاحة؟** | **NO** ❌ | خادم Staging وقاعدة بيانات `nama_medical_staging` غير متوفرة للتنفيذ أو الفحص الحي بعد. |
| **هل بيئة Staging معزولة؟** | **NOT VERIFIED** | لا يمكن التحقق من العزل الفعلي لعدم توفر موارد الاستضافة أو الاتصال بها. |
| **هل تم لمس الإنتاج؟** | **NO** ❌ | لم يتم الاتصال أو المساس ببيئة الإنتاج الفعلي مطلقاً. |
| **هل تم تنفيذ DDL / Migrations؟** | **NO** ❌ | لم يتم تنفيذ أي أوامر DDL أو preflight حي على الاستضافة: `STATIC_DDL_PLAN_READY_NO_STAGING_PREFLIGHT_NO_DDL_EXECUTED` |
| **على أي بيئة تم فحص الـ DDL؟** | **لا يوجد** | الجداول الـ 18 ظلت كتصميم هيكلي ساكن فقط. |
| **مؤشرات وصلاحيات الـ DB User** | **غير مفحوص** | يشترط خلو الحساب من صلاحيات `rolsuper` و `rolbypassrls` عند التأسيس. |
| **فحص واجهات التطبيق (API Smoke)** | **API_SMOKE_BLOCKED_OR_NOT_APPLICABLE_STATIC_UI_ONLY** | تعذر فحص واجهات التطبيق لعدم توفر بيئة Staging حية. |
| **اختبارات المتصفح (Browser E2E)** | **BROWSER_E2E_BLOCKED_STAGING_NOT_AVAILABLE** | تم تعليق الفحص بالكامل لعدم وجود خادم Staging نشط. |
| **حالة حماية الصفوف (RLS)** | **DB_RUNTIME_RLS_VERIFICATION_BLOCKED_STAGING_NOT_AVAILABLE** | تعليق التحقق لعدم توفر الاستضافة لتجربة الحماية التشغيلية. |

---

## 3. جرد ومراجعة جداول الـ ERD الـ 18 المقترحة (DDL Preflight)

تم حصر ومراجعة الجداول الـ 18 المقترح إنشاؤها لترقية المنصة وتأكيد جاهزيتها للهجرة:
1. `health_networks` (الشبكات الصحية)
2. `regions` (المناطق الجغرافية)
3. `medical_cities` (المدن الطبية والتجمعات)
4. `facility_types` (أنواع المنشآت)
5. `facilities` (المنشآت الفردية)
6. `facility_templates` (قوالب التعيين)
7. `facility_template_departments` (أقسام القوالب)
8. `facility_enabled_departments` (الأقسام المفعلة فعلياً)
9. `facility_buildings` (المباني)
10. `facility_floors` (الطوابق والأجنحة)
11. `facility_rooms` (الغرف والعيادات)
12. `facility_beds` (الأسرة الطبية)
13. `facility_services` (الخدمات والأسعار المخصصة)
14. `facility_operating_hours` (أوقات العمل)
15. `facility_accreditations` (شهادات سباهي)
16. `facility_insurance_contracts` (عقود التأمين)
17. `facility_dashboard_widgets` (ودجات التحكم)
18. `facility_navigation_items` (عناصر التنقل المخصصة)

* **حالة فحص ما قبل الهجرة:** الجداول جاهزة تماماً للهجرة ومطابقة للأمان والـ RLS، ولكن تم تعليق التنفيذ لعدم وجود موافقة المالك بعد: `BLOCKED_OWNER_STAGING_DDL_APPROVAL_REQUIRED`.

---

## 4. نتائج تشغيل الفحوصات الفنية (Test Results)

* **الاختبارات الآمنة لـ EMR (run_safe_tests.js):**
  * النتيجة: **101 DB-free passed, 0 failed, 48 skipped need DB/server** ✅.

---
**الخطوة التالية المسموحة (Next Allowed Action):**
* قيام المالك والـ DevOps بتأسيس الموارد المطلوبة وتقديم إقرار الجاهزية المكتوب (`OWNER_DEVOPS_COMPLETE_STAGING_PROVISIONING`).
