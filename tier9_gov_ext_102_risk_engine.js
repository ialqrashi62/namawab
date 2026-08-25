// filepath: tier9_gov_ext_102_risk_engine.js
// TIER9_GOV_EXT-102: Enterprise risk register & assessment
'use strict';

const CITATIONS = ['ISO_31000_2018','NIST_RMF_2024','COSO_ERM_2017'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function risk_register(req) {
  ensureStr(req.risk_id, 'risk_id');
  ensureStr(req.title, 'title');
  ensureEnum(req.category, 'category', ['clinical','operational','financial','strategic','cyber','compliance','reputational','environmental','hr']);
  ensureNumber(req.likelihood, 'likelihood');
  ensureNumber(req.impact, 'impact');
  ensureStr(req.owner_role, 'owner_role');
  ensureEnum(req.treatment_strategy, 'treatment_strategy', ['avoid','mitigate','transfer','accept','exploit','enhance']);

  const score = req.likelihood * req.impact;
  let band;
  if (score >= 20) band = 'critical_immediate_treatment';
  else if (score >= 12) band = 'high_priority_treatment';
  else if (score >= 6) band = 'medium_monitor_active_treatment';
  else if (score >= 3) band = 'low_monitor';
  else band = 'minimal_acceptable';

  return { band, score, category: req.category };
}

function risk_assess(req) {
  ensureStr(req.risk_id, 'risk_id');
  ensureNumber(req.inherent_likelihood, 'inherent_likelihood');
  ensureNumber(req.inherent_impact, 'inherent_impact');
  ensureNumber(req.residual_likelihood, 'residual_likelihood');
  ensureNumber(req.residual_impact, 'residual_impact');
  ensureNumber(req.control_count, 'control_count');

  const inherent_score = req.inherent_likelihood * req.inherent_impact;
  const residual_score = req.residual_likelihood * req.residual_impact;
  const reduction = inherent_score > 0 ? (inherent_score - residual_score) / inherent_score : 0;

  let effectiveness;
  if (req.control_count === 0 && residual_score >= inherent_score * 0.5) effectiveness = 'controls_ineffective_or_missing';
  else if (reduction >= 0.7) effectiveness = 'controls_highly_effective';
  else if (reduction >= 0.4) effectiveness = 'controls_adequate';
  else if (reduction >= 0.2) effectiveness = 'controls_partial_improvement_needed';
  else effectiveness = 'controls_insignificant';

  return { effectiveness, reduction_pct: Math.round(reduction * 1000) / 10, inherent: inherent_score, residual: residual_score };
}

function risk_treatment(req) {
  ensureStr(req.risk_id, 'risk_id');
  ensureEnum(req.strategy, 'strategy', ['avoid','mitigate','transfer','accept','exploit','enhance']);
  ensureNumber(req.treatment_cost, 'treatment_cost');
  ensureNumber(req.residual_risk_score, 'residual_risk_score');
  ensureNumber(req.budget_approved, 'budget_approved');
  ensureNumber(req.timeline_days, 'timeline_days');

  let feasibility;
  if (req.treatment_cost > req.budget_approved) feasibility = 'budget_insufficient_re_estimate_or_escalate';
  if (req.timeline_days > 365) feasibility = 'long_timeline_break_into_phases';
  if (req.residual_risk_score >= 15 && req.strategy === 'accept') feasibility = 'acceptance_too_high_risk_for_high_score';
  if (req.budget_approved >= req.treatment_cost && req.timeline_days <= 365) feasibility = 'feasible_proceed';
  else if (feasibility) return { feasibility };

  return { feasibility: feasibility || 'review_constraints' };
}

function risk_review(req) {
  ensureStr(req.risk_id, 'risk_id');
  ensureNumber(req.days_since_last_review, 'days_since_last_review');
  ensureNumber(req.trend_direction, 'trend_direction');
  ensureEnum(req.review_frequency, 'review_frequency', ['daily','weekly','monthly','quarterly','semi_annual','annual','on_change']);
  ensureBool(req.escalated, 'escalated');

  let review_status;
  if (req.escalated) review_status = 'escalated_to_executive_team';
  else if (req.trend_direction >= 3) review_status = 'worsening_priority_review';
  else if (req.days_since_last_review > 90 && req.review_frequency === 'monthly') review_status = 'overdue_review';
  else if (req.trend_direction <= -2) review_status = 'improving_can_reduce_frequency';
  else review_status = 'on_track';

  return { review_status, trend: req.trend_direction, days: req.days_since_last_review };
}

function risk_dashboard(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.total_risks, 'total_risks');
  ensureNumber(req.critical_count, 'critical_count');
  ensureNumber(req.high_count, 'high_count');
  ensureNumber(req.medium_count, 'medium_count');
  ensureNumber(req.low_count, 'low_count');
  ensureNumber(req.overdue_reviews, 'overdue_reviews');

  let summary_band;
  if (req.critical_count >= 5) summary_band = 'too_many_critical_risks_priority';
  else if (req.critical_count >= 1) summary_band = 'critical_present_treat_immediately';
  else if (req.overdue_reviews >= 10) summary_band = 'overdue_review_backlog';
  else if (req.high_count + req.critical_count >= 10) summary_band = 'high_exposure';
  else summary_band = 'within_acceptable_risk_appetite';

  return { summary_band, critical: req.critical_count, high: req.high_count, overdue: req.overdue_reviews };
}

function funcs() { return { risk_register, risk_assess, risk_treatment, risk_review, risk_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };