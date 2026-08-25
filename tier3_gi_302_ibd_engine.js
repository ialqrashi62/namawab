/**
 * TIER3_GI-302 Inflammatory Bowel Disease (IBD) Engine
 * Crohn's disease activity (CDAI) + Ulcerative colitis activity (Mayo) + IBD therapy stratification + Biologics in IBD + Perianal Crohn's
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ECCO: 'ECCO Crohn Guidelines 2024', AGA_IBD: 'AGA IBD 2024' };

function crohnsDiseaseCdai(input) {
  const { liquid_soft_stools_count_7d, abdominal_pain_score, general_wellbeing, extraintestinal_complications, antidiarrheal_use, hematocrit_pct_low, abdominal_mass_present } = input;
  let cdai_score = (liquid_soft_stools_count_7d * 2) + (abdominal_pain_score * 5) + (general_wellbeing * 7) + (extraintestinal_complications * 20) + (antidiarrheal_use * 30) - (hematocrit_pct_low || 0) + (abdominal_mass_present === 'yes' ? 20 : 0);
  let severity = 'remission';
  if (cdai_score >= 450) severity = 'severe_active';
  else if (cdai_score >= 220) severity = 'moderate_active';
  else if (cdai_score >= 150) severity = 'mild_to_moderate_active';
  return {
    cdai_score, severity,
    treatment: severity === 'remission' ? 'maintain_remission_with_5_ASA_or_immunomodulator_or_biologic' : severity === 'mild_to_moderate_active' ? 'oral_budesonide_for_ileocecal_disease_then_optimize_maintenance' : severity === 'moderate_active' ? 'corticosteroid_taper_plus_optimize_immunomodulator_thiopurine_or_methotrexate_then_consider_step_up_to_biologic' : 'hospitalization_with_IV_corticosteroids_consider_biologic_if_corticosteroid_refractory_or_fistulizing_disease',
    follow_up: 'CDAI_Q4_to_12_weeks_with_fecal_calprotectin_Q3_months_during_active_disease',
    prognosis: 'approximately_30pct_of_patients_with_Crohn_have_severe_disease_within_10_years',
    citation: CITATIONS.ECCO,
  };
}

function ulcerativeColitisMayo(input) {
  const { stool_frequency_subscore, rectal_bleeding_subscore, endoscopic_findings_subscore, physician_global_assessment } = input;
  let mayo_score = (stool_frequency_subscore || 0) + (rectal_bleeding_subscore || 0) + (endoscopic_findings_subscore || 0) + (physician_global_assessment || 0);
  let severity = 'remission';
  if (mayo_score >= 10) severity = 'severe_active';
  else if (mayo_score >= 6) severity = 'moderate_active';
  else if (mayo_score >= 3) severity = 'mild_active';
  let severe_acute_colitis = false;
  if (mayo_score >= 10 && stool_frequency_subscore >= 2 && rectal_bleeding_subscore >= 1 && (hematocrit_decline_present === 'yes' || fever_present === 'yes' || tachycardia_present === 'yes' || elevated_esr_present === 'yes')) severe_acute_colitis = true;
  return {
    mayo_score, severity, severe_acute_colitis,
    treatment: severity === 'remission' ? 'maintain_5_ASA_or_immunomodulator_or_biologic' : severity === 'mild_active' ? '5_ASA_oral_plus_topical_rectal' : severity === 'moderate_active' ? 'corticosteroid_taper_plus_optimize_maintenance' : 'hospitalize_with_IV_corticosteroids_Q24h_reassess_Q3_days_for_response',
    severe_colitis_management: severe_acute_colitis ? 'IV_fluid_electrolyte_replacement_broad_spectrum_antibiotics_CT_abdomen_to_exclude_toxic_megacolon_perforation_if_no_response_in_3_days_then_rescue_with_infliximab_or_cyclosporine_then_emergent_colectomy' : 'continue_medical_management',
    follow_up: 'CRP_Q1_to_2_weeks_during_active_disease_fecal_calprotectin_Q3_months_colonoscopy_Q1_to_3_years_for_surveillance',
    citation: CITATIONS.AGA_IBD,
  };
}

function ibdTherapyStratification(input) {
  const { risk_stratification, moderate_to_severe_ibd, prior_therapy_failures, ileal_or_extensive_disease, perianal_disease, extraintestinal_manifestations, prior_thiopurine_or_methotrexate_failure } = input;
  let first_line_biologic = 'anti_TNF_infliximab_or_adalimumab_combination_with_thiopurine_for_combination_preferred';
  if (perianal_disease === 'yes') first_line_biologic = 'infliximab_combined_with_thiopurine_optimal_for_perianal_disease';
  if (prior_thiopurine_or_methotrexate_failure === 'yes') first_line_biologic = 'anti_TNF_infliximab_or_adalimumab_first_choice';
  else if (extensive_disease === 'yes') first_line_biologic = 'consider_vedolizumab_anti_integrin_for_UC';
  else first_line_biologic = 'ustekinumab_anti_IL12_IL23_for_Crohn_or_risankizumab_anti_IL23';
  return {
    first_line_biologic, risk_stratification,
    monitoring: 'baseline_PPD_or_QFT_HBV_HCV_serology_labs_then_drug_levels_Q3_months_anti_drug_antibodies_if_loss_of_response',
    biosimilars: 'infliximab_abda_or_ct_p13_or_sb2_adalimumab_approved_and_equally_effective',
    switch_options: 'consider_vedolizumab_or_ustekinumab_or_risankizumab_or_mirikizumab_as_second_line_anti_TNF_failures',
    citation: CITATIONS.ECCO,
  };
}

function biologicsInIbd(input) {
  const { cd_vs_uc, prior_biologic_failure_count, tuberculosis_risk, hep_b_status, j_pouch_surgery_pl, } = input;
  let recommendation = 'anti_TNF_infliximab_5mg_per_kg_Q8_weeks_combination_with_thiopurine';
  if (prior_biologic_failure_count === 0) recommendation = 'first_line_anti_TNF_for_moderate_to_severe_disease';
  if (prior_biologic_failure_count === 1) recommendation = 'switch_to_vedolizumab_for_UC_or_ustekinumab_or_risankizumab_for_Crohn_or_alternative_anti_TNF';
  if (prior_biologic_failure_count >= 2) recommendation = 'consider_JAK_inhibitor_tofacitinib_or_upadacitinib_for_UC_or_risankizumab_for_Crohn';
  return {
    recommendation, prior_biologic_failure_count, hep_b_status,
    pre_screening: ['hepatitis_B_serology_HBsAg_anti_HBc_HBsAb', 'TB_screening_QFT_or_TST', 'CBC_CMP', 'vaccinations_pneumococcal_hepatitis_B_influenza_zoster'],
    j_pouch_consideration: j_pouch_surgery_pl === 'yes' ? 'consider_biologic_avoidance_preferring_vedolizumab_for_pouchitis_prevention' : 'no_concern',
    safety: 'drug_levels_Q3_months_during_induction_then_Q3_to_6_months_during_maintenance',
    citation: CITATIONS.AGA_IBD,
  };
}

function perianalCrohns(input) {
  const { perianal_fistula_present, abscess_present, anorectal_stricture, seton_placed, biologic_therapy_active, mri_fistula_findings } = input;
  let intervention = 'multidisciplinary_care_gastroenterology_colorectal_surgery_radiology';
  if (abscess_present === 'yes') intervention = 'urgent_drainage_with_seton_placement_then_define_underlying_fistula';
  else if (perianal_fistula_present === 'yes') intervention = 'MRI_fistulogram_then_seton_placement_anti_TNF_therapy_infliximab_combination_with_thiopurine_Q8_weeks_then_consider_fistula_plug_or_LIFT_after_healing';
  return {
    intervention, perianal_fistula_present, abscess_present,
    antibiotics_adjunctive: 'metronidazole_or_ciprofloxacin_short_term_use_only_for_bridge_anti_TNF_response',
    biologics_for_perianal_crohn: 'infliximab_combination_with_thiopurine_preferred_consider_adalimumab_if_infliximab_not_tolerated_ustekinumab_for_anti_TNF_failures',
    surgical_options: ['seton_drainage_then_medical_therapy', 'fistula_plug_or_LIFT_procedure_for_simple_fistulas', 'advancement_flap_for_selected_complex_fistulas', 'consider_diverting_stoma_for_severe'],
    monitoring: 'MRI_perianal_Q6_months_then_Q12M_after_healing_for_recurrence',
    citation: CITATIONS.ECCO,
  };
}

module.exports = { crohnsDiseaseCdai, ulcerativeColitisMayo, ibdTherapyStratification, biologicsInIbd, perianalCrohns, CITATIONS, ValidationError };