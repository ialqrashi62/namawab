# P1 — مسح حارس المستأجر لمسارات UPDATE (Multi-Row UPDATE Tenant-Guard Sweep)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_GROUPS_AFTER_PHASE_139` — المرحلة المختارة (Option 1) | التاريخ: 2026-06-21
> **audit + code-only محدود** | لا deploy/DDL/data/flag/Stitch/force.

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

## التدقيق (وكيل Explore — 93 UPDATE)
معظم UPDATEs لجداول المستأجر **محروسة** (UPDATE يحوي `AND tenant_id` أو سبقه SELECT مفلتر tenant). المخاطر المرصودة على جداول مملوكة بلا حارس:

### أُصلِح هذه الجولة (3، fail-closed)
| المسار | السطر | الجدول | الإصلاح |
| ------ | ----- | ------ | ------- |
| `PUT /api/blood-bank/crossmatch/:id` | 2705 | blood_bank_crossmatch | requireTenantScope + فحص ملكية + `UPDATE … WHERE id AND tenant_id` |
| `PUT /api/quality/incidents/:id` | 4103 | quality_incidents | requireTenantScope + `AND tenant_id=$N` في UPDATE الديناميكي + rowCount 404 |
| `PUT /api/transport/requests/:id` | 4241 | transport_requests | requireTenantScope + `AND tenant_id=$N` + rowCount 404 |

### مؤجَّل (مُسجَّل، لم يُلمَس هذه الجولة — انضباط النطاق)
| المسار/السطر | الجدول | الحالة | الإجراء المطلوب |
| ------------ | ------ | ------ | --------------- |
| `PUT /api/cosmetic/cases/:id` (4267) | cosmetic_cases | غير محروس | نفس النمط (tenant scope) |
| `POST /api/nursing/assessment` (5745) | nursing_vitals | غير محروس | فحص ملكية patient ثم UPDATE مقيّد |
| `PUT /api/appointments/:id/checkin` (6711) / `/noshow` (6742) | appointments | غير محروس | `AND tenant_id` (+ سياق) |
| `PUT /api/waiting-queue/:id` (6916) | waiting_queue | غير محروس | `AND tenant_id` |
| lab/radiology UPDATEs (1238/1245/1298/1357/3089/3129) | lab_radiology_orders | **محروسة بـ SELECT سابق**؛ UPDATE بلا `AND tenant_id` | دفاع-في-العمق: إضافة `AND tenant_id` |
| patients soft-delete UPDATE (5560) | patients | محروس بـ SELECT سابق | دفاع-في-العمق |
| **غير قابل للإصلاح كوديّاً**: `blood_bank_units` PUT (2665) | blood_bank_units | **بلا tenant_id** | عبر `phi_class_a_residual_rls_candidate` (DDL) |
| obgyn_* (5823/5862/5916) | obgyn_* | **جداول ABSENT** | غير فعّالة؛ تُعالَج إن أُحييت |

## مبدأ الإصلاح
`requireTenantScope` + تقييد `UPDATE … WHERE id=$N AND tenant_id=$M` (rowCount=0 → 404)، tenantId من سياق موثوق فقط (`getRequestTenantContext`)، لا من الجسم. لا اعتماد على RLS (مُتجاوَز تحت postgres).

## الاختبارات
`cross_tenant_update_sweep_test.js` (جديد): **14/14**. انحدار: idor_sweep 29/0، refund 11/0، insert_stamping 13/0، failclosed 50/0، accounting 28/0. `node --check` OK.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P1_EXTENDED_MULTI_ROW_UPDATE_TENANT_GUARD_SWEEP (Option 1)
PRIORITY_LEVEL: P1 (tenant isolation)
USER_VISIBLE_ON_WEBSITE: NO ; LOCAL_CHANGES_REMAINING: NO ; COMMITTED: YES ; PUSHED: YES (بلا force)
PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO ; RUNTIME_CODE_CHANGED: YES (3 مسارات + اختبار)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2) + parent gitlink + 5 تقارير + ذاكرة ; FILES_DEPLOYED: 0 ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_DEPLOY (المتراكم) أو SECRET_READY_EXECUTE_SWITCH؛ + بقية UPDATEs المؤجَّلة + lab/rad defense-in-depth
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`EXTENDED_MULTI_ROW_UPDATE_TENANT_GUARD_SWEEP_COMPLETE`
