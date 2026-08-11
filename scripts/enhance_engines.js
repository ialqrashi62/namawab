#!/usr/bin/env node
// Enhance 10 priority engines with real clinical logic
// Pattern: nm-engine-pattern + production-ready algorithms
'use strict';
const fs = require('fs');
const path = require('path');

// ============================================================
// infectious_disease_engine.js — Sepsis, qSOFA, CURB-65, Wells DVT
// ============================================================
const infectious_disease_engine = `// filepath: namaweb/infectious_disease_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Sepsis-3 (Singer 2016)', 'CURB-65 (Lim 2003)', 'Wells DVT (2001)'];

function qSOFA(input) {
    const { respiratoryRate, systolicBP, alteredMentalStatus } = input;
    let score = 0;
    const components = {};
    if (respiratoryRate >= 22) { score++; components.respiratoryRate = 'high'; }
    if (systolicBP <= 100) { score++; components.systolicBP = 'low'; }
    if (alteredMentalStatus) { score++; components.mentalStatus = 'altered'; }
    let risk = 'low', rec = 'Reassess in 6h';
    if (score >= 2) { risk = 'high'; rec = 'Sepsis likely — escalate to ICU, blood cultures, broad-spectrum antibiotics within 1h'; }
    return { score, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

function curb65(input) {
    const { confusion, uremiaBUNgt19, respiratoryRate30, systolicBPlt90, diastolicBPlt60, age65 } = input;
    let score = 0;
    const components = {};
    if (confusion) { score++; components.confusion = true; }
    if (uremiaBUNgt19) { score++; components.uremia = 'BUN>19'; }
    if (respiratoryRate30) { score++; components.tachypnea = 'RR≥30'; }
    if (systolicBPlt90 || diastolicBPlt60) { score++; components.hypotension = true; }
    if (age65) { score++; components.age = '≥65'; }
    let risk = 'low', rec = 'Outpatient treatment';
    if (score === 1) { risk = 'low-moderate'; rec = 'Consider outpatient with follow-up'; }
    else if (score === 2) { risk = 'moderate'; rec = 'Admission for IV antibiotics recommended'; }
    else if (score >= 3) { risk = 'high'; rec = 'ICU admission, consider severe pneumonia'; }
    return { score, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function wellsDVT(input) {
    const { activeCancer, paralysisOrImmobilization, bedridden3Days, localizedTenderness, entireLegSwollen, calfSwelling3cm, pittingEdema, alternativeDiagnosis } = input;
    let score = 0;
    const components = {};
    if (activeCancer) { score += 1; components.cancer = true; }
    if (paralysisOrImmobilization) { score += 1; components.paralysis = true; }
    if (bedridden3Days) { score += 1; components.bedridden = true; }
    if (localizedTenderness) { score += 1; components.tenderness = true; }
    if (entireLegSwollen) { score += 1; components.entireLegSwollen = true; }
    if (calfSwelling3cm) { score += 1; components.calfSwelling = true; }
    if (pittingEdema) { score += 1; components.pittingEdema = true; }
    if (alternativeDiagnosis) { score -= 2; components.altDx = true; }
    let risk = 'low', rec = 'DVT unlikely';
    if (score >= 2) { risk = 'high'; rec = 'DVT likely — ultrasound + treatment'; }
    else if (score === 1) { risk = 'moderate'; rec = 'Consider ultrasound'; }
    return { score, max_score: 8, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { qSOFA, curb65, wellsDVT, VERSION, CITATIONS };
`;

