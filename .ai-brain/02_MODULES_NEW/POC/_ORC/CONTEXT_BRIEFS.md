<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NamaMedical POC — Context Briefs (ORC Consolidated)

> **Audience:** L1_DRAFT agents generating 35-file modules for CARD-002, NEPH-002, ER-002.
> **Source:** Consolidated from 3 Explore subagent briefs (2026-07-24) + cross-cutting ORC analysis.
> **Goal:** Provide clinical, AI, architecture, UX, compliance context for POC generation.
> **Total tables to add:** 39 (CARD=12, NEPH=13, ER=14). Target FORCE_RLS count: 189 (was 150).
> **Total endpoints to add:** 71 (CARD=23, NEPH=26, ER=22).

---

## Section 1: CARD-002 — Interventional Cardiology

### 1.1 Reference catalog

- **Template:** `.ai-brain/02_MODULES/ER-001/` (35 files, L4-validated).
- **Catalog:** `.ai-brain/01_DATA/CATALOG.yaml:14` → `{id: CARD-002, name: "Interventional Cardiology", parent: "Cardiology", code: CARD}`.
- **Existing engines (Pure JS):**
  - `namaweb/engines/cardiology_engine.js` — `calculateHFRisk`, `validateECGInterpretation`, `calculateContrastLimit`.
  - `namaweb/engines/interventional_cardiology_engine.js` — `calculateD2BTime`, `assessCINRisk`, `analyzeStentPressure`.
  - `namaweb/cardiology_integration_test.js` — 5 HTTP tests.
  - `namaweb/public/js/modules/interventional_cardiology_ui.js` — Material 3 dark Cath Lab UI (ICUI namespace).
