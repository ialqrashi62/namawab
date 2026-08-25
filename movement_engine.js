// filepath: namaweb/movement_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['UPDRS (Fahn 1987)', 'Hoehn-Yahr 1967'];

function updrsScore(input) {
    const { tremor, rigidity, bradykinesia, posturalStability, gait, freezing } = input;
    const total = (tremor ?? 0) + (rigidity ?? 0) + (bradykinesia ?? 0) + (posturalStability ?? 0) + (gait ?? 0) + (freezing ?? 0);
    let risk = 'mild', rec = 'Standard care';
    if (total >= 20) { risk = 'severe'; rec = 'Advanced — consider DBS eval'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'Adjust dopaminergic therapy'; }
    return { score: total, max_score: 64, risk, recommendation: rec, components: { tremor, rigidity, bradykinesia, posturalStability, gait, freezing }, cite: CITATIONS[0], version: VERSION };
}

function hoehnYahrStaging(input) {
    const { stage } = input;
    if (stage === undefined || stage < 1 || stage > 5) return { error: 'invalid_stage', valid: '1-5' };
    const desc = { 1: 'Unilateral involvement only', 2: 'Bilateral involvement without balance impairment', 3: 'Bilateral with balance impairment', 4: 'Severe disability, able to walk/stand unassisted', 5: 'Wheelchair bound or bedridden' };
    let risk = 'mild', rec = 'Standard care';
    if (stage >= 4) { risk = 'severe'; rec = 'Advanced PD'; }
    else if (stage === 3) { risk = 'moderate'; rec = 'Balance training'; }
    return { score: stage, max_score: 5, risk, recommendation: rec, description: desc[stage], components: { stage }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { updrsScore, hoehnYahrStaging, VERSION, CITATIONS };
