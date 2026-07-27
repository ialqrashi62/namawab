// P3-BN rheum_ext2 unit tests
const Engine = require('./rheum_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('rheum_ext2 engine tests:');
it('RA', () => {
  const r = Engine.RA({ das28: 5.5, activity: 'severe' });
  assertEq(r.plan, 'biologic-and-MTX');
});
it('SLE', () => {
  const r = Engine.SLE({ activity: 'severe', organ: 'renal' });
  assertEq(r.plan, 'pulse-steroid-and-cyclophosphamide');
});
it('PsA', () => {
  const r = Engine.PsoriaticArthritis({ activity: 'severe', skin: 'severe' });
  assertEq(r.plan, 'IL-17-or-IL-23-inhibitor');
});
it('AS', () => {
  const r = Engine.AnkylosingSpondyl({ activity: 'severe', basdai: 7 });
  assertEq(r.plan, 'TNF-inhibitor-or-IL-17');
});
it('Gout', () => {
  const r = Engine.Gout({ ua: 10, flare: 'no' });
  assertEq(r.plan, 'allopurinol-and-titrate');
});
it('Vasculitis', () => {
  const r = Engine.Vasculitis({ type: 'GPA', severity: 'severe' });
  assertEq(r.plan, 'rituximab-and-cyclophosphamide');
});
it('Sjogren', () => {
  const r = Engine.Sjogren({ activity: 'mild', organ: 'sicca' });
  assertEq(r.plan, 'artificial-tears-and-pilocarpine');
});
it('Sclero', () => {
  const r = Engine.Scleroderma({ type: 'diffuse', complication: 'ILD' });
  assertEq(r.plan, 'mycophenolate-and-nintedanib');
});
it('PMR', () => {
  const r = Engine.Polymyalgia({ activity: 'active', steroid: 'no' });
  assertEq(r.plan, 'prednisone-15mg-and-taper');
});
it('Pedi', () => {
  const r = Engine.PediatricRheum({ jia: 'oligo', activity: 'mild' });
  assertEq(r.plan, 'NSAIDs-and-steroid-injection');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
