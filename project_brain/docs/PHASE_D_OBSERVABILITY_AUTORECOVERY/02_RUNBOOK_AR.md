# Runbook — Docker/Redis/PM2/Health (تشغيلي)

> إجراءات يدوية آمنة عند الحوادث. بلا أسرار. لا يلمس DB/المحاسبة.

## أعراض ⟶ تشخيص
| العرَض | التشخيص السريع |
|---|---|
| login يُرجع 500 | غالباً Redis/مخزن الجلسات (session.regenerate يكتب لـRedis) |
| `/api/health` ≠ 200 | التطبيق متوقف أو تبعية (Redis) ساقطة |
| `docker ps` يفشل "daemon not running" | **Docker Desktop متوقف** (سبب الحادثة السابقة) |

## التعافي اليدوي (بالترتيب)
1. **افحص الـdaemon**: `docker info` — إن فشل: شغّل Docker Desktop:
   `Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'` وانتظر حتى يستجيب `docker info`.
2. **شغّل Redis**: `docker start nama-redis` ثم تحقّق `docker exec nama-redis redis-cli ping` ⟶ `PONG`.
3. **استعِد PM2**: `C:\nvm4w\nodejs\pm2.cmd resurrect` (أو `pm2 restart nama-app --update-env`).
4. **تحقّق**: `curl http://127.0.0.1:3000/api/health` ⟶ 200، ثم دخول تجريبي (بحساب اختبار، بلا طباعة كلمة مرور).

## التلقائي (قائم)
- **watchdog** كل 5 د (`ops/watchdogs/nama_health_watchdog.ps1`): يفحص الصحة؛ عند الفشل يستردّ الـdaemon (جديد) ثم Redis ثم PM2؛ يسجّل (مع سطر ALERT عند بقاء الفشل). السجلّ: `ops/watchdogs/logs/watchdog.log` (مدوّر ~1MB، بلا أسرار).
- **الإقلاع**: `ops/startup/nama_pm2_resurrect.ps1` (HKCU Run) ينتظر PONG ثم resurrect.

## فحص استرداد المفتاح (A3 DR)
عند الكوارث: استعادة DB من النسخة + توفير KEK من الـescrow (إجراء مالك) عبر `ops/security/nama_kek_escrow.ps1 -Mode recover`، ثم ضبط `NAMA_KEK_PATH` وإعادة التشغيل. (بدون الـescrow، البيانات المشفّرة غير قابلة للاسترداد.)

## ما لا يُفعل
لا طباعة أسرار/كلمات مرور/مفاتيح؛ لا `docker system prune`/مسح أحجام Redis؛ لا تفعيل محاسبة؛ لا force push؛ لا merge لـR17.

## التراجع (rollback)
تحسين الـwatchdog إضافي؛ التراجع = استرجاع النسخة السابقة من الملف عبر git. لا حالة دائمة تتغيّر.
