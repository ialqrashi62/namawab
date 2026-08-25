'use strict';
// TIER4_REPRO-102 Menopause HT
const CITATIONS = ['NAMS_2022_Hormone_Therapy','ACOG_Menopause'];
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

function htEligibility(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const years_since_menopause = ensureNumber(input.years_since_menopause || 0, 'years_since_menopause');
  const breast_cancer_history = !!input.breast_cancer_history;
  const vte_history = !!input.vte_history;
  const coronary_artery_disease = !!input.coronary_artery_disease;
  const stroke_history = !!input.stroke_history;
  const liver_disease_active = !!input.liver_disease_active;
  const vasomotor_symptoms = !!input.vasomotor_symptoms;
  const candidate = (age < 60 && years_since_menopause < 10) && vasomotor_symptoms;
  const contraindicated = breast_cancer_history || vte_history || coronary_artery_disease || stroke_history || liver_disease_active;
  return { age, years_since_menopause, vasomotor_symptoms, candidate, contraindicated, recommendations: contraindicated ? ['non_hormonal_options_ssri_snri_gabapentin'] : ['lowest_effective_dose_shortest_duration','transdermal_preferred_to_oral','annual_review'], citations: CITATIONS };
}

function htRoutesAndDosing(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const has_uterus = !!input.has_uterus;
  const symptoms = ensureEnum(input.symptoms || 'vasomotor', ['vasomotor','genitourinary','bone_loss'], 'symptoms');
  let recommendation = 'estrogen_only_transdermal_estradiol_patch';
  if (has_uterus) recommendation = 'estrogen_plus_progestin_to_protect_endometrium';
  if (symptoms === 'genitourinary') recommendation = 'low_dose_vaginal_estradiol_cream_or_tablet';
  return { has_uterus, symptoms, recommendation, citations: CITATIONS };
}

module.exports = { htEligibility, htRoutesAndDosing, CITATIONS, ValidationError };