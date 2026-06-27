# P0 — إغلاق تبديل دور RLS (Retry-3: BLOCKED at Gate 3 — قيمة السرّ لا تطابق الدور)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_RETRY_WITH_SAFE_SECRET_SOURCE` | تفويض: `SECRET_READY_EXECUTE_SWITCH` | التاريخ: 2026-06-21.

## الخلاصة
المحاولة الثالثة باستخدام ملف سرّ على نفس الصندوق (`C:\Users\ice\nama_medical_app_db_password`). الملف **موجود ومقروء** هذه المرة، لكنه توقّف عند **Gate 3** لأن قيمته **لا تطابق كلمة مرور الدور `nama_medical_app`** (probe رجع `28P01 invalid_password` على القيمة الخام والمُجرَّدة معاً). **لم يُغيَّر أي شيء**: `.env` ما زال `DB_USER=postgres`، التطبيق online/200، لا restart.

## أدلة البوابات
- **Gate 0 PASS**: متزامن 388d47a، namaweb 10ded01، online (restarts=3)، health 200، DB_ROLE=postgres.
- **Gate 1 PASS**: `nama_medical_app` جاهز (login=true، super=false، bypassrls=false، DML 149/149، sequences 147/147).
- **Gate 3 STOP**: الملف موجود (63 بايت ASCII، محرف فراغ بادئ واحد، لا BOM). probe الاتصال كـ nama_medical_app:
  - القيمة الخام (63) → FAILED 28P01.
  - القيمة المُجرَّدة .trim() (62) → FAILED 28P01.
  - لم تُجرَّب صيغ أخرى (تجنّب التخمين). التفاصيل في `P0_RLS_RUNTIME_ROLE_SWITCH_SAFE_SECRET_PROBE_AR.md`.

## التشخيص (دون أي سر)
محتوى الملف ≠ كلمة مرور الدور الحالية. السبب الأرجح: الملف يحوي كلمة مرور مختلفة عمّا ضُبط فعلياً على الدور بـ `ALTER ROLE`، أو عُدِّل أحدهما دون الآخر.

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_RUNTIME_ROLE_SWITCH_APPROVAL
SELECTED_PHASE: P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION (retry-3, secret file)
USER_VISIBLE_ON_WEBSITE: NO_CHANGE
PRODUCTION_DEPLOYED: NO (لا تغيير)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres (دون تغيير)
APP_ROLE_SUPERUSER: (target=false؛ لم يُطبَّق)
APP_ROLE_BYPASSRLS: (target=false؛ لم يُطبَّق)
RLS_FORCE_COUNT: 120
RLS_RUNTIME_ENFORCEMENT: NOT_YET
RLS_ENFORCEMENT_RESULT: N/A (لم يُبدَّل الدور)
TENANT_ISOLATION_TEST: N/A
APP_TENANT_ID_CONNECTION_SCOPE_RESULT: PASS (جاهز ومنشور)
AUDIT_TRAIL_POLICY_RESULT: LIVE
LOGAUDIT_STAMPING_RESULT: LIVE
HEALTH_SMOKE: PASS (postgres الحالي)
PM2_STATUS: online (restarts=3، دون restart)
REDIS_STATUS: connected
DDL_EXECUTED: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
ENV_BACKUP_PATH: ~/nama_deploy_backups/rls_role_switch_20260621/.env.before-switch.bak
ROLLBACK_READY: YES
ROLLBACK_USED: NO (لم يُغيَّر شيء)
SECRETS_FOUND: FILE_PRESENT_BUT_VALUE_MISMATCH
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: ALIGN_FILE_PASSWORD_WITH_ROLE_OUTSIDE_CHAT_THEN_RETRY
```

## ما المطلوب لإكمال التبديل (دون كتابة السر في الشات)
وحّد قيمة الملف مع كلمة مرور الدور بإحدى طريقتين خارج الشات:
1. اكتب في `C:\Users\ice\nama_medical_app_db_password` كلمة مرور `nama_medical_app` **الحالية الصحيحة بالضبط** (سطر واحد، بلا فراغ بادئ/زائل، بلا BOM)، أو
2. `ALTER ROLE nama_medical_app PASSWORD '<نفس قيمة الملف>'` (يُنفّذها المالك؛ لا أُغيّرها أنا).

ثم أعد إصدار `SECRET_READY_EXECUTE_SWITCH`. عند SUCCESS لـ probe الاتصال، أُكمل البوابات 4–11 (تبديل ذرّي `DB_USER`+`DB_PASSWORD` + restart محكوم + إثبات `current_user=nama_medical_app` + إنفاذ RLS الفعلي + regression) مع rollback فوري.

`RLS_RUNTIME_ROLE_SWITCH_RETRY3_BLOCKED_AT_SECRET_VALUE_MISMATCH — NO_CHANGES_MADE`
