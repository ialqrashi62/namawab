# تقرير تحليل فجوات تغطية تعقيم البيانات (Jumanasoft Sanitization Coverage Gap Analysis Report)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** مراجعة وتدقيق نطاق تعقيم بيئة الاختبار المحلية (PHASE_LOCAL_SANITIZED_STAGING_SCOPE_VERIFICATION_AND_INTERNAL_REVIEW_PREP)
* **البوابة:** البوابة 1.2 — مقارنة وتحليل فجوات التعقيم (Gate 1.2 — Compare Against Existing Sanitizer Coverage)
* **القرار التلقائي للمرحلة:** الانتقال لتوسيع كود المطهر (`PHASE 2 — Sanitizer Expansion`) ⚠️

---

## 1. ملخص تصنيف مقارنة وتغطية الجداول

بناءً على مطابقة نتائج جرد المخطط مع جداول التعقيم الستة الحالية، تم تصنيف الفجوات المتبقية بدقة كالتالي:

* **covered_tables (الجداول المغطاة حالياً):**
  * `patients`, `appointments`, `waiting_queue`, `employees`, `invoices`, `medical_records`
* **uncovered_sensitive_tables (الجداول الحساسة غير المغطاة):**
  * `hr_employees`, `insurance_claims`, `lab_radiology_orders`, `pharmacy_prescriptions_queue`, `pharmacy_suppliers`, `hr_employee_documents`, `hr_leaves`, `hr_advances`
* **uncovered_sensitive_columns (الحقول غير المغطاة):**
  * `hr_employees.name_ar`, `hr_employees.name_en`, `hr_employees.national_id`, `hr_employees.phone`, `hr_employees.email`
  * `insurance_claims.patient_name`
  * `lab_radiology_orders.description`, `lab_radiology_orders.results`, `lab_radiology_orders.structured_report`
  * `pharmacy_prescriptions_queue.prescription_text`
  * `pharmacy_suppliers.contact_person`, `pharmacy_suppliers.phone`, `pharmacy_suppliers.email`, `pharmacy_suppliers.address`, `pharmacy_suppliers.notes`
  * `hr_employee_documents.doc_number`
  * `hr_leaves.notes`
  * `hr_advances.notes`
* **false_positive_columns (حقول وهمية الحساسية):**
  * `medications.name` (اسم الدواء عام ولا يحتوي PII).
  * `lab_tests_catalog.test_name` (اسم الفحص المخبري عام).
  * `finance_chart_of_accounts.account_name_en` (أسماء الحسابات المالية عامة).
* **tables_requiring_manual_review (جداول للمراجعة اليدوية اللاحقة):**
  * لا يوجد؛ كافة الجداول المتبقية مصنفة بالكامل.

---

## 2. قرار المساعد الذكي التلقائي (Auto Pilot Decision)

بما أنه قد تم رصد فجوات حقيقية للبيانات غير المغطاة بالتعقيم المبدئي، وبما أن معالجتها **ممكنة وآمنة تماماً** داخل قاعدة جمانة سوفت المحلية ومقيدة بعدم لمس الإنتاج ودون تشغيل DDL، فقد تقرر **الانتقال الفوري وتفعيل PHASE 2 (Sanitizer Expansion)** لتحديث كود المطهر وتوسيع التغطية بالكامل.

---
**القرار:** العبور لـ PHASE 2 والبدء الفوري في تصميم التوسيع لسكربت التعقيم.
