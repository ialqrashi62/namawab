/**
 * TIER3_RHEUM-303 Vasculitis Engine
 * ANCA-associated vasculitis (GPA/MPA/EGPA) + Large vessel vasculitis (GCA/TAK) + IgA vasculitis + Cryoglobulinemia + Behçet disease
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { CHCC: 'CHCC Vasculitis 2022', EULAR_VASC: 'EULAR Vasculitis 2024' };

function ancaVasculitisGpaMpaEgpa(input) {
  const { c_anca_pr3_positive, p_anca_mpo_positive, asthma_history, eosinophilia, nasal_or_sinus_involvement, lung_involvement, kidney_involvement, neuropathy, skin_palpable_purpura } = input;
  let likely_diagnosis = 'unclassified_ANCA_vasculitis';
  if (c_anca_pr3_positive === 'yes' && (nasal_or_sinus_involvement === 'yes' || lung_involvement === 'yes' || kidney_involvement === 'yes')) likely_diagnosis = 'GPA_granulomatosis_with_polyangiitis';
  else if (p_anca_mpo_positive === 'yes' && (lung_involvement === 'yes' || kidney_involvement === 'yes')) likely_diagnosis = 'MPA_microscopic_polyangiitis';
  else if (asthma_history === 'yes' && eosinophilia === 'yes' && p_anca_mpo_positive === 'yes') likely_diagnosis = 'EGPA_eosinophilic_granulomatosis_with_polyangiitis';
  return {
    likely_diagnosis, c_anca_pr3_positive, p_anca_mpo_positive,
    treatment: 'rituximab_or_cyclophosphamide_plus_high_dose_glucocorticoids_for_induction_then_rituximab_or_azathioprine_for_maintenance',
    fvs_score: 'use_Five_Factor_Score_to_assess_prognosis_and_treatment_intensity',
    monitoring: ['CBC_CMP_urinalysis_Q2_weeks_during_induction', 'ANCA_titer_Q3_months', 'consider_rituximab_levels_during_maintenance'],
    citation: CITATIONS.EULAR_VASC,
  };
}

function giantCellArteritisTakayasu(input) {
  const { age_years, jaw_claudication, vision_loss_new, temporal_artery_abnormal, new_headache, scalp_tenderness, esr_cr_high, large_vessel_involvement_aorta_branches, age_lt_50 } = input;
  let diagnosis = 'unclassified';
  if (age_years >= 50 && (jaw_claudication === 'yes' || vision_loss_new === 'yes' || new_headache === 'yes')) diagnosis = 'GCA_giant_cell_arteritis_high_probability';
  if (age_lt_50 === 'yes' && large_vessel_involvement_aorta_branches === 'yes') diagnosis = 'TAK_takayasu_arteritis_high_probability';
  return {
    diagnosis, age_years,
    treatment: 'high_dose_prednisone_40_to_60mg_daily_immediate_dont_wait_for_biopsy_if_high_clinical_suspicion_for_GCA',
    tocilizumab_use: 'consider_Tocilizumab_162mg_subcutaneous_Q_week_as_steroid_sparing',
    temporal_artery_biopsy: 'perform_within_2_weeks_of_starting_steroid',
    imaging: 'CT_angiography_or_MR_angiography_or_PET_CT_for_large_vessel_involvement',
    citation: CITATIONS.EULAR_VASC,
  };
}

function igaVasculitisHsp(input) {
  const { palpable_purpura, arthritis_or_arthralgia, abdominal_pain, renal_involvement, age_years, iga_deposition_in_biopsy } = input;
  const criteria_count = [palpable_purpura === 'yes', arthritis_or_arthralgia === 'yes', abdominal_pain === 'yes', renal_involvement === 'yes'].filter(Boolean).length;
  return {
    iga_vasculitis_likely: criteria_count >= 2 ? 'yes_EULAR/PRINTO_2008_criteria_met' : 'no',
    criteria_count, palpable_purpura,
    treatment: criteria_count >= 2 ? ['supportive_care_analgesia', 'NSAID_for_arthralgia', 'consider_corticosteroid_for_severe_abdominal_pain_or_severe_renal_involvement'] : 'supportive_care_analgesia_only',
    monitoring: ['urinalysis_Q2_weeks_x_6_months_then_Q3_months_x_2_years_for_renal_involvement', 'BP_Q1_months_x_6_months', 'consider_Q2_week_UAE_for_persistent_hematuria'],
    prognosis: 'usually_self_limited_renal_involvement_determines_long_term_outcome',
    citation: CITATIONS.EULAR_VASC,
  };
}

function cryoglobulinemia(input) {
  const { palpable_purpura, arthralgia, peripheral_neuropathy, renal_involvement, mixed_cryoglobulinemia_type_II_or_III, hepatitis_c_positive, complement_low } = input;
  let likely_etiology = 'essential_or_idiopathic';
  if (hepatitis_c_positive === 'yes') likely_etiology = 'HCV_associated_mixed_cryoglobulinemia';
  if (mixed_cryoglobulinemia_type_II_or_III === 'yes') likely_etiology = 'mixed_cryoglobulinemia_with_or_without_HCV';
  return {
    likely_etiology, mixed_cryoglobulinemia_type_II_or_III,
    treatment: hepatitis_c_positive === 'yes' ? ['direct_acting_antiviral_for_hepatitis_C', 'consider_rituximab_for_severe_vasculitis_manifestations', 'plasmapheresis_for_life_threatening', 'avoid_cold_exposure'] : 'manage_underlying_cause_rituximab_or_cyclophosphamide_for_immune_complex_disease',
    monitoring: 'monitor_complement_Q3M_renal_function_Q3M_cryocrit_Q6M',
    citation: CITATIONS.EULAR_VASC,
  };
}

function behcetDisease(input) {
  const { recurrent_oral_ulcers, recurrent_genital_ulcers, ocular_inflammation, skin_lesions, pathergy_test, hla_b51_positive } = input;
  const criteria_count = [recurrent_oral_ulcers === 'yes', recurrent_genital_ulcers === 'yes', ocular_inflammation === 'yes', skin_lesions === 'yes', pathergy_test === 'yes', hla_b51_positive === 'yes'].filter(Boolean).length;
  return {
    behcet_likely: criteria_count >= 3 ? 'yes_ISG_2014_criteria_met' : 'no',
    criteria_count, recurrent_oral_ulcers,
    treatment: criteria_count >= 3 ? ['colchicine_0.5_to_1.5mg_daily_first_line', 'azathioprine_2_to_2.5mg_per_kg_for_ocular_or_severe_disease', 'infliximab_or_adalimumab_for_refractory_uveitis_or_CNS', 'apremilast_for_oral_ulcers_in_refractory'] : 'topical_corticosteroid_for_oral_or_genital_ulcers',
    monitoring: 'annual_ophthalmology_for_eye_involvement_screen_for_thrombosis_and_aneurysm',
    citation: CITATIONS.EULAR_VASC,
  };
}

module.exports = { ancaVasculitisGpaMpaEgpa, giantCellArteritisTakayasu, igaVasculitisHsp, cryoglobulinemia, behcetDisease, CITATIONS, ValidationError };