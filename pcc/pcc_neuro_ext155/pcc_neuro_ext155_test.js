// pcc_neuro_ext155_engine tests v3.316.50 (Phase 2 Batch 17 clinical-grade)
const Engine = require('./pcc_neuro_ext155_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext155 engine tests v3.316.50:');
it('SleepApneaNeuroExt: severe -> urgent specialist', () => {
  const r = Engine.SleepApneaNeuroExt({ SleepApneaNeuroExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepApneaNeuroExt: minimal -> lifestyle', () => {
  const r = Engine.SleepApneaNeuroExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepApneaNeuroExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepApneaNeuroExt({ SleepApneaNeuroExt: 2, egfr: 25 });
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
it('IdiopathicHypersomniaExt: severe -> urgent specialist', () => {
  const r = Engine.IdiopathicHypersomniaExt({ IdiopathicHypersomniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('IdiopathicHypersomniaExt: minimal -> lifestyle', () => {
  const r = Engine.IdiopathicHypersomniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('IdiopathicHypersomniaExt: AKI -> dose adjustment', () => {
  const r = Engine.IdiopathicHypersomniaExt({ IdiopathicHypersomniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('KleineLevinExt: severe -> urgent specialist', () => {
  const r = Engine.KleineLevinExt({ KleineLevinExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('KleineLevinExt: minimal -> lifestyle', () => {
  const r = Engine.KleineLevinExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('KleineLevinExt: AKI -> dose adjustment', () => {
  const r = Engine.KleineLevinExt({ KleineLevinExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('REMBehaviorExt: severe -> urgent specialist', () => {
  const r = Engine.REMBehaviorExt({ REMBehaviorExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('REMBehaviorExt: minimal -> lifestyle', () => {
  const r = Engine.REMBehaviorExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('REMBehaviorExt: AKI -> dose adjustment', () => {
  const r = Engine.REMBehaviorExt({ REMBehaviorExt: 2, egfr: 25 });
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
it('PeriodicLimbExt: severe -> urgent specialist', () => {
  const r = Engine.PeriodicLimbExt({ PeriodicLimbExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PeriodicLimbExt: minimal -> lifestyle', () => {
  const r = Engine.PeriodicLimbExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PeriodicLimbExt: AKI -> dose adjustment', () => {
  const r = Engine.PeriodicLimbExt({ PeriodicLimbExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SleepParalysisExt: severe -> urgent specialist', () => {
  const r = Engine.SleepParalysisExt({ SleepParalysisExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SleepParalysisExt: minimal -> lifestyle', () => {
  const r = Engine.SleepParalysisExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SleepParalysisExt: AKI -> dose adjustment', () => {
  const r = Engine.SleepParalysisExt({ SleepParalysisExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ExplodingHeadExt: severe -> urgent specialist', () => {
  const r = Engine.ExplodingHeadExt({ ExplodingHeadExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ExplodingHeadExt: minimal -> lifestyle', () => {
  const r = Engine.ExplodingHeadExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ExplodingHeadExt: AKI -> dose adjustment', () => {
  const r = Engine.ExplodingHeadExt({ ExplodingHeadExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FatalFamilialInsomniaExt: severe -> urgent specialist', () => {
  const r = Engine.FatalFamilialInsomniaExt({ FatalFamilialInsomniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FatalFamilialInsomniaExt: minimal -> lifestyle', () => {
  const r = Engine.FatalFamilialInsomniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FatalFamilialInsomniaExt: AKI -> dose adjustment', () => {
  const r = Engine.FatalFamilialInsomniaExt({ FatalFamilialInsomniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
