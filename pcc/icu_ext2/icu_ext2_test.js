// P3-BT icu_ext2 unit tests
const Engine = require('./icu_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('icu_ext2 engine tests:');
it('Vent', () => {
  const r = Engine.Ventilator({ mode: 'AC', peep: 5, fio2: 0.3 });
  assertEq(r.plan, 'PS-trial-and-eval');
});
it('Sed', () => {
  const r = Engine.Sedation({ rass: 2 });
  assertEq(r.plan, 'titrate-down-and-pain');
});
it('Shock', () => {
  const r = Engine.Shock({ type: 'septic' });
  assertEq(r.plan, 'norepi-and-ABx');
});
it('DVT', () => {
  const r = Engine.DVT({ prophylaxis: 'none' });
  assertEq(r.plan, 'start-heparin-and-eval');
});
it('Gluc', () => {
  const r = Engine.Glucose({ g: 200 });
  assertEq(r.plan, 'insulin-bolus-and-protocol');
});
it('Lyte', () => {
  const r = Engine.Electrolyte({ k: 7, na: 140 });
  assertEq(r.plan, 'insulin-and-calcium');
});
it('Trans', () => {
  const r = Engine.Transfusion({ hgb: 6 });
  assertEq(r.plan, 'PRBC-1U-and-eval');
});
it('CRRT', () => {
  const r = Engine.CRRT({ k: 7, ph: 7.4 });
  assertEq(r.plan, 'init-CRRT-and-eval');
});
it('ICP', () => {
  const r = Engine.ICP({ icp: 22 });
  assertEq(r.plan, 'osmotic-and-positioning');
});
it('Nutr', () => {
  const r = Engine.Nutrition({ day: 3, route: 'NGT' });
  assertEq(r.plan, 'advance-rate-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
