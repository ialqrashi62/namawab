// pcc_pediatric_neuro_ext152_engine tests v3.316.61 (Phase 2 Batch 28 clinical-grade)
const Engine = require('./pcc_pediatric_neuro_ext152_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro_ext152 engine tests v3.316.61:');
it('PediatricDementiaExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricDementiaExt({ PediatricDementiaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricDementiaExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricDementiaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricDementiaExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricDementiaExt({ PediatricDementiaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricNCLext: severe -> urgent specialist', () => {
  const r = Engine.PediatricNCLext({ PediatricNCLext: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricNCLext: minimal -> lifestyle', () => {
  const r = Engine.PediatricNCLext({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricNCLext: AKI -> dose adjustment', () => {
  const r = Engine.PediatricNCLext({ PediatricNCLext: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricTaySachsExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricTaySachsExt({ PediatricTaySachsExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricTaySachsExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricTaySachsExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricTaySachsExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricTaySachsExt({ PediatricTaySachsExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricNiemannPickExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricNiemannPickExt({ PediatricNiemannPickExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricNiemannPickExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricNiemannPickExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricNiemannPickExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricNiemannPickExt({ PediatricNiemannPickExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricGaucherExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricGaucherExt({ PediatricGaucherExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricGaucherExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricGaucherExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricGaucherExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricGaucherExt({ PediatricGaucherExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricPKUExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricPKUExt({ PediatricPKUExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricPKUExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricPKUExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricPKUExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricPKUExt({ PediatricPKUExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricWilsonExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricWilsonExt({ PediatricWilsonExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricWilsonExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricWilsonExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricWilsonExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricWilsonExt({ PediatricWilsonExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricMenkesExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricMenkesExt({ PediatricMenkesExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricMenkesExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricMenkesExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricMenkesExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricMenkesExt({ PediatricMenkesExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricHurlerExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricHurlerExt({ PediatricHurlerExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricHurlerExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricHurlerExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricHurlerExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricHurlerExt({ PediatricHurlerExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PediatricSanfilippoExt: severe -> urgent specialist', () => {
  const r = Engine.PediatricSanfilippoExt({ PediatricSanfilippoExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PediatricSanfilippoExt: minimal -> lifestyle', () => {
  const r = Engine.PediatricSanfilippoExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PediatricSanfilippoExt: AKI -> dose adjustment', () => {
  const r = Engine.PediatricSanfilippoExt({ PediatricSanfilippoExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
