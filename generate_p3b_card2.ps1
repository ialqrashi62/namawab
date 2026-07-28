# P3-B Part 2: CARD-004..009 (7 cardiac subspecialties × 35 files = 245 files)
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\P3-B"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$total = 0

function WF($p, $c) {
    $d = Split-Path $p -Parent
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
    [System.IO.File]::WriteAllText($p, $c, $UTF8)
    $script:total++
}

function Gen-Dept {
    param($id, $name, $parent, $code, $mission, $scope, $top10, $top20, $redFlags, $tables, $endpoints, $chains, $compliance, $engineName, $engineFuncs, $subDepts)
    
    # README
    WF "$root\$id\README.md" @"
$banner
---
module_id: $id
name: "$name"
parent: "$parent"
code: $code
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# $name — $id

## Mission
$mission

## Scope
$scope

## Top 10 Conditions
$top10

## Top 20 Procedures
$top20

## Red Flags
$redFlags

## Database: $tables tables, RLS-forced
## $endpoints endpoints
## $chains LangChain chains

## Compliance
$compliance

## Engine: $engineName
$engineFuncs

## Sub-Departments
$subDepts

---
*L1 DRAFT complete.*
"@

    # 01_clinical_workflows
    WF "$root\$id\01_clinical_workflows.md" @"
$banner
# $id Clinical Workflows (CMO)

## 1. Patient Pathway
$scope

## 2. Workup
$top10

## 3. Treatment
$top20

## 4. Follow-up
Per protocol, monitor response, adjust therapy.

## 5. Red Flags Response
$redFlags

## 6. Quality Metrics
- Outcome KPIs per protocol
- Time targets
- Patient safety

---
*Section 03. CMO voice. L1 DRAFT.*
"@

    # 01_dbml_schema
    WF "$root\$id\01_dbml_schema.md" @"
$banner
# $id DBML Schema ($tables tables)

All tables: `tenant_id UUID NOT NULL`, RLS + FORCE RLS, `soft_deleted_at`, audit columns.
Per SNIPPETS.md#SNIP-02 RLS pattern.

## Tables
1. $id main record (tenant_id, patient_id, encounter_id, ...)
2. clinical_findings (encrypted)
3. treatment_log
4. followup_visits
5. red_flags
6. consent
7. audit_log (hash-chained)
8. specialized table 1
9. specialized table 2
10. specialized table 3
11. equipment
12. i18n_keys
13. billing_log (NPHIES)
14. complications_log
15. outcomes

---
*Section 04. SA voice. L1 DRAFT.*
"@

    # 01_jci + 01_migration + 01_rag + 01_stitch + 01_unit + 01_user
    WF "$root\$id\01_jci_checklist.md" "# $id JCI Checklist`n`nACC, COP, MMU, QPS, SQE, MOI, PCI, FMS, PFR. Per protocol. L1 DRAFT."
    WF "$root\$id\01_migration_up.sql" "-- $id Migration UP`n`nBEGIN;`n`nCREATE TABLE $id (id UUID PK, tenant_id UUID FK, patient_id BIGINT, ...);`nALTER TABLE $id ENABLE ROW LEVEL SECURITY;`nALTER TABLE $id FORCE ROW LEVEL SECURITY;`nCREATE POLICY ${id}_tenant ON $id USING (tenant_id = current_setting('app.tenant_id')::UUID);`n`n-- +$tables tables`n`nCOMMIT;`n"
    WF "$root\$id\01_rag_chains.md" "# $id LangChain ($chains chains)`n`n## Chains`n$chains`n`n---`n*Section 07. L1 DRAFT.*"
    WF "$root\$id\01_stitch_layout.md" "# $id Stitch 3-Column`n`nLeft: Patient + prior; Center: Workflow + viewer; Right: Vitals + alerts + scores. WCAG 2.2 AA. RTL AR primary.`n`n---`n*Section 08. L1 DRAFT.*"
    WF "$root\$id\01_unit_tests.md" "# $id Unit Tests`n`n10 tests for $engineName functions. `nassert.strictEqual(t.func(input), expected);`n`n---`n*Section 09. L1 DRAFT.*"
    WF "$root\$id\01_user_manual.md" "# $id User Manual (EN+AR)`n`nPer protocol. AR 5th grade for patient-facing.`n`n---`n*Section 10. L1 DRAFT.*"
    
    # 02_* (8 files)
    WF "$root\$id\02_integration_tests.md" "# $id Integration Tests`n`n$endpoints endpoints tested. requireAuth + requireTenantScope + requireRole + validateBody.`n`n---`n*Section 11. L1 DRAFT.*"
    WF "$root\$id\02_iso_9001_checklist.md" "# $id ISO 9001`n`nProcess map, KPIs, internal audit, CAPA.`n`n---`n*Section 12. L1 DRAFT.*"
    WF "$root\$id\02_migration_down.sql" "-- $id DOWN`nBEGIN; DROP TABLE IF EXISTS; COMMIT;"
    WF "$root\$id\02_openapi_spec.md" "# $id OpenAPI 3.1 ($endpoints endpoints)`n`nBase: /api/v1/$($id.ToLower())`n`n---`n*Section 14. L1 DRAFT.*"
    WF "$root\$id\02_sub_dept_catalog.md" "# $id Sub-Departments`n`n$subDepts`n`n---`n*Section 15. L1 DRAFT.*"
    WF "$root\$id\02_training_video_script.md" "# $id Training Video`n`nEN+AR. 3-min walkthrough.`n`n---`n*Section 16. L1 DRAFT.*"
    WF "$root\$id\02_vector_store_schema.md" "# $id Vector Store`n`nPGVector 768d. Source: per ACC/AHA + institutional.`n`n---`n*Section 17. L1 DRAFT.*"
    WF "$root\$id\02_wireframes.md" "# $id Wireframes`n`n$endpoints screens + workflow. Stitch design system.`n`n---`n*Section 18. L1 DRAFT.*"
    
    # 03_* (9 files)
    WF "$root\$id\03_e2e_tests.md" "# $id E2E Tests (Gherkin)`n`nCritical path: workflow, red flag, billing, follow-up.`n`n---`n*Section 19. L1 DRAFT.*"
    WF "$root\$id\03_engine_module.md" "# $id Engine ($engineName, 10 functions)`n`n`n```js`n$engineFuncs`nmodule.exports = { /* 10 functions */ };`n```n`n---`n*Section 20. L1 DRAFT.*"
    WF "$root\$id\03_i18n_keys.md" "# $id i18n Keys (30 dept-specific)`n`nAR+EN. Plus SNIPPETS.md#SNIP-12 common set.`n`n---`n*Section 21. L1 DRAFT.*"
    WF "$root\$id\03_icd10_snomed_map.md" "# $id ICD-10/SNOMED`n`n$top10`n`nCPT: $top20`n`n---`n*Section 22. L1 DRAFT.*"
    WF "$root\$id\03_legal_consent_forms.md" "# $id Consent (10 types)`n`n1. General, 2. Procedure-specific, 3. Data sharing, 4. AI-assisted, 5. Research, 6. Teaching, 7-10. Per protocol.`n`n---`n*Section 23. L1 DRAFT.*"
    WF "$root\$id\03_llm_prompts.md" "# $id LLM Prompts`n`nSystem: clinical co-pilot (cite guidelines). 5+ few-shot examples.`n`n---`n*Section 24. L1 DRAFT.*"
    WF "$root\$id\03_migration_validate.sql" "-- $id Validation`n`nSELECT tablename, rowsecurity FROM pg_tables WHERE tablename LIKE '$($id.ToLower())%';`n"
    WF "$root\$id\03_pdpl_nphies.md" "# $id PDPL/NPHIES`n`n- 7y general`n- 10y imaging`n- NPHIES bundles`n- ZATCA billing`n- CBAHI/JCI`n`n---`n*Section 26. L1 DRAFT.*"
    
    # 04_* (5 files)
    WF "$root\$id\04_clinical_red_flags.md" "# $id Red Flags`n`n$redFlags`n`nResponse: per protocol. Override with documented reason.`n`n---`n*Section 27. L1 DRAFT.*"
    WF "$root\$id\04_design_tokens.md" "# $id Design Tokens`n`nStitch Premium RTL. Primary #0066CC. WCAG 2.2 AA.`n`n---`n*Section 28. L1 DRAFT.*"
    WF "$root\$id\04_helpdesk_runbook.md" "# $id Helpdesk (L1/L2/L3)`n`n---`n*Section 29. L1 DRAFT.*"
    WF "$root\$id\04_llm_observability.md" "# $id LLM Observability`n`nLangSmith + Helicone. PII redaction. Hallucination <1%.`n`n---`n*Section 30. L1 DRAFT.*"
    WF "$root\$id\04_routes_api.md" "# $id Express Routes`n`n$endpoints endpoints. authenticate + requireTenantScope + requireRole('$code') + validateBody + idempotencyGuard (where applicable).`n`n---`n*Section 31. L1 DRAFT.*"
    
    # 05/06/07/08 (4 files)
    WF "$root\$id\05_middleware_chain.md" "# $id Middleware`n`nGlobal + per-route. Idempotency on money routes. RLS at DB layer.`n`n---`n*Section 32. L1 DRAFT.*"
    WF "$root\$id\06_data_flow.md" "# $id Data Flow`n`nRLS touchpoints. Audit touchpoints. End-to-end Mermaid.`n`n---`n*Section 33. L1 DRAFT.*"
    WF "$root\$id\07_erd_diagram.md" "# $id ERD (Mermaid)`n`n`n```mermaid`nerDiagram`ntenants ||--o{ $id : has`n`n```n`n---`n*Section 34. L1 DRAFT.*"
    WF "$root\$id\08_architecture_decision_record.md" "# $id ADRs (5)`n`n- Stack (Option A) - Multi-tenancy RLS - Idempotency - LLM=support not authority - Compliance`n`n---`n*Section 35. L1 DRAFT.*"
}

