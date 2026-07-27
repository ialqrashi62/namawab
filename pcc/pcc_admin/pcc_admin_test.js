// P3-CA pcc_admin unit tests
const Engine = require('./pcc_admin_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_admin engine tests:');
it('Fac', () => {
  const r = Engine.Facility({ type: 'medical_city' });
  assertEq(r.plan, 'full-modules');
});
it('User', () => {
  const r = Engine.User({ role: 'admin' });
  assertEq(r.plan, 'all-permissions');
});
it('Mod', () => {
  const r = Engine.Module({ action: 'enable' });
  assertEq(r.plan, 'enable-module');
});
it('Cfg', () => {
  const r = Engine.Config({ key: 'theme' });
  assertEq(r.plan, 'theme-config');
});
it('Br', () => {
  const r = Engine.Branches({ type: 'branch' });
  assertEq(r.plan, 'branch-ops');
});
it('Res', () => {
  const r = Engine.Resource({ type: 'cpu' });
  assertEq(r.plan, 'monitor-cpu');
});
it('Bkp', () => {
  const r = Engine.Backup({ type: 'full' });
  assertEq(r.plan, 'backup-full');
});
it('Rst', () => {
  const r = Engine.Restore({ backup: 'latest' });
  assertEq(r.plan, 'restore-latest');
});
it('Mig', () => {
  const r = Engine.Migration({ direction: 'up' });
  assertEq(r.plan, 'migrate-up');
});
it('Hth', () => {
  const r = Engine.Health({ check: 'db' });
  assertEq(r.plan, 'check-db');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
