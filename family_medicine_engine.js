// filepath: namaweb/family_medicine_engine.js
// Family Medicine — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'USPSTF 2024 — Preventive Services',
    'AAFP Guidelines for Family Medicine',
    'WHO Primary Care 2023'
];

/**
 * @typedef {Object} EngineResult
 * @property {number|null} score
 * @property {string}      risk
 * @property {string}      recommendation
 * @property {string}      cite
 * @property {string}      version
 * @property {Object}      components
 * @property {string[]}    warnings
 */

// ============================================================
// Wellness Score (preventive health, age + BMI + activity)
// ============================================================
function wellnessScore(input) {
    const warnings = [];
    const { age, bmi, smoker, activity_min_per_week, chronic_count } = input;

    if (!age || age < 0 || age > 120) warnings.push('age out of range');

    let score = 100;
    const components = {};

    // Age modifier
    if (age > 65) score -= 10;
    else if (age > 50) score -= 5;
    components.ageMod = age > 65 ? -10 : age > 50 ? -5 : 0;

    // BMI modifier
    if (bmi) {
        if (bmi >= 30)         score -= 15;
        else if (bmi >= 25)    score -= 7;
        else if (bmi < 18.5)   score -= 5;
        components.bmiMod = (bmi >= 30 ? -15 : bmi >= 25 ? -7 : bmi < 18.5 ? -5 : 0);
    }

    // Smoking
    if (smoker) { score -= 20; components.smokerMod = -20; }

    // Activity
    if (activity_min_per_week !== undefined) {
        if (activity_min_per_week < 30)      score -= 15;
        else if (activity_min_per_week < 150) score -= 7;
        components.activityMod = activity_min_per_week < 30 ? -15
                               : activity_min_per_week < 150 ? -7 : 0;
    }

    // Chronic conditions
    if (chronic_count) {
        score -= Math.min(chronic_count * 5, 30);
        components.chronicMod = -Math.min(chronic_count * 5, 30);
    }

    score = Math.max(0, score);

    let risk = 'unknown';
    let recommendation = '';
    if (score >= 80) { risk = 'low'; recommendation = 'الحفاظ على نمط حياة صحي. فحص سنوي.'; }
    else if (score >= 60) { risk = 'moderate'; recommendation = 'يُنصح بزيادة النشاط البدني وتحسين النظام الغذائي.'; }
    else if (score >= 40) { risk = 'high'; recommendation = 'يُنصح بمراجعة الطبيب واتخاذ إجراءات وقائية عاجلة.'; }
    else { risk = 'very_high'; recommendation = 'تدخل طبي عاجل مطلوب. مراجعة شاملة.'; }

    return {
        score,
        risk,
        recommendation,
        cite: 'USPSTF 2024',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Chronic Disease Multi-morbidity Count
// ============================================================
function chronicDiseaseCount(input) {
    const chronic = [];
    const conditions = {
        diabetes:    input.diabetes,
        htn:         input.htn,
        chf:         input.chf,
        copd:        input.copd,
        asthma:      input.asthma,
        ckd:         input.ckd,
        cad:         input.cad,
        stroke:      input.stroke,
        cancer:      input.cancer_history,
        depression:  input.depression,
        obesity:     input.bmi && input.bmi >= 30,
        dyslipidemia: input.dyslipidemia
    };
    for (const [k, v] of Object.entries(conditions)) {
        if (v) chronic.push(k);
    }
    const count = chronic.length;
    return {
        score: count,
        risk: count >= 3 ? 'high' : count >= 1 ? 'moderate' : 'low',
        recommendation: count >= 3
            ? 'مريض بأمراض متعددة — يحتاج رعاية متكاملة (PCMH).'
            : count >= 1 ? 'متابعة دورية مع طبيب الأسرة.' : 'لا توجد أمراض مزمنة.',
        cite: 'AAFP Multimorbidity Guidelines',
        version: VERSION,
        components: { chronic_conditions: chronic, count },
        warnings: []
    };
}

// ============================================================
// Vaccination Schedule (Saudi EPI + WHO)
// ============================================================
function vaccinationSchedule(input) {
    const { age, immunizations = [] } = input;
    const due = [];
    const overdue = [];

    const schedule = {
        infant:    ['BCG', 'HepB-birth', 'DTaP', 'Hib', 'IPV', 'PCV', 'Rota', 'MMR', 'Varicella'],
        child:     ['DTaP-booster', 'MMR-booster', 'Varicella-booster', 'Tdap'],
        adolescent: ['HPV', 'Tdap-booster', 'MenACWY'],
        adult:     ['Tdap-every-10y', 'Influenza-annual', 'COVID-booster'],
        senior:    ['PPSV23', 'Shingles', 'Influenza-annual']
    };

    const given = new Set(immunizations.map(i => (i.vaccine || i).toLowerCase()));

    if (age < 2)    schedule.infant.forEach(v => { if (!given.has(v.toLowerCase())) due.push(v); });
    if (age >= 4 && age < 7)    schedule.child.forEach(v => { if (!given.has(v.toLowerCase())) due.push(v); });
    if (age >= 11 && age < 18)  schedule.adolescent.forEach(v => { if (!given.has(v.toLowerCase())) due.push(v); });
    if (age >= 18)  schedule.adult.forEach(v => { if (!given.has(v.toLowerCase())) due.push(v); });
    if (age >= 65)  schedule.senior.forEach(v => { if (!given.has(v.toLowerCase())) due.push(v); });

    // Mark overdue if last_dose > recommended_interval
    immunizations.forEach(i => {
        if (i.last_dose && i.recommended_interval_years) {
            const yearsAgo = (Date.now() - new Date(i.last_dose).getTime()) / (365 * 24 * 3600 * 1000);
            if (yearsAgo > i.recommended_interval_years) overdue.push(i.vaccine);
        }
    });

    return {
        score: due.length + overdue.length,
        risk: overdue.length > 0 ? 'high' : due.length > 0 ? 'moderate' : 'low',
        recommendation: overdue.length > 0
            ? `تطعيمات متأخرة: ${overdue.join('، ')}. يُنصح بالحصول عليها فوراً.`
            : due.length > 0
                ? `تطعيمات مستحقة: ${due.join('، ')}.`
                : 'جميع التطعيمات محدثة.',
        cite: 'MOH Saudi EPI 2024 + WHO',
        version: VERSION,
        components: { due, overdue, given: Array.from(given) },
        warnings: []
    };
}

// ============================================================
// Family History Risk (genetic risk scoring)
// ============================================================
function familyHistoryRisk(input) {
    const warnings = [];
    const fh = input.family_history || [];
    if (!Array.isArray(fh)) warnings.push('family_history must be array');

    let score = 0;
    const components = {};

    // First-degree relatives (parent, sibling, child)
    const firstDegree = fh.filter(h => ['parent', 'sibling', 'child'].includes(h.relationship));
    const secondDegree = fh.filter(h => ['grandparent', 'aunt', 'uncle'].includes(h.relationship));

    // High-risk conditions
    const HIGH_RISK = ['breast_cancer', 'colon_cancer', 'prostate_cancer', 'ovarian_cancer',
                       'coronary_artery_disease', 'diabetes_type2', 'melanoma',
                       'pancreatic_cancer', 'alzheimer'];
    const MODERATE_RISK = ['hypertension', 'asthma', 'depression', 'migraine'];

    for (const h of firstDegree) {
        if (HIGH_RISK.includes(h.condition)) {
            score += 3;
            components[h.condition] = (components[h.condition] || 0) + 3;
        } else if (MODERATE_RISK.includes(h.condition)) {
            score += 1;
            components[h.condition] = (components[h.condition] || 0) + 1;
        }
        // Early onset (< 50) doubles
        if (h.age_at_diagnosis && h.age_at_diagnosis < 50) {
            score += 2;
            components[h.condition + '_early'] = (components[h.condition + '_early'] || 0) + 2;
        }
    }

    for (const h of secondDegree) {
        if (HIGH_RISK.includes(h.condition)) { score += 1; components[h.condition + '_2nd'] = (components[h.condition + '_2nd'] || 0) + 1; }
    }

    let risk = 'low';
    let recommendation = 'لا توجد مخاطر جينية كبيرة بناءً على التاريخ العائلي.';
    if (score >= 10) {
        risk = 'high';
        recommendation = 'يُنصح بإحالة المريض إلى عيادة المخاطر الجينية وفحوصات وقائية متقدمة.';
    } else if (score >= 5) {
        risk = 'moderate';
        recommendation = 'يُنصح بفحوصات وقائية مبكرة للأمراض ذات المخاطر العالية.';
    }

    return {
        score,
        risk,
        recommendation,
        cite: 'ACMG Family History Guidelines 2024',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Preventive Screening (USPSTF Grade A/B recommendations)
// ============================================================
function preventiveScreening(input) {
    const { age, sex, smoker, family_history = [], bmi, sbp } = input;
    const recommendations = [];
    const warnings = [];

    // Cancer screening
    if (sex === 'F') {
        if (age >= 40) recommendations.push({ grade: 'B', service: 'mammography', freq: 'every 2 years' });
        if (age >= 21) recommendations.push({ grade: 'A', service: 'cervical cancer screening', freq: 'every 3 years' });
        if (age >= 50) recommendations.push({ grade: 'A', service: 'colorectal cancer screening', freq: 'until age 75' });
    } else {
        if (age >= 50) recommendations.push({ grade: 'A', service: 'colorectal cancer screening', freq: 'until age 75' });
        // Shared decision for PSA
        if (age >= 55 && age < 70) recommendations.push({ grade: 'C', service: 'PSA screening', freq: 'shared decision-making' });
    }

    // Lung cancer (smokers 50-80)
    if (smoker && age >= 50 && age <= 80) {
        recommendations.push({ grade: 'B', service: 'low-dose CT for lung cancer', freq: 'annual' });
    }

    // Cardiovascular
    if (age >= 40 || (sbp && sbp >= 130)) {
        recommendations.push({ grade: 'B', service: 'lipid panel', freq: 'every 5 years' });
    }
    if (sbp && sbp >= 140) {
        recommendations.push({ grade: 'A', service: 'blood pressure follow-up', freq: 'every 3-6 months' });
    }

    // Diabetes
    if (bmi && bmi >= 25) {
        recommendations.push({ grade: 'B', service: 'diabetes screening (HbA1c)', freq: 'every 3 years' });
    }
    if (age >= 35) {
        recommendations.push({ grade: 'B', service: 'diabetes screening', freq: 'every 3 years' });
    }

    // Bone density
    if (sex === 'F' && age >= 65) recommendations.push({ grade: 'B', service: 'DEXA scan', freq: 'every 2 years' });

    // Vaccines
    if (age >= 50) recommendations.push({ grade: 'A', service: 'influenza vaccine', freq: 'annual' });
    if (age >= 65) recommendations.push({ grade: 'A', service: 'pneumococcal vaccine (PPSV23)', freq: 'one-time' });
    if (age >= 50) recommendations.push({ grade: 'A', service: 'shingles vaccine', freq: 'two-dose series' });

    // Mental health
    if (age >= 12) recommendations.push({ grade: 'B', service: 'depression screening', freq: 'annual' });

    // Family history overrides
    if (family_history.some(h => h.condition === 'breast_cancer' && h.relationship === 'parent')) {
        recommendations.push({ grade: 'B', service: 'mammography (high-risk)', freq: 'every year starting age 35' });
    }
    if (family_history.some(h => h.condition === 'colon_cancer' && h.relationship === 'parent' && h.age_at_diagnosis < 60)) {
        recommendations.push({ grade: 'A', service: 'colonoscopy (early)', freq: 'every 5 years starting age 40' });
    }

    return {
        score: recommendations.length,
        risk: recommendations.some(r => r.grade === 'A') ? 'moderate' : 'low',
        recommendation: `${recommendations.length} توصية فحص وقائي بناءً على USPSTF 2024.`,
        cite: 'USPSTF 2024 Recommendations',
        version: VERSION,
        components: { recommendations, count: recommendations.length },
        warnings
    };
}

module.exports = {
    wellnessScore,
    chronicDiseaseCount,
    vaccinationSchedule,
    familyHistoryRisk,
    preventiveScreening,
    VERSION,
    CITATIONS
};