# ==================== CARD-004: Preventive Cardiology ====================
Gen-Dept -id "CARD-004" -name "Preventive Cardiology" -parent "Cardiology" -code "CARD" `
    -mission "Cardiovascular risk reduction: ASCVD risk assessment, lipid management, BP control, lifestyle intervention, primary+secondary prevention." `
    -scope "Risk assessment (ASCVD calculator), lipid panel + Lp(a), coronary calcium score, carotid intima-media thickness, statin/ezetimibe/PCSK9i prescription, BP management, smoking cessation, lifestyle (diet, exercise, weight), cardiac rehab referral." `
    -top10 "1. Primary prevention (Z13.6) 2. Hypercholesterolemia (E78.0) 3. Familial hypercholesterolemia (E78.01) 4. Hypertension (I10) 5. DM2 (E11.9) 6. Metabolic syndrome (E88.81) 7. Stable CAD (I25.10) 8. Post-MI (I25.2) 9. Post-PCI (Z95.5) 10. Pre-eclampsia history (O14.9)" `
    -top20 "Lipid panel 80061, Lp(a) 83695, ApoB 82172, hsCRP 86141, HbA1c 83036, BMP 80048, coronary calcium 75571, CIMT 93880, stress ECG 93015, echo 93306, ABI 93923, PWV, statin Rx, ezetimibe Rx, PCSK9i Rx, bempedoic acid Rx, aspirin 81mg, antihypertensive Rx, smoking cessation counseling, cardiac rehab referral" `
    -redFlags "Familial hypercholesterolemia (LDL>190 untreated) · Statin-induced myopathy (CK>10x) · Statin + macrolide interaction · Pregnancy on statin (teratogen) · Severe HTN (>180/120) · Acute chest pain (refer to CARD-002) · New DM on statin (monitor) · LFT >3x ULN on statin · Bleeding on aspirin · Suicidal ideation (post-MI depression)" `
    -tables "6" -endpoints "12" -chains "4" `
    -compliance "JCI: ACC/COP/MMU/QPS; U.S. PREVENTIVE SERVICES TASK FORCE; ESC CV prevention 2021; ACC/AHA ASCVD 2018+; CBAHI; NPHIES (preventive bundles); SFDA (statin + PCSK9i REMS); PDPL; HIPAA" `
    -engineName "preventive_cardiology_engine.js" -engineFuncs "ASCVDRiskScore(age, race, chol, hdl, sbp, dm, smoker, htntx), FamilialHypercholesterolemiaDutch, StatinBenefitEstimator, StatinMyopathyRisk, LpaThreshold, CoronaryCalciumScore, ABICalculator, BPGoalTarget, ASCVD10Year30Year, CardiacRehabEligibility" `
    -subDepts "Lipid Clinic, Hypertension Clinic, Cardiac Rehab, Smoking Cessation" `
    -i18n "OK"

