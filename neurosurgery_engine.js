// filepath: namaweb/neurosurgery_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Hunt-Hess 1968', 'ICH 2013', 'Marshall 1991'];

function huntHess(input) {
    const { grade } = input;
    if (grade === undefined || grade < 1 || grade > 5) return { error: 'invalid_grade', valid: '1-5' };
    const desc = { 1: 'Asymptomatic/minimal HA', 2: 'Moderate-severe HA, nuchal rigidity', 3: 'Lethargy, mild neuro deficit', 4: 'Stupor, severe deficit', 5: 'Coma, decerebrate posture' };
    let risk = 'low', rec = 'Close monitoring';
    if (grade >= 4) { risk = 'very_high'; rec = 'Urgent intervention'; }
    else if (grade >= 3) { risk = 'high'; rec = 'ICU, urgent surgery eval'; }
    return { score: grade, max_score: 5, risk, recommendation: rec, description: desc[grade], components: { grade }, cite: CITATIONS[0], version: VERSION };
}

function ichScore(input) {
    const { age, gcs, ichVolume, ivhOrLocation } = input;
    let score = 0;
    if (age >= 80) score += 2;
    else if (age >= 65) score += 1;
    if (gcs >= 13) score += 0;
    else if (gcs >= 5) score += 1;
    else score += 2;
    if (ichVolume >= 30) score += 1;
    if (ivhOrLocation === 'infratentorial') score += 1;
    let risk = 'low', rec = 'Close monitoring';
    if (score >= 4) { risk = 'very_high'; rec = 'Mortality >50%'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'ICU'; }
    return { score, max_score: 6, risk, recommendation: rec, components: { age, gcs, ichVolume, ivhOrLocation }, cite: CITATIONS[1], version: VERSION };
}

function marshallScore(input) {
    const { ctCategory } = input;
    const desc = { 1: 'No visible intracranial pathology', 2: 'Cisterns present, midline shift 0-5mm', 3: 'Cisterns absent, midline shift 0-5mm', 4: 'Midline shift >5mm', 5: 'Surgical mass lesion', 6: 'High- or mixed-density mass >25cc' };
    if (ctCategory === undefined || ctCategory < 1 || ctCategory > 6) return { error: 'invalid_marshall', valid: '1-6' };
    let risk = 'low', rec = 'Standard care';
    if (ctCategory >= 4) { risk = 'high'; rec = 'Surgical intervention'; }
    return { score: ctCategory, max_score: 6, risk, recommendation: rec, description: desc[ctCategory], components: { ctCategory }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { huntHess, ichScore, marshallScore, VERSION, CITATIONS };
