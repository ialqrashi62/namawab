// filepath: namaweb/neurology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['NIHSS (NINDS 2003)', 'GCS (Teasdale 1974)', 'ABCD2 (Johnston 2007)', 'AAN 2023', 'MoCA 2005'];

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

function mocaScore(input) {
    const { visuospatial, naming, attention, language, abstraction, delayedRecall, orientation, educationYears } = input;
    let score = (visuospatial ?? 0) + (naming ?? 0) + (attention ?? 0) + (language ?? 0) + (abstraction ?? 0) + (delayedRecall ?? 0) + (orientation ?? 0);
    if ((educationYears ?? 0) <= 12) score += 1;
    const total = Math.min(score, 30);
    let risk = 'normal', rec = 'Normal cognition';
    if (total < 10) { risk = 'severe_impairment'; rec = 'Dementia evaluation'; }
    else if (total < 18) { risk = 'moderate'; rec = 'Comprehensive cognitive workup'; }
    else if (total < 26) { risk = 'mild'; rec = 'MCI — follow up, vasc risk reduction'; }
    return { score: total, max_score: 30, risk, recommendation: rec, components: { visuospatial, naming, attention, language, abstraction, delayedRecall, orientation, education_correction: (educationYears ?? 0) <= 12 ? 1 : 0 }, cite: CITATIONS[4], version: VERSION };
}

function rankinScore(input) {
    const { disabilityGrade } = input;
    const g = disabilityGrade ?? 0;
    if (g < 0 || g > 6) return { error: 'invalid_rankin', valid: '0-6' };
    const desc = { 0: 'No symptoms', 1: 'No significant disability despite symptoms', 2: 'Slight disability — independent in daily activities', 3: 'Moderate disability — requires some help', 4: 'Moderately severe disability — unable to attend to own bodily needs without assistance', 5: 'Severe disability — bedridden, incontinent, requires constant care', 6: 'Dead' };
    let risk = 'good', rec = 'No significant disability';
    if (g >= 5) { risk = 'severe'; rec = 'Chronic care; full dependency'; }
    else if (g >= 3) { risk = 'significant'; rec = 'Rehab, social support'; }
    return { score: g, max_score: 6, risk, recommendation: rec, description: desc[g], components: { g }, cite: CITATIONS[3], version: VERSION };
}

module.exports = {
    gcs, nihss, abcd2, mocaScore, rankinScore,
    VERSION, CITATIONS
};
