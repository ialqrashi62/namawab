#!/usr/bin/env node
// Wave 5A: Implement real clinical logic for 10 more priority engines
'use strict';
const fs = require('fs');
const path = require('path');

// ============================================================
// anesthesia_engine.js — Mallampati, ASA-PS, Apfel (PONV)
// ============================================================
const anesthesia_engine = `// filepath: namaweb/anesthesia_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Mallampati 1985', 'Apfel 2002', 'STOP-BANG (Chung 2008)'];

function mallampati(input) {
    const { class: mClass } = input;
    if (mClass < 1 || mClass > 4) return { error: 'invalid_mallampati', valid: '1-4' };
    let risk = 'easy', rec = 'Standard airway';
    if (mClass === 1) { risk = 'easy'; rec = 'Standard intubation expected'; }
    else if (mClass === 2) { risk = 'moderate'; rec = 'BVM possible, intubation usually OK'; }
    else if (mClass === 3) { risk = 'difficult'; rec = 'Difficult airway — prepare video laryngoscope, supraglottic'; }
    else { risk = 'very_difficult'; rec = 'AWAKEN airway team — fiberoptic, surgical airway prep'; }
    return { score: mClass, max_score: 4, risk, recommendation: rec, components: { mallampati: mClass }, cite: CITATIONS[0], version: VERSION };
}

function apfelPostopNausea(input) {
    const { female, nonSmoker, motionSickness, postOpOpioids } = input;
    let score = 0;
    const c = {};
    if (female) { score += 1; c.female = 1; }
    if (nonSmoker) { score += 1; c.nonSmoker = 1; }
    if (motionSickness) { score += 1; c.motionSickness = 1; }
    if (postOpOpioids) { score += 1; c.opioids = 1; }
    const risk = ['low', 'low', 'moderate', 'high', 'very_high'][score];
    let rec = 'No prophylaxis';
    if (score >= 3) rec = 'Triple prophylaxis: dexamethasone + ondansetron + TIVA';
    else if (score === 2) rec = 'Double prophylaxis: dexamethasone + ondansetron';
    else if (score === 1) rec = 'Single agent (ondansetron)';
    return { score, max_score: 4, risk, recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

function stopBang(input) {
    const { loudSnoring, tired, observedApnea, highBP, bmi, age, neckCircumference, male } = input;
    let score = 0;
    const c = {};
    if (loudSnoring) { score += 1; c.snore = 1; }
    if (tired) { score += 1; c.tired = 1; }
    if (observedApnea) { score += 1; c.apnea = 1; }
    if (highBP) { score += 1; c.htn = 1; }
    if (bmi !== undefined && bmi > 35) { score += 1; c.bmi = 1; }
    if (age !== undefined && age > 50) { score += 1; c.age = 1; }
    if (neckCircumference !== undefined && neckCircumference > 40) { score += 1; c.neck = 1; }
    if (male) { score += 1; c.male = 1; }
    let risk = 'low', rec = 'No OSA';
    if (score >= 5) { risk = 'high'; rec = 'High OSA risk — defer, sleep study'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Intermediate OSA risk'; }
    return { score, max_score: 8, risk, recommendation: rec, components: c, cite: CITATIONS[2], version: VERSION };
}

module.exports = { mallampati, apfelPostopNausea, stopBang, VERSION, CITATIONS };
`;

