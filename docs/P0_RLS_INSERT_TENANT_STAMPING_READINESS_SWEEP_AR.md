# P0 — جاهزية ختم tenant_id في INSERTs قبل تبديل دور RLS (Insert Tenant-Stamping Readiness)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_GROUPS_CONTINUE_AFTER_PHASE_138` — المرحلة المختارة | التاريخ: 2026-06-21
> **audit + code-only** | لا deploy/DDL/data/flag/switch/Stitch/force.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR
- MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR
- MEDICAL_RLS_POLICY_DESIGN_SKILL_AR
- MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## لماذا هذه المرحلة
precondition أعلنته Phase 138: INSERTs لجداول FORCE-RLS لا تختم `tenant_id` ستفشل `WITH CHECK` بعد التحويل إلى `nama_medical_app` (NULL ≠ app.tenant_id) ⇒ كسر وظيفي. لا secret ولا موافقة نشر ⇒ هذا أعلى P0 آمن قابل للتنفيذ، ويُمهّد لتبديل الدور.

## نتيجة التدقيق (98 INSERT)
- **57 INSERT** تختم `tenant_id` بالفعل (سليمة post-switch).
- **33 INSERT** لجداول عالمية/بلا tenant_id (system_users/employees/catalogs/cme/cssd/maintenance/notifications/audit_trail…) — لا RLS، آمنة.
- **8 INSERT** لجداول FORCE-RLS بلا ختم `tenant_id` = **مجموعة الكسر**.

### مصفوفة مجموعة الكسر + الإجراء
| Route | Table | FORCE RLS? | tenant_id col? | كان يختم؟ | Risk After Switch | Action |
| ----- | ----- | :--------: | :------------: | :-------: | ----------------- | ------ |
| POST /api/insurance/claims (775) | insurance_claims | ✅ | ✅ (+facility_id) | ❌ | كان سيكسر | **أُصلِح**: requireTenantScope + ختم tenant_id/facility_id |
| POST /api/blood-bank/crossmatch (2687) | blood_bank_crossmatch | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: + ختم tenant_id |
| POST /api/blood-bank/transfusions (2717) | blood_bank_transfusions | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: + ختم tenant_id |
| POST /api/quality/incidents (4088) | quality_incidents | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: + ختم tenant_id |
| POST /api/quality/satisfaction (4114) | quality_patient_satisfaction | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: + ختم tenant_id |
| POST /api/transport/requests (4215) | transport_requests | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: + ختم tenant_id |
| check-in auto-add (6709) | waiting_queue | ✅ | ✅ | ❌ | كان سيكسر | **أُصلِح**: ختم tenant_id من `appt.tenant_id` |
| POST /api/visits (5684) | patient_visits | — | — | — | — | **الجدول ABSENT** على القاعدة ⇒ المسار غير فعّال؛ لا إصلاح (يُعالَج إن أُحيي) |

## مبدأ الإصلاح
ختم `tenant_id` من **سياق موثوق فقط** (`getRequestTenantContext(req)` أو `appt.tenant_id`)، لا من جسم الطلب. + `requireTenantScope` يرفض السياق المفقود في الإنتاج. (فحص ملكية patient_id لبعض هذه المسارات = بند IDOR منفصل، مُسجَّل، خارج نطاق هذه المرحلة — «لا خلط مراحل».)

## الاختبارات
`rls_insert_tenant_stamping_test.js` (جديد): **13/13 PASS** (7 INSERT تختم tenant_id + 6 مسارات requireTenantScope). `node --check` OK. انحدار: idor_sweep 29/0، refund 11/0، failclosed 50/0، accounting 28/0.

## أثر على تبديل الدور (P0)
هذه المرحلة تُزيل عائق الكسر لهذه المسارات السبعة. **لا تزال هناك حاجة** قبل التبديل إلى: (1) نشر كل الإصلاحات المتراكمة (بما فيها هذه)؛ (2) السرّ؛ (3) إعادة تشغيل هذا المسح بعد أي مسارات جديدة. التبديل لا يُنفَّذ إلا بأمر `SECRET_READY_EXECUTE_SWITCH` وبعد النشر.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P0_RLS_INSERT_TENANT_STAMPING_READINESS_SWEEP
PRIORITY_LEVEL: P0 (role-switch precondition)
USER_VISIBLE_ON_WEBSITE: NO ; LOCAL_CHANGES_REMAINING: NO
COMMITTED: YES ; PUSHED: YES (بلا force) ; PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO ; RUNTIME_CODE_CHANGED: YES (7 INSERTs + اختبار)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2) + parent gitlink + 5 تقارير + ذاكرة ; FILES_DEPLOYED: 0 ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_DEPLOY (المتراكم) ثم SECRET_READY_EXECUTE_SWITCH؛ + بقية بنود IDOR (UPDATE-by-id: quality/transport/crossmatch PUT) في مسح multi-row منفصل
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`RLS_INSERT_TENANT_STAMPING_READINESS_SWEEP_COMPLETE`