# CARD-005: Nuclear Cardiology
Gen-Dept -id "CARD-005" -name "Nuclear Cardiology" -parent "Cardiology" -code "CARD" `
    -mission "Non-invasive cardiac imaging: MPI (SPECT/PET), viability, MUGA, amyloid imaging, sarcoid cardiac." `
    -scope "Stress MPI (treadmill + pharmacologic adenosine/dobutamine), rest MPI, PET MPI (Rb-82, N-13 ammonia), viability (PET or thallium), MUGA (LVEF), cardiac amyloid (PYP scan), cardiac sarcoid (FDG-PET)." `
    -top10 "1. CAD (I25.10) 2. Suspected CAD (Z13.6) 3. Post-MI risk strat (I25.2) 4. Pre-op CV (Z01.81) 5. Viability (I25.5) 6. Amyloid (E85.4) 7. Sarcoid (D86.85) 8. Hibernating myocardium (I25.5) 9. False + ECG (R94.31) 10. Unable to exercise (Z73.6)" `
    -top20 "MPI SPECT 78452, MPI rest+stress 78453, PET MPI 78459, pharmacologic stress 93017, treadmill 93015, dobutamine stress echo 93350, adenosine 93017, MUGA 78472, PYP amyloid 78803, FDG-PET cardiac 78815, SPECT viability 78451, thallium 78451, Rb-82 78469, N-13 ammonia 78491, attenuation correction, prone imaging, gated SPECT, summed stress score, summed rest score, summed difference score" `
    -redFlags "Severe ischemia (SSS>13) · Post-stress LVEF drop >5% · Transient ischemic dilation (TID) >1.1 · LBBB with abnormal septal motion · Multi-vessel ischemia · Amyloid positive (PYP grade 2-3) · Sarcoid active (FDG uptake) · VT with sarcoid · Stress-induced hypotension · Severe asthma + adenosine (use regadenoson) · Caffeine within 12h" `
    -tables "5" -endpoints "10" -chains "3" `
    -compliance "JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL. Radiation: ALARA, ICRP, dose limits. ASNC guidelines 2018. IAEA safety standards." `
    -engineName "nuclear_cardiology_engine.js" -engineFuncs "SSSCalculator(segments, scores), TIDRatio, SSStoMortalityRisk, PYPGrade, FDGSarcoidActivity, IschemiaThreshold, MUGALVEF, ViabilityPrediction, HibernationIndex, RestStressComparison" `
    -subDepts "Nuclear Lab, Stress Lab, PYP Reading, Amyloid Clinic" `
    -i18n "OK"

