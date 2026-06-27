# P0 — إغلاق استعادة إنفاذ RLS عبر دور التشغيل (Final Closeout)

> المرحلة: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` — البوابة 9 | التاريخ: 2026-06-21.

## الخلاصة
**الجاهزية مكتملة**؛ التحويل الفعلي **محجوب على سرّ** يجب أن يوفّره المالك بقناة آمنة. لم يُنفَّذ أي تحويل/تغيير في هذه الجولة (read-only فقط) — التطبيق يبقى يعمل بدور `postgres` كما هو (مستقر، لا انقطاع).

## لماذا BLOCKED (وليس تنفيذاً)
- التحويل (Gate 6) يتطلّب وضع كلمة مرور `nama_medical_app` في بيئة التطبيق (`DB_PASSWORD`).
- `pg_hba` يفرض **scram-sha-256** على كل اتصالات local/host (لا trust) ⇒ يلزم السرّ الفعلي.
- السرّ مضبوط **خارج git** (`has_password=true`) وغير معروف لي، **ولا يجوز تخمينه** (مُنع تلقائياً — صواب).
- التحويل بسرّ خاطئ ⇒ فشل مصادقة DB عند الإقلاع ⇒ **crash-loop ⇒ الموقع يسقط**. لذا التوقّف هو السلوك الآمن (RLS_AUTOPILOT_BLOCKER).

## ما الذي اكتمل (جاهزية كاملة)
- الدور `nama_medical_app`: login=t, **super=f, bypassrls=f** ✅
- الصلاحيات: SELECT/INSERT/UPDATE/DELETE على **149/149** جدولاً + 147 sequence + schema usage + functions ✅ (لا GRANTs ناقصة)
- لا DDL على الإقلاع في الإنتاج (`initDatabase` يخرج مبكراً) ✅
- RLS: 115 FORCE / 115 policies ✅ (ستُطبَّق فور التحويل)
- خطة التراجع جاهزة (تغيير `.env` + restart) ✅

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_RUNTIME_ROLE_SWITCH_APPROVAL
USER_VISIBLE_ON_WEBSITE: YES (التطبيق يعمل كما هو بدور postgres؛ لم يتغيّر شيء)
PRODUCTION_DEPLOYED: NO (لا تحويل نُفِّذ في هذه الجولة)
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres (لم يتغيّر — محجوب)
APP_ROLE_SUPERUSER: true (postgres الحالي) — الهدف nama_medical_app=false
APP_ROLE_BYPASSRLS: true (postgres الحالي) — الهدف nama_medical_app=false
RLS_FORCE_COUNT: 115
RLS_POLICY_COUNT: 115
GRANTS_APPLIED: YES (مسبقاً عبر app_runtime_role_candidate.sql؛ 149/149 DML) — لا جديد
GRANTS_ROLLBACK_READY: YES (app_runtime_role_rollback_notes.sql)
ENV_BACKUP_PATH: (سيُؤخذ عند التحويل) نسخة محلية من namaweb/.env خارج المستودع
PM2_STATUS: online (restarts=0) — دون تغيير
HEALTH_SMOKE: PASS (التطبيق الحالي)
RLS_ENFORCEMENT_RESULT: NOT_YET (محجوب على التحويل)
REFUND_IDOR_STILL_FIXED: YES (8f012a0 منشور)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
ROLLBACK_READY: YES
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: OWNER_PROVIDES_nama_medical_app_SECRET_SECURELY_THEN_EXECUTE_SWITCH (Gate 6-8)
```

## المطلوب من المالك لرفع الحجب (بقناة آمنة، لا في الشات/git)
1. ضبط/تأكيد كلمة مرور `nama_medical_app` (مثلاً عبر `ALTER ROLE ... PASSWORD` أو secret manager).
2. ضبط متغيّري بيئة اتصال التطبيق في `namaweb/.env`: مستخدم القاعدة = `nama_medical_app`، وقيمة كلمة المرور المقابلة (القيمة تضعها أنت، لا تُطبع هنا) — أو تضع أنت قيمة كلمة المرور ثم أغيّر أنا اسم المستخدم فقط.
3. منح صريح بتنفيذ: تغيير `.env` + `pm2 restart` + smoke/regression.
عندها أُكمل Gate 6 (تحويل) → Gate 7 (تحقّق إنفاذ RLS فعلياً: tenant999→0) → Gate 8 (regression) → إغلاق `PRODUCTION_DEPLOYED_PASS`.

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE_CLOSEOUT_COMPLETE (BLOCKED)`
