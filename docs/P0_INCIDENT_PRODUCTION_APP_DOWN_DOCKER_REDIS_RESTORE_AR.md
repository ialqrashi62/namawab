# P0 — حادثة: توقّف التطبيق الإنتاجي (Docker/Redis) + استعادة محكومة

> التاريخ: 2026-06-21 | استجابة حادثة أثناء إعادة إصدار برنامج `MASTER_AUTOPILOT` (PHASE 0). استعادة بموافقة المالك «استعادة الخدمة الآن».

## الاكتشاف (PHASE 0)
عند فحص الحالة (قراءة-فقط) ظهر: قائمة PM2 فارغة (الـdaemon أُعيد توليده فارغاً)، المنفذ 3000 مغلق، `/api/health = ECONNREFUSED`. التطبيق **DOWN**.

## السبب الجذري
- **Docker Desktop كان متوقفاً** ⇒ حاوية `nama-redis` غير متاحة (`docker API unreachable`).
- التطبيق **يرفض الإقلاع بلا Redis** (لا fallback إلى MemoryStore بالتصميم) ⇒ لا يقلع.
- لا إعادة تشغيل للجهاز (uptime ~33h) ⇒ حدث خارجي (توقف Docker + موت PM2 daemon)، **لم يسببه أي تغيير منّي** (الدور كان قراءة-فقط).

## الاستعادة (incident response — بلا DDL/GRANT/.env/code)
1. تشغيل Docker Desktop ⇒ الـdaemon جاهز (server 29.5.3).
2. `docker start nama-redis` ⇒ PONG، المنفذ 6379 مفتوح.
3. `pm2 resurrect` (من dump) ⇒ nama-app online، restarts=0.
4. `pm2 save` لتثبيت الحالة المستعادة.

## التحقق بعد الاستعادة
```text
APP_STATUS: ONLINE (restarts=0)
HEALTH: 200 (مستدام 6/6)
GET / = 200 ؛ /login = 200 ؛ /api/patients(بلا جلسة) = 401
DB_ROLE (running): nama_medical_app (pg_stat_activity) — super=false, bypassrls=false
APP_PATH_TENANT_BINDING: PASS (ctx1=3, ctx999=0, no-ctx=0)
FORCE_RLS_COUNT: 125 (بلا تغيير)
REDIS: UP (PONG)
DDL_EXECUTED: NO | DATA_CHANGED: NO | GRANT: NO | ENV_CHANGED: NO | CODE_CHANGED: NO | FORCE_PUSH: NO | SECRETS_PRINTED: NO
```

## ملاحظة وقائية
التطبيق يعتمد على Docker/Redis؛ توقف Docker Desktop يُسقط الخدمة. توصية (خارج النطاق، تحتاج قرار): ضبط Docker Desktop + nama-redis للتشغيل التلقائي عند الإقلاع، و`pm2 startup` + `pm2 save` لإحياء التطبيق تلقائياً — لتفادي تكرار الحادثة.

## أثر على برنامج master
البرنامج الشامل كان مكتملاً سلفاً (`FULL_MASTER_CANDIDATES_READY_NOT_DEPLOYED`، commit c9ce6d9). هذه الحادثة استجابة تشغيلية فقط؛ لم تُغيّر المرشّحات. المتبقّي كما هو: PHASE 1C (إزالة كود Batch B/C) + بوابات الموافقة (system_users P0، Batch B/C deploy، 14-table RLS، audit-reader GRANT).

`PRODUCTION_APP_RESTORED_VIA_INFRA_RESTART — ROOT_CAUSE_DOCKER_REDIS_DOWN — NO_PRODUCTION_CHANGES`
