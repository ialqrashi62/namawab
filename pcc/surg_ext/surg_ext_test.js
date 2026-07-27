// P3-BQ surg_ext unit tests
const Engine = require('./surg_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('surg_ext engine tests:');
it('Preop', () => {
  const r = Engine.PreopRisk({ asa: 4, surgery: 'high' });
  assertEq(r.plan, 'high-risk-and-postop-ICU');
});
it('Wound', () => {
  const r = Engine.Wound({ type: 'clean', day: 1 });
  assertEq(r.plan, 'monitor-dressing');
});
it('SBO', () => {
  const r = Engine.SBO({ acuteness: 'complete', signs: 'no' });
  assertEq(r.plan, 'NG-tube-and-OR');
});
it('Perf', () => {
  const r = Engine.Perforation({ source: 'appendiceal', stable: 'yes' });
  assertEq(r.plan, 'OR-and-appendectomy');
});
it('GB', () => {
  const r = Engine.Cholecystitis({ severity: 'moderate', acalculous: 'no' });
  assertEq(r.plan, 'early-LC-within-72h');
});
it('App', () => {
  const r = Engine.Appendicitis({ type: 'uncomplicated', perforation: 'no' });
  assertEq(r.plan, 'laparoscopic-appendectomy');
});
it('Hernia', () => {
  const r = Engine.Hernia({ type: 'inguinal', incarcerated: 'no' });
  assertEq(r.plan, 'elective-mesh-repair');
});
it('Trauma', () => {
  const r = Engine.TraumaLap({ injury: 'splenic-rupture', stable: 'no' });
  assertEq(r.plan, 'urgent-OR-and-splenectomy');
});
it('Postop', () => {
  const r = Engine.Postop({ day: 1, complication: 'none' });
  assertEq(r.plan, 'ambulation-and-diet');
});
it('Bari', () => {
  const r = Engine.Bariatric({ bmi: 42, comorbidity: 'no' });
  assertEq(r.plan, 'sleeve-or-bypass-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
