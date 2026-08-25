/**
 * TIER3_OBGYN-305 Reproductive Medicine Engine
 * Infertility workup + PCOS diagnosis + ovulation induction + IVF protocol + male factor + AMH interpretation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASRM_2024: 'ASRM 2024', ESHRE: 'ESHRE 2024', AEPCOS: 'AE-PCOS Society 2023' };

function infertilityWorkup(input) {
  const { female_age, menstrual_history, partner_age, semen_analysis, prior_pregnancies, duration_months } = input;
  const workup = ['female_hormonal_panel_day_2_to_4_FSH_LH_E2', 'AMH_test_for_ovarian_reserve', 'thyroid_TSH_prolactin', 'tubal_patency_hysterosalpingogram_or_sonosalpingogram', 'mid_luteal_progesterone_Q7_after_ovulation'];
  if (semen_analysis === 'abnormal') workup.push('repeat_semen_analysis_in_8_to_12_weeks_then_urology_referral');
  if (female_age >= 38) workup.push('accelerated_workup_with_AMH_AFC_within_1_month');
  return {
    eligible_for_workup: duration_months >= 12 || (female_age >= 35 && duration_months >= 6) || (semen_analysis === 'abnormal' && duration_months >= 3),
    workup, female_age, partner_age,
    citation: CITATIONS.ASRM_2024,
  };
}

function pcosDiagnosis(input) {
  const { oligomenorrhea, hyperandrogenism, polycystic_ovaries_on_us, amh_value } = input;
  const criteria_count = [oligomenorrhea, hyperandrogenism, polycystic_ovaries_on_us].filter(Boolean).length;
  let diagnosis = 'unlikely_PCOS';
  if (criteria_count >= 2) diagnosis = 'PCOS_rotterdam_criteria_met';
  return {
    diagnosis, criteria_count,
    workup: ['TSH_prolactin_to_exclude_other_causes', 'fasting_insulin_glucose', 'lipid_panel', 'sebum_measurement_Ferriman_Gallwey'],
    amh_value_interpretation: amh_value ? 'PCOS_tends_to_have_high_AMH_but_not_diagnostic' : 'AMH_optional_for_diagnosis',
    citation: CITATIONS.AEPCOS,
  };
}

function ovulationInduction(input) {
  const { pcos_diagnosed, age, bmi, prior_response_to_clomiphene } = input;
  let first_line = 'letrozole_2.5mg_daily_x_5_days_starting_day_3_to_5';
  if (!pcos_diagnosed) first_line = 'continue_to_assess_ovulation_or_consider_IVF';
  if (prior_response_to_clomiphene === 'failure') first_line = 'gonadotropin_low_dose_FSH_then_hCG_trigger';
  return {
    first_line, bmi_optimization: bmi >= 30 ? 'weight_loss_5_to_10_percent_first_then_treatment' : 'standard_protocol',
    monitoring: ['transvaginal_ultrasound_for_follicle_count_Q5_to_7_days', 'estradiol_level_Q5_to_7_days'],
    ovulation_trigger: 'hCG_5000_to_10000_units_when_leading_follicle_18_to_20mm',
    citation: CITATIONS.ASRM_2024,
  };
}

function ivfProtocolSelection(input) {
  const { amh_value, antral_follicle_count, age, prior_response, bmi } = input;
  let protocol = 'antagonist_protocol_with_FSH_GnRH_antagonist_then_hCG_trigger';
  if (amh_value < 1 || antral_follicle_count < 5) protocol = 'mini_IVF_or_consider_donor_oocytes';
  if (amh_value >= 3.5 || age < 35) protocol = 'antagonist_protocol_with_dual_trigger_hCG_plus_GnRH_agonist';
  return {
    protocol, amh_value, antral_follicle_count, age,
    expected_oocytes: amh_value >= 2.0 ? '8_to_15' : amh_value >= 1 ? '5_to_8' : 'less_than_5_consider_mini_IVF',
    expected_live_birth_rate: (age < 35) ? '40_to_55_percent' : '15_to_30_percent',
    citation: CITATIONS.ASRM_2024,
  };
}

function maleFactorEvaluation(input) {
  const { semen_volume_ml, sperm_concentration_million_per_ml, motility_pct, morphology_pct, leukocytes } = input;
  let classification = 'normal';
  if (sperm_concentration_million_per_ml < 15) classification = 'oligospermia';
  if (sperm_concentration_million_per_ml === 0) classification = 'azoospermia';
  return {
    classification,
    semen_analysis: { volume_ml: semen_volume_ml, concentration: sperm_concentration_million_per_ml, motility: motility_pct, morphology: morphology_pct, leukocytes },
    referral: azoospermia === true || severe_oligospermia ? 'urology_or_reproductive_urology_for_fsh_testosterone_post_ejaculate_urine_dna_fragmentation' : 'general_obgyn_or_re',
    ivf_with_icsi_indicated: azoospermia === true || severe_oligospermia === true,
    citation: CITATIONS.ASRM_2024,
  };
}

module.exports = { infertilityWorkup, pcosDiagnosis, ovulationInduction, ivfProtocolSelection, maleFactorEvaluation, CITATIONS, ValidationError };