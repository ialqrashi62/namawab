// pcc_pediatric_surg_ext125_engine tests v3.316.65 (Phase 2 Batch 32 clinical-grade)
const Engine = require('./pcc_pediatric_surg_ext125_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surg_ext125 engine tests v3.316.65:');
it('PediatricCVSTAnticoagExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricCVSTAnticoagExt({ PediatricCVSTAnticoagExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCVSTAnticoagExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricCVSTAnticoagExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCVSTAnticoagExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCVSTAnticoagExt({ PediatricCVSTAnticoagExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSagittalThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSagittalThrombAntiExt({ PediatricSagittalThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSagittalThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSagittalThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSagittalThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSagittalThrombAntiExt({ PediatricSagittalThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricTransverseThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricTransverseThrombAntiExt({ PediatricTransverseThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricTransverseThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricTransverseThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricTransverseThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricTransverseThrombAntiExt({ PediatricTransverseThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSigmoidThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSigmoidThrombAntiExt({ PediatricSigmoidThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSigmoidThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSigmoidThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSigmoidThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSigmoidThrombAntiExt({ PediatricSigmoidThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricCavernousThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricCavernousThrombAntiExt({ PediatricCavernousThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCavernousThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricCavernousThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCavernousThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCavernousThrombAntiExt({ PediatricCavernousThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricDeepVenousThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricDeepVenousThrombAntiExt({ PediatricDeepVenousThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricDeepVenousThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricDeepVenousThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricDeepVenousThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricDeepVenousThrombAntiExt({ PediatricDeepVenousThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricCorticalVeinAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricCorticalVeinAntiExt({ PediatricCorticalVeinAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricCorticalVeinAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricCorticalVeinAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricCorticalVeinAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricCorticalVeinAntiExt({ PediatricCorticalVeinAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSepticThrombAbsExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSepticThrombAbsExt({ PediatricSepticThrombAbsExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSepticThrombAbsExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSepticThrombAbsExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSepticThrombAbsExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSepticThrombAbsExt({ PediatricSepticThrombAbsExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricAsepticThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricAsepticThrombAntiExt({ PediatricAsepticThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricAsepticThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricAsepticThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricAsepticThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricAsepticThrombAntiExt({ PediatricAsepticThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricPregnancyThrombAntiExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricPregnancyThrombAntiExt({ PediatricPregnancyThrombAntiExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricPregnancyThrombAntiExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricPregnancyThrombAntiExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricPregnancyThrombAntiExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricPregnancyThrombAntiExt({ PediatricPregnancyThrombAntiExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
