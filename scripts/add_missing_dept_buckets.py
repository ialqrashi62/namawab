"""
Add missing 44-bucket artifacts to all department blueprints.
Adds 9 files per dept: seo, helpdesk, apm, user_analytics, llm_obs, auth, rbac, pentest, stitch_google
"""
import os
import re
from pathlib import Path

AIBRAIN = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES")

def detect_dept_info(folder_name):
    """Extract dept ID + name from folder."""
    # DEP-001_cardiology → (001, cardiology)
    m = re.match(r"^(DEP-\d+|[\w\-]+?)_(.+)$", folder_name)
    if m:
        prefix = m.group(1)
        name = m.group(2).replace("_", " ").title()
        return prefix, name
    return folder_name, folder_name.replace("_", " ").title()

# Skip these (already complete or different structure)
SKIP = {"CARD-001.yaml", "CROSS_REF_HIGH_ALERT_MEDICATIONS.md"}

def add_bucket_36_seo(dept_id, name, dept_dir):
    content = f"""# SEO Plan — {name} ({dept_id})
**Last updated:** 2026-08-10

## SEO strategy for {name}

### Target keywords (Arabic + English)

| Arabic | English | Volume | Intent |
|---|---|---|---|
| {name} في السعودية | {name} in Saudi Arabia | High | Information |
| أفضل {name} | best {name} | Med | Comparison |
| {name} مستشفى | {name} hospital | Med | Service |
| {name} جمانة سوفت | {name} jumanasoft | Low | Brand |
| نظام {name} | {name} system | Med | Software |

### On-page SEO

- Title tag: `<title>{name} - NamaMedical | jumanaSoft</title>`
- Meta description: 155 chars · mentions {name} + Saudi + AI + ZATCA
- H1: `{name}` (one per page)
- H2-H3: sub-sections (workflows, integrations, compliance)
- Schema.org: `MedicalSpecialty` for {name}
- Internal linking: from/to related depts

### Content marketing

- Pillar page: `/departments/{dept_id_lowercase}` (Arabic + English)
- Blog posts (AR + EN):
  - "How to choose a {name} system in Saudi Arabia"
  - "{name} compliance with ZATCA Phase 2"
  - "AI in {name}: 10 use cases"
  - "Epic alternative for {name} in KSA"
  - "CBAHI accreditation for {name}"
- Patient-facing: "What to expect from {name}"
- Comparison: "Epic vs NamaMedical for {name}"

### GEO (Generative Engine Optimization)

- Answer-first content (FAQs)
- Citations to Saudi MOH, WHO, hospital SOPs
- Author credentials (CMO + medical advisors)
- Structured data (Schema.org MedicalCondition, Procedure)

### Link building

- Hospital directories (MOH, CBAHI)
- Medical societies (Saudi Heart Society, etc.)
- Press releases on milestones
- Guest posts on medical blogs

### KPIs

- Organic traffic to /departments/{dept_id}: target 5K/mo within 6 months
- Featured snippets: 3+ within 6 months
- AI citations (ChatGPT, Perplexity): 10+/mo within 6 months
- Domain rating: target 30+ within 6 months
"""
    (dept_dir / "36_seo_plan.md").write_text(content, encoding="utf-8")

def add_bucket_37_helpdesk(dept_id, name, dept_dir):
    content = f"""# Helpdesk Plan — {name} ({dept_id})
**Last updated:** 2026-08-10

## Support channels for {name}

### Tier 1 (Polyclinic SaaS)
- In-app help (top-right)
- Email: support@jumanasoft.com (4h response)
- Phone: business hours only

### Tier 2 (Hospital SaaS)
- All Tier 1 channels +
- Live chat (in-app, 5min response)
- WhatsApp Business (24/7)

### Tier 3 (Enterprise)
- All Tier 2 channels +
- Slack Connect (24/7, 15min response)
- Dedicated CSM

## Common {name} questions

### How do I perform a {name} workflow?
See user manual §29_user_manual.md (AR + EN).

### {name} compliance
- ZATCA Phase 2: see 31_COMPLIANCE.md
- NPHIES: see insurance module
- CBAHI: see 31_COMPLIANCE.md
- PDPL: see 31_COMPLIANCE.md

### {name} AI orchestrators
See 08_prompt_engineering.md + 10_langchain_chains.md

## SLA matrix

| Priority | Response | Resolution |
|---|---|---|
| P1 (production down) | < 15min | < 4h |
| P2 (major bug) | < 1h | < 24h |
| P3 (minor bug) | < 4h | < 7d |
| P4 (cosmetic) | < 24h | < 30d |

## Escalation path

L1: support agent → L2: support engineer → L3: dev team → L4: on-call engineer

## Self-service

- AI chatbot (RAG over KB)
- Video tutorials (YouTube)
- Documentation portal
- Status page: status.jumanasoft.com
"""
    (dept_dir / "37_helpdesk_plan.md").write_text(content, encoding="utf-8")

