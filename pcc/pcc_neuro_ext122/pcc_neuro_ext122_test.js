// pcc_neuro_ext122_engine tests v3.316.47 (Phase 2 Batch 14 clinical-grade)
const Engine = require('./pcc_neuro_ext122_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext122 engine tests v3.316.47:');
it('MeningiomaWHO1Ext: severe -> urgent specialist', () => {
  const r = Engine.MeningiomaWHO1Ext({ MeningiomaWHO1Ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MeningiomaWHO1Ext: minimal -> lifestyle', () => {
  const r = Engine.MeningiomaWHO1Ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MeningiomaWHO1Ext: AKI -> dose adjustment', () => {
  const r = Engine.MeningiomaWHO1Ext({ MeningiomaWHO1Ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MeningiomaWHO2Ext: severe -> urgent specialist', () => {
  const r = Engine.MeningiomaWHO2Ext({ MeningiomaWHO2Ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MeningiomaWHO2Ext: minimal -> lifestyle', () => {
  const r = Engine.MeningiomaWHO2Ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MeningiomaWHO2Ext: AKI -> dose adjustment', () => {
  const r = Engine.MeningiomaWHO2Ext({ MeningiomaWHO2Ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MeningiomaWHO3Ext: severe -> urgent specialist', () => {
  const r = Engine.MeningiomaWHO3Ext({ MeningiomaWHO3Ext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MeningiomaWHO3Ext: minimal -> lifestyle', () => {
  const r = Engine.MeningiomaWHO3Ext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MeningiomaWHO3Ext: AKI -> dose adjustment', () => {
  const r = Engine.MeningiomaWHO3Ext({ MeningiomaWHO3Ext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CavernousSinusMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.CavernousSinusMeningiomaExt({ CavernousSinusMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CavernousSinusMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.CavernousSinusMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CavernousSinusMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.CavernousSinusMeningiomaExt({ CavernousSinusMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('OlfactoryGrooveMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.OlfactoryGrooveMeningiomaExt({ OlfactoryGrooveMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('OlfactoryGrooveMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.OlfactoryGrooveMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('OlfactoryGrooveMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.OlfactoryGrooveMeningiomaExt({ OlfactoryGrooveMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParasagittalMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.ParasagittalMeningiomaExt({ ParasagittalMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParasagittalMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.ParasagittalMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParasagittalMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.ParasagittalMeningiomaExt({ ParasagittalMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ConvexityMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.ConvexityMeningiomaExt({ ConvexityMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ConvexityMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.ConvexityMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ConvexityMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.ConvexityMeningiomaExt({ ConvexityMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SphenoidWingMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.SphenoidWingMeningiomaExt({ SphenoidWingMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SphenoidWingMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.SphenoidWingMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SphenoidWingMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.SphenoidWingMeningiomaExt({ SphenoidWingMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PosteriorFossaMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.PosteriorFossaMeningiomaExt({ PosteriorFossaMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PosteriorFossaMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.PosteriorFossaMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PosteriorFossaMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.PosteriorFossaMeningiomaExt({ PosteriorFossaMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpinalMeningiomaExt: severe -> urgent specialist', () => {
  const r = Engine.SpinalMeningiomaExt({ SpinalMeningiomaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpinalMeningiomaExt: minimal -> lifestyle', () => {
  const r = Engine.SpinalMeningiomaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpinalMeningiomaExt: AKI -> dose adjustment', () => {
  const r = Engine.SpinalMeningiomaExt({ SpinalMeningiomaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
