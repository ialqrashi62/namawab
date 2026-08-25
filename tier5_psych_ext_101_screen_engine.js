// filepath: tier5_psych_ext_101_screen_engine.js
// TIER5_PSYCH_EXT-101: Mental health screens (PHQ-9, GAD-7, MDQ, PCL-5, CAGE-AID, CSSRS)
'use strict';

const CITATIONS = [
  'Kroenke_2010_PHQ9',
  'Spitzer_2006_GAD7',
  'Hirschfeld_2000_MDQ',
  'Weathers_2013_PCL5',
  'NIMH_CSSRS_Posner_2011',
];

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.kind = 'validation';
  }
}

function ensureNumber(v, f) {
  if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f);
}
function ensureInt(v, f, lo, hi) {
  if (!Number.isInteger(v) || v < lo || v > hi) throw new ValidationError(`${f} must be integer in [${lo}..${hi}]`, f);
}

function phq9(req) {
  const items = [];
  for (let i = 1; i <= 9; i++) {
    const v = req[`q${i}`];
    if (!Number.isInteger(v) || v < 0 || v > 3) throw new ValidationError(`q${i} 0..3`, `q${i}`);
    items.push(v);
  }
  const total = items.reduce((s, x) => s + x, 0);
  let severity;
  if (total <= 4) severity = 'minimal';
  else if (total <= 9) severity = 'mild';
  else if (total <= 14) severity = 'moderate';
  else if (total <= 19) severity = 'moderately_severe';
  else severity = 'severe';

  // PHQ-9 Q9 = self-harm screen
  let suicide_risk_flag = false;
  if (req.q9 > 0) suicide_risk_flag = true;
  return { phq9_total: total, severity, q9_self_harm_score: req.q9, suicide_risk_flag, citations: [CITATIONS[0]] };
}

function gad7(req) {
  const items = [];
  for (let i = 1; i <= 7; i++) {
    const v = req[`q${i}`];
    if (!Number.isInteger(v) || v < 0 || v > 3) throw new ValidationError(`q${i} 0..3`, `q${i}`);
    items.push(v);
  }
  const total = items.reduce((s, x) => s + x, 0);
  let severity;
  if (total <= 4) severity = 'minimal';
  else if (total <= 9) severity = 'mild';
  else if (total <= 14) severity = 'moderate';
  else severity = 'severe';
  return { gad7_total: total, severity, citation: CITATIONS[1] };
}

function mdq(req) {
  // MDQ: 13 yes/no questions + symptoms concurrent + duration > 1 week
  const yes_count = [];
  for (let i = 1; i <= 13; i++) {
    const v = req[`q${i}`];
    if (typeof v !== 'boolean') throw new ValidationError(`q${i} must be boolean`, `q${i}`);
    if (v) yes_count.push(1);
  }
  ensureBool(req.clusters_occurred_together, 'clusters_occurred_together');
  ensureBool(req.days_off_required_during_episode, 'days_off_required_during_episode');

  const count = yes_count.length;
  const positive = count >= 7 && req.clusters_occurred_together && req.days_off_required_during_episode;
  return { mdq_yes_count: count, screen_positive: positive, citation: CITATIONS[2] };
}

function pcl5(req) {
  // PTSD Checklist-5 (20 items, 0..4)
  for (let i = 1; i <= 20; i++) {
    const v = req[`q${i}`];
    if (!Number.isInteger(v) || v < 0 || v > 4) throw new ValidationError(`q${i} 0..4`, `q${i}`);
  }
  const total = Array.from({length:20}, (_,i)=>i+1).reduce((s,i)=>s+req[`q${i}`],0);
  let severity;
  if (total < 33) severity = 'below_threshold';
  else if (total < 50) severity = 'moderate_ptsd';
  else severity = 'severe_ptsd';
  return { pcl5_total: total, severity, citation: CITATIONS[3] };
}

function cssrs(req) {
  // Columbia Suicide Severity: wish, ideation, method, intent, plan, behavior
  ensureBool(req.wish_to_be_dead_past_month, 'wish_to_be_dead_past_month');
  ensureBool(req.recent_active_suicidal_ideation, 'recent_active_suicidal_ideation');
  ensureBool(req.has_method, 'has_method');
  ensureBool(req.has_intent, 'has_intent');
  ensureBool(req.has_plan, 'has_plan');
  ensureBool(req.past_3mo_self_harm_behavior, 'past_3mo_self_harm_behavior');
  ensureBool(req.lifetime_self_harm_behavior, 'lifetime_self_harm_behavior');

  let risk_level;
  if (req.past_3mo_self_harm_behavior) risk_level = 'high_active_suicidal_behavior_assessment_inpatient';
  else if (req.has_intent || req.has_plan) risk_level = 'very_high_inpatient_or_close_followup';
  else if (req.recent_active_suicidal_ideation && req.has_method) risk_level = 'high_restrict_access_to_lethals_close_followup';
  else if (req.recent_active_suicidal_ideation) risk_level = 'moderate_safety_plan_24h_followup';
  else if (req.wish_to_be_dead_past_month) risk_level = 'low_continue_contact_reassess';
  else risk_level = 'no_imminent_risk';

  return { risk_level, recommendations: risk_level.startsWith('high') || risk_level.startsWith('very_high') ? ['1:1_sitter','remove_lethals','psych_consult','safety_plan','daily_followup'] : ['safety_plan','followup_call'], citation: CITATIONS[4] };
}

function funcs() {
  return { phq9, gad7, mdq, pcl5, cssrs };
}

module.exports = { funcs, CITATIONS, ValidationError };

function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}
