// filepath: namaweb/neonatology_engine.js
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
