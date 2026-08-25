// filepath: namaweb/ophthalmology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAO 2023', 'ISGEO 2020', 'DRCR.net Protocol T'];

// ============================================================
// refractiveError — Spherical equivalent
// ============================================================
function refractiveError(input) {
    const { sphere, cylinder, axis } = input;
    const se = (sphere ?? 0) + ((cylinder ?? 0) / 2);
    const score = Math.round(se * 100) / 100;
    let risk = 'low', rec = 'No correction needed';
    if (se <= -6) { risk = 'high'; rec = 'High myopia — annual retina exam, screen for retinal detachment'; }
    else if (se <= -3) { risk = 'moderate'; rec = 'Moderate myopia'; }
    else if (se <= -0.5) { risk = 'low'; rec = 'Mild myopia'; }
    else if (se >= 0.5) { rec = 'Hyperopia'; }
    return { score, risk, recommendation: rec, components: { sphere, cylinder, axis, se }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// dryEyeScore — OSDI-based
// ============================================================
function dryEyeScore(input) {
    const { symptoms, lightSensitivity, grittyFeeling, painfulEyes, blurredVision, poorVision, readingDifficulty, drivingDifficulty, computerDiscomfort, tvDiscomfort, windyConditions, lowHumidity, airConditioning } = input;
    const items = [symptoms, lightSensitivity, grittyFeeling, painfulEyes, blurredVision, poorVision, readingDifficulty, drivingDifficulty, computerDiscomfort, tvDiscomfort, windyConditions, lowHumidity, airConditioning].filter(v => v !== undefined);
    if (items.length === 0) return { error: 'no_answers' };
    const total = items.reduce((a, b) => a + b, 0);
    const score = Math.round((total / (items.length * 4)) * 100);
    let risk = 'normal', rec = 'No dry eye';
    if (score >= 50) { risk = 'severe'; rec = 'Cyclosporine, punctal plugs, autologous serum'; }
    else if (score >= 25) { risk = 'moderate'; rec = 'Preservative-free artificial tears, omega-3'; }
    else if (score >= 13) { risk = 'mild'; rec = 'Artificial tears as needed'; }
    return { score, max_score: 100, risk, recommendation: rec, components: { total, items_count: items.length }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { refractiveError, dryEyeScore, VERSION, CITATIONS };
