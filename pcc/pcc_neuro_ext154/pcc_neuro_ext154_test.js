// pcc_neuro_ext154_engine tests v3.316.50 (Phase 2 Batch 17 clinical-grade)
const Engine = require('./pcc_neuro_ext154_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext154 engine tests v3.316.50:');
it('CavernousSinusExt: severe -> urgent specialist', () => {
  const r = Engine.CavernousSinusExt({ CavernousSinusExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CavernousSinusExt: minimal -> lifestyle', () => {
  const r = Engine.CavernousSinusExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CavernousSinusExt: AKI -> dose adjustment', () => {
  const r = Engine.CavernousSinusExt({ CavernousSinusExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SuperiorOrbitalFissureExt: severe -> urgent specialist', () => {
  const r = Engine.SuperiorOrbitalFissureExt({ SuperiorOrbitalFissureExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SuperiorOrbitalFissureExt: minimal -> lifestyle', () => {
  const r = Engine.SuperiorOrbitalFissureExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SuperiorOrbitalFissureExt: AKI -> dose adjustment', () => {
  const r = Engine.SuperiorOrbitalFissureExt({ SuperiorOrbitalFissureExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('OrbitalApexExt: severe -> urgent specialist', () => {
  const r = Engine.OrbitalApexExt({ OrbitalApexExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('OrbitalApexExt: minimal -> lifestyle', () => {
  const r = Engine.OrbitalApexExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('OrbitalApexExt: AKI -> dose adjustment', () => {
  const r = Engine.OrbitalApexExt({ OrbitalApexExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('GradenigoExt: severe -> urgent specialist', () => {
  const r = Engine.GradenigoExt({ GradenigoExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('GradenigoExt: minimal -> lifestyle', () => {
  const r = Engine.GradenigoExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('GradenigoExt: AKI -> dose adjustment', () => {
  const r = Engine.GradenigoExt({ GradenigoExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TrigeminalNeuralgiaExt: severe -> urgent specialist', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ TrigeminalNeuralgiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TrigeminalNeuralgiaExt: minimal -> lifestyle', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TrigeminalNeuralgiaExt: AKI -> dose adjustment', () => {
  const r = Engine.TrigeminalNeuralgiaExt({ TrigeminalNeuralgiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HemifacialSpasmExt: severe -> urgent specialist', () => {
  const r = Engine.HemifacialSpasmExt({ HemifacialSpasmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HemifacialSpasmExt: minimal -> lifestyle', () => {
  const r = Engine.HemifacialSpasmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HemifacialSpasmExt: AKI -> dose adjustment', () => {
  const r = Engine.HemifacialSpasmExt({ HemifacialSpasmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('GlossopharyngealExt: severe -> urgent specialist', () => {
  const r = Engine.GlossopharyngealExt({ GlossopharyngealExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('GlossopharyngealExt: minimal -> lifestyle', () => {
  const r = Engine.GlossopharyngealExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('GlossopharyngealExt: AKI -> dose adjustment', () => {
  const r = Engine.GlossopharyngealExt({ GlossopharyngealExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BellPalsyExt: severe -> urgent specialist', () => {
  const r = Engine.BellPalsyExt({ BellPalsyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BellPalsyExt: minimal -> lifestyle', () => {
  const r = Engine.BellPalsyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BellPalsyExt: AKI -> dose adjustment', () => {
  const r = Engine.BellPalsyExt({ BellPalsyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('RamsayHuntExt: severe -> urgent specialist', () => {
  const r = Engine.RamsayHuntExt({ RamsayHuntExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('RamsayHuntExt: minimal -> lifestyle', () => {
  const r = Engine.RamsayHuntExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('RamsayHuntExt: AKI -> dose adjustment', () => {
  const r = Engine.RamsayHuntExt({ RamsayHuntExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MelkerssonExt: severe -> urgent specialist', () => {
  const r = Engine.MelkerssonExt({ MelkerssonExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MelkerssonExt: minimal -> lifestyle', () => {
  const r = Engine.MelkerssonExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MelkerssonExt: AKI -> dose adjustment', () => {
  const r = Engine.MelkerssonExt({ MelkerssonExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
