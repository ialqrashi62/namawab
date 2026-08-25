// filepath: tier7_pop_health_ext_103_cohort_engine.js
// TIER7_POP_HEALTH_EXT-103: Cohort identification & risk stratification
'use strict';

const CITATIONS = ['AHA_POP_HEALTH_2022','NCQA_HEDIS_2024','CDC_CHRONIC_2021'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function cohort_identify(req) {
  ensureStr(req.cohort_name, 'cohort_name');
  ensureEnum(req.cohort_type, 'cohort_type', ['diabetic_a1c_poor','high_cost_utilizers','readmission_risk','uncontrolled_hypertension','polypharmacy','sdoh_high_risk','cancer_screening_overdue','missed_follow_up','frequent_ed','pediatric_unimmunized']);
  ensureNumber(req.criteria_count, 'criteria_count');
  ensureBool(req.inclusion_explicit, 'inclusion_explicit');
  ensureBool(req.exclusion_explicit, 'exclusion_explicit');
  ensureNumber(req.expected_population_size, 'expected_population_size');

  let quality;
  if (!req.inclusion_explicit || !req.exclusion_explicit) quality = 'unstable_cohort_re_define';
  else if (req.criteria_count < 2) quality = 'minimal_criteria_expand';
  else if (req.criteria_count >= 5) quality = 'well_defined_cohort';
  else quality = 'defined_cohort_acceptable';

  return { cohort_status: quality, size_estimate: req.expected_population_size };
}

function cohort_risk_score(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.age_years, 'age_years');
  ensureNumber(req.comorbidity_count, 'comorbidity_count');
  ensureNumber(req.days_since_last_visit, 'days_since_last_visit');
  ensureNumber(req.medication_count, 'medication_count');
  ensureNumber(req.ed_visits_12mo, 'ed_visits_12mo');
  ensureNumber(req.admissions_12mo, 'admissions_12mo');
  ensureNumber(req.sdoh_risk_score, 'sdoh_risk_score');
  ensureBool(req.lives_alone, 'lives_alone');

  let score = 0;
  if (req.age_years >= 75) score += 20;
  else if (req.age_years >= 65) score += 10;
  if (req.comorbidity_count >= 5) score += 25;
  else if (req.comorbidity_count >= 3) score += 15;
  if (req.days_since_last_visit > 365) score += 15;
  else if (req.days_since_last_visit > 180) score += 8;
  if (req.medication_count >= 10) score += 12;
  if (req.ed_visits_12mo >= 4) score += 18;
  if (req.admissions_12mo >= 2) score += 20;
  if (req.sdoh_risk_score >= 7) score += 15;
  if (req.lives_alone) score += 5;

  let band;
  if (score >= 70) band = 'very_high_care_management_intensive';
  else if (score >= 50) band = 'high_care_management_active';
  else if (score >= 30) band = 'moderate_care_coordination';
  else if (score >= 15) band = 'low_routine_follow_up';
  else band = 'minimal_risk_health_promotion';

  return { risk_score: score, band };
}

function cohort_outreach(req) {
  ensureStr(req.cohort_id, 'cohort_id');
  ensureNumber(req.cohort_size, 'cohort_size');
  ensureEnum(req.outreach_channel, 'outreach_channel', ['portal_message','sms','phone_call','community_health_worker','mail','home_visit','video_visit','none']);
  ensureEnum(req.message_type, 'message_type', ['screening_reminder','appointment_reminder','care_plan_review','education','results_follow_up','none']);
  ensureNumber(req.expected_response_pct, 'expected_response_pct');
  ensureBool(req.preferred_language_match, 'preferred_language_match');

  let expected_reach;
  if (req.outreach_channel === 'home_visit' || req.outreach_channel === 'community_health_worker') expected_reach = Math.round(req.cohort_size * 0.65);
  else if (req.outreach_channel === 'phone_call') expected_reach = Math.round(req.cohort_size * 0.45);
  else if (req.outreach_channel === 'sms' && req.preferred_language_match) expected_reach = Math.round(req.cohort_size * 0.55);
  else if (req.outreach_channel === 'portal_message') expected_reach = Math.round(req.cohort_size * 0.3);
  else expected_reach = Math.round(req.cohort_size * (req.expected_response_pct / 100));

  return { expected_reach, channel: req.outreach_channel, message: req.message_type };
}

function cohort_engage(req) {
  ensureStr(req.cohort_id, 'cohort_id');
  ensureNumber(req.contacted, 'contacted');
  ensureNumber(req.responded, 'responded');
  ensureNumber(req.appointments_booked, 'appointments_booked');
  ensureNumber(req.completed_visits, 'completed_visits');
  ensureNumber(req.outcomes_achieved, 'outcomes_achieved');

  const response_rate = req.contacted > 0 ? req.responded / req.contacted : 0;
  const visit_rate = req.contacted > 0 ? req.completed_visits / req.contacted : 0;
  const outcome_rate = req.contacted > 0 ? req.outcomes_achieved / req.contacted : 0;

  let summary;
  if (response_rate >= 0.7 && outcome_rate >= 0.4) summary = 'high_engagement_successful';
  else if (response_rate >= 0.5) summary = 'moderate_engagement_review_content';
  else if (response_rate >= 0.25) summary = 'low_engagement_re_think_channel';
  else summary = 'very_low_engagement_restart_campaign';

  return { response_pct: Math.round(response_rate * 1000) / 10, visit_pct: Math.round(visit_rate * 1000) / 10, outcome_pct: Math.round(outcome_rate * 1000) / 10, summary };
}

function cohort_close_loop(req) {
  ensureStr(req.cohort_id, 'cohort_id');
  ensureNumber(req.target_metric, 'target_metric');
  ensureNumber(req.actual_metric, 'actual_metric');
  ensureNumber(req.cohort_size, 'cohort_size');
  ensureNumber(req.gap_to_close, 'gap_to_close');
  ensureBool(req.intervention_applied, 'intervention_applied');

  let closure_status;
  if (req.actual_metric >= req.target_metric) closure_status = 'target_met_no_further_action';
  else if (req.intervention_applied) closure_status = 'monitoring_intervention_effect';
  else closure_status = 'intervention_required';

  return { closure_status, gap: req.gap_to_close, target: req.target_metric };
}

function funcs() { return { cohort_identify, cohort_risk_score, cohort_outreach, cohort_engage, cohort_close_loop }; }
module.exports = { funcs, CITATIONS, ValidationError };