// ============================================================
// neurology_engine.js — NIHSS, GCS, ABCD2
// ============================================================
const neurology_engine = `// filepath: namaweb/neurology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['NIHSS (NINDS 2003)', 'GCS (Teasdale 1974)', 'ABCD2 (Johnston 2007)'];

function gcs(input) {
    const { eye, verbal, motor } = input;
    if ([eye, verbal, motor].some(v => v === undefined || v < 1 || v > 6)) {
        return { error: 'invalid_gcs_components', valid: { eye: '1-4', verbal: '1-5', motor: '1-6' } };
    }
    const total = eye + verbal + motor;
    const components = { eye, verbal, motor };
    let risk = 'normal', rec = 'No intervention';
    if (total <= 8) { risk = 'severe'; rec = 'Intubate, ICU admission'; }
    else if (total <= 12) { risk = 'moderate'; rec = 'Close neurological monitoring'; }
    else if (total <= 14) { risk = 'mild'; rec = 'Frequent reassessment'; }
    return { score: total, max_score: 15, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function nihss(input) {
    const { consciousness, gaze, visualFields, facialPalsy, motorArm, motorLeg, ataxia, sensory, language, dysarthria, extinction } = input;
    const components = {};
    let score = 0;
    if (consciousness !== undefined) { score += consciousness; components.consciousness = consciousness; }
    if (gaze !== undefined) { score += gaze; components.gaze = gaze; }
    if (visualFields !== undefined) { score += visualFields; components.visualFields = visualFields; }
    if (facialPalsy !== undefined) { score += facialPalsy; components.facialPalsy = facialPalsy; }
    if (motorArm !== undefined) { score += motorArm; components.motorArm = motorArm; }
    if (motorLeg !== undefined) { score += motorLeg; components.motorLeg = motorLeg; }
    if (ataxia !== undefined) { score += ataxia; components.ataxia = ataxia; }
    if (sensory !== undefined) { score += sensory; components.sensory = sensory; }
    if (language !== undefined) { score += language; components.language = language; }
    if (dysarthria !== undefined) { score += dysarthria; components.dysarthria = dysarthria; }
    if (extinction !== undefined) { score += extinction; components.extinction = extinction; }
    let risk = 'none', rec = 'No stroke symptoms';
    if (score === 0) { risk = 'none'; rec = 'No stroke'; }
    else if (score <= 4) { risk = 'minor'; rec = 'Minor stroke — admit to stroke unit'; }
    else if (score <= 15) { risk = 'moderate'; rec = 'Moderate stroke — consider tPA if eligible'; }
    else if (score <= 20) { risk = 'severe'; rec = 'Severe stroke — tPA/thrombectomy evaluation'; }
    else { risk = 'very_severe'; rec = 'Critical stroke — ICU, intubation consideration'; }
    return { score, max_score: 42, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

function abcd2(input) {
    const { age, bloodPressure, clinicalFeatures, duration, diabetes } = input;
    let score = 0;
    const components = {};
    if (age >= 60) { score += 1; components.age = '≥60'; }
    if (bloodPressure.systolic >= 140 || bloodPressure.diastolic >= 90) { score += 1; components.bp = 'elevated'; }
    if (clinicalFeatures === 'unilateral') { score += 2; components.features = 'unilateral weakness'; }
    else if (clinicalFeatures === 'speech') { score += 1; components.features = 'speech disturbance'; }
    if (duration === '60min') { score += 2; components.duration = '≥60min'; }
    else if (duration === '10_59min') { score += 1; components.duration = '10-59min'; }
    if (diabetes) { score += 1; components.diabetes = true; }
    let risk = 'low', rec = 'Outpatient management';
    if (score >= 6) { risk = 'high'; rec = 'High stroke risk — admit, dual antiplatelet'; }
    else if (score >= 4) { risk = 'moderate'; rec = 'Urgent eval, consider admission'; }
    return { score, max_score: 7, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { gcs, nihss, abcd2, VERSION, CITATIONS };
`;

// ============================================================
// oncology_engine.js — ECOG, Karnofsky, TNM
// ============================================================
const oncology_engine = `// filepath: namaweb/oncology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ECOG (Oken 1982)', 'Karnofsky (1949)', 'AJCC TNM 8th'];

function ecog(input) {
    const { performance } = input;
    if (performance < 0 || performance > 4) return { error: 'invalid_ecog', valid: '0-4' };
    const levels = {
        0: 'Fully active, able to carry on all pre-disease performance without restriction',
        1: 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature',
        2: 'Ambulatory and capable of all self-care but unable to carry out any work activities; up and about more than 50% of waking hours',
        3: 'Capable of only limited self-care; confined to bed or chair more than 50% of waking hours',
        4: 'Completely disabled; cannot carry on any self-care; totally confined to bed or chair'
    };
    let risk = 'low', rec = 'Standard treatment';
    if (performance >= 3) { risk = 'high'; rec = 'Palliative care focus'; }
    else if (performance === 2) { risk = 'moderate'; rec = 'Reduced-dose chemotherapy'; }
    return { score: performance, max_score: 4, risk, recommendation: rec, description: levels[performance], components: { performance }, cite: CITATIONS[0], version: VERSION };
}

function karnofsky(input) {
    const { score } = input;
    if (score < 0 || score > 100 || score % 10 !== 0) return { error: 'invalid_karnofsky', valid: '0,10,20,...,100' };
    let risk = 'good', rec = 'Standard treatment';
    if (score < 50) { risk = 'poor'; rec = 'Hospice consideration'; }
    else if (score < 70) { risk = 'fair'; rec = 'Supportive care + treatment'; }
    return { score, max_score: 100, risk, recommendation: rec, components: { score }, cite: CITATIONS[1], version: VERSION };
}

function tnmStage(input) {
    const { tumor, node, metastasis } = input;
    let stage = '0';
    if (tumor === 'T0' || tumor === 'Tis') stage = '0';
    else if (metastasis === 'M1') stage = 'IV';
    else if (node === 'N3') stage = 'IIIB';
    else if (tumor === 'T4' || node === 'N2') stage = 'IIIA';
    else if (tumor === 'T3') stage = 'IIB';
    else if (tumor === 'T2') stage = 'IIA';
    else if (tumor === 'T1') stage = 'I';
    const stages = { '0': 'Carcinoma in situ', 'I': 'Early localized', 'IIA': 'Localized advanced', 'IIB': 'Locally advanced', 'IIIA': 'Regional advanced', 'IIIB': 'Heavily regional', 'IV': 'Metastatic' };
    return { tnm: { t: tumor, n: node, m: metastasis }, stage, description: stages[stage], risk: stage === 'IV' ? 'high' : 'moderate', recommendation: 'Multidisciplinary tumor board review', components: { tumor, node, metastasis }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { ecog, karnofsky, tnmStage, VERSION, CITATIONS };
`;

