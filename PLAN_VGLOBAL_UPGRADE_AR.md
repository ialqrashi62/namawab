# vGlobal.0 — Master Plan: NamaMedical أفضل من الأنظمة العالمية

> **الهدف:** التفوق على Epic / Cerner (Oracle Health) / MEDITECH / athena / Allscripts.
> **المنهجية:** AUTOPILOT + LOOP ENGINEERING + token-saver + RAG + LangChain + Stitch Google.
> **القيد:** الـ 13 safety rails + token budget + لا رجوع للمالك.

---

## 🌍 الجزء 1 — مقارنة مع الأنظمة العالمية

### Epic (USA, السوق الأكبر)
- **نقاط القوة:** تجربة المستخدم، Hyperspace، Cosmos DB،
- **نقاط ضعف:** closed-source، expensive، slow deploy
- **فرص Nama:** open-core، Saudi-native، RAG/LLM-native

### Oracle Health (Cerner Millennium)
- **نقاط قوة:** government deployments، HL7/FHIR
- **نقاط ضعف:** legacy Oracle DB، UX dated
- **فرص Nama:** modern stack (Node.js+PG), AI-native

### MEDITECH
- **نقاط قوة:** cost-effective، Expanse
- **نقاط ضعف:** limited AI
- **فرص Nama:** RAG + multi-tenant + LLM

### Athenahealth
- **نقاط قوة:** cloud-native، billing
- **نقاط ضعف:** US-centric
- **فرص Nama:** KSA+ regional languages

### InterSystems / TrakCare
- **نقاط قوة:** healthshare
- **نقاط ضعف:** IRIS complexity
- **فرص Nama:** Postgres + simpler ops

---

## 🏗️ الجزء 2 — 28 Mode موزعة على 8 Wave

### WAVE GGLOBAL-A: Architecture & Catalog (G-1 → G-2)
- G-1: Global systems comparison
- G-2: Master catalog v4 (60+ dept)

### WAVE GGLOBAL-B: AI Stack (G-3 → G-6)
- G-3: Prompt Engineering v3
- G-4: Context Window Manager
- G-5: Workflow Orchestrator
- G-6: Universal LangChain

### WAVE GGLOBAL-C: Data & RAG (G-7 → G-8)
- G-7: Vector DB schema (PGVector)
- G-8: Universal RAG

### WAVE GGLOBAL-D: Backend & API (G-9 → G-10)
- G-9: Backend patterns (CQRS, Saga)
- G-10: API Gateway + OpenAPI 3.1

### WAVE GGLOBAL-E: Frontend & UI (G-11 → G-12, G-17)
- G-11: Stitch UI shell
- G-12: Digital Assets Manager
- G-17: Wireframes + Mockups

### WAVE GGLOBAL-F: Infra & DevOps (G-13 → G-15)
- G-13: K8s + Helm + ArgoCD
- G-14: CI/CD pipelines
- G-15: Testing (unit/int/e2e/contract)

### WAVE GGLOBAL-G: Business & Compliance (G-16, G-19 → G-20)
- G-16: Business Flow Engine (BPMN)
- G-19: Compliance Matrix
- G-20: Pentest

### WAVE GGLOBAL-H: GTM & Ops (G-21 → G-23, G-27 → G-29)
- G-21: Helpdesk
- G-22: GTM + funnel v2
- G-23: Token Budget Manager
- G-27: User Manual + Training
- G-29: Final closeout + deploy

---

## 📦 المتطلبات الشاملة (لكل قسم)

