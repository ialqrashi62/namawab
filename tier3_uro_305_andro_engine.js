/**
 * TIER3_URO-305 Male Infertility / Andrology Engine
 * Semen analysis interpretation + Male hypogonadism + Erectile dysfunction + Vasectomy reversal + Testicular pain evaluation
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ASRM: 'ASRM Male Infertility 2024', AUA_ANDRO: 'AUA Andrology 2024' };

function semenAnalysisInterpretation(input) {
  const { semen_volume_ml, sperm_concentration_m_per_ml, total_sperm_count_million, motility_pct, progressive_motility_pct, morphology_pct_strict, ph, white_blood_cells_million_per_ml } = input;
  let interpretation = 'normal';
  let total_motile_sperm_count = (total_sperm_count_million || 0) * (progressive_motility_pct || 0) / 100;
  if (semen_volume_ml < 1.5 || sperm_concentration_m_per_ml < 15 || progressive_motility_pct < 32 || morphology_pct_strict < 4) interpretation = 'abnormal_oligoastheno_terato_or_combination';
  if (white_blood_cells_million_per_ml >= 1) interpretation += '_consider_genital_tract_infection_antibiotic_trial';
  return {
    total_motile_sperm_count: total_motile_sperm_count.toFixed(2), interpretation,
    abn: { low_volume_azoo_astheno_suspected: semen_volume_ml < 1.5 ? 'yes' : 'no', oligospermia: sperm_concentration_m_per_ml < 15 ? 'yes' : 'no', asthenospermia: progressive_motility_pct < 32 ? 'yes' : 'no', teratospermia: morphology_pct_strict < 4 ? 'yes' : 'no' },
    next_step: interpretation.startsWith('normal') ? 'repeat_in_3_months_if_pregnancy_not_achieved' : 'refer_to_reproductive_urology_for_further_evaluation',
    workup: 'consider_testosterone_FSH_LH_prolactin_E2_genetic_testing_cf_carrier_Y_chromosome_deletion_karyotype_in_azoospermia',
    citation: CITATIONS.ASRM,
  };
}

function maleHypogonadism(input) {
  const { testosterone_total_ng_dl, testosterone_free_pg_ml, lh_level, fsh_level, libido_decreased, erectile_dysfunction, fatigue, age_years } = input;
  let hypogonadism_likely = false;
  if (testosterone_total_ng_dl < 300 && (libido_decreased === 'yes' || erectile_dysfunction === 'yes')) hypogonadism_likely = true;
  let type = 'mixed_pattern_unclear';
  if (testosterone_total_ng_dl < 300 && lh_level < 9) type = 'secondary_hypogonadism_hypothalamic_pituitary';
  else if (testosterone_total_ng_dl < 300 && lh_level >= 9) type = 'primary_hypogonadism_testicular_failure';
  return {
    hypogonadism_likely, type, testosterone_total_ng_dl, lh_level,
    treatment: hypogonadism_likely ? 'testosterone_replacement_therapy_consider_serum_prostate_screening_follow_up' : 'lifestyle_modification_address_sleep_quality_exercise',
    contraindications_to_TRT: ['PSA_above_4_or_rapidly_rising', 'suspicious_prostate_on_DRE', 'elevated_Hct_above_54pct', 'untreated_severe_sleep_apnea', 'uncontrolled_heart_failure', 'planning_pregnancy_for_partner'],
    monitoring_on_TRT: 'testosterone_Q3M_until_stable_then_Q6M_hematocrit_Q3M_PSA_Q6_to_12M',
    citation: CITATIONS.AUA_ANDRO,
  };
}

function erectileDysfunction(input) {
  const { organic_or_psychogenic, onset_pattern, morning_erection_quality, comorbidities_diabetes_hypertension, medication_history, luts_present } = input;
  let primary_cause = 'multifactorial_vascular_in_aging';
  if (morning_erection_quality === 'absent' && onset_pattern === 'gradual') primary_cause = 'organic_vascular_neurogenic_or_medication_induced';
  if (morning_erection_quality === 'present' && onset_pattern === 'sudden') primary_cause = 'psychogenic_or_situational';
  return {
    primary_cause, onset_pattern, morning_erection_quality,
    first_line_therapy: 'PDE5_inhibitor_sildenafil_tadalafil_vardenafil_avanafil_with_sexual_stimulation',
    contraindication: comorbidities_diabetes_hypertension === 'yes_on_nitrates' ? 'PDE5_inhibitor_contraindicated_with_nitrates_use_alternative' : 'none',
    second_line: ['intracavernosal_alprostadil_injection', 'intraurethral_alprostadil_MUSE', 'vacuum_erection_device'],
    surgical_options: 'penile_implant_prosthesis_for_refractory_ED_after_failed_first_and_second_line_therapy',
    workup: 'testosterone_FSH_LH_prolactin_HbA1c_lipids_PSAD_baseline_then_address_cardiovascular_risk_factors',
    citation: CITATIONS.AUA_ANDRO,
  };
}

function vasectomyReversal(input) {
  const { years_since_vasectomy, female_partner_age_years, female_partner_fertility_status, prior_reversal_attempt, prior_testicular_findings, sperm_antibodies_present } = input;
  let success_rate_pct = 95;
  if (years_since_vasectomy < 5) success_rate_pct = 95;
  else if (years_since_vasectomy >= 5 && years_since_vasectomy < 10) success_rate_pct = 80;
  else if (years_since_vasectomy >= 10) success_rate_pct = 60;
  return {
    success_rate_pct, years_since_vasectomy, female_partner_age_years,
    procedure: 'microsurgical_vasovasostomy_or_efferent_ductules_to_epididymostomy_with_intraoperative_sperm_analysis',
    candidates: ['male_age_lt_60_with_pregnancy_desire', 'female_partner_age_lt_35_with_normal_fertility', 'no_significant_comorbidities'],
    pre_op_workup: ['seminal_fructose_and_post_ejaculate_urine_test_for_epididymal_obstruction', 'anti_sperm_antibodies', 'scrotal_exam_for_testicular_consistency'],
    post_op: 'serum_testosterone_Q3_months_annual_seminal_analysis_2_to_3_months_then_Q6_months_until_pregnancy',
    citation: CITATIONS.ASRM,
  };
}

function testicularPainEvaluation(input) {
  const { pain_unilateral_bilateral, sudden_onset, fever_present, swelling_present, mass_palpable, trauma_history, prior_hernia_repair, luts_present } = input;
  let red_flags_present = false;
  if (sudden_onset === 'yes' && swelling_present === 'yes') red_flags_present = true;
  if (mass_palpable === 'yes' && pain_unilateral_bilateral === 'unilateral') red_flags_present = true;
  return {
    red_flags_present, sudden_onset, mass_palpable,
    differential: sudden_onset === 'yes' && fever_present === 'yes' ? 'epididymo_orchitis_or_testicular_torsion' : mass_palpable === 'yes' ? 'testicular_cancer' : luts_present === 'yes' ? 'referred_pain_from_prostatitis' : 'chronic_pelvic_pain_or_chronic_orchialgia',
    immediate_imaging: red_flags_present ? 'scrotal_doppler_ultrasound_immediately_to_rule_out_torsion_or_tumor' : 'scrotal_ultrasound_for_non_resolving_pain',
    torsion_protocol: 'if_torsion_suspected_within_6h_of_onset_immediate_surgical_exploration_within_24h_bilateral_orchiopexy',
    chronic_orchialgia_management: 'analgesia_NSAID_gabapentin_or_amitriptyline_for_neuropathic_pain_spermatic_cord_block_if_refractory_microsurgical_denervation_of_spermatic_cord_as_last_resort',
    citation: CITATIONS.AUA_ANDRO,
  };
}

module.exports = { semenAnalysisInterpretation, maleHypogonadism, erectileDysfunction, vasectomyReversal, testicularPainEvaluation, CITATIONS, ValidationError };