# {{DEPT_NAME_AR}} — Architecture
## NamaMedical Department Blueprint

> **القسم:** `{{DEPT_SLUG}}`
> **النوع:** {{FACILITY_TYPE}}
> **الإصدار:** 1.0
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **الحالة:** {{STATUS}}

---

## 1. نظرة عامة

{{DEPT_NAME_AR}} هو قسم {{DEPT_SHORT_DESC_AR}} ضمن منصة NamaMedical. يدعم:
- {{CAPABILITY_1}}
- {{CAPABILITY_2}}
- {{CAPABILITY_3}}
- {{CAPABILITY_4}}

**المستخدمون الأساسيون:** {{PRIMARY_USERS_AR}}
**حجم العمليات المتوقع:** {{DAILY_VOLUME}} مريض/يوم
**زمن الاستجابة المستهدف:** p95 ≤ {{P95_MS}}ms

---

## 2. مخطط المعمارية (C4 Model)

```
┌────────────────────────────────────────────────────────────┐
│  Patients / Clinicians (Browser PWA, Mobile)               │
└─────────────────────┬──────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼──────────────────────────────────────┐
│  Cloudflare CDN + WAF                                       │
│  (CSP, Rate limit, Bot protection)                          │
└─────────────────────┬──────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────┐
│  Express.js (Node 20)                                       │
│  ├─ Router: /api/{{DEPT_SLUG}}/* (RBAC, tenant, audit)     │
│  ├─ Engine: pure functions (testable)                      │
│  ├─ RAG pipeline: pgvector (chunks, embeddings)            │
│  ├─ AI co-pilot: multi-model gateway                       │
│  └─ LangChain orchestrator (sequential, branch, parallel)  │
└─────────────────────┬──────────────────────────────────────┘
                      │ TCP
┌─────────────────────▼──────────────────────────────────────┐
│  PostgreSQL 16 (Hetzner VPS)                                │
│  ├─ Tables: {{TABLES}}                                      │
│  ├─ RLS: FORCE_ROW_LEVEL_SECURITY + policies              │
│  ├─ Audit: hash-chained, 7+ years                          │
│  ├─ pgvector: embeddings (medical knowledge)              │
│  └─ Backups: nightly, 30d local + S3 cold                  │
└────────────────────────────────────────────────────────────┘
```

---

## 3. الطبقات (Layers)

### 3.1 Presentation Layer
- **Frontend:** Stitch MD3 (Material Design 3) + Tailwind
- **i18n:** AR/EN/FR/UR (5,000+ keys)
- **State:** Vanilla JS + reactive binding
- **A11y:** WCAG 2.2 AA
- **PWA:** Offline-first for clinicians

### 3.2 API Layer
- **REST + JSON** (primary)
- **FHIR R4** (interop)
- **WebSocket** (real-time queue)
- **HL7v2 MLLP** (legacy integration)
- **DICOM** (planned, W14)

### 3.3 Business Logic Layer
- **Engines** (pure functions, no DB) — testable in isolation
- **Routers** (Express + middleware chain) — request orchestration
- **Services** (DB-bound, tenant-aware)
- **Validators** (JSON Schema)
- **RBAC** (7-tier, role-permission map)

### 3.4 Data Layer
- **PostgreSQL 16** (primary, transactional)
- **pgvector** (RAG embeddings)
- **Redis** (session, cache, queue)
- **S3** (PDF exports, DICOM files, cold backups)
- **No external analytics DB** (deferred P2)

### 3.5 AI / LLM Layer
- **Multi-model gateway** (OpenAI, Anthropic, Google, OSS via Ollama)
- **Prompt registry** (versioned, A/B test)
- **LangChain-style orchestrator** (chaining, branching, parallel)
- **RAG over pgvector** (medical knowledge)
- **Cost + token tracking** (per dept, per tenant)

### 3.6 Compliance Layer
- **PDPL** (data residency KSA, consent, erasure)
- **NPHIES** (insurance claims FHIR)
- **CBAHI** (accreditation standards)
- **ZATCA** (VAT, e-invoicing Phase 2)
- **HIPAA-equivalent** (audit log, encryption at rest)

