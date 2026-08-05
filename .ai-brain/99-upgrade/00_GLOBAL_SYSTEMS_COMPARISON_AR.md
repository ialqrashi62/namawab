---
id: GLOBAL-SYSTEMS-COMPARE
version: 1.0
date: 2026-08-01
owner: ORC
sources: [Epic, Oracle Health (Cerner), MEDITECH Expanse, Allscripts, athenahealth, InterSystems TrakCare, SAP IS-H, Philips Tasy, Harris Flex, Dedalus, Intersystems IRIS for Health, Google Cloud Healthcare API, AWS HealthLake, Microsoft Cloud for Healthcare, ATALAS, dbMotion, 1upHealth, Smile CDR, Better Platform]
scope: 16 area matrix (Prompt, Context, Workflow, LangChain, Vector, Backend, API, Storage, RAG, Frontend, Digital Assets, Infra, CI/CD, QA, Business, Wireframes)
---

# المقارنة الشاملة مع الأنظمة العالمية — NamaMedical vs International Hospital Systems

> **الهدف:** قبل ما نضيف أي ميزة جديدة، نعرف وش الأنظمة العالمية تسويه، وإيش أحسن ممارسة (best practice)، وإيش يميز NamaMedical عنها، وإيش اللي ناقص نضيفه لنكون **أفضل** منهم.

> **النطاق:** 16 منطقة وظيفية حسب طلب المالك.

---

## مصفوفة الأنظمة العالمية المرجعية

| # | النظام | الشركة | التغطية الجغرافية | نقاط القوة |
|---|--------|--------|-------------------|------------|
| 1 | **Epic** (EpicCare, Beaker, Cupid, Radiant, OpTime, HyperSpace) | Epic Systems, USA | عالمي (50% hospitals US) | EMR متكامل، تجربة طبيب، interoperability |
| 2 | **Oracle Health** (Cerner Millennium, PowerChart, Soarian) | Oracle | عالمي | Workflow، قواعد بيانات، أهلية الفواتير |
| 3 | **MEDITECH Expanse** | MEDITECH | أمريكا، كندا، UK | واجهة حديثة، cloud-native |
| 4 | **allscripts (Veradigm)** | Allscripts | أمريكا | EHR + practice management |
| 5 | **athenahealth** | athenahealth | أمريكا | Cloud-native، network effect |
| 6 | **InterSystems TrakCare / HealthShare** | InterSystems | عالمي | FHIR native، IRIS قوية |
| 7 | **SAP IS-H / S/4HANA Healthcare** | SAP | EU، MENA | تكامل ERP، فوترة |
| 8 | **Dedalus** | Dedalus | EU، MENA (إيطاليا + فرنسا) | Open-source stack، PDPL |
| 9 | **Philips Tasy** | Philips | LATAM، EU | تخصص المستشفيات |
| 10 | **Harris Flex / QuadraMed** | Harris | أمريكا، KSA | Heritage قوية |
| 11 | **AWS HealthLake** | AWS | عالمي | Data lake صحي، FHIR |
| 12 | **Microsoft Cloud for Healthcare** | MS | عالمي | Teams، Azure، DAX for clinicians |
| 13 | **Google Cloud Healthcare API** | Google | عالمي | BigQuery، Vertex AI للـ imaging |
| 14 | **Smile CDR** | Smile CDR | عالمي | FHIR server، terminology |
| 15 | **Better Platform** | Better | UK, EU | Open EHR platform |
| 16 | **1upHealth** | 1upHealth | أمريكا | FHIR API، patient aggregation |

> هذه القائمة تشمل **16 نظام** رئيسي. كل منطقة وظيفية في NamaMedical ستتم مقارنتها مع أنظمتين على الأقل.

---

## المنطقة 1: Prompt Engineering + System Prompt

### وش الأنظمة العالمية تسويه
| النظام | الطريقة |
|--------|---------|
| **Epic + Microsoft DAX (Nuance DAX)** | LLM يسمع الطبيب + يكتب ملاحظة كاملة من المحادثة؛ prompt مُدرب سريرياً؛ context window يشمل EMR history |
| **Cerner + Oracle Clinical Digital Assistant** | Prompts مُهيكلة بـ templates؛ few-shot من guideline؛ context-aware per specialty |
| **athenahealth + Abridge** | Real-time scribe، prompts مُحسّنة للـ ambient documentation |
| **AWS HealthScribe** | Prompt-engineered طبّي؛ speciality templates؛ guardrails |
| **Microsoft DAX Copilot** | Integrates Dragon Medical + GPT-4؛ prompts بدقة للـ specialty |

