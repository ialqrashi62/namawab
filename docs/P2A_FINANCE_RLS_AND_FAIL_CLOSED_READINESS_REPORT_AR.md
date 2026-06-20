# P2A — جاهزية RLS المالية و fail-closed قبل go-live — تقرير

> المرحلة: `FINANCE_RLS_AND_FAIL_CLOSED_READINESS_BEFORE_GO_LIVE`. التاريخ: 2026-06-20.
> مرحلة جاهزية/أمان. **لم يُفعَّل ترحيل إنتاج · لا تشغيل على فواتير إنتاج · لا قيود إنتاج · لا نشر سلوك إنتاج.**
> أي تنفيذ كان على staging فقط (127.0.0.1:5433). فحص الإنتاج قراءة فقط.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 1 — تدقيق حالة RLS المالية
- جداول finance التسعة في staging والإنتاج: **RLS معطّلة (false/false)، لا سياسات**.
- يوجد **35 جدولاً غير مالي** عليها RLS بنمط: `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer`.
- جداول finance ذات tenant_id (أهداف RLS = 7): chart_of_accounts، journal_entries، journal_lines، vouchers، tax_declarations، doctor_commissions، posting_account_map. (cost_centers، fiscal_years بلا tenant_id ⇒ مؤجَّلة.)

## Gate 2 — تدقيق ربط سياق المستأجر
- يوجد غلاف مركزي `tenant_context_pg_session.withTenantTransaction(pool, ctx, handler)` يضبط `app.tenant_id` عبر `set_config(...,true)` (محلي للمعاملة).
- بعض المسارات تضبط `app.tenant_id` inline لتطبيق FORCE RLS.
- **خدمة الترحيل صُلّبت**: `postInTransaction(pool, ctx, fn)` تربط الآن `app.tenant_id`/`app.facility_id` (RLS-ready) إضافةً إلى الفلترة الصريحة بـ tenant_id.

## الاكتشاف الحاسم (شرط الإنفاذ)
الدور الوحيد الذي يتصل به التطبيق (`namaweb/.env` ⇒ `DB_USER=postgres`) هو **superuser + BYPASSRLS=true**. أدوار superuser/BYPASSRLS **تتجاوز RLS حتى مع FORCE**. ⇒ الـ35 سياسة القائمة (وأي سياسات finance) **لا تُنفَّذ على اتصال التطبيق الحالي**؛ العزل الفعلي يعتمد حالياً على الفلترة على مستوى التطبيق (`WHERE tenant_id`). يوجد في الإنتاج دور غير-superuser (`test_rls_user`) لكنه ليس ما يستخدمه التطبيق.
**النتيجة:** إنفاذ RLS المالية (وأي RLS) في الإنتاج يتطلب اتصال التطبيق بدور **غير superuser وغير BYPASSRLS** — تغيير اعتماد/بنية يحتاج موافقة منفصلة.

## Gate 3 — تصميم سياسات RLS المالية
ملفات مرشّحة (تحاكي نمط الـ35): [finance_rls_candidate_up.sql](accounting_candidates/finance_rls_candidate_up.sql) / [finance_rls_candidate_down.sql](accounting_candidates/finance_rls_candidate_down.sql).
لكل جدول من السبعة: `ENABLE` + `FORCE ROW LEVEL SECURITY` + سياسة `FOR ALL USING/WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id',true),'')::int)` — **fail-closed** (بلا سياق ⇒ لا صفوف؛ إدراج بمستأجر خاطئ ⇒ مرفوض).

## Gate 4 — بروفة RLS على staging (بدور غير-superuser) — PASS
أُنشئ دور `nama_staging_app` (super=false, bypassrls=false)، طُبِّقت السياسات (7)، أُدخلت بيانات مستأجرَين، ثم أُثبت **بالاتصال كدور التطبيق** (لا superuser):
| اختبار | نتيجة |
|---|---|
| بلا سياق ⇒ صفوف مرئية | **0** (fail-closed) ✅ |
| app.tenant_id=1 ⇒ يرى مستأجر 1 فقط | 1 ✅ |
| app.tenant_id=2 ⇒ يرى مستأجر 2 فقط | 1 ✅ |
| إدراج عبر-المستأجر (tenant=2 بينما السياق=1) | **مرفوض**: "new row violates row-level security policy" ✅ |
ثم رُجِع كل شيء (سياسات=0، RLS=0، بيانات الاختبار محذوفة، الدور محذوف) — staging نظيفة.

