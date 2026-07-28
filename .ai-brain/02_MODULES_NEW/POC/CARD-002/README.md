<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: CARD-002
name: "Interventional Cardiology (Cath Lab + Structural Heart)"
parent: "Cardiology"
code: CARD
generated: 2026-07-24
loop_status: "L1 DRAFT (pending L2 critique → L3 refine → L4 validate)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
catalog_ref: ".ai-brain/01_DATA/CATALOG.yaml:14"
context_brief_ref: ".ai-brain/02_MODULES_NEW/POC/_ORC/CONTEXT_BRIEFS.md#section-1"
snippets_ref: ".ai-brain/02_MODULES_NEW/POC/_ORC/SNIPPETS.md"
---

# Interventional Cardiology — CARD-002

## Mission
Complete, AI-augmented, compliance-first interventional cardiology module: cath lab procedures (diagnostic angiography, PCI, structural heart, CHIP), D2B pathway optimization, Structural Heart MDT (Heart Team), SFDA-registered DES tracking, radiation dose logging, NPHIES/ZATCA billing, 8 LangChain chains, bilingual (EN+AR) cath lab station.

## Scope (in-scope)
Diagnostic coronary angiography (FFR, IVUS, OCT); PCI with DES implant; CHIP (rotablation, orbital atherectomy, thrombus aspiration); MCS (IABP, Impella, VA-ECMO); structural heart (TAVR, MitraClip, Watchman, PFO/ASD closure); endomyocardial biopsy; radial/femoral access; sheath removal; ACT monitoring; high-alert anticoagulant double-check; radiation dose tracking; CIN risk + contrast limit; D2B timer (≤90 min, ACC/AHA 2023); Structural Heart MDT (Heart Team); NPHIES cardiac procedure bundles + ZATCA e-invoicing; SFDA stent registry; 8 LangChain / LangGraph chains; bilingual (EN + AR) cath lab station.

## Scope (out-of-scope)
Non-invasive imaging (echo, CT-coronary, CMR) → CARD-001; EP studies/ablation → EP-001; full ACHD program; pediatric cath lab; open cardiac surgery (CTS-001); hybrid OR shared only.

## Top 10 Conditions (CMO)
| # | Condition | ICD-10 | Pathway | Red flag |
|---|-----------|--------|---------|----------|
| 1 | STEMI anterior (LAD) | I21.0 | Primary PCI ≤90 min | YES |
| 2 | STEMI inferior (RCA) | I21.1 | Primary PCI ≤90 min | YES |
| 3 | NSTEMI | I21.4 | Risk-stratify → cath 24-72h | NO (high-risk → YES) |
| 4 | Unstable angina | I20.0 | Early invasive | NO |
| 5 | Cardiogenic shock | R57.0 | MCS (Impella/ECMO) + PCI | YES |
| 6 | Severe aortic stenosis | I35.0 | TAVR MDT → procedure | NO (syncope/CHF → YES) |
| 7 | Severe mitral regurgitation | I34.0 | MitraClip MDT → TEER | NO (papillary rupture → YES) |
| 8 | AF (LAA) | I48.91 | Watchman LAA closure | NO |
| 9 | HOCM | I42.1 | Alcohol septal ablation | NO |
| 10 | Cardiac tamponade | I23.* | Stat pericardiocentesis | YES |

## Top 20 Procedures (CPT)
Diagnostic angiography 93454 · PCI 92928 · DES 92928+C9600 · FFR 93571 · IVUS 92978 · OCT 92978 alt · Rotablation 92996 · Orbital atherectomy 92997 · Thrombus aspiration 92973 · IABP 33967 · Impella 33990 · VA-ECMO 33946 · TAVR 33361-33365 · MitraClip 33418-33419 · Watchman 33340 · PFO closure 93580 · ASD closure 93580 alt · Alcohol septal ablation 93583 · Endomyocardial biopsy 93505 · Mechanical thrombectomy 37195.

## Critical Time Targets
| Target | Goal | Source | Audit |
|--------|------|--------|-------|
| D2B | ≤90 min | ACC/AHA 2023 | `cath.door_to_balloon` |
| FMC-to-device | ≤120 min | ACC/AHA 2023 | `cath.fmc_to_device` |
| Lab activation | ≤30 min | ACC/AHA 2023 | `cath.lab_activated` |
| Radial access | ≤45 min | SCAI 2021 | `cath.access_established` |
| DAPT loading | ≤30 min | ESC 2023 | `cath.dapt_loaded` |
| TAVR MDT→procedure | ≤30 d | ACC/AHA 2020 | `cath.tavr_mdt_to_procedure` |
| MDT turnaround | ≤14 d | CBAHI | `cath.mdt_turnaround` |
| NPHIES preauth | ≤48 h | NPHIES | `cath.nphies_preauth` |

