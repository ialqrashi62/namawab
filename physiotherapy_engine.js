// filepath: namaweb/physiotherapy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Oswestry 1980', 'DASH 1996'];

function oswestryScore(input) {
    const items = ['painIntensity', 'personalCare', 'lifting', 'walking', 'sitting', 'standing', 'sleeping', 'sexLife', 'socialLife', 'travelling'];
    const scores = items.map(k => (input[k] || 0) * 5);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'Normal';
    if (total >= 40) { risk = 'severe'; rec = 'Surgical eval'; }
    else if (total >= 20) { risk = 'moderate'; rec = 'PT, injections'; }
    return { score: total, max_score: 50, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[0], version: VERSION };
}

function dashScore(input) {
    const items = ['openJar', 'heavyChores', 'carryBag', 'washBack', 'useKnife', 'recreationalForce', 'transport', 'housework', 'workPain', 'tingling'];
    const scores = items.map(k => input[k] || 1);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Normal';
    if (total >= 35) { risk = 'high'; rec = 'Significant disability'; }
    return { score: total, max_score: 50, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { oswestryScore, dashScore, VERSION, CITATIONS };