def add_bucket_38_apm(dept_id, name, dept_dir):
    content = f"""# APM & Logging Plan — {name} ({dept_id})
**Last updated:** 2026-08-10

## Metrics tracked for {name}

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/{dept_id_lowercase(dept_id)}/create | < 200ms | < 0.1% | ? |
| GET /api/{dept_id_lowercase(dept_id)}/list | < 100ms | < 0.1% | ? |
| POST /api/{dept_id_lowercase(dept_id)}/update | < 200ms | < 0.1% | ? |

### Per-engine

- `{name} engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "{dept_id}",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/{dept_id_lowercase(dept_id)}/create",
  "duration_ms": 45,
  "msg": "{name} created"
}}
```

## Alerts

- {name} error rate > 5% → PagerDuty
- {name} p95 latency > 1s → email
- {name} DB query > 500ms → APM
- {name} RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- {name} overview (latency, errors, RPS)
- {name} per-tenant
- {name} per-engine
- {name} audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
"""
    (dept_dir / "38_apm_logging.md").write_text(content, encoding="utf-8")

def add_bucket_39_user_analytics(dept_id, name, dept_dir):
    content = f"""# User Analytics — {name} ({dept_id})
**Last updated:** 2026-08-10

## Events tracked

| Event | Properties |
|---|---|
| `{dept_id_lowercase(dept_id)}_create` | tenant_id, user_id, patient_id_hash |
| `{dept_id_lowercase(dept_id)}_view` | tenant_id, user_id, duration_ms |
| `{dept_id_lowercase(dept_id)}_update` | tenant_id, user_id, fields_changed |
| `{dept_id_lowercase(dept_id)}_delete` | tenant_id, user_id, reason |
| `{dept_id_lowercase(dept_id)}_print` | tenant_id, user_id, format |
| `{dept_id_lowercase(dept_id)}_export` | tenant_id, user_id, format, rows |

## Funnels

### Funnel 1: {name} primary workflow
- step 1: open {name} page
- step 2: create record
- step 3: validate + sign
- step 4: integrate with downstream

Conversion target: > 80%

### Funnel 2: {name} AI assist
- step 1: click AI assist
- step 2: invoke orchestrator
- step 3: review suggestion
- step 4: accept or override

Adoption target: > 60%

## Retention

- DAU / WAU / MAU per dept
- Cohort retention per facility type
- Feature adoption rate

## Reports

- Weekly: top events, top users, anomalies
- Monthly: cohort retention, NPS, feature adoption
- Quarterly: ROI calculator input

## Tool

- PostHog (self-hosted) or Mixpanel
- Server-side tracking (no PHI)
"""
    (dept_dir / "39_user_analytics.md").write_text(content, encoding="utf-8")

def add_bucket_40_llm_observability(dept_id, name, dept_dir):
    content = f"""# LLM Observability — {name} ({dept_id})
**Last updated:** 2026-08-10

## LLM usage for {name}

### Orchestrators

| Orchestrator | Model | Calls/day | Cost/day |
|---|---|---|---|
| {name} AI orchestrator | gpt-4o | ? | ? |
| {name} summary | gpt-4o-mini | ? | ? |
| {name} RAG | gpt-4o | ? | ? |

### Tracking (per LLM call)

| Field | Example |
|---|---|
| trace_id | trace_abc123 |
| tenant_id | tnt_456 |
| user_id | usr_789 |
| orchestrator | {dept_id}_ai |
| model | gpt-4o |
| prompt_tokens | 1234 |
| completion_tokens | 567 |
| total_tokens | 1801 |
| latency_ms | 2100 |
| cost_usd | 0.0540 |
| cache_hit | false |
| error | null |

### Tracked per orchestrator

- Calls per day / week / month
- Tokens per day / week / month
- Cost per day / week / month
- p50 / p95 / p99 latency
- Error rate by error_type
- Cache hit rate

### Cost controls

- Per-tenant monthly budget: TBD
- Per-user daily budget: TBD
- Per-orchestrator monthly budget: TBD
- Fallback to smaller model (gpt-4o-mini) when budget exceeded
- Prompt caching for common queries (24h TTL)

### Alerts

- Daily cost > 80% of cap → notify admin
- Daily cost > 100% of cap → block + notify
- Latency p99 > 10s → notify
- Error rate > 5% → notify + fallback

### Tool

- LangSmith (preferred)
- OpenLLMetry (alternative)
"""
    (dept_dir / "40_llm_observability.md").write_text(content, encoding="utf-8")