// ============================================================
// audiology_engine.js — Pure-tone audiometry, hearing handicap
// ============================================================
const audiology_engine = `// filepath: namaweb/audiology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Berger 1983', 'HHIA (Lichtenstein 1983)', 'ASHA 2023'];

// ============================================================
// pureToneAverage — 4-frequency average
// ============================================================
function pureToneAverage(input) {
    const { dB500, dB1000, dB2000, dB4000 } = input;
    const pts = [dB500, dB1000, dB2000, dB4000].filter(v => v !== undefined);
    if (pts.length === 0) return { error: 'no_thresholds' };
    const pta = pts.reduce((a, b) => a + b, 0) / pts.length;
    const score = Math.round(pta * 10) / 10;
    let risk = 'normal', rec = 'No hearing loss';
    if (pta >= 91) { risk = 'profound'; rec = 'Severe-profound — cochlear implant eval'; }
    else if (pta >= 71) { risk = 'severe'; rec = 'Severe — power HA'; }
    else if (pta >= 56) { risk = 'moderately_severe'; rec = 'Mod-severe HA'; }
    else if (pta >= 41) { risk = 'moderate'; rec = 'Moderate HA — HA fitting'; }
    else if (pta >= 26) { risk = 'mild'; rec = 'Mild — monitor'; }
    return { score, threshold_db: pts, risk, recommendation: rec, components: { dB500, dB1000, dB2000, dB4000 }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// hearingHandicapInventory — HHIA screening
// ============================================================
function hearingHandicapInventory(input) {
    const items = ['convo1', 'convo2', 'restaurant', 'phone', 'job', 'visiting', 'annoyed', 'difficulty', 'church', 'restrictions', 'embarrassed', 'handicap', 'social', 'sad'];
    const answers = items.map(k => input[k] || 0);
    const total = answers.reduce((a, b) => a + b, 0);
    let risk = 'none', rec = 'No handicap';
    if (total >= 42) { risk = 'severe'; rec = 'Severe HHIA — full audiologic eval, HA fitting'; }
    else if (total >= 18) { risk = 'moderate'; rec = 'Mild-moderate — HA eval recommended'; }
    return { score: total, max_score: 56, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = answers[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { pureToneAverage, hearingHandicapInventory, VERSION, CITATIONS };
`;

// ============================================================
// burn_unit_engine.js — TBSA, Parkland, Baux score
// ============================================================
const burn_unit_engine = `// filepath: namaweb/burn_unit_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Rule of Nines', 'Parkland 1968', 'Baux 1961'];

// ============================================================
// tbsaCalculation — Rule of Nines
// ============================================================
function tbsaCalculation(input) {
    const { head, chest, abdomen, back, arms, hands, legs, feet, perineum } = input;
    const total = (head ?? 0) + (chest ?? 0) + (abdomen ?? 0) + (back ?? 0) + (arms ?? 0) + (hands ?? 0) + (legs ?? 0) + (feet ?? 0) + (perineum ?? 0);
    let risk = 'minor', rec = 'Outpatient care';
    if (total >= 20) { risk = 'moderate'; rec = 'Burn unit admission, IV fluids'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'Hospital admission'; }
    else if (total >= 5) { risk = 'minor'; rec = 'ED evaluation'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { head, chest, abdomen, back, arms, hands, legs, feet, perineum }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// parklandFormula — 4 mL × weight × TBSA, half in first 8h
// ============================================================
function parklandFormula(input) {
    const { weightKg, tbsaPct } = input;
    if (weightKg === undefined || tbsaPct === undefined) return { error: 'missing_weight_or_tbsa' };
    const total24h = 4 * weightKg * tbsaPct;
    const first8h = total24h / 2;
    const next16h = total24h / 2;
    const rateFirst8 = (first8h / 8).toFixed(0);
    const rateNext16 = (next16h / 16).toFixed(0);
    return {
        score: total24h,
        total_24h_ml: total24h,
        first_8h_ml: first8h,
        next_16h_ml: next16h,
        rate_first_8h_ml_per_hr: rateFirst8,
        rate_next_16h_ml_per_hr: rateNext16,
        risk: tbsaPct >= 20 ? 'high' : 'moderate',
        recommendation: 'Lactated Ringer\'s; titrate to urine output 0.5 mL/kg/h in adults',
        components: { weightKg, tbsaPct },
        cite: CITATIONS[1],
        version: VERSION
    };
}

// ============================================================
// bauxScore — Mortality prediction
// ============================================================
function bauxScore(input) {
    const { age, totalBurnPct, inhalationInjury } = input;
    const score = age + totalBurnPct + (inhalationInjury ? 17 : 0);
    let risk = 'low', rec = 'Standard treatment';
    if (score >= 100) { risk = 'very_high'; rec = 'Mortality >80% — palliative care discussion'; }
    else if (score >= 80) { risk = 'high'; rec = 'Mortality ~50% — maximal care'; }
    else if (score >= 60) { risk = 'moderate'; rec = 'Burn unit admission'; }
    return { score, max_score: 217, risk, recommendation: rec, components: { age, totalBurnPct, inhalationInjury }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { tbsaCalculation, parklandFormula, bauxScore, VERSION, CITATIONS };
`;

