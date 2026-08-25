// filepath: tier5_ops_ext_103_quality_mgmt_engine.js
// TIER5_OPS_EXT-103: Quality Management (QIs, RCA, FMEA, control charts)
'use strict';

const CITATIONS = [
  'AHRQ_Quality_Indicators_2020',
  'Joint_Commission_Quality_2021',
  'IHI_Improvement_Map_2019',
  'CMS_Hospital_Compare_2020',
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
function ensureStr(v, f) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f);
}
function ensureEnum(v, f, allowed) {
  if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f);
}
function ensureBool(v, f) {
  if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f);
}

function rate_indicator(req) {
  ensureNumber(req.numerator, 'numerator');
  ensureNumber(req.denominator, 'denominator');
  if (req.denominator <= 0) throw new ValidationError('denominator must be >0', 'denominator');
  ensureStr(req.indicator_code, 'indicator_code');
  ensureStr(req.unit, 'unit'); // count | percent | per_1000_days | per_100

  const raw = req.numerator / req.denominator;
  let value;
  let display;
  switch (req.unit) {
    case 'count':
      value = req.numerator;
      display = value + ' cases';
      break;
    case 'percent':
      value = raw * 100;
      display = Math.round(value * 100) / 100 + '%';
      break;
    case 'per_1000_days':
      value = req.denominator > 0 ? raw * 1000 : 0;
      display = Math.round(value * 100) / 100 + ' per 1,000 patient-days';
      break;
    case 'per_100':
      value = raw * 100;
      display = Math.round(value * 100) / 100 + ' per 100';
      break;
    default:
      throw new ValidationError('unknown unit', 'unit');
  }
  return {
    indicator_code: req.indicator_code,
    period: req.period || '',
    numerator: req.numerator,
    denominator: req.denominator,
    unit: req.unit,
    value: Math.round(value * 100) / 100,
    display,
    citations: CITATIONS,
  };
}

function control_chart(req) {
  ensureNumber(req.sigma_center, 'sigma_center');
  ensureNumber(req.sigma_sigma, 'sigma_sigma');
  ensureNumber(req.last_n_values, 'last_n_values');
  ensureNumber(req.n_outside_2sigma, 'n_outside_2sigma');
  ensureNumber(req.n_trend_6, 'n_trend_6');
  ensureNumber(req.n_trend_8, 'n_trend_8');
  ensureNumber(req.n_alt, 'n_alt');

  const ucl = req.sigma_center + 3 * req.sigma_sigma;
  const lcl = req.sigma_center - 3 * req.sigma_sigma;
  const special_causes = [];
  if (req.n_outside_2sigma > 0) special_causes.push('point_outside_2_sigma');
  if (req.n_trend_6 >= 6) special_causes.push('six_consecutive_trend');
  if (req.n_trend_8 >= 8) special_causes.push('eight_consecutive_trend');
  if (req.n_alt >= 14) special_causes.push('fourteen_alternating');

  return {
    sigma_center: req.sigma_center,
    sigma_sigma: req.sigma_sigma,
    ucl: Math.round(ucl * 100) / 100,
    lcl: Math.round(lcl * 100) / 100,
    special_cause_flags: special_causes,
    interpretation: special_causes.length === 0 ? 'common_cause_variation_in_control' : 'special_cause_variation_investigate',
    citations: CITATIONS,
  };
}

function fmea(req) {
  ensureNumber(req.severity, 'severity');
  ensureNumber(req.occurrence, 'occurrence');
  ensureNumber(req.detection, 'detection');
  ensureStr(req.step, 'step');
  ensureStr(req.failure_mode, 'failure_mode');
  if (req.severity < 1 || req.severity > 10) throw new ValidationError('severity 1..10', 'severity');
  if (req.occurrence < 1 || req.occurrence > 10) throw new ValidationError('occurrence 1..10', 'occurrence');
  if (req.detection < 1 || req.detection > 10) throw new ValidationError('detection 1..10', 'detection');

  const rpn = req.severity * req.occurrence * req.detection;
  let action;
  if (rpn >= 100) action = 'critical_priority_red_escalate_to_leadership';
  else if (rpn >= 50) action = 'high_priority_immediate_action_plan';
  else if (rpn >= 20) action = 'medium_priority_action_plan';
  else action = 'low_priority_monitor';

  return {
    step: req.step,
    failure_mode: req.failure_mode,
    severity: req.severity,
    occurrence: req.occurrence,
    detection: req.detection,
    rpn,
    action,
    citations: CITATIONS,
  };
}

function rca_priority(req) {
  ensureNumber(req.event_severity, 'event_severity');
  ensureNumber(req.cause_hazard_score, 'cause_hazard_score');
  ensureNumber(req.preventability_score, 'preventability_score');
  if (req.event_severity < 0 || req.event_severity > 100) throw new ValidationError('event_severity 0..100', 'event_severity');
  if (req.cause_hazard_score < 0 || req.cause_hazard_score > 100) throw new ValidationError('cause_hazard_score 0..100', 'cause_hazard_score');
  if (req.preventability_score < 0 || req.preventability_score > 100) throw new ValidationError('preventability_score 0..100', 'preventability_score');

  const score = (req.event_severity * 0.4) + (req.cause_hazard_score * 0.3) + (req.preventability_score * 0.3);
  let category;
  if (score >= 70) category = 'level_1_rca_full_team_root_cause_action';
  else if (score >= 40) category = 'level_2_rca_committee_root_cause';
  else if (score >= 20) category = 'level_3_aggregate_review_only';
  else category = 'no_rca_quality_flag';

  return {
    score: Math.round(score * 100) / 100,
    category,
    approach: score >= 40 ? ['define_team','timeline','identify_causes','root_cause','action_plan','followup'] : ['log_event','aggregate'],
    citations: CITATIONS,
  };
}

function patient_safety(req) {
  ensureStr(req.event_type, 'event_type');
  ensureEnum(req.event_type, 'event_type', ['never_event','sentinel','serious_incident','near_miss','hazard']);
  ensureStr(req.harm_level, 'harm_level');
  ensureEnum(req.harm_level, 'harm_level', ['none','mild','moderate','severe','death']);
  ensureStr(req.discipline, 'discipline');

  const harm_score = { none: 0, mild: 15, moderate: 40, severe: 80, death: 100 }[req.harm_level];
  const type_score = { never_event: 100, sentinel: 80, serious_incident: 60, near_miss: 20, hazard: 10 }[req.event_type];
  const total = harm_score + type_score;
  let escalation;
  if (total >= 150) escalation = 'executive_investigation_external_disclosure';
  else if (total >= 100) escalation = 'root_cause_analysis_required';
  else if (total >= 60) escalation = 'committee_review_required';
  else escalation = 'line_manager_review';

  return {
    event_type: req.event_type,
    harm_level: req.harm_level,
    discipline: req.discipline,
    harm_score,
    type_score,
    total_score: total,
    escalation,
    citations: CITATIONS,
  };
}

function funcs() {
  return { rate_indicator, control_chart, fmea, rca_priority, patient_safety };
}

module.exports = { funcs, CITATIONS, ValidationError };
