# جرد الموديولات والميزات (Modules & Features Inventory)

> المرحلة: `MEDICAL_EXTENDED_AUDIT_GAP_COMPLETION_AFTER_RLS_PASS` | التاريخ: 2026-06-20
> مراجع أساسية: `GLOBAL_AUDIT_01_PROJECT_DISCOVERY`, `GLOBAL_AUDIT_02_FUNCTIONAL_COVERAGE_GAPS`, `GLOBAL_AUDIT_05_DATABASE_TENANT_ISOLATION`.
> الأدلة: `public/js/app.js` (NAV_ITEMS، 43 موديولاً)، `server.js` (370 مساراً)، `db_postgres.js` (~148 جدولاً).

## معايير الحالة
لا تُعتبر الوحدة **Complete** إلا باكتمال: UI + API + DB + validation + permissions + tenant isolation + facility entitlement + business logic + tests + docs. (نظراً لأن **facility entitlement غير مُنفَّذ على الـ backend إطلاقاً** — انظر التقرير 4 — فلا وحدة تبلغ Complete بالمعنى الصارم؛ أعلى مستوى واقعي = "Functional").

## جدول الجرد

| Module | Status | UI | API | DB | Business Logic | Permissions | Tenant Isolation | Facility Entitlement | Tests | Evidence | Missing Work | Priority |
| ------ | ------ | -- | --- | -- | -------------- | ----------- | ---------------- | -------------------- | ----- | -------- | ------------ | -------- |
| المرضى | Functional | ✅ | ✅ | ✅ | جزئي (لا merge/MRN موحّد) | requireRole('patients') | ✅ (مفلتر + FORCE RLS) | ❌ backend | ✅ leak_test | server.js:348-470 | merge، تاريخ مهيكل | P2 |
| المواعيد والاستقبال | Functional | ✅ | ✅ | ✅ | conflict/dup/checkin/noshow | requireRole | ✅ | ❌ | ✅ | server.js:519-575 | تذكير SMS، تقويم بصري | P1 |
| EMR/EHR | Partial | ✅ | ✅ | ✅ | جزئي (نص حر) | requireRole(doctor) | ✅ (Wave1 للحديثة) | ❌ | ⚠️ | medical/records, medical-records/* | immutability/تصحيح، CDS | P1 |
| الأطباء/المحطة | Functional | ✅ | ✅ | ✅ | queue/next-patient | requireRole | ✅ | ❌ | ⚠️ | doctor/my-queue | worklist موحّد | P2 |
| التمريض | Functional | ✅ | ✅ | ✅ | vitals/assessments/care-plans | requireRole(nursing) | ✅ | ❌ | ✅ nursing_assessments | تكامل أجهزة | P2 |
| التنويم/ADT | Functional | ✅ | ✅ | ✅ | admit/transfer/discharge(txn) | requireTenantScope | ✅ | ❌ | ✅ inpatient_beds | لوحة إشغال بصرية | P2 |
| الطوارئ | Functional | ✅ | ✅ | ✅ | triage/acuity | requireTenantScope | ✅ (FORCE RLS) | ❌ | ✅ emergency | — | P2 |
| العمليات/OR | Functional | ✅ | ✅ | ✅ | preop/anesthesia | requireTenantScope | ✅ | ❌ | ✅ surgeries/surgery_or | WHO checklist | P2 |
| الصيدلية | Functional | ✅ | ✅ | ✅ | dispense/stock/queue/eMAR | requireRole/Scope | ✅ (FORCE RLS بعضها) | ❌ | ✅ pharmacy | محرك تفاعلات معتمد | P1 |
| المختبر | Functional | ✅ | ✅ | ✅ | order/result | requireAuth | ✅ (FORCE RLS) | ❌ | ✅ lab_radiology | اعتماد مزدوج، LIS | P1 |
| الأشعة | Partial | ✅ | ✅ | ✅ | order/upload | requireAuth | ✅ | ❌ | ✅ | PACS/DICOM فعلي | P1 |
| الفوترة | Functional | ✅ | ✅ | ✅ | pay/partial/refund/cancel | requireRole(invoices) | ✅ (FORCE RLS) | ❌ | ✅ financial_reports | — | P2 |
| التأمين | Partial | ✅ | ✅ | ✅ | claims سجلات فقط | requireRole(insurance) | ✅ | ❌ | ⚠️ | EDI/NPHIES، pre-auth | P1 |
| المحاسبة | Partial | ✅ | ✅ | ✅ | journal/accounts يدوي | requireRole(finance) | ✅ | ❌ | ⚠️ | محرك ترحيل آلي | P1 |
| المخازن | Functional | ✅ | ✅ | ✅ | items/issue/dept-req | requireAuth | ✅ | ❌ | ✅ inventory | تقييم/landed cost | P2 |
| المشتريات | Partial | ⚠️ | ⚠️ | جزئي | PO/GRN جزئي | requireAuth | جزئي | ❌ | ❌ | RFQ/3-way match | P1 |
| الموارد البشرية | Functional | ✅ | ✅ | ✅ | employees/salaries/leaves | requireRole(hr) | ✅ | ❌ | ⚠️ | payroll/عمولات متقدمة | P2 |
| الجودة والامتثال | Functional | ✅ | ✅ | ✅ | incidents/kpis/infection | requireAuth | ✅ (tenant_id) | ❌ | ⚠️ | CBAHI موثّق | P2 |
| التقارير والتحليلات | Functional | ✅ | ✅ | ✅ | dashboards/reports | requireTenantScope | ✅ | ❌ | ✅ dashboard | drill-down | P2 |
| **السجلات الطبية (حديثة)** | Functional | ✅ | ✅ | ✅ (tenant_id Wave1) | files/requests/coding | requireTenantScope (Wave1) | ✅ (كود؛ RLS غير منشور) | ❌ | ✅ modern_modules | RLS DDL (Wave2B) | P1 |
| الصيدلية السريرية/التأهيل/البوابة/التغذية | Functional | ✅ | ✅ | ✅ (Wave1) | reviews/sessions/portal | requireTenantScope (Wave1) | ✅ (كود) | ❌ | ✅ modern_modules | RLS DDL | P1 |
| الطب عن بعد/علم الأمراض/الخدمة الاجتماعية/الوفيات/ZATCA | Functional | ✅ | ✅ | ✅ | scoped (Wave2) | requireTenantScope (Wave2) | ✅ (منشور) | ❌ | ✅ wave2_modules | — | P2 |
| **بنك الدم/الموافقات/الباقات** | Partial | ✅ | ✅ | ⚠️ (لا tenant_id) | dispense/crossmatch | requireAuth فقط | ❌ (Class A معلّق) | ❌ | ❌ | tenant_id + RLS (Wave2B) | **P1** |
| SaaS / tenants | Partial | ⚠️ | ⚠️ | جزئي (tenants/facilities) | لا provisioning API | admin | بنية فقط | ❌ | ❌ | provisioning/خطط/فوترة | P1 |
| إعدادات النظام | Functional | ✅ | ✅ | ✅ | settings/users | requireRole(settings) | جزئي | ❌ | ⚠️ | — | P2 |
| الصلاحيات والأدوار | Functional | ✅ | ✅ | ✅ | ROLE_PERMISSIONS موديولية | requireRole | — | ❌ | ⚠️ | granular op-level | P1 |
| Facility type onboarding | **UI only** | ⚠️ (إخفاء قائمة) | ❌ | ❌ (لا نموذج) | ❌ | ❌ | ❌ | ❌ backend | ❌ | نموذج+إنفاذ كامل | **P1** |

## ملخص الحالات
- **Functional**: معظم الموديولات السريرية/المالية الأساسية (تعمل، معزولة على الأقل بالكود/الفلترة).
- **Partial**: EMR (immutability)، التأمين (EDI)، المحاسبة (ترحيل آلي)، المشتريات، SaaS، الأشعة (PACS).
- **Class A معلّق (عزل ناقص)**: بنك الدم، الموافقات، الباقات (P1، Wave2B بموافقة DDL).
- **UI only**: Facility type onboarding (إخفاء قائمة فقط، لا backend).
- **لا وحدة Complete** بالمعنى الصارم بسبب غياب facility entitlement على الـ backend + غياب CI/tests شاملة لبعضها.

`MODULES_INVENTORY_COMPLETE`
