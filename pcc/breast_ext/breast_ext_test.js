// P3-BT breast_ext unit tests
const Engine = require('./breast_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('breast_ext engine tests:');
it('Screen', () => {
  const r = Engine.Screen({ age: 50, family: 'no' });
  assertEq(r.plan, 'annual-mammo-and-FU');
});
it('Mass', () => {
  const r = Engine.Mass({ birads: 3, mobility: 'mobile' });
  assertEq(r.plan, '6mo-FU-or-biopsy');
});
it('Nipple', () => {
  const r = Engine.Nipple({ finding: 'bloody' });
  assertEq(r.plan, 'ductogram-and-eval');
});
it('Cancer', () => {
  const r = Engine.Cancer({ stage: 'II', subtype: 'TNBC' });
  assertEq(r.plan, 'neoadjuvant-chemo');
});
it('BRCA', () => {
  const r = Engine.BRCA({ family: 'yes', age: 35 });
  assertEq(r.plan, 'genetic-counseling');
});
it('Mast', () => {
  const r = Engine.Mastectomy({ indication: 'prophylactic' });
  assertEq(r.plan, 'counsel-and-reconstruct');
});
it('Recon', () => {
  const r = Engine.Reconstruction({ type: 'DIEP' });
  assertEq(r.plan, 'preop-imaging-and-microsurg');
});
it('Lact', () => {
  const r = Engine.Lactation({ issue: 'abscess' });
  assertEq(r.plan, 'I&D-and-ABx');
});
it('Gyn', () => {
  const r = Engine.Gynecomastia({ cause: 'medication' });
  assertEq(r.plan, 'review-and-taper');
});
it('Surv', () => {
  const r = Engine.Survivorship({ years: 6, sx: 'none' });
  assertEq(r.plan, 'annual-surveillance');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
