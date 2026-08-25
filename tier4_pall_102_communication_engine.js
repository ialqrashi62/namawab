'use strict';
// TIER4_PALL-102 Communication & Goals of Care
const CITATIONS = [
  { id: 'VitalTalk-2024', source: 'VitalTalk Communication Framework', year: 2024 }
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
function goalsOfCare(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stage = ensureEnum(input, 'stage', ['curable', 'chronic_life_limiting', 'advanced_illness', 'end_of_life', 'terminal', 'unknown']);
  const prior_discussion = ensureEnum(input, 'prior_discussion', ['none', 'brief_mention', 'full_goals_discussion', 'code_status_advance_directive', 'other']);
const family_understanding = ensureEnum(input, 'family_understanding', ['full', 'partial', 'limited', 'inconsistent', 'conflicted']);
  const surrogate = input.surrogate_documented === true;
  const plan = (family_understanding === 'conflicted') ? 'urgent_family_meeting_then_ethics_consult' :
    (stage === 'end_of_life' || stage === 'terminal') ? 'goals_of_care_family_meeting_hospice_referral' :
    (prior_discussion === 'none') ? 'introduce_goals_of_care_via_ask_tell_ask_then_schedule_full_meeting' :
    'review_and_update_goals_q3mo';
  return {
    module: 'tier4_pall_102_goals',
    patient_id: patientId,
    stage,
    prior_discussion,
    family_understanding,
    surrogate_documented: surrogate,
    plan,
    monitoring: 'q3mo_update_then_per_stage_change',
    citations: CITATIONS
  };
}
module.exports = {
  goalsOfCare,
  CITATIONS,
  ValidationError
};