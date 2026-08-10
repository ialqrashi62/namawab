# GLOBAL MEDICAL SYSTEMS BENCHMARK — Feature parity matrix
**Last updated:** 2026-08-10  
**Purpose:** Map every world-class hospital system feature to our blueprint + status

---

## How to read this matrix

For each world-class system column (Epic / Cerner / MEDITECH / athena / Philips / Allscripts / Siemens / GE / InterSystems / Nuance / Epic ecosystem apps), we list **what they do**, **which NamaMedical department blueprint covers it**, and **status (✅ done / 🟡 partial / ⏳ planned / ❌ not started)**.

---

## A. EMR + Clinical (Epic, Cerner, MEDITECH)

| Feature | Epic | Cerner | MEDITECH | athena | NamaMedical |
|---|---|---|---|---|---|
| Unified patient chart | ✅ EpicCare | ✅ PowerChart | ✅ Expanse | ✅ athenaClinicals | ✅ `02_MODULES/DEP-001..DEP-060/` |
| Orders + results | ✅ | ✅ | ✅ OM | ✅ | ✅ clinicalOrderCreate, labOrderCreate, radOrderCreate |
| Clinical notes | ✅ | ✅ | ✅ PCI | ✅ | ✅ clinicalNoteUpsert, clinicalNoteLock |
| Problem list | ✅ | ✅ | ✅ | ✅ | ✅ clinicalProblemListCreate |
| Medication reconciliation | ✅ | ✅ | ✅ | ✅ | ✅ clinicalMedicationReconciliationCreate |
| E-prescribing | ✅ | ✅ | ✅ | ✅ | ✅ prescriptionCreate, wasfatyDispenseIntent |
| Clinical decision support | ✅ | ✅ | ✅ | ✅ | ✅ clinicalSafetyCheck, cds-hooks |
| Care plans | ✅ | ✅ | ✅ | ✅ | ✅ careplans |
| Nursing assessments | ✅ | ✅ NUR | ✅ | ✅ | ✅ nursingRiskAssessmentCreate, nursingAssessmentCreate |
| I&O tracking | ✅ | ✅ | ✅ | ✅ | ✅ nursingIoCreate |
| Pain assessment | ✅ | ✅ | ✅ | ✅ | ✅ nursingPainAssessmentCreate |
| Triage | ✅ | ✅ | ✅ | ✅ | ✅ nursingTriageCreate |
| Handover | ✅ | ✅ | ✅ | ✅ | ✅ nursingHandoverCreate |
| Vitals | ✅ | ✅ | ✅ | ✅ | ✅ nursingVitalsCreate, ewsAssess |
| eMAR / BCMA | ✅ | ✅ | ✅ | ✅ | ✅ emarOrderCreate, marAdminister |
| Allergy check | ✅ | ✅ | ✅ | ✅ | ✅ allergyCheck |
| Drug-interaction check | ✅ | ✅ | ✅ | ✅ | ✅ drugInteractionsCheck |

## B. Surgery + Anesthesia (Epic OpTime, Cerner SurgiNet, Picis)

| Feature | Epic | Cerner | Picis | NamaMedical |
|---|---|---|---|---|
| OR scheduling | ✅ OpTime | ✅ SurgiNet | ✅ | ✅ `surgeryCreate`, `orSlotReserve` |
| Pre-op checklist | ✅ | ✅ | ✅ | ✅ `surgeryPreopUpsert`, `surgeryPreopTestCreate` |
| Anesthesia record | ✅ | ✅ | ✅ | ✅ `surgeryAnesthesiaUpsert` |
| WHO surgical safety checklist | ✅ | ✅ | ✅ | ✅ `orWhoChecklist` |
| PACU | ✅ | ✅ | ✅ | ✅ `orPacuUpsert` |
| Operative note | ✅ | ✅ | ✅ | ✅ `orOperativeNoteUpsert` |
| OR slot management | ✅ | ✅ | ✅ | ✅ `orSlotReserve`, `orSlotCancel`, `orSurgeryStatusUpdate` |
| Surgeon + anesthesiologist scheduling | ✅ | ✅ | ✅ | ✅ `surgeryCreate` (surgeon_id, urgency) |
| Equipment tracking | ✅ | ✅ | ✅ | ✅ `cssdInstrumentSetCreate`, `cssdCycleCreate` |
| Implant tracking | ✅ | ✅ | ✅ | ✅ `cssdBatchCreate` |

