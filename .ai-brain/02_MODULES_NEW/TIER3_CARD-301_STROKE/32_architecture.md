# CARD-301_STROKE — Architecture Document

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (Stitch HTML)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Dashboard │  │  Detail  │  │   Form   │  │  Chart   │    │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘    │
└────────┼─────────────┼─────────────┼─────────────┼─────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Router (09_router.js)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  /cases  │  │/thromboly│  │  /score  │  │  /stats  │    │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘    │
└────────┼─────────────┼─────────────┼─────────────┼─────────┘
         │             │             │             │
         ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│         Pure Engine (08_engine.js)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ nihssScore | aspectsScore | mrsScore | ichScore     │  │
│  │ huntHess | abcd2Score | cha2ds2vascScore | hasBled  │  │
│  │ tenecteplaseDose | thrombolysisEligibility           │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Vector DB   │  │  LangChain   │
│  (5 tables)  │  │  (pgvector)  │  │  RAG         │
│  FORCE RLS   │  │  HNSW index  │  │  AHA/ASA/MoH │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Layered Architecture

### Layer 1: API Routes (Express)
- All endpoints under `/api/stroke/*`
- Middleware chain: `requireAuth` → `requireTenantScope` → `requireRole` → handler
- Returns JSON with Arabic + English error messages

### Layer 2: Pure Engine (No I/O)
- 11 pure functions for clinical scoring
- No DB calls, no I/O, no external dependencies
- Testable in isolation
- Citable evidence-based medicine

### Layer 3: Data Layer (PostgreSQL)
- 5 tables with FORCE RLS
- Multi-tenant via tenant_id
- Indexes on tenant_id + critical fields
- Foreign keys to patient/encounter/user

### Layer 4: Vector Layer (RAG)
- pgvector with HNSW index
- Cosine similarity
- Embedded chunks from AHA/ASA/MoH
- Top-10 retrieval, top-5 rerank

### Layer 5: AI Layer (LangChain)
- RAG pipeline for clinical questions
- Multi-locale (AR/EN)
- Safety guardrails
- Citation enforcement

## Security Architecture

| Layer | Security |
|---|---|
| Network | TLS 1.3, CSP headers, HSTS |
| Auth | bcrypt + session + 2FA for clinicians |
| RBAC | 7-tier Golden Access Rule |
| Tenant | AsyncLocalStorage + RLS |
| Audit | Hash-chained, 7+ years |
| PHI | At-rest encryption (DPAPI KEK) |
| Logs | No PHI, no secrets (rails #12) |

## Scalability

- **Read replicas**: PostgreSQL HA (3 nodes)
- **Caching**: Redis for hot scoring (TTL 5 min)
- **CDN**: Static assets (HTML/CSS/JS)
- **Vector indexing**: HNSW for sub-100ms retrieval
- **Horizontal scaling**: PM2 cluster mode (2 instances)

## Monitoring

- Prometheus: RPS, latency, error rate
- LangSmith: LLM cost, latency, token usage
- Custom: SLA metrics (DNT, DTG, mRS)
- Grafana dashboard: real-time stroke center
- PagerDuty: SLA breach > 60 min