def add_bucket_41_auth_sso(dept_id, name, dept_dir):
    content = f"""# Authentication & SSO — {name} ({dept_id})
**Last updated:** 2026-08-10

## Auth flow for {name}

### Login

```
POST /api/auth/login
  Body: {{ email, password }}
  → bcrypt.compare(password, user.password_hash)
  → if user.mfa_required: respond {{ mfa_required: true, mfa_token }}
  → else: create session, set cookie

POST /api/auth/mfa
  Body: {{ mfa_token, totp_code }}
  → speakeasy.totp.verify({{ secret: user.mfa_secret, token: totp_code }})
  → if valid: create session, set cookie
```

### Session policy

- Cookie: `nama.sid` · httpOnly · secure · sameSite=strict
- Idle timeout: 30 minutes
- Absolute timeout: 8 hours

### SSO providers

| Provider | Saudi | Use case |
|---|---|---|
| Nafath (national SSO) | ✅ | Government employees + citizens |
| Apple ID | ✅ | iOS users |
| Google Workspace | ✅ | Hospital staff |
| Microsoft 365 | ✅ | Hospital staff |
| Okta / Auth0 | ✅ | Enterprise |

### MFA enforcement

- Mandatory: doctor · admin · finance · accounts · quality · infection
- Optional: nurse · pharmacist · lab tech · radiologist · cashier
- Disabled: patient portal (use SMS OTP instead)

### Password policy

- Min 12 chars
- Upper + lower + digit + special
- bcrypt cost factor 12+
- No forced rotation

### Account lockout

- 5 failed → 15 min lockout
- 10 failed → 1 hour
- 20 failed → admin notification + IP block

### {name}-specific

- {name} workflow requires role: `{name_lowercase(dept_id)}_user` (e.g., `cardiologist`)
- Cross-specialty access denied by default (Golden Access Rule)
- Emergency override: emergency button logs override + notifies CMO
"""
    (dept_dir / "41_auth_sso.md").write_text(content, encoding="utf-8")

def add_bucket_42_rbac_matrix(dept_id, name, dept_dir):
    content = f"""# RBAC Permission Matrix — {name} ({dept_id})
**Last updated:** 2026-08-10

## Permission matrix for {name}

| Action | Doctor ({name}) | Nurse | Receptionist | Admin | Other Specialty |
|---|---|---|---|---|---|
| Read {name} record (own specialty) | ✅ | ✅ | ✅ (limited) | ✅ | ❌ |
| Create {name} record | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update {name} record | ✅ | ✅ (limited) | ❌ | ❌ | ❌ |
| Delete {name} record | ✅ (own) | ❌ | � | ✅ (admin) | ❌ |
| Sign {name} record | ✅ | � | ❌ | ❌ | ❌ |
| Lock {name} record | ✅ | ❌ | ❌ | ❌ | ❌ |
| View audit log | ✅ (own) | � | ❌ | ✅ | ❌ |
| Export {name} data | ✅ | � | ❌ | ✅ | ❌ |

## Specialty-Based Access (Golden Access Rule)

A `{name_lowercase(dept_id)}` doctor can access a patient only if:
1. The patient is in `{name}` specialty
2. OR a cross-specialty consult was requested
3. OR the patient was transferred to `{name}`
4. OR explicit permission was granted (e.g., emergency)

## Permission codes (used in code)

```js
requirePermission(`{dept_id_lowercase(dept_id)}:read`);
requirePermission(`{dept_id_lowercase(dept_id)}:write`);
requirePermission(`{dept_id_lowercase(dept_id)}:sign`);
requirePermission(`{dept_id_lowercase(dept_id)}:delete`);
```

## Roles that can access {name}

- `{name_lowercase(dept_id)}_doctor` (own specialty)
- `nurse` (read-only)
- `receptionist` (read demographics only)
- `admin` (full access)
- CMO / CNO (full access)

## Roles that CANNOT access {name}

- `pharmacist` (unless cross-specialty consult)
- `lab_tech` (unless cross-specialty consult)
- `cashier`
- `quality_staff` (unless investigation)

## Emergency override

- Click "Emergency Override" button in UI
- Logs override (audit_middleware)
- Notifies CMO via SMS
- Auto-reverts after 24h
- Requires retrospective review

## Cross-specialty consult

- Other specialty doctor can request consult
- Once approved, can read for 7 days
- Logged in audit
"""
    (dept_dir / "42_rbac_matrix.md").write_text(content, encoding="utf-8")

