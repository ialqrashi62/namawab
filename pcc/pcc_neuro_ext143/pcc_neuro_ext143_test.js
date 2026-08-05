// pcc_neuro_ext143_engine tests v3.316.49 (Phase 2 Batch 16 clinical-grade)
const Engine = require('./pcc_neuro_ext143_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext143 engine tests v3.316.49:');
it('SleepWakeDisordersExt: severe -> urgent specialist', () => {
  const r = Engine.SleepWakeDisordersExt({ SleepWakeDisordersExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepWakeDisordersExt: minimal -> lifestyle', () => {
  const r = Engine.SleepWakeDisordersExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepWakeDisordersExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepWakeDisordersExt({ SleepWakeDisordersExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('InsomniaExt: severe -> urgent specialist', () => {
  const r = Engine.InsomniaExt({ InsomniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('InsomniaExt: minimal -> lifestyle', () => {
  const r = Engine.InsomniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('InsomniaExt: AKI -> dose adjustment', () => {
  const r = Engine.InsomniaExt({ InsomniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HypersomniaExt: severe -> urgent specialist', () => {
  const r = Engine.HypersomniaExt({ HypersomniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HypersomniaExt: minimal -> lifestyle', () => {
  const r = Engine.HypersomniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HypersomniaExt: AKI -> dose adjustment', () => {
  const r = Engine.HypersomniaExt({ HypersomniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('NarcolepsyExt: severe -> urgent specialist', () => {
  const r = Engine.NarcolepsyExt({ NarcolepsyExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('NarcolepsyExt: minimal -> lifestyle', () => {
  const r = Engine.NarcolepsyExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('NarcolepsyExt: AKI -> dose adjustment', () => {
  const r = Engine.NarcolepsyExt({ NarcolepsyExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('RestlessLegsExt: severe -> urgent specialist', () => {
  const r = Engine.RestlessLegsExt({ RestlessLegsExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('RestlessLegsExt: minimal -> lifestyle', () => {
  const r = Engine.RestlessLegsExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('RestlessLegsExt: AKI -> dose adjustment', () => {
  const r = Engine.RestlessLegsExt({ RestlessLegsExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SleepApneaExt: severe -> urgent specialist', () => {
  const r = Engine.SleepApneaExt({ SleepApneaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepApneaExt: minimal -> lifestyle', () => {
  const r = Engine.SleepApneaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepApneaExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepApneaExt({ SleepApneaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PeriodicLegMovementsExt: severe -> urgent specialist', () => {
  const r = Engine.PeriodicLegMovementsExt({ PeriodicLegMovementsExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PeriodicLegMovementsExt: minimal -> lifestyle', () => {
  const r = Engine.PeriodicLegMovementsExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PeriodicLegMovementsExt: AKI -> dose adjustment', () => {
  const r = Engine.PeriodicLegMovementsExt({ PeriodicLegMovementsExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('REMBehaviorDisorderExt: severe -> urgent specialist', () => {
  const r = Engine.REMBehaviorDisorderExt({ REMBehaviorDisorderExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('REMBehaviorDisorderExt: minimal -> lifestyle', () => {
  const r = Engine.REMBehaviorDisorderExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('REMBehaviorDisorderExt: AKI -> dose adjustment', () => {
  const r = Engine.REMBehaviorDisorderExt({ REMBehaviorDisorderExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CircadianDisordersExt: severe -> urgent specialist', () => {
  const r = Engine.CircadianDisordersExt({ CircadianDisordersExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CircadianDisordersExt: minimal -> lifestyle', () => {
  const r = Engine.CircadianDisordersExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CircadianDisordersExt: AKI -> dose adjustment', () => {
  const r = Engine.CircadianDisordersExt({ CircadianDisordersExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParasomniasExt: severe -> urgent specialist', () => {
  const r = Engine.ParasomniasExt({ ParasomniasExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParasomniasExt: minimal -> lifestyle', () => {
  const r = Engine.ParasomniasExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParasomniasExt: AKI -> dose adjustment', () => {
  const r = Engine.ParasomniasExt({ ParasomniasExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
