# تقرير مسح وهيكلة البيانات الحساسة للمخطط (Jumanasoft Sanitization Scope Schema Scan Report)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** مراجعة وتدقيق نطاق تعقيم بيئة الاختبار المحلية (PHASE_LOCAL_SANITIZED_STAGING_SCOPE_VERIFICATION_AND_INTERNAL_REVIEW_PREP)
* **البوابة:** البوابة 1.1 — مسح المخطط للبيانات الحساسة (Gate 1.1 — Schema-Only Sensitive Surface Scan)
* **الحالة:** تم الجرد والتصنيف بنجاح (SUCCESS) ✅

---

## 1. نتائج مسح هيكل مخطط الجداول للبيانات الحساسة

تم مسح المخطط لتحديد كافة الجداول والأعمدة التي قد تحتوي على بيانات مرضى محمية (PHI) أو معلومات شخصية للمستخدمين أو الموظفين أو الموردين (PII):

| اسم الجدول (Table Name) | اسم العمود (Column Name) | سبب تصنيف الحساسية | حالة التعقيم (Sanitized Status) |
| :--- | :--- | :--- | :---: |
| **`patients`** | `name_ar`, `name_en`, `national_id`, `phone`, `notes` | بيانات المريض الشخصية والعامة | **covered** |
| **`appointments`** | `patient_name`, `notes` | أسماء المرضى وملاحظات المواعيد | **covered** |
| **`waiting_queue`** | `patient_name` | أسماء المرضى في الانتظار | **covered** |
| **`employees`** | `name`, `name_ar`, `name_en` | أسماء الموظفين العامة | **covered** |
| **`invoices`** | `patient_name`, `description` | أسماء الفواتير ووصف الخدمات | **covered** |
| **`medical_records`**| `diagnosis`, `symptoms`, `notes` | التشخيصات والأعراض والملف السريري | **covered** |
| **`hr_employees`** | `name_ar`, `name_en`, `national_id`, `phone`, `email` | بيانات الموظفين والموارد البشرية | **not_covered** ⚠️ |
| **`insurance_claims`**| `patient_name` | أسماء المرضى في مطالبات التأمين | **not_covered** ⚠️ |
| **`lab_radiology_orders`**| `description`, `results`, `structured_report` | تفاصيل نتائج فحص المختبر والأشعة | **not_covered** ⚠️ |
| **`pharmacy_prescriptions_queue`**| `prescription_text` | نصوص وتفاصيل الوصفات الصيدلانية | **not_covered** ⚠️ |
| **`pharmacy_suppliers`**| `contact_person`, `phone`, `email`, `address`, `notes` | بيانات وعناوين جهات اتصال الموردين | **not_covered** ⚠️ |
| **`hr_employee_documents`**| `doc_number` | أرقام وثائق الموظفين وهوياتهم | **not_covered** ⚠️ |
| **`hr_leaves`** | `notes` | ملاحظات الإجازات والطلبات | **not_covered** ⚠️ |
| **`hr_advances`** | `notes` | ملاحظات السلفيات للموظفين | **not_covered** ⚠️ |

---
**القرار:** تم تحديد ثغرات هامة غير مغطاة بالتعقيم المبدئي، وينتقل المساعد تلقائياً للبوابة 1.2 لإجراء تحليل الفجوات والتحضير لمرحلة التوسيع الفوري للمطهر.