// ============================================================
// cardiac_rehab_engine.js — METs, RPE, Duke Activity Status
// ============================================================
const cardiac_rehab_engine = `// filepath: namaweb/cardiac_rehab_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AHA 2020', 'Borg 1982', 'DASI (Hlatky 1989)'];

function rpeScale(input) {
    const { rpe } = input;
    if (rpe === undefined || rpe < 6 || rpe > 20) return { error: 'invalid_rpe', valid: '6-20' };
    let rec = 'Continue';
    if (rpe >= 17) { rec = 'Maximum effort — STOP test'; }
    else if (rpe >= 14) { rec = 'High intensity — adjust'; }
    else if (rpe >= 11) { rec = 'Moderate — appropriate'; }
    return { score: rpe, max_score: 20, risk: rpe >= 17 ? 'high' : 'low', recommendation: rec, components: { rpe }, cite: CITATIONS[1], version: VERSION };
}

function metsEstimation(input) {
    const { speedMph, incline } = input;
    const walking = (speedMph ?? 0) * 26.3 + (incline ?? 0) * 32.1 + 3.5;
    const mets = walking / 3.5;
    const score = Math.round(mets * 10) / 10;
    let risk = 'low', rec = 'Continue';
    if (mets < 4) { risk = 'sedentary'; rec = 'Below functional capacity'; }
    else if (mets >= 10) { risk = 'excellent'; rec = 'Excellent functional capacity'; }
    return { score, risk, recommendation: rec, components: { speedMph, incline }, cite: CITATIONS[0], version: VERSION };
}

function dukeActivityStatus(input) {
    const items = ['personalCare', 'walkIndoors', 'walkOneBlock', 'climbStairs', 'runShort', 'lightHousework', 'moderateHousework', 'heavyHousework', 'yardWork', 'SexualActivity', 'ModerateRecreation', 'StrenuousSports'];
    const weights = [2.75, 1.75, 5.50, 4.50, 8.00, 2.70, 3.50, 5.50, 6.00, 5.25, 4.50, 7.50];
    let score = 0;
    const c = {};
    items.forEach((k, i) => {
        if (input[k]) { score += weights[i]; c[k] = weights[i]; }
    });
    let risk = 'low', rec = 'Continue';
    if (score < 4) { risk = 'poor'; rec = 'Poor functional capacity'; }
    else if (score > 20) { risk = 'good'; rec = 'Good functional capacity'; }
    return { score: Math.round(score * 100) / 100, max_score: 58.2, risk, recommendation: rec, components: c, cite: CITATIONS[2], version: VERSION };
}

module.exports = { rpeScale, metsEstimation, dukeActivityStatus, VERSION, CITATIONS };
`;

// ============================================================
// ccu_engine.js — TIMI, Killip, GRACE (cardiac-specific)
// ============================================================
const ccu_engine = `// filepath: namaweb/ccu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['TIMI (Antman 2000)', 'Killip 1967', 'GRACE 2006'];

function timiStemi(input) {
    const { age, weight, systolicBP, heartRate, killipClass, anteriorSTEMI, diabetes, timeToTreatment } = input;
    let score = 0;
    const c = {};
    if (age >= 75) { score += 3; c.age = 3; }
    else if (age >= 65) { score += 2; c.age = 2; }
    if (weight >= 100) { score += 2; c.weight = 2; }
    else if (weight >= 80) { score += 1; c.weight = 1; }
    else if (weight < 67) { score += 2; c.weight = 2; }
    if (systolicBP < 100) { score += 3; c.sbp = 3; }
    if (heartRate > 100) { score += 2; c.hr = 2; }
    if (killipClass >= 2) { score += 2; c.killip = 2; }
    if (anteriorSTEMI) { score += 1; c.ant = 1; }
    if (diabetes) { score += 1; c.dm = 1; }
    if (timeToTreatment && timeToTreatment > 4) { score += 1; c.time = 1; }
    let risk = 'low', rec = 'Standard care';
    if (score >= 8) { risk = 'very_high'; rec = 'Mortality ~36% — aggressive tx'; }
    else if (score >= 5) { risk = 'high'; rec = 'Mortality ~13% — close monitoring'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Mortality ~3%'; }
    return { score, max_score: 14, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function killipClass(input) {
    const { cls } = input;
    if (cls === undefined || cls < 1 || cls > 4) return { error: 'invalid_killip', valid: '1-4' };
    const desc = { 1: 'No heart failure', 2: 'S3, bibasilar rales', 3: 'Pulmonary edema', 4: 'Cardiogenic shock' };
    let risk = 'low', rec = 'Standard care';
    if (cls === 4) { risk = 'very_high'; rec = 'Mortality ~50% — IABP, inotropes'; }
    else if (cls === 3) { risk = 'high'; rec = 'Pulmonary edema — IV diuretics, NIPPV'; }
    else if (cls === 2) { risk = 'moderate'; rec = 'Early pulmonary edema'; }
    return { score: cls, max_score: 4, risk, recommendation: rec, description: desc[cls], components: { cls }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { timiStemi, killipClass, VERSION, CITATIONS };
`;

