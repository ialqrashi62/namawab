# Phase D — Docker/Redis Auto-Recovery + Observability

> 2026-06-23 | عولِجت فجوة الحادثة: **Docker daemon توقّف ⟶ nama-redis ⟶ login/session 500**. نُفِّذ تحسين آمن محدود على الـwatchdog (infra، قابل للتراجع، بلا أسرار)؛ الباقي candidate.

## ما نُفِّذ (آمن، محدود، منفّذ)
**تحسين الـwatchdog** `ops/watchdogs/nama_health_watchdog.ps1` (يُقرأ من المهمة المجدولة كل 5 د):
- عند فشل `/api/health`: يفحص الآن `docker info` أولاً؛ **إن كان الـdaemon متوقفاً يُشغّل Docker Desktop وينتظر (محدود ~3 د) حتى يعود الـdaemon** ثم `docker start nama-redis` ثم PM2 resurrect.
- أُضيف سطر **ALERT** في السجلّ عند فشل الصحة بعد التعافي (إشارة بلا أسرار لانتباه يدوي/مراقبة خارجية).
- parse OK؛ تشغيل تجريبي (المسار السليم) = `OK health=200`، لم يُشغّل التعافي، التطبيق بقي 200.
- التغيير **إضافي وقابل للتراجع** (git)؛ infra فقط (لا app/DB/.env/أسرار).

## ما صُنّف candidate (يحتاج موافقة/صلاحية)
| البند | السبب | التصنيف |
|---|---|---|
| **Redis كخدمة Windows native** | يتطلّب تثبيت برنامج (memurai/redis-windows) + إنشاء خدمة + تغيير REDIS_HOST + احتمال قطع جلسات | CANDIDATE_READY_PENDING_OWNER_APPROVAL |
| health-based external alerting | إشعار خارجي (email/webhook) يحتاج config/سرّ؛ الآن سطر ALERT محلي فقط | CANDIDATE_READY (no-secret local signal منفّذ؛ الخارجي candidate) |

## ما هو قائم أصلاً (تحقّق)
- **PM2 dependency check**: `ops/startup/nama_pm2_resurrect.ps1` ينتظر Redis PONG قبل resurrect (إقلاع)؛ والـwatchdog يبدأ Redis قبل resurrect (تشغيل). مغطّى.
- **Redis PONG watchdog**: قائم (الـwatchdog يفحص PONG ضمن التعافي).
- **health alerting**: السجلّ المحلي + سطر ALERT الجديد.

## التوصية
- **جذري**: اعتماد **Redis خدمة Windows native** (يزيل تبعية Docker daemon لمخزن الجلسات نهائياً) — بوابة owner (تثبيت خدمة + تغيير config + نافذة صيانة قصيرة).
- **شبكة أمان (منفّذة)**: استرداد Docker daemon في الـwatchdog يغطّي الحالة حتى ذلك الحين.

```text
REDIS_NATIVE_SERVICE_STATUS: CANDIDATE_READY_PENDING_OWNER_APPROVAL
DOCKER_DAEMON_RECOVERY_STATUS: IMPLEMENTED (watchdog fallback, safe/reversible)
WATCHDOG_STATUS: ENHANCED + parse OK + healthy run verified
PM2_DEPENDENCY_CHECK_STATUS: PRESENT (resurrect waits for PONG)
HEALTH_ALERTING_STATUS: LOCAL_ALERT_LINE_ADDED (external alerting = candidate)
```
