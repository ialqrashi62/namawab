'use strict';
// TIER4_RARE-112 Neurofibromatosis
const CITATIONS = [
  { id: 'NIH-NF1', source: 'NIH Consensus - NF1 Diagnostic Criteria', year: 2021 },
  { id: 'NF2-2020', source: 'International NF2 Consensus', year: 2020 }
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
function nf1Diagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cafe_au_lait_count = ensureNumber(input, 'cafe_au_lait_count', 0, 100);
  const max_cafe_au_lait_cm = ensureNumber(input, 'max_cafe_au_lait_cm', 0, 50);
  const axillary_freckling = input.axillary_freckling === true;
  const inguinal_freckling = input.inguinal_freckling === true;
  const lisch_nodules = input.lisch_nodules === true;
  const optic_glioma = input.optic_glioma === true;
  const neurofibromas_count = ensureNumber(input, 'neurofibromas_count', 0, 100);
  const sphenoid_dysplasia = input.sphenoid_dysplasia === true;
  const tibial_pseudarthrosis = input.tibial_pseudarthrosis === true;
  const first_degree_relative = input.first_degree_nf1 === true;
  const criteria = [
    cafe_au_lait_count >= 6 && max_cafe_au_lait_cm >= 0.5,
    axillary_freckling || inguinal_freckling,
    lisch_nodules,
    optic_glioma,
    neurofibromas_count >= 2,
    sphenoid_dysplasia,
    tibial_pseudarthrosis,
    first_degree_relative
  ];
  const count = criteria.filter(Boolean).length;
  const diagnosed = count >= 2 || (count >= 1 && first_degree_relative);
  return {
    module: 'tier4_rare_112_nf1',
    patient_id: patientId,
    criteria_count: count,
    criteria_breakdown: criteria,
    diagnosed,
    flags: optic_glioma ? ['OPTOGRAM_NEEDED_IMMEDIATE'] : []
  };
}
function nf2Management(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bilateral_vestibular_schwannomas = input.bilateral_vestibular_schwannomas === true;
  const hearing_loss = ensureEnum(input, 'hearing_loss', ['none', 'mild', 'moderate', 'severe', 'profound']);
  const brain_mri_lesions = ensureNumber(input, 'brain_mri_lesion_count', 0, 50);
  const ependymoma = input.ependymoma === true;
  const monitoring = {
    hearing_annual: 'audiogram_with_abas',
    mri_brain_and_spine_annual: 'baseline_then_annual',
    audiology_referral: hearing_loss !== 'none' ? 'speech_therapy_consider_hearing_aid' : 'annual_screen'
  };
  const therapy = {
    surgery_vs_wait: 'individualize_tumor_growth_rate_hearing',
    bevacizumab: 'consider_for_growing_vs_in_children',
    hearing_rehab: 'cochlear_implant_or_auditory_brainstem_implant_assess'
  };
  const flags = [];
  if (ependymoma) flags.push('SPINE_SURVEILLANCE_NEEDED');
  if (hearing_loss === 'severe' || hearing_loss === 'profound') flags.push('COMMUNICATION_PLAN_REVIEW');
  return {
    module: 'tier4_rare_112_nf2',
    patient_id: patientId,
    bilateral_vestibular_schwannomas,
    hearing_loss,
    brain_mri_lesions,
    ependymoma,
    monitoring,
    therapy,
    flags
  };
}
module.exports = {
  nf1Diagnosis,
  nf2Management,
  CITATIONS,
  ValidationError
};