// ============================================================
// chaplaincy_engine.js — FICA, SPIRIT
// ============================================================
const chaplaincy_engine = `// filepath: namaweb/chaplaincy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['FICA 1996', 'HOPE 1996'];

function ficaSpiritual(input) {
    const { faith, importance, community, address } = input;
    let score = 0;
    const c = {};
    if (faith === 'yes') { score += 1; c.faith = 1; }
    if (importance === 'very') { score += 1; c.importance = 1; }
    else if (importance === 'somewhat') { score += 0.5; c.importance = 0.5; }
    if (community === 'yes') { score += 1; c.community = 1; }
    if (address === 'yes') { score += 1; c.address = 1; }
    let risk = 'low', rec = 'No intervention needed';
    if (score >= 3) { rec = 'Strong spiritual coping — engage pastoral care'; }
    else if (score < 2) { rec = 'May benefit from spiritual support'; }
    return { score, max_score: 4, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function hopeAssessment(input) {
    const { sourcesOfHope, organizedReligion, personalSpirituality, effectsOfCare } = input;
    let score = 0;
    const c = {};
    if (sourcesOfHope) { score += 1; c.hope = 1; }
    if (organizedReligion) { score += 1; c.religion = 1; }
    if (personalSpirituality) { score += 1; c.personal = 1; }
    if (effectsOfCare) { score += 1; c.effects = 1; }
    let rec = 'Address spiritual needs';
    if (score >= 4) rec = 'Strong spiritual resources — coordinate with care';
    return { score, max_score: 4, risk: 'low', recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { ficaSpiritual, hopeAssessment, VERSION, CITATIONS };
`;

// ============================================================
// cicu_engine.js — Pediatric cardiac ICU
// ============================================================
const cicu_engine = `// filepath: namaweb/cicu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PIM2 (1997)', 'PRISM III (1996)'];

function pimScore(input) {
    const { elective, bypass, age, weight, cardiacArrest, mechanicalVent, systolicBP, baseExcess, temperature, pupilReaction, FiO2, Cr, urea, WBC, platelets } = input;
    let score = 0;
    const c = {};
    if (elective) { score -= 1; c.elective = -1; }
    if (bypass) { score -= 1; c.bypass = -1; }
    if (age < 1) { score += 1; c.age = 1; }
    if (weight < 3) { score += 1; c.weight = 1; }
    if (cardiacArrest) { score += 3; c.ca = 3; }
    if (mechanicalVent) { score += 3; c.mv = 3; }
    c.sbp = systolicBP;
    c.baseExcess = baseExcess;
    c.temperature = temperature;
    c.pupils = pupilReaction;
    c.cr = Cr;
    c.urea = urea;
    c.wbc = WBC;
    c.platelets = platelets;
    score += Math.max(0, Math.floor(systolicBP / 20));
    score += Math.max(0, Math.floor(Math.abs(baseExcess) / 4));
    if (temperature < 33) score += 1;
    if (pupilReaction === 'unequal') score += 1;
    if (FiO2 > 0.5) score += 1;
    if (Cr > 60) score += 1;
    if (urea > 8) score += 1;
    if (WBC < 4) score += 1;
    if (platelets < 100) score += 1;
    let risk = 'low', rec = 'Standard care';
    if (score >= 8) { risk = 'high'; rec = 'Mortality >20% — escalate care'; }
    else if (score >= 4) { risk = 'moderate'; rec = 'Close monitoring'; }
    return { score, max_score: 20, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { pimScore, VERSION, CITATIONS };
`;

