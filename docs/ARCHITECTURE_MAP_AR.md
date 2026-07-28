# 🗺️ Nama Medical ERP — Architecture Map
> **التاريخ:** 2026-07-15
> **المصدر:** مراجعة معمارية لـ `NMEDCALVSCODE/`
> **المستودع الأساسي:** `namaweb/` (الحي) · `namaweb-ovr-audit-independent/` (audit snapshot)

---

## 1️⃣ High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  🌐 Browser  (AR/EN, RTL/LTR, 8 themes, 16 facility types)      │
│  IBM Plex Sans Arabic · Tailwind · Material Symbols · Chart.js   │
│  Helmet, CSP, HSTS, MFA, session-bound tenant                   │
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTPS / TLS 1.3
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  ⚙️ Express.js  (server.js — 19,705 lines, 1.4 MB)               │
│  port 3000 · 1 monolith · ~40+ engine modules                   │
│  ─────────────────────────────────────────────────────────────  │
│  Security perimeter: Helmet · CORS allowlist · CSP report-only   │
│  Rate limit (login 20/15m) · session (Redis + Memory fallback)  │
│  requireAuth · requireRole · requireTenantScope · requireTenantAdmin │
│  CSP report collector · audit_middleware (inert by default)     │
└──────────────────┬───────────────────────────────────────────────┘
                   │ pg pool + AsyncLocalStorage (tenant_id)
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│  🗄️ PostgreSQL  (db_postgres.js — 179 KB)                        │
│  Schema 80+ tables · 87+ migrations · RLS tenant isolation       │
│  FORCE_RLS=150 · nama_medical_app non-superuser role             │
│  Envelope encryption (DPAPI KEK) for PHI blobs                  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌────────────────┐    ┌──────────────────┐
│  📁 PHI Vault  │    │  🧰 Side Engines │
│  /phi_vault/   │    │  /tools/sandbox  │
│  (outside web) │    │  Vault, FHIR,    │
│  rad images    │    │  Mirth, Orthanc  │
└────────────────┘    └──────────────────┘

🌍 Live: Hetzner ubuntu-8gb-hel1-1 (204.168.144.74)
   PM2 · /var/www/namaweb · jumanasoft.com
