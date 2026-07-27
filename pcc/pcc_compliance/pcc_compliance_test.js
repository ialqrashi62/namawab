// P3-CB pcc_compliance unit tests
const Engine = require('./pcc_compliance_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_compliance engine tests:');
it('HIPAA', () => {
  const r = Engine.HIPAA({ action: 'export' });
  assertEq(r.plan, 'hipaa-export');
});
it('NPH', () => {
  const r = Engine.NPHIES({ type: 'claim' });
  assertEq(r.plan, 'nphies-claim');
});
it('ZAT', () => {
  const r = Engine.ZATCA({ type: 'invoice' });
  assertEq(r.plan, 'zatca-invoice');
});
it('PDPL', () => {
  const r = Engine.PDPL({ consent: 'yes' });
  assertEq(r.plan, 'pdpl-consented');
});
it('CBAHI', () => {
  const r = Engine.CBAHI({ standard: 'critical' });
  assertEq(r.plan, 'cbahi-critical');
});
it('Aud', () => {
  const r = Engine.Audit({ event: 'export' });
  assertEq(r.plan, 'audit-export');
});
it('Con', () => {
  const r = Engine.Consent({ type: 'research' });
  assertEq(r.plan, 'consent-research');
});
it('Breach', () => {
  const r = Engine.Breach({ severity: 'high' });
  assertEq(r.plan, 'breach-immediate-report');
});
it('Acc', () => {
  const r = Engine.Access({ role: 'admin' });
  assertEq(r.plan, 'access-admin');
});
it('Ret', () => {
  const r = Engine.Retention({ years: 10 });
  assertEq(r.plan, 'retain-10y');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