// ============================================================
// orthopedics_engine.js — WOMAC, KOOS-12, QuickDASH
// ============================================================
const orthopedics_engine = `// filepath: namaweb/orthopedics_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['WOMAC (Bellamy 1988)', 'KOOS-12 (Roos 1998)', 'QuickDASH (Beaton 2005)'];

function womac(input) {
    const { pain, stiffness, physicalFunction } = input;
    const total = (pain || 0) + (stiffness || 0) + (physicalFunction || 0);
    const pct = Math.round((total / 96) * 100);
    let risk = 'none', rec = 'No arthritis';
    if (pct > 50) { risk = 'severe'; rec = 'Total knee replacement consideration'; }
    else if (pct > 30) { risk = 'moderate'; rec = 'Physical therapy, NSAIDs'; }
    else if (pct > 10) { risk = 'mild'; rec = 'Lifestyle modification'; }
    return { score: total, max_score: 96, percent: pct, risk, recommendation: rec, components: { pain, stiffness, physicalFunction }, cite: CITATIONS[0], version: VERSION };
}

function quickDASH(input) {
    const { activities, symptoms, socialFunction } = input;
    const values = [activities, symptoms, socialFunction].filter(v => v !== undefined);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    let risk = 'none', rec = 'No disability';
    if (avg > 50) { risk = 'severe'; rec = 'Significant disability — surgical eval'; }
    else if (avg > 25) { risk = 'moderate'; rec = 'Occupational therapy'; }
    return { score: Math.round(avg), max_score: 100, risk, recommendation: rec, components: { activities, symptoms, socialFunction }, cite: CITATIONS[2], version: VERSION };
}

function koos12(input) {
    const { pain, function, qualityOfLife } = input;
    const avg = ((pain || 0) + (function || 0) + (qualityOfLife || 0)) / 3;
    let risk = 'good', rec = 'Knee OK';
    if (avg < 50) { risk = 'poor'; rec = 'Significant knee OA'; }
    else if (avg < 70) { risk = 'moderate'; rec = 'Knee therapy'; }
    return { score: Math.round(avg), max_score: 100, risk, recommendation: rec, components: { pain, function, qualityOfLife }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { womac, quickDASH, koos12, VERSION, CITATIONS };
`;

