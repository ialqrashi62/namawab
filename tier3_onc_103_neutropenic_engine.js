/**
 * TIER3_ONC-103 Febrile Neutropenia Engine
 * FN risk assessment + Empiric antibiotics + G-CSF prophylaxis + Antibiotic prophylaxis + Source documentation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { IDSA_FN: 'IDSA Febrile Neutropenia 2010', NCCN_FN: 'NCCN FN Prevention and Treatment 2024' };

function febrileNeutropeniaRiskAssessment(input) {
  const { temperature_celsius, anc_cells_per_mm3, anticipated_chemo_regimen, performance_status, age_above_65, prior_fn_episode, comorbidity_infection_open_wound, planned_cycle_risk_factor } = input;
  let diagnosis = 'febrile_neutropenia_with_temperature_above_38.3_or_above_38_sustained_with_ANC_below_500_or_below_1000_predicted_decline';
  let risk_category = 'low_risk_MASCC_greater_than_21';
  if (planned_cycle_risk_factor === 'high_greater_than_20pct') risk_category = 'HIGH_risk_cycle_per_regimen_specific_neutropenia_risk_GCSF_prophylaxis_indicated';
  if (planned_cycle_risk_factor === 'intermediate_10_to_20pct') risk_category = 'intermediate_risk_consider_individual_factors_GCSF_per_protocol';
  let mascc_score = 21;
  if (age_above_65 === 'yes') mascc_score -= 2;
  if (performance_status === 'ECOG_2_or_more') mascc_score -= 2;
  if (comorbidity_infection_open_wound === 'yes') mascc_score -= 2;
  if (prior_fn_episode === 'yes') mascc_score -= 4;
  return {
    diagnosis, risk_category, mascc_score,
    mascc_scoring: 'low_risk_MASCC_greater_than_or_equal_to_21_high_risk_less_than_21_eligible_for_oral_antibiotics_versus_IV_inpatient',
    workup: ['CBC_with_differential_Q_day_CMP_lactate', 'blood_cultures_x_2_sets_before_antibiotics', 'urine_culture_if_symptoms', 'chest_Xray_for_respiratory_symptoms', 'skin_wound_or_line_culture_if_present'],
    citation: CITATIONS.IDSA_FN,
  };
}

function empiricAntibioticTherapy(input) {
  const { anc_cells_per_mm3, temperature, prior_antibiotic_use, hospital_acquired_suspicion, mrsa_risk, pseudomonas_risk, prior_mdr_organism, penicillin_allergy_severity, hemodynamic_instability, mucositis_present, diarrhea_present, line_present } = input;
  let first_line = 'cefepime_2g_IV_Q8h_monotherapy_for_high_risk_FN_no_complications';
  if (hemodynamic_instability === 'yes') first_line = 'cefepime_or_imipenem_cilastatin_or_meropenem_PLUS_vancomycin_for_sepsis_or_pneumonia_or_skin_soft_tissue_or_line_infection';
  if (penicillin_allergy_severity === 'severe_cephalosporin_cross_reactivity_concern') first_line = 'aztreonam_PLUS_vancomycin_or_ciprofloxacin_PLUS_vancomycin_for_severe_penicillin_allergy';
  if (prior_mdr_organism === 'pseudomonas' || hospital_acquired_suspicion === 'yes') first_line = 'antipseudomonal_beta_lactam_cefepime_imipenem_meropenem_or_piperacillin_tazobactam_with_local_antibiogram_review';
  let second_line_addition = [];
  if (mucositis_present === 'yes') second_line_addition.push('consider_vancomycin_for_oral_mucositis_or_stomatitis_with_anerobic_coverage_metronidazole');
  if (diarrhea_present === 'yes') second_line_addition.push('consider_C_difficile_testing_and_add_oral_vancomycin_or_metronidazole_for_CDI');
  if (line_present === 'yes') second_line_addition.push('consider_vancomycin_for_line_infection_or_catheter_related_bacteremia');
  return {
    first_line, second_line_addition,
    duration: 'continue_IV_antibiotics_until_ANC_greater_than_500_and_afebrile_24h_then_oral_completion_if_culture_documented_stable',
    monitoring: 'temperature_Q4h_blood_pressure_Q4h_CRP_Q2_to_3_days_imaging_Q48h_if_no_improvement',
    citation: CITATIONS.IDSA_FN,
  };
}

function gCsfProphylaxis(input) {
  const { chemo_regimen_risk_pct, age_above_65, prior_fn_episode, performance_status, planned_cycles, primary_prophylaxis_indicated, secondary_prophylaxis_indicated } = input;
  let plan = 'primary_prophylaxis_with_pegfilgrastim_6mg_subcutaneous_24h_after_each_chemo_cycle_for_high_risk_regimen_greater_than_20pct';
  if (secondary_prophylaxis_indicated === 'yes') plan = 'secondary_prophylaxis_with_pegfilgrastim_after_prior_FN_documented_episode_or_dose_delay_due_to_neutropenia';
  if (chemo_regimen_risk_pct < 10) plan = 'no_GCSF_routine_individual_consider_for_elderly_or_comorbidities';
  let choice = 'pegfilgrastim_6mg_subcutaneous_24h_after_chemo_or_filgrastim_5mcg_per_kg_daily_until_post_nadir_recovery';
  return {
    plan, choice,
    indications: ['primary_prophylaxis_regimen_risk_greater_than_20pct', 'regimen_risk_10_to_20pct_with_age_above_65_or_performance_status_2_or_more_or_extensive_prior_chest_radiation', 'secondary_prophylaxis_after_documented_FN', 'chemo_dose_intensity_reduction_unsuitable_in_curative_intent'],
    side_effects: ['bone_pain_managed_with_acetaminophen_or_naproxen', 'rare_splenomegaly_splenic_rupture', 'rare_aplastic_anemia_or_alveolar_proteinosis'],
    citation: CITATIONS.NCCN_FN,
  };
}

function antibioticProphylaxisNeutropenic(input) {
  const { anc_expected_below_100, expected_duration_neutropenia_days, prior_quinolone_tolerance, fluoroquinolone_resistance_local, mucositis_present } = input;
  let plan = 'no_routine_antibiotic_prophylaxis_for_low_risk_neutropenia_short_duration';
  if (expected_duration_neutropenia_days >= 7) plan = 'consider_levofloxacin_500mg_daily_for_prophylaxis_during_neutropenia_with_local_resistance_consideration';
  if (fluoroquinolone_resistance_local === 'above_20pct') plan = 'avoid_quinolone_prophylaxis_risk_of_resistance_doesnt_outweigh_benefit';
  let antifungals = 'consider_fluconazole_or_posaconazole_for_high_risk_hematologic_malignancy_with_prolonged_neutropenia';
  if (mucositis_present === 'yes') antifungals = antifungals + '_and_consider_chlorhexidine_oral_rinse';
  return {
    plan, antifungals,
    prophylaxis_when_avoid: 'low_risk_short_neutropenia_oral_chlorhexidine_rinse_alone_hand_hygiene_food_safety',
    monitoring: 'evaluate_for_breakthrough_infection_antibiotic_resistance_Q48h_culture_Q48h',
    citation: CITATIONS.NCCN_FN,
  };
}

function sourceDocumentationCulture(input) {
  const { suspected_source, blood_culture_x2_drawn, urine_culture_ordered, sputum_culture_if_symptoms, skin_wound_culture, line_culture_drawn, imaging_chest_xray_abdomen_pelvis, atypical_pathogens_suspected, fungal_workup_needed, viral_workup_needed } = input;
  let plan = 'two_sets_blood_cultures_peripheral_and_line_if_present_within_30_min_before_antibiotics';
  let additional_cultures = [];
  if (urine_culture_ordered === 'symptomatic' || suspected_source === 'uti') additional_cultures.push('urine_culture_with_urinalysis');
  if (sputum_culture_if_symptoms === 'yes') additional_cultures.push('sputum_gram_stain_and_culture_with_respiratory_panel_if_indicated');
  if (line_culture_drawn === 'yes_line_infection_suspected') additional_cultures.push('line_blood_culture_pairs_peripheral_and_line_with_differential_time_to_positivity');
  if (skin_wound_culture === 'yes') additional_cultures.push('wound_culture_with_gram_stain');
  if (atypical_pathogens_suspected === 'yes') additional_cultures.push('galactomannan_aspergillus_PCR_respiratory_viral_panel_consider_HSV_VZV_CMV_blood_PCR');
  if (fungal_workup_needed === 'yes') additional_cultures.push('serum_galactomannan_and_beta_D_glucan_for_invasive_fungal_aspergillus_candida');
  if (viral_workup_needed === 'yes') additional_cultures.push('respiratory_viral_PCR_panel_including_SARS_CoV_2_RSV_influenza_adenovirus');
  return {
    plan, additional_cultures,
    imaging: 'chest_Xray_for_respiratory_CT_chest_for_normal_Xray_with_respiratory_symptoms_CT_abdomen_pelvis_for_abdominal_source',
    source_unknown: 'approximately_50_to_70pct_of_FN_no_source_identified_treat_continuously_with_antibiotics_until_resolution',
    citation: CITATIONS.IDSA_FN,
  };
}

module.exports = { febrileNeutropeniaRiskAssessment, empiricAntibioticTherapy, gCsfProphylaxis, antibioticProphylaxisNeutropenic, sourceDocumentationCulture, CITATIONS, ValidationError };