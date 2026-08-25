/**
 * TIER3_NEPHRO-305 Kidney Transplantation Engine
 * Transplant eligibility + Donor matching + Immunosuppression regimen + Acute rejection + Post-transplant infection
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_TX: 'KDIGO Transplant 2020' };

function transplantEligibility(input) {
  const { age_years, egfr_ml_min_1_73m2, comorbidity_active_malignancy, active_infection_present, cardiovascular_status, psychosocial_adherence_history, donor_available } = input;
  let eligible = false;
  if (egfr_ml_min_1_73m2 < 20 && comorbidity_active_malignancy === 'no' && active_infection_present === 'no' && cardiovascular_status === 'acceptable') eligible = true;
  return {
    eligible_for_evaluation: eligible, egfr_ml_min_1_73m2,
    additional_workup: ['cardiovascular_echo_stress_test_for_patients_over_50_or_diabetes', 'infection_screening_HBV_HCV_HIV_TB_EBV_CMV_toxoplasmosis', 'cancer_screening_age_appropriate_mammogram_colonoscopy_PAP_smear_PSA', 'urological_evaluation_for_native_kidney_disease', 'immunological_evaluation_ABO_typing_HLA_typing_antibody_screening'],
    contraindications: ['active_malignancy', 'active_uncontrolled_infection', 'severe_cardiovascular_disease_unfit_for_anesthesia', 'poor_psychosocial_adherence', 'active_substance_abuse', 'recent_thromboembolic_event'],
    timing: 'refer_to_transplant_center_when_egfr_below_20_to_allow_time_for_evaluation',
    citation: CITATIONS.KDIGO_TX,
  };
}

function donorMatching(input) {
  const { recipient_ab_o_blood, donor_ab_o_blood, donor_hla_mismatch_count, recipient_antibody_positive, donor_type_living_or_deceased, donor_age_years } = input;
  let compatible = false;
  if (recipient_ab_o_blood === donor_ab_o_blood) compatible = true;
  return {
    abo_compatible: compatible, donor_hla_mismatch_count,
    risk_stratification: donor_hla_mismatch_count >= 4 || recipient_antibody_positive === 'yes' ? 'high_immunological_risk_consider_induction_with_anti_thymocyte_globulin_or_alemtuzumab' : 'standard_immunological_risk',
    donor_type: donor_type_living_or_deceased === 'living_related' ? 'living_related_preferred_for_optimal_outcomes' : donor_type_living_or_deceased === 'living_unrelated' ? 'paired_exchange_program_possible' : 'deceased_donor_per_UNOS_or_local_allocation',
    donor_age_considerations: (donor_age_years >= 60) ? 'consider_extended_criteria_donor_with_longer_anticipated_graft_survival_vs_dialysis_benefit' : 'standard_donor',
    induction_immunosuppression: 'anti_IL2_receptor_basiliximab_for_low_risk_or_anti_thymocyte_globulin_or_alemtuzumab_for_high_risk',
    citation: CITATIONS.KDIGO_TX,
  };
}

function immunosuppressionRegimen(input) {
  const { initial_or_maintenance, immunological_risk_level, time_since_transplant_months, hla_mismatch_count, prior_rejection_episodes, recipient_ebv_status, donor_ebv_status, cmv_status_combination } = input;
  let maintenance = 'tacrolimus_MMF_prednisone_triple_therapy_standard';
  if (immunological_risk_level === 'high') maintenance = 'consider_adding_mTOR_inhibitor_or_belatacept_for_high_risk';
  let prophylaxis = ['valganciclovir_CMV_prophylaxis_for_CMV_donor_pos_recipient_neg_x_3_to_6_months', 'trimethoprim_sulfa_PCP_prophylaxis_x_6_to_12_months', 'antifungal_for_high_risk_x_3_months', 'HBV_prophylaxis_entecavir_for_HBsAg_positive_recipients'];
  return {
    maintenance_regimen: maintenance, immunological_risk_level,
    tacrolimus_trough_target: immunological_risk_level === 'high' ? '10_to_15_ng_per_mL_first_year_then_5_to_10' : '5_to_10_ng_per_mL_first_year_then_3_to_7',
    mmf_dose_target: '1_to_2g_daily_divided',
    prednisone: '5_to_10mg_daily_or_taper_to_off_for_low_risk_after_1_year',
    prophylaxis: prophylaxis,
    monitoring: 'tacrolimus_trough_Q1_months_during_first_year_then_Q3_months', 
    citation: CITATIONS.KDIGO_TX,
  };
}

function acuteRejection(input) {
  const { days_since_transplant, creatinine_rise_from_baseline, donor_specific_antibody_new_positive, ultrasound_findings, biopsy_findings_banff_classification } = input;
  let rejection_type = 'no_rejection';
  if (biopsy_findings_banff_classification === 'acute_T_cell_mediated') rejection_type = 'acute_T_cell_mediated_Banff_IA_IB_IIA_IIB_III';
  else if (biopsy_findings_banff_classification === 'antibody_mediated' || donor_specific_antibody_new_positive === 'yes') rejection_type = 'antibody_mediated_rejection';
  return {
    rejection_type, days_since_transplant, creatinine_rise_from_baseline,
    acute_T_cell_mediated_treatment: ['high_dose_IV_methylprednisolone_500mg_daily_x_3_days_then_taper', 'thymoglobulin_for_steroid_resistant', 'muromonab_CD3_anti_CD3_antibody_for_steroid_and_ATG_resistant'],
    antibody_mediated_treatment: ['plasmapheresis_daily_x_5', 'IVIG_100mg_per_kg_after_each_plasmapheresis_or_2g_per_kg_total', 'rituximab_375mg_per_m2_x_1', 'eculizumab_for_complement_mediated_or_resistant'],
    monitoring: 'creatinine_Q1_to_2_days_during_treatment_donor_specific_antibody_Q2_weeks_then_Q3_months',
    prevention: 'strict_adherence_to_immunosuppression_Q1_month_clinic_visits_drug_levels',
    citation: CITATIONS.KDIGO_TX,
  };
}

function postTransplantInfection(input) {
  const { time_post_transplant_months, fever_present, cmv_viral_load, bk_virus_viral_load, ebv_viral_load, prophylaxis_adherent, neutropenia_present } = input;
  let suspected = 'bacterial_or_fungal';
  if (time_post_transplant_months < 1 && fever_present === 'yes') suspected = 'surgical_or_line_related_bacterial_or_candida';
  else if (time_post_transplant_months >= 1 && time_post_transplant_months < 6) suspected = 'opportunistic_PCP_CMV_BK_virus_Nocardia_Aspergillus';
  else if (time_post_transplant_months >= 6 && prophylaxis_adherent === 'no') suspected = 'community_acquired_or_PJP_or_fungal';
  return {
    suspected_etiology: suspected, time_post_transplant_months,
    workup: ['blood_urine_respiratory_cultures_per_focus', 'CMV_PCR_Q1_week_until_negative', 'BK_virus_PCR_in_urine_and_plasma_Q3_months_for_first_year', 'EBV_PCR_Q3_months_first_year_then_Q6_months', 'chest_imaging_per_symptoms', 'consider_KOH_fungal_stains_and_Galactomannan', 'consider_PJP_PCR_if_not_on_prophylaxis'],
    prophylaxis_considerations: 'adjust_based_on_local_resistance_patterns_and_patient_immunosuppression_load',
    neutropenia_management: neutropenia_present === 'yes' ? 'consider_valganciclovir_dose_reduction_or_pegfilgrastim_GCSF_to_boost_wbc' : 'monitor_CBC_Q2_weeks',
    citation: CITATIONS.KDIGO_TX,
  };
}

module.exports = { transplantEligibility, donorMatching, immunosuppressionRegimen, acuteRejection, postTransplantInfection, CITATIONS, ValidationError };