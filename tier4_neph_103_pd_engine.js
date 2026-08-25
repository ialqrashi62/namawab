'use strict';
// TIER4_NEPH-103 Peritoneal Dialysis
const CITATIONS = [
  { id: 'ISPD-2024', source: 'International Society Peritoneal Dialysis', year: 2024 }
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
function pdAdequacy(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const kt_v = ensureNumber(input, 'weekly_kt_v', 0, 5);
  const crcl = ensureNumber(input, 'crcl_l_wk', 0, 200);
  const modality = ensureEnum(input, 'modality', ['capd', 'apd', 'ccpd', 'ipd']);
  const adequate = (kt_v >= 1.7 || crcl >= 50) ? 'meeting_target' :
    (kt_v >= 1.4 || crcl >= 40) ? 'borderline' : 'inadequate';
  const plan = (adequate === 'meeting_target') ? 'continue_q3mo_review' :
    (adequate === 'borderline') ? 'consider_pdwf_volume_increase' :
    'urgent_review_volume_modality_or_transition';
  return {
    module: 'tier4_neph_103_pd_adequacy',
    patient_id: patientId,
    weekly_kt_v: kt_v,
    crcl_l_wk: crcl,
    modality,
    adequate,
    plan,
    citations: CITATIONS
  };
}
function peritonitisManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cell_count = ensureNumber(input, 'wbc_per_mm3', 0, 50000);
  const differential = ensureEnum(input, 'polymorph_pct', ['lt_50', '50_to_80', 'gt_80']);
  const cloudy = input.cloudy_effluent === true;
  const abdominal_pain = input.abdominal_pain === true;
  const suspected = (cell_count >= 100 && (differential !== 'lt_50' || cloudy)) ? 'suspected_peritonitis' :
    (cell_count >= 100) ? 'borderline_repeat' : 'no_peritonitis';
  const therapy = (suspected === 'suspected_peritonitis') ? 'ip_vanco_then_cefepime_or_ceftazidime_21d' :
    (suspected === 'borderline_repeat') ? 'repeat_dialysate_culture_24h' : 'no_therapy';
  return {
    module: 'tier4_neph_103_peritonitis',
    patient_id: patientId,
    wbc_per_mm3: cell_count,
    polymorph_pct: differential,
    cloudy_effluent: cloudy,
    abdominal_pain,
    suspected,
    therapy,
    monitoring: 'q48h_effluent_cell_count_until_clear',
    citations: CITATIONS
  };
}
module.exports = {
  pdAdequacy,
  peritonitisManagement,
  CITATIONS,
  ValidationError
};