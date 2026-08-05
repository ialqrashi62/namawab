// pcc_neuro_ext147_engine tests v3.316.49 (Phase 2 Batch 16 clinical-grade)
const Engine = require('./pcc_neuro_ext147_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext147 engine tests v3.316.49:');
it('DrugInducedMovementExt: severe -> urgent specialist', () => {
  const r = Engine.DrugInducedMovementExt({ DrugInducedMovementExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DrugInducedMovementExt: minimal -> lifestyle', () => {
  const r = Engine.DrugInducedMovementExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DrugInducedMovementExt: AKI -> dose adjustment', () => {
  const r = Engine.DrugInducedMovementExt({ DrugInducedMovementExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TardiveDyskinesiaExt: severe -> urgent specialist', () => {
  const r = Engine.TardiveDyskinesiaExt({ TardiveDyskinesiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TardiveDyskinesiaExt: minimal -> lifestyle', () => {
  const r = Engine.TardiveDyskinesiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TardiveDyskinesiaExt: AKI -> dose adjustment', () => {
  const r = Engine.TardiveDyskinesiaExt({ TardiveDyskinesiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AkatheisaExt: severe -> urgent specialist', () => {
  const r = Engine.AkatheisaExt({ AkatheisaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AkatheisaExt: minimal -> lifestyle', () => {
  const r = Engine.AkatheisaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AkatheisaExt: AKI -> dose adjustment', () => {
  const r = Engine.AkatheisaExt({ AkatheisaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('NeurolepticMalignantExt: severe -> urgent specialist', () => {
  const r = Engine.NeurolepticMalignantExt({ NeurolepticMalignantExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NeurolepticMalignantExt: minimal -> lifestyle', () => {
  const r = Engine.NeurolepticMalignantExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NeurolepticMalignantExt: AKI -> dose adjustment', () => {
  const r = Engine.NeurolepticMalignantExt({ NeurolepticMalignantExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParkinsonismDrugExt: severe -> urgent specialist', () => {
  const r = Engine.ParkinsonismDrugExt({ ParkinsonismDrugExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParkinsonismDrugExt: minimal -> lifestyle', () => {
  const r = Engine.ParkinsonismDrugExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParkinsonismDrugExt: AKI -> dose adjustment', () => {
  const r = Engine.ParkinsonismDrugExt({ ParkinsonismDrugExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DystoniaAcuteDrugExt: severe -> urgent specialist', () => {
  const r = Engine.DystoniaAcuteDrugExt({ DystoniaAcuteDrugExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DystoniaAcuteDrugExt: minimal -> lifestyle', () => {
  const r = Engine.DystoniaAcuteDrugExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DystoniaAcuteDrugExt: AKI -> dose adjustment', () => {
  const r = Engine.DystoniaAcuteDrugExt({ DystoniaAcuteDrugExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SSRISexualDysExt: severe -> urgent specialist', () => {
  const r = Engine.SSRISexualDysExt({ SSRISexualDysExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SSRISexualDysExt: minimal -> lifestyle', () => {
  const r = Engine.SSRISexualDysExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SSRISexualDysExt: AKI -> dose adjustment', () => {
  const r = Engine.SSRISexualDysExt({ SSRISexualDysExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SSRIbleedExt: severe -> urgent specialist', () => {
  const r = Engine.SSRIbleedExt({ SSRIbleedExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SSRIbleedExt: minimal -> lifestyle', () => {
  const r = Engine.SSRIbleedExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SSRIbleedExt: AKI -> dose adjustment', () => {
  const r = Engine.SSRIbleedExt({ SSRIbleedExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SSRIhyponatremiaExt: severe -> urgent specialist', () => {
  const r = Engine.SSRIhyponatremiaExt({ SSRIhyponatremiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SSRIhyponatremiaExt: minimal -> lifestyle', () => {
  const r = Engine.SSRIhyponatremiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SSRIhyponatremiaExt: AKI -> dose adjustment', () => {
  const r = Engine.SSRIhyponatremiaExt({ SSRIhyponatremiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SSRIserotoninExt: severe -> urgent specialist', () => {
  const r = Engine.SSRIserotoninExt({ SSRIserotoninExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SSRIserotoninExt: minimal -> lifestyle', () => {
  const r = Engine.SSRIserotoninExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SSRIserotoninExt: AKI -> dose adjustment', () => {
  const r = Engine.SSRIserotoninExt({ SSRIserotoninExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
