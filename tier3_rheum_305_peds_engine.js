/**
 * TIER3_RHEUM-305 Pediatric Rheumatology Engine
 * JIA classification (ILAR) + Kawasaki disease + IgA vasculitis/HSP + Juvenile dermatomyositis (JDM) + Pediatric SLE
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACR_JIA: 'ILAR JIA 2001', CARRA: 'CARRA 2024' };

function jiaClassificationIlar(input) {
  const { age_at_onset_years, joint_count_first_6_months, joint_count_after_6_months, psoriasis_present, enthesitis_present, sacroiliac_involvement, family_history_psoriasis, family_history_ankylosing_spondylitis, rf_positive, hla_b27_positive, uveitis_present, systemic_features_fever_rash_lymphadenopathy } = input;
  let subtype = 'undifferentiated_JIA';
  if (systemic_features_fever_rash_lymphadenopathy === 'yes') subtype = 'systemic_JIA';
  else if (joint_count_first_6_months <= 4) subtype = 'oligoarticular_JIA';
  else if (joint_count_first_6_months >= 5) subtype = rf_positive === 'yes' ? 'polyarticular_RF_positive_JIA' : 'polyarticular_RF_negative_JIA';
  else if (psoriasis_present === 'yes' || family_history_psoriasis === 'yes') subtype = 'psoriatic_JIA';
  else if (enthesitis_present === 'yes' || sacroiliac_involvement === 'yes' || hla_b27_positive === 'yes') subtype = 'enthesitis_related_JIA';
  return {
    subtype, age_at_onset_years, joint_count_first_6_months, uveitis_present,
    treatment_first_line: subtype === 'oligoarticular_JIA' ? ['NSAID', 'intra_articular_steroid', 'consider_methotrexate_if_recurrent'] : subtype === 'polyarticular_JIA' ? ['methotrexate_15mg_per_m2_weekly_then_escalate_to_biologic_if_inadequate_response', 'etanercept_or_adalimumab_if_inadequate_response_to_methotrexate'] : subtype === 'systemic_JIA' ? ['IL1_inhibitor_anakinra_first_line_or_canakinumab', 'consider_IV_methylprednisolone_for_severe_systemic_features', 'tocilizumab_if_MAS_or_inadequate_response'] : 'NSAID_then_methotrexate',
    uveitis_screening: 'annual_ophthalmology_for_oligoarticular_and_polyarticular_RF_negative_JIA_due_to_high_risk',
    citation: CITATIONS.ACR_JIA,
  };
}

function kawasakiDiseaseRheum(input) {
  const { fever_days, bilateral_conjunctivitis, oral_changes, peripheral_changes, polymorphous_rash, cervical_lymphadenopathy, coronary_artery_abnormal, incomplete_features } = input;
  const classic_criteria_count = [fever_days >= 5, bilateral_conjunctivitis === 'yes', oral_changes === 'yes', peripheral_changes === 'yes', polymorphous_rash === 'yes', cervical_lymphadenopathy === 'yes'].filter(Boolean).length;
  return {
    classic_diagnosis: classic_criteria_count >= 4 || (fever_days >= 5 && coronary_artery_abnormal === 'yes'),
    incomplete_diagnosis: incomplete_features === 'yes' && classic_criteria_count >= 2,
    criteria_count: classic_criteria_count,
    treatment: ['IVIG_2g_per_kg_infused_over_10_to_12h_within_day_5_to_10_of_illness', 'high_dose_aspirin_80_to_100mg_per_kg_per_day_then_low_dose_3_to_5mg_per_kg_per_day_after_defervescence', 'echocardiogram_at_diagnosis_Q2_weeks_then_Q_month_x_3_months', 'consider_second_dose_IVIG_or_infliximab_for_refractory'],
    long_term_follow_up: 'pediatric_rheumatology_and_cardiology_Q3M_x_1_year_then_Q6_to_12M_lifelong_for_coronary_aneurysm',
    citation: CITATIONS.CARRA,
  };
}

function igaVasculitisHsp(input) {
  const { palpable_purpura_lower_limbs, abdominal_pain, joint_pain, renal_involvement_hematuria_proteinuria, age_at_onset_years, ig_a_deposition_in_biopsy } = input;
  const criteria_count = [palpable_purpura_lower_limbs === 'yes', abdominal_pain === 'yes', joint_pain === 'yes', renal_involvement_hematuria_proteinuria === 'yes'].filter(Boolean).length;
  return {
    iga_vasculitis_likely: criteria_count >= 2 ? 'yes' : 'no',
    criteria_count, age_at_onset_years,
    treatment: criteria_count >= 2 ? ['supportive_care', 'NSAID_or_acetaminophen_for_pain', 'consider_corticosteroid_for_severe_GI_or_renal', 'consider_mycophenolate_for_refractory_renal'] : 'supportive_care_only',
    monitoring: ['BP_Q1_month_x_6_months', 'urinalysis_Q1_month_x_6_months', 'consider_kidney_biopsy_for_persistent_proteinuria'],
    prognosis: 'usually_self_limited_within_4_to_6_weeks_renal_involvement_in_1_to_3pct_long_term',
    citation: CITATIONS.CARRA,
  };
}

function juvenileDermatomyositis(input) {
  const { heliotrope_rash, gottron_papules, proximal_muscle_weakness, elevated_ck_aldolase, mri_muscle_inflammation, nailfold_capillary_loop_changes, age_at_onset_years, calcinosis_present, interstitial_lung_disease } = input;
  let classification = 'definite_JDM';
  if (heliotrope_rash === 'yes' && proximal_muscle_weakness === 'yes' && elevated_ck_aldolase === 'yes') classification = 'definite_JDM';
  return {
    classification, age_at_onset_years, calcinosis_present,
    treatment: ['oral_prednisone_1mg_per_kg_per_day_or_IV_methylprednisolone', 'methotrexate_15mg_per_m2_weekly_first_line_steroid_sparing', 'consider_IVIG_for_refractory', 'consider_rituximab_for_refractory_or_severe', 'calcinosis_consider_alendronate_or_diltiazem_topical_NSAID'],
    workup: ['MRI_muscle_for_inflammation_extent', 'nailfold_capillaroscopy', 'echocardiogram_baseline', 'pulmonary_function_with_DLCO', 'ANA_Mi2_anti_SRP_anti_TIF1_gamma_anti_NXP2_antibodies'],
    monitoring: 'monthly_clinical_visit_for_first_6_months_then_Q3M_assess_strength_CK_lung_function',
    citation: CITATIONS.CARRA,
  };
}

function pediatricSle(input) {
  const { age_years, ana_positive, anti_dsDNA_positive, lupus_nephritis_present, neuropsychiatric_lupus, hematologic_manifestation, malar_rash, discoid_rash } = input;
  let diagnosis = 'pSLE_suspected';
  if (ana_positive === 'yes' && (anti_dsDNA_positive === 'yes' || lupus_nephritis_present === 'yes')) diagnosis = 'pSLE_confirmed';
  return {
    diagnosis, age_years, lupus_nephritis_present,
    treatment: diagnosis === 'pSLE_confirmed' ? ['hydroxychloroquine_all_patients_baseline_eye_exam_annual', 'corticosteroids_for_induction_then_steroid_sparing', 'mycophenolate_mofetil_for_lupus_nephritis', 'consider_belimumab_for_pediatric_approved', 'NSAIDs_for_arthritis_fever'] : 'observation_with_follow_up',
    monitoring: ['CBC_Q1_month_during_active_disease', 'urinalysis_Q3_month', 'complement_C3_C4_Q3_month', 'anti_dsDNA_Q3_month', 'annual_lipid_profile_and_urine_protein_to_creatinine', 'annual_ophthalmology_for_hydroxychloroquine_toxicity'],
    transition_to_adult: 'transition_to_adult_rheumatology_at_age_18_to_25_with_structured_handoff',
    citation: CITATIONS.CARRA,
  };
}

module.exports = { jiaClassificationIlar, kawasakiDiseaseRheum, igaVasculitisHsp, juvenileDermatomyositis, pediatricSle, CITATIONS, ValidationError };