# {{DEPT_NAME_AR}} — User Stories & Acceptance Criteria
## NamaMedical Department

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **عدد القصص:** {{NUM_STORIES}}

---

## 1. المستخدمون الأساسيون (Personas)

| Persona | الدور | الصلاحيات | الألم |
|---|---|---|---|
| **{{PERSONA_1_AR}}** | {{ROLE_1}} | {{PERMS_1}} | {{PAIN_1}} |
| **{{PERSONA_2_AR}}** | {{ROLE_2}} | {{PERMS_2}} | {{PAIN_2}} |
| **{{PERSONA_3_AR}}** | {{ROLE_3}} | {{PERMS_3}} | {{PAIN_3}} |
| **{{PERSONA_4_AR}}** | {{ROLE_4}} | {{PERMS_4}} | {{PAIN_4}} |

---

## 2. قصص المستخدم (User Stories)

### US-001: {{STORY_1_TITLE_AR}}
**As a** {{ROLE_AR}}
**I want** {{CAPABILITY_AR}}
**So that** {{BENEFIT_AR}}

**Acceptance Criteria:**
- [ ] **AC-1.1:** {{AC_1_1_AR}}
- [ ] **AC-1.2:** {{AC_1_2_AR}}
- [ ] **AC-1.3:** {{AC_1_3_AR}}
- [ ] **AC-1.4:** يعمل مع i18n (AR/EN/FR/UR)
- [ ] **AC-1.5:** يلتزم بـ tenant isolation
- [ ] **AC-1.6:** يتم تسجيله في audit log
- [ ] **AC-1.7:** يعمل offline (PWA)
- [ ] **AC-1.8:** a11y WCAG 2.2 AA

**Priority:** {{PRIORITY_1}} | **Story Points:** {{POINTS_1}} | **Sprint:** {{SPRINT_1}}

**Definition of Done:**
- [ ] الكود مكتوب ومراجع
- [ ] Unit tests ≥ 5 (تغطية ≥ 80%)
- [ ] Integration tests ≥ 3
- [ ] E2E test (Playwright) ≥ 1
- [ ] OpenAPI spec محدّث
- [ ] i18n keys مضافة (4 لغات)
- [ ] Wireframe + Stitch HTML
- [ ] Manual QA pass
- [ ] تم النشر على staging
- [ ] Smoke test pass

---

### US-002: {{STORY_2_TITLE_AR}}
**As a** {{ROLE_AR}}
**I want** {{CAPABILITY_AR}}
**So that** {{BENEFIT_AR}}

**Acceptance Criteria:**
- [ ] **AC-2.1:** {{AC_2_1_AR}}
- [ ] **AC-2.2:** {{AC_2_2_AR}}
- [ ] **AC-2.3:** {{AC_2_3_AR}}
- [ ] **AC-2.4:** يعمل مع RLS
- [ ] **AC-2.5:** RBAC middleware chain
- [ ] **AC-2.6:** Cost tracking (إذا LLM)
- [ ] **AC-2.7:** Performance p95 < 200ms

**Priority:** {{PRIORITY_2}} | **Story Points:** {{POINTS_2}} | **Sprint:** {{SPRINT_2}}

---

### US-003: {{STORY_3_TITLE_AR}}
(نفس النمط...)

---

## 3. معايير القبول العامة (Global Acceptance)

### 3.1 Functional
- ✅ كل route له OpenAPI spec كامل
- ✅ كل endpoint له JSON Schema validation
- ✅ كل input/output مُعرَّف بـ TypeScript types
- ✅ كل business logic في pure function engine
- ✅ كل side-effect في router (DB, LLM, external)

### 3.2 Security
- ✅ JWT + MFA auth
- ✅ Tenant isolation (RLS + middleware)
- ✅ RBAC: 7-tier, role-permission map
- ✅ PHI redaction في logs
- ✅ No secrets في الكود (.env فقط)
- ✅ No PHI في commits (pre-commit hook)

### 3.3 Performance
- ✅ API p95 < 200ms
- ✅ DB query p95 < 100ms
- ✅ Frontend FCP < 1.5s
- ✅ LCP < 2.5s
- ✅ Time to Interactive < 3s
- ✅ Bundle size < 200 KB gzipped

### 3.4 Compliance
- ✅ PDPL: data residency, consent, erasure
- ✅ NPHIES: insurance claims
- ✅ CBAHI: 6 chapters
- ✅ ZATCA: e-invoicing Phase 2
- ✅ Audit log: hash-chained, 7+ سنوات

### 3.5 Quality
- ✅ Test coverage ≥ 80%
- ✅ E2E tests with Playwright
- ✅ Linting (ESLint, Prettier)
- ✅ TypeScript types (no `any`)
- ✅ Code review (2 reviewers)

### 3.6 UX / a11y
- ✅ WCAG 2.2 AA
- ✅ i18n AR/EN/FR/UR
- ✅ RTL support (Arabic)
- ✅ Mobile responsive
- ✅ Offline-first (PWA)
- ✅ MD3 design tokens

---

## 4. قصص إضافية (Out of scope MVP)

| Story | Description | ETA |
|---|---|---|
| US-101 | {{OOS_1_AR}} | W+1 |
| US-102 | {{OOS_2_AR}} | W+2 |
| US-103 | {{OOS_3_AR}} | W+3 |

---

## 5. Dependencies

- يحتاج: {{DEP_1}}
- يحتاج: {{DEP_2}}
- لا يعتمد على: {{INDEP}}

---

## 6. Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| {{RISK_1_AR}} | {{P_1}} | {{I_1}} | {{MIT_1_AR}} |
| {{RISK_2_AR}} | {{P_2}} | {{I_2}} | {{MIT_2_AR}} |

---

## 7. Sprint breakdown

| Sprint | Stories | Total Points |
|---|---|---|
| Sprint 1 | US-001, US-002, US-003 | 13 |
| Sprint 2 | US-004, US-005 | 8 |
| Sprint 3 | US-006, US-007, US-008 | 21 |

---

> **Next:** [08_TEST_CASES_TEMPLATE_AR.md](08_TEST_CASES_TEMPLATE_AR.md) — test plan.
