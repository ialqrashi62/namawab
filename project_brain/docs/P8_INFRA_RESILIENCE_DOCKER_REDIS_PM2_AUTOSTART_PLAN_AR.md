# PHASE 8 — خطة صمود البنية (Docker / Redis / PM2 Autostart) — اقتراح، بلا تنفيذ تلقائي

> البرنامج: MASTER_AUTOPILOT الشامل — PHASE 8 | 2026-06-21 | فحص قراءة-فقط + خطة. التنفيذ يحتاج صلاحيات OS/startup ⇒ موافقة المالك.
> الدافع: حادثة 2026-06-21 (توقّف Docker Desktop ⇒ nama-redis غير متاح ⇒ التطبيق DOWN؛ لم يُحيَ تلقائياً).

## الحالة الفعلية (تحقّق)
| المكوّن | الحالة | التقييم |
|---|---|---|
| **nama-redis** restart policy | `unless-stopped`، running | ✅ يعود تلقائياً مع تشغيل Docker daemon |
| **Docker Desktop** autostart | موجود في HKCU `...\Run` (`Docker Desktop.exe`) | ✅ يبدأ عند تسجيل الدخول (لا يحمي من إغلاق يدوي أثناء الجلسة) |
| **PM2** Windows startup | **غير مُهيّأ** (`pm2 startup` ⇒ "Init system not found") | 🔴 **الفجوة**: التطبيق لا يُحيَ تلقائياً بعد reboot/logout/موت daemon |
| pm2 dump | موجود ومحدَّث (pm2 save بعد كل نشر) | ✅ resurrect ممكن يدوياً |

## السبب الجذري للحادثة
Docker Desktop توقّف أثناء الجلسة (إغلاق يدوي/تعطّل، لا reboot) ⇒ nama-redis سقط ⇒ التطبيق رفض الإقلاع (لا MemoryStore) ⇒ daemon PM2 وُجد فارغاً. لا آلية إحياء تلقائي للتطبيق.

## التوصيات (تحتاج موافقة OS/startup — لم تُنفَّذ)
1. **PM2 Windows auto-resurrect (الأهم)**: تثبيت `pm2-windows-startup` أو إنشاء مهمة Task Scheduler عند الدخول/الإقلاع تشغّل `pm2 resurrect` ⇒ يعيد nama-app تلقائياً. (الفجوة الرئيسية.)
2. **Docker Desktop**: تأكيد «Start Docker Desktop when you log in» مُفعّل (مُهيّأ في Run key) + النظر في تشغيله كخدمة لتفادي توقّفه بانتهاء جلسة المستخدم.
3. **nama-redis**: `unless-stopped` كافٍ (مؤكَّد). لا تغيير.
4. **Health watchdog**: مهمة مجدوَلة كل 2–5 دقائق تفحص `/api/health`؛ إن فشلت: `docker start nama-redis` ثم `pm2 resurrect`، وتنبيه. (سكربت + Task Scheduler.)
5. **Incident runbook** (مُجرَّب في الحادثة): تشغيل Docker Desktop → انتظار daemon → `docker start nama-redis` (PONG) → `pm2 resurrect` → تحقق health=200 + binding.
6. **pm2 save**: إبقاء dump محدّثاً بعد كل نشر (مُتّبع).

## الحالة
```text
FINAL_STATUS: INFRA_RESILIENCE_PLAN_READY_PENDING_OWNER_APPROVAL
KEY_GAP: PM2 لا يُحيَ تلقائياً على Windows (لا startup) — التطبيق لا يعود بعد reboot/logout/daemon-death بلا تدخّل
REDIS_RESTART_POLICY: unless-stopped (OK)
DOCKER_AUTOSTART: configured (login)
NEXT_REQUIRED_ACTION: APPROVE_PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG (تغييرات startup/OS)
```
لم يُنفَّذ أي تغيير startup/OS؛ هذه خطة فقط. (لا أملك/لن أغيّر إعدادات نظام التشغيل أو المهام المجدوَلة بلا موافقة صريحة.)
