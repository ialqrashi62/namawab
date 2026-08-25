// filepath: namaweb/nicu_engine.js
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
