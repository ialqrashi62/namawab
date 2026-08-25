// filepath: namaweb/ent_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['AAO-HNS 2023', 'Lichtenstein 1973', 'House 1985'];

// ============================================================
// hearingLossClassification — Pure-tone average
// ============================================================
function hearingLossClassification(input) {
    const { dB500, dB1000, dB2000, dB4000, ear } = input;
    const pts = [dB500, dB1000, dB2000, dB4000].filter(v => v !== undefined);
    if (pts.length === 0) return { error: 'no_thresholds' };
    const pta = pts.reduce((a, b) => a + b, 0) / pts.length;
    const score = Math.round(pta * 10) / 10;
    let risk = 'normal', rec = 'No hearing loss';
    if (pta >= 91) { risk = 'profound'; rec = 'Cochlear implant evaluation'; }
    else if (pta >= 71) { risk = 'severe'; rec = 'Power hearing aid'; }
    else if (pta >= 56) { risk = 'moderately_severe'; rec = 'Hearing aid fitting'; }
    else if (pta >= 41) { risk = 'moderate'; rec = 'Hearing aid; ENT referral'; }
    else if (pta >= 26) { risk = 'mild'; rec = 'Monitor; speech in noise test'; }
    return { score, ear: ear || 'right', risk, recommendation: rec, components: { dB500, dB1000, dB2000, dB4000, pta }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// vertigoHints — HINTS exam for central vs peripheral
// ============================================================
function vertigoHints(input) {
    const { hITest, iN, tsT, directionChanging, skewDeviation } = input;
    let score = 0;
    const components = {};
    if (hITest === 'normal') { score += 2; components.hit = 2; }
    if (iN === 'absent') { score += 1; components.in = 1; }
    if (tsT === 'rotatory') { score += 1; components.tst = 1; }
    if (skewDeviation) { score += 2; components.skew = 2; }
    let risk = 'peripheral', rec = 'BPPV/neuritis likely';
    if (score >= 3) { risk = 'central'; rec = 'ACUTE stroke workup — MRI brain, neurology'; }
    return { score, max_score: 6, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { hearingLossClassification, vertigoHints, VERSION, CITATIONS };
