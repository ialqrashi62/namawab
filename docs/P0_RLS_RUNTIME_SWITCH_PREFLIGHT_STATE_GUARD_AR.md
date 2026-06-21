# Gate 0 — حارس الحالة قبل تبديل دور RLS (Preflight State Guard)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_AFTER_PHASE_142_RLS_RUNTIME_SWITCH_OR_RESELECT` | التاريخ: 2026-06-21 | read-only.

## نتيجة الفحص
```text
LOCAL_EQUALS_ORIGIN: YES (parent f86c32d == origin/master f86c32d ; ahead/behind = 0/0)
PARENT_HEAD: f86c32d (المطلوب f86c32d أو أحدث) ✅
namaweb_DEPLOYED: 082c07b ✅
NO_OUT_OF_SCOPE_FILES: YES (الملفات غير المتعقّبة/المعدّلة كلها Stitch/UI سابقة — لم تُلمس)
NO_ENV_TRACKED: YES (.env غير متعقّب في Git)
NO_SECRETS: YES
NO_FORCE_PUSH: YES
ACCOUNTING_POSTING_ENABLED: OFF (الراية غائبة عن .env => OFF افتراضياً)
JOURNAL_COUNT: 0
PM2_STATUS: online (restarts=1 مستقر)
HEALTH: 200 (/api/health=200 ، /=200)
```

## شرط تبديل الدور — غير مُستوفى
```text
EXPLICIT_TRIGGER_SECRET_READY_EXECUTE_SWITCH: NOT_ISSUED
  (العبارة وردت في رسالة المستخدم داخل سياق القاعدة الشرطية فقط، لم تصدر كأمر تنفيذ صريح)
SECRET_PRESENT_IN_ENV: NO
  (.env DB_USER=postgres ؛ كلمة مرور nama_medical_app غير موجودة في البيئة، وموثّقة كسر خارج الشات بمصادقة scram-sha-256)
TARGET_ROLE_READY: YES (nama_medical_app: login=true, superuser=false, bypassrls=false)
```

## القرار
بما أنّ الأمر الصريح **لم يصدر** والسرّ **غير موجود في البيئة**، **يُمنع** بدء `P0_RLS_RUNTIME_ROLE_SWITCH_CONTROLLED_EXECUTION`. ننتقل إلى إعادة الاختيار (Gate 1 + Gate 2) لانتقاء أعلى عمل آمن لا يغيّر الإنتاج.

`PREFLIGHT_STATE_GUARD: PASS — SWITCH_NOT_EXECUTABLE — PROCEED_TO_RESELECT`
