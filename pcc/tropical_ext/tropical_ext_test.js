// P3-AU: Tropical-Ext unit tests
const Engine = require('./tropical_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('tropical_ext engine tests:');
it('Malaria', () => {
  const r = Engine.MalariaAssessment({ fever: true, travel: 'sub-saharan-africa', parasitemia: 1 });
  assertEq(r.pathway, 'malaria-confirmed-artesunate-or-ACT');
});
it('Dengue severe', () => {
  const r = Engine.DengueFever({ fever: true, plasmaLeakage: true });
  assertEq(r.classification, 'severe-dengue-DSS-emergent');
});
it('Typhoid', () => {
  const r = Engine.TyphoidFever({ fever: true, roseSpots: true, hepatosplenomegaly: true, relativeBradycardia: true });
  assertEq(r.diagnosis, 'typhoid-confirmed-or-strongly-suspected');
});
it('Worm', () => {
  const r = Engine.TropicalWorm({ presentation: 'eosinophilia', exposure: 'freshwater' });
  assertEq(r.diagnosis, 'schistosomiasis-test-and-praziquantel');
});
it('TB', () => {
  const r = Engine.TuberculosisRisk({ ppd: 12, exposure: 'household' });
  assertEq(r.risk, 'latent-TB-treat');
});
it('Skin', () => {
  const r = Engine.TropicalSkin({ rash: 'petechial', fever: true });
  assertEq(r.diagnosis, 'meningococcemia-or-viral-hemorrhagic');
});
it('Rabies', () => {
  const r = Engine.RabiesPostExposure({ animal: 'bat', bite: 'yes' });
  assertEq(r.pathway, 'rabies-immune-globulin-and-vaccine-series');
});
it('Diarrhea', () => {
  const r = Engine.TravelersDiarrhea({ bloodInStool: true, fever: true });
  assertEq(r.classification, 'dysentery-Shigella-or-Campylobacter');
});
it('Yellow fever', () => {
  const r = Engine.YellowFever({ fever: true, jaundice: true, travel: 'west-africa' });
  assertEq(r.diagnosis, 'yellow-fever-high-suspicion-urgent-test');
});
it('Chikungunya', () => {
  const r = Engine.ChikungunyaAssessment({ fever: true, severeJointPain: true, travel: 'tropical' });
  assertEq(r.diagnosis, 'chikungunya-confirmed-or-suspected');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
