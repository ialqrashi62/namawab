// P3-BF: Transplant-Pediatric unit tests
const Engine = require('./transplant_pediatric_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_pediatric engine tests:');
it('Eval', () => {
  const r = Engine.PediatricEval({ organ: 'kidney', age: 8, weight: 25, etiology: 'congenital', status: 'elective' });
  assertEq(r.plan, 'pediatric-kidney-and-LRD-or-deceased');
});
it('LD', () => {
  const r = Engine.PediatricLD({ donor: 'parent', donorAge: 35, gfr: 100, weight: 60, blood: 'compatible' });
  assertEq(r.plan, 'parent-to-child-LRD-and-eval');
});
it('Immuno', () => {
  const r = Engine.PediatricImmuno({ age: 4, induction: 'basiliximab', regimen: 'tac-MMF', compliance: 'caregiver' });
  assertEq(r.plan, 'basiliximab-and-low-MMF-and-tac');
});
it('Growth', () => {
  const r = Engine.PediatricGrowth({ heightZ: -2.5, weightZ: -1, age: 8, steroids: 'low-dose' });
  assertEq(r.plan, 'GH-eval-and-steroid-minimization');
});
it('Adherence', () => {
  const r = Engine.PediatricAdherence({ age: 14, missedDoses: 5, careGiver: 'engaged', school: 'impacted' });
  assertEq(r.plan, 'transition-and-adherence-team');
});
it('School', () => {
  const r = Engine.PediatricSchool({ age: 8, school: 'mainstream', iep: 'no', absentee: 25 });
  assertEq(r.plan, 'homebound-tutor-and-school-reintegration');
});
it('Vaccines', () => {
  const r = Engine.PediatricVaccines({ age: 8, transplant: 'pre', liveVaccine: 'eligible' });
  assertEq(r.plan, 'live-vaccines-pre-transplant-and-MMR-and-Varicella');
});
it('PTLD', () => {
  const r = Engine.PediatricPTLD({ organ: 'kidney', ebv: 'high-load', yearsPost: 3, mass: 'none' });
  assertEq(r.plan, 'high-EBV-load-and-IS-reduction');
});
it('Transition', () => {
  const r = Engine.PediatricTransition({ age: 18, knowledge: 'low', independence: 'low', parent: 'engaged' });
  assertEq(r.plan, 'structured-transition-and-readiness-assessment');
});
it('Outcome', () => {
  const r = Engine.PediatricOutcome({ graftSurvival: 95, growthZ: -1, qolScore: 80, neurodev: 'normal' });
  assertEq(r.result, 'excellent-pediatric-outcome');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
