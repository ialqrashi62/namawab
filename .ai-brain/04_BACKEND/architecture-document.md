# Architecture Document — NamaMedical ERP
# Filepath: .ai-brain/04_BACKEND/architecture-document.md
# Generated: 2026-08-08

# Architecture Document — Master v5

> **Stack:** Node.js + Express + PostgreSQL + pgvector + Vanilla JS SPA + Tailwind + LangChain + RAG
> **Deployment:** Hetzner (self-hosted) + Docker + PM2
> **Multi-tenant:** FORCE_RLS on 150+ tables

---

## 1. System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (Client)                       │
│  ┌─────────┬─────────┬─────────┬─────────┬────────────┐  │
│  │Login    │Admin    │Patient  │Doctor   │Nursing      │  │
│  │Page     │Panel    │Portal   │Station  │Station      │  │
│  └─────────┴─────────┴─────────┴─────────┴────────────┘  │
│         Tailwind CSS + Vanilla JS + RTL/LTR + i18n       │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS + JWT + x-tenant-id
┌────────────────────────┴─────────────────────────────────┐
│              Nginx (Reverse Proxy)                       │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Rate limit · CSP · Security Headers · Static        │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────┐
│            Node.js Application (Express)                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Middleware: helmet, cors, session, audit            │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Auth: JWT + MFA (TOTP)                              │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ RBAC: role + specialty-based access                 │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Tenant: requireTenantScope + AsyncLocalStorage      │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Routes: 60 dept routers + admin + auth + billing    │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Engines: 60+ Node.js classes (clinical pure)        │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Validation: fail-closed schema validation           │ │
│  ├─────────────────────────────────────────────────────┤ │
│  │ Idempotency: money routes only                      │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │ pg pool + Redis
┌────────────────────────┴─────────────────────────────────┐
│            PostgreSQL 16 + pgvector                       │
│  ┌─────────────┬─────────────�─────────────────────────┐ │
│  │ Schema      │ Tables      │ FORCE_RLS on 150+       │ │
│  │ 80+ tables  │ Multi-tenant│ Audit hash-chained      │ │
│  ├─────────────┼─────────────┼─────────────────────────┤ │
│  │ Extensions  │ pgvector    │ embedding(3072)         │ │
│  │             │ pgcrypto    │ encrypted PHI blobs     │ │
│  └─────────────┴─────────────�─────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴─────────────────────────────────┐
│             External Services                              │
│  ┌─────────┬─────────┬─────────┬─────────┬────────────┐  │
│  │OpenAI   │LangFuse │NPHIES   │ZATCA    │SFDA        │  │
│  │LLM API  │Tracing  │Claims   │Invoices │Drug DB     │  │
│  └─────────�─────────┴─────────┴─────────┴────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema (80+ tables)

### 2.1 Core Tables (multi-tenant)

```sql
tenants           -- Hospital accounts
users             -- Login accounts (bcrypt + MFA)
patients          -- Patient registry
encounters        -- Visit records (in/out/ED)
audit_log         -- Hash-chained PHI access
sessions          -- Active JWT sessions

-- 60 dept-specific tables × 5 each (encounters, orders, results, notes, audit)
-- cardiology_encounters, cardiology_orders, cardiology_results, cardiology_notes, cardiology_audit
-- endocrinology_encounters, ... etc.

-- Operational tables
billing_invoices, billing_payments
insurance_claims
pharmacy_dispensations, pharmacy_inventory
lab_orders, lab_results
radiology_orders, radiology_images
appointments, schedules, beds
helpdesk_tickets
```

### 2.2 RLS Policies

Every table has:
- `tenant_id BIGINT NOT NULL`
- `ENABLE ROW LEVEL SECURITY`
- `FORCE ROW LEVEL SECURITY`
- Policy: `USING (tenant_id = current_setting('app.tenant_id', true)::BIGINT)`

### 2.3 Vector Tables

```sql
CREATE TABLE dept_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,  -- 'guidelines', 'drugs', 'icd10', etc.
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON dept_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## 3. Application Architecture (Node.js)

### 3.1 Layer Structure

```
namaweb/
├── server.js                    # Express setup + middleware
├── db_postgres.js               # pg pool + RLS context
├── tenant_resolve.js            # requireTenantScope
├── rbac.js + rbac_guards.js    # Role-based access
├── audit_middleware.js          # Hash-chained audit
├── validation.js + route_schemas.js
├── idempotency.js               # Money route guard
├── cds.js                       # Clinical decision support
├── *_engine.js                  # 60 dept engines
├── *_router.js                  # 60 dept routers
├── *_test.js                    # 60 dept tests
└── public/
    ├── index.html               # Main SPA
    ├── admin.html               # Admin panel
    └── js/
        ├── app.js               # 1.7 MB main SPA
        ├── doctor-station.js    # Doctor's main station
        ├── nursing-station.js   # Nursing station
        ├── {dept}-station.js    # 49 dept stations
        ├── auth.js, modal.js, i18n-runtime.js
        └── components/          # Stitch components
```

### 3.2 Request Flow

```
Browser
  ↓ HTTPS + JWT + x-tenant-id
