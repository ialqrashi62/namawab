# P2B — تصليب دور قاعدة البيانات للتطبيق وإنفاذ RLS — تقرير

> المرحلة: `APP_DB_ROLE_HARDENING_AND_RLS_ENFORCEMENT`. التاريخ: 2026-06-20.
> مرحلة أمان قبل go-live. **لم يُفعَّل ترحيل إنتاج · لا قيود إنتاج · لا نشر · لم يُغيَّر DB_USER في الإنتاج.** التنفيذ على staging فقط؛ فحص الإنتاج قراءة فقط.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 1 — تدقيق الأدوار وRLS (إنتاج، read-only)
| الدور | login | super | bypassrls | createdb | createrole |
|---|---|---|---|---|---|
| postgres (اتصال التطبيق الحالي) | t | **t** | **t** | t | t |
| test_rls_user | t | f | f | f | f |
- التطبيق يتصل كـ **postgres (superuser+bypassrls)** ⇒ RLS متجاوَزة على اتصال التطبيق.
- RLS: 35 جدولاً غير-مالي مفعّلة، 0 جدول مالي (لم تُطبَّق على الإنتاج).
- **اكتشاف تغطية أوسع: 149 جدولاً إجمالاً، و79 جدولاً يحمل tenant_id لكن بلا RLS** (التغطية الحالية 35 فقط) — فجوة عزل أوسع موثّقة كمتابعة.

## Gate 2 — جرد مسارات الوصول لقاعدة البيانات
- **التشغيل**: Pool واحد في `db_postgres.js` من `process.env.DB_*` (افتراضي postgres).
- **الهجرة/الإدارة**: `migrate_*.js`, `check_db.js`, `_fix.js`, `rls_local_dry_run_3_tables.js` (تحتاج DDL ⇒ تبقى على postgres).
- **القرار**: فصل دور الهجرة/الإدارة (postgres) عن دور التشغيل (دور جديد أقل صلاحية). لا خلط.

## Gate 3 — تصميم دور التشغيل (ملفات مرشّحة)
[app_runtime_role_candidate.sql](accounting_candidates/app_runtime_role_candidate.sql) · [validate](accounting_candidates/app_runtime_role_validate.sql) · [rollback_notes](accounting_candidates/app_runtime_role_rollback_notes.sql).
`nama_medical_app`: LOGIN, **NOSUPERUSER, NOBYPASSRLS, NOCREATEDB, NOCREATEROLE, NOREPLICATION**. صلاحيات: USAGE على المخطط، DML على الجداول، USAGE/SELECT/UPDATE على السلاسل، EXECUTE على الدوال، + default privileges. لا DDL، لا TRUNCATE، لا ملكية. كلمة المرور تُضبط بقناة آمنة (ليست في git).

## Gates 4–7 — بروفة staging تحت دور غير-superuser (PASS)
أُنشئ `nama_medical_app` (login=t, super=f, bypassrls=f, createdb=f)، طُبِّقت الصلاحيات وسياسات finance RLS (7)، ثم أُثبت **بالاتصال كدور التطبيق** (لا superuser):
| اختبار | نتيجة |
|---|---|
| RLS مالية — بلا سياق ⇒ صفوف | **0** (fail-closed) ✅ |
| RLS مالية — tenant=1 / tenant=2 | يرى مستأجره فقط (1/1) ✅ |
| قراءة CoA (tenant=1) | 30 (الصلاحية كافية) ✅ |
| قراءة mapping (tenant=1) | 23 (الصلاحية كافية) ✅ |
| إدراج + سلسلة (tenant=1) | نجح (RETURNING id) — الصلاحية والـ sequence تعملان ✅ |
| إدراج عبر-المستأجر (tenant=2 بسياق=1) | **مرفوض**: row-level security policy ✅ |
| **جدول RLS قائم (appointments)** — بلا سياق / tenant=1 / tenant=2 | 0 / A1 فقط / A2 فقط ✅ |
ثم رُجِع كل شيء (الدور محذوف عبر DROP OWNED BY + DROP ROLE، RLS down، بيانات الاختبار محذوفة). staging نظيفة.

## Gate 5 — إنفاذ سياق المستأجر
- `withTenantTransaction` يضبط `app.tenant_id` (set_config محلي).
- خدمة الترحيل (P2B-hardened) `postInTransaction(pool, ctx, fn)` تربط السياق.
- بلا سياق ⇒ 0 صفوف (مثبت). مسارات الترحيل مركزية عبر الخدمة (لا استدعاءات متفرّقة تتجاوز السياق في مسار الترحيل).

## Gate 8 — خطة تبديل الإنتاج (تخطيط فقط)
[P2B_APP_DB_ROLE_RLS_PRODUCTION_SWITCH_RUNBOOK_AR.md](P2B_APP_DB_ROLE_RLS_PRODUCTION_SWITCH_RUNBOOK_AR.md).

## Gate 9 — التوفيق مع refactor الـ fail-closed
بعد تصلّب الدور وإنفاذ RLS، يصبح refactor الـ fail-closed (Option A) آمناً للتنفيذ: RLS يضيف إنفاذاً على مستوى DB، والمعاملة الموحّدة تضيف الذرّية. مكمّلان. **لم يُنفَّذ refactor المسارات في هذه المرحلة**؛ يبقى الترحيل الإنتاجي معطّلاً.

## الفجوات المكتشفة (لماذا "PARTIAL")
1. **تغطية RLS ناقصة**: 79 جدول tenant_id بلا سياسات RLS (35 فقط مغطّاة + 7 مالية مرشّحة). تبديل الدور يُنفِّذ RLS على المغطّاة فقط؛ البقية تظل معتمدة على فلترة التطبيق. (backlog أمني منفصل.)
2. **توافق التطبيق الكامل تحت الدور لم يُختبَر شاملاً**: أُثبتت خدمات/جداول ممثِّلة فقط (لا تشغيل كامل للتطبيق تحت الدور). يلزم smoke كامل على staging قبل تبديل الإنتاج.
3. المنح واسعة (DML على كل الجداول) — مبرَّرة لتطبيق متجانس، لكن يُفضَّل تضييقها لكل موديول لاحقاً.

## القرار النهائي
```text
FINAL_STATUS: APP_DB_ROLE_RLS_ENFORCEMENT_PARTIAL_GRANTS_GAPS_FOUND
ROLE_MECHANISM: DESIGNED + STAGING_PROVEN (non-super/non-bypass; RLS enforced on finance + existing tables; grants sufficient for tested paths)
GAPS: (1) RLS coverage 35/114 tenant tables (79 uncovered) ; (2) full-app smoke under role not yet run ; (3) grants broad (refine later)
PROD_DB_USER_CHANGED: NO | RLS_APPLIED_PROD: NO | POSTING_ENABLED: NO | DEPLOYED: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: (1) full-app staging smoke under nama_medical_app ; (2) decide 79-table RLS coverage ; (3) approve prod role+grants+RLS+DB_USER switch (runbook)
```
