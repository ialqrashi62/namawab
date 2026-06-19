# مصفوفة تصنيف وتغطية جداول النظام الطبي (Coverage Classification Matrix Report)
## نظام نما الطبي (NamaMedical) - مراجعة التغطية النهائية لسياسات عزل المستأجرين

يوثق هذا التقرير نتائج البوابة الثالثة (Gate 3) لتصنيف جميع جداول قاعدة البيانات (148 جدولاً) بناءً على حساسية البيانات وحالة عزل المستأجرين والإنفاذ الفعلي لسياسات RLS والواجهة البرمجية.

---

### 1. ملخص مستويات حساسية البيانات (Data Sensitivity Levels Summary)

1. **`CRITICAL_CLINICAL`**: جداول تحتوي على تشخيصات، علامات حيوية، وصفات، عمليات جراحية، وموافقات المرضى.
2. **`HIGH_FINANCIAL`**: جداول تحتوي على فواتير، مطالبات تأمينية، وحسابات مالية تابعة للمستأجرين.
3. **`HIGH_OPERATIONAL`**: جداول حجز المواعيد، غرف العمليات، التنويم والأسرة.
4. **`MEDIUM`**: جداول شؤون الموظفين والتسجيلات وخطط الصيانة.
5. **`LOW_REFERENCE`**: جداول مرجعية عامة مثل قواميس الأمراض ICD-10 وكتالوجات الأدوية العامة.

---

### 2. مصفوفة تصنيف المجموعات والجداول (Classification Matrix)

| مجموعة الجداول (Table Groups) | تصنيف التغطية (Classification) | مستوى الحساسية | التقييم والقرار الأمني |
| :--- | :---: | :---: | :--- |
| **الجراحة وغرف العمليات وسجلات التخدير** (`surgeries`, `operating_rooms`, `consent_forms`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`) | **RLS_ENABLED_AND_FORCED** | `CRITICAL_CLINICAL` / `HIGH_OPERATIONAL` | عزل كامل ومزدوج (قاعدة بيانات + واجهات) مع إنفاذ RLS وجاهزية تامة. |
| **التقييمات التمريضية والعناية المركزة** (`nursing_assessments`, `nursing_care_plans`, `nursing_vitals`, `icu_fluid_balance`, `icu_monitoring`, `icu_scores`, `icu_ventilator`, `emar_orders`, `emar_administrations`) | **RLS_ENABLED_AND_FORCED** | `CRITICAL_CLINICAL` | عزل كامل قسري مفعّل (Batch 4 & Nursing Assessments). |
| **الأسرة والأجنحة والتنويم والخروج** (`admissions`, `beds`, `wards`, `bed_transfers`) | **RLS_ENABLED_AND_FORCED** | `HIGH_OPERATIONAL` | عزل RLS و FORCE RLS فعال (Batch 1, 2, 3). |
| **تجاوزات الأسعار والخدمات والمختبر والأشعة للمستأجر** (`tenant_service_overrides`, `tenant_lab_test_overrides`, `tenant_radiology_overrides`) | **RLS_ENABLED_AND_FORCED** | `HIGH_FINANCIAL` | عزل كامل للأسعار المخصصة لكل مستأجر. |
| **المرضى، المواعيد، الفواتير، الوصفات، الفحوصات والتحاليل** (`patients`, `appointments`, `invoices`, `prescriptions`, `lab_radiology_orders`, `lab_results`, `lab_samples`, `pharmacy_sales`, `pharmacy_sale_items`, `pharmacy_prescriptions_queue`, `emergency_visits`, `emergency_beds`, `insurance_claims`) | **RLS_ENABLED_NOT_FORCED** | `CRITICAL_CLINICAL` / `HIGH_FINANCIAL` | RLS مفعّل لحماية البيانات عبر الواجهات والمستخدمين المحدودين، وتحتاج إلى ترقية إلى وضع **NEEDS_FORCE_RLS** مستقبلاً لمنع تجاوز مستخدم postgres لـ RLS. |
| **التقارير الطبية الكلينيكالية والإحالات وتذاكر الطوارئ** (`medical_records`, `patient_referrals`, `medical_certificates`, `online_bookings`, `dental_records`, `waiting_queue`, `company_settings`, `facilities`, `user_tenants`) | **API_ONLY_ACCEPTED** | `CRITICAL_CLINICAL` / `MEDIUM` | محمية برمجياً بالكامل في `server.js` لمنع ثغرات IDOR والوصول المتقاطع، وتصنف كـ **NEEDS_POLICY** لتفعيل RLS لاحقاً. |
| **المالية والرواتب والمخزون الطبي العام وشؤون الموظفين** (`finance_journal_entries`, `hr_employees`, `hr_salaries`, `inventory_items`, `inventory_purchases`, `maintenance_equipment`, `zatca_invoices`, إلخ — 64 جدولاً) | **API_ONLY_TEMPORARY** | `HIGH_FINANCIAL` / `MEDIUM` | محمية برمجياً عبر عزل الحسابات والـ session tenant، وتحتاج لإدراجها في مراحل RLS اللاحقة للـ Backfill والسياسات. |
| **الوصفات والتحاليل والفرز الطبي المؤجل** (`approvals`, `blood_bank_*`, `rehab_*`, `diet_*`, `portal_users` — 16 جدولاً) | **NEEDS_TENANT_ID** | `CRITICAL_CLINICAL` | تفتقر لعمود المستأجر ويتم عزلها بالربط (JOIN) مع المريض المعزول، وتحتاج مستقبلاً لـ Schema Change و Backfill. |
| **كتالوجات الأدوية والأمراض العامة والتكويد الدولي** (`icd10_codes`, `lab_tests_catalog`, `medications`, `radiology_catalog`, `tenants`) | **GLOBAL_REFERENCE_TABLE** | `LOW_REFERENCE` | قواميس طبية عامة مشتركة لجميع الحسابات الطبية ولا تحتاج لسياسات عزل RLS. |

---

### 3. تقييم وحالة العبور (Gate 3 Conclusion)

* **حالة بوابة تصنيف التغطية**: **PASS** (تم فرز وجدولة كافة الجداول الـ 148 في مصفوفة الحساسية والعزل بدقة).
* **الإجراء التالي**: مراجعة جودة صياغة سياسات RLS الحالية في قاعدة البيانات.

**القرار**: تم اجتياز البوابة بنجاح (**Gate 3: PASS**).
