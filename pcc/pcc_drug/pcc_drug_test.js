// P3-CC pcc_drug unit tests
const Engine = require('./pcc_drug_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_drug engine tests:');
it('Dose', () => {
  const r = Engine.Dose({ wt: 40, dose: 600 });
  assertEq(r.plan, 'reduce-dose');
});
it('Int', () => {
  const r = Engine.Interaction({ sev: 'major' });
  assertEq(r.plan, 'avoid-combo');
});
it('All', () => {
  const r = Engine.Allergy({ severity: 'severe' });
  assertEq(r.plan, 'contraindicated');
});
it('Ren', () => {
  const r = Engine.Renal({ gfr: 25 });
  assertEq(r.plan, 'reduce-dose-or-avoid');
});
it('Hep', () => {
  const r = Engine.Hepatic({ child: 'C' });
  assertEq(r.plan, 'avoid-or-adjust');
});
it('Lvl', () => {
  const r = Engine.Level({ peak: 25 });
  assertEq(r.plan, 'toxic-level');
});
it('Preg', () => {
  const r = Engine.Pregnancy({ cat: 'X' });
  assertEq(r.plan, 'contraindicated');
});
it('Rte', () => {
  const r = Engine.Route({ route: 'IV' });
  assertEq(r.plan, 'iv-administration');
});
it('Freq', () => {
  const r = Engine.Frequency({ freq: 'q8h' });
  assertEq(r.plan, 'q8h');
});
it('Dur', () => {
  const r = Engine.Duration({ days: 60 });
  assertEq(r.plan, 'long-course');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
