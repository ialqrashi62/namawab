// filepath: tier7_pop_health_ext_106_campaign_engine.js
// TIER7_POP_HEALTH_EXT-106: Population health campaigns & outreach
'use strict';

const CITATIONS = ['CDC_CAMPAIGN_2022','AHA_OUTREACH_2021'];

class ValidationError extends Error { constructor(m, f) { super(m); this.name = 'ValidationError'; this.field = f; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function campaign_design(req) {
  ensureStr(req.campaign_name, 'campaign_name');
  ensureEnum(req.campaign_type, 'campaign_type', ['flu_vaccine','covid_vaccine','cancer_screening','smoking_cessation','prenatal_care','wellness','asthma_action','diabetes_self_care','med_adherence','post_discharge']);
  ensureEnum(req.target_population, 'target_population', ['all_adults','pediatric','geriatric','pregnant','chronic_disease','uninsured','post_discharge','healthcare_workers','school_age','community_wide']);
  ensureNumber(req.target_size, 'target_size');
  ensureNumber(req.budget, 'budget');
  ensureEnum(req.duration_days, 'duration_days', ['14','30','60','90','180','365']);
  ensureBool(req.multilingual, 'multilingual');

  let feasibility;
  const per_person = req.target_size > 0 ? req.budget / req.target_size : 0;
  if (per_person < 5 && req.target_size > 1000) feasibility = 'low_budget_re_evaluate_scope';
  else if (per_person < 20) feasibility = 'tight_budget_high_volume';
  else if (per_person < 100) feasibility = 'reasonable_budget';
  else feasibility = 'high_budget_premium_campaign';

  return { feasibility, per_person_cost: Math.round(per_person * 100) / 100, type: req.campaign_type };
}

function campaign_message(req) {
  ensureStr(req.campaign_id, 'campaign_id');
  ensureStr(req.message_body, 'message_body');
  ensureEnum(req.tone, 'tone', ['urgent','informational','motivational','empathetic','authoritative','friendly']);
  ensureEnum(req.language, 'language', ['ar','en','fr','ur','hi','bn','tl','es','bilingual']);
  ensureNumber(req.character_count, 'character_count');
  ensureBool(req.has_clear_call_to_action, 'has_clear_call_to_action');
  ensureBool(req.includes_trust_signal, 'includes_trust_signal');

  let quality_score = 0;
  if (req.character_count <= 160 && req.character_count >= 40) quality_score += 30;
  else if (req.character_count <= 300) quality_score += 15;
  if (req.has_clear_call_to_action) quality_score += 30;
  if (req.includes_trust_signal) quality_score += 20;
  if (req.tone === 'motivational' || req.tone === 'empathetic') quality_score += 20;

  let band;
  if (quality_score >= 80) band = 'excellent_high_expected_engagement';
  else if (quality_score >= 60) band = 'good_solid_engagement_expected';
  else if (quality_score >= 40) band = 'acceptable_moderate_engagement';
  else band = 'needs_revision_low_expected_engagement';

  return { quality_score, band, language: req.language };
}

function campaign_send(req) {
  ensureStr(req.campaign_id, 'campaign_id');
  ensureEnum(req.channel, 'channel', ['sms','email','portal','phone','social_media','direct_mail','in_clinic','home_visit']);
  ensureNumber(req.recipients, 'recipients');
  ensureEnum(req.schedule, 'schedule', ['immediate','business_hours','evening','weekend','optimal_send_time']);
  ensureBool(req.throttled, 'throttled');
  ensureBool(req.opt_out_respected, 'opt_out_respected');

  let delivery;
  if (!req.opt_out_respected) delivery = 'violates_can_com_emergency_pause';
  else if (req.throttled) delivery = 'throttled_sending_to_avoid_alert_fatigue';
  else if (req.schedule === 'optimal_send_time') delivery = 'optimal_send_time_high_open_rate';
  else if (req.schedule === 'immediate') delivery = 'immediate_burst';
  else delivery = 'scheduled_send';

  return { delivery_mode: delivery, recipients: req.recipients };
}

function campaign_measure(req) {
  ensureStr(req.campaign_id, 'campaign_id');
  ensureNumber(req.delivered, 'delivered');
  ensureNumber(req.opened, 'opened');
  ensureNumber(req.clicked, 'clicked');
  ensureNumber(req.responded, 'responded');
  ensureNumber(req.converted, 'converted');

  const open_rate = req.delivered > 0 ? req.opened / req.delivered : 0;
  const click_rate = req.delivered > 0 ? req.clicked / req.delivered : 0;
  const convert_rate = req.delivered > 0 ? req.converted / req.delivered : 0;
  const response_rate = req.delivered > 0 ? req.responded / req.delivered : 0;

  let effectiveness;
  if (convert_rate >= 0.2) effectiveness = 'highly_effective';
  else if (convert_rate >= 0.1) effectiveness = 'effective';
  else if (response_rate >= 0.1) effectiveness = 'moderately_effective';
  else if (open_rate >= 0.3) effectiveness = 'low_conversion_but_awareness';
  else effectiveness = 'ineffective_review';

  return { open_pct: Math.round(open_rate * 1000) / 10, click_pct: Math.round(click_rate * 1000) / 10, convert_pct: Math.round(convert_rate * 1000) / 10, effectiveness };
}

function campaign_learn(req) {
  ensureStr(req.campaign_id, 'campaign_id');
  ensureNumber(req.campaign_count, 'campaign_count');
  ensureNumber(req.successful_count, 'successful_count');
  ensureStr(req.best_message_pattern, 'best_message_pattern');
  ensureStr(req.worst_message_pattern, 'worst_message_pattern');
  ensureBool(req.should_replicate, 'should_replicate');

  const success_rate = req.campaign_count > 0 ? req.successful_count / req.campaign_count : 0;
  let learning;
  if (success_rate >= 0.7 && req.should_replicate) learning = 'strong_pattern_replicate_to_other_cohorts';
  else if (success_rate >= 0.5) learning = 'moderate_pattern_test_in_other_cohorts';
  else if (success_rate >= 0.25) learning = 'mixed_pattern_iterate';
  else learning = 'low_success_re_think_strategy';

  return { learning, success_pct: Math.round(success_rate * 1000) / 10, replicate: req.should_replicate };
}

function funcs() { return { campaign_design, campaign_message, campaign_send, campaign_measure, campaign_learn }; }
module.exports = { funcs, CITATIONS, ValidationError };