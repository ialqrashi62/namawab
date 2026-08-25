/**
 * TIER3_ENDO-304 Pituitary Disease Engine
 * Acromegaly screen + hyperprolactinemia workup + SIADH/DI differentiation + hypopituitarism + pituitary MRI
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ENDO_ACRO: 'Endocrine Society Acromegaly 2014', ENDO_PROL: 'Endocrine Society Prolactin 2011' };

function acromegalyScreen(input) {
  const { ifg_1, ogtt_growth_hormone_nadir, age, facial_features_changes, ring_size_change, shoe_size_change } = input;
  const positive = ifg_1 >= 1 && ogtt_growth_hormone_nadir >= 0.4;
  return {
    ifg_1: Math.round(ifg_1 * 100) / 100,
    ogtt_growth_hormone_nadir,
    screen_positive: positive,
    pituitary_mri_indicated: positive,
    symptomatic_indicators: { facial_features_changes, ring_size_change, shoe_size_change },
    treatment: positive ? 'transsphenoidal_surgery_first_line' : 'reassess_if_high_suspicion',
    citation: CITATIONS.ENDO_ACRO,
  };
}

function hyperprolactinemiaWorkup(input) {
  const { prolactin, symptoms, on_dopamine_antagonists, tsh, pregnancy_test, macroprolactin_check, mri_pituitary } = input;
  let etiology = 'unclear';
  if (pregnancy_test === 'positive') etiology = 'pregnancy';
  else if (on_dopamine_antagonists) etiology = 'medication_induced';
  else if (prolactin >= 200) etiology = 'likely_macroprolactinoma_or_mixed_tumor';
  else if (prolactin >= 100 && prolactin < 200) etiology = 'consider_microprolactinoma';
  else if (prolactin >= 25 && prolactin < 100) etiology = 'stress_other_drugs_idiopathic';
  else if (prolactin < 25) etiology = 'macroadenoma_with_stalk_effect_if_symptomatic';
  return {
    prolactin, etiology,
    mri_indicated: prolactin >= 100 || symptoms === 'galactorrhea_or_amenorrhea' || macroprolactin_check === 'no_macroprolactin',
    treatment: etiology === 'likely_macroprolactinoma_or_mixed_tumor' ? 'cabergoline_0.5mg_BID' : 'address_underlying_cause',
    citation: CITATIONS.ENDO_PROL,
  };
}

function siadhVsDiabetes(input) {
  const { sodium, plasma_osm, urine_osm, urine_sodium_24h, volume_status, polyuria, polydipsia } = input;
  const siadh_likely = sodium < 135 && plasma_osm < 280 && urine_osm > 100 && urine_sodium_24h > 30 && volume_status === 'euvolemic';
  const diabetes_insipidus_likely = polyuria && polydipsia && sodium > 145 && plasma_osm > 295 && urine_osm < 300;
  return {
    sodium, plasma_osm, urine_osm,
    siadh_likely, diabetes_insipidus_likely,
    siadh_treatment: siadh_likely ? ['fluid_restriction_500-1000mL/day', 'hypertonic_saline_if_severe', 'demeclocycline OR tolvaptan'] : 'not_indicated',
    di_treatment: diabetes_insipidus_likely ? ['central: desmopressin_10mcg_IN', 'nephrogenic: thiazide + low-salt + amiloride'] : 'not_indicated',
  };
}

function hypopituitarismAssessment(input) {
  const { cortisol_am, tsh_ft4, lh_fsh_testosterone_or_estrogen, acth, growth_hormone, vasopressin, mri_pituitary } = input;
  const deficiencies = [];
  if (cortisol_am < 3 && acth < 10) deficiencies.push('secondary_adrenal_insufficiency');
  if (tsh < 0.4 && ft4 < 0.8) deficiencies.push('central_hypothyroid');
  if (lh_fsh_testosterone_or_estrogen === 'low_for_age_sex') deficiencies.push('hypogonadotropic_hypogonadism');
  if (growth_hormone === 'low_for_age') deficiencies.push('GH_deficiency');
  if (vasopressin === 'deficient') deficiencies.push('central_diabetes_insipidus');
  return {
    deficiencies,
    mri_indicated: mri_pituitary === 'mass' ? 'yes' : deficiencies.length >= 2 ? 'yes' : 'no',
    treatment: deficiencies.includes('secondary_adrenal_insufficiency') ? 'glucocorticoid_first_then_T4_then_sex_steroids' : 'address_each_deficiency',
  };
}

function pituitaryMriIndication(input) {
  const { visual_field_defect, headaches, hormonal_abnormalities, mri_prior } = input;
  return {
    mri_recommended: visual_field_defect === 'bitemporal_hemianopsia' || headaches === 'new_severe_thunderclap' || hormonal_abnormalities.length >= 2 || mri_prior === 'mass_followup',
    sequence: 'T1_dynamic_contrast_with_coronal_and_sagittal_views',
    followup_interval_months: mri_prior === 'mass_under_1cm' ? 12 : mri_prior === 'mass_1-2cm' ? 6 : 3,
  };
}

module.exports = { acromegalyScreen, hyperprolactinemiaWorkup, siadhVsDiabetes, hypopituitarismAssessment, pituitaryMriIndication, CITATIONS, ValidationError };