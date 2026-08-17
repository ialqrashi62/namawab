// filepath: tier21_sched_ext_141_appointment_engine.js
// TIER21_SCHED_EXT-141: Appointment booking, conflict, slot mgmt
'use strict';

const CITATIONS = ['MGMA_2024','AAFP_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function appt_book(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureStr(req.provider_id, 'provider_id');
  ensureStr(req.slot_start, 'slot_start');
  ensureNumber(req.duration_min, 'duration_min');
  ensureBool(req.slot_available, 'slot_available');
  ensureBool(req.provider_available, 'provider_available');
  ensureBool(req.patient_available, 'patient_available');
  ensureBool(req.double_book, 'double_book');
  ensureBool(req.overbook_allowed, 'overbook_allowed');

  let status;
  if (!req.slot_available) status = 'slot_unavailable';
  else if (!req.provider_available) status = 'provider_not_available';
  else if (!req.patient_available) status = 'patient_not_available_choose_other';
  else if (req.double_book && !req.overbook_allowed) status = 'double_book_blocked';
  else status = 'appointment_booked';
  return { status, slot: req.slot_start };
}

function appt_conflict(req) {
  ensureStr(req.provider_id, 'provider_id');
  ensureNumber(req.existing_appointments_count, 'existing_count');
  ensureNumber(req.conflicting_count, 'conflicting');
  ensureNumber(req.overlapping_minutes, 'overlapping_min');
  ensureEnum(req.conflict_type, 'conflict_type', ['none','minor_overlap_under_5','major_overlap_5_to_15','full_overlap','back_to_back','room_conflict','other']);
  ensureBool(req.resolved, 'resolved');

  let status;
  if (req.conflict_type === 'none') status = 'no_conflict';
  else if (!req.resolved && req.conflict_type !== 'none') status = 'conflict_unresolved_review';
  else if (req.conflict_type === 'full_overlap') status = 'full_overlap_impossible_resolve';
  else if (req.conflict_type === 'back_to_back') status = 'back_to_back_no_turnaround';
  else status = 'conflict_resolved';
  return { status, conflicts: req.conflicting_count };
}

function appt_reschedule(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureNumber(req.original_lead_days, 'original_lead_days');
  ensureNumber(req.new_lead_days, 'new_lead_days');
  ensureEnum(req.reason, 'reason', ['patient_request','provider_request','clinic_emergency','no_show_reschedule','equipment','staffing','scheduling_conflict','insurance','other']);
  ensureBool(req.new_slot_available, 'new_slot_available');
  ensureBool(req.notice_24h, 'notice_24h');

  let status;
  if (!req.new_slot_available) status = 'new_slot_unavailable';
  else if (!req.notice_24h && req.reason !== 'clinic_emergency') status = 'under_24h_notice_review';
  else if (req.new_lead_days > req.original_lead_days + 14) status = 'over_14d_delay_review';
  else status = 'rescheduled';
  return { status, reason: req.reason };
}

function appt_cancel(req) {
  ensureStr(req.appointment_id, 'appointment_id');
  ensureNumber(req.hours_until_appt, 'hours_until_appt');
  ensureEnum(req.cancelled_by, 'cancelled_by', ['patient','provider','clinic','system','admin','no_show','other']);
  ensureBool(req.late_cancel, 'late_cancel');
  ensureEnum(req.reason, 'reason', ['patient_sick','scheduling_conflict','no_longer_needed','transportation','financial','clinical_change','resolved','provider_unavailable','clinic_emergency','other']);
  ensureBool(req.fee_charged, 'fee_charged');
  ensureNumber(req.cancellation_count_30d, 'cancellation_count_30d');

  let status;
  if (req.cancelled_by === 'no_show') status = 'no_show_recorded';
  else if (req.late_cancel && req.hours_until_appt < 24) status = 'late_cancel_no_show_fee_review';
  else if (req.cancellation_count_30d > 3) status = 'frequent_cancellation_review_pattern';
  else if (req.fee_charged && !req.late_cancel) status = 'fee_charged_unexpected_review';
  else status = 'canceled';
  return { status, by: req.cancelled_by };
}

function appt_slot_optimize(req) {
  ensureStr(req.schedule_id, 'schedule_id');
  ensureNumber(req.total_slots, 'total_slots');
  ensureNumber(req.filled_slots, 'filled_slots');
  ensureNumber(req.no_show, 'no_show');
  ensureNumber(req.cancellations, 'cancellations');
  ensureNumber(req.overbook_slots, 'overbook_slots');
  ensureNumber(req.target_utilization_pct, 'target_utilization_pct');

  const utilization = req.total_slots > 0 ? (req.filled_slots / req.total_slots) * 100 : 0;
  const noShowRate = req.filled_slots > 0 ? (req.no_show / req.filled_slots) * 100 : 0;
  let status;
  if (utilization < req.target_utilization_pct && req.overbook_slots === 0) status = 'low_utilization_add_overbook';
  else if (noShowRate > 15) status = 'over_15pct_no_show_review_reminder';
  else if (utilization > 100) status = 'overbooked_above_capacity_review';
  else status = 'slot_optimization_appropriate';
  return { status, util: Math.round(utilization * 10) / 10 };
}

function funcs() { return { appt_book, appt_conflict, appt_reschedule, appt_cancel, appt_slot_optimize }; }
module.exports = { funcs, CITATIONS, ValidationError };