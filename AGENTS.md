# AGENTS.md — NamaMedical (jumanaMedical ERP)

> **Read this first.** This is the project charter for any human or AI agent
> working on the NamaMedical platform. It is intentionally short. It points
> to canonical sources instead of duplicating them.

---

## 0. What this project is

**jumanaMedical ERP** — a comprehensive, multi-tenant hospital management
platform for Saudi Arabia and the wider region.

- **Stack:** Node.js + Express + PostgreSQL (pg pool) + Vanilla JS SPA + Tailwind
- **Compliance:** ZATCA Phase 2 · NPHIES · CBAHI · PDPL · HIPAA-aligned
- **Live deployment:** Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74) ·
  jumanasoft.com · PM2 process `nama-medical-erp` · branch
  `integration/all-epics` @ `5539629`
- **Scope:** 44 clinical departments · 16 facility types (entitlement matrix)
  · 100+ clinical engines · 80+ governance skills

> If you are an AI agent: read this entire file, then read the linked
> canonical docs in the order shown, **before** writing any code.

---

## 1. Repository map (source of truth)

| Concern | Canonical location | What it is |
|---|---|---|
| **Live application code** | `namaweb/` | Express server + SPA + migrations + tests (the only place production code lives) |
| **Audit fork (read-only snapshot)** | `namaweb-ovr-audit-independent/` | Frozen copy used for independent security review. Do not edit; sync from `namaweb/` is owner-authorized only |
| **Architecture map** | [`docs/ARCHITECTURE_MAP_AR.md`](docs/ARCHITECTURE_MAP_AR.md) | High-level architecture (start here for system overview) |
| **Governance constitutions** | `docs/governance/enterprise-engineering-constitution/` | 11-31: engineering, architecture, data, privacy, security, clinical, integration, finance, SaaS, DevSecOps, etc. |
| **Department blueprints** | `docs/governance/enterprise-hospital-platform/` | 32-61: 40 clinical departments + 110 STITCH design system |
| **Engineering standards** | `docs/governance/enterprise-engineering-constitution/standards/` | Coding, API, Database, Security, Testing, etc. |
| **ADRs** | `docs/governance/enterprise-engineering-constitution/adrs/` | Architecture Decision Records |
| **Quality gates** | `docs/governance/enterprise-engineering-constitution/quality-gates/` | QG-001 → QG-012 checklists |
| **Skills (procedural memory)** | `project_brain/skills/` | 80+ focused skills. Start with `nama-medical/NM_SKILLS_INDEX_AR.md` |
| **Skills (Stitch design system)** | `project_brain/skills/stitch-*` | HTML→React conversion + design tokens |
| **Live deploy runbooks** | `ops/live_deploy/` | DEPLOY_NOTES.md, e22 runbook, route_schemas.live.js |
| **Sandboxes** | `tools/{mirth,fhir,orthanc,vault}-sandbox/` | Loopback-only, dummy-data integration testing |
| **AI behavior contract** | [`.ai_rules`](.ai_rules) | Senior-dev rules, phase-by-phase workflow, no-abbreviation rule |
| **Phase closeout reports** | `docs/PHASE_*_AR.md` + `*_REPORT_AR.md` | Per-phase remediation history (1A, 1B, 2A-E, etc.) |
| **Changelog** | `docs/CHANGELOG.md` | Single source of release notes |
| **Security policy** | `docs/SECURITY.md` | Vuln disclosure, crypto, audit retention |
| **Pre-existing project brain** | `project_brain/docs/` | Mirror of `docs/`; use `docs/` as canonical unless noted |

> **Rule of one:** if you find the same content in multiple places, the
> canonical is the path in the leftmost "**Live**" column above. Update
> the canonical first, then mirror if needed. Never edit a mirror without
> also updating the canonical.

---

## 2. The AI operating contract (binding)

> This section supersedes anything you may have read elsewhere. It is
> not aspirational; it is enforced by review.

