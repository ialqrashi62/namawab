#!/usr/bin/env node
// Wave 3A: Seed clinical document dataset for AI Co-Pilot ingestion
// Pattern: clinical guidelines + drug references + Saudi MOH protocols
'use strict';
const fs = require('fs');
const path = require('path');

const DOCS = [
    // ============ Hypertension ============
    {
        doc_id: 'guideline-htn-2024',
        doc_kind: 'guideline',
        title: 'Hypertension Management - Saudi MOH 2024',
        title_ar: 'إدارة ارتفاع ضغط الدم - وزارة الصحة السعودية 2024',
        content: `# Hypertension Management - Saudi MOH 2024

## Definition
- Normal: <120/<80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1: 130-139/80-89 mmHg
- Stage 2: ≥140/≥90 mmHg
- Hypertensive crisis: >180/>120 mmHg

## First-Line Treatment
- Age ≥60 with stage 1: lifestyle changes for 3-6 months, then ACE inhibitor if no improvement
- Stage 2: start ACE inhibitor (lisinopril 10mg) or ARB (losartan 50mg) immediately
- Black patients: thiazide or CCB preferred
- Diabetes + HTN: ACE inhibitor first-line (renal protection)
- CKD + HTN: ACE inhibitor or ARB first-line

## BP Targets
- General: <130/80 mmHg
- Diabetes: <130/80 mmHg
- CKD: <130/80 mmHg
- Age ≥65: <140/90 mmHg acceptable

## Add-on Therapy
- If not controlled on ACEi alone: add CCB (amlodipine 5mg)
- Triple therapy: ACEi + CCB + thiazide (chlorthalidone 12.5mg)
- Resistant HTN: add spironolactone 25mg

## Saudi Specific
- MOH Formulary: lisinopril, losartan, amlodipine, chlorthalidone, spironolactone
- Average Saudi salt intake: 12g/day (target <5g)
- CKD prevalence in Saudi: 9.4% (2019 PURE study)`
    },
    // ============ Diabetes ============
    {
        doc_id: 'guideline-dm-2024',
        doc_kind: 'guideline',
        title: 'Diabetes Type 2 Management - ADA 2024',
        title_ar: 'إدارة السكري من النوع الثاني - ADA 2024',
        content: `# Diabetes Type 2 Management - ADA 2024

## Diagnostic Criteria
- HbA1c ≥6.5%
- FPG ≥126 mg/dL (7.0 mmol/L)
- 2h PG ≥200 mg/dL during OGTT
- Random PG ≥200 mg/dL in symptomatic patient

## First-Line
- Metformin 500mg BID, titrate to 1000mg BID
- If eGFR <30: contraindicated
- If eGFR 30-45: max 500mg BID

## Glycemic Targets
- HbA1c <7% for most adults
- HbA1c <6.5% if achievable without hypoglycemia
- HbA1c <8% if elderly, frail, or limited life expectancy

## Second-Line (after metformin)
- ASCVD: GLP-1 RA (semaglutide) or SGLT2i (empagliflozin)
- HF or CKD: SGLT2i (empagliflozin, dapagliflozin)
- Cost concern: SU (gliclazide MR 30mg)
- Weight concern: GLP-1 RA or SGLT2i

## Cardiovascular Risk
- Saudi DM prevalence: 17.7% (PWH 2019)
- Annual screen: lipid panel, urine ACR, eGFR, eye exam, foot exam
- BP target: <130/80
- LDL target: <70 mg/dL if ASCVD, <100 mg/dL otherwise

## Hypoglycemia
- <70 mg/dL: treat with 15g fast carbs
- <54 mg/dL: glucagon 1mg IM
- Severe: 50% dextrose 25-50mL IV`
    },
    // ============ Sepsis ============
    {
        doc_id: 'guideline-sepsis-2024',
        doc_kind: 'guideline',
        title: 'Sepsis Management - Surviving Sepsis 2021',
        title_ar: 'إدارة الإنتان - Surviving Sepsis 2021',
        content: `# Sepsis Management - Surviving Sepsis Campaign 2021

## Hour-1 Bundle
1. Measure lactate
2. Obtain blood cultures BEFORE antibiotics
3. Administer broad-spectrum antibiotics within 1 hour
4. Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L
5. Apply vasopressors if hypotensive during/after fluid resuscitation to maintain MAP ≥65 mmHg

## qSOFA Screening (≥2 = high risk)
- Altered mental status (GCS <15)
- Respiratory rate ≥22/min
- Systolic BP ≤100 mmHg

## Initial Antibiotics
- Community-acquired pneumonia: ceftriaxone 2g + azithromycin 500mg
- Urosepsis: ceftriaxone 2g
- Abdominal source: piperacillin-tazobactam 4.5g
- MRSA risk: add vancomycin 25-30 mg/kg loading
- MDR organism risk: add meropenem 1g

## Source Control
- Identify source within 6 hours
- Drainage of abscess, removal of infected device
- Surgical intervention if indicated

## Monitoring
- Lactate every 2-4 hours until normalized
- MAP target ≥65 mmHg
- Urine output ≥0.5 mL/kg/hr
- ScvO2 ≥70%`
    },
    // ============ Stroke ============
    {
        doc_id: 'guideline-stroke-2024',
        doc_kind: 'guideline',
        title: 'Acute Ischemic Stroke - AHA/ASA 2019',
        title_ar: 'السكتة الدماغية الحادة - AHA/ASA 2019',
        content: `# Acute Ischemic Stroke - AHA/ASA 2019

## Time Windows
- IV tPA (alteplase): 0-4.5 hours from onset
- Mechanical thrombectomy: 0-24 hours (LVO confirmed)
- Tenecteplase: 0-4.5 hours (alternative to alteplase)

## Inclusion (tPA)
- Age ≥18
- Clinical diagnosis of ischemic stroke
- Time of onset well-defined
- CT excludes hemorrhage

## Exclusion (tPA)
- Recent surgery <14 days
- GI bleed <21 days
- Stroke or head trauma <3 months
- BP >185/110 (must lower first)
- INR >1.7
- Platelet <100,000
- Glucose <50 mg/dL

## Dosing
- Alteplase 0.9 mg/kg (max 90 mg)
- 10% as bolus over 1 minute
- 90% as infusion over 60 minutes

## Imaging
- CT head: rule out hemorrhage
- CTA: identify LVO
- CTP or MRI: assess penumbra (for late window)

## BP Management
- Pre-tPA: <185/110 mmHg
- Post-tPA: <180/105 for 24 hours
- Non-tPA: <220/120 unless end-organ damage

## NIHSS Components
- Level of consciousness, gaze, visual fields, facial palsy
- Motor arm/leg, limb ataxia, sensory
- Language, dysarthria, extinction/inattention
- Total max: 42, ≤4 minor, 5-15 moderate, 16-20 severe, >20 very severe`
    },
    // ============ ACS ============
    {
        doc_id: 'guideline-acs-2024',
        doc_kind: 'guideline',
        title: 'Acute Coronary Syndrome - ESC 2023',
        title_ar: 'المتلازمة التاجية الحادة - ESC 2023',
        content: `# Acute Coronary Syndrome - ESC 2023

## Classification
- STEMI: ST elevation ≥1mm in 2 contiguous leads (≥2mm in V2-V3)
- NSTEMI: troponin elevation without ST elevation
- Unstable angina: ischemia without troponin elevation

## STEMI Management
- Door-to-balloon <90 minutes (PCI-capable center)
- Door-to-needle <30 minutes if PCI not available
- Aspirin 150-300mg loading
- Ticagrelor 180mg loading (or clopidogrel 600mg if fibrinolysis)
- Anticoagulation: UFH bolus 60 U/kg
- Primary PCI: preferred reperfusion

## NSTEMI
- Risk stratify (GRACE score)
- Invasive strategy within 24h if high risk
- Aspirin + ticagrelor
- Anticoagulation: fondaparinux 2.5mg SC (preferred)

## Troponin
- High-sensitivity troponin: 0/1-hour algorithm
- 0h <5 ng/L: rule out
- 0h ≥52 ng/L: rule in
- Otherwise: repeat at 1 hour

## Secondary Prevention
- Dual antiplatelet: aspirin + ticagrelor 12 months
- High-intensity statin: atorvastatin 80mg
- ACE inhibitor: lifelong if LV dysfunction
- Beta-blocker: if LVEF <40%
- Cardiac rehab: within 2 weeks`
    },
    // ============ Asthma ============
    {
        doc_id: 'guideline-asthma-2024',
        doc_kind: 'guideline',
        title: 'Asthma Management - GINA 2024',
        title_ar: 'إدارة الربو - GINA 2024',
        content: `# Asthma Management - GINA 2024

## Stepwise Treatment (Adults)

### Step 1 (Symptoms <2d/month)
- PRN low-dose ICS-formoterol (preferred)
- Alternative: PRN low-dose ICS + SABA

### Step 2 (Symptoms 2-5d/month)
- Daily low-dose ICS
- PRN low-dose ICS-formoterol

### Step 3 (Symptoms >5d/month)
- Daily low-dose ICS-LABA
- PRN low-dose ICS-formoterol

### Step 4 (Symptoms most days)
- Daily medium-dose ICS-LABA
- PRN low-dose ICS-formoterol

### Step 5 (Symptoms daily)
- Daily high-dose ICS-LABA
- Consider anti-IgE (omalizumab), anti-IL5 (mepolizumab)
- Consider oral corticosteroids

## Acute Exacerbation
- Mild-moderate: SABA 4-10 puffs q20min × 3
- Severe: SABA + ipratropium neb + systemic steroids
- Prednisolone 50mg daily × 5 days
- O2 target: 93-95%
- Peak flow: <50% predicted = severe

## Saudi Asthma
- Prevalence: 8-12% in adults
- Common triggers: dust, sandstorms, cold air
- Smoking cessation critical
- Allergen control: dust mites, cockroaches`
    },
    // ============ Diabetes meds ============
    {
        doc_id: 'drug-metformin',
        doc_kind: 'drug',
        title: 'Metformin - Drug Reference',
        title_ar: 'ميتفورمين - مرجع الدواء',
        content: `# Metformin

## Class
Biguanide antihyperglycemic

## Indications
- Type 2 diabetes mellitus
- Polycystic ovary syndrome (off-label)
- Prediabetes (off-label)

## Dosing
- Initial: 500mg PO BID with meals
- Titrate: increase by 500mg every 1-2 weeks
- Maximum: 2000mg/day (850mg TID or 1000mg BID)
- Extended-release: 500-2000mg daily with evening meal

## Renal Dosing
- eGFR ≥45: full dose
- eGFR 30-44: max 500mg BID
- eGFR <30: contraindicated

## Contraindications
- eGFR <30
- Metabolic acidosis
- Acute or chronic heart failure (caution)
- Hepatic impairment
- Alcohol abuse
- Hypersensitivity

## Adverse Effects
- GI: nausea, diarrhea, abdominal pain (30%)
- Lactic acidosis (rare, <1/100,000)
- B12 deficiency (long-term)

## Monitoring
- HbA1c every 3-6 months
- Renal function annually
- Vitamin B12 every 2-3 years if long-term use

## Drug Interactions
- Iodinated contrast: hold 48h before/after
- Cimetidine: increases metformin levels
- Alcohol: increases lactic acidosis risk`
    },
    {
        doc_id: 'drug-lisinopril',
        doc_kind: 'drug',
        title: 'Lisinopril - Drug Reference',
        title_ar: 'ليزينوبريل - مرجع الدواء',
        content: `# Lisinopril

## Class
ACE inhibitor

## Indications
- Hypertension
- Heart failure
- Post-MI LV dysfunction
- Diabetic nephropathy

## Dosing
- HTN: 10mg daily, titrate to 20-40mg
- HF: 5mg daily, target 20-35mg
- Start low if elderly or renal impairment

## Renal Dosing
- eGFR ≥30: usual dose
- eGFR <30: start 5mg, titrate cautiously

## Contraindications
- Pregnancy (teratogenic)
- Bilateral renal artery stenosis
- Angioedema history
- Hyperkalemia

## Adverse Effects
- Dry cough (10-20%)
- Hyperkalemia
- Angioedema (rare, <1%)
- Hypotension (first dose)
- AKI (especially with dehydration)

## Monitoring
- BP at 1-2 weeks
- Potassium and creatinine at 1-2 weeks
- Cough assessment

## Drug Interactions
- K-sparing diuretics: hyperkalemia
- NSAIDs: decrease efficacy, increase AKI risk
- Lithium: lithium toxicity
- ARBs: avoid combination`
    },
    // ============ Pain meds ============
    {
        doc_id: 'drug-paracetamol',
        doc_kind: 'drug',
        title: 'Paracetamol (Acetaminophen) - Drug Reference',
        title_ar: 'باراسيتامول - مرجع الدواء',
        content: `# Paracetamol (Acetaminophen)

## Class
Non-opioid analgesic and antipyretic

## Indications
- Mild to moderate pain
- Fever
- Headache, dental pain, musculoskeletal pain

## Dosing
- Adults: 500-1000mg PO/IV q4-6h, max 4g/day
- Children: 10-15 mg/kg q4-6h, max 75 mg/kg/day
- Saudi MOH: max 3g/day for chronic use

## Hepatic Dosing
- Child-Pugh A: no adjustment
- Child-Pugh B: avoid or reduce
- Child-Pugh C: contraindicated

## Contraindications
- Severe hepatic impairment
- Active liver disease
- Hypersensitivity

## Adverse Effects
- Generally well-tolerated
- Hepatotoxicity at >10g acute or >4g/day chronic
- Rash (rare)
- Hypersensitivity (rare)

## Overdose
- 4-hour level >150 μg/mL = hepatotoxic
- N-acetylcysteine (NAC) antidote
- NAC: 150 mg/kg IV over 1h, then 50 mg/kg over 4h, then 100 mg/kg over 16h
- Most effective within 8 hours of ingestion

## Drug Interactions
- Warfarin: increased INR with chronic use
- Alcohol: increased hepatotoxicity
- Isoniazid: increased hepatotoxicity`
    },
    // ============ Saudi clinical calculator ============
    {
        doc_id: 'calc-bsa-mosteller',
        doc_kind: 'calculator',
        title: 'Body Surface Area - Mosteller Formula',
        title_ar: 'مساحة سطح الجسم - صيغة موستيلر',
        content: `# Body Surface Area - Mosteller Formula

## Formula
BSA (m²) = √(height_cm × weight_kg / 3600)

## Example
- Height 170 cm, Weight 70 kg
- BSA = √(170 × 70 / 3600) = √3.31 = 1.82 m²

## Use
- Chemotherapy dosing
- Cardiac output (indexed)
- GFR estimation

## Reference Ranges
- Adult male: 1.9-2.0 m²
- Adult female: 1.6-1.7 m²
- Newborn: 0.25 m²
- 2-year-old: 0.5 m²
- 9-year-old: 1.0 m²`
    },
    // ============ Glasgow Coma Scale ============
    {
        doc_id: 'scale-gcs',
        doc_kind: 'scale',
        title: 'Glasgow Coma Scale (GCS)',
        title_ar: 'مقياس غلاسكو للغيبوبة',
        content: `# Glasgow Coma Scale (GCS)

## Eye Opening (E) - 1-4
- 4: Spontaneous
- 3: To voice
- 2: To pain
- 1: None

## Verbal Response (V) - 1-5
- 5: Oriented
- 4: Confused conversation
- 3: Inappropriate words
- 2: Incomprehensible sounds
- 1: None

## Motor Response (M) - 1-6
- 6: Obeys commands
- 5: Localizes to pain
- 4: Withdraws from pain
- 3: Abnormal flexion (decorticate)
- 2: Extension (decerebrate)
- 1: None

## Total Score
- Maximum: 15 (E4 V5 M6)
- Severe: ≤8 (intubation indicated)
- Moderate: 9-12
- Mild: 13-15

## Pediatric GCS Modifications
- Verbal: appropriate words, cries, irritable cry, moans, none
- Motor: same as adults`
    },
    // ============ NEWS2 Score ============
    {
        doc_id: 'scale-news2',
        doc_kind: 'scale',
        title: 'NEWS2 Score (UK NHS)',
        title_ar: 'درجة NEWS2',
        content: `# NEWS2 Score (UK NHS)

## Parameters (0-3 each)
- Respiratory rate
- Oxygen saturation
- Temperature
- Systolic BP
- Heart rate
- Consciousness (AVPU)

## Score Interpretation
- 0-4: Low risk (routine monitoring)
- 5-6: Medium risk (urgent response)
- ≥7: High risk (emergency response)

## Triggers
- Any single parameter 3: urgent response
- Total ≥7: emergency response
- Total 5-6: urgent response
- Total 0-4 but previously higher: increase frequency

## Use
- Early warning for clinical deterioration
- Triggers escalation to critical care outreach
- Standardized across UK NHS hospitals
- Adopted in Saudi MOH pilot hospitals`
    },
    // ============ Antibiotic stewardship ============
    {
        doc_id: 'protocol-asp-2024',
        doc_kind: 'protocol',
        title: 'IV to PO Switch Criteria - ASP 2024',
        title_ar: 'معايير التحويل من الوريد إلى الفم - برنامج إدارة المضادات الحيوية 2024',
        content: `# IV to PO Switch Criteria - Antimicrobial Stewardship 2024

## When to Switch
1. Patient is clinically improving
2. Afebrile (T <38°C) for 24-48 hours
3. WBC normalizing
4. Tolerating oral intake
5. No malabsorption
6. Functioning GI tract

## Suitable Antibiotics (high oral bioavailability)
- Fluoroquinolones: >90% (levofloxacin, ciprofloxacin)
- Metronidazole: ~100%
- Linezolid: 100%
- TMP-SMX: ~90%
- Doxycycline: ~90%
- Clindamycin: ~90%
- Amoxicillin: ~80%

## Not Suitable for IV to PO
- Carbapenems (no oral equivalent)
- Vancomycin (PO is for C. diff only)
- Aminoglycosides (no oral equivalent)
- Beta-lactams (variable, often <60%)

## Saudi MOH ASP Goals
- Reduce IV antibiotic days by 30%
- Switch rate target: 40% within 48-72 hrs
- Reassess at 48-72 hours for all IV antibiotics
- Document indication in chart

## Exceptions
- Endocarditis: full IV course
- S. aureus bacteremia: 14 days IV minimum
- Neutropenic fever
- Meningitis
- Deep abscess (until drained)`
    },
];

const OUT_DIR = 'namaweb/seeds/clinical_docs';
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const doc of DOCS) {
    const filePath = path.join(OUT_DIR, `${doc.doc_id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(doc, null, 2));
    console.log(`Wrote ${filePath} (${doc.content.length} chars)`);
}

console.log(`\nTotal: ${DOCS.length} clinical documents`);
console.log(`Output: ${OUT_DIR}/`);
