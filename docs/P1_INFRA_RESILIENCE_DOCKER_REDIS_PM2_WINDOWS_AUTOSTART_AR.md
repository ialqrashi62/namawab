# PHASE 1 — صمود البنية (Docker / Redis / PM2 / Windows autostart / watchdog)

> البرنامج: POST_RLS_FULL_SYSTEM_HARDENING — PHASE 1 | 2026-06-21 | تدقيق قراءة-فقط + خطة. لا تغيير OS/startup بلا موافقة.
> الدافع: حادثة 2026-06-21 (Docker Desktop توقّف ⇒ Redis سقط ⇒ التطبيق DOWN، لم يُحيَ تلقائياً).

## التدقيق (قراءة-فقط)
| الطبقة | الحالة | التقييم |
|---|---|---|
| nama-redis restart policy | `unless-stopped` | ✅ يعود مع daemon |
| Docker Desktop autostart | HKCU `...\Run` فيه `Docker Desktop.exe` | ✅ يبدأ عند الدخول؛ ⚠️ لا يحمي من إغلاق/تعطّل أثناء الجلسة |
| **PM2 Windows startup** | `pm2 startup` ⇒ "Init system not found" | 🔴 **الفجوة الرئيسية**: التطبيق لا يُحيَ تلقائياً بعد reboot/logout/موت daemon |
| pm2 dump (save) | حاضر ومحدَّث | ✅ resurrect يدوي يعمل (أُثبت في الحادثة) |
| port 3000 | للتطبيق فقط (يُستخدم في المحاكاة منفذ بديل) | ✅ |
| log rotation | غير مؤكَّد (pm2 logs بلا rotation افتراضي) | ⚠️ يُنصح بـpm2-logrotate |

## الخطة (candidate، تحتاج موافقة OS/startup)
1. **PM2 auto-resurrect على Windows (الأهم)**: `pm2-windows-startup` أو Task Scheduler عند الدخول/الإقلاع يشغّل `pm2 resurrect`.
2. **Docker Desktop كخدمة** (اختياري) لتفادي توقّفه بانتهاء جلسة المستخدم؛ مع تأكيد autostart.
3. **Health watchdog**: مهمة مجدوَلة كل 2–5 دقائق: فحص `/api/health` ⇒ عند الفشل `docker start nama-redis` ثم `pm2 resurrect` + تنبيه.
4. **pm2-logrotate**: تدوير السجلات (حجم/يوم) لتفادي تضخّمها.
5. **Incident runbook** (مُجرَّب): Docker Desktop → انتظار daemon → `docker start nama-redis` (PONG) → `pm2 resurrect` → تحقق health=200 + binding.
6. **Reboot recovery**: مع (1)+(2)، الإقلاع يستعيد Docker→Redis→app تلقائياً.

## الحالة
```text
FINAL_STATUS: INFRA_RESILIENCE_PLAN_READY_PENDING_OWNER_APPROVAL
KEY_GAP: PM2 لا يُحيَ تلقائياً على Windows
REDIS_RESTART_POLICY: unless-stopped (OK)   DOCKER_AUTOSTART: configured (login)
NEXT_REQUIRED_ACTION: APPROVE_PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG
```
لم يُنفَّذ أي تغيير startup/OS؛ خطة فقط (تحتاج صلاحيات نظام التشغيل + موافقة صريحة).
