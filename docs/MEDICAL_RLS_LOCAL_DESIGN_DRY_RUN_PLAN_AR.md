# تقرير تصميم أمان قاعدة البيانات على مستوى الصف والخطة التجريبية المحلية (RLS Local Design & Dry-Run Plan)

**التاريخ:** 2026-06-15  
**المرحلة:** RLS Local Design & Dry-Run Plan  
**الحالة:** ✅ مكتمل بنسبة 100% (تصميم وتخطيط فقط دون تفعيل إنتاجي)  

---

## 1. الملخص التنفيذي

تم بحمد الله الانتهاء من تصميم وتخطيط نظام الأمان على مستوى الصف (Row-Level Security - RLS) لقاعدة بيانات نظام نما الطبي (NamaMedical) في بيئة PostgreSQL. تهدف هذه المرحلة إلى نقل حماية عزل البيانات المتعددة المستأجرين (Multi-Tenancy Isolation) من مستوى خادم التطبيق (Application Layer) لتكون متأصلة ومضمونة ومحمية داخل محرك قاعدة البيانات نفسه (Database Layer).

تم في هذه المرحلة:
1. جرد وتصنيف كافة جداول قاعدة البيانات الطبية والتشغيلية واللوجستية (بإجمالي أكثر من 80 جدولاً) وتحديد ملاءمتها لعزل المستأجر أو المنشأة أو الفرع.
2. تصميم آلية ضبط سياق المستأجر ديناميكياً باستخدام متغيرات جلسة العمل الخاصة بقاعدة البيانات (Session Settings) عبر `app.tenant_id` و `app.facility_id` و `app.branch_id`.
3. إنشاء 4 ملفات SQL تجريبية كاملة لتهيئة الفحص وتطبيقه والتحقق منه وإلغائه محلياً دون أي تأثير على الإنتاج.
4. إعداد مصفوفة مخاطر متكاملة تشرح المتطلبات الأمنية ومخاطر التطبيق التدريجي.

---

## 2. لماذا لا يتم تفعيل RLS على الإنتاج الآن؟

يمثل أمان RLS تغييراً بنيوياً كبيراً في طريقة تعامل التطبيق مع قاعدة البيانات. وتفعيلها مباشرة على الإنتاج دون تجربة واختبار كافيين قد يؤدي إلى:
1. **حجب كامل البيانات (Data Blackout):** عند تفعيل RLS، تقوم قاعدة البيانات برفض إرجاع أو إدخال أي سجلات للطلبات التي لا تضبط سياق المستأجر بشكل صريح، وهو ما قد يتسبب في تعطيل خدمات التطبيق بالكامل إذا كانت هناك استعلامات لم تتم تهيئتها بعد.
2. **عدم كفاءة البرمجيات الوسيطة (Middleware Readiness):** يتطلب تفعيل RLS إعداد Middleware في خادم Express يقوم بتنفيذ استعلام `SET app.tenant_id = ...` في نفس اتصال الجلسة (Connection) قبل تنفيذ أي استعلام فعلي. وإذا تم استخدام مجمعات الاتصال (Connection Pools) دون إدارة دقيقة، قد يختلط سياق مستأجر مع آخر أو تُفقد القيمة الافتراضية.
3. **تعطيل المهام التشغيلية التلقائية (Background Jobs):** المهام التي تعمل بالخلفية بشكل تلقائي أو التقارير التجميعية الشاملة تحتاج لصلاحيات لتجاوز RLS أو استخدام حسابات بصلاحيات أعلى (Superuser) أو ضبط سياق خاص، وهو ما يحتاج لتخطيط هندسي دقيق.

لذلك، تم الاكتفاء بوضع التصميم والمسودات البرمجية وتشغيلها فقط في بيئات تجريبية آمنة (Dry-Run).

---

## 3. تصنيف جداول قاعدة البيانات الطبي والتشغيلي

تم تصنيف جداول قاعدة البيانات المستخرجة من [db_postgres.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/db_postgres.js) إلى الفئات التالية:

### أ. جداول معزولة مباشرة حسب المستأجر (Direct Tenant Scoped)
وهي الجداول التي تحتوي على عمود `tenant_id` وتتطلب عزلًا صارمًا:
* `patients`, `appointments`, `invoices`, `medical_records`, `prescriptions`, `dental_records`, `lab_radiology_orders`, `lab_results`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`, `consent_forms`, `emergency_visits`, `emergency_trauma_assessments`, `admissions`, `admission_daily_rounds`, `icu_monitoring`, `icu_ventilator`, `icu_scores`, `icu_fluid_balance`, `emar_orders`, `emar_administrations`, `nursing_care_plans`, `telemedicine_sessions`, `pathology_cases`, `social_work_cases`, `mortuary_cases`, `cosmetic_cases`, `cosmetic_consents`, `cosmetic_photos`, `cosmetic_followups`.
* **جداول الصيدلية والمخازن والمالية و HR:** `pharmacy_prescriptions_queue`, `pharmacy_drug_catalog`, `pharmacy_sales`, `pharmacy_opening_balances`, `pharmacy_purchase_orders`, `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `finance_journal_entries`, `finance_journal_lines`, `finance_tax_declarations`, `finance_vouchers`, `hr_employees`, `hr_salaries`, `hr_leaves`, `hr_advances`, `hr_employee_documents`, `hr_attendance`, `hr_employee_custody`, `audit_trail`, `quality_incidents`, `quality_patient_satisfaction`, `quality_kpis`, `infection_surveillance`, `infection_outbreaks`, `employee_exposures`, `hand_hygiene_audits`, `company_settings`, `integration_settings`, `queue_advertisements`, `maintenance_pm_schedules`, `maintenance_equipment`.

