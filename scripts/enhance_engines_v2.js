#!/usr/bin/env node
// Wave 4A: Implement real clinical logic for 10 more priority engines
'use strict';
const fs = require('fs');
const path = require('path');

// ============================================================
// allergy_engine.js
// ============================================================
const allergy_engine = `// filepath: namaweb/allergy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ARIA 2020', 'GINA 2024', 'AAAAI Allergy Guidelines'];

// ============================================================
// ariaSeverityScore — Allergic Rhinitis severity
// ============================================================
function ariaSeverityScore(input) {
    const { nasalCongestion, rhinorrhea, sneezing, itchyNose, itchyEyes, wateryEyes, nasalScore, eyeScore } = input;
    const n = nasalCongestion ?? nasalScore ?? 0;
    const r = rhinorrhea ?? 0;
    const s = sneezing ?? 0;
    const inose = itchyNose ?? 0;
    const iescore = itchyEyes ?? (eyeScore ?? 0);
    const we = wateryEyes ?? 0;
    const total = (n + r + s + inose + iescore + we) / 6;
    const score = Math.round(total * 10) / 10;
    let risk = 'none', rec = 'No rhinitis';
    if (score >= 8) { risk = 'severe'; rec = 'Intranasal CS + oral antihist + consider allergen immunoTx'; }
    else if (score >= 5) { risk = 'moderate'; rec = 'Intranasal corticosteroids + antihistamine'; }
    else if (score >= 3) { risk = 'mild'; rec = 'Oral or intranasal antihistamine'; }
    return { score, max_score: 10, risk, recommendation: rec, components: { nasalCongestion: n, rhinorrhea: r, sneezing: s, itchyNose: inose, itchyEyes: iescore, wateryEyes: we }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// igeInterpretation — Total IgE reference ranges
// ============================================================
function igeInterpretation(input) {
    const { igeLevel, ageYears } = input;
    if (igeLevel === undefined) return { error: 'missing_ige_level' };
    const age = ageYears ?? 30;
    // Crude reference ranges by age
    let upper = 100;
    if (age < 1) upper = 30;
    else if (age < 5) upper = 60;
    else if (age < 12) upper = 90;
    else if (age < 18) upper = 200;
    let risk = 'normal', rec = 'No allergic disease suggested';
    const ratio = igeLevel / upper;
    if (ratio > 5) { risk = 'very_high'; rec = 'Strong allergic/atopic burden — consider parasitic screen, ABPA, hyper-IgE syndrome'; }
    else if (ratio > 2) { risk = 'high'; rec = 'Atopy likely — specific IgE panel'; }
    else if (ratio > 1) { risk = 'elevated'; rec = 'Mild atopy — clinical correlation'; }
    return { score: igeLevel, reference_range: '<= ' + upper + ' IU/mL', age, risk, recommendation: rec, components: { ratio: Math.round(ratio * 100) / 100 }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { ariaSeverityScore, igeInterpretation, VERSION, CITATIONS };
`;

