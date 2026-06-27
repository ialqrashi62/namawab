# إصلاحات أمنية Gate 2 + Gate 4 — Code-Only (بلا نشر) — تقرير

> 2026-06-23 | تنفيذ `APPROVE_CONTINUE_GATE2_GATE4_CODE_ONLY_NO_DEPLOY`. إصلاحات server.js **كود فقط** (خاملة حتى إعادة تشغيل PM2 — غير مفعّلة حيّاً). لا DB/DDL/migration/محاسبة/إعادة تشغيل/نشر. بُنيت ودُقّقت ثم دُفعت FF.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` (لاحقة `_SKILL_AR.md`): `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## Gate 2 — حُرّاس نقاط النهاية الإدارية
| Endpoint | قبل | بعد |
|---|---|---|
| `GET /api/admin/audit-trail` (server.js:5583) | `requireAuth` فقط ⟹ أي مستخدم يقرأ سجل التدقيق | + `if (role !== 'Admin') return 403` |
| `GET /api/admin/backup-info` (server.js:5628) | `requireAuth` فقط ⟹ كشف بيانات DB | + `if (role !== 'Admin') return 403` (مطابق لأشقّاء backup) |
لم يتغيّر contract الواجهة؛ لا كشف stack traces؛ لا أسرار في السجلّات. الآن أي endpoint إداري حسّاس لا يعمل بمجرد `requireAuth`.

## Gate 4 — تقوية المصادقة (منخفضة المخاطر، بلا schema/env/أسرار)
- **portal users (4390)**: استُبدل الافتراضي المخمَّن `'123456'` بكلمة عشوائية `crypto.randomBytes(18)` عند عدم تمرير كلمة — أُزيل الاعتماد المخمَّن دون تغيير الـcontract.
- **telemedicine link (4438)**: `Math.random()` → `crypto.randomBytes(16)` — روابط غير قابلة للتخمين.
- **`/api/mfa/verify` (348)**: `mfaVerify` → `mfaConsume(uid, ...)` — حماية إعادة الاستخدام (replay). مسار self-disable (409) تُرك كما هو (محمي بكلمة المرور + يُفرّغ السر بعدها، لا bypass واضح).
- **fail-fast للأسرار**: `SESSION_SECRET` (server.js:74) و`DB_PASSWORD` (db_postgres.js:10) يرفضان الإقلاع في الإنتاج عند الغياب بدل fallback خطير — وأُزيلت السلسلة الثابتة المُلتزَمة للـSESSION_SECRET. (لم يُغيَّر أي سرّ فعلي؛ القيم مضبوطة في .env فلا أثر عند إعادة التشغيل المعتمدة لاحقاً.)
- **عدم طباعة أسرار / رسائل خطأ آمنة**: لم تُضَف أي طباعة أسرار؛ الرسائل عامة (403/400) دون كشف تفاصيل.

## ما لم يُنفَّذ ولماذا
- **Gate 3 (CORS/CSRF/CSP)**: محجوب (خطر انحدار أعلى، يحتاج تحقّق مقابل الواجهة) — بطلبك.
- **Layer 2 XSS (المُصيّرات المخصّصة/البطاقات)**: محجوب — بوابة منفصلة.
- **bcrypt cost 10→12**: تُرك (مقبول، ليس ثغرة؛ خارج النطاق المطلوب).
- **tenant-scoping لسجل التدقيق**: الحارس الإداري كافٍ للبوابة؛ توسعة لاحقة إن لزم.

## التفعيل والنشر
- **يحتاج PM2 restart للتفعيل: نعم** (server.js يُحمَّل في الذاكرة عند الإقلاع).
- **هل أُعيد التشغيل: لا** (uptime 6h · restarts=3 دون تغيير).
- **هل التغيير حيّ: لا** لتغييرات server.js — العملية الجارية تشغّل الكود السابق؛ health 200 طوال الوقت.

## نتائج الفحوص
`node --check` server.js + db_postgres.js = OK · 7/7 guard tests PASS (a2_mfa/audit/a3/a3a/emr-lock/settings-user/employees-rbac) · `git diff --check` نظيف · secret scan على الـdiff = لا تطابق · `'123456'`=0 · `mfaConsume(uid`=3 (تعريف+login+verify) · Admin-403 guards=5 (+2).

## نتائج Mojibake
الأسطر المُضافة ASCII فقط؛ لا BOM/U+FFFD/Latin-1 mis-decode. CLEAN.

## الحقول
```text
FINAL_STATUS: GATE2_GATE4_CODE_ONLY_READY_FOR_DEPLOY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
GATE2_ADMIN_ENDPOINT_GUARDS_DONE: YES (audit-trail + backup-info, Admin-only 403)
GATE4_AUTH_HARDENING_DONE: YES (portal pw, telemed crypto link, mfa/verify replay-guard, SESSION_SECRET+DB_PASSWORD fail-fast)
SERVER_JS_CHANGED: YES (server.js + db_postgres.js)
PM2_RESTARTED: NO
CODE_DEPLOYED_LIVE: NO (server-side changes dormant until restart)
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 08de5ae
GIT_COMMIT: namaweb 7f8742b / parent f9312d6
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_DEPLOY_GATE2_GATE4_PM2_RESTART (أو APPROVE_FIX_XSS_LAYER2_CUSTOM_RENDERERS أو APPROVE_FIX_HTTP_PERIMETER_VALIDATE)
```

نُفّذت إصلاحات Gate 2 (حُرّاس الأدمن) وGate 4 (تقوية المصادقة) ككود فقط دون نشر أو إعادة تشغيل أو مساس بقاعدة البيانات أو المحاسبة؛ جاهزة للتفعيل ببوابة نشر منفصلة
