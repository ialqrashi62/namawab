// P3-BF: Womens-Health-Ext unit tests
const Engine = require('./womens_health_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('womens_health_ext engine tests:');
it('Well-woman', () => {
  const r = Engine.WellWoman({ age: 35, pap: 'up-to-date', mammogram: 'current', screening: 'current' });
  assertEq(r.plan, 'co-testing-and-HPV-and-every-5-years');
});
it('Menopause', () => {
  const r = Engine.Menopause({ age: 50, fsh: 60, vasomotor: 'moderate', boneDensity: 'normal' });
  assertEq(r.plan, 'menopause-and-MHT-or-non-hormonal');
});
it('PCOS', () => {
  const r = Engine.PCOSWH({ cycle: 'irregular', bmi: 32, hirsutism: 'mild', age: 28 });
  assertEq(r.plan, 'metformin-and-OCP-and-weight-loss');
});
it('Endo', () => {
  const r = Engine.EndometriosisWH({ pain: 'severe', stage: 4, fertility: 'compromised', priorSurgery: 'no' });
  assertEq(r.plan, 'ART-and-IVF-and-eval');
});
it('UTI', () => {
  const r = Engine.UTI({ frequency: 'recurrent', culture: 'E-coli', sex: 'female', prophylaxis: 'no' });
  assertEq(r.plan, 'post-coital-or-daily-prophylaxis');
});
it('STI', () => {
  const r = Engine.STI({ pathogen: 'chlamydia', symptoms: 'present', partner: 'unknown', risk: 'moderate' });
  assertEq(r.plan, 'doxycycline-and-partner-treatment');
});
it('Cervical', () => {
  const r = Engine.CervicalScreen({ hpv: 'positive-16-18', cytology: 'NILM', age: 35, prior: 'normal' });
  assertEq(r.plan, 'colposcopy-and-eval');
});
it('Urogyn', () => {
  const r = Engine.Urogyn({ leakage: 'stress', frequency: 'weekly', priorSurgery: 'no', qualityOfLife: 'moderate' });
  assertEq(r.plan, 'PFT-and-pessary-or-sling-eval');
});
it('PF', () => {
  const r = Engine.PelvicFloorWH({ prolapse: 'mild', urinary: 'normal', sexual: 'normal', age: 35 });
  assertEq(r.plan, 'PFPT-and-monitor');
});
it('IVF-gyn', () => {
  const r = Engine.IVFandGyn({ ivfCycles: 0, eggReserve: 'normal', age: 35, gynecology: 'normal' });
  assertEq(r.plan, 'IVF-start');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
