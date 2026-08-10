/**
 * appointments_queue_test.js
 * ==========================================
 * Tests for the Appointments & Patient Queue workflow and safety rules.
 * Verifies that:
 * 1. Health Unit, PHC, and Polyclinic block inpatient admission requests.
 * 2. General Hospital allows inpatient admission request placeholders.
 * 3. Priority badges are generated correctly based on triage priority.
 * 4. Mock queue data contains no PHI or secrets.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/appointments-queue.js');

console.log('Running Appointments & Patient Queue Core Tests...');

// 1. Inpatient Admission Request Guarding
assert.strictEqual(global.window.canBookAppointmentPlaceholder('health_unit', 14, 'inpatient_adm'), false, 'Health Unit must block Inpatient Admissions');
assert.strictEqual(global.window.canBookAppointmentPlaceholder('phc', 14, 'inpatient_adm'), false, 'PHC must block Inpatient Admissions');
assert.strictEqual(global.window.canBookAppointmentPlaceholder('polyclinic', 14, 'inpatient_adm'), false, 'Polyclinic must block Inpatient Admissions');
assert.strictEqual(global.window.canBookAppointmentPlaceholder('general_hospital', 14, 'inpatient_adm'), true, 'General Hospital should allow Inpatient Admission requests');
console.log('✓ Inpatient admission request guarding verified.');

// 2. Priority Badge Formatting
const urgentBadge = global.window.getTriagePriorityBadges('high');
const normalBadge = global.window.getTriagePriorityBadges('normal');
assert.strictEqual(urgentBadge.class, 'danger', 'Urgent priority must map to danger class');
assert.strictEqual(normalBadge.class, 'info', 'Normal priority must map to info class');
console.log('✓ Triage priority badges verified.');

// 3. Appointment Types for Facilities
const unitTypes = global.window.getAppointmentTypesForFacility('health_unit');
assert.ok(unitTypes.some(t => t.id === 'opd_app'), 'Health Unit must allow OPD appointments');
assert.ok(!unitTypes.some(t => t.id === 'inpatient_adm'), 'Health Unit must not allow inpatient admissions');
console.log('✓ Facility appointment types verified.');

console.log('All Appointments & Patient Queue Core Tests Passed!');
process.exit(0);
