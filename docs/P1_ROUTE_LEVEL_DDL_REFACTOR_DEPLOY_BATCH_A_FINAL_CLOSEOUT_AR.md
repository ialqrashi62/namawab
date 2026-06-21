# P1 — نشر Batch A لإزالة DDL المسارات — إغلاق (متوقّف عند Gate 1: سلامة RLS)

> المرحلة: `P1_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY_BATCH_A` | التاريخ: 2026-06-21 | **توقّف إلزامي عند Gate 1** — لم يُنفَّذ أي DDL ولا نشر.

## لماذا التوقّف (Gate 1)
التوجيه يفرض في Gate 1: «يجب أن يثبت أن SQL ... يضيف tenant_id/RLS/FORCE/policies where required. **إذا لا يحقق tenant/RLS safety، توقف**». المراجعة أثبتت أن `route_level_ddl_cleanup_candidate_up.sql` **لا يحقق ذلك**:
- يحتوي **0** عبارات `ENABLE/FORCE ROW LEVEL SECURITY` أو `CREATE POLICY` أو `tenant_id DEFAULT`.
- جداول Batch A الحاملة لـtenant_id وبيانات PHI — **obgyn_pregnancies, obgyn_deliveries, referrals, medical_reports** — كان سيُنشئها **بلا RLS**، بينما كل جدول PHI نظير قائم (`patients`, `medical_records`) هو **FORCE RLS + policy**.
- **visit_lifecycle** لا يملك `tenant_id` إطلاقاً (مساراته تُرشّح بالتاريخ/الطبيب لا المستأجر) ⇒ **رؤية بيانات مرضى عابرة للمستأجرين** (patient_name).

⇒ تنفيذ هذا الـSQL كان سيُنشئ جداول PHI **بلا عزل صفّي** تحت الدور المقيَّد — يناقض حملة RLS بأكملها. لذا **أوقفت قبل أي DDL** (لا أُنشئ جداول PHI غير معزولة).

## تصحيح نطاق
«13 جدولاً مفقوداً» في الحالة المعتمدة كان إجمالي A+B. **Batch A فعلياً = 6 جداول** (obgyn_pregnancies, obgyn_deliveries, referrals, medical_reports, visit_lifecycle, cash_drawer) — هي وحدها التي أُزيل DDLها من الكود (bf5497c). الباقي (7) = Batch B (DDLها ما زال في الكود ⇒ إنشاؤها بلا فائدة + خارج النطاق).

## المُعالجة المُقترحة (candidate جاهز، غير مُنفَّذ)
`docs/sql/route_level_ddl_batch_a_rls_safe_candidate_{up,validate}.sql`:
- ينشئ **6 جداول Batch A فقط** (لا توسّع لـBatch B).
- الجداول الخمسة الحاملة لـPHI/مستأجر (obgyn×2, referrals, medical_reports, **+ visit_lifecycle بإضافة tenant_id**): `tenant_id DEFAULT` + `ENABLE/FORCE ROW LEVEL SECURITY` + سياسة `rls_<t>_tenant_isolation` بنفس نمط patients/medical_records (`tenant_id = (NULLIF(current_setting('app.tenant_id',true),''))::integer`). تعمل مع الربط القائم (INSERT يُختَم عبر DEFAULT، SELECT/UPDATE يُرشّح عبر policy) — **بلا تعديل كود**.
- **cash_drawer**: يُنشأ كما هو (معزول بـuser_id العالمي الفريد عبر `WHERE user_id=session_user` — لا يحتاج tenant RLS).
- لا seed، لا backfill، لا GRANT، لا تغيير دور، لا accounting.
- validate: الجداول موجودة + FORCE RLS + سياسات + DEFAULT + 0 صفوف + الدور غير-super.

> ملاحظة قرار: إضافة `tenant_id`+RLS إلى visit_lifecycle تحسين عزل (التصميم الأصلي بلا عزل مستأجر). البديل: إنشاؤه كما هو (عزل app-layer بالتاريخ/الطبيب فقط). **موصى: النسخة المعزولة**.

## الحقول
```text
FINAL_STATUS: BLOCKED_AT_GATE1_TENANT_RLS_SAFETY (لم يُنفَّذ DDL/نشر — توقّف أمان إلزامي)
SELECTED_PHASE: P1_ROUTE_LEVEL_DDL_REFACTOR_DEPLOY_BATCH_A
DB_ROLE_CURRENT: nama_medical_app (super=false, bypassrls=false ؛ بلا تغيير)
APP_PATH_TENANT_BINDING: PASS (آخر إثبات Phase 163/164)
BATCH_A_TABLES_CREATED: 0 (لم يُنفَّذ)
BATCH_A_TABLE_COUNT_ACTUAL: 6 (تصحيح: «13» كان A+B)
SQL_EXECUTED: NO
SQL_VALIDATE_RESULT: N/A (لم يُنفَّذ)
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
DATA_SEEDED: NO
GRANT_EXECUTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
ROLLBACK_READY: YES (لا شيء نُفِّذ)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
HEALTH (current, unchanged): 200 ؛ pm2 online restarts=34
NEXT_REQUIRED_ACTION: APPROVE_RLS_SAFE_BATCH_A_SQL_THEN_DEPLOY
```

## القرار المطلوب منك
الموافقة على تشغيل **`route_level_ddl_batch_a_rls_safe_candidate_up.sql`** (بديل آمن RLS، Batch A فقط) بدل المرشّح الأصلي، ثم: validate → نشر bf5497c → restart → تحقق المسارات. أو توجيه بديل (مثل إنشاء visit_lifecycle بلا عزل، أو تأجيله).

## صيغة الإغلاق
```text
STATUS: BLOCKED_AT_GATE1 — UNSAFE_CANDIDATE_NOT_EXECUTED; RLS_SAFE_CANDIDATE_PREPARED
SCOPE: Batch A deploy — halted at mandatory tenant/RLS safety gate
PRODUCTION_READY: NO (لم يُنشر؛ ينتظر موافقة على المرشّح الآمن)
P0_OPEN: NO | P1_OPEN: YES (نشر Batch A بأمان RLS)
GIT_COMMITTED: YES (RLS-safe candidate + closeout + memory ؛ docs فقط)
GIT_PUSHED: YES (بلا force)
NEXT_RECOMMENDED_PHASE: APPROVE_RLS_SAFE_BATCH_A_SQL_THEN_DEPLOY
```

توقّفت عند بوابة سلامة المستأجر/RLS قبل تنفيذ أي DDL؛ المرشّح الأصلي كان سينشئ جداول PHI بلا عزل، وجُهِّز مرشّح آمن بديل ينتظر الموافقة
