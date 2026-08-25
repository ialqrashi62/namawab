// filepath: tier19_him_ext_129_deficiency_engine.js
// TIER19_HIM_EXT-129: Chart deficiency, incomplete records, delinquency
'use strict';

const CITATIONS = ['AHIMA_2024','CMS_HIM_2024','JOINT_COMMISSION_RECORD_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function deficiency_list(req) {
  ensureStr(req.chart_id, 'chart_id');
  ensureNumber(req.total_deficiencies, 'total_deficiencies');
  ensureNumber(req.critical_count, 'critical_count');
  ensureNumber(req.days_open, 'days_open');
  ensureEnum(req.provider_type, 'provider_type', ['physician','nurse_practitioner','physician_assistant','resident','other']);
  ensureEnum(req.escalation, 'escalation', ['none','second_notice','third_notice','suspended','medical_staff','reprimand','other']);
  ensureBool(req.hold_billing, 'hold_billing');

  let status;
  if (req.critical_count > 0 && req.days_open > 30) status = 'critical_over_30d_immediate_review';
  else if (req.hold_billing && req.total_deficiencies > 5) status = 'billing_held_over_5_deficiencies';
  else if (req.escalation === 'medical_staff') status = 'escalated_to_medical_staff';
  else if (req.days_open > 21) status = 'over_21d_warning_threshold';
  else status = 'deficiency_list_active';
  return { status, total: req.total_deficiencies };
}

function deficiency_type(req) {
  ensureStr(req.deficiency_id, 'deficiency_id');
  ensureEnum(req.deficiency_type, 'deficiency_type', ['history_physical','operative_report','discharge_summary','consultation','progress_note','medication_reconciliation','consent','nursing_assessment','care_plan','pathology_report','radiology_report','authentication','timing_attestation','other']);
  ensureNumber(req.days_overdue, 'days_overdue');
  ensureBool(req.hold_billing, 'hold_billing');
  ensureEnum(req.priority, 'priority', ['low','medium','high','critical','other']);
  ensureBool(req.completion_required, 'completion_required');

  let status;
  if (req.deficiency_type === 'authentication' && req.days_overdue > 14) status = 'authentication_over_14d_blocking';
  else if (req.deficiency_type === 'history_physical' && req.days_overdue > 24) status = 'h_p_over_24h_jcaho_review';
  else if (req.priority === 'critical' && req.days_overdue > 0) status = 'critical_immediate';
  else if (!req.completion_required) status = 'deficiency_cleared_or_dismissed';
  else status = 'deficiency_active';
  return { status, type: req.deficiency_type };
}

function deficiency_assignment(req) {
  ensureStr(req.deficiency_id, 'deficiency_id');
  ensureStr(req.assigned_to, 'assigned_to');
  ensureStr(req.assigned_by, 'assigned_by');
  ensureBool(req.notification_sent, 'notification_sent');
  ensureEnum(req.notification_method, 'notification_method', ['email','sms','phone','portal','inbox','mail','other']);
  ensureNumber(req.days_to_due, 'days_to_due');
  ensureBool(req.reminder_set, 'reminder_set');

  let status;
  if (!req.notification_sent) status = 'notification_required_on_assignment';
  else if (req.notification_method === 'mail' && req.days_to_due < 7) status = 'mail_too_slow_use_email';
  else if (!req.reminder_set) status = 'reminder_recommended_to_due';
  else status = 'assignment_documented';
  return { status, days: req.days_to_due };
}

function deficiency_complete(req) {
  ensureStr(req.deficiency_id, 'deficiency_id');
  ensureEnum(req.completion_method, 'completion_method', ['amended_note','late_entry','attestation','dictation','addendum','other']);
  ensureBool(req.provider_signed, 'provider_signed');
  ensureBool(req.timed_correctly, 'timed_correctly');
  ensureBool(req.attestation_corrected, 'attestation_corrected');
  ensureNumber(req.days_overdue_at_completion, 'days_overdue');

  let status;
  if (!req.provider_signed) status = 'provider_signature_required_for_completion';
  else if (!req.timed_correctly) status = 'entry_timing_correction_required';
  else if (req.completion_method === 'attestation' && !req.attestation_corrected) status = 'attestation_review_required';
  else if (req.days_overdue_at_completion > 30) status = 'completed_after_30d_overdue_review';
  else status = 'deficiency_completed';
  return { status, method: req.completion_method };
}

function deficiency_metrics(req) {
  ensureStr(req.department, 'department');
  ensureNumber(req.open_count, 'open_count');
  ensureNumber(req.completed_30d, 'completed_30d');
  ensureNumber(req.total_charts, 'total_charts');
  ensureNumber(req.avg_days_to_complete, 'avg_days_to_complete');
  ensureNumber(req.critical_open, 'critical_open');

  const delinquency = req.total_charts > 0 ? (req.open_count / req.total_charts) * 100 : 0;
  let status;
  if (req.critical_open > 10) status = 'critical_over_10_immediate_review';
  else if (delinquency > 30) status = 'over_30pct_delinquency_rate';
  else if (req.avg_days_to_complete > 14) status = 'avg_completion_over_14d_review';
  else if (delinquency < 10) status = 'low_delinquency_excellent';
  else status = 'metrics_documented';
  return { status, delinquency_pct: Math.round(delinquency * 10) / 10 };
}

function funcs() { return { deficiency_list, deficiency_type, deficiency_assignment, deficiency_complete, deficiency_metrics }; }
module.exports = { funcs, CITATIONS, ValidationError };