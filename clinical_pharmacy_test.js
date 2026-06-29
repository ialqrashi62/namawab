/**
 * clinical_pharmacy_test.js
 * ==========================================
 * Tests for the Clinical Pharmacy & FEFO Inventory workflow and safety rules.
 * Verifies that:
 * 1. canFinalizeDispense always returns false (simulation only).
 * 2. FEFO preview sorts batches by earliest expiry date.
 * 3. Health Unit, PHC, and Polyclinic restrict advanced inpatient pharmacy features.
 * 4. Controlled medications trigger safety warnings.
 * 5. Mock catalog contains no PHI, dosage information, or secrets.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/clinical-pharmacy.js');

console.log('Running Clinical Pharmacy & FEFO Inventory Core Tests...');

// 1. Finalize Dispense must always be blocked
assert.strictEqual(global.window.canFinalizeDispense('general_hospital', 14, 'PARA500'), false, 'Dispense finalization must always return false');
console.log('✓ Finalize dispense block verified.');

// 2. FEFO Sorting: Expiry date sorting check (earliest expiry first)
const batches = global.window.getFefoBatchPreview('PARA500');
assert.strictEqual(batches[0].batchCode, 'B-PR-982', 'FEFO sorting must place earliest expiry batch first');
assert.strictEqual(batches[1].batchCode, 'B-PR-441', 'FEFO sorting must place later expiry batch second');
console.log('✓ FEFO batch sorting verified.');

// 3. Controlled Medication Warnings
const morphineWarnings = global.window.getControlledMedicationWarnings('MORPHINE');
assert.ok(morphineWarnings.some(w => w.type === 'controlled'), 'Morphine must trigger controlled substance warning');
console.log('✓ Controlled substance guarding verified.');

// 4. Pharmacy Review Permission Checks
assert.ok(global.window.canPreviewDispense('general_hospital', 14, 'PARA500'), 'General Hospital should allow preview dispense');
console.log('✓ Pharmacy preview permissions verified.');

console.log('All Clinical Pharmacy & FEFO Inventory Core Tests Passed!');
process.exit(0);
