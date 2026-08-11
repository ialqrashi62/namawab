// filepath: namaweb/ent_engine.js
// ENT (Ear, Nose, Throat) — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'AAO-HNS Clinical Practice Guidelines 2024',
    'Clinical Audiology 2024',
    'Bell Palsy Scoring House-Brackmann 1985'
];

// ============================================================
// Hearing Loss Classification (WHO)
// ============================================================
function hearingLossClassification(input) {
    const warnings = [];
    const { pta_od, pta_os } = input;  // Pure Tone Average in dB

    let severityOd = '', severityOs = '';
    const classify = (pta) => {
        if (pta === undefined) return '';
        if (pta <= 25) return 'normal';
        if (pta <= 40) return 'mild';
        if (pta <= 55) return 'moderate';
        if (pta <= 70) return 'moderately_severe';
        if (pta <= 90) return 'severe';
        return 'profound';
    };
    severityOd = classify(pta_od);
    severityOs = classify(pta_os);

    let recommendation = '';
    if (severityOd === 'severe' || severityOs === 'severe' || severityOd === 'profound' || severityOs === 'profound') {
        recommendation = 'فقدان سمع شديد. يحتاج سماعة أذن أو زراعة قوقعة.';
    } else if (severityOd === 'moderately_severe' || severityOs === 'moderately_severe') {
        recommendation = 'سماعة أذن طبية + متابعة 6 أشهر.';
    } else if (severityOd === 'moderate' || severityOs === 'moderate') {
        recommendation = 'سماعة أذن + إعادة تأهيل سمعي.';
    } else if (severityOd === 'mild' || severityOs === 'mild') {
        recommendation = 'متابعة. يُنصح بحماية السمع.';
    } else {
        recommendation = 'سمع طبيعي.';
    }

    const worst = ['normal','mild','moderate','moderately_severe','severe','profound'].indexOf(
        ['normal','mild','moderate','moderately_severe','severe','profound'].includes(severityOd) && severityOd.includes('profound') ? 'profound'
        : severityOs === 'severe' || severityOd === 'severe' ? 'severe'
        : severityOd === 'moderately_severe' || severityOs === 'moderately_severe' ? 'moderately_severe'
        : severityOd === 'moderate' || severityOs === 'moderate' ? 'moderate'
        : severityOd === 'mild' || severityOs === 'mild' ? 'mild' : 'normal'
    );

    return {
        score: Math.max(pta_od || 0, pta_os || 0),
        risk: worst >= 4 ? 'high' : worst >= 3 ? 'moderate' : 'low',
        recommendation,
        severity_od: severityOd,
        severity_os: severityOs,
        cite: 'WHO Grades of Hearing Impairment 2024',
        version: VERSION,
        components: { pta_od, pta_os, severity_od: severityOd, severity_os: severityOs },
        warnings
    };
}

// ============================================================
// Tympanometry Classification (Jerger)
// ============================================================
function tympanometry(input) {
    const warnings = [];
    const { type, ear } = input;

    const TYPES = {
        A:    'normal',
        As:   'shallow (suspect otosclerosis)',
        Ad:   'deep (suspect ossicular discontinuity)',
        B:    'flat (middle ear effusion)',
        C:    'negative pressure (eustachian dysfunction)'
    };

    const description = TYPES[type] || 'unknown';
    let recommendation = '';
    let risk = 'low';

    if (type === 'B') {
        risk = 'high';
        recommendation = 'انصباب الأذن الوسطى. يحتاج بزل طبلة أو أنبوب تهوية.';
    } else if (type === 'C') {
        risk = 'moderate';
        recommendation = 'خلل نفير أوستاكي. علاج تحفظي + إعادة تقييم.';
    } else if (type === 'As') {
        risk = 'moderate';
        recommendation = 'مؤشر على تصلب الأذن. فحوصات إضافية (CT).';
    } else if (type === 'Ad') {
        risk = 'moderate';
        recommendation = 'انفصال عظيمات. جراحة إصلاح محتملة.';
    } else {
        recommendation = 'طبلة الأذن طبيعية.';
    }

    return {
        score: type === 'A' ? 0 : 1,
        risk,
        recommendation,
        tymp_type: type,
        description,
        cite: 'Jerger Tympanometry Classification',
        version: VERSION,
        components: { type, ear, description },
        warnings
    };
}

