# NM_OBSERVABILITY_OPS_SKILL

**الغرض**: التشغيل/المراقبة/التعافي. **التفعيل**: بوابات Phase D ops/observability/incident.

## الحالة المثبتة
- watchdog (`ops/watchdogs/nama_health_watchdog.ps1`، كل 5د): يفحص health؛ عند الفشل **يستردّ Docker daemon** (يشغّل Docker Desktop + ينتظر) ثم `docker start nama-redis` + `pm2 resurrect` + سطر ALERT. (حادثة Docker daemon down → login 500 عولِجت.)
- إقلاع: `ops/startup/nama_pm2_resurrect.ps1` (HKCU Run) ينتظر Redis PONG.
- نسخ مجدول: `ops/backups/nama_local_backup.ps1` (pg_dump عبر pgpass، خارج git).

## candidate (موافقة مالك)
**Redis كخدمة Windows native** (يزيل تبعية Docker daemon لمخزن الجلسات — الحل الجذري) · alerting خارجي · uptime/backup monitors.

## القواعد
infra-only (لا app/DB/.env)؛ reversible؛ لا أسرار في السجلّات؛ تغييرات watchdog إضافية + parse OK + تشغيل healthy قبل الاعتماد.

## حقول الإغلاق
`DOCKER_DAEMON_RECOVERY · WATCHDOG_STATUS · REDIS_NATIVE_STATUS · PM2_DEPENDENCY_CHECK · PRODUCTION_CHANGES(SAFE_LOCAL/NONE)`.
