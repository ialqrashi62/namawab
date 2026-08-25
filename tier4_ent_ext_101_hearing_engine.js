'use strict';
// TIER4_ENT_EXT-101 Hearing Loss
const CITATIONS = ['AAO_HNS_Hearing_Loss','USPSTF_Hearing'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function hearingScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const self_reported_difficulty = !!input.self_reported_difficulty;
  const whisper_test_fail = !!input.whisper_test_fail;
  if (age >= 50 && (self_reported_difficulty || whisper_test_fail)) {
    return { age, self_reported_difficulty, whisper_test_fail, recommendation: 'refer_for_audiometry_evaluation', citations: CITATIONS };
  }
  return { age, self_reported_difficulty, whisper_test_fail, recommendation: 'routine_surveillance', citations: CITATIONS };
}

function suddenSensorineuralHearingLoss(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const side = ensureEnum(input.side || 'unilateral', ['unilateral','bilateral'], 'side');
  const hours_since_onset = ensureNumber(input.hours_since_onset, 'hours_since_onset');
  const associated_tinnitus = !!input.associated_tinnitus;
  const associated_vertigo = !!input.associated_vertigo;
  const is_sudden = hours_since_onset <= 96;
  if (!is_sudden) return { side, hours_since_onset, is_sudden, treatment: 'not_eligible_for_steroid_protocol_evaluate_other_causes', citations: CITATIONS };
  return { side, hours_since_onset, is_sudden, associated_tinnitus, associated_vertigo, treatment: 'oral_prednisone_60mg_daily_7_to_14_days_with_taper_plus_intratympanic_dexamethasone_refer_to_ENT_urgently', citations: CITATIONS };
}

module.exports = { hearingScreening, suddenSensorineuralHearingLoss, CITATIONS, ValidationError };