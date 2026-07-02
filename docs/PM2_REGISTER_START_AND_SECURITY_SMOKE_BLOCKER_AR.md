# GATE 4A — تسجيل/تشغيل nama-app في PM2 ثم Smoke — تقرير الحاجز (BLOCKER)

> البوابة: `GATE 4A — PM2_REGISTER_AND_START_NAMA_APP_THEN_SMOKE` | التاريخ: 2026-06-20
> بيئة التشغيل: `C:\Users\ice\Desktop\11\newfolder\NamaMedical\namaweb` (نسخة محلية، NODE_ENV=production)

## الحالة النهائية: **PM2_REGISTER_START_AND_SECURITY_SMOKE_BLOCKED**

## 1. Preflight (PASS)
- `server.js` ✓، `package.json` (start=`node server.js`) ✓، `ecosystem.config.js` (يعرّف `nama-app`، fork، NODE_ENV=production، أسرار من .env) ✓.
- المنفذ 3000: غير مستخدم قبل البدء. PM2: فارغ (لا `nama-app`).
- `.env` (حضور المفاتيح فقط، **بلا عرض أي قيمة**): `DB_USER=nama_medical_app` ✓ ، `SESSION_SECRET` موجود ✓ ، `ACCOUNTING_POSTING_ENABLED=true` **غائب** (= ليس true) ✓ ، `PORT=3000` ، `NODE_ENV=production`.

## 2. طريقة التشغيل المختارة
استُخدم `ecosystem.config.js` (Gate 4A-1 خطوة 1) لأنه يعرّف `nama-app` بشكل سليم وخالٍ من الأسرار.

## 3. سبب الحاجز (Root Cause)
- **Redis غير مُشغَّل محلياً** (`:6379` لا يستمع).
- التطبيق في وضع الإنتاج **مُحصَّن عمداً ليتعطّل (crash) بدلاً من التراجع إلى MemoryStore**:
  - `[REDIS WARNING] Could not connect to Redis, session store falling back to MemoryStore:`
  - `[CRITICAL] Redis connection error in production. Crashing to prevent insecure fallback.`
- النتيجة: `nama-app` يدخل **حلقة إعادة تشغيل (crash-loop)** ولا يخدم `:3000` بثبات.

> هذا **سلوك أمني صحيح ومطلوب** (لا تراجع غير آمن للجلسات)، لكنه يمنع تشغيل التطبيق محلياً بدون Redis.

## 4. نتائج Smoke (Gate 4A-3)
| الفحص | النتيجة |
| ----- | ------- |
| PM2 nama-app يبقى online بثبات | **FAIL** (crash-loop بسبب Redis) |
| `/api/health` = 200 | **FAIL** (رفض الاتصال — الخادم غير مستقر) |
| `/` = 200 | **FAIL** (رفض الاتصال) |
| `/login` = 200 | **FAIL** (رفض الاتصال) |
| `/api/patients` = 401 | **FAIL** (لا خادم مستقر) |
| Redis PONG | **FAIL** (Redis غير مُشغَّل) |
| `ACCOUNTING_POSTING_ENABLED=false` | **PASS** (غائب في .env) |
| `DB_USER=nama_medical_app` | **PASS** |
| journal_entries/lines = 0/0 | **NOT_VERIFIED** (لا خادم؛ ولم يحدث أي posting) |
| accounting posting occurred | **NO** (لم يُفعّل، لا كتابة journal) |

## 5. الإجراءات والتنظيف
- لم يُفعّل `ACCOUNTING_POSTING_ENABLED`، لا go-live محاسبي، لا كتابة journal، لا DDL، لا تغيير بيانات، لا تعديل `.gitmodules`، لا دمج `df893ab`، لا force push، لا تثبيت packages/build.
- **لم تُطبع أي قيمة من `.env` أو `SESSION_SECRET`** (سجلات Redis لا تحوي سلسلة اتصال؛ dotenv يطبع عدد المتغيرات فقط).
- **تنظيف الإجراء الفاشل**: نُفّذ `pm2 delete nama-app` لإزالة العملية المتعطّلة وإعادة PM2 إلى حالته الفارغة قبل البوابة (ليس rollback واسعاً — مجرد تنظيف لبدء فاشل). **لم يُنفّذ `pm2 save`** (لأن smoke لم ينجح).
- **توقفت فوراً عند الفشل** (التزاماً بالقاعدة) — بلا rollback واسع.

## 6. الإجراء التالي المطلوب (يحتاج موافقة إضافية)
لإكمال Gate 4A يجب توفير Redis محلياً على `:6379` (خارج النطاق المصرّح حالياً — تشغيل خدمة جديدة). الخيار الموثّق في `ecosystem.config.js`:
```
docker run -d --name nama-redis --restart unless-stopped -p 6379:6379 redis:7-alpine
```
> **لن أُشغّله بدون موافقتك الصريحة** (تشغيل خدمة/حاوية جديدة). البدائل: (أ) تشغيل Redis ثم إعادة `pm2 start ecosystem.config.js` + smoke؛ (ب) تأكيد أن الـ smoke المقصود هو على خادم الإنتاج البعيد (jumanasoft.com) وليس هذه النسخة المحلية.

## حقول الإغلاق
```text
FINAL_STATUS: PM2_REGISTER_START_AND_SECURITY_SMOKE_BLOCKED
USER_VISIBLE_ON_WEBSITE: NO
PRODUCTION_DEPLOYED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: NO ; JOURNAL_WRITES: NONE
SECRETS_PRINTED: NO ; SESSION_SECRET_PRINTED: NO
PM2_SAVE_EXECUTED: NO ; FAILED_START_CLEANED: YES (pm2 delete)
FORCE_PUSH: NO ; GITMODULES_CHANGED: NO ; df893ab_MERGED: NO
ROLLBACK_WIDE: NO
ROOT_CAUSE: Redis not running locally (:6379) + production hardening crashes instead of insecure MemoryStore fallback
NEXT_REQUIRED_ACTION: approve local Redis (docker redis:7-alpine on :6379) then re-run pm2 start ecosystem.config.js + smoke ; OR confirm smoke target is remote production
```

`BLOCKER_DOCUMENTED — STOPPED, NO WIDE ROLLBACK`
