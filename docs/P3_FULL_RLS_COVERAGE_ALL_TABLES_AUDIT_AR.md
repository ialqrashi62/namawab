# تدقيق التغطية الكاملة لأمان مستوى الصف (RLS) لكل جداول قاعدة البيانات

> تقرير تدقيق أمني للقراءة فقط — قاعدة بيانات `nama_medical_web` (نظام معلومات صحي متعدد المستأجرين).
> التطبيق يعمل بدور غير مُتميّز هو `nama_medical_app` مع فرض سياسات RLS.
> هذا التقرير توثيقي فقط ولا يُجري أي تعديل على قاعدة البيانات (لا DDL، لا DML، لا منح صلاحيات).

## 1. الملخص التنفيذي

- إجمالي جداول مخطط `public`: **155** جدول.
- جداول مُفعّل عليها RLS: **125**.
- جداول بنمط **FORCE RLS**: **125**.
- جداول حسّاسة لكل مستأجر (PHI + مالية + تشغيلية): **139**.
- جداول حسّاسة محميّة بالكامل (tenant_id + RLS + FORCE + سياسة عزل + افتراضي app.tenant_id): **125**.
- جداول حسّاسة بها **ثغرات عزل**: **14**.
- دور التطبيق `nama_medical_app`: **ليس superuser**، **لا يملك bypassrls**، و**لا يملك أي جدول** (كل الجداول مملوكة لدور `postgres`).

## 2. وضع دور التطبيق `nama_medical_app`

| الفحص | النتيجة |
|---|---|
| الدور موجود | نعم |
| superuser (rolsuper) | لا |
| تجاوز RLS (rolbypassrls) | لا |
| إنشاء قواعد بيانات (rolcreatedb) | لا |
| إنشاء أدوار (rolcreaterole) | لا |
| عدد الجداول المملوكة لهذا الدور | 0 (صفر) |

الخلاصة: لا يملك التطبيق أي جدول، وبالتالي فإن سياسات FORCE RLS تُطبَّق عليه فعليًا (مالك الجدول وحده من يستطيع تجاوز RLS، وهو هنا `postgres` وليس `nama_medical_app`).

## 3. منهجية التصنيف

صُنّف كل جدول إلى فئة واحدة فقط وفق طبيعة بياناته وعلاقاته (الأعمدة، المفاتيح الأجنبية الواردة/الصادرة):

- **TENANT_PHI**: بيانات سريرية أو بيانات مرضى مربوطة بـ `tenant_id`.
- **TENANT_FINANCIAL**: فواتير/مطالبات/قيود/مشتريات/رواتب مربوطة بـ `tenant_id`.
- **TENANT_OPERATIONAL**: بيانات تشغيلية أخرى لكل مستأجر (مخزون، صيانة، إعدادات منشأة، طوابير...).
- **USER_SCOPED**: معزولة حسب المستخدم (الصندوق النقدي، الإغلاق اليومي، الرسائل الداخلية) لا حسب المستأجر.
- **GLOBAL_REFERENCE**: كتالوجات/قوائم مرجعية مشتركة بين كل المستأجرين (أكواد ICD، كتالوج المختبر/الأشعة، الأدوية، الخدمات) — ويُبنى التخصيص لكل مستأجر عبر جداول `tenant_*_overrides` المحميّة بـ FORCE RLS.
- **SYSTEM_ONLY**: جداول التحكم بالمنصّة (المستخدمون، المستأجرون، ربط المستخدم بالمستأجر/المنشأة، الصلاحيات) — لا يجوز أن تحمل عزل RLS لأنها تعرّف التعدّدية نفسها.
- **LEGACY_UNUSED**: 0 صف وغير مُشار إليها — لم تُرصد جداول تنطبق عليها هذه الفئة حصريًا.

ملاحظة: قيمة الصفوف «التقريبية» مأخوذة من `reltuples`؛ وللجداول التي ظهرت بصفر/سالب أُخذ عدّ فعلي `count(*)` للتمييز بين الفارغ والمأهول.

## 4. الإحصاء حسب الفئة