- **Sidebar gap:** No dedicated Cath Lab section (covered via Doctor Station #3, Emergency #21).
- **Existing references:** `docs/openapi/cardiology.yaml`, `docs/erd/cardiology.dbml` (with `cardio_cath_cases`), `docs/seeders/cardiology_seed.sql`, `docs/i18n/cardiology.{en,ar}.json`, `docs/tests/cardiology_test_plan.md` (CD-001 to CD-020), `docs/bpmn/cardiology_stemi.bpmn`.

### 1.2 Clinical (CMO)

**Top 10 conditions:** STEMI anterior (I21.0) / STEMI inferior (I21.1) / NSTEMI (I21.4) / Unstable angina (I20.0) / Cardiogenic shock (R57.0) / Severe aortic stenosis (I35.0) / Severe mitral regurgitation (I34.0) / AF (I48.91) / HOCM (I42.1) / Cardiac tamponade (I23.*).

**Top 20 procedures (CPT):** Diagnostic coronary angiography (93454), PCI with stenting (92928), DES (92928+C9600), FFR (93571), IVUS (92978), OCT (92978 alt), Rotablation (92996), Orbital atherectomy (92997), Thrombus aspiration (92973), IABP (33967), Impella (33990), VA-ECMO (33946), TAVR (33361-33364), MitraClip (33418-33419), Watchman (33340), PFO closure (93580), ASD closure (93580 alt), Alcohol septal ablation (93583), Endomyocardial biopsy (93505).

**Red flags (12):** STEMI / Cardiogenic shock / Cardiac tamponade / Aortic dissection / Cath perforation / CIN / Stent thrombosis / Major bleeding with anticoagulation (BARC 3-5) / Radiation dermatitis / Anaphylaxis to contrast / Vascular access complication / Air embolism.

**Time target:** Door-to-balloon ≤90 min (ACC/AHA 2023 STEMI guideline, reaffirmed 2025).

**High-alert drugs:** UFH, bivalirudin, enoxaparin, GP IIb/IIIa inhibitors, aspirin, P2Y12 inhibitors (ticagrelor, clopidogrel, prasugrel), warfarin, DOACs — require 2-RN independent double-check + 5-rights + witness signature.

**Structural Heart MDT (Heart Team):** Interventional cardiologist, cardiac surgeon, HF cardiologist, cardiac imager, anesthesiologist, vascular surgeon, geriatrician, nurse coordinator, admin/finance.

### 1.3 AI / RAG (AIE)

- **LLM:** Primary `gpt-4o` / `claude-3.5-sonnet`; fallback `med-llama-70b`; rule-based `namaweb/cath_lab_engine.js` is safety floor.
- **Vector store:** PGVector 768d, `MedEmbed-768d`, chunk 512t/64overlap, hybrid (BM25 0.3 + vector 0.5 + KG 0.2).
- **Source corpora:** ACC/AHA 2023 STEMI, 2024 NSTE-ACS, 2020 TAVR, 2024 Valvular, 2023 Chronic Coronary, 2023 AF; SCAI 2021 Best Practices, 2023 PCI in Shock, 2024 Radiation Safety; ESC 2023 ACS, 2021 Valvular, 2020 AF; TAVR trials (PARTNER 2/3, Evolut, NOTION); MitraClip trials (COAPT, MITRA-FR); institutional protocols; local antibiogram + formulary.
- **PII redaction BEFORE external LLM.**
- **8 LangChain/LangGraph chains:** PCI Risk Stratification (SYNTAX/GRACE/TIMI), Structural Heart MDT Summarizer, CIN Risk Predictor, DAPT Decision Support (DAPT/PRECISE-DAPT/CRUSADE), Radial vs Femoral Access Advisor, STEMI Activation Triage (auto-trigger), Cath Report Generator, Discharge Summary + Consent Summary (AR 5th-grade).
- **Few-shot examples:** PCI report (LAD mid 99% → DES 3.0×18 → 0% residual TIMI 3), MDT TAVR letter (82F, AVA 0.7, STS 4.2%, frail → TF TAVR recommended), AR consent summary.

### 1.4 Architecture (SA)

**12 tables to create:** `cardiac_cath_procedures`, `pci_records`, `stent_registry` (SFDA-tracked), `structural_heart_mdt`, `tavr_workup`, `cath_lab_scheduling`, `contrast_tracking`, `radiation_dose_log` (per-staff + per-procedure), `cath_lab_equipment`, `cath_lab_red_flags`, `cath_audit_log` (hash-chained), `cath_consent`.

**23 endpoints (base `/api/v1/cath-lab`):** POST/GET `/procedures`, GET/PATCH `/procedures/:id`, POST `/procedures/:id/complete`, GET `/patient/:id/history`, POST `/pci-records`, POST `/stent-registry`, GET `/stent-registry/patient/:id`, GET/POST `/structural-heart/{referrals,mdt}`, PATCH `/structural-heart/mdt/:id`, POST `/tavr-workup`, POST `/door-to-balloon-timer`, GET `/door-to-balloon-timer/kpi`, POST/GET `/radiation-dose`, POST `/contrast-tracking`, GET `/patient/:id/cin-risk`, GET `/scheduling/conflicts`, POST `/red-flag/acknowledge`, POST `/consent/sign`, GET `/equipment/:id/availability`.

**Middleware chain:** `authenticate, requireTenantScope, corsWithAllowlist, rateLimit({requests:200, period:'1m'}), auditMiddleware` then per-route `requireRole, validateBody(RS.cathLab.cathProcedure), idempotencyGuard (money routes only)`.

**Idempotency on:** `/procedures` (billing), `/stent-registry` (SFDA), `/consent/sign` (NPHIES pre-auth). NOT on clinical reads.

### 1.5 UX / Stitch (PM)

**Personas:** Interventional Cardiologist, Cath Lab RN (moderate sedation), Structural Heart Coordinator, CVT/RT, QA.

**3-column Stitch station:** Left = patient + prior cath + score calc; Center = procedure timeline + DICOM viewer + hemodynamics; Right = vitals + ACT (target 250-300s) + anticoagulation + red flags.

**User stories (5-7):**
1. Interventional cardiologist wants prior cath images and stent details before re-do PCI.
2. Cath lab nurse wants ACT + sheath removal checklist one-tap.
3. Structural heart coordinator wants MDT calendar + NPHIES pre-auth status.
4. QA wants D2B compliance dashboard per operator.
5. CVT wants radiation dose log per case.

**i18n keys (dept-specific):** `cath.d2b_timer`, `cath.activate_stemi`, `cath.fluoro_min`, `cath.contrast_ml`, `cath.syntax`, `cath.pci_done`, `cath.access.radial-r/femoral-r`, `cath.mdt.decision`, `cath.stent_implanted`, `cath.dapt_duration` + 20 more.

### 1.6 Compliance (CQO)

- **JCI 7th Ed:** ACC (access to care for STEMI), COP (care plans, time-bound), MMU (high-alert anticoagulants), QPS (door-to-balloon KPI), MOI (audit), PCI (infection), SQE (operator credentials).
- **CBAHI:** cardiac program standards, structural heart program accreditation.
- **NPHIES:** cardiac procedure bundles (PCI, TAVR DRG mapping).
- **ZATCA:** procedure billing with VAT.
- **PDPL:** 7y retention, 10y imaging, lifetime for implanted devices.
- **SFDA:** drug-eluting stent registry, contrast media.
- **HIPAA:** 164.312 (a/b/e).
- **Required audit events:** `cath.door_to_balloon`, `cath.contrast_volume`, `cath.radiation_dose`, `cath.mdt_decision`, `cath.consent_signed`, `cath.stent_implanted`, `cath.activation.triggered`.

### 1.7 Engine — `namaweb/cath_lab_engine.js` (NEW, 10 functions)

1. `calculateD2BTime(doorTime, balloonTime)` — minutes + compliance status (optimal ≤90).
2. `syntaxScore(vesselTree)` — 0-65 score; risk band (low/med/high).
3. `graceScore(age, hr, sbp, cr, killip, stDev, cardiacArrest)` — 0-263; mortality risk.
4. `timiScoreStemi(8 vars)` — 0-14; 30-day mortality.
5. `assessCINRisk(gfr, contrastVolumeMl, age, diabetes)` — low/mod/high.
6. `actTargetCheck(current, targetLow=250, targetHigh=300)` — in-range / out-of-range.
7. `sheathRemovalChecklist(activatedClottingTime, bpStable, hematomaChecked, distalPulseChecked)` — all 4 must be true.
8. `contrastLimit(eGFR, weight)` — max mL = 3 × eGFR, capped at 400.
9. `radiationDoseAlert(fluoroMin, dapGyCm2, kermaMgy)` — 60min/500Gy/5Gy thresholds.
10. `stentExpansionPressure(pressureAtm)` — ≥14 atm = optimal.

---

## Section 2: NEPH-002 — Renal Transplantation

### 2.1 Reference catalog

- **Template:** `.ai-brain/02_MODULES/ER-001/` (35 files, L4-validated). NEPH-001 has only thin `neph_transplant` table.
- **Catalog:** `.ai-brain/01_DATA/CATALOG.yaml:38` → `{id: NEPH-002, name: "Renal Transplantation", parent: "Nephrology", code: NEPH}`.
- **Existing engine:** `namaweb/ai_nephrology_orchestrator.js` (RAG over `nephrology_cases`, `gemma4:31b-cloud`).
- **Sidebar gap:** Transplant not separately listed (under Doctor Station/NEPH).
- **Pattern:** NEPH-002 is true POC greenfield at the schema level (12 new tables for full transplant lifecycle).

### 2.2 Clinical (CMO)

**Top 10 conditions (ICD-10):** ESRD (N18.6), CKD Stage 5 (N18.5), Diabetic nephropathy (E11.22), ADPKD (Q61.2), Chronic GN (N03.9), Alport (Q87.81), IgA (N02.B 2024), Lupus nephritis (M32.14), FSGS (N04.1), HUS/TTP (D59.3/M31.1).

**Top 20 procedures (CPT):** Living donor nephrectomy open (50300) / lap (50547), Back-table prep (50325), Deceased donor procurement (50300-50), Recipient nephrectomy (50220/50240), Renal transplantation (50360), Vascular anastomosis (in 50360), Ureteroneocystostomy Lich-Gregoir (50780), Ureteral stent (50605/52332), Induction (ATG/basiliximab J-codes), Plasmapheresis (36514), IVIG (90284/96365), Renal biopsy (50200/88307), Protocol biopsy, Anti-rejection (J-codes), Graft nephrectomy (50340), HD bridge (90935/90945), PD bridge (90945/90947), DSA monitoring (LOINC 80617-0), HLA typing (81370-81383).

**Red flags (12):** Hyperacute rejection / Acute cellular rejection (Banff IA-IIIA) / AMR (DSA+/C4d+) / Calcineurin toxicity (trough >20) / BK polyomavirus nephropathy (PCR >10⁴) / Renal artery thrombosis / Renal vein thrombosis / Urinary leak / Lymphocele / Post-transplant infection / PTLD (EBV-driven) / Recurrent primary disease (FSGS, IgA, MPGN).

**Crossmatch:** CDC (T/B cells), Flow cytometric (T/B channels), Virtual (Luminex), DSA monitoring (MFI thresholds <1000 neg, 1000-3000 weak, 3000-8000 mod, >8000 strong). HLA loci: A/B/C/DRB1/DRB3-5/DQA1/DQB1/DPA1/DPB1 (10 loci, 20 alleles high-res NGS). cPRA for KSA allocation.

**Immunosuppression protocols (KDIGO 2009 + CST 2023):**
- Standard induction: Basiliximab 20 mg IV day 0 + day 4; or rATG 1.5 mg/kg ×3-5 (high-risk).
- Maintenance triple: Tacrolimus (trough 5-10) + MMF 1-2 g + Prednisone 5 mg.
- ABOi desensitization: Rituximab 375 mg/m² (D-14) + PLEX ×3-5 + IVIG + Tac/MMF (D-7).
- Anti-rejection: MPred 500 mg ×3 / rATG 1.5 mg/kg ×3-5 / PLEX+IVIG+rituximab for AMR.

**Scoring:** KDPI 0-100% (10 donor factors), EPTS 0-100% (4 recipient factors), cPRA %, Banff grading.

### 2.3 AI / RAG (AIE)

- **LLM:** Same gateway (gpt-4o / claude-3.5 / med-llama → rule-based floor).
- **Vector store:** PGVector 768d, `clinical-bert` embeddings, new collection `transplant_clinical_corpus`.
- **Source corpora:** KDIGO 2009/2020, Banff 2017/2019 (transcriptomics 2022), OPTN/SRTR data, CST 2023, ERA-EDTA consensus, SCOT annual reports, SFDA labeling (REM-S for ATG/rituximab/eculizumab), internal transplant protocol corpus (de-identified).
- **6 LangChain chains:** donor-recipient matching score, Banff biopsy interpretation helper (suggested category + therapy), immunosuppression trough-level advisor (HARD RULE: trough >20 → block + escalate), rejection risk predictor, post-transplant infection prophylaxis checker, paired-exchange match optimizer.
- **5 few-shot prompts:** transplant evaluation summary, MDT discussion note, post-op order set (HARD: MMF renal-adjusted at discharge), immunosuppression dose adjustment, Banff report summarization.

### 2.4 Architecture (SA)

**13 tables:** `transplant_waitlist` (cpra, epts, dialysis_years), `donor_registry` (kdpi, hla_typing JSONB), `recipient_evaluation` (cardiac/pulm/psych/financial), `hla_typing` (10 loci), `crossmatch_results` (CDC/flow/vXM/DSA), `transplant_procedure` (cold/warm ischemia, anastomosis time, induction), `immunosuppression_log` (HIGH-ALERT, dual-verify), `rejection_episodes` (Banff grade, treatment), `protocol_biopsies` (Banff 2019, C4d, SV40), `graft_surveillance` (egfr, BK/CMV PCR, DSA, adherence), `post_transplant_infections` (site, severity, prophylaxis), `long_term_followup`, `paired_exchange_pool`.

**26 endpoints (base `/api/v1/transplant`):** GET/POST `/waitlist`, POST `/evaluation`, POST `/hla-typing`, GET `/matching`, POST `/procedure`, POST `/immunosuppression`, POST `/rejection`, GET `/patient/:id/graft-history`, POST `/biopsy`, GET `/pair-exchange/matches`, + 16 more (donor offers, MDT, workup status, etc.).

**Middleware chain:** Same as CARD-002 + `requireRole('transplant_nephrology' OR 'transplant_coordinator')`. SCOT (Saudi Center for Organ Transplantation) integration mandatory.

### 2.5 UX / Stitch (PM)

**Personas:** Transplant Nephrologist, Transplant Coordinator, HLA Lab Tech, Post-transplant Nurse, Patient on waitlist.

**3-column Stitch station:** Left = donor info + match score + KDPI/EPTS; Center = procedure + immunosuppression order; Right = graft function + trough levels + biopsy results + DSA.

**User stories (7):**
1. Transplant coordinator sees waitlist position + calculated EPTS/KDPI match + time-on-dialysis.
2. HLA lab tech enters crossmatch + DSA + flags ABOi candidates.
3. Post-transplant nurse wants trough level alert + dose adjustment suggestion.
4. Nephrologist wants biopsy Banff interpretation + AMR/ACR classification.
5. Patient sees status + next clinic + medication reminders.
6. Coordinator pairs 2-3 donor/recipient for exchange.
7. QA wants 1-yr/5-yr graft survival dashboard by donor type.

**i18n keys (dept-specific):** `transplant.mmd`, `transplant.donor_offer`, `transplant.banff.grade`, `transplant.trough_target`, `transplant.dialysis_bridge`, `transplant.aboi_desens`, `transplant.epts`, `transplant.kdpi`, `transplant.pair_exchange` + 22 more.

### 2.6 Compliance (CQO)

- **JCI 7th Ed:** COP (transplant program), MMU (high-alert — tacrolimus, cyclosporine, MMF, ATG), QPS (graft survival KPIs), SQE (transplant coordinator certification).
- **CBAHI:** organ transplant program standards, donor screening, recipient evaluation.
- **SCOT (Saudi):** mandatory registry reporting (every transplant + donor).
- **NPHIES:** transplant bundle billing (donor + recipient).
- **ZATCA:** procedure billing with VAT exemptions for some drugs.
- **SFDA:** immunosuppressant registry, biologic REMS (ATG, rituximab, eculizumab).
- **PDPL:** 10y transplant records, 20y donor, lifetime recipient.
- **HIPAA:** doubly protected (donor + recipient).
- **Required audit events:** `transplant.waitlist.added`, `transplant.crossmatch.performed`, `transplant.procedure.completed`, `transplant.immunosuppression.administered`, `transplant.rejection.detected`, `transplant.graft_loss`, `transplant.donor.organs.recovered`, `transplant.biopsy.banff.graded`.

### 2.7 Engine — `namaweb/transplant_engine.js` (NEW, 10 functions)

1. `kdpiScore(age, height, weight, ethnicity, htn, dm, cod, hcv, dcd, scr, cmv)` — 0-100%.
2. `eptsScore(age, dialysisYears, diabetes, priorTransplant)` — 0-100%.
3. `praCalculation(hlaAntibodies, populationFrequencies)` — cPRA 0-100%.
4. `crossmatchInterpretation(cdcT, cdcB, flowT, flowB, vXM, dsa)` — POSITIVE = absolute decline.
5. `immunosuppressionTroughAdjuster(drug, currentDose, trough, targetLow, targetHigh, scr)` — adjust + recheck.
6. `banffGrade(lightFindings, immunofluorescence, em, c4dScore, sv40, dsa)` — Borderline/IA/IB/IIA/IIB/III/chronic-active AMR.
7. `rejectionRiskScore(dsaTrajectory, egfrSlope, bkPcr, cmvPcr, adherence)` — 30-day risk 0-100.
8. `infectionProphylaxisChecker(timePostTx, isRegimen, serostatus)` — valganciclovir/TMP-SMX/acyclovir recommendations.
9. `donorRecipientMatchScore(cpra, dsa, epts, bloodType, kdpi, hlaMM, ageDelta)` — proceed/decline/desensitize.
10. `graftSurvivalProjection(donorType, donorAge, recipientAge, hlaMM, induction, dsa)` — 1-yr/5-yr expected survival.

---

## Section 3: ER-002 — Trauma Center Level I

### 3.1 Reference catalog

- **Template:** `.ai-brain/02_MODULES/ER-001/` (35 files, L4-validated, closest cousin).
- **Catalog:** `.ai-brain/01_DATA/CATALOG.yaml` → `{id: ER-002, name: "Trauma Center (L1/L2)", parent: "Emergency", code: ER}`.
- **Existing engines (Pure JS):**
  - `namaweb/trauma_score_engine.js` — `glasgowComaScale`, `injurySeverityScore`, `revisedTraumaScore` (11 lines, reuse).
  - `namaweb/trauma_score_engine_test.js` — 10 tests (template pattern).
  - `namaweb/surgical_wave2_engine.js:86` — `checkMassiveTransfusionProtocol` (current MTP rule).
  - `namaweb/surgical_wave2_engine_batch2.js:92` — `calculateTraumaActivation` (level_1/2/consult).
  - `namaweb/surgical_wave2_engine_batch2.js:131` — `calculateISS` (6-body-region).
  - `namaweb/critical_care_wave5_engine.js:118` — `checkTraumaActivationLevel` ('Full'/'Partial').
  - `namaweb/phase3_calculators_router.js:42` — Existing routes: `POST /trauma/gcs`, `POST /trauma/iss`, `POST /trauma/rts`, `POST /trauma-center/activation-level`, `POST /surg/trauma-activation`.
- **Live route:** `namaweb/server.js:10077` — `POST /api/emergency/trauma/:visitId` with `requireAuth + requireTenantScope` (chassis to follow).
- **Live table:** `namaweb/db_postgres.js:850` — `emergency_trauma_assessments` (flat 6-field).
- **Live test:** `namaweb/cross_tenant_emergency_test.js` (11 RLS matches).

### 3.2 Clinical (CMO)

**Top 10 conditions (ICD-10 + AIS/ISS):** Polytrauma (T07, ISS ≥16, Tier 1), Severe TBI (S06.0-9, GCS ≤8), Penetrating trauma (S31/S21/S11), Blunt abdominal (S36.x), Thoracic (S27.x), Pelvic fracture (S32.8/S32.81), Long-bone/mangled extremity (S72/S82/S92), Spinal cord injury (S14.1/S24.1), Burns ≥20% TBSA (T30/T31), Pediatric trauma (age-adjusted).

**Top 20 procedures (CPT):** ATLS primary/secondary survey (E/M), Definitive airway (31500), Needle decompression (32554), Chest tube (32551), Resuscitative thoracotomy (32160), ED thoracotomy (33025), FAST (93308), DPL (49080), REBOA (34900), MTP (36430 ×units), Damage control laparotomy (49002), External fixation (20690), ICP monitor (61107), Craniotomy/craniectomy (61312/61322), Fasciotomy (27892/27496/25020), Vascular shunting (35231), Amputation (27880-27888), Splinting/traction (29065-29584), Inter-facility transfer (99289 + A0999).

**Red flags (12):** Hemorrhagic shock class III/IV / Tension pneumothorax / Cardiac tamponade / Massive hemothorax / Flail chest / Open-book pelvis / GCS ≤8 / Penetrating neck/chest/abdomen / Mangled extremity (MESS ≥7) / Crush syndrome / Compartment syndrome / Penetrating cardiac injury.

**MTP 1:1:1 (PROPPR trial 2015):** PRBC 6 + FFP 6 + Platelets 1 apheresis + Cryo 10 + TXA 1g IV within 3h + Ca-gluconate 1g per 4 PRBC + warming.

**Activation tiers:**
- Tier 1 (Full): penetrating torso / GCS ≤8 / SBP<90 / HR>120 / intubated / pulseless extremity / amputation proximal / fall >20ft / ejection / death of same-car occupant / motorcycle >30 mph. Team: trauma surgery attending + senior resident + ED MD + anesthesia + OR charge + blood bank + RT + radiology + chaplain. In-house 15 min (ACS Level I).
- Tier 2 (Partial): fall >10ft / MVC >30 mph / pedestrian struck / crash death same compartment / age >65 + Tier 1 mechanism / anticoagulated + head injury. In-house 30 min.
- Tier 3 (Consult): low-energy fall, isolated fracture, stable vitals. Within 60 min.

**ACS-COT Level I standards (Resource Document 2014, rev. 2023):** 24/7 in-house trauma surgeon, OR available within 15 min, all subspecialties on-call (ortho 30, neurosurg 30, CT 30, IR 60, hand 60, vascular 30, OMFS 60), ≥1,200 trauma admissions/year with ≥240 ISS>15, PI nurse + MD, ≥20 publications/3y, outreach visits, prevention programs, re-verification every 3y.

### 3.3 AI / RAG (AIE)

- **LLM:** `gpt-4o` (JSON mode) or `med-llama-70b`; `claude-3.5-sonnet` for trauma H&P (long context).
- **Vector store:** PGVector 768d, index `trauma_v1`, hybrid (vector + BM25 on AIS + KG on ATLS).
- **Source corpora:** ATLS 10e (ACS 2018), ACS-COT Resources 2014/rev 2023, EAST PMG (transfusion, REBOA, MTP, pelvic), BTF 2016 4th ed, NICE NG39 2016, NTDB/TQIP annual, ABC Score, Parkland formula, KSA MOH trauma center standards (CBAHI crosswalk).
- **7 LangChain chains:** issCalculator (per-injury AIS array), trissPs (age + ISS + RTS → Ps + 95%CI), activationTierClassifier (mechanism + vitals + anatomy), mtpTriggerCheck (ABC score + lactate trend + trauma-surgeon override), tbiSeverityScore (GCS + CT Marshall + pupillary + BTF), hemorrhageControlPathway (damage control vs angio vs packing), transferDecisionAdvisor (capability gap + stability + facility).
- **Few-shot (5):** Trauma H&P draft, MTP activation note, transfer letter to Level I/II, PI case review (BRAVO: Be Rigorous And Verify Outcome), MCI triage (START + SALT).
- **Hard rules:** MD-in-the-loop for AIS >3 coding (CMO veto); every `trauma.activation.triggered` + `mtp.activated` → LangSmith; p99 latency 1.5s; hallucination ceiling <1% for AIS coding, >5% triggers retraining; citation required for non-trivial recommendations.

### 3.4 Architecture (SA)

**14 tables:** `trauma_activations` (tier, mechanism, criteria_met, team_notified), `trauma_primary_survey` (A/B/C/D/E + GCS components), `trauma_secondary_survey` (head-to-toe), `trauma_injuries_ais` (per-injury AIS, descriptor), `trauma_iss_score` (iss_total, max_ais, 3 highest, mortality_band), `trauma_mtp_activations` (abc_score, units_ordered/transfused, ratio_compliance, terminated), `trauma_operative_log`, `trauma_transfers_in/out`, `trauma_registry_export` (NTDB-compliant, sha256_hash), `trauma_pi_cases` (deviation, contributing_factors, loop_closed), `trauma_outreach_events`, `trauma_research_projects`, `trauma_prevention_programs`.

**22 endpoints (base `/api/trauma`):** GET/POST `/activations`, GET `/activations/:id`, POST `/primary-survey` (fail-closed on partial), POST `/secondary-survey`, POST `/ais-coding` (MD-cosign if AIS>3), GET `/iss-score/:encounterId`, GET `/triss/:encounterId`, POST `/mtp/activate`, POST `/mtp/:id/terminate`, POST `/transfusion/log`, GET `/blood-bank/status/:encounterId`, POST `/operative-log`, POST `/transfer-out`, POST `/transfer-in`, GET `/registry/export`, POST `/pi/case`, POST `/pi/case/:id/close-loop`, GET `/performance/dashboard`, GET `/registry/stats`, POST `/tbi/severity`, POST `/hemorrhage/pathway`.

**Middleware chain:** `authenticate, requireTenantScope, corsWithAllowlist, rateLimit({requests:200, period:'1m'}), auditMiddleware` then per-route `requireRole('trauma_surgery' OR 'emergency_medicine'), validateBody(RS.trauma.activation)`. Idempotency on MTP activate (billing).

### 3.5 UX / Stitch (PM)

**Personas:** Trauma Surgeon (in-house 24/7), Trauma NP/PA, Trauma Coordinator, ED MD, Blood Bank, OR Charge, EMS Liaison, QA.

**3-column Stitch station (dark mode, high contrast):** Left = activation + mechanism + pre-hospital + score calc; Center = ATLS A/B/C/D/E stepper + timers + interventions + DICOM + OR status; Right = vitals (GCS trend) + MTP status + imaging + lab (lactate trend) + consultant responses + red flags.

**User stories (7):**
1. Trauma surgeon sees MTP + GCS + lactate + FAST + OR avail in 5s.
2. NP records primary/secondary survey via tablet (mobile-friendly).
3. Coordinator tracks PI case from deviation → loop closure.
4. Blood bank sees MTP cooler progress + reorder triggers.
5. ED MD initiates Tier 1/2/3 activation with one tap.
6. EMS liaison sees inbound transfers + capability matching.
7. QA runs NTDB export + ACS-COT compliance dashboard.

**i18n keys (dept-specific):** `trauma.mtp_activate`, `trauma.tier1/2/3`, `trauma.atls.airway/breathing/circulation/disability/exposure` (AR + EN), `trauma.iss`, `trauma.gcs`, `trauma.fast`, `trauma.reboa`, `trauma.tbi_severity`, `trauma.transfer_out` + 20 more.

### 3.6 Compliance (CQO)

- **JCI 7th Ed:** COP (trauma program), QPS (trauma PI), MMU (high-alert — TXA, blood, vasopressors), FMS (OR for trauma), SQE (ATLS competency), MOI (massive transfusion traceability).
- **ACS-COT Level I:** 3-year verification, trauma registry (NTDB/TQIP), outreach, prevention, research.
- **CBAHI:** trauma center designation, transfer protocols.
- **NPHIES:** trauma bundles (polytrauma DRG).
- **ZATCA:** trauma procedure billing.
- **PDPL:** 10y trauma registry, 20y pediatric, lifelong for blood transfusion.
- **HIPAA:** 164.312.
- **Required audit events:** `trauma.activation.triggered`, `trauma.atls.primary_survey.completed`, `trauma.mtp.activated`, `trauma.mtp.terminated`, `trauma.transfusion.completed`, `trauma.or.available`, `trauma.transfer.out`, `trauma.outcome.discharge`, `trauma.pi.case.opened`, `trauma.pi.loop.closed`.

### 3.7 Engine — `namaweb/trauma_center_engine.js` (NEW, extends existing, 10 functions)

1. `aisSeverityScore(ais2015Descriptor)` — 1-6.
2. `issCalculator(injuries[])` — sum of squares of 3 highest AIS in different body regions; max 75.
3. `trissPs(age, iss, rts)` — probability of survival with 95% CI (Champion 1995 coefficients).
4. `mtpTriggerCheck(sbp, hr, lactate, fast, suspectedHemorrhage, mechanism)` — ABC score + clinical override.
5. `activationTierClassifier(mechanism, vitals, anatomy)` — Tier 1/2/3 with criteria met.
6. `gcsTrend(eye, verbal, motor)` — total + trend over time.
7. `lactateClearance(initial, current, hoursElapsed)` — % clearance; <20% at 6h = poor.
8. `hemorrhageControlChecklist(bleedSource, hemodynamics)` — pathway: damage_control_surg / angioembolization / pelvic_packing / tourniquet.
9. `transferCriteriaCheck(capabilityGap, stability, receivingFacility)` — ground vs helicopter; contraindications.
10. `tbiSeverityScore(gcs, ctMarshall, pupillary, hypoxia, hypotension)` — BTF 2016 classification; ICP monitor indication.

---

## Section 4: ORC Cross-Cutting Notes

### 4.1 Common tables / RLS pattern (39 new tables)
- Every table: `tenant_id UUID NOT NULL REFERENCES tenants(id)` + `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` + `CREATE POLICY ... USING (tenant_id = current_setting('app.tenant_id')::UUID)`.
- Target FORCE_RLS: **189** (was 150 + 39 new).
- Audit columns: `created_at, updated_at, created_by_user_id, updated_by_user_id, soft_deleted_at`.

### 4.2 Common compliance coverage

| Standard | CARD-002 | NEPH-002 | ER-002 |
|---|---|---|---|
| JCI 7th Ed | ACC/COP/MMU/QPS/MOI/PCI/SQE | COP/MMU/QPS/SQE | COP/QPS/MMU/FMS/SQE/MOI |
| CBAHI | cardiac program | transplant program | trauma center designation |
| NPHIES | PCI/TAVR DRG | transplant bundle | polytrauma DRG |
| ZATCA | procedure billing + VAT | procedure billing + VAT | procedure billing + VAT |
| PDPL | 7y gen, 10y imaging, lifetime implant | 10y transplant, 20y donor, lifetime recipient | 10y registry, 20y peds, lifelong blood |
| SFDA | DES registry, contrast | immunosuppressant registry, REMS | blood traceability |
| HIPAA | 164.312 | 164.312 (doubly protected) | 164.312 |
| Saudi-specific | NPHIES | SCOT reporting (mandatory) | KSA MOH trauma designation |
| International | ACC/AHA/SCAI/ESC | KDIGO/Banff/OPTN/CST | ACS-COT/ATLS/EAST/BTF/NTDB/TQIP |

### 4.3 Common 13 safety rails (AGENTS.md §2.2)
All 13 rails honored in all 3 POC modules. See `SNIPPETS.md#SNIP-01`.

### 4.4 Common 6 L4 validation gates
All 6 gates applied per dept. See `EXECUTION_PLAYBOOK.md` Phase 5.

### 4.5 Cross-department integration points (future API)

| From | To | Trigger | Mechanism |
|---|---|---|---|
| ER-002 | CARD-002 | STEMI activation, post-ROSC, blunt cardiac injury | Auto-referral; door-to-balloon timer inheritance |
| ER-002 | NEPH-002 (future) | Crush syndrome + AKI | Renal consult; bridge dialysis |
| CARD-002 | NEPH-002 (future) | CIN post-PCI, pre-existing CKD | Renal consult; 48h Cr follow-up |
| CARD-002 | ER-002 | Procedural complications (perforation, tamponade) | Code activation; cross-team |
| NEPH-002 | CARD-002 | Pre-transplant cardiac workup, post-transplant CAD | Stress echo → cath referral |
| NEPH-002 | ER-002 | Trauma in immunosuppressed recipient | Sepsis workup; infection prophylaxis review |

### 4.6 Shared engine extension points
- `namaweb/cath_lab_engine.js` (NEW) — consolidates existing 3 cardiology functions to 10.
- `namaweb/transplant_engine.js` (NEW) — 10 deterministic transplant calculators.
- `namaweb/trauma_center_engine.js` (NEW) — extends existing `trauma_score_engine.js` from 3 to 10 functions.

### 4.7 Shared LangChain / LangGraph chains
| Pattern | CARD-002 | NEPH-002 | ER-002 |
|---|---|---|---|
| Risk score | SYNTAX, GRACE, TIMI | KDPI, EPTS, cPRA, Banff | ISS, TRISS, ABC, GCS |
| Decision support | DAPT duration, access route | Donor-recipient matching | Activation tier, MTP trigger |
| Report generator | Cath report | Transplant MDT letter | Trauma H&P, transfer letter |
| Consent summarizer | AR 5th-grade | AR 5th-grade | AR 5th-grade |
| Red flag detector | STEMI, shock, perforation | Hyperacute rejection, BK, thrombosis | Hemorrhagic shock, tension PTX, tamponade |

### 4.8 Shared FHIR R4 profiles
- Patient, Observation, Condition, Procedure, MedicationStatement, AllergyIntolerance
- Encounter (specific: `EMER` for ER/cath emergency, `IMP` for inpatient, `AMB` for cath ambulatory)
- DiagnosticReport (cath, biopsy, imaging)
- Specimen (transplant biopsy, blood culture)
- ServiceRequest (orders: cath, transplant workup, MTP)
- Provenance (AI-assisted decisions)
- AuditEvent (hash-chained, tamper-evident)

### 4.9 Shared i18n keys
See `SNIPPETS.md#SNIP-12` for common 24 keys. Each dept adds 20-30 dept-specific keys (see §1.5, §2.5, §3.5).

### 4.10 Shared cost / KPI dashboard

| KPI | Owner | Target |
|---|---|---|
| Door-to-Balloon compliance (CARD) | QA / Cardiology | ≥90% in <90 min |
| 1-yr graft survival (NEPH) | QA / Transplant | ≥95% (LRD), ≥90% (DD) |
| Door-to-OR for unstable trauma (ER) | QA / Trauma | ≥85% in <15 min |
| MTP trigger to first unit (ER) | Blood Bank / Trauma | <10 min |
| High-alert medication double-check (all) | Pharmacy / Nursing | 100% |
| Tenant-isolation test pass rate (all) | DevOps / QA | 100% |
| L4 validation gates (all) | ORC | 6/6 per dept |

### 4.11 Token-Saver S1-S8 application
- **S1 schema_first:** `$ref` to SNIPPETS.md (12 snippets) — 40% saving.
- **S2 chunked_reasoning:** 35 files per dept = 5 chunks of 7 files per subagent.
- **S3 id_reference:** `CARD-002` instead of "Interventional Cardiology" — 25% saving.
- **S4 templated_output:** `FILE_LIST_TEMPLATE.md` (identical file names across 3 depts) — 35% saving.
- **S5 cached_context:** ORC loads CONTEXT_BRIEFS.md once, 3 subagents reuse.
- **S6 compressed_prompts:** CMO, AIE, SA, DSL, PM, CQO, ORC abbreviations.
- **S7 selective_depth:** Surface for 28 files, deep for `04_clinical_red_flags.md` + `01_migration_up.sql` + `01_rag_chains.md` + `03_engine_module.md` + `01_clinical_workflows.md` (5 critical files per dept × 3 = 15 deep-dives).
- **S8 parallel_gen:** 3 L1 subagents in parallel, 3 L2 critique in parallel, 3 L4 validators in parallel.

**Target token saving:** ~70% (vs unstructured ~220K → 66K structured).

---

## ORC sign-off
All 3 briefs consolidated. Cross-cutting analysis complete. 39 new tables mapped (target FORCE_RLS=189). 71 new endpoints mapped. 3 new engines planned. All 13 safety rails and 6 L4 gates applicable. — ORC, 2026-07-24
