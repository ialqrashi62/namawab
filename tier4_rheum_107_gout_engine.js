'use strict';
// TIER4_RHEUM-107 Gout & CPPD
const CITATIONS = [
  { id: 'ACR-Gout-2024', source: 'ACR Gout Management', year: 2024 }
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
function goutFlare(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const joint_count = ensureNumber(input, 'joint_count', 0, 50);
  const location = ensureEnum(input, 'location', ['first_mtp', 'knee', 'ankle', 'wrist', 'finger', 'toe', 'multiple']);
  const renal = ensureEnum(input, 'renal_function', ['normal', 'ckd_stage_3', 'ckd_stage_4', 'ckd_stage_5', 'dialysis']);
  const therapy = (renal === 'ckd_stage_5' || renal === 'dialysis') ? 'iv_or_im_steroids_then_review' :
    (joint_count >= 6 || location === 'multiple') ? 'oral_prednisone_or_colchicine_then_nsaid' :
    (renal === 'normal') ? 'nsaid_then_colchicine_then_steroid' :
    'colchicine_then_steroid_review_renal_dose';
  return {
    module: 'tier4_rheum_107_flare',
    patient_id: patientId,
    joint_count,
    location,
    renal_function: renal,
    therapy,
    monitoring: 'q1wk_labs_q2wk_urate_then_q3mo',
    citations: CITATIONS
  };
}
function urateLowering(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const urate = ensureNumber(input, 'urate_mg_dl', 0, 30);
  const tophi = input.tophi_present === true;
  const stones = input.urate_stones === true;
  const target = (tophi || stones) ? 5 : 6;
  const therapy = (urate >= target) ? 'allopurinol_start_50_to_100_then_titrate' :
    'maintain_target_q3mo_labs';
  const prophylaxis = (input.starting_ult) ? 'colchicine_6mo_prophylaxis' : 'continue';
  return {
    module: 'tier4_rheum_107_ult',
    patient_id: patientId,
    urate_mg_dl: urate,
    tophi_present: tophi,
    urate_stones: stones,
    target,
    therapy,
    prophylaxis,
    monitoring: 'q2wk_urate_titrate_q3mo_labs',
    citations: CITATIONS
  };
}
module.exports = {
  goutFlare,
  urateLowering,
  CITATIONS,
  ValidationError
};