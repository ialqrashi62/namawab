// P3-BH transplant_pharmacy unit tests
const Engine = require('./transplant_pharmacy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('transplant_pharmacy engine tests:');
it('Tac', () => {
  const r = Engine.TacLevel({ level: 10, months: 1 });
  assertEq(r.plan, 'target-tac-level-8-12');
});
it('MMF', () => {
  const r = Engine.MMFDose({ wbc: 5, anc: 3, gi: 'mild' });
  assertEq(r.plan, 'continue-MMF-1g-BID');
});
it('Steroid', () => {
  const r = Engine.SteroidTaper({ days: 14, rejection: 'no' });
  assertEq(r.plan, 'prednisone-20mg-and-taper');
});
it('Valcyte', () => {
  const r = Engine.ValcyteCMV({ serostatus: 'D+R-', months: 3, wbc: 5 });
  assertEq(r.plan, 'valcyte-6mo-and-CMV-PCR');
});
it('Bactrim', () => {
  const r = Engine.BactrimPCP({ months: 6, sulfa: 'tolerated' });
  assertEq(r.plan, 'bactrim-SS-daily');
});
it('Antifungal', () => {
  const r = Engine.Antifungal({ organ: 'lung', risk: 'high' });
  assertEq(r.plan, 'azole-12mo-and-therapeutic-DL');
});
it('DDI', () => {
  const r = Engine.DrugInteraction({ cyp: 'azole', statin: 'simvastatin' });
  assertEq(r.plan, 'switch-statin-to-pravastatin');
});
it('Adherence', () => {
  const r = Engine.AdherenceMonitor({ missed: 5, days: 30 });
  assertEq(r.plan, 'suboptimal-adherence-and-counsel');
});
it('SE', () => {
  const r = Engine.SideEffectMgmt({ se: 'tac-nephrotoxicity', severity: 'severe' });
  assertEq(r.plan, 'tac-reduction-and-switch-mTOR');
});
it('TDM', () => {
  const r = Engine.TherapeuticDrugMonitor({ organ: 'kidney', months: 1, drug: 'tac' });
  assertEq(r.plan, 'tac-level-every-2-weeks');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
