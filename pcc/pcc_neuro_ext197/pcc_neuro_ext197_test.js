// pcc_neuro_ext197_engine tests v3.316.53 (Phase 2 Batch 20 clinical-grade)
const Engine = require('./pcc_neuro_ext197_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext197 engine tests v3.316.53:');
it('CerebellarAdultExt: severe -> urgent specialist', () => {
  const r = Engine.CerebellarAdultExt({ CerebellarAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CerebellarAdultExt: minimal -> lifestyle', () => {
  const r = Engine.CerebellarAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CerebellarAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.CerebellarAdultExt({ CerebellarAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpinocerebellarAdultExt: severe -> urgent specialist', () => {
  const r = Engine.SpinocerebellarAdultExt({ SpinocerebellarAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpinocerebellarAdultExt: minimal -> lifestyle', () => {
  const r = Engine.SpinocerebellarAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpinocerebellarAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.SpinocerebellarAdultExt({ SpinocerebellarAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FriedreichAdultExt: severe -> urgent specialist', () => {
  const r = Engine.FriedreichAdultExt({ FriedreichAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FriedreichAdultExt: minimal -> lifestyle', () => {
  const r = Engine.FriedreichAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FriedreichAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.FriedreichAdultExt({ FriedreichAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AtaxiaTelangiectasiaAdultExt: severe -> urgent specialist', () => {
  const r = Engine.AtaxiaTelangiectasiaAdultExt({ AtaxiaTelangiectasiaAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AtaxiaTelangiectasiaAdultExt: minimal -> lifestyle', () => {
  const r = Engine.AtaxiaTelangiectasiaAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AtaxiaTelangiectasiaAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.AtaxiaTelangiectasiaAdultExt({ AtaxiaTelangiectasiaAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MSAadultExt: severe -> urgent specialist', () => {
  const r = Engine.MSAadultExt({ MSAadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MSAadultExt: minimal -> lifestyle', () => {
  const r = Engine.MSAadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MSAadultExt: AKI -> dose adjustment', () => {
  const r = Engine.MSAadultExt({ MSAadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PSPadultExt: severe -> urgent specialist', () => {
  const r = Engine.PSPadultExt({ PSPadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PSPadultExt: minimal -> lifestyle', () => {
  const r = Engine.PSPadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PSPadultExt: AKI -> dose adjustment', () => {
  const r = Engine.PSPadultExt({ PSPadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CBGDadultExt: severe -> urgent specialist', () => {
  const r = Engine.CBGDadultExt({ CBGDadultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CBGDadultExt: minimal -> lifestyle', () => {
  const r = Engine.CBGDadultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CBGDadultExt: AKI -> dose adjustment', () => {
  const r = Engine.CBGDadultExt({ CBGDadultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HuntingtonAdultExt: severe -> urgent specialist', () => {
  const r = Engine.HuntingtonAdultExt({ HuntingtonAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HuntingtonAdultExt: minimal -> lifestyle', () => {
  const r = Engine.HuntingtonAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HuntingtonAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.HuntingtonAdultExt({ HuntingtonAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ChoreaSydenhamAdultExt: severe -> urgent specialist', () => {
  const r = Engine.ChoreaSydenhamAdultExt({ ChoreaSydenhamAdultExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ChoreaSydenhamAdultExt: minimal -> lifestyle', () => {
  const r = Engine.ChoreaSydenhamAdultExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ChoreaSydenhamAdultExt: AKI -> dose adjustment', () => {
  const r = Engine.ChoreaSydenhamAdultExt({ ChoreaSydenhamAdultExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('WilsonAdultExt2: severe -> urgent specialist', () => {
  const r = Engine.WilsonAdultExt2({ WilsonAdultExt2: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('WilsonAdultExt2: minimal -> lifestyle', () => {
  const r = Engine.WilsonAdultExt2({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('WilsonAdultExt2: AKI -> dose adjustment', () => {
  const r = Engine.WilsonAdultExt2({ WilsonAdultExt2: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
