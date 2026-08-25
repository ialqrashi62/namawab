// filepath: namaweb/dialysis_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Daugirdas 1993', 'NKF KDOQI 2020'];

function ktv(input) {
    const { preBUN, postBUN, treatmentHours, weightLoss } = input;
    if (!preBUN || !postBUN || !treatmentHours) return { error: 'missing_bun_hours' };
    const l = preBUN - postBUN;
    const r = Math.log(preBUN / postBUN);
    const ultrafiltration = weightLoss ?? 0;
    const ktv = (l) * r / treatmentHours + (ultrafiltration * 0.008 / treatmentHours);
    const score = Math.round(ktv * 100) / 100;
    let risk = 'inadequate', rec = 'Inadequate dialysis';
    if (ktv >= 1.4) { risk = 'adequate'; rec = 'Good dialysis'; }
    else if (ktv >= 1.2) { risk = 'acceptable'; rec = 'Adequate'; }
    return { score, risk, recommendation: rec, components: { preBUN, postBUN, treatmentHours, weightLoss }, cite: CITATIONS[0], version: VERSION };
}

function ureaReductionRatio(input) {
    const { preBUN, postBUN } = input;
    if (!preBUN || !postBUN) return { error: 'missing_bun' };
    const urr = (1 - preBUN / postBUN) * 100;
    const score = Math.round(urr * 10) / 10;
    let risk = 'inadequate', rec = 'Increase dialysis';
    if (urr >= 70) { risk = 'adequate'; rec = 'Good dialysis'; }
    else if (urr >= 65) { risk = 'acceptable'; rec = 'Adequate'; }
    return { score, risk, recommendation: rec, components: { preBUN, postBUN }, cite: CITATIONS[1], version: VERSION };
}

function ultrafiltrationTarget(input) {
    const { preWeight, dryWeight, hours } = input;
    if (!preWeight || !dryWeight) return { error: 'missing_weights' };
    const targetUF = preWeight - dryWeight;
    const maxRate = 1.5;
    const maxSafeLoss = maxRate * hours;
    const score = targetUF;
    let risk = 'safe', rec = 'Within safe UF rate';
    if (targetUF > maxSafeLoss) { risk = 'unsafe'; rec = 'Reduce UF or extend treatment time'; }
    return { score, max_safe_loss_kg: maxSafeLoss, risk, recommendation: rec, components: { preWeight, dryWeight, hours }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { ktv, ureaReductionRatio, ultrafiltrationTarget, VERSION, CITATIONS };
