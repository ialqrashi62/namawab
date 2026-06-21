# P1 — إغلاق تصميم تكامل قراءة audit_trail للسوبر أدمن (Runtime Integration Candidate)

> المرحلة: `P1_AUDIT_TRAIL_SUPER_ADMIN_RUNTIME_INTEGRATION_CANDIDATE` | التاريخ: 2026-06-21 | candidate فقط — **لا DDL/GRANT/deploy/restart على الإنتاج**.

## المخرجات
- **تصميم** (`P1_..._RUNTIME_INTEGRATION_DESIGN_AR.md`): مقارنة A/B/C، الاختيار **B** (GRANT + SET ROLE خلف requireSuperAdmin) **مع `WITH INHERIT FALSE` إلزامي**.
- **SQL candidate** (grant، غير مُنفَّذ): `docs/sql/audit_trail_reader_runtime_grant_candidate_{up,validate,down}.sql` — `GRANT nama_audit_reader TO nama_medical_app WITH INHERIT FALSE` / validate (membership + non-inherit) / down (REVOKE).
- **Code candidate** (مستقل، غير مدمج): `docs/code_candidates/audit_trail_global_route_candidate.js` — `requireSuperAdmin` (role==='Admin') + `GET /api/admin/audit-trail/global` + client مخصص + `SET LOCAL ROLE` داخل معاملة (إعادة ضبط تلقائية) + pagination (≤100) + فلاتر آمنة parameterized (date/action/module/user_id) + لا tenant_id من body + أعمدة ميتاداتا فقط + تسجيل الوصول.

## 🔴 اكتشاف بروفة حاسم
البروفة الأولى (منح عادي) **فشلت 3/6**: الوراثة الافتراضية تجعل سياسة القارئ تنطبق على دور التطبيق مباشرةً ⇒ **انكسار عزل audit_trail** (التطبيق يرى كل المستأجرين دون SET ROLE). **الإصلاح**: `WITH INHERIT FALSE`. بعده **6/6 PASS**:
```text
membership WITH INHERIT FALSE ✅
normal app path معزول (=2، ليس 4) ✅
SET LOCAL ROLE -> قراءة عابرة (=4) ✅
إعادة ضبط تلقائية بعد COMMIT (لا تسرّب، =2) ✅
reader read-only (INSERT 42501) ✅
reader بلا وصول patients (42501) ✅
```
(البروفة بأسماء reh_* فقط — لا nama_* — لأن nama_audit_reader إنتاجي؛ تنظيف finally دائم؛ لا تسرّب.)

## ⚠️ اكتشاف حوكمة (تشعّب namaweb — R17) — يتجاوز هذه المرحلة
فرع namaweb المنشور **039a7d7** لا يتضمّن commits الأمنية الخاصة بي. مؤكَّد على الكود الحيّ: (1) logAudit = 6 أعمدة (بلا ختم tenant_id) ⇒ صفوف تدقيق جديدة NULL-tenant؛ (2) `POST /api/blood-bank/units|/donors` بلا ختم tenant_id بينما الجدولان FORCE-RLS ⇒ **إدراجهما سيُرفض 42501**. القراءة العابرة مغطّاة بـRLS. **توصية: مرحلة `NAMAWEB_BRANCH_RECONCILIATION` منفصلة** (لا تُنفَّذ هنا).

## الحقول
```text
FINAL_STATUS: CODE_AND_SQL_CANDIDATE_ONLY_PASS
SELECTED_PHASE: P1_AUDIT_TRAIL_SUPER_ADMIN_RUNTIME_INTEGRATION_CANDIDATE
USER_VISIBLE_ON_WEBSITE: NO
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES
AUDIT_READER_ROLE_EXISTS: YES
AUDIT_READER_GRANTED_TO_APP: NO (candidate فقط؛ لم يُنفَّذ)
RUNTIME_INTEGRATION_DECISION: B (GRANT WITH INHERIT FALSE + SET ROLE خلف requireSuperAdmin)
CODE_CHANGED: NO (server.js الحيّ لم يُلمس؛ ملف candidate مستقل فقط)
CODE_DEPLOYED: NO
DDL_EXECUTED: NO
GRANT_EXECUTED: NO
SQL_CANDIDATE_CREATED: YES (audit_trail_reader_runtime_grant_candidate_{up,validate,down})
REHEARSAL_RESULT: 6/6 PASS (بعد إصلاح INHERIT FALSE؛ الأولى كشفت انكسار العزل بالمنح العادي)
SECURITY_GUARD_RESULT: PASS (requireSuperAdmin + pagination ≤100 + فلاتر آمنة + لا body tenant_id + SET LOCAL ROLE داخل معاملة)
TENANT_ISOLATION_RESULT: PASS (المسار العادي معزول مع INHERIT FALSE)
PHI_ISOLATION_RESULT: PASS (reader بلا وصول patients؛ يقرأ ميتاداتا تدقيق فقط)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_AUDIT_READER_RUNTIME_GRANT_AND_DEPLOY أو TEST_ACCOUNT_READY أو NAMAWEB_BRANCH_RECONCILIATION أو MASTER_AUTOPILOT_RESELECT
```

## معيار النجاح — مُستوفى
candidate فقط (لا DDL/GRANT/deploy/restart) ✅ · لا SUPERUSER/BYPASSRLS ✅ · لا فتح عام (سياسة مقيّدة بالدور + INHERIT FALSE) ✅ · عزل المستأجر وPHI سليم ✅ · requireSuperAdmin + pagination + فلاتر آمنة ✅ · rehearsal 6/6 (كشف وأصلح خطر العزل) ✅ · لا تسرّب أدوار/DB ✅ · accounting OFF/journal 0 ✅ · لا أسرار/force ✅.

`AUDIT_TRAIL_SUPER_ADMIN_RUNTIME_INTEGRATION_CANDIDATE_FINAL_CLOSEOUT_COMPLETE`
