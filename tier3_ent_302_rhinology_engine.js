/**
 * TIER3_ENT-302 Rhinology/Sinus Engine
 * Allergic rhinitis (ARIA) + Chronic rhinosinusitis (CRS) + Nasal polyps + Epistaxis severity + Olfactory dysfunction
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ARIA: 'ARIA Guidelines 2024', AAO_HNS: 'AAO-HNS Sinusitis 2024' };

function allergicRhinitisAria(input) {
  const { symptom_duration_days, nasal_symptoms, ocular_symptoms, frequency, sleep_disturbance, daily_activity_impairment } = input;
  const persistent = symptom_duration_days >= 4;
  const intermittent = symptom_duration_days < 4 && duration_days_in_weeks > 4;
  const moderate_severe = sleep_disturbance === 'yes' || daily_activity_impairment === 'yes';
  let classification = 'mild_intermittent';
  if (persistent && moderate_severe) classification = 'moderate_severe_persistent';
  else if (persistent && !moderate_severe) classification = 'mild_persistent';
  else if (!persistent && moderate_severe) classification = 'moderate_severe_intermittent';
  else classification = 'mild_intermittent';
  return {
    classification, persistent, moderate_severe,
    treatment: classification === 'moderate_severe_persistent' ? 'intranasal_corticosteroid_plus_intranasal_antihistamine_or_oral_antihistamine_consider_immunotherapy' : classification === 'mild_persistent' ? 'intranasal_corticosteroid_low_dose_oral_antihistamine_prn' : classification === 'moderate_severe_intermittent' ? 'oral_antihistamine_plus_intranasal_corticosteroid_prn' : 'oral_antihistamine_prn_or_intranasal_corticosteroid_prn',
    ocular_symptoms, nasal_symptoms,
    citation: CITATIONS.ARIA,
  };
}

function chronicRhinosinusitis(input) {
  const { duration_weeks, nasal_obstruction, facial_pain, hyposmia, purulent_discharge, polyps_visible_on_endoscopy, ct_findings } = input;
  if (duration_weeks < 12) return { chronic_rhinosinusitis_diagnosed: 'no', recommendation: 're_evaluate_after_12_weeks_of_appropriate_therapy' };
  let phenotype = 'crs_without_polyp';
  if (polyps_visible_on_endoscopy === 'yes') phenotype = 'crs_with_polyp';
  return {
    chronic_rhinosinusitis_diagnosed: 'yes', phenotype, duration_weeks,
    ct_findings, polyps_visible: polyps_visible_on_endoscopy === 'yes',
    first_line_treatment: phenotype === 'crs_without_polyp' ? ['saline_irrigation', 'intranasal_corticosteroid', 'consider_short_course_antibiotics_for_acute_exacerbation'] : ['saline_irrigation', 'intranasal_corticosteroid', 'consider_biologics_dupilumab_omalizumab_mepolizumab_for_severe_or_recurrent'],
    surgical_indication: 'failure_of_maximal_medical_therapy_then_FESS_functional_endoscopic_sinus_surgery',
    citation: CITATIONS.AAO_HNS,
  };
}

function nasalPolypsAssessment(input) {
  const { polyps_visible, polyp_grade, bilaterally_present, asthma_comorbidity, aspirin_sensitivity, previous_surgery_count } = input;
  let surgical_recommendation = 'medical_therapy_first';
  if (polyp_grade === 3 || polyp_grade === 4 || previous_surgery_count >= 2) surgical_recommendation = 'consider_surgery_versus_biologics_dupilumab_preferred';
  return {
    bilaterally_present: bilaterally_present === 'yes',
    samters_triad: bilaterally_present === 'yes' && asthma_comorbidity === 'yes' && aspirin_sensitivity === 'yes' ? 'yes_AERD_aspirin_exacerbated_respiratory_disease' : 'no',
    polyp_grade: polyp_grade || null, polyps_visible,
    surgical_recommendation,
    biologic_indications: ['bilateral_polyps', 'asthma_comorbidity', 'previous_surgery', 'need_for_repeated_courses_of_oral_steroid'],
    citation: CITATIONS.AAO_HNS,
  };
}

function epistaxisSeverity(input) {
  const { bleeding_rate, hemodynamic_status, posterior_source, anticoagulation_status, duration_minutes } = input;
  let severity = 'mild_anterior_epistaxis';
  if (posterior_source === 'yes') severity = 'severe_posterior_epistaxis';
  if (hemodynamic_status === 'unstable') severity = 'critical_unstable_posterior_or_maxillary_artery_bleed';
  return {
    severity, bleeding_rate, posterior_source, hemodynamic_status,
    management: severity === 'critical_unstable_posterior_or_maxillary_artery_bleed' ? ['establish_2_large_bore_IVs', 'cross_match_blood_units', 'anterior_posterior_packing_or_foley_catheter_tamponade', 'ENT_consultation_for_endoscopic_cautery_or_surgical_ligation', 'consider_arterial_embolization_if_surgical_ligation_not_feasible'] : severity === 'severe_posterior_epistaxis' ? ['anterior_packing_then_posterior_packing_if_persistent', 'ENT_consultation', 'IV_fluid_resuscitation'] : ['pinch_pressure_on_cartilaginous_portion_of_nose', 'topical_vasoconstrictor', 'silver_nitrate_cautery_if_anterior_source_identified', 'nasal_packing_anterior_if_persistent'],
    anticoagulation_status, duration_minutes,
    citation: CITATIONS.AAO_HNS,
  };
}

function olfactoryDysfunction(input) {
  const { duration_weeks, conductive_or_neurosensory_cause, septal_deviation, polyps_present, post_viral_cause, trauma_history, neuro_degenerative_symptoms } = input;
  let suspected_etiology = 'unknown';
  if (post_viral_cause === 'yes') suspected_etiology = 'post_viral_olfactory_neuropathy';
  else if (trauma_history === 'yes') suspected_etiology = 'post_traumatic_olfactory_neuropathy';
  else if (polyps_present === 'yes' || septal_deviation === 'severe') suspected_etiology = 'conductive_obstructive';
  else if (neuro_degenerative_symptoms === 'yes') suspected_etiology = 'neurodegenerative_PD_or_alzheimers';
  return {
    suspected_etiology, duration_weeks, conductive_or_neurosensory_cause,
    workup: ['detailed_history_for_recent_illness_trauma_medications', 'ENT_examination_with_endoscopy', 'CT_sinus_for_anatomical_causes', 'UPSIT_or_Sniffin_Sticks_olfactory_test_optional', 'MRI_brain_if_neuro_degenerative_suspected'],
    treatment: suspected_etiology === 'conductive_obstructive' ? 'treat_underlying_obstruction_surgery_for_polyps_septoplasty' : suspected_etiology === 'post_viral_olfactory_neuropathy' ? 'olfactory_training_12_weeks_intranasal_steroids' : 'olfactory_training_smell_training_prognosis_depends_on_etiology',
    citation: CITATIONS.AAO_HNS,
  };
}

module.exports = { allergicRhinitisAria, chronicRhinosinusitis, nasalPolypsAssessment, epistaxisSeverity, olfactoryDysfunction, CITATIONS, ValidationError };