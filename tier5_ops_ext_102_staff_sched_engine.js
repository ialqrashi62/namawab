// filepath: tier5_ops_ext_102_staff_sched_engine.js
// TIER5_OPS_EXT-102: Staff scheduling (hppd, ratios, overtime, fatigue)
'use strict';

const CITATIONS = [
  'AHA_Nurse_Staffing_2019',
  'WHO_Nurse_Workforce_2020',
  'Joint_Commission_Staffing_2021',
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

function hppd(req) {
  ensureNumber(req.nursing_hours_per_day, 'nursing_hours_per_day');
  ensureNumber(req.patient_days, 'patient_days');
  if (req.patient_days <= 0) throw new ValidationError('patient_days must be >0', 'patient_days');

  const hppd_value = req.nursing_hours_per_day / req.patient_days;
  let rating;
  if (hppd_value >= 8) rating = 'above_target_med_surg';
  else if (hppd_value >= 6) rating = 'adequate';
  else rating = 'below_target_risk_adverse_outcomes';

  return {
    nursing_hours_per_day: req.nursing_hours_per_day,
    patient_days: req.patient_days,
    hppd: Math.round(hppd_value * 100) / 100,
    rating,
    citations: CITATIONS,
  };
}

function nurse_to_patient_ratio(req) {
  ensureNumber(req.nurses_on_duty, 'nurses_on_duty');
  ensureNumber(req.patients_on_unit, 'patients_on_unit');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.unit, 'unit', ['icu','nicu','ob','er','ward_medsurg','ward_rehab','peds','psych']);
  if (req.patients_on_unit <= 0) throw new ValidationError('patients_on_unit must be >0', 'patients_on_unit');

  const ratio = req.nurses_on_duty / req.patients_on_unit;
  const benchmark = { icu: 0.33, nicu: 0.33, ob: 0.2, er: 0.25, ward_medsurg: 0.17, ward_rehab: 0.17, peds: 0.2, psych: 0.17 }[req.unit]; // patients-per-nurse inverse
  const benchmark_ratio = 1 / benchmark;
  const compliant = ratio >= benchmark_ratio;

  return {
    unit: req.unit,
    nurses: req.nurses_on_duty,
    patients: req.patients_on_unit,
    patients_per_nurse: Math.round((1 / ratio) * 100) / 100,
    benchmark_patients_per_nurse: benchmark_ratio,
    compliant,
    citations: CITATIONS,
  };
}

function overtime_fatigue(req) {
  ensureNumber(req.consecutive_hours_worked, 'consecutive_hours_worked');
  ensureNumber(req.weekly_hours, 'weekly_hours');
  ensureNumber(req.shifts_per_week, 'shifts_per_week');
  ensureNumber(req.rest_hours_between_shifts, 'rest_hours_between_shifts');

  const fatigue_flags = [];
  if (req.consecutive_hours_worked > 12) fatigue_flags.push('exceeded_12h_shift_high_error_risk');
  if (req.weekly_hours > 60) fatigue_flags.push('exceeded_60h_week_overtime_threshold');
  if (req.shifts_per_week > 5) fatigue_flags.push('high_shift_count');
  if (req.rest_hours_between_shifts < 8) fatigue_flags.push('insufficient_rest');

  const risk_score = fatigue_flags.length * 25;
  return {
    consecutive_hours_worked: req.consecutive_hours_worked,
    weekly_hours: req.weekly_hours,
    shifts_per_week: req.shifts_per_week,
    rest_hours_between_shifts: req.rest_hours_between_shifts,
    fatigue_flags,
    fatigue_risk_pct: Math.min(100, risk_score),
    recommendation: fatigue_flags.length === 0 ? 'within_safe_staffing_guidelines' : 'rotate_off_allow_24h_rest',
    citations: CITATIONS,
  };
}

function skillmix_assess(req) {
  ensureNumber(req.rn_count, 'rn_count');
  ensureNumber(req.lpn_count, 'lpn_count');
  ensureNumber(req.cna_count, 'cna_count');
  ensureNumber(req.total_patients, 'total_patients');
  ensureStr(req.acuity, 'acuity');
  ensureEnum(req.acuity, 'acuity', ['high','moderate','low']);
  if (req.rn_count + req.lpn_count + req.cna_count <= 0) throw new ValidationError('must have at least one staff', 'rn_count');

  const total = req.rn_count + req.lpn_count + req.cna_count;
  const rn_pct = (req.rn_count / total) * 100;
  const target_rn_pct = { high: 80, moderate: 60, low: 40 }[req.acuity];
  const compliant = rn_pct >= target_rn_pct;
  return {
    acuity: req.acuity,
    rn_pct: Math.round(rn_pct * 10) / 10,
    lpn_pct: Math.round((req.lpn_count / total) * 1000) / 10,
    cna_pct: Math.round((req.cna_count / total) * 1000) / 10,
    target_rn_pct,
    compliant,
    citations: CITATIONS,
  };
}

function shift_assignment(req) {
  ensureNumber(req.staff_hours_per_week, 'staff_hours_per_week');
  ensureNumber(req.shift_length_hours, 'shift_length_hours');
  ensureNumber(req.required_shifts_per_week, 'required_shifts_per_week');
  ensureStr(req.shift_type, 'shift_type');
  ensureEnum(req.shift_type, 'shift_type', ['day','evening','night','rotating']);
  ensureNumber(req.weekend_obligations, 'weekend_obligations');

  const available_shifts_per_week = req.staff_hours_per_week / req.shift_length_hours;
  const feasible = available_shifts_per_week >= req.required_shifts_per_week;
  return {
    staff_hours_per_week: req.staff_hours_per_week,
    shift_length_hours: req.shift_length_hours,
    available_shifts_per_week: Math.round(available_shifts_per_week * 100) / 100,
    required_shifts_per_week: req.required_shifts_per_week,
    weekend_obligations: req.weekend_obligations,
    feasible,
    balance_hours: req.staff_hours_per_week - req.required_shifts_per_week * req.shift_length_hours,
    citations: CITATIONS,
  };
}

function funcs() {
  return { hppd, nurse_to_patient_ratio, overtime_fatigue, skillmix_assess, shift_assignment };
}

module.exports = { funcs, CITATIONS, ValidationError };
