// filepath: tier5_ops_ext_106_audit_ops_engine.js
// TIER5_OPS_EXT-106: Operational audit (findings, followup, KRI)
'use strict';

const CITATIONS = [
  'IIA_Standards_International_Professional_Practices_2017',
  'COSO_Internal_Control_Integrated_Framework_2013',
  'ISO_19011_2018_Auditing_Management_Systems',
  'CSA_Canadian_Sustainability_Audit_2023',
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

function audit_finding(req) {
  ensureStr(req.domain, 'domain');
  ensureEnum(req.domain, 'domain', ['finance','clinical','hr','pharmacy','radiology','lab','surgery','it','compliance']);
  ensureStr(req.title, 'title');
  ensureStr(req.finding, 'finding');
  ensureStr(req.risk_level, 'risk_level');
  ensureEnum(req.risk_level, 'risk_level', ['critical','high','medium','low']);
  ensureNumber(req.likelihood, 'likelihood');
  ensureNumber(req.impact, 'impact');
  ensureStr(req.owner_role, 'owner_role');
  ensureNumber(req.target_closeout_days, 'target_closeout_days');

  const inherent_risk = req.likelihood * req.impact;
  let priority;
  if (req.risk_level === 'critical' || inherent_risk >= 20) priority = 'P1_immediate_close_30_days';
  else if (req.risk_level === 'high' || inherent_risk >= 12) priority = 'P2_close_60_days';
  else if (req.risk_level === 'medium' || inherent_risk >= 6) priority = 'P3_close_90_days';
  else priority = 'P4_track';

  return {
    domain: req.domain,
    title: req.title,
    risk_level: req.risk_level,
    likelihood: req.likelihood,
    impact: req.impact,
    inherent_risk,
    owner_role: req.owner_role,
    target_closeout_days: req.target_closeout_days,
    priority,
    citations: CITATIONS,
  };
}

function followup_status(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureNumber(req.days_open, 'days_open');
  ensureStr(req.status, 'status');
  ensureEnum(req.status, 'status', ['open','in_progress','closed','verified','overdue']);
  ensureBool(req.action_verified, 'action_verified');
  ensureNumber(req.days_to_target_closeout, 'days_to_target_closeout');

  let signal;
  if (req.status === 'closed' && req.action_verified) signal = 'effectively_closed';
  else if (req.days_to_target_closeout < 0 && req.status !== 'closed') signal = 'overdue_escalate';
  else if (req.days_to_target_closeout < 7 && req.status === 'open') signal = 'urgent_closeout';
  else if (req.days_to_target_closeout < 0) signal = 'overdue_documented';
  else signal = 'on_track';

  return {
    audit_id: req.audit_id,
    days_open: req.days_open,
    days_to_target_closeout: req.days_to_target_closeout,
    status: req.status,
    action_verified: req.action_verified,
    signal,
    citations: CITATIONS,
  };
}

function kri_dashboard(req) {
  ensureNumber(req.total_audits_ytd, 'total_audits_ytd');
  ensureNumber(req.open_findings, 'open_findings');
  ensureNumber(req.overdue, 'overdue');
  ensureNumber(req.closed_ytd, 'closed_ytd');
  ensureNumber(req.repeat_findings, 'repeat_findings');

  const close_rate = req.total_audits_ytd > 0 ? (req.closed_ytd / req.total_audits_ytd) * 100 : 0;
  const overdue_pct = req.open_findings > 0 ? (req.overdue / req.open_findings) * 100 : 0;
  const repeat_pct = req.total_audits_ytd > 0 ? (req.repeat_findings / req.total_audits_ytd) * 100 : 0;
  let governance_index;
  if (close_rate >= 80 && overdue_pct < 10 && repeat_pct < 15) governance_index = 'A_strong_internal_control';
  else if (close_rate >= 65 && overdue_pct < 20) governance_index = 'B_adequate_with_gaps';
  else if (close_rate >= 50) governance_index = 'C_weak_action_required';
  else governance_index = 'D_failing_escalate_to_audit_committee';

  return {
    close_rate_pct: Math.round(close_rate * 100) / 100,
    overdue_pct: Math.round(overdue_pct * 100) / 100,
    repeat_findings_pct: Math.round(repeat_pct * 100) / 100,
    governance_index,
    citations: CITATIONS,
  };
}

function evidence_checklist(req) {
  ensureStr(req.audit_id, 'audit_id');
  ensureNumber(req.evidences_requested, 'evidences_requested');
  ensureNumber(req.evidences_received, 'evidences_received');
  ensureNumber(req.evidences_pending, 'evidences_pending');
  ensureNumber(req.days_since_request, 'days_since_request');
  if (req.evidences_requested <= 0) throw new ValidationError('evidences_requested >0', 'evidences_requested');

  const completeness_pct = (req.evidences_received / req.evidences_requested) * 100;
  let signal;
  if (completeness_pct >= 95 && req.days_since_request <= 10) signal = 'evidence_complete';
  else if (completeness_pct < 70 && req.days_since_request > 14) signal = 'evidence_lapsed_followup_required';
  else signal = 'in_progress';

  return {
    audit_id: req.audit_id,
    completeness_pct: Math.round(completeness_pct * 10) / 10,
    signals: signal,
    pending: req.evidences_pending,
    citations: CITATIONS,
  };
}

function risk_register(req) {
  ensureStr(req.risk_title, 'risk_title');
  ensureEnum(req.category, 'category', ['operational','clinical','financial','compliance','it','reputational']);
  ensureNumber(req.inherent_likelihood, 'inherent_likelihood');
  ensureNumber(req.inherent_impact, 'inherent_impact');
  ensureNumber(req.control_effectiveness_pct, 'control_effectiveness_pct');
  if (req.inherent_likelihood < 1 || req.inherent_likelihood > 5) throw new ValidationError('likelihood 1..5', 'inherent_likelihood');
  if (req.inherent_impact < 1 || req.inherent_impact > 5) throw new ValidationError('impact 1..5', 'inherent_impact');
  if (req.control_effectiveness_pct < 0 || req.control_effectiveness_pct > 100) throw new ValidationError('control_eff 0..100', 'control_effectiveness_pct');

  const inherent = req.inherent_likelihood * req.inherent_impact;
  const residual = Math.max(1, Math.round(inherent * (1 - req.control_effectiveness_pct / 100)));
  let response;
  if (residual >= 16) response = 'avoid_or_transfer';
  else if (residual >= 9) response = 'mitigate_active_controls';
  else if (residual >= 4) response = 'monitor_accept_with_controls';
  else response = 'accept_low_risk';

  return {
    risk_title: req.risk_title,
    category: req.category,
    inherent_score: inherent,
    residual_score: residual,
    control_effectiveness_pct: req.control_effectiveness_pct,
    response,
    citations: CITATIONS,
  };
}

function funcs() {
  return { audit_finding, followup_status, kri_dashboard, evidence_checklist, risk_register };
}

module.exports = { funcs, CITATIONS, ValidationError };
