'use strict';
// TIER4_PEDS-106 Pediatric GI
// Constipation, GER, celiac, IBD, FTT
const CITATIONS = [
  { id: 'NASPGHAN-2024', source: 'North American Society Pediatric GI', year: 2024 },
  { id: 'ESPGHAN-Celiac', source: 'ESPGHAN - Celiac', year: 2024 }
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
function pediatricConstipation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const stool_frequency = ensureNumber(input, 'stool_per_week', 0, 30);
  const painful = input.painful_defecation === true;
  const encopresis = input.encopresis === true;
  const withholding = input.stool_withholding_posture === true;
  const duration_weeks = ensureNumber(input, 'duration_weeks', 0, 260);
  const red_flags = {
    blood_in_stool: input.blood_in_stool === true,
    weight_loss: input.weight_loss === true,
    vomiting: input.vomiting_bilious === true,
    delayed_meconium: input.delayed_meconium_48h === true
  };
  const has_red_flag = red_flags.blood_in_stool || red_flags.weight_loss || red_flags.vomiting || red_flags.delayed_meconium;
  const diagnosis = has_red_flag ? 'organic_pathology_require_workup' : 'functional_constipation';
  const therapy = {
    disimpaction: 'PEG_3350_1_to_1.5g_kg_d_max_100g_3_to_6_days',
    maintenance: 'PEG_3350_0.4_to_0.8g_kg_d_long_term',
    behavioral: 'sitting_toilet_after_meal_rewards',
    diet: 'adequate_fiber_fluid',
    red_flag_workup: has_red_flag ? 'plain_xr_labs_thyroid_celiac_refer_pediatric_gi' : 'not_indicated'
  };
  return {
    module: 'tier4_peds_106_constipation',
    patient_id: patientId,
    diagnosis,
    red_flags,
    therapy,
    citations: CITATIONS
  };
}
function pediatricCeliacScreening(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ttg_iga = ensureNumber(input, 'ttg_iga_u_ml', 0, 500);
  const total_iga = ensureNumber(input, 'total_iga', 0, 1000);
  const ema_pos = input.ema_positive === true;
  const symptoms = Array.isArray(input.symptoms) ? input.symptoms : [];
  const low_iga = total_iga < 70;
  const positive = ttg_iga >= 10 || ema_pos;
  const diagnosis = low_iga ? 'igA_deficiency_test_IgG_based' : (positive ? 'celiac_likely_biopsy_confirm' : 'unrelated');
  return {
    module: 'tier4_peds_106_celiac',
    patient_id: patientId,
    ttg_iga,
    total_iga,
    ema_pos,
    diagnosis,
    next_step: positive ? 'endoscopy_duodenal_biopsy' : 'monitor_repeat_if_symptoms',
    citations: CITATIONS
  };
}
module.exports = {
  pediatricConstipation,
  pediatricCeliacScreening,
  CITATIONS,
  ValidationError
};
