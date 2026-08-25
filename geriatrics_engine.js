// filepath: namaweb/geriatrics_engine.js
// Geriatrics — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'AGS Beers Criteria 2023',
    'STOPP/START Criteria 2024',
    'Tinetti POMA 1986',
    'MMSE Folstein 1975',
    'MNA Vellas 1999'
];

// ============================================================
// Comprehensive Geriatric Assessment (CGA) Score
// ============================================================
function cgaScore(input) {
    const warnings = [];
    const { age, mmse, gait_score, balance_score, mna, fall_history, polypharmacy_count, adl_score } = input;

    if (age < 65) warnings.push('age below 65, consider adult medicine');

    let score = 100;
    const components = {};

    // Cognition
    if (mmse !== undefined) {
        if (mmse < 10) { score -= 30; components.cognitionMod = -30; }
        else if (mmse < 20) { score -= 20; components.cognitionMod = -20; }
        else if (mmse < 25) { score -= 10; components.cognitionMod = -10; }
    } else { warnings.push('mmse missing'); }

    // Gait + Balance (Tinetti max 28)
    if (gait_score !== undefined && balance_score !== undefined) {
        const tinetti = gait_score + balance_score;
        if (tinetti < 16) { score -= 30; components.tinettiMod = -30; }
        else if (tinetti < 20) { score -= 20; components.tinettiMod = -20; }
        else if (tinetti < 24) { score -= 10; components.tinettiMod = -10; }
        components.tinetti = tinetti;
    }

    // Nutrition (MNA max 30)
    if (mna !== undefined) {
        if (mna < 17) { score -= 20; components.nutritionMod = -20; }
        else if (mna < 23.5) { score -= 10; components.nutritionMod = -10; }
    }

    // Fall history (last 6 months)
    if (fall_history && fall_history > 0) {
        score -= Math.min(fall_history * 5, 25);
        components.fallMod = -Math.min(fall_history * 5, 25);
    }

    // Polypharmacy (≥5 meds = risk)
    if (polypharmacy_count !== undefined) {
        if (polypharmacy_count >= 10) { score -= 20; components.polypharmacyMod = -20; }
        else if (polypharmacy_count >= 5) { score -= 10; components.polypharmacyMod = -10; }
    }

    // ADL (Activities of Daily Living)
    if (adl_score !== undefined) {
        if (adl_score < 4) { score -= 25; components.adlMod = -25; }
        else if (adl_score < 6) { score -= 10; components.adlMod = -10; }
    }

    score = Math.max(0, score);

    let risk = 'unknown';
    let recommendation = '';
    if (score >= 80) { risk = 'low'; recommendation = 'المسّن في حالة جيدة. متابعة روتينية كل 6 أشهر.'; }
    else if (score >= 60) { risk = 'moderate'; recommendation = 'يحتاج تدخل علاجي متعدد التخصصات (geriatric team).'; }
    else if (score >= 40) { risk = 'high'; recommendation = 'تقييم شامل وتدخل عاجل. قد يحتاج رعاية طويلة الأمد.'; }
    else { risk = 'very_high'; recommendation = 'حالة حرجة. تدخل طبي عاجل + دعم عائلي + تقييم تمريض متقدم.'; }

    return {
        score,
        risk,
        recommendation,
        cite: 'AGS Comprehensive Geriatric Assessment 2024',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Fall Risk (Tinetti POMA)
// ============================================================
function tinettiPOMA(input) {
    const warnings = [];
    const { gait_score, balance_score } = input;

    if (gait_score === undefined || balance_score === undefined) {
        warnings.push('gait_score and balance_score required');
    }

    const g = gait_score || 0;
    const b = balance_score || 0;
    const total = g + b;

    let risk = 'unknown';
    let recommendation = '';
    if (total < 16) { risk = 'very_high'; recommendation = 'خطر سقوط عالي جداً. تحتاج مساعدة دائمة + جلسات علاج طبيعي مكثفة.'; }
    else if (total < 20) { risk = 'high'; recommendation = 'خطر سقوط مرتفع. علاج طبيعي مكثف + تعديل البيئة المنزلية.'; }
    else if (total < 24) { risk = 'moderate'; recommendation = 'خطر متوسط. تمارين توازن ومتابعة.'; }
    else { risk = 'low'; recommendation = 'خطر منخفض. متابعة روتينية.'; }

    return {
        score: total,
        risk,
        recommendation,
        cite: 'Tinetti POMA 1986',
        version: VERSION,
        components: { gait_score: g, balance_score: b, max: 28 },
        warnings
    };
}

// ============================================================
// Beers Criteria Check (inappropriate meds in elderly)
// ============================================================
function beersCheck(medications) {
    const warnings = [];

    // AGS Beers 2023 — common inappropriate meds
    const BEERS_LIST = {
        diphenhydramine: 'مضاد هيستامين — يسبب نعاس + ارتباك',
        diazepam:        'بنزوديازيبين — خطر سقوط + ارتباك',
        amitriptyline:   'مضاد اكتئاب ثلاثي الحلقة — يسبب إمساك + احتباس بول',
        zolpidem:        'منوم — خطر سقوط ليلي',
        glyburide:       'سلفونيل يوريا — خطر هبوط سكر مطوّل',
        indomethacin:    'NSAID — خطر قرحة + نزيف',
        'muscle-relaxants': 'مرخيات عضلية — تسبب ضعف وسقوط',
        sliding_scale_insulin: 'إنسولين منزلق — خطر هبوط سكر',
        antipsychotics:  'مضادات ذهان — زيادة خطر الوفاة في الخرف'
    };

    const flagged = [];
    for (const med of medications || []) {
        const name = (med.name || med).toLowerCase();
        for (const [key, reason] of Object.entries(BEERS_LIST)) {
            if (name.includes(key.toLowerCase())) {
                flagged.push({ medication: med.name || med, reason });
                break;
            }
        }
    }

    let risk = 'low';
    let recommendation = '';
    if (flagged.length === 0) { recommendation = 'لا توجد أدوية غير مناسبة للمسنين.'; }
    else if (flagged.length <= 2) { risk = 'moderate'; recommendation = `${flagged.length} أدوية غير مناسبة. يُنصح بمراجعة الطبيب.`; }
    else { risk = 'high'; recommendation = `${flagged.length} أدوية غير مناسبة! مراجعة شاملة لصرف الأدوية.`; }

    return {
        score: flagged.length,
        risk,
        recommendation,
        cite: 'AGS Beers Criteria 2023',
        version: VERSION,
        components: { flagged, total_meds: medications?.length || 0 },
        warnings
    };
}

// ============================================================
// STOPP/START Criteria — prescribing optimization
// ============================================================
function stoppStartCheck(input) {
    const { conditions = [], medications = [] } = input;
    const warnings = [];

    // STOPP — medications to avoid given conditions
    const stopp = [];
    if (conditions.includes('ckd') && medications.some(m => (m.name||'').toLowerCase().includes('nsaid'))) {
        stopp.push({ drug: 'NSAID', reason: 'مرض كلوي مزمن — NSAIDs تُفاقم وظائف الكلى' });
    }
    if (conditions.includes('chf') && medications.some(m => (m.name||'').toLowerCase().includes('verapamil'))) {
        stopp.push({ drug: 'Verapamil', reason: 'فشل قلبي — Verapamil يثبط عضلة القلب' });
    }
    if (conditions.includes('glaucoma') && medications.some(m => (m.name||'').toLowerCase().includes('anticholinergic'))) {
        stopp.push({ drug: 'Anticholinergic', reason: 'جلوكوما — مضادات الكولين تزيد ضغط العين' });
    }

    // START — medications to consider given conditions
    const start = [];
    if (conditions.includes('osteoporosis') && !medications.some(m => (m.name||'').toLowerCase().includes('vitamin d'))) {
        start.push({ drug: 'Vitamin D + Calcium', reason: 'هشاشة عظام — يوصى بـ VitD + Ca' });
    }
    if (conditions.includes('afib') && !medications.some(m => (m.name||'').toLowerCase().includes('anticoagulant'))) {
        start.push({ drug: 'Anticoagulant', reason: 'رجفان أذيني — يحتاج مضاد تجلط' });
    }
    if (conditions.includes('hypertension') && !medications.some(m => (m.name||'').toLowerCase().includes('ace'))) {
        start.push({ drug: 'ACE inhibitor', reason: 'ضغط مرتفع — يوصى بـ ACEi كخط أول' });
    }

    let risk = 'low';
    let recommendation = '';
    if (stopp.length > 0 && start.length > 0) {
        risk = 'high';
        recommendation = `${stopp.length} أدوية يجب إيقافها + ${start.length} أدوية يجب إضافتها. مراجعة شاملة.`;
    } else if (stopp.length > 0) {
        risk = 'high';
        recommendation = `${stopp.length} أدوية يجب إيقافها.`;
    } else if (start.length > 0) {
        risk = 'moderate';
        recommendation = `${start.length} أدوية يجب إضافتها.`;
    } else {
        recommendation = 'العلاج الحالي مناسب.';
    }

    return {
        score: stopp.length + start.length,
        risk,
        recommendation,
        cite: 'STOPP/START Criteria 2024',
        version: VERSION,
        components: { stopp, start },
        warnings
    };
}

// ============================================================
// Frailty Index (Fried phenotype)
// ============================================================
function frailtyIndex(input) {
    const warnings = [];
    const criteria = {
        unintentional_weight_loss: input.weight_loss_10lb,        // >10 lb in past year
        self_reported_exhaustion:   input.exhaustion,
        weakness:                   input.weak_grip_strength,
        slow_walking_speed:         input.slow_walk,
        low_physical_activity:      input.low_activity
    };

    const positive = Object.values(criteria).filter(Boolean).length;
    let risk = 'unknown';
    let frailty = '';

    if (positive === 0)      { risk = 'low';      frailty = 'قوي (robust)'; }
    else if (positive <= 2)  { risk = 'moderate'; frailty = 'ما قبل الضعف (pre-frail)'; }
    else                     { risk = 'high';     frailty = 'ضعيف (frail)'; }

    return {
        score: positive,
        risk,
        recommendation: `تصنيف الضعف: ${frailty}. ` +
            (positive >= 3 ? 'يحتاج تدخل متعدد التخصصات.' :
             positive >= 1 ? 'يحتاج مراقبة + تمارين مقاومة + تغذية.' :
             'متابعة روتينية.'),
        cite: 'Fried Frailty Phenotype 2001',
        version: VERSION,
        components: { criteria, positive_count: positive, max: 5 },
        warnings
    };
}

module.exports = {
    cgaScore,
    tinettiPOMA,
    beersCheck,
    stoppStartCheck,
    frailtyIndex,
    VERSION,
    CITATIONS
};