/**
 * Command Center — Engine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

const CITATIONS = {
  MOH_OPS_2024: 'MoH Saudi Hospital Operations 2024',
  CBAHI_OPS: 'CBAHI Operational Standards 2024',
  ED_CROW: 'ED Crowding Index 2024',
};

/**
 * ED Occupancy Status
 */
function edOccupancy(input) {
  const { current_patients, capacity, ed_waiting, boarding_count } = input;
  const occupancy_pct = (current_patients / capacity) * 100;
  let level = 'normal';
  if (occupancy_pct > 80) level = 'busy';
  if (occupancy_pct > 100) level = 'surge';
  if (occupancy_pct > 120 || ed_waiting > 30) level = 'critical';
  return {
    occupancy_pct: Math.round(occupancy_pct * 10) / 10,
    level,
    boarding_count,
    recommendation: level === 'critical' ? 'Activate surge protocol' : level === 'surge' ? 'Open overflow' : 'Normal operations',
    citation: CITATIONS.ED_CROW,
  };
}

/**
 * Bed Availability Lookup
 */
function bedAvailability(input) {
  const { beds } = input;
  const by_type = {};
  for (const bed of beds) {
    if (!by_type[bed.type]) by_type[bed.type] = { total: 0, available: 0, occupied: 0, cleaning: 0 };
    by_type[bed.type].total++;
    if (bed.status === 'available') by_type[bed.type].available++;
    else if (bed.status === 'occupied') by_type[bed.type].occupied++;
    else if (bed.status === 'cleaning') by_type[bed.type].cleaning++;
  }
  return { by_type, total_available: Object.values(by_type).reduce((s, t) => s + t.available, 0), citation: CITATIONS.MOH_OPS_2024 };
}

/**
 * OR Throughput
 */
function orThroughput(input) {
  const { cases_completed, cases_scheduled, room_hours, delay_minutes, or_rooms } = input;
  const utilization_pct = (room_hours.used / room_hours.available) * 100;
  return {
    utilization_pct: Math.round(utilization_pct * 10) / 10,
    cases_completed,
    cases_scheduled,
    delay_minutes,
    or_rooms,
    recommendation: utilization_pct < 70 ? 'Consider scheduling more cases' : utilization_pct > 95 ? 'OR overload — risk for delays' : 'Normal utilization',
    citation: CITATIONS.MOH_OPS_2024,
  };
}

/**
 * Patient Flow Bottleneck
 */
function patientFlowBottleneck(input) {
  const { ed_boarding_time_avg, radiology_wait_avg, discharge_delay_avg, bed_cleaning_time_avg } = input;
  const bottlenecks = [];
  if (ed_boarding_time_avg > 240) bottlenecks.push('ED boarding > 4 hours');
  if (radiology_wait_avg > 60) bottlenecks.push('Radiology wait > 1 hour');
  if (discharge_delay_avg > 120) bottlenecks.push('Discharge delay > 2 hours');
  if (bed_cleaning_time_avg > 90) bottlenecks.push('Bed cleaning > 1.5 hours');
  return {
    bottlenecks,
    severity: bottlenecks.length >= 3 ? 'high' : bottlenecks.length >= 1 ? 'moderate' : 'low',
    recommendation: bottlenecks.length > 0 ? 'Implement discharge lounge + parallel cleaning' : 'Maintain current flow',
    citation: CITATIONS.CBAHI_OPS,
  };
}

/**
 * Mass Casualty Incident (MCI) Protocol
 */
function mciActivation(input) {
  const { victims, severity, type, surge_capacity } = input;
  let mci_level = 0;
  if (victims > 100 || severity === 'critical') mci_level = 3;
  else if (victims > 50) mci_level = 2;
  else if (victims > 20) mci_level = 1;
  const surge_needed = victims > surge_capacity;
  return {
    mci_level,
    mci_activated: mci_level > 0,
    surge_needed,
    actions: mci_level > 0 ? ['Activate MCI plan', 'Call off-duty staff', 'Open triage area', 'Notify blood bank', 'Prepare OR'] : [],
    citation: CITATIONS.MOH_OPS_2024,
  };
}

/**
 * Staff Allocation
 */
function staffAllocation(input) {
  const { nurses_on_duty, beds_occupied, doctors_on_duty, icu_beds_occupied } = input;
  const nurse_ratio = nurses_on_duty / beds_occupied;
  const icu_nurse_ratio = nurses_on_duty / Math.max(icu_beds_occupied, 1);
  let status = 'adequate';
  if (nurse_ratio < 0.25) status = 'shortage';
  if (icu_nurse_ratio < 0.5) status = 'critical';
  return {
    nurse_patient_ratio: Math.round(nurse_ratio * 100) / 100,
    icu_nurse_patient_ratio: Math.round(icu_nurse_ratio * 100) / 100,
    status,
    recommendation: status === 'critical' ? 'Call reinforcement nurses + delay admissions' : status === 'shortage' ? 'Recall off-duty nurses' : 'Adequate',
    citation: CITATIONS.CBAHI_OPS,
  };
}

