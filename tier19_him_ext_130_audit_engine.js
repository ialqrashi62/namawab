// filepath: tier19_him_ext_130_audit_engine.js
// TIER19_HIM_EXT-130: Record audit (concurrent, retrospective, focused)
'use strict';

const CITATIONS = ['AHIMA_AUDIT_2024','CMS_QAPI_2024','HIM_AUDIT_PROTOCOLS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function audit_concurrent(req) {
  ensureStr(req.encounter_id, 'encounter_id');
  ensureEnum(req.audit_type, 'audit_type', ['concurrent','retrospective','focused','random_sample','targeted','peer_review','other']);
  ensureBool(req.dx_documented, 'dx_documented');
  ensureBool(req.treatment_plan, 'treatment_plan');
  ensureBool(req.medication_orders_clear, 'med_orders_clear');
  ensureBool(req.consent_signed, 'consent_signed');
  ensureBool(req.coding_quality, 'coding_quality');
  ensureEnum(req.auditor_id, 'auditor_id', ['him_coder','him_auditor','rn_auditor','physician_auditor','quality_dept','other']);

  let status;
  if (!req.dx_documented) status = 'dx_documentation_incomplete';
  else if (!req.medication_orders_clear) status = 'med_orders_unclear_review';
  else if (!req.consent_signed) status = 'consent_missing_blocking';
  else if (!req.coding_quality) status = 'coding_quality_issue_flagged';
  else status = 'concurrent_audit_pass';
  return { status, type: req.audit_type };
}

function audit_scoring(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureNumber(req.compliance_pct, 'compliance_pct');
  ensureNumber(req.critical_finds, 'critical_finds');
  ensureNumber(req.total_items_audited, 'total_items');
  ensureEnum(req.threshold, 'threshold', ['pass_90','pass_85','pass_80','pass_75','review_required','other']);
  ensureBool(req.action_plan_attached, 'action_plan');
  ensureEnum(req.audit_period, 'audit_period', ['weekly','monthly','quarterly','semi_annual','annual','ad_hoc','other']);

  let status;
  if (req.critical_finds > 0 && !req.action_plan_attached) status = 'critical_finds_action_plan_required';
  else if (req.threshold === 'pass_90' && req.compliance_pct < 90) status = 'under_90_threshold_review';
  else if (req.threshold === 'pass_85' && req.compliance_pct < 85) status = 'under_85_threshold_review';
  else if (req.compliance_pct >= 95) status = 'excellent_compliance_95_plus';
  else status = 'audit_documented';
  return { status, compliance: req.compliance_pct };
}

function audit_focused(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureEnum(req.focus_area, 'focus_area', ['high_risk_dx','medication_safety','infection','falls','pressure_injury','surgical_safety','transfusion','restraint','other']);
  ensureNumber(req.cases_reviewed, 'cases_reviewed');
  ensureNumber(req.findings_count, 'findings_count');
  ensureBool(req.actionable_findings, 'actionable');
  ensureEnum(req.report_to, 'report_to', ['quality_council','patient_safety','medical_executive','department_chief','regulatory','other']);

  let status;
  if (req.cases_reviewed < 5) status = 'under_5_cases_insufficient_sample';
  else if (req.actionable_findings && req.report_to === 'not_assigned') status = 'actionable_findings_report_to_required';
  else if (req.findings_count / Math.max(req.cases_reviewed, 1) > 0.5) status = 'over_50pct_finding_rate_alarming';
  else status = 'focused_audit_documented';
  return { status, findings: req.findings_count };
}

function audit_trend(req) {
  ensureStr(req.audit_period, 'audit_period');
  ensureNumber(req.period_compliance_pct, 'period_compliance_pct');
  ensureNumber(req.previous_compliance_pct, 'previous_compliance_pct');
  ensureNumber(req.trend_3_periods, 'trend_3_periods');
  ensureEnum(req.direction, 'direction', ['improving','stable','declining','insufficient_data','other']);
  ensureNumber(req.target_pct, 'target_pct');

  let status;
  if (req.direction === 'declining' && req.period_compliance_pct < req.target_pct) status = 'declining_below_target_immediate';
  else if (req.trend_3_periods < 0) status = 'three_period_trend_negative_review';
  else if (req.period_compliance_pct < req.target_pct && req.direction === 'stable') status = 'below_target_stable_no_improvement';
  else status = 'trend_documented';
  return { status, direction: req.direction };
}

function audit_correction(req) {
  ensureStr(req.finding_id, 'finding_id');
  ensureEnum(req.correction_status, 'correction_status', ['open','plan_in_progress','implemented','verified','closed','recurrence','other']);
  ensureNumber(req.days_open, 'days_open');
  ensureBool(req.follow_up_scheduled, 'follow_up_scheduled');
  ensureBool(req.corrected_documented, 'corrected_documented');
  ensureBool(req.recurrence_risk, 'recurrence_risk');

  let status;
  if (req.correction_status === 'open' && req.days_open > 60) status = 'finding_open_over_60d_review';
  else if (req.correction_status === 'closed' && !req.corrected_documented) status = 'closure_requires_documentation';
  else if (req.recurrence_risk && !req.follow_up_scheduled) status = 'recurrence_risk_follow_up_required';
  else if (req.correction_status === 'recurrence') status = 'recurrence_escalate';
  else status = 'correction_documented';
  return { status, status_name: req.correction_status };
}

function funcs() { return { audit_concurrent, audit_scoring, audit_focused, audit_trend, audit_correction }; }
module.exports = { funcs, CITATIONS, ValidationError };