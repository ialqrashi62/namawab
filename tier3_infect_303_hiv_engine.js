/**
 * TIER3_INFECT-303 HIV/AIDS Engine
 * HIV screening + ART initiation (WHO/DHHS 2024) + monitoring + OI prophylaxis + PrEP eligibility
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { DHHS_HIV: 'DHHS HIV 2024', WHO_HIV: 'WHO HIV 2023', CDC_PREP: 'CDC PrEP 2024' };

function hivScreening(input) {
  const { age, risk_factors, exposure, current_test_status, opt_out } = input;
  return {
    routine_recommended: age >= 13 && age <= 64,
    opt_out_testing_recommended: opt_out,
    fourth_generation_antigen_antibody_test: 'preferred_initial_test',
    confirmatory_test: 'HIV_1_2_antibody_differentiation_immunoassay',
    nucleic_acid_test: 'if_4th_gen_reactive_but_differentiation_negative_or_indeterminate',
    frequency_if_high_risk: 'Q3M',
    citation: CITATIONS.DHHS_HIV,
  };
}

function artInitiation(input) {
  const { confirmed_hiv_positive, cd4_count, viral_load, hla_b5701, hepatitis_b_status, egfr, child_a, current_aids_defining_illness } = input;
  const same_day = current_aids_defining_illness || cd4_count < 200;
  let regimen = 'BIC_FTC_TAF_single_tablet_regimen (preferred_first_line)';
  if (hla_b5701 === 'positive') regimen = 'avoid_abacavir_use_dolutegravir_OR_DOR_FTC_TAF';
  if (hepatitis_b_status === 'hbsag_positive') regimen = 'tenofovir_or_taf_or_tdf_FTC_required';
  if (egfr < 30) regimen = 'abacavir_lamivudine_dolutegravir_(if_hla_b5701_neg)';
  if (child_a) regimen += '_and_dolutegravir_safety_in_pregnancy_well_documented';
  return {
    immediate_start: same_day,
    regimen,
    labs_at_baseline: ['CD4_count', 'HIV_viral_load', 'HLA_B5701', 'HBsAg_HBcAb_HBsAb', 'HCV_antibody', 'RPR', 'IGRA_TST', 'CBC_LFTs_lipids_urinalysis', 'STD_screening'],
    monitoring: 'Q1_2M_until_suppressed_then_Q3_to_6M',
    citation: CITATIONS.DHHS_HIV,
  };
}

function artMonitoring(input) {
  const { months_on_art, viral_load, cd4_count, adherence_concerns, drug_interactions } = input;
  let status = 'excellent_suppressed';
  if (viral_load >= 200) status = 'viral_failure_reassess_adherence';
  else if (viral_load >= 50) status = 'low_level_viremia_monitor_Q3M';
  return {
    months_on_art, viral_load, cd4_count,
    status,
    next_check_months: status === 'excellent_suppressed' ? 6 : 3,
    adherence_intervention: adherence_concerns ? 'intensive_adherence_counseling_recheck_Q1M' : 'continue_current',
    resistance_test_indicated: viral_load >= 1000 ? 'urgent_genotype_OR_phenotype' : 'not_indicated',
    citation: CITATIONS.DHHS_HIV,
  };
}

function opportunisticInfectionProphylaxis(input) {
  const { cd4_count, toxoplasma_status, mav_status, prior_pjp, current_aids_illness } = input;
  let prophylaxis = [];
  if (cd4_count < 200 || current_aids_illness === 'pjp') prophylaxis.push('TMP_SMX_DS_daily_for_pjp');
  if (cd4_count < 100) prophylaxis.push('azithromycin_for_MAC');
  if (cd4_count < 50 && toxoplasma_status === 'igg_positive') prophylaxis.push('TMP_SMX_DS_for_toxoplasmosis');
  if (mav_status === 'positive' && cd4_count < 50) prophylaxis.push('valganciclovir_for_CMV');
  return {
    cd4_count,
    prophylaxis_list: prophylaxis,
    duration: 'continue_until_CD4_above_threshold_for_3_months_on_art',
    citation: CITATIONS.WHO_HIV,
  };
}

function prepEligibility(input) {
  const { hiv_negative_confirmed, last_exposure_days, risk_factors, eGFR, hepatitis_b_status, child_a, adolescent } = input;
  return {
    eligible: hiv_negative_confirmed && (risk_factors?.length > 0) && eGFR >= 60 && hepatitis_b_status !== 'active',
    options: risk_factors?.includes('msm') ? 'oral_FTC_TDF_daily_OR_injectable_cabotegravir_Q2M_after_oral_lead_in' : 'oral_FTC_TDF_daily',
    baseline_labs: ['HIV_testing_4th_gen_within_7_days', 'HBsAg_HBcAb_HBsAb', 'HCV', 'RPR', 'urine_gonorrhea_chlamydia', 'creatinine_eGFR'],
    monitoring: 'Q3M_HIV_test_labs_renal',
    prep_indicated_for_child_a: child_a ? 'category_B_safe_FTC_TDF' : 'standard',
    adolescent_safe: adolescent ? 'FTC_TDF_age_appropriate_education' : 'standard_adult_protocol',
    citation: CITATIONS.CDC_PREP,
  };
}

module.exports = { hivScreening, artInitiation, artMonitoring, opportunisticInfectionProphylaxis, prepEligibility, CITATIONS, ValidationError };