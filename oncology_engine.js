// filepath: namaweb/oncology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ECOG (Oken 1982)', 'Karnofsky (1949)', 'AJCC TNM 8th'];

function ecog(input) {
    const { performance } = input;
    if (performance < 0 || performance > 4) return { error: 'invalid_ecog', valid: '0-4' };
    const levels = {
        0: 'Fully active, able to carry on all pre-disease performance without restriction',
        1: 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature',
        2: 'Ambulatory and capable of all self-care but unable to carry out any work activities; up and about more than 50% of waking hours',
        3: 'Capable of only limited self-care; confined to bed or chair more than 50% of waking hours',
        4: 'Completely disabled; cannot carry on any self-care; totally confined to bed or chair'
    };
    let risk = 'low', rec = 'Standard treatment';
    if (performance >= 3) { risk = 'high'; rec = 'Palliative care focus'; }
    else if (performance === 2) { risk = 'moderate'; rec = 'Reduced-dose chemotherapy'; }
    return { score: performance, max_score: 4, risk, recommendation: rec, description: levels[performance], components: { performance }, cite: CITATIONS[0], version: VERSION };
}

function karnofsky(input) {
    const { score } = input;
    if (score < 0 || score > 100 || score % 10 !== 0) return { error: 'invalid_karnofsky', valid: '0,10,20,...,100' };
    let risk = 'good', rec = 'Standard treatment';
    if (score < 50) { risk = 'poor'; rec = 'Hospice consideration'; }
    else if (score < 70) { risk = 'fair'; rec = 'Supportive care + treatment'; }
    return { score, max_score: 100, risk, recommendation: rec, components: { score }, cite: CITATIONS[1], version: VERSION };
}

function tnmStage(input) {
    const { tumor, node, metastasis } = input;
    let stage = '0';
    if (tumor === 'T0' || tumor === 'Tis') stage = '0';
    else if (metastasis === 'M1') stage = 'IV';
    else if (node === 'N3') stage = 'IIIB';
    else if (tumor === 'T4' || node === 'N2') stage = 'IIIA';
    else if (tumor === 'T3') stage = 'IIB';
    else if (tumor === 'T2') stage = 'IIA';
    else if (tumor === 'T1') stage = 'I';
    const stages = { '0': 'Carcinoma in situ', 'I': 'Early localized', 'IIA': 'Localized advanced', 'IIB': 'Locally advanced', 'IIIA': 'Regional advanced', 'IIIB': 'Heavily regional', 'IV': 'Metastatic' };
    return { tnm: { t: tumor, n: node, m: metastasis }, stage, description: stages[stage], risk: stage === 'IV' ? 'high' : 'moderate', recommendation: 'Multidisciplinary tumor board review', components: { tumor, node, metastasis }, cite: CITATIONS[2], version: VERSION };
}

function childPughScore(input) {
    const { bilirubin, albumin, inr, ascites, encephalopathy } = input;
    let score = 0;
    const c = {};
    if (bilirubin !== undefined) {
        if (bilirubin < 2) { score += 1; c.bili = 1; }
        else if (bilirubin <= 3) { score += 2; c.bili = 2; }
        else { score += 3; c.bili = 3; }
    }
    if (albumin !== undefined) {
        if (albumin > 3.5) { score += 1; c.alb = 1; }
        else if (albumin >= 2.8) { score += 2; c.alb = 2; }
        else { score += 3; c.alb = 3; }
    }
    if (inr !== undefined) {
        if (inr < 1.7) { score += 1; c.inr = 1; }
        else if (inr <= 2.3) { score += 2; c.inr = 2; }
        else { score += 3; c.inr = 3; }
    }
    if (ascites === 'none') { score += 1; c.asc = 1; }
    else if (ascites === 'mild') { score += 2; c.asc = 2; }
    else if (ascites === 'moderate') { score += 3; c.asc = 3; }
    if (encephalopathy === 'none') { score += 1; c.enc = 1; }
    else if (encephalopathy === 'grade_1_2') { score += 2; c.enc = 2; }
    else if (encephalopathy === 'grade_3_4') { score += 3; c.enc = 3; }
    let risk = 'good', rec = 'A or B class';
    let cls = 'A';
    if (score >= 10) { risk = 'high'; rec = 'Class C — decompensated cirrhosis'; cls = 'C'; }
    else if (score >= 7) { risk = 'moderate'; rec = 'Class B — close monitoring'; cls = 'B'; }
    return { score, max_score: 15, class: cls, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = {
    ecog, karnofsky, tnmStage, childPughScore,
    VERSION, CITATIONS
};
