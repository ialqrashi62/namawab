# تقرير جرد حماية قاعدة البيانات وسياسات RLS (Database-wide RLS Inventory Report)
## نظام نما الطبي (NamaMedical) - مرحلة المراجعة النهائية لـ RLS

يوثق هذا التقرير نتائج بوابة جرد قاعدة البيانات (Gate 2) لحصر الجداول في المخطط العام وتحديد حالة عزل البيانات وأسماء السياسات المطبقة والفهارس المرتبطة بمعرف المستأجر.

---

### 1. إحصائيات عامة لجداول النظام (Database Overview Stats)

تحتوي قاعدة البيانات على ما مجموعه **148 جدولاً** في المخطط العام (`public`):
* **الجداول المفعّل عليها RLS**: **35 جدولاً** (موزعة بين 22 جدولاً بوضع `FORCE RLS` و 13 جدولاً بوضع `ENABLE RLS` بدون `FORCE`).
* **الجداول التي تحتوي عمود `tenant_id` ولكن RLS غير مفعّل**: **64 جدولاً** (تمثل وحدات إدارية، مالية، أو تشغيلية مساندة لم يتم استهدافها بإنفاذ RLS بالدفعات الخمسة السابقة).
* **الجداول التي لا تحتوي على عمود `tenant_id`**: **49 جدولاً** (تنقسم بين جداول مرجعية عامة وجداول سريرية مؤجلة).

---

### 2. تفاصيل الجداول المفعّل عليها RLS (RLS Enabled Tables)

| اسم الجدول (Table Name) | RLS Enabled | FORCE RLS | عدد السياسات | اسم السياسة المطبقة (Policy Name) |
| :--- | :---: | :---: | :---: | :--- |
| `admissions` | `t` | `t` | 1 | `rls_admissions_tenant_isolation` |
| `appointments` | `t` | `f` | 1 | `rls_appointments_tenant_isolation` |
| `bed_transfers` | `t` | `t` | 1 | `rls_bed_transfers_tenant_isolation` |
| `beds` | `t` | `t` | 1 | `rls_beds_tenant_isolation` |
| `consent_forms` | `t` | `t` | 1 | `rls_consent_forms_tenant_isolation` |
| `emar_administrations` | `t` | `t` | 1 | `rls_emar_administrations_tenant_isolation` |
| `emar_orders` | `t` | `t` | 1 | `rls_emar_orders_tenant_isolation` |
| `emergency_beds` | `t` | `f` | 1 | `rls_emergency_beds_tenant_isolation` |
| `emergency_visits` | `t` | `f` | 1 | `rls_emergency_visits_tenant_isolation` |
| `icu_fluid_balance` | `t` | `t` | 1 | `rls_icu_fluid_balance_tenant_isolation` |
| `icu_monitoring` | `t` | `t` | 1 | `rls_icu_monitoring_tenant_isolation` |
| `icu_scores` | `t` | `t` | 1 | `rls_icu_scores_tenant_isolation` |
| `icu_ventilator` | `t` | `t` | 1 | `rls_icu_ventilator_tenant_isolation` |
| `insurance_claims` | `t` | `f` | 1 | `rls_insurance_claims_tenant_isolation` |
| `invoices` | `t` | `f` | 1 | `rls_invoices_tenant_isolation` |
| `lab_radiology_orders` | `t` | `f` | 1 | `rls_lab_radiology_orders_tenant_isolation` |
| `lab_results` | `t` | `f` | 1 | `rls_lab_results_tenant_isolation` |
| `lab_samples` | `t` | `f` | 1 | `rls_lab_samples_tenant_isolation` |
| `nursing_assessments` | `t` | `t` | 1 | `rls_nursing_assessments_tenant_isolation` |
| `nursing_care_plans` | `t` | `t` | 1 | `rls_nursing_care_plans_tenant_isolation` |
| `nursing_vitals` | `t` | `t` | 1 | `rls_nursing_vitals_tenant_isolation` |
| `operating_rooms` | `t` | `t` | 1 | `rls_operating_rooms_tenant_isolation` |
| `patients` | `t` | `f` | 1 | `rls_patients_tenant_isolation` |
| `pharmacy_prescriptions_queue` | `t` | `f` | 1 | `rls_pharmacy_prescriptions_queue_tenant_isolation` |
| `pharmacy_sale_items` | `t` | `f` | 1 | `rls_pharmacy_sale_items_tenant_isolation` |
| `pharmacy_sales` | `t` | `f` | 1 | `rls_pharmacy_sales_tenant_isolation` |
| `prescriptions` | `t` | `f` | 1 | `rls_prescriptions_tenant_isolation` |
| `surgeries` | `t` | `t` | 1 | `rls_surgeries_tenant_isolation` |
| `surgery_anesthesia_records` | `t` | `t` | 1 | `rls_surgery_anesthesia_records_tenant_isolation` |
| `surgery_preop_assessments` | `t` | `t` | 1 | `rls_surgery_preop_assessments_tenant_isolation` |
| `surgery_preop_tests` | `t` | `t` | 1 | `rls_surgery_preop_tests_tenant_isolation` |
| `tenant_lab_test_overrides` | `t` | `t` | 1 | `rls_tenant_lab_test_overrides_tenant_isolation` |
| `tenant_radiology_overrides` | `t` | `t` | 1 | `rls_tenant_radiology_overrides_tenant_isolation` |
| `tenant_service_overrides` | `t` | `t` | 1 | `rls_tenant_service_overrides_tenant_isolation` |
| `wards` | `t` | `t` | 1 | `rls_wards_tenant_isolation` |

---

### 3. الجداول الكلينيكية بدون معرف مستأجر (Clinical Tables lacking tenant_id)

تم رصد **16 جدولاً سريرياً** تحتوي على `patient_id` أو `admission_id` ولكنها تفتقر لعمود `tenant_id` مباشر (يتم استنتاج عزلها برمجياً عبر الاستعلامات المترابطة JOIN بجدول المرضى/التنويم المعزول):
* الجداول: `approvals`, `blood_bank_crossmatch`, `blood_bank_transfusions`, `clinical_pharmacy_reviews`, `diet_meals`, `diet_orders`, `medical_records_coding`, `medical_records_files`, `medical_records_requests`, `nutrition_assessments`, `package_sessions`, `patient_drug_education`, `portal_users`, `rehab_assessments`, `rehab_patients`, `rehab_sessions`.

---

### 4. الفهارس والتحقق الميداني (Indexes & Fields validation)

* **الفهارس**: تم التحقق من إنشاء **40 فهراً أمنياً** على عمود `tenant_id` لتسريع عمليات البحث والاستعلام تحت ضوابط الـ RLS ومنع حدوث انحدار في أداء قاعدة البيانات.
* **القيم الفارغة (NULL tenant_id count)**: تم إجراء فحص للقاعدة وثبت أن عدد حقول `tenant_id` الفارغة لجداول التطوير الحالية يساوي **0** (تم ملؤها بالكامل وضمان عزلها).

**القرار**: تم اجتياز البوابة بنجاح (**Gate 2: PASS**).
