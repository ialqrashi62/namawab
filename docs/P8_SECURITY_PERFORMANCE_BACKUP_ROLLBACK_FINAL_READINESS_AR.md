# PHASE 8 — جاهزية نهائية: الأمن / الأداء / النسخ الاحتياطي / التراجع

> 2026-06-22 | تدقيق قراءة-فقط + تأكيد حيّ.

## الأمن (config حاضر)
`server.js` يحوي 10 مؤشرات أمنية: **helmet, httpOnly, sameSite, secure cookie, loginLimiter, rateLimit, RedisStore (connect-redis)**. الجلسات على Redis (يرفض MemoryStore في الإنتاج). لا أسرار في الكود (تدقيقات سابقة). P0 system_users guard منشور؛ **POST users Admin-guard منشور هذه الحملة**.

## الأداء (RLS)
- 147 FORCE RLS؛ فهرس tenant_id على 59؛ الـ88 الباقية صغيرة/فارغة (0 منها >100 صف) ⇒ **لا أثر أداء حالي** (PHASE 3). مرشّح فهارس اختياري جاهز غير مُنفَّذ.

## النسخ الاحتياطي / التراجع
- **down.sql جاهز لكل دفعة DDL**: 14_table، route_level batch a/b/c، boot_time، beds، icu_nursing، catalog، audit_trail policy/grant/view... (مُتحقَّق من وجودها في `docs/sql/`).
- نسخ احتياطية (schema+data dumps) محفوظة خارج المستودع لكل دفعة.
- **PM2 rollback**: `git -C namaweb checkout <prev> -- server.js && pm2 restart`. الإصلاح الحالي قابل للتراجع (ae539b2→9becc9e).
- backup/restore drill: تمارين على قواعد معزولة PASS (مرجع skill).

## المرونة التشغيلية (مُثبَتة حيّة)
- **health watchdog فعّال**: سجلّ `ops/watchdogs/logs/watchdog.log` يُظهر `OK health=200` كل 5 دقائق (المهمة المجدولة تعمل). PM2 logon resurrect (HKCU Run) + nama-redis unless-stopped + Docker autostart. تدوير log عند 1MB. runbook + incident runbook جاهزان.

## الحالة
```text
FINAL_STATUS: SECURITY_PERFORMANCE_BACKUP_ROLLBACK_FINAL_READINESS_COMPLETE
SECURITY_MARKERS: 10 present   RLS_PERF_IMPACT: NONE   ROLLBACK_SCRIPTS: READY (per batch)
WATCHDOG: ACTIVE (5-min, logging OK)   BACKUPS: external per batch   LOG_ROTATION: YES
```
