// filepath: tier21_sched_ext_139_template_engine.js
// TIER21_SCHED_EXT-139: Schedule templates, recurrence, rules
'use strict';

const CITATIONS = ['MGMA_TEMPLATE_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function template_create(req) {
  ensureStr(req.template_id, 'template_id');
  ensureStr(req.template_name, 'template_name');
  ensureEnum(req.recurrence, 'recurrence', ['daily','weekly','biweekly','monthly','one_off','seasonal','other']);
  ensureNumber(req.duration_weeks, 'duration_weeks');
  ensureNumber(req.sessions_per_template, 'sessions_count');
  ensureBool(req.clinical_lead_approved, 'clinical_approved');
  ensureBool(req.admin_approved, 'admin_approved');

  let status;
  if (!req.clinical_lead_approved) status = 'clinical_lead_approval_required';
  else if (!req.admin_approved) status = 'admin_approval_required';
  else if (req.duration_weeks > 26) status = 'over_26_weeks_review';
  else status = 'template_created';
  return { status, template: req.template_id };
}

function template_apply(req) {
  ensureStr(req.template_id, 'template_id');
  ensureNumber(req.slots_generated, 'slots_generated');
  ensureNumber(req.slots_conflicts, 'slots_conflicts');
  ensureNumber(req.total_provider_availability, 'provider_availability');
  ensureEnum(req.apply_mode, 'apply_mode', ['additive','replacement','preview_only','other']);
  ensureBool(req.approved_to_publish, 'approved_to_publish');

  let status;
  if (req.apply_mode === 'preview_only') status = 'preview_mode_no_changes';
  else if (req.slots_conflicts > req.slots_generated * 0.1) status = 'over_10pct_conflicts_review';
  else if (!req.approved_to_publish) status = 'publish_approval_required';
  else status = 'template_applied';
  return { status, generated: req.slots_generated };
}

function template_block(req) {
  ensureStr(req.block_id, 'block_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureEnum(req.block_type, 'block_type', ['clinic','admin','teaching','research','procedure','surgery','urgent_care','telehealth','other']);
  ensureNumber(req.duration_min, 'duration_min');
  ensureNumber(req.recurrence_weeks, 'recurrence_weeks');
  ensureBool(req.color_assigned, 'color_assigned');

  let status;
  if (req.duration_min > 240) status = 'over_4h_block_review';
  else if (req.recurrence_weeks === 0) status = 'recurrence_required';
  else status = 'block_documented';
  return { status, type: req.block_type };
}

function template_override(req) {
  ensureStr(req.override_id, 'override_id');
  ensureStr(req.original_block_id, 'original_block_id');
  ensureEnum(req.override_type, 'override_type', ['cancel','reschedule','add_visit','change_location','change_provider','open_block','other']);
  ensureBool(req.advance_notice_24h, 'notice_24h');
  ensureBool(req.notified_patients, 'notified_patients');
  ensureNumber(req.affected_patients_count, 'affected_count');

  let status;
  if (!req.notified_patients && req.affected_patients_count > 0) status = 'patient_notification_required';
  else if (!req.advance_notice_24h) status = 'under_24h_notice_review';
  else status = 'override_applied';
  return { status, count: req.affected_patients_count };
}

function template_metrics(req) {
  ensureStr(req.period, 'period');
  ensureNumber(req.slots_total, 'slots_total');
  ensureNumber(req.slots_filled, 'slots_filled');
  ensureNumber(req.slots_no_show, 'slots_no_show');
  ensureNumber(req.slots_cancelled, 'slots_cancelled');
  ensureNumber(req.target_fill_rate_pct, 'target_pct');

  const fillRate = req.slots_total > 0 ? (req.slots_filled / req.slots_total) * 100 : 0;
  const noShowRate = req.slots_filled > 0 ? (req.slots_no_show / req.slots_filled) * 100 : 0;
  let status;
  if (fillRate < req.target_fill_rate_pct - 20) status = 'under_target_fill_rate_review';
  else if (noShowRate > 12) status = 'over_12pct_no_show_review_reminders';
  else if (fillRate > req.target_fill_rate_pct) status = 'exceeding_target';
  else status = 'template_metrics_appropriate';
  return { status, fill: Math.round(fillRate * 10) / 10 };
}

function funcs() { return { template_create, template_apply, template_block, template_override, template_metrics }; }
module.exports = { funcs, CITATIONS, ValidationError };