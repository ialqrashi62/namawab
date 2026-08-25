'use strict';
// TIER4_RHEUM-101 Rheumatoid Arthritis
const CITATIONS = [
  { id: 'ACR-RA-2024', source: 'ACR/EULAR RA Classification & Management', year: 2024 }
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
function das28Score(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tender = ensureNumber(input, 'tender_joints', 0, 28);
  const swollen = ensureNumber(input, 'swollen_joints', 0, 28);
  const esr = ensureNumber(input, 'esr', 0, 200);
  const pt_global = ensureNumber(input, 'patient_global_0_100', 0, 100);
  const das28 = (0.56 * Math.sqrt(tender)) + (0.28 * Math.sqrt(swollen)) + (0.70 * Math.log(esr)) + (0.014 * pt_global);
  const activity = (das28 < 2.6) ? 'remission' : (das28 < 3.2) ? 'low' : (das28 < 5.1) ? 'moderate' : 'high';
  return {
    module: 'tier4_rheum_101_das28',
    patient_id: patientId,
    tender_joints: tender,
    swollen_joints: swollen,
    esr,
    patient_global_0_100: pt_global,
    das28: das28.toFixed(2),
    activity,
    monitoring: 'q3mo_das28_q6mo_labs_q1y_imaging',
    citations: CITATIONS
  };
}
function treatToTarget(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const activity = ensureEnum(input, 'activity', ['remission', 'low', 'moderate', 'high']);
  const csdmard = input.csdmard === true;
  const bdmard = input.bdmard === true;
  const therapy = (activity === 'high' && csdmard === false) ? 'start_mtx_or_leflunomide_then_review_3mo' :
    (activity === 'moderate' && csdmard === true && bdmard === false) ? 'add_bdmard_tnf_or_jak_or_rituximab' :
    (activity === 'low' || activity === 'remission') ? 'maintain_optimize_treat_to_target' :
    'review_adherence_dose_optimize';
  return {
    module: 'tier4_rheum_101_t2t',
    patient_id: patientId,
    activity,
    csdmard,
    bdmard,
    therapy,
    monitoring: 'q3mo_das28_q6mo_labs_q1y_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  das28Score,
  treatToTarget,
  CITATIONS,
  ValidationError
};