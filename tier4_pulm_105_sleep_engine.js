'use strict';
// TIER4_PULM-105 Sleep Medicine
const CITATIONS = [
  { id: 'AASM-2024', source: 'American Academy Sleep Medicine', year: 2024 }
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
function osaSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ahi = ensureNumber(input, 'ahi_events_per_hour', 0, 200);
  const severity = (ahi < 5) ? 'normal' : (ahi < 15) ? 'mild' : (ahi < 30) ? 'moderate' : 'severe';
  const sleepy = input.excessive_daytime_sleepiness === true;
  const therapy = (severity === 'severe' || sleepy) ? 'cpap_or_bpap_then_review' :
    (severity === 'moderate') ? 'pap_consider_oral_appliance_position_therapy' :
    (severity === 'mild') ? 'weight_loss_position_oral_appliance' :
    'no_osa_q_review';
  return {
    module: 'tier4_pulm_105_osa',
    patient_id: patientId,
    ahi_events_per_hour: ahi,
    severity,
    excessive_daytime_sleepiness: sleepy,
    therapy,
    monitoring: 'q3mo_clinical_q1y_titration_q1y_download_pap',
    citations: CITATIONS
  };
}
function insomniaCBT(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const isi = ensureNumber(input, 'isi_score', 0, 28);
  const severity = (isi < 8) ? 'none' : (isi < 15) ? 'subthreshold' : (isi < 22) ? 'moderate' : 'severe';
  const chronicity = ensureEnum(input, 'chronicity', ['acute', 'short_term', 'chronic']);
  const therapy = (severity === 'none') ? 'no_therapy' :
    (chronicity === 'chronic') ? 'cbt_i_first_line_consider_dora_dual_orexin_antagonist' :
    'sleep_hygiene_cbt_i_then_short_term_z_drug';
  return {
    module: 'tier4_pulm_105_insomnia',
    patient_id: patientId,
    isi_score: isi,
    severity,
    chronicity,
    therapy,
    monitoring: 'q2wk_until_response_then_q1mo',
    citations: CITATIONS
  };
}
module.exports = {
  osaSeverity,
  insomniaCBT,
  CITATIONS,
  ValidationError
};