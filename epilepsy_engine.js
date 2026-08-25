// filepath: namaweb/epilepsy_engine.js
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
