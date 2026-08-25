// filepath: namaweb/cardiology_engine.js
'use strict';
const VERSION = '3.0.0';
const CITATIONS = {
    'GRACE-2006': 'Granger CB et al. Arch Intern Med 2003; Fox KA et al. BMJ 2006',
    'ESC-2024-AF': 'Van Gelder IC et al. Eur Heart J 2024',
    'HAS-BLED-2010': 'Pisters R et al. Chest 2010',
    'ACC-AHA-HF-2022': 'Heidenreich PA et al. Circulation 2022',
    'ESC-NSTEMI-2020': 'Collet JP et al. Eur Heart J 2021',
    'ESC-STEMI-2017': 'Ibanez B et al. Eur Heart J 2018',
    'ACC-AHA-STEMI-2013': 'O\'Gara PT et al. Circulation 2013'
};

const CARDIOLOGY_ICD10 = {
    ACS_STEMI_ANTERIOR: 'I21.0',
    ACS_STEMI_INFERIOR: 'I21.1',
    ACS_NSTEMI: 'I21.4',
    ATRIAL_FIBRILLATION: 'I48.91',
    HF_REDUCED_EF: 'I50.32',
    HF_MIDRANGE_EF: 'I50.33',
    HF_PRESERVED_EF: 'I50.31',
    ESSENTIAL_HTN: 'I10',
    HTN_WITH_HEART_DISEASE: 'I11.9',
    ACUTE_PERICARDITIS: 'I30.9',
    PULMONARY_EMBOLISM: 'I26.99'
};

function graceScore(input) {
    const { age, heart_rate, systolic_bp, creatinine_mg_dl, killip_class, st_deviation, cardiac_arrest } = input;
    if (age === undefined) throw new Error('age required');
    let score = 0;
    if (age < 30) score += 0;
    else if (age < 40) score += 8;
    else if (age < 50) score += 16;
    else if (age < 60) score += 25;
    else if (age < 70) score += 34;
    else if (age < 80) score += 43;
    else score += 53;
    if (heart_rate < 50) score += 0;
    else if (heart_rate < 70) score += 3;
    else if (heart_rate < 90) score += 9;
    else if (heart_rate < 110) score += 16;
    else if (heart_rate < 150) score += 24;
    else score += 38;
    if (systolic_bp < 80) score += 58;
    else if (systolic_bp < 100) score += 41;
    else if (systolic_bp < 120) score += 27;
    else if (systolic_bp < 140) score += 13;
    else if (systolic_bp < 160) score += 2;
    else score += 0;
    if (creatinine_mg_dl !== undefined) {
        if (creatinine_mg_dl < 0.4) score += 1;
        else if (creatinine_mg_dl < 0.8) score += 4;
        else if (creatinine_mg_dl < 1.2) score += 7;
        else if (creatinine_mg_dl < 1.6) score += 10;
        else if (creatinine_mg_dl < 2.0) score += 13;
        else if (creatinine_mg_dl < 4.0) score += 21;
        else score += 28;
    }
    if (killip_class !== undefined) {
        if (killip_class === 1) score += 0;
        else if (killip_class === 2) score += 20;
        else if (killip_class === 3) score += 39;
        else score += 59;
    }
    if (st_deviation) score += 28;
    if (cardiac_arrest) score += 39;
    let risk = 'low';
    let in_hospital_mortality = 0.5;
    if (score >= 140) { risk = 'high'; in_hospital_mortality = 35; }
    else if (score >= 110) { risk = 'intermediate'; in_hospital_mortality = 8; }
    return { score, risk, in_hospital_mortality, icd10: CARDIOLOGY_ICD10.ACS_NSTEMI, cit: CITATIONS['GRACE-2006'], version: VERSION };
}

function cha2ds2vasc(input) {
    const { age, sex, chf, hypertension, diabetes, stroke_history, vascular_disease } = input;
    let score = 0;
    if (chf) score += 1;
    if (hypertension) score += 1;
    if (age !== undefined) {
        if (age >= 75) score += 2;
        else if (age >= 65) score += 1;
    }
    if (diabetes) score += 1;
    if (stroke_history) score += 2;
    if (vascular_disease) score += 1;
    if (sex === 'female') score += 1;
    let risk = 'low', anticoagulation_recommendation = 'not_recommended';
    if (score >= 2) { risk = 'high'; anticoagulation_recommendation = 'recommended'; }
    else if (score === 1) { risk = 'moderate'; anticoagulation_recommendation = 'consider'; }
    return { score, max_score: 9, risk, anticoagulation_recommendation, icd10: CARDIOLOGY_ICD10.ATRIAL_FIBRILLATION, cit: CITATIONS['ESC-2024-AF'], version: VERSION };
}

function hasBled(input) {
    const { uncontrolled_hypertension, abnormal_renal, abnormal_liver, stroke_history, bleeding_history, labile_inr, age, concomitant_drugs, alcohol_use } = input;
    let score = 0;
    if (uncontrolled_hypertension) score += 1;
    if (abnormal_renal) score += 1;
    if (abnormal_liver) score += 1;
    if (stroke_history) score += 1;
    if (bleeding_history) score += 1;
    if (labile_inr) score += 1;
    if (age >= 65) score += 1;
    if (concomitant_drugs) score += 1;
    if (alcohol_use) score += 1;
    let risk = 'low';
    if (score >= 3) risk = 'high';
    return { score, max_score: 9, risk, icd10: CARDIOLOGY_ICD10.ATRIAL_FIBRILLATION, cit: CITATIONS['HAS-BLED-2010'], version: VERSION };
}

