// filepath: tier6_vc_ext_106_behavioral_engine.js
// TIER6_VC_EXT-106: Behavioral health telehealth (intake, PHQ-9, safety, therapy session, crisis)
'use strict';

const CITATIONS = ['APA_TELEPSYCH_2021','SAMHSA_CRISIS_2022','USPSTF_PHQ9_2020'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function bh_intake(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.presenting_concern, 'presenting_concern', ['depression','anxiety','trauma','grief','substance_use','eating','psychosis','bipolar','ocd','ptsd','relationship','adjustment']);
  ensureEnum(req.previous_treatment, 'previous_treatment', ['none','medication_only','therapy_only','both_medication_and_therapy','inpatient','residential']);
  ensureBool(req.currently_on_psych_meds, 'currently_on_psych_meds');
  ensureNumber(req.support_system_strength, 'support_system_strength');
  ensureEnum(req.insurance_type, 'insurance_type', ['commercial','medicaid','medicare','self_pay','sliding_scale','uninsured']);

  let matching;
  if (req.support_system_strength < 3) matching = 'consider_intensive_outpatient_or_partial_hospitalization';
  else if (req.previous_treatment === 'both_medication_and_therapy') matching = 'optimize_telehealth_taper';
  else if (req.previous_treatment === 'none') matching = 'first_line_telehealth_therapy_plus_medication_evaluation';
  else matching = 'telehealth_continuation';

  return { care_matching: matching, presenting: req.presenting_concern };
}

function bh_phq9(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.q1_anhedonia, 'q1_anhedonia');
  ensureNumber(req.q2_mood, 'q2_mood');
  ensureNumber(req.q3_sleep, 'q3_sleep');
  ensureNumber(req.q4_energy, 'q4_energy');
  ensureNumber(req.q5_appetite, 'q5_appetite');
  ensureNumber(req.q6_self_worth, 'q6_self_worth');
  ensureNumber(req.q7_concentration, 'q7_concentration');
  ensureNumber(req.q8_psychomotor, 'q8_psychomotor');
  ensureNumber(req.q9_suicidality, 'q9_suicidality');

  const total = req.q1_anhedonia + req.q2_mood + req.q3_sleep + req.q4_energy + req.q5_appetite + req.q6_self_worth + req.q7_concentration + req.q8_psychomotor + req.q9_suicidality;
  let band;
  if (req.q9_suicidality >= 1) band = 'suicidality_flag_immediate_safety_assessment';
  else if (total >= 20) band = 'severe_active_treatment_with_close_follow_up';
  else if (total >= 15) band = 'moderately_severe_active_treatment';
  else if (total >= 10) band = 'moderate_consider_medication_evaluation';
  else if (total >= 5) band = 'mild_watchful_waiting';
  else band = 'minimal_or_none';

  return { total, band, suicidality_flag: req.q9_suicidality >= 1 };
}

function bh_safety(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.suicidal_ideation_score, 'suicidal_ideation_score');
  ensureNumber(req.homicidal_ideation_score, 'homicidal_ideation_score');
  ensureBool(req.has_firearm_access, 'has_firearm_access');
  ensureBool(req.has_lethal_means, 'has_lethal_means');
  ensureBool(req.support_person_present, 'support_person_present');
  ensureNumber(req.previous_attempts, 'previous_attempts');

  let risk;
  if (req.suicidal_ideation_score >= 3 || req.homicidal_ideation_score >= 3) risk = 'imminent_danger_call_emergency_services';
  else if ((req.suicidal_ideation_score >= 2 || req.homicidal_ideation_score >= 2) && (req.has_firearm_access || req.has_lethal_means)) risk = 'high_risk_means_restriction_required_now';
  else if (req.previous_attempts >= 1 && req.suicidal_ideation_score >= 1) risk = 'moderate_risk_safety_plan_within_24h';
  else if (!req.support_person_present && req.suicidal_ideation_score >= 1) risk = 'moderate_recommend_support_person';
  else risk = 'low_continue_telehealth';

  return { risk_band: risk, has_means: req.has_firearm_access || req.has_lethal_means };
}

function bh_therapy_session(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.therapist_id, 'therapist_id');
  ensureEnum(req.modality, 'modality', ['cbt','dbt','act','emdr','psychodynamic','mi','sft','tf_cbt','cbt_i','mindfulness_based']);
  ensureNumber(req.session_number, 'session_number');
  ensureNumber(req.duration_min, 'duration_min');
  ensureBool(req.homework_assigned, 'homework_assigned');
  ensureBool(req.homework_completed, 'homework_completed');
  ensureNumber(req.rating_session_helpful, 'rating_session_helpful');

  let adherence;
  if (!req.homework_assigned) adherence = 'session_only_no_homework';
  else if (req.homework_completed) adherence = 'excellent_adherence';
  else if (req.session_number >= 4) adherence = 'poor_adherence_address_in_next_session';
  else adherence = 'early_phase_expect_partial_adherence';

  return { session_band: 'completed', adherence, modality: req.modality };
}

function bh_crisis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.crisis_type, 'crisis_type', ['suicidal','homicidal','psychotic_break','substance_withdrawal','panic','flashback','none']);
  ensureBool(req.means_available, 'means_available');
  ensureEnum(req.location, 'location', ['home','public','work','school','unknown']);
  ensureBool(req.caller_safe_to_continue, 'caller_safe_to_continue');
  ensureBool(req.third_party_present, 'third_party_present');

  let action;
  if (!req.caller_safe_to_continue) action = 'stay_on_line_dispatch_emergency_services';
  else if (req.crisis_type === 'suicidal' && req.means_available) action = 'dispatch_emergency_with_means_restriction';
  else if (req.third_party_present) action = 'engage_third_party_for_safety_planning';
  else if (req.crisis_type === 'substance_withdrawal') action = 'refer_to_detox_or_ed_medical_clearance';
  else action = 'de_escalation_and_safety_planning_video_visit_within_1h';

  return { crisis_action: action, type: req.crisis_type };
}

function funcs() { return { bh_intake, bh_phq9, bh_safety, bh_therapy_session, bh_crisis }; }
module.exports = { funcs, CITATIONS, ValidationError };