'use strict';
// TIER4_OBGYN-101 High Risk Pregnancy
const CITATIONS = [
  { id: 'SMFM-2024', source: 'Society Maternal Fetal Medicine', year: 2024 },
  { id: 'ACOG-PB-2024', source: 'ACOG Practice Bulletins', year: 2024 }
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
function preeclampsiaAssessment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const dbp = ensureNumber(input, 'dbp', 0, 200);
  const proteinuria = ensureEnum(input, 'proteinuria', ['none', 'dipstick_1plus', 'dipstick_2plus', 'pc_ratio_0_3', 'pc_ratio_3_5', 'pc_ratio_greater_5']);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const platelets = ensureNumber(input, 'platelets', 0, 1000);
  const ast = ensureNumber(input, 'ast', 0, 1000);
  const creatinine = ensureNumber(input, 'creatinine', 0, 10);
  const ldh = ensureNumber(input, 'ldh', 0, 5000);
  const severe_features = sbp >= 160 || dbp >= 110 || platelets < 100 || ast > 70 || creatinine > 1.1 || ldh > 600;
  const diagnosis = (sbp >= 140 || dbp >= 90) && (proteinuria !== 'none' || severe_features) ?
    (severe_features ? 'severe_preeclampsia' : 'preeclampsia') : 'hypertension_gestational_or_unrelated';
  const therapy = {
    delivery: severe_features && ga_weeks >= 34 ? 'recommend_delivery_after_corticosteroids_below_34' : 'expectant_mgmt_below_34',
    magnesium: severe_features || ga_weeks >= 32 ? 'magnesium_sulfate_4g_iv_loading_then_1g_h_seizure_prophylaxis' : 'not_indicated',
    antihypertensive: severe_features ? 'labetalol_20mg_iv_or_hydralazine_10mg_iv_then_oral_aldomet_500mg' : 'aldomet_250mg_bid_titrate',
    betamethasone: ga_weeks >= 24 && ga_weeks < 34 ? 'two_doses_12mg_im_24h_apart' : 'not_indicated'
  };
  return {
    module: 'tier4_obgyn_101_preeclampsia',
    patient_id: patientId,
    sbp,
    dbp,
    proteinuria,
    platelet_count: platelets,
    ast,
    creatinine,
    severe_features,
    diagnosis,
    therapy,
    citatons: CITATIONS
  };
}
function gestationalDiabetes(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ogtt_0 = ensureNumber(input, 'ogtt_fasting', 0, 300);
  const ogtt_1 = ensureNumber(input, 'ogtt_1h', 0, 400);
  const ogtt_2 = ensureNumber(input, 'ogtt_2h', 0, 400);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const gdm = ogtt_0 >= 92 || ogtt_1 >= 180 || ogtt_2 >= 153;
  const therapy = {
    diet: 'carbohydrate_distributed_15g_3meals_3snacks',
    exercise: 'moderate_30_min_5_days_walking',
    monitoring: 'self_blood_glucose_fasting_postprandial',
    insulin: 'initiate_if_fasting_greater_95_or_2h_postprandial_greater_120',
    metformin: 'consider_if_insulin_resistant_oral_alternative'
  };
  return {
    module: 'tier4_obgyn_101_gdm',
    patient_id: patientId,
    gdm,
    labs: { ogtt_fasting: ogtt_0, ogtt_1h: ogtt_1, ogtt_2h: ogtt_2 },
    bmi,
    therapy,
    follow_up: 'postpartum_75g_ogtt_6_to_12_weeks_lifelong_biannual_a1c',
    citations: CITATIONS
  };
}
function cervicalInsufficiency(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const prior_preterm = ensureNumber(input, 'prior_preterm_count', 0, 20);
  const cervical_length_mm = ensureNumber(input, 'cervical_length_mm', 0, 60);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const prior_loss = input.prior_second_trimester_loss === true;
  const short_cervix = cervical_length_mm < 25 && ga_weeks < 24;
  const cerclage_indicated = short_cervix && (prior_preterm >= 1 || prior_loss);
  return {
    module: 'tier4_obgyn_101_cervical',
    patient_id: patientId,
    cervical_length_mm,
    ga_weeks,
    short_cervix,
    cerclage_indicated,
    therapy: {
      cerclage: cerclage_indicated ? 'transvaginal_mcdonald_14_to_24_weeks' : 'not_indicated',
      progesterone: short_cervix ? 'vaginal_progesterone_200mg_d_supplement' : 'consider_if_history',
      modification: 'pelvic_rest_avoid_heavy_lifting'
    },
    citations: CITATIONS
  };
}
function multipleGestation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const chorionicity = ensureEnum(input, 'chorionicity', ['monochorionic_diamniotic', 'dichorionic_diamniotic', 'monochorionic_monoamniotic', 'trichorionic', 'triamniotic']);
  const ga_weeks = ensureNumber(input, 'gestational_age_weeks', 0, 45);
  const sids_risk = chorionicity === 'monochorionic_monoamniotic' ? 'elevated_cord_accident_inpatient_28w' : 'standard';
  const delivery_recommendation = {
    monochorionic_monoamniotic: '32_to_34_weeks_inpatient',
    monochorionic_diamniotic: '36_to_37_weeks',
    dichorionic_diamniotic: '37_to_38_weeks',
    trichorionic: '37_to_38_weeks',
    triamniotic: 'individualized'
  };
  return {
    module: 'tier4_obgyn_101_twins',
    patient_id: patientId,
    chorionicity,
    delivery_recommendation: delivery_recommendation[chorionicity],
    monitoring: {
      ultrasound_q2wk: chorionicity.includes('monochorionic'),
      ttts_screening: chorionicity === 'monochorionic_diamniotic',
      mcda_inpatient: chorionicity === 'monochorionic_monoamniotic'
    },
    citations: CITATIONS
  };
}
module.exports = {
  preeclampsiaAssessment,
  gestationalDiabetes,
  cervicalInsufficiency,
  multipleGestation,
  CITATIONS,
  ValidationError
};