def add_bucket_43_pentest(dept_id, name, dept_dir):
    content = f"""# Penetration Testing Plan — {name} ({dept_id})
**Last updated:** 2026-08-10

## Scope

All API routes for {name} + corresponding DB tables + RLS policies + UI pages.

## OWASP Top 10 coverage for {name}

| # | Risk | Mitigation |
|---|---|---|
| A01 | Broken Access Control | requirePermission + RLS + Golden Access Rule |
| A02 | Cryptographic Failures | TLS 1.3 + crypto_envelope for PHI |
| A03 | Injection | Parameterized queries only |
| A04 | Insecure Design | 13 safety rails + threat model |
| A05 | Security Misconfiguration | helmet + CSP + secure defaults |
| A06 | Vulnerable Components | npm audit + Snyk + Renovate |
| A07 | Authentication Failures | bcrypt + MFA + rate limit |
| A08 | Data Integrity Failures | idempotencyGuard + audit chain |
| A09 | Logging Failures | structured logs + APM + audit |
| A10 | SSRF | URL allowlist + no user-controlled HTTP |

## {name}-specific threats

1. **Cross-specialty data leak** — a {name} doctor reading another specialty's patient
   - Test: try to read other-specialty patient → must fail
   - Mitigation: requireSpecialtyAccess middleware

2. **Emergency override abuse** — repeated override without justification
   - Test: 10 overrides in 1 hour → must trigger CMO alert
   - Mitigation: rate limit + audit + auto-revert

3. **AI orchestrator injection** — prompt injection in {name} AI
   - Test: submit prompt injection → must refuse
   - Mitigation: system prompt hardening + input validation

4. **PHI export abuse** — mass export of {name} records
   - Test: 1000-record export → must trigger DLP alert
   - Mitigation: rate limit + audit + admin notification

5. **Audit log tampering** — modify {name} audit entry
   - Test: try to modify audit row → must fail
   - Mitigation: hash chain + append-only DB role

## Test methodology

1. Recon (1 day)
2. Auth testing (2 days)
3. Authorization testing (3 days)
4. Input validation (3 days)
5. Business logic (3 days)
6. Crypto (1 day)
7. Infrastructure (1 day)
8. Reporting (2 days)

## Tools

- OWASP ZAP
- Burp Suite Pro
- Nmap
- sqlmap
- Custom fuzzers

## Internal pen-test (quarterly)

By jumanaSoft security team.

## External pen-test (annual)

By certified vendor (NCC Group, Positive Tech, or Saudi lab).

Cost: ~SAR 100K/year.

## Bug bounty (planned 2027)

- HackerOne or Bugcrowd
- Scope: `*.jumanasoft.com`
- Reward: $100-$5,000 based on severity
"""
    (dept_dir / "43_pentest_plan.md").write_text(content, encoding="utf-8")

