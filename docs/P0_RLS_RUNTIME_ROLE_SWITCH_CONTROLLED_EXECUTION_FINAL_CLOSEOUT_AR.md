# P0 — إغلاق تبديل دور RLS (BLOCKED at Gate 3 — السر غير قابل للاستخدام)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION` | تفويض: `SECRET_READY_EXECUTE_SWITCH` | التاريخ: 2026-06-21.

## الخلاصة
توقّفت المرحلة عند **Gate 3 (Secret Presence Check)** لأن سر `nama_medical_app` **غير موجود بصورة قابلة للاستخدام في البيئة**. **لم يُغيَّر أي شيء**: `.env` ما زال `DB_USER=postgres`، التطبيق يعمل على postgres (online، health 200)، لا restart، لا rollback لازم.

## ما تم التحقق منه
- **Gate 0 PASS**: متزامن، 10ded01، online/200، RLS_FORCE=120، journal=0، DB_ROLE=postgres.
- **Gate 1 PASS**: `nama_medical_app` جاهز (login=true، super=false، bypassrls=false، DML 149/149، sequences 147/147).
- **Gate 2**: backup للـ.env و pm2 جاهز (rollback متاح).
- **Gate 3 FAIL (السبب)**: اختبار اتصال كدور `nama_medical_app` باستخدام `DB_PASSWORD` الموجودة في `.env` رجع **`28P01 invalid_password`**. مفاتيح `.env` المتاحة: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_MAX_CONNECTIONS, PORT, SESSION_SECRET, NODE_ENV, REDIS_HOST — **لا يوجد متغيّر كلمة مرور مخصص لـ nama_medical_app**، و`DB_PASSWORD` الحالية تخص `postgres` (التطبيق يعمل بها كـ postgres).

## التشخيص (بدون أي سر)
التطبيق (`db_postgres.js`) يقرأ `process.env.DB_USER` و`process.env.DB_PASSWORD` فقط. للتبديل يجب أن تتوفّر **كلمة مرور `nama_medical_app` الصحيحة في `DB_PASSWORD`** عند إعادة التشغيل. حالياً `DB_PASSWORD` = كلمة مرور postgres ≠ كلمة مرور nama_medical_app، فلا يصح قلب `DB_USER` وحده (سيُخفق المصادقة ويدخل crash-loop). pg_hba يسمح بالاتصال (وصلنا لفحص كلمة المرور = 28P01)، والدور والصلاحيات جاهزة — الناقص فقط **قيمة كلمة المرور في البيئة**.

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_RUNTIME_ROLE_SWITCH_APPROVAL
SELECTED_PHASE: P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION
USER_VISIBLE_ON_WEBSITE: NO_CHANGE (التطبيق يعمل كما هو على postgres)
PRODUCTION_DEPLOYED: NO (لا تغيير)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres (دون تغيير)
APP_ROLE_SUPERUSER: (target nama_medical_app=false، لكن لم يُطبَّق)
APP_ROLE_BYPASSRLS: (target=false، لم يُطبَّق)
RLS_FORCE_COUNT: 120
RLS_RUNTIME_ENFORCEMENT: NOT_YET
RLS_ENFORCEMENT_RESULT: N/A (لم يُبدَّل الدور)
TENANT_ISOLATION_TEST: N/A
APP_TENANT_ID_CONNECTION_SCOPE_RESULT: PASS (جاهز، منشور)
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
SECRETS_FOUND: NO (غير موجود بصورة قابلة للاستخدام)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: SET_SECRET_OUTSIDE_CHAT_THEN_SECRET_READY_EXECUTE_SWITCH
```

## ما المطلوب منك لإكمال التبديل (دون كتابة السر في الشات)
عدّل ملف **`namaweb/.env`** مباشرةً على السيرفر (خارج الشات) بحيث تصبح قيمة:
```text
DB_PASSWORD=<كلمة مرور nama_medical_app الحقيقية>
```
(اختيارياً يمكنك أيضاً ضبط `DB_USER=nama_medical_app` بنفسك؛ أو اتركه لي لأقلبه.) بديل مكافئ: نفّذ خارج الشات `ALTER ROLE nama_medical_app PASSWORD '<قيمة تساوي DB_PASSWORD الحالية>'` ليتطابق سر الدور مع القيمة الموجودة (لا أُجري أنا أي تغيير لكلمة مرور دور).

ثم أعد إصدار `SECRET_READY_EXECUTE_SWITCH`. سأُعيد فحص Gate 3 (probe اتصال يرجع SUCCESS) ثم أُكمل البوابات 4–11 (قلب DB_USER + restart محكوم + إثبات الدور + إنفاذ RLS + regression) مع rollback فوري عند أي إخفاق مصادقة.

`RLS_RUNTIME_ROLE_SWITCH_BLOCKED_AT_SECRET_CHECK — NO_CHANGES_MADE`
