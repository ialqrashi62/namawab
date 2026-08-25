'use strict';
// TIER4_ENT_EXT-105 Voice
const CITATIONS = ['AAO_HNS_Voice','ASHA_Voice_Disorders'];
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

function dysphoniaWorkup(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const duration_weeks = ensureNumber(input.duration_weeks, 'duration_weeks');
  const hoarseness = !!input.hoarseness;
  const smoker = !!input.smoker;
  const reflux = !!input.reflux;
  let red_flags = [];
  if (duration_weeks >= 4 && smoker) red_flags.push('laryngeal_cancer_evaluation');
  if (duration_weeks >= 2) red_flags.push('laryngoscopy_referral');
  return { duration_weeks, hoarseness, smoker, reflux, red_flags, citations: CITATIONS };
}

function vocalCordParalysisManagement(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const side = ensureEnum(input.side || 'left', ['left','right','bilateral'], 'side');
  const duration_weeks = ensureNumber(input.duration_weeks || 0, 'duration_weeks');
  const etiology = ensureEnum(input.etiology || 'idiopathic', ['idiopathic','surgical','tumor','neurologic','idiopathic_viral'], 'etiology');
  let workup = ['ct_neck_chest','laryngoscopy'];
  if (etiology === 'tumor' || side === 'bilateral') workup.push('mri_brain_and_skull_base');
  if (duration_weeks < 24) workup.push('voice_therapy_referral');
  else workup.push('medialization_injection_or_thyroplasty');
  return { side, duration_weeks, etiology, workup, citations: CITATIONS };
}

module.exports = { dysphoniaWorkup, vocalCordParalysisManagement, CITATIONS, ValidationError };