def add_bucket_44_stitch_google(dept_id, name, dept_dir):
    content = f"""<!-- 44_STITCH_GOOGLE.html — {name} ({dept_id}) -->
<!-- Visual reference for the {name} pages in NamaMedical SPA -->
<!-- Generated from nm-stitch-medical-v2 patterns + stitch_antigravity_token_saver_skills -->

<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>{name} - Visual Reference - NamaMedical</title>
  <link rel="stylesheet" href="https://jumanasoft.com/static/nama.css" />
  <style>
    /* Stitch tokens (token-saver snippet) */
    :root {{
      --nama-primary: #0d6efd;
      --nama-success: #198754;
      --nama-warning: #ffc107;
      --nama-danger: #dc3545;
      --nama-radius: 8px;
      --nama-shadow: 0 2px 6px rgba(0,0,0,.08);
      --nama-font: 'Tajawal','Inter',system-ui,sans-serif;
    }}
    body {{ font-family: var(--nama-font); background: #f7f9fc; margin: 0; padding: 24px; }}
    .ref {{ max-width: 1200px; margin: 0 auto; }}
    .ref h1 {{ font-size: 28px; margin: 0 0 4px; }}
    .ref .meta {{ color: #6c757d; margin-bottom: 24px; }}
    .ref .grid {{ display: grid; gap: 16px; }}
    .ref .card {{ background: #fff; border-radius: var(--nama-radius); box-shadow: var(--nama-shadow); padding: 20px; }}
    .ref .preview {{ background: #fafbfc; border: 1px dashed #cbd5e0; border-radius: var(--nama-radius); padding: 16px; margin-bottom: 16px; }}
    .ref .preview-title {{ font-weight: 600; margin-bottom: 8px; color: #0d6efd; }}
    .ref .row {{ display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }}
    .ref .row label {{ min-width: 140px; font-size: 14px; color: #495057; }}
    .ref .input {{ flex: 1; padding: 6px 10px; border: 1px solid #dee2e6; border-radius: 4px; }}
    .ref .btn {{ padding: 6px 16px; border: 0; border-radius: 4px; color: #fff; cursor: pointer; }}
    .ref .btn-primary {{ background: var(--nama-primary); }}
    .ref .btn-success {{ background: var(--nama-success); }}
    .ref .btn-warning {{ background: var(--nama-warning); color: #000; }}
    .ref .btn-danger {{ background: var(--nama-danger); }}
    .ref .table {{ width: 100%; border-collapse: collapse; }}
    .ref .table th, .ref .table td {{ padding: 8px; border-bottom: 1px solid #e9ecef; text-align: right; }}
    .ref .table th {{ background: #f8f9fa; font-size: 13px; color: #6c757d; }}
    .ref .pill {{ display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; }}
    .ref .pill-active {{ background: #d1e7dd; color: #0f5132; }}
    .ref .pill-warn {{ background: #fff3cd; color: #664d03; }}
    .ref .alert {{ padding: 12px; border-radius: 4px; margin-bottom: 12px; }}
    .ref .alert-warn {{ background: #fff3cd; color: #664d03; }}
    .ref .alert-danger {{ background: #f8d7da; color: #842029; }}
    .ref .arch {{ font-family: monospace; background: #f1f3f5; padding: 12px; border-radius: 4px; white-space: pre-wrap; }}
  </style>
</head>
<body>
<div class="ref">
  <h1>{name} — Stitch Google Visual Reference</h1>
  <div class="meta">{dept_id} · generated 2026-08-10 · stitch_antigravity_token_saver_skills</div>

  <div class="card">
    <div class="preview-title">Page 1: {name} List + Filter</div>
    <div class="preview">
      <div class="row"><label>البحث / Search:</label><input class="input" placeholder="ابحث بالاسم / MRN / الهوية" /></div>
      <div class="row"><label>التاريخ / Date:</label><input class="input" type="date" /></div>
      <div class="row"><label>الحالة / Status:</label><input class="input" placeholder="نشط / سالب / محال" /></div>
      <table class="table">
        <thead><tr><th>الاسم</th><th>MRN</th><th>التاريخ</th><th>الحالة</th><th>الإجراء</th></tr></thead>
        <tbody>
          <tr><td>أحمد محمد علي</td><td>T-001</td><td>2026-08-10</td><td><span class="pill pill-active">نشط</span></td><td><button class="btn btn-primary">فتح</button></td></tr>
          <tr><td>سارة عبدالله</td><td>T-002</td><td>2026-08-09</td><td><span class="pill pill-warn">متابعة</span></td><td><button class="btn btn-primary">فتح</button></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="preview-title">Page 2: {name} Detail (chart pattern)</div>
    <div class="preview">
      <div class="row"><label>الاسم:</label><input class="input" value="أحمد محمد علي" /></div>
      <div class="row"><label>MRN:</label><input class="input" value="T-001" /></div>
      <div class="row"><label>التاريخ:</label><input class="input" value="2026-08-10" /></div>
      <div class="alert alert-warn">⚠️ تنبيه: نتائج حرجة تتطلب إبلاغ الطبيب المعالج</div>
      <div class="row"><button class="btn btn-success">حفظ</button><button class="btn btn-warning">تعديل</button><button class="btn btn-danger">حذف</button></div>
    </div>
  </div>

  <div class="card">
    <div class="preview-title">Page 3: {name} Workflow Wizard</div>
    <div class="preview">
      <div class="arch">
الخطوة 1 / 5: إدخال البيانات
[====      ] 20%
[ التالي ]
      </div>
    </div>
  </div>

  <div class="card">
    <div class="preview-title">Page 4: {name} Dashboard (KPI)</div>
    <div class="preview">
      <table class="table">
        <thead><tr><th>المؤشر</th><th>القيمة</th><th>الهدف</th></tr></thead>
        <tbody>
          <tr><td>عدد المرضى اليوم</td><td>142</td><td>—</td></tr>
          <tr><td>متوسط وقت الانتظار</td><td>18 دقيقة</td><td>< 30 دقيقة</td></tr>
          <tr><td>معدل الرضا</td><td>4.5/5</td><td>> 4.0</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="preview-title">Page 5: {name} Form (submit)</div>
    <div class="preview">
      <div class="row"><label>الحقل 1:</label><input class="input" placeholder="إدخال" /></div>
      <div class="row"><label>الحقل 2:</label><input class="input" placeholder="إدخال" /></div>
      <div class="row"><label>الحقل 3:</label><textarea class="input" rows="3"></textarea></div>
      <div class="row"><button class="btn btn-primary">إرسال</button><button class="btn btn-warning">إلغاء</button></div>
    </div>
  </div>

</div>
</body>
</html>
"""
    (dept_dir / "44_stitch_google.html").write_text(content, encoding="utf-8")

