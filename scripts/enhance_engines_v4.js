#!/usr/bin/env node
// Wave 6A: Implement real clinical logic for 10 more engines
'use strict';
const fs = require('fs');

// ============================================================
// dialysis_engine.js — Kt/V, URR, UF target
// ============================================================
const dialysis_engine = `// filepath: namaweb/dialysis_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Daugirdas 1993', 'NKF KDOQI 2020'];

function ktv(input) {
    const { preBUN, postBUN, treatmentHours, weightLoss } = input;
    if (!preBUN || !postBUN || !treatmentHours) return { error: 'missing_bun_hours' };
    const l = preBUN - postBUN;
    const r = Math.log(preBUN / postBUN);
    const ultrafiltration = weightLoss ?? 0;
    const ktv = (l) * r / treatmentHours + (ultrafiltration * 0.008 / treatmentHours);
    const score = Math.round(ktv * 100) / 100;
    let risk = 'inadequate', rec = 'Inadequate dialysis';
    if (ktv >= 1.4) { risk = 'adequate'; rec = 'Good dialysis'; }
    else if (ktv >= 1.2) { risk = 'acceptable'; rec = 'Adequate'; }
    return { score, risk, recommendation: rec, components: { preBUN, postBUN, treatmentHours, weightLoss }, cite: CITATIONS[0], version: VERSION };
}

function ureaReductionRatio(input) {
    const { preBUN, postBUN } = input;
    if (!preBUN || !postBUN) return { error: 'missing_bun' };
    const urr = (1 - preBUN / postBUN) * 100;
    const score = Math.round(urr * 10) / 10;
    let risk = 'inadequate', rec = 'Increase dialysis';
    if (urr >= 70) { risk = 'adequate'; rec = 'Good dialysis'; }
    else if (urr >= 65) { risk = 'acceptable'; rec = 'Adequate'; }
    return { score, risk, recommendation: rec, components: { preBUN, postBUN }, cite: CITATIONS[1], version: VERSION };
}

function ultrafiltrationTarget(input) {
    const { preWeight, dryWeight, hours } = input;
    if (!preWeight || !dryWeight) return { error: 'missing_weights' };
    const targetUF = preWeight - dryWeight;
    const maxRate = 1.5;
    const maxSafeLoss = maxRate * hours;
    const score = targetUF;
    let risk = 'safe', rec = 'Within safe UF rate';
    if (targetUF > maxSafeLoss) { risk = 'unsafe'; rec = 'Reduce UF or extend treatment time'; }
    return { score, max_safe_loss_kg: maxSafeLoss, risk, recommendation: rec, components: { preWeight, dryWeight, hours }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { ktv, ureaReductionRatio, ultrafiltrationTarget, VERSION, CITATIONS };
`;

// ============================================================
// maternal_fetal_engine.js — Bishop score, GBS screening
// ============================================================
const maternal_fetal_engine = `// filepath: namaweb/maternal_fetal_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Bishop 1964', 'ACOG 2019'];

function bishopScore(input) {
    const { dilation, effacement, station, position, consistency } = input;
    let score = 0;
    const c = {};
    if (dilation !== undefined) {
        if (dilation >= 4) score += 2;
        else if (dilation >= 2) score += 1;
        else if (dilation >= 1) score += 0;
        c.dilation = dilation;
    }
    if (effacement !== undefined) {
        if (effacement >= 80) score += 2;
        else if (effacement >= 50) score += 1;
        c.effacement = effacement;
    }
    if (station !== undefined) {
        if (station <= -2) score += 2;
        else if (station <= -1) score += 1;
        c.station = station;
    }
    if (position === 'anterior') { score += 2; c.position = 'anterior'; }
    else if (position === 'mid') { score += 1; c.position = 'mid'; }
    if (consistency === 'soft') { score += 2; c.consistency = 'soft'; }
    else if (consistency === 'medium') { score += 1; c.consistency = 'medium'; }
    let risk = 'unfavorable', rec = 'Not suitable for induction';
    if (score >= 8) { risk = 'favorable'; rec = 'Ready for induction'; }
    else if (score >= 6) { risk = 'favorable'; rec = 'Likely to deliver with induction'; }
    return { score, max_score: 13, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function gbsScreening(input) {
    const { gestation, gbsStatus, priorInfant, priorGBS, screen35 } = input;
    let score = 0;
    const c = {};
    if (gbsStatus === 'positive') { score += 3; c.positive = 3; }
    if (priorInfant) { score += 2; c.priorInfant = 2; }
    if (priorGBS) { score += 1; c.priorGBS = 1; }
    if (gestation < 37) { score += 1; c.preterm = 1; }
    if (screen35 === 'inadequate') { score += 1; c.inadequate = 1; }
    let risk = 'low', rec = 'No antibiotic needed';
    if (score >= 2) { risk = 'high'; rec = 'IV penicillin G in labor'; }
    return { score, risk, recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { bishopScore, gbsScreening, VERSION, CITATIONS };
`;

