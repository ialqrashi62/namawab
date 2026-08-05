// pcc_neuro_ext127_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext127_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext127 engine tests v3.316.48:');
it('CerebralCavernousExt: severe -> urgent specialist', () => {
  const r = Engine.CerebralCavernousExt({ CerebralCavernousExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralCavernousExt: minimal -> lifestyle', () => {
  const r = Engine.CerebralCavernousExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralCavernousExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebralCavernousExt({ CerebralCavernousExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpinalCavernousExt: severe -> urgent specialist', () => {
  const r = Engine.SpinalCavernousExt({ SpinalCavernousExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpinalCavernousExt: minimal -> lifestyle', () => {
  const r = Engine.SpinalCavernousExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpinalCavernousExt: AKI -> dose adjustment', () => {
  const r = Engine.SpinalCavernousExt({ SpinalCavernousExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CerebralAVMExt2: severe -> urgent specialist', () => {
  const r = Engine.CerebralAVMExt2({ CerebralAVMExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebralAVMExt2: minimal -> lifestyle', () => {
  const r = Engine.CerebralAVMExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebralAVMExt2: AKI -> dose adjustment', () => {
  const r = Engine.CerebralAVMExt2({ CerebralAVMExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpinalAVMExt: severe -> urgent specialist', () => {
  const r = Engine.SpinalAVMExt({ SpinalAVMExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpinalAVMExt: minimal -> lifestyle', () => {
  const r = Engine.SpinalAVMExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpinalAVMExt: AKI -> dose adjustment', () => {
  const r = Engine.SpinalAVMExt({ SpinalAVMExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DuralFistulaExt2: severe -> urgent specialist', () => {
  const r = Engine.DuralFistulaExt2({ DuralFistulaExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DuralFistulaExt2: minimal -> lifestyle', () => {
  const r = Engine.DuralFistulaExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DuralFistulaExt2: AKI -> dose adjustment', () => {
  const r = Engine.DuralFistulaExt2({ DuralFistulaExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CarotidCavernousFistulaExt2: severe -> urgent specialist', () => {
  const r = Engine.CarotidCavernousFistulaExt2({ CarotidCavernousFistulaExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CarotidCavernousFistulaExt2: minimal -> lifestyle', () => {
  const r = Engine.CarotidCavernousFistulaExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CarotidCavernousFistulaExt2: AKI -> dose adjustment', () => {
  const r = Engine.CarotidCavernousFistulaExt2({ CarotidCavernousFistulaExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DevelopmentalVenousAnomExt: severe -> urgent specialist', () => {
  const r = Engine.DevelopmentalVenousAnomExt({ DevelopmentalVenousAnomExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DevelopmentalVenousAnomExt: minimal -> lifestyle', () => {
  const r = Engine.DevelopmentalVenousAnomExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DevelopmentalVenousAnomExt: AKI -> dose adjustment', () => {
  const r = Engine.DevelopmentalVenousAnomExt({ DevelopmentalVenousAnomExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CapillaryTelangiectasiaExt: severe -> urgent specialist', () => {
  const r = Engine.CapillaryTelangiectasiaExt({ CapillaryTelangiectasiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CapillaryTelangiectasiaExt: minimal -> lifestyle', () => {
  const r = Engine.CapillaryTelangiectasiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CapillaryTelangiectasiaExt: AKI -> dose adjustment', () => {
  const r = Engine.CapillaryTelangiectasiaExt({ CapillaryTelangiectasiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MixedMalformationExt: severe -> urgent specialist', () => {
  const r = Engine.MixedMalformationExt({ MixedMalformationExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MixedMalformationExt: minimal -> lifestyle', () => {
  const r = Engine.MixedMalformationExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MixedMalformationExt: AKI -> dose adjustment', () => {
  const r = Engine.MixedMalformationExt({ MixedMalformationExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('RenduOslerWeberExt: severe -> urgent specialist', () => {
  const r = Engine.RenduOslerWeberExt({ RenduOslerWeberExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('RenduOslerWeberExt: minimal -> lifestyle', () => {
  const r = Engine.RenduOslerWeberExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('RenduOslerWeberExt: AKI -> dose adjustment', () => {
  const r = Engine.RenduOslerWeberExt({ RenduOslerWeberExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
