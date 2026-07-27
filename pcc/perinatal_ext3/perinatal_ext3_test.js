// P3-BU perinatal_ext3 unit tests
const Engine = require('./perinatal_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('perinatal_ext3 engine tests:');
it('Anom', () => {
  const r = Engine.Anomaly({ finding: 'cardiac' });
  assertEq(r.plan, 'echo-and-peds-card');
});
it('Trip', () => {
  const r = Engine.Triploidy({ screen: 'high-risk' });
  assertEq(r.plan, 'CVS-and-genetic');
});
it('Twins', () => {
  const r = Engine.Twins({ chorion: 'dichorionic', ttts: 'no' });
  assertEq(r.plan, 'monitor-and-typed');
});
it('Prev', () => {
  const r = Engine.Previa({ distance: 1 });
  assertEq(r.plan, 'C-section-and-typed');
});
it('Accr', () => {
  const r = Engine.Accreta({ risk: 'high' });
  assertEq(r.plan, 'multidisciplinary-and-OR');
});
it('Preterm', () => {
  const r = Engine.Preterm({ gest: 30 });
  assertEq(r.plan, 'steroids-and-mag');
});
it('ROM', () => {
  const r = Engine.ROM({ hours: 18, gest: 32 });
  assertEq(r.plan, 'ABx-and-latency');
});
it('Ind', () => {
  const r = Engine.Induction({ reason: 'urgent' });
  assertEq(r.plan, 'cervidil-and-AROM');
});
it('PD', () => {
  const r = Engine.Postdates({ weeks: 42 });
  assertEq(r.plan, 'induction-and-AROM');
});
it('PP', () => {
  const r = Engine.Postpartum({ day: 1, issue: 'hemorrhage' });
  assertEq(r.plan, 'massive-transfusion');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
