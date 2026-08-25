'use strict';
// TIER4_INFECT-107 Skin & Soft Tissue Infections
const CITATIONS = [
  { id: 'IDSA-SSTI-2024', source: 'IDSA SSTI Guidelines', year: 2024 }
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
function cellulitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const organism = ensureEnum(input, 'organism', ['strep_pyogenes', 'mssa', 'mrsa', 'mixed', 'unknown']);
  const systemic = input.systemic_signs === true;
  const therapy = (severity === 'severe' || systemic) ? 'iv_vanco_plus_cefazolin_then_review' :
    (severity === 'moderate') ? 'iv_then_oral_review' :
    'oral_cephalexin_or_amox_clav_then_review';
  return {
    module: 'tier4_infect_107_cellulitis',
    patient_id: patientId,
    severity,
    organism,
    systemic_signs: systemic,
    therapy,
    monitoring: 'q24h_assessment_until_improvement',
    citations: CITATIONS
  };
}
function necrotizing(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const suspicion = ensureEnum(input, 'suspicion', ['low', 'moderate', 'high']);
  const lrnec_score = ensureNumber(input, 'lrnec_score', 0, 13);
  const unstable = (suspicion === 'high' || lrnec_score >= 6);
  const therapy = unstable ? 'urgent_surgical_debridement_then_iv_pip_tazo_vanco_then_review' :
    'monitor_imaging_serial_review_then_iv_antibiotics';
  return {
    module: 'tier4_infect_107_necrotizing',
    patient_id: patientId,
    suspicion,
    lrnec_score,
    therapy,
    monitoring: 'q1h_vitals_serial_exam_q24h_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  cellulitis,
  necrotizing,
  CITATIONS,
  ValidationError
};