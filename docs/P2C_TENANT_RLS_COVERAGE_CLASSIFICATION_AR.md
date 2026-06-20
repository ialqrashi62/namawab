# P2C — تصنيف تغطية RLS لجداول المستأجر (72 جدولاً بلا RLS)

> التاريخ: 2026-06-20. **تصنيف وتخطيط فقط — لم تُطبَّق RLS على أي من الـ72 (لا على staging ولا الإنتاج).**
> القاعدة: لا تُطبَّق RLS على الـ72 دفعةً واحدة بشكل أعمى؛ خطة مرحلية.

## الوضع
- إجمالي جداول `public`: 149. جداول تحمل `tenant_id`: ~114.
- **مغطّاة بـ RLS: 42** (35 قائمة + 7 مالية مرشّحة). **بلا RLS: 72**.
- تبديل دور التشغيل (P2B/P2C) **يُنفِّذ RLS على الـ42 المغطّاة** فوراً؛ الـ72 تبقى معتمدة على فلترة التطبيق (`WHERE tenant_id`) حتى تُغطّى.

## التصنيف

### A) يجب تفعيل RLS قبل/بعد التبديل مباشرةً — حساسية عالية (PHI / مالي / HR) (~41)
سجلات طبية ومرضى: `medical_records`, `medical_records_coding`, `medical_records_files`, `medical_records_requests`, `medical_certificates`, `pathology_cases`, `clinical_pharmacy_reviews`, `patient_drug_education`, `patient_referrals`, `emergency_trauma_assessments`, `admission_daily_rounds`, `nutrition_assessments`, `dental_records`, `mortuary_cases`, `social_work_cases`, `telemedicine_sessions`, `diet_orders`, `diet_meals`.
تأهيل وتجميل: `rehab_patients`, `rehab_assessments`, `rehab_goals`, `rehab_sessions`, `cosmetic_cases`, `cosmetic_consents`, `cosmetic_followups`, `cosmetic_photos`.
مرضى/حجوزات: `online_bookings`, `portal_appointments`, `waiting_queue`.
موارد بشرية ومالية: `hr_employees`, `hr_salaries`, `hr_advances`, `hr_leaves`, `hr_attendance`, `hr_employee_custody`, `hr_employee_documents`, `employee_exposures`, `zatca_invoices`.
جودة المرضى: `quality_incidents`, `quality_patient_satisfaction`.

### B) يمكن البقاء على فلترة التطبيق مؤقتاً (تشغيلي/مخزون/صيانة — حساسية أقل) (~22)
`inventory_items`, `inventory_purchases`, `inventory_purchase_items`, `inventory_issue_to_dept`, `inventory_issue_items`, `inventory_dept_requests`, `inventory_dept_request_items`, `inventory_stock_count`, `inventory_opening_balances`, `doctor_inventory_requests`, `doctor_inventory_request_items`, `pharmacy_purchase_orders`, `pharmacy_purchase_items`, `pharmacy_opening_balances`, `pharmacy_suppliers`, `maintenance_equipment`, `maintenance_pm_schedules`, `maintenance_work_orders`, `transport_requests`, `hand_hygiene_audits`, `infection_surveillance`, `infection_outbreaks`, `quality_kpis`.

### C) مرجعي/إعدادات — راجِع هل يحتاج tenant RLS أصلاً (~6)
`company_settings`, `tenant_settings`, `integration_settings`, `facilities`, `pharmacy_drug_catalog` (قد يكون كتالوجاً عالمياً), `queue_advertisements`.

### D) تصميم خاص — يتطلب مراجعة يدوية (auth/audit/mapping) (~3)
`user_tenants`, `portal_users` (ربط مصادقة — RLS يجب ألا يمنع تسجيل الدخول), `audit_trail` (سجل تدقيق — إمّا tenant-scoped أو admin-only، بسياسة خاصة).

## الخطة المرحلية الموصى بها
1. **المرحلة 1 (قبل go-live للترحيل المحاسبي):** تفعيل RLS على الفئة A (PHI/HR/مالي) — أعلى مخاطرة تسريب. تُولَّد سياسات بنفس النمط `tenant_id=NULLIF(current_setting('app.tenant_id',true),'')::int` + بروفة staging تحت `nama_medical_app`.
2. **المرحلة 2:** الفئة B (تشغيلي) — دفعات.
3. **المرحلة 3:** الفئة C بعد قرار global/tenant لكل جدول.
4. **المرحلة 4:** الفئة D بسياسات مخصّصة + اختبار عدم كسر تسجيل الدخول/التدقيق.

## مخاطرة متبقية أثناء الفترة الانتقالية
الجداول غير المغطّاة تعتمد على فلترة التطبيق فقط. هذا **لا يتراجع** بتبديل الدور (الوضع نفسه اليوم)، لكن التبديل **يحسّن** الـ42 المغطّاة. مع ذلك يُنصح بإنجاز الفئة A بسرعة لتقليل سطح التسريب.

## ملاحظة
أُثبت في P2C أن `medical_records` (فئة A، بلا RLS) يُرجع كل الصفوف بلا سياق تحت دور التشغيل ⇒ دليل ملموس على ضرورة الفئة A.