### 2.1 Behavior (from `.ai_rules`)

- **Persona:** Senior Full-Stack Developer + Expert Security Auditor.
- **No abbreviations:** never `// ... rest of code`, no
  `/* add previous logic here */`, no truncation. Every code file must be
  complete and copy-pasteable.
- **Three-step workflow for every change:**
  1. **Logical analysis** (الـ[تحليل المنطقي]) — pitfalls, security, UX
  2. **Quality self-review** (الـ[مراجعة الجودة]) — XSS/CSRF/CSP, perf, UX
  3. **Implementation** (الـ[تنفيذ]) — only the corrected, complete code
- **Phase-by-phase:** never jump ahead. Wait for explicit user/owner
  approval of a phase before starting the next.

### 2.2 Safety rails (NON-NEGOTIABLE)

These are project-wide invariants. Violating any of them is a blocking
finding, not a style issue.

| # | Rail | Why |
|---|---|---|
| 1 | **No hardcoded secrets** anywhere in tracked files | `.env` ignored; `.env.example` is placeholders only (`__CHANGE_ME__`) |
| 2 | **No PHI in commits, fixtures, or sandbox runs** | All sandboxes use dummy data; loopback-only |
| 3 | **No force-push to `main`, `integration/*`, or `audit/*` branches** | Linear history only; merges via PR |
| 4 | **No DELETE FROM / DROP on production without owner-authorized backup path** | `restore_db.sh` style scripts require a recent dump |
| 5 | **Tenant isolation stays on** — `requireTenantScope` on every protected route; RLS policies stay enabled (`FORCE_RLS=150`) | Defense-in-depth; both layers must work |
| 6 | **Money routes stay idempotent + opt-in + fail-open** | The 4 protected routes use the idempotency guard exactly as designed |
| 7 | **PHI at rest stays encrypted** | `crypto_envelope.js` (DPAPI KEK) for blobs; radiology files live in `phi_vault/` outside webroot |
| 8 | **CSP stays report-only by default** | `CSP_ENFORCE=true` is a separate approved deploy only |
| 9 | **All money/VAT calculations server-side** | Never trust client totals/discount/VAT; `parseMoney` + `finance_engine.vatFromInclusive` only |
| 10 | **Audit log is hash-chained, 7+ years retention** | `audit_middleware.js` is inert by default; enabling is a gate decision |
| 11 | **Fail-closed on missing tenant context** | Defense-in-depth: `getPatientActiveMeds` etc. throw on missing tenantId; callers treat as FAIL-SAFE (warn, never skip) |
| 12 | **No print of secrets, tokens, or PHI in logs** | `console.log` of `req.body`, headers, or DB rows is a finding |
| 13 | **Golden Access Rule** | Owner/Admin has absolute access; Doctors/Staff have strict Specialty-Based Access (cannot access other specialties without explicit permission) |

### 2.3 What you may do without asking

- Read any file under `namaweb/`, `docs/`, `project_brain/`, `tools/`
- Add a new file under `docs/governance/...` following the existing
  template and naming convention (`NN_TOPIC_AR.md`)
- Add a focused skill under `project_brain/skills/` following the
  existing skill format
- Add a new migration under `namaweb/migrations/` with the next
  number in the appropriate `eN_*_NN_*.sql` series
- Run static analysis / linting / the existing test suite locally

### 2.4 What requires explicit owner approval

- Any change to `namaweb/server.js` route definitions or middleware
- Any change to `namaweb/db_postgres.js` schema or tenant context
- Any change to `ops/live_deploy/*` or any live-server command
- Any change to `tools/*-sandbox/` that enables real network access
- Any change to `.env.example` that adds a *new* secret category
- Any change to this `AGENTS.md` or `.ai_rules` (governance drift)
- Any merge to `main`, `integration/*`, or `audit/*`
- Any push to a remote (the repo is local-only unless owner authorizes)

---

## 3. Phase-by-phase execution

