# NamaMedical — الإغلاق الرئيسي لبرنامج تصليب RLS/Runtime الشامل (كل المراحل والمجموعات)

> البرنامج: `NAMA_MEDICAL_FULL_RLS_RUNTIME_HARDENING_MASTER_AUTOPILOT_ALL_PHASES_AND_GROUPS` | التاريخ: 2026-06-21
> الطبيعة: candidates + تدقيقات قراءة-فقط + rehearsals. **لا نشر/DDL/GRANT/enablement إنتاجي في هذا البرنامج** — كلها موقوفة بموافقة مرحلة صريحة.

## ملخص تنفيذي
الأساس قائم وثابت: التطبيق يعمل فعلاً كـ `nama_medical_app` (غير superuser/bypass)، **125 جدول FORCE RLS**، ربط app.tenant_id مُثبَت عبر مسار التطبيق. هذا البرنامج أكمل التدقيق الشامل وجهّز المرشّحات لكل المجموعات، وكشف **تصحيحاً أمنياً حاسماً** وأولوية **P0 جديدة** خارج نطاق RLS.

## أبرز الاكتشافات
1. **🔴 تصحيح حاسم (PHASE 4 vs 3)**: تدقيق المسارات (قراءة كود db_postgres.js) ادّعى «3 جداول FORCE فقط / العزل app-layer فقط». **خطأ**: القاعدة الحية بها **125 FORCE RLS** (PHASE 3 عبر pg_class، قاطع؛ الباقي طُبِّق خارج النطاق في مراحل سابقة). ⇒ معظم ثغرات IDOR/cross-tenant على PHI (patients/invoices/medical_records/blood_bank/obgyn/rehab/hr_employees — كلها FORCE RLS) **مُخفَّفة فعلياً وقت التشغيل**، ليست تسريباً حيّاً.
2. **🔴 P0 حقيقي (لا يحميه RLS)**: `PUT /api/settings/users/:id` (server.js:1435) بلا `requireRole` ⇒ أي مستخدم مصادَق يعدّل أي مستخدم/يرفع نفسه Admin/يعيد كلمات المرور. `system_users` بلا tenant_id/RLS (جدول تعريف التعدّدية) ⇒ تصعيد صلاحيات حقيقي. **أعلى أولوية**.
3. **14 جدول tenant-sensitive بلا عزل DB** (مالي: finance_cost_centers/fiscal_years, discount_rules, insurance_companies/contracts؛ تشغيلي: branches, departments, **employees[رواتب/عمولات]**, form_templates, cme_activities/registrations, cssd_instrument_sets/load_items/sterilization_cycles) ⇒ عزلها app-layer فقط؛ بعضها مملوء (employees) ⇒ RLS يحتاج backfill (موافقة بيانات).
4. **route-level DDL Batch B/C**: كل جداولها 0 صفوف ⇒ مرشّحات RLS-safe جاهزة ومُجرّبة (rehearsal PASS).
5. لا مسار يثق بـtenant_id من body/query ✓.

## حالة المراحل
| المرحلة | الحالة | المخرج |
|---|---|---|
| 0 State guard + binding | ✅ PASS | nama_medical_app، FORCE=125، binding ctx1=3/999=0/no-ctx=0 |
| 1 Route-DDL Batch B/C | ✅ candidates + rehearsal PASS؛ ⏳ code-removal (1C) | `P1_ALL_REMAINING_..._INVENTORY` + `route_level_ddl_batch_b/c_rls_safe_candidate_*` |
| 2 Tenant stamping | ✅ جرد مطابَق | `P2_CODE_LEVEL_TENANT_STAMPING_...` (P0 system_users + 14-table) |
| 3 Full RLS coverage | ✅ تدقيق | `P3_FULL_RLS_COVERAGE_...` (125 FORCE، 14 gaps) |
| 4 API/RBAC | ✅ تدقيق + **تصحيح** | `P4_..._FULL_AUDIT` (P0 system_users؛ باقي PHI مُخفَّف بـRLS) |
| 5 E2E/UAT | ✅ harness PASS | `P5_...` (لا حساب اختبار ⇒ لا browser E2E) |
| 6 Audit-reader | ✅ candidate جاهز/غير منشور | الدور NOLOGIN/NOSUPER/NOBYPASSRLS، GRANT موقوف |
| 7 Accounting | ✅ OFF/readiness | `P7_...` (لا مخطط محاسبي) |
| 8 Master closeout | ✅ هذا المستند | — |

