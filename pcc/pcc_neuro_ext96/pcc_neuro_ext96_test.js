// pcc_neuro_ext96_engine tests v3.316.54 (Phase 2 Batch 21 clinical-grade)
const Engine = require('./pcc_neuro_ext96_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext96 engine tests v3.316.54:');
it('SleepMedPolysomExt: severe -> urgent specialist', () => {
  const r = Engine.SleepMedPolysomExt({ SleepMedPolysomExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepMedPolysomExt: minimal -> lifestyle', () => {
  const r = Engine.SleepMedPolysomExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepMedPolysomExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepMedPolysomExt({ SleepMedPolysomExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CPAPComplianceExt: severe -> urgent specialist', () => {
  const r = Engine.CPAPComplianceExt({ CPAPComplianceExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CPAPComplianceExt: minimal -> lifestyle', () => {
  const r = Engine.CPAPComplianceExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CPAPComplianceExt: AKI -> dose adjustment', () => {
  const r = Engine.CPAPComplianceExt({ CPAPComplianceExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('NarcolepsyManageExt: severe -> urgent specialist', () => {
  const r = Engine.NarcolepsyManageExt({ NarcolepsyManageExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NarcolepsyManageExt: minimal -> lifestyle', () => {
  const r = Engine.NarcolepsyManageExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NarcolepsyManageExt: AKI -> dose adjustment', () => {
  const r = Engine.NarcolepsyManageExt({ NarcolepsyManageExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('RestlessLegsMgmExt: severe -> urgent specialist', () => {
  const r = Engine.RestlessLegsMgmExt({ RestlessLegsMgmExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('RestlessLegsMgmExt: minimal -> lifestyle', () => {
  const r = Engine.RestlessLegsMgmExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('RestlessLegsMgmExt: AKI -> dose adjustment', () => {
  const r = Engine.RestlessLegsMgmExt({ RestlessLegsMgmExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParasomniasEvalExt: severe -> urgent specialist', () => {
  const r = Engine.ParasomniasEvalExt({ ParasomniasEvalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParasomniasEvalExt: minimal -> lifestyle', () => {
  const r = Engine.ParasomniasEvalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParasomniasEvalExt: AKI -> dose adjustment', () => {
  const r = Engine.ParasomniasEvalExt({ ParasomniasEvalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('InsomniaCBTIExt: severe -> urgent specialist', () => {
  const r = Engine.InsomniaCBTIExt({ InsomniaCBTIExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('InsomniaCBTIExt: minimal -> lifestyle', () => {
  const r = Engine.InsomniaCBTIExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('InsomniaCBTIExt: AKI -> dose adjustment', () => {
  const r = Engine.InsomniaCBTIExt({ InsomniaCBTIExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PeriodicLimbMovementExt: severe -> urgent specialist', () => {
  const r = Engine.PeriodicLimbMovementExt({ PeriodicLimbMovementExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PeriodicLimbMovementExt: minimal -> lifestyle', () => {
  const r = Engine.PeriodicLimbMovementExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PeriodicLimbMovementExt: AKI -> dose adjustment', () => {
  const r = Engine.PeriodicLimbMovementExt({ PeriodicLimbMovementExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CircadianRhythmDisorderExt: severe -> urgent specialist', () => {
  const r = Engine.CircadianRhythmDisorderExt({ CircadianRhythmDisorderExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CircadianRhythmDisorderExt: minimal -> lifestyle', () => {
  const r = Engine.CircadianRhythmDisorderExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CircadianRhythmDisorderExt: AKI -> dose adjustment', () => {
  const r = Engine.CircadianRhythmDisorderExt({ CircadianRhythmDisorderExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ShiftWorkDisorderExt: severe -> urgent specialist', () => {
  const r = Engine.ShiftWorkDisorderExt({ ShiftWorkDisorderExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ShiftWorkDisorderExt: minimal -> lifestyle', () => {
  const r = Engine.ShiftWorkDisorderExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ShiftWorkDisorderExt: AKI -> dose adjustment', () => {
  const r = Engine.ShiftWorkDisorderExt({ ShiftWorkDisorderExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SleepApneaSurgeryEvalExt: severe -> urgent specialist', () => {
  const r = Engine.SleepApneaSurgeryEvalExt({ SleepApneaSurgeryEvalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepApneaSurgeryEvalExt: minimal -> lifestyle', () => {
  const r = Engine.SleepApneaSurgeryEvalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepApneaSurgeryEvalExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepApneaSurgeryEvalExt({ SleepApneaSurgeryEvalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
