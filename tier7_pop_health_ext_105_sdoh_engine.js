// filepath: tier7_pop_health_ext_105_sdoh_engine.js
// TIER7_POP_HEALTH_EXT-105: Social determinants population analytics
'use strict';

const CITATIONS = ['WHO_SDOH_2022','CDC_PRAPARE_2023','AHA_HEALTH_EVALY_2022'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function sdoh_heat_map(req) {
  ensureEnum(req.domain, 'domain', ['housing','food','transport','safety','employment','education','healthcare_access','social_support','language','utilities']);
  ensureNumber(req.zip_count, 'zip_count');
  ensureNumber(req.high_risk_zip_count, 'high_risk_zip_count');
  ensureNumber(req.medium_risk_zip_count, 'medium_risk_zip_count');
  ensureNumber(req.low_risk_zip_count, 'low_risk_zip_count');

  const high_pct = req.zip_count > 0 ? req.high_risk_zip_count / req.zip_count : 0;
  let summary;
  if (high_pct >= 0.4) summary = 'majority_high_risk_targeted_intervention';
  else if (high_pct >= 0.2) summary = 'significant_high_risk_clusters';
  else if (high_pct >= 0.1) summary = 'sporadic_high_risk_address_individually';
  else summary = 'predominantly_low_risk';

  return { domain: req.domain, high_pct: Math.round(high_pct * 1000) / 10, summary };
}

function sdoh_resource_match(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.need_category, 'need_category', ['food_insecurity','housing_instability','transportation','childcare','utility_assistance','legal_aid','immigration','language_interpreter','mental_health','substance_use']);
  ensureStr(req.zip_code, 'zip_code');
  ensureNumber(req.distance_miles_willing, 'distance_miles_willing');
  ensureBool(req.insurance_accepted, 'insurance_accepted');
  ensureBool(req.language_match, 'language_match');

  let match_score = 0;
  if (req.distance_miles_willing >= 10) match_score += 30;
  else if (req.distance_miles_willing >= 5) match_score += 20;
  else if (req.distance_miles_willing >= 1) match_score += 10;
  if (req.insurance_accepted) match_score += 25;
  if (req.language_match) match_score += 25;
  match_score += 20;

  let band;
  if (match_score >= 90) band = 'excellent_match_refer_now';
  else if (match_score >= 70) band = 'good_match_refer_with_follow_up';
  else if (match_score >= 50) band = 'acceptable_match_discuss_with_patient';
  else band = 'poor_match_expand_search';

  return { match_score, band, need: req.need_category };
}

function sdoh_community_partner(req) {
  ensureStr(req.partner_id, 'partner_id');
  ensureEnum(req.partner_type, 'partner_type', ['food_bank','housing_org','transport_service','legal_aid','fitness_center','community_clinic','religious_org','school_district','library','employer']);
  ensureNumber(req.referrals_30d, 'referrals_30d');
  ensureNumber(req.completed_30d, 'completed_30d');
  ensureNumber(req.days_to_first_response, 'days_to_first_response');

  const completion_rate = req.referrals_30d > 0 ? req.completed_30d / req.referrals_30d : 0;
  let status;
  if (req.days_to_first_response > 14) status = 'slow_response_re_evaluate_partner';
  else if (completion_rate >= 0.7) status = 'high_performing_partner';
  else if (completion_rate >= 0.4) status = 'moderate_performing';
  else status = 'low_completion_review_referral_workflow';

  return { status, completion_pct: Math.round(completion_rate * 1000) / 10 };
}

function sdoh_outcome_track(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.need_category, 'need_category', ['food_insecurity','housing_instability','transportation','childcare','utility_assistance','legal_aid','immigration','language_interpreter','mental_health','substance_use']);
  ensureNumber(req.referral_age_days, 'referral_age_days');
  ensureEnum(req.status, 'status', ['referred','in_progress','connected','resolved','declined','expired']);
  ensureBool(req.health_outcome_changed, 'health_outcome_changed');
  ensureNumber(req.ed_visits_pre, 'ed_visits_pre');
  ensureNumber(req.ed_visits_post, 'ed_visits_post');

  const ed_delta = req.ed_visits_pre - req.ed_visits_post;
  let effectiveness;
  if (req.status === 'resolved' && req.health_outcome_changed && ed_delta > 0) effectiveness = 'high_impact_intervention';
  else if (req.status === 'connected' && req.health_outcome_changed) effectiveness = 'moderate_impact';
  else if (req.status === 'expired' || req.status === 'declined') effectiveness = 'no_engagement_re_engage';
  else effectiveness = 'monitor_continue';

  return { effectiveness, ed_delta, status: req.status };
}

function sdoh_dashboard(req) {
  ensureStr(req.population_id, 'population_id');
  ensureNumber(req.total_patients_screened, 'total_patients_screened');
  ensureNumber(req.with_any_need, 'with_any_need');
  ensureNumber(req.referred, 'referred');
  ensureNumber(req.connected, 'connected');
  ensureNumber(req.resolved, 'resolved');

  const any_need_pct = req.total_patients_screened > 0 ? req.with_any_need / req.total_patients_screened : 0;
  const connect_rate = req.referred > 0 ? req.connected / req.referred : 0;
  const resolve_rate = req.referred > 0 ? req.resolved / req.referred : 0;

  let summary;
  if (any_need_pct >= 0.5 && resolve_rate >= 0.4) summary = 'high_need_high_resolution_effective';
  else if (any_need_pct >= 0.3) summary = 'significant_need_active_program';
  else if (any_need_pct >= 0.1) summary = 'moderate_need_continued_screening';
  else summary = 'low_need_continue_routine';

  return { any_need_pct: Math.round(any_need_pct * 1000) / 10, connect_pct: Math.round(connect_rate * 1000) / 10, resolve_pct: Math.round(resolve_rate * 1000) / 10, summary };
}

function funcs() { return { sdoh_heat_map, sdoh_resource_match, sdoh_community_partner, sdoh_outcome_track, sdoh_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };