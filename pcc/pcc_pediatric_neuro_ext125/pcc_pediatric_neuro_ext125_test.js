// pcc_pediatric_neuro_ext125_engine tests v3.316.59 (Phase 2 Batch 26 clinical-grade)
const Engine = require('./pcc_pediatric_neuro_ext125_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro_ext125 engine tests v3.316.59:');
it('PediatricCVSText: severe -> urgent specialist', () => {
  const r = Engine.PediatricCVSText({ PediatricCVSText: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCVSText: minimal -> lifestyle', () => {
  const r = Engine.PediatricCVSText({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCVSText: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCVSText({ PediatricCVSText: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSagittalThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSagittalThrombExt({ PediatricSagittalThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSagittalThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSagittalThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSagittalThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSagittalThrombExt({ PediatricSagittalThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricTransverseThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricTransverseThrombExt({ PediatricTransverseThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricTransverseThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricTransverseThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricTransverseThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricTransverseThrombExt({ PediatricTransverseThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSigmoidThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSigmoidThrombExt({ PediatricSigmoidThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSigmoidThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSigmoidThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSigmoidThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSigmoidThrombExt({ PediatricSigmoidThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricCavernousThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricCavernousThrombExt({ PediatricCavernousThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCavernousThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricCavernousThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCavernousThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCavernousThrombExt({ PediatricCavernousThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricDeepVenousThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricDeepVenousThrombExt({ PediatricDeepVenousThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricDeepVenousThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricDeepVenousThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricDeepVenousThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricDeepVenousThrombExt({ PediatricDeepVenousThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricCorticalVeinExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricCorticalVeinExt({ PediatricCorticalVeinExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCorticalVeinExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricCorticalVeinExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCorticalVeinExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCorticalVeinExt({ PediatricCorticalVeinExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSepticThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSepticThrombExt({ PediatricSepticThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSepticThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSepticThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSepticThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSepticThrombExt({ PediatricSepticThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricAsepticThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricAsepticThrombExt({ PediatricAsepticThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricAsepticThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricAsepticThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricAsepticThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricAsepticThrombExt({ PediatricAsepticThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricPregnancyThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricPregnancyThrombExt({ PediatricPregnancyThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricPregnancyThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricPregnancyThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricPregnancyThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricPregnancyThrombExt({ PediatricPregnancyThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