// ============================================================
// pediatrics_engine.js — Apgar, PEWS, Glasgow Modified
// ============================================================
const pediatrics_engine = `// filepath: namaweb/pediatrics_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Apgar (1953)', 'PEWS (Monaghan 2005)', 'GCS-Modified'];

function apgar(input) {
    const { appearance, pulse, grimace, activity, respiration } = input;
    if ([appearance, pulse, grimace, activity, respiration].some(v => v === undefined || v < 0 || v > 2)) {
        return { error: 'invalid_apgar', valid: '0-2 each' };
    }
    const total = appearance + pulse + grimace + activity + respiration;
    let risk = 'normal', rec = 'Routine care';
    if (total <= 3) { risk = 'critical'; rec = 'Immediate resuscitation'; }
    else if (total <= 6) { risk = 'moderate'; rec = 'Stimulation, oxygen'; }
    else if (total < 7) { risk = 'mild'; rec = 'Close monitoring'; }
    return { score: total, max_score: 10, risk, recommendation: rec, components: { appearance, pulse, grimace, activity, respiration }, cite: CITATIONS[0], version: VERSION };
}

function pews(input) {
    const { heartRate, respiratoryRate, oxygenSaturation, oxygenSupport, consciousness, nurseConcern } = input;
    let score = 0;
    const components = {};
    if (heartRate) { score += heartRate; components.heartRate = heartRate; }
    if (respiratoryRate) { score += respiratoryRate; components.respiratoryRate = respiratoryRate; }
    if (oxygenSaturation) { score += oxygenSaturation; components.spo2 = oxygenSaturation; }
    if (oxygenSupport) { score += oxygenSupport; components.oxygenSupport = oxygenSupport; }
    if (consciousness) { score += consciousness; components.consciousness = consciousness; }
    if (nurseConcern) { score += nurseConcern; components.nurseConcern = nurseConcern; }
    let risk = 'low', rec = 'Routine monitoring';
    if (score >= 5) { risk = 'high'; rec = 'ICU/HDU admission'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Increase monitoring frequency'; }
    return { score, max_score: 14, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function gcsPediatric(input) {
    const { eye, verbal, motor } = input;
    if ([eye, verbal, motor].some(v => v === undefined)) return { error: 'invalid_gcs_pediatric' };
    const total = eye + verbal + motor;
    let risk = 'normal', rec = 'No intervention';
    if (total <= 8) { risk = 'severe'; rec = 'ICU, intubation'; }
    else if (total <= 12) { risk = 'moderate'; rec = 'Close monitoring'; }
    return { score: total, max_score: 15, risk, recommendation: rec, components: { eye, verbal, motor }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { apgar, pews, gcsPediatric, VERSION, CITATIONS };
`;

// ============================================================
// psychiatry_engine.js — PHQ-9, GAD-7, Columbia Suicide
// ============================================================
const psychiatry_engine = `// filepath: namaweb/psychiatry_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PHQ-9 (Kroenke 2001)', 'GAD-7 (Spitzer 2006)', 'C-SSRS (Posner 2011)'];

function phq9(input) {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9 } = input;
    const items = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
    if (items.some(v => v === undefined || v < 0 || v > 3)) return { error: 'invalid_phq9', valid: '0-3 each' };
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'No treatment';
    if (total >= 20) { risk = 'severe'; rec = 'SSRI + CBT, frequent follow-up'; }
    else if (total >= 15) { risk = 'moderately_severe'; rec = 'SSRI or CBT'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'CBT, consider SSRI'; }
    else if (total >= 5) { risk = 'mild'; rec = 'Watchful waiting'; }
    return { score: total, max_score: 27, risk, recommendation: rec, components: { q1, q2, q3, q4, q5, q6, q7, q8, q9 }, cite: CITATIONS[0], version: VERSION };
}

function gad7(input) {
    const { q1, q2, q3, q4, q5, q6, q7 } = input;
    const items = [q1, q2, q3, q4, q5, q6, q7];
    if (items.some(v => v === undefined || v < 0 || v > 3)) return { error: 'invalid_gad7', valid: '0-3 each' };
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'No anxiety';
    if (total >= 15) { risk = 'severe'; rec = 'SSRI + CBT, consider referral'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'CBT, possibly SSRI'; }
    else if (total >= 5) { risk = 'mild'; rec = 'Monitor, relaxation techniques'; }
    return { score: total, max_score: 21, risk, recommendation: rec, components: { q1, q2, q3, q4, q5, q6, q7 }, cite: CITATIONS[1], version: VERSION };
}

function cssrs(input) {
    const { passiveIdeation, activeIdeation, plan, intent, behavior, timeFrame } = input;
    let score = 0;
    const components = {};
    if (passiveIdeation) { score += 1; components.passiveIdeation = true; }
    if (activeIdeation) { score += 2; components.activeIdeation = true; }
    if (plan) { score += 3; components.plan = true; }
    if (intent) { score += 4; components.intent = true; }
    if (behavior) { score += 5; components.behavior = true; }
    let risk = 'low', rec = 'Routine care';
    if (behavior || intent) { risk = 'imminent'; rec = 'IMMEDIATE: 1:1 sitter, hospitalization, safety plan'; }
    else if (plan) { risk = 'high'; rec = 'Same-day evaluation, restrict means'; }
    else if (activeIdeation) { risk = 'moderate'; rec = 'Safety plan, frequent follow-up'; }
    else if (passiveIdeation) { risk = 'low-moderate'; rec = 'Safety plan'; }
    return { score, max_score: 15, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { phq9, gad7, cssrs, VERSION, CITATIONS };
`;

