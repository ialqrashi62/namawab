// P3-AV: Pelvic-Rehab unit tests
const Engine = require('./pelvic_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pelvic_rehab engine tests:');
it('Incontinence', () => {
  const r = Engine.IncontinenceImpact({ padUse: 2, leakageFrequency: 'daily', padWeight: 50, urge: 'moderate' });
  assertEq(r.severity, 'moderate-incontinence-1-to-2-pads-daily');
});
it('Prolapse', () => {
  const r = Engine.PelvicOrganProlapse({ stage: 3 });
  assertEq(r.classification, 'stage-3-prolapse-beyond-introitus');
});
it('Pelvic pain', () => {
  const r = Engine.PelvicPain({ painLocation: 'vulvar', duration: 6 });
  assertEq(r.diagnosis, 'vulvodynia-consider');
});
it('Pregnancy', () => {
  const r = Engine.PregnancyPelvic({ trimester: 3, diastasisRecti: 4 });
  assertEq(r.pathway, 'postpartum-pelvic-PT-evaluation');
});
it('Post-prostatectomy', () => {
  const r = Engine.PostProstatectomy({ weeksPost: 6, padUse: 1 });
  assertEq(r.status, 'improving-incontinence-PFPT');
});
it('Dyspareunia', () => {
  const r = Engine.DyspareuniaEval({ painLocation: 'superficial', primary: true });
  assertEq(r.diagnosis, 'provoked-vestibulodynia');
});
it('EMG biofeedback', () => {
  const r = Engine.PelvicFloorEMGBiofeedback({ strength: 2, endurance: 5 });
  assertEq(r.assessment, 'moderate-weakness-PFPT-with-biofeedback');
});
it('Recovery', () => {
  const r = Engine.PelvicSurgeryRecovery({ surgery: 'hysterectomy', weeksPost: 10, painScore: 1 });
  assertEq(r.recovery.includes('PFPT-and-pelvic-floor-strengthening') || r.recovery.includes('maintenance-and-return-to-activity'), true);
});
it('Male CPPS', () => {
  const r = Engine.MalePelvicPain({ cppsDuration: 6, urination: 'painful' });
  assertEq(r.diagnosis, 'CPPS-Category-III-chronic-prostatitis');
});
it('PF strength', () => {
  const r = Engine.PelvicFloorStrength({ strength: 5, endurance: 15, fastTwitch: 20 });
  assertEq(r.assessment, 'normal-PF-strength');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