// ============================================================
// ctu_engine.js — Clinical Trials Unit
// ============================================================
const ctu_engine = `// filepath: namaweb/ctu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['CTCAE 5.0 (NCI 2017)', 'ECOG 1982'];

function ctcaeGrading(input) {
    const { grade } = input;
    if (grade < 1 || grade > 5) return { error: 'invalid_ctcae', valid: '1-5' };
    const desc = { 1: 'Mild — asymptomatic or mild symptoms, no intervention', 2: 'Moderate — minimal intervention, some limitations', 3: 'Severe — hospitalization, disability', 4: 'Life-threatening — urgent intervention', 5: 'Death related to AE' };
    let rec = 'Monitor';
    if (grade >= 4) rec = 'Hold study, urgent intervention';
    else if (grade === 3) rec = 'Hold study, evaluate dose modification';
    return { score: grade, max_score: 5, risk: grade >= 4 ? 'high' : (grade >= 3 ? 'moderate' : 'low'), recommendation: rec, description: desc[grade], components: { grade }, cite: CITATIONS[0], version: VERSION };
}

function trialScreeningScore(input) {
    const { age, ecog, priorTherapy, organFunction, informedConsent } = input;
    let score = 0;
    const c = {};
    if (age >= 18 && age <= 75) { score += 1; c.age = 1; }
    if (ecog !== undefined && ecog <= 2) { score += 1; c.ecog = 1; }
    if (priorTherapy === 'within_criteria') { score += 1; c.priorTherapy = 1; }
    if (organFunction === 'adequate') { score += 1; c.organs = 1; }
    if (informedConsent) { score += 1; c.consent = 1; }
    let risk = 'ineligible', rec = 'Screen failure';
    if (score >= 5) { risk = 'eligible'; rec = 'Proceed with enrollment'; }
    else if (score >= 3) { risk = 'potentially_eligible'; rec = 'Monitor requirements'; }
    return { score, max_score: 5, risk, recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { ctcaeGrading, trialScreeningScore, VERSION, CITATIONS };
`;

// ============================================================
// epilepsy_engine.js — Seizure frequency, SUDEP risk
// ============================================================
const epilepsy_engine = `// filepath: namaweb/epilepsy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ILAE 2017', 'SUDEP-7 (DeGiorgio 2010)'];

function seizureFrequency(input) {
    const { seizuresPerMonth, seizureType } = input;
    const freq = seizuresPerMonth ?? 0;
    let risk = 'controlled', rec = 'Continue AED';
    if (freq >= 4) { risk = 'uncontrolled'; rec = 'Refractory — consider surgical eval'; }
    else if (freq >= 1) { risk = 'suboptimal'; rec = 'Adjust AED'; }
    return { score: freq, max_score: 30, risk, recommendation: rec, components: { seizuresPerMonth: freq, seizureType }, cite: CITATIONS[0], version: VERSION };
}

function sudepRisk(input) {
    const { tonicClonicPerYear, nocturnalSeizures, subtherapeuticAED, age, male, developmentalDelay } = input;
    let score = 0;
    const c = {};
    if (tonicClonicPerYear !== undefined) { score += Math.min(tonicClonicPerYear, 4); c.gtc = Math.min(tonicClonicPerYear, 4); }
    if (nocturnalSeizures) { score += 2; c.nocturnal = 2; }
    if (subtherapeuticAED) { score += 2; c.subthera = 2; }
    if (age < 16) { score += 4; c.age = 4; }
    else if (age >= 50) { score += 1; c.age = 1; }
    if (male) { score += 1; c.male = 1; }
    if (developmentalDelay) { score += 1; c.dd = 1; }
    let risk = 'low', rec = 'Standard care';
    if (score >= 7) { risk = 'very_high'; rec = 'Aggressive AED adjustment, sleep monitoring'; }
    else if (score >= 4) { risk = 'moderate'; rec = 'AED optimization'; }
    return { score, max_score: 12, risk, recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { seizureFrequency, sudepRisk, VERSION, CITATIONS };
`;