// ============================================================
// dermatology_engine.js
// ============================================================
const dermatology_engine = `// filepath: namaweb/dermatology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAD Psoriasis Guidelines 2021', 'SCORAD (1993)', 'DLQI (1994)'];

// ============================================================
// pasiScore — Psoriasis Area Severity Index
// ============================================================
function pasiScore(input) {
    const { erythema, induration, desquamation, headArea, trunkArea, upperArea, lowerArea } = input;
    const e = erythema ?? 0, i = induration ?? 0, d = desquamation ?? 0;
    const severity = (e + i + d) / 3;
    const head = (headArea ?? 0) * severity * 0.1;
    const trunk = (trunkArea ?? 0) * severity * 0.3;
    const upper = (upperArea ?? 0) * severity * 0.2;
    const lower = (lowerArea ?? 0) * severity * 0.4;
    const total = head + trunk + upper + lower;
    const score = Math.round(total * 10) / 10;
    let risk = 'mild', rec = 'Topical CS + vitD analogues';
    if (score >= 20) { risk = 'severe'; rec = 'Biologics (TNF, IL-17, IL-23 inhibitors)'; }
    else if (score >= 10) { risk = 'moderate'; rec = 'Phototherapy + systemic (MTX, cyclosporine)'; }
    return { score, max_score: 72, risk, recommendation: rec, components: { head, trunk, upper, lower, severity: Math.round(severity * 10) / 10 }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// scoradScore — Eczema severity
// ============================================================
function scoradScore(input) {
    const { extent, intensitySum, subjectiveVAS } = input;
    const A = extent ?? 0;
    const B = intensitySum ?? 0;
    const C = subjectiveVAS ?? 0;
    const total = A + B + C * 5; // C counts at 5x
    let risk = 'mild', rec = 'Emollients + low-potency topical CS';
    if (total >= 50) { risk = 'severe'; rec = 'Systemic immunosuppressants (dupilumab, JAK)'; }
    else if (total >= 25) { risk = 'moderate'; rec = 'Topical CS + calcineurin inhibitors'; }
    return { score: Math.round(total), max_score: 103, risk, recommendation: rec, components: { A_extent: A, B_intensity: B, C_subjective: C }, cite: CITATIONS[1], version: VERSION };
}

// ============================================================
// dlqiScore — Dermatology Life Quality Index
// ============================================================
function dlqiScore(input) {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = input;
    const items = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10].map(v => v === undefined ? 0 : v);
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'none', rec = 'No effect on QoL';
    if (total >= 21) { risk = 'very_large'; rec = 'Severe QoL impact — urgent specialist input'; }
    else if (total >= 11) { risk = 'moderate'; rec = 'Significant QoL impact — escalate treatment'; }
    else if (total >= 6) { risk = 'small'; rec = 'Moderate QoL impact'; }
    return { score: total, max_score: 30, risk, recommendation: rec, components: { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { pasiScore, scoradScore, dlqiScore, VERSION, CITATIONS };
`;

// ============================================================
// nutrition_engine.js
// ============================================================
const nutrition_engine = `// filepath: namaweb/nutrition_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ASPEN 2016', 'NRS-2002 (2002)', 'GLIM 2019'];

// ============================================================
// bmiInterpretation — BMI categories
// ============================================================
function bmiInterpretation(input) {
    const { weightKg, heightCm } = input;
    if (!weightKg || !heightCm) return { error: 'missing_weight_height' };
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const score = Math.round(bmi * 10) / 10;
    let risk = 'normal', rec = 'Maintain healthy weight';
    if (bmi < 16.5) { risk = 'severe_underweight'; rec = 'Urgent nutritional rehab — refeeding syndrome monitor'; }
    else if (bmi < 18.5) { risk = 'underweight'; rec = 'Nutritional counseling, oral supplements'; }
    else if (bmi >= 30) { risk = 'obese'; rec = 'Comprehensive weight management program'; }
    else if (bmi >= 25) { risk = 'overweight'; rec = 'Lifestyle modification, diet + exercise'; }
    return { score, risk, recommendation: rec, components: { weightKg, heightCm, bmi }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// nrs2002Score — Nutritional Risk Screening
// ============================================================
function nrs2002Score(input) {
    const { bmi, weightLossPct, intakeReduction, severityScore, ageAdjustment } = input;
    const imc = (bmiInterpretation({ weightKg: 70, heightCm: bmi }).score || (bmi ?? 0));
    let score = 0;
    const components = {};
    if (bmi !== undefined && bmi < 18.5) { score += 3; components.lbmi = 3; }
    else if (bmi !== undefined && bmi < 20.5) { score += 2; components.lbmi = 2; }
    if (weightLossPct !== undefined) {
        if (weightLossPct > 5) { score += 3; components.wloss = 3; }
        else if (weightLossPct > 3) { score += 2; components.wloss = 2; }
    }
    if (intakeReduction === 'severe') { score += 3; components.intake = 3; }
    else if (intakeReduction === 'moderate') { score += 2; components.intake = 2; }
    if (severityScore !== undefined) { score += severityScore; components.severity = severityScore; }
    if (ageAdjustment) { score += 1; components.age = 1; }
    let risk = 'low', rec = 'Weekly rescreening';
    if (score >= 5) { risk = 'high'; rec = 'Nutritional support plan'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Nutritional intervention'; }
    return { score, max_score: 7, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

// ============================================================
// caloricNeeds — Mifflin-St Jeor BMR
// ============================================================
function caloricNeeds(input) {
    const { weightKg, heightCm, age, sex, activityFactor } = input;
    if (!weightKg || !heightCm || !age || !sex) return { error: 'missing_inputs' };
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (sex === 'male') bmr += 5; else bmr -= 161;
    const af = activityFactor || 1.3;
    const tdee = Math.round(bmr * af);
    let risk = 'normal', rec = 'Maintain intake';
    if (tdee < 1200) { risk = 'low'; rec = 'Ensure caloric intake above 1200 kcal/day'; }
    else if (tdee > 3500) { risk = 'high'; rec = 'Very high metabolic rate — assess for hyperthyroid'; }
    return { score: tdee, bmr: Math.round(bmr), risk, recommendation: rec, factor: af, components: { weightKg, heightCm, age, sex }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { bmiInterpretation, nrs2002Score, caloricNeeds, VERSION, CITATIONS };
`;

