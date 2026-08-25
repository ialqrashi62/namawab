'use strict';
// TIER4_RARE-102 Mitochondrial Disorders
// MELAS, MERRF, LHON, Leigh, Kearns-Sayre
const CITATIONS = [
  { id: 'MitoMed-2023', source: 'Mitochondrial Medicine Society consensus', year: 2023 },
  { id: 'MELAS-Criteria', source: 'MELAS diagnostic criteria - Yatsuga et al.', year: 2022 },
  { id: 'NORD-MITO', source: 'National Organization for Rare Disorders - Mitochondrial Disease', year: 2024 }
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
function mitochondrialDiseaseEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const syndrome = ensureEnum(input, 'syndrome', ['melas', 'merrf', 'lhon', 'leigh', 'kearns_sayre', 'cppeo', 'narp']);
  const mt_dna_variant = input.mt_dna_variant || 'pending';
  const lactate = ensureNumber(input, 'lactate_mmol_l', 0, 30);
  const pyruvate = ensureNumber(input, 'pyruvate_mmol_l', 0, 5);
  const lpr = lactate / Math.max(pyruvate, 0.01);
  const multisystem = Array.isArray(input.multisystem_involvement) ? input.multisystem_involvement : [];
  const heteroplasmy_pct = ensureNumber(input, 'heteroplasmy_pct', 0, 100);
  let diagnostic_confidence = 'probable';
  if (mt_dna_variant !== 'pending' && heteroplasmy_pct > 60) diagnostic_confidence = 'confirmed';
  else if (lactate > 4 && lpr > 25) diagnostic_confidence = 'likely';
  const flags = [];
  if (syndrome === 'leigh' && multisystem.length < 2) flags.push('TYPICAL_LEIGH_NEEDS_NEURO_RAD');
  if (syndrome === 'lhon' && heteroplasmy_pct < 100) flags.push('HETEROPLASMY_LOW_REVIEW_INCOMPLETE_PENETRANCE');
  if (lactate > 8) flags.push('SEVERE_LACTIC_ACIDOSIS');
  return {
    module: 'tier4_rare_102_mitochondrial',
    patient_id: patientId,
    syndrome,
    mt_dna_variant,
    diagnostic_confidence,
    lab: { lactate, pyruvate, lactate_pyruvate_ratio: lpr },
    multisystem_involvement: multisystem,
    heteroplasmy_pct,
    flags,
    citations: CITATIONS
  };
}
function strokeLikeEpisodeMELAS(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const focal_deficit = Array.isArray(input.focal_deficit) ? input.focal_deficit : [];
  const seizures = input.seizures === true;
  const lactic_acidosis = ensureNumber(input, 'lactate_mmol_l', 0, 30);
  const mri_flair = input.mri_flair_positive === true;
  let melas_likelihood = 'low';
  if (mri_flair && lactic_acidosis > 4 && seizures) melas_likelihood = 'high';
  else if (mri_flair && lactic_acidosis > 2.5) melas_likelihood = 'moderate';
  const acute_therapy = {
    iv_dextrose: 'avoid_hypoglycemia',
    arginine_iv: melas_likelihood === 'high' ? 'loading_then_maintenance' : 'consider',
    antioxidants: 'coq10_taurine_riboflavin',
    avoid: ['valproate', 'phenytoin', 'metformin', 'aminoglycosides']
  };
  return {
    module: 'tier4_rare_102_melas_stroke',
    patient_id: patientId,
    melas_likelihood,
    acute_therapy,
    citations: CITATIONS
  };
}
function kearnsSayreSurveillance(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const cardiac_block = ensureEnum(input, 'cardiac_block', ['none', 'first_degree', 'second_degree', 'complete']);
  const retinal_degeneration = input.retinal_degeneration === true;
  const cerebellar_signs = input.cerebellar_signs === true;
  let pacer_indicated = false;
  if (cardiac_block === 'second_degree' || cardiac_block === 'complete') pacer_indicated = true;
  if (cardiac_block === 'first_degree' && age > 30) pacer_indicated = true;
  return {
    module: 'tier4_rare_102_kearns_sayre',
    patient_id: patientId,
    cardiac_block,
    retinal_degeneration,
    cerebellar_signs,
    pacer_indicated,
    surveillance: {
      echo_q6mo: true,
      holter_annual: true,
      ophthalmology_q6mo: retinal_degeneration,
      neuro_q6mo: cerebellar_signs
    },
    citations: CITATIONS
  };
}
function lhonManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const mutation = ensureEnum(input, 'primary_mutation', ['m_11778', 'm_3460', 'm_14484']);
  const vision_acuity_right = ensureNumber(input, 'vision_acuity_right_logmar', -0.5, 3);
  const vision_acuity_left = ensureNumber(input, 'vision_acuity_left_logmar', -0.5, 3);
  const date_of_onset = input.date_of_onset || 'unknown';
  let prognosis = 'guarded';
  if (mutation === 'm_14484') prognosis = 'better_recovery_potential';
  const therapy = {
    idebenone: 'initiate_early_high_dose',
    avoid: ['smoking', 'alcohol', 'ethambutol', 'red_wine'],
    monitoring: 'monthly_visual_fields_for_6_months'
  };
  return {
    module: 'tier4_rare_102_lhon',
    patient_id: patientId,
    primary_mutation: mutation,
    vision_acuity: { right: vision_acuity_right, left: vision_acuity_left },
    date_of_onset,
    prognosis,
    therapy,
    citations: CITATIONS
  };
}
function exerciseMitochondrialSafety(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const baseline_lactate = ensureNumber(input, 'baseline_lactate', 0, 30);
  const baseline_ck = ensureNumber(input, 'baseline_ck', 0, 10000);
  const cardiac_status = ensureEnum(input, 'cardiac_status', ['normal', 'conduction_defect', 'cardiomyopathy']);
  const intensity = ensureEnum(input, 'intensity', ['low', 'moderate', 'high']);
  const safe = cardiac_status === 'normal' && baseline_lactate < 4 && intensity !== 'high';
  return {
    module: 'tier4_rare_102_exercise_safety',
    patient_id: patientId,
    safe_to_exercise: safe,
    recommended: safe ? 'aerobic_endurance_low_resistance' : 'supervised_cardiology_clearance',
    contraindications: cardiac_status !== 'normal' ? ['high_intensity', 'isometric_heavy'] : [],
    citations: CITATIONS
  };
}
module.exports = {
  mitochondrialDiseaseEvaluation,
  strokeLikeEpisodeMELAS,
  kearnsSayreSurveillance,
  lhonManagement,
  exerciseMitochondrialSafety,
  CITATIONS,
  ValidationError
};
