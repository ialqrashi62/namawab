// P3-BE: Transplant-Living unit tests
const Engine = require('./transplant_living_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_living engine tests:');
it('Workup', () => {
  const r = Engine.LivingDonorWorkup({ age: 35, bmi: 25, gfr: 100, comorbidities: 'none', motivation: 'high' });
  assertEq(r.workup, 'standard-living-donor-workup');
});
it('Nephrectomy', () => {
  const r = Engine.DonorNephrectomy({ side: 'left', technique: 'lap', vasculature: 'normal', priorSurgery: 'none' });
  assertEq(r.plan, 'standard-lap-left-donor-nephrectomy');
});
it('Paired', () => {
  const r = Engine.PairedExchange({ donor: 'spouse', recipient: 'O', donorBlood: 'A', pairedWith: 'available' });
  assertEq(r.plan, 'paired-exchange-and-NEPKE');
});
it('Followup', () => {
  const r = Engine.LivingDonorFollowup({ monthsPost: 6, gfr: 70, hypertension: 'no', recovery: 'full' });
  assertEq(r.plan, 'standard-6-month-followup');
});
it('ABOi', () => {
  const r = Engine.ABOiTransplant({ donorTiter: 64, recipientTiter: 100, plasmapheresis: 'available' });
  assertEq(r.plan, 'ABOi-eligible-and-plasmapheresis-and-IVIG');
});
it('Desensitization', () => {
  const r = Engine.Desensitization({ titer: 256, priorTransplant: 'no', plasmapheresis: 'yes', rituximab: 'available' });
  assertEq(r.plan, 'standard-desensitization-and-plasmapheresis-and-IVIG');
});
it('Recipient', () => {
  const r = Engine.LDRecipient({ donor: 'living', donorRelation: 'related', isKPD: 'no', induction: 'anti-thymo' });
  assertEq(r.plan, 'standard-LD-kidney-and-rATG-induction');
});
it('Outcomes', () => {
  const r = Engine.LDOutcomes({ donorComplication: 'none', recipient1YrGraft: 95, recipientReturnToHD: 'no', donorGFR: 70 });
  assertEq(r.result, 'excellent-LD-outcome');
});
it('Dose', () => {
  const r = Engine.LDRecipientDose({ weight: 70, induction: 'rATG', totalDose: 6 });
  assertEq(r.plan, 'rATG-1.5-mg-kg-total-6-mg-kg-divided');
});
it('Complications', () => {
  const r = Engine.LDComplications({ complication: 'lymphocele', weeksPost: 4, severity: 'mild', graftFunction: 'stable' });
  assertEq(r.plan, 'lymphocele-drain-or-marsupialize');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