// ============================================================
// hematology_engine.js
// ============================================================
const hematology_engine = `// filepath: namaweb/hematology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ASH 2022', 'WHO Hemoglobin 2011', 'ISTH DIC 2001'];

// ============================================================
// hemoglobinInterpretation — Anemia classification
// ============================================================
function hemoglobinInterpretation(input) {
    const { hb, sex, age, altitude } = input;
    if (hb === undefined) return { error: 'missing_hb' };
    const a = age ?? 30;
    const s = sex ?? 'male';
    let lowerLimit = (s === 'female') ? 12 : 13;
    if (a < 5) lowerLimit = 11;
    else if (a < 12) lowerLimit = 11.5;
    else if (a < 18) lowerLimit = 12;
    const adjusted = lowerLimit + (altitude ?? 0) * 0.5;
    const drop = adjusted - hb;
    let risk = 'normal', rec = 'No anemia';
    const score = Math.round(hb * 10) / 10;
    if (hb < 7) { risk = 'severe'; rec = 'Transfusion evaluation; urgent workup'; }
    else if (hb < 10) { risk = 'moderate'; rec = 'Iron studies, retic, peripheral smear'; }
    else if (hb < adjusted) { risk = 'mild'; rec = 'Mild anemia — clinical correlation'; }
    return { score, adjusted_lower_limit: adjusted, risk, recommendation: rec, deficit: Math.round(drop * 10) / 10, components: { hb, sex: s, age: a }, cite: CITATIONS[1], version: VERSION };
}

// ============================================================
// isthDicScore — DIC scoring
// ============================================================
function isthDicScore(input) {
    const { platelets, pt, fibrinogen, dDimer } = input;
    let score = 0;
    const components = {};
    if (platelets !== undefined) {
        if (platelets > 100) { score += 0; components.platelets = 0; }
        else if (platelets >= 50) { score += 1; components.platelets = 1; }
        else { score += 2; components.platelets = 2; }
    }
    if (pt !== undefined) {
        if (pt < 3) { score += 0; components.pt = 0; }
        else if (pt <= 6) { score += 1; components.pt = 1; }
        else { score += 2; components.pt = 2; }
    }
    if (fibrinogen !== undefined) {
        if (fibrinogen >= 1) { score += 0; components.fibrinogen = 0; }
        else { score += 1; components.fibrinogen = 1; }
    }
    if (dDimer !== undefined) {
        if (dDimer < 7) { score += 0; components.dDimer = 0; }
        else if (dDimer <= 14) { score += 2; components.dDimer = 2; }
        else { score += 3; components.dDimer = 3; }
    }
    let risk = 'low', rec = 'Inconsistent with DIC';
    if (score >= 5) { risk = 'overt_dic'; rec = 'Treat underlying cause; FFP, platelets, cryo'; }
    else if (score >= 2) { risk = 'subclinical'; rec = 'Serial labs, monitor for progression'; }
    return { score, max_score: 8, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { hemoglobinInterpretation, isthDicScore, VERSION, CITATIONS };
`;

