/**
 * TIER3_RHEUM-302 SLE & Connective Tissue Disease Engine
 * SLE classification (EULAR/ACR 2019) + SLEDAI scoring + Lupus nephritis treatment + Mixed connective tissue + Anti-phospholipid syndrome
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { EULAR_ACR: 'EULAR/ACR SLE 2019', KDIGO: 'KDIGO GN 2024' };

function sleClassificationEularAcr(input) {
  const { positive_ana_titer, leukopenia_or_thrombocytopenia_or_hemolytic_anemia, arthritis, serositis, renal_proteinuria_or_creatinine, neurologic_seizure_or_psychosis, oral_or_nasal_ulcer, non_scarring_alopecia, anti_dsDNA_or_anti_Sm, low_c3_c4, positive_antiphospholipid, fever } = input;
  let total_score = 0;
  if (positive_ana_titer === 'yes_at_least_1_to_80') total_score += 2;
  if (fever === 'yes') total_score += 2;
  if (leukopenia_or_thrombocytopenia_or_hemolytic_anemia === 'yes') total_score += 3;
  if (arthritis === 'yes') total_score += 6;
  if (oral_or_nasal_ulcer === 'yes') total_score += 2;
  if (non_scarring_alopecia === 'yes') total_score += 2;
  if (serositis === 'yes') total_score += 5;
  if (renal_proteinuria_or_creatinine === 'yes') total_score += 4;
  if (neurologic_seizure_or_psychosis === 'yes') total_score += 5;
  if (anti_dsDNA_or_anti_Sm === 'yes') total_score += 6;
  if (low_c3_c4 === 'yes') total_score += 4;
  if (positive_antiphospholipid === 'yes') total_score += 2;
  return {
    total_score, classification: total_score >= 10 ? 'SLE_classified_per_EULAR_ACR_2019' : 'SLE_not_classified_score_below_10',
    next_step: total_score >= 10 ? 'rheumatology_consultation_then_start_hydroxychloroquine_baseline_evaluation' : 'continue_evaluation_for_differential',
    citation: CITATIONS.EULAR_ACR,
  };
}

function sledaiScoring(input) {
  const { seizure, psychosis, organic_brain_syndrome, visual_disturbance, cranial_nerve, lupus_headache, cva, vasculitis, arthritis, myositis, urinary_cast, hematuria, proteinuria, pyuria, pleuritis, pericarditis, complement_low, increased_dna_binding, fever, thrombocytopenia, leukopenia } = input;
  let score = 0;
  if (seizure === 'yes') score += 8;
  if (psychosis === 'yes') score += 8;
  if (organic_brain_syndrome === 'yes') score += 8;
  if (visual_disturbance === 'yes') score += 8;
  if (cranial_nerve === 'yes') score += 8;
  if (lupus_headache === 'yes') score += 8;
  if (cva === 'yes') score += 8;
  if (vasculitis === 'yes') score += 8;
  if (arthritis === 'yes') score += 4;
  if (myositis === 'yes') score += 4;
  if (urinary_cast === 'yes') score += 4;
  if (hematuria === 'yes') score += 4;
  if (proteinuria === 'yes') score += 4;
  if (pyuria === 'yes') score += 4;
  if (pleuritis === 'yes') score += 4;
  if (pericarditis === 'yes') score += 4;
  if (complement_low === 'yes') score += 2;
  if (increased_dna_binding === 'yes') score += 2;
  if (fever === 'yes') score += 2;
  if (thrombocytopenia === 'yes') score += 1;
  if (leukopenia === 'yes') score += 1;
  let severity = 'no_activity';
  if (score >= 20) severity = 'very_high_activity_severe_flare';
  else if (score >= 12) severity = 'high_activity_moderate_flare';
  else if (score >= 6) severity = 'moderate_activity_mild_flare';
  else if (score >= 1) severity = 'low_activity';
  return {
    sledai_score: score, severity,
    next_step: severity === 'very_high_activity_severe_flare' ? 'IV_methylprednisolone_500_to_1000mg_daily_x_3_days_then_immunosuppressive_agent' : severity === 'high_activity_moderate_flare' ? 'oral_prednisone_0.5_to_1mg_per_kg_per_day_with_steroid_sparing_agent' : 'continue_hydroxychloroquine_with_Q3_month_observation',
    citation: CITATIONS.EULAR_ACR,
  };
}

function lupusNephritisTreatment(input) {
  const { class_iii_iv_v_lupus_nephritis, proteinuria_g_per_24h, serum_creatinine, dsDNA_titer } = input;
  let induction = 'mycophenolate_mofetil_2_to_3g_daily_x_6_months_or_IV_cyclophosphamide_eurolupus_or_NIH_protocol';
  if (class_iii_iv_v_lupus_nephritis === 'class_III_or_IV_with_active_severe') induction = 'mycophenolate_or_cyclophosphamide_with_steroids_consider_belimumab_addon_or_anifrolumab_addon';
  if (class_iii_iv_v_lupus_nephritis === 'class_V_pure_membranous') induction = 'mycophenolate_mofetil_plus_low_dose_steroid';
  let maintenance = 'mycophenolate_mofetil_1_to_2g_daily_or_azathioprine_2mg_per_kg';
  return {
    induction, maintenance, class_iii_iv_v_lupus_nephritis,
    target: 'proteinuria_less_than_500mg_per_24h_by_12_months_within_3_months_partial_remission',
    monitoring: ['urinalysis_Q1_to_3M', 'serum_creatinine_Q1_to_3M', 'complement_C3_C4_Q1_to_3M', 'anti_dsDNA_Q1_to_3M', 'spot_protein_creatinine_ratio', 'consider_kidney_biopsy_repeat_if_no_response'],
    citation: CITATIONS.KDIGO,
  };
}

function mixedConnectiveTissue(input) {
  const { u1_rnp_positive, raynaud_present, swollen_hands, synovitis, myositis_proximal, sclerodactyly, pulmonary_htn_on_echo, esophageal_dysmotility } = input;
  let mctd_likely = false;
  if (u1_rnp_positive === 'yes' && (raynaud_present === 'yes' || swollen_hands === 'yes') && (synovitis === 'yes' || myositis_proximal === 'yes' || sclerodactyly === 'yes')) mctd_likely = true;
  return {
    mctd_likely, u1_rnp_positive,
    follow_up_required: ['annual_echo_for_pulmonary_hypertension', 'annual_PFTs', 'annual_esophageal_evaluation', 'manage_each_component_lupus_scleroderma_or_myositis_features_individually'],
    treatment: ['mild_to_moderate_low_dose_prednisone_HCQ', 'severe_with_internal_organs_immunosuppression_mycophenolate_or_methotrexate', 'pulmonary_hypertension_specific_treatment'],
    citation: CITATIONS.EULAR_ACR,
  };
}

function antiPhospholipidSyndrome(input) {
  const { lupus_anticoagulant, anti_cardiolipin_ab, anti_beta2_glycoprotein1_ab, clinical_thrombosis_event, pregnancy_morbidity, persistent_positive_12_weeks } = input;
  const positive_lab_count = [lupus_anticoagulant === 'yes', anti_cardiolipin_ab === 'yes', anti_beta2_glycoprotein1_ab === 'yes'].filter(Boolean).length;
  const has_clinical_criterion = clinical_thrombosis_event === 'yes' || pregnancy_morbidity === 'yes';
  const aps_likely = positive_lab_count >= 1 && has_clinical_criterion && persistent_positive_12_weeks === 'yes';
  return {
    aps_likely, positive_lab_count, persistent_positive_12_weeks,
    treatment: clinical_thrombosis_event === 'yes' ? ['lifelong_anticoagulation_with_warfarin_target_INR_2_to_3', 'or_DOAC_for_arterial_events_with_low_bleeding_risk', 'consider_add_low_dose_aspirin'] : pregnancy_morbidity === 'yes' ? ['prophylactic_LMWH_throughout_pregnancy', 'low_dose_aspirin_preconception_or_first_trimester'] : 'aspirin_81mg_daily_prophylactic_for_asymptomatic_carriers',
    citation: CITATIONS.EULAR_ACR,
  };
}

module.exports = { sleClassificationEularAcr, sledaiScoring, lupusNephritisTreatment, mixedConnectiveTissue, antiPhospholipidSyndrome, CITATIONS, ValidationError };