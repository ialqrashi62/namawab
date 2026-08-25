// filepath: namaweb/burn_unit_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Rule of Nines', 'Parkland 1968', 'Baux 1961'];

// ============================================================
// tbsaCalculation — Rule of Nines
// ============================================================
function tbsaCalculation(input) {
    const { head, chest, abdomen, back, arms, hands, legs, feet, perineum } = input;
    const total = (head ?? 0) + (chest ?? 0) + (abdomen ?? 0) + (back ?? 0) + (arms ?? 0) + (hands ?? 0) + (legs ?? 0) + (feet ?? 0) + (perineum ?? 0);
    let risk = 'minor', rec = 'Outpatient care';
    if (total >= 20) { risk = 'moderate'; rec = 'Burn unit admission, IV fluids'; }
    else if (total >= 10) { risk = 'moderate'; rec = 'Hospital admission'; }
    else if (total >= 5) { risk = 'minor'; rec = 'ED evaluation'; }
    return { score: total, max_score: 100, risk, recommendation: rec, components: { head, chest, abdomen, back, arms, hands, legs, feet, perineum }, cite: CITATIONS[0], version: VERSION };
}

// ============================================================
// parklandFormula — 4 mL × weight × TBSA, half in first 8h
// ============================================================
function parklandFormula(input) {
    const { weightKg, tbsaPct } = input;
    if (weightKg === undefined || tbsaPct === undefined) return { error: 'missing_weight_or_tbsa' };
    const total24h = 4 * weightKg * tbsaPct;
    const first8h = total24h / 2;
    const next16h = total24h / 2;
    const rateFirst8 = (first8h / 8).toFixed(0);
    const rateNext16 = (next16h / 16).toFixed(0);
    return {
        score: total24h,
        total_24h_ml: total24h,
        first_8h_ml: first8h,
        next_16h_ml: next16h,
        rate_first_8h_ml_per_hr: rateFirst8,
        rate_next_16h_ml_per_hr: rateNext16,
        risk: tbsaPct >= 20 ? 'high' : 'moderate',
        recommendation: "Lactated Ringer's; titrate to urine output 0.5 mL/kg/h in adults",
        components: { weightKg, tbsaPct },
        cite: CITATIONS[1],
        version: VERSION
    };
}

// ============================================================
// bauxScore — Mortality prediction
// ============================================================
function bauxScore(input) {
    const { age, totalBurnPct, inhalationInjury } = input;
    const score = age + totalBurnPct + (inhalationInjury ? 17 : 0);
    let risk = 'low', rec = 'Standard treatment';
    if (score >= 100) { risk = 'very_high'; rec = 'Mortality >80% — palliative care discussion'; }
    else if (score >= 80) { risk = 'high'; rec = 'Mortality ~50% — maximal care'; }
    else if (score >= 60) { risk = 'moderate'; rec = 'Burn unit admission'; }
    return { score, max_score: 217, risk, recommendation: rec, components: { age, totalBurnPct, inhalationInjury }, cite: CITATIONS[2], version: VERSION };
}

module.exports = { tbsaCalculation, parklandFormula, bauxScore, VERSION, CITATIONS };
