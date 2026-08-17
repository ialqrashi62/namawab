// filepath: tier21_sched_ext_142_staff_engine.js
// TIER21_SCHED_EXT-142: Staff scheduling, shift management, coverage
'use strict';

const CITATIONS = ['MGMA_2024','NLRB_2024','JOINT_COMMISSION_STAFFING_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function staff_assign_shift(req) {
  ensureStr(req.staff_id, 'staff_id');
  ensureStr(req.shift_id, 'shift_id');
  ensureEnum(req.shift_type, 'shift_type', ['day','evening','night','weekend_day','weekend_night','on_call','swing','double','prn','other']);
  ensureEnum(req.role, 'role', ['rn','lpn','cna','physician','pa','np','tech','pharmacist','therapist','social_worker','unit_clerk','other']);
  ensureNumber(req.hours_in_shift, 'hours_in_shift');
  ensureBool(req.certifications_current, 'certs_current');
  ensureBool(req.competencies_verified, 'competencies_verified');
  ensureNumber(req.hours_worked_7d, 'hours_worked_7d');

  let status;
  if (!req.certifications_current) status = 'expired_certifications_blocking';
  else if (!req.competencies_verified) status = 'competencies_not_verified';
  else if (req.hours_worked_7d + req.hours_in_shift > 60) status = 'over_60h_in_7d_review_fatigue';
  else if (req.hours_worked_7d + req.hours_in_shift > 40 && req.shift_type === 'double') status = 'double_back_review';
  else status = 'shift_assigned';
  return { status, shift: req.shift_id };
}

function staff_coverage(req) {
  ensureStr(req.unit_id, 'unit_id');
  ensureNumber(req.required_rn, 'required_rn');
  ensureNumber(req.assigned_rn, 'assigned_rn');
  ensureNumber(req.required_total, 'required_total');
  ensureNumber(req.assigned_total, 'assigned_total');
  ensureBool(req.charge_nurse_present, 'charge_present');
  ensureEnum(req.acuity, 'acuity', ['low','medium','high','critical','not_assessed','other']);
  ensureNumber(req.patient_count, 'patient_count');

  let status;
  const ratio = req.assigned_rn > 0 ? req.patient_count / req.assigned_rn : Infinity;
  if (req.assigned_rn < req.required_rn) status = 'rn_understaffed_immediate_review';
  else if (req.assigned_total < req.required_total) status = 'total_understaffed';
  else if (req.acuity === 'critical' && ratio > 2) status = 'critical_acuity_over_1_to_2_review';
  else if (!req.charge_nurse_present) status = 'charge_nurse_required';
  else status = 'coverage_adequate';
  return { status, ratio: Math.round(ratio * 10) / 10 };
}

function staff_request(req) {
  ensureStr(req.request_id, 'request_id');
  ensureStr(req.staff_id, 'staff_id');
  ensureEnum(req.request_type, 'request_type', ['time_off','shift_swap','extra_shift','call_in_sick','schedule_preference','leave_request','other']);
  ensureStr(req.request_date, 'request_date');
  ensureEnum(req.priority, 'priority', ['low','medium','high','urgent','other']);
  ensureBool(req.approved, 'approved');
  ensureBool(req.coverage_considered, 'coverage_considered');

  let status;
  if (!req.coverage_considered) status = 'coverage_must_be_considered_before_approval';
  else if (req.priority === 'urgent' && !req.approved && !req.coverage_considered) status = 'urgent_request_needs_decision';
  else if (req.request_type === 'time_off' && !req.approved && req.priority === 'low') status = 'time_off_pending';
  else status = 'request_documented';
  return { status, type: req.request_type };
}

function staff_overtime(req) {
  ensureStr(req.staff_id, 'staff_id');
  ensureNumber(req.hours_regular, 'hours_regular');
  ensureNumber(req.hours_overtime, 'hours_overtime');
  ensureEnum(req.pay_period, 'pay_period', ['weekly','biweekly','semimonthly','monthly','other']);
  ensureBool(req.union_member, 'union');
  ensureBool(req.pre_approved, 'pre_approved');
  ensureNumber(req.hours_total_7d, 'hours_7d');

  let status;
  if (req.hours_overtime > 20) status = 'over_20h_overtime_review';
  else if (req.hours_7d > 60 && req.union_member) status = 'union_over_60h_review';
  else if (req.hours_overtime > 0 && !req.pre_approved) status = 'overtime_not_pre_approved';
  else status = 'overtime_appropriate';
  return { status, ot: req.hours_overtime };
}

function staff_competency(req) {
  ensureStr(req.staff_id, 'staff_id');
  ensureEnum(req.competency_area, 'competency_area', ['critical_care','er','or','l_and_d','pediatric','oncology','psych','telemetry','med_surg','wound_care','iv_therapy','other']);
  ensureBool(req.orientation_complete, 'orientation');
  ensureBool(req.annual_competency_done, 'annual_done');
  ensureNumber(req.last_competency_date_days, 'last_comp_days');
  ensureBool(req.preceptor_assigned, 'preceptor');
  ensureBool(req.assigned_to_patient_population, 'assigned_population');

  let status;
  if (!req.orientation_complete) status = 'orientation_required_before_assignment';
  else if (!req.annual_competency_done) status = 'annual_competency_required';
  else if (req.last_comp_days > 365) status = 'competency_over_year_old_renew';
  else if (req.assigned_to_patient_population && !req.preceptor_assigned) status = 'preceptor_required_for_new_assignment';
  else status = 'competency_current';
  return { status, area: req.competency_area };
}

function funcs() { return { staff_assign_shift, staff_coverage, staff_request, staff_overtime, staff_competency }; }
module.exports = { funcs, CITATIONS, ValidationError };