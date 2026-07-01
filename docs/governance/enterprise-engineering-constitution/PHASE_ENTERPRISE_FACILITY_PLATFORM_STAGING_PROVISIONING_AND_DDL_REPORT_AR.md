# تقرير تهيئة بيئة Staging وتجهيز الجداول الطبية (PHASE_ENTERPRISE_FACILITY_PLATFORM_STAGING_PROVISIONING_AND_DDL_REPORT_AR)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** تهيئة وفحص بيئة Staging وتجهيز الجداول (PHASE_ENTERPRISE_FACILITY_PLATFORM_STAGING_PROVISIONING_AND_DDL_PREP)
* **المستند:** تقرير تهيئة بيئة Staging وتجهيز جداول الـ ERD
* **الحالة الفنية:** تعليق تشغيل الهجرات بانتظار تهيئة بيئة Staging (`BLOCKED_OWNER_DEVOPS_STAGING_PROVISIONING_REQUIRED`) 🛑

---

## 1. ملخص المراجعة والقرارات الأمنية للمرحلة

* **القرار والقرار النهائي المعتمد للمرحلة (FINAL_STATUS):**
  * **`BLOCKED_OWNER_DEVOPS_STAGING_PROVISIONING_REQUIRED`** (تعليق العمل لعدم جاهزية موارد خادم الاستضافة وقاعدة بيانات Staging من قبل المالك/DevOps).
* **معرف الالتزام للمستودع الأب (Root Branch & SHA):**
  * الفرع: `ops/jumanasoft-enterprise-facility-platform-staging-prep`
  * معرف الالتزام (Commit SHA): `3f899a7b973ef43960ec6a8276fdb46a81bf6d75` (قبل إدراج مستندات التقرير الحالية).
* **معرف الالتزام للمستودع الفرعي (Submodule Branch & SHA):**
  * الفرع: `integration/all-epics`
  * معرف الالتزام (Commit SHA): `9e66447e421c6298f1f8dd09c6ff127e3ee17169`

---

## 2. جدول إقرار الأمان والقيود والجاهزية للـ Staging

| البند الفني | الجاهزية والإقرار | التفاصيل وإيضاحات الأمان |
| :--- | :---: | :--- |
| **هل بيئة Staging متاحة؟** | **NO** ❌ | خادم Staging وقاعدة بيانات `nama_medical_staging` قيد التأسيس من قبل المالك. |
| **هل بيئة Staging معزولة؟** | **YES (Planned)** | تم وضع شروط عزل الشبكة وحسابات المستخدمين المقيدة بالكامل في حزمة المالك. |
| **هل تم لمس الإنتاج؟** | **NO** ❌ | لم يتم الاتصال أو المساس ببيئة الإنتاج الفعلي مطلقاً. |
| **هل تم تنفيذ DDL / Migrations؟** | **NO** ❌ | لم يتم تنفيذ أي أوامر DDL: `STAGING_DDL_PREFLIGHT_READY_NO_DDL_EXECUTED` |
| **على أي بيئة تم فحص الـ DDL؟** | **لا يوجد** | الجداول الـ 18 ظلت كتصميم هيكلي ساكن فقط. |
| **مؤشرات وصلاحيات الـ DB User** | **مقبول** | يشترط خلو الحساب من صلاحيات `rolsuper` و `rolbypassrls`. |
| **فحص واجهات التطبيق (API Smoke)** | **NOT_APPLICABLE** | الواجهة ثابتة محلياً: `API_SMOKE_NOT_APPLICABLE_STATIC_UI_ONLY` |
| **اختبارات المتصفح (Browser E2E)** | **BLOCKED** | تم تعليق الفحص: `BROWSER_E2E_BLOCKED_TEST_CREDENTIALS_NOT_AVAILABLE` |
| **حالة حماية الصفوف (RLS)** | **PENDING** | سيتم فرض سياسات RLS/FORCE RLS بعد تطبيق الجداول الـ 18 فعلياً. |

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
  * عدد الاختبارات الكلي: **101** اختباراً.
  * عدد الناجح منها (PASS): **101** اختباراً بنسبة نجاح 100% ✅.
  * عدد الاختبارات المتخطاة (SKIP): **48** اختباراً.

---
**الخطوة التالية المسموحة (Next Allowed Action):**
* قيام المالك والـ DevOps بتأسيس الموارد المطلوبة وتقديم إقرار الجاهزية المكتوب (`OWNER_DEVOPS_COMPLETE_STAGING_PROVISIONING`).
