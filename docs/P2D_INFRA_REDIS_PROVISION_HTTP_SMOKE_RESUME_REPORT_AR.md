# P2D-INFRA — توفير Redis واستئناف HTTP smoke — تقرير

> المرحلة: `REDIS_PROVISION_AND_HTTP_SMOKE_RESUME`. التاريخ: 2026-06-20.
> **النتيجة: PASS.** التطبيق يعمل تحت دور التشغيل المُصلّب مع Redis، وHTTP smoke اجتاز. الترحيل المحاسبي بقي معطّلاً؛ لا قيود إنتاج؛ لا RLS إضافية؛ لا refactor؛ لا go-live.

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
| 0 | ✅ DB_USER=nama_medical_app، flag OFF، journals 0/0، backup |
| 1 | ✅ اختيار المسار: Docker daemon متوقف، WSL sudo محجوب ⇒ **scoop (مدير حزم موثوق)** |
| 2 | ✅ Redis 8.8.0 (redis-windows الرسمي، hash مُتحقَّق) يعمل على 6379، **PONG**؛ + استرجاع حزم node `redis@6`/`connect-redis@9` المُعلَنة؛ + `.env` (REDIS_HOST/PORT) |
| 3 | ✅ التطبيق أقلع: **`[REDIS SUCCESS] Connected to Redis`**، إنتاج (init متخطّى)، يستمع على :3000 |
| 4 | ✅ `/api/health`=200 `{"status":"UP"}`، `/`=200، `/login`=200 |
| 5 | ✅ جلسات DB للتطبيق = **nama_medical_app (5)**؛ المسارات المحمية (`patients/invoices/appointments/finance/journal/accounts`) = **401** (لا تسريب مجهول)؛ مسار تسجيل الدخول يعمل تحت الدور + جلسات Redis |
| 6 | ✅ لا تراجع (انظر أدناه) |
| 7 | **لا استرجاع** — smoke اجتاز، الدور سليم |

## الأدلة الحاسمة
- **التطبيق الحي يستخدم دور التشغيل**: `pg_stat_activity` أظهر `nama_medical_app n=5` أثناء طلبات تسجيل الدخول (ليس postgres).
- **Redis متصل**: سجل الإقلاع `[REDIS SUCCESS] Connected to Redis successfully for distributed sessions`.
- **لا تسريب مجهول**: كل المسارات المحمية ترجع 401 بلا جلسة.
- **RLS مُنفَّذة**: `patients` بلا سياق = 0 تحت الدور؛ finance RLS = 7.

## Gate 6 — سلامة ما بعد الـ smoke
```
role: nama_medical_app  super=false  bypassrls=false
patients (no tenant context) = 0      ← RLS مُنفَّذة
finance RLS policies = 7
finance_journal_entries/lines (tenant=1) = 0 / 0
ACCOUNTING_POSTING_ENABLED = OFF | DB_USER = nama_medical_app
```
لم تتغيّر أي حالة محاسبية؛ لا قيود؛ لا فواتير؛ posting OFF.

## المسار المُختار لتوفير Redis (Gate 1/2)
- Docker daemon متوقف؛ WSL Ubuntu موجود لكن sudo غير تفاعلي محجوب ⇒ تعذّر apt.
- **scoop** (مدير حزم موثوق، بلا صلاحيات مدير): `scoop install redis` ⇒ Redis 8.8.0 من إصدار `redis-windows/redis-windows` الرسمي (تحقّق hash تلقائي).
- التشغيل: `redis-server --port 6379 --save "" --appendonly no` (بلا flush، بلا حذف مفاتيح).
- حزم node العميل (`redis`/`connect-redis`) كانت مُعلَنة في package.json لكنها مفقودة ⇒ `npm install` استرجعها (deps موثوقة).

## ملاحظات تشغيلية (للاستدامة)
- Redis والتطبيق يعملان حالياً ضمن جلسة هذه المرحلة. **للإنتاج الدائم**: شغّل Redis والتطبيق تحت مدير خدمات (Windows Service / NSSM / pm2 / حاوية) ليبقيا بعد انتهاء الجلسة.
- قالب آمن أُضيف إلى `namaweb/.env.example` (REDIS_HOST/REDIS_PORT/REDIS_URL) بلا أسرار.

## السلامة والامتثال
DB_USER بقي `nama_medical_app` (لا استرجاع) · posting OFF · لا قيود/فواتير إنتاج · لا RLS إضافية · لم يُعطَّل اشتراط Redis · لا MemoryStore في الإنتاج · لم تُثبَّت ثنائيات غير موثوقة (scoop main + npm deps مُعلَنة + redis-windows رسمي مع hash) · لم تُحذف/تُفلَش مفاتيح Redis · لا أسرار في git/التقارير (`.env` gitignored) · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف.

## الحالة النهائية
```text
FINAL_STATUS: P2D_HTTP_SMOKE_PASS_RUNTIME_ROLE_ACTIVE_POSTING_OFF
APP: booted on :3000 | REDIS: 8.8.0 @6379 PONG, [REDIS SUCCESS] | DB sessions: nama_medical_app
HTTP: /api/health=200, protected=401 (no anon leakage) | RLS: enforced (patients no-ctx=0) | finance RLS=7
DB_USER: nama_medical_app (super=false, bypassrls=false, unchanged) | POSTING: OFF | PROD_JOURNALS: 0
RLS_REGRESSION: NONE | DB_USER_ROLLED_BACK: NO | FORCE_PUSH: NO
NEXT_REQUIRED_ACTION: (operator) run Redis+app under a service manager for persistence ; then separate approvals: RLS coverage phase A (72 tables) → fail-closed refactor → accounting posting go-live
```

## ملاحظة على الـ smoke المُصادَق
قراءات HTTP المُصادَقة بسياق مستأجر فعلي (قوائم patients/invoices لمستخدم مسجّل) تحتاج بيانات اعتماد إنتاج فعلية (لا تُنشَأ مستخدمون اصطناعيون). تم إثبات البديل المكافئ: منع الوصول المجهول (401) + إنفاذ RLS على طبقة DB (مُثبت في P2C/P2D) + عمل مسار المصادقة/الجلسات تحت الدور. القراءات المُصادَقة الكاملة = خطوة مشغّل ببيانات اعتماد صالحة.
