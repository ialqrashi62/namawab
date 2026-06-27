# P1 — مسح ملكية المستأجر لمسارات الإنشاء/التعديل (Extended Create/Owned-ID Route Sweep)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_POST_COMPACT_CONTINUATION` — المرحلة المختارة (Option 3) | التاريخ: 2026-06-21
> **audit + code-only محدود** | لا deploy/DDL/data/flag/journal/Stitch/force.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR
- MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## المنهج
تدقيق شامل لكل مسارات POST/PUT/PATCH التي تستقبل معرّفاً مملوكاً (patient_id/invoice_id/order_id/…) وتُدرج/تُعدّل به. النتيجة: **72 مساراً مملوك-المعرّف، 54 محروس، 18 غير محروس (مرشّح IDOR)**. ثم تحقّق read-only من وجود tenant_id على الجداول المعنية لتحديد القابل للإصلاح الآن.

## سجل الـ18 غير المحروسة (تصنيف نهائي)
### (1) أُصلِحت هذه الجولة — code-only، fail-closed (tenant_id موجود)
| المسار | السطر | الإصلاح |
| ------ | ----- | ------- |
| `POST /api/medical/records` | 804 | requireTenantScope + فحص ملكية patient + **ختم tenant_id** في INSERT |
| `POST /api/medical/certificates` | 1970 | requireTenantScope + فحص ملكية + **ختم tenant_id** |
| `POST /api/appointments/followup` | 2053 | requireTenantScope + فحص ملكية patient (INSERT يختم tenant_id أصلاً) |
| `PUT /api/bookings/:id` | 1900 | requireTenantScope + تقييد UPDATE بـ tenant_id → 404 |

### (2) مؤكَّدة IDOR، tenant_id موجود — مُسجَّلة للجولة التالية (نفس النمط، code-only)
| المسار | السطر | الجدول | الإصلاح المطلوب |
| ------ | ----- | ------ | --------------- |
| `POST /api/nursing/assessment` | 5717 | nursing_vitals | فحص ملكية patient قبل SELECT/UPDATE |
| `POST /api/blood-bank/crossmatch` | 2673 | blood_bank_crossmatch | فحص ملكية patient + ختم tenant_id |
| `PUT /api/blood-bank/crossmatch/:id` | 2688 | blood_bank_crossmatch | تقييد UPDATE بـ tenant_id |
| `POST /api/blood-bank/transfusions` | 2704 | blood_bank_transfusions | فحص ملكية + ختم tenant_id + تقييد UPDATE unit |
| `PUT /api/lab/orders/:id` | 1232/1239 | lab_radiology_orders | الملكية مفحوصة (1230)؛ تقييد UPDATE بـ tenant_id (TOCTOU، خطورة أقل) |
| `PUT /api/radiology/orders/:id` | 1292 | lab_radiology_orders | الملكية مفحوصة (1290)؛ تقييد UPDATE (TOCTOU) |

### (3) بلا tenant_id — تعتمد على مرشّح PHI Class A DDL (لا إصلاح كود مباشر)
| المسار | السطر | الجدول | الملاحظة |
| ------ | ----- | ------ | -------- |
| `POST /api/blood-bank/units` | 2641 | blood_bank_units | بلا tenant_id ⇒ يتطلّب `phi_class_a_residual_rls_candidate` أولاً |
| `PUT /api/blood-bank/units/:id` | 2650 | blood_bank_units | كما أعلاه |

### (4) جداول غير موجودة على القاعدة — مسارات غير فعّالة (لا خطر حيّ)
`obgyn_*` (5 مسارات: pregnancies/antenatal/ultrasounds/deliveries/nst، الأسطر 5774–5908): الجداول **ABSENT** (`initDatabase` يُتخطّى في الإنتاج) ⇒ المسارات تُخفق قبل أي وصول. تُعالَج فقط إن أُحييت الوحدة (بإضافة tenant_id + ملكية).

## ⚠️ اكتشاف نظامي مهم (precondition لتبديل دور RLS)
عدّة INSERTs إلى جداول FORCE-RLS **لا تختم tenant_id** (مثل medical_records/certificates قبل هذا الإصلاح). تحت postgres (superuser) تنجح بـ tenant_id=NULL؛ لكن **بعد تبديل الدور إلى nama_medical_app ستفشل `WITH CHECK`** (NULL ≠ app.tenant_id) ⇒ كسر وظيفي. يُوصى بمرحلة مكرّسة: **تدقيق ختم tenant_id في كل INSERT لجداول FORCE-RLS** كشرط مسبق لتبديل الدور (P0).

## الاختبارات
`cross_tenant_idor_sweep_test.js` (موسّع): **29/29 PASS**. انحدار: refund 11/0، entitlement 41/0، failclosed 50/0، wave2 38/0، accounting 28/0، `node --check` OK.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P1_EXTENDED_CREATE_ROUTE_TENANT_OWNERSHIP_SWEEP (Option 3)
PRIORITY_LEVEL: P1 (tenant isolation)
USER_VISIBLE_ON_WEBSITE: NO ; LOCAL_CHANGES_REMAINING: NO
COMMITTED: YES ; PUSHED: YES (بلا force) ; PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO ; RUNTIME_CODE_CHANGED: YES (4 مسارات + اختبار)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2) + parent gitlink + 5 تقارير + ذاكرة ; FILES_DEPLOYED: 0 ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: OWNER_APPROVE_DEPLOY (المتراكم) أو SECRET_READY_EXECUTE_SWITCH؛ + جولة تالية: بقية مسارات IDOR (القسم 2) + تدقيق ختم tenant_id في INSERTs
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`EXTENDED_CREATE_ROUTE_TENANT_OWNERSHIP_SWEEP_COMPLETE`
