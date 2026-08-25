// filepath: namaweb/ccu_engine.js
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
