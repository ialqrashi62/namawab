// P3-BR anesthesia2 unit tests
const Engine = require('./anesthesia2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('anesthesia2 engine tests:');
it('ASA', () => {
  const r = Engine.ASAClass({ asa: 4, surgery: 'high' });
  assertEq(r.plan, 'postop-ICU-and-inv-monitoring');
});
it('Airway', () => {
  const r = Engine.Airway({ mallampati: 3, distance: 7 });
  assertEq(r.plan, 'videolaryngoscopy');
});
it('Regional', () => {
  const r = Engine.Regional({ type: 'spinal', coagulopathy: 'no', duration: 'short' });
  assertEq(r.plan, 'spinal-and-OR');
});
it('General', () => {
  const r = Engine.General({ duration: 5, airway: 'normal' });
  assertEq(r.plan, 'GETA-and-arterial-line');
});
it('Monitoring', () => {
  const r = Engine.Monitoring({ asa: 2, surgery: 'major' });
  assertEq(r.plan, 'arterial-line-and-Foley');
});
it('Pain', () => {
  const r = Engine.Pain({ type: 'postop', severity: 'severe' });
  assertEq(r.plan, 'PCA-and-multimodal');
});
it('Comp', () => {
  const r = Engine.Complications({ comp: 'malignant-hyperthermia' });
  assertEq(r.plan, 'dantrolene-and-ICU');
});
it('Fluids', () => {
  const r = Engine.Fluids({ duration: 5, deficit: 200 });
  assertEq(r.plan, 'maintenance-and-replacement');
});
it('Emerg', () => {
  const r = Engine.Emergence({ delayed: 'no', airway: 'normal' });
  assertEq(r.plan, 'extubate-and-PACU');
});
it('Block', () => {
  const r = Engine.RegionalBlock({ type: 'femoral', site: 'lower-extremity' });
  assertEq(r.plan, 'US-guided-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
