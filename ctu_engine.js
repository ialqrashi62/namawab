// filepath: namaweb/ctu_engine.js
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