// ============================================================
// radiology_engine.js — BIRADS, Lung-RADS, TI-RADS
// ============================================================
const radiology_engine = `// filepath: namaweb/radiology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['BI-RADS (ACR 2013)', 'Lung-RADS (ACR 2014)', 'TI-RADS (ACR 2017)'];

function birads(input) {
    const { assessment, density } = input;
    const cat = ['0', '1', '2', '3', '4', '5', '6'];
    if (!cat.includes(String(assessment))) return { error: 'invalid_birads', valid: '0-6' };
    const recs = {
        '0': 'Incomplete — additional imaging needed',
        '1': 'Negative — routine screening',
        '2': 'Benign — routine screening',
        '3': 'Probably benign — 6-month follow-up',
        '4': 'Suspicious — biopsy consideration',
        '5': 'Highly suggestive — biopsy/treatment',
        '6': 'Known biopsy-proven malignancy'
    };
    const risk = ['1', '2'].includes(String(assessment)) ? 'low' : (String(assessment) === '3' ? 'low-moderate' : 'high');
    return { score: Number(assessment), max_score: 6, risk, recommendation: recs[String(assessment)], components: { assessment, density }, cite: CITATIONS[0], version: VERSION };
}

function lungRADS(input) {
    const { noduleSize, density } = input;
    let score = 0;
    const components = {};
    if (noduleSize !== undefined) {
        score = Math.round(noduleSize);
        components.size = noduleSize;
        components.density = density;
    }
    let risk = 'low', rec = 'Routine annual screening';
    if (noduleSize >= 30) { risk = 'high'; rec = 'PET/CT, biopsy consideration'; }
    else if (noduleSize >= 8) { risk = 'moderate'; rec = '3-month LDCT'; }
    else if (noduleSize >= 6) { risk = 'low-moderate'; rec = '6-month LDCT'; }
    return { score, max_score: 100, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function tirads(input) {
    const { composition, echogenicity, shape, margin, echogenicFoci } = input;
    let score = 0;
    const components = {};
    if (composition === 'solid') { score += 2; components.composition = 'solid'; }
    else if (composition === 'mixed') { score += 1; components.composition = 'mixed'; }
    if (echogenicity === 'hypoechoic') { score += 2; components.echogenicity = 'hypoechoic'; }
    if (shape === 'taller_than_wide') { score += 3; components.shape = 'taller_than_wide'; }
    if (margin === 'irregular') { score += 2; components.margin = 'irregular'; }
    if (echogenicFoci === 'microcalcifications') { score += 3; components.echoFoci = 'microcalcifications'; }
    else if (echogenicFoci === 'macrocalcifications') { score += 1; components.echoFoci = 'macrocalcifications'; }
    let risk = 'low', rec = 'No FNA';
    if (score >= 7) { risk = 'high'; rec = 'FNA if ≥1cm'; }
    else if (score >= 4) { risk = 'moderate'; rec = 'FNA if ≥1.5cm'; }
    else if (score > 0) { risk = 'low-moderate'; rec = 'FNA if ≥2.5cm'; }
    return { score, max_score: 13, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { birads, lungRADS, tirads, VERSION, CITATIONS };
`;