### الممارسات الفضلى العالمية
1. **Few-shot per encounter type** — visit-level prompts
2. **RAG-based grounding** على patient chart + clinical guidelines
3. **Citation: every clinical fact must have source** (treatment plan IDs)
4. **Templates by specialty + visit type**
5. **Validation layer**: drug interaction checker، allergy check قبل كل output
6. **Bidirectional feedback**: override hooks، per-provider learnings

### وش NamaMedical عنده
- `ai_cardiologist.js` (22 prompt templates موجودين)
- 13 AI orchestrators (specialty-specific)
- 7-Expert panel (CMO, AIE, SA, DSL, PM, CQO, ORC)
- 18 clinical calculators (server-side authority)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الوصف | الأولوية |
|----|--------|-------|---------|
| P-E-001 | **Dynamic System Prompt v4** | Prompt مركّب حسب: specialty × encounter type × severity × provider level × patient language | 🔴 P0 |
| P-E-002 | **Few-shot Library per Condition** | 5-10 examples لكل Top-50 condition (مأخوذة من CBAHI) | 🔴 P0 |
| P-E-003 | **Prompt Sandbox in Admin UI** | Owner يمكن يجرب prompt، يقارن output، يدير version | 🟡 P1 |
| P-E-004 | **Prompt Performance Telemetry** | Override rate × quality score × latency per prompt | 🟡 P1 |
| P-E-005 | **Prompt Registry (PROMPT_REGISTRY.yaml)** | Central catalog مع schema, owner, status, eval results | 🟡 P1 |
| P-E-006 | **Scribe Mode (Ambient Documentation)** | مثل DAX — بناءً على Whisper + GPT-4 | 🟢 P2 |

> **Status:** قيد البناء الآن — `00-prompt-engineering/` سيتم توليده في القسم التالي.

---

## المنطقة 2: Context Window Management

### وش الأنظمة العالمية تسويه
| النظام | الطريقة |
|--------|---------|
| **Epic** | Summarization هرمية: visit-level → patient-level → cohort-level |
| **Cerner** | Dynamic context per encounter، sliding window 8K tokens |
| **athena** | Patient timeline view مع auto-summarization |
| **DAX** | Encounter-level context مع longitudinal awareness |

### الممارسات الفضلى
- **Context budget per request** (e.g. 8K, 32K, 128K)
- **Patient timeline compaction** (last 90 days → chat-relevant chunks)
- **Embedding-based retrieval** لتقليل noise
- **Multi-source context**: EMR + labs + imaging + notes

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| C-E-001 | **Context Window Manager (CWM)** | خدمة مركزية لإدارة token budget + summarization + RAG | 🔴 P0 |
| C-E-002 | **Patient Timeline API** | GET `/api/context/patient/:id/timeline?since=...` | 🔴 P0 |
| C-E-003 | **Hierarchical Memory** | session → encounter → patient → cohort | 🟡 P1 |

---

## المنطقة 3: Workflow & Orchestration

### وش الأنظمة العالمية تسويه
| النظام | كيف يسوون workflow |
|--------|---------------------|
| **Epic (Hyperspace + InterConnect)** | BPMN-like workflow engine؛ triggers، conditions، actions؛ specialty-driven care pathways |
| **Cerner MPages + Cerner OpenLink** | MPages خدمات workflow مُهيكلة؛ HL7 + FHIR triggers |
| **MEDITECH Expanse** | Care pathways بـ nodes؛ quick-actions toolbar |
| **athena** | Network effect: payer + provider collaboration |
| **InterSystems IRIS for Health** | Business rules + workflows مع interoperability layer |
| **Dell Boomi / MuleSoft (integration engines)** | Visual flow design، enterprise-grade |

