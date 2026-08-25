'use strict';
// TIER4_RARE-108 Marfan Syndrome
const CITATIONS = [
  { id: 'GHENT-2010', source: 'Revised Ghent nosology for Marfan syndrome', year: 2010 },
  { id: 'ACC-AHA-Marfan', source: 'AHA/ACC Thoracic Aortic Disease', year: 2022 }
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
function marfanGhentScore(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const aortic_root_z = ensureNumber(input, 'aortic_root_z_score', -5, 10);
  const ectopia_lentis = input.ectopia_lentis === true;
  const fbn1_pathogenic = input.fbn1_pathogenic === true;
  const systemic_score = ensureNumber(input, 'systemic_score', 0, 20);
  const family_history = input.family_history === true;
  let diagnosis = 'non_marfan';
  if (aortic_root_z >= 2 && (ectopia_lentis || fbn1_pathogenic)) diagnosis = 'marfan';
  else if (systemic_score >= 7 && (ectopia_lentis || fbn1_pathogenic)) diagnosis = 'marfan';
  else if (aortic_root_z >= 3 && family_history) diagnosis = 'marfan';
  else if (aortic_root_z >= 2 && systemic_score >= 5) diagnosis = 'probable';
  return {
    module: 'tier4_rare_108_marfan_ghent',
    patient_id: patientId,
    aortic_root_z,
    ectopia_lentis,
    fbn1_pathogenic,
    systemic_score,
    family_history,
    diagnosis,
    citations: CITATIONS
  };
}
function marfanAorticSurveillance(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const aortic_root_diameter = ensureNumber(input, 'aortic_root_mm', 0, 80);
  const growth_rate_mm_year = ensureNumber(input, 'growth_rate_mm_year', 0, 10);
  const family_history_dissection = input.family_history_dissection === true;
  const on_arb = input.on_arb === true;
  const on_bb = input.on_beta_blocker === true;
  const surgery_threshold = aortic_root_diameter >= 50 ? 'recommend_elective_repair' : 'continue_surveillance';
  const imaging = {
    echo_q6mo: aortic_root_diameter >= 45,
    echo_annual: aortic_root_diameter < 45,
    mra_aorta_q1_to_2y: 'baseline_then_followup_branch_vessels'
  };
  const medical_therapy = {
    arb: on_arb ? 'continue' : 'initiate_losartan_50_to_100mg_daily',
    beta_blocker: on_bb ? 'continue' : 'consider_if_not_contraindicated',
    avoid: ['fluoroquinolones', 'vasoconstrictors_for_sport_ergot']
  };
  if (growth_rate_mm_year >= 5) surgery_threshold = 'URGENT_SURGICAL_CONSULT';
  if (family_history_dissection && aortic_root_diameter >= 45) surgery_threshold = 'LOWER_THRESHOLD_FOR_REPAIR';
  return {
    module: 'tier4_rare_108_marfan_aorta',
    patient_id: patientId,
    aortic_root_diameter,
    growth_rate_mm_year,
    surgery_threshold,
    imaging,
    medical_therapy,
    citations: CITATIONS
  };
}
module.exports = {
  marfanGhentScore,
  marfanAorticSurveillance,
  CITATIONS,
  ValidationError
};
