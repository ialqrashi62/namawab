'use strict';
// TIER4_NEPH-101 Chronic Kidney Disease staging + management
const CITATIONS = [
  { id: 'KDIGO-2024', source: 'KDIGO Clinical Practice Guideline CKD', year: 2024 }
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
function ckdStaging(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const gfr = ensureNumber(input, 'egfr', 0, 200);
  const uacr = ensureNumber(input, 'uacr_mg_g', 0, 30000);
  let g_stage = 'g1';
  if (gfr < 15) g_stage = 'g5';
  else if (gfr < 30) g_stage = 'g4';
  else if (gfr < 60) g_stage = 'g3';
  else if (gfr < 90) g_stage = 'g2';
  let a_stage = 'a1';
  if (uacr >= 300) a_stage = 'a3';
  else if (uacr >= 30) a_stage = 'a2';
  const risk = (g_stage === 'g4' || g_stage === 'g5' || a_stage === 'a3') ? 'high' :
    (g_stage === 'g3' || a_stage === 'a2') ? 'moderate' : 'low';
  const therapy = (risk === 'high') ? 'nephrology_refer_ras_blocker_renal_replacement_planning' :
    (risk === 'moderate') ? 'nephrology_refer_ras_blocker_bp_target' :
    'primary_care_optimize_bp_egfr_recheck_12mo';
  return {
    module: 'tier4_neph_101_ckd',
    patient_id: patientId,
    egfr: gfr,
    uacr_mg_g: uacr,
    g_stage,
    a_stage,
    risk,
    therapy,
    monitoring: 'q3mo_egfr_uacr_labs',
    citations: CITATIONS
  };
}
function ackdProgression(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const egfr_now = ensureNumber(input, 'egfr_now', 0, 200);
  const egfr_prior = ensureNumber(input, 'egfr_prior', 0, 200);
  const slope = ((egfr_now - egfr_prior) / 12);
  const rapid = (slope <= -5) ? 'rapid_decline' :
    (slope <= -2) ? 'moderate_decline' : 'stable';
  const therapy = (rapid === 'rapid_decline') ? 'nephrology_urgent_referral_review_cause' :
    (rapid === 'moderate_decline') ? 'optimize_ras_blocker_bp_diabetes_lipid' : 'continue_optimization';
  return {
    module: 'tier4_neph_101_progression',
    patient_id: patientId,
    egfr_now,
    egfr_prior,
    slope_per_year: slope.toFixed(2),
    rapid_decline: rapid,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  ckdStaging,
  ackdProgression,
  CITATIONS,
  ValidationError
};