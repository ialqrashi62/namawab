// filepath: namaweb/psychiatry_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['PHQ-9 (Kroenke 2001)', 'GAD-7 (Spitzer 2006)', 'C-SSRS (Posner 2011)'];

function phq9(input) {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9 } = input;
    const items = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
    if (items.some(v => v === undefined || v < 0 || v > 3)) return { error: 'invalid_phq9', valid: '0-3 each' };
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'No treatment';
    if (total >= 20) { risk = 'severe'; rec = 'SSRI + CBT, frequent follow-up'; }
    else if (total >= 15) { risk = 'moderately_severe'; rec = 'SSRI or CBT'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'CBT, consider SSRI'; }
    else if (total >= 5) { risk = 'mild'; rec = 'Watchful waiting'; }
    return { score: total, max_score: 27, risk, recommendation: rec, components: { q1, q2, q3, q4, q5, q6, q7, q8, q9 }, cite: CITATIONS[0], version: VERSION };
}

function gad7(input) {
    const { q1, q2, q3, q4, q5, q6, q7 } = input;
    const items = [q1, q2, q3, q4, q5, q6, q7];
    if (items.some(v => v === undefined || v < 0 || v > 3)) return { error: 'invalid_gad7', valid: '0-3 each' };
    const total = items.reduce((a, b) => a + b, 0);
    let risk = 'minimal', rec = 'No anxiety';
    if (total >= 15) { risk = 'severe'; rec = 'SSRI + CBT, consider referral'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'CBT, possibly SSRI'; }
    else if (total >= 5) { risk = 'mild'; rec = 'Monitor, relaxation techniques'; }
    return { score: total, max_score: 21, risk, recommendation: rec, components: { q1, q2, q3, q4, q5, q6, q7 }, cite: CITATIONS[1], version: VERSION };
}

function cssrs(input) {
    const { passiveIdeation, activeIdeation, plan, intent, behavior, timeFrame } = input;
    let score = 0;
    const components = {};
    if (passiveIdeation) { score += 1; components.passiveIdeation = true; }
    if (activeIdeation) { score += 2; components.activeIdeation = true; }
    if (plan) { score += 3; components.plan = true; }
    if (intent) { score += 4; components.intent = true; }
    if (behavior) { score += 5; components.behavior = true; }
    let risk = 'low', rec = 'Routine care';
    if (behavior || intent) { risk = 'imminent'; rec = 'IMMEDIATE: 1:1 sitter, hospitalization, safety plan'; }
    else if (plan) { risk = 'high'; rec = 'Same-day evaluation, restrict means'; }
    else if (activeIdeation) { risk = 'moderate'; rec = 'Safety plan, frequent follow-up'; }
    else if (passiveIdeation) { risk = 'low-moderate'; rec = 'Safety plan'; }
    return { score, max_score: 15, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { phq9, gad7, cssrs, VERSION, CITATIONS };
