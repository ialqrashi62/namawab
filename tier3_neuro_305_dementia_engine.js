/**
 * TIER3_NEURO-305 Dementia Engine
 * Cognitive screening + differential + MMSE + CDR staging + AD treatment + behavioral management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAN_DEMENTIA: 'AAN Dementia 2024', NIA_AA: 'NIA-AA Alzheimer 2024' };

function cognitiveScreening(input) {
  const { mmse_total, moca_total, memory_problems_reported, age, education_years, informant_history } = input;
  const moca_normal = education_years >= 12 ? moca_total >= 26 : moca_total >= 25;
  const mmse_normal = education_years >= 12 ? mmse_total >= 25 : mmse_total >= 24;
  const positive_screen = !moca_normal || !mmse_normal || memory_problems_reported;
  return {
    moca_total, mmse_total,
    screen_positive: positive_screen,
    next_step: positive_screen ? 'full_neuropsychological_battery + labs (TSH, B12, RPR, HIV)' : 'reassess_in_1_year_if_risk_factors',
    citation: CITATIONS.AAN_DEMENTIA,
  };
}

function dementiaDifferential(input) {
  const { mmse_total, memory_loss, visuospatial, language, executive_function, hallucinations, parkinsonian_features, stepwise_decline, age, csf_biomarkers, fdg_pet_pattern } = input;
  let diagnosis = 'undetermined';
  if (stepwise_decline && age >= 65) diagnosis = 'vascular_dementia_likely';
  else if (parkinsonian_features && visuospatial_affected && hallucinations) diagnosis = 'dementia_with_lewy_bodies_likely';
  else if (language_affected_first && executive_function && memory_affected_second) diagnosis = 'frontotemporal_dementia_likely';
  else if (memory_loss && age >= 65 && mmse_total <= 24 && csf_biomarkers === 'abnormal_amyloid_tau') diagnosis = 'alzheimers_disease_likely';
  return {
    diagnosis,
    csf_biomarker_pattern: csf_biomarkers,
    fdg_pet_pattern: fdg_pet_pattern,
    workup_required: ['MRI_brain', 'labs_TSH_B12_RPR_HIV', 'CSF_biomarkers_for_typical_AD'],
    citation: CITATIONS.NIA_AA,
  };
}

function mmseInterpretation(input) {
  const { mmse_total, education_years, age } = input;
  let severity = 'normal';
  if (mmse_total < 10) severity = 'severe';
  else if (mmse_total < 20) severity = 'moderate';
  else if (mmse_total < 26) severity = 'mild';
  return {
    mmse_total, severity,
    education_adjusted: education_years < 12 ? 'lower_threshold_+1' : 'standard_threshold',
    age_adjusted: age >= 80 ? 'lower_threshold_-_1' : 'standard_threshold',
    interpretable: mmse_total >= 24 ? 'normal_or_mci' : 'suggests_dementia',
  };
}

function cdrStaging(input) {
  const { memory, orientation, judgment_problem_solving, community_affairs, home_hobbies, personal_care } = input;
  const sum = memory + orientation + judgment_problem_solving + community_affairs + home_hobbies + personal_care;
  const cdr = sum / 6;
  let stage = 'CDR_0_no_dementia';
  if (cdr === 0.5) stage = 'CDR_0.5_very_mild';
  else if (cdr === 1) stage = 'CDR_1_mild';
  else if (cdr === 2) stage = 'CDR_2_moderate';
  else if (cdr === 3) stage = 'CDR_3_severe';
  return { cdr: Math.round(cdr * 100) / 100, stage, domains: { memory, orientation, judgment_problem_solving, community_affairs, home_hobbies, personal_care } };
}

function alzheimersTreatment(input) {
  const { mmse_total, age, csf_biomarkers, eGFR, hepatic } = input;
  const mild_to_moderate = mmse_total >= 10 && mmse_total <= 26;
  const severe = mmse_total < 10;
  const treatments = [];
  if (mild_to_moderate) treatments.push('donepezil_5mg_then_10mg_daily', 'memantine_combination_for_severe_or_moderate_advanced');
  if (severe) treatments.push('memantine_5mg_then_20mg_daily', 'consider_disease_modifying_anti_amyloid_if_biomarker_positive');
  if (csf_biomarkers === 'abnormal_amyloid_tau' && age >= 65 && mmse_total >= 20) treatments.push('consider_lecanemab_or_donanemab_after_MRI_baseline');
  if (eGFR < 30 && treatments.includes('donepezil_5mg_then_10mg_daily')) treatments.filter(t => !t.includes('donepezil'));
  return { treatments, monitoring: ['MRI_Q3_6M_for_amyloid_related_imaging_abnormalities', 'cognitive_assessment_Q6M'], citation: CITATIONS.NIA_AA };
}

module.exports = { cognitiveScreening, dementiaDifferential, mmseInterpretation, cdrStaging, alzheimersTreatment, CITATIONS, ValidationError };