### ب. جداول معزولة حسب المنشأة (Facility Scoped)
الجداول التي تم ربطها بمنشأة محددة عبر عمود `facility_id` ويجب فرض مطابقة المنشأة اختيارياً بالإضافة للمستأجر الإلزامي:
* `patients`, `invoices`, `medical_records`, `prescriptions`, `dental_records`, `lab_radiology_orders`, `lab_results`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`, `consent_forms`, `emergency_visits`, `emergency_trauma_assessments`, `admissions`, `admission_daily_rounds`, `icu_monitoring`, `icu_ventilator`, `icu_scores`, `icu_fluid_balance`, `emar_orders`, `emar_administrations`, `nursing_care_plans`, `telemedicine_sessions`, `pathology_cases`, `social_work_cases`, `mortuary_cases`, `cosmetic_cases`, `cosmetic_consents`, `cosmetic_photos`, `cosmetic_followups`, `finance_journal_entries`, `finance_journal_lines`, `finance_tax_declarations`, `finance_doctor_commissions`, `finance_vouchers`, `zatca_invoices`, `hr_employees`.

### ج. جداول معزولة حسب الفرع والمستودع (Branch Scoped)
الجداول التي ترتبط بفرع أو مستودع معين وتتطلب فلترة `branch_id`:
* `operating_rooms`, `emergency_beds`, `beds`, `wards`, `bed_transfers`, `maintenance_work_orders`, `transport_requests`, `hr_employees`, `hr_attendance`, `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `inventory_purchase_items`, `inventory_issue_to_dept`, `inventory_issue_items`, `inventory_dept_requests`, `inventory_dept_request_items`, `inventory_stock_count`, `doctor_inventory_requests`, `pharmacy_prescriptions_queue`, `pharmacy_drug_catalog`, `pharmacy_sales`, `pharmacy_purchase_orders`, `pharmacy_opening_balances`, `finance_journal_entries`, `finance_journal_lines`, `finance_tax_declarations`, `finance_vouchers`, `zatca_invoices`, `appointments`, `waiting_queue`.

### د. الجداول العامة والمرجعية (Global & Reference)
الجداول التي تمثل القاموس العام للنظام والبيانات الإدارية ولا ينطبق عليها RLS المستأجرين:
* `tenants`, `facilities`, `branches`, `departments`, `icd10_codes`, `lab_tests_catalog`, `radiology_catalog`.
* `system_users` (عزل برمجيات الدخول وبوابة السوبر أدمن).

### هـ. جداول مؤجلة القرار (Deferred Decisions)
* `pharmacy_stock_log`: نظراً لعدم احتوائه على عمود `tenant_id` حالياً واعتماده على JOIN أمني في الكود مع جدول الكتالوج. يوصى بإبقاء معالجته برمجياً أو تنفيذ ترحيل لبنيته مستقبلاً قبل تطبيق RLS عليه.

---

## 4. نمط RLS المقترح

يتم استخدام الإعداد الفرعي للجلسة كالتالي:
```sql
-- عند بدء كل طلب يتم تهيئة هذه المعاملات داخل المعاملة (Transaction):
SET app.tenant_id = '1';
SET app.facility_id = '1'; -- اختياري
SET app.branch_id = '1'; -- اختياري
```

وصياغة السياسة العامة لـ SELECT و INSERT و UPDATE كالتالي:
```sql
CREATE POLICY tenant_isolation_policy ON table_name
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

وفي الجداول المرتبطة بالمنشآت والفروع لضمان ألا يؤدي ترك المعرف فارغاً لتعطيل الوصول:
```sql
CREATE POLICY facility_isolation_policy ON table_name
    FOR ALL
    USING (
        tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer AND
        (NULLIF(current_setting('app.facility_id', true), '') IS NULL OR facility_id = NULLIF(current_setting('app.facility_id', true), '')::integer)
    );
