// filepath: namaweb/cicu_engine.js
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
