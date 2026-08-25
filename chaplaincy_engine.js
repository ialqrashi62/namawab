// filepath: namaweb/chaplaincy_engine.js
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
