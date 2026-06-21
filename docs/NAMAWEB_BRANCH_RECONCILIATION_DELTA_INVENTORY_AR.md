# جرد دلتا مصالحة فرع namaweb (Branch Reconciliation Delta Inventory)

> المرحلة: `NAMAWEB_BRANCH_RECONCILIATION_AND_SECURITY_DELTA_CANDIDATE` | التاريخ: 2026-06-21 | read-only audit. LIVE namaweb=039a7d7، parent=3d16b78، app=nama_medical_app، RLS enforced.

## السياق
فرع namaweb المنشور (039a7d7، الجلسة الموازية) ليس سلفاً لـcommits الأمنية الخاصة بي (10ded01...). للجلسة الموازية عزل واسع خاص بها (requireTenantScope=112، getRequestTenantContext=162). الفحص أدناه يقيس الكود الحيّ **فعلياً** لا تاريخ الـcommits.

## 🔴 الاكتشاف الأخطر: انحدار كتابة RLS واسع (مؤكَّد تجريبياً)
فحص منهجي لكل INSERT في server.js المنشور مقابل جداول FORCE-RLS (120، كلها بسياسة WITH CHECK على tenant_id) + لا يوجد DEFAULT على tenant_id (0/121) ⇒ **~44 جدول FORCE-RLS له مسار INSERT لا يختم tenant_id ⇒ يفشل 42501 تحت دور التطبيق**. إثبات تجريبي: `INSERT INTO transport_requests (patient_name)` بدور nama_medical_app وctx=1 → **42501 "new row violates row-level security policy"**.

الجداول المتأثرة (إنشاؤها مكسور حالياً على الإنتاج):
```text
audit_trail*, blood_bank_crossmatch, blood_bank_donors, blood_bank_transfusions, blood_bank_units,
clinical_pharmacy_reviews, company_settings, cosmetic_cases, cosmetic_consents, cosmetic_followups,
diet_meals, diet_orders, employee_exposures, finance_chart_of_accounts, hand_hygiene_audits,
hr_employees, infection_outbreaks, infection_surveillance, insurance_claims, invoices(2/11 مسارات),
maintenance_equipment, maintenance_pm_schedules, maintenance_work_orders, medical_certificates,
medical_records, medical_records_coding, medical_records_requests, mortuary_cases,
nutrition_assessments, pathology_cases, patient_drug_education, portal_users, quality_incidents,
quality_kpis, quality_patient_satisfaction, queue_advertisements, rehab_goals, rehab_patients,
rehab_sessions, social_work_cases, telemedicine_sessions, transport_requests, waiting_queue(1/2), zatca_invoices
```
(* audit_trail لا يفشل لأن سياسته write-always تسمح بـ NULL؛ لكنه يُخزَّن NULL-tenant ⇒ فجوة إسناد.)
33 جدول FORCE-RLS تختم INSERTs الخاصة بها tenant_id (سليمة).

## فحص البنود الـ14 (على الكود الحيّ 039a7d7)
| # | البند | الحالة في الحيّ | المخاطرة |
| --- | --- | --- | --- |
| 1 | logAudit tenant_id stamping | **MISSING** (INSERT 6 أعمدة) | فجوة إسناد (NULL-tenant)؛ لا 42501 |
| 2 | audit_trail policy/runtime compat | PRESENT (سياسات DB من Phase 148/154) | — |
| 3 | blood_bank_units stamping | **MISSING** | BLOCKER write (42501) |
| 4 | blood_bank_donors stamping | **MISSING** | BLOCKER write (42501) |
| 5 | refund IDOR guard | مُغطّى بـ RLS (قراءة/تحديث مفلتر) | NON-BLOCKING (دفاع-في-العمق) |
| 6-11 | queue/referral/claim/visits/records/multi-update guards | قراءة/تحديث مُغطّاة بـ RLS؛ لكن INSERTs لبعضها (insurance_claims/quality/transport) ضمن الـ44 | write BLOCKER لتلك الـINSERTs |
| 12 | invoice schema drift compat | أعمدة موجودة بالقاعدة؛ 2/11 مسار INSERT بلا ختم | write BLOCKER جزئي |
| 13 | app.tenant_id ALS/pool binding | **PRESENT** (مُثبَت 9/9 سابقاً) | — |
| 14 | facility entitlement guard | PRESENT | — |

## التصنيف (Gate 2)
```text
BLOCKER_RUNTIME_RLS_WRITE_REGRESSION: ~44 جدول FORCE-RLS بمسار INSERT بلا ختم tenant_id (مؤكَّد 42501)
BLOCKER_SECURITY_GUARD_MISSING: لا (عزل القراءة/التحديث مُغطّى بـ RLS الآن؛ الحُرّاس دفاع-في-العمق)
NON_BLOCKING_DOCS_DRIFT: تشعّب تاريخ commits (docs)
ALREADY_PRESENT: ALS binding، facility entitlement، audit_trail policies، invoice columns
```
⇒ بما أن انحدار الكتابة مؤكَّد، **لا audit-reader GRANT ولا accounting** قبل المعالجة.

`DELTA_INVENTORY_COMPLETE`
