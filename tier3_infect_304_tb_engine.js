/**
 * TIER3_INFECT-304 Tuberculosis Engine
 * TB screening + GeneXpert interpretation + DS-TB regimen + MDR-TB + LTBI + contact tracing + BCG
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { WHO_TB_2023: 'WHO TB 2023', ATS_TB: 'ATS/CDC/IDSA TB 2024' };

function tbScreening(input) {
  const { risk_factors, symptoms, prior_tb, tst_or_igra, chest_xray, close_contact } = input;
  let risk = 'low';
  if (close_contact) risk = 'very_high';
  else if (prior_tb) risk = 'high';
  else if (risk_factors && symptoms) risk = 'high';
  else if (risk_factors || symptoms) risk = 'moderate';
  const diagnostic_action = risk === 'very_high' || risk === 'high' ? 'urgent_IGRA_or_TST_AND_chest_xray_AND_sputum' : 'screen_per_local_protocol';
  return {
    tb_likely: symptoms && (tst_or_igra === 'positive' || chest_xray === 'abnormal'),
    risk_level: risk,
    diagnostic_action,
    close_contact: close_contact,
    citation: CITATIONS.WHO_TB_2023,
  };
}

function geneXpertInterpretation(input) {
  const { mtb_detected, rif_resistance } = input;
  if (mtb_detected === 'not_detected') return { result: 'negative', actionable: 'if_high_suspicion_continue_workup' };
  if (mtb_detected && !rif_resistance) return { result: 'MTB_detected_RIF_sensitive_DS_TB', regimen: 'HRZE_x_2_months_then_HR_x_4_months', citation: CITATIONS.WHO_TB_2023 };
  if (mtb_detected && rif_resistance === 'detected') return { result: 'MTB_detected_RIF_resistant_presumptive_MDR_TB', regimen: 'BPaLM_x_6_months_OR_conventional_MDR_regimen', citation: CITATIONS.WHO_TB_2023 };
  return { result: 'MTB_trace_detected', actionable: 'repeat_test_and_continue_workup' };
}

function dsTbRegimen(input) {
  const { weight_kg, age, drug_inventory, hiv_positive, child_a, hepatic_history } = input;
  let regimen = { intensive: 'isoniazid_5mg_per_kg + rifampin_10mg_per_kg + pyrazinamide_25mg_per_kg + ethambutol_15mg_per_kg daily x 2 months', continuation: 'isoniazid_5mg_per_kg + rifampin_10mg_per_kg daily x 4 months' };
  if (hiv_positive) regimen = { ...regimen, note: 'if_art_naive_start_art_within_2_to_8_weeks_of_tb_treatment' };
  if (child_a) regimen = { ...regimen, note: 'monitor_liver_function_monthly_pregnancy' };
  if (hepatic_history) regimen.intensive = 'streptomycin_or_amikacin + levofloxacin + ethambutol + isoniazid_(if_tolerated)';
  return { regimen, duration_months: 6, total_doses: 182, weekly: '5_7_days_per_week_daily', citation: CITATIONS.ATS_TB };
}

function mdrTbRegimen(input) {
  const { resistance_pattern, prior_tb_treatments, age, baseline_qtc } = input;
  const regimens = {
    newly_diagnosed_mdr: 'BPaLM_x_6_months (bedaquiline_pretomanid_linezolid_moxifloxacin)',
    fluoroquinolone_resistant_mdr: 'BPaL_x_6_months',
    pre_xdr_or_xdr: 'bedaquiline_linezolid_pretomanid_efavirenz_clofazimine_x_18_to_20_months',
  };
  return {
    regimen: regimens[resistance_pattern] || regimens.newly_diagnosed_mdr,
    baseline_qtc_required: true,
    monitoring: 'monthly_eKG_for_qtc_prolongation_with_bedaquiline_and_or_fluoroquinolone',
    duration_months: resistance_pattern === 'pre_xdr_or_xdr' ? 18 : 6,
    adverse_events: ['qtc_prolongation', 'peripheral_neuropathy_with_linezolid', 'optic_neuritis', 'hepatotoxicity'],
    citation: CITATIONS.WHO_TB_2023,
  };
}

function ltbiTreatment(input) {
  const { tst_size_mm_or_igra_positive, recent_conversion, prior_treatment, age } = input;
  let regimen = 'INH_300mg_daily_x_9_months (preferred) OR_RIF_x_4_months (if_acceptable)';
  if (recent_conversion) regimen += ' | immediate_treatment';
  if (prior_treatment) regimen += ' | second_time_treatment_with_public_health_consult';
  return {
    eligible: tst_size_mm_or_igra_positive,
    regimen, duration_months: regimen.includes('9_months') ? 9 : 4,
    monitoring: ['monthly_symptom_review', 'baseline_and_monthly_liver_function_if_age_35_or_hepatic_history'],
    citation: CITATIONS.ATS_TB,
  };
}

function contactTracing(input) {
  const { index_case_diagnosis, household_contacts, window_prophylaxis_eligible } = input;
  return {
    household_contacts_to_screen: household_contacts,
    high_priority_for_screening: index_case_diagnosis === 'sputum_positive_pulmonary_tb',
    testing: ['IGRA_preferred_or_TST', 'chest_xray_baseline'],
    window_prophylaxis_eligible,
    recommended_action: window_prophylaxis_eligible ? 'consider_window_prophylaxis_after_latest_exposure' : 'screen_and_treat_if_active_tb_diagnosed_or_LTBI_per_risk',
  };
}

function bcgVaccination(input) {
  const { age_months, hiv_exposure, prior_bcg, tb_history } = input;
  return {
    recommended: age_months >= 0 && age_months < 12 && !prior_bcg && !tb_history && hiv_exposure !== 'confirmed_hiv_positive',
    contraindicated: hiv_exposure === 'confirmed_hiv_positive' || age_months >= 12 || tb_history === 'active',
    routine_age_in_sa: 'at_birth',
    citation: CITATIONS.WHO_TB_2023,
  };
}

module.exports = { tbScreening, geneXpertInterpretation, dsTbRegimen, mdrTbRegimen, ltbiTreatment, contactTracing, bcgVaccination, CITATIONS, ValidationError };