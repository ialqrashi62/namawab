# P1 — إغلاق توافق Runtime لختم tenant بعد DDL لطبقة PHI Class A (Final Closeout)

> المرحلة: `P1_PHI_TENANT_STAMPING_RUNTIME_COMPATIBILITY_AFTER_CLASS_A_DDL` | التاريخ: 2026-06-21 | code-only، **غير منشور**.

## Gate 1 — جرد مسارات Runtime (الجداول الخمسة الجديدة)

| Route | Table | Op | tenant_id | facility_id | FORCE RLS | يختم tenant_id؟ | مصدر tenant | خطر بعد التبديل | إجراء |
| --- | --- | --- | :--: | :--: | :--: | :--: | --- | --- | --- |
| POST /api/blood-bank/units | blood_bank_units | INSERT | ✅ | ✅ | YES | **الآن: نعم** (كان لا) | session موثوق | كان: INSERT مرفوض (WITH CHECK) | **أُصلح** |
| PUT /api/blood-bank/units/:id | blood_bank_units | UPDATE status | ✅ | ✅ | YES | n/a | — | منخفض: RLS USING يقيّد للصف المرئي للمستأجر | مغطّى بـ RLS بعد التبديل |
| GET /api/blood-bank/units | blood_bank_units | SELECT | ✅ | ✅ | YES | n/a | — | RLS يفلتر تلقائياً بعد التبديل | لا تغيير |
| POST /api/blood-bank/donors | blood_bank_donors | INSERT | ✅ | ✅ | YES | **الآن: نعم** (كان لا) | session موثوق | كان: INSERT مرفوض | **أُصلح** |
| GET /api/blood-bank/donors | blood_bank_donors | SELECT | ✅ | ✅ | YES | n/a | — | RLS يفلتر تلقائياً | لا تغيير |
| (لا مسار) packages | packages | — | ✅ | ✅ | YES | — | — | لا مسار runtime (CREATE TABLE فقط في db_postgres.js/database.js) | **ROUTES_ABSENT** |
| logAudit() → audit_trail | audit_trail | INSERT | ✅ | — | YES | **لا (قرار)** | helper نظامي fire-and-forget (~70 نداء) | كتابة التدقيق قد تُرفض بصمت بعد التبديل | **قرار سياسة — انظر أدناه** |
| GET /api/audit (×2) | audit_trail | SELECT | ✅ | — | YES | n/a | — | قراءة super-admin العابرة ستُفلتر | قرار سياسة قراءة |

## Gate 2 — الإصلاحات المطبّقة (نمط RLS-READY القائم)
- **POST /api/blood-bank/units** و **POST /api/blood-bank/donors**: أُضيف `requireTenantScope` (fail-closed) + `getRequestTenantContext(req)` + ختم `tenant_id` و`facility_id` في INSERT من **session موثوق فقط** (لا من body؛ الحقول تُفكَّك صراحةً ولا تشمل tenant_id) + SELECT بعد الإدراج مقيّد `AND tenant_id=$2`. مطابق لنمط crossmatch/transfusions.
- لا تغيير schema، لا تغيير بيانات، لا DDL.

## قرار audit_trail (AUDIT_TRAIL_DECISION)
`audit_trail` سجلّ تدقيق **عابر للوحدات (system-wide)** يُكتب عبر helper `logAudit` من ~70 موقعاً بنمط fire-and-forget مع `catch` يبتلع الخطأ. فرض سياسة tenant صارمة (WITH CHECK) عليه بعد التبديل يسبب خطرين:
1. **فقدان تدقيق صامت**: كل INSERT تدقيق لا يطابق `app.tenant_id` يُرفض (42501) ويُبتلع في الـcatch ⇒ توقّف تسجيل التدقيق دون إشعار (تراجع أمني أخطر من رؤية admin عابرة).
2. **حجب قراءة super-admin العابرة للمستأجر** عبر USING.

لذلك القرار: **لا يُختم tenant_id في logAudit الآن** (تجنّب تعديل ~70 نداءً + تجنّب التراجع)، بل يُعالَج audit_trail كسجل نظامي يحتاج **سياسة سماحية/نظامية أو دور كاتب-تدقيق مخصص** كـ **شرط مسبق لتبديل الدور** (قرار DDL/سياسة خارج نطاق هذه المرحلة code-only). تسجيل التدقيق يبقى سليماً الآن (الاختبار يؤكده).

## شرط مسبق عام للتبديل (مكرّر للوضوح)
السياسات fail-closed: بعد التبديل لـ `nama_medical_app` يجب أن يضبط التطبيق `app.tenant_id` لكل طلب **في نطاق الاتصال/المعاملة** وإلا يعيد/يرفض فارغاً. هذا precheck على آلية ضبط GUC في db_postgres.js/server.js (منفصل عن ختم tenant_id هنا).

## Gate 3 — الاختبارات
```text
phi_class_a_runtime_stamping_test.js: 18/18 PASS
  (units/donors: requireTenantScope، getRequestTenantContext، INSERT يختم tenant_id+facility_id،
   params=[tenantId,facilityId] لا من body، SELECT مقيّد؛ packages بلا مسار؛ audit recording سليم)
regression: cross_tenant_idor_sweep, cross_tenant_refund_idor, rls_insert_tenant_stamping, cross_tenant_update_sweep => exit 0
node --check server.js: OK
ACCOUNTING_POSTING_ENABLED: OFF ; journal_count: 0
```

## الحقول
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P1_PHI_TENANT_STAMPING_RUNTIME_COMPATIBILITY_AFTER_CLASS_A_DDL
USER_VISIBLE_ON_WEBSITE: NO (غير منشور؛ الموقع الحيّ namaweb 082c07b)
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: YES (APPROVE_DEPLOY_PHI_RUNTIME_COMPATIBILITY)
DDL_EXECUTED: NO
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: YES (2 مسارَي blood-bank + اختبار)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
RLS_CHANGED: NO
RLS_RUNTIME_ENFORCEMENT: NOT_YET
DB_ROLE_BEFORE: postgres
DB_ROLE_AFTER: postgres
PHI_TABLES_REVIEWED: packages, blood_bank_donors, blood_bank_units, audit_trail
ROUTES_FIXED: POST /api/blood-bank/units , POST /api/blood-bank/donors
ROUTES_ABSENT: packages (لا مسار runtime — CREATE TABLE فقط)
AUDIT_TRAIL_DECISION: system-wide audit log => يحتاج سياسة سماحية/نظامية أو دور كاتب-تدقيق قبل التبديل؛ لا يُختم runtime (تجنّب ~70 نداء + تراجع صامت). تسجيل التدقيق سليم الآن.
TESTS_RESULT: 18/18 PASS + regression exit 0
SECRETS_FOUND: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_DEPLOY_PHI_RUNTIME_COMPATIBILITY_THEN_SECRET_READY_EXECUTE_SWITCH
```

## بنود مؤجّلة (موثّقة، غير حرجة)
- blood_bank_units PUT (UPDATE status) وقوائم GET: مغطّاة تلقائياً بـ RLS USING بعد التبديل (دفاع-في-العمق اختياري).
- audit_trail: قرار سياسة القراءة/الكتابة (أعلاه) قبل التبديل.

`PHI_TENANT_STAMPING_RUNTIME_COMPATIBILITY_FINAL_CLOSEOUT_COMPLETE`
