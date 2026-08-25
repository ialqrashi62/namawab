// filepath: namaweb/movement_disorders_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AIMS (1976)', 'GDRS (1985)'];

function aimsScore(input) {
    const { facial, lips, jaw, tongue, neck, trunk, upperLimbs, lowerLimbs } = input;
    const items = [facial, lips, jaw, tongue, neck,upperLimbs, lowerLimbs].filter(v => v !== undefined);
    const total = items.reduce((a, b) => a + b, 0);
    return { score: total, max_score: 28, risk: total >= 14 ? 'severe' : 'low', recommendation: total >= 14 ? 'Consider TD treatment' : 'Monitor', components: { facial, lips, jaw, tongue, neck, trunk, upperLimbs, lowerLimbs }, cite: CITATIONS[0], version: VERSION };
}

function gdrsFahn(input) {
    const { severity, duration, disability } = input;
    const score = (severity ?? 0) + (duration ?? 0) + (disability ?? 0);
    return { score, max_score: 9, risk: score >= 6 ? 'high' : 'low', recommendation: score >= 6 ? 'Botulinum toxin' : 'Monitor', components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { aimsScore, gdrsFahn, VERSION, CITATIONS };
