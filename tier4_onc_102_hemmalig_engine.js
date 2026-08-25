'use strict';
// TIER4_ONC-102 Hematologic Malignancy
const CITATIONS = [
  { id: 'NCCN-Lymphoma-2024', source: 'NCCN Lymphoma', year: 2024 },
  { id: 'NCCN-Leukemia-2024', source: 'NCCN Leukemia', year: 2024 }
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
function lymphomaStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['dlbcl', 'follicular', 'mantle_cell', 'hodgkin', 'burkitt', 'marginal_zone', 't_cell', 'other']);
  const stage = ensureEnum(input, 'ann_arbor_stage', ['i', 'ii', 'iii', 'iv']);
  const bulky = input.bulky_disease === true;
  const b_symptoms = input.b_symptoms === true;
  const ipi_score = ensureNumber(input, 'ipi_score', 0, 5);
  const therapy = (subtype === 'dlbcl' && stage === 'iv') ? 'r_chop_or_pola_r_chp_6_cycles' :
    (subtype === 'dlbcl' && (stage === 'i' || stage === 'ii') && !bulky) ? 'r_chop_3_to_4_cycles_then_rt' :
    (subtype === 'follicular' && ipi_score <= 1) ? 'rituximab_induction_then_maintenance' :
    (subtype === 'hodgkin') ? 'aavd_or_abvd_then_review' :
    'subtype_specific_protocol';
  return {
    module: 'tier4_onc_102_lymphoma',
    patient_id: patientId,
    subtype,
    stage,
    bulky,
    b_symptoms,
    ipi_score,
    therapy,
    monitoring: 'q2cycle_imaging_q3mo_post_then_q6mo',
    citations: CITATIONS
  };
}
function myelomaStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const beta2m = ensureNumber(input, 'beta2_microglobulin', 0, 50);
  const albumin = ensureNumber(input, 'serum_albumin', 0, 6);
  const fish = ensureEnum(input, 'high_risk_fish', ['t_4_14', 't_14_16', 't_14_20', 'del_17p', 'gain_1q21', 'negative', 'not_tested']);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const stage = (beta2m < 3.5 && albumin >= 3.5) ? 'stage_1' : (beta2m < 5.5) ? 'stage_2' : 'stage_3';
  const therapy = (fish === 'negative' || fish === 'not_tested') ? 'rvd_then_review_maintenance' :
    (fish === 'del_17p') ? 'dvd_or_kpd_then_review' :
    'rvd_then_car_filgo_review';
  return {
    module: 'tier4_onc_102_mm',
    patient_id: patientId,
    beta2_microglobulin: beta2m,
    serum_albumin: albumin,
    high_risk_fish: fish,
    crp,
    riss_stage: stage,
    therapy,
    monitoring: 'q1mo_spep_q3mo_bone_marrow_q1y_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  lymphomaStaging,
  myelomaStaging,
  CITATIONS,
  ValidationError
};