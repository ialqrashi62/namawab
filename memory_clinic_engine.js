// filepath: namaweb/memory_clinic_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['MMSE (Folstein 1975)', 'AD8 (Galvin 2005)'];

function mmseScore(input) {
    const { orientation, registration, attention, recall, language, praxis, visuospatial } = input;
    const total = (orientation ?? 0) + (registration ?? 0) + (attention ?? 0) + (recall ?? 0) + (language ?? 0) + (praxis ?? 0) + (visuospatial ?? 0);
    let risk = 'normal', rec = 'No dementia';
    if (total < 10) { risk = 'severe'; rec = 'Severe cognitive impairment'; }
    else if (total < 20) { risk = 'moderate'; rec = 'Moderate cognitive impairment'; }
    else if (total < 25) { risk = 'mild'; rec = 'Mild cognitive impairment'; }
    return { score: total, max_score: 30, risk, recommendation: rec, components: { orientation, registration, attention, recall, language, praxis, visuospatial }, cite: CITATIONS[0], version: VERSION };
}

function ad8Score(input) {
    const items = ['judgment', 'interests', 'repeating', 'learning', 'finances', 'appliances', 'remembering', 'memory'];
    const answers = items.map(k => input[k] || 0);
    const yes = answers.filter(v => v === 1).length;
    let risk = 'normal', rec = 'No dementia';
    if (yes >= 2) { risk = 'impaired'; rec = 'Cognitive impairment — full workup'; }
    return { score: yes, max_score: 8, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = answers[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { mmseScore, ad8Score, VERSION, CITATIONS };
