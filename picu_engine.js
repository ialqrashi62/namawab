// filepath: namaweb/picu_engine.js
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