// ============================================================
// icu_engine.js — APACHE II, SOFA, RASS
// ============================================================
const icu_engine = `// filepath: namaweb/icu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['APACHE II (Knaus 1985)', 'SOFA (Vincent 1996)', 'RASS (Sessler 2002)'];

function sofa(input) {
    const { pao2FiO2, platelets, bilirubin, map, gcs, creatinine, dopamineDobutamine, epinephrineNorepinephrine } = input;
    let score = 0;
    const components = {};
    if (pao2FiO2 !== undefined) {
        let p = 0;
        if (pao2FiO2 < 100) p = 4;
        else if (pao2FiO2 < 200) p = 3;
        else if (pao2FiO2 < 300) p = 2;
        else if (pao2FiO2 < 400) p = 1;
        score += p;
        components.pao2FiO2 = p;
    }
    if (platelets !== undefined) {
        let p = 0;
        if (platelets < 20) p = 4;
        else if (platelets < 50) p = 3;
        else if (platelets < 100) p = 2;
        else if (platelets < 150) p = 1;
        score += p;
        components.platelets = p;
    }
    if (bilirubin !== undefined) {
        let p = 0;
        if (bilirubin >= 12) p = 4;
        else if (bilirubin >= 6) p = 3;
        else if (bilirubin >= 2) p = 2;
        else if (bilirubin >= 1.2) p = 1;
        score += p;
        components.bilirubin = p;
    }
    if (map !== undefined) {
        let p = (map < 70) ? 1 : 0;
        score += p;
        components.map = p;
    }
    if (gcs !== undefined) {
        let p = 0;
        if (gcs < 6) p = 4;
        else if (gcs < 9) p = 3;
        else if (gcs < 12) p = 2;
        else if (gcs < 14) p = 1;
        score += p;
        components.gcs = p;
    }
    if (creatinine !== undefined) {
        let p = 0;
        if (creatinine >= 5) p = 4;
        else if (creatinine >= 3.5) p = 3;
        else if (creatinine >= 2) p = 2;
        else if (creatinine >= 1.2) p = 1;
        score += p;
        components.creatinine = p;
    }
    if (epinephrineNorepinephrine > 0) { score += 4; components.vasoactive = 4; }
    else if (dopamineDobutamine > 0) { score += 2; components.vasoactive = 2; }
    let risk = 'low', rec = 'Continue monitoring';
    if (score >= 15) { risk = 'very_high'; rec = 'Mortality risk ~80% — aggressive care discussion'; }
    else if (score >= 10) { risk = 'high'; rec = 'Mortality risk ~40% — close monitoring'; }
    else if (score >= 5) { risk = 'moderate'; rec = 'Mortality risk ~20%'; }
    return { score, max_score: 24, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function rass(input) {
    const { score } = input;
    if (score < -5 || score > 4) return { error: 'invalid_rass', valid: '-5 to +4' };
    const levels = { '-5': 'Unarousable', '-4': 'Deep sedation', '-3': 'Moderate sedation', '-2': 'Light sedation', '-1': 'Drowsy', '0': 'Alert and calm', '1': 'Restless', '2': 'Agitated', '3': 'Very agitated', '4': 'Combative' };
    let rec = 'Continue';
    if (score <= -2) rec = 'Lighten sedation, daily SAT/SBT';
    else if (score >= 2) rec = 'Increase sedation, consider restraints';
    else if (score === 0) rec = 'Target achieved';
    return { score, max_score: 4, min_score: -5, risk: score === 0 ? 'optimal' : 'suboptimal', recommendation: rec, description: levels[String(score)], components: { score }, cite: CITATIONS[2], version: VERSION };
}

function apacheII(input) {
    const { age, chronicHealth, temperature, map, heartRate, respiratoryRate, oxygenation, ph, sodium, potassium, creatinine, hematocrit, wbc, gcs } = input;
    let score = 0;
    const components = {};
    if (age !== undefined) {
        let a = 0;
        if (age >= 75) a = 6;
        else if (age >= 65) a = 5;
        else if (age >= 55) a = 3;
        else if (age >= 45) a = 2;
        score += a;
        components.age = a;
    }
    if (chronicHealth !== undefined) { score += chronicHealth; components.chronicHealth = chronicHealth; }
    if (temperature !== undefined) {
        let t = 0;
        if (temperature >= 41 || temperature < 30) t = 4;
        else if (temperature >= 39 || temperature < 32) t = 3;
        else if (temperature >= 38.5 || temperature < 34) t = 1;
        score += t;
        components.temperature = t;
    }
    if (map !== undefined) {
        let m = 0;
        if (map >= 160 || map < 50) m = 4;
        else if (map >= 130 || map < 70) m = 2;
        score += m;
        components.map = m;
    }
    if (heartRate !== undefined) {
        let h = 0;
        if (heartRate >= 180 || heartRate < 40) h = 4;
        else if (heartRate >= 140 || heartRate < 55) h = 3;
        else if (heartRate >= 110) h = 2;
        score += h;
        components.heartRate = h;
    }
    if (respiratoryRate !== undefined) {
        let r = 0;
        if (respiratoryRate >= 50 || respiratoryRate < 6) r = 4;
        else if (respiratoryRate >= 35) r = 3;
        else if (respiratoryRate >= 25) r = 1;
        score += r;
        components.respiratoryRate = r;
    }
    if (ph !== undefined) {
        let p = 0;
        if (ph >= 7.7 || ph < 7.15) p = 4;
        else if (ph >= 7.6 || ph < 7.25) p = 3;
        else if (ph < 7.33) p = 2;
        score += p;
        components.ph = p;
    }
    if (sodium !== undefined) {
        let s = 0;
        if (sodium >= 180 || sodium < 111) s = 4;
        else if (sodium >= 160 || sodium < 120) s = 3;
        else if (sodium >= 155 || sodium < 130) s = 2;
        else if (sodium >= 150) s = 1;
        score += s;
        components.sodium = s;
    }
    if (potassium !== undefined) {
        let k = 0;
        if (potassium >= 7 || potassium < 2.5) k = 4;
        else if (potassium >= 6 || potassium < 3) k = 3;
        score += k;
        components.potassium = k;
    }
    if (creatinine !== undefined) {
        let c = (creatinine >= 3.5) ? 4 : (creatinine >= 2) ? 3 : (creatinine >= 1.5) ? 2 : 0;
        score += c;
        components.creatinine = c;
    }
    if (hematocrit !== undefined) {
        let h = 0;
        if (hematocrit >= 60 || hematocrit < 20) h = 4;
        else if (hematocrit >= 50 || hematocrit < 30) h = 2;
        score += h;
        components.hematocrit = h;
    }
    if (wbc !== undefined) {
        let w = 0;
        if (wbc >= 40 || wbc < 1) w = 4;
        else if (wbc >= 20 || wbc < 3) w = 2;
        score += w;
        components.wbc = w;
    }
    if (gcs !== undefined) { score += (15 - gcs); components.gcs = 15 - gcs; }
    let risk = 'low', rec = 'Continue care';
    if (score >= 35) { risk = 'very_high'; rec = 'Mortality risk >80%'; }
    else if (score >= 25) { risk = 'high'; rec = 'Mortality risk ~50%'; }
    else if (score >= 15) { risk = 'moderate'; rec = 'Mortality risk ~15%'; }
    return { score, max_score: 71, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

module.exports = { sofa, apacheII, rass, VERSION, CITATIONS };
`;