// ============================================================
// neonatal_engine.js
// ============================================================
const neonatal_engine = `// filepath: namaweb/neonatal_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Apgar 1953', 'CRIB-II 2003'];

function apgarScore(input) {
    const { appearance, pulse, grimace, activity, respiration } = input;
    const items = [appearance, pulse, grimace, activity, respiration];
    if (items.some(v => v === undefined || v < 0 || v > 2)) return { error: 'invalid_apgar' };
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'normal', rec = 'Routine care';
    if (total <= 3) { risk = 'critical'; rec = 'Immediate resuscitation'; }
    else if (total <= 6) { risk = 'moderate'; rec = 'Stimulation, oxygen'; }
    return { score: total, max_score: 10, risk, recommendation: rec, components: { appearance, pulse, grimace, activity, respiration }, cite: CITATIONS[0], version: VERSION };
}

function crbII(input) {
    const { gestationalAge, birthWeight, baseExcess, temperatureNICU } = input;
    let score = 0;
    if (gestationalAge < 24) score += 28;
    else if (gestationalAge < 26) score += 20;
    else if (gestationalAge < 28) score += 12;
    else if (gestationalAge < 30) score += 5;
    if (birthWeight < 500) score += 22;
    else if (birthWeight < 750) score += 17;
    else if (birthWeight < 1000) score += 12;
    else if (birthWeight < 1500) score += 6;
    if (baseExcess < -20) score += 16;
    else if (baseExcess < -15) score += 12;
    else if (baseExcess < -10) score += 8;
    else if (baseExcess < -5) score += 4;
    if (temperatureNICU < 32) score += 5;
    else if (temperatureNICU < 35) score += 3;
    return { score, max_score: 71, risk: score >= 30 ? 'high' : 'moderate', recommendation: 'NICU admission', components: { gestationalAge, birthWeight, baseExcess, temperatureNICU }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { apgarScore, crbII, VERSION, CITATIONS };
`;

// ============================================================
// neurosurgery_engine.js — GCS, Hunt-Hess, ICH score
// ============================================================
const neurosurgery_engine = `// filepath: namaweb/neurosurgery_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Hunt-Hess 1968', 'ICH 2013', 'Marshall 1991'];

function huntHess(input) {
    const { grade } = input;
    if (grade === undefined || grade < 1 || grade > 5) return { error: 'invalid_grade', valid: '1-5' };
    const desc = { 1: 'Asymptomatic/minimal HA', 2: 'Moderate-severe HA, nuchal rigidity', 3: 'Lethargy, mild neuro deficit', 4: 'Stupor, severe deficit', 5: 'Coma, decerebrate posture' };
    let risk = 'low', rec = 'Close monitoring';
    if (grade >= 4) { risk = 'very_high'; rec = 'Urgent intervention'; }
    else if (grade >= 3) { risk = 'high'; rec = 'ICU, urgent surgery eval'; }
    return { score: grade, max_score: 5, risk, recommendation: rec, description: desc[grade], components: { grade }, cite: CITATIONS[0], version: VERSION };
}

function ichScore(input) {
    const { age, gcs, ichVolume, ivhOrLocation } = input;
    let score = 0;
    if (age >= 80) score += 2;
    else if (age >= 65) score += 1;
    if (gcs >= 13) score += 0;
    else if (gcs >= 5) score += 1;
    else score += 2;
    if (ichVolume >= 30) score += 1;
    if (ivhOrLocation === 'infratentorial') score += 1;
    let risk = 'low', rec = 'Close monitoring';
    if (score >= 4) { risk = 'very_high'; rec = 'Mortality >50%'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'ICU'; }
    return { score, max_score: 6, risk, recommendation: rec, components: { age, gcs, ichVolume, ivhOrLocation }, cite: CITATIONS[1], version: VERSION };
}

function marshallScore(input) {
    const { ctCategory } = input;
    const desc = { 1: 'No visible intracranial pathology', 2: 'Cisterns present, midline shift 0-5mm', 3: 'Cisterns absent, midline shift 0-5mm', 4: 'Midline shift >5mm', 5: 'Surgical mass lesion', 6: 'High- or mixed-density mass >25cc' };
    if (ctCategory === undefined || ctCategory < 1 || ctCategory > 6) return { error: 'invalid_marshall', valid: '1-6' };
    let risk = 'low', rec = 'Standard care';
    if (ctCategory >= 4) { risk = 'high'; rec = 'Surgical intervention'; }
    return { score: ctCategory, max_score: 6, risk, recommendation: rec, description: desc[ctCategory], components: { ctCategory }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { huntHess, ichScore, marshallScore, VERSION, CITATIONS };
`;

