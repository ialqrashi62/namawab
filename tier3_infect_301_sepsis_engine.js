/**
 * TIER3_INFECT-301 Sepsis Engine
 * Sepsis-3 screening + qSOFA + SOFA + SSC 2021 bundles + source control + antibiotic timing + lactate clearance
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { SSC_2021: 'Surviving Sepsis Campaign 2021', Sepsis3: 'Sepsis-3 SCCM 2016' };

function qsofaScore(input) {
  const { respiratory_rate, sbp, mental_status } = input;
  let score = 0;
  if (respiratory_rate >= 22) score += 1;
  if (sbp <= 100) score += 1;
  if (mental_status !== 'alert') score += 1;
  return { qsofa: score, risk: score >= 2 ? 'high_mortality_risk' : 'low', citation: CITATIONS.Sepsis3 };
}

function sofaScore(input) {
  const { pao2_fio2, platelets, bilirubin, cardiovascular, gcs, creatinine, urine_output } = input;
  const respiration = pao2_fio2 >= 400 ? 0 : pao2_fio2 >= 300 ? 1 : pao2_fio2 >= 200 ? 2 : pao2_fio2 >= 100 ? 3 : 4;
  const platelets_score = platelets >= 150 ? 0 : platelets >= 100 ? 1 : platelets >= 50 ? 2 : platelets >= 20 ? 3 : 4;
  const liver = bilirubin < 1.2 ? 0 : bilirubin < 2 ? 1 : bilirubin < 6 ? 2 : bilirubin < 12 ? 3 : 4;
  const cardiovascular_score = cardiovascular === 'map_65' ? 1 : cardiovascular === 'dopamine_or_equivalent_low' ? 2 : cardiovascular === 'dopamine_high_or_norepinephrine' ? 3 : cardiovascular === 'dopamine_high_with_norepinephrine' ? 4 : 0;
  const neuro = gcs >= 15 ? 0 : gcs >= 13 ? 1 : gcs >= 10 ? 2 : gcs >= 6 ? 3 : 4;
  const renal = creatinine < 1.2 ? 0 : creatinine < 2 ? 1 : creatinine < 3.5 ? 2 : creatinine < 5 ? 3 : 4;
  const total = respiration + platelets_score + liver + cardiovascular_score + neuro + renal;
  return { sofa_total: total, organ_failure_score: total >= 2 ? 'organ_dysfunction_present' : 'normal', citation: CITATIONS.Sepsis3 };
}

function sepsisScreening(input) {
  const { sirs_criteria_count, suspected_infection, qsofa_score } = input;
  const sepsis_likely = suspected_infection && (sirs_criteria_count >= 2 || qsofa_score >= 2);
  return {
    sepsis_likely,
    septic_shock_risk: qsofa_score >= 2 && suspected_infection ? 'evaluate_septic_shock' : 'monitor',
    immediate_action: sepsis_likely ? 'initiate_sepsis_bundle_within_1h' : 'continue_monitoring_Q4h',
    citation: CITATIONS.SSC_2021,
  };
}

function sscBundle(input) {
  const { lactate_initial, lactate_repeat, hypotension, on_vasopressors, source_controllable } = input;
  const bundle_elements = {
    lactate_measured: lactate_initial !== undefined,
    blood_cultures_2_pairs: 'obtain_before_antibiotics_within_45min',
    broad_spectrum_antibiotics_within_1h: 'administer_immediately',
    crystalloid_30ml_kg: hypotension ? 'rapid_bolus_initiated' : 'consider_if_lactate_>4',
    vasopressors_if_septic_shock: on_vasopressors ? 'target_MAP_65_norepinephrine_first' : 'not_yet_needed',
    source_control_within_6h: source_controllable ? 'plan_source_control_procedure' : 'not_applicable',
    reassess_lactate_2_to_4h: lactate_repeat ? 'clearance_target_10pct_q2h' : 'measure_repeat_lactate',
  };
  return { hour_1_bundle: bundle_elements, citation: CITATIONS.SSC_2021 };
}

function antibioticSelection(input) {
  const { suspected_source, suspected_organism, mrsa_risk_factor, pseudomonas_risk_factor, immunocompromised, recent_abx_90d, lactating } = input;
  const regimens = {
    pneumonia_community: 'ceftriaxone_2g_IV_daily + azithromycin_500mg_daily',
    pneumonia_aspiration: 'ampicillin_sulbactam_3g_IV_Q6h',
    pneumonia_hospital: 'cefepime_2g_IV_Q8h OR piperacillin_tazobactam_4.5g_IV_Q6h',
    urinary: 'ceftriaxone_2g_IV_daily OR ciprofloxacin_400mg_IV_Q12h',
    abdominal: 'piperacillin_tazobactam_4.5g_IV_Q6h',
    skin_soft_tissue: 'cefazolin_2g_IV_Q8h + clindamycin_900mg_IV_Q8h_if_severe',
    unknown_with_mrsa: 'vancomycin_25_to_30mg_per_kg_loading_then_trough_15_to_20',
    unknown_with_pseudomonas: 'cefepime_or_pip_tazo',
    immunocompromised_severe: 'meropenem_1g_IV_Q8h_plus_vancomycin',
  };
  let regimen = regimens[source] || regimens[`${suspected_source}_community`] || 'broad_spectrum_per_protocol';
  if (mrsa_risk_factor) regimen += ' + vancomycin';
  if (pseudomonas_risk_factor) regimen += ' + anti_pseudomonal';
  if (recent_abx_90d) regimen += ' (avoid_recent_abx_class)';
  return { regimen, duration_days: 7, de_escalation_target: 'Q72h_reassess_cultures_and_narrow', citation: CITATIONS.SSC_2021 };
}

function sourceControl(input) {
  const { focus, modality, hours_since_diagnosis } = input;
  const interventions = {
    intra_abdominal_abscess: 'percutaneous_drainage_within_24h',
    necrotizing_soft_tissue: 'emergent_surgical_debridement_within_6h',
    cholangitis: 'ERCP_within_24h',
    empyema: 'chest_tube_drainage_within_24h',
    pyelonephritis_with_obstruction: 'ureteral_stent_or_nephrostomy',
    line_related_bacteremia: 'remove_central_line_within_24h',
    endocarditis: 'consider_surgical_valve_replacement_per_indication',
  };
  return {
    focus, modality: modality || interventions[focus],
    urgency: hours_since_diagnosis > 12 ? 'urgent_within_24h' : 'within_6h',
    citation: CITATIONS.SSC_2021,
  };
}

function lactateClearance(input) {
  const { lactate_initial, lactate_repeat, hours_between } = input;
  const reduction_pct = ((lactate_initial - lactate_repeat) / lactate_initial) * 100;
  return {
    reduction_pct: Math.round(reduction_pct * 10) / 10,
    target_met: reduction_pct >= 20,
    interpretation: reduction_pct < 10 ? 'poor_clearance_reassess_volume_and_pressors' : reduction_pct < 20 ? 'borderline_clearance' : 'adequate_clearance',
    next_lactate_hours: hours_between < 2 ? 1 : 2,
  };
}

module.exports = { qsofaScore, sofaScore, sepsisScreening, sscBundle, antibioticSelection, sourceControl, lactateClearance, CITATIONS, ValidationError };