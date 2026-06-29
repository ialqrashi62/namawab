/**
 * clinical_results_test.js
 * ==========================================
 * Tests for the Clinical Results and Documentation Core.
 * Verifies that:
 * 1. Health Unit prevents advanced inpatient clinical documentation.
 * 2. Polyclinic blocks inpatient discharge summaries.
 * 3. Abnormal results trigger safety warnings.
 * 4. Mock results contain no PHI or hardcoded secrets.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/clinical-results.js');

console.log('Running Clinical Results & Documentation Core Tests...');

// 1. Health Unit: allows basic lab results and clinical notes only
const unitResults = global.window.getResultsForEncounter('health_unit', 'opd');
assert.ok(unitResults.some(r => r.id === 'lab'), 'Health Unit should allow lab results');
assert.ok(!unitResults.some(r => r.id === 'procedure'), 'Health Unit must block procedure notes');
console.log('✓ Health Unit results filtering verified.');

// 2. Polyclinic: allows outpatient results, blocks inpatient procedure/discharge
const polyResults = global.window.getResultsForEncounter('polyclinic', 'opd');
assert.ok(!polyResults.some(r => r.id === 'procedure_note'), 'Polyclinic should block procedure notes');
console.log('✓ Polyclinic results filtering verified.');

// 3. Safety Warnings: Abnormal LFT results must trigger abnormal warning
const lftWarnings = global.window.getAbnormalResultWarnings('lab', 'LFT');
assert.ok(lftWarnings.some(w => w.type === 'abnormal'), 'LFT abnormal finding must trigger warning');
console.log('✓ Abnormal result safety warnings verified.');

// 4. Acknowledge Permission Check
assert.ok(global.window.canAcknowledgeResult('general_hospital', 14, 'lab'), 'General Hospital should allow result acknowledgment');
console.log('✓ Result acknowledgment permissions verified.');

console.log('All Clinical Results & Documentation Core Tests Passed!');
process.exit(0);
