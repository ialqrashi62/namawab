// filepath: tier16_or_ext_115_scheduling_engine.js
// TIER16_OR_EXT-115: OR scheduling, utilization, block time, turnover
'use strict';

const CITATIONS = ['AORN_2024','OR_Manager_2023'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function or_block_assignment(req) {
  ensureStr(req.surgeon_id, 'surgeon_id');
  ensureEnum(req.block_type, 'block_type', ['primary_surgeon','shared','open','urgent_add_on','emergent','elective_release','other']);
  ensureNumber(req.block_minutes, 'block_minutes');
  ensureNumber(req.block_utilization_pct, 'block_utilization_pct');
  ensureNumber(req.booked_minutes, 'booked_minutes');
  ensureNumber(req.released_minutes_to_pool, 'released_minutes_to_pool');

  let status;
  if (req.block_type === 'emergent') status = 'emergent_open_or_priority';
  else if (req.block_utilization_pct < 60) status = 'underutilized_60pct_review_release';
  else if (req.block_utilization_pct > 90 && req.released_minutes_to_pool === 0) status = 'overbooked_90pct_review_overflow';
  else status = 'block_appropriate';
  return { status, type: req.block_type };
}

function or_turnover(req) {
  ensureStr(req.room_id, 'room_id');
  ensureNumber(req.turnover_minutes, 'turnover_minutes');
  ensureNumber(req.target_turnover_minutes, 'target_turnover_minutes');
  ensureNumber(req.cleaning_minutes, 'cleaning_minutes');
  ensureNumber(req.setup_minutes, 'setup_minutes');
  ensureBool(req.delayed, 'delayed');
  ensureEnum(req.delay_reason, 'delay_reason', ['none','equipment','staffing','patient_late','surgeon_late','previous_case_overrun','anesthesia_delay','cleaning','other']);

  let status;
  if (req.turnover_minutes > req.target_turnover_minutes + 20) status = 'over_20min_over_target';
  else if (req.delayed && req.delay_reason === 'previous_case_overrun') status = 'previous_case_overrun_review';
  else if (req.delayed) status = 'turnover_delayed_review';
  else status = 'turnover_appropriate';
  return { status, mins: req.turnover_minutes };
}

function or_case_scheduling(req) {
  ensureStr(req.case_id, 'case_id');
  ensureEnum(req.priority, 'priority', ['emergent_add_on','urgent_add_on','elective_scheduled','elective_rescheduled','canceled','no_show','other']);
  ensureNumber(req.scheduled_minutes, 'scheduled_minutes');
  ensureNumber(req.actual_minutes, 'actual_minutes');
  ensureBool(req.first_case_of_day, 'first_case_of_day');
  ensureBool(req.high_risk, 'high_risk');
  ensureEnum(req.location, 'location', ['or_1','or_2','or_3','or_4','or_5','or_hybrid','gi_suite','cath_lab','endo','procedure_room','other']);

  let status;
  if (req.priority === 'emergent_add_on' && !req.first_case_of_day) status = 'emergent_add_on_delay_review';
  else if (req.high_risk && !req.first_case_of_day) status = 'high_risk_first_case_or_late';
  else if (req.actual_minutes > req.scheduled_minutes * 1.5) status = 'overrun_50pct_review_bumping';
  else if (req.priority === 'canceled' || req.priority === 'no_show') status = 'canceled_or_no_show_review';
  else status = 'scheduled_appropriate';
  return { status, priority: req.priority };
}

function or_staffing(req) {
  ensureStr(req.room_id, 'room_id');
  ensureNumber(req.circulator_count, 'circulator_count');
  ensureNumber(req.scrub_count, 'scrub_count');
  ensureNumber(req.required_circulator, 'required_circulator');
  ensureNumber(req.required_scrub, 'required_scrub');
  ensureBool(req.anesthesia_provider_present, 'anesthesia_provider');
  ensureEnum(req.shift, 'shift', ['day','evening','night','weekend_day','on_call','other']);
  ensureNumber(req.team_breaks_covered, 'breaks_covered');

  let status;
  if (req.circulator_count < req.required_circulator) status = 'circulator_required_aorn';
  else if (req.scrub_count < req.required_scrub) status = 'scrub_required_aorn';
  else if (!req.anesthesia_provider_present) status = 'anesthesia_provider_required';
  else if (req.breaks_covered < 2) status = 'breaks_not_covered_review';
  else status = 'staffing_appropriate';
  return { status, room: req.room_id };
}

function or_utilization(req) {
  ensureStr(req.room_id, 'room_id');
  ensureNumber(req.total_block_minutes, 'total_block_minutes');
  ensureNumber(req.used_minutes, 'used_minutes');
  ensureNumber(req.cases_count, 'cases_count');
  ensureNumber(req.cancellations, 'cancellations');
  ensureNumber(req.add_on_cases, 'add_on_cases');
  ensureNumber(req.target_utilization_pct, 'target_utilization_pct');

  const utilization = req.total_block_minutes > 0 ? req.used_minutes / req.total_block_minutes * 100 : 0;
  let status;
  if (utilization >= req.target_utilization_pct) status = 'meeting_target_utilization';
  else if (utilization >= req.target_utilization_pct - 10) status = 'slightly_below_target';
  else if (utilization < req.target_utilization_pct - 20) status = 'significantly_below_target_review';
  else status = 'utilization_review';
  return { status, utilization: Math.round(utilization * 10) / 10 };
}

function funcs() { return { or_block_assignment, or_turnover, or_case_scheduling, or_staffing, or_utilization }; }
module.exports = { funcs, CITATIONS, ValidationError };