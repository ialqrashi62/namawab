// filepath: tier5_mtm_ext_103_adherence_engine.js
// TIER5_MTM_EXT-103: Adherence (Morisky, pill count, refill, barriers, follow-up)
'use strict';

const CITATIONS = [
  'Morisky_8_item_Validation_2008',
  'WHO_Adherence_5_dimensions_2003',
  'PQA_Adherence_2022',
];

class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; }
}
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function morisky(req) {
  ensureNumber(req.score, 'score');
  ensureStr(req.dimension, 'dimension');
  ensureEnum(req.dimension, 'dimension', ['forgetfulness','carelessness','feeling_better','feeling_worse','cost_barriers']);
  ensureBool(req.taken_consistently, 'taken_consistently');

  let adherence;
  if (req.score >= 8) adherence = 'high_adherence';
  else if (req.score >= 6) adherence = 'medium_adherence_then_continue_with_intervention';
  else adherence = 'low_adherence_then_continue_with_targeted_intervention';
  return { adherence };
}

function pill_count(req) {
  ensureNumber(req.tablets_dispensed, 'tablets_dispensed');
  ensureNumber(req.tablets_remaining, 'tablets_remaining');
  ensureNumber(req.days_elapsed, 'days_elapsed');
  ensureNumber(req.tablets_per_day, 'tablets_per_day');

  let adherence_pct;
  if (req.days_elapsed === 0 || req.tablets_per_day === 0) throw new ValidationError('days_elapsed & tablets_per_day >0');
  const expected_remaining = req.tablets_dispensed - (req.days_elapsed * req.tablets_per_day);
  if (expected_remaining < 0) throw new ValidationError('overdispensed');
  const actual_consumed = req.tablets_dispensed - req.tablets_remaining;
  const expected_consumed = req.days_elapsed * req.tablets_per_day;
  adherence_pct = (actual_consumed / expected_consumed) * 100;
  let rating;
  if (adherence_pct >= 95) rating = 'excellent_adherence';
  else if (adherence_pct >= 80) rating = 'acceptable_adherence';
  else if (adherence_pct >= 60) rating = 'low_adherence_then_continue_with_review';
  else rating = 'poor_adherence_then_continue_with_intervention';
  return { adherence_pct: Math.round(adherence_pct * 10) / 10, rating };
}

function refill(req) {
  ensureNumber(req.refills_per_year, 'refills_per_year');
  ensureNumber(req.days_supply_per_fill, 'days_supply_per_fill');
  ensureNumber(req.expected_fills_per_year, 'expected_fills_per_year');
  ensureBool(req.consistent_pickup, 'consistent_pickup');

  let advice;
  if (req.refills_per_year === 0) advice = 'continue_with_no_refills_review';
  else if (req.days_supply_per_fill >= 84) advice = 'continue_with_extended_supply_review';
  else if (!req.consistent_pickup) advice = 'continue_with_sync_review';
  else if (req.refills_per_year < req.expected_fills_per_year * 0.7) advice = 'continue_with_targeted_outreach';
  else advice = 'continue_with_review';
  return { advice };
}

function barriers(req) {
  ensureBool(req.cost_barrier, 'cost_barrier');
  ensureBool(req.side_effect_barrier, 'side_effect_barrier');
  ensureBool(req.complexity_barrier, 'complexity_barrier');
  ensureBool(req.forgetfulness_barrier, 'forgetfulness_barrier');
  ensureBool(req.understanding_barrier, 'understanding_barrier');
  ensureBool(req.access_barrier, 'access_barrier');

  let strategy;
  if (req.cost_barrier && req.complexity_barrier) strategy = 'continue_with_simplify_then_assistance_review';
  else if (req.cost_barrier) strategy = 'continue_with_assistance_review';
  else if (req.complexity_barrier) strategy = 'continue_with_simplify_review';
  else if (req.forgetfulness_barrier) strategy = 'continue_with_reminder_review';
  else if (req.understanding_barrier) strategy = 'continue_with_education_review';
  else if (req.side_effect_barrier) strategy = 'continue_with_management_review';
  else if (req.access_barrier) strategy = 'continue_with_delivery_review';
  else strategy = 'continue_with_review';
  return { strategy };
}

function followup_plan(req) {
  ensureNumber(req.next_followup_days, 'next_followup_days');
  ensureBool(req.phone_followup_planned, 'phone_followup_planned');
  ensureBool(req.telehealth_followup_planned, 'telehealth_followup_planned');
  ensureBool(req.in_person_followup_planned, 'in_person_followup_planned');
  ensureBool(req.lab_followup_planned, 'lab_followup_planned');

  let plan;
  if (req.lab_followup_planned && req.next_followup_days <= 30) plan = 'continue_with_close_monitoring';
  else if (req.phone_followup_planned && req.next_followup_days <= 14) plan = 'continue_with_phone_review';
  else if (req.telehealth_followup_planned && req.next_followup_days <= 30) plan = 'continue_with_telehealth_review';
  else if (req.in_person_followup_planned && req.next_followup_days <= 90) plan = 'continue_with_in_person_review';
  else plan = 'continue_with_review';
  return { plan };
}

function adherence_trend(req) {
  ensureNumber(req.pdc_30_days, 'pdc_30_days');
  ensureNumber(req.pdc_60_days, 'pdc_60_days');
  ensureNumber(req.pdc_90_days, 'pdc_90_days');
  ensureBool(req.improving, 'improving');
  ensureBool(req.worsening, 'worsening');

  let trend;
  if (req.improving && req.pdc_90_days >= 80) trend = 'continue_with_positive_trend';
  else if (req.worsening && req.pdc_30_days < 50) trend = 'continue_with_targeted_outreach';
  else if (req.pdc_90_days < 50) trend = 'continue_with_intervention_review';
  else trend = 'continue_with_review';
  return { trend };
}

function funcs() { return { morisky, pill_count, refill, barriers, followup_plan, adherence_trend }; }
module.exports = { funcs, CITATIONS, ValidationError };
