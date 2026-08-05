// pcc_neuro_ext136_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext136_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext136 engine tests v3.316.48:');
it('CerebralVenousSinusThrombExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralVenousSinusThrombExt({ CerebralVenousSinusThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralVenousSinusThrombExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralVenousSinusThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralVenousSinusThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralVenousSinusThrombExt({ CerebralVenousSinusThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SuperiorSagittalThrombExt: severe -> urgent specialist', () => {
  const r = Engine.SuperiorSagittalThrombExt({ SuperiorSagittalThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SuperiorSagittalThrombExt: minimal -> lifestyle', () => {
  const r = Engine.SuperiorSagittalThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SuperiorSagittalThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.SuperiorSagittalThrombExt({ SuperiorSagittalThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TransverseSinusThrombExt: severe -> urgent specialist', () => {
  const r = Engine.TransverseSinusThrombExt({ TransverseSinusThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TransverseSinusThrombExt: minimal -> lifestyle', () => {
  const r = Engine.TransverseSinusThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TransverseSinusThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.TransverseSinusThrombExt({ TransverseSinusThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SigmoidSinusThrombExt: severe -> urgent specialist', () => {
  const r = Engine.SigmoidSinusThrombExt({ SigmoidSinusThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SigmoidSinusThrombExt: minimal -> lifestyle', () => {
  const r = Engine.SigmoidSinusThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SigmoidSinusThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.SigmoidSinusThrombExt({ SigmoidSinusThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CavernousSinusThrombExt: severe -> urgent specialist', () => {
  const r = Engine.CavernousSinusThrombExt({ CavernousSinusThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CavernousSinusThrombExt: minimal -> lifestyle', () => {
  const r = Engine.CavernousSinusThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CavernousSinusThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.CavernousSinusThrombExt({ CavernousSinusThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DeepVenousThrombExt: severe -> urgent specialist', () => {
  const r = Engine.DeepVenousThrombExt({ DeepVenousThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DeepVenousThrombExt: minimal -> lifestyle', () => {
  const r = Engine.DeepVenousThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DeepVenousThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.DeepVenousThrombExt({ DeepVenousThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CorticalVeinThrombExt: severe -> urgent specialist', () => {
  const r = Engine.CorticalVeinThrombExt({ CorticalVeinThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CorticalVeinThrombExt: minimal -> lifestyle', () => {
  const r = Engine.CorticalVeinThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CorticalVeinThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.CorticalVeinThrombExt({ CorticalVeinThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SepticThrombExt: severe -> urgent specialist', () => {
  const r = Engine.SepticThrombExt({ SepticThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SepticThrombExt: minimal -> lifestyle', () => {
  const r = Engine.SepticThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SepticThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.SepticThrombExt({ SepticThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AsepticThrombExt: severe -> urgent specialist', () => {
  const r = Engine.AsepticThrombExt({ AsepticThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AsepticThrombExt: minimal -> lifestyle', () => {
  const r = Engine.AsepticThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AsepticThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.AsepticThrombExt({ AsepticThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PregnancyRelatedThrombExt: severe -> urgent specialist', () => {
  const r = Engine.PregnancyRelatedThrombExt({ PregnancyRelatedThrombExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PregnancyRelatedThrombExt: minimal -> lifestyle', () => {
  const r = Engine.PregnancyRelatedThrombExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PregnancyRelatedThrombExt: AKI -> dose adjustment', () => {
  const r = Engine.PregnancyRelatedThrombExt({ PregnancyRelatedThrombExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