def dept_id_lowercase(dept_id):
    return dept_id.lower().replace("-", "_")

def name_lowercase(dept_id):
    return dept_id.lower().replace("-", "_")

# Process all depts
dept_dirs = sorted([d for d in AIBRAIN.iterdir() if d.is_dir()])
total_added = 0
for dept_dir in dept_dirs:
    folder_name = dept_dir.name
    # Skip DEP-001 (already has 35; we want to add 9 missing)
    # Skip non-DEP folders
    dept_id, name = detect_dept_info(folder_name)
    # Only process DEP-NNN_NNN folders
    if not (folder_name.startswith("DEP-") or folder_name in {"ALGY-001","ANES-001","CARD-001","CCU","CROSS_REF_HIGH_ALERT_MEDICATIONS.md","CTS-001","DENT-001","DERM-001","DIET-001","DOBS-001","ENDO-001","ENT-001","ER-001","ER-002","ER-003","ER-004","GEN-001","GERI-001","GI-001","HH-001","ID-001","LAB-001","MICU","NEPH-001","NEUROS-001","NNICU","OBG-001","OBG-002","ONC-001","OPHTH-001","ORTHO-001","PACU","PAIN-001","PATH-001","PEDS-001","PEDS-002","PHARM-001","PICU","PLAST-001","PREV-001","PSYCH-001","PULM-001","RAD-001","REHAB-001","RHEUM-001","SICU","SLEEP-001","SOC-001","SPM-001","SURG-001","SURG-002","SURG-003","SURG-004","SURG-005","SURG-006","SURG-007","SURG-008","SURG-009","SURG-010","SURG-011","SURG-012","TRMED-001","URO-001","VAS-001"}):
        # Skip non-Department folders
        continue

    add_bucket_36_seo(dept_id, name, dept_dir)
    add_bucket_37_helpdesk(dept_id, name, dept_dir)
    add_bucket_38_apm(dept_id, name, dept_dir)
    add_bucket_39_user_analytics(dept_id, name, dept_dir)
    add_bucket_40_llm_observability(dept_id, name, dept_dir)
    add_bucket_41_auth_sso(dept_id, name, dept_dir)
    add_bucket_42_rbac_matrix(dept_id, name, dept_dir)
    add_bucket_43_pentest(dept_id, name, dept_dir)
    add_bucket_44_stitch_google(dept_id, name, dept_dir)
    total_added += 9
    print(f"  +9 → {folder_name}")

print(f"\nTotal files added: {total_added}")