For any non-trivial task, follow this exact sequence. Each phase
produces a verifiable artifact before the next phase begins.

### Phase 1 — Logical analysis (لا تبدأ كود قبله)
- Restate the problem in 1–2 sentences
- List affected files (read them, do not assume)
- Identify the constraint(s): security, compliance, performance, UX
- Identify the safety rail(s) from §2.2 that apply
- Propose 2+ approaches and pick one with a stated reason

### Phase 2 — Quality self-review (قبل ما تعرض)
- Walk through your draft against the 12 safety rails
- Check: input validation, tenant scoping, error paths, logs (no
  secret/PHI print), CSP, RBAC, idempotency
- Check: tests exist or are added for every new path
- Check: migration forward + `*_down.sql` are both present and
  non-destructive (never DROP data, never lose RLS)

### Phase 3 — Implementation
- Deliver the complete code, not a snippet
- Deliver the migration(s) up + down
- Deliver the test(s) with assertions, not just smoke runs
- Deliver the closeout note: what changed, what was verified, what
  is intentionally out of scope

### Phase 4 — Wait for approval
- The owner/user explicitly approves a phase before you start the
  next. Default to "wait" — never assume "go" by silence.

---

## 4. Module & stack quick reference

### 4.1 Backend engines (in `namaweb/`)

| Layer | Modules |
|---|---|
| **Security** | `helmet`, `cors` allowlist, CSP report-only, `express-rate-limit`, `express-session` (Redis + MemoryStore fallback) |
| **Auth** | bcryptjs, MFA (TOTP) |
| **Validation** | `validation.js` (fail-closed), `route_schemas.js` (non-breaking) |
| **Tenant** | `tenant_resolve.js` (GATE4), `tenant_context.js` (AsyncLocalStorage) |
| **RBAC** | `rbac.js`, `rbac_guards.js`, `audit_middleware.js` |
| **PHI** | `crypto_envelope.js` (DPAPI KEK), `phi_vault/` outside webroot |
| **Clinical pure engines** | `cds.js`, `lis.js`, `ews_engine.js`, `icu_scoring.js`, `specialty_scores.js`, `nursing_scores.js`, `esi_engine.js`, `bloodbank_compat.js`, `ob_engine.js`, `obgyn_peds_wave3_engine.js`, `surgical_wave2_engine.js`, `diagnostics_wave4_engine.js`, `critical_care_wave5_engine.js`, `rare_specialized_engine.js`, `internal_medicine_wave1_engine*.js`, `pathology_engine.js` |
| **Finance & ops** | `finance_engine.js`, `billing_integrity.js`, `billing_adapter.js`, `e10_finance_engine_test.js` |
| **Insurance & integrations** | `e11_insurance_engine.js`, `nphies_client.js`, `zatca_phase2.js`, `payment_adapter.js`, `email_service.js`, `sms_service.js` |
| **Inventory & HR** | `e16_inventory_engine.js`, `e18_hr_engine.js` |
| **Onboarding** | `onboarding.js` (E0 facility wizard) |
| **Idempotency** | `idempotency.js` (GATE7, opt-in + fail-open) |

### 4.2 Database

- **Engine:** PostgreSQL 14+
- **Schema:** 80+ tables · 87+ migrations
- **Migrations:** forward (`*_up.sql`) + reverse (`*_down.sql`), both
  non-destructive; numbered in series
- **Tenancy:** multi-tenant via `tenant_id` + RLS (150 tables,
  `FORCE_RLS=150`)
- **App role:** `nama_medical_app` (non-superuser); production
  schema is **not** auto-created (`SKIP_DB_INIT=1` or
  `NODE_ENV=production|staging`)
- **PHI:** `crypto_envelope.js` (envelope encryption, DPAPI KEK) for
  sensitive columns; radiology DICOM under `phi_vault/`

### 4.3 Frontend (`namaweb/public/`)

