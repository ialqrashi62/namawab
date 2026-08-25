/**
 * TIER3_GI-301 GERD / Esophageal Disorders Engine
 * GERD severity assessment + Eosinophilic esophagitis (EoE) + Achalasia + Barrett esophagus screening + Esophageal stricture
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACG_GERD: 'ACG GERD Guideline 2022', AGA_BAR: 'AGA Barrett 2024' };

function gerdSeverityAssessment(input) {
  const { symptom_frequency_days_per_week, nighttime_symptoms, complications_present, response_to_ppi, atypical_symptoms_extra_digestive, age_years } = input;
  let severity = 'mild_typical_gerd';
  if (symptom_frequency_days_per_week >= 3 || nighttime_symptoms === 'yes' || complications_present === 'yes') severity = 'moderate_gerd';
  if (complications_present === 'yes' || response_to_ppi === 'no') severity = 'severe_or_refractory_gerd';
  if (atypical_symptoms_extra_digestive === 'yes') severity = 'extra_esophageal_gerd';
  return {
    severity, nighttime_symptoms, complications_present,
    treatment: severity === 'mild_typical_gerd' ? 'lifestyle_modifications_PRN_PPI_or_H2_blocker' : severity === 'moderate_gerd' ? 'daily_PPI_before_breakfast_x_8_weeks_then_step_down_response_assess' : 'step_up_to_twice_daily_PPI_consider_upper_endoscopy_for_alarm_symptoms_or_complications',
    alarm_symptoms_to_evaluate: ['dysphagia', 'weight_loss', 'bleeding_anemia', 'persistent_vomiting', 'family_history_of_Barrett_or_Esophageal_cancer'],
    endoscopy_indication: (complications_present === 'yes' || response_to_ppi === 'no' || atypical_symptoms_extra_digestive === 'yes' || age_years >= 60 || alarm_symptoms_present) ? 'yes' : 'no_empirical_PPI_trial',
    citation: CITATIONS.ACG_GERD,
  };
}

function eosinophilicEsophagitis(input) {
  const { dysphagia_dysfunction, food_impaction_history, eosinophils_per_hpf, eoe_diagnosed_biopsy, ppi_response, age_years, prior_dilation } = input;
  let interpretation = 'eoe_not_diagnosed';
  if (eosinophils_per_hpf >= 15 && eoe_diagnosed_biopsy === 'yes') interpretation = 'eoe_confirmed';
  return {
    eosinophilic_esophagitis_likely: interpretation === 'eoe_confirmed', eosinophils_per_hpf,
    first_line: ['swallowed_topical_steroid_budesonide_respule_or_fluticasone_slurry_x_8_to_12_weeks', 'PPI_for_concurrent_gerd', 'six_food_elimination_diet_or_step_up_elimination_diet_or_topical_steroid'],
    advanced_therapy: 'dupilumab_anti_IL4_IL13_for_eoe_in_refractory_or_steroid_dependent_disease',
    follow_up: 'endoscopy_Q3_to_6_months_with_biopsies_to_assess_remission_per_peak_eosinophil_lt_6_per_hpf',
    stricture_management: 'consider_endoscopic_dilation_for_fibrotic_stricture_then_maintenance_topical_steroid_to_prevent_re_stricture',
    dietary_therapy: 'swallowed_budesonide_avoid_dairy_wheat_eggs_soy_peanut_seafood_or_step_up_elimination',
    citation: CITATIONS.ACG_GERD,
  };
}

function achalasiaDiagnosis(input) {
  const { dysphagia_solids_liquids_both, regurgitation_undigested_food, weight_loss_present, barium_swallow_findings, manometry_findings, esophageal_dilation_on_imaging } = input;
  let diagnosis = 'unclassified';
  if (manometry_findings === 'elevated_integration_relaxation_pressure' && dysphagia_solids_liquids_both === 'both') diagnosis = 'achalasia_confirmed';
  else if (manometry_findings === 'type_I_type_II_type_III_per_chicago_classification') diagnosis = 'achalasia_classified';
  return {
    diagnosis, dysphagia_solids_liquids_both, regurgitation_undigested_food,
    treatment: ['first_line_laparoscopic_hellers_myorectomy_with_Dor_or_Toupet_fundoplication', 'alternative_POEM_per_oral_endoscopic_myotomy_equally_effective', 'endoscopic_pneumatic_dilation_30_to_40mm_or_graded', 'medical_treatment_calcium_channel_blocker_or_nitrate_for_short_term_relief', 'botulinum_toxin_injection_short_term_only_in_high_risk_surgical_patients'],
    type_iii_management: 'POEM_preferred_for_type_III_achalasia_due_to_long_myotomy_advantage',
    follow_up: 'symptom_questionnaire_Eckardt_score_Q3_months_first_year_then_Q6M_timed_barium_esophagram_Q6M_post_procedure',
    complication: 'perforation_with_pneumatic_dilation_or_POEM_balloon_dilation_preoperative_antibiotic_prophylaxis',
    citation: CITATIONS.ACG_GERD,
  };
}

function barrettEsophagusScreening(input) {
  const { chronic_gerd_5_years, age_years, sex, obesity_bmi, smoking_history, family_history_of_esophageal_adenocarcinoma, hiatal_hernia_present, race } = input;
  let screening_indicated = false;
  if (chronic_gerd_5_years === 'yes' && age_years >= 50 && (sex === 'male' || (sex === 'female' && additional_risk_factors_present)) && (obesity_bmi || smoking_history || family_history)) screening_indicated = true;
  return {
    screening_indicated, screening_recommendation: 'upper_endoscopy_with_seattle_protocol_biopsies',
    barrett_management_if_diagnosed: ['histology_low_grade_dysplasia_Q6_to_12_months_endoscopy_surveillance', 'histology_high_grade_dysplasia_or_intramucosal_carcinoma_endoscopic_therapy_radiofrequency_ablation_or_endoscopic_mucosal_resection', 'histology_non_dysplastic_Q3_to_5_year_surveillance_per_AGA'],
    risk_factors: ['chronic_gerd_5_years', 'age_50_plus', 'male_sex', 'obesity_BMI_30', 'smoking_history', 'family_history', 'caucasian_or_hispanic', 'hiatal_hernia'],
    chemoprevention: 'PPI_and_potentially_statins_evidence_suggests_reduces_progression_risk',
    citation: CITATIONS.AGA_BAR,
  };
}

function esophagealStrictureManagement(input) {
  const { stricture_etiology, stricture_diameter_mm, dysphagia_grade, prior_dilation_count, refractory_stricture } = input;
  let intervention = 'endoscopic_balloon_or_savary_dilation_to_12_to_15mm_with_subsequent_PPI_treatment_for_peptic_strictures';
  if (refractory_stricture === 'yes') intervention = 'consider_intralesional_steroid_injection_4_Quadrants_with_dilation_or_stent_placement_or_incisional_therapy_for_anastomotic_strictures';
  return {
    intervention, stricture_etiology, stricture_diameter_mm, dysphagia_grade,
    dilation_protocol: 'rule_of_threes_only_dilate_to_three_gradual_sizes_per_session_consider_imaging_to_rule_out_pseudo_diverticulosis',
    etiology_specific: stricture_etiology === 'eosinophilic' ? 'topical_steroid_budesonide_then_dilation' : stricture_etiology === 'anastomotic' ? 'endoscopic_dilation_or_radial_incisional_therapy' : stricture_etiology === 'caustic' ? 'long_dilation_protocol_over_months_with_PPI_or_surgery_for_perf' : stricture_etiology === 'radiation' ? 'gradual_dilation_with_intralesional_steroid_then_hyperbaric_oxygen_consideration' : 'peptic_stricture_PPI_continued_then_dilation',
    monitoring: 'symptom_assessment_Q1_to_3_months_repeat_dilation_as_needed_Q3_to_12_months_for_refractory',
    citation: CITATIONS.ACG_GERD,
  };
}

module.exports = { gerdSeverityAssessment, eosinophilicEsophagitis, achalasiaDiagnosis, barrettEsophagusScreening, esophagealStrictureManagement, CITATIONS, ValidationError };