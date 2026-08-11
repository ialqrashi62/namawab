# NamaMedical Master Remediation v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** إغلاق كل الثغرات/الفجوات المتبقية بشكل آمن ومنهجي حتى تصبح المنظومة جاهزة تشغيلًا وإغلاقًا تشغيليًا وقانونيًا بدون كسر.

**Architecture:** التنفيذ سيكون على 4 مسارات متوازية مع بوابات إلزامية: (1) أمن/امتثال، (2) موثوقية البيانات والعزل، (3) تكاملات ZATCA/NPHIES/FHIR، (4) جودة وإطلاق. كل مسار يُنفَّذ على دفعات صغيرة مع تحقق آلي وإغلاق توثيقي لكل دفعة.

**Tech Stack:** Node.js + Express + PostgreSQL + Vanilla JS SPA + PM2 + SQL migrations + Jest/Node tests.

## Global Constraints

- الالتزام الصارم بـ 13 Safety Rails + Golden Access Rule كما في [AGENTS.md](AGENTS.md).
- لا نشر مباشر، لا force-push، لا DDL إنتاجي بدون موافقة المالك.
- أي تغيير مالي/PHI يجب أن يكون fail-closed + auditable.
- التحقق الإجباري قبل الإغلاق: tests + lint/syntax + changelog + closeout note.

---

## Scope Decomposition (Mandatory)

هذا الطلب واسع جدًا ("أصلح كل شيء") ويغطي عدة أنظمة مستقلة. لذلك تم تقسيمه إلى 5 حزم تنفيذ مستقلة، كل حزمة قابلة للإغلاق بذاتها:

1. Compliance & Security Hardening
2. Data Integrity & Tenant Isolation
3. Interop Readiness (ZATCA/NPHIES/FHIR)
4. Runtime Reliability & Observability
5. Release Governance & Documentation

---

### Task 1: Baseline Freeze + Gap Re-index

**Files:**
- Modify: [docs/REMEDIATION_MASTER_PLAN_AR.md](docs/REMEDIATION_MASTER_PLAN_AR.md)
- Modify: [docs/CHANGELOG.md](docs/CHANGELOG.md)
- Create: [docs/PHASE_REMEDIATION_V2_BASELINE_2026-08-09_AR.md](docs/PHASE_REMEDIATION_V2_BASELINE_2026-08-09_AR.md)

**Interfaces:**
- Consumes: الوضع الحالي من [docs/REMEDIATION_MASTER_PLAN_AR.md](docs/REMEDIATION_MASTER_PLAN_AR.md) + [docs/CHANGELOG.md](docs/CHANGELOG.md)
- Produces: baseline موحد مع KPI واضح (Severity counts / Gate status / Test status)

- [ ] Step 1: استخراج baseline موحد (الفجوات المفتوحة فقط)
- [ ] Step 2: تصنيف الفجوات حسب Blocker/High/Medium وربطها بـ G0..G5
- [ ] Step 3: اعتماد قائمة التنفيذ للأسبوعين القادمين (Top 10 only)
- [ ] Step 4: تحديث changelog بإدخال baseline v2
- [ ] Step 5: Commit

---

### Task 2: Merge Compliance Bundle (ZATCA/NPHIES/CBAHI)

**Files:**
- Modify: [namaweb/server.js](namaweb/server.js)
- Modify: [namaweb/public/js/app.js](namaweb/public/js/app.js)
- Create/Keep: [namaweb/lib/compliance/integration_settings.js](namaweb/lib/compliance/integration_settings.js)
- Create/Keep: [namaweb/lib/compliance/zatca_settings.js](namaweb/lib/compliance/zatca_settings.js)
- Test: [namaweb/integration_settings_test.js](namaweb/integration_settings_test.js)
- Test: [namaweb/zatca_settings_route_integration_test.js](namaweb/zatca_settings_route_integration_test.js)
- Test: [namaweb/zatca_submit_fail_closed_guard_test.js](namaweb/zatca_submit_fail_closed_guard_test.js)
- Test: [namaweb/nphies_cbahi_ui_config_test.js](namaweb/nphies_cbahi_ui_config_test.js)

**Interfaces:**
- Consumes: commit `2694b5f` على الفرع `feat/compliance-nphies-cbahi-zatca-ready`
- Produces: تكوينات تكامل محمية + redaction + fail-closed submit

- [ ] Step 1: تطبيق commit عبر cherry-pick على فرع الدمج
- [ ] Step 2: تشغيل 4 اختبارات الامتثال المستهدفة
- [ ] Step 3: توثيق أي اعتماد بيئي (better-sqlite3 على Windows/Node 24)
- [ ] Step 4: تحديث changelog بسجل تحقق فعلي
- [ ] Step 5: Commit (أو preserve commit SHA إذا cherry-pick clean)

---

### Task 3: XSS/CSP Enforcement Rollout (Safe Increment)