- 3 HTML files (`index.html`, `login.html`, `admin.html`)
- 17 JS modules; **main entry is `app.js`** (1.7 MB) with
  `doctor-station.js` and `nursing-station.js` as the heavy
  specialty modules
- 16 facility types × 18 modules × 8 themes × AR/EN + RTL/LTR
- XSS guards in `app.js` head: `escapeHTML`, `SafeHtml`, `safeId`,
  `safeUrl`, `jsStr` — **use them; never `innerHTML =` raw**

### 4.4 16 Facility types (entitlement matrix)

```
medical_city | general_hospital | tertiary_hospital | specialized_hospital
polyclinic | phc | specialty_center | diagnostic_center
rehabilitation_center | dialysis_center | dental_center
mental_health_center | home_healthcare_unit | mobile_clinic
virtual_clinic | health_unit
```

The full module-allowlist per facility type lives in
`namaweb/public/js/facility-catalog.js`. Update there first when
adding a new facility type.

---

## 5. Compliance gates (do not bypass)

| Gate | Reference | Status (as of last closeout) |
|---|---|---|
| **GATE 0** Global benchmark | `docs/GATE0_GLOBAL_BENCHMARK_GAP_ANALYSIS_AR.md` | ✅ |
| **GATE 1** Specialty scores | `docs/GATE1_SPECIALTY_SCORES_CLOSEOUT_AR.md` | ✅ |
| **GATE 2** EWS / Sepsis | `docs/GATE2_EWS_SEPSIS_CLOSEOUT_AR.md` | ✅ |
| **GATE 3** Order↔result loop | `docs/GATE3_ORDER_RESULT_LOOP_CLOSEOUT_AR.md` | ✅ |
| **GATE 4** Tenant header trust | `docs/GATE4_TENANT_HEADER_TRUST_CLOSEOUT_AR.md` | ✅ |
| **GATE 5** Clinical RLS | `docs/GATE5_CLINICAL_RLS_CLOSEOUT_AR.md` | ✅ |
| **GATE 6** Schema conflicts | `docs/GATE6_SCHEMA_CONFLICTS_CLOSEOUT_AR.md` | ✅ |
| **GATE 7** Idempotency | `docs/GATE7_IDEMPOTENCY_CLOSEOUT_AR.md` | ✅ |
| **GATE 8** NPHIES KSA | `docs/GATE8_NPHIES_KSA_BUNDLES_CLOSEOUT_AR.md` | ✅ |
| **GATE 9** ZATCA UBL XAdES | `docs/GATE9_ZATCA_UBL_XADES_BLOCKED_AR.md` | ⚠️ Blocked on real CSID/OTP credentials |
| **PHASE A1** EMR lock + signature | `docs/PHASE_A1_EMR_LOCK_SIGNATURE/` | ✅ |
| **PHASE A2** MFA | `docs/PHASE_A2_MFA/` | ✅ |
| **PHASE A3 / A3A** PHI encryption + public uploads guard | `docs/PHASE_A3_PHI_ENCRYPTION_VAULT/`, `docs/PHASE_A3A_PUBLIC_UPLOADS_GUARD/` | ✅ |
| **PHASE B D0** Secrets & key management | `docs/PHASE_B_D0_SECRETS_KEY_MANAGEMENT/` | ✅ |
| **PHASE B D1** Mirth sandbox | `docs/PHASE_B_D1_MIRTH_SANDBOX/`, `..._DEPLOYMENT/` | ✅ (sandbox only) |
| **PHASE B D2** FHIR sandbox + HAPI | `docs/PHASE_B_D2_FHIR_SANDBOX/`, `..._HAPI_FHIR_TRANSACTION_INGEST/` | ✅ (sandbox only) |
| **PHASE B D5** Orthanc PACS sandbox | `docs/PHASE_B_D5_ORTHANC_PACS_SANDBOX/` | ✅ (sandbox only) |
| **PHASE D** Observability & auto-recovery | `docs/PHASE_D_OBSERVABILITY_AUTORECOVERY/` | ✅ (code) — ops surface still thin |

