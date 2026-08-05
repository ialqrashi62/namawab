// pcc_neuro_ext161_engine tests v3.316.50 (Phase 2 Batch 17 clinical-grade)
const Engine = require('./pcc_neuro_ext161_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext161 engine tests v3.316.50:');
it('MovementDisorderTremorExt: severe -> urgent specialist', () => {
  const r = Engine.MovementDisorderTremorExt({ MovementDisorderTremorExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MovementDisorderTremorExt: minimal -> lifestyle', () => {
  const r = Engine.MovementDisorderTremorExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MovementDisorderTremorExt: AKI -> dose adjustment', () => {
  const r = Engine.MovementDisorderTremorExt({ MovementDisorderTremorExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('DystoniaExt: severe -> urgent specialist', () => {
  const r = Engine.DystoniaExt({ DystoniaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('DystoniaExt: minimal -> lifestyle', () => {
  const r = Engine.DystoniaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('DystoniaExt: AKI -> dose adjustment', () => {
  const r = Engine.DystoniaExt({ DystoniaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ChoreaExt: severe -> urgent specialist', () => {
  const r = Engine.ChoreaExt({ ChoreaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ChoreaExt: minimal -> lifestyle', () => {
  const r = Engine.ChoreaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ChoreaExt: AKI -> dose adjustment', () => {
  const r = Engine.ChoreaExt({ ChoreaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TicDisorderExt: severe -> urgent specialist', () => {
  const r = Engine.TicDisorderExt({ TicDisorderExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TicDisorderExt: minimal -> lifestyle', () => {
  const r = Engine.TicDisorderExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TicDisorderExt: AKI -> dose adjustment', () => {
  const r = Engine.TicDisorderExt({ TicDisorderExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MyoclonusExt: severe -> urgent specialist', () => {
  const r = Engine.MyoclonusExt({ MyoclonusExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MyoclonusExt: minimal -> lifestyle', () => {
  const r = Engine.MyoclonusExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MyoclonusExt: AKI -> dose adjustment', () => {
  const r = Engine.MyoclonusExt({ MyoclonusExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AtaxiaCerebellarExt: severe -> urgent specialist', () => {
  const r = Engine.AtaxiaCerebellarExt({ AtaxiaCerebellarExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AtaxiaCerebellarExt: minimal -> lifestyle', () => {
  const r = Engine.AtaxiaCerebellarExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AtaxiaCerebellarExt: AKI -> dose adjustment', () => {
  const r = Engine.AtaxiaCerebellarExt({ AtaxiaCerebellarExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SensoryAtaxiaExt: severe -> urgent specialist', () => {
  const r = Engine.SensoryAtaxiaExt({ SensoryAtaxiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SensoryAtaxiaExt: minimal -> lifestyle', () => {
  const r = Engine.SensoryAtaxiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SensoryAtaxiaExt: AKI -> dose adjustment', () => {
  const r = Engine.SensoryAtaxiaExt({ SensoryAtaxiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('VestibularAtaxiaExt: severe -> urgent specialist', () => {
  const r = Engine.VestibularAtaxiaExt({ VestibularAtaxiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('VestibularAtaxiaExt: minimal -> lifestyle', () => {
  const r = Engine.VestibularAtaxiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('VestibularAtaxiaExt: AKI -> dose adjustment', () => {
  const r = Engine.VestibularAtaxiaExt({ VestibularAtaxiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ParkinsonianExt: severe -> urgent specialist', () => {
  const r = Engine.ParkinsonianExt({ ParkinsonianExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ParkinsonianExt: minimal -> lifestyle', () => {
  const r = Engine.ParkinsonianExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ParkinsonianExt: AKI -> dose adjustment', () => {
  const r = Engine.ParkinsonianExt({ ParkinsonianExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PSPext: severe -> urgent specialist', () => {
  const r = Engine.PSPext({ PSPext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PSPext: minimal -> lifestyle', () => {
  const r = Engine.PSPext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PSPext: AKI -> dose adjustment', () => {
  const r = Engine.PSPext({ PSPext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
