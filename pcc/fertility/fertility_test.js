// P3-BF: Fertility unit tests
const Engine = require('./fertility_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('fertility engine tests:');
it('Eval', () => {
  const r = Engine.FertilityEval({ partnerAge: 35, duration: 12, cycle: 'regular', priorPreg: 'none' });
  assertEq(r.plan, 'standard-infertility-workup');
});
it('IVF', () => {
  const r = Engine.IVFProtocol({ age: 35, amh: 2, bmi: 25, priorCycles: 0, response: 'unknown' });
  assertEq(r.plan, 'standard-responder-and-standard-protocol');
});
it('OHSS', () => {
  const r = Engine.OHSS({ follicles: 25, estradiol: 5500, symptoms: 'severe' });
  assertEq(r.classification, 'severe-OHSS-and-admit');
});
it('Endo', () => {
  const r = Engine.Endometriosis({ stage: 3, pain: 'mild', fertility: 'preserved', age: 32 });
  assertEq(r.plan, 'laparoscopy-and-IVF-or-ART');
});
it('PCOS', () => {
  const r = Engine.PCOS({ cycle: 'irregular', bmi: 32, insulin: 'resistant', amh: 4 });
  assertEq(r.plan, 'metformin-and-weight-loss-and-letrozole');
});
it('Male', () => {
  const r = Engine.Malefactor({ count: 15, motility: 30, morphology: 4, fsh: 5 });
  assertEq(r.classification, 'normal-semen-analysis');
});
it('Miscarriage', () => {
  const r = Engine.Miscarriage({ losses: 3, gaLast: 8, age: 32, workup: 'none' });
  assertEq(r.plan, 'recurrent-pregnancy-loss-workup');
});
it('PGT', () => {
  const r = Engine.PGT({ age: 40, indication: 'advanced-maternal-age', cycles: 1 });
  assertEq(r.plan, 'PGT-A-and-IVF');
});
it('FP', () => {
  const r = Engine.FertilityPreservation({ age: 32, indication: 'egg-freezing', cancer: 'no', partner: 'no' });
  assertEq(r.plan, 'elective-egg-freezing-and-2-cycles');
});
it('Outcome', () => {
  const r = Engine.FertilityOutcome({ preConceive: 0, postDelivery: 1, cycles: 2, age: 35 });
  assertEq(r.result, 'successful-FP-or-ART');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
