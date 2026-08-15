/**
 * Command Center — Unit Tests
 */

'use strict';

const engine = require('./p0_2_command_center_engine');

let passed = 0, failed = 0;
function assert(cond, msg) { if (cond) { passed++; console.log(`  ✓ ${msg}`); } else { failed++; console.error(`  � FAIL: ${msg}`); } }
function suite(name, fn) { console.log(`\n--- ${name} ---`); try { fn(); } catch (e) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); } }

suite('ED Occupancy', () => {
  const normal = engine.edOccupancy({ current_patients: 30, capacity: 50, ed_waiting: 5, boarding_count: 2 });
  assert(normal.level === 'normal', 'Normal ED');
  const surge = engine.edOccupancy({ current_patients: 55, capacity: 50, ed_waiting: 10, boarding_count: 5 });
  assert(surge.level === 'surge', 'Surge');
  const critical = engine.edOccupancy({ current_patients: 65, capacity: 50, ed_waiting: 35, boarding_count: 8 });
  assert(critical.level === 'critical', 'Critical');
});

suite('Bed Availability', () => {
  const beds = [
    { type: 'ICU', status: 'available' }, { type: 'ICU', status: 'occupied' },
    { type: 'general', status: 'available' }, { type: 'general', status: 'cleaning' },
  ];
  const r = engine.bedAvailability({ beds });
  assert(r.by_type.ICU.available === 1, 'ICU 1 available');
  assert(r.by_type.general.cleaning === 1, 'General 1 cleaning');
});

suite('OR Throughput', () => {
  const normal = engine.orThroughput({ cases_completed: 8, cases_scheduled: 10, room_hours: { used: 50, available: 60 }, delay_minutes: 15, or_rooms: 4 });
  assert(normal.utilization_pct > 80, 'Normal utilization');
  const overloaded = engine.orThroughput({ cases_completed: 8, cases_scheduled: 10, room_hours: { used: 60, available: 60 }, delay_minutes: 90, or_rooms: 4 });
  assert(overloaded.recommendation.includes('overload'), 'Overload detected');
});

suite('MCI Activation', () => {
  const minor = engine.mciActivation({ victims: 5, severity: 'minor', type: 'accident', surge_capacity: 50 });
  assert(minor.mci_level === 0, 'No MCI');
  const moderate = engine.mciActivation({ victims: 30, severity: 'moderate', type: 'accident', surge_capacity: 50 });
  assert(moderate.mci_level === 1, 'MCI Level 1');
  const major = engine.mciActivation({ victims: 150, severity: 'critical', type: 'mass_casualty', surge_capacity: 50 });
  assert(major.mci_level === 3, 'MCI Level 3');
});

suite('Staff Allocation', () => {
  const adequate = engine.staffAllocation({ nurses_on_duty: 20, beds_occupied: 50, doctors_on_duty: 10, icu_beds_occupied: 10 });
  assert(adequate.status === 'adequate', 'Adequate staffing');
  const shortage = engine.staffAllocation({ nurses_on_duty: 5, beds_occupied: 50, doctors_on_duty: 2, icu_beds_occupied: 5 });
  assert(['shortage', 'critical'].includes(shortage.status), 'Shortage detected');
});

suite('Equipment Status', () => {
  const r = engine.equipmentStatus({ devices: [{ type: 'ventilator', status: 'in_use' }, { type: 'ventilator', status: 'available' }, { type: 'ventilator', status: 'broken' }], type: 'ventilator' });
  assert(r.total === 3, '3 devices');
  assert(r.broken === 1, '1 broken');
});

suite('ALOS', () => {
  const normal = engine.alos({ total_days: 100, total_discharges: 25, icu_alos: 3, target_alos: 4 });
  assert(normal.alos === 4, 'ALOS 4 days');
  const over = engine.alos({ total_days: 250, total_discharges: 25, icu_alos: 8, target_alos: 4 });
  assert(['over_target', 'critical'].includes(over.status), 'Over target');
});

suite('Patient Wait Time', () => {
  const normal = engine.patientWaitTime({ wait_minutes: 20, triage_level: 3 });
  assert(normal.status === 'on_target', 'On target');
  const critical = engine.patientWaitTime({ wait_minutes: 120, triage_level: 3 });
  assert(critical.status === 'critical', 'Critical wait');
});

suite('Surge Capacity', () => {
  const r = engine.surgeCapacity({ normal_capacity: 200, surge_capacity_max: 280, current_occupancy: 180 });
  assert(r.available_normal === 20, '20 normal available');
  assert(r.surge_available === 100, '100 surge available');
});

suite('KPI Dashboard', () => {
  const r = engine.kpiDashboard({ ed_occupancy_pct: 70, or_utilization_pct: 80, avg_alos: 4, mortality_rate_pct: 1.5, ed_los_avg: 3.5, patient_satisfaction_pct: 90 });
  assert(r.kpis.ed_occupancy.status === 'green', 'ED green');
  assert(r.kpis.or_utilization.status === 'green', 'OR green');
});

suite('Bottleneck Detection', () => {
  const bottleneck = engine.patientFlowBottleneck({ ed_boarding_time_avg: 300, radiology_wait_avg: 80, discharge_delay_avg: 150, bed_cleaning_time_avg: 100 });
  assert(bottleneck.severity === 'high', 'High severity');
  assert(bottleneck.bottlenecks.length >= 3, '3+ bottlenecks');
});

console.log(`\n=== Total: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