**Files:**
- Modify: [namaweb/public/js/app.js](namaweb/public/js/app.js)
- Modify: [namaweb/server.js](namaweb/server.js)
- Create: [namaweb/public/js/security/safe_dom.js](namaweb/public/js/security/safe_dom.js)
- Create: [namaweb/csp_enforce_rollout_test.js](namaweb/csp_enforce_rollout_test.js)

**Interfaces:**
- Consumes: CSP nonce infrastructure الموجودة
- Produces: خفض sinks الخطرة + سياسة CSP enforce-ready

- [ ] Step 1: حصر كل innerHTML حسب الخطورة (user/PHI first)
- [ ] Step 2: استبدال المسارات عالية الخطورة بـ safe renderer
- [ ] Step 3: تفعيل CSP_ENFORCE في staging profile فقط
- [ ] Step 4: جمع تقارير csp-report لمدة 48 ساعة ومعالجة الانكسارات
- [ ] Step 5: تثبيت policy النهائية + Commit

---

### Task 4: Validation-by-Boundary (Finance + Clinical First)

**Files:**
- Modify: [namaweb/validation.js](namaweb/validation.js)
- Modify: [namaweb/server.js](namaweb/server.js)
- Modify: [namaweb/route_schemas.js](namaweb/route_schemas.js)
- Create: [namaweb/validation_finance_clinical_test.js](namaweb/validation_finance_clinical_test.js)

**Interfaces:**
- Consumes: middleware validateBody + schemas الحالية
- Produces: رفض موحد 400 على جميع مدخلات المسارات الحرجة

- [ ] Step 1: ربط schemas على كل endpoint مالي/طبي متبقي
- [ ] Step 2: إضافة اختبارات negative لكل schema
- [ ] Step 3: التحقق من عدم كسر تدفق UI الحالي
- [ ] Step 4: توثيق contract الأخطاء الموحد
- [ ] Step 5: Commit

---

### Task 5: Money Safety (Idempotency + NUMERIC Migration)

**Files:**
- Modify: [namaweb/idempotency.js](namaweb/idempotency.js)
- Modify: [namaweb/server.js](namaweb/server.js)
- Modify: [namaweb/migrations/e22_01_money_numeric_up.sql](namaweb/migrations/e22_01_money_numeric_up.sql)
- Modify: [namaweb/migrations/e22_01_money_numeric_down.sql](namaweb/migrations/e22_01_money_numeric_down.sql)
- Create: [namaweb/migrations/e22_01_money_numeric_validate.sql](namaweb/migrations/e22_01_money_numeric_validate.sql)
- Test: [namaweb/e10_finance_engine_test.js](namaweb/e10_finance_engine_test.js)

**Interfaces:**
- Consumes: guard الحالي + parseMoney + finance_engine
- Produces: عدم ازدواج القيد + دقة مالية NUMERIC

- [ ] Step 1: فرض Idempotency-Key على كل money mutation path
- [ ] Step 2: تشغيل migration على staging فقط + validate script
- [ ] Step 3: مقارنة نتائج pre/post (totals/tax/rounding)
- [ ] Step 4: إعداد rollback مجرّب عمليًا
- [ ] Step 5: Commit + owner approval pack

---

### Task 6: Tenant Isolation & RLS Continuous Verification

**Files:**
- Modify: [namaweb/db_postgres.js](namaweb/db_postgres.js)
- Modify: [namaweb/server.js](namaweb/server.js)
- Create: [namaweb/rls_continuous_guard_test.js](namaweb/rls_continuous_guard_test.js)
- Create: [namaweb/scripts/verify_force_rls.ps1](namaweb/scripts/verify_force_rls.ps1)

**Interfaces:**
- Consumes: FORCE_RLS coverage الحالية
- Produces: فحص دوري يمنع أي regression في العزل

- [ ] Step 1: تنفيذ فحص يومي لكل الجداول tenant-aware
- [ ] Step 2: اختبار فشل مغلق عند غياب tenant context
- [ ] Step 3: ربط النتيجة في /api/metrics/security summary
- [ ] Step 4: إيقاف الدمج عند فشل الحارس
- [ ] Step 5: Commit

---

### Task 7: Audit Integrity + 7y Retention

**Files:**
- Modify: [namaweb/server.js](namaweb/server.js)
- Modify: [namaweb/audit_middleware.js](namaweb/audit_middleware.js)
- Create: [namaweb/audit_chain_retention_test.js](namaweb/audit_chain_retention_test.js)
- Create: [docs/PHASE_AUDIT_CHAIN_RETENTION_2026-08-09_AR.md](docs/PHASE_AUDIT_CHAIN_RETENTION_2026-08-09_AR.md)

**Interfaces:**
- Consumes: hash-chain implementation الحالية
- Produces: تحقق chain health + retention policy evidence

- [ ] Step 1: فحص gaps/chain breaks عبر كل tenant
- [ ] Step 2: تفعيل policy retention + archive rotation evidence
- [ ] Step 3: إضافة تنبيه تلقائي عند gap > 0
- [ ] Step 4: تقرير امتثال HIPAA/PDPL
- [ ] Step 5: Commit

