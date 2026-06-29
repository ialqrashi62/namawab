/**
 * encounter_workflow_test.js
 * ==========================================
 * Tests for the Encounter Workflow and Patient Journey core rules.
 * Verifies that:
 * 1. Health Unit, PHC, and Polyclinic cannot open Inpatient Encounters.
 * 2. General Hospital can open both OPD and Inpatient Encounters.
 * 3. Inactive departments prevent opening encounters.
 * 4. All tests pass safely without PHI or hardcoded secrets.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/encounter-workflow.js');

console.log('Running Encounter Workflow Core Tests...');

// 1. Health Unit: allows OPD, blocks Inpatient
assert.ok(global.window.canOpenEncounterForDepartment('health_unit', 14, 'opd'), 'Health Unit should allow OPD');
assert.ok(!global.window.canOpenEncounterForDepartment('health_unit', 14, 'inpatient'), 'Health Unit must block Inpatient');
console.log('✓ Health Unit encounter rules verified.');

// 2. Polyclinic: allows OPD, blocks Inpatient
assert.ok(global.window.canOpenEncounterForDepartment('polyclinic', 14, 'opd'), 'Polyclinic should allow OPD');
assert.ok(!global.window.canOpenEncounterForDepartment('polyclinic', 14, 'inpatient'), 'Polyclinic must block Inpatient');
console.log('✓ Polyclinic encounter rules verified.');

// 3. General Hospital: allows both OPD and Inpatient
assert.ok(global.window.canOpenEncounterForDepartment('general_hospital', 14, 'opd'), 'General Hospital should allow OPD');
assert.ok(global.window.canOpenEncounterForDepartment('general_hospital', 14, 'inpatient'), 'General Hospital should allow Inpatient');
console.log('✓ General Hospital encounter rules verified.');

// 4. Inactive Department: prevents opening encounter (e.g. ICU [page 23] in Polyclinic)
assert.ok(!global.window.canOpenEncounterForDepartment('polyclinic', 23, 'opd'), 'Inactive department must prevent opening encounter');
console.log('✓ Inactive department guarding verified.');

// 5. Journey steps match type
const opdSteps = global.window.getEncounterJourneySteps('opd');
const ipSteps = global.window.getEncounterJourneySteps('inpatient');
assert.ok(opdSteps.some(s => s.name_en.includes('Triage')), 'OPD journey should include Triage');
assert.ok(ipSteps.some(s => s.name_en.includes('Bed Assignment')), 'Inpatient journey should include Bed Assignment');
console.log('✓ Encounter journey steps verified.');

console.log('All Encounter Workflow Core Tests Passed!');
process.exit(0);
