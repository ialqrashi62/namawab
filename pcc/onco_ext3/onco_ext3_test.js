// P3-BW onco_ext3 unit tests
const Engine = require('./onco_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('onco_ext3 engine tests:');
it('Stag', () => {
  const r = Engine.Staging({ stage: 'III' });
  assertEq(r.plan, 'multimodal-and-eval');
});
it('Chemo', () => {
  const r = Engine.Chemo({ regimen: 'targeted' });
  assertEq(r.plan, 'targeted-and-eval');
});
it('Rad', () => {
  const r = Engine.Radiation({ dose: 80 });
  assertEq(r.plan, 'rad-and-eval');
});
it('Targ', () => {
  const r = Engine.Target({ marker: 'HER2' });
  assertEq(r.plan, 'trastuzumab-and-eval');
});
it('Immun', () => {
  const r = Engine.Immuno({ agent: 'PD1' });
  assertEq(r.plan, 'pembrolizumab-and-eval');
});
it('Surg', () => {
  const r = Engine.Surgery({ type: 'palliative' });
  assertEq(r.plan, 'palliative-and-support');
});
it('Comp', () => {
  const r = Engine.Complication({ comp: 'neutropenic-fever' });
  assertEq(r.plan, 'ABx-and-GCSF');
});
it('Surv', () => {
  const r = Engine.Survivorship({ years: 6, sx: 'none' });
  assertEq(r.plan, 'annual-surveillance');
});
it('Pal', () => {
  const r = Engine.Palliative({ urgency: 'urgent' });
  assertEq(r.plan, 'symptom-control-and-hospice');
});
it('Scrn', () => {
  const r = Engine.Screening({ type: 'mammogram', age: 55 });
  assertEq(r.plan, 'annual-mammo');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
