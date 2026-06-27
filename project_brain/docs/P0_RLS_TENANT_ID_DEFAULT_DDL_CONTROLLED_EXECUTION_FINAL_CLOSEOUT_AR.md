# P0 — إغلاق إصلاح انحدار الكتابة بإضافة tenant_id defaults (Controlled DDL Execution)

> المرحلة: `P0_RLS_TENANT_ID_DEFAULT_DDL_CONTROLLED_EXECUTION` | تفويض: tenant_id DEFAULT فقط | التاريخ: 2026-06-21.

## ملخص
طُبِّق DDL محكوم يضيف `tenant_id DEFAULT (NULLIF(current_setting('app.tenant_id',true),''))::integer` لكل جداول FORCE-RLS (120)، فارتفع انحدار الكتابة (42501) عن ~44 جدولاً متضرراً. **بلا تغيير بيانات/كود/دور/سياسات، بلا restart/GRANT/accounting.** تحقق على بيانات إنتاج حقيقية 27/27.

## أدلة البوابات
- **Gate 0**: app=nama_medical_app (super=false, bypassrls=false)، RLS مُنفَّذ (patients no-ctx=0).
- **Gate 2 eligibility**: 120 جدول FORCE-RLS، كلها tenant_id من نوع **integer**، **0 default سابق**، لا non-integer ⇒ كلها مؤهلة، لا استثناءات. **audit_trail: INCLUDED** (آمن — سياسة write-always تسمح NULL للنظامي بلا سياق؛ الـDEFAULT يختم تحت السياق = إسناد أفضل؛ لا تعارض).
- **Gate 1**: المرشّح ALTER … SET DEFAULT فقط (لا ADD COLUMN/backfill/policy/role/GRANT).
- **Gate 3 backup**: pg_dump schema (10709 سطراً) + snapshot (120 cols default=null, FORCE=120, policies=122) خارج المستودع؛ rollback=down.sql.
- **Gate 4**: `up.sql` (psql atomic): BEGIN/DO/COMMIT، exit 0 ⇒ 120 عمود tenant_id له الآن الـDEFAULT.
- **Gate 5 validate**: 3/3 = 0 bad_rows (كل المؤهلة لها default، FORCE سليم، دور التطبيق غير ممتاز).
- **Gate 6 targeted regression (27/27، بيانات حقيقية، ROLLBACK)**:
```text
transport_requests / blood_bank_units / blood_bank_donors / insurance_claims /
medical_records / medical_certificates / quality_incidents / hr_employees / zatca_invoices:
  INSERT بلا tenant_id @ctx=1 => أُدرج (كان 42501) ✅
  forge tenant_id=2 @ctx=1 => 42501 محجوب ✅
  no-context => 42501 fail-closed ✅
```
- **Gate 7 smoke**: /=200، health=200، login=200، protected=401؛ pm2 online (restarts=4، بلا restart).
- **Gate 8**: journal=0، flag OFF، baselines بلا تغيير (patients=3, invoices=3, audit_trail=45).

## الحقول
```text
FINAL_STATUS: PRODUCTION_DDL_PASS_WRITE_REGRESSION_FIXED
SELECTED_PHASE: P0_RLS_TENANT_ID_DEFAULT_DDL_CONTROLLED_EXECUTION
USER_VISIBLE_ON_WEBSITE: YES (تدفّقات الإنشاء في ~44 جدولاً تعمل الآن بعد أن كانت تفشل 42501)
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES
AFFECTED_TABLES_COUNT: 120
TABLES_INCLUDED: كل جداول FORCE-RLS ذات tenant_id integer (شامل audit_trail)
TABLES_EXCLUDED: لا شيء (كلها مؤهلة)
AUDIT_TRAIL_DECISION: INCLUDED (آمن؛ NULL للنظامي مسموح، إسناد تحت السياق)
DEFAULT_EXPRESSION: (NULLIF(current_setting('app.tenant_id', true), ''))::integer
WRITE_REGRESSION_FIXED: YES
TRANSPORT_REQUESTS_PROOF: INSERT بلا tenant_id @ctx=1 أُدرج (كان 42501)؛ forge محجوب؛ no-ctx محجوب
BLOOD_BANK_PROOF: units+donors أُدرجا @ctx=1؛ forge محجوب؛ no-ctx محجوب
INSURANCE_PROOF: insurance_claims أُدرج @ctx=1؛ forge محجوب؛ no-ctx محجوب
PHI_PROOF: medical_records + medical_certificates أُدرجا @ctx=1؛ forge محجوب؛ no-ctx محجوب
FORGED_TENANT_BLOCKED: YES (42501 على كل العينات)
NO_CONTEXT_FAIL_CLOSED: YES (42501 على كل العينات)
TENANT_ISOLATION_RESULT: PASS (القراءة معزولة؛ WITH CHECK سليم)
FORCE_RLS_STILL_ENABLED: YES (120)
RLS_POLICY_COUNT_BEFORE: 122
RLS_POLICY_COUNT_AFTER: 122
ROW_COUNT_CHANGED: NO (كل اختبارات الإدراج داخل ROLLBACK)
HEALTH_SMOKE: PASS
PM2_STATUS: online (restarts=4)
REDIS_STATUS: connected
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
DDL_EXECUTED: YES_LIMITED_TENANT_ID_DEFAULTS
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: NO
PM2_RESTARTED: NO
ROLLBACK_READY: YES (down.sql + schema dump + snapshot)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DDL_MONITORING_THEN_MASTER_AUTOPILOT_RESELECT
```

## معيار النجاح — مُستوفى
DDL محصور في tenant_id DEFAULT ✅ · 120 جدول مؤهل، لا استثناء ✅ · validate 3/3 ✅ · regression 27/27 على بيانات حقيقية ✅ · forge محجوب + no-ctx fail-closed ✅ · FORCE/policies بلا تغيير ✅ · لا بيانات/كود/دور/GRANT/accounting ✅ · لا restart ✅ · rollback جاهز ✅ · لا أسرار/force ✅.

## ملاحظات
- الإصلاح يسدّ أيضاً فجوة إسناد logAudit (audit_trail يُختم تلقائياً تحت السياق).
- دفاع-في-العمق لاحق (اختياري): إعادة ختم tenant_id في مسارات الكود + توفيق فرعَي namaweb (B/C). الـDEFAULT يكفي وظيفياً الآن.
- مراقبة ما بعد DDL: تتبّع أي 42501 متبقٍّ في logs (مسارات تُدرج بلا سياق app.tenant_id).

`RLS_TENANT_ID_DEFAULT_DDL_CONTROLLED_EXECUTION_FINAL_CLOSEOUT_COMPLETE`
