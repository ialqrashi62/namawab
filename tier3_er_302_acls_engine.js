/**
 * TIER3_ER-302 Cardiac Arrest / ACLS Engine
 * ACLS algorithm + Cardiac arrest post-ROSC care (TTM) + Tachycardia algorithm + Bradycardia algorithm + Shockable vs non-shockable rhythms
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { AHA_ACLS: 'AHA ACLS 2025', ERC: 'ERC Guidelines 2025' };

function aclsAlgorithm(input) {
  const { rhythm, witnessed_arrest, bystander_cpr, downtime_minutes, defibrillation_count, amiodarone_doses_given } = input;
  const shockable = rhythm === 'vf_or_pulseless_vt' || rhythm === 'pulsed_vt_unstable';
  const actions = ['start_high_quality_CPR_30_to_2_or_15_to_2_with_advanced_airway', 'place_IV_or_IO_access'];
  if (shockable) {
    actions.push('defibrillation_immediately_then_Q2min');
    if (amiodarone_doses_given === 0) actions.push('epinephrine_1mg_IV_every_3_to_5min_after_3rd_shock');
    else actions.push('amiodarone_300mg_IV_then_150mg_once_or_lidocaine_1_to_1.5mg_per_kg_IV');
    actions.push('continue_CPR_between_shocks_minimize_interruptions');
  } else {
    actions.push('epinephrine_1mg_IV_every_3_to_5min_asap');
    actions.push('identify_and_treat_reversible_causes_5H_and_5T');
    actions.push('continue_CPR_for_2_min_between_rhythm_checks');
  }
  return {
    rhythm, shockable, witnessed_arrest, bystander_cpr, downtime_minutes,
    actions, reversible_causes: ['5H_hypovolemia_hypoxia_hydrogen_acidosis_hypokalemia_hypothermia', '5T_tension_pneumothorax_tamponade_cardiac_toxins_thrombosis_pulmonary_thrombosis_coronary'],
    citation: CITATIONS.AHA_ACLS,
  };
}

function postRoscCare(input) {
  const { rosc_achieved, gcs_score, bp_mmhg, spo2_pct, arrest_etiology, target_temperature_celsius } = input;
  let tt_indic = false;
  if (gcs_score < 6 && rosc_achieved === 'yes' && (arrest_etiology === 'shockable' || arrest_etiology === 'unwitnessed' || arrest_etiology === 'nonshockable')) tt_indic = true;
  return {
    target_temperature: tt_indic ? '32_to_36_C_24_hours_then_graded_rewarming' : 'normothermia_strictly_prevent_pyrexia',
    bp_target: 'map_greater_than_65_or_sbp_greater_than_90',
    spo2_target: '94_to_99_percent_avoid_hyperoxia_and_hypoxia',
    glycemic_target: '140_to_180_mg_per_dL_avoid_hypoglycemia',
    intervention: rosc_achieved === 'yes' ? ['ECG_12_lead_for_st_elevation_or_new_lvh', 'coronary_angiography_if_ST_elevation_or_high_suspicion', 'CT_head_if_not_st_elevation_or_unclear_etiology', 'TTM_if_appropriate', 'continuous_EEG_monitoring', 'sedation_analgesia_for_cooling', 'consider_lactate_clearance_and_serial_ABG'] : 'continue_acls',
    citation: CITATIONS.AHA_ACLS,
  };
}

function tachycardiaAlgorithm(input) {
  const { heart_rate_bpm, qrs_wide, hemodynamic_status, symptoms, irregular_rhythm, rhythm_type } = input;
  let interpretation = 'unknown';
  let intervention = 'monitor';
  if (heart_rate_bpm > 100) {
    if (hemodynamic_status === 'unstable') { interpretation = 'unstable_tachycardia'; intervention = 'synchronized_cardioversion_sedation'; }
    else if (qrs_wide === 'wide_qrs') { interpretation = 'stable_wide_complex_tachycardia_VT_SVT_with_aberrancy'; intervention = 'IV_procainamide_or_amiodarone_electrophysiology_consultation'; }
    else if (qrs_wide === 'narrow_qrs' && irregular_rhythm === 'yes') { interpretation = 'atrial_fibrillation_with_controlled_response'; intervention = 'rate_control_b_blocker_or_diltiazem_or_amiodarone_anticoagulation'; }
    else if (qrs_wide === 'narrow_qrs' && irregular_rhythm === 'no' && rhythm_type === 'avnrt') { interpretation = 'avnrt_avrt_reentrant'; intervention = 'vagal_maneuver_then_IV_adenosine_6mg_then_12mg'; }
    else { interpretation = 'sinus_tachycardia_underlying_cause'; intervention = 'treat_underlying_cause_volume_fever_anxiety_hypovolemia'; }
  } else interpretation = 'not_tachycardia';
  return { interpretation, intervention, heart_rate_bpm, qrs_wide, hemodynamic_status, citation: CITATIONS.AHA_ACLS };
}

function bradycardiaAlgorithm(input) {
  const { heart_rate_bpm, hemodynamic_status, symptoms, av_block_type } = input;
  let interpretation = 'unknown';
  let intervention = 'monitor';
  if (heart_rate_bpm < 50) {
    if (hemodynamic_status === 'unstable') { interpretation = 'symptomatic_bradycardia'; intervention = 'atropine_1mg_IV_Q3_to_5min_then_transcutaneous_pacing_then_epinephrine_or_dopamine_infusion'; }
    else if (av_block_type === 'high_degree_or_complete_av_block') { interpretation = 'high_degree_or_complete_av_block'; intervention = 'transcutaneous_or_transvenous_pacing_permanent_pacemaker_placement_if_appropriate'; }
    else if (av_block_type === 'second_degree_type_I') { interpretation = 'second_degree_av_block_wenckebach_usually_benign'; intervention = 'observe_monitor'; }
    else if (av_block_type === 'second_degree_type_II') { interpretation = 'second_degree_av_block_mobitz_II_can_progress'; intervention = 'pacemaker_evaluation'; }
    else { interpretation = 'sinus_bradycardia'; intervention = 'monitor_if_asymptomatic_else_atropine'; }
  } else interpretation = 'not_bradycardia';
  return { interpretation, intervention, heart_rate_bpm, av_block_type, citation: CITATIONS.AHA_ACLS };
}

function shockableRhythmDecision(input) {
  const { rhythm, defibrillator_available, chest_compressions_active } = input;
  let shockable = false;
  if (rhythm === 'vf_or_pulseless_vt') shockable = true;
  if (rhythm === 'asystole' || rhythm === 'pea') shockable = false;
  return {
    shockable,
    action: shockable ? (defibrillator_available === 'yes' ? 'defibrillate_immediately_at_maximum_biphasic_200J_then_resume_CPR' : 'continue_CPR_use_manual_defibrillation') : 'continue_CPR_for_2_min_then_rhythm_check',
    medications_when_shockable: ['after_3rd_shock_epinephrine_1mg_IV', 'amiodarone_300mg_or_lidocaine_1_to_1.5mg_per_kg'],
    citation: CITATIONS.AHA_ACLS,
  };
}

module.exports = { aclsAlgorithm, postRoscCare, tachycardiaAlgorithm, bradycardiaAlgorithm, shockableRhythmDecision, CITATIONS, ValidationError };