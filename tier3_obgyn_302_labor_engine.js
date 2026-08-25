/**
 * TIER3_OBGYN-302 Labor & Delivery Engine
 * Friedman curve + FHR categories (I/II/III) + partogram + delivery mode + induction + PPH management
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { ACOG_SAFE: 'ACOG Safe Prevention of First Cesarean 2014', SMFM: 'SMFM Labor 2016', WHO_PPH: 'WHO PPH 2023' };

function laborStage(input) {
  const { cervical_dilation_cm, effacement_pct, station, parity, rupture_membranes, regular_contractions } = input;
  let stage = 'latent_phase';
  if (cervical_dilation_cm >= 6 && parity === 'nulliparous' && regular_contractions) stage = 'active_phase_first_stage';
  else if (cervical_dilation_cm >= 6 && parity === 'multiparous' && regular_contractions) stage = 'active_phase_first_stage';
  if (station === '+2' || station === '+3') stage = 'second_stage_pushing';
  if (delivery_complete) stage = 'third_stage_placental';
  return {
    stage, cervical_dilation_cm, effacement_pct, station, parity, rupture_membranes,
    citation: CITATIONS.ACOG_SAFE,
  };
}

function fetalHeartRateCategory(input) {
  const { baseline_bpm, variability_bpm, accelerations_present, decelerations } = input;
  let category = 'I_normal';
  if (baseline_bpm >= 110 && baseline_bpm <= 160 && variability_bpm >= 6 && variability_bpm <= 25 && accelerations_present) category = 'I_normal';
  else if (variability_bpm < 6 && !accelerations_present) category = 'III_pathological';
  else category = 'II_indeterminate_requires_evaluation_and_intervention';
  return {
    category, baseline_bpm, variability_bpm,
    decelerations: decelerations || 'none',
    management: category === 'I_normal' ? 'continue_routine_monitoring' : category === 'II_indeterminate' ? 'intrauterine_resuscitation_position_IV_fluids_oxygen' : 'immediate_intervention_prepare_for_delivery',
    citation: CITATIONS.ACOG_SAFE,
  };
}

function partogramInterpretation(input) {
  const { cervical_dilation_cm, hours_since_admission, expected_rate_per_hr, descent_cm, contractions_per_10min, alert_line } = input;
  const arrest_first_stage = hours_since_admission > 24 && cervical_dilation_cm < 6;
  const protracted_first_stage = cervical_dilation_cm < expected_rate_per_hr;
  return {
    arrest_first_stage, protracted_first_stage,
    alerting_action: protracted_first_stage ? 'amniotomy_if_not_done_then_oxytocin_augmentation' : 'continue_observation',
    second_stage_duration_limit_minutes: 'nulliparous_3h_without_epidural_2h_with_multiparous_2h_without_epidural_1h_with',
    citation: CITATIONS.ACOG_SAFE,
  };
}

function deliveryModeDecision(input) {
  const { fetal_presentation, prior_cesarean_count, maternal_request, fetal_status, multiple_gestation, placenta_previa, prior_uterine_scar } = input;
  let recommended = 'spontaneous_vaginal_delivery';
  if (fetal_presentation === 'breech' || placenta_previa === 'major' || fetal_status === 'category_III') recommended = 'cesarean_delivery';
  else if (prior_cesarean_count === 1 && fetal_presentation === 'cephalic' && !prior_uterine_scar) recommended = 'trial_of_labor_after_cesarean_TOLAC';
  else if (prior_cesarean_count >= 2) recommended = 'repeat_cesarean';
  return { recommended, fetal_presentation, prior_cesarean_count, citation: CITATIONS.ACOG_SAFE };
}

function inductionOfLabor(input) {
  const { bishop_score, parity, indication, prior_uterine_scar, gestational_age_weeks, rupture_membranes } = input;
  let method = 'foley_catheter_then_oxytocin';
  if (bishop_score >= 6) method = 'amniotomy_then_oxytocin';
  if (parity === 'multiparous' && bishop_score >= 8) method = 'amniotomy_only';
  if (!prior_uterine_scar) method += '_prostaglandin_safe';
  return {
    method, indication, gestational_age_weeks,
    contraindications: ['prior_uterine_scar_t_classical', 'placenta_previa_major', 'transverse_lie', 'active_genital_herpes', 'category_III_fhr'],
    oxytocin_protocol: 'low_dose_start_2_mU_per_min_then_increase_2_mU_per_min_Q15_30_min_until_adequate_contractions',
    citation: CITATIONS.ACOG_SAFE,
  };
}

function postpartumHemorrhageMgmt(input) {
  const { estimated_blood_loss_ml, cause, stage, vital_signs, transfusion_status } = input;
  let management = [];
  if (cause === 'uterine_atony') management = ['uterine_massage', 'uterotonic_oxytocin_20U_per_L', 'methylergonovine_0.2mg_IM_unless_hypertensive', 'carboprost_250mcg_IM_unless_asthma', 'misoprostol_800mcg_PR'];
  if (cause === 'retained_placenta') management = ['manual_placental_extraction'];
  if (cause === 'lacerations') management = ['examination_under_good_lighting_repair_bleeding_vessels'];
  if (cause === 'coagulopathy') management = ['FFP_platelet_cryoprecipitate_per_labs'];
  return {
    cause, estimated_blood_loss_ml, vital_signs,
    stage: stage || (estimated_blood_loss_ml >= 1000 ? 'stage_2_severe' : 'stage_1'),
    management,
    escalation: stage === 'stage_2_severe' ? ['Bakri_balloon', 'B_Lynch_suture', 'uterine_artery_ligation', 'hysterectomy_if_continues'] : 'continue_first_line',
    citation: CITATIONS.WHO_PPH,
  };
}

module.exports = { laborStage, fetalHeartRateCategory, partogramInterpretation, deliveryModeDecision, inductionOfLabor, postpartumHemorrhageMgmt, CITATIONS, ValidationError };