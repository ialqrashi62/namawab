// P3-BM ophth_ext unit tests
const Engine = require('./ophth_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ophth_ext engine tests:');
it('Glaucoma', () => {
  const r = Engine.Glaucoma({ iop: 32, opticNerve: 'damaged', visualField: 'progressing' });
  assertEq(r.plan, 'urgent-trabeculectomy-or-tube');
});
it('DR', () => {
  const r = Engine.DiabeticRetinopathy({ stage: 'proliferative', edema: 'yes' });
  assertEq(r.plan, 'PRP-and-anti-VEGF');
});
it('AMD', () => {
  const r = Engine.MacularDegeneration({ type: 'wet', oct: 'fluid' });
  assertEq(r.plan, 'anti-VEGF-monthly');
});
it('Cataract', () => {
  const r = Engine.Cataract({ visualAcuity: 30, dailyActivity: 'affected' });
  assertEq(r.plan, 'phaco-and-IOL');
});
it('Conj', () => {
  const r = Engine.Conjunctivitis({ type: 'bacterial', discharge: 'purulent' });
  assertEq(r.plan, 'topical-fluoroquinolone');
});
it('Uveitis', () => {
  const r = Engine.Uveitis({ location: 'anterior', chronic: 'no' });
  assertEq(r.plan, 'topical-steroid-and-cycloplegic');
});
it('RD', () => {
  const r = Engine.RetinalDetach({ type: 'rhegmatogenous', macula: 'off' });
  assertEq(r.plan, 'emergent-vitrectomy-or-scleral-buckle');
});
it('Abrasion', () => {
  const r = Engine.CornealAbrasion({ size: 'small', contactLens: 'no' });
  assertEq(r.plan, 'abx-and-lubrication');
});
it('Strab', () => {
  const r = Engine.Strabismus({ age: 4, type: 'eso', binocular: 'present' });
  assertEq(r.plan, 'patching-and-glasses');
});
it('Trauma', () => {
  const r = Engine.EyeTrauma({ type: 'chemical', globe: 'intact' });
  assertEq(r.plan, 'irrigate-and-pH-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
