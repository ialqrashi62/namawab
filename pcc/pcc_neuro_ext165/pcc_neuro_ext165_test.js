// pcc_neuro_ext165_engine tests v3.316.51 (Phase 2 Batch 18 clinical-grade)
const Engine = require('./pcc_neuro_ext165_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext165 engine tests v3.316.51:');
it('VertigoBPPVext: severe -> urgent specialist', () => {
  const r = Engine.VertigoBPPVext({ VertigoBPPVext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VertigoBPPVext: minimal -> lifestyle', () => {
  const r = Engine.VertigoBPPVext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VertigoBPPVext: AKI -> dose adjustment', () => {
  const r = Engine.VertigoBPPVext({ VertigoBPPVext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VestibularNeuritisExt: severe -> urgent specialist', () => {
  const r = Engine.VestibularNeuritisExt({ VestibularNeuritisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VestibularNeuritisExt: minimal -> lifestyle', () => {
  const r = Engine.VestibularNeuritisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VestibularNeuritisExt: AKI -> dose adjustment', () => {
  const r = Engine.VestibularNeuritisExt({ VestibularNeuritisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MeniereDiseaseExt: severe -> urgent specialist', () => {
  const r = Engine.MeniereDiseaseExt({ MeniereDiseaseExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MeniereDiseaseExt: minimal -> lifestyle', () => {
  const r = Engine.MeniereDiseaseExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MeniereDiseaseExt: AKI -> dose adjustment', () => {
  const r = Engine.MeniereDiseaseExt({ MeniereDiseaseExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('LabyrinthitisExt: severe -> urgent specialist', () => {
  const r = Engine.LabyrinthitisExt({ LabyrinthitisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('LabyrinthitisExt: minimal -> lifestyle', () => {
  const r = Engine.LabyrinthitisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('LabyrinthitisExt: AKI -> dose adjustment', () => {
  const r = Engine.LabyrinthitisExt({ LabyrinthitisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SuperiorCanalDehiscenceExt: severe -> urgent specialist', () => {
  const r = Engine.SuperiorCanalDehiscenceExt({ SuperiorCanalDehiscenceExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SuperiorCanalDehiscenceExt: minimal -> lifestyle', () => {
  const r = Engine.SuperiorCanalDehiscenceExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SuperiorCanalDehiscenceExt: AKI -> dose adjustment', () => {
  const r = Engine.SuperiorCanalDehiscenceExt({ SuperiorCanalDehiscenceExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('BilateralVestibulopathyExt: severe -> urgent specialist', () => {
  const r = Engine.BilateralVestibulopathyExt({ BilateralVestibulopathyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('BilateralVestibulopathyExt: minimal -> lifestyle', () => {
  const r = Engine.BilateralVestibulopathyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('BilateralVestibulopathyExt: AKI -> dose adjustment', () => {
  const r = Engine.BilateralVestibulopathyExt({ BilateralVestibulopathyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VestibularMigraineExt: severe -> urgent specialist', () => {
  const r = Engine.VestibularMigraineExt({ VestibularMigraineExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VestibularMigraineExt: minimal -> lifestyle', () => {
  const r = Engine.VestibularMigraineExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VestibularMigraineExt: AKI -> dose adjustment', () => {
  const r = Engine.VestibularMigraineExt({ VestibularMigraineExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MalDeDebarquementExt: severe -> urgent specialist', () => {
  const r = Engine.MalDeDebarquementExt({ MalDeDebarquementExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MalDeDebarquementExt: minimal -> lifestyle', () => {
  const r = Engine.MalDeDebarquementExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MalDeDebarquementExt: AKI -> dose adjustment', () => {
  const r = Engine.MalDeDebarquementExt({ MalDeDebarquementExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PersistentPosturalExt: severe -> urgent specialist', () => {
  const r = Engine.PersistentPosturalExt({ PersistentPosturalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PersistentPosturalExt: minimal -> lifestyle', () => {
  const r = Engine.PersistentPosturalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PersistentPosturalExt: AKI -> dose adjustment', () => {
  const r = Engine.PersistentPosturalExt({ PersistentPosturalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CervicogenicVertigoExt: severe -> urgent specialist', () => {
  const r = Engine.CervicogenicVertigoExt({ CervicogenicVertigoExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CervicogenicVertigoExt: minimal -> lifestyle', () => {
  const r = Engine.CervicogenicVertigoExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CervicogenicVertigoExt: AKI -> dose adjustment', () => {
  const r = Engine.CervicogenicVertigoExt({ CervicogenicVertigoExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