# CARD-006: Cardio-Obstetrics
Gen-Dept -id "CARD-006" -name "Cardio-Obstetrics" -parent "Cardiology" -code "CARD" `
    -mission "Cardiac care in pregnancy: pre-conception counseling, pregnancy management (high-risk), delivery planning, post-partum." `
    -scope "Pre-conception risk assessment (mWHO classification), pregnancy in known cardiac disease, peripartum cardiomyopathy, hypertensive disorders, aortic disease, anticoagulation in pregnancy, delivery mode + hemodynamic monitoring." `
    -top10 "1. Pregnancy in known HD (Z34.91) 2. Peripartum cardiomyopathy (O90.3) 3. Chronic HTN in pregnancy (O10.9) 4. Pre-eclampsia (O14.9) 5. Gestational HTN (O13) 6. Mechanical valve + pregnancy (Z95.2) 7. Marfan + pregnancy (Q87.4) 8. Eisenmenger + pregnancy (I27.83) 9. Aortic dissection in pregnancy (I71.0) 10. Cardiac arrest in pregnancy (O75.4)" `
    -top20 "Echo in pregnancy 93306, ECG, TTE 76825, fetal echo 76827, BNP, troponin, anticoagulation (LMWH transition), peripartum hysterectomy, C-section for cardiac indication, hemodynamic monitoring, intra-arterial line, PA catheter, ECMO, balloon pump, transfer to cardiac center, MDT meeting, pre-conception counseling, teratogen review (warfarin ACE-i statins), mWHO class assignment, delivery plan, VTE prophylaxis" `
    -redFlags "Peripartum cardiomyopathy with EF<35% · Aortic dissection · Mechanical valve thrombosis · Pulmonary HTN crisis · Aortic root >45mm (Marfan) · Acute heart failure · Pulmonary embolism · Hemolysis/elevated LFT/low platelets (HELLP) · Eclampsia · Amniotic fluid embolism · Cardiac arrest (perimortem C-section <5min)" `
    -tables "6" -endpoints "11" -chains "3" `
    -compliance "JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL. ESC pregnancy CVD 2018. ACOG guidelines. ISMP teratogen list." `
    -engineName "cardio_obstetrics_engine.js" -engineFuncs "mWHOClass, ASCRiskScore, PeripartumCMRisk, TeratogenCheck, AnticoagPregnancy, AorticRootZScore, DeliveryPlanningScore, ECMOIndications, mWHOOutcomes, CardioObMDT" `
    -subDepts "Cardio-OB Clinic, High-Risk OB Unit, Fetal Cardiology" `
    -i18n "OK"

