// filepath: tier9_gov_ext_104_audit_engine.js
// TIER9_GOV_EXT-104: Internal audit program
'use strict';

const CITATIONS = ['IIA_2024_STANDARDS','ISO_19011_2018','CBAHI_AUDIT_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function audit_plan_create(req) {
  ensureStr(req.plan_id, 'plan_id');
  ensureStr(req.year, 'year');
  ensureNumber(req.audit_count_planned, 'audit_count_planned');
  ensureNumber(req.resource_hours, 'resource_hours');
  ensureEnum(req.basis, 'basis', ['risk_based','regulatory_required','cycle_based','management_request','incident_triggered','previous_findings','comprehensive_annual']);
  ensureNumber(req.high_risk_audits_planned, 'high_risk_audits_planned');

  let plan_quality;
  if (req.high_risk_audits_planned === 0 && req.audit_count_planned > 5) plan_quality = 'no_high_risk_audits_priority_review';
  else if (req.resource_hours < req.audit_count_planned * 40) plan_quality = 'resource_constraint_plan_unrealistic';
  else if (req.basis === 'comprehensive_annual' && req.audit_count_planned < 10) plan_quality = 'comprehensive_too_few_audits';
  else if (req.basis === 'risk_based' && req.high_risk_audits_planned >= 1) plan_quality = 'well_targeted_plan';
  else plan_quality = 'plan_acceptable';

  return { plan_quality, plan_id: req.plan_id, total: req.audit_count_planned };
}

function audit_execute(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureStr(req.auditor_id, 'auditor_id');
  ensureEnum(req.audit_type, 'audit_type', ['financial','operational','compliance','clinical','it_security','privacy','hr','pharmacy','radiation','infection_control','accreditation_prep']);
  ensureEnum(req.status, 'status', ['planning','fieldwork','reporting','follow_up','closed','cancelled','on_hold']);
  ensureNumber(req.findings_count, 'findings_count');
  ensureNumber(req.days_in_progress, 'days_in_progress');
  ensureNumber(req.target_completion_days, 'target_completion_days');

  let execution_status;
  if (req.status === 'closed') execution_status = 'closed_archived';
  else if (req.days_in_progress > req.target_completion_days * 1.5) execution_status = 'severely_overdue_escalate';
  else if (req.days_in_progress > req.target_completion_days) execution_status = 'overdue_review';
  else if (req.findings_count >= 10) execution_status = 'many_findings_complex_audit';
  else execution_status = 'on_track';
  return { execution_status, status: req.status, findings: req.findings_count };
}

function audit_finding(req) {
  ensureStr(req.finding_id, 'finding_id');
  ensureEnum(req.severity, 'severity', ['observation','minor_noncompliance','major_noncompliance','critical_noncompliance','exemplary_practice']);
  ensureEnum(req.criteria_reference, 'criteria_reference', ['policy','regulation','standard','procedure','law','industry_best_practice']);
  ensureNumber(req.days_to_remediate, 'days_to_remediate');
  ensureBool(req.management_response_received, 'management_response_received');
  ensureBool(req.corrective_action_proposed, 'corrective_action_proposed');

  let finding_status;
  if (req.severity === 'critical_noncompliance' && !req.management_response_received) finding_status = 'critical_immediate_management_response';
  else if (!req.corrective_action_proposed) finding_status = 'corrective_action_required';
  else if (req.days_to_remediate > 180) finding_status = 'extended_remediation_review';
  else if (req.management_response_received && req.corrective_action_proposed) finding_status = 'finding_actionable';
  else finding_status = 'standard_finding';
  return { finding_status, severity: req.severity };
}

function audit_follow_up(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureNumber(req.findings_total, 'findings_total');
  ensureNumber(req.findings_implemented, 'findings_implemented');
  ensureNumber(req.findings_overdue, 'findings_overdue');
  ensureNumber(req.findings_verified, 'findings_verified');
  ensureNumber(req.days_since_audit_close, 'days_since_audit_close');

  const implementation_rate = req.findings_total > 0 ? req.findings_implemented / req.findings_total : 0;
  const verification_rate = req.findings_total > 0 ? req.findings_verified / req.findings_total : 0;
  let summary;
  if (req.findings_overdue >= 5) summary = 'significant_overdue_findings_priority';
  else if (implementation_rate >= 0.9 && verification_rate >= 0.8) summary = 'excellent_follow_up';
  else if (implementation_rate >= 0.7) summary = 'good_follow_up_progress';
  else if (req.days_since_audit_close > 90 && implementation_rate < 0.5) summary = 'stalled_follow_up_escalate';
  else summary = 'in_progress';
  return { summary, implementation_pct: Math.round(implementation_rate * 1000) / 10, verification_pct: Math.round(verification_rate * 1000) / 10 };
}

function audit_report(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureEnum(req.report_format, 'report_format', ['detailed_narrative','executive_summary','finding_only','presentation','dashboard_export']);
  ensureEnum(req.audience, 'audience', ['audit_committee','executive_team','board','regulator','external_auditor','management']);
  ensureBool(req.includes_recommendations, 'includes_recommendations');
  ensureNumber(req.page_count, 'page_count');

  let format_quality;
  if (req.audience === 'board' && req.page_count > 25) format_quality = 'board_report_too_long_summarize';
  else if (req.audience === 'regulator' && !req.includes_recommendations) format_quality = 'regulator_report_must_include_recommendations';
  else if (req.report_format === 'presentation' && req.page_count > 30) format_quality = 'presentation_too_many_slides';
  else format_quality = 'format_appropriate';
  return { format_quality, audience: req.audience };
}

function funcs() { return { audit_plan_create, audit_execute, audit_finding, audit_follow_up, audit_report }; }
module.exports = { funcs, CITATIONS, ValidationError };