> A gate marked ✅ is implemented and tested in code; ⚠️ means
> "ready but blocked on external credentials or owner action."

---

## 6. Common tasks — quick recipes

### Run the app locally
```bash
cd namaweb
cp .env.example .env       # edit placeholders
npm install
node server.js             # http://localhost:3000  (admin / admin)
```

### Run the test suite
```bash
cd namaweb
npm test                   # full suite
npm run test:safe          # safe subset
```

### Add a new migration
1. Pick the next number in the appropriate series (e.g. `e47_*`,
   `e50_*`, `p1_*`, or `ex_*` for cross-cutting)
2. Create `namaweb/migrations/<name>_up.sql` AND `<name>_down.sql`
3. Both must be **non-destructive** (never DROP data, never
   silently drop RLS)
4. Add a regression test under `namaweb/*_test.js`
5. Update `docs/CHANGELOG.md` under `[Unreleased] → Added`

### Add a new API route (server.js)
Required middleware chain (in this order):
```js
app.<verb>('/api/<area>/<path>',
    requireAuth,                  // session
    requireTenantScope,           // tenant isolation
    requireRole('<area>'),        // authz by role
    validateBody(RS.<schema>),    // fail-closed input validation
    idempotencyGuard,             // ONLY for money/claim routes
    async (req, res) => { ... }
);
```

### Update the audit fork
Do **not** edit `namaweb-ovr-audit-independent/`. It is a frozen
snapshot used for independent security review. Sync direction is
owner-authorized only.

### Add or change a skill
1. Read 2-3 neighboring skills in `project_brain/skills/` to mimic
   format
2. Follow the index entry convention in
   `project_brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`
3. Cross-link from the index

---

## 7. Documentation standards

- **Naming:** `NN_TOPIC_AR.md` for new governance docs; or
  `PHASE_<N>_<NAME>_AR.md` for phase reports
- **Language:** Arabic (AR) for governance/clinical; English OK for
  technical specs, API contracts, ADR templates
- **Encoding:** UTF-8, no BOM. PowerShell 5.1 `Set-Content` corrupts
  CJK/Arabic — use the Read/Write/Edit tools, not the shell pipeline
  (see `constitution/28_DOCUMENTATION_RECORDS_UTF8_AR.md`)
- **Changelog:** every change to `namaweb/`, `tools/`, or `ops/`
  gets an entry in `docs/CHANGELOG.md`
- **No duplicate canon:** if you find yourself writing the same
  content in `docs/` and `project_brain/docs/`, write it once
  (in `docs/`) and add a one-line cross-link in the mirror

---

## 8. Out-of-scope (do not do, even if asked)

- ❌ Edit files in `namaweb-ovr-audit-independent/`
- ❌ Bypass tenant scope, RBAC, or validation middleware
- ❌ Add `unsafe-eval` or `unsafe-inline` to CSP without a separate
  approved deploy
- ❌ Commit real `.env`, real keys, real PHI, or real DICOM into
  any tracked path
- ❌ Run `pm2 restart` or any live-server command without owner
  authorization
- ❌ Edit `AGENTS.md` or `.ai_rules` to relax a safety rail
- ❌ Force-push any branch
- ❌ DROP DATABASE / DELETE without a recent backup in the same
  change set

---

## 9. If something is unclear

1. Check [`docs/ARCHITECTURE_MAP_AR.md`](docs/ARCHITECTURE_MAP_AR.md) for
   the system map
2. Check the index doc most relevant to your area
3. Read 2-3 recent `PHASE_*_AR.md` closeouts for current state
4. Check `docs/CHANGELOG.md` for the most recent change
5. If still unclear, **ask the owner with a precise question and a
   proposed default** — never guess on a safety rail

---

## 10. Changelog of this file

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial creation: source-of-truth map, safety rails, phase workflow, gate status | Mavis (architecture review) |