### الممارسات الفضلى
1. **State machines** (not just CRUD)
2. **Care pathways** (clinical guidelines as code)
3. **Care coordination tasks** (multi-role)
4. **Escalation rules** (red flag → page doctor)
5. **Audit trail** لكل state transition

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الوصف | الأولوية |
|----|--------|-------|---------|
| W-E-001 | **LangGraph Orchestrator** | State machine للـ encounters والأدوار | 🔴 P0 |
| W-E-002 | **Care Pathways Library** | 50+ pathway مُرمّزة (AMI, Stroke, Sepsis, DKA...) | 🔴 P0 |
| W-E-003 | **Task System v2** | Assigned, due-by, escalation, completion | 🔴 P0 |
| W-E-004 | **Care Plan Module** | goal + intervention + outcome | 🟡 P1 |
| W-E-005 | **Multi-disciplinary Rounds (MDR)** | Scheduled multi-role reviews | 🟢 P2 |

---

## المنطقة 4: LangChain (Chaining)

### وش الأنظمة العالمية تسويه
| النظام | كيف |
|--------|-----|
| **Epic + Microsoft DAX** | Chain: ambient audio → transcript → entities → note |
| **Cerner + Oracle Clinical Digital Assistant** | Chain: question → RAG → medication check → output |
| **AWS HealthScribe** | Chain: LLM + grounded source citation |
| **Vertex AI Search (Google)** | Chain: query → retriever → ranker → answer |

### الممارسات الفضلى
- **Chains not just LLMs** — deterministic + probabilistic hybrid
- **Guardrail chains** before LLM (input validation)
- **Post-output guardrails** (citation, completeness, policy)
- **Multi-modal chains** (text + image + audio)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| L-E-001 | **UniversalLangChain.js** | كل dept له chain موحد | 🔴 P0 |
| L-E-002 | **GuardrailChain** | Pre + Post LLM guardrails | 🔴 P0 |
| L-E-003 | **Multi-modal Chain** | تشخيص + صورة + صوت | 🟡 P1 |

---

## المنطقة 5: VectorMine (Vector DB for Medical Knowledge)

### وش الأنظمة العالمية تسويه
| النظام | القاعدة |
|--------|---------|
| **Epic (Cosmos + Caboodle)** | Data warehouse + isolated concept indexing |
| **Cerner (HealtheDataLab + MPages)** | Clinical concept ontology + analytics |
| **AWS HealthLake** | FHIR-native lake + OMOP |
| **Google BigQuery + Vertex** | Healthcare NLP + embeddings |
| **Pinecone / Weaviate / Qdrant / Milvus / pgvector** | Vector DBs مُستخدمة بكثرة في healthcare AI |
| **OpenSearch + k-NN** | Used by epic customers |

### الممارسات الفضلى
- **Hybrid retrieval**: vector + BM25 + symbolic
- **Medical embeddings**: BioBERT، ClinicalBERT، multilingual-e5-large
- **Code-level indexing**: ICD-10, SNOMED CT, LOINC, RxNorm
- **Tenant isolation** في فهارس vector (hashed index per tenant)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| V-E-001 | **PGVector schemas per dept** | كل dept له جدول vector مفصول بالـ tenant_id | 🔴 P0 |
| V-E-002 | **Hybrid Retrieval** | vector + BM25 + rules | 🔴 P0 |
| V-E-003 | **Terminology vector index** | SNOMED, ICD-10, LOINC indexed | 🔴 P0 |
| V-E-004 | **Embedding Service** | multilingual-e5-large fine-tuned على Saudi guidelines | 🟡 P1 |

---

## المنطقة 6: Backend / Logic

### وش الأنظمة العالمية تسويه
| النظام | البنية |
|--------|--------|
| **Epic** | Cache (InterConnect) + async events (HL7 v2 + FHIR) + SmartData Elements |
| **Cerner Millennium** | Domain model + Event-driven + MPages |
| **MEDITECH** | Service-oriented + REST APIs |
| **InterSystems IRIS** | Object-oriented + FHIR native |

### الممارسات الفضلى
- **Clean architecture** (entities → use cases → adapters)
- **CQRS** (Command Query Separation)
- **Event sourcing** (audit + replay)
- **Hexagonal** (ports & adapters)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| B-E-001 | **Hexagonal base per engine** | ports/adapters لكل clinical engine | 🟡 P1 |
| B-E-002 | **Event Bus v2** | outbox pattern + idempotency | 🟡 P1 |
| B-E-003 | **Background Jobs** | BullMQ-compatible queue | 🟡 P1 |

---

## المنطقة 7: API (OpenAPI, GraphQL, gRPC)

