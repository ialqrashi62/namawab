// filepath: namaweb/cardiac_rehab_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AHA 2020', 'Borg 1982', 'DASI (Hlatky 1989)'];

function rpeScale(input) {
    const { rpe } = input;
    if (rpe === undefined || rpe < 6 || rpe > 20) return { error: 'invalid_rpe', valid: '6-20' };
    let rec = 'Continue';
    if (rpe >= 17) { rec = 'Maximum effort — STOP test'; }
    else if (rpe >= 14) { rec = 'High intensity — adjust'; }
    else if (rpe >= 11) { rec = 'Moderate — appropriate'; }
    return { score: rpe, max_score: 20, risk: rpe >= 17 ? 'high' : 'low', recommendation: rec, components: { rpe }, cite: CITATIONS[1], version: VERSION };
}

function metsEstimation(input) {
    const { speedMph, incline } = input;
    const walking = (speedMph ?? 0) * 26.3 + (incline ?? 0) * 32.1 + 3.5;
    const mets = walking / 3.5;
    const score = Math.round(mets * 10) / 10;
    let risk = 'low', rec = 'Continue';
    if (mets < 4) { risk = 'sedentary'; rec = 'Below functional capacity'; }
    else if (mets >= 10) { risk = 'excellent'; rec = 'Excellent functional capacity'; }
    return { score, risk, recommendation: rec, components: { speedMph, incline }, cite: CITATIONS[0], version: VERSION };
}

function dukeActivityStatus(input) {
    const items = ['personalCare', 'walkIndoors', 'walkOneBlock', 'climbStairs', 'runShort', 'lightHousework', 'moderateHousework', 'heavyHousework', 'yardWork', 'SexualActivity', 'ModerateRecreation', 'StrenuousSports'];
    const weights = [2.75, 1.75, 5.50, 4.50, 8.00, 2.70, 3.50, 5.50, 6.00, 5.25, 4.50, 7.50];
    let score = 0;
    const c = {};
    items.forEach((k, i) => {
        if (input[k]) { score += weights[i]; c[k] = weights[i]; }
    });
    let risk = 'low', rec = 'Continue';
    if (score < 4) { risk = 'poor'; rec = 'Poor functional capacity'; }
    else if (score > 20) { risk = 'good'; rec = 'Good functional capacity'; }
    return { score: Math.round(score * 100) / 100, max_score: 58.2, risk, recommendation: rec, components: c, cite: CITATIONS[2], version: VERSION };
}

module.exports = { rpeScale, metsEstimation, dukeActivityStatus, VERSION, CITATIONS };
