/**
 * TIER3_ALLERGY-304 Anaphylaxis Emergency Engine
 * Acute anaphylaxis treatment + Biphasic anaphylaxis risk + Mastocytosis + Allergen immunotherapy + Mast cell disorders
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WAO: 'World Allergy Organization 2024', NIAID: 'NIAID Food Allergy 2024' };

function acuteAnaphylaxisTreatment(input) {
  const { trigger_known, time_since_onset_minutes, systolic_bp, respiratory_symptoms, airway_involvement, history_of_prior_anaphylaxis, biphasic_history } = input;
  let severity = 'moderate';
  if (systolic_bp < 90 || airway_involvement === 'laryngeal_or_upper_airway') severity = 'severe_life_threatening';
  return {
    severity, treatment: ['IM_epinephrine_0.3_to_0.5mg_in_mid_anterolateral_thigh_adult_or_0.01mg_per_kg_pediatric_max_0.3mg_repeat_Q5_to_15min_if_no_improvement', 'remove_trigger_immediate', 'high_flow_supplemental_O2', 'large_bore_IV_access_2_lines', 'IV_normal_saline_1L_bolus_adult_or_20mL_per_kg_pediatric', 'second_line_IV_diphenhydramine_25_to_50mg_adult_or_1mg_per_kg_pediatric', 'nebulized_albuterol_for_lower_airway_symptoms', 'methylprednisolone_60_to_125mg_IV', 'glucagon_1_to_5mg_IV_for_refractory_hypotension_in_beta_blocker_patients'],
    observation_duration: biphasic_history === 'yes' ? 'observe_Q4_to_24h' : 'observe_Q4_to_8h_with_discharge_with_epinephrine_auto_injector',
    disposition: severity === 'severe_life_threatening' ? 'admit_to_ICU_or_step_down' : 'discharge_with_epinephrine_2_auto_injectors_and_follow_up_with_allergist',
    citation: CITATIONS.WAO,
  };
}

function biphasicAnaphylaxisRisk(input) {
  const { initial_severity, delayed_epinephrine_admin, oral_symptom_dominant, biphasic_history, antihistamine_use_only } = input;
  let biphasic_risk = 'low';
  if (initial_severity === 'severe' || delayed_epinephrine_admin === 'yes' || biphasic_history === 'yes') biphasic_risk = 'increased_risk';
  if (antihistamine_use_only === 'yes') biphasic_risk = 'high_risk_due_to_inadequate_initial_treatment';
  return {
    biphasic_risk,
    observation_recommendation: biphasic_risk === 'high_risk_due_to_inadequate_initial_treatment' ? 'observe_Q12_to_24h' : biphasic_risk === 'increased_risk' ? 'observe_Q8_to_12h' : 'observe_Q4_to_8h',
    criteria_for_extended_observation: ['severe_initial_symptoms', 'delayed_epinephrine_administration', 'previous_biphasic_history', 'symptom_onset_after_discharge'],
    citation: CITATIONS.WAO,
  };
}

function mastocytosisAssessment(input) {
  const { trigger_episode, ur_ticaria_pigmentosa_present, tryptase_level, recurrent_anaphylaxis_episodes, flushing_pruritus_episodes, bone_pain_or_fractures } = input;
  let suspected = false;
  if (ur_ticaria_pigmentosa_present === 'yes' || tryptase_level >= 20 || recurrent_anaphylaxis_episodes === 'yes') suspected = true;
  return {
    suspected_mastocytosis: suspected, tryptase_level,
    workup: ['serum_trypase_at_baseline_Q1_to_3M', 'bone_marrow_biopsy_with_KIT_D816V_mutation_testing', 'skin_biopsy_of_urticaria_pigmentosa_lesion', 'consider_bone_density_study'],
    treatment: ['epinephrine_auto_injector_for_all_patients', 'avoid_triggers_heat_alcohol_nsaid_opiates_if_individual_tolerance', 'oral_H1_and_H2_antihistamine_BID_QID', 'omalizumab_for_recurrent_episodes', 'midostaurin_or_avapritinib_for_advanced_systemic_mastocytosis'],
    citation: CITATIONS.WAO,
  };
}

function allergenImmunotherapy(input) {
  const { allergen_type, sensitivity_confirmed, age_years, asthma_status, adherence_to_long_term_therapy, allergic_rhinitis_severity } = input;
  let candidate = false;
  if (sensitivity_confirmed === 'yes' && age_years >= 5 && age_years <= 65 && asthma_status === 'well_controlled_or_no_asthma') candidate = true;
  return {
    candidate, allergen_type, allergic_rhinitis_severity,
    types: ['subcutaneous_immunotherapy_SCIT_classic', 'sublingual_immunotherapy_SLIT_approved_for_grass_and_ragweed_pollen_and_house_dust_mite', 'oral_immunotherapy_OIT_for_food_allergens_peanut'],
    duration_years: '3_to_5_years_typical_then_assess_for_discontinuation',
    efficacy: 'highly_effective_for_venom_insect_allergy_95pct_efficacy_for_allergic_rhinitis_50_to_70pct_for_asthma',
    safety: 'administer_in_office_with_30min_observation_for_SCIT_first_dose', citation: CITATIONS.NIAID,
  };
}

function mastCellDisorderWorkup(input) {
  const { recurrent_urticaria, flushing, abdominal_pain, episodic_hypotension, tryptase_baseline, response_to_antihistamines, anaphylaxis_episodes_count } = input;
  let workup = ['CBC_with_differential', 'comprehensive_metabolic_panel', '24_hour_urinary_prostaglandin_D2_and_11_beta_prostaglandin_F2_alpha', 'plasma_tryptase_at_baseline'];
  let diagnosis = 'chronic_spontaneous_urticaria';
  if (anaphylaxis_episodes_count >= 3 && response_to_antihistamines === 'partial') diagnosis = 'consider_mast_cell_activation_syndrome_or_hereditary_alpha_tryptasemia';
  return {
    diagnosis, workup,
    criteria_for_MCAS: ['recurrent_episodes_of_systemic_symptoms_attributable_to_mast_cell_activation', 'elevated_mast_cell_mediators_during_episodes', 'response_to_mast_cell_stabilizer_or_blocker', 'exclusion_of_other_causes'],
    treatment: ['H1_and_H2_antihistamine_QID', 'montelukast_10mg_daily', 'omalizumab_300mg_Q4W_for_refractory_chronic_urticaria', 'cyclosporine_as_last_resort'],
    citation: CITATIONS.WAO,
  };
}

module.exports = { acuteAnaphylaxisTreatment, biphasicAnaphylaxisRisk, mastocytosisAssessment, allergenImmunotherapy, mastCellDisorderWorkup, CITATIONS, ValidationError };