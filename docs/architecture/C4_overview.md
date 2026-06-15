# NamaMedical — Architecture (C4 Model)

## L1 — System Context

```mermaid
graph TB
  subgraph Users
    DOC[Doctor / Specialist]
    NUR[Nurse / RT]
    LABT[Lab / Radiology Tech]
    PHARM[Pharmacist]
    ADMIN[Admin / Finance / HR]
    PT[Patient / Family]
    EXT[External: SCFHS / SFDA / Legal]
  end

  NM((NamaMedical Platform))

  subgraph KSAGov[KSA Government Platforms]
    NPHIES[NPHIES]
    WAS[Wasfaty]
    MAW[Mawid]
    SEH[Sehhaty]
    YAQ[Yaqeen]
    ANAT[ANAT]
    SHAHM[Shahm]
    BAIN[BAIN]
    CBAHI[CBAHI]
  end

  subgraph Vendors
    PACS_V[PACS Vendors NNCH/Cardiac/BADER]
    LAB_V[LIS Vendor]
    DEV_V[Biomed Devices fleet]
    LLM[LLM Provider KSA-region]
    PAY[Payment Gateway / ZATCA]
  end

  DOC --> NM
  NUR --> NM
  LABT --> NM
  PHARM --> NM
  ADMIN --> NM
  PT --> NM
  EXT -.audit/inspection.-> NM

  NM <--> NPHIES
  NM <--> WAS
  NM <--> MAW
  NM <--> SEH
  NM <--> YAQ
  NM <--> ANAT
  NM <--> SHAHM
  NM <--> BAIN
  NM -.evidence.-> CBAHI

  NM <--> PACS_V
  NM <--> LAB_V
  NM <--> DEV_V
  NM --> LLM
  NM <--> PAY
```

## L2 — Containers

```mermaid
graph LR
  subgraph Edge
    CDN[Cloudflare/Fastly + WAF]
    NGX[NGINX Ingress + mTLS]
  end

  subgraph FrontEnd
    WEB[Web Portal React 19]
    DESK[Desktop Qt6 App]
    MOB[Mobile React-Native]
    BOARD[ED/ICU Live Board SSE]
  end

  subgraph BackendServices[Backend Microservices]
    API_AUTH[Auth/IdP gateway]
    API_PT[patients]
    API_VISIT[visits]
    API_ORDER[orders]
    API_LAB[lab]
    API_RAD[radiology]
    API_PHARM[pharmacy]
    API_FIN[finance + ZATCA]
    API_HR[hr]
    API_INV[inventory]
    API_NSG[nursing]
    API_ED[ed]
    API_ICU[icu]
    API_SURG[surgery]
    API_CARD[cardio]
    API_OBGYN[obgyn]
    API_NEO[neonatal-peds]
    API_OTHERS[...all 40 dept services]
    API_QA[quality]
    API_AUDIT[audit-trail immutable]
    API_AI[AI orchestrator LangGraph]
    API_REPORTS[reports/analytics]
  end

  subgraph DataPlane
    MSSQL[(MSSQL 2022 HA primary OLTP)]
    SQLITE[(SQLite offline mobile/desk)]
    REDIS[(Redis cache+queues)]
    KAFKA[(Kafka events)]
    QDRANT[(Qdrant vector DB)]
    MINIO[(MinIO blob storage)]
    OLAP[(ClickHouse / Snowflake reporting)]
    VAULT[(Vault / KeyVault)]
  end

  subgraph AIWorkers
    W_RAG[RAG worker]
    W_ECG[ECG AI worker]
    W_IMG[Imaging AI worker]
    W_NLP[NLP/extractor]
  end

  subgraph Observability
    LOKI[Loki Logs]
    PROM[Prometheus]
    TEMPO[Tempo Traces]
    GRAFANA[Grafana dashboards]
    SIEM[Wazuh/Sentinel]
    PAGERD[PagerDuty]
  end

  CDN --> NGX --> WEB
  CDN --> NGX --> MOB
  DESK -.->|HTTPS| NGX
  WEB --> API_AUTH
  WEB --> API_PT & API_VISIT & API_ORDER & API_LAB & API_RAD & API_PHARM & API_FIN
  WEB --> API_ED & API_ICU & API_SURG & API_CARD & API_OBGYN & API_NEO & API_QA
  WEB --> API_AI
  BOARD --> API_ED
  BOARD --> API_ICU

  API_PT --> MSSQL
  API_LAB --> MSSQL
  API_AUDIT --> MSSQL
  API_AI --> QDRANT
  API_AI --> MSSQL
  API_AI --> KAFKA
  W_RAG --> QDRANT
  W_RAG --> MINIO
  W_ECG --> KAFKA
  W_IMG --> MINIO

  MSSQL -- CDC --> KAFKA --> OLAP
  All --> REDIS
  All --> VAULT
  All --> LOKI & PROM & TEMPO --> GRAFANA --> PAGERD
  SIEM --> PAGERD
```

