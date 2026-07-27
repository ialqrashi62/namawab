// P3-BG transplant_immunology unit tests
const Engine = require('./transplant_immunology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_immunology engine tests:');
it('ABO', () => {
  const r = Engine.ABOMatch({ donorABO: 'A', recipABO: 'B' });
  assertEq(r.plan, 'ABO-incompatible-and-desensitization-or-paired');
});
it('Crossmatch', () => {
  const r = Engine.Crossmatch({ tcell: 'positive', bcell: 'negative' });
  assertEq(r.plan, 'T-cell-positive-and-contraindicated');
});
it('DSA', () => {
  const r = Engine.DSAPanel({ pra: 90, mfi: 8000, donorSpecific: 'yes' });
  assertEq(r.plan, 'high-immunologic-risk-and-desensitization');
});
it('Induction', () => {
  const r = Engine.InductionProtocol({ risk: 'high', organ: 'kidney', age: 50 });
  assertEq(r.plan, 'rATG-and-steroids-and-MMF');
});
it('Maintenance', () => {
  const r = Engine.MaintenanceIS({ months: 18, rejection: 'no', renal: 'normal' });
  assertEq(r.plan, 'low-target-tac-or-mTOR');
});
it('Acute', () => {
  const r = Engine.RejectionAcute({ grade: 'IIA', day: 60 });
  assertEq(r.plan, 'rATG-and-pulse-steroid-and-MMF');
});
it('Chronic', () => {
  const r = Engine.RejectionChronic({ cad: 'severe', ifta: 'moderate', months: 24 });
  assertEq(r.plan, 'mTOR-conversion-and-optimize');
});
it('DSAmon', () => {
  const r = Engine.DSAmonitor({ mfi: 12000, trend: 'rising', biopsy: 'not-done' });
  assertEq(r.plan, 'urgent-biopsy-and-treatment');
});
it('Infx', () => {
  const r = Engine.InfectionProphylaxis({ organ: 'lung', months: 6, serostatus: 'positive' });
  assertEq(r.plan, 'valcyte-6mo-and-bactrim-12mo-and-azole');
});
it('Vaccine', () => {
  const r = Engine.VaccinationSchedule({ months: 4, live: 'no' });
  assertEq(r.plan, 'influenza-and-pneumococcal-and-hepB');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
