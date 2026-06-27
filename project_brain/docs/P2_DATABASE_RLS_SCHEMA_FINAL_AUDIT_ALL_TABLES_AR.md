# PHASE 2 — تدقيق القاعدة/RLS/المخطط النهائي (كل الجداول)

> 2026-06-22 | استبطان حيّ read-only. لا DDL.

## الأرقام الحيّة
**162 جدولاً · 147 FORCE RLS (+147 policy) · 148 يحملون tenant_id.** سياسة موحّدة: `tenant_id = (NULLIF(current_setting('app.tenant_id',true),''))::integer` + DEFAULT بنفس التعبير. المالك postgres (super، يتجاوز FORCE)؛ التطبيق `nama_medical_app` (super=false, bypassrls=false) ⇒ RLS مفروض على مسار التطبيق.

## تصنيف الجداول
| الفئة | أمثلة | RLS |
|---|---|---|
| TENANT_PHI | patients, medical_records, nursing_*, icu_*, lab_radiology_orders, blood_bank_*, obgyn_*, pathology_* | ✅ FORCE |
| TENANT_FINANCIAL | invoices, insurance_claims/companies/contracts, finance_* | ✅ FORCE |
| TENANT_HR_PAYROLL | hr_employees, hr_salaries/leaves/attendance, employees | ✅ FORCE |
| TENANT_OPERATIONAL | inventory, appointments, admissions, beds, maintenance, cssd_*, cme_*, infection_* | ✅ FORCE |
| GLOBAL_REFERENCE | icd10_codes, medications, drug_interactions, lab_tests_catalog, radiology_catalog, medical_services, cosmetic_procedures | لا (catalog مشترك) ✅ |
| SYSTEM_SECURITY | system_users, user_permissions | لا (RBAC؛ يعرّف التينانسي) ✅ |
| USER_SCOPED | cash_drawer, internal_messages | لا (user-scoped) ✅ |
| JUNCTION | user_tenants(tid), user_facilities | لا (يُقرأ قبل ضبط السياق) ✅ |
| REGISTRY | tenants | لا (سجل المستأجرين) ✅ |
| **DORMANT_GAP** | **daily_close** | ⚠ بلا RLS، فارغ — مرشّح مُرهَّن PASS، gated |

⇒ الـ15 غير المحميّة بـFORCE: **14 غير حسّاسة بالتصميم + daily_close (خاملة)**.

## التراجع/النسخ
down.sql لكل دفعة (14-table، route a/b/c، boot، beds، icu، audit_trail، daily_close، tenant_id index) موجودة في `docs/sql/`.

## الحالة
```text
FORCE_RLS=147 · TENANT_ID_TABLES=148 · TENANT_SENSITIVE_RLS_GAPS=0 (populated)
DORMANT_GAP: daily_close (rows=0, candidate rehearsed PASS, NOT deployed)
NEXT_REQUIRED_ACTION: APPROVE_DAILY_CLOSE_TENANT_RLS_DDL
```
