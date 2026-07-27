// P3-BJ dental_ext unit tests
const Engine = require('./dental_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('dental_ext engine tests:');
it('Caries', () => {
  const r = Engine.CariesRisk({ dmft: 7, sugar: 'high', fluoride: 'no', saliva: 'normal' });
  assertEq(r.plan, 'high-risk-and-fluoride-varnish-and-sealants');
});
it('Perio', () => {
  const r = Engine.Periodontitis({ stage: 'III', grade: 'B' });
  assertEq(r.plan, 'moderate-perio-and-SRP');
});
it('Endo', () => {
  const r = Engine.Endocarditis({ procedure: 'dental', risk: 'high' });
  assertEq(r.plan, 'antibiotic-prophylaxis');
});
it('Cancer', () => {
  const r = Engine.OralCancerScreen({ lesion: 'ulcer', duration: 21, risk: 'low' });
  assertEq(r.plan, 'urgent-biopsy-and-ENT-referral');
});
it('TMJ', () => {
  const r = Engine.TMJ({ pain: 'moderate', opening: 35, crepitus: 'yes' });
  assertEq(r.plan, 'NSAIDs-and-night-guard');
});
it('Trauma', () => {
  const r = Engine.Trauma({ type: 'avulsion', tooth: 'permanent', time: 30 });
  assertEq(r.plan, 'reimplant-and-splint');
});
it('Ortho', () => {
  const r = Engine.Ortho({ age: 14, malocclusion: 'class-II', compliance: 'good' });
  assertEq(r.plan, 'comprehensive-ortho');
});
it('Pedi', () => {
  const r = Engine.Pediatric({ age: 2, cooperation: 'poor', procedure: 'restorative' });
  assertEq(r.plan, 'GA-and-restorative');
});
it('Med', () => {
  const r = Engine.MedComplex({ condition: 'bisphosphonate', procedure: 'extraction' });
  assertEq(r.plan, 'BRONJ-risk-and-consult');
});
it('Abscess', () => {
  const r = Engine.DentalAbscess({ severity: 'severe', systemic: 'yes', airway: 'patent' });
  assertEq(r.plan, 'IV-abx-and-drainage');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
