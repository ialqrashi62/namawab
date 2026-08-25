/**
 * TIER3_RAD-301 Plain X-Ray Engine
 * Chest X-ray interpretation + Bone fracture assessment + Pediatric X-ray dose + Foreign body localization + Line/tube positioning
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR_RAD: 'ACR Appropriateness Criteria 2024', WHO_RAD: 'WHO Radiation Safety 2024' };

function chestXrayInterpretation(input) {
  const { cardiac_silhouette, mediastinal_width, costophrenic_angles_clear, lung_fields, pneumothorax_present, pleural_effusion_present, consolidation_present, support_devices_visible } = input;
  let primary_impression = 'normal_chest_xray';
  if (pneumothorax_present === 'yes') primary_impression = 'pneumothorax_size_assessment_for_tube_thoracostomy';
  else if (pleural_effusion_present === 'yes' && consolidation_present === 'yes') primary_impression = 'pneumonia_with_parapneumonic_effusion';
  else if (consolidation_present === 'yes') primary_impression = 'pneumonia_or_consolidation';
  else if (cardiac_silhouette === 'enlarged') primary_impression = 'cardiomegaly';
  else if (mediastinal_width === 'widened') primary_impression = 'mediastinal_widening_consider_aortic_dissection';
  return {
    primary_impression, cardiac_silhouette, mediastinal_width, costophrenic_angles_clear, lung_fields, pneumothorax_present, pleural_effusion_present, consolidation_present,
    next_step: primary_impression === 'mediastinal_widening_consider_aortic_dissection' ? 'CT_angiography_chest_for_aortic_dissection' : 'correlate_clinically',
    citation: CITATIONS.ACR_RAD,
  };
}

function boneFractureAssessment(input) {
  const { bone_involved, fracture_present, fracture_type, displacement, angulation_degrees, joint_involvement, open_fracture } = input;
  if (fracture_present === 'no') return { no_fracture: true, recommendation: 'consider_other_diagnoses_or_MRI_if_strong_clinical_suspicion' };
  return {
    bone_involved, fracture_present: 'yes', fracture_type, displacement, angulation_degrees, joint_involvement, open_fracture,
    classification: open_fracture === 'yes' ? 'open_fracture_orthopedic_emergency_iv_abx_operative_irrigation' : 'closed_fracture',
    management: joint_involvement === 'yes' ? 'consult_orthopedics_for_reduction_or_surgical_fixation' : displacement === 'significant' ? 'orthopedic_consultation_for_reduction' : 'splinting_and_follow_up',
    citation: CITATIONS.ACR_RAD,
  };
}

function pediatricXRayDose(input) {
  const { age_years, weight_kg, study_type, body_part, prior_xrays_in_study } = input;
  let reference_dose_msv = 0;
  if (study_type === 'chest_pa') reference_dose_msv = 0.04;
  else if (study_type === 'chest_lat') reference_dose_msv = 0.05;
  else if (study_type === 'skull') reference_dose_msv = 0.06;
  else if (study_type === 'abdomen') reference_dose_msv = 0.4;
  else if (study_type === 'pelvis') reference_dose_msv = 0.5;
  else if (study_type === 'spine_lumbar') reference_dose_msv = 0.7;
  const adjusted_dose = weight_kg < 30 ? reference_dose_msv * 0.6 : weight_kg > 70 ? reference_dose_msv * 1.4 : reference_dose_msv;
  return {
    study_type, age_years, weight_kg, estimated_dose_msv: adjusted_dose.toFixed(3),
    radiation_safety: ['use_pediatric_specific_protocols', 'shield_gonads_whenever_possible', 'consider_alternative_US_or_MRI_to_avoid_ionizing_radiation', 'ALARA_principle_as_low_as_reasonably_achievable'],
    cumulative_concern: prior_xrays_in_study && prior_xrays_in_study >= 3 ? 'consider_tracking_cumulative_dose_for_pediatric_patient' : 'low_concern_for_single_study',
    citation: CITATIONS.WHO_RAD,
  };
}

function foreignBodyLocalization(input) {
  const { suspected_fb_location, fb_visible, fb_size_cm, depth_from_skin, near_vessels_or_nerve } = input;
  return {
    fb_visible: fb_visible === 'yes',
    management: fb_visible === 'yes' ? (near_vessels_or_nerve === 'yes' ? 'image_guided_removal_surgical_consultation' : 'outpatient_removal_with_local_anesthesia') : 'consider_advanced_imaging_US_or_CT_or_MRI',
    depth_from_skin, fb_size_cm,
    pre_procedure_imaging: 'two_views_orthogonal_or_US_to_avoid_lost_FB',
    citation: CITATIONS.ACR_RAD,
  };
}

function lineTubePositioning(input) {
  const { line_type, position_correct } = input;
  let action = 'line_appropriately_positioned_use_clinically';
  if (position_correct === 'no') action = 'reposition_line_obtain_repeat_xray';
  return {
    line_type, position_correct, action,
    expected_positions: { CVC: 'cavoatrial_junction_or_svc_lower_one_third', PICC: 'lower_one_third_SVC', ETT: '3_to_5_cm_above_carina', NG_tube: 'gastric_body_below_diaphragm', chest_tube: 'in_pleural_space_anteriorly_for_pneumothorax_posteriorly_for_effusion' },
    citation: CITATIONS.ACR_RAD,
  };
}

module.exports = { chestXrayInterpretation, boneFractureAssessment, pediatricXRayDose, foreignBodyLocalization, lineTubePositioning, CITATIONS, ValidationError };