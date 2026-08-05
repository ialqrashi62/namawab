// pcc_neuro_ext164_engine tests v3.316.51 (Phase 2 Batch 18 clinical-grade)
const Engine = require('./pcc_neuro_ext164_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) {
  try { fn(); console.log('  PASS ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; }
}
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext164 engine tests v3.316.51:');
it('HeadacheMigraineExt: severe -> urgent specialist', () => {
  const r = Engine.HeadacheMigraineExt({ HeadacheMigraineExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HeadacheMigraineExt: minimal -> lifestyle', () => {
  const r = Engine.HeadacheMigraineExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HeadacheMigraineExt: AKI -> dose adjustment', () => {
  const r = Engine.HeadacheMigraineExt({ HeadacheMigraineExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TensionHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.TensionHeadacheExt({ TensionHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TensionHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.TensionHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TensionHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.TensionHeadacheExt({ TensionHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ClusterHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.ClusterHeadacheExt({ ClusterHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ClusterHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.ClusterHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ClusterHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.ClusterHeadacheExt({ ClusterHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('MedicationOveruseExt: severe -> urgent specialist', () => {
  const r = Engine.MedicationOveruseExt({ MedicationOveruseExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('MedicationOveruseExt: minimal -> lifestyle', () => {
  const r = Engine.MedicationOveruseExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('MedicationOveruseExt: AKI -> dose adjustment', () => {
  const r = Engine.MedicationOveruseExt({ MedicationOveruseExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('TrigeminalAutonomicExt: severe -> urgent specialist', () => {
  const r = Engine.TrigeminalAutonomicExt({ TrigeminalAutonomicExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('TrigeminalAutonomicExt: minimal -> lifestyle', () => {
  const r = Engine.TrigeminalAutonomicExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('TrigeminalAutonomicExt: AKI -> dose adjustment', () => {
  const r = Engine.TrigeminalAutonomicExt({ TrigeminalAutonomicExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('ThunderclapHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.ThunderclapHeadacheExt({ ThunderclapHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('ThunderclapHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.ThunderclapHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('ThunderclapHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.ThunderclapHeadacheExt({ ThunderclapHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('SexualHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.SexualHeadacheExt({ SexualHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('SexualHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.SexualHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('SexualHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.SexualHeadacheExt({ SexualHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('CoughHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.CoughHeadacheExt({ CoughHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('CoughHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.CoughHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('CoughHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.CoughHeadacheExt({ CoughHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('HypnicHeadacheExt: severe -> urgent specialist', () => {
  const r = Engine.HypnicHeadacheExt({ HypnicHeadacheExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('HypnicHeadacheExt: minimal -> lifestyle', () => {
  const r = Engine.HypnicHeadacheExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('HypnicHeadacheExt: AKI -> dose adjustment', () => {
  const r = Engine.HypnicHeadacheExt({ HypnicHeadacheExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
it('IdiopathicIntracranialExt: severe -> urgent specialist', () => {
  const r = Engine.IdiopathicIntracranialExt({ IdiopathicIntracranialExt: 5, severity: 3 });
  assert(r.severityClass === 'severe');
  assert(r.recommendation.includes('urgent'));
});

it('IdiopathicIntracranialExt: minimal -> lifestyle', () => {
  const r = Engine.IdiopathicIntracranialExt({ });
  assert(r.severityClass === 'minimal');
  assert(r.followUp.includes('6-12-months'));
});

it('IdiopathicIntracranialExt: AKI -> dose adjustment', () => {
  const r = Engine.IdiopathicIntracranialExt({ IdiopathicIntracranialExt: 2, egfr: 25 });
  assert(r.renalAdjusted.includes('severe-renal'));
});
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
