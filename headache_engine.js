// filepath: namaweb/headache_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['MIDAS 2001', 'HIT-6 (Kosinski 2003)'];

function midasScore(input) {
    const { daysMissed, productiveDays } = input;
    const item1 = daysMissed ?? 0;
    const item2 = (productiveDays ?? 0) * 0.5;
    const total = item1 + item2;
    let risk = 'minimal', rec = 'Episodic';
    if (total >= 21) { risk = 'severe'; rec = 'Chronic — prophylaxis + acute tx'; }
    else if (total >= 11) { risk = 'moderate'; rec = 'Modification'; }
    else if (total >= 6) { risk = 'mild'; rec = 'Monitor'; }
    return { score: total, max_score: 270, risk, recommendation: rec, components: { daysMissed, productiveDays }, cite: CITATIONS[0], version: VERSION };
}

function hit6Score(input) {
    const { pain, social, work, energy, mood, cognition } = input;
    const items = [pain, social, work, energy, mood, cognition].map(v => v === undefined ? 6 : v);
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'Headache not impacting';
    if (total >= 60) { risk = 'severe'; rec = 'Significant impact — urgent treatment'; }
    else if (total >= 50) { risk = 'moderate'; rec = 'Moderate impact — adjust treatment'; }
    return { score: total, max_score: 78, risk, recommendation: rec, components: { pain, social, work, energy, mood, cognition }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { midasScore, hit6Score, VERSION, CITATIONS };
