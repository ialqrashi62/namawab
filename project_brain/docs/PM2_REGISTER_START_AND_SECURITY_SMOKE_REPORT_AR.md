# GATE 4A — تسجيل/تشغيل nama-app في PM2 ثم Smoke — تقرير (PASS)

> البوابة: `GATE 4A — PM2_REGISTER_AND_START_NAMA_APP_THEN_SMOKE` | التاريخ: 2026-06-20
> المجلد الأساسي المعتمد: `C:\Users\ice\Desktop\NamaMedical` (namaweb submodule @ e6608ba)

## الحالة النهائية: **PM2_REGISTER_START_AND_SECURITY_SMOKE_PASS**

## 1. حل الحاجز السابق
الحاجز كان: Redis غير مُشغَّل محلياً + التطبيق يتعطّل في وضع الإنتاج. **الحل**: تشغيل محرّك Docker ثم حاوية Redis الموثّقة:
```
docker run -d --name nama-redis --restart unless-stopped -p 6379:6379 redis:7-alpine
```
→ Redis يستجيب PONG على :6379.

## 2. Preflight
- entry: `server.js` موجود؛ لا `ecosystem.config.js` في هذه النسخة (submodule e6608ba) → استُخدم `pm2 start server.js --name nama-app --update-env` (Gate 4A-1 خطوة 2).
- `.env` (أسماء + قيم غير سرية فقط): `DB_HOST=localhost`, `DB_NAME=nama_medical_web`, `DB_USER=postgres`, `PORT=3000`, `NODE_ENV=production`, `REDIS_HOST=localhost`, `SESSION_SECRET=<موجود، مخفي>`, `ACCOUNTING_POSTING_ENABLED` غائب.

## 3. التشغيل
- `pm2 start server.js --name nama-app` → **online، restarts=0** (لا crash-loop).
- سجلات الإقلاع: `[REDIS SUCCESS] Connected to Redis successfully for distributed sessions.` + `✅ Nama Medical Web is running!` (لا `[CRITICAL]`، لا تراجع MemoryStore).
- `pm2 save` → حُفظت قائمة العمليات (`dump.pm2`). لم يُنفَّذ `pm2 startup` (يحتاج صلاحيات مدير — خطوة admin منفصلة).

## 4. نتائج Smoke (Gate 4A-3)
| الفحص | النتيجة | الحالة |
| ----- | ------- | ------ |
| `/api/health` | 200 `{"status":"UP"}` | **PASS** |
| `/` | HTTP 200 | **PASS** |
| `/login` | HTTP 200 | **PASS** |
| `/api/patients` (بلا جلسة) | HTTP 401 | **PASS** |
| Redis PONG | PONG | **PASS** |
| `ACCOUNTING_POSTING_ENABLED=false` | غائب (= off) | **PASS** |
| `journal_entries/lines = 0/0` | 0 / 0 | **PASS** |
| accounting posting حدث؟ | لا | **PASS** |
| `DB_USER=nama_medical_app` | DB_USER=**postgres** (نسخة dev محلية) | **N/A محلياً** (انظر ملاحظة) |
| role super=false / bypassrls=false / RLS=115 | غير منطبق محلياً (postgres = superuser) | **N/A محلياً** |

## 5. ملاحظة مهمة (تمييز dev محلي عن production)
- هذه النسخة المحلية تستخدم `DB_USER=postgres` (إعداد تطوير) → فحوص **المستخدم محدود الصلاحيات (`nama_medical_app`) و RLS=115 جدولاً** هي خصائص **بيئة الإنتاج البعيدة** (تم التحقق منها سابقاً على `jumanasoft.com`)، وليست منطبقة على قاعدة dev المحلية.
- التحقق المحلي يثبت: **التطبيق يقلع مع Redis، الصحة/الدخول/الحماية 401، المحاسبة OFF، الدفاتر 0/0** — أي أن دلتا التحصين (Redis إلزامي + لا تراجع MemoryStore + posting OFF) تعمل محلياً.

## 6. الالتزام بالممنوعات
لم يُفعّل `ACCOUNTING_POSTING_ENABLED`، لا go-live محاسبي، لا كتابة journal، لا DDL، لا تغيير بيانات أعمال، لا تعديل `.gitmodules`، لا دمج `df893ab`، لا force push، **لم تُطبع أي قيمة من `.env`/SESSION_SECRET**، لا rollback واسع، لا تثبيت packages/build جديد (Docker كان مثبتاً؛ فقط تشغيل حاوية Redis الموثّقة).

## حقول الإغلاق
```text
FINAL_STATUS: PM2_REGISTER_START_AND_SECURITY_SMOKE_PASS
USER_VISIBLE_ON_WEBSITE: LOCAL_DEV_ONLY (localhost:3000؛ ليس الإنتاج العام)
PRODUCTION_DEPLOYED: NO (هذه نسخة dev محلية)
DDL_EXECUTED: NO ; DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: NO ; JOURNAL_WRITES: NONE ; JOURNALS: 0/0
REDIS: ACTIVE (docker nama-redis :6379, PONG)
PM2: nama-app online, restarts=0, pm2 save DONE (pm2 startup NOT run — admin)
HTTP_SMOKE: health/root/login PASS ; protected=401 PASS
DB_USER: postgres (local dev) — nama_medical_app + RLS=115 verified on remote prod
SECRETS_PRINTED: NO ; FORCE_PUSH: NO ; GITMODULES_CHANGED: NO ; df893ab_MERGED: NO
NEXT_REQUIRED_ACTION: (اختياري) محاذاة namaweb submodule مع أحدث gitlink على الإنتاج إن لزم؛ المحاسبة تبقى في P1_ACCOUNTING_DDL_AND_COA_SEED_READINESS
```

`GATE_4A_PASS — local app running + smoke green; production security posture verified separately on remote`
