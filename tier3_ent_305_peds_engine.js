/**
 * TIER3_ENT-305 Pediatric ENT Engine
 * Pediatric otitis media + Adenoid hypertrophy + Tonsillitis + Pediatric hearing screening (OAE/ABR) + Pediatric airway obstruction
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAP_PEDS: 'AAP Pediatric ENT 2024', AAO_HNS_PEDS: 'AAO-HNS Pediatric 2024' };

function pediatricOtitisMedia(input) {
  const { age_months, ear_pain, fever, bulging_tym, otorrhea, both_ears, severe_symptoms } = input;
  let treatment = 'observation_with_pain_control';
  let antibiotic = 'no_antibiotic';
  if (age_months < 24 || severe_symptoms === 'yes') { treatment = 'antibiotic_therapy_with_pain_management'; antibiotic = 'amoxicillin_high_dose_80_to_90mg_per_kg_per_day'; }
  if (age_months >= 24 && severe_symptoms === 'no') treatment = 'observation_or_antibiotic_based_on_shared_decision_making';
  return {
    treatment, antibiotic, age_months, otorrhea,
    watchful_waiting_criteria: ['age_24_months_or_above', 'no_severe_symptoms', 'reliable_follow_up'],
    tympanostomy_tube_indications: ['recurrent_AOM_3_or_more_episodes_in_6_months_or_4_in_12_months', 'persistent_effusion_with_hearing_loss_more_than_3_months'],
    citation: CITATIONS.AAP_PEDS,
  };
}

function adenoidHypertrophy(input) {
  const { mouth_breathing, snoring, otitis_media_with_effusion, sleep_apnea_signs, adenoid_size_grade } = input;
  let indication_for_surgery = false;
  if (sleep_apnea_signs === 'yes' || otitis_media_with_effusion === 'chronic_yes') indication_for_surgery = true;
  if (mouth_breathing === 'yes' && adenoid_size_grade >= 2) indication_for_surgery = true;
  return {
    indication_for_adenoidectomy: indication_for_surgery, adenoid_size_grade,
    surgical_indications: ['obstructive_sleep_apnea_documented', 'chronic_otitis_media_with_effusion_requiring_typmanostomy', 'chronic_mouth_breathing_with_dental_or_facial_growth_concerns', 'recurrent_sinusitis'],
    workup: ['sleep_study_if_OSHA_signs', 'lateral_neck_xray_for_adenoid_size_assessment', 'tympanometry_for_OME'],
    citation: CITATIONS.AAO_HNS_PEDS,
  };
}

function tonsillitisAssessment(input) {
  const { centor_criteria_count, age_years, strep_rapid_test_result, recurrent_episodes_per_year, peri_tonsillar_abscess_history, sleep_apnea_signs } = input;
  let treatment = 'supportive_care_analgesia_fluids';
  if (centor_criteria_count >= 3 && strep_rapid_test_result === 'pending' || strep_rapid_test_result === 'positive') treatment = 'antibiotics_penicillin_V_or_amoxicillin_10_days';
  let tonsillectomy_indicated = false;
  if (recurrent_episodes_per_year >= 7 || (recurrent_episodes_per_year >= 5 && sleep_apnea_signs === 'yes') || peri_tonsillar_abscess_history === 'yes') tonsillectomy_indicated = true;
  return {
    treatment, centor_criteria_count, strep_rapid_test_result,
    tonsillectomy_indicated,
    tonsillectomy_indications_per_AAO_HNS: ['7_or_more_episodes_in_past_year', '5_or_more_per_year_for_2_years', '3_or_more_per_year_for_3_years', 'peri_tonsillar_abscess_history', 'sleep_disordered_breathing_with_adenotonsillar_hypertrophy'],
    citation: CITATIONS.AAO_HNS_PEDS,
  };
}

function pediatricHearingScreening(input) {
  const { age_months, oae_referred, abr_referred, behavioral_observation, risk_factors_present } = input;
  let interpretation = 'pass_no_action';
  if (oae_referred === 'yes' || abr_referred === 'yes') interpretation = 'refer_diagnostic_audiology_within_1_month';
  if (risk_factors_present === 'yes' && oae_referred === 'yes') interpretation = 'urgent_diagnostic_audiology_within_2_weeks';
  return {
    oae_referred, abr_referred, risk_factors_present,
    interpretation,
    next_step: interpretation === 'pass_no_action' ? 'continue_universal_screening_at_follow_up_visits' : 'diagnostic_audiology_evaluation_with_pediatric_audiologist',
    risk_factors: ['NICU_stay_gt_5_days', 'family_history_of_permanent_childhood_hearing_loss', 'craniofacial_anomalies', 'TORCH_infections', 'genetic_syndrome_with_hearing_loss'],
    citation: CITATIONS.AAP_PEDS,
  };
}

function pediatricAirwayObstruction(input) {
  const { stridor, age_years, foreign_body_history, fever, barking_cough, hoarseness, retractions, cyanosis } = input;
  let severity = 'mild';
  if (cyanosis === 'yes' || retractions === 'severe') severity = 'severe';
  else if (retractions === 'moderate' || stridor === 'at_rest') severity = 'moderate';
  let management = 'continue_monitoring';
  if (severity === 'severe') management = 'immediate_airway_management_possible_intubation_or_surgical_airway';
  else if (barking_cough === 'yes') management = 'croup_protocol_dexamethasone_0.6mg_per_kg_and_nebulized_epinephrine_if_severe';
  else if (foreign_body_history === 'yes') management = 'rigid_bronchoscopy_for_FB_removal';
  else if (fever === 'yes') management = 'consider_epiglottitis_imaging_and_airway_management_with_anesthesia';
  return {
    severity, stridor, retractions, cyanosis, management,
    workup: ['flexible_endoscopy_or_rigid_bronchoscopy_in_OR', 'CT_neck_and_chest', 'viral_panel_if_suspected_croup_or_epiglottitis'],
    citation: CITATIONS.AAO_HNS_PEDS,
  };
}

module.exports = { pediatricOtitisMedia, adenoidHypertrophy, tonsillitisAssessment, pediatricHearingScreening, pediatricAirwayObstruction, CITATIONS, ValidationError };