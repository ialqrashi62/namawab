// filepath: tier9_gov_ext_101_policy_engine.js
// TIER9_GOV_EXT-101: Policy management & versioning
'use strict';

const CITATIONS = ['ISO_27001_2022','NIST_CSF_2_2024','CBAHI_NATIONAL_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function policy_create(req) {
  ensureStr(req.policy_id, 'policy_id');
  ensureStr(req.title, 'title');
  ensureEnum(req.category, 'category', ['privacy','security','clinical','operational','hr','finance','pharmacy','radiation_safety','infection_control','medication_safety','patient_rights','data_governance']);
  ensureEnum(req.severity, 'severity', ['mandatory_regulatory','mandatory_organizational','recommended','best_practice','deprecated']);
  ensureStr(req.owner_role, 'owner_role');
  ensureStr(req.effective_date, 'effective_date');
  ensureNumber(req.review_cycle_months, 'review_cycle_months');

  let maturity;
  if (req.severity === 'mandatory_regulatory' && req.review_cycle_months > 12) maturity = 'review_cycle_too_long_regulatory_max_12mo';
  else if (req.review_cycle_months < 3) maturity = 'review_cycle_too_frequent';
  else maturity = 'policy_valid';

  return { maturity, category: req.category, severity: req.severity, review_cycle: req.review_cycle_months };
}

function policy_version(req) {
  ensureStr(req.policy_id, 'policy_id');
  ensureStr(req.version_number, 'version_number');
  ensureStr(req.change_summary, 'change_summary');
  ensureBool(req.requires_acknowledgment, 'requires_acknowledgment');
  ensureEnum(req.approval_status, 'approval_status', ['draft','pending_review','approved','retired','archived','rejected']);
  ensureNumber(req.approver_count, 'approver_count');

  let readiness;
  if (req.approval_status === 'approved' && req.approver_count < 1) readiness = 'approved_no_approvers_metadata_error';
  else if (req.approval_status === 'pending_review' && req.approver_count === 0) readiness = 'pending_awaiting_first_reviewer';
  else if (req.requires_acknowledgment && req.approval_status === 'approved') readiness = 'approved_publish_with_ack_requirement';
  else if (req.approval_status === 'rejected') readiness = 'rejected_revise_and_resubmit';
  else readiness = 'standard_workflow';

  return { readiness, version: req.version_number };
}

function policy_acknowledgment(req) {
  ensureStr(req.policy_id, 'policy_id');
  ensureStr(req.user_id, 'user_id');
  ensureStr(req.user_role, 'user_role');
  ensureBool(req.read_full_text, 'read_full_text');
  ensureBool(req.understands, 'understands');
  ensureStr(req.acknowledged_at, 'acknowledged_at');

  let ack_status;
  if (!req.read_full_text) ack_status = 'must_read_full_text_first';
  else if (!req.understands) ack_status = 'must_confirm_understanding';
  else ack_status = 'acknowledged_valid';

  return { ack_status, user_role: req.user_role };
}

function policy_compliance(req) {
  ensureStr(req.policy_id, 'policy_id');
  ensureNumber(req.total_assignees, 'total_assignees');
  ensureNumber(req.acknowledged, 'acknowledged');
  ensureNumber(req.expired_acknowledgments, 'expired_acknowledgments');
  ensureNumber(req.days_since_effective, 'days_since_effective');

  const compliance_rate = req.total_assignees > 0 ? req.acknowledged / req.total_assignees : 0;
  const expired_rate = req.acknowledged > 0 ? req.expired_acknowledgments / req.acknowledged : 0;
  let summary;
  if (req.days_since_effective > 30 && compliance_rate < 0.5) summary = 'low_compliance_priority_outreach';
  else if (expired_rate > 0.3) summary = 'high_expired_re_acknowledgment_campaign';
  else if (compliance_rate >= 0.9) summary = 'high_compliance_acceptable';
  else if (compliance_rate >= 0.7) summary = 'moderate_compliance_monitor';
  else summary = 'low_compliance_action_required';

  return { compliance_pct: Math.round(compliance_rate * 1000) / 10, expired_pct: Math.round(expired_rate * 1000) / 10, summary };
}

function policy_retire(req) {
  ensureStr(req.policy_id, 'policy_id');
  ensureStr(req.retire_date, 'retire_date');
  ensureEnum(req.replacement_policy_id, 'replacement_policy_id', ['none','superseded','rolled_into_existing','sunset_permanent']);
  ensureNumber(req.active_assignees_count, 'active_assignees_count');
  ensureBool(req.archive_required, 'archive_required');

  let retire_status;
  if (req.active_assignees_count > 0 && !req.archive_required) retire_status = 'archive_required_for_active_users';
  else if (req.replacement_policy_id === 'none' && req.active_assignees_count > 0) retire_status = 'must_specify_replacement_or_sunset_permanent';
  else if (req.active_assignees_count === 0 && req.archive_required) retire_status = 'ready_for_archival';
  else retire_status = 'retired_successfully';

  return { retire_status, replacement: req.replacement_policy_id };
}

function funcs() { return { policy_create, policy_version, policy_acknowledgment, policy_compliance, policy_retire }; }
module.exports = { funcs, CITATIONS, ValidationError };