## C. Pharmacy (Epic Willow, Cerner PharmNet, DoseEdge)

| Feature | Epic | Cerner | DoseEdge | NamaMedical |
|---|---|---|---|---|
| Outpatient pharmacy | ✅ Willow | ✅ PharmNet | ✅ | ✅ `pharmacyDrugCreate`, `pharmacyQueueUpdate` |
| Inpatient pharmacy | ✅ | ✅ | ✅ | ✅ `pharmacyQueueVerify`, `pharmacyDispense` |
| Wasfaty (Saudi e-prescribing) | n/a | n/a | n/a | ✅ `pharmacyWasfatyDispenseIntent` |
| Controlled substance log | ✅ | ✅ | ✅ | ✅ `controlledSubstanceReconcile`, `controlledSubstanceDispense` |
| Stock deduction | ✅ | ✅ | ✅ | ✅ `pharmacyDeductStock` |
| Drug-interaction check | ✅ | ✅ | ✅ | ✅ `drugInteractionsCheck` |
| Prescription create | ✅ | ✅ | ✅ | ✅ `pharmacyPrescriptionCreate`, `prescriptionCreate` |

## D. Laboratory (Epic Beaker, Cerner PathNet, SCC SoftLab)

| Feature | Epic | Cerner | SCC | NamaMedical |
|---|---|---|---|---|
| Order entry | ✅ Beaker | ✅ PathNet | ✅ | ✅ `labOrderCreate`, `labOrderDirectCreate`, `labOrderUpdate` |
| Specimen tracking | ✅ | ✅ | ✅ | ✅ `labSampleCreate`, `labSampleTransition` |
| Result entry | ✅ | ✅ | ✅ | ✅ `labResultCreate` |
| Critical callback | ✅ | ✅ | ✅ | ✅ `labResultCriticalCallback` |
| HL7 ingest | ✅ | ✅ | ✅ | ✅ `labHl7Ingest` |
| QC | ✅ | ✅ | ✅ | ✅ `labQcCreate` |
| Microbiology | ✅ | ✅ | ✅ | ✅ `labMicrobiologyCreate` |
| Verify/report | ✅ | ✅ | ✅ | ✅ `labResultVerify`, `labResultReport` |

## E. Radiology (Epic Radiant, Cerner RadNet, Sectra, Philips)

| Feature | Epic | Cerner | Sectra | Philips | NamaMedical |
|---|---|---|---|---|---|
| Order entry | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyOrderCreate`, `radiologyOrderUpdate` |
| Worklist | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyWorklistCreate`, `radiologyWorklistStateUpdate` |
| DICOM study upload | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyDicomStudyCreate` |
| Report creation | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyReportCreate` |
| Critical notify | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyReportCriticalNotify` |
| Sign report | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyReportSign` |
| Addendum | ✅ | ✅ | ✅ | ✅ | ✅ `radiologyReportAddendum` |
| PACS integration | ✅ | ✅ | ✅ | ✅ | ✅ `phi_vault/` + Orthanc sandbox |

## F. Oncology (Epic Beacon, Flatiron, Varian)

| Feature | Epic | Flatiron | Varian | NamaMedical |
|---|---|---|---|---|
| Regimen library | ✅ Beacon | ✅ | ✅ | ✅ `oncologyRegimenCreate` |
| Cycle management | ✅ | ✅ | ✅ | ✅ `oncologyRegimenCreate` (cycle_number) |
| Genomics integration | ✅ | ✅ | n/a | ✅ `ai-oncology-genomics` |
| Tumor board | ✅ | ✅ | ✅ | 🟡 plan in `DEP-048` |

## G. OB/GYN + Peds (Epic Stork, Epic Care Every Woman)

| Feature | Epic Stork | NamaMedical |
|---|---|---|
| Pregnancy tracking | ✅ | ✅ `ob_engine.js`, `obgyn_peds_wave3_engine.js` |
| Fetal monitoring | ✅ | ✅ `ai-obgyn-peds-fetal` |
| Delivery record | ✅ | ✅ `ob_engine.js` |
| Neonatal assessment | ✅ | ✅ `ai-obgyn-peds-neonatal` |
| Pediatric growth charts | ✅ | ✅ `pediatric_subspecialties/` |

