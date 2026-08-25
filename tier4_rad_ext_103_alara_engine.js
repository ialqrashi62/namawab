'use strict';
// TIER4_RAD_EXT-103 ALARA
const CITATIONS = ['Image_Gently','Image_Wisely'];
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

function doseOptimization(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const examination = ensureEnum(input.examination || 'ct_chest', ['ct_chest','ct_head','ct_abdomen','flouro','nuclear'], 'examination');
  const size_adapt = !!input.size_adapt;
  const shielding = !!input.shielding;
  const techniques = ['use_mA_modulation','use_kV_optimization'];
  if (size_adapt) techniques.push('size_adaptive_dose_adjustment');
  if (shielding) techniques.push('shielding_for_thyroid_or_breast_or_gonads');
  return { examination, size_adapt, shielding, techniques, citations: CITATIONS };
}

function pediatricImagingProtocol(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_years = ensureNumber(input.age_years, 'age_years');
  const weight_kg = ensureNumber(input.weight_kg || 0, 'weight_kg');
  const examination = ensureEnum(input.examination || 'ct_chest', ['ct_chest','ct_head','ct_abdomen','plain_xray'], 'examination');
  let dose_reduction_pct = 30;
  if (age_years < 1) dose_reduction_pct = 50;
  else if (age_years < 5) dose_reduction_pct = 40;
  else if (age_years < 12) dose_reduction_pct = 30;
  return { age_years, weight_kg, examination, dose_reduction_pct, technique: 'pediatric_weight_based_protocols_image_gently', citations: CITATIONS };
}

module.exports = { doseOptimization, pediatricImagingProtocol, CITATIONS, ValidationError };