// filepath: tier5_ops_ext_104_accreditation_engine.js
// TIER5_OPS_EXT-104: Accreditation gap analysis (CBAHI / JCI / AHRQ / MAGNET)
'use strict';

const CITATIONS = [
  'CBAHI_Hospital_Standards_2023',
  'JCI_Hospital_Accreditation_7th_Ed',
  'CBAHI_National_Hospital_Standards',
  'MAGNET_Recognition_Program_2023',
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

function gap_analyze(req) {
  ensureStr(req.framework, 'framework'); // cbahi | jci | magnet
  ensureEnum(req.framework, 'framework', ['cbahi','jci','magnet']);
  ensureNumber(req.total_standards, 'total_standards');
  ensureNumber(req.fully_met, 'fully_met');
  ensureNumber(req.partially_met, 'partially_met');
  ensureNumber(req.not_met, 'not_met');
  if (req.total_standards <= 0) throw new ValidationError('total_standards must be >0', 'total_standards');
  if (req.fully_met + req.partially_met + req.not_met > req.total_standards) throw new ValidationError('partial+full+not > total', 'fully_met');

  const pct = (req.fully_met + 0.5 * req.partially_met) / req.total_standards * 100;
  let readiness;
  if (pct >= 90) readiness = 'survey_ready';
  else if (pct >= 75) readiness = 'near_ready_close_gaps_in_60_days';
  else if (pct >= 50) readiness = 'major_gaps_action_plan_6_months';
  else readiness = 'not_ready_12_month_action_plan';

  return {
    framework: req.framework,
    total_standards: req.total_standards,
    fully_met: req.fully_met,
    partially_met: req.partially_met,
    not_met: req.not_met,
    composite_pct: Math.round(pct * 100) / 100,
    readiness,
    citations: CITATIONS,
  };
}

function standard_score(req) {
  ensureNumber(req.compliance_pct, 'compliance_pct');
  ensureStr(req.standard_code, 'standard_code');
  ensureStr(req.chapter, 'chapter');
  if (req.compliance_pct < 0 || req.compliance_pct > 100) throw new ValidationError('compliance_pct 0..100', 'compliance_pct');

  let grade;
  if (req.compliance_pct >= 95) grade = 'A_met';
  else if (req.compliance_pct >= 85) grade = 'B_partial';
  else if (req.compliance_pct >= 70) grade = 'C_substantial_gap';
  else grade = 'F_critical_action_required';

  return {
    chapter: req.chapter,
    standard_code: req.standard_code,
    compliance_pct: req.compliance_pct,
    grade,
    citations: CITATIONS,
  };
}

function chapter_summary(req) {
  ensureStr(req.chapter, 'chapter');
  ensureNumber(req.standards_in_chapter, 'standards_in_chapter');
  ensureNumber(req.met_count, 'met_count');
  if (req.standards_in_chapter <= 0) throw new ValidationError('standards_in_chapter must be >0', 'standards_in_chapter');

  const comp_pct = (req.met_count / req.standards_in_chapter) * 100;
  return {
    chapter: req.chapter,
    standards_total: req.standards_in_chapter,
    met: req.met_count,
    compliance_pct: Math.round(comp_pct * 10) / 10,
    critical_gap: comp_pct < 70,
    citations: CITATIONS,
  };
}

function survey_readiness(req) {
  ensureNumber(req.days_until_survey, 'days_until_survey');
  ensureNumber(req.action_plan_pct_complete, 'action_plan_pct_complete');
  ensureNumber(req.staff_trained_pct, 'staff_trained_pct');
  ensureNumber(req.policies_current_pct, 'policies_current_pct');
  ensureNumber(req.tracers_documented, 'tracers_documented');
  ensureNumber(req.required_tracers, 'required_tracers');
  if (req.action_plan_pct_complete < 0 || req.action_plan_pct_complete > 100) throw new ValidationError('action 0..100', 'action_plan_pct_complete');
  if (req.staff_trained_pct < 0 || req.staff_trained_pct > 100) throw new ValidationError('staff 0..100', 'staff_trained_pct');

  const score = (req.action_plan_pct_complete * 0.35) + (req.staff_trained_pct * 0.25) + (req.policies_current_pct * 0.2) + ((req.tracers_documented / Math.max(1, req.required_tracers)) * 100 * 0.2);
  let signal;
  if (score >= 85 && req.days_until_survey >= 60) signal = 'on_track_for_survey';
  else if (score >= 70 && req.days_until_survey >= 30) signal = 'tight_accelerate_closeout';
  else if (score < 70) signal = 'defer_survey_pursue_extension';
  else signal = 'monitor_closely';

  return {
    days_until_survey: req.days_until_survey,
    score: Math.round(score * 100) / 100,
    signal,
    citations: CITATIONS,
  };
}

function action_plan(req) {
  ensureStr(req.gap_description, 'gap_description');
  ensureEnum(req.priority, 'priority', ['critical','high','medium','low']);
  ensureNumber(req.target_completion_days, 'target_completion_days');
  ensureNumber(req.estimated_cost_sar, 'estimated_cost_sar');
  ensureStr(req.owner_role, 'owner_role');

  const days_to_due = req.target_completion_days;
  let risk_band;
  if (req.priority === 'critical' && days_to_due > 30) risk_band = 'red_escalate';
  else if (req.priority === 'high' && days_to_due > 60) risk_band = 'amber_followup';
  else risk_band = 'green_track';

  return {
    gap_description: req.gap_description,
    priority: req.priority,
    target_completion_days: days_to_due,
    estimated_cost_sar: req.estimated_cost_sar,
    owner_role: req.owner_role,
    risk_band,
    citations: CITATIONS,
  };
}

function funcs() {
  return { gap_analyze, standard_score, chapter_summary, survey_readiness, action_plan };
}

module.exports = { funcs, CITATIONS, ValidationError };
