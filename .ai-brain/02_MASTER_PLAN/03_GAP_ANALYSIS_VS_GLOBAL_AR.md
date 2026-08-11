# NamaMedical — Gap Analysis vs Global Systems V2
## مقارنة تفصيلية مع Epic / Cerner / Athena + خارطة طريق للإغلاق

> **آخر تحديث:** 2026-08-11
> **الهدف:** إغلاق الفجوات مع الأنظمة العالمية قبل live launch.

---

## 1. ملخص الفجوات (35 بند)

| # | Capability | Epic | Cerner | Athena | **NamaMedical** | Priority | ETA |
|---|---|---|---|---|---|---|---|
| 1 | Single-screen clinician UI | ✅ | ✅ | ✅ | ✅ (Stitch MD3) | — | done |
| 2 | Patient portal | ✅ | ✅ | ✅ | ✅ (mynama) | — | done |
| 3 | Mobile native | ✅ | ✅ | ✅ | ✅ (PWA) | — | done |
| 4 | RLS on every table | ✅ | ✅ | ✅ | ✅ (FORCE_RLS) | — | done |
| 5 | Hash-chained audit | ✅ | ✅ | ⚠️ | ✅ | — | done |
| 6 | i18n AR/EN/FR/UR | ⚠️ | ⚠️ | ⚠️ | ✅ | — | done |
| 7 | NPHIES integration | ⚠️ | ✅ | ⚠️ | ✅ (partial) | P0 | W14 |
| 8 | ZATCA Phase 2 | ❌ | ❌ | ❌ | ✅ | — | done |
| 9 | CBAHI accreditation | ⚠️ | ⚠️ | ⚠️ | ✅ (matrix) | P1 | W14 |
| 10 | PDPL compliance | ⚠️ | ⚠️ | ⚠️ | ✅ | — | done |
| 11 | HIPAA-grade security | ✅ | ✅ | ✅ | ✅ | — | done |
| 12 | HL7v2 MLLP gateway | ✅ | ✅ | ✅ | ✅ | — | done |
| 13 | FHIR R4 server | ✅ | ✅ | ✅ | ✅ (partial) | P0 | W14 |
| 14 | DICOM web (WADO-RS) | ✅ | ✅ | ✅ | ⚠️ (planned) | P1 | W14 |
| 15 | XDS.b document registry | ✅ | ✅ | ⚠️ | ⚠️ | P2 | post-launch |
| 16 | Best Practice Advisories | ✅ | ✅ | ⚠️ | ⚠️ | P1 | W14 |
| 17 | Discern-style rules engine | ✅ | ✅ | ⚠️ | ✅ (CDS) | — | done |
| 18 | Population health | ✅ | ✅ | ⚠️ | ⚠️ | P2 | post-launch |
| 19 | Care pathways | ✅ | ✅ | ⚠️ | ⚠️ | P2 | post-launch |
| 20 | Readmission risk ML | ✅ | ✅ | ✅ | ⚠️ | P2 | post-launch |
| 21 | Sepsis prediction ML | ✅ | ✅ | ✅ | ⚠️ | P2 | post-launch |
| 22 | Deterioration index | ✅ | ✅ | ⚠️ | ⚠️ | P2 | post-launch |
| 23 | Ambient scribe (voice→SOAP) | ✅ | ✅ | ✅ | ⚠️ | P0 | W14 |
| 24 | AI co-pilot (multi-model) | ✅ | ✅ | ✅ | ✅ (planned) | P0 | W14 |
| 25 | RAG over local content | ⚠️ | ✅ | ⚠️ | ✅ (pgvector) | — | done |
| 26 | LangChain-style orchestrator | ⚠️ | ⚠️ | ⚠️ | ✅ (planned) | P0 | W14 |
| 27 | Vector store (medical) | ⚠️ | ✅ | ⚠️ | ✅ (pgvector) | — | done |
| 28 | Prompt registry + versioning | ✅ | ✅ | ✅ | ⚠️ (planned) | P0 | W14 |
| 29 | LLM observability (token use) | ✅ | ✅ | ✅ | ⚠️ | P1 | W14 |
| 30 | Cost tracking (per dept) | ✅ | ✅ | ✅ | ✅ (planned) | P0 | W14 |
| 31 | Multi-model LLM gateway | ✅ | ✅ | ✅ | ⚠️ (planned) | P0 | W14 |
| 32 | Pharmacy global catalog | ✅ | ✅ | ✅ | ✅ (5000+) | — | done |
| 33 | Lab catalog (LOINC) | ✅ | ✅ | ✅ | ⚠️ (planned) | P1 | W14 |
| 34 | Radiology catalog (RadLex) | ✅ | ✅ | ✅ | ⚠️ (planned) | P1 | W14 |
| 35 | Genomic decision support | ✅ | ✅ | ⚠️ | ⚠️ (PGx we have) | P2 | post-launch |

**Status:** 10/35 done, 12/35 P0, 6/35 P1, 7/35 P2.

---

## 2. P0 — للإطلاق (قبل W14)

### 2.1 NPHIES Integration (P0)
- **Status:** Partial (eligibility, claim submission). Missing: pre-auth, remittance, attachments.
- **ETA:** 5 days (with sub-agent)
- **Files:** `engines/nphies_*.js`, `routers/nphies_*.js`, `migrations/`, OpenAPI, test plan
- **Owner:** Multi-agent (compliance + medical)