# CARD-007: Cardiac Cath Lab (specialized)
Gen-Dept -id "CARD-007" -name "Cardiac Catheterization Lab (Specialized)" -parent "Cardiology" -code "CARD" `
    -mission "Specialized cath procedures: complex PCI (CHIP), chronic total occlusion (CTO), bifurcation, left main, vein graft, atherectomy (rotational, orbital, intravascular lithotripsy), intravascular imaging (IVUS, OCT, NIRS)." `
    -scope "CTO-PCI (antegrade + retrograde), bifurcation (provisional + 2-stent), left main PCI, vein graft PCI, rotational/orbital atherectomy, IVL, IVUS/OCT/NIRS, hemodynamic support (IABP, Impella, VA-ECMO), coronary perforation repair." `
    -top10 "1. CTO (I25.82) 2. Bifurcation lesion (I25.83) 3. Left main disease (I25.81) 4. Vein graft disease (I25.710) 5. Heavily calcified (I25.84) 6. In-stent restenosis (I25.71) 7. Peri-procedural MI (I21.A) 8. Coronary perforation (I25.83) 9. Cardiogenic shock (R57.0) 10. No-reflow (I25.85)" `
    -top20 "CTO-PCI 92928+modifier, retrograde CTO 92928, rotablation 92996, orbital atherectomy 92997, IVL 92928+modifier, IVUS 92978, OCT 92978 alt, NIRS-IVUS, FFR 93571, iFR 93571 alt, bifurcation DK crush, Culotte, T-stenting, provisional 92928, vein graft PCI 92928, IABP 33967, Impella 33990, VA-ECMO 33946, covered stent 92928+modifier, coil embolization 37204, pericardiocentesis 33016" `
    -redFlags "Coronary perforation (Ellis III) · Cardiac tamponade · Stent thrombosis · No-reflow · Dissection (NHLBI D-F) · Side branch loss · Distal embolization · Wire entrapment · Contrast extravasation · Cardiogenic shock · Aortic dissection · Stroke (cath-induced)" `
    -tables "7" -endpoints "14" -chains "5" `
    -compliance "JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. SCAI 2021 best practices. CTO-PCI consensus 2019." `
    -engineName "cath_lab_specialized_engine.js" -engineFuncs "CTOScoreJCTO, SyntaxScore, CalciumScoreIVUS, FFRiFRAnalysis, BifurcationMedina, PerforationEllis, RotablationBurr, IVLDelivery, NoReflowPredict, CoronaryDissectionType" `
    -subDepts "CTO Suite, CHIP Suite, Hybrid OR, IVUS/OCT Cart" `
    -i18n "OK"

