# NamaMedical — Global Medical Systems Research 2026
## مقارنة شاملة مع Epic / Cerner / Allscripts / MEDITECH / Athena / NextGen / InterSystems

> **آخر تحديث:** 2026-08-11
> **الغرض:** مرجع لأي قسم جديد يبني على أفضل ممارسات الصناعة.
> **المقارنة في 7 محاور:** Architecture, Modules, AI, Interop, Compliance, UX, Cost.

---

## 1. Epic Systems (USA, ~280M patients, 2,500+ hospitals)

### 1.1 Modules (40+)
| Module | Function | Our Equivalent |
|---|---|---|
| **Hyperspace** | Clinician UI (single-screen per role) | `frontend/detail.html` + app.js |
| **Canto** | iOS clinician | `mobile/` (PWA) |
| **MyChart** | Patient portal | `mynama/` |
| **Cadence** | Scheduling | `appointments/` engine |
| **Prelude** | Registration/ADT | `admissions/` engine |
| **Resolute HB/PB** | Hospital/Professional Billing | `billing/` + ZATCA |
| **Willow** | Pharmacy | `pharmacy/` engine |
| **Willow Ambulatory** | Retail pharmacy | `pharmacy_global_products_*.json` |
| **Beaker** | Lab | `lab/` engine |
| **Radiant** | Radiology | `radiology/` engine |
| **Cupid** | Cardiology | `cardiology/` engine |
| **OpTime** | Surgery | `surgery/` engine |
| **ASAP** | ER | `emergency/` engine |
| **Anesthesia** | Periop | `anesthesia/` engine |
| **Stork** | OB | `obstetrics/` engine |
| **Phoenix** | Transplant | `transplant/` engine |

### 1.2 AI (Cosmos + Deterioration Index)
- **Cosmos** (GPT-4-level medical LLM, 2024)
- **Deterioration Index** (early warning ML)
- **Sepsis Prediction Model** (real-time, AUC 0.85)
- **Best Practice Advisories (BPAs)**
- **Note Assist** (ambient scribe)
- **In Basket** (LLM-drafted responses)

### 1.3 Interop
- **FHIR R4** (full), **Bulk Data Access**
- **HL7v2** (full), **HL7v3 CDA**
- **X12** (837/835/270/271)
- **NCPDP** (SCRIPT for ePrescribe)
- **DICOM** (full PACS)
- **IHE** (PDQ, ATNA, XDS.b, XCA, XDR)

### 1.4 Compliance
- **HIPAA** (full, audit logs)
- **HITRUST CSF** certified
- **21st Century Cures Act** (information blocking, FHIR API mandates)
- **TEFCA** (Trusted Exchange Framework) — 2024

### 1.5 Lessons for NamaMedical
- ✅ Single-screen-per-role UI (we have it)
- ✅ Hash-chained audit log (we have it)
- ✅ Full RLS on every table (we have it)
- 🆕 Add **Bulk Data Access** FHIR endpoint
- 🆕 Add **TEFCA-style** nationwide query in NPHIES
- 🆕 Add **ambient scribe** (Arabic voice → SOAP)
- 🆕 Add **Best Practice Advisories (BPAs)** for high-risk orders

---

## 2. Cerner / Oracle Health (USA, ~250M patients)

### 2.1 Modules (Millennium)
| Module | Function | Our Equivalent |
|---|---|---|
| **PowerChart** | Clinician UI | `frontend/detail.html` |
| **FirstNet** | ER | `emergency/` |
| **PharmNet** | Pharmacy | `pharmacy/` |
| **RadNet** | Radiology | `radiology/` |
| **PathNet** | Lab | `lab/` |
| **CareNet** | Orders | `orders/` |
| **Discern Expert** | Rules engine | `clinical_decision_support/` |
| **Open Engine** | Custom logic (CCL) | JS engines |
| **HealtheIntent** | Population health | (TBD — `population_health/`) |
| **CareAware** | Device integration | (HL7 MLLP we have) |
| **Care Pathways** | Care plans | `careplans/` |