/**
 * Equipment Status Check
 */
function equipmentStatus(input) {
  const { devices, type } = input;
  const matching = devices.filter(d => d.type === type);
  const total = matching.length;
  const in_use = matching.filter(d => d.status === 'in_use').length;
  const available = matching.filter(d => d.status === 'available').length;
  const maintenance = matching.filter(d => d.status === 'maintenance').length;
  const broken = matching.filter(d => d.status === 'broken').length;
  return {
    type,
    total,
    in_use,
    available,
    maintenance,
    broken,
    utilization_pct: total > 0 ? Math.round((in_use / total) * 100 * 10) / 10 : 0,
    needs_maintenance: maintenance > 2 || broken > 0,
    citation: CITATIONS.MOH_OPS_2024,
  };
}

/**
 * ALOS (Average Length of Stay)
 */
function alos(input) {
  const { total_days, total_discharges, icu_alos, target_alos } = input;
  const alos_value = total_discharges > 0 ? Math.round((total_days / total_discharges) * 10) / 10 : 0;
  const icu_value = icu_alos || 0;
  let status = 'on_target';
  if (alos_value > target_alos * 1.2) status = 'over_target';
  if (alos_value > target_alos * 1.5) status = 'critical';
  return {
    alos: alos_value,
    target_alos,
    icu_alos: icu_value,
    status,
    recommendation: status === 'critical' ? 'Discharge lounge + case management' : 'Monitor',
    citation: CITATIONS.CBAHI_OPS,
  };
}

/**
 * Patient Wait Time
 */
function patientWaitTime(input) {
  const { wait_minutes, triage_level, target_minutes } = input;
  const targets = { 1: 0, 2: 10, 3: 30, 4: 60, 5: 120 };
  const target = target_minutes || targets[triage_level] || 60;
  let status = 'on_target';
  if (wait_minutes > target * 1.5) status = 'delayed';
  if (wait_minutes > target * 2) status = 'critical';
  return {
    wait_minutes,
    target_minutes: target,
    triage_level,
    status,
    recommendation: status === 'critical' ? 'Immediate medical screening' : 'Continue triage monitoring',
    citation: CITATIONS.ED_CROW,
  };
}

/**
 * Surge Capacity Estimator
 */
function surgeCapacity(input) {
  const { normal_capacity, surge_capacity_max, current_occupancy } = input;
  const available_normal = normal_capacity - current_occupancy;
  const surge_available = surge_capacity_max - current_occupancy;
  return {
    normal_capacity,
    current_occupancy,
    available_normal,
    surge_capacity_max,
    surge_available,
    surge_pct_used: Math.round((current_occupancy / surge_capacity_max) * 100 * 10) / 10,
    citation: CITATIONS.MOH_OPS_2024,
  };
}

/**
 * Daily Operations Summary
 */
function dailyOpsSummary(input) {
  const { admissions, discharges, deaths, surgeries, ed_visits, avg_los } = input;
  const net_census_change = admissions - discharges;
  return {
    admissions, discharges, deaths, surgeries, ed_visits,
    avg_los,
    net_census_change,
    citation: CITATIONS.MOH_OPS_2024,
  };
}

/**
 * KPI Dashboard
 */
function kpiDashboard(input) {
  const { ed_occupancy_pct, or_utilization_pct, avg_alos, mortality_rate_pct, ed_los_avg, patient_satisfaction_pct } = input;
  const kpis = {
    'ed_occupancy': { value: ed_occupancy_pct, target: '<80%', status: ed_occupancy_pct < 80 ? 'green' : ed_occupancy_pct < 100 ? 'yellow' : 'red' },
    'or_utilization': { value: or_utilization_pct, target: '70-85%', status: or_utilization_pct >= 70 && or_utilization_pct <= 85 ? 'green' : 'yellow' },
    'alos': { value: avg_alos, target: '<5 days', status: avg_alos < 5 ? 'green' : 'yellow' },
    'mortality': { value: mortality_rate_pct, target: '<2%', status: mortality_rate_pct < 2 ? 'green' : 'red' },
    'ed_los': { value: ed_los_avg, target: '<4 hours', status: ed_los_avg < 4 ? 'green' : 'yellow' },
    'patient_satisfaction': { value: patient_satisfaction_pct, target: '>85%', status: patient_satisfaction_pct > 85 ? 'green' : 'yellow' },
  };
  return { kpis, citation: CITATIONS.CBAHI_OPS };
}

module.exports = {
  edOccupancy, bedAvailability, orThroughput, patientFlowBottleneck,
  mciActivation, staffAllocation, equipmentStatus, alos,
  patientWaitTime, surgeCapacity, dailyOpsSummary, kpiDashboard,
  CITATIONS, ValidationError,
};
