'use strict';
// TIER4_PALL-104 Symptom Management (dyspnea, delirium, nausea)
const CITATIONS = [
  { id: 'NCCN-Palliative-2024', source: 'NCCN Symptom Management', year: 2024 }
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
function dyspnea(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const nrs = ensureNumber(input, 'dyspnea_nrs_0_10', 0, 10);
  const spo2 = ensureNumber(input, 'spo2_pct', 0, 100);
  const etiology = ensureEnum(input, 'etiology', ['copd', 'chf', 'cancer', 'pneumonia', 'pulmonary_embolism', 'anemia', 'anxiety', 'mixed', 'unknown', 'other']);
  const opioid_naive = input.opioid_naive === true;
  const therapy = (nrs >= 7 && spo2 < 88) ? 'opioid_morphine_then_oxygen_then_consider_venturi' :
    (nrs >= 4 && opioid_naive) ? 'low_dose_morphine_then_review_with_oxygen' :
    (nrs >= 4) ? 'opioid_optimize_then_oxygen_then_consider_noninvasive' :
    (nrs >= 2) ? 'fan_positioning_then_oxygen_then_review' :
    'observation_q1h_recheck';
  return {
    module: 'tier4_pall_104_dyspnea',
    patient_id: patientId,
    dyspnea_nrs_0_10: nrs,
    spo2_pct: spo2,
    etiology,
    opioid_naive,
    therapy,
    monitoring: 'q1h_until_below_4_then_q4h',
    citations: CITATIONS
  };
}
function palliativeNausea(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const etiology = ensureEnum(input, 'etiology', ['chemotherapy', 'bowel_obstruction', 'metabolic', 'vestibular', 'increased_icp', 'medication', 'other', 'unknown']);
  const nrs = ensureNumber(input, 'nausea_nrs_0_10', 0, 10);
  const therapy = (etiology === 'chemotherapy') ? 'ondansetron_then_dexamethasone_then_review' :
    (etiology === 'bowel_obstruction') ? 'octreotide_then_haldol_then_review' :
    (etiology === 'vestibular') ? 'meclizine_or_scopolamine_then_review' :
    (etiology === 'metabolic') ? 'correct_underlying_then_ondansetron_then_review' :
    'ondansetron_then_dexamethasone_then_review';
  return {
    module: 'tier4_pall_104_nausea',
    patient_id: patientId,
    etiology,
    nausea_nrs_0_10: nrs,
    therapy,
    monitoring: 'q1h_until_below_3_then_q4h',
    citations: CITATIONS
  };
}
module.exports = {
  dyspnea,
  palliativeNausea,
  CITATIONS,
  ValidationError
};