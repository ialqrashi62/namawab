# تقرير سلامة RLS وعزل المستأجرين للإنتاج (FORCE RLS and Tenant Isolation Monitoring Report)
## نظام نما الطبي (NamaMedical) - مرحلة مراقبة ما بعد العبور للإنتاج

يوثق هذا التقرير التدقيق الأمني لسياسات عزل المستأجرين على مستوى قاعدة البيانات (Row Level Security) والتحقق من فرضها قسرياً على التطبيق في خادم الإنتاج.

---

## 1. نتائج التحقق الهيكلي من تفعيل الـ RLS (pg_class Verification)

تم تشغيل استعلام التحقق التفصيلي المعتمد في `docs/sql/production_readiness_force_rls_validate.sql` على قاعدة البيانات الإنتاجية وكانت الفحوصات كالتالي:

| اسم الجدول المستعلم عنه | تفعيل RLS أمنياً (rls_enabled) | فرض RLS قسرياً (rls_forced) | التقييم الأمني |
| :--- | :---: | :---: | :---: |
| `patients` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `appointments` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `invoices` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `prescriptions` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `lab_results` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `lab_samples` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `lab_radiology_orders` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `emergency_visits` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `emergency_beds` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `insurance_claims` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `pharmacy_sales` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `pharmacy_sale_items` | `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |
| `pharmacy_prescriptions_queue`| `t` (True) | `f` (False) | **FAIL (غير مفروض قسرياً)** |

---

## 2. الثغرة والخلل الأمني الحرِج المرصود (Critical RLS Bypass Vulnerability)

كشف التدقيق المتعمق لهوية المالك وحسابات الاتصال بقاعدة البيانات عن ثغرة التفاف وعطل تام لنظام العزل للأسباب التالية:
1. **مالك الجداول (Table Owner)**: جداول قاعدة البيانات مملوكة بالكامل للمستخدم الإداري `postgres`.
2. **حساب اتصال التطبيق (DB_USER)**: يتصل تطبيق الويب الإنتاجي بقاعدة البيانات باستخدام نفس حساب المالك `DB_USER=postgres` (كما تم التحقق منه في ملف `.env` الإنتاجي).
3. **تخطي سياسات RLS (RLS Owner Bypass)**: محرك PostgreSQL يتخطى ويستثني مالك الجدول (Table Owner) تلقائياً من تطبيق سياسات الـ RLS (أي يستعلم ويرى كافة البيانات دون أي عزل أو تصفية)، **إلا في حالة واحدة**: وهي تفعيل خاصية الفرض القسري على المالك للجدول باستخدام الأمر:
   `ALTER TABLE table_name FORCE ROW LEVEL SECURITY;`
4. **حالة الفرض الحالي**: الفحص الهيكلي يثبت أن خاصية الفرض القسري (`rls_forced`) معطلة ومحددة كـ `f` (False) لجميع الجداول الـ 13 الحساسة.
5. **النتيجة الكارثية**: تطبيق الويب الإنتاجي يستعلم ويكتب البيانات بدون أي عزل RLS حقيقي على مستوى قاعدة البيانات، ويتحايل بالكامل على سياسات الحماية في حال حدوث أي خطأ برمجي في تمرير سياق المستأجر أو عند استخدام استعلامات مباشرة.

---

## 3. التقييم النهائي للبوابة والقرار الأمني

* **FORCE_RLS_VALIDATION**: **`FAIL`**
* **TENANT_ISOLATION_MONITORING**: **`FAIL`**
* **الملاحظات**: يمثل هذا الخلل الأمني خطراً جسيماً يعطل إعلان جاهزية الإنتاج للعملاء (P0 Security Blocker). يجب تصحيح هذه الثغرة وتفعيل الفرض القسري فوراً للحد من مخاطر تسرب البيانات المتقاطعة بين المستأجرين (Cross-Tenant Leakage).

---

## 4. التوصية الفنية العاجلة لفك الحظر

قبل إطلاق الخدمة للعملاء، يجب تشغيل DDL التالي لفرض سياسات RLS قسرياً على مالك الجداول:
```sql
ALTER TABLE patients FORCE ROW LEVEL SECURITY;
ALTER TABLE appointments FORCE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;
ALTER TABLE prescriptions FORCE ROW LEVEL SECURITY;
ALTER TABLE lab_results FORCE ROW LEVEL SECURITY;
ALTER TABLE lab_samples FORCE ROW LEVEL SECURITY;
ALTER TABLE lab_radiology_orders FORCE ROW LEVEL SECURITY;
ALTER TABLE emergency_visits FORCE ROW LEVEL SECURITY;
ALTER TABLE emergency_beds FORCE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims FORCE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales FORCE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sale_items FORCE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_prescriptions_queue FORCE ROW LEVEL SECURITY;
```
