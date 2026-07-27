// P3-BQ plast_surg_ext unit tests
const Engine = require('./plast_surg_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('plast_surg_ext engine tests:');
it('Burn', () => {
  const r = Engine.Burn({ tbsa: 35, degree: 'III', inhalation: 'no' });
  assertEq(r.plan, 'burn-center-and-fluid-resuscitation');
});
it('Wound', () => {
  const r = Engine.Wound({ type: 'surgical', chronic: 'no' });
  assertEq(r.plan, 'sterile-dressing-and-FU');
});
it('Recon', () => {
  const r = Engine.Reconstruct({ defect: 'medium', location: 'face' });
  assertEq(r.plan, 'local-flap-and-skin-graft');
});
it('Hand', () => {
  const r = Engine.Hand({ injury: 'tendon-laceration' });
  assertEq(r.plan, 'tendon-repair');
});
it('Cosmetic', () => {
  const r = Engine.Cosmetic({ procedure: 'rhinoplasty' });
  assertEq(r.plan, 'pre-op-photo-and-consent');
});
it('Skin', () => {
  const r = Engine.SkinCancer({ type: 'bcc', size: 1, location: 'low-risk' });
  assertEq(r.plan, 'excision');
});
it('Cleft', () => {
  const r = Engine.Cleft({ age: 1, type: 'lip' });
  assertEq(r.plan, 'lip-repair-and-feeding-team');
});
it('Lymph', () => {
  const r = Engine.Lymphedema({ stage: 'II' });
  assertEq(r.plan, 'lymphovenous-bypass');
});
it('PU', () => {
  const r = Engine.PressureUlcer({ stage: 'III', depth: 'deep' });
  assertEq(r.plan, 'debridement-and-flap-eval');
});
it('Trauma', () => {
  const r = Engine.TraumaRecon({ injury: 'facial-fracture' });
  assertEq(r.plan, 'ORIF-and-facial-reconstruction');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
