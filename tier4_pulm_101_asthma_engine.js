'use strict';
// TIER4_PULM-101 Asthma
const CITATIONS = [
  { id: 'GINA-2024', source: 'Global Initiative for Asthma', year: 2024 }
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
function asthmaControl(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const act = ensureNumber(input, 'act_score', 0, 25);
  const fev1 = ensureNumber(input, 'fev1_pct', 0, 200);
  const exacerbations = ensureNumber(input, 'exacerbations_12mo', 0, 100);
  const controlled = (act >= 20 && exacerbations === 0);
  const step = (controlled) ? 'step_1_or_2_maintain' :
    (exacerbations >= 2 || act < 16) ? 'step_4_or_5_escalate' :
    (act < 20) ? 'step_3_intensify' : 'step_2_review';
  const therapy = (step === 'step_4_or_5_escalate') ? 'ics_laba_high_dose_then_biologic_candidate' :
    (step === 'step_3_intensify') ? 'ics_laba_low_dose_then_step_up' :
    'ics_alone_then_prn_saba';
  return {
    module: 'tier4_pulm_101_control',
    patient_id: patientId,
    act_score: act,
    fev1_pct: fev1,
    exacerbations_12mo: exacerbations,
    controlled,
    step,
    therapy,
    monitoring: 'q1mo_act_q3mo_pfts_q6mo_review',
    citations: CITATIONS
  };
}
function severeAsthmaBiologic(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const eosinophil = ensureNumber(input, 'eos_per_ul', 0, 5000);
  const ige = ensureNumber(input, 'ige_iu_ml', 0, 100000);
  const comorbid = ensureEnum(input, 'comorbid', ['none', 'chronic_rhinosinusitis_with_np', 'atopic_dermatitis', 'egpa', 'abpa', 'other']);
  const biologic = (eos_per_ul >= 300 && comorbid === 'none') ? 'mepolizumab_or_benralizumab_or_dexamethasone' :
    (eos_per_ul >= 150) ? 'mepolizumab_or_reslizumab' :
    (ige >= 30 && comorbid === 'atopic_dermatitis') ? 'omalizumab' :
    (comorbid === 'chronic_rhinosinusitis_with_np') ? 'dupilumab' :
    'review_biomarker_then_biologic_selection';
  return {
    module: 'tier4_pulm_101_biologic',
    patient_id: patientId,
    eos_per_ul: eosinophil,
    ige_iu_ml: ige,
    comorbid,
    biologic,
    monitoring: 'q1mo_clinical_q3mo_eos_ige_q6mo_review',
    citations: CITATIONS
  };
}
module.exports = {
  asthmaControl,
  severeAsthmaBiologic,
  CITATIONS,
  ValidationError
};