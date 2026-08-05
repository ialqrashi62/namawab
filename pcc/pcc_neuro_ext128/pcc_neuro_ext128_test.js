// pcc_neuro_ext128_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext128_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext128 engine tests v3.316.48:');
it('AISExt: severe -> urgent specialist', () => {
  const r = Engine.AISExt({ AISExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AISExt: minimal -> lifestyle', () => {
  const r = Engine.AISExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AISExt: AKI -> dose adjustment', () => {
  const r = Engine.AISExt({ AISExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SmallVesselDiseaseExt: severe -> urgent specialist', () => {
  const r = Engine.SmallVesselDiseaseExt({ SmallVesselDiseaseExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SmallVesselDiseaseExt: minimal -> lifestyle', () => {
  const r = Engine.SmallVesselDiseaseExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SmallVesselDiseaseExt: AKI -> dose adjustment', () => {
  const r = Engine.SmallVesselDiseaseExt({ SmallVesselDiseaseExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('LargeArteryAtheroExt: severe -> urgent specialist', () => {
  const r = Engine.LargeArteryAtheroExt({ LargeArteryAtheroExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LargeArteryAtheroExt: minimal -> lifestyle', () => {
  const r = Engine.LargeArteryAtheroExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LargeArteryAtheroExt: AKI -> dose adjustment', () => {
  const r = Engine.LargeArteryAtheroExt({ LargeArteryAtheroExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CardioembolicExt: severe -> urgent specialist', () => {
  const r = Engine.CardioembolicExt({ CardioembolicExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CardioembolicExt: minimal -> lifestyle', () => {
  const r = Engine.CardioembolicExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CardioembolicExt: AKI -> dose adjustment', () => {
  const r = Engine.CardioembolicExt({ CardioembolicExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CryptogenicExt2: severe -> urgent specialist', () => {
  const r = Engine.CryptogenicExt2({ CryptogenicExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CryptogenicExt2: minimal -> lifestyle', () => {
  const r = Engine.CryptogenicExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CryptogenicExt2: AKI -> dose adjustment', () => {
  const r = Engine.CryptogenicExt2({ CryptogenicExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ESUSext: severe -> urgent specialist', () => {
  const r = Engine.ESUSext({ ESUSext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ESUSext: minimal -> lifestyle', () => {
  const r = Engine.ESUSext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ESUSext: AKI -> dose adjustment', () => {
  const r = Engine.ESUSext({ ESUSext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VertebrobasilarExt2: severe -> urgent specialist', () => {
  const r = Engine.VertebrobasilarExt2({ VertebrobasilarExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VertebrobasilarExt2: minimal -> lifestyle', () => {
  const r = Engine.VertebrobasilarExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VertebrobasilarExt2: AKI -> dose adjustment', () => {
  const r = Engine.VertebrobasilarExt2({ VertebrobasilarExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('WatershedExt: severe -> urgent specialist', () => {
  const r = Engine.WatershedExt({ WatershedExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('WatershedExt: minimal -> lifestyle', () => {
  const r = Engine.WatershedExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('WatershedExt: AKI -> dose adjustment', () => {
  const r = Engine.WatershedExt({ WatershedExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('LacunarStrokeExt: severe -> urgent specialist', () => {
  const r = Engine.LacunarStrokeExt({ LacunarStrokeExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LacunarStrokeExt: minimal -> lifestyle', () => {
  const r = Engine.LacunarStrokeExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LacunarStrokeExt: AKI -> dose adjustment', () => {
  const r = Engine.LacunarStrokeExt({ LacunarStrokeExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HemorrhagicTransformExt: severe -> urgent specialist', () => {
  const r = Engine.HemorrhagicTransformExt({ HemorrhagicTransformExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HemorrhagicTransformExt: minimal -> lifestyle', () => {
  const r = Engine.HemorrhagicTransformExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HemorrhagicTransformExt: AKI -> dose adjustment', () => {
  const r = Engine.HemorrhagicTransformExt({ HemorrhagicTransformExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
