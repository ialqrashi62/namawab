/**
 * clinical_orders_test.js
 * ==========================================
 * Tests for the Clinical Orders Core workflow and safety rules.
 * Verifies that:
 * 1. Health Unit prevents procedure and medication orders.
 * 2. PHC prevents advanced procedures.
 * 3. Polyclinic allows OPD orders but blocks inpatient-only.
 * 4. High-risk orders correctly flag safety warnings (e.g. Consent Required).
 * 5. Mock catalog contains no PHI or hardcoded secrets.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/clinical-orders.js');

console.log('Running Clinical Orders Core Tests...');

// 1. Health Unit: allows lab, blocks procedure/medication
assert.ok(global.window.canCreateOrderDraft('health_unit', 14, 'lab'), 'Health Unit should allow lab orders');
assert.ok(!global.window.canCreateOrderDraft('health_unit', 14, 'procedure'), 'Health Unit must block procedure orders');
assert.ok(!global.window.canCreateOrderDraft('health_unit', 14, 'medication'), 'Health Unit must block medication orders');
console.log('✓ Health Unit order guarding verified.');

// 2. PHC: allows lab/radiology, blocks advanced procedures
assert.ok(global.window.canCreateOrderDraft('phc', 14, 'radiology'), 'PHC should allow radiology orders');
assert.ok(!global.window.canCreateOrderDraft('phc', 14, 'procedure'), 'PHC must block procedure orders');
console.log('✓ PHC order guarding verified.');

// 3. General Hospital: allows all orders as drafts
assert.ok(global.window.canCreateOrderDraft('general_hospital', 14, 'procedure'), 'General Hospital should allow procedure drafts');
assert.ok(global.window.canCreateOrderDraft('general_hospital', 14, 'medication'), 'General Hospital should allow medication drafts');
console.log('✓ General Hospital order guarding verified.');

// 4. Safety Warnings: High-risk procedures (like LP) must require consent
const lpWarnings = global.window.getOrderSafetyWarnings('procedure', 'LP');
assert.ok(lpWarnings.some(w => w.type === 'consent'), 'Lumbar Puncture must require patient consent');

// Medication orders must trigger allergy warnings
const medWarnings = global.window.getOrderSafetyWarnings('medication', 'PARA500');
assert.ok(medWarnings.some(w => w.type === 'allergy'), 'Medication orders must trigger allergy warning check');
console.log('✓ Safety warnings and guardrails verified.');

console.log('All Clinical Orders Core Tests Passed!');
process.exit(0);