---

## 4. تدفق البيانات (Data Flow)

### 4.1 Reading patient chart
```
Browser → /api/{{DEPT_SLUG}}/patients/:id
  → Auth middleware (JWT + MFA)
  → Tenant middleware (extract tenant_id)
  → RBAC middleware (verify {{DEPT_SLUG}} read)
  → Audit middleware (log access)
  → Service: getPatient(id, tenant_id)
  → DB: SELECT * FROM patients WHERE id=? AND tenant_id=?
  → RLS check (defense in depth)
  → Return chart + history + notes
```

### 4.2 Creating assessment
```
Browser POST /api/{{DEPT_SLUG}}/assessments
  → Auth + Tenant + RBAC + Audit
  → JSON Schema validation
  → Service: createAssessment(input, user_id, tenant_id)
  → Engine: {{DEPT_SLUG}}_engine.assess(input)
  → DB INSERT (RLS enforces tenant_id)
  → Audit log (hash chained)
  → WebSocket emit (queue refresh)
  → Return 201
```

### 4.3 AI co-pilot query
```
Browser POST /api/ai/chat
  → Auth + Tenant + RBAC
  → Prompt registry lookup (versioned)
  → RAG: vector query → top 5 chunks
  → LangChain: chain([retrieve, prompt, model])
  → Model gateway: GPT-4 / Claude / Gemini / OSS
  → Cost tracker (token + cost)
  → Audit log
  → Return answer + sources + cost
```

---

## 5. النشر (Deployment)

### 5.1 Infrastructure
- **Hetzner CPX21** (4 GB, 2 vCPU) — app
- **Hetzner Storage Box** (1 TB) — backups
- **Cloudflare** (CDN, WAF, DNS)
- **PM2** (process manager)
- **Nginx** (reverse proxy, TLS)

### 5.2 CI/CD
- **GitHub Actions** (push to main → build → test → deploy)
- **Quality gates** (6 gates, fail-fast)
- **Blue-green** (zero-downtime)

---

## 6. الأمان (Security)

- **TLS 1.3** everywhere
- **JWT + MFA** (TOTP, FIDO2-ready)
- **RBAC** 7-tier (owner → viewer)
- **Tenant isolation** (RLS + middleware)
- **Encryption at rest** (AES-256)
- **CSP** report-only (default), enforce (after smoke)
- **PHI redaction** (logs)
- **Penetration test** (quarterly)

---

## 7. الأداء (Performance)

| Metric | Target | Measurement |
|---|---|---|
| API p50 | < 50ms | Prometheus |
| API p95 | < 200ms | Prometheus |
| API p99 | < 500ms | Prometheus |
| DB query p95 | < 100ms | pg_stat |
| Frontend FCP | < 1.5s | Lighthouse |
| LCP | < 2.5s | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |

---

## 8. المراقبة (Observability)

- **Logs:** Loki (structured JSON, no PHI)
- **Metrics:** Prometheus + Grafana
- **Traces:** OpenTelemetry → Jaeger
- **LLM:** token use, cost, latency (custom)
- **Audit:** hash-chained, queryable
- **Alerts:** PagerDuty (P0), email (P1), Slack (P2)

---

## 9. المخاطر (Risks)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| DB connection loss | Low | High | Connection pool + retry |
| LLM API down | Medium | Medium | OSS fallback (Ollama) |
| Tenant leak | Low | Critical | RLS + tests + audit |
| Token budget exceeded | High | Low | Per-tenant caps + alerts |
| Arabic LLM quality | Medium | Medium | Hybrid Whisper + GPT |

---

## 10. خارطة الطريق (Roadmap)

| Phase | Deliverable | ETA |
|---|---|---|
| W{{WAVE}} | Engine + Router + Migrations | Day 1-2 |
| W{{WAVE}}+1 | Frontend (5 pages) | Day 3 |
| W{{WAVE}}+2 | AI co-pilot + RAG | Day 4 |
| W{{WAVE}}+3 | QA gates + deploy | Day 5 |

---

> **Next:** [02_DATA_MODEL_AR.md](02_DATA_MODEL_AR.md) — ERD, tables, relationships.
