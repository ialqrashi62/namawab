/**
 * TIER3_PEDS-301 NICU (Neonatal Intensive Care) Engine
 * APGAR + Neonatal resuscitation (NRP) + respiratory distress (Silverman) + neonatal sepsis + ROP screening + NICU dosing
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AAP_NRP_2024: 'AAP NRP 2024', NICE_NICU: 'NICE Neonatal Care 2024' };

function apgarScore(input) {
  const { heart_rate, respiratory_effort, muscle_tone, reflex_irritability, skin_color } = input;
  const total = heart_rate + respiratory_effort + muscle_tone + reflex_irritability + skin_color;
  let interpretation = 'normal_need_routine_care';
  if (total <= 3) interpretation = 'critically_low_need_immediate_resuscitation';
  else if (total <= 5) interpretation = 'moderately_low';
  return { apgar_at_1_minute: total, interpretation, citation: CITATIONS.AAP_NRP_2024 };
}

function nrpResuscitation(input) {
  const { gestation_weeks, breathing_now, hr_bpm, oxygen_required, equipment_available } = input;
  let steps = ['warm_position_clear_airway_dry_stimulate'];
  if (breathing_now === 'apnea_or_ineffective' || hr_bpm < 100) steps.push('PPV_with_21_percent_oxygen_then_21_to_30_percent_for_term_then_21_to_30_for_preterm');
  if (hr_bpm < 60) steps.push('intubation_and_chest_compressions_ratio_3_to_1');
  if (hr_bpm < 60) steps.push('IV_epinephrine_0.01_to_0.03_mg_per_kg_q3_5_minutes');
  return {
    steps,
    equipment: ['bag_mask', 'pulse_oximeter_preductal', 'laryngoscope', 'endotracheal_tubes_2.0_to_4.0_size', 'meconium_suction_device_if_meconium', 'T_piece_resuscitator'],
    target_spo2_at_1_minute: '60_to_65',
    target_spo2_at_5_minutes: '85_to_95',
    citation: CITATIONS.AAP_NRP_2024,
  };
}

function silvermanAndersenScore(input) {
  const { upper_chest_retractions, lower_chest_retractions, xiphoid_retraction, nasal_flaring, expiratory_grunting } = input;
  let total = upper_chest_retractions + lower_chest_retractions + xiphoid_retraction + nasal_flaring + expiratory_grunting;
  let severity = 'mild_respiratory_distress';
  if (total >= 5) severity = 'severe_respiratory_distress';
  else if (total >= 3) severity = 'moderate_respiratory_distress';
  return {
    silverman_total: total, severity,
    intervention: severity === 'severe_respiratory_distress' ? 'consider_CPAP_or_intubation_surfactant' : severity === 'moderate_respiratory_distress' ? 'supplemental_O2_and_observe' : 'routine_monitoring',
    citation: CITATIONS.NICE_NICU,
  };
}

function neonatalSepsis(input) {
  const { gestational_age_weeks, postnatal_age_days, fever_present, hypothermia_present, lethargy, apnea_episodes, capillary_refill_seconds, cbc_bands_pct, crp_value, blood_culture_result, gbs_mother } = input;
  const chorioamnionitis_or_prom = gbs_mother === 'positive' || gbs_mother === 'unknown';
  let sepsis_likely = false;
  if (postnatal_age_days <= 72) sepsis_likely = fever_present || hypothermia_present || lethargy || apnea_episodes || capillary_refill_seconds >= 3;
  if (postnatal_age_days >= 7 && postnatal_age_days <= 28) sepsis_likely = fever_present || hypothermia_present || lethargy || apnea_episodes;
  return {
    sepsis_likely, early_onset_neonatal: postnatal_age_days <= 7, late_onset_neonatal: postnatal_age_days > 7,
    empiric_abx: 'ampicillin_50mg_per_kg_IV_then_gentamicin_2.5mg_per_kg_IV_Q12h' + (gestational_age_weeks < 34 ? ' or ampicillin_cefotaxime' : ''),
    sepsis_workup: ['CBC_with_diff', 'blood_culture_2_sites', 'urine_culture_if_gt_72h_old', 'lumbar_puncture_CSF_if_able', 'CRP_Q12h_x_3', 'procalcitonin_optional', 'CXR'],
    duration_abx: blood_culture_result === 'negative' && crp_value < 0.5 && cbc_bands_pct < 0.15 ? '48h_then_discontinue_if_no_symptoms' : '10_to_14_days_depending_on_pathogen',
    citation: CITATIONS.AAP_NRP_2024,
  };
}

function ropScreening(input) {
  const { birth_weight_g, gestation_weeks, oxygen_supplementation_duration_days, prior_stage_rop } = input;
  const screening_indicated = birth_weight_g <= 1500 || gestation_weeks <= 30 || prior_stage_rop === 'diagnosed';
  return {
    screening_indicated,
    first_screen_age_weeks_corrected: birth_weight_g < 1000 ? '31_weeks_postmenstrual' : '4_weeks_chronological_or_31_weeks_corrected',
    follow_up_interval_weeks: 2,
    treatment_threshold: 'stage_3_plus_or_aggressive_posterior_ROP',
    treatment: 'anti_VEGF_ranibizumab_OR_laser_ablation',
    citation: CITATIONS.AAP_NRP_2024,
  };
}

function neonatalDoseCalculations(input) {
  const { drug, weight_g, gestational_age_weeks, postnatal_age_days } = input;
  const weight_kg = weight_g / 1000;
  let dose_per_kg = 0;
  let frequency = '';
  if (drug === 'ampicillin_meningitis') dose_per_kg = 50;
  else if (drug === 'ampicillin_bacteremia') dose_per_kg = 25;
  else if (drug === 'gentamicin_preterm') dose_per_kg = 2.5;
  else if (drug === 'gentamicin_term') dose_per_kg = 4;
  else if (drug === 'caffeine_citrate_loading') dose_per_kg = 20;
  else if (drug === 'caffeine_citrate_maintenance') dose_per_kg = 5;
  else if (drug === 'indomethacin_first_dose') dose_per_kg = 0.1;
  if (drug === 'ampicillin' || drug === 'gentamicin') frequency = postnatal_age_days <= 7 ? 'Q12h' : 'Q8h';
  else if (drug === 'caffeine_citrate_maintenance') frequency = 'Q24h';
  return { drug, total_dose_mg: dose_per_kg * weight_kg, frequency, weight_kg, gestation_weeks, citation: CITATIONS.NICE_NICU };
}

module.exports = { apgarScore, nrpResuscitation, silvermanAndersenScore, neonatalSepsis, ropScreening, neonatalDoseCalculations, CITATIONS, ValidationError };