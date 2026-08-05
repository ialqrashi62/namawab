// pcc_neuro_ext135_engine tests v3.316.48 (Phase 2 Batch 15 clinical-grade)
const Engine = require('./pcc_neuro_ext135_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext135 engine tests v3.316.48:');
it('CarotidStenosisExt: severe -> urgent specialist', () => {
  const r = Engine.CarotidStenosisExt({ CarotidStenosisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CarotidStenosisExt: minimal -> lifestyle', () => {
  const r = Engine.CarotidStenosisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CarotidStenosisExt: AKI -> dose adjustment', () => {
  const r = Engine.CarotidStenosisExt({ CarotidStenosisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AsymptomaticCarotidStenExt: severe -> urgent specialist', () => {
  const r = Engine.AsymptomaticCarotidStenExt({ AsymptomaticCarotidStenExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AsymptomaticCarotidStenExt: minimal -> lifestyle', () => {
  const r = Engine.AsymptomaticCarotidStenExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AsymptomaticCarotidStenExt: AKI -> dose adjustment', () => {
  const r = Engine.AsymptomaticCarotidStenExt({ AsymptomaticCarotidStenExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VertebralStenosisExt: severe -> urgent specialist', () => {
  const r = Engine.VertebralStenosisExt({ VertebralStenosisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VertebralStenosisExt: minimal -> lifestyle', () => {
  const r = Engine.VertebralStenosisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VertebralStenosisExt: AKI -> dose adjustment', () => {
  const r = Engine.VertebralStenosisExt({ VertebralStenosisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('IntracranialStenosisExt: severe -> urgent specialist', () => {
  const r = Engine.IntracranialStenosisExt({ IntracranialStenosisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('IntracranialStenosisExt: minimal -> lifestyle', () => {
  const r = Engine.IntracranialStenosisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('IntracranialStenosisExt: AKI -> dose adjustment', () => {
  const r = Engine.IntracranialStenosisExt({ IntracranialStenosisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SubclavianStealExt: severe -> urgent specialist', () => {
  const r = Engine.SubclavianStealExt({ SubclavianStealExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SubclavianStealExt: minimal -> lifestyle', () => {
  const r = Engine.SubclavianStealExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SubclavianStealExt: AKI -> dose adjustment', () => {
  const r = Engine.SubclavianStealExt({ SubclavianStealExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BowHuntersExt: severe -> urgent specialist', () => {
  const r = Engine.BowHuntersExt({ BowHuntersExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BowHuntersExt: minimal -> lifestyle', () => {
  const r = Engine.BowHuntersExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BowHuntersExt: AKI -> dose adjustment', () => {
  const r = Engine.BowHuntersExt({ BowHuntersExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ECSText: severe -> urgent specialist', () => {
  const r = Engine.ECSText({ ECSText: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ECSText: minimal -> lifestyle', () => {
  const r = Engine.ECSText({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ECSText: AKI -> dose adjustment', () => {
  const r = Engine.ECSText({ ECSText: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ICADExt: severe -> urgent specialist', () => {
  const r = Engine.ICADExt({ ICADExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ICADExt: minimal -> lifestyle', () => {
  const r = Engine.ICADExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ICADExt: AKI -> dose adjustment', () => {
  const r = Engine.ICADExt({ ICADExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MoyamoyaDiseaseExt: severe -> urgent specialist', () => {
  const r = Engine.MoyamoyaDiseaseExt({ MoyamoyaDiseaseExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MoyamoyaDiseaseExt: minimal -> lifestyle', () => {
  const r = Engine.MoyamoyaDiseaseExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MoyamoyaDiseaseExt: AKI -> dose adjustment', () => {
  const r = Engine.MoyamoyaDiseaseExt({ MoyamoyaDiseaseExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FMDext: severe -> urgent specialist', () => {
  const r = Engine.FMDext({ FMDext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FMDext: minimal -> lifestyle', () => {
  const r = Engine.FMDext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FMDext: AKI -> dose adjustment', () => {
  const r = Engine.FMDext({ FMDext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
