// P3-BN id_ext unit tests
const Engine = require('./id_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('id_ext engine tests:');
it('Sepsis', () => {
  const r = Engine.SepsisBundle({ time: 1, lactate: 2, abx: 'yes', fluid: 'yes' });
  assertEq(r.plan, 'bundle-complete-and-monitor');
});
it('Empiric', () => {
  const r = Engine.EmpiricAbx({ site: 'CNS', risk: 'standard' });
  assertEq(r.plan, 'vancomycin-and-ceftriaxone');
});
it('HIV', () => {
  const r = Engine.HIVInitiation({ cd4: 150, viral: 200000, opportunistic: 'no' });
  assertEq(r.plan, 'urgent-ART-and-prophylaxis');
});
it('TB', () => {
  const r = Engine.TB({ disease: 'active', resistance: 'MDR' });
  assertEq(r.plan, 'MDR-regimen-and-DOT');
});
it('Travel', () => {
  const r = Engine.Travel({ region: 'malaria', prophylaxis: 'standard' });
  assertEq(r.plan, 'atovaquone-proguanil');
});
it('Fungal', () => {
  const r = Engine.Fungal({ organism: 'aspergillus', host: 'normal' });
  assertEq(r.plan, 'voriconazole');
});
it('Viral', () => {
  const r = Engine.Viral({ virus: 'CMV', host: 'transplant' });
  assertEq(r.plan, 'ganciclovir-and-monitor');
});
it('OPAT', () => {
  const r = Engine.OPAT({ infection: 'endocarditis', drug: 'vancomycin', pvc: 'present' });
  assertEq(r.plan, 'OPAT-and-weekly-trough');
});
it('PJI', () => {
  const r = Engine.ProstheticJoint({ timing: 'early', organism: 'staph' });
  assertEq(r.plan, 'DAIR-and-6w-abx');
});
it('PrEP', () => {
  const r = Engine.HIVPrep({ hbv: 'non-immune', renal: 'normal' });
  assertEq(r.plan, 'vaccinate-HBV-and-PrEP');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
