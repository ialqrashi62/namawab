'use strict';
// TIER4_PALL-101 Pain Management (WHO Ladder + Adjuvants)
const CITATIONS = [
  { id: 'WHO-Analgesic-2024', source: 'WHO Cancer Pain Ladder', year: 2024 }
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
function whoLadderStep(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const nrs = ensureNumber(input, 'pain_nrs_0_10', 0, 10);
  const type = ensureEnum(input, 'pain_type', ['nociceptive_somatic', 'nociceptive_visceral', 'neuropathic', 'incident', 'mixed', 'unknown']);
  const prior_step = ensureEnum(input, 'prior_step', ['none', 'step_1', 'step_2', 'step_3_strong_opioid', 'step_4_interventional']);
  const renal = input.renal_impairment === true;
  const step = (nrs >= 7) ? 'step_3_or_4' : (nrs >= 4) ? 'step_2_or_3' : (nrs >= 1) ? 'step_1_or_2' : 'no_opioid_review';
  const adjuvant = (type === 'neuropathic') ? 'gabapentin_or_duloxetine' :
    (type === 'incident') ? 'pre_medication_then_review' :
    'none_specific';
  const therapy = (step === 'step_3_or_4') ? (renal ? 'fentanyl_or_hydromorphone_with_adjuvant' : 'morphine_or_oxycodone_with_adjuvant_and_laxative') :
    (step === 'step_2_or_3') ? 'weak_opioid_tramadol_or_codeine_with_adjuvant' :
    (step === 'step_1_or_2') ? 'paracetamol_or_nsaid_with_adjuvant' :
    'non_pharm_only';
  return {
    module: 'tier4_pall_101_ladder',
    patient_id: patientId,
    pain_nrs_0_10: nrs,
    pain_type: type,
    prior_step,
    renal_impairment: renal,
    step,
    adjuvant,
    therapy,
    monitoring: 'q24h_review_pain_then_q1wk_until_stable',
    citations: CITATIONS
  };
}
module.exports = {
  whoLadderStep,
  CITATIONS,
  ValidationError
};