# Wave 4 — Docker/Redis Auto-Recovery (candidate)

> مبني على حادثة هذه الفترة: **Docker Desktop توقّف ⟶ nama-redis غير متاح ⟶ session.regenerate(A2) جعل login 500**. عولِجت يدوياً (تشغيل Docker Desktop + docker start nama-redis + restart). candidate لمنع التكرار. لا أسرار في السجلّات.

## الفجوة
الـwatchdog الحالي (كل 5 د) يعالج **Redis-down عندما يكون الـdaemon حياً** (`docker start nama-redis` + `pm2 resurrect`)، لكنه **لا يغطّي توقّف Docker daemon نفسه** (الأمر `docker` يفشل بلا daemon).

## خيارات استرداد Docker daemon
1. **مراقبة + تشغيل Docker Desktop**: توسعة الـwatchdog: إن فشل `docker info`، يشغّل `Docker Desktop.exe` وينتظر الـdaemon ثم `docker start nama-redis`. (الأبسط؛ يبقى تبعية Docker Desktop.)
2. **Redis كخدمة Windows native** (يزيل تبعية Docker للجلسات): تشغيل Redis (memurai/redis-windows) كخدمة Windows مع auto-start — يُلغي اعتماد التطبيق على Docker daemon لمخزن الجلسات. **الأقوى** لإزالة نقطة الفشل.
3. **WSL2 systemd / Docker engine بلا Desktop**: تشغيل محرّك Docker كخدمة دون واجهة Desktop.

## فحوص تبعية PM2
قبل بدء التطبيق: التحقّق من Redis PONG (يوجد سكربت إقلاع `nama_pm2_resurrect.ps1` ينتظر PONG)؛ توسعته ليشمل استرداد الـdaemon (الخيار 1) قبل الانتظار.

## تنبيه قائم على الصحة
`/api/health` + watchdog؛ إضافة تنبيه (سجلّ/إشعار بلا أسرار) عند: daemon down، Redis down >N دقائق، فشل login مرتبط بالجلسات.

## استراتيجية إعادة تشغيل آمنة
استرداد Redis أولاً (daemon→container→PONG) ثم `pm2 resurrect`/restart؛ تفادي حلقة إعادة تشغيل (حدّ محاولات + backoff)؛ لا طباعة أسرار في السجلّات (الـwatchdog الحالي يدوّر عند ~1MB ولا يسجّل أسراراً).

## خطة rollback
كل التغييرات infra-only (Scheduled Task/خدمة)؛ التراجع = `Unregister-ScheduledTask` / إيقاف الخدمة + إزالة قيم HKCU Run. لا مساس بالتطبيق/DB.

## توصية
**الخيار 2 (Redis خدمة Windows native)** كحلّ جذري يزيل تبعية Docker daemon لمخزن الجلسات؛ + الخيار 1 كشبكة أمان للـDocker daemon لبقية الحاويات. تنفيذ ببوابة `APPROVE_PHASE_D_OBSERVABILITY_CANDIDATE`/infra.

```text
OPS_AUTORECOVERY_STATUS: CANDIDATE_READY
SECRETS_IN_LOGS: NO | PRODUCTION_CHANGES: NONE (candidate)
```
