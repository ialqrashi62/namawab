# P1 — إغلاق نشر مسح حارس المستأجر (Controlled Deploy — BLOCKED)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_..._CONTINUE_FROM_PHASE_134` — المرحلة المختارة (Option A) | التاريخ: 2026-06-21.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## ما حدث في هذه الجولة
1. **استجابة لمراجعة أمنية آلية** على commit `e52a140`: كشفت أن نمط حارس المستأجر **fail-open** (`tenantId ? ' AND tenant_id=$2' : ''` يتخطّى الشرط عند غياب السياق) وأن `UPDATE` غير مقيّد بـ tenant (نافذة TOCTOU). **صحيح.**
2. **التصليب (code-only)**: المسارات الثلاثة الآن **fail-closed**: `requireTenantScope` + تقييد `UPDATE`/`SELECT` بـ `tenant_id` (atomic، بلا TOCTOU). الاختبار 15/15 + انحدار أخضر + `node --check` OK. دُفع: **namaweb `e52a140 → 3768bf3`**.
3. **النشر مُنع (صواب)**: تفويض المالك في Option A نصّ على **نشر `e52a140` فقط**. التصليب غيّر الكود إلى `3768bf3` استجابةً لمراجعة آلية (ليست تعليمات المالك). نشر `3768bf3` **يتجاوز التفويض الصريح** ولم يراجعه المالك ⇒ **توقّفت ولم أنشر**.

## لماذا لا يصح نشر `e52a140` (المُفوَّض) كما هو
`e52a140` هو الإصدار **fail-open** الذي رفضته المراجعة الأمنية. نشره يعني نشر ثغرة. الإصدار الصحيح هو `3768bf3` (fail-closed) — لكنه يحتاج موافقة نشر صريحة جديدة.

## أثر على الموقع الحيّ
لا تغيير إنتاجي. التطبيق ما زال يعمل على **8f012a0** (إصلاح refund فقط). ⇒ **ثغرات الـ3 مسارات ما زالت حيّة** (queue status / referral / claim status) حتى يُنشر `3768bf3`. الإصلاح جاهز في Git لكن غير منشور.

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_DEPLOY_APPROVAL
SELECTED_PHASE: P1_TENANT_GUARD_SWEEP_CONTROLLED_PRODUCTION_DEPLOY (Option A)
USER_VISIBLE_ON_WEBSITE: NO (الحيّ على 8f012a0؛ التصليب غير منشور)
LOCAL_CHANGES_REMAINING: NO (بعد commit/push)
COMMITTED: YES ; PUSHED: YES (namaweb 3768bf3 + parent gitlink)
PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES (لـ 3768bf3 تحديداً)
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO (لقطة before==after: tables=149/coa=30/journal=0/invoices=3)
RUNTIME_CODE_CHANGED: YES (في Git؛ ليس في العملية الحيّة)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2: server.js + sweep test) + parent gitlink + تقارير + ذاكرة
FILES_DEPLOYED: 0 ; FILES_NOT_DEPLOYED: الكل
OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
ROLLBACK_READY: YES (backup 8f012a0 + revert)
NEXT_REQUIRED_ACTION: OWNER_APPROVE_DEPLOY_OF_3768bf3 (الإصدار fail-closed، يُلغي تفويض e52a140 fail-open)
```

## المطلوب من المالك
الموافقة الصريحة على **نشر `namaweb 3768bf3`** (الإصدار fail-closed المُصلَّب) بدل `e52a140` (fail-open). عند الموافقة: backup (تم) → node --check (تم) → `pm2 restart` → smoke → تحقّق الحُرّاس → إغلاق `PRODUCTION_DEPLOYED_PASS`.

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`TENANT_GUARD_SWEEP_CONTROLLED_DEPLOY_BLOCKED_COMPLETE`