// ============================================================
// emergency_engine.js — MEWS, ESI, NEXUS C-Spine
// ============================================================
const emergency_engine = `// filepath: namaweb/emergency_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['MEWS (Subbe 2001)', 'ESI (Gilboy 2011)', 'NEXUS (Hoffman 2000)'];

function mews(input) {
    const { systolicBP, heartRate, respiratoryRate, temperature, consciousness } = input;
    let score = 0;
    const components = {};
    if (systolicBP !== undefined) {
        let p = 0;
        if (systolicBP < 70) p = 3;
        else if (systolicBP < 80) p = 2;
        else if (systolicBP < 100) p = 1;
        else if (systolicBP > 200) p = 2;
        score += p;
        components.systolicBP = p;
    }
    if (heartRate !== undefined) {
        let h = 0;
        if (heartRate < 40) h = 2;
        else if (heartRate < 50) h = 1;
        else if (heartRate > 130) h = 3;
        else if (heartRate > 110) h = 2;
        else if (heartRate > 100) h = 1;
        score += h;
        components.heartRate = h;
    }
    if (respiratoryRate !== undefined) {
        let r = 0;
        if (respiratoryRate < 8) r = 2;
        else if (respiratoryRate > 30) r = 3;
        else if (respiratoryRate > 20) r = 1;
        score += r;
        components.respiratoryRate = r;
    }
    if (temperature !== undefined) {
        let t = 0;
        if (temperature < 35) t = 2;
        else if (temperature > 38.5) t = 2;
        score += t;
        components.temperature = t;
    }
    if (consciousness && consciousness !== 'alert') { score += 3; components.consciousness = 3; }
    let risk = 'low', rec = 'Routine monitoring';
    if (score >= 5) { risk = 'high'; rec = 'ICU admission, immediate intervention'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Urgent medical review'; }
    return { score, max_score: 14, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

function esi(input) {
    const { resourceNeeds, dangerZone, vitalSigns } = input;
    let level = 5;
    if (dangerZone) { level = 1; }
    else if (vitalSigns === 'severely_abnormal') { level = 2; }
    else if (resourceNeeds === 'none') { level = 5; }
    else if (resourceNeeds === 'one') { level = 4; }
    else if (resourceNeeds === 'two') { level = 3; }
    return { score: level, max_score: 5, risk: level === 1 ? 'critical' : (level <= 2 ? 'high' : 'moderate'), recommendation: level === 1 ? 'Immediate resuscitation' : (level === 2 ? 'High acuity — bed immediately' : 'Standard triage'), components: { resourceNeeds, dangerZone, vitalSigns }, cite: CITATIONS[1], version: VERSION };
}

function nexusCSpine(input) {
    const { midlineTenderness, focalNeurologicDeficit, alteredConsciousness, intoxication, distractingInjury } = input;
    const safe = !midlineTenderness && !focalNeurologicDeficit && !alteredConsciousness && !intoxication && !distractingInjury;
    return { score: safe ? 0 : 1, risk: safe ? 'low' : 'high', recommendation: safe ? 'Imaging NOT required' : 'CT or x-ray required', components: { midlineTenderness, focalNeurologicDeficit, alteredConsciousness, intoxication, distractingInjury, canClear: safe }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { mews, esi, nexusCSpine, VERSION, CITATIONS };
`;

