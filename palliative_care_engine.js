// filepath: namaweb/palliative_care_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PPS (Anderson 1996)', 'ESAS (Bruera 1991)'];

function ppsScore(input) {
    const { ambulation, activity, selfCare, intake, consciousness } = input;
    const amb = ambulation ?? 0;
    const act = activity ?? 0;
    const self = selfCare ?? 0;
    const total = Math.min(amb, act, self) * 10;
    let risk = 'good', rec = 'Maintain';
    if (total < 30) { risk = 'dying'; rec = 'Comfort measures only'; }
    else if (total < 50) { risk = 'poor'; rec = 'Palliative focus'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { ambulation: amb, activity: act, selfCare: self, intake, consciousness }, cite: CITATIONS[0], version: VERSION };
}

function esasScore(input) {
    const items = ['pain', 'tiredness', 'nausea', 'depression', 'anxiety', 'drowsiness', 'appetite', 'wellbeing', 'shortness'];
    const scores = items.map(k => input[k] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'none', rec = 'No significant symptoms';
    if (total >= 60) { risk = 'severe'; rec = 'Urgent intervention for multiple symptoms'; }
    else if (total >= 30) { risk = 'moderate'; rec = 'Symptom management'; }
    return { score: total, max_score: 90, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { ppsScore, esasScore, VERSION, CITATIONS };
