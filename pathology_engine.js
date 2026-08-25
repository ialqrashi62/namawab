// filepath: namaweb/pathology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Gleason 1966', 'Nottingham 1991'];

function gleasonScore(input) {
    const { primary, secondary } = input;
    if (primary === undefined || secondary === undefined) return { error: 'missing_grade' };
    const total = primary + secondary;
    let risk = 'low', rec = 'Wait';
    if (total >= 8) { risk = 'high'; rec = 'Aggressive treatment'; }
    else if (total >= 6) { risk = 'moderate'; rec = 'Multimodal therapy'; }
    return { score: total, grade: 'Gleason ' + total, risk, recommendation: rec, components: { primary, secondary }, cite: CITATIONS[0], version: VERSION };
}

function nottinghamScore(input) {
    const { tubule, nuclear, mitotic } = input;
    const total = (tubule ?? 0) + (nuclear ?? 0) + (mitotic ?? 0);
    let risk = 'low', rec = 'Routine';
    if (total >= 8) { risk = 'high'; rec = 'Aggressive treatment'; }
    else if (total >= 6) { risk = 'moderate'; rec = 'Multimodal therapy'; }
    return { score: total, max_score: 9, risk, recommendation: rec, components: { tubule, nuclear, mitotic }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { gleasonScore, nottinghamScore, VERSION, CITATIONS };