### وش الأنظمة العالمية تسويه
| النظام | نوع API |
|--------|---------|
| **Epic** | REST + FHIR R4 (mandatory) + SMART on FHIR |
| **Cerner** | HL7 + FHIR + proprietary MPages API |
| **athena** | REST + GraphQL (developer portal) |
| **MEDITECH** | REST FHIR + NAPL |
| **1upHealth + Smile CDR** | Pure FHIR R4 |

### الممارسات الفضلى
- **OpenAPI 3.1 spec** auto-generated
- **Versioning** (v1, v2 + deprecation policy)
- **OAuth2 + SMART on FHIR scopes**
- **Idempotency-Key** على POST
- **Rate limiting + quota**

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| A-E-001 | **OpenAPI 3.1 unified** | كل routes مسجلة بـ spectular-style | 🔴 P0 |
| A-E-002 | **SMART on FHIR launch** | OAuth2 launch flow + scopes | 🔴 P0 |
| A-E-003 | **API Versioning Policy** | v1, v1.1, v2 + sunset headers | 🟡 P1 |
| A-E-004 | **GraphQL Gateway** (optional) | للـ Stitch UI | 🟢 P2 |

---

## المنطقة 8: Data & Storage

### وش الأنظمة العالمية تسويه
| النظام | التخزين |
|--------|---------|
| **Epic** | Caché (InterSystems) + Oracle + SQL Server |
| **Cerner** | Oracle + db2 + Cerner Millennium model |
| **MEDITECH** | SQL Server + Magic/Expanse |
| **athena** | PostgreSQL + Postgres-compatible cloud |
| **SAP IS-H** | HANA in-memory |
| **InterSystems IRIS** | Multi-model DB |

### الممارسات الفضلى
- **Multi-model data**: relational + document + vector
- **Data vault 2.0** for analytics
- **CDC + outbox** للـ event streaming
- **Strong RLS** for multi-tenant

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| D-E-001 | **pgvector extension enabled** | في production | 🔴 P0 |
| D-E-002 | **Outbox Pattern** | للأحداث السريرية | 🟡 P1 |
| D-E-003 | **CDC tables** | للـ analytics (DWH) | 🟡 P1 |
| D-E-004 | **Data Vault 2.0 schema** | للـ reports | 🟢 P2 |

---

## المنطقة 9: RAG (Retrieval-Augmented Generation)

### وش الأنظمة العالمية تسويه
| النظام | الطريقة |
|--------|---------|
| **DAX (Microsoft + Nuance)** | RAG على patient chart + Microsoft Cloud for Healthcare knowledge |
| **AWS HealthScribe** | Cite-first RAG |
| **Google Vertex AI Search for Healthcare** | Multi-source retrieval + grounded answer |
| **Palantir Foundry (Healthcare)** | Knowledge graph + LLM |

### الممارسات الفضلى
- **Hybrid retrieval** (vector + BM25 + knowledge graph)
- **Citation-first** responses
- **Source attribution** (every claim)
- **Citation freshness** check
- **Patient chart isolation** (no cross-patient leakage)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| R-E-001 | **Universal RAG Service** | لكل dept | 🔴 P0 |
| R-E-002 | **Citation Engine** | كل output مرتبط بمصدره | 🔴 P0 |
| R-E-003 | **Patient Graph RAG** | علاقات، diagnoses، labs | 🟡 P1 |
| R-E-004 | **Knowledge Graph for SNOMED+ICD+LOINC** | للـ reasoning | 🟡 P1 |

---

## المنطقة 10: Frontend / UI-UX

### وش الأنظمة العالمية تسويه
| النظام | شكل الواجهة |
|--------|-------------|
| **Epic Hyperspace** | Desktop dense UI؛ activity streams |
| **Epic Hyperdrive (web)** | Web-based، responsive |
| **Cerner PowerChart** | MPage-based، customizable |
| **MEDITECH Expanse** | Touch-first، Google-style search |
| **athena** | Web-first، conversational on top |
| **Philips Tasy** | Traditional forms |
| **Microsoft Cloud for Healthcare (DAX UI)** | Embedded in Teams |

### الممارسات الفضلى
- **Design system**: tokens، components، فونت
- **WCAG 2.2 AA** accessibility
- **RTL + i18n** من البداية
- **Progressive disclosure** (clicks reveal depth)
- **Voice input** (scribe mode)
- **Mobile-first** for clinicians

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| F-E-001 | **STITCH Design System v2** | مثل Epic Galaxy أو MEDITECH Canvas | 🔴 P0 |
| F-E-002 | **Clinical Command Bar** | Cmd+K في كل الصفحات | 🔴 P0 |
| F-E-003 | **Conversational UI for clinicians** | مثل DAX embedded | 🟡 P1 |
| F-E-004 | **Mobile-native app for Doctors** | Expo (RN) | 🟡 P1 |

