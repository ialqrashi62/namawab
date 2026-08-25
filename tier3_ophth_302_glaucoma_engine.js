/**
 * TIER3_OPHTH-302 Glaucoma Engine
 * IOP measurement + Angle-closure glaucoma acute + Open-angle glaucoma progression + Optic nerve cup-to-disc + Visual field defects (Humphrey)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_GL: 'AAO Glaucoma Preferred Practice 2024', EGS: 'European Glaucoma Society 2024' };

function iopMeasurement(input) {
  const { iop_value_mmhg, corneal_thickness_um, central_corneal_thickness, measurement_method, age_years } = input;
  let interpretation = 'normal_iop';
  if (iop_value_mmhg >= 30) interpretation = 'significantly_elevated_iop';
  else if (iop_value_mmhg >= 22) interpretation = 'elevated_iop_suspect_glaucoma';
  let corrected_iop = iop_value_mmhg;
  if (corneal_thickness_um && corneal_thickness_um < 500) corrected_iop = iop_value_mmhg - (520 - corneal_thickness_um) / 40;
  else if (corneal_thickness_um && corneal_thickness_um > 580) corrected_iop = iop_value_mmhg + (corneal_thickness_um - 540) / 40;
  return {
    iop_value_mmhg, central_corneal_thickness: corneal_thickness_um, measurement_method,
    interpretation,
    corrected_iop_mmhg: corrected_iop.toFixed(2),
    next_step: interpretation === 'significantly_elevated_iop' ? 'urgent_ophthalmology_consultation_for_target_iop_lowering_therapy' : interpretation === 'elevated_iop_suspect_glaucoma' ? 'ophthalmology_referral_within_2_to_4_weeks_for_full_glaucoma_workup' : 'continue_routine_monitoring',
    citation: CITATIONS.AAO_GL,
  };
}

function angleClosureGlaucomaAcute(input) {
  const { red_painful_eye, halos_around_lights, nausea_vomiting, mid_dilated_pupil, steamy_cornea, shallow_anterior_chamber, iop_value_mmhg, history_of_episodes } = input;
  const features_present = [red_painful_eye === 'yes', halos_around_lights === 'yes', nausea_vomiting === 'yes', mid_dilated_pupil === 'yes', steamy_cornea === 'yes', shallow_anterior_chamber === 'yes', iop_value_mmhg >= 30].filter(Boolean).length;
  let acuity = 'no_acute_angle_closure';
  if (features_present >= 3) acuity = 'acute_angle_closure_attack_in_progress';
  return {
    acute_attack: acuity === 'acute_angle_closure_attack_in_progress', features_present,
    iop_value_mmhg, immediate_management: ['topical_beta_blocker_timolol_0.5pct', 'topical_alpha_agonist_apraclonidine_or_brimonidine', 'topical_pilocarpine_2pct_once_iop_under_30', 'oral_or_IV_acetazolamide_500mg', 'topical_steroid_prednisolone_acetate_1pct_QID', 'definitive_laser_peripheral_iridotomy_within_24_to_48h'],
    procedure: 'laser_peripheral_iridotomy_or_surgical_iridectomy',
    fellow_eye_prophylaxis: 'yes_laser_peripheral_iridotomy_of_fellow_eye_to_prevent_future_attacks',
    citation: CITATIONS.EGS,
  };
}

function openAngleGlaucomaProgression(input) {
  const { baseline_iop, current_iop, visual_field_md_db, visual_field_progression_rate_db_per_year, optic_disc_cd_ratio, retinal_nerve_fiber_layer_thinning } = input;
  let progression_status = 'no_clear_progression';
  if (visual_field_progression_rate_db_per_year < -1 && (visual_field_md_db < -6 || optic_disc_cd_ratio >= 0.7)) progression_status = 'rapid_progression_aggressive_iop_lowering_needed';
  else if (visual_field_progression_rate_db_per_year < -0.5) progression_status = 'slow_progression_continue_monitoring_with_target_iop_review';
  let target_iop = baseline_iop - 25;
  if (visual_field_md_db < -6) target_iop = baseline_iop - 30;
  return {
    progression_status, target_iop: target_iop < 12 ? 'at_least_25_percent_reduction_from_baseline' : target_iop,
    current_iop, optic_disc_cd_ratio, retinal_nerve_fiber_layer_thinning,
    treatment_escalation: progression_status === 'rapid_progression_aggressive_iop_lowering_needed' ? ['maximize_topical_therapy', 'consider_selective_laser_trabeculoplasty', 'consider_MIGS_or_trabeculectomy_or_tube_shunt', 'reassess_target_iop_every_3_to_6_months'] : ['continue_current_therapy_Q3M_follow_up'],
    citation: CITATIONS.AAO_GL,
  };
}

function opticNerveCupToDisc(input) {
  const { vertical_cd_ratio, asymmetry, neuroretinal_rim_thinning, notching, disc_hemorrhage_present, rnfl_oct_thinning } = input;
  const suspected_glaucoma = vertical_cd_ratio >= 0.6 || asymmetry >= 0.2 || neuroretinal_rim_thinning === 'yes' || notching === 'yes' || disc_hemorrhage_present === 'yes' || rnfl_oct_thinning === 'yes';
  return {
    suspected_glaucomatous_damage: suspected_glaucoma, vertical_cd_ratio, asymmetry, neuroretinal_rim_thinning, notching, disc_hemorrhage_present,
    next_step: suspected_glaucoma ? 'visual_field_testing_and_oct_rnfl_then_oag_management' : 'continue_routine_monitoring',
    citation: CITATIONS.AAO_GL,
  };
}

function visualFieldHumphreyInterpretation(input) {
  const { md_db, psd_db, vfi_pct, glaucomatous_pattern_present, fixation_losses_pct, false_positives_pct, false_negatives_pct } = input;
  let reliability = 'reliable';
  if (fixation_losses_pct > 33 || false_positives_pct > 33 || false_negatives_pct > 33) reliability = 'unreliable_repeat_test';
  let interpretation = 'normal_visual_field';
  if (md_db < -6 || glaucomatous_pattern_present) interpretation = 'glaucomatous_visual_field_loss';
  if (md_db < -12) interpretation = 'severe_glaucomatous_loss';
  return {
    interpretation, reliability, md_db, psd_db, vfi_pct, glaucomatous_pattern_present,
    progression_check: 'compare_to_baseline_with_GPA_or_progressor_software',
    next_step: interpretation === 'severe_glaucomatous_loss' ? 'aggressive_iop_lowering_surgical_consultation' : interpretation === 'glaucomatous_visual_field_loss' ? 'target_iop_review_treatment_escalation' : 'continue_observation_Q6_to_12_months',
    citation: CITATIONS.AAO_GL,
  };
}

module.exports = { iopMeasurement, angleClosureGlaucomaAcute, openAngleGlaucomaProgression, opticNerveCupToDisc, visualFieldHumphreyInterpretation, CITATIONS, ValidationError };