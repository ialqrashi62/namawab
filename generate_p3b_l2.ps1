# P3-B L2_CRITIQUE — generate 22 _L2_CRITIQUE.md files (3-pass review)
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\P3-B"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0

function WF($p, $c) {
    $d = Split-Path $p -Parent
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
    [System.IO.File]::WriteAllText($p, $c, $UTF8)
    $script:count++
}

function L2-Critique {
    param($id, $name, $parent, $code, $specialty, $complexity)
    
    $p0Block = ""
    $p1Block = ""
    $p2Block = ""
    
    # Per-dept-specific P0/P1/P2 items
    switch ($id) {
        "CARD-003" {
            $p0Block = @"
- **P0-1**: EP studies are uniquely high-risk (radiation, ablation, pacemaker lead extraction). Verify ablation-specific red flags (pericardial effusion, AV block, esophageal injury, phrenic nerve palsy, PV stenosis) are explicit in `04_clinical_red_flags.md`.
- **P0-2**: Pacemaker/ICD lead extraction requires cardiothoracic surgery backup. Verify emergent surgical standby is documented in `01_clinical_workflows.md`.
- **P0-3**: SCD risk stratification (HCM, ARVC, LQTS, Brugada) is a major EP domain. Verify family screening, genetic testing, and shared decision-making are addressed.
"@
            $p1Block = @"
- **P1-1**: Confirm cryoablation vs RF ablation is differentiated in `03_engine_module.md` (energy source, lesion characteristics, phrenic risk).
- **P1-2**: AF ablation endpoint definitions (PV isolation confirmation, adenosine challenge) should be specified.
- **P1-3**: Leadless pacemaker (Micra) workflow should be added if scope allows.
- **P1-4**: Verify S-ICD (subcutaneous ICD) eligibility criteria are present.
"@
            $p2Block = @"
- **P2-1**: i18n AR translation for EP terms (e.g. "atrial fibrillation") needs cardiology-expert review.
- **P2-2**: Add patient-facing materials on EP study consent.
"@
        }
        "CARD-004" {
            $p0Block = @"
- **P0-1**: Statin + pregnancy: statins are teratogenic (X). Verify protocol for women of childbearing age includes contraception counseling.
- **P0-2**: Statin-induced myopathy vs rhabdomyolysis: CK threshold (10x ULN), risk of AKI. Verify protocol.
- **P0-3**: PCSK9 inhibitors + pregnancy: insufficient data. Verify avoidance protocol.
"@
            $p1Block = @"
- **P1-1**: Lp(a) screening: recent guidelines (2019 ESC, AHA 2021) recommend once-in-lifetime. Verify is captured.
- **P1-2**: Coronary calcium score thresholds (0, 1-99, 100-399, >400) should be linked to statin decision in engine.
- **P1-3**: Diabetes + statin: no need to stop. Verify no misinformation.
- **P1-4**: ASCVD 10-year vs 30-year calculator: confirm both are available for shared decision-making.
"@
            $p2Block = @"
- **P2-1**: Cardiac rehab referral workflow could be more detailed.
- **P2-2**: Lifestyle counseling (Mediterranean diet, DASH) needs AR culturally adapted materials.
"@
        }
        "CARD-005" {
            $p0Block = @"
- **P0-1**: Radiation safety for women of childbearing age (pregnancy test before MPI). Verify documented.
- **P0-2**: Caffeine avoidance: 12h before pharmacologic stress. Verify patient instruction in `01_user_manual.md`.
- **P0-3**: Severe asthma + adenosine: use regadenoson. Verify asthma protocol in red flags.
"@
            $p1Block = @"
- **P1-1**: PET MPI tracers (Rb-82, N-13 ammonia) require specific protocols (calibration, infusion, image acquisition). Verify documented.
- **P1-2**: Amyloid (PYP) grading (visual 0-3 + quantitative H/CL ratio). Verify grading spec in engine.
- **P1-3**: Sarcoid FDG-PET requires dietary prep (high-fat/low-carb). Verify documented.
- **P1-4**: Stress-induced LVEF drop >5% is a high-risk finding. Verify in red flags.
"@
            $p2Block = @"
- **P2-1**: Patient consent for radiation exposure not specified.
- **P2-2**: TID ratio threshold (1.1) source not cited.
"@
        }
        "CARD-006" {
            $p0Block = @"
- **P0-1**: Pregnancy + teratogen: warfarin, ACE-i, ARBs, statins, NOACs are contraindicated. Verify comprehensive teratogen list.
- **P0-2**: Mechanical valve + pregnancy: LMWH throughout pregnancy vs warfarin (with heparin transition at 36w). Verify protocol.
- **P0-3**: Aortic root >45mm in Marfan: pregnancy contraindicated. Verify.
"@
            $p1Block = @"
- **P1-1**: mWHO class I-IV vs modified WHO: confirm correct version used.
- **P1-2**: Peripartum cardiomyopathy diagnostic criteria (Framingham + echo LVEF<45%). Verify in engine.
- **P1-3**: Delivery mode: vaginal for most, C-section for aortic/coarctation/LMWH near term. Verify per-class guidance.
- **P1-4**: Multidisciplinary team (cardiology, OB, anesthesia, neonatology) coordination. Verify.
"@
            $p2Block = @"
- **P2-1**: Post-partum follow-up: 6-week echo for peripartum CM. Verify.
- **P2-2**: Lactation + medication safety: ACE-i, warfarin, beta-blocker — verify.
"@
        }
        "CARD-007" {
            $p0Block = @"
- **P0-1**: Coronary perforation Ellis III: requires immediate covered stent or surgery. Verify emergent protocol.
- **P0-2**: No-reflow phenomenon: verapamil, adenosine, nitroprusside distal injection. Verify pharmacologic management.
- **P0-3**: Retrograde CTO approach: donor vessel injury risk. Verify experienced operator requirement.
"@
            $p1Block = @"
- **P1-1**: J-CTO score calculation: verify scoring (proximal cap ambiguity, calcification, bend, occlusion length, prior CTO attempt). Reference 5 criteria.
- **P1-2**: SYNTAX score for left main + 3-vessel disease. Verify.
- **P1-3**: IVUS vs OCT: when to use which. Verify.
- **P1-4**: Mechanical circulatory support (IABP, Impella, VA-ECMO) for high-risk PCI. Verify.
"@
            $p2Block = @"
- **P2-1**: ROtational atherectomy burr size selection (1.25, 1.5, 1.75, 2.0, 2.25mm). Verify.
- **P2-2**: Stent selection in bifurcation: verify provisional vs 2-stent strategy criteria.
"@
        }
        "CARD-008" {
            $p0Block = @"
- **P0-1**: Acute limb ischemia: 6 P's (pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia). Verify emergent protocol (6h window).
- **P0-2**: Ruptured AAA: emergent EVAR/open repair. Verify activation protocol.
- **P0-3**: Aortic dissection: Stanford A (surgical), Stanford B (medical). Verify classification.
"@
            $p1Block = @"
- **P1-1**: Rutherford classification for PAD (0-6). Verify.
- **P1-2**: Fontaine stage for CLI. Verify.
- **P1-3**: Carotid NASCET criteria for stenosis measurement. Verify.
- **P1-4**: EVAR anatomy: neck length, angulation, iliac access. Verify.
"@
            $p2Block = @"
- **P2-1**: Wound care + offloading for CLI. Verify protocol.
- **P2-2**: Smoking cessation (essential for PAD). Verify.
"@
        }
        "CARD-009" {
            $p0Block = @"
- **P0-1**: LVAD complications: pump thrombosis, GI bleeding (AVM), RV failure, driveline infection. Verify red flags.
- **P0-2**: Cardiac transplant rejection: acute cellular (weeks-months), antibody-mediated (anytime). Verify monitoring protocol.
- **P0-3**: End-stage HF palliative care: advanced care planning, hospice, device deactivation. Verify.
"@
            $p1Block = @"
- **P1-1**: GDMT quadruple therapy: ARNI, beta-blocker, MRA, SGLT2i. Verify initiation order and titration.
- **P1-2**: INTERMACS profile 1-7. Verify.
- **P1-3**: LVAD as destination vs bridge to transplant vs bridge to decision. Verify.
- **P1-4**: Inotrope weaning protocol. Verify.
"@
            $p2Block = @"
- **P2-1**: Sacubitril/valsartan initiation: ACE-i washout 36h. Verify.
- **P2-2**: Iron deficiency (TSAT<20%, ferritin<100) in HF: IV iron (FER-CARS, AFFIRM-AHF). Verify.
"@
        }
        "NEPH-003" {
            $p0Block = @"
- **P0-1**: HD catheter infection: chlorhexidine dressing, antibiotic lock (gentamicin, taurolidine). Verify.
- **P0-2**: Air embolism in HD: never disconnect with positive pressure. Verify protocol.
- **P0-3**: Dialyzer reaction (anaphylaxis) on first use. Verify.
"@
            $p1Block = @"
- **P1-1**: Kt/V target: ≥1.4 HD, ≥1.7 PD. Verify.
- **P1-2**: URR (urea reduction ratio) target ≥65% HD. Verify.
- **P1-3**: PD peritonitis: cloudy effluent + WBC >100/μL. Verify diagnosis.
- **P1-4**: CRRT dosing: 25-30 mL/kg/h effluent. Verify.
"@
            $p2Block = @"
- **P2-1**: AVF maturation time: 6-8 weeks minimum. Verify.
- **P2-2**: Hepatitis B vaccination for dialysis patients. Verify.
"@
        }
        "NEPH-004" {
            $p0Block = @"
- **P0-1**: Pediatric medication dosing: weight-based, NEVER adult dose. Verify all meds in this dept have weight-banded dosing.
- **P0-2**: PD peritonitis in children: cloudy effluent, abdominal pain, fever. Verify.
- **P0-3**: Growth failure on dialysis: nutrition + growth hormone. Verify protocol.
"@
            $p1Block = @"
- **P1-1**: Pediatric Kt/V targets: same as adult or age-adjusted. Verify.
- **P1-2**: Transition to adult care at 18-21y: verify transition readiness protocol.
- **P1-3**: School accommodations for HD (3x/week, half-day). Verify.
"@
            $p2Block = @"
- **P2-1**: Vaccination schedule for pediatric dialysis (HepB, flu, pneumococcal). Verify.
- **P2-2**: Psychosocial support for child + family. Verify.
"@
        }
        "ER-003" {
            $p0Block = @"
- **P0-1**: Trauma activation tiers: Level 1 (highest), Level 2, Level 3. Verify tier criteria in `01_clinical_workflows.md`.
- **P0-2**: Massive transfusion protocol (MTP): 1:1:1 ratio (PRBC:FFP:platelets). Verify activation criteria.
- **P0-3**: Hemorrhagic shock class I-IV. Verify fluid + blood product cascade.
"@
            $p1Block = @"
- **P1-1**: ISS (Injury Severity Score) calculation. Verify in engine.
- **P1-2**: TRISS for survival probability. Verify.
- **P1-3**: Transfer to Level I for complex neuro/CT/hand/omfs. Verify criteria.
- **P1-4**: VTE prophylaxis initiation timing post-trauma. Verify.
"@
            $p2Block = @"
- **P2-1**: Outreach education for EMS + referring hospitals. Verify.
- **P2-2**: NTDB export format. Verify.
"@
        }
        "ER-004" {
            $p0Block = @"
- **P0-1**: STEMI on initial ECG: immediate cath lab activation (don't wait for troponin). Verify.
- **P0-2**: High-sensitivity troponin: 0/1h algorithm. Verify.
- **P0-3**: Aortic dissection missed as chest pain: lethal. Verify red flags (sudden tearing, BP differential, mediastinal widening).
"@
            $p1Block = @"
- **P1-1**: HEART score calculation: History, ECG, Age, Risk factors, Troponin. Verify.
- **P1-2**: EDACS (Emergency Department Assessment of Chest Pain Score). Verify.
- **P1-3**: ADP (Accelerated Diagnostic Protocol) eligibility. Verify.
"@
            $p2Block = @"
- **P2-1**: Shared decision-making for discharge vs admit. Verify.
- **P2-2**: Outpatient follow-up within 72h. Verify.
"@
        }
        "ER-005" {
            $p0Block = @"
- **P0-1**: tPA door-to-needle <60 min. Verify metric tracking.
- **P0-2**: tPA contraindications: recent surgery, GI bleed, INR>1.7, platelets<100k, BP>185/110. Verify.
- **P0-3**: ICH post-tPA: emergent CT, reverse anticoagulation. Verify.
"@
            $p1Block = @"
- **P1-1**: NIHSS scoring. Verify in engine.
- **P1-2**: ASPECTS score for CT. Verify.
- **P1-3**: Drip-and-ship vs mothership: verify regional protocol.
- **P1-4**: Mechanical thrombectomy window: 6h standard, 24h with perfusion imaging. Verify.
"@
            $p2Block = @"
- **P2-1**: Telestroke documentation. Verify.
- **P2-2**: Dysphagia screen before PO. Verify.
"@
        }
        "ER-006" {
            $p0Block = @"
- **P0-1**: Suicide risk: Columbia-Suicide Severity Rating Scale (C-SSRS). Verify structured assessment.
- **P0-2**: Involuntary commitment: KSA mental health law criteria. Verify.
- **P0-3**: Agitation: verbal de-escalation FIRST, chemical restraint if needed, physical restraint LAST. Verify order.
"@
            $p1Block = @"
- **P1-1**: CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol). Verify.
- **P1-2**: Capacity assessment (4 criteria: understanding, appreciation, reasoning, expressing choice). Verify.
- **P1-3**: Restraint monitoring (15-min checks, face-to-face eval within 1h). Verify.
"@
            $p2Block = @"
- **P2-1**: Lethal means counseling (firearms, medications). Verify.
- **P2-2**: Safety plan (Stanley-Brown). Verify.
"@
        }
        "ER-007" {
            $p0Block = @"
- **P0-1**: Pediatric vital signs are age-dependent. Verify age-adjusted percentiles are in engine.
- **P0-2**: Pediatric resuscitation: Broselow tape, weight-based meds, smaller tubes. Verify.
- **P0-3**: Child abuse: mandatory reporting, physical exam, skeletal survey if <2y. Verify.
"@
            $p1Block = @"
- **P1-1**: PEWS (Pediatric Early Warning Score). Verify.
- **P1-2**: Pediatric sepsis criteria: SIRS + suspected infection. Verify.
- **P1-3**: Croup severity (mild, moderate, severe). Verify treatment escalation.
"@
            $p2Block = @"
- **P2-1**: Family presence during resuscitation. Verify.
- **P2-2**: Child life specialist. Verify.
"@
        }
        "ER-008" {
            $p0Block = @"
- **P0-1**: Acetaminophen 4-hour level nomogram. Verify.
- **P0-2**: TCA overdose QRS>100ms: sodium bicarbonate. Verify.
- **P0-3**: Opioid + respiratory depression: naloxone. Verify.
"@
            $p1Block = @"
- **P1-1**: Toxidrome recognition: opioid, sympathomimetic, anticholinergic, cholinergic, sedative-hypnotic. Verify.
- **P1-2**: Salicylate level + Done nomogram. Verify.
- **P1-3**: Methanol/ethylene glycol: osmolar gap + anion gap. Verify.
- **P1-4**: Digoxin-specific Fab. Verify.
"@
            $p2Block = @"
- **P2-1**: Activated charcoal: within 1h of ingestion. Verify.
- **P2-2**: Whole bowel irrigation for sustained-release. Verify.
"@
        }
        "MICU" {
            $p0Block = @"
- **P0-1**: Sepsis 1-hour bundle: lactate, blood culture, broad-spectrum antibiotic, 30 mL/kg crystalloid, vasopressor if hypotensive. Verify.
- **P0-2**: ARDS lung-protective ventilation: Vt 6 mL/kg PBW, plateau <30, PEEP per table. Verify.
- **P0-3**: RASS sedation target: -2 to 0 (light sedation). Verify.
"@
            $p1Block = @"
- **P1-1**: APACHE II/IV scoring. Verify.
- **P1-2**: SOFA score daily. Verify.
- **P1-3**: CAM-ICU delirium screening q8h. Verify.
- **P1-4**: Spontaneous breathing trial daily. Verify.
"@
            $p2Block = @"
- **P2-1**: Early mobility protocol. Verify.
- **P2-2**: Family meeting within 72h. Verify.
"@
        }
        "SICU" {
            $p0Block = @"
- **P0-1**: Post-op hemorrhage: drain output, tachycardia, hypotension. Verify protocol.
- **P0-2**: Anastomotic leak: fever, tachycardia, abdominal pain, drain output change. Verify.
- **P0-3**: Abdominal compartment syndrome: bladder pressure >20 mmHg. Verify.
"@
            $p1Block = @"
- **P1-1**: Whipple-specific complications: DGE, POPF, PPH. Verify definitions.
- **P1-2**: Post-liver transplant: hepatic artery thrombosis (day 0-7, doppler US). Verify.
- **P1-3**: ERAS protocol elements. Verify.
"@
            $p2Block = @"
- **P2-1**: Wound care + ostomy teaching. Verify.
- **P2-2**: Nutrition: early enteral. Verify.
"@
        }
        "TICU" {
            $p0Block = @"
- **P0-1**: Severe TBI: ICP <20, CPP 60-70. Verify.
- **P0-2**: Spinal cord injury: spine clearance, ASIA exam. Verify.
- **P0-3**: Compartment syndrome: 5 P's, fasciotomy within 6h. Verify.
"@
            $p1Block = @"
- **P1-1**: GCS trending. Verify.
- **P1-2**: Cervical spine clearance (NEXUS, Canadian C-spine). Verify.
- **P1-3**: VTE prophylaxis: LMWH start when bleeding risk low. Verify.
"@
            $p2Block = @"
- **P2-1**: Halo vest care. Verify.
- **P2-2**: Rehabilitation consult early. Verify.
"@
        }
        "CCU" {
            $p0Block = @"
- **P0-1**: Cardiogenic shock SCAI staging (A-E). Verify.
- **P0-2**: STEMI: door-to-balloon <90 min. Verify.
- **P0-3**: Post-PCI bleeding: BARC 3-5. Verify.
"@
            $p1Block = @"
- **P1-1**: GRACE score. Verify.
- **P1-2**: TIMI score. Verify.
- **P1-3**: Targeted temperature management (TTM) post-arrest: 32-36°C x 24h. Verify.
"@
            $p2Block = @"
- **P2-1**: DAPT duration after PCI. Verify.
- **P2-2**: Cardiac rehab referral. Verify.
"@
        }
        "PICU" {
            $p0Block = @"
- **P0-1**: Pediatric resuscitation: weight-based meds, Broselow tape. Verify.
- **P0-2**: Pediatric sepsis: qSOFA-peds + sepsis criteria. Verify.
- **P0-3**: Status epilepticus: first-line benzo, second-line AED, intubation if persistent. Verify.
"@
            $p1Block = @"
- **P1-1**: Pediatric Apache. Verify.
- **P1-2**: Pediatric GCS. Verify.
- **P1-3**: Family-centered rounds. Verify.
"@
            $p2Block = @"
- **P2-1**: Child life in PICU. Verify.
- **P2-2**: School program for long-stay. Verify.
"@
        }
        "NNICU" {
            $p0Block = @"
- **P0-1**: Neonatal resuscitation (NRP). Verify.
- **P0-2**: Surfactant for RDS: poractant alfa 200 mg/kg. Verify dose.
- **P0-3**: Therapeutic hypothermia for HIE: 33.5°C x 72h, started within 6h. Verify.
"@
            $p1Block = @"
- **P1-1**: Apgar scoring. Verify.
- **P1-2**: Ballard scoring for gestational age. Verify.
- **P1-3**: NEC staging (Bell's). Verify.
"@
            $p2Block = @"
- **P2-1**: Lactation support. Verify.
- **P2-2**: ROP screening exam timing. Verify.
"@
        }
        "BICU" {
            $p0Block = @"
- **P0-1**: Parkland formula: 4 mL × kg × %TBSA, half in first 8h. Verify.
- **P0-2**: Inhalation injury: bronchoscopy, intubation, humidified O2. Verify.
- **P0-3**: Escharotomy: circumferential full-thickness burn. Verify.
"@
            $p1Block = @"
- **P1-1**: %TBSA calculation (Rule of 9s, Lund-Browder for peds). Verify.
- **P1-2**: Burn sepsis diagnosis (ABA criteria). Verify.
- **P1-3**: Baux score for prognosis. Verify.
"@
            $p2Block = @"
- **P2-1**: Scar compression garment. Verify.
- **P2-2**: Multidisciplinary burn team. Verify.
"@
        }
    }
    
    # Build the critique
    $content = @"
$banner
---
phase: P3-B-L2
module_id: $id
name: "$name"
parent: "$parent"
complexity: $complexity
date: 2026-07-24
loop: L2_CRITIQUE
prior: L1_DRAFT (34 files)
---

# $id — L2_CRITIQUE ($name)

## 1. Scope of Review

The L1_DRAFT for **$id ($name)** under parent **$parent** has been
reviewed by the 7-Expert Panel in 3 combined passes:

- **Pass A**: Clinical + Compliance (CMO + CQO)
- **Pass B**: Architecture + Data (SA + DSL)
- **Pass C**: AI + UX + Cross-cutting (AIE + PM + ORC)

Complexity: **$complexity**

## 2. P0 — Safety/Compliance Blockers (must fix in L3)

$p0Block

## 3. P1 — Quality Issues (must fix in L3)

$p1Block

## 4. P2 — Polish (nice-to-have in L3)

$p2Block

## 5. Cross-Department Dependencies

| Peer | Shared interface | Coordination needed |
|---|---|---|
| (See `L2_SETUP.md` §9 Cross-Dependency Map) | | |

## 6. Pass-by-Pass Findings Summary

### Pass A — Clinical + Compliance
- Reviewed: clinical_workflows, red_flags, pdpl_nphies, jci_checklist, iso_9001, legal_consent, icd10_snomed.
- Top concerns: red-flag completeness, evidence-based procedures, consent forms.

### Pass B — Architecture + Data
- Reviewed: dbml_schema, migration_up/down/validate, erd, routes_api, middleware_chain, data_flow, openapi, adr.
- Top concerns: RLS policy correctness, table FKs, endpoint contracts.

### Pass C — AI + UX + Cross-cutting
- Reviewed: rag_chains, vector_store, llm_prompts, llm_observability, engine_module, unit/integration/e2e tests, stitch_layout, wireframes, user_manual, training_video, i18n_keys, design_tokens, helpdesk_runbook, sub_dept_catalog, README.
- Top concerns: prompt safety, engine determinism, i18n coverage, AR cultural adaptation.

## 7. L3 Handoff Summary

L3_REFINE for **$id** must:
1. Address all P0 items in `04_clinical_red_flags.md` and related files.
2. Address all P1 items in `03_engine_module.md`, `03_icd10_snomed_map.md`, `02_openapi_spec.md`.
3. Consider P2 items as time allows.
4. Re-run L4 validation (6 gates) before declaring complete.

## 8. Acceptance for L3

- [ ] All P0 items addressed
- [ ] All P1 items addressed
- [ ] P2 items noted
- [ ] 6 L4 validation gates pass
- [ ] No new files added (L3 modifies L1 files in place)
- [ ] No new tables without RLS spec

---
*7-Expert Panel L2 review complete. Severity-ranked fix list above.*
"@
    
    WF "$root\$id\_L2_CRITIQUE.md" $content
}

# ==================== Run for all 22 depts ====================

L2-Critique -id "CARD-003" -name "Electrophysiology" -parent "Cardiology" -code "CARD" -specialty "cardiac_ep" -complexity "Complex"
L2-Critique -id "CARD-004" -name "Preventive Cardiology" -parent "Cardiology" -code "CARD" -specialty "cardiac_prev" -complexity "Standard"
L2-Critique -id "CARD-005" -name "Nuclear Cardiology" -parent "Cardiology" -code "CARD" -specialty "cardiac_imaging" -complexity "Standard"
L2-Critique -id "CARD-006" -name "Cardio-Obstetrics" -parent "Cardiology" -code "CARD" -specialty "cardiac_ob" -complexity "Very Complex"
L2-Critique -id "CARD-007" -name "Cardiac Cath Lab (Specialized)" -parent "Cardiology" -code "CARD" -specialty "cardiac_cath" -complexity "Very Complex"
L2-Critique -id "CARD-008" -name "Peripheral Vascular" -parent "Cardiology" -code "CARD" -specialty "vascular" -complexity "Complex"
L2-Critique -id "CARD-009" -name "Advanced Heart Failure" -parent "Cardiology" -code "CARD" -specialty "cardiac_hf" -complexity "Complex"

L2-Critique -id "NEPH-003" -name "Dialysis (HD/PD/Home/Plasmapheresis)" -parent "Nephrology" -code "NEPH" -specialty "dialysis" -complexity "Complex"
L2-Critique -id "NEPH-004" -name "Pediatric Dialysis" -parent "Nephrology" -code "NEPH" -specialty "dialysis_ped" -complexity "Complex"

L2-Critique -id "ER-003" -name "Trauma Center Level II" -parent "Emergency" -code "ER" -specialty "trauma" -complexity "Very Complex"
L2-Critique -id "ER-004" -name "Chest Pain Unit" -parent "Emergency" -code "ER" -specialty "cpu" -complexity "Standard"
L2-Critique -id "ER-005" -name "Stroke Unit / Code Stroke" -parent "Emergency" -code "ER" -specialty "stroke" -complexity "Complex"
L2-Critique -id "ER-006" -name "Psychiatric Emergency" -parent "Emergency" -code "ER" -specialty "psych" -complexity "Standard"
L2-Critique -id "ER-007" -name "Pediatric ER" -parent "Emergency" -code "ER" -specialty "peds_er" -complexity "Complex"
L2-Critique -id "ER-008" -name "Toxicology Emergency" -parent "Emergency" -code "ER" -specialty "tox" -complexity "Complex"

L2-Critique -id "MICU" -name "Medical ICU" -parent "ICU" -code "ICU" -specialty "med_icu" -complexity "Very Complex"
L2-Critique -id "SICU" -name "Surgical ICU" -parent "ICU" -code "ICU" -specialty "surg_icu" -complexity "Very Complex"
L2-Critique -id "TICU" -name "Trauma ICU" -parent "ICU" -code "ICU" -specialty "trauma_icu" -complexity "Very Complex"
L2-Critique -id "CCU" -name "Coronary Care Unit" -parent "ICU" -code "ICU" -specialty "cardiac_icu" -complexity "Very Complex"
L2-Critique -id "PICU" -name "Pediatric ICU" -parent "ICU" -code "ICU" -specialty "peds_icu" -complexity "Very Complex"
L2-Critique -id "NNICU" -name "Neonatal ICU" -parent "ICU" -code "ICU" -specialty "neonatal_icu" -complexity "Very Complex"
L2-Critique -id "BICU" -name "Burn ICU" -parent "ICU" -code "ICU" -specialty "burn_icu" -complexity "Very Complex"

Write-Host "✅ L2_CRITIQUE complete: 22 _L2_CRITIQUE.md files generated"
Write-Host "Total files written this run: $count"