| الفئة | عدد الجداول |
|---|---|
| بيانات سريرية/صحية للمريض (TENANT_PHI) | 75 |
| بيانات مالية/فوترة (TENANT_FINANCIAL) | 25 |
| تشغيلية لكل مستأجر (TENANT_OPERATIONAL) | 39 |
| معزولة حسب المستخدم (USER_SCOPED) | 3 |
| مرجعية عامة مشتركة (GLOBAL_REFERENCE) | 8 |
| جداول النظام/التحكم (SYSTEM_ONLY) | 5 |
| **الإجمالي** | **155** |

## 5. الثغرات (GAPS) — جداول حسّاسة لكل مستأجر ينقصها عزل

هذه الجداول مصنّفة كحسّاسة لكل مستأجر (مالية أو تشغيلية) لكنها تفتقر إلى عنصر أو أكثر من عناصر العزل (عمود `tenant_id`، تفعيل RLS، FORCE، سياسة عزل، قيمة افتراضية لـ `tenant_id`). هي **مرشّحات للإصلاح مستقبلًا فقط** ولم يُجرَ عليها أي تغيير في هذا التقرير.

| الجدول | الفئة | الناقص | صفوف |
|---|---|---|---|
| `branches` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 1 |
| `cme_activities` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `cme_registrations` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `cssd_instrument_sets` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `cssd_load_items` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `cssd_sterilization_cycles` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `departments` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `discount_rules` | TENANT_FINANCIAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `employees` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 3 |
| `finance_cost_centers` | TENANT_FINANCIAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `finance_fiscal_years` | TENANT_FINANCIAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `form_templates` | TENANT_OPERATIONAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `insurance_companies` | TENANT_FINANCIAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |
| `insurance_contracts` | TENANT_FINANCIAL | tenant_id, RLS, FORCE, policy, tenant_default | 0 |

ملاحظات تفسيرية حول الثغرات:

- جميع الجداول الـ14 أعلاه تفتقر إلى الحزمة الكاملة (لا `tenant_id`، لا RLS، لا FORCE، لا سياسة، لا افتراضي)، أي أنها حاليًا غير معزولة على مستوى قاعدة البيانات ويعتمد عزلها — إن وُجد — على طبقة التطبيق فقط.
- المالية (5): `discount_rules`, `finance_cost_centers`, `finance_fiscal_years`, `insurance_companies`, `insurance_contracts` — تحمل قواعد خصم/مراكز تكلفة/سنوات مالية/عقود تأمين قد تختلف بين المستأجرين.
- التشغيلية (9): `branches`, `departments`, `employees`, `form_templates`, `cme_activities`, `cme_registrations`, `cssd_instrument_sets`, `cssd_load_items`, `cssd_sterilization_cycles` — تمثّل بنية تنظيمية/موظفين/قوالب/تعقيم لكل منشأة.
- `employees` يحتوي على بيانات رواتب/عمولات لـ3 موظفين دون `tenant_id` (يوجد بديل محمي `hr_employees` بنمط FORCE RLS).
- `internal_messages` و`cash_drawer` و`daily_close` صُنّفت **USER_SCOPED** (معزولة حسب المستخدم/الصندوق) وليست ضمن قائمة الثغرات أعلاه، لكنها أيضًا لا تحمل `tenant_id`؛ يُنصح بمراجعة كفاية العزل بالمستخدم في بيئة متعددة المستأجرين.

## 6. التفصيل الكامل لكل الجداول حسب الفئة

