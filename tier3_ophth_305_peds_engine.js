/**
 * TIER3_OPHTH-305 Pediatric / Strabismus / Vision Screening Engine
 * Pediatric vision screening + Amblyopia risk factors + Strabismus evaluation + Pediatric cataract + Retinoblastoma screening (red reflex)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_PEDS: 'AAO Pediatric Ophthalmology 2024', AAPOS: 'AAPOS 2024' };

function pediatricVisionScreening(input) {
  const { age_years, unaided_va_od, unaided_va_os, glasses_va_od, glasses_va_os, stereoacuity_seconds, color_vision_normal, screening_method } = input;
  const refer_ophthalmology = (unaided_va_od <= 0.4 && unaided_va_os <= 0.4) || Math.abs(unaided_va_od - unaided_va_os) >= 0.2 || stereoacuity_seconds >= 60 || color_vision_normal === 'no';
  return {
    age_years, screening_method, unaided_va_od, unaided_va_os, glasses_va_od, glasses_va_os,
    referral_indicated: refer_ophthalmology,
    next_step: refer_ophthalmology ? 'refer_to_pediatric_ophthalmology_within_2_to_4_weeks' : 'continue_routine_monitoring_Q12M_for_asymptomatic',
    citation: CITATIONS.AAPOS,
  };
}

function amblyopiaRiskFactors(input) {
  const { anisometropia_diopters, astigmatism_diopters, hyperopia_diopters, esotropia_present, exotropia_present, previous_treatment_for_amblyopia, age_at_detection_years } = input;
  let risk = 'low_risk';
  if (anisometropia_diopters >= 1 || astigmatism_diopters >= 1.5 || esotropia_present === 'yes' || (age_at_detection_years <= 7 && hyperopia_diopters >= 4)) risk = 'moderate_to_high_risk';
  return {
    risk, anisometropia_diopters, astigmatism_diopters, hyperopia_diopters, esotropia_present,
    treatment: risk === 'moderate_to_high_risk' ? ['full_correction_with_glasses', 'consider_part_time_occlusion_for_amblyopia', 'penalization_atropine_for_children_with_compliance_issues', 'treatment_until_visual_development_complete_age_8_to_10'] : 'observation_Q12M_with_visual_development',
    critical_period: 'treatment_most_effective_before_age_7_then_outcomes_diminish_significantly',
    citation: CITATIONS.AAO_PEDS,
  };
}

function strabismusEvaluation(input) {
  const { eye_misalignment, deviation_pattern, prism_diopters, fusion_present, stereopsis_present, age_of_onset_years, double_vision_present } = input;
  let management = 'continue_observation_Q6M';
  if (prism_diopters >= 15 && eye_misalignment === 'constant') management = 'strabismus_surgery_indicated';
  else if (prism_diopters >= 10 && fusion_present === 'no') management = 'strabismus_surgery_indicated_to_restore_binocularity';
  else if (prism_diopters >= 6 && age_of_onset_years < 7) management = 'glasses_then_consider_surgery_to_prevent_amblyopia';
  else management = 'continue_observation_or_glasses_only';
  return {
    management, deviation_pattern, prism_diopters, fusion_present, age_of_onset_years,
    next_step: management.includes('surgery') ? 'strabismus_surgery_planning_with_bilateral_or_unilateral_recession_resection' : 'continue_glasses_Q6M_follow_up',
    citation: CITATIONS.AAPOS,
  };
}

function pediatricCataract(input) {
  const { cataract_unilateral_or_bilateral, age_at_diagnosis_months, visual_development_impact, leukocoria_present, family_history, associated_systemic_disease } = input;
  let surgery_indicated = false;
  if (visual_development_impact === 'yes' || age_at_diagnosis_months < 72) surgery_indicated = true;
  return {
    surgery_indicated, leukocoria_present, cataract_unilateral_or_bilateral, family_history,
    surgery_timing: age_at_diagnosis_months < 6 ? 'urgent_surgery_within_weeks_to_prevent_visual_development_deficit' : age_at_diagnosis_months < 24 ? 'early_surgery_to_prevent_amblyopia' : 'observation_then_surgery_if_visual_significant',
    post_op_care: ['correct_with_IOL_or_contact_lens', 'patching_for_amblyopia_in_unilateral', 'long-term_follow_up_for_glaucoma_PCO_and_myopic_shift'],
    citation: CITATIONS.AAO_PEDS,
  };
}

function retinoblastomaScreening(input) {
  const { leukocoria_present, family_history, age_at_onset_months, fundus_exam_findings, rb1_gene_test } = input;
  let suspected = false;
  if (leukocoria_present === 'yes' && family_history === 'positive') suspected = true;
  if (fundus_exam_findings === 'endophytic_or_exophytic_mass') suspected = true;
  return {
    retinoblastoma_suspected: suspected,
    next_step: suspected ? 'urgent_referral_to_pediatric_ophthalmologist_and_ocular_oncologist_within_24_to_48h_genetic_counseling_and_MRI_orbits' : 'continue_routine_monitoring_for_at_risk_cases_with_serially_oae_and_fundus_exam_under_anesthesia',
    genetic_testing: family_history === 'positive' ? 'yes_rb1_germline_testing_for_probands_and_siblings' : 'individualized_decision',
    treatment_options: ['enucleation_for_advanced_disease', 'intravenous_chemotherapy_for_bilateral_or_conservative', 'intra_arterial_chemo_for_late_stage_unilateral', 'laser_cryotherapy_or_plaque_brachytherapy_for_localized'],
    citation: CITATIONS.AAO_PEDS,
  };
}

module.exports = { pediatricVisionScreening, amblyopiaRiskFactors, strabismusEvaluation, pediatricCataract, retinoblastomaScreening, CITATIONS, ValidationError };