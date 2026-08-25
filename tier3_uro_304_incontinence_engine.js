/**
 * TIER3_URO-304 Incontinence / Pelvic Floor Engine
 * Stress incontinence + Urge incontinence (OAB) + Mixed incontinence + Pelvic organ prolapse (POP-Q) + Pelvic floor therapy planning
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AUA_INC: 'AUA Incontinence 2024', AUGS: 'AUGS Pelvic Floor 2024' };

function stressUrinaryIncontinence(input) {
  const { leakage_with_cough_sneeze_laughing, prior_pregnancy_vaginal_delivery_count, menopausal_status, pelvic_surgery_history, urethral_hypermobility_signs } = input;
  let severity = 'mild_stress_incontinence';
  if (leakage_with_cough_sneeze_laughing === 'yes' && urethral_hypermobility_signs === 'yes' && prior_pregnancy_vaginal_delivery_count >= 2) severity = 'moderate_stress_incontinence';
  return {
    severity, leakage_with_cough_sneeze_laughing,
    first_line_therapy: ['pelvic_floor_muscle_training_Kegel_exercises_with_or_without_biofeedback_x_12_weeks', 'weight_loss_for_overweight_patients', 'topical_vaginal_estrogen_for_postmenopausal_women'],
    second_line_therapy: 'pessary_or_midurethral_sling_for_moderate_severe_after_failed_first_line',
    third_line_therapy: 'consider_bulking_agent_injection_or_artificial_urinary_sphincter_for_severe',
    surgery_recommendation: severity === 'moderate_stress_incontinence' ? 'midurethral_sling_surgery_or_revocare_bulking_agent_for_midurethral_considerations' : 'continue_first_line_therapy_with_follow_up_Q3_months',
    citation: CITATIONS.AUA_INC,
  };
}

function urgeIncontinenceOab(input) {
  const { urgency_episodes_per_day, nocturia_per_night, urge_incontinence_episodes, sensory_urgency, pelvic_floor_dysfunction, neurologic_disease } = input;
  let severity = 'mild_oab';
  if (urge_incontinence_episodes >= 3 || nocturia_per_night >= 3) severity = 'moderate_oab';
  if (urgency_episodes_per_day >= 10 || urge_incontinence_episodes >= 5) severity = 'severe_oab';
  return {
    severity, urgency_episodes_per_day, urge_incontinence_episodes,
    first_line_therapy: ['bladder_training_scheduled_voiding_with_Q1_to_2_h_intervals', 'pelvic_floor_exercises', 'fluid_management_reduce_bladder_irritants_caffeine_alcohol_carbonated_beverages_spicy_foods', 'weight_loss'],
    second_line_therapy: 'antimuscarinic_oxybutynin_or_tolterodine_or_trospium_or_solifenacin_or_darifenacin',
    third_line_therapy: 'beta_3_agonist_mirabegron_or_vibegron_first_line_for_elderly_to_avoid_anticholinergic_side_effects',
    fourth_line_therapy: 'sacral_neuromodulation_interstim_or_posterior_tibial_nerve_stimulation_or_onabotulinumtoxin_a_100_to_200u_intradetrusor_injection_every_6_to_12_months',
    contraindications: neurologic_disease === 'spinal_cord_injury_or_MS' ? 'caution_with_antimuscarinic_due_to_retention_risk' : 'standard',
    citation: CITATIONS.AUA_INC,
  };
}

function mixedIncontinence(input) {
  const { urge_component, stress_component, dominant_component, prior_treatment_attempts } = input;
  let plan = 'treat_dominant_component_first_then_address_other';
  if (dominant_component === 'urge' && prior_treatment_attempts === 'no') plan = 'begin_OAB_first_line_treatment_then_re_evaluate_in_3_months_for_stress_component';
  if (dominant_component === 'stress' && prior_treatment_attempts === 'no') plan = 'begin_pelvic_floor_training_then_re_evaluate_in_3_months_for_urge_component';
  return {
    dominant_component, plan,
    pelvic_floor_training: 'always_for_both_components_x_12_weeks_with_re_evaluation',
    refractory_management: 'multimodal_combined_OAB_drug_plus_stress_incontinence_surgery_in_selected',
    citation: CITATIONS.AUA_INC,
  };
}

function pelvicOrganProlapse(input) {
  const { anterior_compartment_prolapse, posterior_compartment_prolapse, apical_vaginal_prolapse, symptomatic_severity, sexual_dysfunction, prior_hysterectomy, constipation } = input;
  let pop_q_stage = 'stage_0_or_1';
  if (anterior_compartment_prolapse === 'yes' && posterior_compartment_prolapse === 'no' && apical_vaginal_prolapse === 'no') pop_q_stage = 'anterior_stage_2';
  return {
    pop_q_stage, anterior_compartment_prolapse, posterior_compartment_prolapse, apical_vaginal_prolapse,
    treatment: 'stage_0_or_1_observe_stage_2_pessary_or_reconstructive_surgery_stage_3_or_4_reconstructive_surgery',
    surgical_options: ['anterior_colporrhaphy_for_anterior_compartment', 'posterior_colporrhaphy_with_perineorrhaphy_for_posterior_compartment', 'vaginal_apical_suspension_with_sacrospinous_fixation_or_uterosacral_ligament_suspension', 'colpocleisis_for_advanced_in_elderly_no_sexual_activity'],
    conservative_options: ['pelvic_floor_muscle_training', 'pessary_fitting_ring_or_Gellhorn', 'weight_loss_and_constipation_management'],
    citation: CITATIONS.AUGS,
  };
}

function pelvicFloorTherapyPlanning(input) {
  const { primary_diagnosis_incontinence_prolapse_pain, severity_level, prior_treatment_history, patient_commitment, contraindication_to_exercise } = input;
  let plan = 'supervised_pelvic_floor_training_x_12_weeks_with_weekly_sessions_then_maintenance';
  if (severity_level === 'severe') plan = 'supervised_pelvic_floor_with_biofeedback_then_electrical_stimulation_then_re_evaluate';
  return {
    plan, primary_diagnosis_incontinence_prolapse_pain,
    sessions_per_week: 1,
    duration_weeks: 12,
    adjuncts: ['biofeedback_for_difficulty_isolating_pelvic_floor', 'electrical_stimulation_for_poor_motor_control', 'vaginal_weight_training_or_cones'],
    contraindications: contraindication_to_exercise === 'yes' ? 'modify_exercise_intensity_use_passive_techniques_or_biofeedback_only' : 'no_contraindication',
    success_rate: 'pelvic_floor_training_improves_cure_rate_60_to_80pct_for_mild_to_moderate_stress_incontinence',
    citation: CITATIONS.AUGS,
  };
}

module.exports = { stressUrinaryIncontinence, urgeIncontinenceOab, mixedIncontinence, pelvicOrganProlapse, pelvicFloorTherapyPlanning, CITATIONS, ValidationError };