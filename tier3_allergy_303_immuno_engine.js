/**
 * TIER3_ALLERGY-303 Immunodeficiency Engine
 * Recurrent infection screening (Jeffrey Modell criteria) + Specific antibody deficiency + CVID diagnosis + SCID newborn screening + Ig replacement therapy planning
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { JMF: 'Jeffrey Modell Foundation 2024', AAAAI_PID: 'AAAAI Primary Immunodeficiency 2024' };

function recurrentInfectionScreening(input) {
  const { recurrent_otitis_count, recurrent_sinususitis_count, recurrent_gi_infections, severe_viral_infections, opportunistic_infections, failure_to_thrive, family_history_pid } = input;
  let warning_signs_present = false;
  if (recurrent_otitis_count >= 4 || recurrent_sinususitis_count >= 2 || opportunistic_infections === 'yes' || failure_to_thrive === 'yes' || family_history_pid === 'yes') warning_signs_present = true;
  let workup = 'CBC_with_differential_immunoglobulin_panel_IgG_IgA_IgM';
  if (warning_signs_present) workup += '_specific_antibody_responses_to_vaccines_lymphocyte_subset_panel';
  return {
    warning_signs_present, workup,
    jmf_warning_signs: ['4_or_more_ear_infections_within_1_year', '2_or_more_serious_sinus_infections_within_1_year', '2_or_more_pneumonia_within_1_year', 'persistent_diapers_oral_thrush_or_skin_infections', 'recurrent_infections_with_unusual_or_organism', 'family_history_of_primary_immunodeficiency'],
    next_step: warning_signs_present ? 'refer_to_clinical_immunologist_for_full_PID_workup' : 'continue_routine_care',
    citation: CITATIONS.JMF,
  };
}

function specificAntibodyDeficiency(input) {
  const { iga_level, igg_level, igm_level, response_to_pneumococcal_vaccine, response_to_hib_vaccine, recurrent_encapsulated_infections } = input;
  let sad_likely = false;
  if (igg_level >= 200 && response_to_pneumococcal_vaccine === 'poor' && recurrent_encapsulated_infections === 'yes') sad_likely = true;
  return {
    sad_likely: sad_likely, iga_level, igg_level, igm_level, response_to_pneumococcal_vaccine,
    diagnosis: 'Specific_antibody_deficiency_with_normal_immunoglobulins_if_criteria_met',
    treatment: ['consider_antibiotic_prophylaxis_amoxicillin_or_trimethoprim_sulfa', 'vaccination_against_encapsulated_organisms_pneumococcal_HiB_meningococcal', 'consider_IVIG_or_SCIG_if_severe_or_recurrent_pneumonia_or_infections'],
    citation: CITATIONS.AAAAI_PID,
  };
}

function cvidDiagnosis(input) {
  const { ige_age_adjusted_low, recurrent_bacterial_infections, autoimmune_manifestation, granulomatous_disease, malignancy, igg_low_2_times_low, response_to_vaccines } = input;
  let cvid_likely = false;
  if (igg_low_2_times_low === 'yes' && recurrent_bacterial_infections === 'yes' && response_to_vaccines === 'poor' && ige_age_adjusted_low === 'yes') cvid_likely = true;
  return {
    cvid_likely,
    diagnostic_criteria: ['markedly_reduced_serum_IgG_and_IgA_or_IgM', 'onset_after_age_2', 'poor_response_to_vaccines', 'exclusion_of_other_causes_of_hypogammaglobulinemia'],
    monitoring: ['CBC_Q3_to_6M', 'immunoglobulin_levels_Q3M', 'annual_pulmonary_function', 'annual_liver_and_kidney_function', 'annual_screening_for_lymphoma_and_gastric_cancer', 'consider_chest_CT_Q2_to_5Y_for_ILD'],
    complications: ['autoimmune_cytopenias', 'granulomatous_disease', 'increased_risk_of_lymphoma_and_gastric_cancer'],
    citation: CITATIONS.AAAAI_PID,
  };
}

function scidNewbornScreening(input) {
  const { trec_count_result, lymphocyte_subset_panel, family_history_scid, age_at_presentation, severe_infections_present } = input;
  let scid_suspected = false;
  if (trec_count_result === 'low_or_absent' || family_history_scid === 'yes' || (severe_infections_present === 'yes' && age_at_presentation < 12)) scid_suspected = true;
  return {
    scid_suspected, trec_count_result,
    immediate_action: scid_suspected ? ['urgent_immunology_consultation', 'isolate_patient_avoid_live_vaccines', 'IVIG_replacement_immediately', 'PCP_prophylaxis_trimethoprim_sulfa', 'antifungal_prophylaxis_fluconazole', 'hematopoietic_stem_cell_transplantation_evaluation'] : 'continue_routine_care',
    diagnostic_workup: ['repeat_TREC', 'lymphocyte_subset_CD3_CD4_CD8_CD19_CD16_CD56', 'T_cell_function_PHA_proliferation', 'KREHM_recombination_recombination_excision_circles', 'specific_gene_testing_based_on_subtype'],
    citation: CITATIONS.AAAAI_PID,
  };
}

function igReplacementPlanning(input) {
  const { indication, weight_kg, igg_trough_target, current_route_ivig_or_scig } = input;
  let monthly_dose_g = 0.4 * weight_kg;
  if (ig_label_brand === 'specific_high_concentration') monthly_dose_g = 0.6 * weight_kg;
  return {
    indication, monthly_dose_g: monthly_dose_g.toFixed(2),
    ivig_schedule: 'every_3_to_4_weeks_dose_divided_over_3_to_5_days',
    scig_schedule: 'weekly_or_biweekly_subcutaneous_self_administration_at_home',
    monitoring: ['pre_and_post_IgG_levels_Q3M_dose_adjustment', 'CBC_Q3M', 'liver_function_Q6M', 'clinical_response_infections_Q3M'],
    citation: CITATIONS.AAAAI_PID,
  };
}

module.exports = { recurrentInfectionScreening, specificAntibodyDeficiency, cvidDiagnosis, scidNewbornScreening, igReplacementPlanning, CITATIONS, ValidationError };