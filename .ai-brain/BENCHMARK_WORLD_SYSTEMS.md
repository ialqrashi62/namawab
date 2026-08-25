# Benchmark: NamaMedical vs World Systems

> Scale: 0–5 (0=absent, 5=market-leading). NM scores reflect VERIFIED repo state (engines exist ≠ production-proven integrations). Date: 2026-08-25.

## 1. Clinical Depth per Department (10 catalog sections)
| Catalog Section | Epic | Oracle Health (Cerner) | MEDITECH Expanse | athenahealth | InterSystems TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| Emergency & Trauma | 5 | 5 | 4 | 2 | 4 | 3 |
| Critical Care (ICU / NICU III-IV / Burn ICU) | 5 | 5 | 4 | 1 | 4 | 3 |
| Surgery / OR / Anesthesia | 5 | 5 | 4 | 1 | 4 | 3 |
| Cardiology & Cath Lab | 5 | 4 | 3 | 2 | 4 | 3 |
| Laboratory (Micro/Path/Blood Bank/Apheresis) | 5 | 5 | 4 | 2 | 4 | 3 |
| Imaging (IR / Nuclear Med PET / I-131) | 5 | 4 | 4 | 1 | 4 | 2 |
| Oncology / BMT / Transplant | 5 | 4 | 3 | 1 | 4 | 2 |
| Women's Health / OB / IVF-PGD Labs | 5 | 5 | 4 | 2 | 4 | 2 |
| Pharmacy & Medication Management | 5 | 5 | 4 | 3 | 4 | 2 |
| Chronic/Ambulatory (Dialysis/Rehab/Behavioral/Home) | 5 | 4 | 4 | 4 | 4 | 3 |

## 2. Interoperability
| Capability | Epic | Oracle Health | MEDITECH Expanse | athenahealth | TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| HL7v2 interface volume/maturity (ADT, ORM/ORU) | 5 | 5 | 5 | 4 | 4 | 3 |
| FHIR R4 API (USCDI-class resources) | 5 | 5 | 4 | 4 | 4 | 3 |
| C-CDA / CDA documents | 5 | 5 | 4 | 3 | 3 | 3 |
| National/regional network exchange | 5 (Care Everywhere) | 4 (CommonWell) | 4 | 4 (CommonWell) | 3 | 2 (NPHIES-only today) |
| Device interfaces (analyzers, monitors, DICOM MWL) | 5 | 5 | 4 | 2 | 4 | 2 (routers, no field-tested feeds) |
| Third-party app marketplace (SMART/Orion) | 5 (App Orchard/Connection Hub) | 4 (Code Marketplace) | 3 (Google alliance) | 4 (Partner Marketplace) | 3 | 1 |

## 3. Revenue Cycle
| Capability | Epic | Oracle Health | MEDITECH Expanse | athenahealth | TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| Claims scrubbing / edit-rule engine | 5 | 4 | 4 | 5 | 3 | 2 |
| ERA auto-posting (835-class) | 5 | 4 | 4 | 5 | 3 | 1 |
| Denial management workflows | 5 | 4 | 3 | 5 | 3 | 1 |
| Coding / HIM / CDI support | 4 | 4 | 4 | 4 | 3 | 2 |
| Payer contract modeling & analytics | 5 | 4 | 3 | 5 | 2 | 2 (BI export engine, stateless) |

## 4. Patient Engagement
| Capability | Epic | Oracle Health | MEDITECH Expanse | athenahealth | TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| Portal maturity (results, refills, messaging, proxy) | 5 (MyChart) | 4 | 4 | 4 (athenaOne app) | 3 | 1 (portal = known gap) |
| Telehealth visits | 5 | 4 | 4 | 4 | 3 | 0 |
| Remote patient monitoring ingestion | 4 | 3 | 3 | 3 | 2 | 1 |
| Self-scheduling & waitlist automation | 5 | 4 | 3 | 5 | 3 | 2 (partial) |
| Bilingual AR-first UI + native RTL | 3 (Arabic packs via partners) | 4 (KSA installs) | 2 | 1 | 3 | 5 |

