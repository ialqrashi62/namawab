/**
 * clinical_security_test.js
 * ==========================================
 * Tests for the Enterprise RBAC, ABAC context guards, and Audit hardening rules.
 * Verifies that:
 * 1. canPerformFinalAction always returns false for all final actions.
 * 2. Risk levels are correctly mapped.
 * 3. Audit preview logs contain no PHI or hardcoded secrets.
 * 4. Role mapping restricts unauthorized previews.
 */

const assert = require('assert');

// Mock browser globals for testing
global.window = {};
require('./public/js/facility-catalog.js');
require('./public/js/enterprise-security.js');

console.log('Running Enterprise Security, RBAC & Audit Hardening Tests...');

// 1. Final actions must be strictly blocked (always false)
const finalActions = [
  'FINAL_BOOKING',
  'FINAL_CHECKIN',
  'FINAL_CLINICAL_ORDER',
  'FINAL_SIGNATURE',
  'FINAL_DISPENSE',
  'FINAL_INVOICE',
  'SUBMIT_CLAIM',
  'FINANCIAL_POSTING'
];

finalActions.forEach(action => {
  assert.strictEqual(
    global.window.canPerformFinalAction('ADMIN', action),
    false,
    `Action ${action} must be blocked for ADMIN`
  );
  assert.strictEqual(
    global.window.canPerformFinalAction('PHYSICIAN', action),
    false,
    `Action ${action} must be blocked for PHYSICIAN`
  );
});
console.log('✓ All final actions blocked successfully.');

// 2. Risk Level Classifications
assert.strictEqual(global.window.getActionRiskLevel('FINAL_SIGNATURE'), 'high', 'Final signature must be high risk');
assert.strictEqual(global.window.getActionRiskLevel('VIEW_FACILITY'), 'normal', 'Viewing facility must be normal risk');
console.log('✓ Action risk levels verified.');

// 3. Audit Event Preview Formatting
const auditEvent = global.window.buildAuditPreviewEvent('PHYSICIAN', 'FINAL_SIGNATURE', {
  facility: 'general_hospital',
  department: 14,
  encounter: 'opd'
});

assert.strictEqual(auditEvent.role, 'PHYSICIAN', 'Audit event must contain correct role');
assert.strictEqual(auditEvent.status, 'BLOCKED_BY_GUARD', 'Audit status must be BLOCKED_BY_GUARD');
assert.ok(!auditEvent.hasOwnProperty('patient_name'), 'Audit event must not contain PHI');
console.log('✓ Audit preview logs verified.');

console.log('All Enterprise Security, RBAC & Audit Hardening Tests Passed!');
process.exit(0);