Nginx
  ↓ proxy_pass
Express
  ↓ helmet → cors → session → tenant scope → RBAC → validate → idempotency
Engine (setTenant, run action)
  ↓ pg.connect() with SET LOCAL app.tenant_id
PostgreSQL
  ↓ FORCE_RLS enforces row-level filtering
Vector Search (optional, RAG chain)
  ↓ pgvector ivfflat index
OpenAI / LangChain
  ↓ response
Express
  ↓ JSON + audit log write (hash-chained)
Browser
```

---

## 4. RAG Architecture

```
┌──────────────────────────────────────────────────────┐
│                    RAG Pipeline                       │
│                                                       │
│  User Question                                         │
│       ↓                                               │
│  LangChain Retriever (MMR, k=8)                       │
│       ↓                                               │
│  pgvector Search (with tenant_id filter)              │
│       ↓ Top 8 chunks                                  │
│  LangChain Prompt Template (bilingual)                │
│       ↓                                               │
│  GPT-4o-mini (temp=0)                                 │
│       ↓                                               │
│  ConversationalRetrievalChain                         │
│       ↓                                               │
│  Answer + Sources (cited ICD-10/SNOMED)               │
│       ↓                                               │
│  LangFuse Tracing                                     │
│       ↓                                               │
│  Audit Log (which user asked which question)          │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### 4.1 Vector Collections (per dept, 6 each)

| Collection | Purpose | Ingest |
|---|---|---|
| `guidelines` | Clinical guidelines | Quarterly |
| `protocols` | Hospital-specific protocols | On update |
| `drugs` | SFDA drug monographs | Monthly |
| `icd10` | ICD-10 codes + descriptions | Annual |
| `snomed` | SNOMED-CT concepts | Annual |
| `cases` | Anonymized case summaries | On case close |

---

## 5. Frontend Architecture

### 5.1 Single-Page App (SPA)

- **Framework:** Vanilla JS (no React/Vue) — keeps bundle small
- **CSS:** Tailwind (utility-first, RTL-aware)
- **i18n:** Custom runtime (ar/en + RTL/LTR)
- **State:** Custom store + EventTarget
- **Routing:** Hash-based (#/station/cardiology)
- **Components:** Stitch design system

### 5.2 Stations (80 total)

- 31 pre-existing (Cardiology, ICU, etc.)
- 49 newly generated (Peds subspecialties, Psychiatry, Pharmacy, etc.)
- Pattern: 2-col layout (sidebar + main)
  - Sidebar: Patient ID + Allergies + Risk Score
  - Main: Vitals + Tabs (Overview / Orders / Results / Notes)

### 5.3 Real-time Updates (Future)

- WebSocket / Server-Sent Events (SSE)
- Subscribe to patient events
- Live vitals from IoT devices

---

## 6. Deployment Architecture

### 6.1 Hetzner (Single Server for Now)

```
ubuntu-8gb-hel1-1 (204.168.144.74)
  ├─ nginx (reverse proxy)
  ├─ Node.js (PM2 nama-medical-erp)
  ├─ PostgreSQL 16 + pgvector
  ├─ Redis (session + cache)
  ├─ Prometheus + Grafana
  └─ Loki (logs)
```

### 6.2 Future: K8s Cluster

```yaml
# (Roadmap — Sprint 55)
- 3× app nodes (4 vCPU, 8 GB each)
- 3× db nodes (PG with streaming replication)
- 2× Redis (HA)
- 1× Prometheus + Grafana
- Ingress: nginx-ingress + cert-manager
```

---

## 7. Security Architecture

### 7.1 7 Layers (Defense in Depth)

1. Network (firewall, fail2ban)
2. Reverse proxy (Nginx + rate limit)
3. Application (Helmet, CSP, CORS)
4. Authentication (JWT + MFA)
5. Authorization (RBAC + tenant)
6. Database (RLS + encryption)
7. AI safety (RAGAS + guardrails)

### 7.2 PHI Protection

- Encrypted at rest (crypto_envelope.js)
- Encrypted in transit (TLS 1.2+)
- Redacted in logs (log_redactor.js)
- Audit-logged on access
- No PHI in test fixtures

---

## 8. Scalability

### 8.1 Vertical (Now)
- 8 GB RAM → 32 GB
- 4 vCPU → 8 vCPU
- SSD → NVMe

### 8.2 Horizontal (Future)
- App: 3+ stateless instances behind load balancer
- DB: Read replicas for reporting
- Vector: Sharded by tenant

### 8.3 Caching
- Redis for sessions
- Redis for RAG query cache (40% reduction)
- In-memory for hot patient data

---

## 9. Reliability

### 9.1 SLOs
- Availability: 99.9%
- p95 latency: < 200ms
- p99 latency: < 500ms
- RTO (Recovery Time): < 1 hour
- RPO (Recovery Point): < 1 hour

### 9.2 Backup
- Daily pg_dump (30-day retention)
- Weekly full backup (1-year retention)
- Off-site to Hetzner Storage Box
- Restore tested quarterly

---

**Generated:** 2026-08-08 · **Owner:** Architecture Team
