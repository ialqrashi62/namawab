---
id: HELPDESK-SUPPORT
version: 1.0
date: 2026-08-01
owner: PM+DSL
status: ACTIVE
---

# Helpdesk & Support System + Training + User Manual + Legal + Project Management + Budget + APM + Analytics

> **Purpose:** Bundles the 11 cross-cutting operational areas into a single deliverable structure.

---

## 1. Helpdesk System (Zendesk-equivalent)

### Goals
- Ticket lifecycle (open → triage → in-progress → resolved → closed)
- Multi-channel (email, portal, phone, chat)
- SLA per priority
- Knowledge base (KB) integrated

### Schema
```sql
CREATE TABLE support_tickets (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  reporter_id UUID,
  assigned_to UUID,
  category TEXT, -- 'bug' | 'how_to' | 'data_correction' | 'access_request' | 'complaint'
  priority ENUM('low','med','high','urgent'),
  sla_due_at TIMESTAMPTZ,
  status ENUM('open','triage','in_progress','awaiting_user','resolved','closed'),
  subject TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  -- RLS
);
```

### SLA
| Priority | First response | Resolve |
|----------|---------------|---------|
| Urgent | 15m | 4h |
| High | 1h | 24h |
| Med | 4h | 3d |
| Low | 24h | 7d |

### KB
- Auto-suggest from past tickets
- Linked to feature_id
- Updateable by support staff
- Public + private sections

### Files
```
src/helpdesk/
├── routes.js
├── service.js
├── sla.ts
├── knowledge/
└── tests/
```

---

## 2. User Manual (AR + EN)

For each role:
- Doctor
- Nurse
- Receptionist
- Pharmacist
- Lab tech
- Radiologist
- Admin
- Patient

**Sections** (per role):
1. Login + MFA + password reset
2. Day-in-the-life workflow
3. Feature walk-through (50 screens)
4. Common errors + fixes
5. FAQ
6. Glossary (clinical terms, AR + EN)
7. Support contact

Format: PDF + in-app help + online portal.

---

## 3. Training Videos (scripts)

Per role, 20-30 short videos:
- 1-min onboarding
- 3-min feature deep-dive
- 5-min scenario (e.g., "code blue in ICU")

Hosting: Hetzner Storage Box + Cloudflare stream.

Scripts in `.ai-brain/99-upgrade/32-training/scripts/` (Markdown).

---

## 4. Legal & Compliance Docs

| Doc | Owner |
|-----|-------|
| Master Service Agreement (MSA) | Legal |
| Data Processing Agreement (DPA) | Legal + CQO |
| Business Associate Agreement (BAA) | Legal + CQO |
| Subcontractor agreements | Legal |
| Consent forms (per encounter, per research) | CQO |
| Privacy notice (per tenant) | CQO |
| Acceptable Use Policy | SA + DSL |
| License terms | Legal |
| Open-source attributions | SA |

Stored in `legal/` with versioning + e-sign.

---

## 5. Project Management (Agile/Scrum)

Tools:
- Jira (or Linear-style self-hosted alternative)
- Sprint board (kanban)
- Backlog grooming
- Sprint planning + retrospective
- Burndown charts

Definition of Done (DoD) for any user story:
- [ ] Acceptance criteria met
- [ ] Unit + integration tests
- [ ] Code review
- [ ] Security scan
- [ ] Lint + typecheck
- [ ] Migration applied (non-destructive)
- [ ] Doc updated
- [ ] Live in staging + verified

---

## 6. Task Tracking

Each task:
```yaml
id: TASK-1042
title: 'Add PCI order set to cardiology'
status: in_progress
assignee: alice
sprint: 24
due: 2026-08-15
estimate: 5h
actual: 6h
priority: high
epic: 'AI-Brain Upgrade'
labels: [cardiology, order-set, path:ami-stemi]
subtasks:
  - 'YAML schema'
  - 'API endpoint'
  - 'UI mock'
  - 'Tests'
files_touched:
  - 'namaweb/...'
  - '.ai-brain/16-business/order-sets/AMI_STEMI.yaml'
```

---

## 7. Budget & Token Cost Management

```yaml
budget:
  llm_token_per_prompt:
    PROMPT:CARD-001:initial_assessment: { avg_in: 1200, avg_out: 350, cost_usd: 0.014 }
  monthly_cap_per_tenant_usd: 500
  alerts: at_80%, at_95%
  tracking: per_prompt per_day per_tenant
```

Dashboard: `.ai-brain/24-apm/llm-cost-dashboard.json`

---

## 8. APM (Application Performance Monitoring)

Tool: OpenTelemetry + Grafana + Prometheus.

**Top metrics** (server-side authority):
- API p50, p95, p99 latency
- Error rate (5xx, 4xx with reason)
- DB connection pool saturation
- Background job queue length
- LLM cost per request
- Cache hit rate
- Per-tenant isolation violation count (must be 0)

**Alerts**:
- SLO breach → page on-call
- Tenant bleed → security alert
- LLM cost spike → cost center

---

## 9. User Analytics (Mixpanel-equivalent)

Track (with PDPL consent):
- Feature adoption
- Click flows
- Drop-off points
- A/B test results
- Cohort retention

Stored in DWH (ClickHouse or similar).

**PII**: never logged; only hashed user_id.

---

## 10. LLM Observability (Langfuse)

| Metric | Track |
|--------|-------|
| Per-prompt cost | yes |
| Per-prompt latency | yes |
| Token usage in/out | yes |
| Success rate | yes |
| Override rate | yes |
| Citation coverage | yes |
| Red-flag hit rate | yes |
| User rating | yes (1-5 stars) |

Dashboard: `.ai-brain/26-llm-obs/`

---

## 11. i18n Translation Files

Path: `.ai-brain/99-upgrade/27-i18n/`

```json
// ar-SA.json (example keys)
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "loading": "جاري التحميل..."
  },
  "patient_chart": {
    "allergies": "الحساسية",
    "medications": "الأدوية",
    "labs": "الفحوصات"
  }
}
```

```json
// en-US.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  }
}
```

Workflow:
1. PM/UX crafts keys in JSON
2. Tool (Crowdin/POEditor) translates
3. CI gate: keys exist in both langs
4. Untranslated key = warning

---

## 12. Sample Data & Seeders

Path: `.ai-brain/99-upgrade/29-seeders/` + `namaweb/seeds/`

Per dept:
- 50 dummy patients (deidentified)
- 100 encounters
- 500 orders
- 500 results
- 100 care plans
- 200 tasks

**Critical**: NO PHI; all dummy data.

---

## 13. Migration Scripts

Format: per AGENTS.md
```
namaweb/migrations/
├── eN_xx_name_up.sql      # forward
├── eN_xx_name_down.sql    # reverse (non-destructive)
└── validate.sql            # asserts
```

---

## 14. Files

```
src/helpdesk/
src/observability/
src/i18n/
namaweb/seeds/
namaweb/migrations/
.ai-brain/99-upgrade/
├── 21-helpdesk/
├── 22-gtm/
├── 23-budget/
├── 24-apm/
├── 25-user-analytics/
├── 26-llm-obs/
├── 27-i18n/
├── 28-design-system/
├── 29-seeders/
├── 30-migrations/
├── 31-user-manual/
├── 32-training/
├── 33-legal/
├── 34-pm/
└── 35-tasks/
```

---

*Owner: PM+DSL — version 1.0 — 2026-08-01*