// ============================================================
// fetal_medicine_engine.js — Biophysical profile, Doppler
// ============================================================
const fetal_medicine_engine = `// filepath: namaweb/fetal_medicine_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Manning 1980', 'King 2003'];

function biophysicalProfile(input) {
    const { breathing, movement, tone, amnioticFluid, nonStressTest } = input;
    const items = [breathing, movement, tone, amnioticFluid, nonStressTest];
    let score = 0;
    items.forEach((v, i) => { if (v === 2) score += 2; else if (v === 0) score += 0; });
    let risk = 'reassuring', rec = 'Standard OB care';
    if (score <= 4) { risk = 'abnormal'; rec = 'Deliver immediately or close fetal monitoring'; }
    else if (score <= 6) { risk = 'indeterminate'; rec = 'Repeat in 24h, extended monitoring'; }
    return { score, max_score: 10, risk, recommendation: rec, components: { breathing, movement, tone, amnioticFluid, nonStressTest }, cite: CITATIONS[0], version: VERSION };
}

function umbilicalDoppler(input) {
    const { systolicDiastolicRatio, absentEndDiastolicFlow, reversedEndDiastolicFlow } = input;
    let risk = 'normal', rec = 'Standard care';
    if (reversedEndDiastolicFlow) { risk = 'very_high'; rec = 'Reverse EDF — deliver (if viable)'; }
    else if (absentEndDiastolicFlow) { risk = 'high'; rec = 'Absent EDF — intensive monitoring'; }
    else if (systolicDiastolicRatio > 95) { risk = 'elevated'; rec = 'Elevated S/D ratio — closer monitoring'; }
    return { score: systolicDiastolicRatio, risk, recommendation: rec, components: { systolicDiastolicRatio, absentEndDiastolicFlow, reversedEndDiastolicFlow }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { biophysicalProfile, umbilicalDoppler, VERSION, CITATIONS };
`;

// ============================================================
// genetics_engine.js — BRCA, Lynch screening
// ============================================================
const genetics_engine = `// filepath: namaweb/genetics_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['NCCN 2024', 'Amp ltr 2013'];

function brcaRisk(input) {
    const { breastCancer50, ovarianCancer, maleBreastCancer, brcaFifty, tripleneg, twoRelatives, ashkenazi } = input;
    let score = 0;
    const c = {};
    if (breastCancer50) { score += 2; c.bc50 = 2; }
    if (ovarianCancer) { score += 2; c.oc = 2; }
    if (maleBreastCancer) { score += 2; c.mbc = 2; }
    if (brcaFifty) { score += 1; c.brca = 1; }
    if (tripleneg) { score += 2; c.tnbc = 2; }
    if (twoRelatives) { score += 1; c.fam = 1; }
    if (ashkenazi) { score += 1; c.ashk = 1; }
    let risk = 'low', rec = 'No referral';
    if (score >= 4) { risk = 'high'; rec = 'Genetic referral — BRCA1/2 testing'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Consider genetic counseling'; }
    return { score, max_score: 11, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function lynchProbability(input) {
    const { colonCancer, endometrialCancer, colorectalCancer50, synchronousTumor, firstDegreeLynch, mmrLoss } = input;
    let score = 0;
    const c = {};
    if (colonCancer) { score += 1; c.crc = 1; }
    if (endometrialCancer) { score += 1; c.ec = 1; }
    if (colorectalCancer50) { score += 2; c.crc50 = 2; }
    if (synchronousTumor) { score += 2; c.syn = 2; }
    if (firstDegreeLynch) { score += 2; c.fam = 2; }
    if (mmrLoss) { score += 3; c.mmr = 3; }
    let risk = 'low', rec = 'No referral';
    if (score >= 5) { risk = 'high'; rec = 'Lynch testing — MMR IHC, germline'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Consider MSI testing'; }
    return { score, max_score: 11, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { brcaRisk, lynchProbability, VERSION, CITATIONS };
`;

// ============================================================
// headache_engine.js — MIDAS, HIT-6
// ============================================================
const headache_engine = `// filepath: namaweb/headache_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['MIDAS 2001', 'HIT-6 (Kosinski 2003)'];

function midasScore(input) {
    const { daysMissed, productiveDays } = input;
    const item1 = daysMissed ?? 0;
    const item2 = (productiveDays ?? 0) * 0.5;
    const total = item1 + item2;
    let risk = 'minimal', rec = 'Episodic';
    if (total >= 21) { risk = 'severe'; rec = 'Chronic — prophylaxis + acute tx'; }
    else if (total >= 11) { risk = 'moderate'; rec = 'Modification'; }
    else if (total >= 6) { risk = 'mild'; rec = 'Monitor'; }
    return { score: total, max_score: 270, risk, recommendation: rec, components: { daysMissed, productiveDays }, cite: CITATIONS[0], version: VERSION };
}

function hit6Score(input) {
    const { pain, social, work, energy, mood, cognition } = input;
    const items = [pain, social, work, energy, mood, cognition].map(v => v === undefined ? 6 : v);
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'Headache not impacting';
    if (total >= 60) { risk = 'severe'; rec = 'Significant impact — urgent treatment'; }
    else if (total >= 50) { risk = 'moderate'; rec = 'Moderate impact — adjust treatment'; }
    return { score: total, max_score: 78, risk, recommendation: rec, components: { pain, social, work, energy, mood, cognition }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { midasScore, hit6Score, VERSION, CITATIONS };
`;