```

---

## 2️⃣ Backend Architecture (server.js) — Monolith معياري

`server.js` ملف واحد ضخم (19,705 سطر) يجمّع 40+ engine.

### 📦 الـ Engines الرئيسية

| # | Engine | الملف | الدور |
|---|--------|-------|------|
| 1 | **DB Layer** | `db_postgres.js` | pg pool + tenant context (AsyncLocalStorage) |
| 2 | **Crypto Envelope** | `crypto_envelope.js` | A3 at-rest encryption (DPAPI KEK) |
| 3 | **LIS** | `lis.js` | E3 lab autoVerify/isCritical/HL7 parse/QC |
| 4 | **Finance Engine** | `finance_engine.js` | E10 GL/ZATCA balanced-entry, VAT, aging, UBL/QR |
| 5 | **Blood Bank** | `bloodbank_compat.js` | E13 ABO/Rh compatibility (fail-closed) |
| 6 | **OB/Maternity** | `ob_engine.js` | E14 EDD/GA/GPAL/APGAR/biometry/risk |
| 7 | **CDS** | `cds.js` | E1 Clinical Decision Support (drug interactions) |
| 8 | **Clinical CPOE** | `clinical_cpoe.js` | E1 problems/SOAP/CPOE routes |
| 9 | **Nursing Scores** | `nursing_scores.js` | E6 Morse/Braden/NEWS/Pain |
| 10 | **ESI Triage** | `esi_engine.js` | E7 Emergency Severity Index |
| 11 | **ICU Scoring** | `icu_scoring.js` | E9 SOFA/GCS/APACHE-II (anti-spoof) |
| 12 | **Specialty Scores** | `specialty_scores.js` | GCS/DAS28/NIHSS |
| 13 | **EWS Sepsis** | `ews_engine.js` | MEWS/PEWS/qSOFA/SIRS + escalation |
| 14 | **Result Loop** | `result_loop.js` | GATE3 order↔result closed-loop |
| 15 | **Tenant Resolve** | `tenant_resolve.js` | GATE4 session precedence over x-tenant-id |
| 16 | **Idempotency** | `idempotency.js` | GATE7 money routes, opt-in + fail-open |
| 17 | **Insurance E11** | `e11_insurance_engine.js` | NPHIES + co-pay state machine |
| 18 | **Pathology** | `pathology_engine.js` | E15 specimen/accession/flag |
| 19 | **Inventory** | `e16_inventory_engine.js` | E16 FEFO, no-negative, CSSD BI gate |
| 20 | **HR/Workforce** | `e18_hr_engine.js` | E18 license expiry, leave, payroll, PII mask |
| 21-26 | **Wave 1-5** | `internal_medicine_wave1_engine*.js` | Blueprint 2026 specialty safety |
| 27-31 | **Wave 6-10** | `surgical_wave2`, `obgyn_peds_wave3`, `diag_wave4`, `crit_care_wave5`, `rare_specialized` | |
| 32 | **RBAC** | `rbac.js`, `rbac_guards.js` | E-X3 matrix middleware |
| 33 | **Audit** | `audit_middleware.js` | GATE3-M1 (inert unless flag) |
| 34 | **Validation** | `validation.js` | GATE3-H1 fail-closed input validation |
| 35 | **Route Schemas** | `route_schemas.js` | Accurate non-breaking schemas |
| 36 | **Onboarding** | `onboarding.js` | E0 super-admin provisioning wizard |
| 37 | **Payment** | `payment_adapter.js` | Moyasar/Stripe |
| 38 | **Billing** | `billing_adapter.js`, `billing_integrity.js` | |
| 39 | **NPHIES Client** | `nphies_client.js` | KSA national insurance |
| 40 | **ZATCA Phase 2** | `zatca_phase2.js` | KSA e-invoicing |

### 🌐 API Surface (300+ routes)

| النطاق | عدد | أمثلة |
|--------|-----|-------|
| `/api/auth/*` | 8 | login, logout, MFA |
| `/api/patients/*` | 6 | CRUD, consent, account, results |
| `/api/appointments` | 3 | |
| `/api/nursing/*` | 3 | vitals |
| `/api/insurance/*` + `/api/nphies/*` | 25+ | eligibility, claims, pre-auth, denials |
| `/api/medical/*` | 5 | records, sign, amend |
| `/api/lab/*` | 12 | orders, samples, results, QC, HL7 |
| `/api/radiology/*` | 14 | orders, worklist, DICOM, reports, sign |
| `/api/pharmacy/*` + `/api/inventory/*` | 8 | drugs, low-stock, items |
| `/api/hr/*` | 5 | employees, salaries, leaves, attendance |
| `/api/finance/*` | 12 | accounts, journal, posting, aging |
| `/api/settings/*` | 6 | integrations, users, ping |
| **Specialties (centers)** | 100+ | cardiology, neurology, surgery, obgyn, ICU, etc. |
| `/api/clinical/*` | 5 | templates, knowledge, AI ask, lock |
| `/api/finance/journal/:id/{post,reverse}` | 2 | idempotency-guarded |
| `/api/payments/moyasar/*` | 3 | initiate, callback, verify |
| `/api/phi-files/:id` | 1 | streaming PHI download |
| `/api/results/:type/:id/acknowledge` | 1 | closed-loop critical callback |
| `/api/super-admin/*` | 5+ | SaaS tenant control |
| `/api/onboarding/*` | 5+ | facility wizard |
| `/api/csp-report` | 1 | browser violation collector |

---

## 3️⃣ Database Architecture (87+ migrations)

### 🗂️ Migration Naming Convention

```
e0_*   → Onboarding (tenants, facilities, modules, integration settings)
e1_*   → Doctor Station (problems, clinical notes, CPOE)
e2_*   → HIM (coding, ROI, record access)
e3_*   → Lab (samples, results, QC)
e5_*   → Pharmacy (drug batches, dispense, controlled log)
e6_*   → Nursing (MAR, I&O, scores, RLS, clinical pharmacy)
e7_*   → Emergency Department (workflow, RLS)
e8_*   → Inpatient/ADT (RLS, bed status history)
e9_*   → ICU (RLS, infusions)
e10_*  → Finance (GL structure, cost centers, ZATCA invoices, daily close)
e11_*  → Insurance (claims lifecycle, companies, NPHIES)
e12_*  → Surgery/OR
e14_*  → OB/Maternity
e15_*  → Pathology
e16_*  → Inventory/Supply Chain + CSSD (trays, BI gate)
e17_*  → Quality/CAPA + Infection
e18_*  → HR/Workforce
e21_*  → Smart templates + ICU bundles + clinical specialties
e22_*  → Operational money NUMERIC
e23_*  → Idempotency keys
e24-e50_* → Plans, payment gateway, candidates, EWS scores, ...
e30-e44_* → Specialty modules (cardiology, gastro, endocrine, ...)
e45-e46_* → Specialties next
e47-e50_* → Billing candidates, RLS candidates
ex_*   → Cross-cutting (orders, RBAC, tenant_id indexes)
p0_*   → Deferred modules RLS
p1_*   → Legacy core RLS, account lockout, GL idempotency, ...
saudi_compliance → NPHIES, ZATCA, HR Saudi
```

### 🔒 Multi-Tenant Security Model

- **Tenant Context** (AsyncLocalStorage) → `app.tenant_id` يُمرَّر لكل query
- **RLS policies** على **150 جدول** (`FORCE_RLS=150`)
- **session precedence over x-tenant-id header** (anti-spoof)
- **App role** = `nama_medical_app` (non-superuser) — fail-closed
- **PHI at rest** = envelope encryption (DPAPI KEK) على blobs/columns الحساسة
- **PHI files** = `phi_vault/radiology/` خارج webroot (لا static access)

---

## 4️⃣ Frontend Architecture (Vanilla JS SPA)

### 📄 الـ HTML Pages (3 فقط)

| File | الحجم | الدور |
|------|-------|------|
| `public/index.html` | 9.6 KB | SPA shell + sidebar + topbar |
| `public/login.html` | 26 KB | Glassmorphism login + AR/EN |
| `public/admin.html` | 22 KB | Super-admin onboarding wizard |

### 📜 الـ JavaScript Modules (in `public/js/`)

| Module | Size | Responsibility |
|--------|------|----------------|
| `app.js` | **1.7 MB** | Main SPA — 18 modules, 16 facility types |
| `doctor-station.js` | 123 KB | Full E1 doctor workflow |
| `nursing-station.js` | 115 KB | E6 nursing (MAR, I&O, scores) |
| `onboarding-wizard.js` | 25 KB | E0 facility onboarding |
| `admin.js` | 20 KB | Super admin |
| `local-api-preview-ui.js` | 10 KB | Local API mocking |
| `mock-api-runtime.js` | 8 KB | Local mock API for offline dev |
| `facility-catalog.js` | 5 KB | 16 facility types → allowed modules |
| `clinical-orders.js` | 4 KB | CPOE bridge |
| `clinical-results.js` | 3 KB | Results display |
| `clinical-billing.js` | 3 KB | |
| `clinical-pharmacy.js` | 3 KB | |
| `appointments-queue.js` | 3 KB | |
| `enterprise-security.js` | 3 KB | CSP/permissions UI |
| `enterprise-contracts.js` | 3 KB | |
| `encounter-workflow.js` | 3 KB | |

### 🎨 Design System

- **Themes**: 8 (Dark Blue, Dark Green, Purple, Red, Golden, Classic Light, Light Blue, Light Green)
- **Colors**: Material Design 3 tokens (50+ tokens)
- **Fonts**: IBM Plex Sans Arabic + IBM Plex Sans + Material Symbols
- **Charts**: Chart.js 4.4.1 (CDN)
- **Barcodes**: JsBarcode 3.11.6
- **Datepicker**: Flatpickr
- **i18n**: AR/EN + RTL/LTR + `tr(en, ar)` function
- **Security in JS**: `escapeHTML`, `SafeHtml`, `safeId`, `safeUrl`, `jsStr`

### 🏥 الـ 18 Module

```
0 Dashboard | 1 Reception | 2 Appointments | 3 Doctor Station
4 Lab | 5 Radiology | 6 Pharmacy | 7 HR
8 Finance | 9 Insurance | 10 Inventory | 11 Nursing
12 Waiting | 13 Accts | 14 Reports | 15 Messaging
16 Catalog | 17 Settings
```

+ admin extensions: Surgery, Blood Bank, Consent Forms, Emergency, Inpatient ADT, ICU, CSSD, Dietary, Infection, Quality, Maintenance, Transport, Medical Records, Clinical Pharmacy

### 🏢 16 Facility Types

```
medical_city | general_hospital | tertiary_hospital | specialized_hospital
polyclinic | phc | specialty_center | diagnostic_center
rehabilitation_center | dialysis_center | dental_center
mental_health_center | home_healthcare_unit | mobile_clinic
virtual_clinic | health_unit
```

---

## 5️⃣ Security & Compliance

### 🔐 Stack (طبقات)

```
┌─ TLS 1.3 + HSTS                          (transport)
├─ Helmet + CORS allowlist                 (headers)
├─ CSP report-only (CSP_ENFORCE=false)     (browser)
├─ express-rate-limit (login 20/15m)       (DoS)
├─ express-session (Redis + MemoryStore    (session)
│   fallback via FallbackSessionStore)
├─ requireAuth (session)                   (auth)
├─ requireRole(...)                        (authz)
├─ requireTenantScope                      (tenant)
├─ requireTenantAdmin                      (privileged)
├─ validateBody(RS.schema)                 (input, fail-closed)
├─ crypto_envelope (DPAPI KEK)             (PHI at rest)
├─ audit_middleware (inert default)        (audit)
├─ FORCE_RLS=150 in PostgreSQL             (row-level)
├─ tenant_context (AsyncLocalStorage)      (per-request)
├─ Vault KMS (DPAPI KEK escrow)            (keys)
└─ Hash-chained audit log (7+ years)       (tamper)
```

### 📋 Compliance Phases

| Phase | المحتوى | الحالة |
|-------|---------|--------|
| **A1** | EMR lock + signature | ✅ |
| **A2** | MFA (TOTP) | ✅ |
| **A3A** | PHI file guard | ✅ |
| **A3** | Full encryption at rest (envelope + DPAPI + Vault) | ✅ |
| **B D0** | Secrets/key management | ✅ |
| **B D1** | Mirth sandbox (HL7) | ✅ مُثبَّت |
| **B D2** | FHIR local sandbox + HAPI | ✅ مُثبَّت |
| **B D5** | Orthanc PACS sandbox | ✅ مُثبَّت |
| **C** | Clinical quality | ✅ |
| **D** | Finance & Operations | ✅ |
| **E** | Integration & AI | ✅ |
| **F1** | World-class clinical endpoints | ✅ |
| **Gate 7** | Idempotency on money routes | ✅ |

### 💰 Idempotency (Gate 7)

- Routes: POST invoices, PUT invoices/:id/pay, POST journal, POST invoices/:id/refund
- Header: `Idempotency-Key` (optional)
- **OPT-IN** + **FAIL-OPEN**
- Replay returns stored response + `Idempotent-Replay: true`

---

## 6️⃣ Integration Layer

### 🧰 Sidecar Sandboxes (`tools/`)

| Sandbox | الدور | الحالة |
|---------|------|--------|
| `mirth-sandbox/` | HL7 channel relay simulator (7 channels) | ✅ simulator يعمل، ❌ docker يحتاج موافقة |
| `fhir-sandbox/` | HAPI FHIR R4 transaction tester | ✅ |
| `orthanc-sandbox/` | PACS/DICOM (Orthanc) | ✅ |
| `vault-sandbox/` | HashiCorp Vault محلي (KMS) | ✅ |
| `vault-staging/` | Vault staging HCL config | ✅ |
| `dr-sandbox/` | Disaster recovery rehearsal | ✅ |

**قاعدة صارمة:** loopback-only, dummy data, no real PHI, no production wiring.

### 🔌 Production-Ready Integrations

- **NPHIES** (`nphies_client.js` 18 KB) — جاهز، يحتاج شهادة
- **ZATCA Phase 2** (`zatca_phase2.js` 11 KB) — جاهز، يحتاج CSID/OTP
- **Moyasar Payment** (webhooks live)
- **Stripe Payment** (webhooks live)
- **SMS** (`sms_service.js`)
- **Email** (`email_service.js`)
- **HL7 ingest** (`POST /api/lab/hl7`)

---

## 7️⃣ Deployment & Ops

### 🖥️ Live Deployment

```
Hetzner ubuntu-8gb-hel1-1
IP: 204.168.144.74
Domain: jumanasoft.com
App dir: /var/www/namaweb
PM2 process: nama-medical-erp
Branch: integration/all-epics @ 5539629
Access: ssh -i C:\Users\ice\.ssh\nama_medical_key root@...
```

### 🛠️ Operations Surface

| Folder | الدور |
|--------|------|
| `ops/live_deploy/` | DEPLOY_NOTES, e22_live_runbook, route_schemas.live.js |
| `ops/security/` | `nama_kek_escrow.ps1` |
| `ops/backups/` | `nama_local_backup.ps1` |
| `ops/startup/` | (فارغ) |
| `ops/staging/` | (فارغ) |
| `ops/watchdogs/` | logs فقط |

### 📦 Deployment History

| التاريخ | التغيير |
|---------|---------|
| 2026-06-30 | `validateBody` على 4 routes |
| 2026-06-30 | e22: money columns REAL → NUMERIC(14,2) |
| 2026-06-30 | financial idempotency (e23 + idempotency.js) |
| - | audit_middleware + global rate-limiter: ❌ deferred |
| - | ZATCA/NPHIES live: ❌ code جاهز، يحتاج credentials |

---

## 8️⃣ Audit Fork Comparison

| البُعد | `namaweb/` | `namaweb-ovr-audit-independent/` |
|--------|-----------|-------------------------------|
| **الغرض** | الحي | audit snapshot |
| `server.js` | 1.4 MB | 1.34 MB |
| `app.js` | 1.7 MB | 1.64 MB |
| Migrations | 87 SQL | **253 SQL** (تاريخ كامل) |
| Login | embedded | `login.js` + `login-ui.js` منفصلين |
| Migrations/seeds | 1 file | 1 file |
| GitHub | - | `.github/workflows/` (CI audits) |

**الاستنتاج:** الـ audit fork هو **snapshot ثابت**، الـ `namaweb/` هو **الحي**.

---

## 9️⃣ Documentation & Skills

### 📚 الـ Skills (80+)

3 skill packs:
- `nama-medical/` (14 skills) — سياسات، تكاملات، حوكمة
- `MEDICAL_*` (60+ skills) — كل مجال تشغيلي
- `stitch-*` (4 skills) — تحويل HTML → React

### 📂 Docs (`docs/`)

- `MASTER_BLUEPRINT/` — 40 group مخطط
- `governance/enterprise-hospital-platform/` — wireframes, user stories, manual
- `PHASE_A1`, `PHASE_A2`, `PHASE_A3*` — security closeouts
- `PHASE_B_*` — integration readiness
- `GATE0...GATE9_*` — gate closeouts
- `migrations/` (40+ مجلد تخصصي)
- `seeders/`, `sql/`, `tests/`, `bpmn/`, `erd/`, `i18n/`, `sdk/`, `postman/`

---

## 🔍 Critical Observations

### ⚠️ نقاط ضعف

1. **`server.js` Monolith (19,705 سطر)** — كل شي في ملف واحد. صعب الصيانة، merge nightmare.
2. **Audit Fork Drift** — 87 vs 253 migrations. مش واضح أيهما canonical.
3. **`app.js` 1.7 MB** — بدون modularization أو bundler.
4. **`.env.example` ناقص** — ما فيه Redis, NPHIES, ZATCA, Moyasar.
5. **Skills/Docs بدون ownership** — 80+ skills و 50+ مجلد بدون README جذر.
6. **`ops/` شبه فاضي** — لا CI/CD ظاهر، لا IaC.

### ✅ نقاط قوة

1. **Tenant isolation حقيقي** — RLS على 150 جدول + AsyncLocalStorage
2. **PHI encrypted at rest** — envelope + DPAPI KEK
3. **Idempotency على money routes** — opt-in + fail-open
4. **Pure engines** — قابلة للـ unit test بدون DB
5. **CSP report-only** بدون كسر UX
6. **Live deployment مُسجَّل** — backup + rollback path لكل deploy
7. **Sandboxes منعزلة** — لا PHI حقيقي في الـ testing
8. **Compliance coverage** — ZATCA + NPHIES + CBAHI + PDPL + HIPAA
9. **16 facility types** — entitlement matrix جاهز
10. **44 clinical departments** + 100+ clinical endpoints — شمولية استثنائية

---

## 📍 أول 3 أشياء تسويها

1. **تحديد source of truth** بين `namaweb/` و `namaweb-ovr-audit-independent/`
2. **كتابة AGENTS.md جذر** للمشروع
3. **modular split لـ server.js** (يحتاج خطة)

---

**Generated by:** Mavis (architecture review)
**Review date:** 2026-07-15
