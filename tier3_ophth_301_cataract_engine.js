/**
 * TIER3_OPHTH-301 Cataract / Anterior Segment Engine
 * Cataract grade (LOCS III) + Preoperative IOL calculation + Postoperative endophthalmitis + YAG capsulotomy + Dry eye (OSDI)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_CAT: 'AAO Cataract Preferred Practice 2024', ASCRS: 'ASCRS 2024' };

function cataractGradeLocsIii(input) {
  const { nuclear_opalescence, nuclear_color, cortical_cataract, posterior_subcapsular_cataract, visual_acuity_logmar } = input;
  let surgical_indication = false;
  if (visual_acuity_logmar >= 0.5 || (nuclear_opalescence >= 4) || posterior_subcapsular_cataract >= 2) surgical_indication = true;
  return {
    nuclear_opalescence, nuclear_color, cortical_cataract, posterior_subcapsular_cataract, visual_acuity_logmar,
    surgical_indication,
    functional_complaints_to_evaluate: ['difficulty_reading', 'difficulty_driving_night_glare', 'difficulty_with_daily_activities', 'requirement_for_lighting_change'],
    surgery_recommendation: surgical_indication ? 'cataract_extraction_with_IOL_implantation_phacoemulsification_preferred' : 'continue_monitoring_Q6_to_12_months',
    citation: CITATIONS.AAO_CAT,
  };
}

function preoperativeIolCalculation(input) {
  const { axial_length_mm, keratometry_k1_diopters, keratometry_k2_diopters, anterior_chamber_depth_mm, lens_thickness_mm, formula_choice } = input;
  let effective_k = (keratometry_k1_diopters + keratometry_k2_diopters) / 2;
  let estimated_iol = 0;
  if (formula_choice === 'SRK_T') {
    estimated_iol = 118.7 - 2.4 * axial_length_mm + 0.1 * effective_k;
  } else if (formula_choice === 'Holladay_1') {
    let h = 0.56 + (axial_length_mm - 23.5) / 30;
    if (h < 0) h = 0.2;
    estimated_iol = (1.31 * effective_k + 0.9 * effective_k) - 2.5 * axial_length_mm + 6.6;
  } else if (formula_choice === 'Barrett_Universal_II') {
    estimated_iol = (118.4 - 1.4 * axial_length_mm + 0.4 * effective_k);
  }
  return {
    axial_length_mm, keratometry_k1_diopters, keratometry_k2_diopters, anterior_chamber_depth_mm,
    formula_choice, estimated_iol_power_diopters: estimated_iol.toFixed(2),
    special_consideration: axial_length_mm >= 26 ? 'high_myopia_use_hoffer_Q_or_Wang_Koch_for_axial_length_correction' : axial_length_mm <= 22 ? 'high_hyperopia_use_Hoffer_Q' : 'standard_formula_acceptable',
    citation: CITATIONS.ASCRS,
  };
}

function postoperativeEndophthalmitis(input) {
  const { days_post_surgery, vision_loss_severity, hypopyon_present, vitritis_present, pain_severity, conjunctival_injection, fever_present } = input;
  let suspicion_level = 'low';
  if (hypopyon_present === 'yes' && vitritis_present === 'yes' && days_post_surgery <= 14) suspicion_level = 'acute_postoperative_endophthalmitis_high_suspicion';
  else if (days_post_surgery > 14 && pain_severity === 'mild' && vision_loss_severity === 'mild') suspicion_level = 'consider_chronic_endophthalmitis';
  return {
    suspicion_level, days_post_surgery, vision_loss_severity, hypopyon_present, vitritis_present,
    immediate_management: suspicion_level === 'acute_postoperative_endophthalmitis_high_suspicion' ? ['urgent_vitreous_tap_and_intravitreal_antibiotics_vancomycin_and_ceftazidime', 'consider_vitrectomy_if_va_light_perception_or_worse', 'topical_atropine_and_steroid_QID', 'systemic_moxifloxacin_optional'] : ['observation_with_close_follow_up_Q1_to_3_days'],
    citation: CITATIONS.ASCRS,
  };
}

function yagCapsulotomyDecision(input) {
  const { months_post_cataract_surgery, posterior_capsule_opacification_present, vision_decline_logmar, glare_severity } = input;
  let yag_indicated = false;
  if (posterior_capsule_opacification_present === 'yes' && vision_decline_logmar >= 0.2 && glare_severity >= 1) yag_indicated = true;
  return {
    yag_capsulotomy_indicated: yag_indicated, months_post_cataract_surgery, posterior_capsule_opacification_present,
    procedure: 'Nd_YAG_laser_capsulotomy_with_Q_switched',
    post_procedure: ['topical_steroid_QID_x_1_week', 'topical_NSAID_QID_x_1_week', 'check_iop_1h_post_procedure_then_Q1_week', 'monitor_for_retinal_detachment_with_warnings_of_new_floaters_or_flashes'],
    citation: CITATIONS.AAO_CAT,
  };
}

function dryEyeOsdi(input) {
  const { osdi_score, schirmer_test_mm, tear_film_break_up_time_seconds, corneal_staining, symptoms } = input;
  let severity = 'normal';
  if (osdi_score >= 33) severity = 'severe_dry_eye';
  else if (osdi_score >= 23) severity = 'moderate_dry_eye';
  else if (osdi_score >= 13) severity = 'mild_dry_eye';
  return {
    osdi_score, severity, schirmer_test_mm, tear_film_break_up_time_seconds, corneal_staining,
    treatment: severity === 'severe_dry_eye' ? ['artificial_tears_q1h', 'cyclosporine_or_lifitegrast_drop_BID', 'punctal_plugs', 'consider_omega_3_fatty_acids', 'warm_compresses'] : severity === 'moderate_dry_eye' ? ['artificial_tears_QID', 'warm_compresses', 'consider_cyclosporine_or_lifitegrast', 'environmental_modifications'] : severity === 'mild_dry_eye' ? ['artificial_tears_prn', 'warm_compresses'] : 'no_treatment_needed',
    citation: CITATIONS.AAO_CAT,
  };
}

module.exports = { cataractGradeLocsIii, preoperativeIolCalculation, postoperativeEndophthalmitis, yagCapsulotomyDecision, dryEyeOsdi, CITATIONS, ValidationError };