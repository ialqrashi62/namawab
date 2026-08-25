// filepath: namaweb/infectious_disease_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Sepsis-3 (Singer 2016)', 'CURB-65 (Lim 2003)', 'Wells DVT (2001)'];

function qSOFA(input) {
    const { respiratoryRate, systolicBP, alteredMentalStatus } = input;
    let score = 0;
    const components = {};
    if (respiratoryRate >= 22) { score++; components.respiratoryRate = 'high'; }
    if (systolicBP <= 100) { score++; components.systolicBP = 'low'; }
    if (alteredMentalStatus) { score++; components.mentalStatus = 'altered'; }
    let risk = 'low', rec = 'Reassess in 6h';
    if (score >= 2) { risk = 'high'; rec = 'Sepsis likely — escalate to ICU, blood cultures, broad-spectrum antibiotics within 1h'; }
    return { score, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

function curb65(input) {
    const { confusion, uremiaBUNgt19, respiratoryRate30, systolicBPlt90, diastolicBPlt60, age65 } = input;
    let score = 0;
    const components = {};
    if (confusion) { score++; components.confusion = true; }
    if (uremiaBUNgt19) { score++; components.uremia = 'BUN>19'; }
    if (respiratoryRate30) { score++; components.tachypnea = 'RR≥30'; }
    if (systolicBPlt90 || diastolicBPlt60) { score++; components.hypotension = true; }
    if (age65) { score++; components.age = '≥65'; }
    let risk = 'low', rec = 'Outpatient treatment';
    if (score === 1) { risk = 'low-moderate'; rec = 'Consider outpatient with follow-up'; }
    else if (score === 2) { risk = 'moderate'; rec = 'Admission for IV antibiotics recommended'; }
    else if (score >= 3) { risk = 'high'; rec = 'ICU admission, consider severe pneumonia'; }
    return { score, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function wellsDVT(input) {
    const { activeCancer, paralysisOrImmobilization, bedridden3Days, localizedTenderness, entireLegSwollen, calfSwelling3cm, pittingEdema, alternativeDiagnosis } = input;
    let score = 0;
    const components = {};
    if (activeCancer) { score += 1; components.cancer = true; }
    if (paralysisOrImmobilization) { score += 1; components.paralysis = true; }
    if (bedridden3Days) { score += 1; components.bedridden = true; }
    if (localizedTenderness) { score += 1; components.tenderness = true; }
    if (entireLegSwollen) { score += 1; components.entireLegSwollen = true; }
    if (calfSwelling3cm) { score += 1; components.calfSwelling = true; }
    if (pittingEdema) { score += 1; components.pittingEdema = true; }
    if (alternativeDiagnosis) { score -= 2; components.altDx = true; }
    let risk = 'low', rec = 'DVT unlikely';
    if (score >= 2) { risk = 'high'; rec = 'DVT likely — ultrasound + treatment'; }
    else if (score === 1) { risk = 'moderate'; rec = 'Consider ultrasound'; }
    return { score, max_score: 8, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { qSOFA, curb65, wellsDVT, VERSION, CITATIONS };