// ============================================================
// nicu_engine.js — Apgar, SNAP, NTISS
// ============================================================
const nicu_engine = `// filepath: namaweb/nicu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['SNAP 1993', 'Apgar 1953'];

function snapScore(input) {
    const { meanBP, temp, fio2, PO2, PCO2, O2Index, baseExcess, urineOutput, seizures, bowelSounds, weight } = input;
    let score = 0;
    if (meanBP < 30) score += 3;
    if (temp < 35 || temp > 38) score += 2;
    if (fio2 > 60) score += 2;
    if (PO2 < 50) score += 2;
    if (PCO2 > 60) score += 1;
    if (O2Index > 0.5) score += 2;
    if (baseExcess < -10) score += 2;
    if (urineOutput < 1) score += 2;
    if (seizures) score += 2;
    if (bowelSounds === 'absent') score += 1;
    if (weight < 1000) score += 2;
    let risk = 'low', rec = 'Standard care';
    if (score >= 10) { risk = 'very_high'; rec = 'Mortality >50%'; }
    else if (score >= 5) { risk = 'moderate'; rec = 'Close monitoring'; }
    return { score, max_score: 21, risk, recommendation: rec, components: { meanBP, temp, fio2, PO2, PCO2, O2Index, baseExcess, urineOutput, seizures, bowelSounds, weight }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { snapScore, VERSION, CITATIONS };
`;

// ============================================================
// occupational_therapy_engine.js — Berg balance, FIM
// ============================================================
const occupational_therapy_engine = `// filepath: namaweb/occupational_therapy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Berg 1989', 'FIM 1987'];

function bergBalance(input) {
    const items = ['sitting', 'standing', 'sittingToStanding', 'standingToSitting', 'transfers', 'eyesClosed', 'feetTogether', 'tandemStanding', 'singleLeg', 'reachingForward', 'pickingUp', 'turningToLook', 'turning360', 'alternatingFeet', 'standingOneLeg'];
    const scores = items.map(k => input[k] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Independent';
    if (total < 20) { risk = 'high'; rec = 'Wheelchair-bound'; }
    else if (total < 40) { risk = 'moderate'; rec = 'High fall risk'; }
    return { score: total, max_score: 56, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[0], version: VERSION };
}

function fimScore(input) {
    const items = ['eating', 'grooming', 'bathing', 'dressingUpper', 'dressingLower', 'toileting', 'bladder', 'bowel', 'chairTransfer', 'toiletTransfer', 'tubShower', 'walking', 'stairs', 'comprehension', 'expression', 'socialInteraction', 'problemSolving', 'memory'];
    const scores = items.map(k => input[k] || 1);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Independent';
    if (total < 36) { risk = 'very_high'; rec = 'Total dependence'; }
    else if (total < 72) { risk = 'moderate'; rec = 'Needs assistance'; }
    return { score: total, max_score: 126, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { bergBalance, fimScore, VERSION, CITATIONS };
`;

// ============================================================
// palliative_care_engine.js — PPS, ESAS
// ============================================================
const palliative_care_engine = `// filepath: namaweb/palliative_care_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PPS (Anderson 1996)', 'ESAS (Bruera 1991)'];

function ppsScore(input) {
    const { ambulation, activity, selfCare, intake, consciousness } = input;
    const amb = ambulation ?? 0;
    const act = activity ?? 0;
    const self = selfCare ?? 0;
    const total = Math.min(amb, act, self) * 10;
    let risk = 'good', rec = 'Maintain';
    if (total < 30) { risk = 'dying'; rec = 'Comfort measures only'; }
    else if (total < 50) { risk = 'poor'; rec = 'Palliative focus'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { ambulation: amb, activity: act, selfCare: self, intake, consciousness }, cite: CITATIONS[0], version: VERSION };
}

function esasScore(input) {
    const items = ['pain', 'tiredness', 'nausea', 'depression', 'anxiety', 'drowsiness', 'appetite', 'wellbeing', 'shortness'];
    const scores = items.map(k => input[k] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'none', rec = 'No significant symptoms';
    if (total >= 60) { risk = 'severe'; rec = 'Urgent intervention for multiple symptoms'; }
    else if (total >= 30) { risk = 'moderate'; rec = 'Symptom management'; }
    return { score: total, max_score: 90, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { ppsScore, esasScore, VERSION, CITATIONS };
`;

