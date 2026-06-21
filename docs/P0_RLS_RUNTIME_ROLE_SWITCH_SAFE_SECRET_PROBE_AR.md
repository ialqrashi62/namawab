# Gate 3 (Retry) — Safe Secret Source Probe (RLS Runtime Role Switch)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_RETRY_WITH_SAFE_SECRET_SOURCE` | التاريخ: 2026-06-21 | بلا طباعة أي قيمة سرّية.

## ما فُحِص (مصدران آمنان فقط، كما حدّدهما التفويض)
```text
المصدر 1: متغيّر بيئة DB_APP_PASSWORD
  - [Process] : ABSENT
  - [User]    : ABSENT
  - [Machine] : ABSENT
المصدر 2: ملف كلمة المرور
  - /root/nama_medical_app_db_password           : غير موجود (مسار Linux؛ هذا صندوق win32)
  - C:\root\nama_medical_app_db_password         : غير موجود
  - C:\Users\ice\nama_medical_app_db_password    : غير موجود
  - C:\Users\ice\.secrets\...                    : غير موجود
  - C:\nama_medical_app_db_password              : غير موجود
  - C:\ProgramData\nama_medical_app_db_password  : غير موجود
```

## النتيجة
```text
TARGET_DB_USER_SECRET_PRESENT: NO
TARGET_ROLE_CONNECT_PROBE: NOT_RUN (لا مصدر سرّ متاح ⇒ لم يُجرَ probe الاتصال)
SECRET_PRINTED: NO
```

## التشخيص (دون أي سر)
بيئة التنفيذ هنا **win32، المستخدم `ice`** (PostgreSQL وPM2 أصليان على Windows). المصدران المُحدَّدان غير قابلين للوصول من هذا السياق:
- `DB_APP_PASSWORD` غير معرّف على أي نطاق Windows (Process/User/Machine) يراه أمري.
- المسار `/root/nama_medical_app_db_password` هو مسار Linux ولا وجود له على صندوق Windows هذا.

الأرجح أن السر هُيّئ على **مضيف Linux مختلف** (دلالة `/root/`) لا يطابق صندوق الـ single-box الحالي، أو ضُبط متغيّر البيئة في جلسة/مستخدم لا يرثه أمري.

## ما المطلوب (على هذا الصندوق win32، دون كتابة السر في الشات)
أحد الخيارين بحيث يصبح السر **مقروءاً لعملية المستخدم `ice`**:
1. ضبط متغيّر بيئة دائم على Windows:
   - PowerShell: `[Environment]::SetEnvironmentVariable('DB_APP_PASSWORD','<secret>','User')` (أو `'Machine'`).
   - (يصبح متاحاً للعمليات الجديدة؛ سأقرؤه عبر `process.env`/`[Environment]::GetEnvironmentVariable` دون طباعته.)
2. أو وضع الملف في مسار Windows قابل للقراءة، مثل: `C:\Users\ice\nama_medical_app_db_password` بصلاحيات محدودة.

ثم أعد إصدار `SECRET_READY_EXECUTE_SWITCH`. سأُعيد probe الاتصال كـ `nama_medical_app`؛ عند SUCCESS أُكمل التبديل الذرّي (DB_USER+DB_PASSWORD معاً) + restart + إثبات الدور + إنفاذ RLS، مع rollback فوري.

`SAFE_SECRET_PROBE: NO_SOURCE_REACHABLE — NO_CHANGES_MADE`