### 6.1 بيانات سريرية/صحية للمريض — TENANT_PHI (75)

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `admission_daily_rounds` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `admissions` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `appointments` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `approvals` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `bed_transfers` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `beds` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 95 |
| `blood_bank_crossmatch` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `blood_bank_donors` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `blood_bank_transfusions` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `blood_bank_units` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `clinical_pharmacy_reviews` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `consent_forms` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `cosmetic_cases` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `cosmetic_consents` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `cosmetic_followups` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `cosmetic_photos` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `dental_records` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `diet_meals` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `diet_orders` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `emar_administrations` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `emar_orders` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `emergency_beds` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 8 |
| `emergency_trauma_assessments` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `emergency_visits` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `employee_exposures` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hand_hygiene_audits` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `icu_fluid_balance` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `icu_monitoring` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `icu_scores` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `icu_ventilator` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `infection_outbreaks` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `infection_surveillance` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `lab_radiology_orders` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `lab_results` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `lab_samples` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_certificates` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_records` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_records_coding` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_records_files` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_records_requests` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `medical_reports` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `mortuary_cases` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `nursing_assessments` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `nursing_care_plans` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `nursing_vitals` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `nutrition_assessments` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `obgyn_deliveries` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `obgyn_pregnancies` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `online_bookings` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pathology_cases` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `patient_drug_education` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `patient_referrals` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `patients` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 3 |
| `pharmacy_prescriptions_queue` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `portal_appointments` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `portal_users` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `prescriptions` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `quality_patient_satisfaction` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `referrals` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `rehab_assessments` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `rehab_goals` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `rehab_patients` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `rehab_sessions` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `social_work_cases` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `surgeries` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `surgery_anesthesia_records` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `surgery_preop_assessments` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `surgery_preop_tests` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `telemedicine_sessions` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `tenant_lab_test_overrides` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `tenant_radiology_overrides` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `transport_requests` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `visit_lifecycle` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `waiting_queue` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `wards` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 8 |

### 6.2 بيانات مالية/فوترة — TENANT_FINANCIAL (25)

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `discount_rules` | لا | لا | لا | لا | 0 | لا | 0 |
| `finance_chart_of_accounts` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 30 |
| `finance_cost_centers` | لا | لا | لا | لا | 0 | لا | 0 |
| `finance_doctor_commissions` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `finance_fiscal_years` | لا | لا | لا | لا | 0 | لا | 0 |
| `finance_journal_entries` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `finance_journal_lines` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `finance_posting_account_map` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 23 |
| `finance_tax_declarations` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `finance_vouchers` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_advances` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_salaries` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `insurance_claims` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 3 |
| `insurance_companies` | لا | لا | لا | لا | 0 | لا | 0 |
| `insurance_contracts` | لا | لا | لا | لا | 0 | لا | 0 |
| `inventory_purchase_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_purchases` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `invoices` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 3 |
| `package_sessions` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `packages` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pharmacy_purchase_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pharmacy_purchase_orders` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pharmacy_sale_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pharmacy_sales` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `zatca_invoices` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |

### 6.3 تشغيلية لكل مستأجر — TENANT_OPERATIONAL (39)

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `audit_trail` | نعم | لا | نعم | نعم | 3 | نعم (app.tenant_id) | 26 |
| `branches` | لا | نعم | لا | لا | 0 | لا | 1 |
| `cme_activities` | لا | لا | لا | لا | 0 | لا | 0 |
| `cme_registrations` | لا | لا | لا | لا | 0 | لا | 0 |
| `company_settings` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 8 |
| `cssd_instrument_sets` | لا | لا | لا | لا | 0 | لا | 0 |
| `cssd_load_items` | لا | لا | لا | لا | 0 | لا | 0 |
| `cssd_sterilization_cycles` | لا | لا | لا | لا | 0 | لا | 0 |
| `departments` | لا | لا | لا | لا | 0 | لا | 0 |
| `doctor_inventory_request_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `doctor_inventory_requests` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `employees` | لا | لا | لا | لا | 0 | لا | 3 |
| `facilities` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 1 |
| `form_templates` | لا | لا | لا | لا | 0 | لا | 0 |
| `hr_attendance` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_employee_custody` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_employee_documents` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_employees` | نعم | نعم | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `hr_leaves` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `integration_settings` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_dept_request_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_dept_requests` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_issue_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_issue_to_dept` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_items` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_opening_balances` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `inventory_stock_count` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `maintenance_equipment` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `maintenance_pm_schedules` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `maintenance_work_orders` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `operating_rooms` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 4 |
| `pharmacy_drug_catalog` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 90 |
| `pharmacy_opening_balances` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `pharmacy_suppliers` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `quality_incidents` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `quality_kpis` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `queue_advertisements` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `tenant_service_overrides` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |
| `tenant_settings` | نعم | لا | نعم | نعم | 1 | نعم (app.tenant_id) | 0 |

### 6.4 معزولة حسب المستخدم — USER_SCOPED (3)

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `cash_drawer` | لا | لا | لا | لا | 0 | لا | 0 |
| `daily_close` | لا | لا | لا | لا | 0 | لا | 0 |
| `internal_messages` | لا | لا | لا | لا | 0 | لا | 0 |

### 6.5 مرجعية عامة مشتركة — GLOBAL_REFERENCE (8)

هذه كتالوجات مشتركة بين كل المستأجرين عمدًا؛ والتخصيص لكل مستأجر (مثل الأسعار) يتم عبر جداول `tenant_lab_test_overrides` و`tenant_radiology_overrides` و`tenant_service_overrides` المحميّة بـ FORCE RLS.

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `cosmetic_procedures` | لا | لا | لا | لا | 0 | لا | 825 |
| `drug_interactions` | لا | لا | لا | لا | 0 | لا | 0 |
| `icd10_codes` | لا | لا | لا | لا | 0 | لا | 0 |
| `insurance_policies` | لا | لا | لا | لا | 0 | لا | 0 |
| `lab_tests_catalog` | لا | لا | لا | لا | 0 | لا | 455 |
| `medical_services` | لا | لا | لا | لا | 0 | لا | 338 |
| `medications` | لا | لا | لا | لا | 0 | لا | 0 |
| `radiology_catalog` | لا | لا | لا | لا | 0 | لا | 305 |

### 6.6 جداول النظام/التحكم — SYSTEM_ONLY (5)

جداول تعريف التعدّدية والتحكم؛ لا يجوز فرض عزل RLS عليها لأنها مصدر الحقيقة لتعيين المستخدمين والمستأجرين والصلاحيات. (`system_users` يخزّن `password_hash` ويُدار على مستوى التطبيق وليس عبر RLS.)

| الجدول | tenant_id | facility_id | RLS مفعّل | FORCE | عدد السياسات | افتراضي tenant_id | صفوف تقريبية |
|---|---|---|---|---|---|---|---|
| `system_users` | لا | لا | لا | لا | 0 | لا | 1 |
| `tenants` | لا | لا | لا | لا | 0 | لا | 2 |
| `user_facilities` | لا | نعم | لا | لا | 0 | لا | 1 |
| `user_permissions` | لا | لا | لا | لا | 0 | لا | 0 |
| `user_tenants` | نعم | لا | لا | لا | 0 | لا | 1 |

## 7. ملخّص مصنّف نهائي

```
FORCE_RLS_TABLES: 125
TENANT_SENSITIVE_TABLES: 139
TENANT_SENSITIVE_FULLY_PROTECTED: 125
TENANT_SENSITIVE_WITH_GAPS: 14
  GAPS_LIST: branches, cme_activities, cme_registrations, cssd_instrument_sets, cssd_load_items, cssd_sterilization_cycles, departments, discount_rules, employees, finance_cost_centers, finance_fiscal_years, form_templates, insurance_companies, insurance_contracts
    FINANCIAL_GAPS (5): discount_rules, finance_cost_centers, finance_fiscal_years, insurance_companies, insurance_contracts
    OPERATIONAL_GAPS (9): branches, cme_activities, cme_registrations, cssd_instrument_sets, cssd_load_items, cssd_sterilization_cycles, departments, employees, form_templates
