'use strict';
// TIER4_HEM-108 Transfusion Medicine
const CITATIONS = [
  { id: 'AABB-Transfusion-2024', source: 'AABB Standards for Blood Bank', year: 2024 }
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
function prbcTransfusion(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const hgb = ensureNumber(input, 'hgb_g_dl', 0, 25);
  const symptomatic = input.symptomatic_anemia === true;
  const stable = input.hemodynamically_stable === true;
  const threshold = (symptomatic || !stable) ? 7.0 : 7.5;
  const decision = (hgb < threshold) ? 'transfuse_1_unit_then_reassess' :
    (symptomatic) ? 'consider_1_unit_then_reassess_continue_review' :
    'no_transfusion_reassess';
  return {
    module: 'tier4_hem_108_prbc',
    patient_id: patientId,
    hgb_g_dl: hgb,
    symptomatic_anemia: symptomatic,
    hemodynamically_stable: stable,
    threshold,
    decision,
    monitoring: 'q1h_during_then_q4h_post_24h',
    citations: CITATIONS
  };
}
function pltTransfusion(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const plt = ensureNumber(input, 'platelet_count', 0, 500);
  const procedure = ensureEnum(input, 'procedure', ['no_procedure', 'central_line', 'lumbar_puncture', 'epidural', 'major_surgery', 'neurosurgery', 'endoscopy_biopsy']);
  const bleeding = input.bleeding === true;
  const threshold = (procedure === 'no_procedure') ? 10 : (procedure === 'central_line') ? 20 :
    (procedure === 'lumbar_puncture' || procedure === 'epidural') ? 50 :
    (procedure === 'major_surgery' || procedure === 'neurosurgery') ? 100 : 50;
  const decision = (bleeding && plt < 50) ? 'transfuse_then_reassess' :
    (plt < threshold) ? 'transfuse_prophylactic_then_recheck' :
    'no_transfusion_reassess';
  return {
    module: 'tier4_hem_108_plt',
    patient_id: patientId,
    platelet_count: plt,
    procedure,
    bleeding,
    threshold,
    decision,
    monitoring: 'q1h_during_q4h_post_24h',
    citations: CITATIONS
  };
}
module.exports = {
  prbcTransfusion,
  pltTransfusion,
  CITATIONS,
  ValidationError
};