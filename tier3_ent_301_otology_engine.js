/**
 * TIER3_ENT-301 Otology Engine
 * Acute otitis media (AOM) + Chronic otitis media (CSOM) + Sudden sensorineural hearing loss (SSNHL) + Tinnitus assessment + Vertigo (BPPV)
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAP_AOM: 'AAP AOM Guidelines 2013', AAO_HNS_SSNHL: 'AAO-HNS SSNHL 2019' };

function acuteOtitisMedia(input) {
  const { age_months, ear_pain_signs, fever, bulging_tympanic_membrane, otorrhea, both_ears, prior_amoxicillin_allergy, observation_eligible } = input;
  const severe_symptoms = fever >= 39 || otorrhea === 'yes' || both_ears === 'yes' || persistent_symptoms_gt_48h === 'yes';
  let treatment = 'observation_with_close_follow_up_48_to_72h';
  let antibiotic = '';
  if (age_months < 24 || severe_symptoms || observation_eligible !== 'yes') {
    if (prior_amoxicillin_allergy === 'yes') antibiotic = 'amoxicillin_clavulanate_high_dose_90mg_per_kg_per_day_amox_component';
    else antibiotic = 'amoxicillin_high_dose_80_to_90mg_per_kg_per_day';
    treatment = 'antibiotic_therapy_with_pain_management';
  }
  return {
    treatment, antibiotic,
    age_months, ear_pain_signs, fever, bulging_tympanic_membrane, otorrhea,
    follow_up: '48_to_72_hours_if_no_improvement_re_evaluate_consider_alternative_antibiotic',
    citation: CITATIONS.AAP_AOM,
  };
}

function chronicOtitisMedia(input) {
  const { tympanic_membrane_perforation, chronic_otorrhea, cholesteatoma_signs, hearing_loss_type, ear_surgery_history } = input;
  let management = 'topical_antibiotic_drops_quinolones_for_active_discharge';
  if (cholesteatoma_signs === 'yes') management = 'urgent_ENT_consultation_for_surgical_excision_mastoidectomy';
  if (tympanic_membrane_perforation === 'yes' && chronic_otorrhea === 'no') management = 'observation_and_consider_tympaonoplasty_for_hearing_improvement_and_water_protection';
  return {
    management, cholesteatoma_signs, tympanic_membrane_perforation, chronic_otorrhea, hearing_loss_type,
    surgery_options: ['tympanoplasty_for_perforation_repair', 'mastoidectomy_for_cholesteatoma', 'ossiculoplasty_for_ossicular_chain_problems'],
    water_precautions: 'yes_required_for_perforation',
    citation: CITATIONS.AAP_AOM,
  };
}

function suddenSsnhl(input) {
  const { onset_days, hearing_loss_severity_db, unilateral, vertigo_present, tinnitus_present, noise_exposure_history } = input;
  if (onset_days > 90) return { ssnhl_likely: 'no_chronic_hearing_loss', recommendation: 'evaluate_for_other_causes_of_hearing_loss' };
  let urgency = 'urgent_audiometry_within_24_to_48h';
  if (hearing_loss_severity_db >= 70) urgency = 'emergent_audiometry_within_24h_with_immediate_steroid_therapy';
  return {
    ssnhl_likely: onset_days <= 3 && unilateral === 'yes' ? 'yes' : 'possible',
    urgency, onset_days, hearing_loss_severity_db, unilateral: unilateral === 'yes', vertigo_present, tinnitus_present,
    treatment: ['high_dose_oral_prednisone_60mg_per_day_x_7_to_14_days_then_taper', 'intratympanic_steroid_dexamethasone_as_adjunct_or_alternative', 'audiometry_follow_up_Q1_to_3_months'],
    audiometry_required: 'yes_urgent_for_baseline_and_diagnosis',
    citation: CITATIONS.AAO_HNS_SSNHL,
  };
}

function tinnitusAssessment(input) {
  const { pulsatile, unilateral, hearing_loss_associated, duration_weeks, vertigo_with_tinnitus, neurologic_deficits } = input;
  let red_flags_present = false;
  if (pulsatile === 'yes' || unilateral === 'yes' || neurologic_deficits === 'yes') red_flags_present = true;
  return {
    red_flags_present,
    imaging_indicated: red_flags_present ? 'yes_MRI_internal_auditory_canal_with_gadolinium_or_MRA_for_pulsatile' : 'no_first_observe',
    workup: red_flags_present ? ['audiometry', 'MRI_IAC_with_gadolinium_for_unilateral_or_asymmetric', 'MRA_CTA_for_pulsatile_tinnitus', 'neurology_consultation'] : ['audiometry_for_baseline', 'review_medications_ototoxic', 'evaluate_for_Meniere_if_vertigo_present'],
    treatment_options: ['hearing_aid_for_hearing_loss_associated', 'CBT_for_tinnitus_distress', 'sound_therapy_white_noise', 'tinnitus_retraining_therapy'],
    citation: CITATIONS.AAO_HNS_SSNHL,
  };
}

function vertigoBppv(input) {
  const { positional_episodes, dix_hallpike_result, lateralization, duration_episode_seconds, hearing_loss, tinnitus } = input;
  let diagnosis = 'not_BPPV';
  let maneuver = 'no_maneuver_indicated';
  if (dix_hallpike_result === 'positive_with_upbeating_torsional_nystagmus' && lateralization === 'unilateral') { diagnosis = 'posterior_canal_BPPV'; maneuver = 'Epley_maneuver_to_affected_side'; }
  else if (dix_hallpike_result === 'horizontal_nystagmus' && lateralization === 'lateral') { diagnosis = 'lateral_canal_BPPV'; maneuver = 'Lempert_or_BBQ_roll_maneuver'; }
  return {
    diagnosis, maneuver, positional_episodes, dix_hallpike_result,
    differential_considerations: hearing_loss === 'yes' && tinnitus === 'yes' ? 'consider_Meniere_disease_or_labyrinthitis_or_vestibular_neuritis' : 'consider_central_vestibular_pathology_or_migraine_associated_vertigo',
    follow_up: 'if_no_resolution_re_evaluate_in_2_to_4_weeks_consider_imaging_for_central_pathology',
    citation: CITATIONS.AAO_HNS_SSNHL,
  };
}

module.exports = { acuteOtitisMedia, chronicOtitisMedia, suddenSsnhl, tinnitusAssessment, vertigoBppv, CITATIONS, ValidationError };