# P2C — Smoke كامل للتطبيق على staging تحت دور التشغيل — تقرير

> المرحلة: `FULL_STAGING_APP_SMOKE_UNDER_RUNTIME_ROLE`. التاريخ: 2026-06-20.
> **staging فقط (127.0.0.1:5433).** لم يُغيَّر DB_USER الإنتاج · لا تفعيل ترحيل إنتاج · لا قيود إنتاج · لا نشر.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## الإعداد (Gates 1–3)
- أُنشئ `nama_medical_app` على staging (login=t, **super=f, bypassrls=f**) + المنح المرشّحة.
- طُبِّقت finance RLS (7 سياسات) + RLS القائمة (35) ⇒ 42 جدول مغطّى.
- الـ smoke نُفِّذ عبر اتصال `nama_medical_app` فقط (admin/postgres للتهيئة والتنظيف فقط — **لا يُستخدم superuser كدليل**).
- الأداة: `namaweb/staging_runtime_role_smoke.js` (admin pool للبذور/التنظيف، app pool للإثبات).

## مصفوفة التغطية والنتائج

| الوحدة/الجدول | نوع | تحت دور التشغيل | نتيجة |
|---|---|---|---|
| هوية الدور | — | super=f, bypassrls=f | ✅ |
| patients (RLS) | read | بلا سياق=0، t1=1، t2=1 | ✅ |
| appointments (RLS قائم) | read | 0/1/1 | ✅ |
| invoices (RLS) | read | 0/1/1 | ✅ |
| finance_journal_entries (RLS) | read | 0/1/1 | ✅ |
| finance_chart_of_accounts (RLS) | read | t1=30 (الصلاحية كافية) | ✅ |
| medical_records (**بلا RLS**) | read | بلا سياق يُرجع كل الصفوف | ⚠️ residual (فئة A backlog) |
| appointments | write | إدراج (t1, ctx1) ينجح | ✅ |
| invoices | write | إدراج عبر-المستأجر **مرفوض** (RLS) | ✅ |
| invoices | write | تحديث own-tenant ينجح (rows=1) | ✅ |
| posting engine | write | مُرحَّل، متوازن 115=115 | ✅ |
| posting idempotency | write | إعادة المحاولة idempotent (لا تكرار) | ✅ |
| posting fail-safe | write | mapping مفقود ⇒ MISSING_ACCOUNT_MAPPING | ✅ |

**النتيجة: 13 PASS | 0 FAIL | grant_gaps = 0.**

## Gate 7 — تحليل فجوات الصلاحيات
**لا فجوات صلاحيات (0).** كل القراءات/الكتابات/السلاسل/الترحيل عملت تحت الدور دون أي `permission denied`. المنح الحالية (DML على كل الجداول + USAGE/SELECT/UPDATE على السلاسل + EXECUTE على الدوال) كافية. لم يلزم تعديل `app_runtime_role_candidate.sql`. (المنح واسعة عمداً كتصميم انتقالي — موثّق.)

## Gate 8 — تصنيف تغطية RLS لـ72 جدولاً
انظر [P2C_TENANT_RLS_COVERAGE_CLASSIFICATION_AR.md](P2C_TENANT_RLS_COVERAGE_CLASSIFICATION_AR.md): A) يجب التفعيل (~41 PHI/HR/مالي) · B) فلترة تطبيق مؤقتاً (~22 تشغيلي) · C) مرجعي/إعدادات (~6) · D) تصميم خاص (~3). لم تُطبَّق RLS على أيٍّ منها.

## Gate 9 — إعادة بعد التصحيح
لا تصحيحات لازمة (0 فجوات). الدور بقي super=false/bypassrls=false. لا regressions.

## السلامة والتنظيف
DB_USER الإنتاج بقي `postgres` (لم يُمسّ) · لا RLS طُبِّقت على الإنتاج · الترحيل OFF · لا نشر · بروفة staging رُجِعت بالكامل (الدور محذوف، finance RLS down، بيانات الـ smoke محذوفة) · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف.

## القرار النهائي
```text
FINAL_STATUS: FULL_STAGING_APP_SMOKE_UNDER_RUNTIME_ROLE_PASS_PRODUCTION_SWITCH_PENDING_APPROVAL
SMOKE: 13 PASS / 0 FAIL | GRANT_GAPS: 0
RLS_ENFORCED_UNDER_ROLE: YES (reads isolated, cross-tenant writes rejected, posting balanced/idempotent/fail-safe)
RLS_COVERAGE: 42/114 tenant tables (72 classified, phased plan) — switch is a strict improvement, not a regression
PROD_DB_USER_CHANGED: NO | RLS_APPLIED_PROD: NO | POSTING_ENABLED: NO | DEPLOYED: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: approve production role+grants(+finance RLS) + DB_USER switch (P2B runbook) ; in parallel run RLS coverage phase A
```

## التتابع نحو go-live
1. (هذه المرحلة) smoke تحت الدور PASS ✅ + تصنيف التغطية ✅.
2. اعتماد تبديل الإنتاج لدور التشغيل (P2B runbook) — الاسترجاع فوري (إعادة DB_USER إلى postgres).
3. تفعيل RLS الفئة A (PHI/HR/مالي) بدفعات + بروفة.
4. refactor fail-closed (P2A plan).
5. go-live للترحيل المحاسبي (موافقة منفصلة).
