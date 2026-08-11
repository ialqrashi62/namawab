// filepath: namaweb/dental_engine.js
// Dental — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'ICD-10-CM Dental 2024',
    'AAP Periodontal Classification 2017',
    'Universal Tooth Numbering System'
];

// Universal tooth numbering system (1-32)
// 1-16: Upper jaw, right to left
// 17-32: Lower jaw, left to right
const TEETH_UPPER = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
const TEETH_LOWER = [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];
const TEETH_NAMES = {
    1: 'third molar (upper right)', 16: 'third molar (upper left)',
    17: 'third molar (lower left)', 32: 'third molar (lower right)',
    6: 'first molar (upper right)', 7: 'second molar (upper right)',
    8: 'first molar (upper left)', 9: 'second molar (upper left)',
    19: 'first molar (lower left)', 20: 'second molar (lower left)',
    30: 'first molar (lower right)', 31: 'second molar (lower right)'
};

function getToothName(num) {
    return TEETH_NAMES[num] || `tooth ${num}`;
}

// ============================================================
// DMFT Index (Decayed, Missing, Filled Teeth)
// ============================================================
function dmftIndex(input) {
    const warnings = [];
    const { decayed = [], missing = [], filled = [] } = input;

    const decayedCount = decayed.length;
    const missingCount = missing.length;
    const filledCount = filled.length;
    const dmft = decayedCount + missingCount + filledCount;

    // WHO classification
    let severity = '';
    if (dmft === 0) severity = 'صحة فموية ممتازة';
    else if (dmft <= 5) severity = 'معدل منخفض';
    else if (dmft <= 10) severity = 'معدل متوسط';
    else severity = 'معدل مرتفع (يحتاج تدخل)';

    return {
        score: dmft,
        risk: dmft >= 10 ? 'high' : dmft >= 5 ? 'moderate' : 'low',
        recommendation: `مؤشر DMFT = ${dmft} (منخور: ${decayedCount}، مفقود: ${missingCount}، محشو: ${filledCount}). ${severity}`,
        cite: 'WHO Oral Health Surveys 2024',
        version: VERSION,
        components: { decayed: decayedCount, missing: missingCount, filled: filledCount, dmft },
        warnings
    };
}

// ============================================================
// Periodontal Status (Bleeding on Probing, Pocket Depth)
// ============================================================
function periodontalStatus(input) {
    const warnings = [];
    const { pockets = [], bleeding_sites = 0, total_sites = 168, mobility_grade } = input;

    // Pocket depths classification
    const shallow = pockets.filter(p => p < 4).length;
    const moderate = pockets.filter(p => p >= 4 && p < 6).length;
    const deep = pockets.filter(p => p >= 6).length;

    const bopPercent = total_sites > 0 ? (bleeding_sites / total_sites * 100) : 0;

    let stage = 0;
    let recommendation = '';
    if (deep > 0 || bopPercent > 30) { stage = 3; recommendation = 'التهاب دواعم متقدم. علاج عاجل + جراحة محتملة.'; }
    else if (moderate > 5 || bopPercent > 15) { stage = 2; recommendation = 'التهاب دواعم متوسط. علاج غير جراحي + متابعة.'; }
    else if (moderate > 0 || bopPercent > 10) { stage = 1; recommendation = 'التهاب دواعم مبكر. تنظيف + تعليم المريض.'; }
    else { stage = 0; recommendation = 'صحة دواعم سليمة. متابعة روتينية.'; }

    return {
        score: stage,
        risk: stage >= 2 ? 'high' : stage === 1 ? 'moderate' : 'low',
        recommendation,
        cite: 'AAP Periodontal Classification 2017',
        version: VERSION,
        components: {
            shallow_pockets: shallow,
            moderate_pockets: moderate,
            deep_pockets: deep,
            bop_percent: Math.round(bopPercent * 10) / 10,
            mobility_grade,
            stage
        },
        warnings
    };
}

// ============================================================
// Treatment Priority (urgent vs routine)
// ============================================================
function treatmentPriority(input) {
    const warnings = [];
    const { chief_complaint, symptoms } = input;

    const URGENT = ['severe_pain', 'swelling', 'trauma', 'abscess', 'hemorrhage'];
    const HIGH = ['moderate_pain', 'fracture', 'lost_restoration'];
    const ROUTINE = ['cleaning', 'checkup', 'cosmetic'];

    let priority = 'routine';
    let recommendation = '';
    let risk = 'low';

    if (symptoms && symptoms.some(s => URGENT.includes(s))) {
        priority = 'urgent';
        risk = 'high';
        recommendation = 'طارئ — يحتاج معالجة فورية (نفس اليوم).';
    } else if (symptoms && symptoms.some(s => HIGH.includes(s))) {
        priority = 'high';
        risk = 'moderate';
        recommendation = 'أولوية عالية — جدولة خلال 24-48 ساعة.';
    } else if (symptoms && symptoms.some(s => ROUTINE.includes(s))) {
        priority = 'routine';
        recommendation = 'روتيني — جدولة خلال أسبوع.';
    } else {
        recommendation = 'تحديد الأولوية بناءً على الفحص السريري.';
    }

    return {
        score: priority === 'urgent' ? 3 : priority === 'high' ? 2 : 1,
        risk,
        recommendation,
        cite: 'ADA Treatment Urgency Guidelines 2024',
        version: VERSION,
        components: { priority, symptoms, chief_complaint },
        warnings
    };
}

module.exports = {
    dmftIndex,
    periodontalStatus,
    treatmentPriority,
    getToothName,
    TEETH_UPPER,
    TEETH_LOWER,
    VERSION,
    CITATIONS
};