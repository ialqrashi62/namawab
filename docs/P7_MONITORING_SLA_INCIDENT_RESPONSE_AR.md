# PHASE 7 — المراقبة / SLA / الاستجابة للحوادث

> 2026-06-22 | إطار مراقبة وتشغيل.

## المراقبة الحالية (منشورة)
- **health watchdog**: Scheduled Task كل 5 دقائق؛ يفحص /api/health؛ عند السقوط docker start nama-redis + pm2 resurrect؛ يسجّل OK (تدوير 1MB).
- **PM2**: logon resurrect (HKCU Run) + dump.pm2.
- **Redis**: nama-redis unless-stopped؛ Docker autostart.

## توصية قواعد التنبيه (recommendation)
```text
- health ≠ 200 لـ>2 فحص متتالٍ ⇒ تنبيه عالٍ
- pm2 restart_time يقفز ⇒ crash-loop ⇒ تنبيه
- redis PONG يفشل ⇒ تنبيه
- watchdog log يُظهر "recovery" متكرر ⇒ تحقيق
```

## مسودة SLA
```text
- توافر مستهدف: best-effort single-box (لا HA حالياً)
- RTO (استرداد): دقائق (watchdog auto + resurrect)
- RPO (فقد بيانات): حسب دورية النسخ الاحتياطي (موصى يومي)
```

## مستويات شدّة الحادثة
```text
SEV1: الخدمة ساقطة (health≠200) — استرداد فوري (P4 runbook)
SEV2: تدهور (بطء/أخطاء جزئية) — تحقيق + مراقبة
SEV3: تجميلي/غير حرج — جدولة
```

## قائمة الاستجابة
1. أكّد health/PM2/Redis. 2. اقرأ watchdog.log + pm2 logs. 3. استرداد (P4). 4. إن استمر: rollback كود/DB (بموافقة DDL). 5. قالب تقرير ما بعد الحادثة (السبب الجذري/الإجراء/الوقاية).

```text
MONITORING_SLA_INCIDENT: FRAMEWORK_READY (alerting rules = recommendation)
```
