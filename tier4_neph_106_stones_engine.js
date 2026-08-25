'use strict';
// TIER4_NEPH-106 Nephrolithiasis (stones)
const CITATIONS = [
  { id: 'EAU-2024', source: 'European Association Urology', year: 2024 }
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
function renalColic(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const stone_size_mm = ensureNumber(input, 'stone_size_mm', 0, 100);
  const location = ensureEnum(input, 'location', ['renal_calyx', 'renal_pelvis', 'proximal_ureter', 'mid_ureter', 'distal_ureter', 'uvj', 'bladder']);
  const hydronephrosis = ensureEnum(input, 'hydronephrosis', ['none', 'mild', 'moderate', 'severe']);
  const urosepsis = input.urosepsis === true;
  const therapy = (urosepsis || hydronephrosis === 'severe') ? 'urgent_decompression_stent_or_nephrostomy_then_stone_removal' :
    (stone_size_mm >= 10 && (location === 'proximal_ureter' || location === 'mid_ureter')) ? 'ureteroscopy_or_eswl' :
    (stone_size_mm < 5 && location === 'distal_ureter') ? 'medical_expulsive_therapy_tamsulosin' :
    (stone_size_mm < 10 && location === 'renal_calyx') ? 'eswl_or_observation' : 'urology_review';
  return {
    module: 'tier4_neph_106_colic',
    patient_id: patientId,
    stone_size_mm,
    location,
    hydronephrosis,
    urosepsis,
    therapy,
    monitoring: 'q2wk_imaging_q3mo_metabolic_workup',
    citations: CITATIONS
  };
}
function stoneComposition(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'composition', ['calcium_oxalate', 'calcium_phosphate', 'uric_acid', 'struvite', 'cystine', 'mixed', 'unknown']);
  const recurrence = input.recurrent_stone_form === true;
  const therapy = {
    calcium_oxalate: recurrence ? 'thiazide_potassium_citrate_oxalate_restriction' : 'hydration_only',
    calcium_phosphate: 'thiazide_phosphate_restriction_review_rta',
    uric_acid: 'allopurinol_potassium_citrate_alkalinize_urine',
    struvite: 'complete_stone_removal_then_antibiotic_prophylaxis_review',
    cystine: 'tiopronin_or_penicillamine_high_fluid_intake',
    mixed: 'review_specific_components',
    unknown: 'stone_analysis_pending_metabolic_workup'
  };
  return {
    module: 'tier4_neph_106_composition',
    patient_id: patientId,
    composition: type,
    recurrent: recurrence,
    therapy: therapy[type],
    monitoring: 'q6mo_imaging_q1y_metabolic_review',
    citations: CITATIONS
  };
}
module.exports = {
  renalColic,
  stoneComposition,
  CITATIONS,
  ValidationError
};