# P0 — تأكيد نطاق الـ14 جدولاً + قاعدة backfill (RLS)

> المرحلة: `P0_14_TABLE_TENANT_RLS_DDL_AND_BACKFILL_CONTROLLED_EXECUTION` — Gate 1 | 2026-06-21 | فحص قراءة-فقط.

## مشهد المستأجرين (حاسم لقاعدة backfill)
- جدول `tenants`: مستأجران — id=1 «Nama Medical Default Tenant»، id=2 «Tenant B».
- **tenant 2 بلا أي بيانات إطلاقاً**: 0 في patients/invoices/user_tenants/medical_records/appointments/audit_trail. `user_tenants` يحوي **tenant 1 فقط** (مستخدم واحد). ⇒ tenant 2 سجلّ placeholder فارغ بلا مستخدمين/بيانات.
- كل البيانات الحقيقية = **tenant 1**.

## الجداول الـ14 (مؤكَّدة من تدقيق PHASE 3، كلها بلا tenant_id/RLS)
| الجدول | تصنيف | rows | tenant_id | RLS/FORCE | backfill_needed | backfill_rule |
|---|---|---|---|---|---|---|
| discount_rules | financial | 0 | لا | لا | لا | — (فارغ) |
| finance_cost_centers | financial | 0 | لا | لا | لا | — |
| finance_fiscal_years | financial | 0 | لا | لا | لا | — |
| insurance_companies | financial | 0 | لا | لا | لا | — |
| insurance_contracts | financial | 0 | لا | لا | لا | — |
| branches | operational | **1** | لا | لا | **نعم** | tenant_id=1 (الصف `facility_id=1` = منشأة tenant 1؛ Main Branch/Riyadh) |
| departments | operational | 0 | لا | لا | لا | — |
| employees | operational (رواتب) | **3** | لا | لا | **نعم** | tenant_id=1 (لا عمود ربط؛ المستأجر الوحيد ذو البيانات/المستخدمين = 1؛ tenant 2 فارغ) |
| form_templates | operational | 0 | لا | لا | لا | — |
| cme_activities | operational | 0 | لا | لا | لا | — |
| cme_registrations | operational | 0 | لا | لا | لا | — |
| cssd_instrument_sets | operational | 0 | لا | لا | لا | — |
| cssd_load_items | operational | 0 | لا | لا | لا | — |
| cssd_sterilization_cycles | operational | 0 | لا | لا | لا | — |

## الخلاصة
- **العدد = 14** (مؤكَّد).
- **12 جدول فارغ (0 صفوف)** ⇒ DDL فقط (tenant_id + DEFAULT + ENABLE/FORCE RLS + policy)، **لا backfill**.
- **جدولان بصفوف**: branches (1) + employees (3) ⇒ backfill `tenant_id=1` بقاعدة آمنة مُثبَتة (المستأجر الوحيد ذو بيانات؛ tenant 2 فارغ تماماً؛ branches مرتبط بمنشأة tenant 1). إجمالي الصفوف المتأثرة بالـbackfill = **4**.
- لا جدول يحتاج قاعدة backfill غامضة ⇒ لا `BLOCKED_PENDING_BACKFILL_RULE_DECISION`.
- بعد التنفيذ: FORCE_RLS 133 → **147** (+14).

`14_TABLE_SCOPE_CONFIRMED — 12 empty (DDL only) + 2 with rows (branches=1, employees=3) backfill tenant_id=1 (provable single-tenant data)`