// ============================================================
// immunology_engine.js
// ============================================================
const immunology_engine = `// filepath: namaweb/immunology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ESID 2022', 'Jeffrey Modell Foundation 2020'];

// ============================================================
// idfScore — Immunodeficiency diagnostic score
// ============================================================
function idfScore(input) {
    const { recurrentInfections, severeInfections, opportunisticInfections, failureToThrive, persistentDiarrhea, candidiasis, familyHistory } = input;
    let score = 0;
    const components = {};
    if (recurrentInfections) { score += 2; components.recurrent = 2; }
    if (severeInfections) { score += 3; components.severe = 3; }
    if (opportunisticInfections) { score += 4; components.opp = 4; }
    if (failureToThrive) { score += 3; components.failure = 3; }
    if (persistentDiarrhea) { score += 2; components.diarrhea = 2; }
    if (candidiasis) { score += 2; components.candida = 2; }
    if (familyHistory) { score += 3; components.family = 3; }
    let risk = 'low', rec = 'Unlikely immunodeficiency';
    if (score >= 10) { risk = 'definitive'; rec = 'Refer to clinical immunologist, LAD, lymphocyte subsets'; }
    else if (score >= 6) { risk = 'probable'; rec = 'Strongly consider PID evaluation'; }
    else if (score >= 3) { risk = 'possible'; rec = 'Monitor, consider basic immunology workup'; }
    return { score, max_score: 19, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

// ============================================================
// primaryImmunodeficiencyScreen — General screening
// ============================================================
function primaryImmunodeficiencyScreen(input) {
    const { ageOfOnset, infectionsPerYear, deepInfections, familyHistory, autoimmunity, malignancy } = input;
    let score = 0;
    const c = {};
    if (ageOfOnset !== undefined && ageOfOnset < 5) { score += 3; c.early = 3; }
    else if (ageOfOnset < 18) { score += 1; c.early = 1; }
    if (infectionsPerYear !== undefined && infectionsPerYear >= 4) { score += 2; c.freq = 2; }
    if (deepInfections) { score += 3; c.deep = 3; }
    if (familyHistory) { score += 2; c.fam = 2; }
    if (autoimmunity) { score += 2; c.auto = 2; }
    if (malignancy) { score += 2; c.mal = 2; }
    let risk = 'low', rec = 'No PID indicated';
    if (score >= 6) { risk = 'high'; rec = 'Ig levels, lymphocyte subsets, vaccine titers'; }
    else if (score >= 3) { risk = 'moderate'; rec = 'Basic workup, monitor'; }
    return { score, max_score: 14, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { idfScore, primaryImmunodeficiencyScreen, VERSION, CITATIONS };
`;

// ============================================================
// ophthalmology_engine.js (new file)
// ============================================================
const ophthalmology_engine = `// filepath: namaweb/ophthalmology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAO 2023', 'ISGEO 2020', 'DRCR.net Protocol T'];

// ============================================================
// refractiveError — Spherical equivalent
// ============================================================
function refractiveError(input) {
    const { sphere, cylinder, axis } = input;
    const se = (sphere ?? 0) + ((cylinder ?? 0) / 2);
    const score = Math.round(se * 100) / 100;
    let risk = 'low', rec = 'No correction needed';
    if (se <= -6) { risk = 'high'; rec = 'High myopia — annual retina exam, screen for retinal detachment'; }
    else if (se <= -3) { risk = 'moderate'; rec = 'Moderate myopia'; }
    else if (se <= -0.5) { risk = 'low'; rec = 'Mild myopia'; }
    else if (se >= 0.5) { rec = 'Hyperopia'; }
    return { score, risk, recommendation: rec, components: { sphere, cylinder, axis, se }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// dryEyeScore — OSDI-based
// ============================================================
function dryEyeScore(input) {
    const { symptoms, lightSensitivity, grittyFeeling, painfulEyes, blurredVision, poorVision, readingDifficulty, drivingDifficulty, computerDiscomfort, tvDiscomfort, windyConditions, lowHumidity, airConditioning } = input;
    const items = [symptoms, lightSensitivity, grittyFeeling, painfulEyes, blurredVision, poorVision, readingDifficulty, drivingDifficulty, computerDiscomfort, tvDiscomfort, windyConditions, lowHumidity, airConditioning].filter(v => v !== undefined);
    if (items.length === 0) return { error: 'no_answers' };
    const total = items.reduce((a, b) => a + b, 0);
    const score = Math.round((total / (items.length * 4)) * 100);
    let risk = 'normal', rec = 'No dry eye';
    if (score >= 50) { risk = 'severe'; rec = 'Cyclosporine, punctal plugs, autologous serum'; }
    else if (score >= 25) { risk = 'moderate'; rec = 'Preservative-free artificial tears, omega-3'; }
    else if (score >= 13) { risk = 'mild'; rec = 'Artificial tears as needed'; }
    return { score, max_score: 100, risk, recommendation: rec, components: { total, items_count: items.length }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { refractiveError, dryEyeScore, VERSION, CITATIONS };
`;

