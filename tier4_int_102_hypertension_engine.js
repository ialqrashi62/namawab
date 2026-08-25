'use strict';
// TIER4_INT-102 Hypertension
const CITATIONS = ['ACC_AHA_2017_HTN','KDIGO_BP'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function htnClassification(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const sbp = ensureNumber(input.sbp, 'sbp');
  const dbp = ensureNumber(input.dbp, 'dbp');
  let stage = 'normal';
  if (sbp >= 180 || dbp >= 120) stage = 'hypertensive_crisis';
  else if (sbp >= 160 || dbp >= 100) stage = 'stage_2_htn';
  else if (sbp >= 140 || dbp >= 90) stage = 'stage_2_htn';
  else if (sbp >= 130 || dbp >= 80) stage = 'stage_1_htn';
  else if (sbp >= 120) stage = 'elevated';
  return { sbp, dbp, stage, citations: CITATIONS };
}

function htnTreatment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const stage = ensureEnum(input.stage || 'stage_1_htn', ['elevated','stage_1_htn','stage_2_htn','hypertensive_crisis'], 'stage');
  const diabetes = !!input.diabetes;
  const ckd = !!input.ckd;
  const ascvd_risk_10yr = ensureNumber(input.ascvd_risk_10yr || 0, 'ascvd_risk_10yr');
  const recommendation = stage === 'hypertensive_crisis' ? 'urgent_referral_or_ed_iv_medications'
    : stage === 'stage_2_htn' ? 'two_drug_therapy_ace_inhibitor_plus_ccb_or_thiazide'
    : stage === 'stage_1_htn' && (diabetes || ckd || ascvd_risk_10yr >= 10) ? 'thiazide_or_acei_or_ccb_or_arb'
    : stage === 'stage_1_htn' ? 'lifestyle_modification_reassess_3_6_months'
    : 'lifestyle_modification_only';
  return { stage, diabetes, ckd, ascvd_risk_10yr, recommendation, citations: CITATIONS };
}

module.exports = { htnClassification, htnTreatment, CITATIONS, ValidationError };