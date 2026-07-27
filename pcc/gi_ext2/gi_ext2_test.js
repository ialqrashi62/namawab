// P3-BV gi_ext2 unit tests
const Engine = require('./gi_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('gi_ext2 engine tests:');
it('Dys', () => {
  const r = Engine.Dysphagia({ cause: 'cancer' });
  assertEq(r.plan, 'scope-and-staging');
});
it('GERD', () => {
  const r = Engine.GERD({ severity: 'severe' });
  assertEq(r.plan, 'PPI-and-eval');
});
it('PUD', () => {
  const r = Engine.PUD({ source: 'H.pylori', bleeding: 'no' });
  assertEq(r.plan, 'triple-therapy-and-test');
});
it('IBD', () => {
  const r = Engine.IBD({ type: 'UC', severity: 'severe' });
  assertEq(r.plan, 'biologics-and-eval');
});
it('IBS', () => {
  const r = Engine.IBS({ subtype: 'diarrhea' });
  assertEq(r.plan, 'antidiarrheal-and-FODMAP');
});
it('Cel', () => {
  const r = Engine.Celiac({ ttg: 150 });
  assertEq(r.plan, 'biopsy-and-gluten-free');
});
it('Pan', () => {
  const r = Engine.Pancreatitis({ severity: 'severe' });
  assertEq(r.plan, 'ICU-and-support');
});
it('Cir', () => {
  const r = Engine.Cirrhosis({ meld: 12, ascites: 'no' });
  assertEq(r.plan, 'monitor-and-FU');
});
it('Jau', () => {
  const r = Engine.Jaundice({ bili: 6, obstructive: 'yes' });
  assertEq(r.plan, 'MRCP-and-eval');
});
it('Bld', () => {
  const r = Engine.Bleed({ source: 'upper', stable: 'yes' });
  assertEq(r.plan, 'EGD-and-eval');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
