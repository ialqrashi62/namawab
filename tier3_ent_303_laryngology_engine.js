/**
 * TIER3_ENT-303 Laryngology / Voice Engine
 * Dysphonia evaluation + Vocal cord paralysis + Laryngopharyngeal reflux (LPR) + Voice therapy candidacy + Spasmodic dysphonia
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAO_HNS_LARYNGOLOGY: 'AAO-HNS Laryngology 2024' };

function dysphoniaEvaluation(input) {
  const { duration_weeks, hoarseness_quality, vocal_fatigue, vocal_cord_lesion_visible_on_laryngoscopy, smoking_history, age_years, professional_voice_user } = input;
  let suspicion_for_malignancy = false;
  if (smoking_history === 'yes' && age_years >= 40) suspicion_for_malignancy = true;
  if (duration_weeks >= 4 && smoking_history === 'yes') suspicion_for_malignancy = true;
  return {
    suspicion_for_malignancy, recommendation: suspicion_for_malignancy ? 'urgent_flexible_laryngoscopy_with_biopsy' : 'flexible_laryngoscopy_to_identify_cause',
    workup: ['flexible_laryngoscopy', 'stroboscopy_for_vocal_cord_vibration_assessment', 'voice_therapy_evaluation', 'gastroenterology_evaluation_if_LPR_signs'],
    common_causes: ['vocal_nodules', 'vocal_cord_polyps', 'laryngitis', 'laryngopharyngeal_reflux', 'vocal_cord_paralysis', 'laryngeal_cancer'],
    citation: CITATIONS.AAO_HNS_LARYNGOLOGY,
  };
}

function vocalCordParalysis(input) {
  const { unilateral_or_bilateral, side_affected, position_of_vocal_cord, etiology_known, recent_thoracic_or_neck_surgery } = input;
  let workup = 'CT_neck_and_chest_from_skull_base_to_aortic_arch_with_contrast';
  if (recent_thoracic_or_neck_surgery === 'yes' && unilateral_or_bilateral === 'unilateral') workup = 'clinical_observation_Q3_to_6_months_then_CT_if_no_recovery';
  let treatment = 'voice_therapy_initial_then_consider_medialization_procedure_if_symptomatic';
  if (unilateral_or_bilateral === 'bilateral' && position_of_vocal_cord === 'median') treatment = 'urgent_tracheostomy_for_airway_then_posterior_cordotomy_for_airway_decannulation';
  return {
    unilateral_or_bilateral, side_affected, position_of_vocal_cord, etiology_known,
    workup, treatment,
    prognosis: unilateral_or_bilateral === 'unilateral' && recent_thoracic_or_neck_surgery === 'yes' ? 'high_chance_of_recovery_within_6_to_12_months' : 'recovery_depends_on_etiology_and_duration',
    citation: CITATIONS.AAO_HNS_LARYNGOLOGY,
  };
}

function laryngopharyngealReflux(input) {
  const { symptoms, rsi_score, laryngoscopy_findings, response_to_ppi_trial } = input;
  let lpr_likely = false;
  if (rsi_score >= 13) lpr_likely = true;
  if (laryngoscopy_findings === 'posterior_commissure_hyperemia_or_arytenoid_edema') lpr_likely = true;
  return {
    lpr_likely, rsi_score, laryngoscopy_findings,
    treatment: lpr_likely ? ['twice_daily_PPI_before_breakfast_and_dinner', 'dietary_modification_avoid_caffeine_alcohol_chocolate_spicy', 'elevate_head_of_bed', 'no_eating_within_3h_of_sleep'] : 'consider_other_causes_of_dysphonia',
    ppi_trial_duration_weeks: 8,
    response_to_ppi_trial: response_to_ppi_trial === 'yes' ? 'continue_PPI_taper_gradually' : 'consider_alternative_diagnosis',
    citation: CITATIONS.AAO_HNS_LARYNGOLOGY,
  };
}

function voiceTherapyCandidacy(input) {
  const { diagnosis, hoarseness_duration_weeks, vocal_cord_lesion, smoking_status, motivation_level, occupational_voice_demand } = input;
  let candidate = true;
  if (smoking_status === 'active_smoker' && vocal_cord_lesion === 'leukoplakia_or_malignancy_suspected') candidate = false;
  if (hoarseness_duration_weeks >= 12 && vocal_cord_lesion !== 'nodules_or_muscle_tension_dysphonia') candidate = false;
  return {
    voice_therapy_candidate: candidate, diagnosis, motivation_level,
    therapy_goals: ['improve_vocal_quality', 'reduce_vocal_fatigue', 'prevent_recurrent_lesions', 'support_post_surgical_rehabilitation'],
    duration_of_therapy_weeks: '6_to_12_typically_with_weekly_sessions',
    citation: CITATIONS.AAO_HNS_LARYNGOLOGY,
  };
}

function spasmodicDysphonia(input) {
  const { voice_quality, abductor_or_adductor_type, stress_related_fluctuation, tremor_with_voice, professional_voice_user } = input;
  let diagnosis = 'not_spasmodic_dysphonia';
  if (abductor_or_adductor_type === 'adductor' && voice_quality === 'strained_strangled') diagnosis = 'adductor_spasmotic_dysphonia';
  else if (abductor_or_adductor_type === 'abductor' && voice_quality === 'breathy_with_sentence_break') diagnosis = 'abductor_spasmotic_dysphonia';
  else if (tremor_with_voice === 'yes') diagnosis = 'voice_tremor_consider_dystonia_or_essential_tremor';
  return {
    diagnosis, voice_quality, abductor_or_adductor_type,
    treatment: diagnosis === 'adductor_spasmotic_dysphonia' ? ['botulinum_toxin_injection_to_thyroarytenoid_muscle_Q3_to_6_months', 'voice_therapy_to_learn_adductor_relaxation_techniques'] : diagnosis === 'abductor_spasmotic_dysphonia' ? ['botulinum_toxin_to_posterior_cricoarytenoid_muscle', 'voice_therapy'] : 'continue_evaluation',
    citation: CITATIONS.AAO_HNS_LARYNGOLOGY,
  };
}

module.exports = { dysphoniaEvaluation, vocalCordParalysis, laryngopharyngealReflux, voiceTherapyCandidacy, spasmodicDysphonia, CITATIONS, ValidationError };