// ============================================================
// pathology_engine.js — Gleason, Bloom-Richardson
// ============================================================
const pathology_engine = `// filepath: namaweb/pathology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Gleason 1966', 'Nottingham 1991'];

function gleasonScore(input) {
    const { primary, secondary } = input;
    if (primary === undefined || secondary === undefined) return { error: 'missing_grade' };
    const total = primary + secondary;
    let risk = 'low', rec = 'Wait';
    if (total >= 8) { risk = 'high'; rec = 'Aggressive treatment'; }
    else if (total >= 6) { risk = 'moderate'; rec = 'Multimodal therapy'; }
    return { score: total, grade: 'Gleason ' + total, risk, recommendation: rec, components: { primary, secondary }, cite: CITATIONS[0], version: VERSION };
}

function nottinghamScore(input) {
    const { tubule, nuclear, mitotic } = input;
    const total = (tubule ?? 0) + (nuclear ?? 0) + (mitotic ?? 0);
    let risk = 'low', rec = 'Routine';
    if (total >= 8) { risk = 'high'; rec = 'Aggressive treatment'; }
    else if (total >= 6) { risk = 'moderate'; rec = 'Multimodal therapy'; }
    return { score: total, max_score: 9, risk, recommendation: rec, components: { tubule, nuclear, mitotic }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { gleasonScore, nottinghamScore, VERSION, CITATIONS };
`;

// ============================================================
// physiotherapy_engine.js — Oswestry, DASH
// ============================================================
const physiotherapy_engine = `// filepath: namaweb/physiotherapy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Oswestry 1980', 'DASH 1996'];

function oswestryScore(input) {
    const items = ['painIntensity', 'personalCare', 'lifting', 'walking', 'sitting', 'standing', 'sleeping', 'sexLife', 'socialLife', 'travelling'];
    const scores = items.map(k => (input[k] || 0) * 5);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'Normal';
    if (total >= 40) { risk = 'severe'; rec = 'Surgical eval'; }
    else if (total >= 20) { risk = 'moderate'; rec = 'PT, injections'; }
    return { score: total, max_score: 50, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[0], version: VERSION };
}

function dashScore(input) {
    const items = ['openJar', 'heavyChores', 'carryBag', 'washBack', 'useKnife', 'recreationalForce', 'transport', 'housework', 'workPain', 'tingling'];
    const scores = items.map(k => input[k] || 1);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Normal';
    if (total >= 35) { risk = 'high'; rec = 'Significant disability'; }
    return { score: total, max_score: 50, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { oswestryScore, dashScore, VERSION, CITATIONS };
`;

// ============================================================
// picu_engine.js — PRISM III, PELOD
// ============================================================
const picu_engine = `// filepath: namaweb/picu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PRISM III (Pollack 1996)', 'PELOD 1999'];

function prismIII(input) {
    const { systolicBP, heartRate, temp, mentalStatus, acidosis, ph, glucose, potassium, creatinine, BUN, WBC, plt, PT, fibrinogen, pupils } = input;
    let score = 0;
    const c = {};
    if (systolicBP < 50) score += 7;
    c.sbp = systolicBP;
    if (heartRate > 200 || heartRate < 90) score += 4;
    if (temp < 33 || temp > 40) score += 3;
    c.hr = heartRate;
    c.temp = temp;
    if (mentalStatus === 'coma') score += 5;
    if (acidosis) { score += 2; c.acidosis = 2; }
    if (ph < 7.0) { score += 2; c.ph = 2; }
    if (glucose > 200 || glucose < 60) score += 2;
    if (potassium > 6.5 || potassium < 3.0) score += 2;
    if (creatinine > 1.5) score += 2;
    if (BUN > 50) score += 2;
    if (WBC > 30 || WBC < 3) score += 2;
    if (plt < 50) score += 2;
    if (PT > 22) score += 3;
    if (fibrinogen < 1) score += 4;
    if (pupils === 'unequal') score += 4;
    let risk = 'low', rec = 'Standard care';
    if (score >= 17) { risk = 'very_high'; rec = 'Mortality >50%'; }
    else if (score >= 10) { risk = 'high'; rec = 'ICU'; }
    return { score, max_score: 74, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { prismIII, VERSION, CITATIONS };
`;

// Write the 10 enhanced engines
const TARGETS = {
    dialysis: dialysis_engine,
    maternal_fetal: maternal_fetal_engine,
    neonatal: neonatal_engine,
    neurosurgery: neurosurgery_engine,
    nicu: nicu_engine,
    occupational_therapy: occupational_therapy_engine,
    palliative_care: palliative_care_engine,
    pathology: pathology_engine,
    physiotherapy: physiotherapy_engine,
    picu: picu_engine
};

let count = 0;
for (const [dept, code] of Object.entries(TARGETS)) {
    const fpath = `namaweb/${dept}_engine.js`;
    const stats = fs.existsSync(fpath) ? fs.statSync(fpath) : null;
    if (!stats || stats.size < 3500) {
        fs.writeFileSync(fpath, code);
        count++;
        console.log(`Wrote ${fpath} (${code.length} bytes)`);
    }
}
console.log(`\nTotal: ${count} enhanced`);
