// P3-BP vasc_ext unit tests
const Engine = require('./vasc_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('vasc_ext engine tests:');
it('AAA', () => {
  const r = Engine.AAA({ size: 5.1, growth: 0 });
  assertEq(r.plan, 'EVAR-eval-and-FU');
});
it('Carotid', () => {
  const r = Engine.Carotid({ stenosis: 80, symptom: 'yes' });
  assertEq(r.plan, 'CEA-or-CAS');
});
it('PAD', () => {
  const r = Engine.PAD({ abi: 0.6, symptom: 'claudication' });
  assertEq(r.plan, 'supervised-exercise-and-statin');
});
it('DVT', () => {
  const r = Engine.DVT({ location: 'proximal', trigger: 'provoked' });
  assertEq(r.plan, 'anticoagulate-3-6mo');
});
it('Varicose', () => {
  const r = Engine.VaricoseVein({ symptom: 'mild', complication: 'no' });
  assertEq(r.plan, 'compression-and-lifestyle');
});
it('Dissect', () => {
  const r = Engine.AorticDissect({ type: 'A', complication: 'no' });
  assertEq(r.plan, 'emergent-surgical-repair');
});
it('Mes', () => {
  const r = Engine.MesentericIsch({ acuteness: 'acute' });
  assertEq(r.plan, 'emergent-CTA-and-vascular');
});
it('TAA', () => {
  const r = Engine.ThoracicAortic({ size: 7, symptom: 'no' });
  assertEq(r.plan, 'TEVAR-eval');
});
it('Dialysis', () => {
  const r = Engine.DialysisAccess({ type: 'AVG', flow: 200 });
  assertEq(r.plan, 'declot-and-angiogram');
});
it('Lymph', () => {
  const r = Engine.Lymphedema({ stage: 'III', cause: 'cancer' });
  assertEq(r.plan, 'complete-decongestive-therapy');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
