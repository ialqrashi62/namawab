# P1 — جاهزية audit_trail (RLS) وضبط app.tenant_id قبل تبديل دور RLS (Final Closeout)

> المرحلة: `P1_AUDIT_TRAIL_RLS_POLICY_AND_TENANT_CONTEXT_SWITCH_READINESS` | التاريخ: 2026-06-21 | read-only audit + SQL candidate (مُختبَر على DB معزول). لا تنفيذ على الإنتاج.

## Gate 1 — جرد audit_trail
```text
columns(13): id!, user_id, username, action, module, record_id, old_values, new_values, ip_address, created_at, tenant_id, user_name, details
RLS: ENABLED + FORCE ; policy: rls_audit_trail_tenant_isolation (FOR ALL, USING+WITH CHECK tenant_id=app.tenant_id)
rows: tenant_id=1 → 44 ; tenant_id NULL → 0 ; indexes: pkey, idx_audit_trail_tenant ; FKs: none
```
| Check | Result | Risk Under nama_medical_app | Required Action |
| --- | --- | --- | --- |
| logAudit يُدرج بدون tenant_id (=>NULL) | صحيح | **INSERT مرفوض (42501)** بأي سياق ⇒ فقدان تدقيق صامت (catch يبتلع) | سياسة write-always |
| السياسة الحالية FOR ALL صارمة | صحيح | تمنع كل كتابة تدقيق + تحجب قراءة super-admin | فصل INSERT/SELECT |
| الدور الحالي postgres | superuser | يتجاوز RLS الآن (لا أثر فعلي بعد) | — |
| الدور المستقبلي nama_medical_app | NOSUPERUSER/NOBYPASSRLS | سيُنفِّذ السياسة فعلياً | جاهزية قبل التبديل |

## Gate 2 — مخطط نداءات logAudit (~70 نداءً)
| الفئة | أمثلة | بعد التبديل (سياسة صارمة) | بعد التبديل (candidate) |
| --- | --- | --- | --- |
| TENANT_AWARE (غالبية) | CREATE_PATIENT(517)، CREATE_INVOICE(747)، REFUND(6546)، DISPENSE، ... | **يفشل** (NULL≠tid) | **ينجح** (NULL مسموح؛ ومختوم لو أُضيف الختم) |
| AUTH_LOGIN_OR_SESSION | LOGIN(392) | **يفشل** (لا سياق، NULL) | **ينجح** (نظامي NULL مسموح) |
| SYSTEM_GLOBAL/ADMIN | DATABASE_BACKUP(7114)، CHANGE_PASSWORD(7006) | **يفشل** | **ينجح** |
الخلاصة: helper موحّد fire-and-forget يبتلع الخطأ ⇒ تحت السياسة الصارمة **كل التدقيق يتوقف بصمت** بعد التبديل. الـcandidate يجعل كل الفئات تنجح.

## Gate 3 — Precheck ربط app.tenant_id (النتيجة: PASS — الآلية موجودة ومنشورة ومُثبتة)
| Area | Evidence | Pass/Fail | Risk | Required Fix |
| --- | --- | :--: | --- | --- |
| ربط ALS | `db_postgres.js`: AsyncLocalStorage + `runWithTenant` + getCurrentTenantId | PASS | — | — |
| تغليف pool.query | يحجز client، `set_config('app.tenant_id',tid,false)` على **نفس الاتصال**، ثم reset+release في finally | PASS | تسرّب لو فشل reset (best-effort، نادر) | راقب |
| مسار pool.connect/معاملة | يدعم `SET LOCAL set_config(...,true)` داخل BEGIN | PASS | — | — |
| middleware لكل طلب | `server.js:143` app.use قبل كل المسارات: `tenantStore.run({tenantId,facilityId}, next)` من **session موثوق** (`getRequestTenantContext`) | PASS | — | — |
| مصدر tenantId | login يجلب من `user_tenants` ويضع `session.user.tenantId` (سطر 358/383) | PASS | مستخدم بلا user_tenants ⇒ requireTenantScope 403 (fail-closed) | تأكيد بيانات user_tenants لكل مستخدم prod |
| fail-closed | بلا سياق ⇒ pool.query المسار الأصلي بلا GUC ⇒ تحت الدور الجديد RLS يعيد 0 (آمن)؛ والمسارات المحمية تُحجب بـ requireAuth/requireTenantScope قبل ضرب الجداول | PASS | — | — |
| عدم التسرّب | اختبار DB-backed: سياقات متزامنة 11/22/33 معزولة + reset بعد كل طلب | PASS | — | — |
```text
DB-backed binding test (cross_tenant_app_tenant_binding_test.js): 9/9 PASS
=> precondition #2 (app يضبط app.tenant_id لكل طلب على نفس الاتصال، fail-closed، بلا تسرّب) مُستوفى ومنشور في 6ecbf4a.
```

## Gate 4 — القرار
```text
DECISION: Option B — SQL/Policy candidate (مع توصية مكمّل code)
السبب: جوهر توافق audit_trail قرار سياسة (الكتابة يجب ألا تُفقد، والقراءة تبقى معزولة، والسجل append-only).
الختم في logAudit وحده لا يكفي (أحداث LOGIN/النظام بلا سياق تبقى NULL وتُرفض تحت السياسة الصارمة).
```

