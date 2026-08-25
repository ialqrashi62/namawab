'use strict';
// TIER4_ONC-105 Immuno-Oncology (Checkpoint Inhibitors)
const CITATIONS = [
  { id: 'SITC-2024', source: 'Society for Immunotherapy Cancer', year: 2024 }
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
function iraeManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const organ = ensureEnum(input, 'organ', ['pneumonitis', 'colitis', 'hepatitis', 'nephritis', 'dermatitis', 'endocrinopathy', 'myocarditis', 'encephalitis', 'other']);
  const grade = ensureEnum(input, 'ctcae_grade', ['1', '2', '3', '4']);
  const therapy = (grade === '4' || organ === 'myocarditis') ? 'permanently_discontinue_ici_iv_steroids_2mg_kg_then_review' :
    (grade === '3') ? 'hold_ici_iv_steroids_1_to_2mg_kg_then_taper' :
    (grade === '2') ? 'hold_ici_oral_prednisone_then_resume_grade_2' :
    'continue_ici_monitor';
  return {
    module: 'tier4_onc_105_irae',
    patient_id: patientId,
    organ,
    ctcae_grade: grade,
    therapy,
    monitoring: 'q1wk_labs_q2wk_clinical_until_resolve',
    citations: CITATIONS
  };
}
function iciSelection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tumor = ensureEnum(input, 'tumor', ['nsclc', 'sclc', 'melanoma', 'rcc', 'hnscc', 'urothelial', 'hepatocellular', 'breast', 'gastric', 'crc_mss', 'crc_msi_h', 'lymphoma', 'other']);
  const biomarker = ensureEnum(input, 'biomarker', ['pdl1_high', 'pdl1_low', 'msi_h', 'mss', 'tmb_high', 'tmb_low', 'ebv_pos', 'unknown', 'negative']);
  const regimen = (tumor === 'crc_msi_h' || biomarker === 'msi_h') ? 'pembrolizumab_first_line' :
    (tumor === 'melanoma') ? 'nivolumab_plus_ipilimumab_or_pembrolizumab' :
    (tumor === 'nsclc' && biomarker === 'pdl1_high') ? 'pembrolizumab_or_pembro_plus_chemo' :
    (tumor === 'rcc') ? 'nivolumab_plus_ipilimumab_or_pembro_plus_axitinib' :
    (tumor === 'hnscc') ? 'pembrolizumab_with_platinum_5fu' :
    (biomarker === 'mss' && tumor !== 'crc_msi_h') ? 'chemo_no_ici' :
    'standard_first_line_review';
  return {
    module: 'tier4_onc_105_selection',
    patient_id: patientId,
    tumor,
    biomarker,
    regimen,
    monitoring: 'q3mo_imaging_q3mo_irae_surveillance',
    citations: CITATIONS
  };
}
module.exports = {
  iraeManagement,
  iciSelection,
  CITATIONS,
  ValidationError
};