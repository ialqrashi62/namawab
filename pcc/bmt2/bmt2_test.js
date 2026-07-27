// P3-AT: BMT2 unit tests
const Engine = require('./bmt2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('bmt2 engine tests:');
it('CordBlood', () => {
  const r = Engine.CordBloodTransplant({ cordUnit: 'single', cellDose: 1.5, hlaMatch: '4-of-6' });
  assertEq(r.decision, 'single-cord-eligible');
});
it('PBSC', () => {
  const r = Engine.PBSCCollection({ cd34: 5 });
  assertEq(r.decision, 'excellent-collection');
});
it('PTCy', () => {
  const r = Engine.PTCyGVHDProphylaxis({ donorType: 'haplo' });
  assertEq(r.status, 'PTCy-standard-for-haplo-and-mismatched');
});
it('CAR-T', () => {
  const r = Engine.CARTCellTherapy({ indication: 'DLBCL' });
  assertEq(r.plan, 'CAR-T-DLBCL-axicabtagene-or-tisagenlecleucel');
});
it('Antifungal', () => {
  const r = Engine.PeriTransplantAntifungal({ daysPost: 10, neutrophils: 200 });
  assertEq(r.antifungal, 'micafungin-or-caspofungin-empiric');
});
it('VOD', () => {
  const r = Engine.HepaticSOSVOD({ weightGain: 6, bilirubin: 3, painRUQ: true });
  assertEq(r.management, 'VOD-confirmed-start-defibrotide');
});
it('Engraft syndrome', () => {
  const r = Engine.EngraftmentSyndrome({ daysPost: 7, fever: true, rash: true, hypoxia: true });
  assertEq(r.syndrome, 'engraftment-syndrome-severe-steroid');
});
it('Second transplant', () => {
  const r = Engine.SecondTransplant({ relapse: true, donorChimerism: 80, daysPost: 200, priorGVHD: false });
  assertEq(r.decision, 'second-transplant-consider');
});
it('Survivorship', () => {
  const r = Engine.SurvivorshipLateEffects({ yearsPost: 6 });
  assertEq(r.screening, 'long-term-survivorship-clinic');
});
it('HCTCI', () => {
  const r = Engine.HCTCIComorbidity({ comorbidityCount: 4 });
  assertEq(r.score, 'HCTCI-3-or-more-high-risk');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
