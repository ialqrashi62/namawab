# CARD-302_ADHF — Architecture

## Component Diagram

```
Frontend (Stitch):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Dashboard │ │  Detail  │ │   Form   │ │  Chart   │
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Express Router (09_router.js):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  /cases  │ │/admissions│ │  /score  │ │ /lvad    │
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Pure Engine (08_engine.js):
┌──────────────────────────────────────────────────────┐
│ nyhaClass | accStage | lvefClassification | ntprobnp │
│ maggicScore | intermacsProfile | scaiShockStage     │
│ gdmtEligibility | arniDosing | sglt2iDosing         │
│ lvadPreOpChecklist | transplantListingStatus        │
│ lvadPumpThrombosisRisk | heartMate3Risk | ...      │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Vector DB   │  │  LangChain   │
│  (5 tables)  │  │  (pgvector)  │  │  RAG         │
│  FORCE RLS   │  │  HNSW index  │  │  AHA/ACC     │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Security Layers
- Network: TLS 1.3, CSP, HSTS
- Auth: bcrypt + MFA + session
- RBAC: 7-tier Golden Access
- Tenant: AsyncLocalStorage + RLS
- Audit: hash-chained 7+ years
- PHI: encrypted at rest
- Logs: no PHI

## Scalability
- Read replicas × 3
- Redis cache (TTL 5 min)
- CDN for static
- PM2 cluster (2 instances)
- HNSW vector index

## Monitoring
- Prometheus: RPS, latency, error
- LangSmith: LLM cost/latency
- Custom: MAGGIC-1yr mortality
- PagerDuty: SCAI C+ stages