// ============================================================
// ent_engine.js (new file)
// ============================================================
const ent_engine = `// filepath: namaweb/ent_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAO-HNS 2023', 'Lichtenstein 1973', 'House 1985'];

// ============================================================
// hearingLossClassification — Pure-tone average
// ============================================================
function hearingLossClassification(input) {
    const { dB500, dB1000, dB2000, dB4000, ear } = input;
    const pts = [dB500, dB1000, dB2000, dB4000].filter(v => v !== undefined);
    if (pts.length === 0) return { error: 'no_thresholds' };
    const pta = pts.reduce((a, b) => a + b, 0) / pts.length;
    const score = Math.round(pta * 10) / 10;
    let risk = 'normal', rec = 'No hearing loss';
    if (pta >= 91) { risk = 'profound'; rec = 'Cochlear implant evaluation'; }
    else if (pta >= 71) { risk = 'severe'; rec = 'Power hearing aid'; }
    else if (pta >= 56) { risk = 'moderately_severe'; rec = 'Hearing aid fitting'; }
    else if (pta >= 41) { risk = 'moderate'; rec = 'Hearing aid; ENT referral'; }
    else if (pta >= 26) { risk = 'mild'; rec = 'Monitor; speech in noise test'; }
    return { score, ear: ear || 'right', risk, recommendation: rec, components: { dB500, dB1000, dB2000, dB4000, pta }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// vertigoHints — HINTS exam for central vs peripheral
// ============================================================
function vertigoHints(input) {
    const { hITest, iN, tsT, directionChanging, skewDeviation } = input;
    let score = 0;
    const components = {};
    if (hITest === 'normal') { score += 2; components.hit = 2; }
    if (iN === 'absent') { score += 1; components.in = 1; }
    if (tsT === 'rotatory') { score += 1; components.tst = 1; }
    if (skewDeviation) { score += 2; components.skew = 2; }
    let risk = 'peripheral', rec = 'BPPV/neuritis likely';
    if (score >= 3) { risk = 'central'; rec = 'ACUTE stroke workup — MRI brain, neurology'; }
    return { score, max_score: 6, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { hearingLossClassification, vertigoHints, VERSION, CITATIONS };
`;

// ============================================================
// cardiology_engine.js (additional functions)
// ============================================================
const cardiology_extra = `// filepath: namaweb/cardiology_extras.js
// Additional cardiology calculators to be merged into cardiology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ACC/AHA 2023', 'ESC HF 2023'];

// ============================================================
// cha2ds2vascScore — Stroke risk in AF
// ============================================================
function cha2ds2vascScore(input) {
    const { age, sex, chf, htn, dm, stroke, vascular } = input;
    let score = 0;
    const c = {};
    if (chf) { score += 1; c.chf = 1; }
    if (htn) { score += 1; c.htn = 1; }
    if (age !== undefined) {
        if (age >= 75) { score += 2; c.age = 2; }
        else if (age >= 65) { score += 1; c.age = 1; }
    }
    if (dm) { score += 1; c.dm = 1; }
    if (stroke) { score += 2; c.stroke = 2; }
    if (vascular) { score += 1; c.vascular = 1; }
    if (sex === 'female') { score += 1; c.sex = 1; }
    let risk = 'low', rec = 'No anticoagulation';
    if (score >= 2) { risk = 'high'; rec = 'Oral anticoagulation (DOAC preferred)'; }
    else if (score === 1) { risk = 'moderate'; rec = 'Consider anticoagulation'; }
    return { score, max_score: 9, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// hasBledScore — Bleeding risk on anticoagulation
// ============================================================
function hasBledScore(input) {
    const { htn, abnormalRenal, abnormalLiver, stroke, bleeding, labileINR, elderly, drugs, alcohol } = input;
    let score = 0;
    const c = {};
    if (htn) { score += 1; c.htn = 1; }
    if (abnormalRenal) { score += 1; c.renal = 1; }
    if (abnormalLiver) { score += 1; c.liver = 1; }
    if (stroke) { score += 1; c.stroke = 1; }
    if (bleeding) { score += 1; c.bleeding = 1; }
    if (labileINR) { score += 1; c.inr = 1; }
    if (elderly) { score += 1; c.age = 1; }
    if (drugs) { score += 1; c.drugs = 1; }
    if (alcohol) { score += 1; c.alcohol = 1; }
    let risk = 'low', rec = 'Anticoagulation reasonable';
    if (score >= 3) { risk = 'high'; rec = 'High bleed risk — closer monitoring, modifiable risk factors'; }
    return { score, max_score: 9, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { cha2ds2vascScore, hasBledScore, VERSION, CITATIONS };
`;

