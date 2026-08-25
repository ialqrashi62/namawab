/**
 * TIER3_ALLERGY-305 Autoimmune / Rheumatologic Allergy Engine
 * Autoimmune disease screening + Rheumatic fever + Lupus flare + Sjogren's syndrome + Sarcoidosis workup
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR: 'ACR Autoimmune 2024', EULAR: 'EULAR 2024' };

function autoimmuneDiseaseScreening(input) {
  const { ana_titer, ana_pattern, specific_autoantibody_positive, family_history_autoimmune, multi_system_symptoms, specific_symptoms } = input;
  let high_suspicion = false;
  if (specific_autoantibody_positive === 'yes' || multi_system_symptoms === 'yes') high_suspicion = true;
  return {
    high_suspicion, ana_titer, ana_pattern,
    specific_syndromes_to_evaluate: ['SLE_with_anti_dsDNA_or_anti_Sm', 'scleroderma_with_anti_Scl70_or_anti_centromere', 'Sjogren_with_anti_Ro_SSA_anti_La_SSB', 'myositis_with_anti_Jo1_or_anti_Mi2', 'mixed_connective_tissue_with_anti_RNP', 'ANCA_vasculitis_with_p_ANC_MPO_or_c_ANC_PR3'],
    next_step: high_suspicion ? 'refer_to_rheumatology_for_full_evaluation_and_organ_specific_workup' : 'continue_observation_or_repeat_in_3_to_6_months',
    citation: CITATIONS.ACR,
  };
}

function rheumaticFeverAssessment(input) {
  const { recent_strep_throat, migratory_polyarthritis, carditis, subcutaneous_nodules, erythema_marginatum, sydenham_chorea, jones_criteria_met_count, age_years } = input;
  let jones_criteria_count = [migratory_polyarthritis === 'yes', carditis === 'yes', subcutaneous_nodules === 'yes', erythema_marginatum === 'yes', sydenham_chorea === 'yes'].filter(Boolean).length;
  let major_criteria_met = jones_criteria_count >= 2;
  return {
    jones_criteria_count, major_criteria_met, recent_strep_throat,
    diagnosis: (major_criteria_met && recent_strep_throat === 'yes') ? 'acute_rheumatic_fever_high_probability' : 'low_probability',
    treatment: ['antibiotics_penicillin_V_or_erythromycin_for_strep', 'anti_inflammatory_high_dose_aspirin_or_nsaid', 'if_carditis_or_chorea_prednisone_consider', 'secondary_prophylaxis_benzathine_penicillin_Q_month_until_age_21_or_5_years_since_last_attack_whichever_longer'],
    citation: CITATIONS.ACR,
  };
}

function lupusFlareAssessment(input) {
  const { sle_diagnosis_history, current_sledai_score, dsDNA_titer_rising, c3_low, c4_low, renal_involvement_new, neurologic_involvement_new } = input;
  let flare_present = false;
  if (dsDNA_titer_rising === 'yes' || c3_low === 'yes' || renal_involvement_new === 'yes' || neurologic_involvement_new === 'yes') flare_present = true;
  if (current_sledai_score >= 12) flare_present = true;
  return {
    flare_present, current_sledai_score, dsDNA_titer_rising, complement_low: c3_low === 'yes' || c4_low === 'yes',
    treatment: ['mild_to_moderate_flare_topical_or_oral_steroid_increase', 'moderate_flare_oral_prednisone_0.5_to_1mg_per_kg_per_day_taper_over_4_to_6_weeks', 'severe_flare_with_organ_threatening_IV_methylprednisolone_500_to_1000mg_daily_x_3_days_then_taper', 'consider_belimumab_or_anifrolumab_for_refractory', 'cyclophosphamide_or_mycophenolate_mofetil_for_renal_or_neurologic_lupus'],
    monitoring: 'sledai_score_Q1_to_3_months_during_active_disease_then_Q3_to_6_months',
    citation: CITATIONS.EULAR,
  };
}

function sjogrenSyndromeAssessment(input) {
  const { sicca_symptoms, schirmer_test_mm, unstimulated_whole_salivary_flow, anti_ro_ssa, anti_la_ssb, lymphocytic_infiltration_lip_biopsy } = input;
  let diagnosis_count = [sicca_symptoms === 'yes', schirmer_test_mm < 5, unstimulated_whole_salivary_flow < 0.1, anti_ro_ssa === 'yes', anti_la_ssb === 'yes', lymphocytic_infiltration_lip_biopsy === 'yes'].filter(Boolean).length;
  return {
    sjogren_likely: diagnosis_count >= 3 ? 'yes' : 'no', diagnosis_count, schirmer_test_mm,
    sicca_management: ['artificial_tears_q1h_prn', 'cyclosporine_or_lifitegrast_drops', 'pilocarpine_or_cevimeline_for_dry_mouth', 'saliva_substitutes', 'good_dental_care_prevent_caries', 'humidifier_at_home'],
    systemic_features_to_screen: ['lymphoma_risk_Q1_year_exam', 'interstitial_lung_disease', 'peripheral_neuropathy', 'renal_involvement'],
    citation: CITATIONS.ACR,
  };
}

function sarcoidosisWorkup(input) {
  const { chest_ct_findings, ace_level, hypercalcemia, lofgren_syndrome_present, skin_lesion_present, uveitis, cardiac_mri_findings, biopsy_results } = input;
  let diagnosis = 'sarcoidosis_suspected';
  if (chest_ct_findings === 'bilateral_hilar_lymphadenopathy' && (lofgren_syndrome_present === 'yes' || biopsy_results === 'non_caseating_granulomas')) diagnosis = 'sarcoidosis_confirmed';
  return {
    diagnosis, chest_ct_findings, ace_level,
    workup: ['chest_imaging_CXR_and_CT', 'PFTs_with_DLCO', 'serum_ACE_level_Q3_to_6M', '24h_urinary_calcium_and_serum_calcium_Q3_to_6M', 'slit_lamp_eye_exam', 'ECG_and_echo_for_cardiac_sarcoidosis', 'tissue_biopsy_of_accessible_lesion_skin_lymph_node'],
    treatment: ['observe_for_asymptomatic_stage_I_only', 'prednisone_20_to_40mg_daily_for_3_to_6_months_for_symptomatic_or_organ_threatening', 'methotrexate_or_azathioprine_steroid_sparing', 'infliximab_for_refractory', 'hydroxychloroquine_for_skin_manifestations'],
    follow_up: 'Q3_to_6_months_with_imaging_PFTs_lab_monitoring',
    citation: CITATIONS.EULAR,
  };
}

module.exports = { autoimmuneDiseaseScreening, rheumaticFeverAssessment, lupusFlareAssessment, sjogrenSyndromeAssessment, sarcoidosisWorkup, CITATIONS, ValidationError };