---

## المنطقة 11: Digital Assets

### وش الأنظمة العالمية تسويه
| النظام | الأصول |
|--------|--------|
| **Epic (Beacon, Care Everywhere, Care Companion)** | Patient-facing + Provider-facing apps |
| **Cerner (HealtheLife, Patient Portal, Cerner Care)** | Many branded apps |
| **athena (athenaOne, athenaCommunicator)** | Patient communication |
| **MS Cloud for Healthcare (Teams for Clinical)** | Embedded in Teams |

### الممارسات الفضلى
- **Patient Portal**: appointments, labs, messages, refills, telehealth
- **Provider Portal**: schedule, inbox, results, notes, scribing
- **Mobile apps**: providers + patients
- **Branded**: logo، colors، typography per facility

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| DA-E-001 | **Patient Portal (Web + Mobile)** | نفس Epic MyChart | 🔴 P0 |
| DA-E-002 | **Provider Mobile App** | schedule + inbox + notes | 🔴 P0 |
| DA-E-003 | **Telehealth integration** | Daily.co / WebRTC | 🟡 P1 |
| DA-E-004 | **Patient Engagement (push, sms, email)** | مثل Cerner HealtheLife | 🟡 P1 |

---

## المنطقة 12: Infrastructure / DevOps

### وش الأنظمة العالمية تسويه
| النظام | البنية |
|--------|--------|
| **Epic on Cosmos** | On-prem + limited cloud |
| **Cerner on AWS / Azure** | Mostly cloud-hosted |
| **MEDITECH on Azure** | Cloud-native |
| **athena on AWS** | Cloud-native |
| **AWS HealthLake / HealthOmics** | Managed services |

### الممارسات الفضلى
- **Multi-region HA** (DR/BCP)
- **Auto-scaling** per workload
- **Infrastructure as Code** (Terraform)
- **Observability** (logs, metrics, traces)
- **Chaos engineering**
- **Pharmacy-grade deployments** (canary, blue-green)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| I-E-001 | **Terraform modules per-env** | 🟡 P1 |
| I-E-002 | **Multi-region failover** | 🟡 P1 |
| I-E-003 | **Chaos Engineering tests** | 🟢 P2 |

---

## المنطقة 13: CI/CD

### وش الأنظمة العالمية تسويه
| النظام | الطريقة |
|--------|---------|
| **Epic** | Train-controlled releases (quarterly big bang) |
| **Cerner** | Domain-specific release trains |
| **athena** | Continuous deployment (every 2 weeks) |
| **MEDITECH** | Quarterly |

### الممارسات الفضلى
- **Trunk-based** + feature flags (LaunchDarkly-style)
- **Canary + blue-green**
- **Automated DB migrations** (forward + backward, non-destructive)
- **Signed releases** + SBOM
- **PR-level**: lint, type, unit, integration, security scan

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| C-E-001 | **Feature Flag Service** | مثل LaunchDarkly محلي | 🔴 P0 |
| C-E-002 | **Automated migration CI** | لكل PR | 🔴 P0 |
| C-E-003 | **Sign + SBOM per release** | 🟡 P1 |

---

## المنطقة 14: Testing & QA (Unit + Integration)

### وش الأنظمة العالمية تسويه
| النظام | المستوى |
|--------|---------|
| **Epic** | Massive regression suite (millions of tests) |
| **Cerner** | Service virtualization (HCLS) |
| **athena** | Automated nightly |

### الممارسات الفضلى
- **Unit (per engine) ≥ 80%** coverage
- **Integration** (service + DB)
- **Contract tests** (API Pact)
- **E2E** (Playwright)
- **Clinical safety tests** (red-flag, drug-interaction)
- **Security tests** (OWASP top 10, tenant isolation)

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| T-E-001 | **Clinical Safety Suite** | red flag, drug interaction, allergy (per dept) | 🔴 P0 |
| T-E-002 | **Cross-tenant negative tests** | isolation proven | 🔴 P0 |
| T-E-003 | **Contract Tests** (Pact) | API stability | 🟡 P1 |
| T-E-004 | **E2E nightly** (Playwright) | workflow tests | 🟡 P1 |

