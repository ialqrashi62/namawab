// P3-BE: Neonatal-Ext unit tests
const Engine = require('./neonatal_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('neonatal_ext engine tests:');
it('APGAR-HIE', () => {
  const r = Engine.APHARScore({ pH: 6.9, baseDeficit: 18, fiveMinApgar: 5, resuscitation: 'intubation' });
  assertEq(r.classification, 'severe-HIE');
});
it('Hypothermia', () => {
  const r = Engine.TherapeuticHypothermia({ qualifies: 'yes', hoursAfterBirth: 4, targetTemp: 33.5, hoursDuration: 72 });
  assertEq(r.plan, 'whole-body-cooling-72-hours-and-rewarm');
});
it('NEC', () => {
  const r = Engine.NEC({ abdominalDistension: 'mild', pneumatosis: 'no', systemic: 'stable', labs: 'normal' });
  assertEq(r.diagnosis, 'mild-feeding-intolerance');
});
it('RDS', () => {
  const r = Engine.RDS({ ga: 26, surfactant: 'available', CPAP: 'available', FiO2: 0.45 });
  assertEq(r.plan, 'severe-RDS-and-surfactant-and-vent');
});
it('BPD', () => {
  const r = Engine.BPD({ ga: 27, oxygenAt36w: 0.35, ventilationDays: 20 });
  assertEq(r.classification, 'severe-BPD');
});
it('ROP', () => {
  const r = Engine.ROP({ ga: 28, weeksPostBirth: 6, exam: 'plus-disease', zone: '1', stage: 3 });
  assertEq(r.plan, 'type-1-ROP-and-laser-or-anti-VEGF');
});
it('NEO', () => {
  const r = Engine.NEOScore({ support: 'vent', ga: 27, vasopressor: 'yes', nutrition: 'TPN' });
  assertEq(r.result, 'high-NEOS-and-3-staff');
});
it('Sepsis', () => {
  const r = Engine.SEPSISScreen({ temp: 38.5, hr: 190, wbc: 32, crp: 6, age: 5 });
  assertEq(r.classification, 'probable-sepsis-and-ABX');
});
it('Neuro', () => {
  const r = Engine.NeuroOutcomes({ apgar5: 5, hie: 'severe', prematurity: 'no', sepsis: 'no', mri: 'abnormal' });
  assertEq(r.plan, 'severe-HIE-and-CP-risk-and-early-intervention');
});
it('Dehydration', () => {
  const r = Engine.Dehydration({ weightLoss: 8, feeding: 'poor', urineOutput: 'low', sodium: 145 });
  assertEq(r.plan, 'moderate-dehydration-and-OR-or-IVF');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