```

---

## 5. ملفات SQL التي تم إنشاؤها

تم بناء وإيداع الملفات التالية في مجلد وثائق المشروع لتكون جاهزة للتنفيذ التجريبي المحلي:
1. [docs/sql/rls_design_policy_draft.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_design_policy_draft.sql) — يحتوي على المسودة الكاملة للهيكلة والسياسات لجميع جداول النظام.
2. [docs/sql/rls_local_dry_run_setup.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_local_dry_run_setup.sql) — تهيئة RLS على 3 جداول تجريبية مع صمامات أمان تمنع تشغيله على الإنتاج.
3. [docs/sql/rls_local_dry_run_validation.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_local_dry_run_validation.sql) — استعلامات محاكاة وفحوصات عزل واختبار لبيانات وهمية.
4. [docs/sql/rls_rollback_draft.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_rollback_draft.sql) — أوامر التراجع السريع والتعطيل الآمن لتنظيف بيئة الفحص محلياً.

---

## 6. خطة التشغيل التجريبي المحلي (Dry-Run Plan)

لتشغيل السكربتات والتحقق منها بأمان كامل، نتبع الخطوات التالية:

### الخطوة 1: أخذ نسخة احتياطية محلية (Local Backup)
* نقوم بأخذ نسخة احتياطية لقاعدة البيانات المحلية قبل البدء:
  ```bash
  pg_dump -U postgres -d namamedical_local -F c -b -v -f backup_local_pre_rls.bak
  ```

### الخطوة 2: تهيئة السياسات على 3 جداول فقط
* تشغيل سكربت التهيئة [rls_local_dry_run_setup.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_local_dry_run_setup.sql) على قاعدة البيانات المحلية لتهيئة RLS وجداول `patients`, `invoices`, `appointments`.

### الخطوة 3: التحقق والتأكد من عدم Leak
* تشغيل سكربت الفحص [rls_local_dry_run_validation.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_local_dry_run_validation.sql) للتحقق من أن مستخدمي مستأجر 1 لا يمكنهم رؤية أو تعديل بيانات مستأجر 2، وملاحظة الأخطاء المرتجعة من قاعدة البيانات في العمليات المرفوضة.

### الخطوة 4: تشغيل سكربتات الاختبار الموضعية
* تشغيل سكربتات الاختبار التي تم تطويرها في المراحل السابقة للتأكد من عدم كسر التطبيق محلياً:
  * `cross_tenant_leak_test.js`
  * `cross_tenant_dashboard_test.js`
  * `cross_tenant_financial_reports_test.js`
  * `cross_tenant_pharmacy_inventory_reports_test.js`

### الخطوة 5: التراجع والتنظيف (Rollback)
* تشغيل [rls_rollback_draft.sql](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/docs/sql/rls_rollback_draft.sql) لإعادة قاعدة البيانات المحلية لحالتها الطبيعية.

---

## 7. تحليل مخاطر RLS

| الخطر المتوقع | مستوى الأثر | التدابير الأمنية الموصى بها لتلافي الخطر |
| :--- | :--- | :--- |
| **اختلاط سياق الاتصال (Connection Pooling Leak)** | مرتفع (P1) | يجب تهيئة خادم Express بحيث يقوم بضبط `SET app.tenant_id = ...` و `SET app.facility_id = ...` كمعاملة موحدة (Transaction block) في مستهل كل استعلام، أو إعادة ضبط السياق لـ `RESET ALL` أو قيمة فارغة بعد إنهاء الاستعلام لضمان عدم وراثة الطلب التالي لنفس المتغير. |
| **تعطل العمليات التلقائية في الخلفية (Background Workers)** | متوسط (P2) | يجب استثناء حساب تشغيل المهام التلقائية (System user/Superuser) من RLS، أو تهيئته ليعمل بصلاحية الـ bypass باستخدام `ALTER ROLE worker_role BYPASSRLS;` بعد دراسة الموثوقية الأمنية. |
| **كسر استعلامات التقارير التجميعية العابرة (Cross-Tenant Aggregates)** | متوسط (P2) | بعض واجهات لوحة التحكم الخاصة بمدير النظام العام (Super Admin) تتطلب قراءة تجميعية لكافة المستأجرين، هذه التقارير يجب أن تعمل باتصال مخصص يملك صلاحية `BYPASSRLS`. |
| **جداول مؤجلة تفتقد لمعرف المستأجر المباشر** | منخفض (P2) | تم تأجيل جداول مثل `pharmacy_stock_log`. عدم وجود معرف مباشر يعني بقاء الحماية برمجية فقط، ويجب حظر استخدام RLS عليها إلا بعد ترحيل بنيوي آمن للبيانات. |

---

## 8. توصية المرحلة التالية

نوصي بالانتقال إلى المرحلة التالية: **RLS Local Dry-Run on 3 Tables Only**  
لتنفيذ التشغيل التجريبي الفعلي للسياسات على قاعدة التطوير المحلية لجداول المرضى والفواتير والمواعيد، ومراقبة سلوك الاتصالات وضمان دمجها البرمجي السليم دون الإضرار ببيئة الإنتاج.
