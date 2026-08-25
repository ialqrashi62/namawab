'use strict';
// TIER4_ONC-104 Radiation Therapy
const CITATIONS = [
  { id: 'ASTRO-2024', source: 'ASTRO Radiation Guidelines', year: 2024 }
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
function radiotherapyPlan(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const intent = ensureEnum(input, 'intent', ['curative', 'adjuvant', 'neoadjuvant', 'palliative', 'sabr', 'srt', 'wbrt']);
  const site = ensureEnum(input, 'site', ['breast', 'lung', 'prostate', 'head_neck', 'cns', 'gi', 'gyne', 'urologic', 'sarcoma', 'lymphoma', 'other']);
  const dose = ensureNumber(input, 'total_dose_gy', 0, 100);
  const fractions = ensureNumber(input, 'fractions', 0, 50);
  const technique = (intent === 'sabr' || intent === 'srt') ? 'imrt_or_vmat_with_image_guidance' :
    (intent === 'curative' || intent === 'adjuvant') ? 'imrt_or_3dcrt_with_image_guidance' :
    (intent === 'palliative' || intent === 'wbrt') ? '3d_conformal_or_simple_opposed_fields' :
    'select_based_on_anatomy';
  return {
    module: 'tier4_onc_104_plan',
    patient_id: patientId,
    intent,
    site,
    total_dose_gy: dose,
    fractions,
    fraction_size_gy: fractions > 0 ? (dose / fractions).toFixed(2) : null,
    technique,
    monitoring: 'weekly_on_treatment_q3mo_post',
    citations: CITATIONS
  };
}
function radiationToxicity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const site = ensureEnum(input, 'site', ['breast', 'lung', 'prostate', 'head_neck', 'cns', 'gi', 'gyne', 'urologic', 'sarcoma', 'lymphoma', 'other']);
  const grade = ensureEnum(input, 'ctcae_grade', ['1', '2', '3', '4', '5']);
  const organ = ensureEnum(input, 'organ', ['skin', 'mucosa', 'esophagus', 'lung', 'bowel', 'bladder', 'cns', 'bone_marrow', 'other']);
  const therapy = (grade === '4' || grade === '5') ? 'hospitalize_resuscitation_per_organ' :
    (grade === '3') ? 'hold_rt_iv_steroids_antibiotics_then_review' :
    (grade === '2') ? 'topical_or_oral_agents_then_continue_rt' :
    'monitor_only';
  return {
    module: 'tier4_onc_104_toxicity',
    patient_id: patientId,
    site,
    ctcae_grade: grade,
    organ,
    therapy,
    monitoring: 'weekly_until_resolution_q3mo_post',
    citations: CITATIONS
  };
}
module.exports = {
  radiotherapyPlan,
  radiationToxicity,
  CITATIONS,
  ValidationError
};