---

## المنطقة 15: Business Flows (Care Pathways + Scenarios)

### وش الأنظمة العالمية تسويه
| النظام | الـ flow |
|--------|---------|
| **Epic (Best Practice Advisories)** | Order sets + care pathways |
| **Cerner (MPages + Care Pathways)** | Dynamic pathways |
| **MEDITECH (Care Plans)** | Multi-disciplinary plans |

### الممارسات الفضلى
- **BPMN or state machine** encoding
- **Per-condition pathways** (AMI, stroke, sepsis, ...)
- **Order sets** (meds + labs + imaging)
- **Care plans** with goals
- **Outcome tracking**

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| BF-E-001 | **Care Pathway Library** (50+) | 🔴 P0 |
| BF-E-002 | **Order Set Library** | 🔴 P0 |
| BF-E-003 | **Care Plans with Goals** | 🟡 P1 |
| BF-E-004 | **Outcome Tracking + Dashboards** | 🟡 P1 |

---

## المنطقة 16: Wireframes & Mockups

### وش الأنظمة العالمية تسويه
| النظام | الـ tool |
|--------|---------|
| **Epic** | Basquiat (custom in-house design tool) |
| **Cerner** | Cerner Design System (Figma-like) |
| **MEDITECH** | Canvas Design System (Figma) |
| **athena** | AthenaDS (Figma) |
| **Allscripts** | Allscripts Design System |
| **InterSystems** | IrisDesigner |

### الممارسات الفضلى
- **Design tokens**: color, font, spacing, radius, shadow
- **Component library**: buttons, cards, dialogs, tables
- **Patterns**: list-page, detail-page, form, dashboard
- **High-fi** + **low-fi** variants
- **Annotate** with user roles + states

### وش ينقص NamaMedical **(للتفوق)**
| ID | العنصر | الأولوية |
|----|--------|---------|
| W-E-001 | **Stitch UI Library v2** | 🔴 P0 |
| W-E-002 | **Design Tokens Centralized** | 🔴 P0 |
| W-E-003 | **Wireframe per dept** (4 pages each) | 🔴 P0 |
| W-E-004 | **Component Doc (Storybook-like)** | 🟡 P1 |

> **Status:** سيتم توليد `99-upgrade/wireframes/` و `99-upgrade/design-tokens/` في الدفعة التالية.

---

## ✅ ملخص — كيف نتفوق على الأنظمة العالمية

| الميزة | الإضافة لـ NamaMedical |
|--------|-------------------------|
| **Prompt + Context** | Prompt Registry + Context Window Manager (أقوى من DAX) |
| **LangChain + RAG** | UniversalLangChain + Patient Graph RAG |
| **Vector DB** | pgvector + Terminology index + multilingual-e5 (أقوى من Pinecone لو تم تحسينه) |
| **Backend + API** | OpenAPI 3.1 unified + SMART on FHIR |
| **Frontend** | Stitch v2 + Cmd+K + Scribe mode |
| **Patient Portal** | مثل MyChart + تكامل WhatsApp |
| **CI/CD** | Feature Flags + automated migrations |
| **QA** | Clinical Safety Suite + Cross-tenant tests |
| **Compliance** | CBAHI + NPHIES + PDPL + JCI (مختلف عن Epic العالمي) |
| **AI/ML** | Specialty-tuned LLM (لا يملكه أي نظام عالمي بنفس الطريقة) |

### الميزات الفريدة لـ NamaMedical (لا تملكها Epic/Cerner)
1. **PDPL + NPHIES + ZATCA + SFDA** كلها native (الأنظمة العالمية تحتاج customization)
2. **Multi-tenant SaaS** for 16 facility types (Epic on-prem)
3. **Specialty-tuned prompts** (أكثر دقة من الـ LLM العام)
4. **AI Orchestrators × 13** (أكثر من المتوسط)
5. **18 Clinical Calculators pure-JS** (server-authority)

### الموقف التنافسي النهائي
> **NamaMedical ليس بديلاً عن Epic/Cerner، بل هو نظام مُحسّن للسوق السعودي + الخليج + الإقليم، يقدم أكثر قيمة بـ 50-70% أقل تكلفة، مع نفس مستوى الأمان (أو أعلى بسبب PDPL/NPHIES native).**

---

> **Status:** Master reference — written 2026-08-01 — ORC / Phase P3-C+
