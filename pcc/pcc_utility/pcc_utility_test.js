// P3-CA pcc_utility unit tests
const Engine = require('./pcc_utility_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_utility engine tests:');
it('Val', () => {
  const r = Engine.Validate({ type: 'email', value: 'a@b.com' });
  assertEq(r.plan, 'valid');
});
it('Hash', () => {
  const r = Engine.Hash({ algo: 'sha256' });
  assertEq(r.plan, 'hash-sha256');
});
it('Fmt', () => {
  const r = Engine.Format({ type: 'date' });
  assertEq(r.plan, 'YYYY-MM-DD');
});
it('Aud', () => {
  const r = Engine.Audit({ event: 'modify' });
  assertEq(r.plan, 'log-modify');
});
it('Ten', () => {
  const r = Engine.Tenant({ sub: 'enterprise' });
  assertEq(r.plan, 'full-access');
});
it('Rol', () => {
  const r = Engine.Role({ role: 'admin' });
  assertEq(r.plan, 'admin');
});
it('Date', () => {
  const r = Engine.Date({ op: 'now' });
  assertEq(r.plan, 'current-timestamp');
});
it('Pag', () => {
  const r = Engine.Pagination({ page: 1, limit: 20 });
  assertEq(r.plan, 'paginate');
});
it('Err', () => {
  const r = Engine.Error({ code: 404 });
  assertEq(r.plan, 'not-found');
});
it('Cch', () => {
  const r = Engine.Cache({ key: 'my-key' });
  assertEq(r.plan, 'cache-set');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
