// filepath: namaweb/surgery_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['ASA (1963)', 'Caprini (2005)', 'RCRI (Lee 1999)'];

function asa(input) {
    const { class: asaClass } = input;
    if (asaClass < 1 || asaClass > 6) return { error: 'invalid_asa', valid: '1-6' };
    const levels = { 1: 'Healthy patient', 2: 'Mild systemic disease', 3: 'Severe systemic disease', 4: 'Severe systemic disease, constant threat to life', 5: 'Moribund patient', 6: 'Brain-dead organ donor' };
    let risk = 'low', rec = 'Standard';
    if (asaClass >= 4) { risk = 'high'; rec = 'ICU post-op'; }
    else if (asaClass === 3) { risk = 'moderate'; rec = 'Close monitoring'; }
    return { score: asaClass, max_score: 6, risk, recommendation: rec, description: levels[asaClass], components: { class: asaClass }, cite: CITATIONS[0], version: VERSION };
}

function caprini(input) {
    const { age, sex, surgeryType, mobility, riskFactors } = input;
    let score = 0;
    const components = {};
    if (age >= 75) { score += 3; components.age = '≥75'; }
    else if (age >= 60) { score += 2; components.age = '60-74'; }
    else if (age >= 40) { score += 1; components.age = '40-59'; }
    if (surgeryType === 'major') { score += 2; components.surgery = 'major'; }
    if (mobility === 'bedrest') { score += 1; components.mobility = 'bedrest'; }
    if (riskFactors && Array.isArray(riskFactors)) {
        for (const rf of riskFactors) {
            if (['cancer', 'chemo', 'vte_history', 'family_vte', 'obesity', 'smoking', 'varicose_veins', 'oral_contraceptives'].includes(rf)) {
                score += 1;
                components[rf] = 1;
            }
        }
    }
    let risk = 'low', rec = 'Early ambulation';
    if (score >= 5) { risk = 'very_high'; rec = 'Extend LMWH prophylaxis 30 days'; }
    else if (score >= 3) { risk = 'high'; rec = 'LMWH prophylaxis'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Heparin prophylaxis'; }
    return { score, max_score: 20, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function rcri(input) {
    const { highRiskSurgery, ischemicHeartDisease, heartFailure, cerebrovascularDisease, diabetesOnInsulin, crf } = input;
    let score = 0;
    const components = {};
    if (highRiskSurgery) { score += 1; components.highRiskSurgery = true; }
    if (ischemicHeartDisease) { score += 1; components.ihd = true; }
    if (heartFailure) { score += 1; components.chf = true; }
    if (cerebrovascularDisease) { score += 1; components.cvd = true; }
    if (diabetesOnInsulin) { score += 1; components.diabetes = true; }
    if (crf) { score += 1; components.crf = true; }
    let risk = 'low', rec = 'Standard perioperative care';
    if (score >= 3) { risk = 'high'; rec = 'Cardiology consult, consider stress test'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Beta-blocker consideration'; }
    return { score, max_score: 6, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { asa, caprini, rcri, VERSION, CITATIONS };
