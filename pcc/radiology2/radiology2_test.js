// P3-BR radiology2 unit tests
const Engine = require('./radiology2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('radiology2 engine tests:');
it('CT', () => {
  const r = Engine.CT({ indication: 'PE', contrast: 'yes', gfr: 80 });
  assertEq(r.plan, 'CTPA-and-eval');
});
it('MRI', () => {
  const r = Engine.MRI({ indication: 'r/o-tear', body: 'joint', pacemaker: 'no' });
  assertEq(r.plan, 'MRI-joint-and-arthrogram');
});
it('US', () => {
  const r = Engine.US({ indication: 'DVT' });
  assertEq(r.plan, 'DVT-duplex');
});
it('Xray', () => {
  const r = Engine.Xray({ body: 'chest', indication: 'cough' });
  assertEq(r.plan, 'CXR-and-eval');
});
it('Nuc', () => {
  const r = Engine.Nuclear({ type: 'PET' });
  assertEq(r.plan, 'PET-CT-and-eval');
});
it('IR', () => {
  const r = Engine.Interventional({ type: 'drain', urgent: 'no' });
  assertEq(r.plan, 'US-guided-drain');
});
it('Mammo', () => {
  const r = Engine.Mammo({ type: 'screening', birads: 2 });
  assertEq(r.plan, 'screening-mammo-and-FU');
});
it('Fluoro', () => {
  const r = Engine.Fluoro({ indication: 'urography' });
  assertEq(r.plan, 'IVP-or-CT-urogram');
});
it('PE', () => {
  const r = Engine.PE({ wells: 5, dDimer: 200 });
  assertEq(r.plan, 'CTPA-and-eval');
});
it('Biopsy', () => {
  const r = Engine.Biopsy({ site: 'liver', depth: 'superficial' });
  assertEq(r.plan, 'US-guided-biopsy');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