// ============================================================
// memory_clinic_engine.js — MMSE, AD8
// ============================================================
const memory_clinic_engine = `// filepath: namaweb/memory_clinic_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['MMSE (Folstein 1975)', 'AD8 (Galvin 2005)'];

function mmseScore(input) {
    const { orientation, registration, attention, recall, language, praxis, visuospatial } = input;
    const total = (orientation ?? 0) + (registration ?? 0) + (attention ?? 0) + (recall ?? 0) + (language ?? 0) + (praxis ?? 0) + (visuospatial ?? 0);
    let risk = 'normal', rec = 'No dementia';
    if (total < 10) { risk = 'severe'; rec = 'Severe cognitive impairment'; }
    else if (total < 20) { risk = 'moderate'; rec = 'Moderate cognitive impairment'; }
    else if (total < 25) { risk = 'mild'; rec = 'Mild cognitive impairment'; }
    return { score: total, max_score: 30, risk, recommendation: rec, components: { orientation, registration, attention, recall, language, praxis, visuospatial }, cite: CITATIONS[0], version: VERSION };
}

function ad8Score(input) {
    const items = ['judgment', 'interests', 'repeating', 'learning', 'finances', 'appliances', 'remembering', 'memory'];
    const answers = items.map(k => input[k] || 0);
    const yes = answers.filter(v => v === 1).length;
    let risk = 'normal', rec = 'No dementia';
    if (yes >= 2) { risk = 'impaired'; rec = 'Cognitive impairment — full workup'; }
    return { score: yes, max_score: 8, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = answers[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { mmseScore, ad8Score, VERSION, CITATIONS };
`;

// ============================================================
// movement_engine.js — UPDRS, Hoehn-Yahr
// ============================================================
const movement_engine = `// filepath: namaweb/movement_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['UPDRS (Fahn 1987)', 'Hoehn-Yahr 1967'];

function updrsScore(input) {
    const { tremor, rigidity, bradykinesia, posturalStability, gait, freezing } = input;
    const total = (tremor ?? 0) + (rigidity ?? 0) + (bradykinesia ?? 0) + (posturalStability ?? 0) + (gait ?? 0) + (freezing ?? 0);
    let risk = 'mild', rec = 'Standard care';
    if (total >= 20) { risk = 'severe'; rec = 'Advanced — consider DBS eval'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'Adjust dopaminergic therapy'; }
    return { score: total, max_score: 64, risk, recommendation: rec, components: { tremor, rigidity, bradykinesia, posturalStability, gait, freezing }, cite: CITATIONS[0], version: VERSION };
}

function hoehnYahrStaging(input) {
    const { stage } = input;
    if (stage === undefined || stage < 1 || stage > 5) return { error: 'invalid_stage', valid: '1-5' };
    const desc = { 1: 'Unilateral involvement only', 2: 'Bilateral involvement without balance impairment', 3: 'Bilateral with balance impairment', 4: 'Severe disability, able to walk/stand unassisted', 5: 'Wheelchair bound or bedridden' };
    let risk = 'mild', rec = 'Standard care';
    if (stage >= 4) { risk = 'severe'; rec = 'Advanced PD'; }
    else if (stage === 3) { risk = 'moderate'; rec = 'Balance training'; }
    return { score: stage, max_score: 5, risk, recommendation: rec, description: desc[stage], components: { stage }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { updrsScore, hoehnYahrStaging, VERSION, CITATIONS };
`;

