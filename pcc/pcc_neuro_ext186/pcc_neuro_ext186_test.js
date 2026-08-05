// pcc_neuro_ext186_engine tests v3.316.52 (Phase 2 Batch 19 clinical-grade)
const Engine = require('./pcc_neuro_ext186_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext186 engine tests v3.316.52:');
it('CSFdisorderExt: severe -> urgent specialist', () => {
  const r = Engine.CSFdisorderExt({ CSFdisorderExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CSFdisorderExt: minimal -> lifestyle', () => {
  const r = Engine.CSFdisorderExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CSFdisorderExt: AKI -> dose adjustment', () => {
  const r = Engine.CSFdisorderExt({ CSFdisorderExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CSFleakSpontaneousExt: severe -> urgent specialist', () => {
  const r = Engine.CSFleakSpontaneousExt({ CSFleakSpontaneousExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CSFleakSpontaneousExt: minimal -> lifestyle', () => {
  const r = Engine.CSFleakSpontaneousExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CSFleakSpontaneousExt: AKI -> dose adjustment', () => {
  const r = Engine.CSFleakSpontaneousExt({ CSFleakSpontaneousExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CSFleakSpinalExt: severe -> urgent specialist', () => {
  const r = Engine.CSFleakSpinalExt({ CSFleakSpinalExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CSFleakSpinalExt: minimal -> lifestyle', () => {
  const r = Engine.CSFleakSpinalExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CSFleakSpinalExt: AKI -> dose adjustment', () => {
  const r = Engine.CSFleakSpinalExt({ CSFleakSpinalExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ChiariMalformationExt: severe -> urgent specialist', () => {
  const r = Engine.ChiariMalformationExt({ ChiariMalformationExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ChiariMalformationExt: minimal -> lifestyle', () => {
  const r = Engine.ChiariMalformationExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ChiariMalformationExt: AKI -> dose adjustment', () => {
  const r = Engine.ChiariMalformationExt({ ChiariMalformationExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SyringomyeliaExt: severe -> urgent specialist', () => {
  const r = Engine.SyringomyeliaExt({ SyringomyeliaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SyringomyeliaExt: minimal -> lifestyle', () => {
  const r = Engine.SyringomyeliaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SyringomyeliaExt: AKI -> dose adjustment', () => {
  const r = Engine.SyringomyeliaExt({ SyringomyeliaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TetheredCordExt: severe -> urgent specialist', () => {
  const r = Engine.TetheredCordExt({ TetheredCordExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TetheredCordExt: minimal -> lifestyle', () => {
  const r = Engine.TetheredCordExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TetheredCordExt: AKI -> dose adjustment', () => {
  const r = Engine.TetheredCordExt({ TetheredCordExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ChiariDecompressionExt: severe -> urgent specialist', () => {
  const r = Engine.ChiariDecompressionExt({ ChiariDecompressionExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ChiariDecompressionExt: minimal -> lifestyle', () => {
  const r = Engine.ChiariDecompressionExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ChiariDecompressionExt: AKI -> dose adjustment', () => {
  const r = Engine.ChiariDecompressionExt({ ChiariDecompressionExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SpinaBifidaOccultaExt: severe -> urgent specialist', () => {
  const r = Engine.SpinaBifidaOccultaExt({ SpinaBifidaOccultaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SpinaBifidaOccultaExt: minimal -> lifestyle', () => {
  const r = Engine.SpinaBifidaOccultaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SpinaBifidaOccultaExt: AKI -> dose adjustment', () => {
  const r = Engine.SpinaBifidaOccultaExt({ SpinaBifidaOccultaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HydrocephalusExt: severe -> urgent specialist', () => {
  const r = Engine.HydrocephalusExt({ HydrocephalusExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HydrocephalusExt: minimal -> lifestyle', () => {
  const r = Engine.HydrocephalusExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HydrocephalusExt: AKI -> dose adjustment', () => {
  const r = Engine.HydrocephalusExt({ HydrocephalusExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PseudotumorExt: severe -> urgent specialist', () => {
  const r = Engine.PseudotumorExt({ PseudotumorExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PseudotumorExt: minimal -> lifestyle', () => {
  const r = Engine.PseudotumorExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PseudotumorExt: AKI -> dose adjustment', () => {
  const r = Engine.PseudotumorExt({ PseudotumorExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
