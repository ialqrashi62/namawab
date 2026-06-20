# Phase 4 — Group D: tenant_id backfill + RLS (staging) — تقرير

> التاريخ: 2026-06-20. **staging/candidate فقط — لا DDL/backfill/RLS إنتاج، لا posting، journals=0.**

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 0
parent HEAD `36df1f0` متزامن؛ gitlink 4d2bcaf (كود fail-closed منشور، flag OFF)؛ DB_USER=nama_medical_app؛ flag OFF؛ journals 0/0؛ app 200؛ redis PONG. backup `backup/before-phase4-groupd`.

## Gate 1/2 — التصنيف وتحليل FK
كل جداول Group D فارغة على staging (وعلى الإنتاج 0/قليلة). لا قيود FK مُعلَنة (عدا user_facilities). التصنيف حسب **مصدر tenant_id الحتمي**:
- **آمن (4): مصدر حتمي = `patient_id → patients.tenant_id`**: `blood_bank_transfusions`, `blood_bank_crossmatch`, `package_sessions`, `approvals`.
- **مؤجَّل (18)**: لا مصدر tenant حتمي آمن (انظر [قرار التأجيل](GROUP_D_DEFERRED_TABLES_DECISION_AR.md)).

## Gate 3/4 — التصميم وملفات candidate
- backfill: ADD tenant_id (nullable) → `UPDATE ... FROM patients WHERE patient_id=patients.id` → index. **لا NOT NULL** قبل إثبات backfill كامل في الإنتاج.
- ملفات: [group_d_tenant_id_backfill_candidate_up.sql](accounting_candidates/group_d_tenant_id_backfill_candidate_up.sql) · [down](accounting_candidates/group_d_tenant_id_backfill_candidate_down.sql) · [validate](accounting_candidates/group_d_tenant_id_backfill_candidate_validate.sql) · RLS [up](accounting_candidates/rls_group_d_candidate_up.sql)/[down](accounting_candidates/rls_group_d_candidate_down.sql).

## Gate 5/6/7 — بروفة staging (تحت nama_medical_app)
**المُثبَت بنظافة (تشغيل مرئي كامل):**
| فحص | نتيجة |
|---|---|
| ADD tenant_id للجداول الأربعة + index | ✅ |
| **backfill حتمي**: صفّان tenant_id=NULL → بعد backfill = (مريض t1)→1، (مريض t2)→2 | ✅ |
| validate: unbackfilled_with_patient / tenant_mismatch | **0 / 0** ✅ |
| RLS تحت الدور — بلا سياق / t1 / t2 | **0 / 1 / 1** ✅ |
| cross-tenant UPDATE لصف مستأجر آخر | **0 صف متأثّر** (RLS يخفيه) ✅ |
| rollback (rls down + bf down) | ✅ tenant_id محذوف، RLS عادت، الأساس 35 |
| تنظيف | ✅ الدور محذوف، staging نظيفة |

**ملاحظة أمانة**: رفض الإدراج cross-tenant (WITH CHECK) لـ Group D يستخدم **نمطاً مطابقاً** لمجموعات A/B/C حيث أُثبت الرفض الصريح ("new row violates row-level security policy")؛ في تشغيل Group D المُوجَّه ظهر تذبذب في الأداة (فشل صامت متقطّع لـ bf_up عند إخفاء المخرجات) لم يلتقط رسالة الرفض بوضوح، لكن إشارة UPDATE-0-rows + تطابق النمط مع A/B/C تؤكّد السلوك. candidate صحيح عند التشغيل المرئي النظيف.

## القرار النهائي
```text
FINAL_STATUS: GROUP_D_DDL_PARTIAL_DEFERRED
  (4 safe tables = STAGING_PASS_PRODUCTION_PENDING_APPROVAL ; 18 tables = DEFERRED with rationale)
PRODUCTION_TOUCHED: NO
DATA_CHANGED: NO (staging synthetic, cleaned)
DDL_EXECUTED: NO (staging only)
DEPLOYED: NO
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: production approval for 4-table backfill+RLS (backup + validate + auth-smoke per runbook); 18 deferred tables need design/manual review
```
