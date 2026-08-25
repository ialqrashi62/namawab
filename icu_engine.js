// filepath: namaweb/icu_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['APACHE II (Knaus 1985)', 'SOFA (Vincent 1996)', 'RASS (Sessler 2002)'];

function sofa(input) {
    const { pao2FiO2, platelets, bilirubin, map, gcs, creatinine, dopamineDobutamine, epinephrineNorepinephrine } = input;
    let score = 0;
    const components = {};
    if (pao2FiO2 !== undefined) {
        let p = 0;
        if (pao2FiO2 < 100) p = 4;
        else if (pao2FiO2 < 200) p = 3;
        else if (pao2FiO2 < 300) p = 2;
        else if (pao2FiO2 < 400) p = 1;
        score += p;
        components.pao2FiO2 = p;
    }
    if (platelets !== undefined) {
        let p = 0;
        if (platelets < 20) p = 4;
        else if (platelets < 50) p = 3;
        else if (platelets < 100) p = 2;
        else if (platelets < 150) p = 1;
        score += p;
        components.platelets = p;
    }
    if (bilirubin !== undefined) {
        let p = 0;
        if (bilirubin >= 12) p = 4;
        else if (bilirubin >= 6) p = 3;
        else if (bilirubin >= 2) p = 2;
        else if (bilirubin >= 1.2) p = 1;
        score += p;
        components.bilirubin = p;
    }
    if (map !== undefined) {
        let p = (map < 70) ? 1 : 0;
        score += p;
        components.map = p;
    }
    if (gcs !== undefined) {
        let p = 0;
        if (gcs < 6) p = 4;
        else if (gcs < 9) p = 3;
        else if (gcs < 12) p = 2;
        else if (gcs < 14) p = 1;
        score += p;
        components.gcs = p;
    }
    if (creatinine !== undefined) {
        let p = 0;
        if (creatinine >= 5) p = 4;
        else if (creatinine >= 3.5) p = 3;
        else if (creatinine >= 2) p = 2;
        else if (creatinine >= 1.2) p = 1;
        score += p;
        components.creatinine = p;
    }
    if (epinephrineNorepinephrine > 0) { score += 4; components.vasoactive = 4; }
    else if (dopamineDobutamine > 0) { score += 2; components.vasoactive = 2; }
    let risk = 'low', rec = 'Continue monitoring';
    if (score >= 15) { risk = 'very_high'; rec = 'Mortality risk ~80% — aggressive care discussion'; }
    else if (score >= 10) { risk = 'high'; rec = 'Mortality risk ~40% — close monitoring'; }
    else if (score >= 5) { risk = 'moderate'; rec = 'Mortality risk ~20%'; }
    return { score, max_score: 24, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function rass(input) {
    const { score } = input;
    if (score < -5 || score > 4) return { error: 'invalid_rass', valid: '-5 to +4' };
    const levels = { '-5': 'Unarousable', '-4': 'Deep sedation', '-3': 'Moderate sedation', '-2': 'Light sedation', '-1': 'Drowsy', '0': 'Alert and calm', '1': 'Restless', '2': 'Agitated', '3': 'Very agitated', '4': 'Combative' };
    let rec = 'Continue';
    if (score <= -2) rec = 'Lighten sedation, daily SAT/SBT';
    else if (score >= 2) rec = 'Increase sedation, consider restraints';
    else if (score === 0) rec = 'Target achieved';
    return { score, max_score: 4, min_score: -5, risk: score === 0 ? 'optimal' : 'suboptimal', recommendation: rec, description: levels[String(score)], components: { score }, cite: CITATIONS[2], version: VERSION };
}

function apacheII(input) {
    const { age, chronicHealth, temperature, map, heartRate, respiratoryRate, oxygenation, ph, sodium, potassium, creatinine, hematocrit, wbc, gcs } = input;
    let score = 0;
    const components = {};
    if (age !== undefined) {
        let a = 0;
        if (age >= 75) a = 6;
        else if (age >= 65) a = 5;
        else if (age >= 55) a = 3;
        else if (age >= 45) a = 2;
        score += a;
        components.age = a;
    }
    if (chronicHealth !== undefined) { score += chronicHealth; components.chronicHealth = chronicHealth; }
    if (temperature !== undefined) {
        let t = 0;
        if (temperature >= 41 || temperature < 30) t = 4;
        else if (temperature >= 39 || temperature < 32) t = 3;
        else if (temperature >= 38.5 || temperature < 34) t = 1;
        score += t;
        components.temperature = t;
    }
    if (map !== undefined) {
        let m = 0;
        if (map >= 160 || map < 50) m = 4;
        else if (map >= 130 || map < 70) m = 2;
        score += m;
        components.map = m;
    }
    if (heartRate !== undefined) {
        let h = 0;
        if (heartRate >= 180 || heartRate < 40) h = 4;
        else if (heartRate >= 140 || heartRate < 55) h = 3;
        else if (heartRate >= 110) h = 2;
        score += h;
        components.heartRate = h;
    }
    if (respiratoryRate !== undefined) {
        let r = 0;
        if (respiratoryRate >= 50 || respiratoryRate < 6) r = 4;
        else if (respiratoryRate >= 35) r = 3;
        else if (respiratoryRate >= 25) r = 1;
        score += r;
        components.respiratoryRate = r;
    }
    if (ph !== undefined) {
        let p = 0;
        if (ph >= 7.7 || ph < 7.15) p = 4;
        else if (ph >= 7.6 || ph < 7.25) p = 3;
        else if (ph < 7.33) p = 2;
        score += p;
        components.ph = p;
    }
    if (sodium !== undefined) {
        let s = 0;
        if (sodium >= 180 || sodium < 111) s = 4;
        else if (sodium >= 160 || sodium < 120) s = 3;
        else if (sodium >= 155 || sodium < 130) s = 2;
        else if (sodium >= 150) s = 1;
        score += s;
        components.sodium = s;
    }
    if (potassium !== undefined) {
        let k = 0;
        if (potassium >= 7 || potassium < 2.5) k = 4;
        else if (potassium >= 6 || potassium < 3) k = 3;
        score += k;
        components.potassium = k;
    }
    if (creatinine !== undefined) {
        let c = (creatinine >= 3.5) ? 4 : (creatinine >= 2) ? 3 : (creatinine >= 1.5) ? 2 : 0;
        score += c;
        components.creatinine = c;
    }
    if (hematocrit !== undefined) {
        let h = 0;
        if (hematocrit >= 60 || hematocrit < 20) h = 4;
        else if (hematocrit >= 50 || hematocrit < 30) h = 2;
        score += h;
        components.hematocrit = h;
    }
    if (wbc !== undefined) {
        let w = 0;
        if (wbc >= 40 || wbc < 1) w = 4;
        else if (wbc >= 20 || wbc < 3) w = 2;
        score += w;
        components.wbc = w;
    }
    if (gcs !== undefined) { score += (15 - gcs); components.gcs = 15 - gcs; }
    let risk = 'low', rec = 'Continue care';
    if (score >= 35) { risk = 'very_high'; rec = 'Mortality risk >80%'; }
    else if (score >= 25) { risk = 'high'; rec = 'Mortality risk ~50%'; }
    else if (score >= 15) { risk = 'moderate'; rec = 'Mortality risk ~15%'; }
    return { score, max_score: 71, risk, recommendation: rec, components, cite: CITATIONS[0], version: VERSION };
}

module.exports = { sofa, apacheII, rass, VERSION, CITATIONS };
