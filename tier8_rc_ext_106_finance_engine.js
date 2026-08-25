// filepath: tier8_rc_ext_106_finance_engine.js
// TIER8_RC_EXT-106: Financial analytics & KPIs (AR aging, days in AR, clean claim rate, yield, DSO)
'use strict';

const CITATIONS = ['HFMA_AR_BENCH_2023','MGMA_KPI_2024','CMS_REVENUE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function finance_ar_aging(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.total_ar, 'total_ar');
  ensureNumber(req.ar_0_30, 'ar_0_30');
  ensureNumber(req.ar_31_60, 'ar_31_60');
  ensureNumber(req.ar_61_90, 'ar_61_90');
  ensureNumber(req.ar_91_120, 'ar_91_120');
  ensureNumber(req.ar_over_120, 'ar_over_120');

  const over_90_pct = req.total_ar > 0 ? (req.ar_91_120 + req.ar_over_120) / req.total_ar : 0;
  let band;
  if (over_90_pct >= 0.3) band = 'high_over_90_priority_action';
  else if (over_90_pct >= 0.2) band = 'above_industry_average';
  else if (over_90_pct >= 0.1) band = 'within_average';
  else if (over_90_pct >= 0.05) band = 'top_quartile';
  else band = 'best_in_class';

  return { band, total_ar: req.total_ar, over_90_pct: Math.round(over_90_pct * 1000) / 10 };
}

function finance_dso(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.total_revenue_90d, 'total_revenue_90d');
  ensureNumber(req.total_ar, 'total_ar');
  ensureNumber(req.writeoffs_90d, 'writeoffs_90d');
  ensureNumber(req.bad_debt_90d, 'bad_debt_90d');
  ensureNumber(req.credit_balances, 'credit_balances');

  const daily_revenue = req.total_revenue_90d / 90;
  const dso = daily_revenue > 0 ? req.total_ar / daily_revenue : 0;
  let band;
  if (dso >= 60) band = 'high_dso_priority_action';
  else if (dso >= 45) band = 'above_industry_average';
  else if (dso >= 35) band = 'within_average';
  else if (dso >= 25) band = 'top_quartile';
  else band = 'best_in_class';

  return { dso: Math.round(dso * 10) / 10, band };
}

function finance_clean_claim_rate(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.claims_submitted, 'claims_submitted');
  ensureNumber(req.claims_first_pass_paid, 'claims_first_pass_paid');
  ensureNumber(req.claims_first_pass_denied, 'claims_first_pass_denied');
  ensureNumber(req.edits_passing_front_end, 'edits_passing_front_end');

  const clean_rate = req.claims_submitted > 0 ? req.claims_first_pass_paid / req.claims_submitted : 0;
  const edit_pass_rate = req.claims_submitted > 0 ? req.edits_passing_front_end / req.claims_submitted : 0;
  let summary;
  if (clean_rate >= 0.95) summary = 'five_star_top_quartile';
  else if (clean_rate >= 0.9) summary = 'above_industry_benchmark';
  else if (clean_rate >= 0.85) summary = 'within_average';
  else if (clean_rate >= 0.75) summary = 'below_benchmark_action';
  else summary = 'priority_improvement';

  return { clean_rate_pct: Math.round(clean_rate * 1000) / 10, edit_pass_pct: Math.round(edit_pass_rate * 1000) / 10, summary };
}

function finance_net_yield(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.gross_charges, 'gross_charges');
  ensureNumber(req.contractual_adjustments, 'contractual_adjustments');
  ensureNumber(req.denials, 'denials');
  ensureNumber(req.bad_debt, 'bad_debt');
  ensureNumber(req.charity_care, 'charity_care');
  ensureNumber(req.net_revenue, 'net_revenue');
  ensureNumber(req.total_cost, 'total_cost');

  const adjusted_net = req.net_revenue - req.denials - req.bad_debt;
  const margin = req.total_cost > 0 ? (adjusted_net - req.total_cost) / req.total_cost : 0;
  let band;
  if (margin >= 0.15) band = 'strong_margin';
  else if (margin >= 0.05) band = 'healthy_margin';
  else if (margin >= 0) band = 'breakeven_review';
  else band = 'negative_margin_immediate_action';
  return { margin: Math.round(margin * 1000) / 10, adjusted_net, band };
}

function finance_kpi_dashboard(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.net_revenue_ytd, 'net_revenue_ytd');
  ensureNumber(req.budget_ytd, 'budget_ytd');
  ensureNumber(req.dso, 'dso');
  ensureNumber(req.ar_over_90_pct, 'ar_over_90_pct');
  ensureNumber(req.denial_rate_pct, 'denial_rate_pct');
  ensureNumber(req.clean_claim_rate_pct, 'clean_claim_rate_pct');
  ensureNumber(req.collections_to_charges, 'collections_to_charges');

  const variance_to_budget = req.budget_ytd > 0 ? (req.net_revenue_ytd - req.budget_ytd) / req.budget_ytd : 0;
  let summary;
  if (variance_to_budget >= 0.05 && req.dso <= 35 && req.denial_rate_pct <= 5) summary = 'high_performing_quarter';
  else if (variance_to_budget >= 0) summary = 'meeting_budget_review_others';
  else summary = 'below_budget_immediate_leadership_review';

  return { variance_to_budget_pct: Math.round(variance_to_budget * 1000) / 10, summary };
}

function funcs() { return { finance_ar_aging, finance_dso, finance_clean_claim_rate, finance_net_yield, finance_kpi_dashboard }; }
module.exports = { funcs, CITATIONS, ValidationError };