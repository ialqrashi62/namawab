// P3-BZ rheum_ext3 unit tests
const Engine = require('./rheum_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('rheum_ext3 engine tests:');
it('RA', () => {
  const r = Engine.RA({ das28: 6 });
  assertEq(r.plan, 'biologics-and-eval');
});
it('SLE', () => {
  const r = Engine.SLE({ active: 'yes' });
  assertEq(r.plan, 'steroids-and-belly');
});
it('SSc', () => {
  const r = Engine.SSc({ subset: 'diffuse' });
  assertEq(r.plan, 'mycophenolate-and-eval');
});
it('Vas', () => {
  const r = Engine.Vasculitis({ type: 'GPA' });
  assertEq(r.plan, 'rituximab-and-eval');
});
it('Gout', () => {
  const r = Engine.Gout({ acute: 'yes' });
  assertEq(r.plan, 'colchicine-and-NSAID');
});
it('OA', () => {
  const r = Engine.OA({ joint: 'hip', severity: 'severe' });
  assertEq(r.plan, 'THA-and-eval');
});
it('SpA', () => {
  const r = Engine.SpA({ type: 'axSpA' });
  assertEq(r.plan, 'TNF-i-and-eval');
});
it('PMR', () => {
  const r = Engine.PMR({ sx: 'yes' });
  assertEq(r.plan, 'prednisone-and-eval');
});
it('Sjog', () => {
  const r = Engine.Sjogren({ sx: 'severe' });
  assertEq(r.plan, 'rituximab-and-eval');
});
it('Myo', () => {
  const r = Engine.Myositis({ cpk: 6000 });
  assertEq(r.plan, 'steroids-and-IVIG');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
