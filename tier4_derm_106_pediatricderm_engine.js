'use strict';
// TIER4_DERM-106 Pediatric Dermatology
const CITATIONS = [
  { id: 'AAD-Peds-2024', source: 'AAD Pediatric Dermatology', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function hemangiomaInfancy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_months = ensureNumber(input, 'age_months', 0, 60);
  const location = ensureEnum(input, 'location', ['face_periorbital', 'face_central', 'lip', 'perineal', 'extremity', 'trunk']);
  const size_cm = ensureNumber(input, 'size_cm', 0, 30);
  const ulceration = input.ulceration === true;
  const airway = input.airway_involvement === true;
  const phace = input.phace_syndrome === true;
  const liver_inv = input.liver_involvement === true;
  const high_risk = ['face_periorbital', 'lip', 'perineal'].includes(location) || airway || phace || liver_inv || size_cm >= 5 || ulceration;
  const therapy = {
    topical: 'timolol_maleate_0_5_gel_for_small_superficial',
    systemic: 'oral_propranolol_2_to_3_mg_kg_d_divided_2_doses_for_high_risk',
    duration: 'continue_until_involution_typically_6_to_12_months',
    monitoring: 'cardiac_exam_baseline_then_q_review_bp_hr',
    rebound_watch: 'slow_taper_to_avoid_rebound'
  };
  return {
    module: 'tier4_derm_106_hemangioma',
    patient_id: patientId,
    high_risk,
    therapy: high_risk ? therapy.systemic : therapy.topical,
    phace,
    liver_inv,
    citations: CITATIONS
  };
}
function atopicEczemaInfant(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_months = ensureNumber(input, 'age_months', 0, 36);
  const bsa = ensureNumber(input, 'bsa_pct', 0, 100);
  const sleep_loss = input.sleep_loss_hour_per_night === true;
  const infection = input.secondary_infection === true;
  const food_allergy = input.food_allergy === true;
  const severity = bsa >= 30 ? 'severe'
    : bsa >= 10 ? 'moderate' : 'mild';
  const therapy = {
    mild: 'topical_low_potency_steroid_hydrocortisone_2_5_bid_plus_emollient',
    moderate: 'topical_intermediate_potency_then_pimecrolimus_face_mild_topical_bleach_bath',
    severe: 'topical_then_dupilumab_age_6_months_approved',
    bleeding: 'bleach_bath_1_2_cup_per_40g_then_antibiotic_if_signs',
    food_allergy: 'test_then_avoid_or_advance_introduction'
  };
  const pick = severity === 'severe' ? 'severe' : (severity === 'moderate' ? 'moderate' : 'mild');
  return {
    module: 'tier4_derm_106_eczema',
    patient_id: patientId,
    age_months,
    severity,
    therapy: therapy[pick],
    secondary_infection: infection,
    food_allergy_workup: food_allergy,
    citations: CITATIONS
  };
}
function geneticSkinDisorder(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const family_history = input.family_history === true;
  const consanguinity = input.consanguinity === true;
  const syndrome = ensureEnum(input, 'syndrome', ['epidermolysis_bullosa', 'ichthyosis', 'ectodermal_dysplasia', 'tuberous_sclerosis', 'neurofibromatosis', 'xeroderma_pigmentosum', 'goldenhar', 'none']);
  const diagnosis = {
    epidermolysis_bullosa: 'fragile_skin_acral_blister_subtype_simplex_junctional_dystrophic',
    ichthyosis: 'scaling_fish_scale_harlequin_or_lamellar_or_x_linked',
    ectodermal_dysplasia: 'hypodontia_hypohidrosis_sparse_hair',
    tuberous_sclerosis: 'ash_leaf_macules_angiofibromas_cortical_tubers',
    neurofibromatosis: 'cafe_au_lait_axillary_freckling_neurofibroma',
    xeroderma_pigmentosum: 'sun_sensitivity_freckling_skin_cancer_early',
    goldenhar: 'hemifacial_microsomia_preauricular_skin_tags',
    none: 'clinical_review_no_specific_syndrome_yet'
  };
  const referral = syndrome === 'none' ? 'pediatric_dermatology_genetics' : 'pediatric_dermatology_plus_specialist_referral';
  return {
    module: 'tier4_derm_106_genetic',
    patient_id: patientId,
    syndrome,
    diagnosis_detail: diagnosis[syndrome],
    family_history,
    consanguinity,
    referral,
    citations: CITATIONS
  };
}
module.exports = {
  hemangiomaInfancy,
  atopicEczemaInfant,
  geneticSkinDisorder,
  CITATIONS,
  ValidationError
};