### 2.2 FHIR R4 Server (P0)
- **Status:** Partial (Patient, Observation, Condition). Missing: 12+ resources.
- **Resources needed:** AllergyIntolerance, MedicationRequest, Procedure, Immunization, DiagnosticReport, Encounter, Practitioner, Organization, Coverage, Claim, Bundle.
- **ETA:** 3 days

### 2.3 AI Ambient Scribe (P0)
- **Status:** Planned. Architecture = Whisper Arabic → LLM → SOAP note.
- **Components:** Audio capture, STT, LLM chain, structured output, physician approval.
- **ETA:** 4 days

### 2.4 AI Co-pilot (Multi-Model) (P0)
- **Status:** Partial. Missing: multi-model gateway (GPT-4, Claude, Gemini, OSS).
- **Components:** model router, prompt registry, token tracking, cost tracking, fallback chain.
- **ETA:** 3 days

### 2.5 LangChain-Style Orchestrator (P0)
- **Status:** Planned. Pure JS implementation (no external LangChain dep).
- **Components:** chain, sequential, branch, parallel, retry, fallback, observability.
- **ETA:** 2 days

### 2.6 Prompt Registry + Versioning (P0)
- **Status:** Planned.
- **Components:** registry table, version table, locale variants, A/B test, eval results.
- **ETA:** 1 day

### 2.7 Multi-Model LLM Gateway (P0)
- **Status:** Planned.
- **Components:** provider adapters (OpenAI, Anthropic, Google, local), rate limit, budget cap, observability.
- **ETA:** 2 days

### 2.8 Cost Tracking (P0)
- **Status:** Planned. Per-department, per-LLM, per-tenant cost dashboard.
- **Components:** cost_events table, hourly aggregation, dashboard, alerts.
- **ETA:** 1 day

### 2.9 AI Co-pilot Endpoints (P0)
- **POST /api/ai/chat** — chat
- **POST /api/ai/summarize** — chart summary
- **POST /api/ai/translate** — i18n
- **POST /api/ai/extract** — entity extraction
- **POST /api/ai/recommend** — order suggestions
- **POST /api/ai/coding** — ICD-10/CPT
- **ETA:** 2 days

---

## 3. P1 — للإطلاق بعد W14

### 3.1 DICOM WADO-RS (P1)
- PACS-lite, web-based image access
- Components: DICOM web endpoints, viewer, anonymization
- ETA: 5 days

### 3.2 Best Practice Advisories (BPAs) (P1)
- Rule engine that fires on order/result
- Components: rule DSL, alert UI, override tracking
- ETA: 3 days

### 3.3 LLM Observability (P1)
- Token use, latency, cost per call
- Components: traces, metrics, dashboards (Prometheus + Grafana)
- ETA: 2 days

### 3.4 Lab Catalog (LOINC) (P1)
- 50,000+ LOINC codes
- Components: catalog table, search API, mapping
- ETA: 2 days

### 3.5 Radiology Catalog (RadLex) (P1)
- 50,000+ RadLex terms
- Components: catalog table, search API, mapping
- ETA: 2 days

### 3.6 CBAHI Accreditation (P1)
- 6 chapters, 71 standards
- Components: self-assessment tool, evidence collection
- ETA: 3 days

---

## 4. P2 — بعد الإطلاق

- Population health + registries
- Care pathways
- Readmission risk ML
- Sepsis prediction ML
- Deterioration index
- Genomic decision support
- XDS.b document registry

---

## 5. Quick wins (this week)

1. **NPHIES pre-auth** (1 day, replaces manual faxes)
2. **FHIR Bundle support** (1 day, batch ops)
3. **Multi-model gateway** (2 days, drop in)
4. **Cost dashboard** (1 day, basic)
5. **AI co-pilot chat endpoint** (1 day, drop in)
6. **Ambient scribe v1** (3 days, Whisper + GPT)

---

## 6. Resources (sub-agent budget)

| Phase | Sub-agents | Tokens | ETA |
|---|---|---|---|
| P0 (NPHIES + FHIR + AI) | 8 | 240K | 7 days |
| P1 (DICOM + BPA + LLM obs) | 5 | 150K | 5 days |
| P2 (Pop health + ML) | 6 | 180K | 10 days |
| **Total** | **19** | **570K** | **22 days** |

---

## 7. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Token Plan exhaustion (V36/V37 lesson) | High | Use 1-2 file scope per sub-agent |
| NPHIES spec changes | Medium | Contract tests, version pinning |
| Multi-model API rate limit | Medium | Local OSS fallback (Ollama) |
| Arabic LLM quality (SttT, ambient) | Medium | Hybrid (Whisper for STT, GPT-4 for LLM) |
| DICOM data size | Low | Streaming, gzip, lazy load |

---

## 8. ملخص

- **35 capability gap** with global systems
- **10 already done** (single-screen UI, RLS, audit, i18n, ZATCA, PDPL, etc.)
- **12 P0** to close before live launch (15 days)
- **6 P1** to close after launch (3 weeks)
- **7 P2** for next version
- **Budget:** 570K tokens, 19 sub-agents, 22 days
- **Result:** Match Epic/Cerner depth with KSA-native advantages (ZATCA, NPHIES, PDPL, Arabic LLM)

---

> **Next step:** AUTOPILOT launches P0 multi-agent batches (W14 + AI + NPHIES).
