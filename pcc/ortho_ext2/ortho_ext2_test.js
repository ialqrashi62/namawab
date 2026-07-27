// P3-BX ortho_ext2 unit tests
const Engine = require('./ortho_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ortho_ext2 engine tests:');
it('Frac', () => {
  const r = Engine.Fracture({ type: 'displaced', open: 'no' });
  assertEq(r.plan, 'ORIF-and-eval');
});
it('Joint', () => {
  const r = Engine.Joint({ joint: 'knee', severity: 'severe' });
  assertEq(r.plan, 'TKA-and-eval');
});
it('Spine', () => {
  const r = Engine.Spine({ finding: 'cord-compression' });
  assertEq(r.plan, 'surgery-and-steroid');
});
it('Sport', () => {
  const r = Engine.Sports({ injury: 'ACL' });
  assertEq(r.plan, 'MRI-and-eval');
});
it('Trauma', () => {
  const r = Engine.Trauma({ injury: 'femoral-shaft' });
  assertEq(r.plan, 'IM-nail');
});
it('Tumor', () => {
  const r = Engine.Tumor({ type: 'osteosarcoma' });
  assertEq(r.plan, 'chemo-and-resection');
});
it('Hand', () => {
  const r = Engine.Hand({ issue: 'carpal-tunnel' });
  assertEq(r.plan, 'splint-and-eval');
});
it('Foot', () => {
  const r = Engine.Foot({ issue: 'plantar-fasciitis' });
  assertEq(r.plan, 'PT-and-orthotic');
});
it('Pedi', () => {
  const r = Engine.Pediatric({ issue: 'DDH' });
  assertEq(r.plan, 'Pavlik-and-eval');
});
it('Recon', () => {
  const r = Engine.Recon({ type: 'revision' });
  assertEq(r.plan, 'workup-and-revision');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
