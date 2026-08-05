// pcc_neuro_ext183_engine tests v3.316.52 (Phase 2 Batch 19 clinical-grade)
const Engine = require('./pcc_neuro_ext183_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext183 engine tests v3.316.52:');
it('NeuroGeriatricExt: severe -> urgent specialist', () => {
  const r = Engine.NeuroGeriatricExt({ NeuroGeriatricExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NeuroGeriatricExt: minimal -> lifestyle', () => {
  const r = Engine.NeuroGeriatricExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NeuroGeriatricExt: AKI -> dose adjustment', () => {
  const r = Engine.NeuroGeriatricExt({ NeuroGeriatricExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DementiaWorkupExt: severe -> urgent specialist', () => {
  const r = Engine.DementiaWorkupExt({ DementiaWorkupExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DementiaWorkupExt: minimal -> lifestyle', () => {
  const r = Engine.DementiaWorkupExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DementiaWorkupExt: AKI -> dose adjustment', () => {
  const r = Engine.DementiaWorkupExt({ DementiaWorkupExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DeliriumExt: severe -> urgent specialist', () => {
  const r = Engine.DeliriumExt({ DeliriumExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DeliriumExt: minimal -> lifestyle', () => {
  const r = Engine.DeliriumExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DeliriumExt: AKI -> dose adjustment', () => {
  const r = Engine.DeliriumExt({ DeliriumExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FallsNeuroExt: severe -> urgent specialist', () => {
  const r = Engine.FallsNeuroExt({ FallsNeuroExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FallsNeuroExt: minimal -> lifestyle', () => {
  const r = Engine.FallsNeuroExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FallsNeuroExt: AKI -> dose adjustment', () => {
  const r = Engine.FallsNeuroExt({ FallsNeuroExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PolypharmacyNeuroExt: severe -> urgent specialist', () => {
  const r = Engine.PolypharmacyNeuroExt({ PolypharmacyNeuroExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PolypharmacyNeuroExt: minimal -> lifestyle', () => {
  const r = Engine.PolypharmacyNeuroExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PolypharmacyNeuroExt: AKI -> dose adjustment', () => {
  const r = Engine.PolypharmacyNeuroExt({ PolypharmacyNeuroExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BPSDext: severe -> urgent specialist', () => {
  const r = Engine.BPSDext({ BPSDext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BPSDext: minimal -> lifestyle', () => {
  const r = Engine.BPSDext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BPSDext: AKI -> dose adjustment', () => {
  const r = Engine.BPSDext({ BPSDext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CapgrasExt: severe -> urgent specialist', () => {
  const r = Engine.CapgrasExt({ CapgrasExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CapgrasExt: minimal -> lifestyle', () => {
  const r = Engine.CapgrasExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CapgrasExt: AKI -> dose adjustment', () => {
  const r = Engine.CapgrasExt({ CapgrasExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CharlesBonnetExt: severe -> urgent specialist', () => {
  const r = Engine.CharlesBonnetExt({ CharlesBonnetExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CharlesBonnetExt: minimal -> lifestyle', () => {
  const r = Engine.CharlesBonnetExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CharlesBonnetExt: AKI -> dose adjustment', () => {
  const r = Engine.CharlesBonnetExt({ CharlesBonnetExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PDDext: severe -> urgent specialist', () => {
  const r = Engine.PDDext({ PDDext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PDDext: minimal -> lifestyle', () => {
  const r = Engine.PDDext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PDDext: AKI -> dose adjustment', () => {
  const r = Engine.PDDext({ PDDext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DLBext: severe -> urgent specialist', () => {
  const r = Engine.DLBext({ DLBext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DLBext: minimal -> lifestyle', () => {
  const r = Engine.DLBext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DLBext: AKI -> dose adjustment', () => {
  const r = Engine.DLBext({ DLBext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