// ============================================================
// oncology_engine.js (additional)
// ============================================================
const oncology_extra = `// filepath: namaweb/oncology_extras.js
// Additional oncology calculators
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AJCC 8th Edition', 'NCCN 2024'];

// ============================================================
// childPughScore — Liver function
// ============================================================
function childPughScore(input) {
    const { bilirubin, albumin, inr, ascites, encephalopathy } = input;
    let score = 0;
    const c = {};
    if (bilirubin !== undefined) {
        if (bilirubin < 2) { score += 1; c.bili = 1; }
        else if (bilirubin <= 3) { score += 2; c.bili = 2; }
        else { score += 3; c.bili = 3; }
    }
    if (albumin !== undefined) {
        if (albumin > 3.5) { score += 1; c.alb = 1; }
        else if (albumin >= 2.8) { score += 2; c.alb = 2; }
        else { score += 3; c.alb = 3; }
    }
    if (inr !== undefined) {
        if (inr < 1.7) { score += 1; c.inr = 1; }
        else if (inr <= 2.3) { score += 2; c.inr = 2; }
        else { score += 3; c.inr = 3; }
    }
    if (ascites === 'none') { score += 1; c.asc = 1; }
    else if (ascites === 'mild') { score += 2; c.asc = 2; }
    else if (ascites === 'moderate') { score += 3; c.asc = 3; }
    if (encephalopathy === 'none') { score += 1; c.enc = 1; }
    else if (encephalopathy === 'grade_1_2') { score += 2; c.enc = 2; }
    else if (encephalopathy === 'grade_3_4') { score += 3; c.enc = 3; }
    let risk = 'good', rec = 'A or B class';
    let cls = 'A';
    if (score >= 10) { risk = 'high'; rec = 'Class C — decompensated cirrhosis'; cls = 'C'; }
    else if (score >= 7) { risk = 'moderate'; rec = 'Class B — close monitoring'; cls = 'B'; }
    return { score, max_score: 15, class: cls, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { childPughScore, VERSION, CITATIONS };
`;

// ============================================================
// neurology_engine.js (additional)
// ============================================================
const neurology_extra = `// filepath: namaweb/neurology_extras.js
// Additional neurology calculators
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAN 2023', 'MoCA 2005'];

// ============================================================
// mocaScore — Montreal Cognitive Assessment
// ============================================================
function mocaScore(input) {
    const { visuospatial, naming, attention, language, abstraction, delayedRecall, orientation, educationYears } = input;
    let score = (visuospatial ?? 0) + (naming ?? 0) + (attention ?? 0) + (language ?? 0) + (abstraction ?? 0) + (delayedRecall ?? 0) + (orientation ?? 0);
    if ((educationYears ?? 0) <= 12) score += 1; // education correction
    const total = Math.min(score, 30);
    let risk = 'normal', rec = 'Normal cognition';
    if (total < 10) { risk = 'severe_impairment'; rec = 'Dementia evaluation'; }
    else if (total < 18) { risk = 'moderate'; rec = 'Comprehensive cognitive workup'; }
    else if (total < 26) { risk = 'mild'; rec = 'MCI — follow up, vasc risk reduction'; }
    return { score: total, max_score: 30, risk, recommendation: rec, components: { visuospatial, naming, attention, language, abstraction, delayedRecall, orientation, education_correction: (educationYears ?? 0) <= 12 ? 1 : 0 }, cite: CITATIONS[1], version: VERSION };
}

// ============================================================
// rankinScore — Modified Rankin Scale
// ============================================================
function rankinScore(input) {
    const { disabilityGrade } = input;
    const g = disabilityGrade ?? 0;
    if (g < 0 || g > 6) return { error: 'invalid_rankin', valid: '0-6' };
    const desc = { 0: 'No symptoms', 1: 'No significant disability despite symptoms', 2: 'Slight disability — independent in daily activities', 3: 'Moderate disability — requires some help', 4: 'Moderately severe disability — unable to attend to own bodily needs without assistance', 5: 'Severe disability — bedridden, incontinent, requires constant care', 6: 'Dead' };
    let risk = 'good', rec = 'No significant disability';
    if (g >= 5) { risk = 'severe'; rec = 'Chronic care; full dependency'; }
    else if (g >= 3) { risk = 'significant'; rec = 'Rehab, social support'; }
    return { score: g, max_score: 6, risk, recommendation: rec, description: desc[g], components: { g }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { mocaScore, rankinScore, VERSION, CITATIONS };
`;

