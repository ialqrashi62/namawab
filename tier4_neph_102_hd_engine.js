'use strict';
// TIER4_NEPH-102 Hemodialysis
const CITATIONS = [
  { id: 'KDOQI-2024', source: 'KDOQI Hemodialysis Adequacy', year: 2024 }
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
function hdAdequacy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const spktv = ensureNumber(input, 'sp_kt_v', 0, 5);
  const urr = ensureNumber(input, 'urr_pct', 0, 100);
  const sessions_wk = ensureNumber(input, 'sessions_per_week', 0, 7);
  const adequate = (spktv >= 1.2 && urr >= 65 && sessions_wk >= 3) ? 'meeting_target' :
    (spktv >= 1.0 && urr >= 55) ? 'suboptimal_review' : 'inadequate_optimize';
  const plan = (adequate === 'meeting_target') ? 'continue_current_regimen_q3mo_review' :
    (adequate === 'suboptimal_review') ? 'consider_extended_time_or_hdf' :
    'increase_time_or_frequency_review_access_flow';
  return {
    module: 'tier4_neph_102_hd_adequacy',
    patient_id: patientId,
    sp_kt_v: spktv,
    urr_pct: urr,
    sessions_per_week: sessions_wk,
    adequate,
    plan,
    citations: CITATIONS
  };
}
function vascularAccess(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'access_type', ['avf', 'avg', 'tunneled_catheter', 'non_tunneled_catheter']);
  const qa = ensureNumber(input, 'qa_ml_min', 0, 5000);
  const recirculation = ensureNumber(input, 'recirculation_pct', 0, 100);
  const complications = ensureEnum(input, 'complications', ['none', 'stenosis', 'thrombosis', 'infection', 'aneurysm', 'steal', 'other']);
  const plan = (type === 'avf' && qa >= 500 && recirculation < 10 && complications === 'none') ? 'avf_optimal_continue' :
    (complications !== 'none') ? 'interventional_repair_or_revision' :
    (type === 'tunneled_catheter') ? 'transition_to_avf_or_avg' :
    'monitor_q_monthly';
  return {
    module: 'tier4_neph_102_access',
    patient_id: patientId,
    access_type: type,
    qa_ml_min: qa,
    recirculation_pct: recirculation,
    complications,
    plan,
    monitoring: 'q1mo_access_review_q3mo_imaging',
    citations: CITATIONS
  };
}
function intradialyticHypotension(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sbp_pre = ensureNumber(input, 'sbp_pre', 0, 300);
  const sbp_nadir = ensureNumber(input, 'sbp_nadir', 0, 300);
  const drop = sbp_pre - sbp_nadir;
  const episode = ensureEnum(input, 'episode_type', ['isolated', 'recurrent', 'symptomatic_cramping', 'syncope', 'none']);
  const therapy = (episode === 'syncope' || drop >= 30) ? 'ultrafiltration_adjustment_cold_dialysate_midodrine' :
    (episode === 'symptomatic_cramping' || episode === 'recurrent') ? 'reduce_uf_rate_then_assess_dry_weight' :
    'monitor_only';
  return {
    module: 'tier4_neph_102_idh',
    patient_id: patientId,
    sbp_pre,
    sbp_nadir,
    drop_mmhg: drop,
    episode_type: episode,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  hdAdequacy,
  vascularAccess,
  intradialyticHypotension,
  CITATIONS,
  ValidationError
};