## AI Decision Support (AIE)
PCI risk stratifier (SYNTAX/GRACE/TIMI); MDT summarizer; CIN risk predictor; DAPT decision support; Radial vs Femoral advisor; STEMI activation triage; Cath report generator (EN+AR); Discharge summary (AR 5th-grade). See `01_rag_chains.md` + `03_llm_prompts.md`.

## FHIR (R4)
Reads: Patient, Observation (vitals/labs/ECG), Condition, Procedure, MedicationStatement (DAPT), AllergyIntolerance (contrast).
Writes: Encounter (IMP/AMB), Procedure (CPT), Observation (ACT, hemodynamics), DiagnosticReport (cath/MDT letter), MedicationStatement.
Profiles: `procedure-pci`, `procedure-tavr`, `diagnostic-report-cath`, `observation-act`.
Provenance: `Provenance.agent.type = "assembler"` when AI-assisted.

## Compliance (CQO)
- JCI 7th Ed: ACC, COP, MMU, QPS, MOI, PCI, SQE
- CBAHI: cardiac + structural heart program
- NPHIES: PCI/TAVR DRG
- ZATCA: procedure billing + VAT
- PDPL: 7y general, 10y imaging, **lifetime for implants** (stent, TAVR, MitraClip, Watchman)
- SFDA: DES registry, contrast
- HIPAA-aligned: 164.312 (a/b/e)

## Safety Rails (DSL — 13 universal + 4 dept-specific)
Universal: see `$ref: SNIPPETS.md#SNIP-01`.
Dept-specific gates:
1. **High-alert anticoagulant gate** (UFH, bivalirudin, enoxaparin, GP IIb/IIIa) — 2-RN independent double-check + 5-rights + witness
2. **Stent implant gate** — operator + assistant cosign + SFDA UDI scan
3. **Structural Heart MDT gate** — Heart Team sign-off BEFORE scheduling (no individual override)
4. **DAPT loading gate** — 2-MD + 1-RN + 1-pharmacist
Plus **Golden Access Rule** per `$ref: SNIPPETS.md#SNIP-05`.

## Database (12 tables, RLS-forced)
`cardiac_cath_procedures` · `pci_records` · `stent_registry` · `structural_heart_mdt` · `tavr_workup` · `cath_lab_scheduling` · `contrast_tracking` · `radiation_dose_log` · `cath_lab_equipment` · `cath_lab_red_flags` · `cath_audit_log` · `cath_consent`. All: RLS + FORCE RLS, `tenant_id` NOT NULL, soft-delete only.

## API Endpoints (23, base `/api/v1/cath-lab`)
POST `/procedures` (idempotent) · GET `/procedures` · GET `/procedures/:id` · PATCH `/procedures/:id` · POST `/procedures/:id/complete` · GET `/patient/:id/history` · POST `/pci-records` · POST `/stent-registry` (idempotent) · GET `/stent-registry/patient/:id` · GET/POST `/structural-heart/referrals` · GET/PATCH `/structural-heart/mdt/:id` · POST `/tavr-workup` · POST `/door-to-balloon-timer` (idempotent) · GET `/door-to-balloon-timer/kpi` · POST `/radiation-dose` (idempotent) · GET `/radiation-dose/operator/:id` · POST `/contrast-tracking` · GET `/patient/:id/cin-risk` · GET `/scheduling/conflicts` · POST `/red-flag/acknowledge` · POST `/consent/sign` (idempotent) · GET `/equipment/:id/availability`.

## UI/UX (Stitch Layout C)
Top: Patient header (sticky, encrypted MRN) + D2B timer + red flag banner. LEFT: Patient summary + prior cath (DICOM) + SYNTAX/GRACE/TIMI. CENTER: Procedure timeline + DICOM viewer + hemodynamics. RIGHT: Live vitals + ACT + anticoagulation + red flags.

## Tests
10 unit (engine) + 23 integration (supertest) + 8 E2E (Gherkin+Playwright) + 12 clinical safety.

## 8 LangChain Chains
pci_risk_stratifier · structural_heart_mdt_summarizer · cin_risk_predictor · dapt_decision_support · radial_vs_femoral_access_advisor · stemi_activation_triage · cath_report_generator · discharge_summary. See `01_rag_chains.md`.

## 12 Red Flags
STEMI · cardiogenic shock · tamponade · aortic dissection · cath perforation · CIN · stent thrombosis · BARC 3-5 bleed · radiation dermatitis · contrast anaphylaxis · vascular access complication · air embolism. See `04_clinical_red_flags.md`.

## Sub-Departments
Cath Lab 1 (biplane) · Cath Lab 2 (single-plane) · Hybrid OR · Structural Heart Suite · Recovery (6 beds).

## Sign-off (L1 DRAFT)
| Expert | Status |
|--------|--------|
| CMO/AIE/SA/DSL/PM/CQO | L1 DRAFT (pending L2 critique) |
| ORC | **L1 DRAFT COMPLETE** — ready for L2_CRITIQUE |

---
*L1 DRAFT. Owner: CARD-002 ORC subagent. Generated 2026-07-24.*
