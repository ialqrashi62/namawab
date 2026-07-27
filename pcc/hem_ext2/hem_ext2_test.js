// P3-BU hem_ext2 unit tests
const Engine = require('./hem_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('hem_ext2 engine tests:');
it('An', () => {
  const r = Engine.Anemia({ hgb: 6, chronic: 'no' });
  assertEq(r.plan, 'transfuse-and-eval');
});
it('Thr', () => {
  const r = Engine.Thrombocyt({ plt: 15, bleeding: 'yes' });
  assertEq(r.plan, 'transfuse-and-eval');
});
it('Coag', () => {
  const r = Engine.Coag({ inr: 4, bleeding: 'yes' });
  assertEq(r.plan, 'FFP-and-vitK');
});
it('DVT', () => {
  const r = Engine.DVT({ provok: 'yes' });
  assertEq(r.plan, 'anticoag-3mo');
});
it('ACO', () => {
  const r = Engine.Anticoag({ ind: 'PE' });
  assertEq(r.plan, 'anticoag-3mo');
});
it('Bld', () => {
  const r = Engine.Bleed({ source: 'GI', severity: 'major' });
  assertEq(r.plan, 'massive-transfusion');
});
it('TTP', () => {
  const r = Engine.TTP({ plts: 25, microang: 'yes' });
  assertEq(r.plan, 'plasmex-and-eval');
});
it('DIC', () => {
  const r = Engine.DIC({ pt: 22, bleeding: 'yes' });
  assertEq(r.plan, 'FFP-and-eval');
});
it('Sic', () => {
  const r = Engine.Sickle({ crisis: 'chest' });
  assertEq(r.plan, 'transfuse-and-eval');
});
it('Lym', () => {
  const r = Engine.Lymphoma({ type: 'Hodgkin', stage: 'I' });
  assertEq(r.plan, 'chemo-and-radiation');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
