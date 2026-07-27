// P3-BU neonatal_ext3 unit tests
const Engine = require('./neonatal_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neonatal_ext3 engine tests:');
it('Apn', () => {
  const r = Engine.Apnea({ type: 'central', preemie: 'no' });
  assertEq(r.plan, 'caffeine-and-monitor');
});
it('Jau', () => {
  const r = Engine.Jaundice({ bili: 12, age: 3 });
  assertEq(r.plan, 'phototherapy-and-monitor');
});
it('Sep', () => {
  const r = Engine.SepsisScreen({ sirs: 3 });
  assertEq(r.plan, 'ABx-and-lactate');
});
it('NEC', () => {
  const r = Engine.NEC({ stage: 'II' });
  assertEq(r.plan, 'NPO-and-ABx');
});
it('BPD', () => {
  const r = Engine.BPD({ severity: 'severe' });
  assertEq(r.plan, 'steroids-and-vent');
});
it('IVH', () => {
  const r = Engine.IVH({ grade: 'III' });
  assertEq(r.plan, 'neurosurg-and-eval');
});
it('ROP', () => {
  const r = Engine.ROP({ stage: 'III', plus: 'yes' });
  assertEq(r.plan, 'laser-and-eval');
});
it('Cool', () => {
  const r = Engine.Cooling({ hours: 5 });
  assertEq(r.plan, 'cooling-and-eval');
});
it('Feed', () => {
  const r = Engine.Feed({ day: 4, route: 'OG' });
  assertEq(r.plan, 'advance-and-eval');
});
it('Dis', () => {
  const r = Engine.Discharge({ weight: 2200, temp: 36.5 });
  assertEq(r.plan, 'discharge-and-FU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