// ============================================================
// surgery_engine.js — ASA, Caprini, Revised Cardiac Risk
// ============================================================
const surgery_engine = `// filepath: namaweb/surgery_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ASA (1963)', 'Caprini (2005)', 'RCRI (Lee 1999)'];

function asa(input) {
    const { class: asaClass } = input;
    if (asaClass < 1 || asaClass > 6) return { error: 'invalid_asa', valid: '1-6' };
    const levels = { 1: 'Healthy patient', 2: 'Mild systemic disease', 3: 'Severe systemic disease', 4: 'Severe systemic disease, constant threat to life', 5: 'Moribund patient', 6: 'Brain-dead organ donor' };
    let risk = 'low', rec = 'Standard';
    if (asaClass >= 4) { risk = 'high'; rec = 'ICU post-op'; }
    else if (asaClass === 3) { risk = 'moderate'; rec = 'Close monitoring'; }
    return { score: asaClass, max_score: 6, risk, recommendation: rec, description: levels[asaClass], components: { class: asaClass }, cite: CITATIONS[0], version: VERSION };
}

function caprini(input) {
    const { age, sex, surgeryType, mobility, riskFactors } = input;
    let score = 0;
    const components = {};
    if (age >= 75) { score += 3; components.age = '≥75'; }
    else if (age >= 60) { score += 2; components.age = '60-74'; }
    else if (age >= 40) { score += 1; components.age = '40-59'; }
    if (surgeryType === 'major') { score += 2; components.surgery = 'major'; }
    if (mobility === 'bedrest') { score += 1; components.mobility = 'bedrest'; }
    if (riskFactors && Array.isArray(riskFactors)) {
        for (const rf of riskFactors) {
            if (['cancer', 'chemo', 'vte_history', 'family_vte', 'obesity', 'smoking', 'varicose_veins', 'oral_contraceptives'].includes(rf)) {
                score += 1;
                components[rf] = 1;
            }
        }
    }
    let risk = 'low', rec = 'Early ambulation';
    if (score >= 5) { risk = 'very_high'; rec = 'Extend LMWH prophylaxis 30 days'; }
    else if (score >= 3) { risk = 'high'; rec = 'LMWH prophylaxis'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Heparin prophylaxis'; }
    return { score, max_score: 20, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function rcri(input) {
    const { highRiskSurgery, ischemicHeartDisease, heartFailure, cerebrovascularDisease, diabetesOnInsulin, crf } = input;
    let score = 0;
    const components = {};
    if (highRiskSurgery) { score += 1; components.highRiskSurgery = true; }
    if (ischemicHeartDisease) { score += 1; components.ihd = true; }
    if (heartFailure) { score += 1; components.chf = true; }
    if (cerebrovascularDisease) { score += 1; components.cvd = true; }
    if (diabetesOnInsulin) { score += 1; components.diabetes = true; }
    if (crf) { score += 1; components.crf = true; }
    let risk = 'low', rec = 'Standard perioperative care';
    if (score >= 3) { risk = 'high'; rec = 'Cardiology consult, consider stress test'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Beta-blocker consideration'; }
    return { score, max_score: 6, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { asa, caprini, rcri, VERSION, CITATIONS };
`;

// Write all 10 engines
const newEngines = {
    infectious_disease: infectious_disease_engine,
    neurology: neurology_engine,
    oncology: oncology_engine,
    orthopedics: orthopedics_engine,
    pediatrics: pediatrics_engine,
    psychiatry: psychiatry_engine,
    radiology: radiology_engine,
    icu: icu_engine,
    emergency: emergency_engine,
    surgery: surgery_engine,
};

let count = 0;
for (const [dept, code] of Object.entries(newEngines)) {
    const filePath = `namaweb/${dept}_engine.js`;
    if (!fs.existsSync(filePath)) {
        console.log(`Skipped ${dept} (file not found)`);
        continue;
    }
    const stats = fs.statSync(filePath);
    if (stats.size < 5000) {
        fs.writeFileSync(filePath, code);
        count++;
        console.log(`Enhanced ${dept}_engine.js (${code.length} bytes)`);
    } else {
        console.log(`Skipped ${dept} (already large: ${stats.size} bytes)`);
    }
}
console.log(`\nTotal enhanced: ${count}/10 engines`);
