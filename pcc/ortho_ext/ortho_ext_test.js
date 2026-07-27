// P3-BP ortho_ext unit tests
const Engine = require('./ortho_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('ortho_ext engine tests:');
it('OA', () => {
  const r = Engine.Osteoarthritis({ joint: 'knee', severity: 'severe' });
  assertEq(r.plan, 'TKA-eval-and-PT');
});
it('RA', () => {
  const r = Engine.RA({ activity: 'severe', das28: 6 });
  assertEq(r.plan, 'biologic-and-MTX');
});
it('Fx', () => {
  const r = Engine.Fracture({ type: 'open', displacement: 'minimal', joint: 'no' });
  assertEq(r.plan, 'urgent-irrigation-and-ORIF');
});
it('Spine', () => {
  const r = Engine.Spine({ level: 'lumbar', radiculopathy: 'no', weakness: 'severe' });
  assertEq(r.plan, 'emergent-MRI-and-surgical');
});
it('Sports', () => {
  const r = Engine.Sports({ injury: 'sprain', chronic: 'no' });
  assertEq(r.plan, 'RICE-and-PT');
});
it('Pedi', () => {
  const r = Engine.Pediatric({ condition: 'SCFE' });
  assertEq(r.plan, 'urgent-ORIF-and-endocrine');
});
it('Tumor', () => {
  const r = Engine.Tumor({ type: 'benign', location: 'femur' });
  assertEq(r.plan, 'observe-and-monitor');
});
it('Hand', () => {
  const r = Engine.Hand({ condition: 'carpal-tunnel-severe' });
  assertEq(r.plan, 'surgical-release');
});
it('Foot', () => {
  const r = Engine.FootAnkle({ condition: 'plantar-fasciitis' });
  assertEq(r.plan, 'stretch-and-orthotic');
});
it('Pros', () => {
  const r = Engine.Prosthetic({ type: 'knee', day: 30 });
  assertEq(r.plan, 'outpatient-PT-and-progress');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
