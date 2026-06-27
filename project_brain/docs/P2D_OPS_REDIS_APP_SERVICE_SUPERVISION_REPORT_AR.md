# P2D-OPS — إشراف خدمي دائم لـ Redis والتطبيق — تقرير

> المرحلة: `PERSIST_REDIS_AND_APP_SERVICE_SUPERVISION`. التاريخ: 2026-06-20.
> **النتيجة: PASS.** Redis والتطبيق تحت إشراف دائم مع إعادة تشغيل تلقائي، وأُعيد التحقق من الـ smoke الأمني تحت دور التشغيل. الترحيل المحاسبي بقي معطّلاً؛ لا قيود إنتاج؛ لا RLS إضافية؛ لا refactor؛ لا go-live.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ملخص البوابات
| Gate | النتيجة |
|---|---|
| 0 | ✅ DB_USER=nama_medical_app، flag OFF، redis PONG، health 200، backup |
| 1 | ✅ جرد: لا PM2/NSSM؛ Docker يعمل؛ خدمات Windows تحتاج صلاحيات مدير؛ العمليات كانت session-tied |
| 2 | ✅ الاستراتيجية: **Redis ← Docker (restart=unless-stopped)** + **التطبيق ← PM2** (بلا صلاحيات مدير) |
| 3 | ✅ Redis: حاوية `nama-redis` (redis:7-alpine رسمي، digest مُتحقَّق)، restart=unless-stopped، PONG |
| 4 | ✅ التطبيق: PM2 `nama-app` (ecosystem.config.js)، online، `[REDIS SUCCESS]`، `pm2 save` |
| 5 | ✅ مرونة: docker restart redis→PONG؛ pm2 restart→health 200؛ **إعادة تشغيل تلقائي عند الانهيار مُثبتة** (قتل PID ⇒ PM2 أعاد التشغيل، health 200) |
| 6 | ✅ HTTP: health/`/`/login=200؛ المحمية=401؛ جلسات التطبيق=nama_medical_app |
| 7 | ✅ أمان DB (انظر أدناه) |

## البنية الدائمة
- **Redis**: حاوية Docker `nama-redis` (redis:7-alpine)، `--restart unless-stopped` ⇒ تعيد التشغيل تلقائياً عند الانهيار، وبعد إعادة الإقلاع إن كان Docker Desktop يبدأ تلقائياً.
- **التطبيق**: PM2 `nama-app` عبر `namaweb/ecosystem.config.js` (محمول، بلا أسرار — الاعتمادات من `.env` عبر dotenv). autorestart مفعّل ومُثبت. `pm2 save` حفظ القائمة.
- **استمرارية بعد إعادة الإقلاع (Windows)**: تتطلب خطوة لمرة واحدة بصلاحيات مدير: `pm2 startup` (أو تثبيت PM2 كخدمة Windows / NSSM)، وتأكيد بدء Docker Desktop تلقائياً. **هذه البيئة غير مرفوعة الصلاحيات (NON_ADMIN)** ⇒ تُترك كخطوة مشغّل موثّقة.

## Gate 7 — أمان DB/RLS/المحاسبة
```
role: nama_medical_app  super=false  bypassrls=false
patients (no tenant context) = 0      ← RLS مُنفَّذة
finance RLS policies = 7 | total RLS tables = 42
finance_journal_entries/lines (tenant=1) = 0 / 0
ACCOUNTING_POSTING_ENABLED = OFF | DB_USER = nama_medical_app
app DB sessions = nama_medical_app (ليس postgres)
```
لا تغيّر محاسبي؛ لا posting؛ لا تراجع RLS.

## Gate 8 — دليل المشغّل (Operator Runbook)
**Redis (Docker):**
```bash
docker ps --filter name=nama-redis                 # الحالة
docker exec nama-redis redis-cli ping              # PONG
docker restart nama-redis                          # إعادة تشغيل آمنة (بلا flush)
docker logs --tail 50 nama-redis                   # السجلات
# إنشاء (إن غابت): docker run -d --name nama-redis --restart unless-stopped -p 6379:6379 redis:7-alpine
```
**التطبيق (PM2):** (من `namaweb/`)
```bash
pm2 status                                         # الحالة
pm2 logs nama-app --lines 50                        # السجلات (C:\Users\ice\.pm2\logs\)
pm2 restart nama-app                                # إعادة تحميل
pm2 start ecosystem.config.js && pm2 save           # البدء + الحفظ
# استمرارية الإقلاع (مرة واحدة، صلاحيات مدير): pm2 startup  ثم  pm2 save
```
**تعافٍ إذا فشل Redis:** `docker restart nama-redis` (أو إعادة الإنشاء بالأمر أعلاه) ثم `pm2 restart nama-app`.
**استرجاع إذا تعذّر إقلاع التطبيق بسبب الدور (نادر):** أعد `.env` من `C:/Users/ice/nama_prod_backups/.env.pre_p2d_postgres` (DB_USER=postgres) ثم `pm2 restart nama-app` — فوري وغير هدّام. (لا تفعل ذلك إلا عند إثبات تراجع في الدور.)
**السجلات:** Redis ← `docker logs nama-redis` ؛ التطبيق ← `C:\Users\ice\.pm2\logs\nama-app-*.log`.

## السلامة والامتثال
DB_USER بقي nama_medical_app · posting OFF · لا قيود/فواتير إنتاج (0/0) · لا RLS إضافية · لم يُعطَّل اشتراط Redis · لا MemoryStore · **لم يُفلَش Redis ولم تُحذف مفاتيح** (restart فقط) · لم تُثبَّت ثنائيات غير موثوقة (Docker official + PM2 npm + scoop main) · لا أسرار في git (`.env` gitignored؛ ecosystem بلا أسرار) · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف.

## الحالة النهائية
```text
FINAL_STATUS: P2D_OPS_SERVICE_SUPERVISION_PASS_RUNTIME_ROLE_ACTIVE_POSTING_OFF
REDIS: docker nama-redis (redis:7-alpine, restart=unless-stopped) PONG
APP: pm2 nama-app online (autorestart proven), pm2 save done
REBOOT_PERSISTENCE: needs one-time admin step (pm2 startup / Docker autostart) — documented
HTTP: health/login=200, protected=401 | DB sessions=nama_medical_app | RLS enforced | finance RLS=7
DB_USER=nama_medical_app (super=false,bypassrls=false) | POSTING=OFF | PROD_JOURNALS=0 | FORCE_PUSH=NO
NEXT_REQUIRED_ACTION: (operator) pm2 startup + Docker autostart for reboot survival ; then separate approvals: RLS coverage phase A → fail-closed refactor → accounting posting go-live
```
