# P0 — إغلاق تبديل دور RLS (Retry-2: BLOCKED at Gate 3 — مصدر السرّ غير قابل للوصول)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_RETRY_WITH_SAFE_SECRET_SOURCE` | تفويض: `SECRET_READY_EXECUTE_SWITCH` | التاريخ: 2026-06-21.

## الخلاصة
المحاولة الثانية باستخدام مصدر سرّ آمن منفصل. توقّفت عند **Gate 3** لأن المصدرين المحدَّدين (`DB_APP_PASSWORD` env و`/root/nama_medical_app_db_password`) **غير قابلين للوصول من بيئة التنفيذ (win32، المستخدم ice)**. **لم يُغيَّر أي شيء**: `.env` ما زال `DB_USER=postgres`، التطبيق online/200، لا restart، لا rollback لازم.

## أدلة البوابات
- **Gate 0 PASS**: متزامن 79c34cc، namaweb 10ded01، online (restarts=3)، health 200، RLS_FORCE=120، journal=0، DB_ROLE=postgres، flag OFF.
- **Gate 1 PASS**: `nama_medical_app` جاهز (login=true، super=false، bypassrls=false، DML 149/149، sequences 147/147).
- **Gate 2**: backup من المرحلة السابقة ساري (`~/nama_deploy_backups/rls_role_switch_20260621/`)؛ لم يلزم تعديل ⇒ لا backup جديد مطلوب.
- **Gate 3 STOP**: فحص المصدرين الآمنين (دون طباعة قيم):
  - `DB_APP_PASSWORD`: ABSENT على Process و User و Machine.
  - ملف كلمة المرور: غير موجود في `/root/...` (مسار Linux على صندوق win32) ولا في أي مسار Windows مُحتمَل (`C:\root\`, `C:\Users\ice\`, `C:\Users\ice\.secrets\`, `C:\`, `C:\ProgramData\`).
  - `TARGET_DB_USER_SECRET_PRESENT: NO` ⇒ لم يُجرَ probe الاتصال (لا قيمة لاستخدامها). التفاصيل في `P0_RLS_RUNTIME_ROLE_SWITCH_SAFE_SECRET_PROBE_AR.md`.

## التشخيص (دون أي سر)
دلالة `/root/` تشير إلى مضيف Linux، بينما الـ single-box الحالي **Windows أصلي** (PostgreSQL 16 وPM2 تحت المستخدم ice). السر المُهيّأ "خارج الشات" ليس في أي مصدر يراه أمري على هذا الصندوق.

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_RUNTIME_ROLE_SWITCH_APPROVAL
SELECTED_PHASE: P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION (retry with safe secret source)
USER_VISIBLE_ON_WEBSITE: NO_CHANGE
PRODUCTION_DEPLOYED: NO (لا تغيير)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres (دون تغيير)
APP_ROLE_SUPERUSER: (target nama_medical_app=false؛ لم يُطبَّق)
APP_ROLE_BYPASSRLS: (target=false؛ لم يُطبَّق)
RLS_FORCE_COUNT: 120
RLS_RUNTIME_ENFORCEMENT: NOT_YET
RLS_ENFORCEMENT_RESULT: N/A (لم يُبدَّل الدور)
TENANT_ISOLATION_TEST: N/A
APP_TENANT_ID_CONNECTION_SCOPE_RESULT: PASS (جاهز ومنشور)
AUDIT_TRAIL_POLICY_RESULT: LIVE
LOGAUDIT_STAMPING_RESULT: LIVE
HEALTH_SMOKE: PASS (postgres الحالي)
PM2_STATUS: online (restarts=3، دون restart هذه المرحلة)
REDIS_STATUS: connected
DDL_EXECUTED: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
ENV_BACKUP_PATH: ~/nama_deploy_backups/rls_role_switch_20260621/.env.before-switch.bak
ROLLBACK_READY: YES
ROLLBACK_USED: NO (لم يُغيَّر شيء)
SECRETS_FOUND: NO (المصدران غير قابلين للوصول)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: SET_VALID_NAMA_MEDICAL_APP_SECRET_OUTSIDE_CHAT_THEN_RETRY
```

## ما المطلوب لإكمال التبديل (على صندوق win32 هذا، دون كتابة السر في الشات)
اجعل سر `nama_medical_app` مقروءاً لعملية المستخدم `ice` بأحد الخيارين:
1. `[Environment]::SetEnvironmentVariable('DB_APP_PASSWORD','<secret>','User')` (أو `'Machine'`) عبر PowerShell.
2. أو ملف نصّي بصلاحيات محدودة في مسار Windows مثل `C:\Users\ice\nama_medical_app_db_password`.

ثم أعد إصدار `SECRET_READY_EXECUTE_SWITCH`. عند SUCCESS لـ probe الاتصال، أُكمل البوابات 4–11: تبديل ذرّي (`DB_USER=nama_medical_app` + `DB_PASSWORD`=قيمة المصدر الآمن في نفس الخطوة) + restart محكوم + إثبات `current_user=nama_medical_app` + إنفاذ RLS الفعلي + regression — مع rollback فوري عند أي إخفاق مصادقة.

`RLS_RUNTIME_ROLE_SWITCH_RETRY2_BLOCKED_AT_SAFE_SECRET_PROBE — NO_CHANGES_MADE`
