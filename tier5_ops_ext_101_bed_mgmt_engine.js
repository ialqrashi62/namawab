// filepath: tier5_ops_ext_101_bed_mgmt_engine.js
// TIER5_OPS_EXT-101: Bed Management (capacity, turnover, ALOS, bed-blocking)
'use strict';

const CITATIONS = [
  'WHO_Hospital_Bed_Management_2018',
  'IHI_Optimizing_Hospital_Beds_2019',
  'NHS_Bed_Management_2021',
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

function turnover_rate(req) {
  ensureNumber(req.discharges, 'discharges');
  ensureNumber(req.beds, 'beds');
  ensureNumber(req.days, 'days');
  if (req.beds <= 0) throw new ValidationError('beds must be >0', 'beds');
  if (req.days <= 0) throw new ValidationError('days must be >0', 'days');

  const turnover = req.discharges / req.beds;
  const interval_days = req.days / Math.max(1, req.discharges);
  const alos = req.days > 0 ? req.days / Math.max(1, req.discharges) : 0;
  return {
    discharges: req.discharges,
    beds: req.beds,
    days: req.days,
    turnover_per_bed: Math.round(turnover * 100) / 100,
    turnover_interval_days: Math.round(interval_days * 100) / 100,
    alos_days: Math.round(alos * 100) / 100,
    benchmark: turnover >= 2.5 ? 'good_throughput' : 'examine_blocking_factors',
    citations: CITATIONS,
  };
}

function bed_blocking(req) {
  ensureNumber(req.beds_total, 'beds_total');
  ensureNumber(req.beds_occupied, 'beds_occupied');
  ensureNumber(req.medically_ready_discharges, 'medically_ready_discharges');
  if (req.beds_total <= 0) throw new ValidationError('beds_total must be >0', 'beds_total');

  const occupancy_pct = (req.beds_occupied / req.beds_total) * 100;
  const blocking_pct = (req.medically_ready_discharges / req.beds_total) * 100;
  let status;
  if (occupancy_pct >= 85 && blocking_pct < 8) status = 'optimal';
  else if (occupancy_pct >= 80 && blocking_pct < 12) status = 'acceptable';
  else if (blocking_pct >= 15) status = 'severe_blocking_discharge_action_required';
  else status = 'watch_occ_and_discharge_pathway';

  return {
    beds_total: req.beds_total,
    beds_occupied: req.beds_occupied,
    occupancy_pct: Math.round(occupancy_pct * 10) / 10,
    ready_to_discharge: req.medically_ready_discharges,
    blocking_pct: Math.round(blocking_pct * 10) / 10,
    status,
    actions: blocking_pct >= 12 ? ['daily_hospital_operations_meeting','expedite_discharges','discharge_lounge','predictive_discharge_planning'] : ['continue_monitoring'],
    citations: CITATIONS,
  };
}

function capacity_plan(req) {
  ensureNumber(req.current_beds, 'current_beds');
  ensureNumber(req.projected_daily_admissions, 'projected_daily_admissions');
  ensureNumber(req.current_alos, 'current_alos');
  ensureNumber(req.target_occupancy_pct, 'target_occupancy_pct');
  ensureNumber(req.target_alos, 'target_alos');
  ensureEnum(req.scenario, 'scenario', ['normal','surge','flu_season','mass_casualty']);
  if (req.target_occupancy_pct <= 0 || req.target_occupancy_pct >= 100) throw new ValidationError('target_occupancy_pct must be 1..99', 'target_occupancy_pct');

  const needed_beds = (req.projected_daily_admissions * req.target_alos) / (req.target_occupancy_pct / 100);
  const surge_multiplier = { normal: 1.0, surge: 1.3, flu_season: 1.2, mass_casualty: 1.5 }[req.scenario];
  const surge_beds = Math.ceil(needed_beds * surge_multiplier);

  return {
    current_beds: req.current_beds,
    scenario: req.scenario,
    needed_beds_normal: Math.ceil(needed_beds),
    needed_beds_scenario: surge_beds,
    bed_gap: Math.ceil(needed_beds - req.current_beds),
    surge_gap: surge_beds - req.current_beds,
    recommendation: surge_beds > req.current_beds ? 'activate_surge_plan_add_icu_overflow_and_staff_pool' : 'capacity_sufficient',
    citations: CITATIONS,
  };
}

function alos_trend(req) {
  ensureNumber(req.monthly_alos, 'monthly_alos');
  ensureNumber(req.monthly_admissions, 'monthly_admissions');
  ensureNumber(req.target_alos, 'target_alos');
  ensureNumber(req.drg_mix_index, 'drg_mix_index'); // case-mix severity 0.5..2.0
  if (req.drg_mix_index <= 0) throw new ValidationError('drg_mix_index must be >0', 'drg_mix_index');

  const observed_to_expected = req.monthly_alos / req.target_alos;
  const adjusted_alos = req.monthly_alos / req.drg_mix_index;
  let signal;
  if (observed_to_expected > 1.2) signal = 'over_target_investigate_discharge_process';
  else if (observed_to_expected < 0.85) signal = 'early_discharge_caution_readmission_risk';
  else signal = 'within_target';

  return {
    monthly_alos: req.monthly_alos,
    target_alos: req.target_alos,
    drg_mix_index: req.drg_mix_index,
    adjusted_alos: Math.round(adjusted_alos * 100) / 100,
    observed_to_expected: Math.round(observed_to_expected * 100) / 100,
    signal,
    citations: CITATIONS,
  };
}

function prioritize_admissions(req) {
  ensureStr(req.acuity, 'acuity');
  ensureEnum(req.acuity, 'acuity', ['critical','high','moderate','low']);
  ensureNumber(req.waiting_hours, 'waiting_hours');
  ensureStr(req.unit, 'unit');
  ensureEnum(req.unit, 'unit', ['icu','ccu','nicu','er_inpatient','ward','isolation']);
  ensureBool(req.contact_precautions, 'contact_precautions');

  const acuity_score = { critical: 100, high: 70, moderate: 40, low: 15 }[req.acuity];
  const waiting_score = Math.min(30, req.waiting_hours * 1.5);
  const iso_score = req.contact_precautions ? 10 : 0;
  const total = acuity_score + waiting_score + iso_score;

  return {
    patient_id: req.patient_id,
    acuity: req.acuity,
    unit: req.unit,
    total_priority_score: Math.round(total),
    recommended_destination: req.acuity === 'critical' || req.unit === 'icu' || req.unit === 'ccu' || req.unit === 'nicu' ? 'critical_care_unit' : 'assigned_unit_or_overflow',
    isolation_required: req.contact_precautions,
    citations: CITATIONS,
  };
}

function funcs() {
  return { turnover_rate, bed_blocking, capacity_plan, alos_trend, prioritize_admissions };
}

module.exports = { funcs, CITATIONS, ValidationError };
