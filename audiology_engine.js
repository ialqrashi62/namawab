// filepath: namaweb/audiology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Berger 1983', 'HHIA (Lichtenstein 1983)', 'ASHA 2023'];

// ============================================================
// pureToneAverage — 4-frequency average
// ============================================================
function pureToneAverage(input) {
    const { dB500, dB1000, dB2000, dB4000 } = input;
    const pts = [dB500, dB1000, dB2000, dB4000].filter(v => v !== undefined);
    if (pts.length === 0) return { error: 'no_thresholds' };
    const pta = pts.reduce((a, b) => a + b, 0) / pts.length;
    const score = Math.round(pta * 10) / 10;
    let risk = 'normal', rec = 'No hearing loss';
    if (pta >= 91) { risk = 'profound'; rec = 'Severe-profound — cochlear implant eval'; }
    else if (pta >= 71) { risk = 'severe'; rec = 'Severe — power HA'; }
    else if (pta >= 56) { risk = 'moderately_severe'; rec = 'Mod-severe HA'; }
    else if (pta >= 41) { risk = 'moderate'; rec = 'Moderate HA — HA fitting'; }
    else if (pta >= 26) { risk = 'mild'; rec = 'Mild — monitor'; }
    return { score, threshold_db: pts, risk, recommendation: rec, components: { dB500, dB1000, dB2000, dB4000 }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// hearingHandicapInventory — HHIA screening
// ============================================================
function hearingHandicapInventory(input) {
    const items = ['convo1', 'convo2', 'restaurant', 'phone', 'job', 'visiting', 'annoyed', 'difficulty', 'church', 'restrictions', 'embarrassed', 'handicap', 'social', 'sad'];
    const answers = items.map(k => input[k] || 0);
    const total = answers.reduce((a, b) => a + b, 0);
    let risk = 'none', rec = 'No handicap';
    if (total >= 42) { risk = 'severe'; rec = 'Severe HHIA — full audiologic eval, HA fitting'; }
    else if (total >= 18) { risk = 'moderate'; rec = 'Mild-moderate — HA eval recommended'; }
    return { score: total, max_score: 56, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = answers[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { pureToneAverage, hearingHandicapInventory, VERSION, CITATIONS };