## H. Emergency (Epic ASAP, Cerner FirstNet)

| Feature | Epic ASAP | Cerner FirstNet | NamaMedical |
|---|---|---|---|
| Triage | ✅ | ✅ | ✅ `erTriage` |
| Provider assignment | ✅ | ✅ | ✅ `erAssignProvider` |
| Disposition | ✅ | ✅ | ✅ `erDisposition` |
| Trauma assessment | ✅ | ✅ | ✅ `emergencyTraumaAssessmentCreate` |

## I. Cardiology (Epic Cupid, Muse)

| Feature | Epic | NamaMedical |
|---|---|---|
| ECG analysis (AI) | ✅ Cupid | ✅ `ai-cardiology-analyze-ecg` |
| HF risk prediction | ✅ | ✅ `ai-cardiology-predict-hf` |
| Cath report | ✅ | ✅ `cardiologyCathReportCreate` |
| Echo | ✅ | ✅ `cardiologyEcgCreate`, `cardiologyProcedureCreate` |

## J. Critical Care (Epic ICG, Philips eICU)

| Feature | Epic | Philips | NamaMedical |
|---|---|---|---|
| ICU scoring | ✅ | ✅ | ✅ `icu_scoring.js` (APACHE, SOFA, qSOFA) |
| Early warning | ✅ | ✅ | ✅ `ews_engine.js` |
| Ventilator optimization (AI) | ✅ | ✅ | ✅ `ai-critical-optimize-vent` |
| Deterioration prediction (AI) | ✅ | ✅ | ✅ `ai-critical-predict-det` |

## K. Billing + RCM (Epic Resolute, Cerner Soarian, athenaCollector, Waystar, R1)

| Feature | Epic | Cerner | athena | Waystar | R1 | NamaMedical |
|---|---|---|---|---|---|---|
| Charge capture | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `invoiceCreate` |
| Claim generation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `insuranceClaimCreate` |
| Claim submission | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `nphiesClaimSubmit`, `insuranceClaimTransitionUpdate` |
| Remittance posting | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `nphiesRemittanceCreate`, `nphiesRemittancePostToAr` |
| Denial management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `insuranceDenialAppealUpdate` |
| Pre-auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `insurancePreAuthCreate` |
| Eligibility | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `insuranceEligibilityCreate` |
| Payer pricing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `insurancePayerPricingCreate` |
| AR / AP | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `financeArCreate`, `financeArCollect`, `financeApCreate`, `financeApPay` |
| Daily close | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `financeDailyClose` |
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ `financeReportGenerate` |

## L. Patient portal + Engagement (Epic MyChart, athenaCommunicator, FollowMyHealth)

| Feature | Epic | athena | NamaMedical |
|---|---|---|---|
| Patient portal accounts | ✅ MyChart | ✅ | ✅ `portalUserCreate` |
| Appointment booking | ✅ | ✅ | ✅ `portalAppointmentUpdate` |
| Secure messaging | ✅ | ✅ | ✅ `portalMessageCreate`, `messageCreate` |
| Lab results release | ✅ | ✅ | ✅ (via standard message) |
| Visit summaries | ✅ | ✅ | 🟡 `medicalReportCreate` |
| Telehealth | ✅ | ✅ | ✅ `telemedicineSessionCreate`, `telemedicineSessionUpdate` |
| Bill pay | ✅ | ✅ | ✅ `invoicePay` |
| Family access | ✅ | ✅ | 🟡 plan in `portalUserCreate` (role-based) |

## M. AI Orchestrators (Nuance Dragon, Epic AI, IBM Watson Health)

| Feature | Epic AI | Nuance | IBM Watson | NamaMedical |
|---|---|---|---|---|
| Voice dictation | ✅ | ✅ Dragon | ✅ | ✅ `voiceDictationStart`, `voiceDictationFinalize` |
| Ambient scribe | ✅ | ✅ DAX | ✅ | � planned |
| ECG AI | ✅ | n/a | ✅ | ✅ `ai-cardiology-analyze-ecg` |
| Imaging AI | ✅ | n/a | ✅ | ✅ `ai-diagnostics-scan` |
| Genomic AI | ✅ | n/a | ✅ | ✅ `ai-oncology-genomics` |
| Antibiotic suggestion | ✅ | n/a | ✅ | ✅ `ai-infectious-antibiotic` |
| Surgical recovery prediction | ✅ | n/a | ✅ | ✅ `ai-surgery-recovery`, `ai-surgery-report` |

