# تقرير تخطيط وهجرة أعمدة المستأجرين (Tenant Columns Backfill Planning Report)

وثيقة تخطيط معمارية لتنظيم وتوثيق ترحيل قاعدة بيانات نظام **نما الطبي** للعمل بالكامل تحت نموذج المستأجرين المتعددين (Multi-tenant SaaS)، وصياغة استعلامات ترقية الجداول وتحديث السجلات والتحقق برمجياً.

---

## 1. الملخص التنفيذي (Executive Summary)

يرسم هذا التقرير خارطة طريق فنية متكاملة لإضافة أعمدة عزل المستأجر والمنشأة والفرع (`tenant_id`, `facility_id`, `branch_id`) إلى بقية جداول قاعدة البيانات لـ **نما الطبي**، تمهيداً لعزل العمليات الطبية والمالية والتشغيلية بالكامل. 

تم جرد كافة الجداول المتبقية وتصنيفها حسب درجات الحساسية التشغيلية والسريرية، مع إعداد مسودات سكربتات SQL مستقلة لـ (1) المهاجرة الهيكلية DDL، و(2) ملء البيانات التاريخية DML، و(3) استعلامات المطابقة والتحقق للتفتيش عن السجلات اليتيمة ومنع تسرب البيانات.

---

## 2. سبب بقاء هذه المرحلة في النطاق التخطيطي والتوثيقي فقط

الأنظمة الطبية هي أنظمة حرجة بطبيعتها (Mission-Critical Systems)؛ وأي خلل في الهيكل أو تداخل في استرجاع سجلات المرضى قد يعيق الكادر الطبي عن التشخيص الصحيح أو سداد المستحقات.
لذلك، تقتصر هذه المرحلة على **التخطيط والصياغة والتوثيق المكتبي (Planning & Script Drafting)** دون تشغيل أي مهاجرات أو ملء على قاعدة البيانات الحية، لتمكين المطورين والمشرفين من مراجعة القيود والفهارس وإجراء اختبارات الجفاف (Dry Run) في بيئات معزولة تماماً قبل النشر الفعلي.

---

## 3. ما تم إنجازه في المرحلة السابقة

في مرحلة **Tenant Isolation Foundation Implementation**، تم بنجاح:
1. إنشاء جداول الأساس السبعة الحاكمة للمستأجرين والفروع وإعداد الإعدادات والخرائط.
2. تفعيل Seed الافتراضي برقم `1` للمستأجر والمنشأة والفرع.
3. ترقية جدولي `patients` (المرضى) و `invoices` (الفواتير) بإضافة الأعمدة كـ Nullable وملء البيانات القائمة بها.
4. تفعيل تصفية وعزل واجهات APIs لـ `GET /api/patients` و `GET /api/invoices` بنجاح.

---

## 4. جرد وتصنيف الجداول المتبقية

يحتوي النظام على 135 جدولاً، تم تصنيفها بعد الفرز إلى الفئات الآتية:

### أ. جداول سبق تجهيزها في المرحلة التمهيدية
* `tenants`, `facilities`, `branches`, `departments`, `user_tenants`, `user_facilities`, `tenant_settings`
* `patients`, `invoices`

### ب. جداول طبية عالية الحساسية (Requires: tenant_id, facility_id)
ترتبط مباشرة بسلوك وعلاج المريض، وتتطلب عزل وتشفير وضمان أمنها التام:
* `medical_records`, `prescriptions`, `dental_records`, `lab_radiology_orders`, `lab_results`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`, `consent_forms`, `emergency_visits`, `emergency_trauma_assessments`, `admissions`, `admission_daily_rounds`, `icu_monitoring`, `icu_ventilator`, `icu_scores`, `icu_fluid_balance`, `emar_orders`, `emar_administrations`, `nursing_care_plans`, `telemedicine_sessions`, `pathology_cases`, `social_work_cases`, `mortuary_cases`, `cosmetic_cases`, `cosmetic_consents`, `cosmetic_photos`, `cosmetic_followups`.

### ج. جداول مالية وحسابية (Requires: tenant_id, facility_id, branch_id)
ترتبط بالتدفقات المالية وتخضع لرقابة هيئة الزكاة والضريبة والجمارك (ZATCA) وعقود التأمين:
* `insurance_claims`, `finance_journal_entries`, `finance_journal_lines`, `finance_tax_declarations`, `finance_doctor_commissions`, `finance_vouchers`, `zatca_invoices`, `pharmacy_sales`, `pharmacy_sale_items`.

### د. جداول تشغيلية وخدمية (Requires: tenant_id, branch_id)
تخدم التوزيع اللوجستي وإشغال الأسرّة والغرف وصيانة المعدات حسب الفرع الجغرافي:
* `appointments`, `waiting_queue`, `online_bookings`, `portal_appointments`, `operating_rooms`, `emergency_beds`, `wards`, `beds`, `bed_transfers`, `transport_requests`, `maintenance_work_orders`.

### هـ. جداول الموارد البشرية والرواتب (Requires: tenant_id)
تنظيم الموظفين وتوزيع أدوارهم ورواتبهم وحضورهم:
* `employees`, `hr_employees` (تحتاج أيضاً `facility_id` و `branch_id` لتحديد موقع العمل)، `hr_salaries`, `hr_leaves`, `hr_advances`, `hr_employee_documents`, `hr_attendance`, `hr_employee_custody`.

### و. جداول المخزون والصيدلية (Requires: tenant_id, branch_id)
تتبع مستودعات الأدوية والمستلزمات الطبية التي ترتبط بالفرع المعين:
* `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `inventory_purchase_items`, `inventory_issue_to_dept`, `inventory_issue_items`, `inventory_dept_requests`, `inventory_dept_request_items`, `inventory_stock_count`, `doctor_inventory_requests`, `doctor_inventory_request_items`, `pharmacy_prescriptions_queue`, `pharmacy_drug_catalog`, `pharmacy_suppliers`, `pharmacy_purchase_orders`, `pharmacy_purchase_items`, `pharmacy_opening_balances`.