## الحقول
```text
FINAL_STATUS: FULL_MASTER_CANDIDATES_READY_NOT_DEPLOYED
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS
FORCE_RLS_COUNT: 125
TENANT_DEFAULT_COUNT: 125
ROUTE_LEVEL_DDL_STATUS: Batch A منشور؛ Batch B/C SQL candidates جاهزة+مُجرّبة (code-removal = خطوة تالية ضمن تسلسل نشر موقوف)
TENANT_STAMPING_STATUS: جرد مكتمل؛ P0 (system_users role guard) + 14-table RLS = candidates مُحدَّدة غير منشورة
FULL_RLS_AUDIT_STATUS: مكتمل — 125/155 FORCE؛ 14 tenant-sensitive gaps (CANDIDATE_FIXES_NEEDED)
API_RBAC_STATUS: مكتمل (مطابَق) — P0 system_users؛ معظم نتائج PHI مُخفَّفة بـRLS؛ candidates غير منشورة
E2E_STATUS: HARNESS_UAT_PASS_BROWSER_NOT_AVAILABLE
AUDIT_READER_STATUS: CANDIDATE_READY_NOT_DEPLOYED (GRANT موقوف)
ACCOUNTING_STATUS: ACCOUNTING_READINESS_ONLY_NO_ENABLEMENT (لا مخطط، OFF، journal=0)
HEALTH_STATUS: 200
PM2_STATUS: ONLINE (restarts ثابتة)
REDIS_STATUS: UP
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
DDL_EXECUTED: NO (في هذا البرنامج؛ rehearsals على قواعد معزولة فقط)
DATA_CHANGED: NO
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO (في هذا البرنامج)
ROLLBACK_READY: YES (لا تغييرات إنتاجية في هذا البرنامج؛ candidates لها down.sql)
NEXT_REQUIRED_ACTION: انظر «بوابات الموافقة» أدناه
```

## بوابات الموافقة (مرتّبة بالأولوية)
1. **`APPROVE_SYSTEM_USERS_ROLE_GUARD_FIX`** (P0، code-only، لا يحميه RLS) — الأعلى أولوية.
2. **`APPROVE_ROUTE_LEVEL_DDL_BATCH_B_C_DEPLOY_SEQUENCE`** — تشغيل batch_b/c RLS-safe SQL (superuser) ثم إزالة كود Batch B/C ثم restart (نمط Batch A المُثبَت؛ code-removal 1C يُنفَّذ ضمنها).
3. **`APPROVE_14_TABLE_RLS_DDL`** + `DATA_CHANGE_APPROVAL` (backfill tenant_id للجداول المملوءة مثل employees).
4. **`APPROVE_API_RBAC_DEFENSE_IN_DEPTH_BATCHES`** — فلاتر/أدوار app-layer (دفعات).
5. **`APPROVE_AUDIT_READER_GRANT_AND_DEPLOY`** (PHASE 6).
6. accounting يبقى OFF (خارج البرنامج).

## ما لم يُمَس
لا production DDL/deploy/GRANT/data/seed/backfill/restart/role-change/password في هذا البرنامج. لا force push، لا أسرار مطبوعة، لا mojibake. ملفات Stitch/MEDICAL/.ps1 الموازية لم تُلمس. الإنتاج مستقر (postgres-role=nama_medical_app، health 200).

تم اكتمال تشغيل Master Autopilot لكل مراحل ومجموعات RLS/runtime hardening مع إيقاف آمن عند أي بوابة عالية المخاطر
