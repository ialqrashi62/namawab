// P3-CA pcc_audit unit tests
const Engine = require('./pcc_audit_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_audit engine tests:');
it('Log', () => {
  const r = Engine.Log({ severity: 'error' });
  assertEq(r.plan, 'persist-and-alert');
});
it('Com', () => {
  const r = Engine.Compliance({ event: 'export' });
  assertEq(r.plan, 'compliance-export');
});
it('Ret', () => {
  const r = Engine.Retention({ years: 8 });
  assertEq(r.plan, 'retain-7y');
});
it('Hash', () => {
  const r = Engine.Hash({ prev: 'abc', curr: 'abc' });
  assertEq(r.plan, 'chain-valid');
});
it('Src', () => {
  const r = Engine.Search({ query: 'patient' });
  assertEq(r.plan, 'fulltext-search');
});
it('Flt', () => {
  const r = Engine.Filter({ user: 'u1' });
  assertEq(r.plan, 'user-filter');
});
it('Rng', () => {
  const r = Engine.Range({ days: 7 });
  assertEq(r.plan, 'recent-range');
});
it('Exp', () => {
  const r = Engine.Export({ format: 'csv' });
  assertEq(r.plan, 'export-csv');
});
it('Alr', () => {
  const r = Engine.Alert({ level: 'critical' });
  assertEq(r.plan, 'page-on-call');
});
it('Quo', () => {
  const r = Engine.Quota({ used: 1000, limit: 1000 });
  assertEq(r.plan, 'quota-exceeded');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
