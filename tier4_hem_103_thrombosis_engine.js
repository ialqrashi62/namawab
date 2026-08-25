'use strict';
// TIER4_HEM-103 VTE & Thrombosis
const CITATIONS = [
  { id: 'ASH-VTE-2024', source: 'ASH VTE Guidelines', year: 2024 }
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
function dvt(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const location = ensureEnum(input, 'location', ['proximal_dvt', 'distal_dvt', 'ileofemoral', 'ivc', 'renal_v', 'mesenteric_v', 'portal_v', 'cerebral_v', 'unprovoked_pe', 'provoked_pe', 'massive_pe', 'submassive_pe', 'low_risk_pe']);
  const cancer = input.active_cancer === true;
  const provoked = input.provoked_by_surgery_pregnancy_immobility === true;
  const bleeds = input.recent_bleeding === true;
  const therapy = (location === 'massive_pe' && !bleeds) ? 'systemic_thrombolysis_or_cdt_then_anticoagulate' :
    (cancer) ? 'doac_or_lmwh_x3_6mo_review' :
    (provoked) ? 'doac_or_lmwh_x3mo_then_review' :
    (location.startsWith('cerebral')) ? 'anticoagulation_specialist_review_neurosurgery' :
    'doac_then_review_x3mo_minimum';
  const duration = (cancer) ? '3_6mo_or_indefinite' : (provoked) ? '3mo_then_review' : '3mo_minimum_to_indefinite';
  return {
    module: 'tier4_hem_103_dvt',
    patient_id: patientId,
    location,
    active_cancer: cancer,
    provoked: provoked,
    recent_bleeding: bleeds,
    therapy,
    duration,
    monitoring: 'q2wk_until_stable_q3mo_imaging',
    citations: CITATIONS
  };
}
function aps(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const recurrence = input.recurrent_vte === true;
  const antiphospholipid = ensureEnum(input, 'aps_lab', ['positive_triple', 'positive_double', 'positive_single', 'negative', 'pending']);
  const family_history = input.family_history_thrombosis === true;
  const th_screen = (recurrence || antiphospholipid.startsWith('positive') || family_history) ? 'screen_then_counsel' : 'no_screen';
  return {
    module: 'tier4_hem_103_aps',
    patient_id: patientId,
    recurrent_vte: recurrence,
    aps_lab: antiphospholipid,
    family_history_thrombosis: family_history,
    screening: th_screen,
    therapy: (antiphospholipid.startsWith('positive')) ? 'warfarin_target_inr_2_3_indefinite' : 'doac_3mo_then_review',
    monitoring: 'q1mo_inr_if_warfarin_q3mo_clinical',
    citations: CITATIONS
  };
}
module.exports = {
  dvt,
  aps,
  CITATIONS,
  ValidationError
};