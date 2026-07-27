// P3-AS: Pharmacy-Compounding unit tests
const Engine = require('./pharmacy_compounding_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pharmacy_compounding engine tests:');
it('Sterile hazardous', () => {
  const r = Engine.SterileCompounding({ hazardous: true, isoClass: 7 });
  assertEq(r.pathway, 'Hazardous-require-C-PEC-and-ISO-5-or-better');
});
it('Non-sterile dry', () => {
  const r = Engine.NonSterileCompounding({ waterActivity: 0.2 });
  assertEq(r.pathway, 'dry-non-sterile-90-days-BUD');
});
it('IV incompat', () => {
  const r = Engine.IVAdmixtureCompatibility({ drug1: 'morphine', drug2: 'furosemide' });
  assertEq(r.compatibility, 'incompatible-precipitation');
});
it('Hazardous HD', () => {
  const r = Engine.HazardousDrug({ drug: 'cyclophosphamide' });
  assertEq(r.handling, 'NIOSH-Group-1-antineoplastic-C-PEC-required');
});
it('IV stability', () => {
  const r = Engine.IVStability({ drug: 'amiodarone', diluent: 'D5W' });
  assertEq(r.stability, 'stable-24-hours-room-temp');
});
it('Accuracy', () => {
  const r = Engine.CompoundingAccuracy({ weightMeasured: 93, weightExpected: 100 });
  assertEq(r.accuracy, 'borderline-acceptable-5-10-percent');
});
it('Batch doc', () => {
  const r = Engine.BatchDocumentation({ batchSize: 1, masterFormula: 'on-file', checks: 3 });
  assertEq(r.completeness, 'complete-batch-record');
});
it('Repackaging', () => {
  const r = Engine.Repackaging({ originalContainer: 'manufacturer', unitOfUse: false });
  assertEq(r.pathway, 'repackage-into-unit-dose-6-month-BUD');
});
it('QC pass', () => {
  const r = Engine.QualityControl({ endotoxin: 0.1, sterility: 'pass' });
  assertEq(r.status, 'passed-QC-release');
});
it('Pediatric', () => {
  const r = Engine.PediatricCompounding({ age: 0.5, weight: 4 });
  assertEq(r.decision, 'neonatal-compounding-pharmacy-and-pediatric');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