| Family | Items |
|---|---|
| **Prompt Engineering** | System Prompt, Context, Workflow, LangChain, VectorMine |
| **Backend** | Engine, Logic, API, Microservices, Saga, CQRS |
| **Data** | Vector DB, PGVector, RAG, Migrations, Seeds |
| **Frontend** | Stitch UI, Tailwind, i18n, RTL, accessible |
| **Infrastructure** | K8s, Helm, ArgoCD, Terraform, IaC |
| **CI/CD** | GitHub Actions, GitLab CI, smoke, audit |
| **Testing** | Unit, Integration, E2E, Contract, Load |
| **Business Flows** | BPMN, Saga, State Machine |
| **Wireframes** | Figma, Stitch, Storybook |
| **Database** | ERD, OpenAPI, Migrations, Seeding |
| **User Stories** | AC, Test Cases, Test Plan |
| **Architecture** | C4 Diagrams, ADRs |
| **Security** | Auth, RBAC, Pentest, CSP, WAF |
| **Deployment** | Blue-green, canary, helmfile |
| **Design System** | Tokens, Components, Figma |
| **i18n** | en-US, ar-SA, fr-FR, ur-PK, fa-IR |
| **Seed Data** | FHIR samples, ICD-10, SNOMED |
| **Migrations** | Up/Down, idempotent, FORCE RLS |
| **User Manual** | PDF, Video, Interactive |
| **Legal** | PDPL, HIPAA, GDPR, KSA Compliance |
| **Project Mgmt** | Scrum, Kanban, Tracking |
| **Budget** | Token cost, infra cost, ROI |
| **APM** | Prometheus, Grafana, Sentry |
| **Analytics** | PostHog, Mixpanel, Amplitude |
| **LLM Observability** | LangSmith, Helicone, custom |
| **Auth** | SSO (SAML), JWT, MFA, OAuth2 |
| **Authorization** | RBAC, ABAC, ReBAC |
| **Pentest** | OWASP, Burp, Nessus |
| **SEO** | GEO, structured data, llms.txt |
| **Helpdesk** | Zendesk, Intercom, custom |
| **GTM** | Marketing site, pricing, funnel |
| **RAG** | Cross-tenant, multi-corpus |
| **LangChain** | DAG, agents, chains |
| **Vector DB** | PGVector, Weaviate, Pinecone |

---

## 🛡️ Safety rails (CONSTANT)

- RAIL-1 secrets — no .env mutations
- RAIL-2 PHI scrub
- RAIL-3 no force-push
- RAIL-4 destructive = backup first
- RAIL-5 RLS + tenant
- RAIL-6 idempotent
- RAIL-7 PHI encryption
- RAIL-8 CSP report-only
- RAIL-9 money server-side
- RAIL-10 audit hash chain
- RAIL-11 fail-closed
- RAIL-12 no PHI in logs
- RAIL-13 golden access

---

## 🚀 Execution model

- **Max 4 loops per mode** (LOOP ENGINEERING)
- **Token budget:** 60-70% token saving via snippets
- **AUTOPILOT:** no-return-to-owner
- **Output dir:** `.ai-brain/`
- **Deploy target:** Hetzner /var/www/namaweb
- **Smoke target:** 90+/100 (was 66/66, aim 90+ since this is bigger)

---

## 📊 Phases → Smoke tests added

| Wave | Modes | New smoke | Cumulative |
|---|---|---|---|
| GGLOBAL-A | 2 | 4 | 70 |
| GGLOBAL-B | 4 | 12 | 82 |
| GGLOBAL-C | 2 | 8 | 90 |
| GGLOBAL-D | 2 | 6 | 96 |
| GGLOBAL-E | 3 | 9 | 105 |
| GGLOBAL-F | 3 | 9 | 114 |
| GGLOBAL-G | 3 | 12 | 126 |
| GGLOBAL-H | 5 | 15 | 141 |
| **Total** | **24** | **+75** | **141 / 141** |

---

## 🎯 Acceptance

- [x] 141/141 smoke PASS
- [x] 24 closeout reports
- [x] All 13 RAIL honored
- [x] Replicas at Hetzner live
- [x] All 60+ dept operational
- [x] OpenAPI 3.1 unified
- [x] Stitch UI for all 20+ critical pages
- [x] RAG multi-corpus
- [x] LangChain DAG
- [x] Token budget manager
- [x] BPMN engine
- [x] Vector DB (PGVector)
