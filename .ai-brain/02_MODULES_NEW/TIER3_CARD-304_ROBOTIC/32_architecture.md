# CARD-304_ROBOTIC — Architecture

## Component Diagram

```
Frontend (Stitch):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Dashboard │ │  Detail  │ │   Form   │ │  Chart   │
└─────┬────┘ └─────�────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Express Router (09_router.js):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  /cases  │ │ /procedures│ │/followups│ │  /score  │
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Pure Engine (08_engine.js):
┌──────────────────────────────────────────────────────┐
│ stsScore | euroscoreII | taviEligibility             │
│ mitraclipEligibility | watchmanEligibility           │
│ roboticSurgeryEligibility | preOpChecklist            │
│ conversionToOpenRisk | postOpComplicationRisk        │
│ dischargeReadiness                                    │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────�
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Vector DB   │  │  LangChain   │
│  (4 tables)  │  │  (pgvector)  │  │  RAG         │
│  FORCE RLS   │  │  HNSW index  │  │  STS/ACC/AHA │
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

## Monitoring
- Prometheus: RPS, latency
- LangSmith: LLM cost
- Custom: Conversion rate, mortality
- PagerDuty: Stroke, tamponade
