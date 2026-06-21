# Gate 3 (Retry-3) — Safe Secret Source Probe (RLS Runtime Role Switch)

> المرحلة: `P0_RLS_RUNTIME_ROLE_SWITCH_RETRY_WITH_SAFE_SECRET_SOURCE` | التاريخ: 2026-06-21 | بلا طباعة أي قيمة سرّية.

## المصدر
```text
ملف السر: C:\Users\ice\nama_medical_app_db_password — موجود وقابل للقراءة
```

## فحص صيغة الملف (ميتاداتا فقط، بلا أي قيمة)
```text
byte_length: 63 ; encoding: ASCII أحادي البايت ؛ لا BOM (UTF-8/UTF-16)
trim: raw=63 → trimmed=62 (يُزيل محرف فراغ واحداً) ؛ آخر بايتين = 'll' (ليس سطراً جديداً)
=> يوجد محرف فراغ بادئ واحد (leading whitespace) ؛ لا فراغ زائل ؛ لا محارف تحكّم داخلية
```

## محاولات القراءة المشروعة (تطبيع ترميز/فراغ فقط — ليست تخميناً)
```text
1) القيمة الخام (63 محرفاً، بلا أي تجريد لسطر زائل) → connect probe = FAILED (28P01)
2) القيمة المُجرَّدة .trim() (62 محرفاً، بلا فراغ بادئ/زائل) → connect probe = FAILED (28P01)
```

## النتيجة
```text
TARGET_DB_USER_SECRET_PRESENT: FILE_PRESENT_BUT_VALUE_MISMATCH
TARGET_ROLE_CONNECT_PROBE: FAILED (28P01 invalid_password) على كلا الصيغتين
SECRET_PRINTED: NO
DECISION: STOP — لا تعديل .env، لا restart (التزاماً بقاعدة Gate 3)
```

## التشخيص (دون أي سر)
الملف موجود ومقروء، لكن قيمته (سواء الخام 63 أو المُجرَّدة 62) **لا تطابق كلمة مرور الدور `nama_medical_app`** الحالية في القاعدة (scram رفضها بـ 28P01). أي: محتوى الملف ≠ كلمة مرور الدور. لم أُجرِّب أي صيغ أخرى (تجنّباً للتخمين). توقّفت عند صيغتين مشروعتين فقط.

## ما المطلوب (دون كتابة السر في الشات)
وحّد القيمتين بإحدى طريقتين خارج الشات:
1. ضع في `C:\Users\ice\nama_medical_app_db_password` **كلمة مرور `nama_medical_app` الحالية الصحيحة بالضبط** (سطر واحد، بلا فراغ بادئ/زائل، بلا BOM).
2. أو أعد ضبط كلمة مرور الدور لتطابق محتوى الملف: `ALTER ROLE nama_medical_app PASSWORD '<نفس قيمة الملف>'` (يُنفّذها المالك خارج الشات؛ لا أُغيّر أنا كلمة مرور دور).

ثم أعد إصدار `SECRET_READY_EXECUTE_SWITCH`. سأُعيد probe الاتصال؛ عند SUCCESS أُكمل التبديل الذرّي + restart + إثبات الدور + إنفاذ RLS + regression مع rollback فوري.

`SAFE_SECRET_PROBE: FILE_PRESENT_VALUE_MISMATCH — NO_CHANGES_MADE`