## Gate 5/6 — المرشّح + البروفة (DB معزول، 15/15 PASS)
ملفات `docs/sql/audit_trail_rls_policy_candidate_{up,validate,down}.sql`:
- `up`: إسقاط السياسة الصارمة + `audit_trail_insert_writealways` (FOR INSERT WITH CHECK: tenant_id IS NULL OR =app.tenant_id) + `audit_trail_select_tenant` (FOR SELECT USING tenant_id=app.tenant_id). لا UPDATE/DELETE policy ⇒ append-only. FORCE يبقى. لا BYPASSRLS.
- البروفة على `nama_audit_rehearsal` (أُسقطت): **15/15 PASS** —
```text
BEFORE(صارمة): logAudit insert مرفوض (42501) بسياق وبدونه  ✅ (يؤكد فقدان التدقيق)
validate: 0 bad_rows ✅
AFTER(candidate): NULL insert مسموح ✅ ؛ tenant-matched مسموح ✅ ؛ forge(tenant 2 وctx=1) محجوب 42501 ✅ ؛
  system(no ctx) مسموح ✅ ؛ SELECT tenant1 معزول (3 صفوف، لا NULL، لا tenant2) ✅ ؛ tenant2 يرى صفّه ✅ ؛
  no-context يرى 0 ✅ ؛ UPDATE/DELETE محجوبة (0 صفوف، append-only) ✅ ؛ لا BYPASSRLS ✅
DOWN: السياسة الصارمة مُستعادة، السياستان الجديدتان أُزيلتا ✅
prod audit_trail بلا تغيير (44 صفاً، السياسة الصارمة قائمة)
```
**حد المرشّح**: يمنع **فقدان** التدقيق (التوافق)، لكن بدون ختم logAudit ستُخزَّن صفوف الأحداث المُصادَق عليها بـ tenant_id=NULL (غير مرئية لقراءة المستأجر). لذا يُوصى بمكمّل code: `logAudit` يقرأ `getCurrentTenantId()` (متاح عبر ALS) ويختم tenant_id — يمنح إسناداً لكل مستأجر دون لمس ~70 نداءً. (قرار `WITH CHECK` يسمح بالنظامي NULL، فلا ينكسر LOGIN.)

## قراءة super-admin العابرة
لم تُفتح. تبقى آلية محكومة منفصلة (دور قراءة مخصص أو VIEW مُدار) — بند حوكمة لاحق، لا BYPASSRLS.

## الحقول
```text
FINAL_STATUS: DOCS_AND_SQL_CANDIDATE_ONLY_PASS
SELECTED_PHASE: P1_AUDIT_TRAIL_RLS_POLICY_AND_TENANT_CONTEXT_SWITCH_READINESS
USER_VISIBLE_ON_WEBSITE: NO
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: YES (APPROVE_AUDIT_TRAIL_RLS_POLICY_DDL لتطبيق المرشّح)
DDL_EXECUTED: NO (على الإنتاج) ؛ نُفِّذ على DB معزول throwaway فقط ثم أُسقط
SQL_CANDIDATE_CREATED: YES (audit_trail_rls_policy_candidate_{up,validate,down}.sql)
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: NO
CODE_CANDIDATE_CREATED: NO (موصى به كمكمّل: logAudit ALS stamping — لم يُنفَّذ هذه المرحلة)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
RLS_CHANGED: NO (الإنتاج؛ السياسة الصارمة قائمة)
RLS_RUNTIME_ENFORCEMENT: NOT_YET
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres
AUDIT_TRAIL_ROWS: 44
AUDIT_TRAIL_TENANT_DISTRIBUTION: {tenant_id=1: 44, NULL: 0}
LOGAUDIT_CALLS_REVIEWED: ~70 (TENANT_AWARE غالبية + LOGIN نظامي + admin/system)
TENANT_CONTEXT_BINDING_RESULT: PASS (ALS + pool.query wrapper + middleware؛ منشور 6ecbf4a)
APP_TENANT_ID_CONNECTION_SCOPE_RESULT: PASS (9/9 DB-backed، نفس الاتصال، بلا تسرّب، fail-closed)
RECOMMENDED_AUDIT_TRAIL_STRATEGY: permissive write-always INSERT policy (NULL أو tenant-match) + tenant-isolated SELECT + append-only (no UPDATE/DELETE) + super-admin read عبر دور/VIEW محكوم لاحقاً ؛ + مكمّل code: logAudit يختم tenant_id من ALS
TESTS_RESULT: binding 9/9 PASS
REHEARSAL_RESULT: audit_trail policy 15/15 PASS (DB معزول، أُسقط)
SECRETS_FOUND: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_AUDIT_TRAIL_RLS_POLICY_DDL (+ logAudit ALS stamping code-only) ثم SECRET_READY_EXECUTE_SWITCH
```

## خلاصة الجاهزية للتبديل
```text
شرط (1) توافق audit_trail: مرشّح سياسة جاهز ومُختبَر (15/15) — يحتاج موافقة تطبيق DDL.
شرط (2) ضبط app.tenant_id لكل طلب: مُستوفى ومنشور ومُثبَت (9/9) ✅.
=> بعد تطبيق سياسة audit_trail (وتفضيلاً ختم logAudit)، يصبح النظام جاهزاً لـ SECRET_READY_EXECUTE_SWITCH.
```

`AUDIT_TRAIL_AND_TENANT_CONTEXT_SWITCH_READINESS_FINAL_CLOSEOUT_COMPLETE`
