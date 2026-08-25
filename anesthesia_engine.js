// filepath: namaweb/anesthesia_engine.js
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
