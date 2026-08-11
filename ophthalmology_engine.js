// filepath: namaweb/ophthalmology_engine.js
// Ophthalmology — pure-function clinical engines
// Pattern: nm-engine-pattern
'use strict';

const VERSION = '1.0.0';
const CITATIONS = [
    'AAO Preferred Practice Patterns 2024',
    'AAO Glaucoma Guidelines 2024',
    'ICDR-2 Diabetic Retinopathy 2024',
    'AAO Retina Society Macular Degeneration'
];

// Visual acuity conversion (Snellen to logMAR)
const SNELLEN_TO_LOGMAR = {
    '6/6': 0.0, '6/7.5': 0.1, '6/9': 0.18, '6/12': 0.30,
    '6/15': 0.40, '6/18': 0.48, '6/24': 0.60, '6/36': 0.78,
    '6/60': 1.00, 'CF': 1.30, 'HM': 1.50, 'LP': 1.70, 'NLP': 2.00
};

function snellenToLogmar(s) { return SNELLEN_TO_LOGMAR[s] ?? null; }

// ============================================================
// Glaucoma Risk (based on IOP, C/D ratio, VF defects)
// ============================================================
function glaucomaRisk(input) {
    const warnings = [];
    const { iop_od, iop_os, cd_ratio_od, cd_ratio_os, vf_defect, family_history, age } = input;

    let score = 0;
    const components = {};

    // IOP
    if (iop_od && iop_od >= 30) { score += 5; components.iopOdMod = 5; }
    else if (iop_od && iop_od >= 22) { score += 3; components.iopOdMod = 3; }
    else if (iop_od && iop_od >= 18) { score += 1; components.iopOdMod = 1; }

    if (iop_os && iop_os >= 30) { score += 5; components.iopOsMod = 5; }
    else if (iop_os && iop_os >= 22) { score += 3; components.iopOsMod = 3; }
    else if (iop_os && iop_os >= 18) { score += 1; components.iopOsMod = 1; }

    // Cup-to-disc ratio (suspect > 0.6)
    if (cd_ratio_od && cd_ratio_od >= 0.8) { score += 4; components.cdOdMod = 4; }
    else if (cd_ratio_od && cd_ratio_od >= 0.6) { score += 2; components.cdOdMod = 2; }
    if (cd_ratio_os && cd_ratio_os >= 0.8) { score += 4; components.cdOsMod = 4; }
    else if (cd_ratio_os && cd_ratio_os >= 0.6) { score += 2; components.cdOsMod = 2; }

    // Visual field defect
    if (vf_defect === 'severe') { score += 5; components.vfMod = 5; }
    else if (vf_defect === 'mild') { score += 2; components.vfMod = 2; }

    // Family history
    if (family_history) { score += 2; components.familyMod = 2; }

    // Age
    if (age && age >= 65) { score += 1; components.ageMod = 1; }

    let risk = 'low';
    let recommendation = '';
    let stage = '';

    if (score >= 12) { risk = 'very_high'; stage = 'متقدم'; recommendation = 'جلوكوما متقدمة. علاج عاجل + جراحة محتملة.'; }
    else if (score >= 8) { risk = 'high'; stage = 'متوسط'; recommendation = 'جلوكوما مشتبهة. يحتاج Octopus VF + OCT + علاج خافض للضغط.'; }
    else if (score >= 4) { risk = 'moderate'; stage = 'مشتبه'; recommendation = 'مراقبة وثيقة + فحوصات دورية كل 6 أشهر.'; }
    else { risk = 'low'; stage = 'طبيعي'; recommendation = 'فحص روتيني سنوي.'; }

    return {
        score,
        risk,
        recommendation,
        stage,
        cite: 'AAO Glaucoma Preferred Practice Pattern 2024',
        version: VERSION,
        components,
        warnings
    };
}