// ============================================================
// orthopedics_engine.js (additional)
// ============================================================
const orthopedics_extra = `// filepath: namaweb/orthopedics_extras.js
// Additional orthopedics calculators
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Harris 1969', 'Constant 1987'];

// ============================================================
// harrisHipScore — Hip function
// ============================================================
function harrisHipScore(input) {
    const { pain, gait, activity, deformity, rom } = input;
    const total = (pain ?? 0) + (gait ?? 0) + (activity ?? 0) + (deformity ?? 0) + (rom ?? 0);
    let risk = 'excellent', rec = 'No intervention';
    if (total < 70) { risk = 'poor'; rec = 'Hip replacement consideration'; }
    else if (total < 80) { risk = 'fair'; rec = 'Conservative management, consider surgery'; }
    else if (total < 90) { risk = 'good'; rec = 'Monitor'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { pain, gait, activity, deformity, rom }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// beightonScore — Joint hypermobility
// ============================================================
function beightonScore(input) {
    const { pinkyBack, thumbForearm, elbowHypermob, kneeHypermob, palmToFloor } = input;
    let score = 0;
    const c = {};
    if (pinkyBack) { score += 1; c.pinky = 1; }
    if (thumbForearm) { score += 1; c.thumb = 1; }
    if (elbowHypermob) { score += 1; c.elbow = 1; }
    if (kneeHypermob) { score += 1; c.knee = 1; }
    if (palmToFloor) { score += 1; c.floor = 1; }
    let risk = 'normal', rec = 'No hypermobility';
    if (score >= 5) { risk = 'high'; rec = 'Joint hypermobility syndrome'; }
    else if (score >= 3) { risk = 'mild'; rec = 'Monitor'; }
    return { score, max_score: 9, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { harrisHipScore, beightonScore, VERSION, CITATIONS };
`;

// Write all enhanced engines
const TARGETS = {
    allergy: allergy_engine,
    dermatology: dermatology_engine,
    nutrition: nutrition_engine,
    hematology: hematology_engine,
    immunology: immunology_engine,
    'ophthalmology_engine.js': ophthalmology_engine,
    'ent_engine.js': ent_engine,
    'cardiology_extras.js': cardiology_extra,
    'oncology_extras.js': oncology_extra,
    'neurology_extras.js': neurology_extra,
    'orthopedics_extras.js': orthopedics_extra,
};

let count = 0;
for (const [key, code] of Object.entries(TARGETS)) {
    const isStub = (key === 'ophthalmology_engine.js' || key === 'ent_engine.js') ?
        !fs.existsSync(`namaweb/${key}`) :
        fs.existsSync(`namaweb/${key}`) && fs.statSync(`namaweb/${key}`).size < 5000;
    if (isStub || key.includes('extras')) {
        const fpath = key.includes('extras') ? `namaweb/${key}` : `namaweb/${key}`;
        fs.writeFileSync(fpath, code);
        count++;
        console.log(`Wrote ${fpath} (${code.length} bytes)`);
    }
}
console.log(`\nTotal enhanced: ${count}`);
