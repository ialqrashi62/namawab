'use strict';
// TIER4_REPRO-101 IVF Workup
const CITATIONS = ['ASRM_IVF_Workup','ACOG_Infertility'];
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

function ivfInitialWorkup(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const duration_infertility_years = ensureNumber(input.duration_infertility_years, 'duration_infertility_years');
  const cycle_regular = !!input.cycle_regular;
  const male_factor = !!input.male_factor;
  const tubal_factor = !!input.tubal_factor;
  const workup = ['tsh','prolactin','ovulation_documentation','semen_analysis'];
  if (age >= 35) workup.push('fast_track_to_ivf_if_no_success_after_3_to_6_months');
  if (!cycle_regular) workup.push('mid_luteal_progesterone','pcos_workup');
  if (male_factor) workup.push('urology_referral');
  if (tubal_factor) workup.push('hsg_or_laparoscopy');
  return { age, duration_infertility_years, cycle_regular, male_factor, tubal_factor, workup, citations: CITATIONS };
}

function ivfIndications(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const primary = ensureEnum(input.primary || 'tubal', ['tubal','male','endometriosis','ovulatory','unexplained','preservation'], 'primary');
  const indications = {
    'tubal': 'tubal_disease_or_blockage',
    'male': 'severe_male_factor_infertility',
    'endometriosis': 'stage_iii_iv_endometriosis',
    'ovulatory': 'anovulation_ovulation_disorders',
    'unexplained': 'unexplained_infertility_over_3_years_or_age_38_plus',
    'preservation': 'fertility_preservation_oncology_or_age'
  };
  return { primary, indication: indications[primary], citations: CITATIONS };
}

module.exports = { ivfInitialWorkup, ivfIndications, CITATIONS, ValidationError };