### ز. جداول مرجعية عامة لا تحتاج `tenant_id`
موسوعات طبية وأدلة عامة مشتركة لجميع مستخدمي النظام:
* `icd10_codes` (التشخيصات الطبية القياسية)، `medications` (كتالوج الأدوية المرجعي العام).

---

## 5. الجداول التي تحتاج معالجة خاصة (Special Handling Cases)

* **`system_users` & `user_permissions`**:
  * لا يصح حقن `tenant_id` مباشرة كقيد فريد على جدول المستخدمين في حال كان الطبيب أو الموظف يعمل لدى أكثر من مستأجر (مثال: استشاري يغطي منشأتين منفصلتين). يتم علاج ذلك عبر جدول الوساطة المكتمل `user_tenants` و `user_facilities` للربط الديناميكي بدلاً من العزل الثابت.
* **`audit_trail` (سجل التدقيق)**:
  * يجب إبقاء الحقول مرنة، وحقن `tenant_id` بناءً على الهوية النشطة لحظة طلب واجهة API، مع توفير مؤشرات (Indexes) سريعة للغاية لتمكين مراجعة السجلات الأمنية لكل مستأجر بشكل منفصل.

---

## 6. عرض مسودات السكربتات المنجزة (Draft Scripts Overview)

تم صياغة وإيداع السكربتات التالية في مجلد وثائق الـ SQL المخصصة:

1. **مسودة المهاجرة الهيكلية (DDL Script)**:
   * المسار: [medical_tenant_columns_backfill_plan.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/medical_tenant_columns_backfill_plan.sql)
   * الوصف: يحتوي على تعليمات `ALTER TABLE ADD COLUMN IF NOT EXISTS` لإضافة الأعمدة كـ Nullable وبناء الفهارس المركبة المناسبة.
2. **مسودة ملء البيانات التاريخية (DML Backfill Script)**:
   * المسار: [medical_tenant_columns_backfill_draft.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/medical_tenant_columns_backfill_draft.sql)
   * الوصف: يحتوي على تعليمات `UPDATE` لتعبئة السجلات الفراغية السابقة وتوجيهها للمستأجر والمنشأة الافتراضية `1` لضمان تكامل العلاقات.
3. **سكربت استعلامات التحقق والتدقيق (Validation Queries)**:
   * المسار: [medical_tenant_columns_validation_queries.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/medical_tenant_columns_validation_queries.sql)
   * الوصف: استعلامات مخصصة لحساب نسبة السجلات غير المكتملة وتدقيق العلاقات المتبادلة وكشف السجلات اليتيمة أو المتداخلة بين المستأجرين.

---

## 7. مخاطر الهجرة والتخفيف منها (Risks & Mitigation)

* **مخاطر تأثر الأداء نتيجة حقن الاستعلامات**:
  * **الخطر**: الفحص الكامل للجداول (Table Scan) في الاستعلامات المشتركة الكبرى (مثل السجلات الطبية ومخازن الأدوية).
  * **التخفيف**: إنشاء فهارس مركبة (Composite Indexes) تجمع `(tenant_id, id)` أو `(tenant_id, patient_id)` لضمان سرعة البحث واسترجاع البيانات بمتوسط زمن استجابة متدني للغاية.
* **مخاطر تداخل البيانات أثناء الترحيل المباشر**:
  * **الخطر**: كتابة استعلامات ملء أو مهاجرة تؤدي إلى قفل الجداول الطبية الحساسة (Table Locking) أثناء توافد العيادات.
  * **التخفيف**: تشغيل عمليات التحديث والترحيل في غير أوقات الذروة الطبية (خارج ساعات العمل الرسمية)، وإجراء الترحيل على دفعات مجزأة (Batch-based updates) للجداول التي تفوق سجلاتها 100,000 سجل.
* **مخاطر التعديل البرمجي الخاطئ لـ APIs**:
  * **الخطر**: نسيان تصفية أحد مسارات القراءة أو التعديل، مما يمهد لثغرة تسريب من نوع IDOR.
  * **التخفيف**: التخطيط المستقبلي لتطبيق PostgreSQL Row-Level Security (RLS) لفرض العزل في نواة قاعدة البيانات كخط دفاع أخير، ومراجعة الكود آلياً.

---

## 8. التوصية والمرحلة القادمة

نوصي بالانتقال للمرحلة القادمة:
**تشغيل الهجرة التجريبية لأعمدة المستأجرين محلياً (Tenant Columns Backfill Local Dry Run)**

وذلك لتجريب السكربتات المنجزة وتطبيقها حصرياً على بيئة التطوير المحلية ومراجعة خطط الاستعلامات وقياس زمن التنفيذ وتدقيق العلاقات البرمجية وتوليد تقارير النجاح الفعلي.
