'use strict';
// TIER4_ENDO-106 Lipid Disorders
const CITATIONS = [
  { id: 'AHA-2024', source: 'AHA/ACC Lipid Guideline', year: 2024 }
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
function ldlManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ldl = ensureNumber(input, 'ldl_mg_dl', 0, 500);
  const ascvd_risk = ensureEnum(input, 'ascvd_risk', ['low', 'borderline', 'intermediate', 'high', 'very_high', 'extreme']);
  const diabetes = input.diabetes === true;
  const prior_statin = ensureEnum(input, 'statin_tolerated', ['naive', 'low_intensity', 'moderate_intensity', 'high_intensity', 'intolerant']);
  const target = (ascvd_risk === 'extreme' || ascvd_risk === 'very_high') ? 'ldl_70_or_50' :
    (ascvd_risk === 'high') ? 'ldl_70' :
    (ascvd_risk === 'intermediate') ? 'ldl_100' : 'ldl_130';
  const therapy = (prior_statin === 'intolerant') ? 'ezetimibe_first_then_pcsk9_if_needed' :
    (ascvd_risk === 'extreme') ? 'high_intensity_statin_plus_ezetimibe_plus_pcsk9' :
    (ascvd_risk === 'very_high' || ascvd_risk === 'high') ? 'high_intensity_statin_plus_ezetimibe' :
    'moderate_statin_lifestyle';
  return {
    module: 'tier4_endo_106_ldl',
    patient_id: patientId,
    ldl_mg_dl: ldl,
    ascvd_risk,
    diabetes,
    statin_tolerated: prior_statin,
    target,
    therapy,
    monitoring: 'q4_to_12wk_lipids_then_q1y',
    citations: CITATIONS
  };
}
function statinIntolerance(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const symptom = ensureEnum(input, 'symptom', ['myalgia', 'myopathy', 'rhabdo', 'transaminitis', 'gi_upset', 'none']);
  const ck = ensureNumber(input, 'ck', 0, 100000);
  const alt = ensureNumber(input, 'alt', 0, 1000);
  const severity = (ck >= 10000 || alt >= 600) ? 'severe' : (ck >= 3000 || alt >= 300) ? 'moderate' : 'mild';
  const therapy = (severity === 'severe') ? 'stop_statin_permanent_then_ezetimibe_pcsk9' :
    (severity === 'moderate') ? 'lower_dose_then_reassess_or_rosuvastatin' :
    'symptom_management_dose_reduction_alternate_regimen';
  return {
    module: 'tier4_endo_106_statin_intolerance',
    patient_id: patientId,
    symptom,
    ck,
    alt,
    severity,
    therapy,
    monitoring: 'q1wk_labs_then_q4wk_until_stable',
    citations: CITATIONS
  };
}
module.exports = {
  ldlManagement,
  statinIntolerance,
  CITATIONS,
  ValidationError
};