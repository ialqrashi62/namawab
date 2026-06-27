# P3 — توسعة RLS: المجموعة A (staging rehearsal) — تقرير

> Workstream 1 / Group A. التاريخ: 2026-06-20. **staging فقط.**
> الترحيل المحاسبي معطّل؛ لا قيود إنتاج؛ لم تُطبَّق RLS على الإنتاج في هذه المرحلة.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Global Gate 0
HEAD=`5aef09d` متزامن؛ gitlink e6608ba؛ DB_USER=nama_medical_app؛ flag OFF؛ app health 200؛ redis PONG؛ pm2 online؛ RLS الإنتاج=42؛ journals=0. backup `backup/before-ws1-groupA-rls`.

## اكتشاف معماري حاسم (يحدّد الأمان)
آلية ربط المستأجر: `server.js` middleware عام يضع سياق الطلب في **AsyncLocalStorage** (`tenantStore.run`)، و**`pool.query` مُغلّف في db_postgres.js** (سطر 32–42): عند وجود سياق، يحجز اتصالاً ويضبط `app.tenant_id` (set_config) قبل الاستعلام ثم يعيد ضبطه. ⇒ كل `pool.query` داخل طلب ذي سياق يربط tenant تلقائياً (المسارات لا تحتاج set_config يدوي). هذا هو نفسه ما يشغّل الـ42 جدولاً المُفعَّلة حالياً في الإنتاج بنجاح ⇒ **RLS على المجموعة A آمن معمارياً بالنمط نفسه.**
- طلب بلا سياق (مجهول/بلا مستأجر) ⇒ لا يُضبط app.tenant_id ⇒ RLS تُرجع 0 صفوف (fail-closed)؛ والمسارات المحمية ترجع 401 قبل الاستعلام أصلاً.

## المجموعة A — التصنيف والتحقق
40 جدولاً (PHI/سريري/HR/تأمين/مالي-ZATCA)، **كلها موجودة وتحمل tenant_id** (تحقّق على staging). القائمة الكاملة في [rls_groupA_candidate_up.sql](accounting_candidates/rls_groupA_candidate_up.sql).

## بروفة staging — PASS
| فحص | نتيجة |
|---|---|
| تطبيق up | COMMIT |
| validate: rls_enabled+FORCE | **40** |
| validate: policies | **40** |
| validate: missing tenant_id | **0** |
| الدور المستخدم | nama_medical_app (super=false, bypassrls=false) |
| medical_records بلا سياق | 0 (fail-closed) |
| medical_records tenant=1 / tenant=2 | 1 / 1 (عزل) |
| إدراج عبر-المستأجر | **مرفوض** (row-level security policy) |
| hr_salaries بلا سياق | 0 (HR حسّاس مُنفَّذ) |
| rollback (down) | RLS عادت 0؛ الأساس 35 |
| تنظيف | الدور محذوف، staging نظيفة |

## ملفات candidate
[rls_groupA_candidate_up.sql](accounting_candidates/rls_groupA_candidate_up.sql) · [down](accounting_candidates/rls_groupA_candidate_down.sql) · [validate](accounting_candidates/rls_groupA_candidate_validate.sql). runbook: [P3_RLS_GROUPA_PRODUCTION_RUNBOOK_AR.md](P3_RLS_GROUPA_PRODUCTION_RUNBOOK_AR.md).

## لماذا التوقف قبل الإنتاج (PENDING)
وفق قاعدة الأوتوبايلوت "توقّف قبل الإنتاج إذا لم يُشغَّل اختبار مطلوب": لا أملك بيانات اعتماد إنتاج لتشغيل **smoke مُصادَق على مسارات المجموعة A** (إثبات أن المسارات تُرجع بيانات المستأجر الصحيحة لا 0 تحت RLS). رغم أن المعمار (pool المغلّف) يجعل الكسر مستبعداً (مُثبت على 42 جدولاً حياً)، فإن غياب هذا الاختبار يجعل النشر الإنتاجي بحاجة موافقة/خطوة مشغّل. لذا: **staging PASS، الإنتاج PENDING**.

## القرار النهائي
```text
FINAL_STATUS: RLS_GROUP_A_STAGING_PASS_PRODUCTION_PENDING_APPROVAL
PRODUCTION_TOUCHED: NO
DATA_CHANGED: NO
DDL_EXECUTED: NO (staging only)
DEPLOYED: NO
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: operator-run authenticated HTTP smoke on Group A routes (or explicit risk-accept based on wrapped-pool arch already live on 42 tables) → then controlled prod batches per runbook (backup + validate + smoke per batch)
```
