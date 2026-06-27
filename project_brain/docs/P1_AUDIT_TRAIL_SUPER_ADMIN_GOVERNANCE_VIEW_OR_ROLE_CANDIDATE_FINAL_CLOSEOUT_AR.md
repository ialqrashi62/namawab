# P1 — إغلاق حوكمة قراءة super-admin لـ audit_trail (Candidate + Rehearsal Closeout)

> المرحلة: `P1_AUDIT_TRAIL_SUPER_ADMIN_GOVERNANCE_VIEW_OR_ROLE_CANDIDATE` | التاريخ: 2026-06-21 | read-only audit + SQL candidate (مُختبَر على DB معزول). **لا DDL إنتاجي، لا تغيير دور/بيانات/نشر.**

## المشكلة
بعد تشديد سياسة audit_trail (Phase 148) صارت القراءة معزولة بالمستأجر (`audit_trail_select_tenant`). لذا قراءة super-admin/الامتثال **العابرة للمستأجر** محجوبة. المطلوب آلية محكومة لإعادتها **دون** BYPASSRLS/SUPERUSER/فتح عام/تعطيل FORCE.

## الحل (candidate — الخيار 2: دور قارئ محكوم)
`docs/sql/audit_trail_super_admin_view_candidate_{up,validate,down}.sql`:
- إنشاء `nama_audit_reader` (NOLOGIN/NOSUPERUSER/NOBYPASSRLS/NOCREATEDB/NOCREATEROLE).
- GRANT USAGE schema + **SELECT فقط** على audit_trail (لا INSERT/UPDATE/DELETE).
- `CREATE POLICY audit_trail_select_superadmin FOR SELECT TO nama_audit_reader USING (true)` — سياسة سماحية **مقيّدة بالدور**، تُدمج OR مع سياسة المستأجر.
- التفعيل (قرار مالك، خارج الملف): A) دور LOGIN بسر منفصل لاتصال super-admin مستقل (الأكثر تحفّظاً، التطبيق لا يكتسب قدرة)، أو B) `GRANT nama_audit_reader TO nama_medical_app` + `SET ROLE` داخل مسارات super-admin المُصرّح بها فقط (يتطلب بوابة تطبيق + تسجيل).

## البروفة (DB معزول `nama_auditgov_rehearsal`، أُسقط) — 9/9 PASS
```text
candidate validate: 0 bad_rows ✅
normal app role (reh_app): tenant1=2, tenant2=1, no-ctx=0 — معزول، لا رؤية عابرة ✅
audit reader: no-ctx=4, ctx1=4 — يرى كل الصفوف (incl NULL/system) عابر المستأجر ✅
audit reader read-only: INSERT/UPDATE/DELETE مرفوضة (42501) ✅
audit reader: لا وصول لجدول patients (لا تسرّب امتياز) ✅
reader role: NOSUPER + NOBYPASSRLS + NOLOGIN ✅
down: الدور + السياسة السماحية أُسقطا؛ select_tenant + insert_writealways سليمتان ✅
```
**درس وتصحيح**: أدوار PostgreSQL **عنقودية** (لا تُعزل بقاعدة منفصلة). البروفة الأولى سرّبت دور `nama_audit_reader`/`reh_app` للعنقود (وقاعدة throwaway) بسبب خطأ validate (`patients` غير موجود) قبل التنظيف. **عولج فوراً**: أُسقطت القاعدة والأدوار المسرّبة، وتأكّدت سلامة `nama_medical_app`+`postgres`. أُعيد الـharness مع جدول patients وهمي + تنظيف `finally` دائم. **لا تسرّب الآن**، وسياسات audit_trail الإنتاجية بلا تغيير.

## الحقول
```text
FINAL_STATUS: DOCS_AND_SQL_CANDIDATE_ONLY_PASS
SELECTED_PHASE: P1_AUDIT_TRAIL_SUPER_ADMIN_GOVERNANCE_VIEW_OR_ROLE_CANDIDATE
USER_VISIBLE_ON_WEBSITE: NO
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES
PM2_STATUS: online (restarts=4)
HEALTH_SMOKE: PASS (/api/health=200)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
DDL_EXECUTED: NO (على الإنتاج؛ throwaway فقط ثم أُسقط)
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: NO
SQL_CANDIDATE_CREATED: YES (audit_trail_super_admin_view_candidate_{up,validate,down}.sql)
TEST_ACCOUNT_USED: NO (E2E مؤجّل — TEST_ACCOUNT_READY غير صادر)
BROWSER_E2E_RESULT: NOT_YET
AUDIT_TRAIL_GOVERNANCE_DECISION: controlled audit reader role + role-scoped permissive SELECT policy (لا BYPASSRLS/SUPERUSER؛ عزل المستأجر للأدوار الأخرى قائم؛ FORCE قائمة؛ read-only)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_AUDIT_TRAIL_SUPER_ADMIN_GOVERNANCE_DDL (لتطبيق candidate + اختيار التفعيل A/B) أو TEST_ACCOUNT_READY (لـ Full Browser E2E UAT) أو MASTER_AUTOPILOT_RESELECT
```

## معيار النجاح — مُستوفى
candidate فقط (لا DDL إنتاجي) ✅ · لا BYPASSRLS/SUPERUSER ✅ · audit_trail غير مفتوح لكل المستأجرين ✅ · FORCE لم تُعطَّل ✅ · عزل المستأجر غير مُضعَّف ✅ · لا أسرار ✅ · rehearsal 9/9 ✅ · لا تسرّب (عولج) ✅ · accounting OFF/journal 0 ✅.

`AUDIT_TRAIL_SUPER_ADMIN_GOVERNANCE_CANDIDATE_FINAL_CLOSEOUT_COMPLETE`
