// filepath: namaweb/orthopedics_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['WOMAC (Bellamy 1988)', 'KOOS-12 (Roos 1998)', 'QuickDASH (Beaton 2005)'];

function womac(input) {
    const { pain, stiffness, physicalFunction } = input;
    const total = (pain || 0) + (stiffness || 0) + (physicalFunction || 0);
    const pct = Math.round((total / 96) * 100);
    let risk = 'none', rec = 'No arthritis';
    if (pct > 50) { risk = 'severe'; rec = 'Total knee replacement consideration'; }
    else if (pct > 30) { risk = 'moderate'; rec = 'Physical therapy, NSAIDs'; }
    else if (pct > 10) { risk = 'mild'; rec = 'Lifestyle modification'; }
    return { score: total, max_score: 96, percent: pct, risk, recommendation: rec, components: { pain, stiffness, physicalFunction }, cite: CITATIONS[0], version: VERSION };
}

function quickDASH(input) {
    const { activities, symptoms, socialFunction } = input;
    const values = [activities, symptoms, socialFunction].filter(v => v !== undefined);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    let risk = 'none', rec = 'No disability';
    if (avg > 50) { risk = 'severe'; rec = 'Significant disability — surgical eval'; }
    else if (avg > 25) { risk = 'moderate'; rec = 'Occupational therapy'; }
    return { score: Math.round(avg), max_score: 100, risk, recommendation: rec, components: { activities, symptoms, socialFunction }, cite: CITATIONS[2], version: VERSION };
}

function koos12(input) {
    const { pain, function: fn, qualityOfLife } = input;
    const avg = ((pain || 0) + (fn || 0) + (qualityOfLife || 0)) / 3;
    let risk = 'good', rec = 'Knee OK';
    if (avg < 50) { risk = 'poor'; rec = 'Significant knee OA'; }
    else if (avg < 70) { risk = 'moderate'; rec = 'Knee therapy'; }
    return { score: Math.round(avg), max_score: 100, risk, recommendation: rec, components: { pain, fn, qualityOfLife }, cite: CITATIONS[1], version: VERSION };
}




// ============================================================
// harrisHipScore — Hip function
// ============================================================
function harrisHipScore(input) {
    const { pain, gait, activity, deformity, rom } = input;
    const total = (pain ?? 0) + (gait ?? 0) + (activity ?? 0) + (deformity ?? 0) + (rom ?? 0);
    let risk = 'excellent', rec = 'No intervention';
    if (total < 70) { risk = 'poor'; rec = 'Hip replacement consideration'; }
    else if (total < 80) { risk = 'fair'; rec = 'Conservative management, consider surgery'; }
    else if (total < 90) { risk = 'good'; rec = 'Monitor'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { pain, gait, activity, deformity, rom }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// beightonScore — Joint hypermobility
// ============================================================
function beightonScore(input) {
    const { pinkyBack, thumbForearm, elbowHypermob, kneeHypermob, palmToFloor } = input;
    let score = 0;
    const c = {};
    if (pinkyBack) { score += 1; c.pinky = 1; }
    if (thumbForearm) { score += 1; c.thumb = 1; }
    if (elbowHypermob) { score += 1; c.elbow = 1; }
    if (kneeHypermob) { score += 1; c.knee = 1; }
    if (palmToFloor) { score += 1; c.floor = 1; }
    let risk = 'normal', rec = 'No hypermobility';
    if (score >= 5) { risk = 'high'; rec = 'Joint hypermobility syndrome'; }
    else if (score >= 3) { risk = 'mild'; rec = 'Monitor'; }
    return { score, max_score: 9, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}
module.exports = { womac, quickDASH, koos12, VERSION, CITATIONS };
