'use strict';
// TIER4_RHEUM_EXT-104 Myositis
const CITATIONS = ['ENMC_Myositis','ACR_EULAR_Myositis_Classification'];
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

function inflammatoryMyopathyScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const proximal_weakness = !!input.proximal_weakness;
  const elevated_ck = ensureNumber(input.elevated_ck || 0, 'elevated_ck');
  const elevated_aldolase = !!input.elevated_aldolase;
  const mri_edema = !!input.mri_edema;
  const emg_myopathic = !!input.emg_myopathic;
  const biopsy_inflammation = !!input.biopsy_inflammation;
  const autoantibodies_present = !!input.autoantibodies_present;
  const screening_score = (proximal_weakness ? 1 : 0) + (elevated_ck >= 1000 ? 2 : elevated_ck >= 200 ? 1 : 0) + (elevated_aldolase ? 1 : 0) + (mri_edema ? 2 : 0) + (emg_myopathic ? 1 : 0) + (biopsy_inflammation ? 3 : 0) + (autoantibodies_present ? 2 : 0);
  const diagnosis_likelihood = screening_score >= 5 ? 'high' : screening_score >= 3 ? 'moderate' : 'low';
  return { proximal_weakness, elevated_ck, mri_edema, emg_myopathic, biopsy_inflammation, autoantibodies_present, screening_score, diagnosis_likelihood, citations: CITATIONS };
}

function statinMyopathyVsInflammatory(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const on_statin = !!input.on_statin;
  const ck_value = ensureNumber(input.ck_value || 0, 'ck_value');
  const weakness_pattern = ensureEnum(input.weakness_pattern || 'proximal', ['proximal','diffuse','focal','myalgia_only','cramps'], 'weakness_pattern');
  const autoantibodies_present = !!input.autoantibodies_present;
  const elevated_after_statin = on_statin && ck_value >= 1000;
  const inflammatory_features = !on_statin || autoantibodies_present || weakness_pattern === 'proximal';
  let guidance = 'continue_statin_monitor_ck_2_weeks';
  if (elevated_after_statin && !inflammatory_features) guidance = 'discontinue_statin_evaluate_drug_interaction';
  if (inflammatory_features && autoantibodies_present) guidance = 'refer_myology_specialist_biopsy_consider';
  return { on_statin, ck_value, weakness_pattern, autoantibodies_present, guidance, citations: CITATIONS };
}

module.exports = { inflammatoryMyopathyScreen, statinMyopathyVsInflammatory, CITATIONS, ValidationError };