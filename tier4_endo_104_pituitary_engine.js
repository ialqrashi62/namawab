'use strict';
// TIER4_ENDO-104 Pituitary
const CITATIONS = [
  { id: 'Endocrine-Society-2024', source: 'Endocrine Society Pituitary Guideline', year: 2024 }
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
function prolactinoma(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const prolactin = ensureNumber(input, 'prolactin_ng_ml', 0, 5000);
  const tumor_size = ensureEnum(input, 'tumor_size', ['micro', 'macro', 'giant']);
  const symptoms = ensureEnum(input, 'symptoms', ['none', 'galactorrhea_amenorrhea', 'visual_field_defect', 'headache', 'hypogonadism', 'mass_effect']);
  const therapy = (tumor_size === 'macro' || symptoms === 'visual_field_defect') ? 'cabergoline_high_dose_refer_neurosurgery' :
    (prolactin >= 200) ? 'cabergoline_start_then_reassess' :
    (tumor_size === 'micro') ? 'cabergoline_low_dose_then_reassess' : 'observation_q6mo';
  return {
    module: 'tier4_endo_104_prolactinoma',
    patient_id: patientId,
    prolactin_ng_ml: prolactin,
    tumor_size,
    symptoms,
    therapy,
    monitoring: 'q1mo_prolactin_q6mo_mri',
    citations: CITATIONS
  };
}
function acromegaly(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const igf1 = ensureNumber(input, 'igf1_ng_ml', 0, 2000);
  const gh = ensureNumber(input, 'gh_ng_ml', 0, 100);
  const tumor_size = ensureEnum(input, 'tumor_size', ['micro', 'macro']);
  const ogtt_suppression = ensureEnum(input, 'ogtt', ['suppressed', 'not_suppressed', 'pending']);
  const therapy = (ogtt_suppression === 'not_suppressed' && tumor_size === 'macro') ? 'transsphenoidal_surgery_then_octreotide_or_lanreotide' :
    (ogtt_suppression === 'not_suppressed') ? 'transsphenoidal_surgery_first_line' :
    'observation_pending';
  return {
    module: 'tier4_endo_104_acromegaly',
    patient_id: patientId,
    igf1,
    gh,
    tumor_size,
    ogtt,
    therapy,
    monitoring: 'q3mo_igf1_q6mo_mri_q1y_cardiac_echo',
    citations: CITATIONS
  };
}
function hypopituitarism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cortisol = ensureNumber(input, 'cortisol_am_ug_dl', 0, 50);
  const tsh = ensureNumber(input, 'tsh', 0, 100);
  const t4_free = ensureNumber(input, 't4_free', 0, 10);
  const acth = ensureEnum(input, 'acth', ['adequate', 'deficient', 'pending']);
  const therapy = (cortisol < 3 || acth === 'deficient') ? 'hydrocortisone_stress_dose_then_review' :
    (tsh > 5 && t4_free < 0.8) ? 'levothyroxine_then_review' : 'panhypopituitary_workup_then_replace';
  return {
    module: 'tier4_endo_104_hypopit',
    patient_id: patientId,
    cortisol_am: cortisol,
    tsh,
    t4_free,
    acth,
    therapy,
    monitoring: 'q3mo_hormone_panel_q6mo_mri',
    citations: CITATIONS
  };
}
module.exports = {
  prolactinoma,
  acromegaly,
  hypopituitarism,
  CITATIONS,
  ValidationError
};