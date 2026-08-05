// pcc_neuro_ext144_engine tests v3.316.49 (Phase 2 Batch 16 clinical-grade)
const Engine = require('./pcc_neuro_ext144_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext144 engine tests v3.316.49:');
it('SexualDysfunctionExt: severe -> urgent specialist', () => {
  const r = Engine.SexualDysfunctionExt({ SexualDysfunctionExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SexualDysfunctionExt: minimal -> lifestyle', () => {
  const r = Engine.SexualDysfunctionExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SexualDysfunctionExt: AKI -> dose adjustment', () => {
  const r = Engine.SexualDysfunctionExt({ SexualDysfunctionExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('AutonomicDysreflexiaSexExt: severe -> urgent specialist', () => {
  const r = Engine.AutonomicDysreflexiaSexExt({ AutonomicDysreflexiaSexExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('AutonomicDysreflexiaSexExt: minimal -> lifestyle', () => {
  const r = Engine.AutonomicDysreflexiaSexExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('AutonomicDysreflexiaSexExt: AKI -> dose adjustment', () => {
  const r = Engine.AutonomicDysreflexiaSexExt({ AutonomicDysreflexiaSexExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MSexualExt: severe -> urgent specialist', () => {
  const r = Engine.MSexualExt({ MSexualExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MSexualExt: minimal -> lifestyle', () => {
  const r = Engine.MSexualExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MSexualExt: AKI -> dose adjustment', () => {
  const r = Engine.MSexualExt({ MSexualExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('FSexualExt: severe -> urgent specialist', () => {
  const r = Engine.FSexualExt({ FSexualExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('FSexualExt: minimal -> lifestyle', () => {
  const r = Engine.FSexualExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('FSexualExt: AKI -> dose adjustment', () => {
  const r = Engine.FSexualExt({ FSexualExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PostPartumSexualExt: severe -> urgent specialist', () => {
  const r = Engine.PostPartumSexualExt({ PostPartumSexualExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PostPartumSexualExt: minimal -> lifestyle', () => {
  const r = Engine.PostPartumSexualExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PostPartumSexualExt: AKI -> dose adjustment', () => {
  const r = Engine.PostPartumSexualExt({ PostPartumSexualExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CancerSexualExt: severe -> urgent specialist', () => {
  const r = Engine.CancerSexualExt({ CancerSexualExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CancerSexualExt: minimal -> lifestyle', () => {
  const r = Engine.CancerSexualExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CancerSexualExt: AKI -> dose adjustment', () => {
  const r = Engine.CancerSexualExt({ CancerSexualExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MedicationInducedExt: severe -> urgent specialist', () => {
  const r = Engine.MedicationInducedExt({ MedicationInducedExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MedicationInducedExt: minimal -> lifestyle', () => {
  const r = Engine.MedicationInducedExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MedicationInducedExt: AKI -> dose adjustment', () => {
  const r = Engine.MedicationInducedExt({ MedicationInducedExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('GenderDysphoriaExt: severe -> urgent specialist', () => {
  const r = Engine.GenderDysphoriaExt({ GenderDysphoriaExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('GenderDysphoriaExt: minimal -> lifestyle', () => {
  const r = Engine.GenderDysphoriaExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('GenderDysphoriaExt: AKI -> dose adjustment', () => {
  const r = Engine.GenderDysphoriaExt({ GenderDysphoriaExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HypogonadismExt: severe -> urgent specialist', () => {
  const r = Engine.HypogonadismExt({ HypogonadismExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HypogonadismExt: minimal -> lifestyle', () => {
  const r = Engine.HypogonadismExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HypogonadismExt: AKI -> dose adjustment', () => {
  const r = Engine.HypogonadismExt({ HypogonadismExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('PrematureEjacExt: severe -> urgent specialist', () => {
  const r = Engine.PrematureEjacExt({ PrematureEjacExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('PrematureEjacExt: minimal -> lifestyle', () => {
  const r = Engine.PrematureEjacExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('PrematureEjacExt: AKI -> dose adjustment', () => {
  const r = Engine.PrematureEjacExt({ PrematureEjacExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
