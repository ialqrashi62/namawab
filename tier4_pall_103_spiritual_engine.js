'use strict';
// TIER4_PALL-103 Spiritual Care Assessment
const CITATIONS = [
  { id: 'NCCN-Palliative-2024', source: 'NCCN Spiritual Care', year: 2024 }
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
function spiritualDistress(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const faith = ensureEnum(input, 'faith_tradition', ['muslim', 'christian', 'jewish', 'hindu', 'buddhist', 'sikh', 'secular', 'prefer_not_to_say', 'other']);
  const distress_indicators = ensureEnum(input, 'distress', ['none', 'mild', 'moderate', 'severe_crisis_of_faith', 'existential', 'hopelessness', 'despair']);
  const social_support = ensureEnum(input, 'support', ['strong', 'moderate', 'weak', 'isolated']);
  const therapy = (distress_indicators === 'despair' || distress_indicators === 'hopelessness') ? 'chaplain_urgent_then_faith_leader_referral' :
    (distress_indicators === 'severe_crisis_of_faith' || distress_indicators === 'existential') ? 'chaplain_refer_then_meaning_therapy' :
    (distress_indicators === 'moderate') ? 'chaplain_initial_visit_then_faith_leader_if_desired' :
    'spiritual_history_taken_screen_q1mo';
  return {
    module: 'tier4_pall_103_distress',
    patient_id: patientId,
    faith_tradition: faith,
    distress_indicators,
    social_support,
    therapy,
    monitoring: 'q1wk_in_distress_then_q1mo_review',
    citations: CITATIONS
  };
}
module.exports = {
  spiritualDistress,
  CITATIONS,
  ValidationError
};