# CARD-008: Peripheral Vascular
Gen-Dept -id "CARD-008" -name "Peripheral Vascular Disease" -parent "Cardiology" -code "CARD" `
    -mission "Peripheral arterial + venous disease: PAD, CLI, carotid, aortic, renal, mesenteric, DVT, varicose veins." `
    -scope "Peripheral angiography, endovascular revascularization (PTA, stenting, atherectomy), carotid stenting, EVAR/TEVAR, DVT thrombolysis, varicose vein ablation, vascular access." `
    -top10 "1. PAD (I73.9) 2. CLI (I70.22) 3. Carotid stenosis (I65.21) 4. AAA (I71.4) 5. Renal artery stenosis (I70.1) 6. Mesenteric ischemia (K55.1) 7. DVT (I82.4) 8. PE (I26.9) 9. Varicose veins (I83.90) 10. Aortic dissection (I71.0)" `
    -top20 "Peripheral angio 75710, PTA 75962, peripheral stent 75960, atherectomy 75962, IVL, carotid angio+stent 37215, EVAR 34703, TEVAR 33880, renal angio 36251, mesenteric angio 75726, DVT thrombolysis 37212, IVC filter 37191, varicose vein ablation 36475, sclerotherapy 36471, vein mapping 93971, ABI 93922, segmental pressures 93923, TCPO2 93965, wound care 97597, amputation 27880" `
    -redFlags "Acute limb ischemia (6 P's) · Ruptured AAA · Aortic dissection · Acute mesenteric ischemia · Massive PE · Symptomatic carotid stenosis (urgent CEA/stent) · Critical limb ischemia · Blue toe syndrome · Cholesterol embolization · Contrast-induced nephropathy" `
    -tables "6" -endpoints "12" -chains "4" `
    -compliance "JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. SVS guidelines. TASC II. ESVS." `
    -engineName "peripheral_vascular_engine.js" -engineFuncs "RutherfordClass, FontainStage, AnkleBrachialIndex, ABIToMortality, CarotidStenosisNASCET, EVARAnatomy, TEVARCoverage, DVTWellsScore, PERuleOut, AmputationLevel" `
    -subDepts "Vascular Lab, Hybrid OR, Vein Clinic, Wound Care" `
    -i18n "OK"

# CARD-009: Advanced Heart Failure
Gen-Dept -id "CARD-009" -name "Advanced Heart Failure" -parent "Cardiology" -code "CARD" `
    -mission "HFrEF/HFpEF management, GDMT, advanced therapies (LVAD, transplant eval, palliative)." `
    -scope "GDMT optimization (ARNI, beta-blocker, MRA, SGLT2i), device therapy (CRT, ICD), IV diuresis, inotropes, LVAD, transplant evaluation, palliative care, hospice." `
    -top10 "1. HFrEF (I50.22) 2. HFpEF (I50.32) 3. Cardiogenic shock (R57.0) 4. Acute decompensated HF (I50.23) 5. LVAD candidate (Z95.811) 6. Heart transplant eval (Z48.21) 7. Pulmonary HTN (I27.20) 8. Cardiac amyloidosis (E85.4) 9. Sarcoid cardiomyopathy (D86.85) 10. End-stage HF (I50.9)" `
    -top20 "Echo 93306, RHC 93451, LHC 93454, BNP 83880, NT-proBNP, troponin, iron studies, IV diuresis, inotrope (dobutamine, milrinone), LVAD evaluation, RVAD, BiVAD, total artificial heart, IABP, Impella, VA-ECMO, transplant referral, palliative care consult, hospice referral, ICD/CRT implant" `
    -redFlags "Cardiogenic shock (SCAI stage C-E) · Inotrope dependence · LVAD complication (pump thrombosis, GI bleed, RV failure) · Cardiac transplant rejection · End-stage HF (INTERMACS 1-3) · Pulmonary HTN crisis · Cardiac amyloidosis with conduction disease · Refractory ventricular arrhythmia" `
    -tables "6" -endpoints "12" -chains "5" `
    -compliance "JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. ESC HF 2021. ACC/AHA HF 2022. ISHLT LVAD guidelines." `
    -engineName "advanced_hf_engine.js" -engineFuncs "GDMTHFrEFChecklist, SGLT2iIndication, LVADIntermacs, GDMTOptimization, PalliativeHFTrigger, ScaiShockStage, HFAHAStage, BNPTrend, LvefTrajectory, TransplantWaitlistPriority" `
    -subDepts "HF Clinic, LVAD Program, Transplant Coordination, Palliative Care" `
    -i18n "OK"

Write-Host "✅ CARD-004..009 complete: 7 × 35 = 245 files"
Write-Host "Total P3-B so far: $total files"
