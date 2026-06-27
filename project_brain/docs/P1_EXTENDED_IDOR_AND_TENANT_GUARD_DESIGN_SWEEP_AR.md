# P1 — مسح IDOR موسّع وتصميم حارس المستأجر (Extended IDOR & Tenant-Guard Design Sweep)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_..._CONTINUE_FROM_PHASE_134` — Option B (المختارة) | التاريخ: 2026-06-21
> **code-only محدود + audit/design** | لا deploy/DDL/data/flag/journal/Stitch/force.

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

## لماذا Option B
السرّ غير جاهز (P0 RLS switch محجوب)، ونشر التصليب (3768bf3) محجوب على موافقة. الأعلى أولوية الآمنة القابلة للتنفيذ الآن = مسح موسّع للمسارات المتبقية (audit/design + code-only محدود) لإغلاق فئة IDOR ما دامت RLS مُتجاوَزة.

## سجل التصنيف (المسارات المُعدِّلة بـ id)
### حذف بـ id (DELETE)
| المسار/السطر | الجدول | tenant_id؟ | الحالة | التصنيف |
| ------------ | ------ | --------- | ------ | ------- |
| `DELETE /api/appointments/:id` (680) | appointments | نعم | فحص ملكية tenant قبله (678) → 404 | safe-as-is (guarded) |
| `DELETE /api/surgeries/:id` (2319) | surgeries | نعم | tenantFilter | safe-as-is |
| `DELETE /api/inventory/:id` (7348) | inventory | نعم | فلتر tenant (شرطي) | safe-as-is (يُفضّل تصليب) |
| `DELETE /api/patients/:id` (5519/5539) | patients | نعم | Admin-only + فحص ملكية tenant (5529) → 404 | safe-as-is (guarded؛ تصليب P2) |
| `DELETE /api/employees/:id` (706) | employees | **لا** | بلا فحص، بلا requireRole | **requires-design-decision** (global/facility؟) |
| `DELETE /api/system_users/:id` (1590) | system_users | **لا** | فحص آخر-admin فقط | global/admin — design decision |
| `DELETE /api/messages/:id` (4961) | internal_messages | **لا** | بلا فحص ملكية | requires-design-decision (user-owned؟) |

### تحديث بـ id (UPDATE single-line)
| المسار/السطر | الجدول | tenant_id؟ | التصنيف |
| ------------ | ------ | --------- | ------- |
| `DELETE form_templates is_active=0` (1792) | form_templates | **لا** | global catalog — design decision (low) |
| `cme_activities registered+1` (4539) | cme_activities | **لا** | global — design decision (low) |
| `internal_messages is_read=1` (4955) | internal_messages | **لا** | user-owned — design decision (low) |
| `notifications is_read=1` (5656) | notifications | **لا** | user/role-owned — design decision (low) |
| **`POST /api/visits`** (5662/5669) | patient_visits + patients | نعم (patients) | **must-fix IDOR** → **أُصلِح** |

## الإصلاح المنفّذ (code-only، fail-closed)
**`POST /api/visits`**: كان يقبل `patient_id` من الجسم ويُنشئ زيارة + يزيد عدّادات `patients` **بلا فحص ملكية** (شذّ عن بقية مسارات الإنشاء التي تتحقق `patients WHERE id=$1 AND tenant_id=$2`). الإصلاح: `requireTenantScope` + فحص ملكية المريض (tenant-scoped) قبل الإدراج + تقييد `UPDATE patients … WHERE id=$1 AND tenant_id=$2`. اختبار محدَّث **19/19**؛ انحدار أخضر؛ `node --check` OK.

## قرارات التصميم المطلوبة (لم تُلمَس — تحتاج قرار المالك)
- `employees`/`system_users`/`internal_messages`/`notifications`/`form_templates`/`cme_activities`: **بلا `tenant_id`** ⇒ لا يمكن تطبيق فلتر tenant. يلزم قرار: هل هي global/admin (آمنة كما هي) أم تحتاج نموذج عزل (tenant_id backfill أو فحص ملكية user_id)؟ معظمها منخفض الخطورة (عدّادات/قراءات حالة) عدا حذف `employees`/`system_users` (إداري).

## حدود المسح (لا ادعاء تغطية كاملة)
غُطّي: DELETE-by-id (7)، UPDATE-by-id أحادي السطر (5)، وSELECT-by-id حتى السطر 2243 (الجولة السابقة). **لم يُغطَّ بالكامل**: UPDATE متعدد الأسطر، وكل مسارات الإنشاء التي تستقبل `patient_id`/معرّفات مملوكة (فحص الملكية فيها متفاوت). يُوصى بمسح مكرّس لاحق لمسارات الإنشاء + GET-by-id لـ PHI.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P1_EXTENDED_IDOR_AND_TENANT_GUARD_DESIGN_SWEEP (Option B)
USER_VISIBLE_ON_WEBSITE: NO (الحيّ على 8f012a0؛ غير منشور)
LOCAL_CHANGES_REMAINING: NO (بعد commit/push)
COMMITTED: YES ; PUSHED: YES (بلا force)
PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: YES (POST /api/visits fail-closed + اختبار)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2: server.js + sweep test) + parent gitlink + تقارير + ذاكرة
FILES_DEPLOYED: 0 ; FILES_NOT_DEPLOYED: الكل ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: OWNER_APPROVE_DEPLOY (الإصلاحات المتراكمة fail-closed) أو SECRET_READY_EXECUTE_SWITCH (الحل الجذري)
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`EXTENDED_IDOR_AND_TENANT_GUARD_DESIGN_SWEEP_COMPLETE`