// ============================================================
// Bell's Palsy Severity (House-Brackmann)
// ============================================================
function bellPalsyScore(input) {
    const warnings = [];
    const { grade, days_since_onset, complete_paralysis, ear_pain, taste_change } = input;

    const GRADES = {
        1: 'normal',
        2: 'mild dysfunction (slight weakness on close inspection)',
        3: 'moderate dysfunction (obvious weakness, no disfigurement)',
        4: 'moderately severe dysfunction (obvious weakness, disfigurement)',
        5: 'severe dysfunction (only barely perceptible motion)',
        6: 'total paralysis (no movement)'
    };

    let risk = 'low';
    let recommendation = '';
    let prognosis = '';

    if (grade >= 4) { risk = 'high'; prognosis = 'ضعيف'; }
    else if (grade === 3) { risk = 'moderate'; prognosis = 'متوسط'; }
    else { risk = 'low'; prognosis = 'جيد'; }

    if (complete_paralysis) prognosis = 'ضعيف';

    if (days_since_onset > 3 && grade >= 4) {
        recommendation = 'علاج بـ Prednisolone + Acyclovir فوراً. بدء العلاج المبكر يحسن الإنذار.';
    } else if (days_since_onset <= 3 && grade >= 2) {
        recommendation = 'علاج بـ Prednisolone فوري (60-80 mg/d لمدة أسبوع) + حماية العين.';
    } else {
        recommendation = 'متابعة فقط. توقع تحسن تلقائي.';
    }

    if (ear_pain || taste_change) {
        recommendation += ' مراقبة دقيقة لوظيفة العصب الوجهي.';
    }

    return {
        score: grade,
        risk,
        recommendation,
        prognosis,
        grade_description: GRADES[grade],
        cite: 'House-Brackmann Facial Nerve Grading 1985',
        version: VERSION,
        components: { grade, days_since_onset, complete_paralysis, ear_pain, taste_change },
        warnings
    };
}

// ============================================================
// Tonsillitis Severity (Centor criteria)
// ============================================================
function tonsillitisSeverity(input) {
    const warnings = [];
    const { fever, tonsillar_exudate, tender_anterior_cervical_lymphadenopathy,
            absence_of_cough, age } = input;

    let score = 0;
    const components = {};

    if (fever > 38) { score += 1; components.feverMod = 1; }
    if (tonsillar_exudate) { score += 1; components.exudateMod = 1; }
    if (tender_anterior_cervical_lymphadenopathy) { score += 1; components.lymphMod = 1; }
    if (absence_of_cough) { score += 1; components.noCoughMod = 1; }
    if (age >= 3 && age <= 14) { score += 1; components.ageMod = 1; }
    else if (age >= 15 && age <= 44) { score += 0; }
    else if (age >= 45) { score -= 1; components.ageMod = -1; }

    let risk = 'low';
    let recommendation = '';

    if (score >= 4) {
        risk = 'high';
        recommendation = 'احتمال كبير لبكتيريا Strep. يُنصح بمزرعة حلق + مضاد حيوي (Penicillin).';
    } else if (score === 3) {
        risk = 'moderate';
        recommendation = 'احتمال متوسط. اختبار سريع + مزرعة + علاج تجريبي.';
    } else if (score === 2) {
        risk = 'low';
        recommendation = 'احتمال منخفض. مزرعة فقط، لا علاج تجريبي.';
    } else {
        recommendation = 'احتمال Strep منخفض جداً. لا حاجة لمزرعة أو مضاد حيوي.';
    }

    return {
        score,
        risk,
        recommendation,
        cite: 'Centor Criteria (Modified by McIsaac) 1998',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Vertigo Risk (HINTS exam)
// ============================================================
function vertigoHINTS(input) {
    const warnings = [];
    const { h_test, i_test, n_test, direction_changing_nystagmus, hearing_loss,
            vertical_nystagmus, skew_deviation } = input;

    // HINTS = Head-Impulse, Nystagmus, Test of Skew
    // If any of the 3 are POSITIVE for central pattern → central lesion (stroke)

    let centralSigns = 0;
    const findings = {};

    if (h_test === 'normal') { centralSigns++; findings.h_test = 'central'; }
    else { findings.h_test = 'peripheral'; }

    if (direction_changing_nystagmus || vertical_nystagmus) {
        centralSigns++;
        findings.nystagmus = 'central';
    } else { findings.nystagmus = 'peripheral'; }

    if (skew_deviation) {
        centralSigns++;
        findings.skew = 'central';
    } else { findings.skew = 'peripheral'; }

    let risk = 'low';
    let recommendation = '';
    let diagnosis = '';

    if (centralSigns > 0) {
        risk = 'very_high';
        diagnosis = 'مؤشرات مركزية!';
        recommendation = '🚨 احتمال إصابة جذع الدماغ أو جذع المخيخ. MRI طارئ + استشارة عصبية فورية.';
    } else {
        risk = 'moderate';
        diagnosis = 'منشأ محيطي محتمل';
        recommendation = 'دوار محيطي (BPPV أو التهاب دهليزي). علاج تحفظي + مناورة Epley إن كان BPPV.';
    }

    if (hearing_loss && risk !== 'very_high') {
        recommendation += ' فقدان سمع مرافق → يُشتبه بـ Ménière أو التهاب تيه.';
    }

    return {
        score: centralSigns,
        risk,
        recommendation,
        diagnosis,
        findings,
        cite: 'HINTS Exam — Newman-Toker 2008',
        version: VERSION,
        components: { central_signs: centralSigns, findings },
        warnings
    };
}

module.exports = {
    hearingLossClassification,
    tympanometry,
    bellPalsyScore,
    tonsillitisSeverity,
    vertigoHINTS,
    VERSION,
    CITATIONS
};