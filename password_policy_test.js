/**
 * password_policy_test.js
 * Unit tests for server-side password validation policy.
 */
const { validatePasswordPolicy } = require('./password_policy');
const assert = require('assert');

console.log('=== Running Password Policy Unit Tests ===');

// 1. Weak/short passwords
const r1 = validatePasswordPolicy('weak');
assert.strictEqual(r1.valid, false, 'Should reject short password');
assert.ok(r1.error_ar.includes('12'), 'Error should mention 12 characters');

// 2. Common passwords
const r2 = validatePasswordPolicy('welcome12345678');
assert.strictEqual(r2.valid, false, 'Should reject common password containing welcome');
assert.ok(r2.error_ar.includes('شائعة'), 'Error should mention common');

// 3. Username matching
const r3 = validatePasswordPolicy('ahmed_secure_passphrase_here', { username: 'ahmed' });
assert.strictEqual(r3.valid, false, 'Should reject password containing username');
assert.ok(r3.error_ar.includes('اسم المستخدم'), 'Error should mention username');

// 4. Email matching
const r4 = validatePasswordPolicy('john_secret_secure', { email: 'john@company.com' });
assert.strictEqual(r4.valid, false, 'Should reject password containing email prefix');
assert.ok(r4.error_ar.includes('البريد الإلكتروني'), 'Error should mention email');

// 5. Phone matching
const r5 = validatePasswordPolicy('0598765432_secure_passphrase', { phone: '0598765432' });
assert.strictEqual(r5.valid, false, 'Should reject password containing phone number');
assert.ok(r5.error_ar.includes('الهاتف'), 'Error should mention phone');

// 6. Good passphrase
const r6 = validatePasswordPolicy('SuperSecurePassphrase2026!');
assert.strictEqual(r6.valid, true, 'Should accept strong passphrase');

console.log('✅ All password policy unit tests passed successfully!');
process.exit(0);