USER_SCOPED: 3  (cash_drawer, daily_close, internal_messages)
GLOBAL_REFERENCE: 8  (cosmetic_procedures, drug_interactions, icd10_codes, insurance_policies, lab_tests_catalog, medical_services, medications, radiology_catalog)
SYSTEM_ONLY: 5  (system_users, tenants, user_facilities, user_permissions, user_tenants)
LEGACY_UNUSED: 0
NAMA_MEDICAL_APP_OWNS_TABLES: NO
NAMA_MEDICAL_APP_SUPERUSER_OR_BYPASSRLS: NO
FINAL_STATUS: CANDIDATE_FIXES_NEEDED
  CANDIDATE_FIXES: branches, cme_activities, cme_registrations, cssd_instrument_sets, cssd_load_items, cssd_sterilization_cycles, departments, discount_rules, employees, finance_cost_centers, finance_fiscal_years, form_templates, insurance_companies, insurance_contracts
```

> الحالة النهائية **CANDIDATE_FIXES_NEEDED** لأن هناك 14 جدولًا حسّاسًا لكل مستأجر دون عزل على مستوى قاعدة البيانات. لم يُجرَ أي إصلاح؛ القائمة أعلاه هي مرشّحات للمعالجة المستقبلية فقط. لو لم توجد أي ثغرات لكانت الحالة `FULL_RLS_COVERAGE_AUDIT_PASS`.

---
_أُنشئ هذا التقرير آليًا عبر استعلامات قراءة فقط على فهارس النظام (pg_class, pg_policies, information_schema). لا يحتوي على أي أسرار أو كلمات مرور._
