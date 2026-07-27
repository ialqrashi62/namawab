// P3-BV ent_ext2 unit tests
const Engine = require('./ent_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ent_ext2 engine tests:');
it('Hear', () => {
  const r = Engine.Hearing({ loss: 'severe' });
  assertEq(r.plan, 'cochlear-eval');
});
it('Tin', () => {
  const r = Engine.Tinnitus({ acuteness: 'acute' });
  assertEq(r.plan, 'steroids-and-MRI');
});
it('Vert', () => {
  const r = Engine.Vertigo({ cause: 'BPPV' });
  assertEq(r.plan, 'Epley-and-FU');
});
it('Sin', () => {
  const r = Engine.Sinus({ chronic: 'yes' });
  assertEq(r.plan, 'CT-sinus-and-surgery-eval');
});
it('OSA', () => {
  const r = Engine.OSA({ ahi: 35 });
  assertEq(r.plan, 'CPAP-and-eval');
});
it('Hoar', () => {
  const r = Engine.Hoarseness({ chronic: 'yes' });
  assertEq(r.plan, 'laryngoscopy-and-eval');
});
it('Neck', () => {
  const r = Engine.NeckMass({ duration: 8 });
  assertEq(r.plan, 'FNA-and-eval');
});
it('Epi', () => {
  const r = Engine.Epistaxis({ severity: 'severe' });
  assertEq(r.plan, 'cautery-and-pack');
});
it('Dys', () => {
  const r = Engine.Dysphagia({ source: 'esophageal' });
  assertEq(r.plan, 'EGD-and-eval');
});
it('All', () => {
  const r = Engine.Allergic({ severity: 'mild' });
  assertEq(r.plan, 'antihist-and-FU');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
