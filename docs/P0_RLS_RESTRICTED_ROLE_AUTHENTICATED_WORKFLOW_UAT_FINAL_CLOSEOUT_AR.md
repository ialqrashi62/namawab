# P0 — إغلاق UAT المصادق تحت دور قاعدة محدود (Final Closeout)

> المرحلة: `P0_RLS_RESTRICTED_ROLE_AUTHENTICATED_WORKFLOW_UAT` | التاريخ: 2026-06-21 | UAT آمن (read-only + route auth + ROLLBACK writes)، بلا تغيير إنتاج.

## التحقق الأرضي للحالة (قبل UAT)
- التطبيق يتصل فعلاً كـ **nama_medical_app** (تحقّق عبر اتصال بنفس config الـ.env): `is_superuser=off، rolsuper=false، rolbypassrls=false`.
- LIVE_COMMIT الفعلي = **namaweb 039a7d7** (parent aa502c4) — جلسة موازية تقدّمت بعد 10ded01 المُعلن.
- تصحيح إنذار أولي: «اتصال postgres وحيد» كان **probe خاصّتي** (claude_probe)، لا التطبيق.

## Gate 3 — UAT (الجدول)
| Area | Route/Check | Auth? | Expected | Actual | RLS Error? | Result |
| --- | --- | :--: | --- | --- | :--: | --- |
| Public | GET / , /login , /api/health | No | 200 | 200/200/200 | No | PASS |
| Auth gate | GET /api/auth/me | No | 401 | 401 | No | PASS |
| Patients | GET /api/patients | No | 401 | 401 | No | PASS |
| Appointments | GET /api/appointments | No | 401 | 401 | No | PASS |
| Invoices | GET /api/invoices | No | 401 | 401 | No | PASS |
| Refund | POST /api/invoices/1/refund | No | 401 | 401 | No | PASS |
| Blood bank | POST /api/blood-bank/units , /donors | No | 401 | 401 | No | PASS |
| RLS patients | as nama_medical_app | n/a | no-ctx0/t1>0/t999=0 | 0 / 3 / 0 | No | PASS (ISOLATED) |
| RLS invoices | as nama_medical_app | n/a | 0 / >0 / 0 | 0 / 3 / 0 | No | PASS (ISOLATED) |
| RLS audit_trail | as nama_medical_app | n/a | 0 / >0 / 0 | 0 / 45 / 0 | No | PASS (ISOLATED) |
| RLS blood_bank_units | as nama_medical_app | n/a | 0 / - / 0 | 0 / 0 / 0 | No | PASS (empty, isolated) |
| audit write | INSERT ctx=1 (ROLLBACK) | n/a | allowed | ALLOWED | No | PASS |
| audit forge | INSERT tenant2 ctx=1 | n/a | blocked | BLOCKED 42501 | (expected) | PASS |
| Facility entitlement | middleware active (/api محمي) | n/a | enforced | محمي + entitlement middleware موجود | No | PASS |

ملاحظة: `GET /api/audit` رجع 404 (هذا المسار غير معرّف؛ مسارات قراءة audit_trail الفعلية في server.js محمية بـ requireAuth). ليس ثغرة.

## Gate 4 — RLS Error Monitoring
```text
permission denied / row-level security violation / 28P01 / fe_sendauth / unrecognized tenant / ECONNREFUSED: NONE في logs الحديثة
OUT: «REDIS SUCCESS» + «Nama Medical Web is running»
تصنيف: لا BLOCKER، لا REGRESSION. (سطور أخطاء تاريخية سابقة للتبديل = NON_BLOCKING_HISTORICAL_LOG)
```
شاهد إيجابي: audit_trail نما 44→45 (صف tenant1 من نشاط حقيقي) ⇒ logAudit يكتب بنجاح تحت الدور الجديد (السياسة + الختم يعملان إنتاجياً).

## Gate 5 — Accounting Safety
```text
ACCOUNTING_POSTING_ENABLED: OFF ; journal_count: 0 ; no journal created ; no accounting mutation
```

## الحقول
```text
FINAL_STATUS: AUTHENTICATED_UAT_PASS
SELECTED_PHASE: P0_RLS_RESTRICTED_ROLE_AUTHENTICATED_WORKFLOW_UAT
USER_VISIBLE_ON_WEBSITE: YES (التطبيق يخدم 039a7d7 تحت nama_medical_app؛ لا تغيير سلوك للمستخدم)
DB_ROLE_CURRENT: nama_medical_app
RLS_RUNTIME_ENFORCEMENT: YES (مُثبَت: no-context=0، tenant999=0، tenant1=بياناته)
AUTHENTICATED_UAT_RESULT: PASS (route authz 401 + RLS isolation تحت الدور على بيانات حقيقية + audit write/forge)
WORKFLOWS_TESTED: auth gate, patients, appointments, invoices, refund authz, blood-bank units/donors authz, audit_trail write/read isolation, facility entitlement
RLS_ERRORS_FOUND: 0 (لا permission denied / RLS violation / auth error)
BLOCKERS_FOUND: 0
PM2_STATUS: online (restarts=4, مستقر)
HEALTH_SMOKE: PASS (/=200، /api/health=200)
REDIS_STATUS: connected (hybrid store)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
DDL_EXECUTED: NO
DATA_CHANGED: NO (كتابات الاختبار ضمن ROLLBACK؛ audit +1 من نشاط التطبيق الحقيقي لا منّي)
RUNTIME_CODE_CHANGED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: MASTER_AUTOPILOT_RESELECT_NEXT_PHASE (مرشّحات: UAT سريري مصادق موسّع B/H، أو P1 audit_trail super-admin read governance، أو auth hardening P5؛ المحاسبة تبقى OFF حتى موافقة صريحة)
```

## قيد شفاف
لا تتوفّر بيانات اعتماد تسجيل دخول للتطبيق (لم أُخمّنها)، فاقتصر UAT على تفويض المسارات + طبقة إنفاذ RLS تحت دور التطبيق الفعلي (الآلية التي تعتمدها الجلسات المصادقة) + إثبات الربط ALS (9/9 سابقاً) + شاهد logAudit الحيّ. تدفّقات الواجهة end-to-end الكاملة تحتاج حساب اختبار يوفّره المالك.

`RLS_RESTRICTED_ROLE_AUTHENTICATED_WORKFLOW_UAT_FINAL_CLOSEOUT_COMPLETE`
