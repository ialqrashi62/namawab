'use strict';
// TIER4_RHEUM-104 Vasculitis
const CITATIONS = [
  { id: 'ACR-Vasculitis-2024', source: 'ACR Vasculitis Guidelines', year: 2024 }
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
function anca(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'anca_type', ['pr3_positive', 'mpo_positive', 'negative', 'pending']);
  const diagnosis = ensureEnum(input, 'suspected_dx', ['gpa', 'mpa', 'egpa', 'iga_vasculitis', 'takayasu', 'gca', 'pan', 'behcet', 'other', 'unknown']);
  const organ_threatening = ensureEnum(input, 'organ_threat', ['none', 'lung', 'kidney', 'cns', 'heart', 'gi', 'multi']);
  const severity = ensureEnum(input, 'severity', ['localized', 'early_systemic', 'generalized', 'severe', 'refractory']);
  const therapy = (severity === 'severe' || organ_threatening === 'multi' || organ_threatening === 'kidney') ? 'pulse_iv_steroids_then_rituximab_or_cyclophosphamide_then_maintenance' :
    (severity === 'generalized') ? 'oral_prednisone_then_rituximab_or_azathioprine' :
    (severity === 'early_systemic') ? 'mtx_or_azathioprine_then_assess' :
    'topical_or_no_immunosuppression';
  return {
    module: 'tier4_rheum_104_anca',
    patient_id: patientId,
    anca_type: type,
    suspected_dx: diagnosis,
    organ_threat: organ_threatening,
    severity,
    therapy,
    monitoring: 'q2wk_labs_q3mo_imaging_per_organ',
    citations: CITATIONS
  };
}
function giantCellArteritis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const esr = ensureNumber(input, 'esr', 0, 200);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const visual = input.visual_symptoms === true;
  const jaw = input.jaw_claudication === true;
  const headache = input.new_headache === true;
  const suspect = (age >= 50 && (esr >= 50 || crp >= 10) && (visual || jaw || headache));
  const therapy = (visual) ? 'immediate_iv_methylpred_500mg_3d_then_oral_tap' :
    (suspect) ? 'prednisone_40_to_60mg_then_temporal_artery_biopsy_within_2wk' :
    'review_other_causes';
  return {
    module: 'tier4_rheum_104_gca',
    patient_id: patientId,
    age,
    esr,
    crp,
    visual_symptoms: visual,
    jaw_claudication: jaw,
    new_headache: headache,
    suspect,
    therapy,
    monitoring: 'q1wk_labs_q3mo_imaging_q1y_treat_to_target',
    citations: CITATIONS
  };
}
module.exports = {
  anca,
  giantCellArteritis,
  CITATIONS,
  ValidationError
};