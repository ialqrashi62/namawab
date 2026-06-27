# Phase 2 — نشر RLS الإنتاجي (المجموعات A/B/C/D4) — تقرير

> التاريخ: 2026-06-20. **نشر RLS على الإنتاج بموافقة + قبول مخاطرة صريح** (البرومبت المعتمد). posting OFF، journals=0/0.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## قبول المخاطرة المُسجَّل
نُفِّذ نشر RLS الإنتاجي بلا smoke مُصادَق، اعتماداً على (كما صرّح البرومبت): staging PASS لكل مجموعة · إثبات الـ42 جدولاً الحيّة سابقاً · دور nama_medical_app غير-superuser · ربط tenant عبر pool المغلّف (AsyncLocalStorage) · rollback مُتحقَّق (down.sql) · تحقّق لكل دفعة · backup قبل البدء · خطة استرجاع فورية.

## Gate 0 + backup
parent `af23024`؛ DB_USER=nama_medical_app (super=false/bypassrls=false)؛ flag OFF؛ health 200؛ redis PONG؛ pm2 online؛ journals 0/0؛ RLS=42 قبل. **backup**: `C:/Users/ice/nama_prod_backups/pre_rls_rollout_<ts>.dump` (571KB، 503 كائناً).

## الدفعات (كل دفعة: apply → validate → app-pool read under context → health)
| الدفعة | المجموعة | RLS قبل→بعد | تحقّق app-pool (تحت السياق، لا خطأ) |
|---|---|---|---|
| A | 40 (PHI/HR/مالي) | 42→82 | medical_records/hr_employees: no-ctx=0، ctx1=0 ✅ |
| B | 23 (تشغيلي) | 82→105 | inventory_items/pharmacy_suppliers: ctx OK ✅ |
| D4 | 4 (backfill من patients ثم RLS) | 105→109 | backfill validate 0/0/0 + 4 indexes؛ approvals ctx OK ✅ |
| C | 6 (global-aware) | 109→**115** | **حارس الاستحقاق محفوظ**: company_settings(ctx1)=8، pharmacy_drug_catalog=90، no-ctx=0 ✅ |

**إجمالي RLS الإنتاجي: 42 → 115 جدولاً** (+73).

## التحقق الأمني
- **عزل**: كل جدول جديد no-context=0 تحت دور التطبيق (fail-closed).
- **لا كسر مسارات**: قراءات app-pool لكل دفعة تحت سياق المستأجر بلا أخطاء صلاحية/RLS؛ health 200 بعد كل دفعة؛ المسارات المحمية 401.
- **حارس استحقاق المنشأة محفوظ** (Batch C global-aware): قراءة company_settings تحت السياق تُرجع صفوف المستأجر (8) لا 0.
- **لا تسريب، لا regression، journals 0/0، posting OFF** طوال العملية.
- pm2 errors المرصودة = إدخالات Redis-reconnect قديمة (اختبارات مرونة سابقة)، لا علاقة لها بـ RLS.

## الاسترجاع (جاهز لكل مجموعة)
`rls_groupA_candidate_down.sql` · `rls_group_B_candidate_down.sql` · `rls_group_C_candidate_down.sql` · `rls_group_d_candidate_down.sql` (+ `group_d_tenant_id_backfill_candidate_down.sql`) · أو إعادة DB_USER=postgres مؤقتاً · أو backup restore `pre_rls_rollout_<ts>.dump`.

## المتبقّي
- **Group D-18**: مؤجَّلة (قرارات عمل) — لم تُمسّ.
- cost_centers/fiscal_years: بلا tenant_id (مؤجَّلة).

## الحالة النهائية
```text
FINAL_STATUS: RLS_PRODUCTION_A_B_C_D4_PASS (GROUP_D18 deferred)
PRODUCTION_TOUCHED: YES (RLS DDL on 73 tables + D4 tenant_id backfill)
DATA_CHANGED: NO business data (D4 backfill = 0 rows in prod; RLS = metadata only)
DDL_EXECUTED: YES (ENABLE/FORCE RLS + policies + D4 ADD tenant_id/index)
DEPLOYED: NO (code)
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO (0/0)
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: Phase 5 security deltas ; Group D-18 business decisions ; Phase 8 controlled go-live
```