## 5. AI Maturity
| Capability | Epic | Oracle Health | MEDITECH Expanse | athenahealth | TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| Embedded CDSS rule engine (BPA-class) | 5 | 4 | 4 | 4 | 3 | 2 (registry planned US-009, no persistence) |
| Predictive models (sepsis/deterioration/readmit) | 5 (Deterioration Index, sepsis model) | 4 | 3 | 4 (athenaIQ) | 3 | 1 |
| Ambient documentation (scribe) | 5 (Nuance DAX partnership) | 4 | 3 (Google) | 4 (ambient notes) | 2 | 0 |
| RAG / knowledge grounding | 3 | 3 | 2 | 2 | 3 | 2 (LangChain shim + deterministic fallback; pgvector NOT ingesting) |
| ML platform / data science enablement | 5 | 4 | 3 | 4 | 3 | 1 |

## 6. KSA Compliance Readiness
| Capability | Epic | Oracle Health | MEDITECH Expanse | athenahealth | TrakCare | NamaMedical |
|---|---|---|---|---|---|---|
| NPHIES (eligibility/claims/prior-auth) | 2 (partner-built) | 3 (installed base: SNG-H, NGHA) | 1 | 0 | 2 | 3 (client built; prod certification pending) |
| ZATCA Phase-2 e-invoicing (QR/CSID) | 2 (partner add-on) | 3 (local SI builds) | 1 | 0 | 2 | 3 (Phase-2 implemented; live certification pending) |
| PDPL privacy controls | 2 | 3 | 1 | 0 | 2 | 3 (checklists + RLS tenant isolation) |
| CBAHI/JCI quality & survey tooling | 3 (generic QM) | 3 | 2 | 1 | 2 | 2 (per-dept JCI/ISO/PDPL checklists documented) |
| Arabic-first UX / RTL parity | 3 | 4 | 2 | 1 | 3 | 5 |

## Where NamaMedical WINS
- **Bilingual-first**: EN|AR with native RTL flip across all modules; world systems treat Arabic as a localization pack.
- **KSA-native compliance**: NPHIES client, ZATCA Phase-2 invoicing, PDPL controls designed-in, not bolted on by regional SIs.
- **Modular tier architecture**: 1,400+ additive modules / 455+ engines deployable independently; monolith vendors ship on release trains.
- **Department blueprints in-repo**: 35 full (×35 files) + 27 compact specs = auditable build instructions per specialty; competitors hide logic in closed config.
- **Multi-tenant PostgreSQL with per-table RLS** from day one — rare among legacy HIS single-tenant installs.
- **Pure-function engine layer**: every clinical calculator unit-testable, deterministic fallback when AI layer degrades.
- **Module generation velocity**: autopilot/blueprint pipeline ships new departments in days vs vendor change-request cycles.

## Where World Systems Lead
- **Mature e-prescribing/EPCS**: SureScripts routing, DEA-compliant controlled substances, pharmacy benefit checks.
- **BCMA hardware integrations**: certified scanner/smart-pump/med-carousel ecosystems validated over decades.
- **Device interface libraries**: thousands of field-tested analyzer, monitor, and modality interfaces (Beaker/Radiant class).
- **Marketplaces & APIs**: SMART-on-FHIR app ecosystems with hundreds of third-party vendors.
- **Proven national-network exchange**: Care Everywhere/CommonWell production traffic at population scale.
- **Predictive AI shipped at scale**: validated deterioration/sepsis models running on millions of encounters daily.
- **Ambient documentation**: integrated scribe products with EHR write-back.
- **Global 24/7 support + certifications**: ONC/CE/regulatory attestations, SLA-backed follow-the-sun operations.

## Top 10 Prioritized Gaps (impact × effort)
| # | Gap | Impact | Effort |
|---|---|---|---|
| 1 | Wire pgvector ingestion pipeline + embed/backfill existing docs | High | Low |
| 2 | Patient portal MVP (results, appointments, invoices, AR toggle reuses RTL) | Very high | Medium |
| 3 | Persist CDSS rule registry (US-009) + surface alerts at order entry | High | Low-Med |
| 4 | EPCS/e-prescribing: formulary + drug-drug/allergy interaction DB | Very high | Medium |
| 5 | Claims scrubber rule engine + 835 ERA posting + denial queue | Very high | Medium-High |
| 6 | NPHIES sandbox→production certification run (eligibility + claim submission) | High | Medium |
| 7 | ZATCA production certification: invoice signing, QR, clearance round-trip | High | Medium |
| 8 | BCMA scan-validate-administer loop with handheld scanner SDK | High | Medium |
| 9 | Telehealth video visits (WebRTC) bound to scheduling + portal | High | Medium |
| 10 | Device interface framework: analyzer/monitor HL7 feeder harness + DICOM MWL | Very high | High |