## Gate 5 — تصنيف سلوك fail-closed
- **الحالي (P2 wiring): pending-posting / partial-risk** — الفاتورة تُحفظ بـ autocommit ثم الترحيل في معاملة منفصلة غير حاجبة (try/catch). إن فشل الترحيل تبقى الفاتورة بلا قيد (idempotency يسمح بإعادة الترحيل، لكن لا outbox دائم بعد).
- **Option A (مُوصى): fail-closed صارم** — حفظ الفاتورة + الترحيل في معاملة واحدة (كلاهما يُثبَّت أو يُدحرَج).
- **Option B**: pending-posting **فقط** مع outbox دائم + عامل إعادة محاولة + لوحة تسوية + تنبيهات. (أثقل بنيةً.)
- القرار: **Option A** قبل التفعيل الإنتاجي (لا نختار B صامتاً).

## Gate 6 — إثبات نمط fail-closed على staging — PASS
عرض ذرّي (فاتورة + ترحيل في معاملة واحدة):
| اختبار | نتيجة |
|---|---|
| نجاح ذرّي: فاتورة+قيد متوازنان في معاملة واحدة | ✅ |
| فشل الترحيل ⇒ تدحرج المعاملة كلها (fail-closed) | ✅ |
| لا فاتورة يتيمة بعد الـ rollback | ✅ |
النمط مُثبَت؛ لكن **إعادة هيكلة المسارات الفعلية مطلوبة** (المسارات الحالية autocommit/pending-posting). الخطة: [P2A_FAIL_CLOSED_REFACTOR_PLAN_AR.md](P2A_FAIL_CLOSED_REFACTOR_PLAN_AR.md).

## Gate 7 — الاختبارات
- محرك نقي: **28/28**. تكامل staging (`staging_posting_validation.js`): **18/18** (بعد تصلّب RLS-ready). بروفة RLS: **4/4**. عرض fail-closed: **3/3**. flag افتراضي OFF (`isEnabled()=false`). build (`node --check`) للخدمة وserver.js: OK.

## Gate 8 — preflight الإنتاج (read-only، بلا تفعيل)
- prod `nama_medical_web`@5432: finance RLS=0/سياسات=0، الصفوف entries=0/lines=0/coa=30/map=23 (الأساس سليم، لا ترحيل).
- 35 جدول RLS غير-مالي قائم. الأدوار: `postgres`(super,bypassrls) و`test_rls_user`(non-super,non-bypass). التطبيق يتصل كـ postgres.
- علم الترحيل الإنتاجي: **OFF**.

## القرار النهائي
```text
FINAL_STATUS: FINANCE_RLS_READY_FAIL_CLOSED_REFACTOR_REQUIRED
FINANCE_RLS: DESIGNED + STAGING_PROVEN (enforces under non-superuser) + candidate up/down ready + prod runbook ready
RLS_ENFORCEMENT_PREREQUISITE: production app must connect via a NON-superuser, NON-BYPASSRLS role (currently postgres) — separate approval
FAIL_CLOSED: pattern PROVEN on staging; route refactor REQUIRED (Option A) before go-live
PROD_POSTING_ENABLED: NO | PROD_JOURNALS: NO | DEPLOYED: NO | RLS_APPLIED_PROD: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: (1) approve non-superuser app role + finance RLS prod apply ; (2) approve fail-closed refactor ; then go-live approval
```

## المخرجات المرافقة
- [finance_rls_candidate_up.sql](accounting_candidates/finance_rls_candidate_up.sql) / [down](accounting_candidates/finance_rls_candidate_down.sql)
- [P2A_FINANCE_RLS_PRODUCTION_RUNBOOK_AR.md](P2A_FINANCE_RLS_PRODUCTION_RUNBOOK_AR.md)
- [P2A_FAIL_CLOSED_REFACTOR_PLAN_AR.md](P2A_FAIL_CLOSED_REFACTOR_PLAN_AR.md)
- كود (namaweb فرع `feature/accounting-posting-wiring-staging`): تصلّب `accounting_posting_service.js` (bindTenant + postInTransaction RLS-ready) + توقيع الهوكات.