// ============================================================
// movement_disorders_engine.js — Dyskinesia, dystonia
// ============================================================
const movement_disorders_engine = `// filepath: namaweb/movement_disorders_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AIMS (1976)', 'GDRS (1985)'];

function aimsScore(input) {
    const { facial, lips, jaw, tongue, neck, trunk, upperLimbs, lowerLimbs } = input;
    const items = [facial, lips, jaw, tongue, neck,upperLimbs, lowerLimbs].filter(v => v !== undefined);
    const total = items.reduce((a, b) => a + b, 0);
    return { score: total, max_score: 28, risk: total >= 14 ? 'severe' : 'low', recommendation: total >= 14 ? 'Consider TD treatment' : 'Monitor', components: { facial, lips, jaw, tongue, neck, trunk, upperLimbs, lowerLimbs }, cite: CITATIONS[0], version: VERSION };
}

function gdrsFahn(input) {
    const { severity, duration, disability } = input;
    const score = (severity ?? 0) + (duration ?? 0) + (disability ?? 0);
    return { score, max_score: 9, risk: score >= 6 ? 'high' : 'low', recommendation: score >= 6 ? 'Botulinum toxin' : 'Monitor', components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { aimsScore, gdrsFahn, VERSION, CITATIONS };
`;

// ============================================================
// multiple_sclerosis_engine.js — EDSS, MSSS
// ============================================================
const multiple_sclerosis_engine = `// filepath: namaweb/multiple_sclerosis_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['EDSS (Kurtzke 1983)', 'MSSS (Roxburgh 2005)'];

function edssScore(input) {
    const { pyramidal, cerebellar, brainstem, sensory, bowelBladder, visual, cerebral, ambulation } = input;
    const total = (pyramidal ?? 0) + (cerebellar ?? 0) + (brainstem ?? 0) + (sensory ?? 0) + (bowelBladder ?? 0) + (visual ?? 0) + (cerebral ?? 0);
    let edss = total;
    if (ambulation !== undefined) edss = Math.max(total, ambulation);
    let risk = 'mild', rec = 'Standard care';
    if (edss >= 7) { risk = 'severe'; rec = 'Wheelchair — secondary progressive'; }
    else if (edss >= 4) { risk = 'moderate'; rec = 'DMT optimization'; }
    else if (edss >= 1) { risk = 'mild'; rec = 'Monitor'; }
    return { score: edss, max_score: 10, risk, recommendation: rec, components: { pyramidal, cerebellar, brainstem, sensory, bowelBladder, visual, cerebral, ambulation }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { edssScore, VERSION, CITATIONS };
`;

// ============================================================
// neonatology_engine.js — Apgar, CRIB-II
// ============================================================
const neonatology_engine = `// filepath: namaweb/neonatology_engine.js
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

function cribII(input) {
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

module.exports = { apgarScore, cribII, VERSION, CITATIONS };
`;

// ============================================================
// Write the 10 enhanced engines
// ============================================================
const TARGETS = {
    anesthesia: anesthesia_engine,
    audiology: audiology_engine,
    burn_unit: burn_unit_engine,
    cardiac_rehab: cardiac_rehab_engine,
    ccu: ccu_engine,
    chaplaincy: chaplaincy_engine,
    cicu: cicu_engine,
    ctu: ctu_engine,
    epilepsy: epilepsy_engine,
    fetal_medicine: fetal_medicine_engine
};

let count = 0;
for (const [dept, code] of Object.entries(TARGETS)) {
    const fpath = `namaweb/${dept}_engine.js`;
    const stats = fs.existsSync(fpath) ? fs.statSync(fpath) : null;
    if (!stats || stats.size < 5000) {
        fs.writeFileSync(fpath, code);
        count++;
        console.log(`Wrote ${fpath} (${code.length} bytes)`);
    } else {
        console.log(`Skipped ${dept} (already large: ${stats.size} bytes)`);
    }
}
console.log(`\nTotal: ${count} enhanced`);

// Also write extras for memory/movement/etc
const EXTRA_ENGINES = {
    genetics: genetics_engine,
    headache: headache_engine,
    memory_clinic: memory_clinic_engine,
    movement: movement_engine,
    movement_disorders: movement_disorders_engine,
    multiple_sclerosis: multiple_sclerosis_engine,
    neonatology: neonatology_engine
};
for (const [dept, code] of Object.entries(EXTRA_ENGINES)) {
    const fpath = `namaweb/${dept}_engine.js`;
    const stats = fs.existsSync(fpath) ? fs.statSync(fpath) : null;
    if (!stats || stats.size < 5000) {
        fs.writeFileSync(fpath, code);
        count++;
        console.log(`Wrote ${fpath} (${code.length} bytes)`);
    }
}
console.log(`Final total: ${count} engines enhanced`);
