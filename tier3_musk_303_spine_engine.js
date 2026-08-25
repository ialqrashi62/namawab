/**
 * TIER3_MUSK-303 Spine Surgery Engine
 * Cervical/lumbar radiculopathy + ODI + spondylolisthesis + fracture (TLICS) + surgical indications (NASS) + deformity (SRS-Schwab)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { NASS: 'NASS Spine 2024', SRS_SCHWAB: 'SRS-Schwab 2012', TLICS: 'Vaccaro TLICS 2013' };

function cervicalMyelopathyScreen(input) {
  const { gait_change, dexterity_change, hyperreflexia, babinski, bladder_bowel_change, age } = input;
  let severe = hyperreflexia === 'positive' && dexterity_change === 'positive';
  if (severe) return { myelopathy_likely: true, surgical_urgency: 'urgent_decompression_within_1_to_4_weeks', mri_indicated: true, citation: CITATIONS.NASS };
  return { myelopathy_likely: false, mri_indicated: bladder_bowel_change === 'positive' || age >= 60 && dexterity_change, observation: 'serial_neurological_exam_Q3M' };
}

function oswestryDisabilityIndex(input) {
  const { pain_intensity, personal_care, lifting, walking, sitting, standing, sleeping, social_life, sex_life, traveling } = input;
  const total = pain_intensity + personal_care + lifting + walking + sitting + standing + sleeping + social_life + (sex_life || 0) + traveling;
  const odi = (total / 50) * 100;
  let category = 'minimal_disability';
  if (odi >= 40) category = 'severe_disability';
  else if (odi >= 20) category = 'moderate_disability';
  return { odi: Math.round(odi * 10) / 10, category, surgical_threshold_met: odi >= 40, citation: CITATIONS.NASS };
}

function lumbarStenosisSurgery(input) {
  const { walking_capacity_m, odi_score, failed_conservative_12w, neurogenic_claudication, surgical_candidate } = input;
  return {
    surgical_indicated: failed_conservative_12w && (neurogenic_claudication === 'positive' || walking_capacity_m <= 200) && odi_score >= 40 && surgical_candidate,
    procedure_options: ['laminectomy_with_preservation_of_facet_joints', 'laminotomy', 'decompression_with_fusion_if_instability'],
    citation: CITATIONS.NASS,
  };
}

function spondylolisthesisClass(input) {
  const { slip_pct, l5_s1_level, age, traction_xray, extension_xray } = input;
  let classification = 'low_grade';
  if (slip_pct >= 50) classification = 'high_grade';
  const slip_flexibility = traction_xray === 'reduced' || extension_xray === 'reduced';
  return {
    classification,
    surgical_indicated: (slip_pct >= 50 && age < 60) || (classification === 'low_grade' && slip_pct >= 30 && age >= 60),
    fusion_needed: classification === 'high_grade' || slip_pct >= 50,
    citation: CITATIONS.NASS,
  };
}

function tlicsScore(input) {
  const { morphology, posterior_ligamentous_complex, neurological_status } = input;
  let score = 0;
  if (morphology === 'compression') score += 1;
  else if (morphology === 'burst') score += 2;
  else if (morphology === 'translation_rotation') score += 3;
  else if (morphology === 'distraction') score += 4;
  if (posterior_ligamentous_complex === 'intact') score += 0;
  else if (posterior_ligamentous_complex === 'indeterminate') score += 2;
  else if (posterior_ligamentous_complex === 'injured') score += 3;
  if (neurological_status === 'intact') score += 0;
  else if (neurological_status === 'nerve_root') score += 2;
  else if (neurological_status === 'cord_conus_cauda_equina_complete') score += 4;
  let management = 'conservative_immobilization';
  if (score >= 5) management = 'operative_fixation_recommended';
  return { tlics_total: score, management, citation: CITATIONS.TLICS };
}

function deformityClassificationSrsSchwab(input) {
  const { pelvic_incidence, pelvic_tilt, lumbar_lordosis, sva_cm, pi_ll_mismatch } = input;
  let sagittal_modifiers = [];
  if (pelvic_tilt > 20) sagittal_modifiers.push('PT_modifier_plus');
  if (pi_ll_mismatch > 10) sagittal_modifiers.push('PI_LL_modifier_plus');
  if (sva_cm > 5) sagittal_modifiers.push('SVA_modifier_plus');
  let surgery_indicated = sagittal_modifiers.filter(m => m.includes('plus')).length >= 2;
  return {
    pelvic_incidence_minus_lumbar_lordosis: pi_ll_mismatch,
    sagittal_modifiers: sagittal_modifiers,
    surgery_indicated,
    procedure_options: ['posterior_column_osteotomy_pso', 'pedicle_subtraction_osteotomy_PSO', 'vertebral_column_resection_VCR'],
    citation: CITATIONS.SRS_SCHWAB,
  };
}

module.exports = { cervicalMyelopathyScreen, oswestryDisabilityIndex, lumbarStenosisSurgery, spondylolisthesisClass, tlicsScore, deformityClassificationSrsSchwab, CITATIONS, ValidationError };