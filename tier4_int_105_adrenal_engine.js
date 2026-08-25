'use strict';
// TIER4_INT-105 Adrenal/Pituitary
const CITATIONS = ['Endocrine_Society_Cushing','NICE_Adrenal'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function cushingScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const symptoms_present = !!input.symptoms_present;
  const screening_test = input.screening_test || 'late_night_salivary_cortisol';
  let screen_recommended = symptoms_present;
  const symptoms = ['moon_facies','central_obesity','striae','proximal_weakness','hypertension','diabetes','irregular_menses'];
  return { symptoms_present, screen_recommended, screening_test, additional_workup: ['24h_urinary_free_cortisol','low_dose_dexamethasone_suppression'], citations: CITATIONS };
}

function adrenalInsufficiency(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const morning_cortisol = ensureNumber(input.morning_cortisol, 'morning_cortisol');
  const acth_stimulation_done = !!input.acth_stimulation_done;
  const stress_dose_appropriate = !!input.stress_dose_appropriate;
  let diagnosis = 'unclear';
  if (morning_cortisol < 3) diagnosis = 'definite_adrenal_insufficiency';
  else if (morning_cortisol < 10 && !acth_stimulation_done) diagnosis = 'possible_adrenal_insufficiency_test_acth';
  else if (morning_cortisol >= 10) diagnosis = 'adrenal_insufficiency_unlikely';
  const treatment = diagnosis === 'definite_adrenal_insufficiency' || diagnosis === 'possible_adrenal_insufficiency_test_acth' ? 'hydrocortisone_15_to_20_mg_am_5_to_10_mg_pm_fludrocortisone_0_05_to_0_1_mg_daily_stress_dose_100_mg_iv_for_procedure' : 'no_treatment_needed';
  return { morning_cortisol, acth_stimulation_done, diagnosis, treatment, citations: CITATIONS };
}

module.exports = { cushingScreening, adrenalInsufficiency, CITATIONS, ValidationError };