### 2.2 AI (Oracle Digital Assistant)
- **Digital Assistant** (chat, voice)
- **Clinical Digital Assistant** (ambient)
- **HIMSS Analytics** (benchmarking)
- **Discern Analytics** (operational)

### 2.3 Interop
- **FHIR R4** (full)
- **HL7v2** (full)
- **IHE PCD** (medical devices)
- **Open mHealth** (consumer)

### 2.4 Architecture
- **Cerner Command Language (CCL)** — proprietary scripting
- **Open Engine APIs** for extensibility
- **Millennium Platform** runs on Oracle Cloud / on-prem AIX/Linux

### 2.5 Lessons for NamaMedical
- ✅ Rules engine (Discern Expert equivalent — we have `clinical_decision_support/`)
- 🆕 Add **population health** module (risk stratification, registries)
- 🆕 Add **care pathways** (multi-disciplinary plans)
- 🆕 Add **device integration** (vital signs monitors, ventilators)

---

## 3. Allscripts / Veradigm

### 3.1 Suites
- **Sunrise** (acute care, ED, pharmacy, rad, lab)
- **TouchWorks** (ambulatory, large practices)
- **Professional** (small practices)
- **FollowMyHealth** (patient portal)
- **2bPrecise** (genomics)

### 3.2 AI
- **2bPrecise** (genomic decision support)
- **CarePort** (care transitions)

### 3.3 Interop
- **FHIR R4**
- **HL7v2**
- **API.AI** (NLP)

### 3.4 Lessons
- ✅ Strong ambulatory (we match)
- 🆕 Add **genomic decision support** for oncology (PGx we have)
- 🆕 Add **care transitions** (handoff, discharge summary)

---

## 4. MEDITECH (USA, ~250 hospitals)

### 4.1 Modules (Expanse)
- **Expanse EHR** (acute, ambulatory, ED, OR, rad, lab, pharmacy)
- **M-Health** (patient portal)
- **Expanse Now** (mobile, native)
- **NEMJ** (Expanse on cloud)
- **Genomics** (2024)

### 4.2 AI / Expanse
- **MEDITECH Expanse Ambient Listening**
- **Predictive Analytics** (readmission, sepsis)
- **Virtual Care** (telehealth)

### 4.3 Interop
- **FHIR R4**
- **HL7v2**
- **IHE**

### 4.4 Architecture
- **M-AT (Magic)** — proprietary 4GL
- **NEMJ Cloud** (AWS-hosted, since 2023)

### 4.5 Lessons
- ✅ Mobile-native (we have mynama PWA)
- 🆕 Add **telehealth** module
- 🆕 Add **readmission risk** model
- 🆕 Add **virtual nursing**

---

## 5. Athenahealth

### 5.1 athenaOne (cloud-native, ambulatory)
- **athenaClinicals** (EHR)
- **athenaCollector** (rules engine, billing)
- **athenaCommunicator** (patient portal)
- **athenaCoordinator** (orders)
- **athenaOne Mobile**

### 5.2 AI
- **Moments** (automated workflows)
- **Glow** (patient outreach)
- **Ambient Listening** (2024)

### 5.3 Lessons
- ✅ Best-in-class cloud workflow (we match with Node 20)
- 🆕 Add **automated workflow suggestions** (ML on user actions)
- 🆕 Add **proactive patient outreach** (vaccine reminders, follow-up)

---

## 6. NextGen

### 6.1 Modules
- **NextGen Enterprise EHR** (ambulatory, specialty)
- **Mirth Connect** (interop server) — open source!
- **NextGen Patient Portal**

### 6.2 Lessons
- 🆕 Add **Mirth Connect-compatible MLLP** (we have MLLP client)
- ✅ Strong specialty templates (we have 122 depts)

---

## 7. InterSystems TrakCare (UK, KSA, UAE)

### 7.1 Modules
- **TrakCare** (unified EHR, lab, rad, pharmacy, ED)
- **IRIS for Health** (data platform, FHIR, RAG-ready)
- **HealthShare** (HIE — health information exchange)
- **TrakCare Patient Portal**

