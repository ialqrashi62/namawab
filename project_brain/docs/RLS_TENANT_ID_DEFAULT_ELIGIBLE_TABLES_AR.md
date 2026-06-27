# الجداول المؤهلة لإضافة tenant_id DEFAULT (Eligible Tables)

> المرحلة: `P0_RLS_TENANT_ID_DEFAULT_DDL_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | read-only تحقق قبل DDL.

## شرط الإدراج (كل الشروط)
FORCE RLS=true ؛ عمود tenant_id موجود ؛ لا default سابق ؛ نوع tenant_id متوافق مع cast (::integer) ؛ الجدول tenant-scoped (له سياسة tenant WITH CHECK) ؛ المرشّح مُختبَر (rehearsal 6/6).

## النتيجة الإجمالية (تحقق آلي على الإنتاج)
```text
FORCE_RLS_TABLES: 120
FORCE_RLS_TABLES_WITH_tenant_id: 120  (كلها)
tenant_id_type: integer لكل الـ120
EXISTING_tenant_id_DEFAULT: 0 جدول (لا overwrite لأي default سابق)
NON_INTEGER_tenant_id: NONE
=> INCLUDE: كل الـ120 ؛ EXCLUDE: لا شيء
candidate_default: (NULLIF(current_setting('app.tenant_id', true), ''))::integer
```

## الجداول التي ثبت انكسار كتابتها (subset ~44، أُصلحت بالـDEFAULT)
audit_trail*, blood_bank_crossmatch, blood_bank_donors, blood_bank_transfusions, blood_bank_units,
clinical_pharmacy_reviews, company_settings, cosmetic_cases, cosmetic_consents, cosmetic_followups,
diet_meals, diet_orders, employee_exposures, finance_chart_of_accounts, hand_hygiene_audits,
hr_employees, infection_outbreaks, infection_surveillance, insurance_claims, invoices(مسارات 2/11),
maintenance_equipment, maintenance_pm_schedules, maintenance_work_orders, medical_certificates,
medical_records, medical_records_coding, medical_records_requests, mortuary_cases,
nutrition_assessments, pathology_cases, patient_drug_education, portal_users, quality_incidents,
quality_kpis, quality_patient_satisfaction, queue_advertisements, rehab_goals, rehab_patients,
rehab_sessions, social_work_cases, telemedicine_sessions, transport_requests, waiting_queue(1/2), zatca_invoices

(* audit_trail لا يفشل بسبب write-always لكنه يستفيد من الإسناد.)

## قرار audit_trail
INCLUDE — آمن: تحت السياق يُختم tenant؛ بلا سياق (LOGIN/نظامي) DEFAULT=NULL وسياسة write-always تسمح NULL ⇒ لا كسر.

`ELIGIBLE_TABLES_COMPLETE`
