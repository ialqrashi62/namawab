# CARD-303_ONCO — Architecture

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
│  /cases  │ │/cardiotox│ │  /score  │ │  /stats  │
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Pure Engine (08_engine.js):
┌──────────────────────────────────────────────────────┐
│ hfaIcosRiskScore | ctcaeCardiotoxicityGrade         │
│ glsChangeDetection | iciMyocarditis | anthracyclineDose │
│ trastuzumabCardiotoxicityRisk | qtcMonitoring         │
│ vteTreatment | cardiacAmyloidWorkup                   │
│ cardioprotectionDecision                              │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Vector DB   │  │  LangChain   │
│  (4 tables)  │  │  (pgvector)  │  │  RAG         │
│  FORCE RLS   │  │  HNSW index  │  │  ESC/AHA/    │
│              │  │              │  │  ASCO/NCCN    │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Security Layers
- TLS 1.3, CSP, HSTS
- bcrypt + MFA + session
- 7-tier RBAC
- AsyncLocalStorage + RLS
- Hash-chained audit 7+ yr
- PHI encrypted at rest
- No PHI in logs

## Scalability
- Read replicas × 3
- Redis cache (TTL 5 min)
- CDN
- PM2 cluster (2 instances)
- HNSW vector index

## Monitoring
- Prometheus: RPS, latency
- LangSmith: LLM cost
- Custom: Cardiotoxicity rate, ICI myoc. incidence
- PagerDuty: ICI myocarditis, severe cardiotoxicity
