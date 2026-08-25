'use strict';
// TIER4_DERM-101 Acne & Rosacea
const CITATIONS = [
  { id: 'AAD-Acne-2024', source: 'American Academy Dermatology - Acne Management', year: 2024 },
  { id: 'NRSF-2024', source: 'National Rosacea Society', year: 2024 }
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
function acneSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lesion_count = {
    comedones: ensureNumber(input, 'comedones', 0, 500),
    papules: ensureNumber(input, 'papules', 0, 500),
    pustules: ensureNumber(input, 'pustules', 0, 500),
    nodules: ensureNumber(input, 'nodules', 0, 100),
    cysts: ensureNumber(input, 'cysts', 0, 100)
  };
  const scarring = input.scarring === true;
  const truncal = input.truncal_involvement === true;
  const ihs_count = lesion_count.nodules + lesion_count.cysts;
  const severity = ihs_count > 0 ? 'severe_nodulocystic'
    : ((lesion_count.pustules + lesion_count.papules > 20 || truncal) ? 'moderate_inflammatory'
    : (lesion_count.papules > 5 ? 'mild_moderate' : 'mild_comedonal'));
  const therapy = {
    mild_comedonal: 'topical_retinoid_tretinoin_0.025_percent_plus_benzoyl_peroxide_2_5',
    mild_moderate: 'topical_retinoid_plus_bp_plus_topical_antibiotic_clindamycin_3_months',
    moderate_inflammatory: 'oral_antibiotic_doxycycline_100mg_bid_3_to_4_months_plus_topical',
    severe_nodulocystic: 'oral_isotretinoin_0.5_to_1mg_kg_d_aim_cumulative_120_to_150mg_kg',
    hormonal_female: 'spironolactone_100mg_d_or_combined_ocp',
    scarring_intervention: 'intralesional_triamcinolone_chemical_peel_laser'
  };
  return {
    module: 'tier4_derm_101_acne',
    patient_id: patientId,
    severity,
    lesion_count,
    scarring,
    therapy: therapy[severity],
    monitoring: { q_month_8_weeks: true, photographs_baseline_q8wk: scarring, pregnancy_test_preiso: severity === 'severe_nodulocystic' },
    citations: CITATIONS
  };
}
function rosaceaClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const erythematotelangiectatic = input.erythematotelangiectatic === true;
  const papulopustular = input.papulopustular === true;
  const phymatous = input.phymatous === true;
  const ocular = input.ocular === true;
  const subtype = erythematotelangiectatic ? 'ETR'
    : (phymatous ? 'phymatous' : (papulopustular ? 'papulopustular' : 'unknown'));
  const therapy = {
    ETR: 'metronidazole_0.75_topical_bid_plus_ivermectin_1_cream_daily',
    papulopustular: 'metronidazole_ivermectin_topical_plus_oral_doxy_40mg_modified_release',
    phymatous: 'isotretinoin_low_dose_0.3mg_kg_plus_laser_ablation',
    ocular: 'warm_compress_cyclosporine_0_05_drops_ocular_doxy_ent'
  };
  return {
    module: 'tier4_derm_101_rosacea',
    patient_id: patientId,
    subtype,
    ocular_involvement: ocular,
    therapy,
    trigger_avoidance: ['alcohol', 'spicy', 'heat', 'extreme_cold', 'stress', 'topical_steroid'],
    citations: CITATIONS
  };
}
function isotretinoinSafety(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const female = input.female === true;
  const pregnancy_test = input.pregnancy_test_negative === true;
  const lfts = ensureNumber(input, 'alt', 0, 1000);
  const tg = ensureNumber(input, 'triglycerides', 0, 2000);
  const lipids = ensureNumber(input, 'cholesterol_total', 0, 500);
  const mood_score = ensureNumber(input, 'phq9_score', 0, 27);
  const eligible = (!female || (female && pregnancy_test)) && lfts < 200 && tg < 500 && mood_score < 15;
  const monitoring = {
    labs_baseline: 'cbc_lfts_lipids_fasting',
    pregnancy_q_month: female,
    mood_assessment: 'phq9_each_visit',
    teratogenicity_counseling: 'ipledge_program_if_female'
  };
  return {
    module: 'tier4_derm_101_isotretinoin',
    patient_id: patientId,
    eligible_to_start: eligible,
    dose: '0.5mg_kg_d_target_cumulative_120_to_150mg_kg',
    monitoring,
    citations: CITATIONS
  };
}
function hormonalAcne(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 60);
  const menstrual_irregular = input.menstrual_irregular === true;
  const hirsutism = input.hirsutism === true;
  const dhea = ensureNumber(input, 'dhea_s_ug_dl', 0, 1000);
  const total_testosterone = ensureNumber(input, 'total_testosterone_ng_dl', 0, 200);
  const pcos_suspected = menstrual_irregular && (hirsutism || total_testosterone > 60 || dhea > 400);
  return {
    module: 'tier4_derm_101_hormonal',
    patient_id: patientId,
    age,
    pcos_suspected,
    labs: { dhea, total_testosterone },
    therapy: pcos_suspected ? 'spironolactone_100mg_d_plus_ocp_or_glp1_weight' : 'topical_retinoid_bp',
    referral: pcos_suspected ? 'endocrinology_gyn' : 'derm_followup',
    citations: CITATIONS
  };
}
module.exports = {
  acneSeverity,
  rosaceaClassification,
  isotretinoinSafety,
  hormonalAcne,
  CITATIONS,
  ValidationError
};
