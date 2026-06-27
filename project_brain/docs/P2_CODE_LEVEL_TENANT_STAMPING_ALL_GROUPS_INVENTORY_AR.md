# PHASE 2 — جرد ختم tenant_id (code-level) لكل المجموعات (مطابَق مع RLS الفعلي)

> البرنامج: MASTER_AUTOPILOT RLS hardening — PHASE 2 | 2026-06-21 | تركيب من تدقيقَي PHASE 3 (RLS الحي) + PHASE 4 (مسارات/RBAC) بعد المطابقة.

## المبدأ
الختم على مستوى الكود = دفاع-في-العمق **فوق** عزل DB. الحالة الفعلية: **125 جدول FORCE RLS** (PHASE 3) ⇒ على هذه الجداول، الـINSERT يُختَم تلقائياً عبر `tenant_id DEFAULT = app.tenant_id` والـSELECT/UPDATE يُرشَّح عبر policy (مُثبَت على patients/referrals: ختم=1، تزوير=42501، fail-closed). فالختم الكودي عليها **تحسين** لا إصلاح حرج.

## التصنيف (مطابَق)
| الفئة | الحالة | الإجراء |
|---|---|---|
| **125 جدول FORCE RLS** (patients, invoices, medical_records, blood_bank_*, obgyn_*, rehab_*, hr_employees, audit_trail, …) | محميّ DB-level؛ الختم الكودي موجود في مسارات النواة (PHASE 4 SAFE) | تحسين دفاع-في-العمق فقط (أولوية منخفضة) |
| **system_users** (لا tenant_id/RLS — جدول تعريف التعدّدية) | **🔴 P0**: `PUT /api/settings/users/:id` (server.js:1435) بلا `requireRole` ⇒ أي مستخدم مصادَق يعدّل أي مستخدم / يرفع نفسه Admin / يعيد كلمات مرور | **إصلاح كود P0**: إضافة `requireRole('admin'/superadmin)` (لا يحميه RLS) |
| **14 جدول tenant-sensitive بلا RLS** (finance_cost_centers, finance_fiscal_years, discount_rules, insurance_companies, insurance_contracts, employees[رواتب], branches, departments, form_templates, cme_activities, cme_registrations, cssd_instrument_sets, cssd_load_items, cssd_sterilization_cycles) | app-layer فقط؛ مساراتها (finance/HR/insurance) قد تفتقر فلتر tenant ⇒ **خطر cross-tenant حقيقي** | **مرشّح RLS DDL** (tenant_id + FORCE + policy + DEFAULT) **+ ختم/فلتر app-layer**. بعضها فيه بيانات (employees=3 صفوف) ⇒ **backfill tenant_id يحتاج موافقة** |
| جداول route-created غير موجودة (dietary_plans, patient_consents, Batch B) | مساراتها تُرجِع 42P01 | PHASE 1 (route-DDL) + RLS-safe SQL |
| ختم من body/query | **لا شيء** — كل المسارات المعزولة تشتق tenant من الجلسة عبر `getRequestTenantContext` (PHASE 4) ✓ | لا إجراء (سليم) |

## المخرجات المطلوبة (candidates، غير منشورة)
1. **P0 code**: حارس دور على `PUT /api/settings/users/:id` (+ مراجعة `/api/settings/users` الأخرى) — أعلى أولوية، RLS لا يحميه.
2. **14-table RLS candidate** (`P3` follow-up): tenant_id + FORCE RLS + policy + DEFAULT للـ14 جدولاً — على نمط Batch A/B. **عائق**: الجداول المملوءة (employees…) تحتاج **backfill tenant_id** ⇒ `BLOCKED_PENDING_DATA_CHANGE_APPROVAL`.
3. **app-layer tenant filters** على مسارات finance/HR/insurance التي تلمس الـ14 جدولاً (دفعات A_critical/B/C).
4. باقي مسارات PHASE 4 على جداول FORCE RLS: تحسين دفاع-في-العمق (فلتر صريح + 404 صحيح + role) — أولوية أقل.

## الحالة
```text
FINAL_STATUS: CODE_LEVEL_TENANT_STAMPING_ALL_GROUPS_INVENTORY_DONE — CANDIDATES_SCOPED_NOT_DEPLOYED
TOP_PRIORITY: P0 system_users role guard (PUT /api/settings/users/:id) — لا يحميه RLS
NEXT_REQUIRED_ACTION: APPROVE_SYSTEM_USERS_ROLE_GUARD_FIX + APPROVE_14_TABLE_RLS_DDL (مع backfill ⇒ DATA_CHANGE_APPROVAL)
```
