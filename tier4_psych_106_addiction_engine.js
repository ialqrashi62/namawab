'use strict';
// TIER4_PSYCH-106 Substance Use Disorders
const CITATIONS = [
  { id: 'ASAM-2024', source: 'ASAM Criteria Addiction Treatment', year: 2024 }
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
function alcoholWithdrawal(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ciwa = ensureNumber(input, 'ciwa_ar_score', 0, 67);
  const seizure_history = input.seizure_history === true;
  const dt_history = input.delirium_tremens_history === true;
  const therapy = (ciwa >= 18) ? 'symptom_triggered_diazepam_or_chlordiazepoxide' :
    (ciwa >= 10 || seizure_history || dt_history) ? 'scheduled_diazepam_then_symptom_triggered' :
    'monitor_q4h_then_review';
  return {
    module: 'tier4_psych_106_withdrawal',
    patient_id: patientId,
    ciwa_ar_score: ciwa,
    seizure_history,
    delirium_tremens_history: dt_history,
    therapy,
    monitoring: 'q1_to_2h_ciwa_until_score_lt_8',
    citations: CITATIONS
  };
}
function opioidUseDisorder(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const motivation = ensureEnum(input, 'motivation', ['low', 'moderate', 'high']);
  const therapy = (severity === 'severe') ? 'methadone_or_buprenorphine_or_naltrexone_then_counseling' :
    (motivation === 'high') ? 'naltrexone_or_buprenorphine_then_relapse_prevention' :
    'buprenorphine_induction_then_review';
  return {
    module: 'tier4_psych_106_oud',
    patient_id: patientId,
    severity,
    motivation,
    therapy,
    monitoring: 'q1wk_induction_then_q1mo_then_q3mo',
    citations: CITATIONS
  };
}
module.exports = {
  alcoholWithdrawal,
  opioidUseDisorder,
  CITATIONS,
  ValidationError
};