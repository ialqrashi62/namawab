---
id: INFRASTRUCTURE
version: 1.0
date: 2026-08-01
owner: DSL
status: ACTIVE
---

# Infrastructure / DevOps — Terraform + Multi-Region + Chaos

> **Purpose:** Production-grade infrastructure (IaC, multi-region, DR, monitoring, secrets) for a hospital-grade SLA.

---

## 1. Global systems comparison

| System | Infra pattern |
|--------|----------------|
| **Epic Cosmos** | On-prem clusters; long release cycles |
| **Cerner on AWS/Azure** | Mostly cloud-hosted, multi-region |
| **MEDITECH on Azure** | Cloud-native, single tenant per cluster |
| **athena on AWS** | Cloud-native, multi-tenant |
| **AWS HealthLake / HealthOmics** | Managed services |
| **NamaMedical** | **Terraform + multi-region + DR + chaos** |

---

## 2. Current setup (production)

- **Server**: Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74)
- **Domain**: jumanasoft.com
- **Process manager**: PM2 (`nama-medical-erp`)
- **Branch**: integration/all-epics
- **DB**: PostgreSQL on same host (currently)

---

## 3. Target multi-tenant SaaS architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Cloudflare (CDN + WAF + DDoS)             │
└────────────────────────┬─────────────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  ALB / NGINX (TLS 1.3)                     │
│      health checks + auto-failover to secondary           │
└────────────────────────┬─────────────────────────────────┘
                         ▼
          ┌──────────────┴──────────────┐
          ▼                             ▼
      Region A (primary)         Region B (warm standby)
      Hetzner FSN1                Hetzner NB1 / AWS me-central-1
                                                  (future)
```

Components per region:
- **App server(s)** (Express behind NGINX)
- **PostgreSQL** (primary + read replica)
- **Redis** (session, cache)
- **OpenSearch** (logs, audit queries)
- **PGVector** (in same Postgres)
- **PHI Vault** (encrypted file storage)
- **Backups** (encrypted, off-region)
- **Worker** (background jobs)

---

## 4. Terraform modules

```
infra/
├── modules/
│   ├── app-server/
│   ├── postgres/
│   ├── redis/
│   ├── opensearch/
│   ├── backup/
│   └── observability/
├── envs/
│   ├── staging/
│   ├── production/
│   └── dr-warm-standby/
└── README.md
```

Each module:
- Inputs: tenant_size, region, compliance_profile
- Outputs: connection strings, IAM, DNS
- Includes: monitoring, backup, log shipping

---

## 5. Disaster Recovery (DR) targets

| Metric | Target | Current |
|--------|--------|---------|
| **RPO** | < 1 hour | TBD (verify) |
| **RTO** | < 4 hours | TBD |
| **Backup frequency** | every 6h | daily |
| **Backup retention** | 30d rolling, 2y cold | TBD |

**Approach**: WAL archiving to secondary every 5 min + daily snapshot.

**Drill**: quarterly backup restore (sandbox).

---

## 6. Secrets management

```yaml
secrets:
  - env: process.env.DB_URL  # never in repo
  - secrets_store:  # one of:
      - Vault (preferred)
      - AWS Secrets Manager
      - Doppler
      - Hetzner CSI-side (encrypted)
  rotation:
    - quarterly
    - emergency on leak
  access_log:  # who/what/when, retained 7y
  audit_hash: chain audit
```

No hardcoded secrets (Rail 1).

---

## 7. Observability (3 pillars)

| Pillar | Tool |
|--------|------|
| **Logs** | OpenSearch + Loki |
| **Metrics** | Prometheus + Grafana |
| **Traces** | OpenTelemetry → Jaeger |

**SLOs**:
- API p95 latency < 400ms
- Login flow < 2s
- Search p95 < 600ms
- Background jobs < 5m
- Error budget 99.5% / month

**Alerting**: PagerDuty / Opsgenie (or local alternative) for SLO breach.

---

## 8. LLM Observability

| Tool | Use |
|------|-----|
| **Langfuse** | Trace prompts + tokens + cost |
| **Helicone** | Routing + caching |
| **Custom dashboard** | dept cost per day |

Dashboard: prompt_id | calls/day | success rate | tokens in/out | cost | latency p95.

---

## 9. Chaos engineering

```yaml
chaos_tests:
  - name: 'redis-fail'
    action: kill redis, verify app still works (fallback memory)
  - name: 'postgres-failover'
    action: simulate primary crash, verify replica takes over
  - name: 'high-load'
    action: 10x traffic, verify graceful degradation
  - name: 'pillai-llm-throttle'
    action: delay LLM 30s, verify timeouts
  - name: 'tenant-a-purge'
    action: clear tenant A scope; verify tenant B isolated
schedule: monthly, in staging
```

---

## 10. Files

```
infra/terraform/
modules/observability/
├── grafana-dashboards/
│   ├── app-overview.json
│   ├── api-latency.json
│   ├── ai-cost.json
│   └── tenant-isolation.json
└── alert-rules/
    ├── app.yaml
    ├── security.yaml
    └── llm.yaml
runbooks/
├── dr-failover.md
├── llm-spike.md
└── tenant-bleed.md
```

---

*Owner: DSL — version 1.0 — 2026-08-01*