---

### Task 8: Interop Go-Live Readiness (ZATCA/NPHIES/FHIR)

**Files:**
- Modify: [namaweb/zatca_phase2.js](namaweb/zatca_phase2.js)
- Modify: [namaweb/nphies_client.js](namaweb/nphies_client.js)
- Modify: [namaweb/fhir_routes.js](namaweb/fhir_routes.js)
- Create: [docs/INTEROP_GO_LIVE_CHECKLIST_2026-08-09_AR.md](docs/INTEROP_GO_LIVE_CHECKLIST_2026-08-09_AR.md)

**Interfaces:**
- Consumes: الإعدادات المتوافقة من Task 2
- Produces: readiness pack قبل أي تكامل حي

- [ ] Step 1: توحيد أخطاء onboarding (machine-readable codes)
- [ ] Step 2: retries/backoff/timeouts لكل clients
- [ ] Step 3: test harness sandbox-only دون أسرار حقيقية
- [ ] Step 4: owner cutover checklist (red-lane approvals)
- [ ] Step 5: Commit

---

### Task 9: CI Quality Gates Enforcement

**Files:**
- Modify: [namaweb/package.json](namaweb/package.json)
- Modify: [.github/workflows](.github/workflows)
- Create: [namaweb/scripts/ci_gate_runner.js](namaweb/scripts/ci_gate_runner.js)
- Create: [docs/QUALITY_GATES_RUNBOOK_2026-08-09_AR.md](docs/QUALITY_GATES_RUNBOOK_2026-08-09_AR.md)

**Interfaces:**
- Consumes: test files + migration validators + security checks
- Produces: فشل CI تلقائي عند كسر أي Gate

- [ ] Step 1: تعريف profile `test:safe`, `test:compliance`, `test:security`
- [ ] Step 2: إضافة gate ordering (G0→G5)
- [ ] Step 3: نشر artifacts (test reports + security evidence)
- [ ] Step 4: توثيق سياسات pass/fail
- [ ] Step 5: Commit

---

### Task 10: Release, Closeout, and Owner Sign-off

**Files:**
- Modify: [docs/CHANGELOG.md](docs/CHANGELOG.md)
- Create: [docs/PHASE_REMEDIATION_V2_CLOSEOUT_AR.md](docs/PHASE_REMEDIATION_V2_CLOSEOUT_AR.md)
- Create: [docs/OWNER_SIGNOFF_REMEDIATION_V2_AR.md](docs/OWNER_SIGNOFF_REMEDIATION_V2_AR.md)

**Interfaces:**
- Consumes: مخرجات Tasks 1..9
- Produces: حزمة إغلاق رسمية (تقني + تشغيلي + امتثال)

- [ ] Step 1: تحديث changelog نهائي بكل الروابط
- [ ] Step 2: إعداد closeout مع evidence IDs
- [ ] Step 3: إعداد sign-off checklist (Risk accepted / Deferred / Closed)
- [ ] Step 4: توثيق ما هو خارج النطاق وما بعد الإصدار
- [ ] Step 5: Final Commit

---

## Execution Waves (Recommended)

- Wave A (48h): Tasks 1 + 2 + 9 (baseline + compliance merge + CI gates)
- Wave B (5 days): Tasks 3 + 4 + 5 (XSS/CSP + validation + money safety)
- Wave C (3 days): Tasks 6 + 7 (RLS continuous + audit integrity)
- Wave D (3 days): Tasks 8 + 10 (interop readiness + closeout)

## Exit Criteria (Project-Level DoD)

- G0..G5 كلها PASS مع evidence قابل للتدقيق.
- لا Blocker/High مفتوحة في مسارات PHI/Money/Auth/Tenant.
- 100% من اختبارات الامتثال/الحماية الحرجة PASS.
- تقارير closeout + owner signoff مكتملة وموقّعة.

## Risks & Mitigations

- Risk: كسر frontend عند CSP enforce.
  - Mitigation: staging rollout + report-only burn-in + incremental sink replacement.
- Risk: migration مالية تؤثر على التقارير التاريخية.
  - Mitigation: validate script + shadow compare + rollback rehearsed.
- Risk: ضوضاء مستودع (dirty tree) تعطل الدمج.
  - Mitigation: isolated worktrees + commit-scoped cherry-pick only.

## Immediate Start Command Pack

1. `git -C namaweb checkout integration/all-epics`
2. `git -C namaweb cherry-pick 2694b5f`
3. `cd namaweb && node integration_settings_test.js`
4. `cd namaweb && node zatca_submit_fail_closed_guard_test.js`
5. `cd namaweb && node nphies_cbahi_ui_config_test.js`
6. `cd namaweb && node zatca_settings_route_integration_test.js`

---

Plan complete and saved to [docs/superpowers/plans/2026-08-09-master-remediation-v2.md](docs/superpowers/plans/2026-08-09-master-remediation-v2.md).
