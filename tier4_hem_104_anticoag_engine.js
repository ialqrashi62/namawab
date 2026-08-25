'use strict';
// TIER4_HEM-104 Anticoagulation Management
const CITATIONS = [
  { id: 'ASH-AC-2024', source: 'ASH Anticoagulation', year: 2024 }
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
function doacChoice(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const indication = ensureEnum(input, 'indication', ['afib', 'vte', 'vte_cancer', 'mechanical_valve', 'thrombophilia', 'recurrent_vte']);
  const egfr = ensureNumber(input, 'egfr', 0, 200);
  const prior_bleed = input.prior_bleeding === true;
  const mechanical_valve = (indication === 'mechanical_valve');
  const agent = mechanical_valve ? 'warfarin_indefinite_inr_2_3' :
    (indication === 'vte_cancer') ? 'lmwh_then_review' :
    (egfr < 30) ? 'warfarin_preferred_dialysis_review' :
    (prior_bleed && indication === 'afib') ? 'apixaban_or_rivaroxaban_low_dose_review' :
    (indication === 'afib') ? 'apixaban_or_rivaroxaban_or_dabigatran_or_edoxaban' :
    (indication === 'vte') ? 'apixaban_or_rivaroxaban_x3mo_then_review' :
    'doac_choice_review';
  return {
    module: 'tier4_hem_104_doac',
    patient_id: patientId,
    indication,
    egfr,
    prior_bleeding: prior_bleed,
    agent,
    monitoring: (agent.startsWith('warfarin')) ? 'q1wk_inr_then_q1mo' : 'q3mo_clinical_q6mo_renal',
    citations: CITATIONS
  };
}
function reversal(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const agent = ensureEnum(input, 'agent', ['warfarin', 'apixaban', 'rivaroxaban', 'dabigatran', 'lmwh', 'other', 'unknown']);
  const bleed_severity = ensureEnum(input, 'severity', ['minor', 'major_life_threatening']);
  const therapy = (agent === 'warfarin' && bleed_severity === 'major_life_threatening') ? '4_factor_pcc_then_vitamin_k_10mg_iv_then_reassess' :
    (agent === 'warfarin') ? 'vitamin_k_oral_2_to_5mg_then_reassess' :
    (agent === 'dabigatran' && bleed_severity === 'major_life_threatening') ? 'idarucizumab_then_reassess' :
    (agent === 'apixaban' || agent === 'rivaroxaban') && bleed_severity === 'major_life_threatening' ? 'andexanet_alfa_or_4_factor_pcc_then_reassess' :
    'hold_dose_then_reassess';
  return {
    module: 'tier4_hem_104_reversal',
    patient_id: patientId,
    agent,
    bleed_severity,
    therapy,
    monitoring: 'q1h_until_bleed_controlled_q4h_24h',
    citations: CITATIONS
  };
}
module.exports = {
  doacChoice,
  reversal,
  CITATIONS,
  ValidationError
};