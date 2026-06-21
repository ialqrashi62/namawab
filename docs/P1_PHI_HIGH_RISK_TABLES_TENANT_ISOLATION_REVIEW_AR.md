# P1 — مراجعة عزل جداول PHI عالية الخطورة (PHI High-Risk Tables Tenant Isolation Review)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_..._RESELECT_AND_EXECUTE` — Option 5 (المختارة) | التاريخ: 2026-06-21
> **read-only + SQL candidates فقط** | لا DDL/RLS-change/deploy/data.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR
- MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR
- MEDICAL_RLS_RECONCILIATION_AUTOPILOT_SKILL_AR
- MEDICAL_RLS_POLICY_DESIGN_SKILL_AR
- MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## لماذا Option 5
السرّ غير جاهز (P0 RLS switch محجوب)، والنشر المتراكم محجوب على موافقة. Option 5 (read-only + candidates) هو أعلى P1 (عزل PHI) قابل للتنفيذ الآن **دون تراكم كود runtime غير منشور** ودون موافقة — يعالج فجوة Class A المعروفة (R2).

## التصنيف (فحص read-only)
| الجدول | tenant_id | RLS/FORCE | صفوف | التصنيف | الإجراء المرشّح |
| ------ | :-------: | :-------: | :--: | ------- | --------------- |
| blood_bank_crossmatch | ✅ | ✅ FORCE | 0 | محمي | — |
| blood_bank_transfusions | ✅ | ✅ FORCE | 0 | محمي | — |
| package_sessions | ✅ | ✅ FORCE | 0 | محمي | — |
| portal_appointments | ✅ | ✅ FORCE | 0 | محمي | — |
| consent_forms / mortuary_cases / patient_referrals | ✅ | ✅ FORCE | 0 | محمي | — |
| **portal_users** | ✅ | ❌ | 0 | **فجوة** (لديه tenant_id) | تفعيل RLS فقط |
| **audit_trail** | ✅ | ❌ | 44 (كلها tenant_id غير NULL) | **فجوة** (+قرار قراءة admin) | تفعيل RLS (مع قرار تصميم) |
| **packages** | ❌ | ❌ | 0 | **فجوة** (بلا tenant_id) | ADD tenant_id + RLS (فارغ → بلا backfill) |
| **blood_bank_donors** | ❌ | ❌ | 0 | **فجوة** | ADD tenant_id + RLS |
| **blood_bank_units** | ❌ | ❌ | 0 | **فجوة** | ADD tenant_id + RLS |

**ملاحظة مهمة**: الجداول الناقصة لـ tenant_id **فارغة (0 صفوف)** ⇒ إضافة العمود + RLS **بلا أي backfill بيانات** = منخفض الخطورة. و`audit_trail` كل صفوفه الـ44 لديها tenant_id (لن تُخفى عند التفعيل).

## المرشّحات المنتَجة (candidate-only، DO NOT EXECUTE)
- `docs/sql/phi_class_a_residual_rls_candidate_up.sql` — تفعيل RLS للمجموعة 1 (portal_users/audit_trail) + ADD tenant_id/facility_id + RLS للمجموعة 2 (packages/blood_bank_donors/blood_bank_units). idempotent، نمط السياسة مطابق للـ115.
- `..._validate.sql` — تحقق read-only (FORCE+policy موجود، tenant_id موجود، لا NULL tenant).
- `..._down.sql` — تراجع كامل (إسقاط السياسات/الأعمدة المضافة).

## تبعيات وقرارات (موثّقة، لم تُنفَّذ)
1. **فعالية RLS** متوقفة على `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` (التطبيق يجب أن يتصل بـ nama_medical_app؛ تحت postgres تبقى السياسات متجاوَزة).
2. **تبعية كود**: بعد إضافة tenant_id لـ packages/blood_bank_*، يجب أن تختم مسارات الإدراج tenant_id (code-only منفصل).
3. **قرار تصميم audit_trail**: هل يقرؤه super-admin عابراً للمستأجرين؟ إن نعم، يلزم دور/استثناء قراءة بدل سياسة tenant صارمة.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: DOCS_AND_SQL_CANDIDATE_ONLY_PASS
SELECTED_PHASE: P1_PHI_HIGH_RISK_TABLES_TENANT_ISOLATION_REVIEW (Option 5)
PRIORITY_LEVEL: P1 (PHI isolation)
USER_VISIBLE_ON_WEBSITE: NO ; LOCAL_CHANGES_REMAINING: NO (بعد commit/push)
COMMITTED: YES ; PUSHED: YES ; PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: N/A (candidate)
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO ; RUNTIME_CODE_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO (candidate only) ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: 1 report + 3 SQL candidates + memory ; FILES_DEPLOYED: 0 ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: BLOCKED_PENDING_DDL_APPROVAL (لتطبيق المرشّح) — ويعتمد فعلياً على P0 role switch + ختم tenant_id في كود الإدراج
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`PHI_HIGH_RISK_TABLES_TENANT_ISOLATION_REVIEW_COMPLETE`
