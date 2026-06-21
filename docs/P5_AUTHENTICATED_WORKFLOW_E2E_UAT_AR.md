# PHASE 5 — إثبات سير العمل عبر harness محكوم (لا متصفّح E2E)

> البرنامج: MASTER_AUTOPILOT RLS hardening — PHASE 5 | 2026-06-21 | لا حساب اختبار متاح ⇒ **harness موثّق، لا ادّعاء browser E2E**.

## السبب
لا توجد بيانات اعتماد اختبار في البيئة (الإنتاج يحوي 3 مرضى عرض فقط؛ كلمات مرور system_users مُجزّأة وغير معروفة). لذا اعتُمد harness على مستوى مسار التطبيق (db_postgres.js runWithTenant + غلاف pool.query = آلية الـmiddleware نفسها) + HTTP smoke، بدل تسجيل دخول حقيقي عبر المتصفح.

## النتائج (مُثبتة هذه الجلسة)
| البند | النتيجة |
|---|---|
| login (POST /api/auth/login، اعتماد وهمي) | 401 Invalid credentials (الاستعلام نجح تحت nama_medical_app) |
| protected routes بلا جلسة | 401 (patients, obgyn/stats, referrals, medical-reports, cash-drawer, visit_lifecycle) |
| GET / و /login و /api/health | 200 |
| app-path tenant binding (patients) | ctx=1 ⇒ app.tenant_id=1 + 3 صفوف ؛ ctx=999 ⇒ 0 ؛ بلا سياق ⇒ 0 (fail-closed) |
| write stamping (patients، txn ROLLBACK) | INSERT بلا tenant_id ⇒ مختوم 1 ؛ تزوير 999 ⇒ 42501 ؛ بلا سياق ⇒ 42501 |
| audit_trail stamping | tenant_id مختوم من السياق |
| Batch A الجديدة (referrals) عزل | INSERT مختوم 1 ؛ ctx1 يرى 1 ؛ ctx999 يرى 0 (txn ROLLBACK) |
| Batch A routes بعد النشر | 401 (لا 500/42501/42P01) |

## الحالة
```text
E2E_STATUS: HARNESS_UAT_PASS_BROWSER_NOT_AVAILABLE
BROWSER_E2E: BLOCKED_PENDING_TEST_ACCOUNT (يلزم حساب اختبار بكلمة مرور معروفة + tenant مخصّص)
APP_PATH_TENANT_ISOLATION: PASS
PROTECTED_ROUTES_401_WITHOUT_SESSION: PASS
```
للترقية إلى browser E2E كامل: تزويد حساب اختبار (username + password + tenant) — عندها أنفّذ تسجيل دخول حقيقي + CRUD آمن + عزل عبر-مستأجر فعلي عبر الجلسة.