function classifyHeartFailure(input) {
    const { nyha_class, lvef_pct } = input;
    if (nyha_class === undefined) throw new Error('nyha_class required');
    if (nyha_class < 1 || nyha_class > 4) throw new Error('nyha_class must be 1-4');
    let accaha_stage = 'A';
    let lvef_category = 'preserved';
    let recommended_therapy = [];
    if (lvef_pct !== undefined) {
        if (lvef_pct < 40) { lvef_category = 'reduced'; accaha_stage = 'C'; recommended_therapy = ['ace_inhibitor', 'beta_blocker', 'mra', 'sglt2_inhibitor']; }
        else if (lvef_pct < 50) { lvef_category = 'midrange'; accaha_stage = 'C'; recommended_therapy = ['ace_inhibitor', 'beta_blocker']; }
    }
    if (nyha_class >= 2) accaha_stage = 'C';
    if (nyha_class === 1) accaha_stage = lvef_pct < 40 ? 'C' : 'A';
    return { nyha_class, lvef_pct, accaha_stage, lvef_category, recommended_therapy, icd10: lvef_category === 'reduced' ? CARDIOLOGY_ICD10.HF_REDUCED_EF : CARDIOLOGY_ICD10.HF_PRESERVED_EF, cit: CITATIONS['ACC-AHA-HF-2022'], version: VERSION };
}

function interpretTroponin(input) {
    const { troponin_value, cutoff, delta_pct } = input;
    if (troponin_value === undefined || cutoff === undefined) throw new Error('troponin_value and cutoff required');
    if (delta_pct === undefined) throw new Error('delta_pct required');
    let interpretation = 'observe';
    if (troponin_value > cutoff && delta_pct >= 20) interpretation = 'rule_in_acs';
    else if (troponin_value < cutoff && delta_pct < 20) interpretation = 'rule_out_acs';
    return { troponin_value, cutoff, delta_pct, interpretation, icd10: CARDIOLOGY_ICD10.ACS_NSTEMI, cit: CITATIONS['ESC-NSTEMI-2020'], version: VERSION };
}

function detectStemi(input) {
    const { st_elevation_mm, leads } = input;
    if (st_elevation_mm === undefined || !leads) throw new Error('st_elevation_mm and leads required');
    let is_stemi = false;
    let territory = 'none';
    let action = 'CONTINUE_MONITORING';
    if (st_elevation_mm >= 2 || (st_elevation_mm >= 1 && leads.some(l => ['V2', 'V3'].includes(l)))) {
        if (['V1', 'V2', 'V3', 'V4', 'V5', 'V6'].some(l => leads.includes(l))) {
            is_stemi = true; territory = 'anterior'; action = 'ACTIVATE_CATH_LAB';
        } else if (['II', 'III', 'aVF'].some(l => leads.includes(l))) {
            is_stemi = true; territory = 'inferior'; action = 'ACTIVATE_CATH_LAB';
        }
    } else if (st_elevation_mm <= -2 && ['V1', 'V2', 'V3'].some(l => leads.includes(l))) {
        is_stemi = true; territory = 'posterior'; action = 'ACTIVATE_CATH_LAB';
    }
    return { is_stemi, territory, action, icd10: territory === 'anterior' ? CARDIOLOGY_ICD10.ACS_STEMI_ANTERIOR : (territory === 'inferior' ? CARDIOLOGY_ICD10.ACS_STEMI_INFERIOR : 'none'), cit: CITATIONS['ESC-STEMI-2017'], version: VERSION };
}

const CARDIOLOGY = { graceScore, cha2ds2vasc, hasBled, classifyHeartFailure, interpretTroponin, detectStemi, CARDIOLOGY_ICD10 };

// ============================================================
// Additional Wave 4A extras
// ============================================================

function cha2ds2vascScore(input) {
    // Compat wrapper - returns same shape as cha2ds2vasc
    return cha2ds2vasc(input);
}

function hasBledScore(input) {
    // Compat wrapper - maps new field names to legacy
    const mapped = {
        uncontrolled_hypertension: input.htn,
        abnormal_renal: input.abnormalRenal,
        abnormal_liver: input.abnormalLiver,
        stroke_history: input.stroke,
        bleeding_history: input.bleeding,
        labile_inr: input.labileINR,
        age: input.elderly ? 70 : 50,
        concomitant_drugs: input.drugs,
        alcohol_use: input.alcohol
    };
    return hasBled(mapped);
}

module.exports = {
    graceScore,
    cha2ds2vasc,
    hasBled,
    classifyHeartFailure,
    interpretTroponin,
    detectStemi,
    cha2ds2vascScore,
    hasBledScore,
    CARDIOLOGY_ICD10,
    CARDIOLOGY,
    VERSION,
    CITATIONS
};