## L3 — Components (example: AI Orchestrator)

```
┌────────────────────────────────────────────────────────┐
│  AI Orchestrator service                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ HTTP API     │  │ LangGraph    │  │ Tool Registry │ │
│  │ FastAPI      │─▶│ Workflows    │─▶│ (per dept)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │        │
│         ▼                  ▼                  ▼        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PHI Redactor │  │ RAG Retriever│  │ Tool Caller   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │        │
│         ▼                  ▼                  ▼        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ LLM Adapter  │  │ Qdrant Client│  │ ERP REST     │  │
│  │ (Anthropic)  │  │              │  │ SDK          │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                        │
│  Cross-cutting: AuthN/Z (JWT), Audit (hash-chain),     │
│                 Observability (OTel), Rate limit       │
└────────────────────────────────────────────────────────┘
```

## L4 — Code (example file layout)
```
services/
├── ai-orchestrator/
│   ├── api/
│   │   ├── routes_health.py
│   │   ├── routes_ai.py
│   │   └── deps.py
│   ├── orchestration/
│   │   ├── base.py            # DeptOrchestrator
│   │   ├── cardio.py
│   │   ├── ed.py
│   │   └── ...
│   ├── rag/
│   │   ├── client.py
│   │   └── ingest.py
│   ├── tools/
│   │   └── registry.py
│   ├── safety/
│   │   ├── redact.py
│   │   ├── critique.py
│   │   └── audit.py
│   ├── settings.py
│   └── main.py
└── cardio-api/, ed-api/, icu-api/, ...
```

## Cross-cutting concerns
- **API Gateway**: Kong or NGINX — JWT validation, rate limit, request-id propagation.
- **Service mesh**: Linkerd / Istio — mTLS, retries, circuit breakers.
- **Config**: ConfigMaps + Vault for secrets; per-env overlays via Kustomize/Helm.
- **Schema migrations**: Alembic (Python) and EF Core (.NET) in `migrations/` per service.
- **Backups**: nightly full + 15-min incremental; immutable storage 30 d.
- **Disaster Recovery**: warm standby in second region; quarterly DR drills.

## Latency budgets (SLOs)
| Path | p50 | p95 | p99 |
|------|----|----|----|
| Patient search | 60 ms | 200 ms | 500 ms |
| Order create | 100 ms | 400 ms | 800 ms |
| Lab result post | 80 ms | 300 ms | 700 ms |
| AI co-pilot ask (text only) | 1.2 s | 3.5 s | 6 s |
| AI co-pilot with RAG | 1.8 s | 5 s | 8 s |
| ECG AI inference | 2 s | 5 s | 10 s |
| Live ED board update (SSE) | 200 ms | 1 s | 2 s |

## Capacity assumptions
- 3 hospitals × 800 beds × 200 staff each = 1,800 daily concurrent users.
- 150,000 OPD visits / month, 8,000 ED visits / month, 2,000 admissions.
- 500K lab results, 80K imaging studies, 3M med admins per month.
