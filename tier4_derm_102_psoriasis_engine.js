'use strict';
// TIER4_DERM-102 Psoriasis
const CITATIONS = [
  { id: 'AAD-PSA-2024', source: 'American Academy Dermatology - Psoriasis', year: 2024 },
  { id: 'NICE-CG153', source: 'NICE Psoriasis Assessment', year: 2024 }
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
function psoriasisSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const pasi = ensureNumber(input, 'pasi_score', 0, 72);
  const bsa = ensureNumber(input, 'body_surface_area_pct', 0, 100);
  const dlqi = ensureNumber(input, 'dlqi_score', 0, 30);
  const severe = pasi >= 10 || bsa >= 10 || dlqi >= 10;
  const moderate = !severe && (pasi >= 5 || bsa >= 5 || dlqi >= 6);
  const therapy = severe ? 'biologic_therapy_tnf_il17_il23_il12_23'
    : moderate ? 'phototherapy_narrowband_uvb_or_methotrexate_or_apremilast'
    : 'topical_therapy_corticosteroid_vitamin_d_analog';
  const cardiometabolic = {
    screening: 'lipid_panel_a1c_bp_bmi_psoriasis_independent_risk',
    associated_conditions: ['psoriatic_arthritis', 'obesity', 'diabetes', 'metabolic_syndrome', 'ibd', 'uveitis']
  };
  return {
    module: 'tier4_derm_102_psoriasis',
    patient_id: patientId,
    pasi,
    bsa,
    dlqi,
    severity: severe ? 'severe' : moderate ? 'moderate' : 'mild',
    therapy,
    cardiometabolic,
    citations: CITATIONS
  };
}
function biologicSelection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const pasi = ensureNumber(input, 'pasi_score', 0, 72);
  const tb_positive = input.tb_positive === true;
  const hepatitis = input.hepatitis_b === true;
  const pregnancy = input.pregnant === true;
  const prior_failure = ensureEnum(input, 'prior_failure_class', ['none', 'tnf', 'il17', 'il23', 'methotrexate', 'phototherapy']);
  const cancer_hx = input.malignancy_history === true;
  let first_line = 'TNF_inhibitor_adalimumab_40mg_q2w';
  if (cancer_hx) first_line = 'IL17_IL23_inhibitor_preferred';
  if (tb_positive) first_line = 'tnf_avoid_until_tb_treated_consider_il17_il23';
  if (hepatitis) first_line = 'tnf_avoid_consider_il23';
  if (pregnancy) first_line = 'certolizumab_TNF_safe_in_pregnancy';
  if (prior_failure === 'tnf') first_line = 'IL17_or_IL23_ustekinumab_guselkumab_risankizumab';
  return {
    module: 'tier4_derm_102_biologic',
    patient_id: patientId,
    pasi,
    tb_screening: tb_positive,
    hepatitis_screening: hepatitis,
    pregnancy,
    prior_failure_class: prior_failure,
    first_line,
    monitoring: { tb_q_year: true, lft_q3mo: true, infection_screening: 'baseline_then_5_years' },
    citations: CITATIONS
  };
}
function psoriaticArthritisScreen(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const joint_pain = input.joint_pain === true;
  const swelling = input.joint_swelling === true;
  const morning_stiffness_min = ensureNumber(input, 'morning_stiffness_min', 0, 240);
  const nail_pitting = input.nail_pitting === true;
  const dactylitis = input.dactylitis === true;
  const enthesitis = input.enthesitis === true;
  const caspar_count = (joint_pain ? 1 : 0) + (swelling ? 1 : 0) + (morning_stiffness_min > 30 ? 1 : 0) +
    (nail_pitting ? 1 : 0) + (dactylitis ? 1 : 0) + (enthesitis ? 1 : 0);
  const suspect = caspar_count >= 3;
  return {
    module: 'tier4_derm_102_psa_screen',
    patient_id: patientId,
    suspect_psa: suspect,
    caspar_count,
    next_step: suspect ? 'refer_rheumatology_xr_ultrasound_imaging' : 'observe_q_year',
    citations: CITATIONS
  };
}
module.exports = {
  psoriasisSeverity,
  biologicSelection,
  psoriaticArthritisScreen,
  CITATIONS,
  ValidationError
};
