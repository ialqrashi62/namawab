'use strict';
// TIER4_OBGYN-107 Menopause & Hormone Therapy
const CITATIONS = [
  { id: 'NAMS-2022', source: 'North American Menopause Society Position Statement', year: 2022 }
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
function hormoneTherapyEligibility(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const menopause_years = ensureNumber(input, 'years_since_menopause', 0, 50);
  const symptoms = Array.isArray(input.symptoms) ? input.symptoms : [];
  const breast_cancer = input.breast_cancer_history === true;
  const vte = input.vte_history === true;
  const cad = input.cad_history === true;
  const stroke = input.stroke_history === true;
  const uterine = ensureEnum(input, 'uterine_status', ['intact', 'hysterectomy', 'unknown']);
  const window = age < 60 && menopause_years < 10;
  const eligible = window && !breast_cancer && !vte && !cad && !stroke;
  const therapy = eligible ? (uterine === 'intact' ? 'MHT_oral_transdermal_estrogen_plus_progestin' : 'MHT_estrogen_only') : 'non_hormonal_alternative';
  return {
    module: 'tier4_obgyn_107_mht',
    patient_id: patientId,
    age,
    years_since_menopause: menopause_years,
    symptoms,
    eligible,
    therapy,
    non_hormonal: 'ssri_snri_gabapentin_fezolinetant_lifestyle',
    citations: CITATIONS
  };
}
function boneHealthScreening(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const family_history = input.family_history_osteoporosis === true;
  const fragility_fracture = input.fracture_history === true;
  const on_steroid = input.glucocorticoid_use === true;
  const dexa_t = ensureNumber(input, 'dexa_t_score', -5, 5);
  const screening_required = age >= 65 || (age >= 50 && (fragility_fracture || on_steroid || family_history));
  const diagnosis = dexa_t <= -2.5 ? 'osteoporosis' : (dexa_t <= -1 ? 'osteopenia' : 'normal_bmd');
  const therapy = {
    osteoporosis: 'bisphosphonate_alendronate_70mg_wk_plus_calcium_1200mg_vitamin_d_1000iu',
    osteopenia: 'lifestyle_factor_calcium_vitamin_d_recheck_2_year',
    fracture_prevention: 'consider_antiresorptive_teriparatide'
  };
  return {
    module: 'tier4_obgyn_107_bone',
    patient_id: patientId,
    age,
    dexa_t_score: dexa_t,
    diagnosis,
    therapy: therapy[diagnosis],
    citations: CITATIONS
  };
}
module.exports = {
  hormoneTherapyEligibility,
  boneHealthScreening,
  CITATIONS,
  ValidationError
};