### 7.2 AI
- **InterSystems AI** (vector search built-in — IRIS)
- **Clinical Reasoning** (rules)

### 7.3 Interop
- **FHIR R4**
- **HL7v2** (very strong — MLLP, LLP)
- **IHE XDS.b** (document sharing)
- **NPHIES-ready** (KSA already uses InterSystems)

### 7.4 Lessons
- 🆕 **IRIS for Health** pattern: combine transactional + vector + analytics in one DB. We could use PostgreSQL + pgvector for this (already have it).
- 🆕 **HIE (HealthShare)** = our future **NPHIES gateway** (cross-hospital exchange)
- ✅ Strong NPHIES integration in KSA (priority for us)

---

## 8. الأنظمة الإقليمية المهمة لـ KSA

| System | Org | Notes |
|---|---|---|
| **NPHIES** | CHI / NHIC | موحد التأمين الصحي، FHIR + HL7v2, **mandatory** |
| **Sehhaty** | MoH | Patient app، appointment booking، national ID |
| **Mawid** | MoH | Appointment central |
| **Anat** | MoH | Path lab results national repo |
| **SHEFA** | MoH | PHC family medicine |
| **PViMS** | SFDA | Pharmacovigilance، ADRs |
| **Saudi FDA** | SFDA | Medical devices, drugs, recall |
| **GAHIA (CHCS)** | CHI | Health insurance claims |
| **Tawakkalna** | NDMO | National ID, COVID pass |
| **Absher** | MoI | Civil status |
| **Yakeen** | MoI | National address |
| **Mudad** | GOSI | Employment, social insurance |

---

## 9. التوصيات النهائية (لـ NamaMedical)

### 9.1 Adopt from Epic
- ✅ Single-screen-per-role UI
- ✅ Ambient scribe (Arabic)
- 🆕 Best Practice Advisories (BPAs)
- 🆕 Bulk Data Access FHIR

### 9.2 Adopt from Cerner
- ✅ Discern-style rules engine
- 🆕 Population health + registries
- 🆕 Care pathways

### 9.3 Adopt from MEDITECH
- ✅ Native mobile (mynama)
- 🆕 Telehealth
- 🆕 Readmission risk

### 9.4 Adopt from Athena
- ✅ Cloud-native workflow
- 🆕 Proactive patient outreach
- 🆕 Workflow suggestion ML

### 9.5 Adopt from InterSystems
- ✅ Strong HL7v2 MLLP
- 🆕 Vector + transactional in one DB (pgvector!)
- 🆕 NPHIES gateway (national HIE)

### 9.6 NPHIES priorities (KSA)
- 🆕 Eligibility request (270)
- 🆕 Pre-auth (278)
- 🆕 Claim submission (837P/I/D)
- 🆕 Claim acknowledgment (277CA)
- 🆕 Remittance (835)
- 🆕 Attachment (275)

---

## 10. ملخص: أين NamaMedical بالمقارنة

| Capability | Epic | Cerner | MEDITECH | Athena | InterSystems | **NamaMedical** |
|---|---|---|---|---|---|---|
| Single-screen UI | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 122 depts | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| RLS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hash-chained audit | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ |
| AI ambient scribe | ✅ | ✅ | ✅ | ✅ | ⚠️ | 🆕 planned |
| RAG vector store | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ (pgvector) |
| LangChain-style chain | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| NPHIES native | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ |
| ZATCA native | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (KSA only) |
| CBAHI compliance | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |
| Telehealth | ✅ | ✅ | ✅ | ✅ | ✅ | 🆕 planned |
| Population health | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | 🆕 planned |
| Genomic DS | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | 🆕 (PGx we have) |
| Mobile native | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ PWA |
| i18n AR/EN/FR/UR | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| Cost (annual) | $$$$ | $$$$ | $$$ | $$$ | $$$ | **$** |

**Verdict:** NamaMedical = "KSA-native Epic-lite" with better AI, vector store, and lower cost.

---

> **Next step:** Use this doc as reference for each new department's EHR_BENCHMARK_AR.md and SYSTEM modules.