## N. Integration (InterSystems HealthShare, Mirth Connect, Rhapsody)

| Feature | InterSystems | Mirth | NamaMedical |
|---|---|---|---|
| FHIR R4 server | ✅ | n/a | ✅ `nm-fhir-bridge/` |
| HL7 v2 ingestion | ✅ | ✅ | ✅ `hl7MessageSend`, `labHl7Ingest` |
| Cross-org HIE | ✅ | n/a | 🟡 FHIR ready, HIE pilot Q1 2027 |

## O. Quality + Safety (Epic Quality, Press Ganey, NDNQI)

| Feature | Epic | Press Ganey | NamaMedical |
|---|---|---|---|
| Incident reporting | ✅ | ✅ | ✅ `qualityIncidentCreate`, `ovrIncidentCreate` |
| CAPA | ✅ | ✅ | ✅ `qualityCapaCreate`, `qualityCapaUpdate` |
| Risk register | ✅ | ✅ | ✅ `qualityRiskCreate` |
| Satisfaction | ✅ | ✅ | ✅ `qualitySatisfactionCreate` |
| KPIs | ✅ | ✅ | ✅ `qualityKpiCreate` |

## P. Compliance (Saudi-specific)

| Feature | Required | NamaMedical |
|---|---|---|
| **ZATCA Phase 2 (e-invoicing)** | ✅ | ✅ `zatca_submit_fail_closed_guard_test.js`, `zatcaGenerate`, `zatcaCreditNote`, `zatcaCreditNoteSubmit` |
| **NPHIES (insurance clearinghouse)** | ✅ | ✅ `nphies_*` routes |
| **CBAHI OVR (hospital accreditation)** | ✅ | 🟡 code-level ready, audit pending |
| **PDPL (data privacy)** | ✅ | ✅ `crypto_envelope.js`, RBAC + tenant isolation |
| **SFDA (drug safety)** | ✅ | 🟡 partial via pharmacy flows |
| **MOH reporting** | ✅ | 🟡 partial |

## Q. RAG + Vector (LangChain, Pinecone, Weaviate)

| Feature | LangChain | Pinecone | NamaMedical |
|---|---|---|---|
| Clinical Q&A RAG | ✅ | ✅ | ✅ `nm-rag-vector-mine/`, `nm-vector-rag-v2/` |
| Drug-interaction RAG | ✅ | ✅ | ✅ |
| SOP lookup | ✅ | ✅ | ✅ |
| Vector DB (pgvector) | ✅ | ✅ | ✅ `nm-vector-rag-v2/` |
| Embeddings pipeline | ✅ | ✅ | ✅ `nm-prompt-engineering/` |

## R. Admin + Ops

| Feature | Epic | NamaMedical |
|---|---|---|
| User management | ✅ | ✅ `settingsUserCreate`, `settingsUserUpdate` |
| Department admin | ✅ | ✅ `clinicalDepartmentUpsert` |
| Templates | ✅ | ✅ `clinicalTemplateCreate`, `clinicalSmartTemplateUpsert` |
| Audit trail (hash-chained) | ✅ | ✅ `audit_middleware.js` |
| Facility entitlement | ✅ | ✅ `facility-catalog.js` |

---

## Summary scorecard

| World-class system | Coverage |
|---|---|
| Epic (full ecosystem) | **~92%** |
| Cerner Millennium | **~90%** |
| MEDITECH Expanse | **~88%** |
| athenaOne | **~85%** |
| Philips IntelliSpace | **~80%** (radiology + ICU covered) |
| InterSystems HealthShare | **~75%** (FHIR server ready, HIE pilot pending) |
| Nuance Dragon | **~70%** (voice-dictation done, ambient scribe pending) |
| ZATCA + NPHIES (Saudi) | **~95%** (code ready, prod CSID pending) |

**Top 5 gaps to close in 2026 Q4:**
1. Ambient AI scribe (DAX-equivalent)
2. HIE cross-org FHIR exchange
3. Patient visit summaries
4. Family portal access (RBAC)
5. Tumor board module
