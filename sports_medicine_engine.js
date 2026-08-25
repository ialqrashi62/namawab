// filepath: namaweb/sports_medicine_engine.js
// Sports Medicine — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'ACSM Pre-Participation Screening 2024',
    'AHA/ACC Cardiovascular Screening Athletes 2024',
    'IOC Consensus on Return to Play 2023',
    'FIFA 11+ Injury Prevention Program'
];

// ============================================================
// Pre-Participation Examination (PPE) Risk Score
// ============================================================
function ppeRiskScore(input) {
    const warnings = [];
    const { age, sport, history_syncope, history_chest_pain, family_history_sudden_death,
            resting_hr, sbp, dbp, vo2max, bmi, murmur_present } = input;

    let score = 0;
    const components = {};

    // AHA cardiac screening criteria
    if (history_syncope) { score += 5; components.syncopeMod = 5; }
    if (history_chest_pain) { score += 5; components.chestPainMod = 5; }
    if (family_history_sudden_death) { score += 10; components.familySuddenDeathMod = 10; }
    if (murmur_present) { score += 5; components.murmurMod = 5; }
    if (resting_hr && (resting_hr < 40 || resting_hr > 100)) {
        score += 2;
        components.hrMod = 2;
    }
    if (sbp && (sbp > 140 || sbp < 90)) {
        score += 3;
        components.bpMod = 3;
    }

    // High-risk sports: basketball, soccer, swimming (highest SCD incidence)
    const HIGH_RISK_SPORTS = ['basketball', 'soccer', 'swimming', 'volleyball', 'hockey'];
    if (HIGH_RISK_SPORTS.some(s => (sport || '').toLowerCase().includes(s))) {
        score += 3;
        components.sportMod = 3;
    }

    // VO2max fitness (low fitness is concerning)
    if (vo2max && vo2max < 35) {
        score += 3;
        components.vo2Mod = 3;
    }

    let risk = 'low';
    let recommendation = '';
    let clearance = 'approved';

    if (score >= 10) {
        risk = 'high';
        clearance = 'restricted';
        recommendation = 'يحتاج تقييماً قلبياً شاملاً قبل التصريح (ECG + Echocardiogram).';
    } else if (score >= 5) {
        risk = 'moderate';
        clearance = 'conditional';
        recommendation = 'يحتاج متابعة طبية دورية + ECG أساسي.';
    } else {
        risk = 'low';
        clearance = 'approved';
        recommendation = 'تصريح كامل بالمشاركة في الرياضة.';
    }

    return {
        score,
        risk,
        recommendation,
        clearance,
        cite: 'AHA/ACC Athletes 2024 + ACSM',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// ACL Injury Risk (functional movement screen)
// ============================================================
function aclRiskScore(input) {
    const warnings = [];
    const { landing_alignment, core_strength, hamstring_flexibility, prior_acl_tear,
            sport, sex } = input;

    let score = 0;
    const components = {};

    // Female athletes have 2-8x higher ACL injury rate
    if (sex === 'F') {
        score += 3;
        components.sexMod = 3;
    }

    // Landing biomechanics (knee valgus)
    if (landing_alignment === 'valgus') {
        score += 4;
        components.landingMod = 4;
    } else if (landing_alignment === 'neutral') {
        score += 0;
    } else if (landing_alignment === 'varus') {
        score -= 1;
        components.landingMod = -1;
    }

    // Core strength (poor = higher risk)
    if (core_strength === 'poor') {
        score += 3;
        components.coreMod = 3;
    } else if (core_strength === 'fair') {
        score += 1;
        components.coreMod = 1;
    }

    // Hamstring flexibility
    if (hamstring_flexibility === 'tight') {
        score += 2;
        components.flexMod = 2;
    }

    // Prior ACL tear — high recurrence
    if (prior_acl_tear) {
        score += 5;
        components.priorMod = 5;
    }

    // High-risk sports
    const HIGH_RISK = ['soccer', 'basketball', 'volleyball', 'handball', 'gymnastics'];
    if (HIGH_RISK.some(s => (sport || '').toLowerCase().includes(s))) {
        score += 3;
        components.sportMod = 3;
    }

    let risk = 'low';
    let recommendation = '';
    if (score >= 10) {
        risk = 'high';
        recommendation = 'خطر إصابة عالية. يُنصح ببرنامج FIFA 11+ وقائي مكثف.';
    } else if (score >= 5) {
        risk = 'moderate';
        recommendation = 'خطر متوسط. برنامج تقوية + مراقبة.';
    } else {
        risk = 'low';
        recommendation = 'خطر منخفض. متابعة روتينية.';
    }

    return {
        score,
        risk,
        recommendation,
        cite: 'FIFA 11+ Program 2024 + Hewett Meta-Analysis',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Return-to-Play Decision (post-injury)
// ============================================================
function returnToPlay(input) {
    const warnings = [];
    const { injury_type, days_since_injury, pain_score, full_rom, strength_pct, sport, previous_same_injury } = input;

    const criteria = {
        pain_acceptable: pain_score !== undefined && pain_score <= 3,
        full_rom: full_rom === true,
        strength_pct_okay: strength_pct !== undefined && strength_pct >= 90,
        time_appropriate: false
    };

    // Time requirements by injury
    const MIN_DAYS = {
        hamstring_strain: 14,
        ankle_sprain: 14,
        acl_reconstruction: 270,
        mcl_sprain: 21,
        concussion: 14,        // graduated return
        shoulder_dislocation: 21,
        calf_strain: 14,
        groin_strain: 14
    };

    const minDays = MIN_DAYS[injury_type] || 7;
    criteria.time_appropriate = days_since_injury >= minDays;
    if (previous_same_injury) {
        warnings.push('recurrence risk');
    }

    const passedCount = Object.values(criteria).filter(Boolean).length;
    let risk = 'unknown';
    let ready = false;
    let recommendation = '';

    if (passedCount === 4) {
        risk = 'low';
        ready = true;
        recommendation = 'جاهز للعودة الكاملة للمشاركة. يُنصح بإعادة تأهيل تدريجية.';
    } else if (passedCount >= 2) {
        risk = 'moderate';
        ready = false;
        recommendation = 'يحتاج عمل إضافي قبل العودة. ' +
            Object.entries(criteria).filter(([k, v]) => !v).map(([k]) => k).join(', ');
    } else {
        risk = 'high';
        ready = false;
        recommendation = 'لا يزال غير جاهز. إعادة تأهيل شاملة + إعادة تقييم بعد أسبوع.';
    }

    return {
        score: passedCount,
        risk,
        ready,
        recommendation,
        cite: 'IOC Return-to-Sport Consensus 2023',
        version: VERSION,
        components: { criteria, passed_count: passedCount, min_days: minDays },
        warnings
    };
}

// ============================================================
// Concussion SCAT5 / Risk Stratification
// ============================================================
function concussionRisk(input) {
    const warnings = [];
    const { loss_of_consciousness, post_traumatic_amnesia, mechanism, symptoms_count,
            prior_concussion_count, age } = input;

    let score = 0;
    const components = {};

    // Red flags
    if (loss_of_consciousness) { score += 5; components.locMod = 5; }
    if (post_traumatic_amnesia) { score += 3; components.ptaMod = 3; }
    if (mechanism === 'high_force') { score += 2; components.mechanismMod = 2; }

    // Symptoms count (out of 22 SCAT5)
    if (symptoms_count > 10) {
        score += 3;
        components.symptomsMod = 3;
    } else if (symptoms_count > 5) {
        score += 2;
        components.symptomsMod = 2;
    }

    // Prior concussions — recurrent risk
    if (prior_concussion_count >= 3) {
        score += 4;
        components.priorMod = 4;
    } else if (prior_concussion_count >= 1) {
        score += 2;
        components.priorMod = 2;
    }

    let risk = 'low';
    let recommendation = '';
    let return_protocol = 'standard';

    if (score >= 8) {
        risk = 'high';
        return_protocol = 'extended';
        recommendation = 'إصابة شديدة. إعادة تأهيل ممتدة + استشارة طبيب أعصاب. لا يعود للرياضة قبل 14 يوم.';
    } else if (score >= 4) {
        risk = 'moderate';
        return_protocol = 'graduated';
        recommendation = 'بروتوكول عودة تدريجية (6 مراحل) تحت إشراف طبي.';
    } else {
        risk = 'low';
        return_protocol = 'graduated';
        recommendation = 'بروتوكول عودة تدريجية لمدة 24 ساعة مع مراقبة.';
    }

    return {
        score,
        risk,
        recommendation,
        return_protocol,
        cite: 'SCAT5 + Concussion in Sport Group 2023',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// VO2max estimation (without gas analyzer)
// ============================================================
function vo2maxEstimate(input) {
    const warnings = [];
    const { age, sex, weight_kg, resting_hr } = input;

    if (!age || !weight_kg || !resting_hr) {
        warnings.push('missing required fields');
    }

    // Uth-Sorensen formula
    // VO2max = 15 × (HRmax / HRrest)
    // HRmax = 220 - age
    const hrMax = 220 - age;
    const ratio = hrMax / resting_hr;
    const vo2max = 15 * ratio;

    // Classification (ACSM)
    let fitness = '';
    if (sex === 'M') {
        if (vo2max >= 50) fitness = 'ممتاز (elite)';
        else if (vo2max >= 45) fitness = 'جيد جداً';
        else if (vo2max >= 40) fitness = 'جيد';
        else if (vo2max >= 35) fitness = 'مقبول';
        else fitness = 'ضعيف';
    } else {
        if (vo2max >= 43) fitness = 'ممتاز (elite)';
        else if (vo2max >= 38) fitness = 'جيد جداً';
        else if (vo2max >= 33) fitness = 'جيد';
        else if (vo2max >= 28) fitness = 'مقبول';
        else fitness = 'ضعيف';
    }

    return {
        score: Math.round(vo2max * 10) / 10,
        risk: vo2max < 30 ? 'high' : vo2max < 40 ? 'moderate' : 'low',
        recommendation: `VO2max المُقدَّر: ${vo2max.toFixed(1)} ml/kg/min. التصنيف: ${fitness}.`,
        cite: 'Uth-Sorensen formula + ACSM 2024',
        version: VERSION,
        components: { hr_max: hrMax, hr_rest: resting_hr, ratio, fitness },
        warnings
    };
}

module.exports = {
    ppeRiskScore,
    aclRiskScore,
    returnToPlay,
    concussionRisk,
    vo2maxEstimate,
    VERSION,
    CITATIONS
};