// ============================================================
// Diabetic Retinopathy (ICDR classification)
// ============================================================
function diabeticRetinopathy(input) {
    const warnings = [];
    const { diabetes_type, duration_years, hba1c, microaneurysms, hemorrhages,
            hard_exudates, cotton_wool, neovascularization, macular_edema, prior_laser } = input;

    let stage = 0;
    let severity = '';
    let recommendation = '';

    if (neovascularization) {
        stage = 4;
        severity = 'PDR — Proliferative';
        recommendation = 'PDR متقدم. ليزر بانريتينال / Anti-VEGF حقن. متابعة كل شهر.';
    } else if (hemorrhages && hemorrhages.severity === 'severe') {
        stage = 3;
        severity = 'Severe NPDR';
        recommendation = 'NPDR شديد. متابعة كل 3-6 أشهر + Anti-VEGF إن لزم.';
    } else if (hemorrhages && hemorrhages.severity === 'moderate') {
        stage = 2;
        severity = 'Moderate NPDR';
        recommendation = 'NPDR متوسط. متابعة كل 6-12 شهر.';
    } else if (microaneurysms || (hard_exudates && hard_exudates.length > 0)) {
        stage = 1;
        severity = 'Mild NPDR';
        recommendation = 'NPDR خفيف. متابعة كل 12 شهر + تحسين تحكم السكر (HbA1c < 7%).';
    } else {
        severity = 'No DR';
        recommendation = 'لا يوجد اعتلال شبكية سكري. متابعة سنوية.';
    }

    // DME (Diabetic Macular Edema)
    let dme = '';
    if (macular_edema === 'center_involving') {
        dme = 'DME مركزي. Anti-VEGF حقن عاجلة.';
    } else if (macular_edema === 'non_center') {
        dme = 'DME غير مركزي. متابعة.';
    } else if (macular_edema === 'none') {
        dme = '';
    }

    const fullRecommendation = recommendation + (dme ? ' ' + dme : '');

    return {
        score: stage,
        risk: stage >= 3 ? 'very_high' : stage === 2 ? 'high' : stage === 1 ? 'moderate' : 'low',
        recommendation: fullRecommendation,
        severity,
        stage,
        cite: 'ICDR-2 Clinical Diabetic Retinopathy Severity Scale',
        version: VERSION,
        components: { stage, severity, dme, hba1c, duration_years, prior_laser },
        warnings
    };
}

// ============================================================
// AMD (Age-related Macular Degeneration)
// ============================================================
function amdRisk(input) {
    const warnings = [];
    const { age, drusen_size, pigmentary_changes, neovascular, va_recent_loss, fellow_eye_amd } = input;

    let score = 0;
    let stage = '';
    let risk = 'low';
    let recommendation = '';

    if (drusen_size === 'large') { score += 4; }
    else if (drusen_size === 'medium') { score += 2; }
    else if (drusen_size === 'small') { score += 1; }

    if (pigmentary_changes) score += 2;
    if (neovascular) score += 6;
    if (va_recent_loss) score += 3;
    if (fellow_eye_amd) score += 3;
    if (age && age >= 75) score += 2;

    if (neovascular) {
        stage = 'wet (exudative)';
        risk = 'very_high';
        recommendation = 'AMD رطب. Anti-VEGF حقن شهرية + OCT متكرر.';
    } else if (score >= 7) {
        stage = 'advanced dry';
        risk = 'high';
        recommendation = 'AMD جاف متقدم. AREDS2 فيتامينات + مراقبة.';
    } else if (score >= 4) {
        stage = 'intermediate';
        risk = 'moderate';
        recommendation = 'AMD متوسط. AREDS2 فيتامينات + مراقبة كل 6 أشهر.';
    } else if (score >= 1) {
        stage = 'early';
        risk = 'low';
        recommendation = 'AMD مبكر. مراقبة سنوية.';
    } else {
        stage = 'none';
        recommendation = 'لا توجد علامات AMD. فحص روتيني.';
    }

    return {
        score,
        risk,
        recommendation,
        stage,
        cite: 'AAO Age-Related Macular Degeneration PPP 2024',
        version: VERSION,
        components: { stage, score, neovascular, drusen_size },
        warnings
    };
}

// ============================================================
// Refractive Error Classification
// ============================================================
function refractiveError(input) {
    const warnings = [];
    const { sph, cyl, add, age } = input;

    let classification = '';
    let recommendation = '';

    const absSph = Math.abs(sph || 0);
    const absCyl = Math.abs(cyl || 0);

    if (absSph <= 0.5 && absCyl <= 0.5) {
        classification = 'Emmetropia (طبيعي)';
        recommendation = 'لا يحتاج تصحيح.';
    } else if (sph < -0.5) {
        classification = `Myopia (قصر نظر) ${absSph.toFixed(2)} D`;
    } else if (sph > 0.5) {
        classification = `Hyperopia (طول نظر) ${absSph.toFixed(2)} D`;
    }

    if (absCyl > 0.5) {
        classification += ` + Astigmatism ${absCyl.toFixed(2)} D`;
    }

    if (add && add > 0 && age >= 40) {
        classification += ` + Presbyopia +${add.toFixed(2)} D`;
    }

    if (!recommendation) {
        recommendation = classification + '. يُنصح بنظارات أو عدسات لاصقة.';
    }

    return {
        score: absSph + absCyl,
        risk: 'low',
        recommendation,
        classification,
        cite: 'AAO Refractive Errors in Adults 2024',
        version: VERSION,
        components: { sph, cyl, add, age, classification },
        warnings
    };
}

module.exports = {
    glaucomaRisk,
    diabeticRetinopathy,
    amdRisk,
    refractiveError,
    snellenToLogmar,
    SNELLEN_TO_LOGMAR,
    VERSION,
    CITATIONS
};